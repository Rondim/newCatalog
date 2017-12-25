import React, { Component } from 'react';
import _ from 'lodash';
import { Grid } from 'react-virtualized';

import 'react-virtualized/styles.css';
import Cell from './Cell';

const list = [
  ['https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr'],
  [null, null, null, 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr'],
  ['https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', null, null, 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr'],
  ['https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', null, null, 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr'],
  ['https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr'],
  [null, null, 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr', 'https://files.graph.cool/cj5tpc7zsj16i012285uxa6j5/cj9p1x6zo00bv0106lccujbhr']
];

class Cells extends Component {
  static propTypes = {};
  static defaultProps = {};

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const url = _.get(list, `[${rowIndex}][${columnIndex}]`);
    return <Cell key={key} url={url} style={style} />;
  };

  render() {
    console.log(list.length);
    return (
      <Grid
        cellRenderer={this.cellRenderer}
        columnCount={list[0].length}
        columnWidth={100}
        height={700}
        rowCount={list.length}
        rowHeight={100}
        width={1200}
      />
    );
  }
}

export default Cells;
