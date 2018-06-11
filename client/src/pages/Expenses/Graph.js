/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-new          */ // needed because we are not using react-based version of chartist
/* eslint-disable no-unused-vars  */ // chartistpluginaxistitle is used without explicit call
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chartist from 'chartist';
import chartistpluginaxistitle from 'chartist-plugin-axistitle';
// import Typography from 'material-ui/Typography';
import Moment from 'moment';
// import API from '../../utils/API';


export default class ExpenseChart extends Component {
  state = {}

  componentWillReceiveProps() {
    // this.displayGraph displays our old plot.
    // this.displayGraph();
    this.displayIntervaledBarChart();
    /* this.displayCategoryPieChart(); */
  }

  transformExpenseDataBasedOnIntervals = (expenses, interval) => {
    if (expenses.length < 1) return expenses;

    const sortedExpenses = expenses.slice(0).sort((a, b) => (a.expDate > b.expDate ? 1 : -1));
    const graphInterval = interval === 'weekly' ? 'weeks' : interval === 'monthly' ? 'months' : 'weeks';
    // const startDate = new Moment(sortedExpenses[0].expDate);
    // const endDate = new Moment(sortedExpenses[sortedExpenses.length - 1].expDate);
    const startDate = new Moment(sortedExpenses[0].expDate).startOf(graphInterval === 'weeks' ? 'week' : 'month');
    const endDate = new Moment(sortedExpenses[sortedExpenses.length - 1].expDate);
    const numberOfIntervals = endDate.diff(startDate, graphInterval);

    // assumes week starts on Sunday and ends Saturday, month starts 1st day of month
    const labels = Array(...{ length: numberOfIntervals + 1 }).map((val, i) => {
      // const intervalNum = i + 1;
      const start = startDate.clone().add(i, graphInterval);
      // then end date of the interval is just the next week or month, but then with one day subtracted from it.
      const end = startDate.clone().add(i + 1, graphInterval).add((-1), 'days');
      return {
        intervalNum: (i + 1),
        start,
        end
      };
    });
    // initialize the expenseAmountsPerInterval array
    const expenseAmountsPerInterval = Array(...{ length: numberOfIntervals + 1 }).map(() => ({ usdAmount: 0, localAmount: 0 }));
    // fill in the expenseAmountsPerInterval array, by iterating over the expenses and increasing
    // the total amount expended for whatever interval that expense falls into (based on week/month)
    // the interval numbers start from 1, not 0; but they are filled into a normal 0-based-index array.
    sortedExpenses.forEach((expense) => {
      // const date = new Moment(expense.expDate);
      const intervalNum = new Moment(expense.expDate).diff(startDate, graphInterval) + 1;
      expenseAmountsPerInterval[intervalNum - 1].usdAmount += expense.expAmount;
      expenseAmountsPerInterval[intervalNum - 1].localAmount += expense.expAmountLocalCurrency;
    });
    const maxUSDIntervalAmount = Math.max(...expenseAmountsPerInterval.map(amountPairs => amountPairs.usdAmount));
    const data = {
      labels: labels.map(label => label.start.format(graphInterval === 'weeks' ? 'MMM-DD' : 'MMM \'YY')),
      series: [expenseAmountsPerInterval.map(amounts => amounts.usdAmount)],
      maxUSDAmount: maxUSDIntervalAmount,
    };
    return data;
  }

  transformDataBasedOnCategories = (expenses) => {
    const expenseCategories = {};
    const expenseCategories1 = new Set(expenses.map(expense => expense.category));
    expenseCategories1.forEach((category) => {
      expenseCategories[category] = { usdAmount: 0, localAmount: 0 };
    });
    expenses.forEach((expense) => {
      expenseCategories[expense.category].usdAmount += expense.expAmount;
      expenseCategories[expense.category].localAmount += expense.expAmountLocalCurrency;
    });

    const data = {
      labels: Object.keys(expenseCategories),
      series: Object.keys(expenseCategories).map(key => expenseCategories[key].usdAmount),
    };
    return data;
  }


  displayCategoryPieChart = () => {
    const data = this.transformDataBasedOnCategories(this.props.expenses);
    const options = {
      labelInterpolationFnc: value => value[0],
      height: '480px',
      // height: '350px',
      fullWidth: true,

    };

    const responsiveOptions = [
      ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: value => value,
      }],
      ['screen and (min-width: 1024px)', {
        // labelOffset: 80,
        labelOffset: 120,
        chartPadding: 20
      }]
    ];

    new Chartist.Pie('.ct-chart', data, options, responsiveOptions);
  }

  displayIntervaledBarChart = () => {
    // const chartInterval = 'monthly'; // change to 'weekly' for weekly chart
    const chartInterval = 'weekly';
    const intervalData = this.transformExpenseDataBasedOnIntervals(this.props.expenses, chartInterval);
    // const weeklyData = this.transformExpenseDataBasedOnIntervals(this.props.expenses, 'weekly');
    const chartOptions = {
      high: intervalData.maxUSDAmount * 1.1,
      low: 0,
      axisX: {
        // uncomment this to only show every other x-axis label
        // labelInterpolationFnc: (value, index) => (index % 2 === 0 ? value : null)
      },
      height: '350px',
      fullWidth: true,
      chartPadding: {
        top: 40,
        right: 40,
        bottom: 30,
        left: 50
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: `${chartInterval === 'weekly' ? 'Weekly' : 'Monthly'} Total Expenses`,
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Expense USD',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle',
            flipTitle: true
          }
        })
      ],

    };

    const barChart = new Chartist.Bar('.ct-chart', { labels: intervalData.labels, series: intervalData.series }, chartOptions)
      .on('draw', (data) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px; stroke: #66a6ff;'
          });
        }
      });

    return barChart;
  }


  render() {
    return (
      <div>
        <div className="ct-chart" style={{ fontFamily: 'roboto' }} />
      </div>
    );
  }
}

ExpenseChart.propTypes = {
  expenses: PropTypes.array.isRequired,
};
