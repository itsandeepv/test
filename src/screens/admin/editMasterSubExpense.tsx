import React, { useEffect, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import bill from '../../assets/images/bill.svg'
import upload from '../../assets/images/upload.svg'
import { TextBoxReact } from '../../components/textBox.tsx'
import { useLocation, useNavigate } from 'react-router-dom';
import { CancelCommonButton, BlueCommonButton } from "../../components/button.tsx";
import { admin, initUrl, expenseUrl } from '../../service/url.js';
import { NewServiceCall } from '../../service/config.js';
import DataNotFound from "../../components/dataNotFound.tsx";
import LoadingSpinner from "../../components/loader.tsx";
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
const editSubExpense = "Edit Sub Expense Type - "
const editSubExpenseDetails = "Here is the compiled list of created category of sub-expense."

export const EditMasterSubExpense = () => {
    const { state } = useLocation();
    const [updateData, setUpdateData] = useState<any>(state.data.subexpense_name); // this is for pass to update
    const [expense_name, setexpense_name] = useState(state.data.expense_name)
    const [travel_type, setTravel_type] = useState()
    const travelType = [{ lable: 'local', id: 0 }, { lable: 'domestic', id: 1 },]
    const [sub_expenses, setsub_expenses] = useState<any>([state?.currentData ? state?.currentData : []])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    console.log("EditMasterSubExpense state>>", state.currentData)
    const handleChangeTravel = (value, index, field) => {
        console.log("updateNameSubExpense>>", value)
        const temp = [...sub_expenses]
        console.log("temp>>", temp)
        const sample = temp.map((item, id) => {
            if (id === index) {
                return { ...item, [field]: value }
            }
            else {
                return item
            }
        })
        setsub_expenses(sample)
        setUpdateData(sample)
        setTravel_type(value)
    };
    const updateMasterSubExpense = async () => {
        setLoading(true)
        const formdata = new FormData();
        formdata.append("expense_id", sub_expenses[0]?.expense_id);
        formdata.append("subexpense_id", sub_expenses[0]?.id);
        formdata.append("subexpense_name", sub_expenses[0]?.subexpense_name);
        formdata.append("has_unit_cost", sub_expenses[0]?.has_unit_cost);
        formdata.append("has_max_distance", sub_expenses[0]?.has_max_distance);
        formdata.append("has_invoice", sub_expenses[0]?.has_invoice);
        formdata.append("has_max_amount", sub_expenses[0]?.has_max_amount);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.singleEditMasterSubExpense,
            headers: {},
            data: formdata
        };
        console.log("updateMasterSubExpense config>>", config)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                console.log("updateMasterSubExpense res>>>", res)
                navigate('/admin/masterSubExpense')
            })
            .catch((err) => {
                notifyWarning("Something went wrong")
        setLoading(false)
                console.log("updateMasterSubExpense err>>>", err)
            })
    }

    const updateNameSubExpense = (value, index, field) => {
        console.log("updateNameSubExpense>>", value)
        const temp = [...sub_expenses]
        console.log("temp>>", temp)
        const sample = temp.map((item, id) => {
            if (id === index) {
                return { ...item, [field]: value }
            }
            else {
                return item
            }
        })
        setsub_expenses(sample)
        setUpdateData(sample)
    }

    const updateNameSubExpenseForIcon = (value, index, field) => {
        console.log("updateNameSubExpenseForIcon value>>", value)
        console.log("updateNameSubExpenseForIcon field>>", field)
        const temp = [...sub_expenses]
        const sample = temp.map((item, id) => {
            if (id === index) {
                return { ...item, [field]: value }
            }
            else {
                return item
            }
        })
        setUpdateData(sample)
        console.log("updateNameSubExpenseForIcon sample>>", sample)
    }
    const handleFileChange = (event: any, id: any) => {
        const file = event.target.files[0];
        updateNameSubExpenseForIcon(file, id, "icon")
    };
    console.log("expense_name>>", expense_name)
    console.log("EditMasterSubExpense updateData>>", updateData)
    return (
        <div>
            <LoadingSpinner loading={loading} />
            {
                state?.data ?
                    <>
                        <div className='m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                            <span className="bold1Rem commonBlackcolor">{editSubExpense}&nbsp;</span><span className="commonGraycolor light1Rem">{editSubExpenseDetails}</span>
                        </div>
                        <div className="moduleBorderWithoutPadding">
                            <div className="d-flex row alignItem-start p-10px">
                                <div>
                                    <span className="light1Rem flentBlack pl-10px">Select Master Expense</span>
                                    <div>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <Select
                                                value={expense_name}
                                                displayEmpty
                                                disabled
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value={expense_name} >
                                                    {expense_name}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                {
                                    sub_expenses?.map((itemData, id) =>
                                        <div className="">
                                            <div className='d-flex row p-18px alignItem-center'>
                                                <div className='d-flex'>
                                                    <TextBoxReact
                                                        multiline={false}
                                                        labelText="Name of Sub-Expense"
                                                        img={<img src={bill} />}
                                                        onchangeText={(e: any) => updateNameSubExpense(e.target.value, id, "subexpense_name")}
                                                        placeholder="i.e. Auto, taxi,"
                                                        value={itemData.subexpense_name}

                                                    />
                                                </div>
                                                {expense_name === 'Travel' &&
                                                    <div className='m-20px'>
                                                        <span className="light1Rem flentBlack pl-10px">Select Travel Type</span>
                                                        <div>
                                                            <FormControl sx={{ minWidth: 120 }} size="small">
                                                                <Select
                                                                    value={itemData.travel_type ? itemData.travel_type : travel_type}
                                                                    onChange={(e: any) => handleChangeTravel(e.target.value, id, "travel_type")}
                                                                    displayEmpty
                                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                                >{travelType.map((trv, id) => (
                                                                    <MenuItem key={trv.id} value={trv.lable} >
                                                                        {trv.lable}
                                                                    </MenuItem>
                                                                ))}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="imgBg">
                                                    <img src={expenseUrl.initialUrl + '/' + itemData.icon} className="imgBg" />
                                                </div>
                                                <div className="m-10px">
                                                    <label
                                                        htmlFor={`contained-button-meal-file-${id}`}
                                                    >
                                                        <div className="white d-flex alignItem-center curser dotted-border">
                                                            <img src={upload} className="ml-5px mr-5px" />
                                                            <span className="light0_813Rem ml-5px mr-5px commonBlackcolor">Upload icon for sub expense category</span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            id={`contained-button-meal-file-${id}`}
                                                            onChange={(e) => handleFileChange(e, id)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='d-flex row p-10px'>
                                                <div className='m-5px'>
                                                    <input value="test" type="checkbox" id="unitCostcheckbox"
                                                        onChange={(e: any) => updateNameSubExpense(itemData.has_unit_cost === "yes" ? "no" : "yes", id, "has_unit_cost")}
                                                        checked={itemData.has_unit_cost === "yes" ? true : false}
                                                    />
                                                    <label className="checkBoxText ml-5px" htmlFor="unitCostcheckbox">Unit Cost </label>
                                                </div>
                                                <div className='m-5px'>
                                                    <input value="test" type="checkbox" id="maximumcheckbox"
                                                        onChange={(e: any) => updateNameSubExpense(itemData.has_max_distance === "yes" ? "no" : "yes", id, "has_max_distance")}
                                                        checked={itemData.has_max_distance === "yes" ? true : false} />
                                                    <label className="checkBoxText ml-5px" htmlFor="maximumcheckbox">Maximum distance</label>
                                                </div>
                                                <div className='m-5px'>
                                                    <input value="test" type="checkbox" id="maxamountcheckbox"
                                                        onChange={(e: any) => updateNameSubExpense(itemData.has_max_amount === "yes" ? "no" : "yes", id, "has_max_amount")}
                                                        checked={itemData.has_max_amount === "yes" ? true : false} />
                                                    <label className="checkBoxText ml-5px" htmlFor="maxamountcheckbox">Maximum Amount</label>
                                                </div>
                                                <div className='m-5px'>
                                                    <input value="test" type="checkbox" id="invoicecheckbox"
                                                        onChange={(e: any) => updateNameSubExpense(itemData.has_invoice === "yes" ? "no" : "yes", id, "has_invoice")}
                                                        checked={itemData.has_invoice === "yes" ? true : false} />
                                                    <label className="checkBoxText ml-5px" htmlFor="invoicecheckbox">Invoice</label>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    )
                                }
                            </div>
                            <div className='d-flex justfyContent-end row'>
                                <div className='ml-20px '>
                                    <CancelCommonButton title="Cancel" buttonClick={() => navigate('/admin/masterSubExpense')} />
                                </div>
                                <div className='ml-20px mr-20px'>
                                    <BlueCommonButton title="Update" subTitle=""
                                        buttonClick={() => updateMasterSubExpense()}
                                    // buttonClick={() => test()} 
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    loading === false ?
                        <DataNotFound />
                        :
                        ""
            }
            {toastContainer()}
        </div>
    )
}