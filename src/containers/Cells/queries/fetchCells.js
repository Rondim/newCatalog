import gql from 'graphql-tag';

export default gql`
  query ($sheet: ID!){
    allCells(filter: { sheet: { id: $sheet } }){
      id
      i
      j
      availability{
        id
        department: sidebarFilters(filter: {property: {name: "Магазин"}}){
          id
          name
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
    allZones(filter: { sheetList: { id: $sheet } }){
      id,
      i0,
      j0,
      i1,
      j1,
      filter
    }
    _allCellsMeta(filter: { sheet: { id: $sheet } }){
      count
    }
  }
`;
