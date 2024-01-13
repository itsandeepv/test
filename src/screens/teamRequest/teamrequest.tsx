import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import cross from '../../assets/images/cross.svg';
import { BlueCommonButton } from '../../components/button.tsx';
import amount from '../../assets/images/travel/amount.svg'
import money from '../../assets/images/money.svg'
import { expenseUrl } from '../../service/url.js';
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import axios from 'axios';
import LoadingSpinner from '../../components/loader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import description from '../../assets/images/description.svg'


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
    description: any,
    type: string,
    status: string,
    data: any,
    finalAmount: any,
    typeState: any
}

export const TeamRequestScreen: React.FC<modelProps> = ({ close, type, data, finalAmount, typeState }) => {
    console.log('amount ???????????', finalAmount)
    console.log('type ???????????', type)
    const navigate = useNavigate();
    const [approvedAmount, setApprovedAmount] = useState()
    const [responseMessage, setResponseMessage] = useState()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(true);
    const [remark, setRemark] = useState('')
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empcode

    const postApproveAmount = async () => {
        // setLoading(true)
        const url = expenseUrl.initialUrl + expenseUrl.expenseApprove
        const formdata = new FormData();
        formdata.append("expense_id", data[0]?.id);
        formdata.append("user_id", user_id);
        formdata.append("approved_amount", type === 'partial' ? approvedAmount : finalAmount);
        formdata.append("remark", remark);
        formdata.append("type", type === 'partial' ? type : "full")
        try {
            setLoading(true)
            const response = await axios.post(url, formdata)
                .then((res) => {
                    setLoading(false)
                    if (res.status === 200) {
                        console.log("here....")
                        setResponseMessage(res?.data?.message)
                        notifySuccess(res?.data?.result?.message)
                        setOpen(false)
                        setTimeout(() => {
                            navigate('/teamrequest')
                        }, 1000)
                    }
                    else {
                        notifyError(res?.data?.result?.message)
                    }
                    console.log('expenseapproverequest :::::', res)
                })
                .catch((err) => {
                    setLoading(false)
                    console.log("err>>", err)
                })
        }
        catch (error) {
            setLoading(false)
            console.log('expenseapproverequest::error', error)
        }
    }
    console.log("type>>", type)
    return (
        <div>
            {
                loading ? <LoadingSpinner loading={loading} /> :
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
                                <div className='d-flex popUpContainer'>
                                    <div className='popUpInsideRightContainer'>
                                        <img src={money} className='shareMealImg' />
                                    </div>
                                    <div className='raiseQueryPopup'>
                                        <div className='d-flex justfyContent-end row curser'>
                                            <img src={cross} className='crossImgRelative' onClick={() => close()} />
                                        </div>
                                        <div className='d-flex column'>
                                            <span className='bold1Rem commonBlackcolor'>Request of Expense amount approval</span>
                                            <span className='light0_813Rem commonGraycolor'>{data[0].description}</span>
                                            <span className='mt-10px commonBlackcolor bold1Rem'>Total Requested amount: {finalAmount}</span>
                                            {
                                                typeState === "Partially Approve Request" &&
                                                <div className='d-flex mt-20px'>
                                                    <TextField
                                                        variant="standard"
                                                        placeholder='Enter your Remarks here'
                                                        type='string'
                                                        fullWidth
                                                        multiline={true}
                                                        maxRows={10}
                                                        value={remark}
                                                        onChange={(e: any) => {
                                                            setRemark(e.target.value)
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" className="curser">
                                                                    <img src={description} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            }
                                            {type === 'partial' &&
                                                <div className='d-flex alignItem-end mt-20px'>
                                                    <TextField
                                                        label="Amount" variant="standard"
                                                        placeholder='Enter amount'
                                                        type='number'
                                                        disabled={typeState === "Partially Approve Request" ? false : true}
                                                        value={typeState === "Partially Approve Request" ? approvedAmount : finalAmount}
                                                        onChange={(e: any) => {
                                                            setApprovedAmount(e.target.value)
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <img src={amount} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            }
                                            <div className='popUpInsideLeftContainer column d-flex'>
                                                <BlueCommonButton
                                                    title={"Approve"}
                                                    buttonClick={() => {
                                                        if (type === 'partial' && (approvedAmount === '' || approvedAmount === undefined)) {
                                                            notifyError('Please enter amount or remarks')
                                                        } else {
                                                            postApproveAmount()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {toastContainer()}
                                </div>
                            </Box>

                        </Fade>
                    </Modal>
            }
        </div>
    );
}