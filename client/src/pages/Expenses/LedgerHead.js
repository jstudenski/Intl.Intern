/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableCell, TableRow, } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const LedgerHead = (props) => {
  const columnData = [
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
    { id: 'useamount', numeric: true, disablePadding: false, label: props.home },
    { id: 'localamount', numeric: true, disablePadding: false, label: props.intern },
  ].filter(element => element.id !== 'category' || props.showCategories);
  return (
    <TableHead>
      <TableRow>
        {columnData.map(column => (
          <CustomTableCell
            key={column.id}
            numeric={column.numeric}
            padding={column.disablePadding ? 'none' : 'default'}
          >
            {column.label}
          </CustomTableCell>
        ), this)}
      </TableRow>
    </TableHead>
  );
};

LedgerHead.propTypes = {
  home: PropTypes.string.isRequired,
  intern: PropTypes.string.isRequired,
  showCategories: PropTypes.bool.isRequired,
};

export default LedgerHead;
