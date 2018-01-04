import gql from 'graphql-tag';

export default gql`
    mutation ($aId: ID!, $filterId: ID!){
        removeFromAvailabilityOnSidebarFilter(availabilitiesAvailabilityId: $aId,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;
