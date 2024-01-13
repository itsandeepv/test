import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function RadioButtonsGroup({ lable, passSelectedValue }) {
    const [selectedValue, setValue] = useState("")
    const handleRadio = (value) => {
        setValue(value)
        passSelectedValue(value)
    }
    console.log("lable>>", lable)
    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name="radio-buttons-group"
            >
                {
                    lable.map((item, key) =>
                        <FormControlLabel value={item} control={<Radio />} key={key} label={item} checked={selectedValue === item} onChange={(e) => handleRadio(e.target.value)} />
                    )
                }
            </RadioGroup>
        </FormControl>
    );
}
