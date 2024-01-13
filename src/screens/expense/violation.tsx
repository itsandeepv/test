import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import mealImg from '../../assets/images/mealImg.svg'
import './shareMealPopupStyles.css'
import TextField from '@mui/material/TextField';
import search from '../../assets/images/search1.svg'
import cross from '../../assets/images/cross.svg';
import InputAdornment from '@mui/material/InputAdornment';
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import { BlueCommonButton, CancelCommonButton } from '../../components/button.tsx';
import LoadingSpinner from '../../components/loader.tsx';
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
    submit: any;
    data: any
}

export const ViolationPopup: React.FC<modelProps> = ({ close, data, submit }) => {
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [empTag, setempTag] = useState()
    const [remarksValue, setRemarks] = useState("")
    const addsubmit = () => {
        close({ remarks: remarksValue, dataValue: data , type: "not"})
        submit({ remarks: remarksValue, dataValue: data })
    }
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                // onClose={() => close()}
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
                        {/* <LoadingSpinner loading={isLoading} /> */}
                        <div className='d-flex column'>
                            <div className='pl-10px pr-10px pt-10px alignItem-center d-flex space-between row'>
                                <span className='bold1Rem commonBlackcolor'>Violation Alert</span>
                                <img src={cross} className='popUp-cross' onClick={() => close({ remarks: remarksValue, dataValue: data,type: "close" })} />
                            </div>
                            <div className='p-20px'>
                                <div>Your Limit is <span className='bold1Rem commonBlackcolor'>{data.limit} &nbsp;</span>per unit</div>
                                <div>Please Enter the Remark here..</div>
                            </div>
                            <div className='p-20px'>
                                <div className='d-flex'>
                                    <TextField
                                        id={`input-remark-textfield`}
                                        label={"Remark"}
                                        type={"string"}
                                        className='w-100per'
                                        multiline
                                        maxRows={4}
                                        placeholder={`Enter Remarks here`}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" className='ml-10px'>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="standard"
                                        value={remarksValue}
                                    />
                                </div>
                                <div className='d-flex row justfyContent-end mt-20px'>
                                    <div>
                                        <CancelCommonButton title={"Cancel"}
                                            buttonClick={() => close({ remarks: remarksValue, dataValue: data, type: "close" })}
                                        />
                                    </div>
                                    <div className='ml-5px'>
                                        <BlueCommonButton title={"Submit"}
                                            subTitle={""}
                                            buttonClick={() => addsubmit()}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}