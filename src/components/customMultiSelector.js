import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectChip({ icon, lable, data, selectedValue, setValue, viewKeyName,otherKeyName }) {
    const [personName, setPersonName] = useState(selectedValue.map(item => item[`${viewKeyName}`]));

    const handleChange = (event) => {
        setPersonName(
            typeof value === 'string' ? event.target.value.split(',') : event.target.value
        );
        setValue(typeof value === 'string' ? event.target.value.split(',') : event.target.value)
    };

    return (
        <div>
            <div>
                {lable}
            </div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={(e) => handleChange(e)}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((item, id) => (
                                <Chip key={id} label={item} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {data.map((item, id) => (
                        <MenuItem
                            key={id}
                            value={item[`${otherKeyName}`]}
                        >
                            {item[`${otherKeyName}`]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
