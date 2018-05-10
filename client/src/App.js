import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
// Material UI components
import CssBaseline from 'material-ui/CssBaseline';
// from Material, used to inject an array of styles into the DOM
import { withStyles } from 'material-ui/styles';
// Pages
import Journal from './pages/Journal/';
import Expenses from './pages/Expenses/';
import UserLocation from './pages/Location';
import Requirements from './pages/Requirements/';
import NoMatch from './pages/NoMatch';
// Components
import RegistrationForm from './components/Users/RegistrationForm';
import Sidebar from './components/Sidebar/Sidebar';
import TopNav from './components/TopNav/TopNav';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    position: 'relative',
    marginLeft: drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

// read the .env file and load values into the process.env object
// must come before any use of process.env
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ silent: true });
// console.log('env:', process.env);
// read .env.development.local
// dotenv.config({path: './.env.development.local'})

class App extends React.Component {
  state = {
    currentUser: '',
    currentPage: '',
  };

  componentDidMount() {

  }

  // pass to TopNav component
  handleLogin = (currentUser) => {
    console.log('in App.handleLogin, user is ', currentUser);
    this.setState({ currentUser });
    if (!currentUser) {
      window.history.pushState({},"", '/');
    }
  }
  // pass to Sidebar component
  pageChange = (currentPage) => {
    this.setState({ currentPage });
  }

  render() {
    const { classes } = this.props;

    return (
      <Router>
        <React.Fragment>
          <CssBaseline />
          <div className={classes.root}>
            <div className={classes.appFrame}>
              <TopNav onLogin={this.handleLogin} currentUser={this.state.currentUser} pageTitle={this.state.currentPage} />
              {this.state.currentUser && this.state.currentUser.username ?
                <div>
                  <Sidebar pageChange={this.pageChange} currentUser={this.state.currentUser} />
                  <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                      <Route exact path="/" render={() => <Journal {...this.state} />} />
                      <Route exact path="/journal" render={() => <Journal {...this.state} />} />
                      <Route exact path="/expenses" render={() => <Expenses {...this.state} />} />
                      <Route exact path="/location" render={() => <UserLocation {...this.state} />} />
                      <Route exact path="/requirements" render={() => <Requirements {...this.state} />} />
                      {/* <Route exact path="/register" component={RegistrationForm} /> */}
                      <Route component={NoMatch} />
                    </Switch>
                  </main>
                </div>
              : // user is not logged in
                <div>
                  <Route path="/" render={() => <RegistrationForm onLogin={this.handleLogin} {...this.state} />} />
                </div>
              }
            </div>
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
