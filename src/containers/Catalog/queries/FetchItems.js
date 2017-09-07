import gql from 'graphql-tag';

export default gql`
  query FetchItems($skippedItems: Int, $size: Int){
    _allItemsMeta {
      count
    }
    allItems(first: $size, skip: $skippedItems ){
      id,
      img{
        id
        url
      }
    }
  }
`;
