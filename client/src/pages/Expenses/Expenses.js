/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import CreateForm from './CreateForm';
import Ledger from './Ledger';
import Graph from './Graph';
import API from '../../utils/API';
import Util from '../../utils/util';

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
});

class Expenses extends Component {
  state = {
    expenseDescription: '',
    date: '', // '', Date.now(), now working currenlty
    usdAmount: '0.00',
    locationAmount: '0',
    currencyCode: '',
    expenseData: [],
    selectCurrency: 'usd',
    exchangeRate: '1000',
    homeLabel: '',
    internLabel: '',
  };

  componentDidMount() {
    this.updateExpenses(this.props);
    this.updateFormCurrencyWithUserData(this.props.currentUser);
  }

  componentWillReceiveProps(props) {
    this.updateExpenses(props);
    this.updateFormCurrencyWithUserData(props.currentUser);
  }

  updateFormCurrencyWithUserData(currentUser) {
    if (currentUser) {
      const { homeLocationCurrencyCode, internLocationCurrencyCode } = currentUser;
      Util.getExchangeRate(homeLocationCurrencyCode, internLocationCurrencyCode)
        .then((result) => {
          if (result.error) return console.error(result.message);
          return this.setState({
            exchangeRate: result.quote.toFixed(2),
            homeLabel: `${homeLocationCurrencyCode} Amount`,
            internLabel: `${internLocationCurrencyCode} Amount`,
          });
        })
        .catch(err => console.error('err getting exchangeRate', err));
    }
  }

  handleDivChange = (event) => {
    // this.setState({ selectCurrency: event.target.value });
    this.setState({ selectCurrency: event.target.id });
  }

  handleInputChange = event => this.setState({ [event.target.name]: event.target.value })

  handleInputChangeForNumberFormatField = values => this.setState({ exchangeRate: values.value })

  updateExpenses(props) {
    if (props.currentUser) {
      // console.log('in componentWillReceiveProps. New props are: ' , props);
      // this is signaling that user is now logged in. so, use the expenses if provided,
      // otherwise retrieve via api
      if (props.currentUser.expRef && props.currentUser.expRef[0] && props.currentUser.expRef[0].expDesc) {
        // console.log('using expenses provided in user');
        this.setState({ expenseData: props.currentUser.expRef });
      } else {
        // console.log('using API to retrieve expenses');
        API.getExpenses().then(response => this.setState({ expenseData: response.data }));
      }
    }
  }

  submitForm = (event) => {
    event.preventDefault();
    // console.log('current state', this.state);

    if (this.state.expenseDescription &&
      this.state.date &&
      (this.state.usdAmount || this.state.locationAmount)) {
      const usdAmount = this.state.selectCurrency === 'usd' ? this.state.usdAmount : (this.state.locationAmount / this.state.exchangeRate).toFixed(2);
      const locationAmount = this.state.selectCurrency !== 'usd' ? this.state.locationAmount : (this.state.usdAmount * this.state.exchangeRate).toFixed(2);

      // (this.state.usdAmount > 0) ? (
      //     this.setState({ locationAmount: (this.state.usdAmount * this.state.exchangeRate).toFixed(2) })
      //     // this.state.locationAmount=this.state.usdAmount*this.state.exchangeRate
      //     // console.log('AMOUNT USD given: ', this.state.locationAmount)
      //   ) : (
      //     this.setState({ usdAmount: (this.state.locationAmount / this.state.exchangeRate).toFixed(2) })
      //     // this.state.usdAmount=this.state.locationAmount/this.state.exchangeRate
      //     // console.log('AMOUNT KRW given: ', this.state.usdAmount)
      //   );

      this.setState({ usdAmount, locationAmount });

      const data = {
        expDesc: this.state.expenseDescription,
        expAmount: usdAmount,
        expDate: this.state.date,
        expAmountLocalCurrency: locationAmount,
      };

      API.newExpense(data)
        .then(() => {
          // console.log('Response from submitting expense: ', response);
          this.setState({
            expenseDescription: '',
            usdAmount: '0.00',
            date: '',
            locationAmount: '0',

          });
          API.getExpenses().then((res) => {
            // console.log('API expense response: ', res);
            this.setState({
              expenseData: res.data,
            });
          });
        })
        .catch((err) => {
          console.error('Error while submitting expense: ', err);
        });
    } else {
      console.error('Unable to submit ');
    }
  }

  render() {
    return (
      this.props.currentUser && this.props.currentUser.username ?
      <div>
        <Grid container spacing={24}>
          {/* <Grid item xs={6} sm={4}> */}
          <Grid item xs={12} sm={6} md={6}>
            <CreateForm
              handleDivChange={this.handleDivChange}
              handleInputChange={this.handleInputChange}
              handleInputChangeForNumberFormatField={this.handleInputChangeForNumberFormatField}
              submitForm={this.submitForm}
              currentUser={this.props.currentUser}
              {...this.state}
            />
          </Grid>
          {/* <Grid item xs={6} sm={8}> */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper>
              <Graph expenses={this.state.expenseData} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Ledger expenses={this.state.expenseData} home={this.state.homeLabel} intern={this.state.internLabel} />
            </Paper>
          </Grid>
        </Grid>
      </div>
      :
      <div><p>Please Loading data...</p></div>
    );
  }
}

export default withStyles(styles)(Expenses);
