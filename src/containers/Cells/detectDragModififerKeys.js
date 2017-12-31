import pick from 'lodash/pick';
import bindAll from 'lodash/bindAll';
import React from 'react';
import ReactDOM from 'react-dom';

const MODIFIER_KEYS = ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'];

/*
 * Detects drag modifier keys on drag events that originated
 * from the wrapped component
 *
 * @param {boolean} options.listenForAllDragEvents
 *   if true it will detect modifier keys for all drag events, and not
 *   just the ones originating from the wrapped component
 */
export default function detectDragModifierKeys(options = {}) {
  return function(Component) {
    return class DetectDragModifierKeys extends React.Component {
      constructor(props) {
        super(props);
        bindAll(this, 'onDrag', 'onDragStart', 'onDragEnd');

        this._isDragOrigin = false;

        this.state = {
          dragModifierKeys: MODIFIER_KEYS.reduce((mem, key) => {
            mem[key] = false;
            return mem;
          }, {})
        };
      }

      componentDidMount(event) {
        window.addEventListener('dragstart', this.onDragStart);
        window.addEventListener('dragend', this.onDragStart);
        // The 'drag' event doesn't detect modifier keys in FF for some reason.
        // Therefore we listen for dragover on the window instead, which roughly
        // gives the same result
        window.addEventListener('dragover', this.onDrag);
      }

      componentWillUnmount(event) {
        window.removeEventListener('dragstart', this.onDragStart);
        window.removeEventListener('dragend', this.onDragEnd);
        window.removeEventListener('dragover', this.onDrag);
      }

      onDragStart(event) {
        // Determine whether or not the the drag event
        // originated from inside the wrapped component
        this._isDragOrigin = ReactDOM.findDOMNode(this._wrapped).contains(event.target);
      }

      onDragEnd(event) {
        this._isDragOrigin = false;
      }

      onDrag(event) {
        if (this._isDragOrigin || options.listenForAllDragEvents) {
          const { dragModifierKeys } = this.state;
          const hasChanged = Object.keys(dragModifierKeys).some(key => {
            return dragModifierKeys[key] !== event[key];
          });

          if (hasChanged) {
            this.setState({ dragModifierKeys: pick(event, MODIFIER_KEYS) });
          }
        }
      }

      render() {
        return (
          <Component
            ref={c => this._wrapped = c}
            {...this.props}
            {...this.state}
          />
        );
      }
    };
  };
}
