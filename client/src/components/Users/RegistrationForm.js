/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material UI
import { Button, TextField, Select, Typography, } from 'material-ui';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
//
import IntegrationReactSelect from '../../components/Forms/IntegrationReactSelect';
import API from '../../utils/API';
import util from '../../utils/util';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
  registerButton: {
    display: 'flex',
    marginLeft: 'auto',
  }
});


class RegistrationForm extends Component {
  state = {
    // currentUser: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    fullname: '',
    homeLocationCity: '',
    homeLocationCountry: '',
    homeLocationCountryCode: '',
    homeLocationCurrencyCode: '',
    homeLocationTimezone: '',
    homeLocationLatitude: '',
    homeLocationLongitude: '',
    internLocationCity: '',
    internLocationCountry: '',
    internLocationCountryCode: '',
    internLocationCurrencyCode: '',
    internLocationTimezone: '',
    internLocationLatitude: '',
    internLocationLongitude: '',
    preferredUnits: 'imperial',
    openWeatherCityCode: '',
    countryCodeData: {},
    countryCurrencyCodeData: {},
    countryNameSuggestions: [],
    axiosCancelToken: null,
    error: '',
    open: false,
  }

  componentDidMount() {
    this.loadCountryData();
  }

  componentWillUnmount() {
    if (this.state.axiosCancelToken) {
      this.state.axiosCancelToken.cancel();
    }
  }

  // open login modal
  errDialogOpen = () => { this.setState({ open: true }); };
  // close login modal
  errDialogClose = () => { this.setState({ open: false }); };

  loadCountryData() {
    const axiosReference = API.getAllCountryData();
    this.setState({ axiosCancelToken: axiosReference });
    axiosReference
      .promise
      .then((response) => {
        // console.log(response);
        const countryCodeData = response.data.countryCodes || {};
        const countryNameSuggestions = Object.keys(countryCodeData)
          .map(suggestion => ({
            value: suggestion,
            label: suggestion,
          }));
        this.setState({
          countryNameSuggestions,
          countryCodeData,
          countryCurrencyCodeData: response.data.countryCurrencyCodes
        });
      })
      .catch((err) => {
        // Error on request for country data. This could just be due to the request being canceled.
        // print is it is due to something other than the request being canceled
        if (err.isCanceled) {
          console.log('Axios request in RegistrationForm for getting country data canceled. This is normal');
        } else {
          this.setState({ error: 'Error on request for country data' });
          // launch error dialog
          this.errDialogOpen();
          console.error(this.setState.error, err);
        }
      });
  }

