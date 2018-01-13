import gql from 'graphql-tag';

export default gql`
  mutation ($userIds: [ID!], $name: String!){
    createSheetList(name: $name, usersIds: $userIds){
      id
      name
      users{
        id
        email
      }
    }
  }
`;
