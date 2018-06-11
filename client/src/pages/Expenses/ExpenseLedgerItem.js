/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const ExpenseLedgerItem = props => (
  <TableRow className={props.classes.row} id={props.id}>
    <CustomTableCell>{props.expDate.slice(0, 10)}</CustomTableCell>
    <CustomTableCell>{props.expDesc}</CustomTableCell>
    { props.showCategories ? <CustomTableCell>{props.category}</CustomTableCell> : null }
    <CustomTableCell numeric>{props.expAmount.toFixed(2)}</CustomTableCell>
    <CustomTableCell numeric>{props.expAmountLocalCurrency.toFixed(2)}</CustomTableCell>
  </TableRow>
);

ExpenseLedgerItem.defaultProps = {
  classes: {},
};

ExpenseLedgerItem.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.number.isRequired,
  expDate: PropTypes.string.isRequired,
  expDesc: PropTypes.string.isRequired,
  expAmount: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  expAmountLocalCurrency: PropTypes.number.isRequired,
  showCategories: PropTypes.bool.isRequired,
};

export default ExpenseLedgerItem;
