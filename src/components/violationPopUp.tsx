import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../assets/images/cross.svg'
import closeArrow from '../assets/images/closeArrow.svg'
import openArrow from '../assets/images/openArrow.svg'
import InputAdornment from '@mui/material/InputAdornment';
import { BlueCommonButton, CancelCommonButton } from "./button.tsx";
import { setData, selectData } from '../Redux/features/login/loginSlicer.js'
import { useSelector, useDispatch } from 'react-redux';
import { initUrl, violation } from "../service/url.js";
import { NewServiceCall } from "../service/config.js";
import { notifyError, notifySuccess, toastContainer } from "./toast.js";
import RadioButtonsGroup from "./radioCustom.js";
import TextField from '@mui/material/TextField';
import bill from '../assets/images/bill.svg'
import LoadingSpinner from './loader.tsx';
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


export const ViolationPopUp = ({ close, data, submitUser }) => {
    const [open, setOpen] = React.useState(true);
    const [radioStatus, setRadioStatus] = useState("")
    const [dataAmount, setDataAmount] = useState('')
    const [selectedId, setSelectedId] = useState<number>();
    const changeTab = (id: number, data: any) => {
        console.log('DataAmount???????????', data)
        setSelectedId(id)
        setDataAmount("")
        setRadioStatus('')
    }
    const [status, setStatus] = useState(false)
    const [remark, setRemark] = useState("")
    const [amountValue, setAmountValue] = useState("")
    const loginStatus = useSelector(selectData);
    const [loading, setLoading] = useState(false)
    const roleName = loginStatus?.role?.role
    console.log('data?????????datadatadata???????', data)
    const acceptRejectViolation = async (type: string, id: number) => {
        const data = {
            user_id: loginStatus.items[0].empcode,
            violation_id: id,
            remark: remark,
            status: type,
            type: radioStatus === "Fully Aproved" ? "full" : radioStatus === "Partialy Aproved" ? "partial" : "",
            amount: amountValue,
            role_id: roleName === "HOD" ? "2" : roleName === "HR" ? '4' : roleName === "Japaness" ? '3' : ""
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + violation.acceptRejectViolation,
            headers: {},
            data: data
        };
        console.log("acceptRejectViolation config>>>", config)
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    notifySuccess(res?.data?.message)
                }
                else {
                    notifyError("Something went wrong!!")
                }
                setRemark("")
                setTimeout(() => {
                    handleRefresh()
                }, 1000)
                console.log("acceptRejectViolation res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("acceptRejectViolation reerrs>>>", err)
            })
    }

    const handleRefresh = () => {
        window.location.reload();
    };
    // const policyfinalAmount = ()=>{
    //     if()
    // }


    return (
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
                    <div className="pl-20px pr-20px pt-10px pb-20px policyVoilationPopUp">
                        <LoadingSpinner loading={loading} />
                        <div className="d-flex row space-between alignItem-center">
                            <div className="bold1Rem commonBlackcolor">Policy Violations
                                <span className="justfyContent-center ml-5px" style={{ backgroundColor: 'red', display: 'inline-flex', height: '25px', width: '25px', borderRadius: '12.5px' }}>
                                    <span className="bold1Rem white">{data?.length}</span>
                                </span>
                            </div>
                            <div className="">
                                <img src={cross} onClick={() => close()} style={{ height: '30px', width: '30px' }} />
                            </div>
                        </div>
                        <hr />
                        {
                            data?.map((violationData, id) =>
                                <div key={id}>
                                    <div>
                                        <div className="d-flex row bgCard curser space-between alignItem-center" onClick={() => changeTab(id, violationData)}>
                                            <div>
                                                <span className="bold0_875Rem">Policy violation against the &nbsp;{violationData?.expense_type} for amount of {violationData?.mgmnt_approved_amount !== null || violationData?.mgmnt_approved_type !== null
                                                    ? violationData?.mgmnt_approved_amount
                                                    : violationData?.hod_approved_amount !== null || violationData?.hod_approved_type !== null
                                                        ? violationData?.hod_approved_amount
                                                        : violationData?.amount
                                                }
                                                </span>
                                                {/* <span className="bold0_875Rem">Expense for &nbsp;{(violationData?.expense_type).toUpperCase()}</span>&nbsp;and&nbsp;
                                                <span className="bold0_875Rem">Sub Expense for &nbsp;{(violationData?.subexpense_type).toUpperCase()}</span>&nbsp; */}
                                            </div>
                                            <div>
                                                <img src={selectedId == id ? openArrow : closeArrow} style={{ width: '20px', height: '20px' }} />
                                            </div>
                                        </div>
                                        {
                                            selectedId === id ?
                                                <div className="d-flex column p-10px">
                                                    {
                                                        <span className="bold0_875Rem commonGraycolor">Limit is {violationData?.limit_amount}</span>
                                                    }
                                                    {violationData?.remark !== null &&
                                                        <span className="bold0_875Rem commonGraycolor">Employee Remark:&nbsp;<span className="light0_875Rem commonGraycolor">{violationData?.remark}</span></span>
                                                    }
                                                    {
                                                        violationData?.hod_remark !== null &&
                                                        <span className="bold0_875Rem commonGraycolor">HOD Remark:&nbsp;<span className="light0_875Rem commonGraycolor">{violationData?.hod_remark}</span></span>
                                                    }
                                                    {
                                                        violationData?.hr_remark !== null &&
                                                        <span className="bold0_875Rem commonGraycolor">HR Remark:&nbsp;<span className="light0_875Rem commonGraycolor">{violationData?.hr_remark}</span></span>
                                                    }
                                                    {
                                                        violationData?.status > 0 || loginStatus.items[0].empcode === submitUser ? null
                                                            :
                                                            <div>
                                                                <RadioButtonsGroup
                                                                    lable={["Fully Aproved", 'Partialy Aproved']}
                                                                    passSelectedValue={(e: string) => {
                                                                        setRadioStatus(e)
                                                                        if (e === "Fully Aproved") {
                                                                            setAmountValue(violationData?.mgmnt_approved_amount !== null || violationData?.mgmnt_approved_type !== null
                                                                                ? violationData?.mgmnt_approved_amount
                                                                                : violationData?.hod_approved_amount !== null || violationData?.hod_approved_type !== null
                                                                                    ? violationData?.hod_approved_amount
                                                                                    : violationData?.amount)
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                    }

                                                    {
                                                        violationData?.status > 0 || loginStatus.items[0].empcode === submitUser ? null :
                                                            <>
                                                                {
                                                                    radioStatus !== "" &&
                                                                    <div className="m-20px">
                                                                        <TextField
                                                                            id="input-with-icon-textfield"
                                                                            label="Amount"
                                                                            placeholder='Enter amount here'
                                                                            disabled={radioStatus === "Fully Aproved" ? true : false}
                                                                            type='number'
                                                                            className='datepicker'
                                                                            InputProps={{
                                                                                startAdornment: (
                                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                                        <img src={bill} />
                                                                                    </InputAdornment>
                                                                                ),
                                                                            }}
                                                                            value={radioStatus === "Fully Aproved" ? violationData?.mgmnt_approved_amount !== null || violationData?.mgmnt_approved_type !== null
                                                                                ? violationData?.mgmnt_approved_amount
                                                                                : violationData?.hod_approved_amount !== null || violationData?.hod_approved_type !== null
                                                                                    ? violationData?.hod_approved_amount
                                                                                    : violationData?.amount : amountValue}
                                                                            onChange={(e) => setAmountValue(e.target.value)}
                                                                            variant="standard"
                                                                        />
                                                                    </div>
                                                                }
                                                            </>
                                                    }

                                                    {
                                                        radioStatus !== "" &&
                                                        <div className="justfyContent-start d-flex row alignItem-center">
                                                            {/* {violationData?.status > 0 || loginStatus.items[0].empcode === submitUser ? null : ( */}
                                                            {violationData?.status > 0 ||loginStatus.items[0].empcode === submitUser ? null : (
                                                                <div className="w-100per">
                                                                    <input
                                                                        type="text"
                                                                        value={remark}
                                                                        onChange={(e) => setRemark(e.target.value)}
                                                                        className="w-100per p-15px inputbox"
                                                                        placeholder="Write your message here"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    {
                                                        radioStatus !== "" &&
                                                        <>
                                                            {violationData?.status > 0 || loginStatus.items[0].empcode === submitUser ? null : (
                                                            <div className="d-flex m-10px justfyContent-end">
                                                                <div className="mr-20px">
                                                                    <BlueCommonButton title="Submit"
                                                                        buttonClick={() => (remark !== "" && amountValue !== "") ? acceptRejectViolation(radioStatus === "Fully Aproved" ? "full" : radioStatus === "Partialy Aproved" ? "partial" : "", violationData?.id) : notifyError("Please enter amount/remarks")}
                                                                    />
                                                                </div>
                                                            </div>
                                                         )} 
                                                        </>
                                                    }
                                                    {/* {violationData?.status > 0 || loginStatus.items[0].empcode === submitUser ? null : (
                                                        <div className="d-flex m-10px justfyContent-end">
                                                            <div className="mr-20px">
                                                                <BlueCommonButton title="Accept" buttonClick={() => acceptRejectViolation("approve", violationData?.id)
                                                                } />
                                                            </div>
                                                            <div>
                                                                <CancelCommonButton title="Reject" buttonClick={() => acceptRejectViolation("reject", violationData?.id)} />
                                                            </div>
                                                        </div>
                                                    )} */}
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                    <hr />
                                </div>
                            )
                        }
                    </div>
                    {toastContainer()}
                </Box>
            </Fade>
        </Modal>
    )
}