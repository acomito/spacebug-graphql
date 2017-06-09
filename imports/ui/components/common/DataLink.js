// TOP LEVEL IMPORTS
import React from 'react';
import { browserHistory, Link } from 'react-router';
import PropTypes from 'prop-types';

const DataLink = ({ item, linkType, linkLabel }) => {
  return (
    <div>
      <Link to={`/admin/${linkType}/${item._id}`} style={{marginTop: 15, fontSize: 15}}>
      	{ linkLabel || item.title || item._id  }
      </Link>
    </div>
  );
}


DataLink.propTypes = {
  item: PropTypes.object,
  linkType: PropTypes.string,
  linkLabel: PropTypes.string
};

DataLink.defaultProps = {
  item: {},
  linkType: 'users',
  linkLabel: ''
};

export default DataLink
