import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";

import draft from '../../assets/images/draftWhite.svg'
import pending from '../../assets/images/pendingWhite.svg'
import rejected from '../../assets/images/rejectWhite.svg'
import approved from '../../assets/images/approveWhite.svg'
import './DashBoardStyles.css'
import DashBoardGraph from "./DashBoardgraph";
import { HistoryScreen } from "./History.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { expenseUrl, initUrl } from "../../service/url.js";
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import { notifyError, notifySuccess, notifyWarning } from "../../components/toast.js";
import { NewServiceCall } from "../../service/config.js";
import LoadingSpinner from "../../components/loader.tsx";
export const DashBoardScreen = () => {
    const loginStatus = useSelector(selectData);
    const [isLoading, setLoading] = useState(false)

    const user_id = loginStatus.items[0].empcode
    const [pendingCount, setPendingCount] = useState('')
    const [draftCount, setDraftCount] = useState('')
    const [approveCount, setApproveCount] = useState('')
    const [rejectedCount, setRejectedCount] = useState('')
    const [search, setSearch] = useState(true)
    const status = [
        { id: 0, title: "Approved", status: approveCount, icon: approved, bgColor: '#DCFCE7', barColor: '#22C55E', link: '/approval' },
        { id: 1, title: "Pending", status: pendingCount, icon: pending, bgColor: '#FEF9C3', barColor: '#FACC15', link: '/pending' },
        { id: 2, title: "Rejected", status: rejectedCount, icon: rejected, bgColor: '#FEE2E2', barColor: '#EF4444', link: '/reject' },
        { id: 3, title: "Draft", status: draftCount, icon: draft, bgColor: '#DBEEFF', barColor: '#0080FC', link: '/draft' },
    ]
    const customerName = loginStatus.items[0].empname
    const navigate = useNavigate();
    const clickHandle = (value: string) => {
        navigate(value);
        // window.location.reload();
    }
    const getPendingExpenseCount = async () => {
        const formdata = new FormData();
        formdata.append("user_id", user_id);
        formdata.append("expense_type", 'pending');
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.getExpenseCount,
            headers: {},
            data: formdata
        };

        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    setPendingCount(res?.data?.result !== null || res?.data?.result !== undefined ?res?.data?.result: "-----" )

                }
                else {
                    setPendingCount('')
                    notifySuccess("Something went wrong!")
                }
                console.log("setPendingCount res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setPendingCount('')
                console.log("setPendingCount reerrs>>>", err)
            })
    }
    const getDraftCount = async () => {
        const formdata = new FormData();
        formdata.append("user_id", user_id);
        formdata.append("expense_type", 'draft');
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.getExpenseCount,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    setDraftCount(res?.data?.result !== null || res?.data?.result !== undefined ?res?.data?.result: "-----" )
                }
                else {
                    setDraftCount('')
                }
                console.log("setDraftCount res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setDraftCount('')
                console.log("setDraftCount reerrs>>>", err)
            })
    }
    const getApproveCount = async () => {
        const formdata = new FormData();
        formdata.append("user_id", user_id);
        formdata.append("expense_type", 'approved');
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.getExpenseCount,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    setApproveCount(res?.data?.result !== null || res?.data?.result !== undefined ?res?.data?.result: "-----" )
                }
                else {
                    setApproveCount('')
                }
                console.log("setApproveCount res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setApproveCount('')
                console.log("setApproveCount reerrs>>>", err)
            })
    }
    const getRejectCount = async () => {
        const formdata = new FormData();
        formdata.append("user_id", user_id);
        formdata.append("expense_type", 'rejected');
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.getExpenseCount,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    setRejectedCount(res?.data?.result !== null || res?.data?.result !== undefined ?res?.data?.result: "-----" )
                }
                else {
                    setRejectedCount('')
                }
                console.log("getRejectCount res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setRejectedCount('')
                console.log("getRejectCount reerrs>>>", err)
            })
    }

    useEffect(() => {
        getRejectCount()
        getPendingExpenseCount()
        getDraftCount()
        getApproveCount()
    }, [])
    return (
        <div>
            {/* {search
                ?
                <TaglistPopup />
                : */}
            <div className='d-flex column'>
                <div className='d-flex mt-30px m-10px'>
                    <span className="bold1Rem commonBlackcolor">Hey {customerName} - &nbsp;</span> <span className="commonGraycolor light1Rem">here’s your expense analysis</span>
                </div>
                {/* <div className='d-flex row space-between m-10px flex-wrap alignItem-start'>
                    {
                        status.map((item, index) =>
                            <div key={index} className='d-flex row alignItem-center mb-10px statusContainer curser flex-wrap dashBoadrStausBar scale-effect-with-shadow' style={{ backgroundColor: item.bgColor }} onClick={() => clickHandle(item.link)}>
                                <span>
                                    <Divider orientation="vertical" flexItem className='statusBox' style={{ border: `2px solid ${item.barColor}` }} />
                                </span>
                                <div className="d-flex space-between alignItem-center flex-wrap" style={{ width: '96%' }}>
                                    <div className='d-flex column  ml-15px mr-15px  p-10px'>
                                        <span className="gray1 light1Rem">{item.title}</span>
                                        <span className="bold1_56Rem commonBlackcolor">{item.status}</span>
                                    </div>
                                    <div>
                                        <img src={item.icon} style={{ backgroundColor: `${item.barColor}` }} className="p-5px statusImg" />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div> */}
                {isLoading ?
                    <LoadingSpinner loading={isLoading} />
                    :

                    <div className="d-flex row flex-wrap alignItem-center space-around full-width">
                        {
                            status.map((item, index) =>
                                <div className="smallCard scale-effect-with-shadow" style={{ backgroundColor: item.bgColor, width: '250px' }} onClick={() => clickHandle(item.link)} >
                                    <div className="d-flex row space-between alignItem-center" >
                                        <div className="bar" style={{ backgroundColor: `${item.barColor}` }}></div>
                                        <div className="d-flex column inner-Container">
                                            <span className="gray1 light1Rem">{item.title}</span>
                                            <span className="bold1_56Rem commonBlackcolor">{item.status}</span>
                                        </div>
                                        <div><img src={approved} style={{ backgroundColor: `${item.barColor}` }} className="status-Img" /></div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
                <div className="">
                    <DashBoardGraph 
                    userId={user_id}
                    />
                    <HistoryScreen />
                </div>
            </div>
            {/* } */}
        </div>

    )
}