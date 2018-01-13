import gql from 'graphql-tag';

export default gql`
  query ($userId: ID!){
    allSheetLists(filter: { users_some: { id: $userId } }){
      id
      name
      users{
        id
        email
      }
    }
    allUsers{
      id
      email
    }
  }
`;
