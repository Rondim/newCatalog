import gql from 'graphql-tag';

export default gql`
  mutation ($i0: Int!, $i1: Int!, $j0: Int!, $j1: Int!, $sheet: ID!, $filter: Json){
    createZone(i0: $i0, i1: $i1, j0: $j0, j1: $j1, sheetListId: $sheet, filter: $filter ){
      id
    }
  }
`;
