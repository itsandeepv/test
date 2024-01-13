import React, { useState, useEffect } from "react";

import { TextBoxReact } from "../../components/textBox.tsx";
import people from '../../assets/images/people.svg'
import phone from '../../assets/images/phone.svg'
import mail from '../../assets/images/mail.svg'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { OutlinedInput } from "@mui/material";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BlueCommonButton, WhiteCommonButton } from '../../components/button.tsx';
import { CustomAdminPopUp } from './customAdminPopUp.tsx';

export const ManagementProfileAdminDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [ispopupOpen, setPopup] = useState(false)
    const [selectedItem, setSelectedItem] = useState('');
    const [fieldValue, setFieldValue] = useState({
        name: state?.data?.name,
        empID: state?.data?.employe_id,
        email: state?.data?.email,
        phoneNo: state?.data?.phone,
        grade: state?.data?.grade_name,
        assignEmp: state?.data?.hod_id
    })

    const masterExpenseType = [
        { id: 1, value: "10", data: "data1" },
        { id: 2, value: "20", data: "data2" },
        { id: 3, value: "30", data: "data3" },
        { id: 4, value: "40", data: "data4" }
    ]
    const handleInput = (e, type) => {
        if (type === "name") {
            setFieldValue((prevData) => ({
                ...prevData,
                name: e.target.value
            }))
        }
        else if (type === "empID") {
            setFieldValue((prevData) => ({
                ...prevData,
                empID: e.target.value
            }))
        }
        else if (type === "email") {
            setFieldValue((prevData) => ({
                ...prevData,
                email: e.target.value
            }))
        }
        else if (type === "phoneNo") {
            setFieldValue((prevData) => ({
                ...prevData,
                phoneNo: e.target.value
            }))
        }
        else if (type === "grade") {
            setFieldValue((prevData) => ({
                ...prevData,
                grade: e.target.value
            }))
        }
        else if (type === "assignEmp") {
            setFieldValue((prevData) => ({
                ...prevData,
                assignEmp: e.target.value
            }))
        }
    }
    const updateManagementDetails =()=>{

    }

    return (
        <div>
            <div className='moduleBorderWithoutPadding '>
                <div className='d-flex column m-10px justfyContent-start textAlign-Start'>
                    <div className='bold1Rem commonBlackcolor '>Edit Management Profile</div>
                    <div className="d-flex row ">
                        <div className='m-10px' style={{ width: '30%' }}>
                            <TextBoxReact
                                multiline={false}
                                labelText="Full Name"
                                img={<img src={people} />}
                                onchangeText={(e: any) => handleInput(e, "name")}
                                placeholder={"Olivia Rhye"}
                                // onchangeText={(e: any) => setCityName(e.target.value)}
                                value={fieldValue.name}
                            />
                        </div>
                        <div className='m-10px' style={{ width: '30%' }}>
                            <TextBoxReact
                                multiline={false}
                                labelText="Employee ID"
                                img={<img src={people} />}
                                onchangeText={(e: any) => handleInput(e, "empID")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.empID}
                            />
                        </div>
                        <div className='m-10px' style={{ width: '30%' }}>
                            <TextBoxReact
                                multiline={false}
                                labelText="Email"
                                img={<img src={mail} />}
                                onchangeText={(e: any) => handleInput(e, "email")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.email}
                            />
                        </div>
                    </div>
                    <div className="d-flex row">
                        <div className='m-10px' style={{ width: '30%' }}>
                            <TextBoxReact
                                multiline={false}
                                labelText="Phone Number"
                                img={<img src={phone} />}
                                onchangeText={(e: any) => handleInput(e, "phoneNo")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.phoneNo}
                            />
                        </div>
                        <div className="d-flex column alignItem-start" style={{ width: '30%' }}>
                            <span className="autoSelectLabel">Select Grade</span>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="standard">
                                <Select
                                    value={selectedItem}
                                    // onChange={(e) => handleChange(e, "grade")}
                                    onChange={(e) => handleInput(e, "grade")}
                                    displayEmpty
                                    input={
                                        <OutlinedInput
                                            label="select grade"
                                            id="master-expense-placeholder"
                                            startAdornment={
                                                <img src={people} />
                                            }
                                        />
                                    }
                                >
                                    <MenuItem
                                        value=''
                                    >
                                        {fieldValue.grade}
                                    </MenuItem>
                                    {masterExpenseType.map((expense) => (
                                        <MenuItem key={expense.id} value={expense.data}>
                                            {expense.data}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="d-flex column alignItem-start" style={{ width: '30%' }}>
                            <span className="autoSelectLabel">Assign Employee</span>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="standard">
                                <Select
                                    value={selectedItem}
                                    onChange={(e) => handleInput(e, "assignEmp")}
                                    displayEmpty
                                    input={
                                        <OutlinedInput
                                            label="Assign Emp"
                                            id="master-expense-placeholder"
                                            startAdornment={
                                                <img src={people} />
                                            }
                                        />
                                    }
                                >
                                    <MenuItem value='' >
                                        {fieldValue.assignEmp}
                                    </MenuItem>
                                    {masterExpenseType.map((expense) => (
                                        <MenuItem key={expense.id} value={expense.data}>
                                            {expense.data}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex row'>
                <div className='m-5px'>
                    <WhiteCommonButton
                        title={"Cancel"}
                        subTitle={""}
                        buttonClick={() => navigate('/admin/managementProfile')}
                    />
                </div>
                <div className='m-5px'>
                    <BlueCommonButton
                        title={"Save Changes"}
                        subTitle={""}
                        buttonClick={() => setPopup(true)}
                    />
                </div>
            </div>
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"managementEdit"}
                    fileId={1}
                    passTempData={''}
                    buttonClick={() => updateManagementDetails()}
                />
            }
        </div>
    )
}