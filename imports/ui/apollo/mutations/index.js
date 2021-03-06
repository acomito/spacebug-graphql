import gql from 'graphql-tag';


export const CREATE_DOCUMENT = gql`
	mutation CreateDocument ( $params: DocumentParams ){
		createDocument (params: $params){
			_id
		}
	}
`;

export const SAVE_USER_ACCOUNT = gql`
	mutation SaveUserAccount ( $_id: ID, $params: UserParams ){
		saveUserAccount (_id: $_id, params: $params){
			_id
		}
	}
`;



export const ACCEPT_INVITE = gql`
	mutation AcceptInvite( 
		$params: InviteParams, 
		$password: String, 
		$browserToken: String
	) {
	  acceptInvite( 
	  	params: $params, 
	  	password: $password,  
	  	browserToken: $browserToken
	  ) {
	    _id
	  }
	}
`;

export const SEND_INVITE_EMAIL = gql`
	mutation SendInviteEmail( $params: InviteParams) {
	  sendInviteEmail( params: $params ) {
	    _id
	  }
	}
`;


export const ADMIN_DELETE_USER = gql`
	mutation AdminDeleteUser( $_id: ID!) {
	  adminDeleteUser( _id: $_id ) {
	    _id
	  }
	}
`;


export const ADMIN_CREATE_USER = gql`
	mutation AdminCreateUser($params: UserParams){
	  adminCreateUser(params:$params){
	    _id
	  }
	}
`;

export const SAVE_USER_IMAGE = gql`
	mutation saveUserImage($image: String!){
	  saveUserImage(image:$image){
	    _id
	  }
	}
`;



export const ADMIN_SAVE_USERPROFILE = gql`
	mutation AdminSaveUserProfile (
		$_id: ID!
		$email: String
		$firstName: String
		$lastName: String
		$roles: [String]
		){
		adminSaveUserProfile (
			_id: $_id
			email: $email
			firstName: $firstName
			lastName: $lastName
			roles:  $roles
		){
			_id
		}
	}
`;