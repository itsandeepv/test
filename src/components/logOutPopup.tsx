import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../assets/images/cross.svg'
import { CancelCommonButton, BlueCommonButton } from './button.tsx'
import { Link, useNavigate } from 'react-router-dom';
import { setData, selectData,setLoginStatus } from '../Redux/features/login/loginSlicer'
import { useDispatch,useSelector } from 'react-redux';

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
    close: any
}

export const LogOutPopup: React.FC<modelProps> = ({close }) => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout=()=>{
        dispatch(setLoginStatus(false))
        navigate('./')
        close()
    }
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
                        <div className='d-flex column logOutPopupStyle'>
                            <div className='d-flex row justfyContent-end'>
                                <img src={cross} style={{height:'30px', width:'30px'}} className='curser' onClick={close}/>
                            </div>
                            <div className='column d-flex'>
                                <span className='bold1Rem commonBlackcolor'>Are you sure want to signout ?</span>
                            </div>
                            <div className='d-flex justfyContent-end row'>
                                <div className='ml-20px '>
                                    <CancelCommonButton title="Cancel" buttonClick={()=> close()}/>
                                </div>
                                <div className='ml-20px mr-20px'>
                                    <BlueCommonButton title="Yes" subTitle="" buttonClick={()=>handleLogout()}/>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}