  sendRegistrationData = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      this.setState({ error: 'Password and Password Confirmation do not match' });
      // launch error dialog
      this.errDialogOpen();
      return console.error(this.state.error);
    } else if (this.state.password.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters long' });
      // launch error dialog
      this.errDialogOpen();
      return console.error(this.state.error);
    } else if (
      this.state.username.length < 1 ||
      this.state.email.length < 1 ||
      this.state.fullname.length < 1 ||
      this.state.homeLocationCity.length < 1 ||
      this.state.homeLocationCountry.length < 1 ||
      this.state.homeLocationCountry.length < 1 ||
      this.state.homeLocationCountryCode.length < 1 ||
      this.state.internLocationCity.length < 1 ||
      this.state.internLocationCountry.length < 1 ||
      this.state.internLocationCountryCode.length < 1 ||
      this.state.internLocationCurrencyCode.length < 1
    ) {
      this.setState({ error: 'One or more missing required fields' });
      // launch error dialog
      this.errDialogOpen();
      return console.error(this.state.error);
    }
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      fullname: this.state.fullname,
      homeLocationCity: this.state.homeLocationCity,
      homeLocationCountry: this.state.homeLocationCountry,
      homeLocationCountryCode: this.state.homeLocationCountryCode,
      homeLocationCurrencyCode: this.state.homeLocationCurrencyCode,
      homeLocationTimezone: this.state.homeLocationTimezone,
      homeLocationLatitude: this.state.homeLocationLatitude,
      homeLocationLongitude: this.state.homeLocationLongitude,
      internLocationCity: this.state.internLocationCity,
      internLocationCountry: this.state.internLocationCountry,
      internLocationCountryCode: this.state.internLocationCountryCode,
      internLocationCurrencyCode: this.state.internLocationCurrencyCode,
      internLocationTimezone: this.state.internLocationTimezone,
      internLocationLatitude: this.state.internLocationLatitude,
      internLocationLongitude: this.state.internLocationLongitude,
      preferredUnits: this.state.preferredUnits,
    };
    return API.registerUser(data)
      .then((response) => {
        const newUser = response.data.user;
        // send the new user data up to the App.js component
        this.setState({
          // currentUser: newUser,
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
          fullname: '',
          homeLocationCity: '',
          homeLocationCountry: '',
          homeLocationCountryCode: '',
          homeLocationCurrencyCode: '',
          internLocationCity: '',
          internLocationCountry: '',
          internLocationCountryCode: '',
          internLocationCurrencyCode: '',
        }, ((typeof this.props.onLogin === 'function') && this.props.onLogin(newUser)));
      })
      .catch(err => console.log('error on registration', err));
  }

  handleInputChange = event => this.setState({ [event.target.name]: event.target.value });

  handleInputChangeForAutoCompleteField = name => (value) => {
    // console.log('name, value', name, value);
    const dataToSet = {};
    dataToSet[name] = value;
    const countryCodeName = name === 'homeLocationCountry' ? 'homeLocationCountryCode' :
      name === 'internLocationCountry' ? 'internLocationCountryCode' : '';
    const currencyCodeName = name === 'homeLocationCountry' ? 'homeLocationCurrencyCode' :
      name === 'internLocationCountry' ? 'internLocationCurrencyCode' : '';
    if (this.state.countryCodeData && countryCodeName) {
      const countryCode = this.state.countryCodeData[value] || '';
      if (countryCode) dataToSet[countryCodeName] = countryCode;
    }
    if (this.state.countryCurrencyCodeData && currencyCodeName) {
      const currencyCode = this.state.countryCurrencyCodeData[value] || '';
      if (currencyCode) dataToSet[currencyCodeName] = currencyCode;
    }
    // console.log('new state data to set', dataToSet);
    this.setState(dataToSet);
  }

  submitForm = (event) => {
    event.preventDefault();
    // get/set intern location
    let place = `${this.state.internLocationCity}, ${this.state.internLocationCountry}`;
    util.getGeoLocation(place).then((iGeo) => {
      this.setState({
        // internLocationCountryCode: iGeo.cc,
        internLocationLatitude: iGeo.lat,
        internLocationLongitude: iGeo.lng,
      });
      util.getTimezone({ lat: iGeo.lat, lng: iGeo.lng }).then((iTZ) => {
        this.setState({
          internLocationTimezone: JSON.stringify(iTZ.json),
        });
        // get/set home location
        place = `${this.state.homeLocationCity}, ${this.state.homeLocationCountry}`;
        util.getGeoLocation(place, false).then((hGeo) => {
          this.setState({
            // homeLocationCountryCode: json2.cc,
            homeLocationLatitude: hGeo.lat,
            homeLocationLongitude: hGeo.lng,
          });
          util.getTimezone({ lat: hGeo.lat, lng: hGeo.lng }).then((hTZ) => {
            this.setState({
              homeLocationTimezone: JSON.stringify(hTZ.json),
            });
            this.sendRegistrationData();
          });
        });
      });
    });
  }

  render() {
    // console.log('state upon rendering: ', this.state);
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="headline" gutterBottom>Welcome</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="headline" gutterBottom>Registration Form</Typography>
              <form>
                <TextField className={this.props.classes.textField} label="Username" name="username" type="text" required value={this.state.username} onChange={this.handleInputChange} />
                {/* <br /> */}
                <TextField className={this.props.classes.textField} label="Email" name="email" type="text" required value={this.state.email} onChange={this.handleInputChange} />
                {/* <br /> */}
                <TextField className={this.props.classes.textField} label="Password" name="password" type="password" required value={this.state.password} onChange={this.handleInputChange} />
                <TextField className={this.props.classes.textField} label="Confirm Password" name="passwordConfirm" required type="password" value={this.state.passwordConfirm} onChange={this.handleInputChange} />

                <TextField className={this.props.classes.textField} label="Full Name" name="fullname" type="text" required value={this.state.fullname} onChange={this.handleInputChange} />
                <Divider className={this.props.classes.divider} light />
                <Typography variant="subheading" gutterBottom>Home Location</Typography>

                <TextField className={this.props.classes.textField} label="City" name="homeLocationCity" required type="text" value={this.state.homeLocationCity} onChange={this.handleInputChange} />
                {/* <br /> */}
                <FormControl >
                  <InputLabel htmlFor="homeLocationCountry">Home Country</InputLabel>
                  <IntegrationReactSelect
                    label="Home Country"
                    value={this.state.homeLocationCountry}
                    handleInputChange={value => this.handleInputChangeForAutoCompleteField('homeLocationCountry')(value)}
                    placeholder=""
                    selectSuggestions={this.state.countryNameSuggestions}
                  />
                  {/* <br /> */}
                </FormControl>
                <TextField className={this.props.classes.textField} label="Country Code" name="homeLocationCountryCode" required type="text" value={this.state.homeLocationCountryCode} onChange={this.handleInputChange} />
                <TextField className={this.props.classes.textField} label="Currency" name="homeLocationCurrencyCode" required type="text" value={this.state.homeLocationCurrencyCode} onChange={this.handleInputChange} />

                <Divider className={this.props.classes.divider} light />
                <Typography variant="subheading" gutterBottom>Intern Location</Typography>
                <TextField className={this.props.classes.textField} label="City" name="internLocationCity" required type="text" value={this.state.internLocationCity} onChange={this.handleInputChange} />
                <FormControl >
                  <InputLabel htmlFor="internLocationCountry">Intern Country</InputLabel>
                  <IntegrationReactSelect
                    label="Intern Country"
                    name="internLocationCountry"
                    required
                    type="text"
                    value={this.state.internLocationCountry}
                    handleInputChange={value => this.handleInputChangeForAutoCompleteField('internLocationCountry')(value)}
                    selectSuggestions={this.state.countryNameSuggestions}
                    placeholder=""
                  />
                </FormControl>
                <TextField className={this.props.classes.textField} label="Country Code" name="internLocationCountryCode" required type="text" value={this.state.internLocationCountryCode} onChange={this.handleInputChange} />
                <TextField className={this.props.classes.textField} label="Currency" name="internLocationCurrencyCode" required type="text" value={this.state.internLocationCurrencyCode} onChange={this.handleInputChange} />
                {/* <br /> */}
                <Divider className={this.props.classes.divider} light />
                <FormControl >
                  <InputLabel htmlFor="preferredUnits-helper">Preferred Units</InputLabel>
                  <Select
                    value={this.state.preferredUnits}
                    onChange={this.handleInputChange}
                    input={<Input name="preferredUnits" id="age-helper" />}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="imperial">Imperial</MenuItem>
                    <MenuItem value="metric">Metric</MenuItem>
                  </Select>
                  <FormHelperText>Units for retrieved weather data</FormHelperText>
                </FormControl>
                <Divider className={this.props.classes.divider} light />
                <Button className={this.props.classes.registerButton} variant="raised" color="primary" onClick={this.submitForm}>Register</Button>
              </form>
            </Paper>
          </Grid>

        </Grid>
        {/* login modal begin */}
        <Dialog
          open={this.state.open}
          onClose={this.errDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Error</DialogTitle>
          <DialogContent>
            <Typography variant="headline">{this.state.error}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.errDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationForm);
