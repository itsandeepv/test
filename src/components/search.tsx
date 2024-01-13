import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import search from '../assets/images/search.svg'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
const ariaLabel = { 'aria-label': 'description' };
export default function CustomizedSearchInput() {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 }, width:{sm: '30vw', xs: '45vw'},
      }}
      noValidate
      autoComplete="off"
    >
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'auto' ,backgroundColor:'#F4F4F4', boxShadow:'none',borderRadius:'10px'}}
    >
      <InputBase
        sx={{ ml: 1, flex: 1}}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <img src={search} />
      </IconButton>
    </Paper>
    </Box>
  );
}