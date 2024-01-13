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
import MenuItem from '@mui/material/MenuItem';
import search from '../../assets/images/search1.svg'
import Autocomplete from '@mui/material/Autocomplete';
import cross from '../../assets/images/cross.svg';
import { admin, initUrl } from '../../service/url.js';
import { NewServiceCall } from '../../service/config.js';
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
    passId: any;
    data: any
}

export const ShareMealPopup: React.FC<modelProps> = ({ close, passId, data }) => {
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [empTag,setempTag] = useState()
    const [empData, setEmpData] = useState<any>([])
    const [mealWithWhome, setMealWithWhome] = useState(undefined)
    const [isLoading, setLoading] = useState(false)
    const onChangeValue = (event: any) => {
        setMealWithWhome(event.target.value)
    }
    useEffect(() => {
        getadminEmployeeList()
    }, [])

    const getadminEmployeeList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.employee,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setEmpData(res?.data?.result ? res?.data?.result : [])

                }
                else {
                    setEmpData([])
                    notifyError("Something went wrong!")
                }
                console.log("getgetadminEmployeeListGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setEmpData([])
                console.log("getadminEmployeeList reerrs>>>", err)
            })
    }
    const handleTeamMemberChange = (event: any, newValue: any) => {
        console.log("handleTeamMemberChange newValue>>>", newValue)
        setempTag({ newValue: newValue?.name, passId });
    };
    
    const handleTeamMemberMultipleChange = (newValue: any) => {
        console.log("handleTeamMemberMultipleChange newValue>>>", newValue)
        setempTag({ newValue: newValue, passId });
    };
    const submit =()=>{
        data(empTag);
        close()
    }
    console.log("passId>>", passId)
    console.log("empData>>", empData)
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => close()}
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
                        <LoadingSpinner loading={isLoading} />
                        <div className='d-flex popUpContainer'>
                            <div className='popUpInsideLeftContainer column d-flex'>
                                <span className='bold1Rem commonBlackcolor'>Enhancing Connections through Shared Meals</span>
                                <span className='light0_813Rem commonGraycolor'>Sharing meals with colleagues fosters camaraderie and enhances collaboration, building stronger, more productive professional relationships beyond the boardroom.</span>
                                <span onChange={(e) => onChangeValue(e)}>
                                    <div className='radioButtonMealWithCustomer'>
                                        <input type="radio" value="Meal With Customer" name="meal sharing" /> <span className='bold0_875Rem fentBlack'>Meal With Customer</span>
                                    </div>
                                    <div className='radioButtonMealWithTeam'>
                                        <input type="radio" value="Meal With Team Member" name="meal sharing" /><span className='bold0_875Rem fentBlack'> Meal With Team Member</span>
                                    </div>
                                </span>
                                {
                                    mealWithWhome === "Meal With Customer" &&
                                    <div className='d-flex alignItem-end'>
                                        <img src={search} className='m-10px' />
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={empData}
                                            sx={{ width: 300 }}

                                            getOptionLabel={(option) => option?.name}
                                            getOptionSelected={(option, value) => option?.id === value?.id}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select names" />
                                            )}
                                            onChange={(event, values) => { handleTeamMemberChange(event, values) }}
                                        />
                                    </div>
                                }
                                {
                                    mealWithWhome === "Meal With Team Member" &&
                                    <div className='d-flex alignItem-end'>
                                        <img src={search} className='' />
                                        <Autocomplete
                                            multiple
                                            disablePortal
                                            id="combo-box-demo"
                                            options={empData}
                                            sx={{ width: 300 }}
                                            getOptionLabel={(option) => option.name}
                                            getOptionSelected={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select names" />
                                            )}
                                            onChange={(event, values) => {handleTeamMemberMultipleChange(values.map((value: any) => value?.name)) }}
                                        />
                                    </div>
                                }
                                <div className='d-flex row justfyContent-end mt-20px'>
                                    <div>
                                        <CancelCommonButton title={"Cancel"}
                                            buttonClick={() => close()}
                                        />
                                    </div>
                                    <div className='ml-5px'>
                                        <BlueCommonButton title={"Submit"}
                                            subTitle={""}
                                            buttonClick={() => submit()}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className='popUpInsideRightContainer'>
                                <img src={mealImg} className='shareMealImg' />
                                <img src={cross} className='crossImg' onClick={() => close()} />
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}