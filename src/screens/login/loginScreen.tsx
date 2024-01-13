import React, { useState, useEffect } from 'react';
import loginPage from '../../assets/images/loginPage.svg'
import './loginStyles.css'
import Logo from '../../assets/images/Logo.svg'
import TextField from '@mui/material/TextField';
import userNameImg from '../../assets/images/userName.svg';
import passWord from '../../assets/images/passWord.svg'
import InputAdornment from '@mui/material/InputAdornment';
import topRightIcon from '../../assets/images/topRightIcon.svg'
import bottomRightIcon from '../../assets/images/bottomRightIcon.svg.svg'

import { configUrlencoded } from '../../utils/constants'
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast';

import { useDispatch, useSelector } from 'react-redux';
import { ServiceCall, NewServiceCall } from '../../service/config';

import { setData, selectData, setLoginStatus, setRole, setLoading } from '../../Redux/features/login/loginSlicer'
import { main, loginUrl, initUrl } from '../../service/url';
import { useNavigate } from 'react-router-dom';

export const LoginScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginData = useSelector(selectData);
    const [userName, setUserName] = useState("")
    const [userPass, setUserPass] = useState("")
    console.log("loginData>>", loginData)
    useEffect(() => {
        console.log("useEffect loginData>>", loginData)
        if (loginData?.loading === false) {
            // navigate('/home');
            // employeeRole()
        }
    }, [loginData])
    const login = async () => {
        const url = main + loginUrl.userLogin
        const formData = new URLSearchParams();
        formData.append('UserCode', userName);
        formData.append('Password', userPass);
        formData.append('CompanyCode', 'Nihon');
        const response = await ServiceCall(url, formData, configUrlencoded)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'application/xml');
        const jsonString = xmlDoc.querySelector('string')?.textContent || "";
        const jsonObject = JSON.parse(jsonString);
        employeeRole()
        console.log("jsonObject>>", jsonObject)
        if (jsonObject.status === "success") {
            notifySuccess(jsonObject.Message)
            dispatch(setData(jsonObject.Data))
            dispatch(setLoginStatus(true))
            navigate('/home');

        }
        else if (jsonObject.status === "Fail") {
            notifyError(jsonObject.Message)
            dispatch(setLoginStatus(false))
            dispatch(setData([]))
        }
        else {
            notifyWarning(jsonObject.Message)
            dispatch(setLoginStatus(false))
            dispatch(setData([]))
        }
    }
    const employeeRole = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + loginUrl.employeeRole,
            headers: {},
            params: { employee_id: userName }
        };
        dispatch(setLoading(true))
        await NewServiceCall(config)
            .then((res) => {
                console.log("employeeRole res>>", res)
                // setLoading(false)
                if (res.status === 200) {
                    dispatch(setRole(res?.data?.result))
                    dispatch(setLoading(false))
                    navigate('/home');
                }
                else {
                    dispatch(setRole(''))
                    dispatch(setLoading(false))
                }
            })
            .catch((err) => {
                console.log("employeeRole err>>>", err)
            })
    }

    const validation = () => {

        if (userName === "") {
            notifyWarning("Enter user Name")

        }
        else if (userPass === "") {
            notifyWarning("Enter user Password")
        }
        else {
            login()
        }
    }
    return (
        <div className='login-screen '>
            {/* Left side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={loginPage} alt="Overlay" className='img'
                />
                <div className='textOn-Img d-flex column justfyContent-center alignItem-start'>
                    <span className='regular1_26Rem white'>WELCOME TO</span>
                    <span className='bold1_5Rem white'>EXPENSE MANAGEMENT</span>
                    <span className='bold1Rem white'>Login to Access dashboard</span>
                </div>
            </div>

            {/* Right side */}
            <div className='d-flex column justfyContent-center flex1 alignItem-center rightside'>
                <div>
                    <img src={topRightIcon} className='topRight' />
                    <div className='d-flex column justfyContent-start textAlign-Start'>
                        <img src={Logo} alt="logo" className="logoLogin" />
                        <span className='m-5px light1_375Rem commonGraycolor'>Login to your account</span>
                        <span className='m-5px bold2_75Rem darkBlack'>Welcome Back!</span>
                    </div>
                    <div className='d-flex column m-15px'>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Email"
                            onChange={(e) => setUserName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={userNameImg} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                        />
                    </div>
                    <div className='d-flex column m-15px'>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Password"
                            onChange={(e) => setUserPass(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={passWord} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                        />
                    </div>
                    <div className='m-15px'>
                        <button
                            className={`button bold1_26Rem  ${userName === "" || userPass === "" ? "BGDisableButtonColor darkBlack" : "BGDActiveButtonColor white"}`}
                            // onClick={() => login()}
                            onClick={() => validation()}
                        >
                            Login
                        </button>
                    </div>
                    {toastContainer()}
                    <div className='m-15px'>
                        <span className='light0_875Rem commonGraycolor'>Forgotten your login details? <span className='bold0_875Rem darkBlack'>Contact Admin team.</span></span>
                    </div>
                    <img src={bottomRightIcon} className='bottomRight' />
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
