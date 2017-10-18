/**
 * Created by xax on 23.03.2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { graphql } from 'react-apollo';

import Cells from '../../components/Cells';
import query from './queries/fetchCells';

class DragAndDropCells extends Component {
  static propTypes = {
    cells: PropTypes.object,
    removeCell: PropTypes.func,
    copyCell: PropTypes.func,
    setActiveCell: PropTypes.func,
    resetActiveCells: PropTypes.func
  };
  state = {
    i0: this.props.cells.i0,
    j0: this.props.cells.j0
  };

  handleKeyDown = (ev) => {
    const { cells, removeCell } = this.props;
    if (ev.keyCode === 39) {
      this.setState((prevState) => {
        return { j0: prevState.j0 + 1 };
      });
    } else if (ev.keyCode === 37) {
      this.setState((prevState) => {
        if (prevState.j0 > 0) {
          return { j0: prevState.j0 - 1 };
        }
      });
    } else if (ev.keyCode === 38) {
      this.setState((prevState) => {
        if (prevState.i0 > 0) {
          return { i0: prevState.i0 - 1 };
        }
      });
    } else if (ev.keyCode === 40) {
      this.setState((prevState) => {
        return { i0: prevState.i0 + 1 };
      });
    } else if (ev.keyCode === 8 || ev.keyCode === 46) {
      cells.active.forEach(coord => {
        const i = coord.i;
        const j = coord.j;
        const id = cells.list[i][j].id;
        removeCell(id, i, j);
      });
    }
  };

  render() {
    const { resetActiveCells, setActiveCell, removeCell, copyCell, cells: { di, dj, list, active } } = this.props;
    return (
      <div className="container" tabIndex="0" onKeyDown={this.handleKeyDown}>
        <Grid>
          <Row className="show-grid">
            <Col lg={12} md={12} xs={12}>
              <Cells
                i0={this.state.i0}
                j0={this.state.j0}
                di={di}
                dj={dj}
                cells={list}
                active={active}
                handleCopy={copyCell}
                handleRemove={removeCell}
                handleSelect={setActiveCell}
                handleResetSelected={resetActiveCells}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}


export default graphql(query)(DragAndDropCells);
/*
function mapStateToProps(state) {
  return { cells: state.cells };
}

export default connect(mapStateToProps, actions)(DragAndDropCells);*/
