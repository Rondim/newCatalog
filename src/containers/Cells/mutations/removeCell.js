import gql from 'graphql-tag';

export default gql`
  mutation ($id: ID!){
    deleteCell(id: $id){
      id
    }
  }
`;
