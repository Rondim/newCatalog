import gql from 'graphql-tag';

export default gql`
  mutation ($id: ID!){
    deleteSheetList(id: $id){
      id
    }
  }
`;
