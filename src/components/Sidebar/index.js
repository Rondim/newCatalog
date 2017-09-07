import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

import SidebarFilter from '../SidebarFilter';

const Sidebar = (props) => {
  const { sidebarItems, handleFilterClick } = props;
  if (sidebarItems.length === 0) return null;
  return (
    <div>
      {sidebarItems.map(item => {
        return <SidebarFilter {...item}
          key={item.filterGroupId}
          handleFilterClick={handleFilterClick}/>;
      })}
    </div>
  );
}

Sidebar.propTypes = {
  sidebarItems: PropTypes.array.isRequired,
  handleFilterClick: PropTypes.func.isRequired,
  // from styles
  classes: PropTypes.object
};

export default withStyles(styles)(Sidebar);
