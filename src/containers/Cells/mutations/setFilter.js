import gql from 'graphql-tag';

export const setFilterToAvail = gql`
    mutation ($id: ID!, $filterId: ID!){
        addToAvailabilityOnSidebarFilter(availabilitiesAvailabilityId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;

export const setFilterToInstance = gql`
    mutation ($id: ID!, $filterId: ID!){
        addToSidebarFilterOnInstance(instancesInstanceId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;

export const setFilterToItem = gql`
    mutation ($id: ID!, $filterId: ID!){
        addToSidebarFiltersOnItem(itemsItemId: $id,
            sidebarFiltersSidebarFilterId: $filterId){
            sidebarFiltersSidebarFilter{
                id
            }
        }
    }
`;
