import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
export default function DropDownCustom({ icon, lable, data, selectedValue, setValue, viewKeyName }) {
  const [selectedOption, setSelectedOption] = useState(selectedValue[`${viewKeyName}`]);
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedData = data.find(
      (currency) => currency?.name === event?.target?.value
    );
    setValue(selectedData)
  };
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="standard-select-currency"
          select
          label={lable}
          value={selectedOption}
          defaultValue="EUR"
          onChange={(e) => handleSelectChange(e)}
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  {icon}
                </IconButton>
              </InputAdornment>
            ),
          }}
        >
          {data.map((item, key) => (
            <MenuItem key={item[`${viewKeyName}`]} 
            value={item[`${viewKeyName}`]}
             >
              {item[`${viewKeyName}`]}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
}
