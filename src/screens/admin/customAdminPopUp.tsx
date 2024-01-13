import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../../assets/images/cross.svg';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import bill from '../../assets/images/bill.svg'
import upload from '../../assets/images/upload.svg'
import { BlueCommonButton, WhiteCommonButton } from '../../components/button.tsx';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import delete1 from '../../assets/images/delete1.svg'
import { TextBoxReact } from '../../components/textBox.tsx';
import { toastContainer, notifySuccess, notifyError } from '../../components/toast.js';
import DropDownCustom from '../../components/customDropdown.js';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
interface modelProps {
    close: Function;
    popUpType?: string;
    fileId: number;
    data?: any;
    buttonClick?: any;
    getValue?: any;
    hasSubExpense?: any;
    type?: string;
    fileImage?: any;
    passTempData?: any;
    onSubmit?: any;
    buttonType: any;
}

export const CustomAdminPopUp: React.FC<modelProps> = ({ close, popUpType, fileId, data, buttonClick, getValue, hasSubExpense, type, fileImage, onSubmit, passTempData, buttonType }) => {
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = useState('');
    const [fieldImage, setFieldImage] = useState('')
    const [isChecked, setIsChecked] = React.useState(data?.has_subexpense == 'yes' ? true : false);
    const [cityTierValue, setCityTierValue] = useState('')

    const [unitCost, setUnitCost] = useState(false)
    const [MaxDistance, setMaxDistance] = useState(false)
    const [Invoice, setInvoice] = useState(false)
    const [MaxAmount, setMaxAmount] = useState(false)
    const handleChangeSubExpense = (param: string) => {
        if (param === "UnitCost") {
            setUnitCost(!unitCost)
        }
        else if (param === "MaxDistance") {
            setMaxDistance(!MaxDistance)
        }
        else if (param === "Invoice") {
            setInvoice(!Invoice)
        }
        else if (param === "MaxAmount") {
            setMaxAmount(!MaxAmount)
        }
    }

    const [fileData, setFileData] = useState()
    const handleFileChange = (e, fileId) => {
        const fileInput = e.target;
        const file = fileInput.files[0];
        setFieldImage(file.name)
        setFileData(file)
        fileImage(file)
        console.log('handleFileChange fileeeeee:::', file)
    };

    const [age, setAge] = React.useState('');
    const handleChange1 = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };
    const [masterExpenseType, setMasterExpenseType] = useState<any>([])
    const masterExpenseType1 = [
        { id: 1, value: "10", data: "data1" },
        { id: 2, value: "20", data: "data2" },
        { id: 3, value: "30", data: "data3" },
        { id: 4, value: "40", data: "data4" }
    ]
    console.log("passTempData>>", passTempData?.data?.city_tier_name)
    console.log("popUpType>>", popUpType)
    const [cityNameValue, setCityName] = useState("")

    useEffect(() => {
        setMasterExpenseType(passTempData?.tierMasterData)
        setValue(data?.expense_name)
        setGrade(passTempData?.data?.name)
        if (popUpType !== "masterSubExpense") {
            getValue("")
        }
        if (popUpType === "cityList" && passTempData?.type === "edit") {
            setCityTier(passTempData?.data?.city_tier_id)
            setCityName(passTempData?.data?.name)
            setSelectedTier(passTempData?.data?.city_tier_id)
        }
        else if (popUpType === "cityTier" && passTempData?.type === "edit") {
            setCityTierValue(passTempData?.data?.name)
        }
    }, [])

    const [gradeValue, setGrade] = useState("")
    const temp = { data: passTempData?.data, value: gradeValue }
    const handleAddbuttonClick = () => {
        // buttonClick(temp)
        if (popUpType === "masterSubExpense") {
            console.log('fileData?????????', fileData)
            const temp1 = { nameOfSubExpense: value, iconSubExpense: fileData, unitCost: unitCost, maxDistance: MaxDistance, invoice: Invoice, travelType: travelTypeData, maxAmount: MaxAmount }
            onSubmit(temp1)
            if (fileData !== undefined)
                close()
        }
        else if (popUpType == "cityList") {
            // buttonClick({ data: passTempData?.data, value: citytier, cityName: cityNameValue?.replace(/\s/g, '').split(','), type: passTempData?.type, selectedTier: selectedTier })
            buttonClick({ data: passTempData?.data, value: citytier, cityName: cityNameValue, type: passTempData?.type, selectedTier: selectedTier })
            close()
        }
        else if (popUpType == "cityTier") {
            buttonClick({ data: passTempData?.data, value: cityTierValue, cityName: "", type: passTempData?.type })
            close()
        }
        else if (popUpType == "grade") {
            buttonClick({ name: gradeValue, type: passTempData?.type, data: passTempData?.data })
            close()
        }
        else if (popUpType == "masterExpense") {
            if (value === "") {
                notifyError("Please add master expense")
            }
            else {
                buttonClick()
                setValue("")
                console.log("isChecked>>", isChecked)
                if (isChecked === false) {
                    hasSubExpense(false)
                }
                close()
            }
        }
    }
    const handleDelete = () => {
        buttonClick("delete")
        close()
    }
    function handleChange(e) {
        setIsChecked(e.target.checked);
        hasSubExpense(e.target.checked)
    }


    const [citytier, setCityTier] = React.useState('');
    const [selectedTier, setSelectedTier] = useState<any>()
    const handlecityTier = (event) => {
        setCityTier(event);
        const tempSelectedTier = masterExpenseType.filter((selectedRow) => selectedRow.name === event)
        console.log("chck masterExpenseType>>", masterExpenseType)
        console.log("chck tempSelectedTier>>", tempSelectedTier[0]?.id)
        setSelectedTier(tempSelectedTier[0]?.id)
    };
    const [travelTypeData, setTravelTypeData] = useState("Select")
    const travelType = [{ lable: 'local', id: 0 }, { lable: 'domestic', id: 1 },]
    const handleChangeTravel = (event: SelectChangeEvent) => {
        setTravelTypeData(event.target.value)
        console.log("event.target.value>>>", event.target.value)
    };
    const closeAll = () => {
        close()
        setValue("")
    }
    const updateExpense = (expenseName) => {
        getValue(expenseName)
        setValue(expenseName)
    }
    // console.log("pop passTempData>>", passTempData)
    // console.log("pop type>>>", type)
    // console.log("pop getValue>>", value)
    console.log("pop buttonType>>", buttonType)
    console.log("pop getValue>>", getValue)
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <div className=''>
                            {/* header */}
                            <div className='pl-10px pr-10px pt-10px alignItem-center d-flex space-between row'>
                                {
                                    popUpType === "masterExpense" && type === "add" &&
                                    <span className='bold1Rem '>Add Master Expense Type</span>
                                }
                                {
                                    popUpType === "masterExpense" && type === "edit" &&
                                    <span className='bold1Rem '>Edit Master Expense Type</span>
                                }
                                {
                                    popUpType === "masterSubExpense" && type !== 'delete' &&
                                    <span className='bold1Rem '>Add Sub Expense Type</span>
                                }
                                {
                                    popUpType === "cityTier" &&
                                    <span className='bold1Rem '>{passTempData.headerTitle}</span>
                                }
                                {
                                    popUpType === "cityList" &&
                                    <span className='bold1Rem '>{passTempData.headerTitle}</span>
                                }
                                {
                                    popUpType === "grade" &&
                                    <span className='bold1Rem '>{passTempData?.headerTitle}</span>
                                }
                                {
                                    popUpType === "deleteAdminEmployee" &&
                                    <span className='bold1Rem '>{passTempData?.headerTitle}</span>
                                }
                                {
                                    popUpType === "employeeEdit" &&
                                    <span className='bold1Rem '></span>
                                }
                                {
                                    popUpType === "managementEdit" &&
                                    <span className='bold1Rem '></span>
                                }

                                {
                                    popUpType === 'employeeEdit' &&
                                    <span className='bold1Rem '>Alert</span>
                                }
                                {
                                    popUpType !== "deleteExpense" && type !== 'delete' &&
                                    <img src={cross} className='popUp-cross' onClick={() => closeAll()} />
                                }

                            </div>
                            {
                                popUpType !== "deleteExpense" && type !== 'delete' &&
                                <hr />
                            }
                            {/* body */}
                            <div className='p-10px overflow'>
                                {
                                    popUpType == "masterExpense" && type !== "delete" &&
                                    <div className='d-flex row alignItem-center '>
                                        <div className='p-10px'>
                                            <TextField
                                                id="input-with-icon-textfield"
                                                label={'Name of Master Expense'}
                                                multiline={false}
                                                maxRows={4}
                                                value={value}
                                                placeholder="i.e. Travel,meal,"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <img src={bill} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{ maxLength: 250 }}
                                                variant="standard"
                                                onChange={(e) => {
                                                    updateExpense(e.target.value)
                                                    // setValue(e.target.value)
                                                    // getValue(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <input value="test" type="checkbox" id='hasSubExpenseCheckbox' onChange={handleChange} checked={isChecked} />
                                        <label className='checkBoxText' htmlFor='hasSubExpenseCheckbox' >Has Sub-expense type</label>
                                    </div>
                                }
                                {
                                    popUpType === "masterSubExpense" && type !== 'delete' &&
                                    <div >
                                        {
                                            getValue?.currentrow?.expense_name === "Travel" ?
                                                <div>
                                                    <span className="bold1Rem commonBlackcolor">Select Travel Type</span>
                                                    <div>
                                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                            <Select
                                                                value={travelTypeData}
                                                                onChange={handleChangeTravel}
                                                                displayEmpty
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                                {travelType.map((trv) => (
                                                                    <MenuItem key={trv.id} value={trv.lable}>
                                                                        {trv.lable}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                        }
                                        <div className='d-flex row p-10px overflow'>
                                            <div className='d-flex'>
                                                <TextField
                                                    id="input-with-icon-textfield"
                                                    multiline={false}
                                                    label="Name of Sub-Expense"
                                                    maxRows={4}
                                                    value={value}
                                                    placeholder="i.e. Auto, taxi,"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <img src={bill} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    inputProps={{ maxLength: 250 }}
                                                    variant="standard"
                                                    onChange={(e) => {
                                                        setValue(e.target.value)

                                                    }}
                                                />
                                            </div>
                                            <div className="m-10px">
                                                <label
                                                    htmlFor={`contained-button-meal-file-${fileId}`}
                                                >
                                                    <div className="white d-flex alignItem-center curser dotted-border p-5px">
                                                        <img src={upload} className="ml-5px mr-5px" />
                                                        <span className="light0_813Rem ml-5px mr-5px commonBlackcolor">{fieldImage ? fieldImage : "Upload icon for sub expense category"}</span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: "none" }}
                                                        id={`contained-button-meal-file-${fileId}`}
                                                        onChange={(e) => handleFileChange(e, fileId)}
                                                    />
                                                </label>
                                            </div>
                                        </div>


                                        <div className='d-flex row overflow checkbox-container '>
                                            <div className='m-10px'>
                                                <input value="UnitCost" type="checkbox" onChange={() => handleChangeSubExpense("UnitCost")} checked={unitCost} />
                                                <span className='checkBoxText ml-5px'>Unit Cost </span>
                                            </div>
                                            <div className='m-10px'>
                                                <input value="MaxDistance" type="checkbox" onChange={() => handleChangeSubExpense("MaxDistance")} checked={MaxDistance} />
                                                <span className='checkBoxText ml-5px'>Maximum distance</span>
                                            </div>
                                            <div className='m-10px'>
                                                <input value="Invoice" type="checkbox" onChange={() => handleChangeSubExpense("Invoice")} checked={Invoice} />
                                                <span className='checkBoxText ml-5px'>Invoice</span>
                                            </div>
                                            <div className='m-10px'>
                                                <input value="MaxAmount" type="checkbox" onChange={() => handleChangeSubExpense("MaxAmount")} checked={MaxAmount} />
                                                <span className='checkBoxText ml-5px'>Maximum Amount</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "cityTier" && passTempData?.type !== "delete" &&
                                    <div className='d-flex row alignItem-center p-10px'>
                                        <div className='d-flex'>
                                            <TextBoxReact
                                                multiline={false}
                                                labelText="Name of City Expense"
                                                img={<img src={bill} />}
                                                onchangeText={(e: any) => setCityTierValue(e.target.value)}
                                                value={cityTierValue}
                                                placeholder="i.e. Tier1, Tier2,"
                                            />
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "cityList" && passTempData?.type !== "delete" &&
                                    <div className='d-flex row alignItem-center '>
                                        <div className='d-flex p-10px alignItem-center'>
                                            <DropDownCustom
                                                icon={""}
                                                lable="Select city tier"
                                                data={masterExpenseType}
                                                selectedValue={passTempData?.data?.city_tier_name}
                                                setValue={(e:any)=> handlecityTier(e)}
                                                viewKeyName="name"
                                            />
                                        </div>
                                        <div className='d-flex'>
                                            <TextBoxReact
                                                multiline={false}
                                                labelText="Name of City"
                                                img={<img src={bill} />}
                                                onchangeText={(e: any) => setCityName(e.target.value)}
                                                placeholder="i.e. Travel, meal,"
                                                value={cityNameValue}
                                            />
                                        </div>

                                    </div>
                                }
                                {
                                    popUpType === "grade" && passTempData?.type !== "delete" &&
                                    <div className='d-flex row alignItem-center '>
                                        <div className='d-flex'>
                                            <TextBoxReact
                                                multiline={false}
                                                labelText="Name of Grade"
                                                img={<img src={bill} />}
                                                onchangeText={(e: any) => setGrade(e.target.value)}
                                                placeholder="Enter grade name"
                                                value={gradeValue}
                                            />
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "deleteExpense" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this expense? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => console.log()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    popUpType == "masterExpense" && type === "delete" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this Master expense? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "masterSubExpense" && type === "delete" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this Master sub expense? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    popUpType == "employeeEdit" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to Edit this Employee data? </div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Yes"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "managementEdit" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to Edit this Management data? </div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Yes"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    popUpType == "deleteAdminEmployee" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this Employee data? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType === 'cityList' && passTempData?.type === "delete" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this City list? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType === 'cityTier' && passTempData?.type === "delete" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this City tier? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => close()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    popUpType == "grade" && passTempData?.type === "delete" &&
                                    <div className='d-flex justfyContent-center column alignItem-center textAlign-Center'>
                                        <img src={delete1} className='deleteButton' />
                                        <div>
                                            <div className='bold1Rem commonGraycolor'>Are you sure you want to delete this Grade? </div>
                                            <div className='light1Rem commonGraycolor'>This action cannot be undone.</div>
                                        </div>
                                        <div className='d-flex row'>
                                            <div className='m-5px'>
                                                <WhiteCommonButton
                                                    title={"Cancel"}
                                                    subTitle={""}
                                                    buttonClick={() => console.log()}
                                                />
                                            </div>
                                            <div className='m-5px'>
                                                <BlueCommonButton
                                                    title={"Delete"}
                                                    subTitle={""}
                                                    buttonClick={() => handleDelete()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }


                            </div>
                            {/* footer */}
                            {
                                popUpType !== "deleteExpense" && passTempData?.type !== "delete" && popUpType !== 'employeeEdit' && type !== "delete" && popUpType !== "masterExpense" && popUpType !== "grade" && popUpType !== "cityList" &&
                                <hr />

                            }
                            {
                                popUpType !== "deleteExpense" && passTempData?.type !== "delete" && popUpType !== 'employeeEdit' && type !== "delete" && popUpType !== "masterExpense" && popUpType !== "grade" && popUpType !== "cityList" &&
                                <div className='p-10px d-flex justfyContent-end'>
                                    <BlueCommonButton
                                        title={buttonType === "ADD" ? "ADD" : "Update"}
                                        subTitle={""}
                                        buttonClick={() => handleAddbuttonClick()}
                                    />
                                </div>
                            }
                            {
                                popUpType !== "deleteExpense" && passTempData?.type !== "delete" && popUpType !== 'employeeEdit' && type !== "delete" && popUpType === "masterExpense" && popUpType !== "grade" && popUpType !== "cityList" &&
                                <div className='p-10px d-flex justfyContent-end'>
                                    <BlueCommonButton
                                        title={buttonType === "add" ? "ADD" : "Update"}
                                        subTitle={""}
                                        buttonClick={() => handleAddbuttonClick()}
                                    />
                                </div>
                            }
                            {
                                (popUpType === "grade" || popUpType === "cityList") && passTempData?.type !== "delete" && type !== "delete" &&
                                <div className='p-10px d-flex justfyContent-end'>
                                    <BlueCommonButton
                                        title={passTempData?.type === "new" ? "ADD" : "Update"}
                                        subTitle={""}
                                        buttonClick={() => handleAddbuttonClick()}
                                    />
                                </div>
                            }
                        </div>
                    </Box>
                </Fade>
            </Modal>
            {toastContainer()}
        </div>
    );
}