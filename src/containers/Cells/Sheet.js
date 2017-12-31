import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, AutoSizer } from 'react-virtualized';

class Sheet extends Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    const { count, counter, cellRenderer, connectDropTarget, onKeyDown } = this.props;
    return (
      <div tabIndex="0" onKeyDown={onKeyDown} style={{ flex: '1', height: '100%' }}>
        <AutoSizer defaultHeight={600}>
          {({ height, width }) => (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={200}
              columnWidth={100}
              height={height}
              rowCount={300}
              rowHeight={100}
              width={width}
              counter={counter}
              count={count}
              overscanColumnCount={16}
              overscanRowCount={12}
              scrollingResetTimeInterval={10}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default Sheet;
