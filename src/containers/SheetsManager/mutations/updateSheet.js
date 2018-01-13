import gql from 'graphql-tag';

export default gql`
  mutation ($id: ID!, $name: String!){
    updateSheetList(id: $id, name: $name){
      id
      name
      users{
        id
        email
      }
    }
  }
`;
