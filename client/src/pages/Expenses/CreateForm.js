/* eslint-disable react/forbid-prop-types */

import React from 'react';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import {
  Select,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  // FormLabel,
  FormControlLabel,
} from 'material-ui';

import AddItem from '../../components/AddItem';
// import Radio, { RadioGroup } from 'material-ui/Radio';
// import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
// import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
// import Button from 'material-ui/Button';

// import Select from '@material-ui/core/Select';

const CreateForm = props => (
  <div style={{ fontFamily: 'roboto' }}>
    <AddItem
      title="Add Expense"
      onClick={props.submitForm}
    >
      <form>
        <TextField
          label="Description"
          name="expenseDescription"
          type="text"
          value={props.expenseDescription}
          onChange={props.handleInputChange}
          InputLabelProps={{
          shrink: true,
        }}
        />
        <FormControl >
          <InputLabel htmlFor="category" shrink>Category</InputLabel>
          <Select
            native
            label="Expense Category"
            name="category"
            onChange={props.handleInputChange}
            value={props.category}
          >
            {[''].concat(props.expenseCategories).map(option => <option key={`expenseCategory-${option}`} value={option}>{option}</option>)}
          </Select>
        </FormControl>
        {/* <FormControl >
          <InputLabel htmlFor="category">Category</InputLabel>
          <IntegrationReactSelect
            label="category"
            value={props.category}
            handleInputChange={props.handleInputChange}
            selectSuggestions={props.expenseCategories}
            placeholder=""
          />
        </FormControl> */}
        <br />
        {(props.selectCurrency === 'usd') ? (
          <TextField
            label={props.homeLabel}
            name="usdAmount"
            type="number"
            step="0.01"
            style={{ width: 100 }}
            placeholder="0.00"
            value={props.usdAmount}
            onChange={props.handleInputChange}
            InputLabelProps={{
            shrink: true,
          }}
          />
      ) : (
        <TextField
          label={props.internLabel}
          name="locationAmount"
          type="number"
          placeholder="0"
          style={{ width: 100 }}
          value={props.locationAmount}
          onChange={props.handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}

        <RadioGroup
          aria-label="selectCurrency"
          name="selectCurrency"
          value={props.selectCurrency}
          onChange={props.handleDivChange}
        >
          <FormControlLabel style={{ marginBottom: -10 }} value="usd" control={<Radio color="primary" />} label={props.currentUser ? props.currentUser.homeLocationCurrencyCode : 'usd'} />
          <FormControlLabel style={{ marginTop: -10 }} value="other" control={<Radio color="primary" />} label={props.currentUser ? props.currentUser.internLocationCurrencyCode : 'other'} />
        </RadioGroup>

        <br />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={props.date}
          onChange={props.handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <br />
        {/* <input name="date" type="date" value={props.date} placeholder={Date.now()} onChange={props.handleInputChange} /> */}
        <NumberFormat
          label="Exchange Rate"
          name="exchangeRate"
          customInput={TextField}
          onValueChange={props.handleInputChangeForNumberFormatField}
          value={props.exchangeRate}
          type="tel"
          InputLabelProps={{ shrink: true }}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={2}
        />

      </form>
    </AddItem>
  </div>
);

CreateForm.defaultProps = {
  currentUser: {},
};

CreateForm.propTypes = {
  expenseDescription: PropTypes.string.isRequired,
  selectCurrency: PropTypes.string.isRequired,
  usdAmount: PropTypes.string.isRequired,
  locationAmount: PropTypes.string.isRequired,
  homeLabel: PropTypes.string.isRequired,
  internLabel: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  exchangeRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
  expenseCategories: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleDivChange: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  handleInputChangeForNumberFormatField: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CreateForm;
