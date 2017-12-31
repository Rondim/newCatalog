import gql from 'graphql-tag';

export default gql`
    mutation ($id: ID!){
        deleteZone(id: $id){
            id
        }
    }
`;
