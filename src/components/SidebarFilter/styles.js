const styles = {
  root: {
    position: 'relative'
  },
  button: {
    width: '100%'
  },
  buttonNotSelected: {
    extend: 'button'
  },
  buttonSelected: {
    'extend': 'button',
    'backgroundColor': 'green',
    '&:hover': {
      backgroundColor: 'green'
    }
  },
  buttonSelectedNotByAll: {
    extend: 'button',
    backgroundColor: 'orange'
  },
  mainButton: {
    width: '100%',
    left: 0,
    right: 0
  },
  mainButtonSelectedNotByAll: {
    width: '100%',
    left: 0,
    right: 0,
    color: 'orange'
  },
  mainButtonSelected: {
    width: '100%',
    left: 0,
    right: 0,
    color: 'green'
  },
  mainButtonDisabled: {
    extend: 'mainButton',
    opacity: 0.5
  },
  popover: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transform: 'translate(-100%, 0)'
  }
};

export default styles;
