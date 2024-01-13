import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import cross from '../assets/images/cross.svg';

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
    data: any
}
export const TagPopup: React.FC<modelProps> = ({ close, data }) => {
    const [open, setOpen] = React.useState(true);
    const [empTag, setempTag] = useState()
    console.log("TagPopup data>>", data)
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
                        <div className='d-flex column'>
                            <div className='pl-10px pr-10px pt-10px alignItem-center d-flex space-between row'>
                                <span className='bold1Rem commonBlackcolor m-10px'>List of tag team members</span>
                                <img src={cross} className='popUp-cross' onClick={() => close()} />
                            </div>
                            <div className='tagContainer'>
                                {
                                    data?.map((people: string, id) =>
                                        <div key={id} className='m-10px tagCard d-flex'>
                                            <span className='p-15px light1Rem'>{people ? people : ''}</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}