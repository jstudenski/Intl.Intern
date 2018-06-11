/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Table, { TableBody, TableCell, TableRow, TablePagination, } from 'material-ui/Table';
import PropTypes from 'prop-types';
// import Card from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import ExpenseLedgerItem from './ExpenseLedgerItem';
import LedgerHead from './LedgerHead';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class Ledger extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 10,
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    const { classes } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.expenses.length - (page * rowsPerPage));

    return (
      <div className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <LedgerHead
              rowCount={this.props.expenses.length}
              home={this.props.home}
              intern={this.props.intern}
              {...this.props}
            />
            <TableBody>
              {this.props.expenses.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                  .map((expense, i) => <ExpenseLedgerItem key={expense._id} {...expense} showCategories={this.props.showCategories} id={i} classes={classes} />)
              }
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={this.props.expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

Ledger.propTypes = {
  classes: PropTypes.object.isRequired,
  expenses: PropTypes.array.isRequired,
  home: PropTypes.string.isRequired,
  intern: PropTypes.string.isRequired,
  showCategories: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Ledger);

