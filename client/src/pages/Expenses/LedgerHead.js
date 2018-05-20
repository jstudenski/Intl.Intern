/* eslint-disable object-curly-newline */

import React from 'react';
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
    { id: 'usdamount', numeric: true, disablePadding: false, label: props.home },
    { id: 'localamount', numeric: true, disablePadding: false, label: props.intern },
  ];
  return (
    <TableHead>
      <TableRow>
        {columnData.map(column => {
          return (
            <CustomTableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? 'none' : 'default'}
            >
              {column.label}
            </CustomTableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
};

export default LedgerHead;
