import gql from 'graphql-tag';

export default gql`
  mutation ($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }){
      token
    } 
  }
`;
