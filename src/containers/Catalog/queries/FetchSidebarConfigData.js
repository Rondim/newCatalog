import gql from 'graphql-tag';

export default gql`
  query FetchSidebarConfig{
    allSidebarItemses {
      id
      name
      order
      type
      multiselection
      childs{
        id
      }
      parents{
        id
      }
      sidebarFilterses{
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
  }
`;
