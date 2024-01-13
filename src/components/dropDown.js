import React, { useState } from 'react';
import './dropDown.css'

const CustomDropdown = ({ icon, lable, data, selectedValue, setValue, viewKeyName }) => {
  const [selectedOption, setSelectedOption] = useState(selectedValue);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setValue(event.target.value)
  };
  return (
    <div>
      <div>{lable}</div>
      <div className='containerDropDown'>
        <label htmlFor="dropdown">{icon}</label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleSelectChange}
          defaultValue="Select"
          className="custom-dropdown"
        >
          {
            data.map((item, id) =>
              <option
                value={item[`${viewKeyName}`]}
                key={id}
                style={{backgroundColor:'black' , height:'10px'}}
              >
                {item[`${viewKeyName}`]}
              </option>
            )
          }
        </select>
      </div>
    </div>
  );
};

export default CustomDropdown;
