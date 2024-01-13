import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import description from '../../assets/images/description.svg'
import closeArrow from '../../assets/images/closeArrow.svg'
import openArrow from '../../assets/images/openArrow.svg'
import map from '../../assets/images/travel/map.svg'
import parking from '../../assets/images/travel/parking.svg'
import toll from '../../assets/images/travel/toll.svg';
import distance from '../../assets/images/travel/distance.svg'
import amount from '../../assets/images/travel/amount.svg'
import city from '../../assets/images/city.svg'
import './expenseDetailHome.css'
import send from '../../assets/images/send.svg'
import { BlueCommonButton, RedCommonButton, WhiteCommonButton, CancelCommonButton } from '../../components/button.tsx'
import { CustomeProgressBar } from "../../components/progressBar.jsx";
import { PolicyViolation } from "../../components/policyViolations.tsx";
import { TeamRequestScreen } from "../teamRequest/teamrequest.tsx";
import { RejectReason } from "../teamRequest/rejectReason.tsx";
import { RaiseQueryScreen } from "../teamRequest/raiseQuery.tsx";
import LoadingSpinner from "../../components/loader.tsx";
import { BrowserRouter as Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { admin, expenseQuery, expenseUrl, initUrl, main, violation } from "../../service/url.js";
import { useSelector, useDispatch } from 'react-redux';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';
import { ServiceCall, NewServiceCall } from '../../service/config.js';
import { setData, selectData } from '../../Redux/features/login/loginSlicer';
import Tooltip from '@mui/material/Tooltip';
import i from '../../assets/images/i.svg'
import { RejectedExpenseDetails } from "../expense/rejectedDetails.tsx";

const draftExpenseDetails = `Here are the details of your draft expenses. You can edit your information by clicking on the "edit" button and submit the expense by clicking the "submit" button.`
const draftExpenseDetailsTitle = 'Expense Details'
export const ExpenseDetailsHome = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    console.log("state>", state)
    const [expenseID, setExpenseID] = useState(state?.data)
    const [finalAmount, setFinalAmount] = useState('')
    const [loading, setLoading] = useState(true)
    const [editable, setEditable] = useState(false)
    const [expenseDetails, setExpensedetails] = useState<any>([])
    const [showRequest, setShowRequest] = useState(false)
    const [partiallyApprove, setpartiallyApprove] = useState(false)
    const [raiseQuery, setRaiseQuery] = useState(false)
    const [reject, setReject] = useState(false)
    const [rejectedSelected, setrejectSelected] = useState(false)
    const [activeCard, setActiveCard] = useState('')
    const [mealDetails, setMealDetails] = useState<any>([{ date: '', breakfast: '', lunch: '', dinner: '', file: '' }])
    const [travelDetails, setTravelDetails] = useState<any>([{ date: '', startLocation: '', endLocation: '', travelType: '', travelMode: '', parking: '', tollTax: '', actualDistance: '', calculatedDistance: '', amount: '', file: '' }])
    const [hotelDetails, setHotelDetails] = useState<any>([{ city: '', checkIn: '', checkOut: '', noOfDays: '', amount: '', file: '' }])
    const [daDetails, setDADetails] = useState<any>([{ date: '', city: '', amount: '' }])
    const [violation, setViolation] = useState([])
    const [status, setStatus] = useState("")
    const [otherData, setOtherData] = useState<any>([{ title: '', amount: '', remark: '' }])

    const renderTeamMembers = (members) => {
        const maxDisplayMembers = 1;
        if (members.length <= maxDisplayMembers) {
            return members.join(', ');
        } else {
            const displayedMembers = [members.slice(0, maxDisplayMembers)];
            const moreMembersCount = members.length - maxDisplayMembers;
            return (
                <>
                    {displayedMembers.join(', ')}
                    <div>+{moreMembersCount} more</div>
                </>
            );
        }
    };
    const editButtonDraft = () => {
        // setEditable(true)
        navigate('/createExpense', { state: { data: expenseDetails } })
    }
    const handleTab = (tabName: string) => {
        setActiveCard(tabName === activeCard ? "" : tabName)
    }
    const handleMealDetails = (index: number, field: any, value: any) => {
        const updatedRows = [...mealDetails];
        updatedRows[index][field] = value
        setMealDetails(updatedRows)
    }

    const handleMealFileChange = (event: any, id: number) => {
        const file = event.target.files[0];
        handleMealDetails(id, 'file', file)
    }

    const getFinalAmount = (data) => {
        const tempexpenseDetails = data[0]
        if (tempexpenseDetails?.hr_approved === "yes") {
            setFinalAmount(tempexpenseDetails?.approved_amount === null ? "" : tempexpenseDetails?.approved_amount);
        }
        else if (tempexpenseDetails?.mgmnt_approved === "yes") {
            setFinalAmount(tempexpenseDetails?.mgmnt_approved_amount === null ? "" : tempexpenseDetails?.mgmnt_approved_amount);
        }
        else if (tempexpenseDetails?.hod_approved === 'yes') {
            setFinalAmount(tempexpenseDetails?.hod_approved_amount === null ? "" : tempexpenseDetails?.hod_approved_amount);
        }
        else {
            setFinalAmount(tempexpenseDetails?.total_amount);
        }
    }
    console.log("finalAmount>>", finalAmount)
    useEffect(() => {
        get_ExpenseDetail();
    }, [])

    const [rejectedData, setRejectedData] = useState()
    const get_rejectedData = async (preExpenseId: any) => {
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.expenseDetails,
            headers: {},
            params: { expense_id: preExpenseId }
        };
        await NewServiceCall(config)
            .then((result) => {
                setLoading(false)
                if (result?.status === 200) {
                    setRejectedData(result?.data?.result)
                }
                else {
                    setRejectedData(undefined)
                }
            })
            .catch((err) => {
                setLoading(false)
                setRejectedData(undefined)
                notifyError("Something went wrong!!")
                console.log("get_ExpenseDetail reerrs>>>", err)
            })
    }
    const removeRemarks = (data) => {
        const mealsWithoutRemarks = data?.map((meal) => {
            const filteredMeal = Object.fromEntries(
                Object.entries(meal).filter(([key, _]) => !key.endsWith('_remark'))
            );
            return filteredMeal;
        });
        return mealsWithoutRemarks
    }
    const [balanceAmount, setAmount] = useState()

    const get_ExpenseDetail = async () => {
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.expenseDetails,
            headers: {},
            params: { expense_id: state?.data }
        };
        await NewServiceCall(config)
            .then((result) => {
                setLoading(false)
                if (result?.status === 200) {
                    setExpensedetails(result?.data?.result)
                    setStatus(result?.data?.result[0]?.status)
                    setMealDetails(removeRemarks(result?.data?.result[0]?.meals))
                    setTravelDetails(removeRemarks(result?.data?.result[0]?.travels))
                    setDADetails(removeRemarks(result?.data?.result[0]?.das))
                    setHotelDetails(removeRemarks(result?.data?.result[0]?.hotels))
                    setOtherData(result?.data?.result[0]?.others)
                    setViolation(result?.data?.result[0]?.policy_violations)
                    getFinalAmount(result?.data?.result)
                    if (result?.data?.result[0]?.prev_expense_id !== "0") {
                        get_rejectedData(result?.data?.result[0]?.prev_expense_id)
                    }

                    const totalAmount = result?.data?.result[0]?.policy_violations.reduce((accumulator, currentValue) => {
                        return accumulator + parseInt(currentValue.hod_approved_amount, 10);
                    }, 0);
                    setAmount(totalAmount)
                }
                else {
                    setExpensedetails([])
                    setStatus("")
                    setMealDetails([])
                    setTravelDetails([])
                    setDADetails([])
                    setHotelDetails([])
                    setOtherData([])
                    setViolation([])
                    getFinalAmount([])
                    get_rejectedData([])
                    notifyError("Something went wrong!!")
                }
            })
            .catch((err) => {
                setLoading(false)
                setExpensedetails([])
                setStatus("")
                setMealDetails([])
                setTravelDetails([])
                setDADetails([])
                setHotelDetails([])
                setOtherData([])
                setViolation([])
                getFinalAmount([])
                get_rejectedData([])
                notifyError("Something went wrong!!")
                console.log("get_ExpenseDetail reerrs>>>", err)
            })
    }

    const [queryFromHr, setQueryFromHr] = useState("")
    const storedData = useSelector(setData);
    const userDetails = storedData?.payload?.login?.items[0]

    const submitExpense = async (status) => {
        const formData = new FormData();
        formData.append('user_id', userDetails?.empcode ? userDetails?.empcode : "");
        formData.append('expense_start_date', expenseDetails?.start_date ? expenseDetails?.start_date : "");
        formData.append('expense_end_date', expenseDetails?.end_date ? expenseDetails?.end_date : "");
        formData.append('expense_description', expenseDetails?.description ? expenseDetails?.description : "");
        formData.append('expense_total_amount', expenseDetails?.total_amount?.toString());
        // formData.append('expenses', JSON.stringify(testData, null, 2).toString());
        formData.append('status', status)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.addExpense,
            headers: {},
            data: formData
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    notifySuccess(res?.data?.message)
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("getGrade res>>>", res)
                navigate('./home')
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("getGrade reerrs>>>", err)
            })
    }
    console.log("expenseDetails>>", expenseDetails)
    const loginStatus = useSelector(selectData);
    console.log("loginStatus>>", loginStatus?.role?.role)
    const [queryData, setQueryData] = useState<any>(expenseDetails[0]?.tickets ? expenseDetails[0]?.tickets : [])
    const raiseQueryFromHR = async (expense_id, query_id) => {
        if (queryFromHr !== "") {
            setLoading(true)
            const url = initUrl + expenseQuery.createQuery
            const formData = new URLSearchParams();
            formData.append('expense_id', expense_id);
            formData.append('query_id', query_id);
            formData.append('sender_id', loginStatus?.items[0]?.empcode);
            formData.append('query_text', queryFromHr);
            await ServiceCall(url, formData, false)
                .then((res) => {
                    console.log("res>>", res)
                    if (res.responseCode === 200) {
                        notifySuccess(res?.message)
                        // getQueryTicketDetails(query_id)
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
        else {
            notifyError("Write a query")
        }
    }

    const filterKeys = (obj, keysToExclude) =>
        Object.fromEntries(
            Object.entries(obj).filter(([key]) => !keysToExclude.includes(key))
        );
    // Keys to exclude
    const excludedKeys = ['id', 'expense_id', 'updated_at', 'created_at'];
    const excludedTravelKeys = ['id', 'expense_id', 'updated_at', 'created_at', "invoices", "amount_remark"];

    const moveToResubmit = (id: number) => {
        navigate('/createExpense', { state: { data: id, screenFrom: "rejected" } })
    }

    const invoiceView = (value) => {
        console.log("invoiceView value>>", value)
        return (
            <img
                style={{ height: '40px', objectFit: 'contain', margin: '10px' }}
                src={value}
                alt="Your SVG Image"
            />
        )
    }
    const [typeState, setType] = useState("")
    console.log("here violation>>", violation)
    return (
        <div>
            {loading ? <div className="mainContainer"><LoadingSpinner loading={loading} /></div> :
                <div className='mt-20px'>
                    <>
                        {
                            expenseDetails[0]?.prev_expense_id !== "0" ?
                                <RejectedExpenseDetails data={rejectedData !== undefined ? rejectedData : []} />
                                :
                                ""
                        }
                    </>
                    {expenseDetails?.map((item, index) => (
                        <div>
                            <div className=' m-10px textAlign-Start row '>
                                <span className="bold1Rem commonBlackcolor">{draftExpenseDetailsTitle} - &nbsp;</span> <span className="commonGraycolor light1Rem">{draftExpenseDetails}</span>
                            </div>

                            {expenseDetails?.length == null || expenseDetails?.length == 0 ? //start,end,expense data 
                                <div className='moduleBorderWithoutPadding'>
                                    <span className="commonGraycolor light1Rem">{draftExpenseDetails}: No Data Found</span>
                                </div> :
                                <div className='moduleBorderWithoutPadding'>
                                    <div className='d-flex alignItem-start row'>
                                        <div className='m-10px'>
                                            <TextField
                                                id="input-with-icon-textfield"
                                                label="Start Date"
                                                type='date'
                                                value={item?.start_date}
                                                disabled={editable ? false : true}
                                                className='datepicker'
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                            />
                                        </div>
                                        <div className='m-10px'>
                                            <TextField
                                                id="input-with-icon-textfield"
                                                label="End Date"
                                                type='date'
                                                disabled={editable ? false : true}
                                                value={item?.end_date}
                                                className='datepicker'
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                            />
                                        </div>
                                    </div>
                                    <div className='d-flex column m-10px'>
                                        <TextField
                                            id="input-with-icon-textfield"
                                            label="Expense Description"
                                            multiline
                                            maxRows={4}
                                            disabled={editable ? false : true}
                                            placeholder="Max 250 characters"
                                            value={item?.description}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <img src={description} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="standard"
                                        />
                                    </div>
                                </div>
                            }
                            <div>

                                {status === 'draft' || state.screen === "teamRequest" ? null   //Progress Bar 
                                    :
                                    <div className="moduleBorderWithoutPadding pl-40px pr-40px" style={{ height: '20vh' }}>
                                        <div className="bold1Rem d-flex justfyContent-start">
                                            Process of Approval
                                        </div>
                                        <div className="pt-30px pl-20px pr-20px pb-25px">
                                            <CustomeProgressBar
                                                data={expenseDetails[0]}
                                            />
                                        </div>
                                    </div>
                                }
                                <>
                                    {expenseDetails[0]?.policy_violations.length === 0 ? null   //Progress Bar 
                                        :
                                        <div className="redModuleBorderWithoutPadding pl-40px pr-40px">
                                            <PolicyViolation
                                                data={violation}
                                                submitUser={expenseDetails[0]?.user_id}
                                            />
                                        </div>
                                    }
                                </>
                                {mealDetails.length == null || mealDetails.length == 0  //meal card
                                    ? null :
                                    <div className="moduleBorderWithoutPadding">
                                        <div onClick={() => handleTab("meal")} className="d-flex space-between alignItem-center curser pl-20px pr-20px">
                                            <span className={activeCard == "meal" ? "activetab tabSupport bold0_875Rem" : "deActivetab tabSupport bold0_875Rem"}>Meal Expense</span>
                                            <img src={activeCard == "meal" ? openArrow : closeArrow} />
                                        </div>
                                        <hr />
                                        <div>
                                            {
                                                activeCard == "meal" &&
                                                <>
                                                    {mealDetails?.map((entry, index) => {
                                                        const filteredEntry = filterKeys(entry, excludedKeys);
                                                        return (
                                                            <div key={index}>
                                                                <div className="d-flex row aa flex-wrap">
                                                                    {Object?.entries(filteredEntry)?.map(([key, value]) => (
                                                                        <div key={key}>
                                                                            {value !== "" && value !== null && key !== "invoice_file" && !key.includes("_invoice_file") ? (
                                                                                <div className="bb">
                                                                                    <div className='m-10px'>
                                                                                        <TextField
                                                                                            id="input-with-icon-textfield"
                                                                                            label={key === "ex_date" ? "Date" : key.charAt(0).toUpperCase() + key.slice(1)}
                                                                                            type={key === "ex_date" ? 'date' : "string"}
                                                                                            value={key.includes("_tag") ? value.split(',')[0] : value}
                                                                                            disabled={editable ? false : true}
                                                                                            className='datepicker'
                                                                                            InputProps={{
                                                                                                startAdornment: (
                                                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                                                    </InputAdornment>
                                                                                                ),
                                                                                            }}
                                                                                            variant="standard"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                            {
                                                                                value !== "" && value !== null && key.includes("_invoice_file") ?
                                                                                    (
                                                                                        <div className='m-10px d-flex alignItem-center'>
                                                                                            {value ? key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1) : null}
                                                                                            {value && invoiceView(value)}
                                                                                        </div>
                                                                                    )
                                                                                    :
                                                                                    null
                                                                            }

                                                                            {key.includes("_tag") && value !== "" ? (
                                                                                <div className='m-5px light0_875Rem d-flex'>
                                                                                    <Tooltip
                                                                                        title={`Tagged members: ${value}`} arrow>
                                                                                        <div className="d-flex">
                                                                                            <span className='m-5px light0_875Rem '>
                                                                                                Tag: {renderTeamMembers(value?.split(',')?.map(member => member.trim()))}
                                                                                            </span>
                                                                                            <img src={i} className='iImg m-5px' />
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            }
                                        </div>
                                    </div>
                                }
                                {travelDetails.length == null || travelDetails.length == 0  //travel card 
                                    ? null :
                                    <div className="moduleBorderWithoutPadding">
                                        <div onClick={() => handleTab("travel")} className="d-flex space-between alignItem-center curser pl-20px pr-20px">
                                            <span className={activeCard == "travel" ? "activetab tabSupport bold0_875Rem" : "deActivetab tabSupport bold0_875Rem"}>Travel Expense</span>
                                            <img src={activeCard == "travel" ? openArrow : closeArrow} />
                                        </div>
                                        <hr />
                                        <div className='d-flex column pl-20px pr-20px' >
                                            {
                                                activeCard == "travel" &&
                                                <>
                                                    {
                                                        travelDetails?.map((entry, index) => {
                                                            const filteredEntry = filterKeys(entry, excludedTravelKeys);
                                                            return (
                                                                <div key={index}>
                                                                    <div className="d-flex row aa flex-wrap">
                                                                        {Object.entries(filteredEntry)?.map(([key, value]) => (
                                                                            <div key={key}>
                                                                                {value !== "" && value !== null ? (
                                                                                    <div className="bb">
                                                                                        <div className='m-10px'>
                                                                                            <TextField
                                                                                                id="input-with-icon-textfield"
                                                                                                label={key.replace(/_/g, ' ').split(' ')?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                                                                type={key === "travel_date" ? 'date' : "string"}
                                                                                                value={value}
                                                                                                disabled={editable ? false : true}
                                                                                                className='datepicker'
                                                                                                InputProps={{
                                                                                                    startAdornment: (
                                                                                                        <InputAdornment position="start" className='ml-10px'>
                                                                                                        </InputAdornment>
                                                                                                    ),
                                                                                                }}
                                                                                                variant="standard"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {entry.invoices && entry.invoices?.map((invoice) => (
                                                                        <div key={invoice.id}>
                                                                            <div className="d-flex row alignItem-center flex-wrap">
                                                                                <div className='m-10px d-flex'>
                                                                                    <TextField
                                                                                        id="input-with-icon-textfield"
                                                                                        label={invoice.ei_type === 'parking' ? "Parking" : invoice.ei_type === 'amount' ? "Amount" : " Toll Amount"}
                                                                                        type='number'
                                                                                        disabled={editable ? false : true}
                                                                                        placeholder='Amount'
                                                                                        value={invoice.amount}
                                                                                        InputProps={{
                                                                                            startAdornment: (
                                                                                                <InputAdornment position="start">
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        variant="standard"
                                                                                    />
                                                                                </div>
                                                                                {
                                                                                    invoice?.invoice_file === null || invoice?.invoice_file === "" ? "" :
                                                                                        <div className='m-10px d-flex alignItem-center'>
                                                                                            Invoice_file {invoiceView(invoice?.invoice_file)}
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                }
                                {hotelDetails.length === null || hotelDetails.length === 0 ? null :    //hotel card 
                                    <div className="moduleBorderWithoutPadding">
                                        <div onClick={() => handleTab("hotel")} className="d-flex space-between alignItem-center curser pl-20px pr-20px">
                                            <span className={activeCard == "hotel" ? "activetab tabSupport bold0_875Rem" : "deActivetab tabSupport bold0_875Rem"}>Hotel Expense</span>
                                            <img src={activeCard == "hotel" ? openArrow : closeArrow} />
                                        </div>
                                        <hr />
                                        <div className='d-flex column pl-20px pr-20px' >
                                            {
                                                activeCard == "hotel" &&
                                                <>
                                                    {
                                                        hotelDetails?.map((item, id) =>
                                                            <div className='d-flex row alignItem-center flex-wrap'>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="City"
                                                                        type='string'
                                                                        disabled={editable ? false : true}
                                                                        placeholder='Enter amount'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <img src={city} />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        value={item?.city}
                                                                        variant="standard"
                                                                    />
                                                                </div>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Check In"
                                                                        type='date'
                                                                        value={item?.check_in_date}
                                                                        disabled={editable ? false : true}
                                                                        className='datepicker'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        variant="standard"
                                                                    />
                                                                </div>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Check Out"
                                                                        type='date'
                                                                        disabled={editable ? false : true}
                                                                        className='datepicker'
                                                                        value={item?.check_out_date}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        variant="standard"
                                                                    />
                                                                </div>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Number of days"
                                                                        value={item?.days_count}
                                                                        disabled={editable ? false : true}
                                                                        className='datepicker'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        variant="standard"
                                                                    />
                                                                </div>
                                                                {
                                                                    item?.invoices && item.invoices?.map((invoice) => (
                                                                        <>
                                                                            <div className='m-10px' key={invoice.id}>
                                                                                <TextField
                                                                                    id="input-with-icon-textfield"
                                                                                    label="Amount"
                                                                                    type='number'
                                                                                    value={invoice?.amount ? invoice?.amount : ""}
                                                                                    disabled={editable ? false : true}
                                                                                    placeholder='Select location'
                                                                                    InputProps={{
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start">
                                                                                                <img src={amount} />
                                                                                            </InputAdornment>
                                                                                        ),
                                                                                    }}
                                                                                    variant="standard"
                                                                                />
                                                                            </div>
                                                                            {
                                                                                invoice?.invoice_file !== null ?
                                                                                    <div className='m-10px d-flex alignItem-center'>
                                                                                        Invoice_file {invoiceView(invoice?.invoice_file)}
                                                                                    </div>
                                                                                    : ""
                                                                            }
                                                                        </>
                                                                    ))
                                                                }

                                                            </div>
                                                        )}
                                                </>
                                            }
                                        </div>
                                    </div>
                                }

                                {daDetails.length === null || daDetails.length === 0 ? null :   // da card 
                                    <div className="moduleBorderWithoutPadding">
                                        <div onClick={() => handleTab("da")} className="d-flex space-between alignItem-center curser pl-20px pr-20px">
                                            <span className={activeCard == "da" ? "activetab tabSupport bold0_875Rem" : "deActivetab tabSupport bold0_875Rem"}>DA Expense</span>
                                            <img src={activeCard == "da" ? openArrow : closeArrow} />
                                        </div>
                                        <hr />
                                        <div className='d-flex column pl-20px pr-20px' >
                                            {
                                                activeCard == "da" &&
                                                <>
                                                    {daDetails?.map((item, id) =>
                                                        <div className='d-flex row alignItem-center flex-wrap' key={id}>
                                                            <div className='m-10px'>
                                                                <TextField
                                                                    id="input-with-icon-textfield"
                                                                    label="Date"
                                                                    type='date'
                                                                    disabled={editable ? false : true}
                                                                    value={item?.ex_date}
                                                                    className='datepicker'
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start" className='ml-10px'>
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                />
                                                            </div>
                                                            <div className='m-10px'>
                                                                <TextField
                                                                    id="input-with-icon-textfield"
                                                                    label="City"
                                                                    disabled={editable ? false : true}
                                                                    value={item?.city}
                                                                    type='string'
                                                                    placeholder='Enter amount'
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <img src={city} />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                />
                                                            </div>
                                                            <div className='m-10px'>
                                                                <TextField
                                                                    id="input-with-icon-textfield"
                                                                    label="Amount"
                                                                    type='number'
                                                                    disabled={editable ? false : true}
                                                                    value={item?.amount}
                                                                    placeholder='Select location'
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <img src={amount} />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            }
                                        </div>
                                    </div>
                                }
                                {otherData.length === null || otherData.length === 0 ? null :    //hotel card 
                                    <div className="moduleBorderWithoutPadding">
                                        <div onClick={() => handleTab("other")} className="d-flex space-between alignItem-center curser pl-20px pr-20px">
                                            <span className={activeCard == "other" ? "activetab tabSupport bold0_875Rem" : "deActivetab tabSupport bold0_875Rem"}>Other Expense</span>
                                            <img src={activeCard == "other" ? openArrow : closeArrow} />
                                        </div>
                                        <hr />
                                        <div className='d-flex column pl-20px pr-20px' >
                                            {
                                                activeCard === "other" &&
                                                <>
                                                    {console.log('othet dadaddadd?????????', activeCard, otherData)}
                                                    {
                                                        otherData?.map((item, id) =>
                                                            <div className='d-flex row alignItem-center flex-wrap'>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Title"
                                                                        type='string'
                                                                        disabled={editable ? false : true}
                                                                        placeholder='Enter title'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <img src={city} />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        value={item?.title}
                                                                        variant="standard"
                                                                    />
                                                                </div>
                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Amount"
                                                                        value={item?.amount}
                                                                        disabled={editable ? false : true}
                                                                        className='datepicker'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        variant="standard"
                                                                    />
                                                                </div>

                                                                <div className='m-10px'>
                                                                    <TextField
                                                                        id="input-with-icon-textfield"
                                                                        label="Remark"
                                                                        value={item?.remark}
                                                                        disabled={editable ? false : true}
                                                                        className='datepicker'
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        variant="standard"
                                                                    />
                                                                </div>


                                                            </div>
                                                        )}
                                                </>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            {status == 'draft' ? null :
                                <>
                                    {
                                        expenseDetails[0]?.tickets.length === 0 ? "" :
                                            <>
                                                <div className="m-10px bottomQuery p-1_5rem">
                                                    {expenseDetails[0]?.tickets?.map((query, id) =>
                                                        <>
                                                            <div className="m-20px">
                                                                <div className="d-flex curser mainbgColor radius w-15per p-5px alignItem-center">
                                                                    <span className="white regular0_65Rem ">{`A query from : ${query?.sender_id ? query?.sender_id : ""}`}</span>
                                                                </div>
                                                            </div>
                                                            <div className=' m-10px textAlign-Start row'>
                                                                <span className="light0_813Rem">{`query : ${query?.query ? query?.query : ""}`}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {
                                                        expenseDetails[0]?.tickets[expenseDetails[0]?.tickets?.length - 1]?.status !== "close" ?
                                                            <div className="justfyContent-start d-flex row alignItem-center">
                                                                <div className="w-100per">
                                                                    <input
                                                                        type="text"
                                                                        // value={queryFromHr}
                                                                        onChange={(e) => setQueryFromHr(e.target.value)}
                                                                        className="w-100per p-15px queryinput"
                                                                        placeholder="Write your message here"
                                                                    />
                                                                </div>
                                                                <div className="sendBtn" onClick={() => raiseQueryFromHR(expenseDetails[0]?.id, 0)}>
                                                                    <img src={send} />
                                                                </div>
                                                            </div>
                                                            :
                                                            ""
                                                    }
                                                </div>
                                            </>
                                    }
                                </>
                            }
                            {
                                rejectedSelected ?
                                    <div className="m-10px redcolor p-1_5rem radius">
                                        <div className="m-20px">
                                            <RedCommonButton
                                                title={"Reason of Rejection"}
                                                subTitle={""}
                                                buttonClick={(e: any) => console.log('Reason of Rejection')}

                                            />
                                        </div>
                                        <div className=' m-10px textAlign-Start row'>
                                            <span className="light0_813Rem">Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and
                                                typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum
                                                is simply dummy text of the printing industryLorem Ipsum is simply dummy text of the printingand typesetting industry.</span>
                                        </div>

                                    </div> : null
                            }
                            {
                                expenseDetails[0].status === "rejected" &&
                                <div className="m-10px redcolor p-1_5rem radius">
                                    <div className="m-10px">
                                        <RedCommonButton
                                            title={"Reason of Rejection"}
                                            subTitle={""}
                                            buttonClick={(e: any) => console.log('Reason of Rejection')}
                                        />
                                    </div>
                                    <div className=' m-10px textAlign-Start row'>
                                        <span className="light0_813Rem">{expenseDetails[0].rejected_reason}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}

                    {/* footer */}
                    {expenseDetails[0]?.status === "draft" &&
                        <div className='d-flex row flex-wrap'>
                            <div className='m-10px'>
                                <CancelCommonButton
                                    title={"Cancel"}
                                    buttonClick={() => navigate('/draft')}
                                />
                            </div>
                            <div className='m-10px'>
                                <BlueCommonButton
                                    title={status === 'draft' ? 'Submit' : "Save for later"}
                                    subTitle={""}
                                    buttonClick={() => status === 'draft' ? submitExpense('submit') : submitExpense('draft')}
                                // buttonClick={() => navigate('/draft')}
                                />
                            </div>
                            {!editable &&
                                <div className='m-10px'>
                                    <WhiteCommonButton
                                        title={status === 'draft' ? 'Edit' : "Submit"}
                                        subTitle={""}
                                        buttonClick={() => editButtonDraft()}
                                    />
                                </div>
                            }
                        </div>
                    }
                    {
                        expenseDetails[0]?.status === "rejected" &&
                        <div className='m-10px'>
                            <BlueCommonButton
                                title={"Click here to resubmit"}
                                subTitle={""}
                                buttonClick={(e: any) => moveToResubmit(expenseDetails[0].id)}
                            />
                        </div>
                    }
                    {
                        state?.screen === "teamRequest" &&
                        <>
                            {expenseDetails[0]?.status === 'pending' &&
                                <div className='d-flex row flex-wrap'>
                                    {
                                        loginStatus?.role?.role === "HOD" && expenseDetails[0]?.hod_approved === 'no' ?
                                            <>
                                                {/* {
                                                    balanceAmount > finalAmount ? */}
                                                <div className='m-10px'>
                                                    <BlueCommonButton
                                                        title={"Approve Request"}
                                                        subTitle={""}
                                                        buttonClick={(e: any) => {
                                                            setShowRequest(true)
                                                            setType("Approve Request")
                                                        }}
                                                    />
                                                </div>
                                                {/* :
                                                        ""
                                                } */}
                                            </>
                                            :
                                            loginStatus?.role?.role === "HR" && expenseDetails[0]?.hr_approved === 'no' ?
                                                <>
                                                    {/* {
                                                        balanceAmount > finalAmount ? */}
                                                    <div className='m-10px'>
                                                        <BlueCommonButton
                                                            title={"Approve Request"}
                                                            subTitle={""}
                                                            buttonClick={(e: any) => {
                                                                setShowRequest(true)
                                                                setType("Approve Request")
                                                            }}
                                                        />
                                                    </div>
                                                    {/* : ''
                                                    } */}
                                                </>
                                                :
                                                loginStatus?.role?.role === "Japaness" && expenseDetails[0]?.mgmnt_approved === 'no' ?
                                                    <>
                                                        {/* {
                                                            balanceAmount > finalAmount ? */}
                                                        <div className='m-10px'>
                                                            <BlueCommonButton
                                                                title={"Approve Request"}
                                                                subTitle={""}
                                                                buttonClick={(e: any) => {
                                                                    setShowRequest(true)
                                                                    setType("Approve Request")
                                                                }}
                                                            />
                                                        </div>
                                                        {/* : ''
                                                        } */}
                                                    </>
                                                    :
                                                    ""
                                    }
                                    {
                                        loginStatus?.role?.role === "HOD" && expenseDetails[0]?.hod_approved === 'no' ?
                                            <div className='m-10px'>
                                                <BlueCommonButton
                                                    title={"Partially Approve Request"}
                                                    subTitle={""}
                                                    buttonClick={(e: any) => {
                                                        setpartiallyApprove(true)
                                                        setType("Partially Approve Request")
                                                    }}
                                                />
                                            </div>
                                            :
                                            loginStatus?.role?.role === "HR" && expenseDetails[0]?.hr_approved === 'no' ?
                                                <div className='m-10px'>
                                                    <BlueCommonButton
                                                        title={"Partially Approve Request"}
                                                        subTitle={""}
                                                        buttonClick={(e: any) => {
                                                            setpartiallyApprove(true)
                                                            setType("Partially Approve Request")
                                                        }}
                                                    />
                                                </div>
                                                :
                                                loginStatus?.role?.role === "Japaness" && expenseDetails[0]?.mgmnt_approved === 'no' ?
                                                    <div className='m-10px'>
                                                        <BlueCommonButton
                                                            title={"Partially Approve Request"}
                                                            subTitle={""}
                                                            buttonClick={(e: any) => {
                                                                setpartiallyApprove(true)
                                                                setType("Partially Approve Request")
                                                            }}
                                                        />
                                                    </div>
                                                    :
                                                    ""
                                    }
                                    {
                                        expenseDetails[0]?.tickets.length === 0 ?
                                            <div className='m-10px'>
                                                <BlueCommonButton
                                                    title={"Raise a Query"}
                                                    subTitle={""}
                                                    buttonClick={(e: any) => setRaiseQuery(true)}
                                                />
                                            </div>
                                            : ""
                                    }

                                    {
                                        loginStatus?.role?.role === "HOD" && expenseDetails[0]?.hod_approved === 'no' ?
                                            <>
                                                {
                                                    balanceAmount > finalAmount ?
                                                        <div className='m-10px'>
                                                            <BlueCommonButton
                                                                title={"Reject Request"}
                                                                subTitle={""}
                                                                buttonClick={(e: any) => setReject(true)}
                                                            />
                                                        </div>
                                                        : ''
                                                }
                                            </>
                                            :
                                            loginStatus?.role?.role === "HR" && expenseDetails[0]?.hr_approved === 'no' ?
                                                <>
                                                    {
                                                        balanceAmount > finalAmount ?
                                                            <div className='m-10px'>
                                                                <BlueCommonButton
                                                                    title={"Reject Request"}
                                                                    subTitle={""}
                                                                    buttonClick={(e: any) => setReject(true)}
                                                                />
                                                            </div>
                                                            : ''
                                                    }
                                                </>
                                                :
                                                loginStatus?.role?.role === "Japaness" && expenseDetails[0]?.mgmnt_approved === 'no' ?
                                                    <>
                                                        {
                                                            balanceAmount > finalAmount ?
                                                                <div className='m-10px'>
                                                                    <BlueCommonButton
                                                                        title={"Reject Request"}
                                                                        subTitle={""}
                                                                        buttonClick={(e: any) => setReject(true)}
                                                                    />
                                                                </div>
                                                                : ''
                                                        }
                                                    </>
                                                    :
                                                    ""
                                    }

                                </div>
                            }

                            {
                                expenseDetails[0]?.status === 'rejected' ? "" :
                                    <div className='m-10px mainbgColor approve'>
                                        <div className=''>
                                            <span className="white regular0_875Rem"> {expenseDetails[0]?.hr_approved == 'yes' ? "Hr Approved Amount : "
                                                : expenseDetails[0]?.mgmnt_approved == 'yes' ? "Management Approved Amount : "
                                                    : expenseDetails[0]?.hod_approved == 'yes' ? "Hod Approved Amount : "
                                                        : "Total Submitted Amount : "
                                            }
                                                {expenseDetails[0]?.hr_approved == 'yes'
                                                    ? expenseDetails[0]?.approved_amount
                                                    : expenseDetails[0]?.mgmnt_approved == 'yes'
                                                        ? expenseDetails[0]?.mgmnt_approved_amount
                                                        : expenseDetails[0]?.hod_approved == 'yes'
                                                            ? expenseDetails[0]?.hod_approved_amount
                                                            : expenseDetails[0]?.total_amount
                                                }

                                            </span>
                                        </div>
                                    </div>
                            }
                        </>
                    }

                    {showRequest &&
                        <TeamRequestScreen
                            close={() => setShowRequest(false)}
                            data={expenseDetails}
                            status={expenseDetails[0]?.status}
                            finalAmount={finalAmount}
                            typeState={typeState}
                        />
                    }
                    {
                        reject &&
                        <RejectReason
                            close={() => setReject(false)}
                            expenseId={expenseDetails[0]?.id}
                        />
                    }
                    {
                        raiseQuery &&
                        <RaiseQueryScreen
                            close={() => setRaiseQuery(false)}
                            expenseID={expenseID}
                        />
                    }
                    {
                        partiallyApprove &&
                        <TeamRequestScreen
                            close={() => setpartiallyApprove(false)}
                            data={expenseDetails}
                            type={'partial'}
                            finalAmount={balanceAmount}
                            actualfinalAmount={finalAmount}
                            typeState={typeState}
                        />
                    }
                </div>
            }
        </div>
    )
}
