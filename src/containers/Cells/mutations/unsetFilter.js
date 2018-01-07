import gql from 'graphql-tag';

export const unsetFilterToAvail = gql`
    mutation ($id: ID!, $filterId: ID!){
        removeFromAvailabilityOnSidebarFilter(availabilitiesAvailabilityId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;

export const unsetFilterToInstance = gql`
    mutation ($id: ID!, $filterId: ID!){
        removeFromSidebarFilterOnInstance(instancesInstanceId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;

export const unsetFilterToItem = gql`
    mutation ($id: ID!, $filterId: ID!){
        removeFromSidebarFiltersOnItem(itemsItemId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;
