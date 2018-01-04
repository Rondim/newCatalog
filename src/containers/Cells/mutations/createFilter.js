import gql from 'graphql-tag';

export default gql`
    mutation ($propertyId: ID!, $name: String!, $order: Int!, $color: String!){
        createSidebarFilter(name: $name, propertyId: $propertyId, order: $order, color: $color){
            id
            name
            order
            property{
                id
            }
            dependentOn{
                id
            }
        }
    }
`;
