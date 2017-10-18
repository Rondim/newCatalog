/**
 * Created by xax on 23.03.2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';

const free = { item: { url: '' }, id: null };
const leter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Cells extends Component {
  static propTypes = {
    cells: PropTypes.array,
    active: PropTypes.array,
    handleSelect: PropTypes.func,
    handleResetSelected: PropTypes.func,
    handleCopy: PropTypes.func,
    handleRemove: PropTypes.func,
    i0: PropTypes.number,
    di: PropTypes.number,
    j0: PropTypes.number,
    dj: PropTypes.number
  };
  state = {
    i: false,
    j: false,
    cells: this.props.cells
  };

  handlerSelect = (ev, i, j) => {
    const { handleSelect, handleResetSelected, active } = this.props;
    ev.preventDefault();
    if (!ev.ctrlKey && !ev.shiftKey) handleResetSelected(i, j);
    if (ev.shiftKey) {
      let iMin = false;
      let jMin = false;
      active.forEach(coord => {
        const ia = coord.i;
        const ja = coord.j;
        if (iMin === false && jMin === false) {
          iMin = ia;
          jMin = ja;
        }
        iMin = iMin > ia ? ia : iMin;
        jMin = jMin > ja ? ja : jMin;
      });
      handleResetSelected(i, j);
      const nMin = iMin < i ? iMin : i;
      const nMax = iMin < i ? i : iMin;
      const mMin = jMin < j ? jMin : j;
      const mMax = jMin < j ? j : jMin;
      for (let n = nMin; n <= nMax; n++) {
        for (let m = mMin; m <= mMax; m++) {
          handleSelect(n, m);
        }
      }
    } else {
      handleSelect(i, j);
    }
  };

  handlerDragStart = (i, j) => {
    this.setState({ i, j });
  };

  preventDefault = (ev) => {
    ev.preventDefault();
  };

  handlerDragStop = (ev, i, j) => {
    const { active } = this.props;
    ev.preventDefault();
    const copy = !!ev.altKey;
    if (active.length < 2) {
      this.setState((prevState) => {
        let cells = prevState.cells;
        cells = this.action(prevState.i, prevState.j, i, j, copy, cells);
        return { cells, i: false, j: false };
      });
    } else {
      let iMin = false;
      let jMin = false;
      active.forEach(coord => {
        const ia = coord.i;
        const ja = coord.j;
        if (iMin === false && jMin === false) {
          iMin = ia;
          jMin = ja;
        }
        iMin = iMin > ia ? ia : iMin;
        jMin = jMin > ja ? ja : jMin;
      });
      active.forEach(coord => {
        const n = coord.i;
        const m = coord.j;
        this.setState((prevState) => {
          let cells = prevState.cells;
          cells = this.action(n, m, i + n - iMin, j + m - jMin, copy, cells);
          return { cells, i: false, j: false };
        });
      });
    }
  };

  action = (iOld, jOld, i, j, copy, cells) => {
    const { handleCopy, handleRemove } = this.props;
    if (cells[iOld][jOld].id) {
      if (copy) {
        cells[i][j] = {
          item: cells[iOld][jOld].item,
          active: false,
          id: null
        };
        handleCopy(cells[iOld][jOld].item, i, j);
        return cells;
      } else {
        if (cells[i][j] && cells[i][j].item && cells[i][j].item.id && cells[i][j].id !== null) {
          handleCopy(cells[i][j].item, iOld, jOld);
        } else handleRemove(cells[iOld][jOld].id, iOld, jOld);
        handleCopy(cells[iOld][jOld].item, i, j);
        /* const tmp = cells[iOld][jOld];
         cells[iOld][jOld] = {
         item: cells[i][j].item,
         active: false
         };
         cells[i][j] = {
         item: tmp.item,
         active:false
         }; */
        return cells;
      }
    }
  };

  renderTbody() {
    const { i0, di } = this.props;
    let out = [<tr key="zero">{this.renderTr('letter')}</tr>];
    for (let i = i0; i < i0 + di; i++) {
      out.push(<tr key={i}>{this.renderTr(i)}</tr>);
    }
    return out;
  }

  renderTr(i) {
    const { j0, dj } = this.props;
    if (i === 'letter') {
      let out = [<td key="zero" />];
      for (let j = j0; j < j0 + dj; j++) {
        out.push(<td key={j}>{leter[j]}</td>);
      }
      return out;
    }
    let tr = this.state.cells[i] !== undefined ? this.state.cells[i] : [];
    let out = [<td key={i}>{i}</td>];
    for (let j = j0; j < j0 + dj; j++) {
      let cell = tr[j] ? tr[j] : free;
      cell.item = cell.item === undefined ? { url: '' } : cell.item;
      out.push(
        <td
          key={i + '-' + j}
          draggable={!!cell.id}
          onDragStart={() => this.handlerDragStart(i, j)}
          onDrop={(e) => this.handlerDragStop(e, i, j)}
          onDragOver={this.preventDefault}
          onClick={cell.id ? (e) => this.handlerSelect(e, i, j) : false}
          onContextMenu={cell.id ? (e) => this.handlerSelect(e, i, j) : false}
          className="cell"
        >

          <Cell url={cell.item.url} id={cell.id} active={cell.active} />
        </td>);
    }
    return out;
  }

  render() {
    return (
      <div className="cells_container">
        <table className="cells">
          <tbody>
          {this.renderTbody()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Cells;
