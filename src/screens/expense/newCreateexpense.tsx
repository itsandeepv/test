import React, { useState, useEffect, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import bill from '../../assets/images/bill.svg'
import tag from '../../assets/images/tag.svg'
import i from '../../assets/images/i.svg'
import add from '../../assets/images/travel/add.svg'
import parking from '../../assets/images/travel/parking.svg'
import toll from '../../assets/images/travel/toll.svg'
import uploadImg from '../../assets/images/uploadImg.svg'
import calender from '../../assets/images/calender.svg'
import distance from '../../assets/images/travel/distance.svg'
import description from '../../assets/images/description.svg'
import Tooltip from '@mui/material/Tooltip';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';
import { BlueCommonButton, WhiteCommonButton, UploadCommonButton, CancelCommonButton, FunctionalCommonButton, AddButton } from '../../components/button.tsx'
import { expenseUrl, admin, initUrl } from '../../service/url.js';
import { NewServiceCall } from '../../service/config.js';
import LoadingSpinner from "../../components/loader.tsx";
import { EditUpload } from '../teamRequest/editUpload.tsx';
import './createExpenseStyles.css'

import { useSelector, useDispatch } from 'react-redux';
import { setData, selectData } from '../../Redux/features/login/loginSlicer'

import { ShareMealPopup } from './shareMealPopUp.tsx'
import { ViolationPopup } from './violation.tsx';
import { GoogleMaps } from '../../components/googleMapPopup.tsx';
import { startLocationReduxData, endLocationReduxData } from '../../Redux/features/googleLocation/googleLocationSlicer'

import { useNavigate, useLocation, json } from 'react-router-dom';
import { TagPopup } from '../../components/tagPopUp.tsx';
import { RejectedExpenseDetails } from './rejectedDetails.tsx';
import amount from '../../assets/images/travel/amount.svg'
import { BaseImageDownloader } from '../../components/base64Downloader.tsx';
import { downloadImage } from '../../components/downloadFile.js';
export const NewCreateExpense = () => {
    const { state } = useLocation();
    const startLocationData = useSelector(startLocationReduxData);
    const endLocationData = useSelector(endLocationReduxData);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [draftMeal, setDraftMeal] = useState(state?.data[0]?.meals ? [state?.data[0]?.meals] : [])
    const [finalMealDraft, setfinalMealDraft] = useState([])
    const [draftTravel, setdraftTravel] = useState(state?.data[0]?.travels ? state?.data[0]?.travels : [])
    const [draftHotel, setDraftHotel] = useState(state?.data[0]?.hotels ? state?.data[0]?.hotels : [])
    const [draftDA, setDraftDA] = useState(state?.data[0]?.das ? state?.data[0]?.das : [])
    const [draftOther, setDraftOther] = useState(state?.data[0]?.others ? state?.data[0]?.others : [])
    const [descriptionValue, setDescription] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [expense, setExpense] = useState([])
    const [expenseMode, setExpenseMode] = useState("") // meal, travel, hotel, DA, Other
    const [expenseDetails, setExpenseDetails] = useState<any>([])
    const [expenseWithSubExpense, setExpenseWithSubExpense] = useState([])
    const [expenseMasterData, setExpenseMasterData] = useState<any>([])
    const [expenseMeal, setExpenseMeal] = useState<any>([])
    const [checkbox, setCheckbox] = useState(true)
    const [selectedFile, setSelectedFile] = useState('')
    const navigate = useNavigate();
    const loginStatus = useSelector(selectData);
    console.log("Expense state>>", state)
    console.log("loginStatus state>>", loginStatus)

    // *************** meal invoices checkbox *************
    const onChangeInvoice = (id: any, subex: any) => {
        setCheckbox((prevStates) => ({
            ...prevStates,
            [subex]: !prevStates[subex],
        }));
    }

    // ************** Date handle *************
    const handleInitialDetails = (type: string, value: any) => {
        if (type === "startDate") {
            setStartDate(value)
        }
        else if (type === "endDate") {
            if (startDate === "") {
                notifyWarning("Please select start date first!!")
            }
            else {
                if (startDate > value) {
                    notifyWarning("Choose invalid date!!")
                }
                else {
                    console.log('value expense date :::::', value)
                    setEndDate(value)
                    setExpenseMode("")
                    createMealRowWithDate(value)
                }
            }
        }
        else if (type === "discription") {
            setDescription(value)
        }
    }

    useEffect(() => {
        if (state?.data[0]?.status === "draft") {
            setStartDate(state?.data[0]?.start_date ? state?.data[0]?.start_date : '')
            setEndDate(state?.data[0]?.end_date ? state?.data[0]?.end_date : '')
            setDescription(state?.data[0]?.description ? state?.data[0]?.description : '')
            setExpenseMode("")
            draftMeal.map((item) => {
                setfinalMealDraft(item)
                // setExpenseDetails(item)
            })
        }
        getMasterExpense();
        getMasterSubExpense();

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
                    setExpense(res?.data?.result)
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("getMasterExpense res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("getMasterExpense reerrs>>>", err)
            })
    }

    const [travelFromAPI, setTravelFromAPI] = useState([])
    const [hotelFromAPI, setHotelFromAPI] = useState([])
    const [daFromAPI, setDAFromAPI] = useState([])
    const [otherFromAPI, setOtherFromAPI] = useState([])

    const storedData = useSelector(setData);
    const userData = storedData?.payload?.login?.items[0]
    const getCreateExpenseWithGrade = async (id: number) => {
        console.log("getCreateExpenseWithGrade called..", expenseDetails.length)
        setLoading(true)
        const data = {
            master_expense_id: id,
            grade_name: loginStatus?.role?.grade
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.getCreateExpense,
            headers: {},
            data: data
        };
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    if (res?.data?.result?.master_expense?.expense_name === "Meal") {
                        if (expenseDetails.length === 0) {
                            console.log("expenseDetails is empty for meal")
                            customMealSubExpense(res?.data?.result?.subexpense)
                            setExpenseMasterData(res?.data?.result?.subexpense)
                            console.log("jjj meal>>", (res?.data?.result?.subexpense))
                        }
                    }
                    else if (res?.data?.result?.master_expense?.expense_name === "Travel") {
                        console.log("Travel>>", res?.data?.result?.subexpense)
                        setTravelFromAPI(res?.data?.result?.subexpense)
                        customeForTravel(res?.data?.result?.subexpense)
                        console.log("jjj travel>>", (res?.data?.result?.subexpense))
                    }
                    else if (res?.data?.result?.master_expense?.expense_name === "Hotel") {
                        setHotelFromAPI(res?.data?.result?.master_expense?.policies)
                        console.log("jjj hotel>>", (res?.data?.result?.master_expense?.policies))
                    }
                    else if (res?.data?.result?.master_expense?.expense_name === "DA") {
                        setDAFromAPI(res?.data?.result?.master_expense?.policies)
                        console.log("jjj da>>", (res?.data?.result?.subexpense))
                    }
                    else if (res?.data?.result?.master_expense?.expense_name === "Other") {
                        setOtherFromAPI(res?.data?.result?.subexpense)
                        console.log("jjj other>>", (res?.data?.result?.subexpense))
                    }
                }
                else {
                    setExpenseMasterData([])
                    notifyError("Something went wrong!!")
                }
                console.log("getCreateExpenseWithGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setExpenseMasterData([])
                notifyError("Something went wrong!!")
                console.log("getCreateExpenseWithGrade reerrs>>>", err)
            })
    }

    const onclickSetExpenseMode = (name, id) => {
        console.log("name>>", name, expenseDetails)
        setTravelType('')
        if (startDate === "") {
            notifyWarning("Choose start date")
        }
        else if (endDate === "") {
            notifyWarning("Choose end date")
        }
        else if (descriptionValue === "") {
            notifyWarning("Enter description")
        }
        else {
            getCreateExpenseWithGrade(id)
            setExpenseMode(name)
        }
    }


    const clientLocation: string = loginStatus?.role?.job_location
    // console.log("loginStatus>>", loginStatus?.role?.grade_name)
    const customMealSubExpense = (dataFromAPI) => {
        const data: any = dataFromAPI.reduce((result, subexpense, index) => {
            const subexpenseKey = subexpense.subexpense_name.toLowerCase();
            result[subexpenseKey] = clientLocation === "client site" ? 120 : ""
            // Create corresponding *_tag properties
            result[`${subexpenseKey}_tag`] = '';
            result[`${subexpenseKey}_invoice`] = '';
            result[`${subexpenseKey}_remark`] = [{ remark: '', policy_id: '' }];
            return result;
        }, { uid: 0, type: 'meal', ex_date: '' });

        // setExpenseDetails([data])
        // console.log("here dateArrayValue>>", dateArrayValue)
        const existingMealExpenseDetails: object = data
        // console.log("here existingMealExpenseDetails>>", existingMealExpenseDetails)
        if (state?.data[0]?.status === "draft") {
            const FinalResult = finalMealDraft.map((data: any, id) => {
                const dynamicKeys = Object.keys(data);  // Get all keys dynamically
                const result: any = { ...existingMealExpenseDetails, ex_date: data?.ex_date || "" };

                dynamicKeys.forEach((key) => {
                    result[key] = data[key] || "";
                });

                return result;
            });

            setExpenseDetails([...FinalResult]);  // meal data
        } else {
            const FinalResult = dateArrayValue.map((date, id) => ({
                ...existingMealExpenseDetails,
                ex_date: date,
                uid: id
            }));

            setExpenseDetails([...FinalResult]);  // meal data
        }

    }

    const handleMealRow = () => {
        const existingMealExpenseDetails: object = expenseDetails[0]
        const existingMealExpenseDetailsLength = expenseDetails.length

        const newMealRow = { ...existingMealExpenseDetails, ex_date: '', uid: existingMealExpenseDetailsLength }
        const finalMealRowData = [...expenseDetails, newMealRow]
        setExpenseDetails(finalMealRowData)
    }

    const [dateArrayValue, setDateArray] = useState<any>([])
    const createMealRowWithDate = (endDateParam: any) => {
        var date1 = new Date(startDate);
        var date2 = new Date(endDateParam);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24) + 1);
        var dateArray = [...Array(Difference_In_Days)].map((_, index) => {
            const newDate = new Date(date1);
            newDate.setDate(date1.getDate() + index);
            return newDate.toISOString()?.split('T')[0];
        });
        setDateArray(dateArray)
    }

    const updateMealRow = (uid: number, value: any, field: string) => {
        const checkExistDate = field === "ex_date" ? expenseDetails.filter((item) => item.ex_date === value).length : 0

        if (checkExistDate >= 1) {
            notifyError("Date is already added")
        }
        else {
            const updatedRows = expenseDetails.map((row, rowIndex) => row.uid === uid ? { ...row, [field]: value } : row);
            setExpenseDetails(updatedRows)
            console.log("date is not available")
        }
    }

    const getMasterSubExpense = async () => {
        setLoading(true)

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.getMasterExpenseWithSubexpense,
            headers: {}
        };
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                setExpenseWithSubExpense(res?.data?.result)
                console.log("getMasterSubExpense res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setExpenseWithSubExpense([])
                notifyError("Something went wrong!!")
                console.log("getMasterSubExpense reerrs>>>", err)
            })
    }

    const [hotelDetail, setHotelDetails] = useState<any>([
        { uid: 0, type: 'hotel', city: '', check_in_date: '', check_out_date: '', days_count: '', amount: '', invoice_file: '' },
    ])

    const handleHotelRow = () => {
        const existingHotelExpenseDetailsLength = hotelDetail.length
        const newHotelRow = { type: 'hotel', city: '', check_in_date: '', check_out_date: '', days_count: '', amount: '', invoice_file: '', uid: existingHotelExpenseDetailsLength }
        const finalHotelRowData: object = [...hotelDetail, newHotelRow]
        setHotelDetails(finalHotelRowData)
    }

    const updateHotelRow = (uid: number, value: any, field: string) => {
        console.log(`updateHotelRow uid= ${uid} and value= ${value} and field= ${field}`)
        let updatedRows: any = hotelDetail.map((row, rowIndex) => row.uid === uid ? { ...row, [field]: value } : row);
        console.log("updatedRows>>", updatedRows)
        setHotelDetails(updatedRows)

        const isValidDateRanges = (hotelDates, daDates) => {
            // Convert date strings to Date objects for both hotel and DA dates
            const hotelDateObjects = hotelDates.map(date => ({
                uid: date.uid,
                type: date.type,
                check_in_date: new Date(date.check_in_date),
                check_out_date: new Date(date.check_out_date)
            }));


            // Check if check_in_date is smaller than or equal to check_out_date for hotel dates
            for (const dateObj of hotelDateObjects) {
                if (dateObj.check_in_date > dateObj.check_out_date) {
                    // Invalid date range in hotel dates
                    return false;
                }
            }
            hotelDateObjects.sort((a, b) => a.check_in_date - b.check_in_date);

            if (daDates.length > 0) {
                const daDateObjects = daDates?.map(date => ({
                    uid: date.uid,
                    type: date.type,
                    date: new Date(date.date)
                }));

                // Sort the date ranges based on the start date for both hotel and DA dates

                daDateObjects.sort((a, b) => a.date - b.date);

                // Check for overlapping date ranges between hotel and DA dates
                for (const hotelDate of hotelDateObjects) {
                    for (const daDate of daDateObjects) {
                        if (
                            hotelDate.check_out_date >= daDate.date &&
                            hotelDate.check_in_date <= daDate.date
                        ) {
                            // Overlapping ranges found
                            return false;
                        }
                    }
                }
            }

            // Check for overlapping date ranges within hotel dates
            for (let i = 0; i < hotelDateObjects.length - 1; i++) {
                const currentEndDate = hotelDateObjects[i].check_out_date;
                const nextStartDate = hotelDateObjects[i + 1].check_in_date;

                if (currentEndDate >= nextStartDate) {
                    // Overlapping ranges found
                    return false;
                }
            }

            // No overlapping ranges and valid date ranges found
            return true;
        };

        const isValidHotelDataValid = isValidDateRanges(updatedRows, daDetail);

        console.log("isValidHotelDataValid>>", isValidHotelDataValid)
        // if isValidHotelDataValid is true means date allowed and false means date is not allowed
        if (!isValidHotelDataValid) {
            updatedRows = hotelDetail.map((row, rowIndex) => row.uid === uid ? {
                ...row, [field]: value,
                [`${"check_in_date"}`]: row.check_in_date !== "" ? "" : row.check_in_date,
                [`${"check_out_date"}`]: row.check_out_date !== "" ? "" : row.check_out_date
            }
                :
                row
            );
            setHotelDetails(updatedRows)
            notifyError("Date is already used")
        }
    }


    const [daDetail, setDADetail] = useState<any>([
        { uid: 0, type: 'da', date: '', city: '', amount: '' }
    ])

    const handleDARow = () => {
        const existingDAExpenseDetailsLength = daDetail.length
        const newDARow = { uid: existingDAExpenseDetailsLength, type: 'da', date: '', city: '', amount: '' };
        const finalDARowData: object = [...daDetail, newDARow]
        setDADetail(finalDARowData)
    }

    const updateDARow = (uid: number, value: any, field: string) => {
        console.log(`updateDARow uid= ${uid} and value= ${value} and field= ${field}`)
        const updatedRows = daDetail.map((row, rowIndex) => row.uid === uid ? { ...row, [field]: value } : row);
        console.log("updatedRows>>", updatedRows)
        setDADetail(updatedRows)


        const isValidDAData = (hotelDates, daDates) => {
            // Convert date strings to Date objects for both hotel and DA dates
            const hotelDateObjects = hotelDates.map(date => ({
                uid: date.uid,
                type: date.type,
                check_in_date: new Date(date.check_in_date),
                check_out_date: new Date(date.check_out_date)
            }));

            const daDateObjects = daDates.map(date => ({
                uid: date.uid,
                type: date.type,
                date: new Date(date.date)
            }));

            // Sort the date ranges based on the start date for both hotel and DA dates
            hotelDateObjects.sort((a, b) => a.check_in_date - b.check_in_date);
            daDateObjects.sort((a, b) => a.date - b.date);

            // Check for overlapping date ranges between hotel and DA dates
            for (const hotelDate of hotelDateObjects) {
                for (const daDate of daDateObjects) {
                    if (
                        hotelDate.check_out_date >= daDate.date &&
                        hotelDate.check_in_date <= daDate.date
                    ) {
                        // Overlapping ranges found
                        return false;
                    }
                }
            }

            // Check for duplicate dates in DAData
            const uniqueDaDates = new Set(daDateObjects.map(date => date.date.getTime()));
            if (uniqueDaDates.size !== daDateObjects.length) {
                // Duplicate dates found in DAData
                return false;
            }

            // No overlapping ranges and no duplicate dates found in DAData
            return true;
        };

        const isValidDADataResult = isValidDAData(hotelDetail, updatedRows);
        console.log("DAData is", isValidDADataResult ? "valid" : "invalid");
        if (!isValidDADataResult) { // invalid date
            const updatedRows = daDetail.map((row, rowIndex) => row.uid === uid ? {
                ...row, [field]: '',
                [`${"date"}`]: row.date !== "" ? "" : row.date
            } : row);
            setDADetail(updatedRows)
            notifyError("Date is already used")
        }

    }

    const [otherDetail, setOtherDetail] = useState<any>([
        { uid: 0, type: 'other', title: '', amount: '', amount_remark: '', invoice_file: '' }
    ])
    console.log("otherDetailotherDetailotherDetailotherDetail>>>", otherDetail)
    const handleOtherRow = () => {
        const existingOtherExpenseDetails: object = otherDetail[0]
        const existingOtherExpenseDetailsLength = otherDetail.length
        const newOtherRow = { type: 'other', title: '', amount: '', amount_remark: '', invoice_file: '', ex_date: '', uid: existingOtherExpenseDetailsLength }
        const finalOtherRowData: any = [...otherDetail, newOtherRow]
        setOtherDetail(finalOtherRowData)
    }

    const updateOtherRow = (uid: number, value: any, field: string) => {
        console.log(`updateOtherRow uid= ${uid} and value= ${value} and field= ${field}`)
        const updatedRows = otherDetail.map((row, rowIndex) => row.uid === uid ? { ...row, [field]: value } : row);
        console.log("updatedRows>>", updatedRows)
        setOtherDetail(updatedRows)
    }

    const updateOtherRemarks = (field: string, value: any) => {
        console.log(`updateOtherRemarks field=${field} and value=${value}`)
        const newData = otherDetail.map(item => ({
            ...item,
            remark: value
        }));
        setOtherDetail(newData)
    }

    const [totalSumAmount, setTotalSumAmount] = useState(Number(0))
    const validation = (state: string) => {
        console.log("validation click with ", state)
        const calculateMealTotalSum = (data) => {
            let totalSum = 0;
            // Iterate through each object in mealData
            data?.forEach(meal => {
                // Sum up all numeric properties dynamically
                Object.keys(meal).forEach(key => {
                    if (typeof meal[key] === 'number' && key !== 'uid' && key !== 'type' && key !== 'ex_date' && key !== 'invoice_file') {
                        totalSum += meal[key];
                    }
                });
            });
            return totalSum;
        }

        const travelSum = (data) => {
            let totalAmount = 0;
            let totalParkingValue = 0;
            let totalTollValue = 0;

            data.forEach(travel => {
                Object.keys(travel).forEach(key => {
                    if (typeof travel[key] === 'number' && key !== 'uid' && key !== 'type' && key !== 'ex_date' && key !== 'amount_file' && key !== 'distance_remark' && key !== 'amount_remark') {
                        totalAmount += isNaN(travel[key]) ? 0 : travel[key];
                    }
                    if (Array.isArray(travel[key])) {
                        // Check if it's an array and has 'value' property
                        if (travel[key]?.length > 0 && typeof travel[key][0]?.value === 'number') {
                            travel[key].forEach(item => {
                                totalParkingValue += item?.value || 0;
                            });
                        }
                    }
                })
            });
            console.log('amount totaalla chekc:???????', totalAmount, totalParkingValue, totalTollValue)
            return totalAmount + totalParkingValue + totalTollValue
        }
        console.log("calculateMealTotalSum>>", calculateMealTotalSum(expenseDetails))
        console.log("calculateOtherTotalSum>>", calculateMealTotalSum(otherDetail))
        console.log("calculateDATotalSum>>", calculateMealTotalSum(daDetail))
        console.log("calculateHotelTotalSum>>", calculateMealTotalSum(hotelDetail))
        console.log("travelSum>>", travelSum(travelData))

        const amount = (calculateMealTotalSum(expenseDetails) + calculateMealTotalSum(otherDetail) + calculateMealTotalSum(daDetail) + calculateMealTotalSum(hotelDetail) + travelSum(travelData))
        setTotalSumAmount(calculateMealTotalSum(expenseDetails) + calculateMealTotalSum(otherDetail) + calculateMealTotalSum(daDetail) + calculateMealTotalSum(hotelDetail) + travelSum(travelData))
        addExpense(amount, state)
    }

    const [showTag, setShowTag] = useState(false)
    const [metaData, setMetaData] = useState({ uidValue: Number(''), tagType: '' })
    const tagFuction = (uid: number, field: string) => {
        setShowTag(true)
        setMetaData({ uidValue: uid, tagType: field })
    }

    const setShareMealDataFunction = (data: any) => {
        if (Array.isArray(data.newValue)) {
            const result = data.newValue.map(item => item);
            updateMealRow(data.passId.uidValue, result.join(', '), data.passId.tagType)
        }
        else {
            updateMealRow(data.passId.uidValue, data.newValue, data.passId.tagType)
        }
    }

    const violationDataHandle = (data) => {
        console.log("violationDataHandle>>", data?.dataValue.policyData.id)
        if (data?.dataValue?.typeName === "meal") {
            updateMealRow(data.dataValue.uid, [{ remark: data.remarks, policy_id: data.dataValue.policyData.id }], `${data.dataValue.field}_remark`)
            // updateMealRow(data.dataValue.uid, data.remarks, `${data.dataValue.field}_remark`)
        }
        else if (data?.dataValue?.typeName === "other") {
            updateOtherRow(data.dataValue.uid, [{ remark: data.remarks, policy_id: data.dataValue.policyData.id }], `${data.dataValue.field}_remark`)
        }
        else if (data?.dataValue?.typeName === "hotel") {
            updateHotelRow(data.dataValue.uid, [{ remark: data.remarks, policy_id: data.dataValue.policyData.id }], `${data.dataValue.field}_remark`)
        }
        else if (data?.dataValue?.typeName === "da") {
            updateDARow(data.dataValue.uid, [{ remark: data.remarks, policy_id: data.dataValue.policyData.id }], `${data.dataValue.field}_remark`)
        }
        else if (data?.dataValue?.typeName === "travel") {
            // updateTravelDetails(`${data.dataValue.field}_remark`, data.remarks, data?.dataValue.uid)
            updateTravelDetails(`${data.dataValue.field}_remark`, [{ remark: data.remarks, policy_id: data.dataValue.policyData.id }], data?.dataValue.uid)
        }
    }

    const cancelViolation = (e) => {
        console.log("cancelViolation>>", e)
        if (e.type === "close") {
            if (e.dataValue.typeName === "meal") {
                updateMealRow(e.dataValue.uid, Number(0), e.dataValue.field)
            }
            else if (e.dataValue.typeName === "other") {
                updateOtherRow(e.dataValue.uid, Number(0), e.dataValue.field)
            }
            else if (e.dataValue.typeName === "hotel") {
                updateHotelRow(e.dataValue.uid, Number(0), e.dataValue.field)
            }
            else if (e.dataValue.typeName === "da") {
                updateDARow(e.dataValue.uid, Number(0), e.dataValue.field)
            }
            else if (e.dataValue.typeName === "travel") {
                updateTravelDetails(e.dataValue.field, Number(0), e.dataValue.uid)
            }
            setViolation(false)
        }
        else {
            setViolation(false)
        }
    }

    const [showViolation, setViolation] = useState(false)
    const [violationMetaData, setViolationMetaData] = useState({ uid: Number(""), field: "", value: "", limit: "", typeName: "", policyData: [] })

    const setViolationFunction = (uid: number, value: any, field: string, violationLimit: any, typeName: string, policyData: any) => {
        console.log("policyData>>>", policyData)
        setTimeout(() => {
            setViolation(true)
        }, 500)
        setViolationMetaData({ uid: uid, field: field, value: value, limit: violationLimit, typeName: typeName, policyData: policyData })

        if (typeName === "hotel") {
            updateHotelRow(uid, value, 'amount')
        }
        else if (typeName === "meal") {
            updateMealRow(uid, value, field)
        }
        else if (typeName === "da") {
            updateDARow(uid, value, field)
        }
        else if (typeName === "other") {
            updateOtherRow(uid, value, field)
        }
        else if (typeName === "travel") {
            // updateTravelDetails("actual_distance", e.target.value, dataValue.uid)
            updateTravelDetails(field, value, uid)
        }
    }

    const setAmount = (uid: number, item: any, value: any, calculated_distance: any) => {
        console.log("item>>", item, value, calculated_distance)
        // updateTravelDetails("amount",value * item?.policies[0]?.unit_cost , uid)
        // updateTravelDetails("amount", item?.policies[0]?.max_distance * item?.policies[0]?.unit_cost, uid)
        let amountData = calculated_distance * item?.policies[0]?.unit_cost
        updateTravelDetails("amount", isNaN(amountData) ? 0 : amountData, uid)

        if (calculated_distance * item?.policies[0]?.unit_cost > item?.policies[0]?.max_amount) {
            // setViolationFunction(uid, item?.policies[0]?.max_distance * item?.policies[0]?.unit_cost, 'amount', item?.policies[0]?.max_distance, "travel");
            setViolationFunction(uid, calculated_distance * item?.policies[0]?.unit_cost, 'amount', item?.policies[0]?.max_distance, "travel");
        }
    }

    const [travelData, setTravelData] = useState<any>([
        {
            uid: 0, type: "travel", travel_type: 'local', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: '2 Wheeler', start_location: '', end_location: '', actual_distance: "", distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], calculated_distance: "", amount: "", amount_file: '', invoice_file: '',
            parking: [{ pid: 0, value: 0 }], parking_file: [{ pfid: 0, value: "" }]
        },
        { uid: 0, type: "travel", travel_type: 'local', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: 'Taxi/Cab', start_location: '', end_location: '', calculated_distance: "", amount: '', amount_file: '', distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], invoice_file: '', },
        {
            uid: 0, type: "travel", travel_type: 'local', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], amount: "", amount_file: '', invoice_file: '',
            parking: [{ pid: 0, value: 0 }],
            parking_file: [{ pfid: 0, value: "" }],
            toll: [{ tid: 0, value: 0 }],
            toll_file: [{ tfid: 0, value: "" }]
        },
        {
            uid: 0, type: "travel", travel_type: 'domestic', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], amount: '', amount_file: '', invoice_file: '',
            parking: [{ id: 0, value: 0 }],
            parking_file: [{ pfid: 0, value: "" }],
            toll: [{ tid: 0, value: 0 }],
            toll_file: [{ tfid: 0, value: "" }]
        },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: 'Bus', start_location: '', end_location: '', distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], amount: '', amount_file: '', invoice_file: '', },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: 'Flight', start_location: '', end_location: '', distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], amount: '', amount_file: '', invoice_file: '', },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: new Date(Date(startDate)).toISOString().split('T')[0], vehicle: 'Train', start_location: '', end_location: '', distance_remark: [{ remark: "", policy_id: "" }], amount_remark: [{ remark: "", policy_id: "" }], amount: '', amount_file: '', invoice_file: '', },
    ])
    useEffect(() => {

        // *********** travel draft values *******************

        const mappedData = travelData.map((initialExpense, index) => {
            const savedData = draftTravel.find((draft) => draft?.travel_type === initialExpense?.travel_type && draft?.vehicle === initialExpense?.vehicle);
            console.log("savedData", savedData)

            if (savedData) {
                // Extracting amount and parking invoices
                const hasAmountInvoice = savedData?.invoices?.some((invoice) => (
                    invoice?.ei_type === "amount"
                ))
                const hasParkingInvoice = savedData?.invoices?.some((invoice) => invoice?.ei_type === "parking");
                const hasTollInvoice = savedData?.invoices?.some((invoice) => invoice?.ei_type === "toll");
                console.log("hasTollInvoice", hasTollInvoice)

                // Mapping data to initialExpense
                const mappedExpense = {
                    ...initialExpense,
                    uid: index,
                    travel_type: savedData.travel_type || initialExpense?.travel_type,
                    ex_date: savedData.travel_date || initialExpense?.ex_date,
                    actual_distance: savedData.actual_distance || initialExpense?.actual_distance,
                    calculated_distance: savedData.calculated_distance || initialExpense?.calculated_distance,
                    start_location: savedData.start_location || initialExpense?.start_location,
                    end_location: savedData.end_location || initialExpense?.end_location,
                    distance_remark: savedData.distance_remark || initialExpense?.distance_remark,
                    amount_remark: savedData.amount_remark || initialExpense?.amount_remark,
                    amount: hasAmountInvoice
                        ? savedData?.invoices?.filter((invoice, id) => invoice?.ei_type === "amount")[0]?.amount
                        : initialExpense?.amount,
                    amount_file: hasAmountInvoice
                        ? savedData?.invoices.filter((invoice) => invoice?.ei_type === "amount")[0].invoice_file
                        : initialExpense?.amount_file,
                    parking: hasParkingInvoice
                        ? savedData?.invoices
                            .filter((invoice) => invoice?.ei_type === "parking")
                            .map((parkingInvoice, id) => ({
                                pid: id,
                                value: parkingInvoice?.amount
                            }))
                        : [{ pid: 0, value: 0 }],
                    parking_file: hasParkingInvoice
                        ? savedData.invoices
                            .filter((invoice) => invoice?.ei_type === "parking")
                            .map((parkingInvoice, id) => ({
                                pfid: id,
                                value: parkingInvoice?.invoice_file
                            }))
                        : [{ pfid: 0, value: "" }],
                    toll: hasTollInvoice
                        ? savedData?.invoices
                            .filter((invoice) => invoice?.ei_type === "toll")
                            .map((tollInvoice, id) => ({
                                tid: id,
                                value: tollInvoice?.amount
                            }))
                        : [{ tid: 0, value: 0 }],
                    toll_file: hasTollInvoice
                        ? savedData?.invoices
                            .filter((invoice) => invoice?.ei_type === "toll")
                            .map((tollInvoice, id) => ({
                                tfid: id,
                                value: tollInvoice?.invoice_file
                            }))
                        : [{ tfid: 0, value: "" }]
                };
                console.log('mapppped????????????????????????data?', initialExpense)
                return mappedExpense;
            }
            return initialExpense;
        });

        setTravelData(mappedData);
        console.log('mappped datatatatat:::::::????', mappedData)

        // *********** Hotel draft Data value ***********

        const mappedHotelDetails = hotelDetail.map((hotel, index) => {
            const savedHotel = draftHotel[index];

            if (savedHotel) {
                const amountInvoice = savedHotel.invoices.find((invoice) => invoice?.ei_type === 'amount');

                return {
                    ...hotel,
                    city: savedHotel?.city || '',
                    check_in_date: savedHotel?.check_in_date || '',
                    check_out_date: savedHotel?.check_out_date || '',
                    days_count: savedHotel?.days_count || '',
                    amount: amountInvoice ? amountInvoice?.amount : '',
                    invoice_file: amountInvoice ? amountInvoice?.invoice_file : '',
                };
            }

            return hotel;
        });

        // Now, set the mapped hotel details back to the state using setHotelDetails
        setHotelDetails(mappedHotelDetails);

        //  **************** Da Draft data **************

        const mappedDADetails = daDetail.map((da, index) => {
            const savedHotel = draftDA[index];
            if (savedHotel) {
                return {
                    ...da,
                    city: savedHotel?.city || '',
                    date: savedHotel?.ex_date || '',
                    amount: savedHotel?.amount || '',
                };
            }

            return da;
        });

        // Now, set the mapped DA details back to the state using setDADetail
        setDADetail(mappedDADetails);

        //********************** other Data *******************/
        const mappedOtherDetails = otherDetail?.map((other, index) => {
            const savedOther = draftOther[index];
            if (savedOther) {
                return {
                    ...other,
                    title: savedOther?.title || '',
                    amount: savedOther?.amount || '',
                    amount_remark: savedOther?.remark || '',
                    // invoice_file:savedOther?.invoices[0].value
                };
            }

            return other;
        });
        setOtherDetail(mappedOtherDetails);

    }, [])

    const [initialTravelData, setinitialTravelData] = useState([
        {
            uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: '2 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: "", amount_file: '', invoice_file: '',
            parking: [{ pid: 0, value: 0 }], parking_file: [{ pfid: 0, value: "" }]
        },
        { uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: 'Taxi/Cab', start_location: '', end_location: '', calculated_distance: "", amount: '', amount_file: '' },
        {
            uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: "", amount_file: '',
            parking: [{ pid: 0, value: 0 }],
            parking_file: [{ pfid: 0, value: "" }],
            toll: [{ tid: 0, value: 0 }],
            toll_file: [{ tfid: 0, value: '' }]
        },
        {
            uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: '', amount_file: '',
            parking: [{ id: 0, value: 0 }],
            parking_file: [{ pfid: 0, value: "" }],
            toll: [{ tid: 0, value: 0 }],
            toll_file: [{ tfid: 0, value: '' }]
        },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Bus', start_location: '', end_location: '', amount: '', amount_file: '' },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Flight', start_location: '', end_location: '', amount: '', amount_file: '' },
        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Train', start_location: '', end_location: '', amount: '', amount_file: '' },
    ])

    const updateTravelDetails = (field: any, value: any, uid: number) => {
        console.log(`change updateTravelDetails>>",${field}, ${value} and uid:::>>${uid} and expenseMode::>>${expenseMode} and driveType::>>> ${driveType} and travelType::>>${travelType}`)
        const checkExistDate = field === "ex_date" ? travelData.filter((item) => item.ex_date === value).length : 0

        if (checkExistDate >= 1) {
            notifyError("Date is already added")
        }
        else {
            const updatedRows = travelData.map((row, index) =>
                (row.uid === uid && row.travel_type === travelType && row.vehicle === driveType) ? { ...row, [field]: value } : row
            )
            console.log("check..check change updatedRows>>", updatedRows)
            setTravelData(updatedRows)
        }
    };


    const [valueForLocation, setValueForLocation] = useState("")

    const setGoogleLocation = (value) => {
        console.log("setGoogleLocation value>>", value)
        if (value.field.field === "start_location") {
            updateTravelDetails(value?.field?.field, value.locationInfo?.formatted_address, value?.field?.uid)
        }
        else if (value?.field?.field === "end_location") {
            updateTravelDetails('end_location', value.locationInfo?.formatted_address, value?.field?.uid)
            setValueForLocation(value)
        }
    }

    useEffect(() => {
        if (valueForLocation !== "") {
            handleDistanceMatrixRequest(valueForLocation)
        }
    }, [valueForLocation])

    const handleDistanceMatrixRequest = async (value) => {
        console.log('handleDistanceMatrixRequest>>', value)
        const apiKey = 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk';

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://maps.googleapis.com/maps/api/distancematrix/json`,
            headers: {},
            params: {
                origins: `${startLocationData?.startLocation?.lat},${startLocationData?.startLocation?.lng}`,
                destinations: `${endLocationData?.endLocation?.lat},${endLocationData?.endLocation?.lng}`,
                key: apiKey
            }
        };
        console.log("config>>>", config)
        await NewServiceCall(config)
            .then((res) => {
                console.log("handleDistanceMatrixRequest res>>>", res)
                updateTravelDetails('calculated_distance', res.data.rows[0].elements[0].distance.text, value?.field?.uid)
            })
            .catch((err) => {
                console.log("handleDistanceMatrixRequest reerrs>>>", err)
            })
    };

    const [travelTypeDetails, setTravelTypeDetails] = useState<any>([])

    const customeForTravel = (travelFromAPIPassed) => {
        // const travelExpense = subexpense.reduce((result: any, currentSubexpense) => { 
        const travelExpense = travelFromAPIPassed?.reduce((result: any, currentSubexpense) => {
            // Find the corresponding travel mode in the result array
            let travelModeObj: any = result.find((mode: any) => mode.travelMode === currentSubexpense.travel_type);
            // If the travel mode doesn't exist, create a new object
            if (!travelModeObj) {
                travelModeObj = {
                    travelMode: currentSubexpense.travel_type,
                    vehicalType: []
                };
                result.push(travelModeObj);
            }

            // Add the vehicle type to the current travel mode
            travelModeObj.vehicalType.push({ title: currentSubexpense.subexpense_name, icon: currentSubexpense.icon });

            return result;
        }, []);
        console.log("travelExpense>>", travelExpense)
        setTravelTypeDetails(travelExpense)

    }

    const [travelType, setTravelType] = useState("")

    const onChangeValueTravel_type = (event: any) => {
        setTravelType(event.target.value)
    }

    const [driveType, setDriveType] = useState("")

    const handleTravelDetails = (type: string) => {
        setDriveType(type)
    }

    const handleTravelRow = () => {
        const temp = initialTravelData.filter((item) => item.travel_type === travelType && item.vehicle === driveType)
        const existingRow = temp[0]
        const existingDataLength = temp.length
        const newRow = { ...existingRow, ex_date: '', uid: existingDataLength };
        setTravelData(prevTravelData => [...prevTravelData, newRow]);
    };

    const [editUpload, setEditUpload] = useState(false)

    const [fileMetaData, setFileMetaData] = useState({ field: "", uid: Number(''), innerId: Number(""), type: "", subexpense: "" })
    const uploadfilepopup = (field, uid, subex, type) => {
        console.log('file upload check ????????', fileMetaData)
        setEditUpload(true)
        setFileMetaData({ field: field, uid: uid, innerId: Number(''), type: type, subexpense: subex })
    }

    const viewInvoice = (e: any) => {
        console.log('invoice fikeeeee::::::????????', e)
    }
    const uploadParkingTollfilepopup = (field: string, uid: number, pid: number, type: string) => {
        console.log("uploadParkingTollfilepopup>>", field, uid, pid, type)
        setEditUpload(true)
        setFileMetaData({ field: field, uid: uid, innerId: pid, type: type, subexpense: "" })
    }
    const uploadTollfilepopup = (field: string, uid: number, tid: number, type: string) => {
        console.log("uploadTollfilepopup>>", field, uid, tid, type)
        setEditUpload(true)
        setFileMetaData({ field: field, uid: uid, innerId: tid, type: type })
    }
    const uploadHandleFileChange = (event: any) => {
        console.log("uploadHandleFileChange>>", event)
        if (event?.fileid?.type === "meal") {
            updateMealRow(event?.fileid?.uid, event?.file, event?.fileid?.field)
        }
        else if (event?.fileid?.type === "hotel") {
            updateHotelRow(event?.fileid?.uid, event?.file, event?.fileid?.field)
        }
        else if (event?.fileid?.type === "other") {
            updateOtherRow(event?.fileid?.uid, event?.file, event?.fileid?.field)
        }
        else if (event?.fileid?.type === "travel") {
            console.log("inside travel>>", event?.fileid?.field, event?.file, event?.fileid?.uid)
            updateTravelDetails(event?.fileid?.field, event?.file, event?.fileid?.uid)
        }
        else if (event?.fileid?.type === "parking") {
            updateParkingFileValueRow(event?.fileid?.innerId, event?.file, event?.fileid?.uid)
        }
        else if (event?.fileid?.type === "toll") {
            updateTollFileValueRow(event?.fileid?.innerId, event?.file, event?.fileid?.uid)
        }
    }

    const [showMap, setShowMap] = useState(false)
    const [loacationFieldName, setLoacationFieldName] = useState({})
    const openMapFunction = (field, uid, item) => {
        setShowMap(true)
        setLoacationFieldName({ "field": field, "uid": uid, item: item })
        // updateTravelDetails("amount", item.max_distance * item.unit_cost , uid)
        // console.log("item>>",item)
    }

    const handleTravelParkingRow = (type, pid, uid) => {
        setTravelData(prevData => {
            return prevData.map(item => {
                if (item.travel_type === travelType && item.vehicle === driveType && item.uid === uid) {
                    const newItem: any = { ...item };
                    newItem.parking = [
                        ...newItem.parking,
                        { pid: newItem.parking.length, value: 0 },
                    ];
                    newItem.parking_file = [
                        ...newItem.parking_file,
                        { pfid: newItem.parking_file.length, value: '' }
                    ];
                    return newItem;
                }
                return item;
            });
        });
    }

    const handleTravelTollRow = (type, pid, uid) => {
        setTravelData(prevData => {
            return prevData.map(item => {
                if (item.travel_type === travelType && item.vehicle === driveType && item.uid === uid) {
                    const newItem: any = { ...item };
                    newItem.toll = [
                        ...newItem.toll,
                        { tid: newItem.toll.length, value: 0 },
                    ];
                    newItem.toll_file = [
                        ...newItem.toll_file,
                        { tfid: newItem.toll_file.length, value: '' }
                    ];
                    return newItem;
                }
                return item;
            });
        });
    }

    const updateParkingValueRow = (pid, value, uid) => {
        const updatedTravelData = travelData.map((travel: any) => {
            if (
                travel.travel_type === travelType &&
                travel.vehicle === driveType &&
                travel.uid === uid
            ) {
                const parkingObj = travel.parking.find((parking) => parking.pid === pid);
                if (parkingObj) {
                    parkingObj.value = value; // Replace 'YourNewValue' with the actual value you want to set
                }
            }
            return travel;
        });
        setTravelData(updatedTravelData);
    }

    const updateParkingFileValueRow = (pid, value, uid) => {
        // console.log("updateParkingFileValueRow>>", pid, value, uid)
        const updatedTravelData = travelData.map((travel: any) => {
            if (
                travel.travel_type === travelType &&
                travel.vehicle === driveType &&
                travel.uid === uid
            ) {
                const parkingObj = travel.parking_file.find((parking) => parking.pfid === pid);
                console.log("parkingObj>>", parkingObj)
                if (parkingObj) {
                    parkingObj.value = value; // Replace 'YourNewValue' with the actual value you want to set
                }
            }
            return travel;
        });
        setTravelData(updatedTravelData);
    }

    const updateTollFileValueRow = (pid, value, uid) => {
        console.log("updateTollFileValueRow>>", pid, value, uid)
        const updatedTravelData = travelData.map((travel: any) => {
            if (
                travel.travel_type === travelType &&
                travel.vehicle === driveType &&
                travel.uid === uid
            ) {
                const tollObj = travel.toll_file.find((toll) => toll.tfid === pid);
                console.log("tollObj>>", tollObj)
                if (tollObj) {
                    tollObj.value = value; // Replace 'YourNewValue' with the actual value you want to set
                }
            }
            return travel;
        });
        setTravelData(updatedTravelData);
    }

    const updateTollValueRow = (fid, value, uid) => {
        const updatedTravelData = travelData.map((travel: any) => {
            if (
                travel.travel_type === travelType &&
                travel.vehicle === driveType &&
                travel.uid === uid
            ) {
                const tollObj = travel.toll.find((toll) => toll.tid === fid);
                if (tollObj) {
                    tollObj.value = value; // Replace 'YourNewValue' with the actual value you want to set
                }
            }
            return travel;
        });
        setTravelData(updatedTravelData);
    }


    const addExpense = async (totalAmount, status) => {
        // console.log("JSON.stringify(data, null, 2).toString()>>", JSON.stringify(data, null, 2).toString())
        // const testData = data.filter((item) => item.ex_date !== "").filter((row) => row.city !== "").filter((rowData) => rowData.amount !== "")
        console.log("expenseDetails>>????", ...expenseDetails)
        console.log("travelData>>????", ...travelData)

        const tempMealTravel = [...expenseDetails, ...travelData].filter((item: any) => item.ex_date !== "")
        console.log("testData>>", tempMealTravel)
        const tempDA = [...daDetail].filter((item) => item.date !== "")
        const tempOther = [...otherDetail].filter((item) => item.title !== "")
        const tempHotel = [...hotelDetail].filter((item: any) => item.check_in_date !== "" || item.check_out_date !== "")
        const mergedData = [...tempMealTravel, ...tempOther, ...tempDA, ...tempHotel]
        console.log("mergedData >>", mergedData)
        const formData = new FormData();
        formData.append('user_id', userData?.empcode ? userData?.empcode : "");
        formData.append('expense_start_date', startDate ? startDate : "");
        formData.append('expense_end_date', endDate ? endDate : "");
        formData.append('expense_description', descriptionValue ? descriptionValue : "");
        formData.append('expense_total_amount', totalAmount?.toString());
        formData.append('expenses', JSON.stringify(mergedData, null, 2).toString());
        formData.append('status', status)
        formData.append('prev_expense_id', state !== null && state?.screenFrom === "rejected" ? state?.data : 0)
        formData.append('expense_id', state !== null ? state?.data[0]?.id : '0')
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.addExpense,
            headers: {},
            data: formData
        };
        console.log('datadatadatadatadata????????', formData)
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    setTimeout(() => {
                        navigate('./home')
                    }, 1000)
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("addExpense res>>>", res)

            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("addExpense err>>>", err)
            })
    }
    const [tagView, setTagView] = useState(false)
    const [tagList, setTagList] = useState([])
    const tagPeopleView = (list) => {
        setTagView(true)
        setTagList(list)
    }

    // console.log("here expenseDetails>>", expenseDetails)
    // console.log("here travelData>>", travelData)
    // console.log("here hotelDetail>>", hotelDetail)
    // console.log("here daDetail>>", daDetail)
    // console.log("here otherDetail>>", otherDetail)
    // console.log("travelType>>", travelType)
    // console.log("hotelFromAPI>>", hotelFromAPI)
    console.log("here dateArrayValue>>", dateArrayValue)

    useEffect(() => {
        state !== null && state?.screenFrom === "rejected" && rejectDetails(state?.data)
    }, [])

    const [rejectData, setRejectData] = useState([])
    const rejectDetails = async (id: number) => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.resumitExpense,
            headers: {},
            data: { expense_id: id }
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setRejectData(res?.data?.result)
                }
                else {
                    setRejectData([])
                    notifyError("Something went wrong!!")
                }
                console.log("rejectDetails res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setRejectData([])
                notifyError("Something went wrong!!")
                console.log("addExpense err>>>", err)
            })
    }
    const handleImageDownload = (base64, fileName) => {
        base64==="" && notifyError('no file selected')
        base64 !== "" && downloadImage(base64 , fileName);
    };
    console.log("view expenseDetails>>", expenseDetails)
    console.log("view travelData>>", travelData)
    console.log("view hotelDetail>>", hotelDetail)
    console.log("view hotelFromAPI>>", hotelFromAPI)
    console.log("view daDetail>>", daDetail)
    console.log("view otherDetail>>", otherDetail)
    return (
        <div className='mt-20px'>
            {
                state !== null && state?.screenFrom === "rejected" ?
                    <RejectedExpenseDetails data={rejectData} />
                    :
                    ""
            }
            <LoadingSpinner loading={isLoading} />
            <div className='d-flex row space-between alignItem-center flex-wrap mt-30px m-10px mb-1_5rem'>
                <div className='ml-5px mr-5px'>
                    <span className='bold1Rem commonBlackcolor'>New Expense -&nbsp;</span><span className='light0_813Rem commonGraycolor'>Add your expenses details here</span>
                </div>
                <div className='d-flex'>
                    <div className='ml-5px mr-5px'>
                        <WhiteCommonButton
                            title={`Amount:${state?.data[0]?.total_amount ? state?.data[0]?.total_amount : ''}`}
                            subTitle={totalSumAmount ? totalSumAmount : ""}
                            buttonClick={() => console.log()}
                        />
                    </div>
                </div>
            </div>
            <div className='moduleBorder '>
                <div className='d-flex alignItem-start row'>
                    <div className='m-10px mr-15px'>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Start Date"
                            placeholder='Select date here'
                            type='date'
                            className='datepicker'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" className='ml-10px'>
                                    </InputAdornment>
                                )
                            }}

                            value={startDate}
                            variant="standard"
                            onChange={(e) => handleInitialDetails("startDate", e.target.value)}
                        />
                    </div>

                    <div className='m-10px'>
                        <TextField
                            id="input-with-icon-textfield"
                            label="End Date"
                            placeholder='Select date here'
                            type='date'
                            className='datepicker '
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" className='ml-10px'>
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={endDate}
                            onChange={(e) => handleInitialDetails("endDate", e.target.value)}
                        />
                    </div>
                </div>
                <div className='d-flex column m-10px'>
                    <TextField
                        id="input-with-icon-textfield"
                        label="Expense Description"
                        multiline
                        maxRows={4}
                        placeholder="Max 250 characters"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={description} />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ maxLength: 250 }}
                        variant="standard"
                        value={descriptionValue}
                        onChange={(e) => handleInitialDetails("discription", e.target.value)}
                    />
                </div>
            </div>
            <div className='d-flex row alignItem-center flex-wrap mt-30px m-10px mb-30px'>
                <div><span className='bold1Rem commonBlackcolor'>Expense Details -&nbsp;</span><span className='light0_813Rem commonGraycolor'>Add your expenses details step by step here</span></div>
            </div>
            <div className='moduleBorder'>
                {/* Meal, Travel, Hote, DA, Other */}
                <div className='d-flex row flex-wrap m-40px'>
                    {
                        expense.map((expenseList: any, index: any) =>
                            <div key={index}>
                                <FunctionalCommonButton
                                    isActive={expenseList.expense_name === expenseMode}
                                    title={expenseList.expense_name}
                                    onclick={(e: any) => onclickSetExpenseMode(expenseList.expense_name, expenseList.id)} />
                            </div>
                        )
                    }
                </div>
                {
                    expenseMode === "Meal" && expenseDetails.map((item, index) =>
                        <div className='d-flex row mt-30px flex-wrap' key={index}>
                            {/* expenseInsideBox  move to upper class */}
                            <div className='m-10px mr-15px date-position'>
                                <TextField
                                    id="input-with-icon-textfield"
                                    label="Date"
                                    placeholder='Enter Date here'
                                    type='date'
                                    className='datepicker'
                                    disabled={false}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" className='ml-10px'>
                                            </InputAdornment>
                                        )
                                    }}
                                    inputProps={{
                                        min: startDate,
                                        max: endDate,
                                    }}
                                    value={item.ex_date}
                                    variant="standard"
                                    onChange={(e) => updateMealRow(item.uid, e.target.value, 'ex_date')}
                                />
                            </div>
                            <div className="d-flex row">
                                {
                                    expenseMasterData.map((subExpDtl, id) =>
                                        <div className='d-flex row flex-wrap' key={id}>
                                            <div className='d-flex column'>
                                                <div className='m-10px date-position' >
                                                    <TextField
                                                        id={`input-Date-textfield`}
                                                        label={subExpDtl.subexpense_name.charAt(0).toUpperCase() + subExpDtl.subexpense_name.slice(1)}
                                                        type={'number'}
                                                        placeholder={'Enter Amount here'}
                                                        disabled={checkbox[subExpDtl.subexpense_name] ? true : false}
                                                        onChange={(e) => updateMealRow(item?.uid, Number(e.target.value), subExpDtl?.subexpense_name?.toLowerCase())}
                                                        onBlur={
                                                            (e) =>
                                                                subExpDtl?.policies[0]?.unit_cost < Number(e.target.value) ?
                                                                    setViolationFunction(item?.uid, Number(e.target.value), subExpDtl?.subexpense_name?.toLowerCase(), subExpDtl?.policies[0]?.unit_cost, "meal", subExpDtl?.policies[0])
                                                                    : ""
                                                        }
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" className='ml-10px'>
                                                                    <img src={bill} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={checkbox[subExpDtl.subexpense_name]
                                                            ? subExpDtl.policies[0]?.unit_cost
                                                            : item[subExpDtl?.subexpense_name?.toLowerCase()]
                                                        }
                                                    />

                                                    <div className='row d-flex m-10px alignItem-center'>
                                                        <img
                                                            src={tag}
                                                            className='tagImg m-5px'
                                                            onClick={() => tagFuction(item?.uid, `${subExpDtl?.subexpense_name?.toLowerCase()}_tag`)}
                                                        />
                                                        <span
                                                            className='curser'
                                                            onClick={() => tagPeopleView(item[`${subExpDtl?.subexpense_name?.toLowerCase()}_tag`]?.split(', '))}>
                                                            <span className='m-5px light0_875Rem'>{item[`${subExpDtl?.subexpense_name?.toLowerCase()}_tag`] !== "" ? item[`${subExpDtl?.subexpense_name?.toLowerCase()}_tag`]?.split(', ').length : ""}</span>
                                                            <span className='m-5px light0_875Rem'>tags</span>
                                                        </span>
                                                        <Tooltip title="tag your meal companions, be it customers or team members, to keep track of your dining experiences." arrow>
                                                            <img src={i} className='iImg m-5px' />
                                                        </Tooltip>
                                                    </div>
                                                    <div className='row d-flex m-10px alignItem-center' key={id}>
                                                        <input value={checkbox} type="checkbox"
                                                            onChange={(e) => onChangeInvoice(item?.uid, subExpDtl.subexpense_name)}
                                                            checked={checkbox[subExpDtl.subexpense_name] || false}
                                                            className='' />

                                                        <span className='light1Rem flentBlack'>I don't have Invoice</span>
                                                    </div>
                                                    {checkbox[subExpDtl.subexpense_name] ? "" :
                                                        <div className="">
                                                            <div className="blueButtonStyle white d-flex alignItem-center curser"
                                                                // onClick={() => uploadfilepopup("invoice_file", item.uid, subExpDtl.subexpense_name, "meal")}
                                                                onClick={() => uploadfilepopup(`${subExpDtl?.subexpense_name?.toLowerCase()}_invoice`, item.uid, subExpDtl.subexpense_name, "meal")}
                                                            >
                                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                                <span className="light0_813Rem white ml-5px mr-5px">Upload {subExpDtl.subexpense_name.charAt(0).toUpperCase() + subExpDtl.subexpense_name.slice(1)} Invoice</span>

                                                            </div>
                                                            <div className="d-flex curser justfyContent-center">
                                                                <div className="a">
                                                                    <span className="txtstyle " onClick={() => handleImageDownload(item[`${subExpDtl?.subexpense_name?.toLowerCase()}_invoice`], 'file')}>
                                                                        View File
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            {
                                expenseDetails.length - 1 === index ?
                                    <div className="ml-20px">
                                        <img src={add}
                                            onClick={() => handleMealRow()}
                                        />
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                    )
                }
                {
                    expenseMode === "Hotel" && hotelDetail.map((hotelList, index) =>
                        <Fragment key={index}>
                            {
                                hotelFromAPI?.map((hotelData: any, id) =>
                                    <div className='d-flex row mt-30px flex-wrap aa' key={id}>
                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-city-textfield`}
                                                label={'City'}
                                                type={'string'}
                                                placeholder={'Enter City here'}
                                                onChange={(e) => updateHotelRow(hotelList.uid, e.target.value, 'city')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                            <img src={bill} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                                value={hotelList.city}
                                            />
                                        </div>

                                        <div className='m-10px mr-15px date-position'>
                                            <TextField
                                                id={`input-checkIN-textfield`}
                                                label={'Check In'}
                                                type='date'
                                                placeholder={'Enter Date here'}
                                                className='datepicker'
                                                disabled={false}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                inputProps={{
                                                    min: startDate,
                                                    max: endDate,
                                                }}
                                                value={hotelList.check_in_date}
                                                variant="standard"
                                                onChange={(e) => updateHotelRow(hotelList.uid, e.target.value, 'check_in_date')}
                                            />
                                        </div>

                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-checkOut-textfield`}
                                                label={'Check Out'}
                                                type={'date'}
                                                placeholder={'Enter Date here'}
                                                onChange={(e) => updateHotelRow(hotelList.uid, e.target.value, 'check_out_date')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    min: startDate,
                                                    max: endDate,
                                                }}
                                                className='datepicker'
                                                variant="standard"
                                                value={hotelList.check_out_date}
                                            />
                                        </div>
                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-noOfDays-textfield`}
                                                label={'Number of days'}
                                                type={'number'}
                                                placeholder={'Number of days'}
                                                onChange={(e) => updateHotelRow(hotelList.uid, e.target.value, 'days_count')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                            <img src={bill} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                                value={hotelList.days_count}
                                            />
                                        </div>

                                        {
                                            <div className='m-10px date-position' >
                                                <TextField
                                                    id={`input-Amount-textfield`}
                                                    label={'Amount'}
                                                    type={'number'}
                                                    placeholder={'Number amount here'}
                                                    onChange={(e) => updateHotelRow(hotelList.uid, Number(e.target.value), 'amount')}
                                                    onBlur={
                                                        (e) =>
                                                            hotelData?.max_amount < Number(e.target.value) ?
                                                                setViolationFunction(hotelList?.uid, Number(e.target.value), 'amount', hotelData?.max_amount, "hotel", hotelData)
                                                                : ""
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" className='ml-10px'>
                                                                <img src={bill} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="standard"
                                                    value={hotelList.amount}
                                                />
                                            </div>
                                        }

                                        <div className="m-10px">
                                            <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                onClick={() => uploadfilepopup("invoice_file", hotelList.uid, "", "hotel")}
                                            >
                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                            </div>
                                        </div>
                                        <div className="d-flex curser justfyContent-center">
                                            <div className="a">
                                                <span className="txtstyle " onClick={() => handleImageDownload(hotelList.invoice_file, 'file')}>
                                                    View File
                                                </span>
                                            </div>
                                        </div>


                                        {
                                            hotelDetail?.length - 1 === index ?
                                                <div className="ml-20px">
                                                    <img src={add}
                                                        onClick={() => handleHotelRow()}
                                                    />
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                )
                            }
                        </Fragment>
                    )
                }

                {
                    expenseMode === "DA" && daDetail.map((DAList: any, index) =>
                        <Fragment key={index}>
                            {
                                daFromAPI?.map((daData: any, id) =>
                                    <div className='d-flex row mt-30px flex-wrap aa' key={id}>
                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-date-textfield`}
                                                label={'Date'}
                                                type={'date'}
                                                placeholder={'Enter Date here'}
                                                onChange={(e) => updateDARow(DAList.uid, e.target.value, 'date')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    min: startDate,
                                                    max: endDate,
                                                }}
                                                variant="standard"
                                                value={DAList.date}
                                            />
                                        </div>
                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-city-textfield`}
                                                label={'City'}
                                                type={'string'}
                                                placeholder={'Enter City here'}
                                                onChange={(e) => updateDARow(DAList.uid, e.target.value, 'city')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                            <img src={bill} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                                value={DAList.city}
                                            />
                                        </div>
                                        {
                                            <div className='m-10px date-position' >
                                                <TextField
                                                    id={`input-Amount-textfield`}
                                                    label={'Amount'}
                                                    type={'number'}
                                                    placeholder={'Number amount here'}
                                                    onChange={(e) => updateDARow(DAList.uid, Number(e.target.value), 'amount')}
                                                    onBlur={
                                                        (e) =>
                                                            daData?.max_amount < Number(e.target.value) ?
                                                                setViolationFunction(DAList?.uid, Number(e.target.value), 'amount', daData?.max_amount, "da", daData)
                                                                :
                                                                ""
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" className='ml-10px'>
                                                                <img src={bill} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="standard"
                                                    value={DAList.amount}
                                                />
                                            </div>
                                        }
                                        {
                                            daDetail?.length - 1 === index ?
                                                <div className="ml-20px">
                                                    <img src={add}
                                                        onClick={() => handleDARow()}
                                                    />
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                )
                            }
                        </Fragment>
                    )
                }

                {
                    expenseMode === "Other" && otherDetail.map((OtherList: any, index) =>
                        <Fragment key={index}>
                            {
                                <div className='d-flex row mt-30px flex-wrap aa'>
                                    <div className='m-10px date-position' >
                                        <TextField
                                            id={`input-title-textfield`}
                                            label={'Title'}
                                            type={'string'}
                                            placeholder={'Enter title here'}
                                            onChange={(e) => updateOtherRow(OtherList.uid, e.target.value, 'title')}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" className='ml-10px'>
                                                        <img src={bill} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="standard"
                                            value={OtherList.title}
                                        />
                                    </div>
                                    {
                                        <div className='m-10px date-position' >
                                            <TextField
                                                id={`input-city-textfield`}
                                                label={'Amount'}
                                                type={'number'}
                                                placeholder={'Enter Amount here'}
                                                onChange={(e) => updateOtherRow(OtherList.uid, Number(e.target.value), 'amount')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start" className='ml-10px'>
                                                            <img src={bill} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="standard"
                                                value={OtherList.amount}
                                            />
                                        </div>
                                    }
                                    {
                                        <div className="m-10px">
                                            <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                onClick={() => uploadfilepopup("invoice_file", OtherList.uid, "", "other")}
                                            >
                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                            </div>
                                            {
                                                OtherList.invoice_file !== "" ?
                                                    <div className="d-flex curser justfyContent-center">
                                                        <div className="a">
                                                            <span className="txtstyle " onClick={() => handleImageDownload(OtherList.invoice_file, 'file')}>
                                                                View File
                                                            </span>
                                                        </div>
                                                    </div>
                                                    : ''
                                            }
                                        </div>
                                    }
                                    {
                                        <div className="ml-20px">
                                            <img src={add}
                                                onClick={() => handleOtherRow()}
                                            />
                                        </div>
                                    }
                                </div>
                            }
                        </Fragment>
                    )
                }
                {
                    expenseMode === "Other" &&
                    <div className='d-flex'>
                        <TextField
                            id={`input-remark-textfield`}
                            label={"Remark"}
                            type={"string"}
                            className='w-100per'
                            multiline
                            maxRows={4}
                            placeholder={`Enter Remarks here`}
                            onChange={(e) => updateOtherRemarks('remarks', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" className='ml-10px'>
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={otherDetail[0]?.remark}
                        />
                    </div>
                }
                {
                    expenseMode === "Travel" &&
                    <div>
                        <span onChange={(e) => onChangeValueTravel_type(e)} className='d-flex'>
                            <div className='radioButtonMealWithCustomer'>
                                <span>
                                    <input type="radio" value="local" name="travel" id='radioforlocalTravel' />
                                </span>
                                <label className='d-flex column alignItem-start' htmlFor='radioforlocalTravel'>
                                    <span className='bold0_875Rem fentBlack'>Local</span>
                                    <span className='light0_875Rem fentBlack'>You are creating this request for a trip
                                        within your home city.</span>
                                </label>
                            </div>
                            <div className='radioButtonMealWithTeam'>
                                <span>
                                    <input type="radio" value="domestic" name="travel" id='radiofordometricTravel' />
                                </span>
                                <label className='d-flex column alignItem-start' htmlFor='radiofordometricTravel'>
                                    <span className='bold0_875Rem fentBlack'>Domestic</span>
                                    <span className='light0_875Rem fentBlack'>You are creating this request for a trip
                                        outside your home city.</span>
                                </label>
                            </div>
                        </span>
                        <div className='d-flex row flex-wrap'>
                            {
                                travelTypeDetails.filter((item) => item.travelMode === travelType)[0]?.vehicalType.map((item, id) =>
                                    <span className='travelButton d-flex alignItem-center curser' key={id}
                                        onClick={() => handleTravelDetails(item.title)}
                                        style={{ backgroundColor: driveType === item.title ? '#027DC2' : '#EFEFEF', color: driveType === item.title ? "#ffff" : "#18181B" }}
                                    >
                                        <img src={expenseUrl.initialUrl + '/' + item.icon} className='ml-5px mr-5px travelIcon' />
                                        <span>{item.title}</span>
                                    </span>
                                )
                            }
                        </div>
                        {
                            travelData.filter((item) => item.travel_type === travelType && item.vehicle === driveType).map((dataValue: any, id) =>
                                <div key={id}>
                                    {
                                        travelFromAPI.filter((travelRow: any) => travelRow.subexpense_name === driveType && travelRow.travel_type === travelType).map((item: any, id) =>
                                            <div className='d-flex row flex-wrap'>
                                                <div className='m-10px mr-15px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Date"
                                                        placeholder='Enter Date here'
                                                        type='date'
                                                        disabled={false}
                                                        className='datepicker'
                                                        InputProps={{
                                                            startAdornment: (
                                                                <div>
                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                        {/* {field.title === 'amount' ? <img src={bill} /> : field.title === "Calculated distance" ? <img src={distance} /> : field.title === "date" ? "" : field.title === "amount" ? <img src={bill} /> : <img src={map} />} */}
                                                                    </InputAdornment>
                                                                </div>
                                                            ),
                                                        }}
                                                        inputProps={{
                                                            min: startDate,
                                                            max: endDate,
                                                        }}
                                                        variant="standard"
                                                        value={dataValue.ex_date}
                                                        onChange={(e) => updateTravelDetails("ex_date", e.target.value, dataValue.uid)}
                                                    />
                                                </div>
                                                <div className='m-10px '>
                                                    <TextField
                                                        id={`input-startLoaction-textfield`}
                                                        label={"Start Location"}
                                                        type={"string"}
                                                        disabled={true}
                                                        multiline
                                                        maxRows={4}
                                                        placeholder={`Choose start location`}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <div
                                                                    onClick={() => openMapFunction('start_location', dataValue.uid, item?.policies[0])}
                                                                >
                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                        <img src={distance} />
                                                                    </InputAdornment>
                                                                </div>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={dataValue.start_location}
                                                    />
                                                </div>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id={`input-endLoaction-textfield`}
                                                        label={"End Location"}
                                                        type={"string"}
                                                        disabled={true}
                                                        multiline
                                                        maxRows={4}
                                                        placeholder={`Choose end location`}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <div
                                                                    onClick={() => openMapFunction('end_location', dataValue.uid, item?.policies[0])}
                                                                >
                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                        <img src={distance} />
                                                                    </InputAdornment>
                                                                </div>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={dataValue.end_location}
                                                    />
                                                </div>
                                                {
                                                    // item.has_max_distance === "yes" ?
                                                    <div className='m-10px'>
                                                        <TextField
                                                            id={`input-actualDistance-textfield`}
                                                            label={"Actual Distance"}
                                                            type={"number"}
                                                            disabled={false}
                                                            placeholder={`Enter actual distance`}
                                                            // onBlur={
                                                            //     (e) =>
                                                            //         (item?.policies[0]?.max_distance < Number(e.target.value) ?
                                                            //             setViolationFunction(dataValue.uid, Number(e.target.value), 'actual_distance', item?.policies[0]?.max_distance, "travel", item)
                                                            //             :
                                                            //             "")
                                                            //             setAmount(dataValue.uid,item)
                                                            // }
                                                            onBlur={(e) => {
                                                                // Check if max_distance is less than the entered value
                                                                if (item?.policies[0]?.max_distance < Number(e.target.value)) {
                                                                    console.log("dddexpense")
                                                                    // If true, call setViolationFunction with specific parameters
                                                                    setViolationFunction(dataValue.uid, Number(e.target.value), 'actual_distance', item?.policies[0]?.max_distance, "travel", item?.policies[0]);
                                                                } else {
                                                                    console.log("ddd")
                                                                    // If false, do nothing
                                                                    // You might want to handle this case or remove the else block if it's not needed
                                                                }
                                                                // This line seems unrelated and is not part of the conditional block
                                                                setAmount(dataValue.uid, item, Number(e.target.value), dataValue.calculated_distance);
                                                            }}
                                                            onChange={(e) => updateTravelDetails("actual_distance", e.target.value, dataValue.uid)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div
                                                                    >
                                                                        <InputAdornment position="start" className='ml-10px'>
                                                                            <img src={distance} />
                                                                        </InputAdornment>
                                                                    </div>
                                                                ),
                                                            }}
                                                            variant="standard"
                                                            value={dataValue.actual_distance}
                                                        />
                                                    </div>
                                                    // :
                                                    // ""
                                                }
                                                <div className='m-10px'>
                                                    <TextField
                                                        id={`input-calculatedDistance-textfield`}
                                                        label={"Calculated Distance"}
                                                        type={"string"}
                                                        disabled={true}
                                                        placeholder={`calculated distance`}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <div>
                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                        <img src={distance} />
                                                                    </InputAdornment>
                                                                </div>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={dataValue.calculated_distance}
                                                    />
                                                </div>
                                                {
                                                    // item.has_max_amount === "yes" ?
                                                    <div className='m-10px'>
                                                        <TextField
                                                            id={`input-amount-textfield`}
                                                            label={"Amount"}
                                                            type={"number"}
                                                            disabled={true}
                                                            placeholder={`enter amount here`}
                                                            // onBlur={
                                                            //     (e) =>
                                                            //         item?.policies[0]?.max_amount < Number(e.target.value) ?
                                                            //             setViolationFunction(dataValue.uid, Number(e.target.value), 'amount', item?.policies[0]?.max_amount, "travel")
                                                            //             :
                                                            //             ""
                                                            // }
                                                            // onChange={(e) => updateTravelDetails("amount", e.target.value, dataValue.uid)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div>
                                                                        <InputAdornment position="start" className='ml-10px'>
                                                                            <img src={amount} />
                                                                        </InputAdornment>
                                                                    </div>
                                                                ),
                                                            }}
                                                            variant="standard"
                                                            value={dataValue.amount === null ? 0 : dataValue.amount}
                                                        />
                                                    </div>
                                                    // :
                                                    // ""
                                                }
                                                {
                                                    // item.has_invoice === "yes" ?
                                                    <>
                                                        <div className="m-10px">
                                                            <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                onClick={() => uploadfilepopup('invoice_file', dataValue.uid, "", 'travel')}
                                                            >
                                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                                <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                            </div>
                                                        </div>
                                                        {
                                                            dataValue?.invoice_file !== "" ?
                                                                <div className="d-flex curser justfyContent-center">
                                                                    <div className="a">
                                                                        <span className="txtstyle " onClick={() => handleImageDownload(dataValue?.invoice_file, 'file')}>
                                                                            View File
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                : ''
                                                        }
                                                    </>
                                                    // :
                                                    // ""
                                                }
                                                <div className="ml-20px">
                                                    <img src={add}
                                                        onClick={() => handleTravelRow()}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        driveType === "2 Wheeler" || driveType === "4 Wheeler" ?
                                            <>
                                                {
                                                    dataValue !== undefined && dataValue?.parking.map((parkingData, id) =>
                                                        <div className='d-flex row flex-wrap' key={id}>
                                                            <div className='m-10px'>
                                                                <TextField
                                                                    id={`input-parking-textfield`}
                                                                    label={"Parking"}
                                                                    type={"number"}
                                                                    disabled={false}
                                                                    placeholder={`enter amount here`}
                                                                    onChange={(e) => updateParkingValueRow(parkingData.pid, Number(e.target.value), dataValue.uid,)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <div>
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                    <img src={parking} />
                                                                                </InputAdornment>
                                                                            </div>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                    value={parkingData?.value}
                                                                />
                                                            </div>
                                                            <div className="m-10px">
                                                                <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                    onClick={() => uploadParkingTollfilepopup('value', dataValue.uid, parkingData.pid, 'parking')}
                                                                >
                                                                    <img src={uploadImg} className="ml-5px mr-5px" />
                                                                    <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                </div>

                                                                {
                                                                    dataValue?.parking_file.find(item => item.pfid === parkingData.pid).value !== "" ?
                                                                        <div className="d-flex curser justfyContent-center">
                                                                            <div className="a">
                                                                                <span className="txtstyle "
                                                                                    onClick={() => handleImageDownload(dataValue?.parking_file.find(item => item.pfid === parkingData.pid).value, 'file')}
                                                                                >
                                                                                    View File
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        : ''
                                                                }
                                                            </div>
                                                            <div className="ml-20px">
                                                                <img src={add}
                                                                    onClick={() => handleTravelParkingRow('parking', parkingData?.pid, dataValue?.uid)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>
                                            :
                                            ""
                                    }
                                    {
                                        driveType === "4 Wheeler" ?
                                            <>
                                                {
                                                    dataValue !== undefined && dataValue?.toll.map((tollData, id) =>
                                                        <div className='d-flex row flex-wrap' key={id}>
                                                            <div className='m-10px'>
                                                                <TextField
                                                                    id={`input-toll-textfield`}
                                                                    label={"Toll"}
                                                                    type={"number"}
                                                                    disabled={false}
                                                                    placeholder={`enter amount here`}
                                                                    onChange={(e) => updateTollValueRow(tollData?.tid, Number(e.target.value), dataValue?.uid,)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <div>
                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                    <img src={toll} />
                                                                                </InputAdornment>
                                                                            </div>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                    value={tollData?.value}
                                                                />
                                                            </div>
                                                            <div className="m-10px">
                                                                <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                    onClick={(e) => uploadTollfilepopup('value', dataValue.uid, tollData.tid, 'toll')}
                                                                >
                                                                    <img src={uploadImg} className="ml-5px mr-5px" />
                                                                    <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                </div>
                                                                {
                                                                    dataValue?.toll_file?.find(item => item.pfid === tollData?.pid).value !== "" ?
                                                                        <div className="d-flex curser justfyContent-center">
                                                                            <div className="a">
                                                                                <span className="txtstyle " onClick={() => handleImageDownload(dataValue?.toll_file?.find(item => item.pfid === tollData?.pid).value, 'file')}>
                                                                                    View File
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        : ''
                                                                }
                                                            </div>
                                                            <div className="ml-20px">
                                                                <img src={add}
                                                                    onClick={() => handleTravelTollRow('toll', tollData?.tid, dataValue?.uid)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>
                                            :
                                            ""
                                    }
                                </div>
                            )
                        }
                    </div>
                }
            </div>
            <div className='d-flex row justfyContent-end  flex-wrap'>
                <div className='d-flex row flex-wrap'>
                    <div className='m-10px'>
                        <CancelCommonButton
                            title={"Cancel"}
                            buttonClick={() => navigate('/home')}
                        />
                    </div>
                    <div className='m-10px'>
                        <WhiteCommonButton
                            title={"Save for later"}
                            subTitle={""}
                            buttonClick={() => validation("draft")}
                        />
                    </div>
                    <div className='m-10px'>
                        <BlueCommonButton
                            title={"Submit"}
                            subTitle={""}
                            buttonClick={() => validation("pending")}
                        />
                    </div>
                </div>
            </div>
            {
                showTag &&
                <ShareMealPopup
                    close={() => setShowTag(false)}
                    passId={metaData}
                    data={(e: any) => setShareMealDataFunction(e)}
                />
            }
            {
                showViolation &&
                <ViolationPopup
                    close={(e) => cancelViolation(e)}
                    data={violationMetaData}
                    submit={(e: any) => {
                        console.log('violoation datattatta?????????', e)
                        violationDataHandle(e)
                    }}
                />
            }
            {
                editUpload &&
                <EditUpload
                    close={() => setEditUpload(false)}
                    fileId={fileMetaData}
                    passidType={fileMetaData}
                    parkingID={''}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => {
                        console.log('upoad datattta???????/', e)
                        uploadHandleFileChange(e)
                    }}
                />
            }
            {
                showMap &&
                <GoogleMaps
                    close={() => setShowMap(false)}
                    fieldType={loacationFieldName}
                    passData={(e) => {
                        console.log('setGoogleLocation?????????', e)
                        setGoogleLocation(e)
                    }}
                />
            }
            {
                tagView &&
                <TagPopup
                    close={() => setTagView(false)}
                    data={tagList}
                />

            }
            {toastContainer()}
        </div >
    )
}