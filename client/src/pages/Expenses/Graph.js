import React, { Component } from 'react';
import Chartist from 'chartist';
import chartistpluginaxistitle from 'chartist-plugin-axistitle';
// import Typography from 'material-ui/Typography';
import Moment from 'moment';
import API from '../../utils/API';

// const date0 = new Moment('2018-01-02');
// const date1 = new Moment('2018-01-25');
// const date2 = new Moment('2018-03-01');
// console.log('week numbers', [date0, date1, date2].map(date => ({ date, week: (date.week())}) ));


export default class extends Component {
  state = {}

  componentDidMount() {
    API.getCurrentUser().then((response) => {
      // console.log("response: ", response);
      const currentUser = response.data.user;
      // console.log("currentUser is: " , currentUser);
      this.setState({ currentUser });
    });
    // this.displayGraph();
  }

  componentWillReceiveProps() {
    // this.displayGraph displays our old plot.
    // this.displayGraph();
    this.displayWeeklyBarChart();
  }

  transformExpenseData(expenses, interval) {
    if (expenses.length < 1) return expenses;

    const sortedExpenses = expenses.slice(0).sort((a, b) => (a.expDate > b.expDate ? 1 : -1));
    // console.log('sortedExpenses');
    // sortedExpenses.forEach((expense,i) => console.log(i, Moment(expense.expDate).format('YYYY-MM-DD')));
    // const moment = new Moment();
    const startDate = new Moment(sortedExpenses[0].expDate);
    const endDate = new Moment(sortedExpenses[sortedExpenses.length - 1].expDate);
    // console.log('startDate, endDate', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    let numberOfIntervals, startInterval, endInterval;
    const intervals = [];
    let labels = [];
    let weeklyExpenseAmounts = [];
    let maxUSDAmount = 0;
    startInterval = (startDate.week());
    endInterval = (endDate.week());
    numberOfIntervals = endDate.diff(startDate, 'weeks') + 1;
    // console.log('number of intervals', numberOfIntervals);

    // assumes week starts on Sunday and ends Saturday
    labels = Array(...{ length: numberOfIntervals + 1 }).map((val, i) => {
      const weekNum = i + 1;
      const start = startDate.clone().add(i * 7, 'days');
      const end = startDate.clone().add((i + 1) * 7 - 1, 'days');
      // console.log('startDate', i, startDate.format('YYYY-MM-DD'));
      return {
        weekNum: (i + 1),
        start,
        end
      };
    });
    weeklyExpenseAmounts = Array(...{ length: numberOfIntervals + 1 }).map((val, i) => ({ usdAmount: 0, localAmount: 0 }));
    sortedExpenses.forEach((expense) => {
      const date = new Moment(expense.expDate);
      // const weekNum = Moment(expense.expDate).diff(startDate, 'weeks')
      const weekNum = date.diff(startDate, 'weeks') + 1;
      weeklyExpenseAmounts[weekNum - 1].usdAmount += expense.expAmount;
      weeklyExpenseAmounts[weekNum - 1].localAmount += expense.expAmountLocalCurrency;
      if (weeklyExpenseAmounts[weekNum - 1].usdAmount > maxUSDAmount) maxUSDAmount = weeklyExpenseAmounts[weekNum - 1].usdAmount;
    });
    const data = {
      labels: labels.map(week => week.start.format('MMM-DD')),
      series: [weeklyExpenseAmounts.map(week => week.usdAmount)],
      maxUSDAmount,
    };
    return data;
  }

  displayWeeklyBarChart() {
    const individualExpenses = this.props.expenses.slice(0).map(expense => expense.expAmount);

    const weeklyData = this.transformExpenseData(this.props.expenses, 'week');
    // const weeklyData = [];
    const weeklyOptions = {
      high: weeklyData.maxUSDAmount * 1.1,
      low: 0,
      axisX: {
        labelInterpolationFnc: (value, index) => (index % 2 === 0 ? value : null)
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
            axisTitle: 'Weekly Total Expenses',
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

    const barChart = new Chartist.Bar('.ct-chart', { labels: weeklyData.labels, series: weeklyData.series }, weeklyOptions)
      .on('draw', (data) => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px; stroke: #66a6ff;'
          });
        }
      });

    return barChart;
  }

  displayGraph = () => {
    const individualExpenses = this.props.expenses.map(expense => expense.expAmount);
    const cumulativeExpense = [];
    for (let i = 0; i < individualExpenses.length; i++) {
      cumulativeExpense[i] = individualExpenses[i] + (i > 0 ? cumulativeExpense[i - 1] : 0);
    }

    const labels = Array(...{ length: (individualExpenses.length) + 1 }).map((val, i) => i + 1);
    // console.log('weekly data', weeklyData);

    // console.log(data, weeklyData);

    const chart = new Chartist.Line('.ct-chart', {
      labels,
      // Naming the series with the series object array notation
      series: [{
        name: 'series-1',
        data: individualExpenses
      }, {
        name: 'series-2',
        data: cumulativeExpense
      }],
    }, {
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
            axisTitle: 'Item',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 30
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
      series: {
        'series-1': {
          showLine: false,
          // lineSmooth: Chartist.Interpolation.simple()
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.step(),
          showArea: true,
          showPoint: false,
        },
      },
    });
  };

  render() {
    return (
      <div>
        <div className="ct-chart" style={{fontFamily: 'roboto'}}/>
      </div>
    );
  }
}
