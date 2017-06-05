import { Random } from 'meteor/random';
import { SchemaMutations, SchemaTypes, userId } from 'meteor-apollo-accounts';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Invites } from '../Invite';
import { createError, isInstance } from 'apollo-errors';
import { isAuthenticatedResolver, isAdminResolver } from '../base-resolvers';
import { addInvitation } from '../api-helpers';



const buildUsersSearchQuery = async (root, args, context) => {
  
  return new Promise(
      (resolve, reject) => {
        let query = {};
        let andQueryArray = [];

        let options = { sort: { createdAt: -1}  } // at some point, when pagination is added, you'll want to add a limit here, e.g. limit: 10,

        // If an offset arguement is passed, add it as an option. 
        // offset is (one potential strategy) used for pagination/infinite loading if it ever gets added.
        // see: https://dev-blog.apollodata.com/pagination-and-infinite-scrolling-in-apollo-client-59ff064aac61
        // see: http://dev.apollodata.com/react/pagination.html
        if (args && args.params && args.params.offset) { options.skip = args.params.offset }
      // IF NO ARGS EXIST, JUST RETURN BASIC QUERY
      // ====================================
      // if no arguments were passed, just return all messages using the above query and options variables
      if (!args || !args.params) {
        let count = Meteor.users.find(query).count()
        let users = Meteor.users.find(query, options).fetch();
        users.count = count
        return resolve(users)
      }
      
      // declare a unitIds variable. users do not have a buildingId, so we have to query the units in a building
      // make an array of unitIds, then concat that with any other _ids coming from the client (which is 'args.params.unitIds' )


      // TEXT SEARCH QUERY
      // ====================================
      // If a search string was passed, then add search terms to the andQueryArray
      if (args && args.params && args.params.searchText) {
        let regex = new RegExp( args.params.searchText, 'i' );
        let orSearchQuery = { $or: [ 
          { 'profile.firstName': regex }, 
          { 'profile.lastName': regex }, 
        ]};
        andQueryArray.push(orSearchQuery)
      }
      if (andQueryArray && andQueryArray.length > 0) {
        query = { $and: andQueryArray }
      }
      
      let count = Meteor.users.find(query).count();
      resolve({ query, options, count });

      }
  )
};

const buildUser = (params) => {
  let userToInsert = {
      emails:[ {address: params.email.toLowerCase(), verified: false }],
      roles: params.roles || [],
      profile: {
        ...params,
        userModelType: params.userModelType || null
      }
    }
    return userToInsert
}

const adminCreateUser = isAdminResolver.createResolver(
  async (root, { params }, { user }) => {
    let userToInsert = buildUser(params) // build user object to insert
    let _id = Meteor.users.insert(userToInsert); // runs sync, returns _id of inserted doc
    addInvitation(_id, userToInsert.userModelType, user._id) // will add an Invite record to Invites collection
    return Meteor.users.findOne({ _id }); // return related user to client mutation
  }
);


const adminDeleteUser = isAdminResolver.createResolver(
  async (root, { _id }, context) => {
    let user = Meteor.users.findOne({_id});
    if (user) {
      Meteor.users.remove({_id});
      Invites.remove({userId: _id})
    }
    return user;
  }
);

const adminSaveUserProfile = isAdminResolver.createResolver(
  async (root, { params }, context) => {
    let dataToUpdate = {
        'emails.0.address': params.email,
        roles: params.roles,
      }
      Meteor.users.update({ _id: params._id }, { $set: dataToUpdate }, (err, res) => {
        if (err) { return err }
        return Meteor.users.findOne({ _id: params._id });
      });
  }
);


const users = isAuthenticatedResolver.createResolver(
  async (root, args, { user }) => {
    let query = {};
      if (!user.roles.includes('admin')) {
        query = { 'profile.groupId': user.profile.groupId }
      }
      return Meteor.users.find(query).fetch();
  }
)

const getUserById = isAuthenticatedResolver.createResolver(
  async (root, { _id }, { user }) => {
    let query = {};
    if (!user.roles.includes('admin')) {
      query = { 'profile.groupId': user.profile.groupId }
    }
    query._id = user.profile.groupId;
    return Meteor.users.findOne(query);
  }
)



const saveUserExpoPushId = async (root, { expoPushId }, { user }) => {
      check(expoPushId, String);
      check(user, Object);
      check(user._id, String);
      let dataToUpdate = { $set: {'profile.expoPushId': expoPushId} }
      let docToupdate = { _id: user._id };
      return Meteor.users.update(docToupdate, dataToUpdate);
};

export const UserResolvers = {
  Query: {
    user(root, args, context) {
      return context.user;
    },
    usersCount: async (root, args, context) => {
      //builds a query to grab users, returns the query, mongo query optios object, and the count of the query
      let { query, options, count } = await buildUsersSearchQuery(root, args, context)
      return count;
    },
    usersAdmin: async (root, args, context) => {
      //builds a query to grab users, returns the query, mongo query optios object, and the count of the query
      let { query, options, count } = await buildUsersSearchQuery(root, args, context); 
      return Meteor.users.find(query, options).fetch();
    },
    getUserByIdAdmin(root, { _id }, context) {
      return Meteor.users.findOne({ _id });
    },
    users,
    getUserById,
  },
  Mutation:{
    adminCreateUser,
    adminDeleteUser,
    saveUserAccount(root, { _id, params }, context) {
      let dataToUpdate = { 
        'emails.0.address': params.email,
        'profile.firstName': params.firstName,
        'profile.lastName': params.lastName,
        'profile.cellPhone': params.cellPhone,
        'profile.workPhone': params.workPhone,
      }
      if (context.user.roles.includes('admin')) {
        dataToUpdate = { ...dataToUpdate, roles: params.roles, 'profile.groupId': params.groupId }
      }
      Meteor.users.update({ _id }, { $set: dataToUpdate });
      return Meteor.users.findOne({ _id });
    },
    saveUserExpoPushId,
    saveUserImage(root, { image }, { user }) {
      let dataToUpdate = { 'profile.image': image };
      Meteor.users.update({ _id: user._id }, { $set: dataToUpdate });
      return Meteor.users.findOne({ _id: user._id });
    },
  },
  User: {
    _id: ({ _id }) => _id,
    emails: ({ emails }) => emails,
    roles: ({ roles }) => roles,
  },
};

