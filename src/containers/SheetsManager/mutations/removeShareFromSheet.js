import gql from 'graphql-tag';

export default gql`
  mutation ($id: ID!, $userId: ID!){
    removeFromCellsOnUser(cellsSheetListId: $id, usersUserId: $userId){
      cellsSheetList{
        id
        name
        users{
          id
          email
        }
      }
    }
  }
`;
