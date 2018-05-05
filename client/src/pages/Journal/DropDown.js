import React from 'react';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

const DropDown = props => (
  <Select
    value={props.value}
    onChange={props.onChange}
    name={props.name}
    type={props.type}
    autoWidth
  >
    {props.items.map(need =>
    (<MenuItem key={need._id} value={need.needNumber}>
     {need.needNumber}: {need.needTitle}
    </MenuItem>))}
  </Select>
);

export default DropDown;
