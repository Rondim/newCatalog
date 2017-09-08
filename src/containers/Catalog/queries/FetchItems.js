import gql from 'graphql-tag';

export default gql`
  query FetchItems($skippedItems: Int, $size: Int, $manufacturer: String){
    _allItemsMeta(filter:{ manufacturer: { name: $manufacturer } }) {
      count
    }
    allItems(first: $size, skip: $skippedItems, filter: { manufacturer: { name: $manufacturer }} ){
      id,
      img{
        id
        url
      }
    }
  }
`;
