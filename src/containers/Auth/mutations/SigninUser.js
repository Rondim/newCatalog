import gql from 'graphql-tag';

export default gql`
  mutation ($auth: AUTH_PROVIDER_EMAIL) {
    signinUser(email: $auth) {
      token
      __typename
    }
  }
`;
