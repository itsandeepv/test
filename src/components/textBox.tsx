import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react'

interface modelProps {
    multiline: boolean;
    labelText: string;
    img: any;
    onchangeText: Function;
    placeholder: string;
    value: any;
    disabled:any
}

export const TextBoxReact: React.FC<modelProps> = ({ multiline, labelText, img, onchangeText, placeholder ,value,disabled}) => {
    return (
        <TextField
            id="input-with-icon-textfield"
            label={labelText}
            multiline={multiline}
            disabled={disabled?disabled:false}
            maxRows={4}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {img}
                    </InputAdornment>
                ),
            }}
            inputProps={{ maxLength: 250 }}
            variant="standard"
            // onChange={(e) => handleChangeText(e.target.value)}
            onChange={(e) => onchangeText(e)}
            value={value}
        />
    )
}