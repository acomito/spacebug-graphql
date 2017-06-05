import { Random } from 'meteor/random';
import { UserResolvers, UserSchema } from './User';
import { DocumentResolvers, DocumentSchema } from './Document';
import { InviteResolvers, InviteSchema } from './Invite';
import { merge } from 'lodash';


export const BaseSchemas = [`
type Geometry {
	    type: String!
	    coordinates: [Int]
	}
scalar Date
type Count { 
  count: Int
}
input LocationData {
	street1: String
	street2: String
	postal: String
	country: String
	city: String
	state: String
	suburb: String
}
input ImageObject {
	fileType: String
	name: String
	uid: String
	url: String
	_id: ID
	parentModelType: String
}
type Address {
	    fullAddress: String!
	    lat: String
	    lng: String
	    geometry: Geometry
	    placeId: String
	    street1: String
		street2: String
	    city: String
	    state: String
	    postal: String
	    suburb: String
	    country: String
	    maps_url: String
	}
`];


export const BaseResolvers = {
  	Date: {
	  __parseValue(value) {
	    return new Date(value); // value from the client
	  },
	  __serialize(value) {
	    return value.toISOString(); // value sent to the client
	  },
	  __parseLiteral(ast) {
	    return ast.value;
	  },
	},
};

export const typeDefs = [
	...BaseSchemas,
	...UserSchema, 
	...DocumentSchema
];


export const resolvers = merge(
	BaseResolvers,
	UserResolvers, 
	DocumentResolvers
);


