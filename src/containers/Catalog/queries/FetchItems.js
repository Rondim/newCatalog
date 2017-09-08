import gql from 'graphql-tag';

export default gql`
  query FetchItems($skippedItems: Int, $first: Int, $manufacturer: ID, $itemType: ID, $itemSubtype: ID){
    _allItemsMeta(
        filter: {
            manufacturer: { id: $manufacturer },
            itemType: {id: $itemType },
            itemSubtype: {id: $itemSubtype}
        }
    ) {
      count
    }
    allItems(
        first: $first,
        skip: $skippedItems,
        filter: {
            manufacturer: { id: $manufacturer },
            itemType: {id: $itemType },
            itemSubtype: {id: $itemSubtype}
        }
    ){
      id,
      img{
        id
        url
      }
    }
  }
`;
