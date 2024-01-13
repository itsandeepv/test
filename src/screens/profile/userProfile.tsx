import React from 'react';
import './userProfile.css'
import userAvatar from '../../assets/images/userAvatar.png'
import TextField from '@mui/material/TextField';
import { Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setData,selectData } from '../../Redux/features/login/loginSlicer'
// import calender from '../../assets/images/'
const textStyle = {
    backgroundColor: '#EDF2F6',
    border: '1px solid #E0E4EC',
    borderRadius: '10px',
}
export const UserProfile = () => {
    const loginStatus = useSelector(selectData);

    const profileData = useSelector(setData)
    const data = loginStatus.role
    console.log("profileData>>", loginStatus)
    return (
        <div className="moduleBorder d-flex column container mt-30px white">
            <span className="bold2Rem commonBlackcolor column">Your Profile Picture</span>
            <img src={data.image?data.image:userAvatar} className="profile m-1_5rem" />
            <Divider className="divider " />
            <div className=" d-flex row mt-20px">
                <div className='m-10px w-50per d-flex alignItem-start column '>
                    <span className="light0_875Rem commonBlackcolor alignItem-start mb-10px">Full Name</span>
                    <TextField
                        id="fullWidth"
                        value={data?.name ? data?.name : "----"}
                        variant="outlined"
                        disabled
                        fullWidth={true}
                        sx={textStyle}
                    />
                </div>
                <div className='m-10px w-50per d-flex alignItem-start column'>
                    <span className="light0_875Rem commonBlackcolor mb-10px">Employee ID</span>
                    <TextField
                        className='filled'
                        variant="outlined"
                        fullWidth={true}
                        rows={5}
                        disabled
                        value={data?.employe_id? data?.employe_id : '-----'}
                        sx={textStyle}
                    />
                </div>
            </div>
            <div className=" d-flex row mt-10px">
                <div className='m-10px w-50per d-flex alignItem-start column'>
                    <span className="light0_875Rem commonBlackcolor alignItem-start mb-10px">Email</span>
                    <TextField
                        id="fullWidth"
                        value={data?.email}
                        variant="outlined"
                        fullWidth={true}
                        disabled
                        sx={textStyle}
                    />
                </div>
                <div className='m-10px w-50per d-flex alignItem-start column'>
                    <span className="light0_875Rem commonBlackcolor mb-10px">Phone number</span>
                    <TextField
                        className='filled'
                        variant="outlined"
                        id="input-with-icon-textfield"
                        type='phone'
                        fullWidth={true}
                        disabled
                        rows={5}
                        value={data?.phone? data?.phone : "---"}
                        sx={textStyle}
                    />
                </div>

            </div>
            <div className=" d-flex row mt-10px">
                <div className='m-10px w-50per d-flex alignItem-start column'>
                    <span className="light0_875Rem commonBlackcolor alignItem-start mb-10px">Grade</span>
                    <TextField
                        id="fullWidth"
                        variant="outlined"
                        fullWidth={true}
                        value={data?.grade? data.grade : "---"}
                        disabled
                        sx={textStyle}
                    />
                </div>
                <div className='m-10px w-50per d-flex alignItem-start column'>
                    <span className="light0_875Rem commonBlackcolor mb-10px">Reporting Officer</span>
                    <TextField
                        className='filled'
                        variant="outlined"
                        fullWidth={true}
                        rows={5}
                        disabled
                        value={data?.reporting_officer? data.reporting_officer :"---"}
                        sx={textStyle}
                    />
                </div>
            </div>
        </div>
    );
};