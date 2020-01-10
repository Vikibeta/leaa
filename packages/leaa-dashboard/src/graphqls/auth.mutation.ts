import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      id
      name
      email
      avatar {
        url
        urlAt2x
      }
      authToken
      authExpiresIn
      flatPermissions
    }
  }
`;

export const LOGIN_BY_TICKET = gql`
  mutation($ticket: String!) {
    loginByTicket(ticket: $ticket) {
      name
      email
      avatar {
        url
        urlAt2x
      }
      authToken
      authExpiresIn
      flatPermissions
    }
  }
`;