import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../assets/images/cross.svg';
import avatar from '../assets/images/Avatar.svg';
import deleted from '../assets/images/deleted.svg';
import './taglistPopup.css'
import { BlueCommonButton, WhiteCommonButton } from './button.tsx';
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
}

export const TaglistPopup: React.FC<modelProps> = ({ close }) => {
    const status = [
        { id: 0, image: avatar, name: 'Phoenix Baker', deleted: deleted },
        { id: 1, image: avatar, name: 'Phoenix Baker', deleted: deleted },
        { id: 2, image: avatar, name: 'Phoenix Baker', deleted: deleted },
        { id: 3, image: avatar, name: 'Phoenix Baker', deleted: deleted },
        { id: 4, image: avatar, name: 'Phoenix Baker', deleted: deleted },
    ]
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => handleClose()}
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
                            <div className=''>
                                <img src={cross} className='crossImg' onClick={() => handleClose()} />
                            </div>
                            <div className='editpopUpContainer justfyContent-center alignItems-center '>
                                <div className='m-1_5rem'>
                                    <span className='bold1Rem commonBlackcolor mt-40px'>List of tag team members</span>
                                </div>
                                {status.map((item) => (
                                    <div className='d-flex list_vw'>
                                        <div className='d-flex textAlign-Center alignItem-center'>
                                            <img src={item.image} className="p-5px statusImg" />
                                            <div>
                                                <span className="gray1 light1Rem textAlign-Center">{item.name}</span>
                                            </div>
                                        </div>
                                        <div className='d-flex row'>
                                            <img src={item.deleted} className="p-10px statusImg" />
                                        </div>
                                    </div>
                                ))}
                                <div className='d-flex m-10px alignSelf-end'>
                                    <div className='m-10px'>
                                    <WhiteCommonButton
                                        title={"Add More"}
                                        subTitle={""}
                                    />
                                    </div>
                                    <div className='m-10px'>
                                    <BlueCommonButton 
                                    title={'Save'} 
                                    subTitle={""}
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