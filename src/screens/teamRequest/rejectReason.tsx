import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import cross from '../../assets/images/cross.svg';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import send from '../../assets/images/send.svg';
import reject from '../../assets/images/reject.svg';
import { expenseUrl } from '../../service/url.js';
import { useNavigate } from 'react-router-dom';
import { toastContainer, notifySuccess, notifyWarning } from '../../components/toast.js';
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
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
    expenseId:any;
}

export const RejectReason: React.FC<modelProps> = ({ close,expenseId }) => {
    const [open, setOpen] = React.useState(true);
    const [isLoading, setLoading] = useState(false)
    const [responseMessage, setResponseMessage] = useState()
    const [rejectReason,setRejectReason] = useState('')
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empname
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const postRejectReason = async () => {
        setLoading(true)
        const url = expenseUrl.initialUrl + expenseUrl.rejectReason
        const formdata = new FormData();
        formdata.append("expense_id", expenseId);
        formdata.append("rejected_by", user_id);
        formdata.append("rejected_reason", rejectReason);
        const requestOptions = {
            method: 'POST',
            body: formdata,
        };
        await fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('rejectreason api calll:::::', result)
                const ResultStatus = result
                setResponseMessage(result?.message)
                
                if (ResultStatus) {
                    notifySuccess(responseMessage)
                    setOpen(false);
                    navigate('/teamRequest')
                }
                    
            })
            .catch(error => console.log('error', error));
    }
    const validation = () => {
        if (rejectReason === "") {
            notifyWarning("Please enter Reason")
        }
        else {
            postRejectReason()
        }
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                // onClose={() => handleClose()}
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
                                <img src={reject} className='shareMealImg' />
                                <img src={cross} className='crossImg' onClick={() => close()} />
                            </div>
                            <div className='popUpInsideLeftContainer column d-flex lightgray'>
                                <span className='bold1Rem commonBlackcolor'>Write Reason of rejection</span>
                                <div className='d-flex alignItem-end mt-20px bg-white w-90per'>
                                    <textarea
                                        placeholder='Write Your Query here'
                                        className='pb-20px p-1rem border light1Rem'
                                        rows={4}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                    />
                                    <div className=''>
                                        <img src={send} className='' 
                                        onClick={() =>{ 
                                            validation();
                                        }} 
                                        />
                                    </div>
                                </div>
                                {/* <div className='d-flex alignItem-end mt-20px'>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        autoComplete="off"
                                        variant="outlined"
                                        label="Write Your Remarks here"
                                        className='white'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <img src={send} onClick={() => postRejectReason()} className='' />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div> */}

                            </div>
                            {toastContainer()}
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}