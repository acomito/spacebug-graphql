// TOP LEVEL IMPORTS
import React from 'react';
import { browserHistory, Link } from 'react-router';
import PropTypes from 'prop-types';

const DataRow = ({ label, value }) => {
  return (
    <div>
      <h3 style={{color: '#888'}}>{ label }: 
        <span style={{color: '#000', marginLeft: 4}}>{ value }</span>
      </h3>
    </div>
  );
}


DataRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

DataRow.defaultProps = {
  label: '',
  value: null
};


export default DataRow