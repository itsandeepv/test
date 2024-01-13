import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../../assets/images/cross.svg';
import { BlueCommonButton } from '../../components/button.tsx';
import raisequery from '../../assets/images/raisequery.svg'
import send from '../../assets/images/send.svg'
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast';
import { initUrl, expenseQuery } from '../../service/url.js'
import { ServiceCall } from '../../service/config.js';
import LoadingSpinner from "../../components/loader.tsx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    expenseID: any;
}

export const RaiseQueryScreen: React.FC<modelProps> = ({ close, expenseID }) => {
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const [isLoading, setLoading] = useState(false)
    const handleClose = () => setOpen(false);
    const [reason, setReason] = useState("")
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empcode
    const handleQueryReason = (reason: any) => {
        setReason(reason)
    }
    const navigate = useNavigate();

    const createQuery = async () => {
        setLoading(true)
        const url = initUrl + expenseQuery.createQuery
        const formData = new URLSearchParams();
        formData.append('expense_id', expenseID);
        formData.append('query_id', '0');
        formData.append('sender_id', user_id);
        formData.append('query_text', reason);
        await ServiceCall(url, formData, false)
            .then((res) => {
                console.log("res>>", res)
                if (res.responseCode === 200) {
                    notifySuccess(res?.message)
                    setOpen(false)
                    navigate('/teamRequest')
                }
                else {
                    notifyError(res?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("createQuery err>>", err)
            })
    }

    const validation = () => {
        if (reason === "") {
            notifyWarning("Please enter Query")
        }
        else {
            createQuery()
        }
    }

    return (
        <div>
            {
                isLoading ? <LoadingSpinner loading={isLoading} />
                    :
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
                                        <img src={raisequery} className='shareMealImg' />
                                        <img src={cross} className='crossImg' onClick={() => close()} />
                                    </div>
                                    <div className='popUpInsideLeftContainer column d-flex flex-wrap'>
                                        <span className='bold1Rem commonBlackcolor'>Raise A Query</span>
                                        <div className='d-flex row mb-30px mt-20px'>
                                            <BlueCommonButton title={`Ticket" ${'ticket'}`} />
                                            <div className='d-flex row alignItem-center ml-20px'>
                                                <span className=' commonBlackcolor  bold1Rem'>Topic :</span>
                                                <span className=' commonBlackcolor regular0_813Rem' >{expenseID}</span>
                                            </div>
                                        </div>
                                        <div className='d-flex alignItem-end mt-20px bg-white w-90per'>
                                            <textarea
                                                placeholder='Write Your Query here'
                                                className='pb-20px p-1rem border light1Rem'
                                                rows={4}
                                                onChange={(e) => handleQueryReason(e.target.value)}
                                            />
                                            <div className=''>
                                                <img src={send} className='' onClick={() => validation()} />
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
