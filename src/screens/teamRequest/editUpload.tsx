import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import cross from '../../assets/images/cross.svg';
import uploadicon from '../../assets/images/UploadCloud.svg'
import './editUploadStyle.css'
import crossIcon from '../../assets/images/crosssmall.svg'

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
    fileId: any,
    data: any,
    parkingID: any,
    passidType: any,
    file: any,
}

export const EditUpload: React.FC<modelProps> = ({ close, fileId, data, parkingID, passidType }) => {
    const [open, setOpen] = React.useState(true);
    const [dataFile, setDataFile] = useState({ file: "", fileid: '', parkingiD: parkingID, type: passidType?.typeData ? passidType?.typeData : "", fieldName: passidType?.fieldValue ? passidType?.fieldValue : "", uid: passidType.uidData, pid: passidType.pidData,fileName:'' })
    const handleClose = () => {
        setOpen(false);
        close()
    }
    const [fileName, setFileName] = useState("")

    const handleMealFileChange = (e, id) => {
        setFileName(e.name)
        var reader = new FileReader();
        reader.readAsDataURL(e);
        console.log("reader drag>>",reader)
        reader.onload = function () {
            setDataFile({ file: reader?.result, fileid: id, parkingiD: parkingID, type: passidType?.typeData ? passidType?.typeData : "", fieldName: passidType?.fieldValue ? passidType?.fieldValue : "", uid: passidType.uidData, pid: passidType.pidData,fileName:fileName })
        }
        reader.onerror = function (error) {
            console.log('handleMealFileChange1 Error: ', error);
        };
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;

        if (files.length > 0) {
            const file = files[0];
            handleMealFileChange(file, fileId);
        }
    };

    const handleMealFileChange1 = (e, fileId) => {
        const fileInput = e.target;
        const file = fileInput.files[0];
        setFileName(file.name)
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setDataFile({ file: reader?.result, fileid: fileId, parkingiD: parkingID, type: passidType?.typeData ? passidType?.typeData : "", fieldName: passidType?.fieldValue ? passidType?.fieldValue : "", uid: passidType.uidData, pid: passidType.pidData })
        };
        reader.onerror = function (error) {
            console.log('handleMealFileChange1 Error: ', error);
        };
    };

    const submitFile = () => {
        data(dataFile)
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
                        <div className='d-flex justfyContent-center'>
                            <div className=''>
                                <img src={cross} className='crossImg' onClick={() => close()} />
                            </div>
                            <div className='editpopUpContainer column d-flex alignItem-center '>
                                <span className='bold1Rem commonBlackcolor mt-40px'>Upload Invoice</span>
                                <div className='d-flex mt-20px p-1rem box column textAlign-Center w-40vw' onDragOver={handleDragOver} onDrop={handleDrop}>
                                    <label
                                        htmlFor={`contained-button-meal-file-${fileId}`}
                                    >
                                        <img src={uploadicon} className='uploadicon' />
                                        <div>
                                            <span className='light0_813Rem commonGraycolor'>Drag & drop files or </span>
                                            <span className='light0_813Rem mainColor'>Browse</span>
                                        </div>
                                        <span className='light0_813Rem commonGraycolor'>Supported formates: JPEG, PNG, PDF</span>
                                    </label>
                                </div>
                                <div className='upload_text'>
                                    <span className='bold1Rem commonGraycolor'>Uploading</span>
                                </div>
                                <div className='uploadingBox d-flex row'>
                                    {/* <span className='light0_813Rem commonGraycolor'>{dataFile.file.name  fileName}</span> */}
                                    <span className='light0_813Rem commonGraycolor'>{fileName}</span>
                                    <img src={crossIcon} className='crossicon' />
                                </div>
                                <div className='uploadbutton' onClick={() => submitFile()}>
                                    <span className='bold1Rem white'>Upload Files</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/svg,application/pdf"
                                // accept="image/*"
                                style={{ display: "none" }}
                                id={`contained-button-meal-file-${fileId}`}
                                onChange={(e) => handleMealFileChange1(e, fileId)}
                            />
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}