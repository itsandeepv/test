import React, { useEffect, useState, useRef } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import pen from '../../assets/images/pen.svg'
import uploadImg from '../../assets/images/smallUpload.svg'
import '../draft/draftScreenStyle.css'

import PaginationItem from '@mui/material/PaginationItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { expenseUrl } from "../../service/url.js";
import axios from "axios";
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";

import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'

import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl, expenseRequest } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { WhiteCommonButton, BlueCommonButton } from "../../components/button.tsx";

import { ExportPDFButton } from "../../components/exportToPDF.tsx";
import { ExportExcel } from "../../components/exportToExcel.js";
import Moment from 'react-moment';

const ExpenseDetails = `Here are the requested expense details of team members. You can check the request by clicking on the "View Details" button.`

export const TeamRequestListScreen = () => {
    const [teamRequestData, settTamRequestData] = useState<any>([])
    const [teamRequestDataCopy, settTamRequestDataCopy] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const loginStatus = useSelector(selectData);
    const [finalAmount, setFinalAmount] = useState('')

    const user_id = loginStatus.items[0].empcode
    const targetRef = useRef(null);
    useEffect(() => {
        getTeamRequestScreen()
    }, [])
    const roleName=loginStatus?.role?.role
    const getTeamRequestScreen = async () => {
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('role_id', roleName === "HOD" ? "2" : roleName ==="HR" ? '4': roleName === "Japaness" ? '3': "" );
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + expenseRequest.getTeamRequestExpense,
            headers: {},
            data:formData
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    settTamRequestData(res?.data?.result ? res?.data?.result : [])
                    settTamRequestDataCopy(res?.data?.result ? res?.data?.result : [])

                }
                else {
                    settTamRequestData([])
                    settTamRequestDataCopy([])
                    notifyWarning("Something went wrong!!")
                }
                console.log("getTeamRequestScreen res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                settTamRequestData([])
                settTamRequestDataCopy([])
                notifyWarning("Something went wrong!!")
                console.log("getTeamRequestScreen reerrs>>>", err)
            })
    }
    const [showAll, setShowAll] = useState(true)
    const handleChange = (status: SelectChangeEvent) => {
        setShowAll(!showAll)
    };
    const [sortBy, setSortBy] = useState("")
    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value)
    }

    const [filterType, setFilterType] = useState("")
    const handleChangeType = (event: SelectChangeEvent) => {
        setFilterType(event.target.value)
    }

    useEffect(() => {
        getMasterExpense()
    }, [])

    const getMasterExpense = async () => {
        setLoading(true)
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.getExpenseMaster,
            headers: {},
        };
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setMasterExpenseType(res?.data?.result)
                }
                else {
                    setMasterExpenseType([])
                    notifyError("Something went wrong!!")
                }
                console.log("getMasterExpense res>>>", res)
            })
            .catch((err) => {
                setMasterExpenseType([])
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("getMasterExpense reerrs>>>", err)
            })
    }
    const [masterExpenseType, setMasterExpenseType] = useState([])
    const sortedBy = [
        { id: 1, value: "Requested", data: "Requested" },
        { id: 2, value: "Rejected", data: "Rejected" },
        { id: 3, value: "Approved", data: "Approved" },
        { id: 4, value: "Pending", data: "Pending" },
        { id: 5, value: "Employee Request", data: "Employee Request" },
        { id: 6, value: "HOD Request", data: "HOD Request" }
    ]

    const navigate = useNavigate();
    const navigateToDetails = (expenseID) => {
        navigate('/expenseDetails', { state: { data: expenseID, screen: "teamRequest" } })
    }
    const exportExcel = () => {
        const columns = ['Status', 'Start Date/End Date', 'Expense Type', 'Expense Description', 'Amount']
        const data = teamRequestData.map((item) => [item.status, `${item.start_date}/${item.end_date}`, item.expense_type, item.description, item.total_amount])
        return (
            ExportExcel(columns, data)
        )
    }

    const [startDateFilter, setStartDate] = useState('')
    const [endDateFilter, setEndDate] = useState('')

    const startDate = (e) => {
        setStartDate(e.target.value)
        setShowAll(false)
    }

    const endDate = (e) => {
        setEndDate(e.target.value)
        setShowAll(false)
    }

    const filteredData = teamRequestDataCopy.filter(item => {
        const expenseTypeMatch = filterType ? item.expense_type.includes(filterType) : true;
        const statusMatch = sortBy ? item.status === sortBy.toLocaleLowerCase() : true;
        const startDateMatch = startDateFilter
            ? new Date(item.created_at) >= new Date(startDateFilter)
            : true;
        const endDateMatch = endDateFilter
            ? new Date(item.created_at) <= new Date(endDateFilter)
            : true;
        return expenseTypeMatch && statusMatch && startDateMatch && endDateMatch;
    });

    const clearFilter = () => {
        setSortBy('')
        setFilterType('')
        setStartDate('')
        setEndDate('')
        setShowAll(true)
    }

    console.log("teamRequestData>>", teamRequestData)
    console.log("filteredData>>", filteredData)
    console.log("masterExpenseType>>", masterExpenseType)
    console.log("teamRequestDataCopy >>", teamRequestDataCopy)
    return (
        <div>
            <LoadingSpinner loading={loading} />
            <div className='mt-20px'>
                {
                    teamRequestData.length !== 0 &&
                    <div className='m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                        <span className="bold1Rem commonBlackcolor">Team Member Expense Details - &nbsp;</span><span className="commonGraycolor light1Rem">{ExpenseDetails}</span>
                    </div>
                }
                <div>
                    {loginStatus?.role?.role === "HR" &&
                        <>
                            {
                                true &&
                                <div className="moduleBorderWithoutPadding d-flex row alignItem-center gap-20px">
                                    <div className='m-5px d-flex'>
                                        <input value="test" type="checkbox" onChange={handleChange} checked={showAll} />
                                        <span className="checkBoxText ml-5px">Show All</span>
                                    </div>
                                    <div>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <Select
                                                value={""}
                                                onChange={handleChangeSortBy}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="" disabled>
                                                    Sort By:{sortBy}
                                                </MenuItem>
                                                {sortedBy.map((expense) => (
                                                    <MenuItem key={expense.id} value={expense.value}>
                                                        {expense.value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <Select
                                                value={""}
                                                onChange={handleChangeType}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="" disabled>
                                                    Expense Type:{filterType}
                                                </MenuItem>
                                                {masterExpenseType.map((expense: any) => (
                                                    <MenuItem key={expense?.id} value={expense?.expense_name}>
                                                        {expense?.expense_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <TextField
                                            id={''}
                                            label={""}
                                            type={'date'}
                                            placeholder={`Select date here `}
                                            onChange={(e) => startDate(e)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" className='ml-10px'>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="standard"
                                            value={startDateFilter}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            id={''}
                                            label={""}
                                            type={'date'}
                                            placeholder={`Select date here `}
                                            onChange={(e) => endDate(e)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" className='ml-10px'>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="standard"
                                            value={endDateFilter}
                                        />
                                    </div>
                                    <div className='d-flex m-10px'>
                                        <BlueCommonButton
                                            title={"Clear"}
                                            subTitle={""}
                                            buttonClick={() => {
                                                clearFilter()
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                <div className='d-flex row'>
                                    <div className='m-5px'>
                                        <WhiteCommonButton
                                            title={"Export as Excel"}
                                            subTitle={""}
                                            // buttonClick={() => ""}
                                            buttonClick={() => exportExcel()}
                                        />
                                    </div>
                                    <div className='m-5px'>
                                        <ExportPDFButton buttonText="Export as PDF" targetReff={targetRef} />
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>
                {
                    teamRequestData.length !== 0 ?
                        <div ref={targetRef}>
                            <TableContainer component={Paper} id='teamRequest' >
                                <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Status</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Submission Date</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Expense Type</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Expense Description</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Amount</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Approved Amount</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Action</div></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.map((item) => (
                                            <TableRow
                                                key={item?.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    <div className={`d-flex row alignItem-center ${item.status === 'draft' ? 'draftCard' : item.status === 'pending' ? "pendingCard" : item.status === 'approved' ? 'approvalCard' : item.status === 'rejected' ? "rejectCard" : ""} justfyContent-center `}
                                                    // style={{ backgroundColor: item.status === 'draft' ? '#DBEEFF' : item.status === 'pending' ? '#FEF9C3' : item.status === 'rejected' ? '#FEE2E2' : item.status === 'approved' ? '#DCFCE7' : "" }}

                                                    >
                                                        <div className={item.status === "draft" ? "dotBlue" : item.status === "approved" ? "dotGreen" : item.status === "rejected" ? "dotRed" : item.status === "pending" ? "dotOrange" : "dotBlue"}></div>
                                                        <div className="light0_875Rem commonGraycolor p-8px">{item?.status}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center" >
                                                    {/* <div className="light0_813Rem commonGraycolor">{item?.start_date}/{item?.end_date}</div> */}
                                                    <div className="light0_813Rem commonGraycolor">
                                                        <Moment format='DD MMM, HH:mm'>{item?.created_at}
                                                        </Moment>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" ><div className="light0_813Rem commonGraycolor">{item?.expense_type}</div></TableCell>
                                                <TableCell align="center"><div className="light0_813Rem commonGraycolor">{item?.description}</div></TableCell>
                                                <TableCell align="center"><div className="light0_813Rem commonGraycolor">{item?.total_amount !== null ? item?.total_amount : "---"}</div></TableCell>
                                                <TableCell align="center"><div className="light0_813Rem commonGraycolor">
                                                    {item?.hr_approved === 'yes' ?
                                                        `Hr Approved ${item?.approved_amount !== null || item?.approved_amount !== undefined ? item?.approved_amount : ""}`
                                                        : item?.mgmnt_approved === 'yes' ?
                                                            `Management Approved ${item?.mgmnt_approved_amount !== null || item?.mgmnt_approved_amount !== undefined ? item?.mgmnt_approved_amount : ""}`
                                                            : item?.hod_approved === 'yes' ?
                                                                `Hod Approved ${item?.hod_approved_amount !== null || item?.hod_approved_amount !== undefined ? item?.hod_approved_amount : ""}`
                                                                : "---"}</div></TableCell>
                                                <TableCell align="center">
                                                    <div className="d-flex row justfyContent-center alignItem-center curser">
                                                        <div className="d-flex row justfyContent-center alignItem-center" onClick={() => navigateToDetails(item.id)}>
                                                            <span className="commonGraycolor bold0_875Rem txtstyle curser">View details</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        :
                        !loading &&
                        <SearchFound />
                }
            </div>
            {toastContainer()}
        </div>
    )
}