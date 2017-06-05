import { Random } from 'meteor/random';
import { SchemaMutations, SchemaTypes, userId } from 'meteor-apollo-accounts';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { createError, isInstance } from 'apollo-errors';
import { isAuthenticatedResolver, isAdminResolver, group, building, tickets } from '../base-resolvers';
import { addInvitation } from '../api-helpers';


export const UserSchema = [`
type Email {
  address: String
  verified: Boolean
}
type Profile {
  firstName: String
  lastName: String
  cellPhone: String
  workPhone: String
  # users avatar
  image: String
  # ever user is assigned to a group, this to some degree acts as permission for the database. groupId and roles are the main ways to do permissions
  groupId: ID
  # a basic, inconsequential string describing the type of user. 
  # Not used of roles, purely informational data for UI. see roles field on User for where permissions are controlled
  userModelType: String
  # unitId could potentially be stored here (although probably will be deprecated in favor of storing it on the unit)
  unitId: ID
  # stores a unique id for Expo to use for push notifications, is only needed for an expo react-native app
  expoPushId: String
}

type User {
  emails: [Email]
  _id: String
  profile: Profile
  # an array of strings of "roles". e.g. admin, pm, rm, maintenance. A user could have several roles, but at the time of writing this, users tend to have one role.
  roles: [String]
}

input UserParams {
  email: String!
  firstName: String
  lastName: String
  cellPhone: String
  workPhone: String 
  image: String
  roles: [String]
  groupId: ID
  unitId: ID
  userModelType: String
  expoPushId: String
  searchText: String
}
input UserSearchParams {
  searchText: String
}
type Query {
    # returns the current user. Typically used at the top component (such as a layout component)
    user: User,
    # returns an array of users. Typically used to fill a dropdown where options are other users. Or in a table of users, such as in the admin area
    users: [User],
    # given an _id, will return a specific user
    getUserById(_id: ID!): User,
    # may be deprecated if can devise a secure pattern for an admin vs normie querying
    usersAdmin (params: UserSearchParams): [User],
    getUserByIdAdmin(_id: ID!): User,
    usersCount( params: UserParams ): Count,
}
type Mutation {
    saveUserImage(image: String!): User
    saveUserExpoPushId(expoPushId: String!): User
    # creates a user
    adminCreateUser ( params: UserParams ): User
    # saves user profile
    saveUserAccount (_id: ID, params: UserParams ): User
    # admin can delete a user
    adminDeleteUser(_id: ID!): User
  }
`];
