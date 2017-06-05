import gql from 'graphql-tag';



// USER QUERIES
// ====================================
export const GET_USERS_ADMIN = gql`
  query getUsersAdmin ($params: UserSearchParams) {
    usersAdmin (params: $params) {
      emails { address, verified },
      roles,
      profile {
        firstName
        lastName
        groupId
        workPhone
        cellPhone
      }
      _id
    }
  }
`;

export const ADMIN_GET_USER_BY_ID = gql`
  query GetUserByIdAdmin($_id: ID!)  {
    getUserByIdAdmin (_id: $_id) {
      emails { address, verified },
      roles,
      profile {
        firstName
        lastName
        groupId
        workPhone
        cellPhone
      }
      _id
    }
  }
`;

export const GET_USERS_FORM = gql`
  query getUsers {
    users {
       _id
      profile {
        firstName
        lastName
      }
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    users {
      emails { address, verified },
      roles,
      profile {
        firstName
        lastName
      }
      _id
    }
  }
`;

export const GET_USER = gql`
  query getUserById($_id: ID!) {
    getUserById(_id: $_id) {
      _id
      emails { address, verified }
      roles
      profile { firstName, lastName }
    }
  }
`;

export const GET_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      _id
      title
      content
      image
      category
    }
  }
`;


export const GET_USER_DATA = gql`
  query getCurrentUser {
    user {
      emails { address, verified },
      roles,
      profile {
        firstName
        lastName
        cellPhone
        image
        workPhone
      }
      _id
    }
  }
`;