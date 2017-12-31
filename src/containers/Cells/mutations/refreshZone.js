import gql from 'graphql-tag';

export default gql`
    mutation ($zoneId: ID!){
        zoneRefresh(zoneId: $zoneId )
    }
`;
