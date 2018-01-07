import gql from 'graphql-tag';

export default gql`
  subscription {
    Cell{
      mutation
      node{
        id
        i
        j
        sheet{
          id
        }
        availability{
          id
          department: sidebarFilters(filter: {property: {name: "Магазин"}}){
            id
            name
          }
          tags: sidebarFilters(filter: {property: {name: "Tags"}}){
            id
            name
            color
          }
          quantity
          instance{
            id
            size: sidebarFilters(filter: {property: {name: "Размер"}}){
              id
              name
            }
            item{
              img{
                id
                url
              }
              id
            }
          }
        }
      }
      previousValues{
        id
        i
        j
      }
      updatedFields
    }
  }
`;
