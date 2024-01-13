import React, { useState, useRef, useEffect } from 'react';
import { BlueCommonButton, WhiteCommonButton, UploadCommonButton, CancelCommonButton, FunctionalCommonButton, AddButton } from '../../components/button.tsx'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import calender from '../../assets/images/calender.svg'
import description from '../../assets/images/description.svg'
import bill from '../../assets/images/bill.svg'
import tag from '../../assets/images/tag.svg'
import i from '../../assets/images/i.svg'
import './createExpenseStyles.css'
import Tooltip from '@mui/material/Tooltip';
import { ShareMealPopup } from './shareMealPopUp.tsx'
import car from '../../assets/images/travel/car.svg'
import bike from '../../assets/images/travel/bike.svg'
import taxi from '../../assets/images/travel/taxi.svg'
import map from '../../assets/images/travel/map.svg'
import distance from '../../assets/images/travel/distance.svg'
import amount from '../../assets/images/travel/amount.svg'
import add from '../../assets/images/travel/add.svg'
import parking from '../../assets/images/travel/parking.svg'
import uploadImg from '../../assets/images/uploadImg.svg'
import bus from '../../assets/images/travel/bus.svg'
import flight from '../../assets/images/travel/flight.svg'
import train from '../../assets/images/travel/train.svg';
import toll from '../../assets/images/travel/toll.svg';
import search from '../../assets/images/search1.svg';
import Autocomplete from '@mui/material/Autocomplete';
import { EditUpload } from '../teamRequest/editUpload.tsx';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';
import { useSelector, useDispatch } from 'react-redux';
import { setData,selectData } from '../../Redux/features/login/loginSlicer'
import { ServiceCall } from '../../service/config';
import { expenseUrl } from '../../service/url';
import { GoogleMaps } from '../../components/googleMapPopup.tsx';
import { NewServiceCall } from '../../service/config.js';
import { TextBoxReact } from '../../components/textBox.tsx';
import LoadingSpinner from "../../components/loader.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { startLocationReduxData, endLocationReduxData } from '../../Redux/features/googleLocation/googleLocationSlicer'
export const CreateExpense: React.FC = () => {
    const startLocationData = useSelector(startLocationReduxData);
    const endLocationData = useSelector(endLocationReduxData);
    const [showMap, setShowMap] = useState(false)
    const storedData = useSelector(setData);
    const userData = storedData?.payload?.login?.items[0]
    const [amountValue, setAmmountValue] = useState(0)
    const [showPopup, setShowPopup] = useState(false)
    const [driveType, setDriveType] = useState("")
    const [travelType, setTravelType] = useState("")
    const [travel2WheelerDetails, setTravel2WheelerDetails] = useState([{ type: "travel", ex_date: '', travel_type: travelType, vehicle: '2 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: [], amount_file: [], parking: [{ value: 0 }], parking_file: [{ value: "" }] }])
    const [travel4WheelerDetails, setTravel4WheelerDetails] = useState([{ type: "travel", travel_type: travelType, ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: [], amount_file: [], parking: [{ value: 0 }], parking_file: [{ value: "" }], toll: [{ value: 0 }], toll_file: [{ value: '' }] }])
    const [travel4WheelerDomesticDetails, setTravel4WheelerDomesticDetails] = useState([{ type: "travel", travel_type: travelType, ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: [], amount_file: [], parking: [{ value: 0 }], parking_file: [{ value: "" }], toll: [{ value: 0 }], toll_file: [{ value: '' }] }])
    const [editUpload, setEditUpload] = useState(false)
    const [mealData, setMealData] = useState({ id: "", tagType: '', uidValue: '' })
    const navigate = useNavigate();
    const [renderData, setRenderData] = useState([])

    const onclickSetExpenseMode = (e: any) => {
        console.log("onclickSetExpenseMode click>>", e)
        // const test = actualData.data.filter((row)=> row.type === "DA")[0].data[0]
        // console.log("test>>",test)
        if (startDate === "") {
            notifyWarning("Choose start date")
        }
        else if (endDate === "") {
            notifyWarning("Choose end date")
        }
        else if (descriptionValue === "") {
            notifyWarning("Enter description")
        }
        else if (e === "Hotel") {
            const DANotAllowed = actualData.data.filter((row) => row?.type === "DA")[0]?.data[0]?.amount !== ""
            console.log("DANotAllowed>>>", DANotAllowed)
            if (DANotAllowed) {
                notifyWarning("You can not add expense for Hotel")
            }
            else {
                setExpenseMode(e)
                setTravelType("")
                const tempRenderData: any = actualData.data.filter((item) => item.type === e)
                setRenderData(tempRenderData)
            }
        }
        else if (e === "DA") {
            const DANotAllowed = actualData.data.filter((row) => row?.type === "Hotel")[0]?.data[0]?.amount !== ""
            if (DANotAllowed) {
                notifyWarning("You can not add expense for DA")
            }
            else {
                setExpenseMode(e)
                setTravelType("")
                const tempRenderData: any = actualData.data.filter((item) => item.type === e)
                setRenderData(tempRenderData)
            }
        }
        else {
            setExpenseMode(e)
            setTravelType("")
            const tempRenderData: any = actualData.data.filter((item) => item.type === e)
            setRenderData(tempRenderData)
        }


    }
    console.log("renderData>>", renderData)
    const onChangeValueTravel_type = (event: any) => {
        setTravelType(event.target.value)
    }

    const uploadHandleParkingFileChange = (event: any) => {
        handle2WheeltravelParkingfileChange(event.parkingiD.innerId, event.parkingiD.id, 'value', event.file)
    }

    const uploadHandle4WheelerParkingFileChange = (event: any) => {
        handle4WheeltravelParkingfileChange(event.parkingiD.innerId, event.parkingiD.id, 'value', event.file)
    }

    const uploadHandle4WheelerDomesticParkingFileChange = (event: any) => {
        handle4WheelDomestictravelParkingfileChange(event.parkingiD.innerId, event.parkingiD.id, 'value', event.file)
    }

    const uploadHandle4WheelerTollFileChange = (event: any) => {
        handle4WheeltravelTollfileChange(event.parkingiD.innerId, event.parkingiD.id, 'value', event.file)
    }

    const uploadHandle4WheelerDomesticTollFileChange = (event: any) => {
        handle4WheelDomestictravelTollfileChange(event.parkingiD.innerId, event.parkingiD.id, 'value', event.file)
    }

    const handle4WheeltravelParkingfileChange = (indexinner: number, index: number, field: any, value: any) => {
        const updatedRows = [...travel4WheelerDetails];
        updatedRows[index].parking_file[indexinner][field] = value
        setTravel4WheelerDetails(updatedRows)
    }

    const handle4WheelDomestictravelParkingfileChange = (indexinner: number, index: number, field: any, value: any) => {
        const updatedRows = [...travel4WheelerDomesticDetails];
        updatedRows[index].parking_file[indexinner][field] = value
        setTravel4WheelerDomesticDetails(updatedRows)
    }

    const handle4WheeltravelTollfileChange = (indexinner: number, index: number, field: any, value: any) => {
        const updatedRows = [...travel4WheelerDetails];
        updatedRows[index].toll_file[indexinner][field] = value
        setTravel4WheelerDetails(updatedRows)
    }

    const handle4WheelDomestictravelTollfileChange = (indexinner: number, index: number, field: any, value: any) => {
        const updatedRows = [...travel4WheelerDomesticDetails];
        updatedRows[index].toll_file[indexinner][field] = value
        setTravel4WheelerDomesticDetails(updatedRows)
    }

    const handle2WheeltravelParkingfileChange = (indexinner: number, index: number, field: any, value: any) => {
        const updatedRows = [...travel2WheelerDetails];
        updatedRows[index].parking_file[indexinner][field] = value
        setTravel2WheelerDetails(updatedRows)
    }
    // handleTravelDetails function create new object according to vehical type
    const handleTravelDetails = (type: string) => {
        setDriveType(type)
        console.log("type>>", type)
    }

    const onclickButton = () => {
        alert("click for save for later")
    }

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [descriptionValue, setDescription] = useState("")

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
                    setEndDate(value)
                    createNewMealRow(value)
                }
            }
        }
        else if (type === "discription") {
            setDescription(value)
        }
    }
    const loginStatus = useSelector(selectData);
    const clientLocation = loginStatus?.role?.job_location
    const createNewMealRow = (endDateParam: any) => {
        var date1 = new Date(startDate);
        var date2 = new Date(endDateParam);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24) + 1);
        var dateArray = [...Array(Difference_In_Days)].map((_, index) => {
            const newDate = new Date(date1);
            newDate.setDate(date1.getDate() + index);
            return newDate.toISOString().split('T')[0];
        });

        console.log("dateArray>>", dateArray)
        const existingRow = actualData.data.filter((item) => item.type === "Meal")[0].data[0];
        const FinalResult = dateArray.map((date, id) => ({
            ...existingRow,
            ex_date: date,
            uid: id
        }));

        const FinalResult2 = dateArray.map((date, id) => ({
            ...existingRow,
            ex_date: date,
            uid: id,
            breakfast: 120,
            lunch: 120,
            dinner: 120
        }));

        // const FinalResult2 = (clientLocation === "client site") ? dateArray.map((date, id) => ({
        //     ...existingRow,
        //     ex_date: date,
        //     uid: id,
        //     breakfast: 120,
        //     lunch: 120,
        //     dinner: 120
        // }))
        //     :
        //     dateArray.map((date, id) => ({
        //         ...existingRow,
        //         ex_date: date,
        //     }))


        console.log("FinalResult>>", FinalResult)
        console.log("FinalResult2>>", FinalResult2)

        setInsideActualData((prevData: any) => ({
            ...prevData,
            data: prevData.data.map((item: any) =>
                item.type === 'Meal'
                    ? { ...item, data: clientLocation === "client site" ?[ ...FinalResult2] : [...FinalResult] }
                    : item
            ),
        }));
    }

    const sumDataField = [
        { type: "meal", field: ['breakfast', 'dinner', 'lunch'] },
        { type: "hotel", field: ['amount'] },
        { type: "da", field: ['amount'] },
        { type: "other", field: ['amount'] },
        { type: "travel", field: ['amount', 'value'] },
    ]
    const [collectedRowsData, setCollectedRows] = useState([])

    const validation = (status: string) => {
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
            onclickButtonSubmit(status)
        }
    }
    const onclickButtonSubmit = (status) => {
        const temp = actualData.data.map((eachTypeData, id) => {
            const eachTypeDataTemp = eachTypeData.data.map((rowData, id) => {
                return rowData
                // if (rowData.ex_date !== '') {
                //     console.log("rowData>>", rowData)
                //     return rowData
                // }
                // return null
            }
            ).filter(rowData => rowData !== null)
            return eachTypeDataTemp
        })
        console.log("temp>>>", temp)
        const collectedRows = temp.flat();
        const collectedRows1 = temp.flat();
        console.log("collectedRows>>", collectedRows);
        console.log("collectedRows1>>", collectedRows1);
        const remark = actualData.data.filter((item) => item.type === 'Other')[0].remark
        console.log("remark>>", remark)
        const newData = collectedRows1.map(item => {
            // Check if the type is "other"
            if (item.type === 'other') {
                // Add the "remark" field
                return { ...item, remark: remark };
            }

            // If type is not "other", return the item as is
            return item;
        });

        console.log("newData change>>", newData)

        const collectedRows1Temp = [...newData, { type: 'other', remark: remark }]
        console.log("collectedRows1Temp>>", collectedRows1Temp)
        setCollectedRows(newData)
        
        let grandTotal = 0;
        console.log("collectedRows grandTotal>>", grandTotal);
        setTimeout(() => addExpense(grandTotal, newData, status), 500)
    }

    const setShareMealDataFunction = (data: any) => {
        console.log("setShareMealDataFunction>>>", data)
        if (Array.isArray(data.newValue)) {
            const result = data.newValue.map(item => item);
            console.log("result>>",result)
            handleOnlyMealDetails(data.passId.id, data.passId.tagType, result.join(', '), data.passId.uidValue)
        }
        else {
            // handleOnlyMealDetails = (index: number, field: any, value: any, uid: number)
            handleOnlyMealDetails(data.passId.id, data.passId.tagType, data.newValue, data.passId.uidValue)
        }
    }

    const [uploadFileParking, setUploadFileParking] = useState(false)

    const [upload4WheelerFileParking, setUpload4WheelerFileParking] = useState(false)

    const [upload4WheelerDomesticFileParking, setUpload4WheelerDomesticFileParking] = useState(false)

    const [upload4WheelerFileToll, setUpload4WheelerFileToll] = useState(false)
    const [upload4WheelerDomesticFileToll, setUpload4WheelerDomesticFileToll] = useState(false)

    const [isLoading, setLoading] = useState(false)
    const [totalFinalAmount, setTotalFinalAmount] = useState(0)
    const addExpense = async (totalAmount, data, status) => {
        console.log("addExpense actualData>>>", actualData)
        console.log("JSON.stringify(data, null, 2).toString()>>", JSON.stringify(data, null, 2).toString())
        const testData = data.filter((item) => item.ex_date !== "").filter((row) => row.city !== "").filter((rowData) => rowData.amount !== "")
        console.log("testData>>", testData)

        const totalAmountData = testData.reduce((acc, curr) => {
            if (curr?.amount) {
                acc = acc + curr.amount
            }
            else {
                acc = acc + (curr?.breakfast === undefined ? 0 : curr?.breakfast) + (curr?.dinner === undefined ? 0 : curr?.dinner) + (curr?.lunch === undefined ? 0 : curr?.lunch)
            }
            let totalinner = 0
            if (curr?.parking) {
                const innerAmount = curr.parking.reduce((a, c) => {
                    a = a + (c?.value === undefined ? 0 : c.value)
                    return a
                }, 0)
                totalinner = innerAmount + totalinner
            }
            if (curr.toll) {
                const innerAmount = curr?.toll.reduce((a, c) => {
                    a = a + (c?.value === undefined ? 0 : c?.value)
                    return a
                }, 0)
                totalinner = innerAmount + totalinner
            }
            return acc + totalinner
        }, 0)
        console.log("testData result>>", totalAmountData)
        setTotalFinalAmount(totalAmountData)
        const formData = new FormData();
        formData.append('user_id', userData?.empcode ? userData?.empcode : "");
        // formData.append('user_id', "123");
        formData.append('expense_start_date', startDate ? startDate : "");
        formData.append('expense_end_date', endDate ? endDate : "");
        formData.append('expense_description', descriptionValue ? descriptionValue : "");
        formData.append('expense_total_amount', totalAmountData?.toString());
        formData.append('expenses', JSON.stringify(testData, null, 2).toString());
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
                if (res.status === 200) {
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

    // ************************************************down down    down   down  *****************************

    const uploadHandleFileChange = (event: any) => {
        console.log("uploadHandleFileChange>>", event)
        if (event.fieldName === "parking_file") {
            handleMealDetailsParkingFiles(event.fileid, event.fieldName, event.file, 0, event.uid, event.pid)
        }
        else if (event.fieldName === "toll_file") {
            handleMealDetailsTollFiles(event.fileid, event.fieldName, event.file, 0, event.uid, event.pid)
        }
        else if (event.type === 'travel') {
            handleMealDetails(event.fileid, event.fieldName, event.file, event.uid)
        }
        else {
            handleOnlyMealDetails(event.fileid, event.fieldName, event.file, event.uid)
        }
    }

    const [expenseMode, setExpenseMode] = useState("")
    const tagFuction = (id: any, value: any, tagName: string, uid: any) => {
        console.log("id,value,tagName>>", id, value, tagName)
        setShowPopup(true)
        setMealData({ id: id, tagType: tagName, uidValue: uid })
    }

    const [fileId, setFileId] = useState()
    const [idType, setIdType] = useState({ idData: "", innerIdData: '', typeData: "", fieldValue: '', uidData: "", pidData: '' })

    const uploadfilepopup = (id: any, innerId: any, type: any, field: string, uid: any, pid: any) => {
        console.log("id,innerId,type,field>>", id, innerId, type, field)
        setEditUpload(true)
        setFileId(id)
        setIdType({ idData: id, innerIdData: innerId, typeData: type, fieldValue: field, uidData: uid, pidData: pid })
    }

    // default value for travel
    const defaultTravelData = [
        {
            type: "travel", travel_type: 'local', ex_date: '', vehicle: '2 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: '', amount_file: [],
            parking: [{ pid: 0, value: undefined }], parking_file: [{ pfid: 0, value: "" }]
        },
        { type: "travel", travel_type: 'local', ex_date: '', vehicle: 'Taxi/Cab', start_location: '', end_location: '', calculated_distance: "", amount: '', amount_file: '' },
        {
            type: "travel", travel_type: 'local', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: '', amount_file: [],
            parking: [{ pid: 0, value: undefined }],
            parking_file: [{ pfid: 0, value: "" }],
            toll: [{ tid: 0, value: undefined }],
            toll_file: [{ tfid: 0, value: '' }]
        },
        {
            type: "travel", travel_type: 'domestic', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: '', amount_file: [],
            parking: [{ pid: 0, value: undefined }],
            parking_file: [{ pfid: "", value: "" }],
            toll: [{ tid: 0, value: undefined }],
            toll_file: [{ tfid: '', value: '' }]
        },
        { type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Bus', start_location: '', end_location: '', amount: [], amount_file: [] },
        { type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Flight', start_location: '', end_location: '', amount: [], amount_file: [] },
        { type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Train', start_location: '', end_location: '', amount: [], amount_file: [] },
        { type: 'meal', ex_date: '', breakfast: undefined, lunch: undefined, dinner: undefined, invoice_file: '', breakfast_tag: '', lunch_tag: '', dinner_tag: '' },
        { type: 'hotel', city: '', check_in_date: '', check_out_date: '', days_count: '', amount: '', invoice_file: '' },
        { type: 'da', date: '', city: '', amount: '' },
        { type: 'other', title: '', amount: '', invoice_file: '' },
    ]

    const handleAddNewRowMeal = (existingRowIndex) => {
        const existingRow = defaultTravelData.filter((item) => item.type === expenseMode.toLowerCase())[0]
        const existingDataLength = actualData.data.filter((item) => item.type === expenseMode)[0].data.length
        console.log("existingRow>>", existingRow)
        const newRow = { ...existingRow, ex_date: '', uid: existingDataLength };
        console.log("newRow>>", newRow)
        setInsideActualData((prevData) => ({
            ...prevData,
            data: prevData.data.map((item) =>
                item.type === expenseMode
                    ? { ...item, data: [...item.data, newRow] }
                    : item
            ),
        }));
        console.log("after add new row actualData>>", actualData)
    };

    // update the value from overall except meal
    const handleMealDetails = (index: number, field: any, value: any, uid: number) => {
        console.log(`change handleMealDetails>>", ${index}, ${field}, ${value} and uid:::>>${uid} and expenseMode::>>${expenseMode} and driveType::>>> ${driveType} and travelType::>>${travelType}`)
        const updatedRows =
            actualData.data.filter((item) => item.type === expenseMode)[0]?.data?.map((row, rowIndex) =>
                row.uid === uid && (row.travel_type === travelType.toLowerCase() && row.vehicle === driveType) ? { ...row, [field]: value } : row
            );
        console.log("change updatedRows >>", updatedRows)

        const updatedData = actualData.data.map((item) =>
            item.type === expenseMode ? { ...item, data: updatedRows } : item
        );
        console.log("change updatedData>>", updatedData)
        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // update the value from overall except meal
    const handleDetails = (index: number, field: any, value: any, uid: number) => {
        console.log(`change handleMealDetails>>", ${index}, ${field}, ${value} and uid:::>>${uid} and expenseMode::>>${expenseMode} and driveType::>>> ${driveType} and travelType::>>${travelType}`)
        const updatedRows =
            actualData.data.filter((item) => item.type === expenseMode)[0].data.map((row, rowIndex) =>
                row.uid === uid ? { ...row, [field]: value } : row
            );
        console.log("change updatedRows >>", updatedRows)

        const updatedData = actualData.data.map((item) =>
            item.type === expenseMode ? { ...item, data: updatedRows } : item
        );
        console.log("change updatedData>>", updatedData)
        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    const updateOtherRemarks = (index: number, field: any, value: any, uid: number) => {
        console.log(`change updateOtherRemarks>>", ${index}, ${field}, ${value} and uid:::>>${uid} and expenseMode::>>${expenseMode} and driveType::>>> ${driveType} and travelType::>>${travelType}`)
        setInsideActualData((prevActual) => {
            const newData = prevActual.data.map((item) => {
                if (item.type === expenseMode) {
                    return { ...item, remark: value };
                }
                return item;
            });

            return {
                ...prevActual,
                data: newData,
            };
        });
    }

    // update the value from meal
    const handleOnlyMealDetails = (index: number, field: any, value: any, uid: number) => {
        console.log(`change handleMealDetails>>", ${index}, ${field}, ${value} and uid:::>>${uid} and expenseMode::>>${expenseMode} and driveType::>>> ${driveType} and travelType::>>${travelType}`)
        const updatedRows =
            actualData.data.filter((item) => item.type === expenseMode)[0].data.map((row, rowIndex) =>
                row.uid === uid ? { ...row, [field]: value } : row
            );
        console.log("change updatedRows >>", updatedRows)

        const updatedData = actualData.data.map((item) =>
            item.type === expenseMode ? { ...item, data: updatedRows } : item
        );
        console.log("change updatedData>>", updatedData)
        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // update the value from parking
    const handleMealDetailsParking = (index: number, field: any, value: any, innerIndex: number, uid: number, pid: number) => {
        console.log(`change handleMealDetailsParking>>, ${index}, ${field}, ${value} and uid:::>>${uid} and pid::: ${pid}`)
        console.log("expenseMode>>", expenseMode)
        const updateRows = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType);
        const updatedRows1 = [...updateRows];
        // Find the index of the row with the specified uid
        const rowIndex = updatedRows1.findIndex((row) => row.uid === uid);
        if (rowIndex !== -1) {
            // Update the parking value
            updatedRows1[rowIndex].parking[pid].value = value;
            console.log("after updatedRows1>>", updatedRows1);
        } else {
            console.log("Row with uid not found");
        }

        const updatedData = actualData.data.map((item) => {
            if (item.type === expenseMode) {
                return {
                    ...item,
                    data: item.data.map((row) => {
                        const rowIndex = updatedRows1.findIndex((updatedRow) => updatedRow.uid === row.uid && updatedRow.vehicle === driveType );
                        if (rowIndex !== -1 && row.vehicle === driveType) {
                            return {
                                ...row,
                                // parking: updatedRows1[rowIndex].parking,
                                parking: updatedRows1[pid].parking,
                            };
                        }
                        return row;
                    }),
                };
            }
            return item;
        });

        console.log("updatedData with parking values>>", updatedData);

        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // update the file from parking
    const handleMealDetailsParkingFiles = (index: number, field: any, value: any, innerIndex: number, uid: number, pid: number) => {
        console.log(`change handleMealDetailsParkingFiles>>", ${index}, ${field}, ${value} and uid:::>>${uid} and pid::: ${pid}`)
        console.log("expenseMode>>", expenseMode)
        const updateRows = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType);
        const updatedRows1 = [...updateRows];
        // Find the index of the row with the specified uid
        const rowIndex = updatedRows1.findIndex((row) => row.uid === uid);
        if (rowIndex !== -1) {
            // Update the parking value
            updatedRows1[rowIndex].parking_file[pid].value = value;
            console.log("after updatedRows1>>", updatedRows1);
        } else {
            console.log("Row with uid not found");
        }

        const updatedData = actualData.data.map((item) => {
            if (item.type === expenseMode) {
                return {
                    ...item,
                    data: item.data.map((row) => {
                        const rowIndex = updatedRows1.findIndex((updatedRow) => updatedRow.uid === row.uid && updatedRow.vehicle === driveType);
                        if (rowIndex !== -1  && row.vehicle === driveType) {
                            return {
                                ...row,
                                parking_file: updatedRows1[pid].parking_file,
                            };
                        }
                        return row;
                    }),
                };
            }
            return item;
        });

        console.log("updatedData with parking values handleMealDetailsParkingFiles>>", updatedData);
        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // update the file from toll
    const handleMealDetailsTollFiles = (index: number, field: any, value: any, innerIndex: number, uid: number, pid: number) => {
        console.log(`change handleMealDetailsTollFiles>>", ${index}, ${field}, ${value} and uid:::>>${uid} and pid::: ${pid}`)
        console.log("expenseMode>>", expenseMode)
        const updateRows = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType);
        const updatedRows1 = [...updateRows];
        // Find the index of the row with the specified uid
        const rowIndex = updatedRows1.findIndex((row) => row.uid === uid);
        if (rowIndex !== -1) {
            // Update the parking value
            updatedRows1[rowIndex].toll_file[pid].value = value;
            console.log("after updatedRows1>>", updatedRows1);
        } else {
            console.log("Row with uid not found");
        }

        const updatedData = actualData.data.map((item) => {
            if (item.type === expenseMode) {
                return {
                    ...item,
                    data: item.data.map((row) => {
                        const rowIndex = updatedRows1.findIndex((updatedRow) => updatedRow.uid === row.uid && updatedRow.vehicle === driveType);
                        if (rowIndex !== -1 && row.vehicle === driveType) {
                            return {
                                ...row,
                                toll_file: updatedRows1[pid].toll_file,
                            };
                        }
                        return row;
                    }),
                };
            }
            return item;
        });

        console.log("updatedData with parking values handleMealDetailsParkingFiles>>", updatedData);
        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // update the value from toll
    const handleMealDetailsToll = (index: number, field: any, value: any, innerIndex: number, uid: number, tid: number) => {
        console.log(`change handleMealDetailsToll>>", ${index}, ${field}, ${value} and uid:::>>${uid} and pid::: ${tid}`)
        console.log("expenseMode>>", expenseMode)
        const updateRows = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType);
        const updatedRows1 = [...updateRows];
        // Find the index of the row with the specified uid
        const rowIndex = updatedRows1.findIndex((row) => row.uid === uid);
        if (rowIndex !== -1) {
            // Update the parking value
            updatedRows1[rowIndex].toll[tid].value = value;
            console.log("after updatedRows1>>", updatedRows1);
        } else {
            console.log("Row with uid not found");
        }

        const updatedData = actualData.data.map((item) => {
            if (item.type === expenseMode) {
                return {
                    ...item,
                    data: item.data.map((row) => {
                        const rowIndex = updatedRows1.findIndex((updatedRow) => updatedRow.uid === row.uid && updatedRow.vehicle === driveType);
                        if (rowIndex !== -1&& row.vehicle === driveType) {
                            return {
                                ...row,
                                toll: updatedRows1[tid].toll,
                            };
                        }
                        return row;
                    }),
                };
            }
            return item;
        });

        console.log("updatedData with parking values>>", updatedData);

        setInsideActualData((prevData) => ({
            ...prevData,
            data: updatedData,
        }));
    };

    // Add new row for overall
    const handleAddNewRow = (existingRowIndex) => {
        const temp = defaultTravelData.filter((item) => item.type === expenseMode.toLowerCase() && item.travel_type === travelType.toLowerCase() && item.vehicle === driveType)[0]
        console.log("existingRowIndex>>", existingRowIndex)
        console.log(`expenseMode= ${expenseMode} and travelType=${travelType} driveType=${driveType}`)
        const existingRow = temp
        // const existingRow = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter(item => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType)[0];
        const existingDataLength = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType).length
        // console.log("temp>>",temp)
        console.log("existingRow>>", existingRow)
        console.log("existingDataLength>>", existingDataLength)
        const newRow = { ...existingRow, ex_date: '', uid: existingDataLength };
        console.log("newRow>>", newRow)
        setInsideActualData((prevData) => ({
            ...prevData,
            data: prevData.data.map((item) =>
                item.type === expenseMode
                    ? { ...item, data: [...item.data, newRow] }
                    : item
            ),
        }));
        console.log("after add new row actualData>>", actualData)
    };

    // Add parking row
    const newHandleParkingAddRow = (id: any, parkingIndex: any, uid: number, pid: number) => {
        console.log(`newHandleParkingAddRow id =${id} and parkingIndex=${parkingIndex} and uid::${uid} and pid::: ${pid}`)
        setInsideActualData((prevData) => {
            const newData = { ...prevData }; // Create a shallow copy of the previous data
            const expenseModeIndex = newData.data.findIndex((item) => item.type === expenseMode);

            const existingDataLength = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType)
            console.log("parking add existingDataLength>>", existingDataLength)

            if (expenseModeIndex !== -1) {
                const existingRow = newData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType && uid === item.uid)
                const existingRowParkingLength = newData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType && uid === item.uid)[0].parking.length
                console.log("newHandleParkingAddRow existingRow>>", existingRow)
                console.log("newHandleParkingAddRow existingRow.parking>>", existingRow[0].parking)
                console.log("newHandleParkingAddRow existingRowParkingLength>>", existingRowParkingLength)
                if (existingRow && existingRow[0].parking) {
                    console.log("here inside the if condition")
                    const newParkingItem = { pid: existingRowParkingLength, value: 0 };
                    const newParkingFileItem = { pfid: existingRowParkingLength, value: "" };
                    existingRow[0].parking.push(newParkingItem);
                    existingRow[0].parking_file.push(newParkingFileItem);
                }
            }
            return newData; // Return the updated data
        })
        console.log("newHandleParkingAddRow after add new row actualData>>", actualData)
    }

    // Add toll row
    const newHandleTollAddRow = (id: any, parkingIndex: any, uid: number, pid: number) => {
        console.log(`newHandleTollAddRow id =${id} and parkingIndex=${parkingIndex} and uid::${uid} and pid::: ${pid}`)
        setInsideActualData((prevData) => {
            const newData = { ...prevData }; // Create a shallow copy of the previous data
            const expenseModeIndex = newData.data.findIndex((item) => item.type === expenseMode);
            const existingDataLength = actualData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType)
            console.log("parking add existingDataLength>>", existingDataLength)

            if (expenseModeIndex !== -1) {
                const existingRow = newData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType && uid === item.uid)
                const existingRowTollLength = newData.data.filter((item) => item.type === expenseMode)[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType && uid === item.uid)[0].toll.length
                console.log("newHandleTollAddRow existingRow>>", existingRow)
                console.log("newHandleTollAddRow existingRow.parking>>", existingRow[0].toll)
                console.log("newHandleTollAddRow existingRowParkingLength>>", existingRowTollLength)
                if (existingRow && existingRow[0].toll) {
                    console.log("here inside the if condition")
                    const newTollItem = { tid: existingRowTollLength, value: 0 };
                    const newTollFileItem = { tfid: existingRowTollLength, value: "" };
                    existingRow[0].toll.push(newTollItem);
                    existingRow[0].toll_file.push(newTollFileItem);
                }
            }
            return newData; // Return the updated data
        })
        console.log("newHandleTollAddRow after add new row actualData>>", actualData)
    }

    // the default object
    const [actualData, setInsideActualData] = useState<any>(
        {
            data: [
                {
                    type: 'Meal',
                    data: [
                        { uid: 0, type: 'meal', ex_date: '', breakfast: undefined, lunch: undefined, dinner: undefined, invoice_file: '', breakfast_tag: '', lunch_tag: '', dinner_tag: '' },
                    ],
                    field: [
                        { title: 'ex_date', placeholder: '', type: 'date' },
                        { title: 'breakfast', placeholder: '', type: 'number' },
                        { title: 'lunch', placeholder: '', type: 'number' },
                        { title: 'dinner', placeholder: '', type: 'number' },
                        { title: 'invoice_file', placeholder: '', type: 'file' },
                    ]
                },
                {
                    type: "Travel",
                    data: [
                        {
                            uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: '2 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: "", amount_file: [],
                            parking: [{ pid: 0, value: undefined }], parking_file: [{ pfid: 0, value: "" }]
                        },
                        { uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: 'Taxi/Cab', start_location: '', end_location: '', calculated_distance: "", amount: '', amount_file: '' },
                        {
                            uid: 0, type: "travel", travel_type: 'local', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: "", amount_file: [],
                            parking: [{ pid: 0, value: undefined }],
                            parking_file: [{ pfid: 0, value: "" }],
                            toll: [{ tid: 0, value: undefined }],
                            toll_file: [{ tfid: 0, value: '' }]
                        },
                        {
                            uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: '4 Wheeler', start_location: '', end_location: '', actual_distance: "", calculated_distance: "", amount: '', amount_file: [],
                            parking: [{ id: 0, value: undefined }],
                            parking_file: [{ pfid: 0, value: "" }],
                            toll: [{ tid: 0, value: undefined }],
                            toll_file: [{ tfid: 0, value: '' }]
                        },
                        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Bus', start_location: '', end_location: '', amount: '', amount_file: [] },
                        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Flight', start_location: '', end_location: '', amount: '', amount_file: [] },
                        { uid: 0, type: "travel", travel_type: 'domestic', ex_date: '', vehicle: 'Train', start_location: '', end_location: '', amount: '', amount_file: [] },
                    ],
                    field: [
                        { title: 'date', placeholder: '', type: 'date', field: 'ex_date' },
                        { title: 'start location', placeholder: '', type: 'string', field: 'start_location' },
                        { title: 'end location', placeholder: '', type: 'string', field: 'end_location' },
                        { title: 'Actual distance', placeholder: '', type: 'string', field: 'actual_distance' },
                        { title: 'Calculated distance', placeholder: '', type: 'string', field: 'calculated_distance' },
                        { title: 'amount', placeholder: '', type: 'number', field: 'amount' },
                        // { title: 'invoice_file', placeholder: '', type: 'file', field: 'invoice_file' },
                        { title: 'amount_file', placeholder: '', type: 'file', field: 'amount_file' },
                    ]
                },
                {
                    type: 'Hotel',
                    data: [
                        { uid: 0, type: 'hotel', city: '', check_in_date: '', check_out_date: '', days_count: '', amount: '', invoice_file: '' },
                    ],
                    field: [
                        { title: 'city', placeholder: '', type: 'string', field: 'city' },
                        { title: 'check In', placeholder: '', type: 'date', field: 'check_in_date' },
                        { title: 'check Out', placeholder: '', type: 'date', field: 'check_out_date' },
                        { title: 'no Of Days', placeholder: '', type: 'number', field: 'days_count' },
                        { title: 'amount', placeholder: '', type: 'number', field: 'amount' },
                        { title: 'invoice_file', placeholder: '', type: 'file', field: 'invoice_file' },
                    ]
                },
                {
                    type: 'DA',
                    data: [
                        { uid: 0, type: 'da', date: '', city: '', amount: '' },
                    ],
                    field: [
                        { title: 'date', placeholder: '', type: 'date', field: 'date' },
                        { title: 'city', placeholder: '', type: 'string', field: 'city' },
                        { title: 'amount', placeholder: '', type: 'number', field: 'amount' },
                    ]
                },
                {
                    type: 'Other',
                    data: [
                        { uid: 0, type: 'other', title: '', amount: '', invoice_file: '', },
                    ],
                    remark: '',
                    field: [
                        { title: 'tile', placeholder: '', type: 'string', field: 'title' },
                        { title: 'amount', placeholder: '', type: 'number', field: 'amount' },
                        { title: 'invoice_file', placeholder: '', type: 'file', field: 'invoice_file' },
                    ]
                }

            ],
            expenseType: ["Meal", "Travel", "Hotel", "DA", "Other"],
            travelExpense: [
                {
                    travelMode: "Local",
                    vehicalType: [
                        { title: '2 Wheeler', icon: bike },
                        { title: 'Taxi/Cab', icon: taxi },
                        { title: '4 Wheeler', icon: car },
                    ]
                },
                {
                    travelMode: "Domestic",
                    vehicalType: [
                        { title: 'Bus', icon: bus },
                        { title: 'Flight', icon: flight },
                        { title: 'Train', icon: train },
                        { title: '4 Wheeler', icon: car },
                    ]
                },
            ]
        })

    // ************************** google map ****************************
    const handleDistanceMatrixRequest = async (value) => {
        console.log('handleDistanceMatrixRequest>>', value)
        const apiKey = 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk';
        // const nagpur = { lat: 21.1458, lng: 79.0882 };
        // const delhi = { lat: 28.6139, lng: 77.2090 };
        // const `De | Spaces` = {lat: 28.4467914, lng: 77.0387769};

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
                handleMealDetails(value?.field?.index, 'calculated_distance', res.data.rows[0].elements[0].distance.text, value?.field?.uid)
            })
            .catch((err) => {
                console.log("handleDistanceMatrixRequest reerrs>>>", err)
            })
    };

    const [loacationFieldName, setLoacationFieldName] = useState({})
    const openMapFunction = (index, field, uid) => {
        setShowMap(true)
        setLoacationFieldName({ "index": index, "field": field, "uid": uid })
    }
    const [valueForLocation, setValueForLocation] = useState("")
    const setGoogleLocation = (value) => {
        console.log("setGoogleLocation value>>", value)
        if (value.field.field === "start_location") {
            handleMealDetails(value?.field?.index, value?.field?.field, value.locationInfo?.name, value?.field?.uid)
        }
        else if (value?.field?.field === "end_location") {
            handleMealDetails(value?.field?.index, 'end_location', value.locationInfo?.name, value?.field?.uid)
            setValueForLocation(value)
        }

    }

    useEffect(() => {
        if (valueForLocation !== "") {
            handleDistanceMatrixRequest(valueForLocation)
        }
    }, [valueForLocation])
    const [isChecked, setIsChecked] = useState(false);
    function handleChange(e) {
        setIsChecked(e.target.checked);
        hasSubExpense(e.target.checked)
    }
    console.log("here actualData>>", actualData)
    console.log("tt>>", actualData.data.filter((item) => item.type === expenseMode && item.type !== 'Travel'))
    return (
        <div className='mt-20px'>
             <LoadingSpinner loading={isLoading} />
            <div className='d-flex row space-between alignItem-center flex-wrap mt-30px m-10px mb-1_5rem'>
                <div className='ml-5px mr-5px'>
                    <span className='bold1Rem commonBlackcolor'>New Expense -&nbsp;</span><span className='light0_813Rem commonGraycolor'>Add your expenses details here</span>
                </div>
                <div className='d-flex'>
                    {/* <div className='ml-5px mr-5px'>
                        <BlueCommonButton
                            title={"Receipt No:"}
                            subTitle={"034210"}
                            buttonClick={onclickButton}
                        />
                    </div> */}
                    <div className='ml-5px mr-5px'>
                        <WhiteCommonButton
                            title={"Amount:"}
                            subTitle={totalFinalAmount}
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
                                ),
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
                {/* Meal, Travel, Hotel, DA, Other */}
                <div className='d-flex row flex-wrap'>
                    {
                        actualData.expenseType.map((expenseType: any, index: any) =>
                            <div key={index}>
                                <FunctionalCommonButton isActive={expenseType === expenseMode} title={expenseType} onclick={(e: any) => onclickSetExpenseMode(expenseType)} />
                            </div>
                        )
                    }
                </div>
                <div className='d-flex column nnnn'>
                    {
                        actualData.data.filter((item) => item.type === expenseMode && item.type !== 'Travel').map((listData, index) =>
                            <div className='m-10px d-flex ' key={index}>
                                <div className='d-flex column'>
                                    {listData.data.map((dataValue, id) =>
                                        <div className='d-flex row flex-wrap alignItem-center '>
                                            {listData.field?.map((field, key) => (
                                                <div className='d-flex row'>
                                                    {
                                                        dataValue.type === "meal" ?
                                                            <>
                                                                {
                                                                    field.title === "invoice_file" ?
                                                                        <div className="m-10px">
                                                                            <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                                onClick={() => uploadfilepopup(id, "", dataValue.type, field.title, dataValue.uid, '')}
                                                                            >
                                                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                                                <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        field.title === "ex_date" ?
                                                                            <div className='m-10px date-position' >
                                                                                <TextField
                                                                                    id={`input-${field.title}-textfield`}
                                                                                    label={field.title === 'ex_date' ? 'Date' : field.title.charAt(0).toUpperCase() + field.title.slice(1)}
                                                                                    type={field.type}
                                                                                    placeholder={`Enter ${field.title === 'ex_date' ? 'Date' : 'Amount here'}`}
                                                                                    onChange={(e) => handleOnlyMealDetails(id, field.title, field.title === 'ex_date' ? e.target.value : Number(e.target.value), dataValue.uid)}
                                                                                    InputProps={{
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start" className='ml-10px'>
                                                                                                {field.title !== 'ex_date' && <img src={bill} />}
                                                                                            </InputAdornment>
                                                                                        ),
                                                                                    }}
                                                                                    variant="standard"
                                                                                    value={dataValue[field.title]}
                                                                                />
                                                                            </div>
                                                                            :
                                                                            <div className='m-10px ' key={key}>
                                                                                {
                                                                                    clientLocation === "client site" &&
                                                                                    <input value="mealExpense" type="checkbox"
                                                                                        id='hasSubExpenseCheckbox'
                                                                                        onChange={(e) => handleOnlyMealDetails(id, field.title, dataValue[field.title] === 120 ? Number(0) : Number(120), dataValue.uid)}
                                                                                        checked={dataValue[field.title] === 120 ? true : false}
                                                                                    />
                                                                                }
                                                                                <TextField
                                                                                    id={`input-${field.title}-textfield`}
                                                                                    disabled={clientLocation === "client site" ? true : false}
                                                                                    label={field.title === 'ex_date' ? 'Date' : field.title.charAt(0).toUpperCase() + field.title.slice(1)}
                                                                                    type={field.title === 'ex_date' ? 'date' : 'number'}
                                                                                    placeholder={`Enter ${field.title === 'ex_date' ? 'Date' : 'Amount here'}`}
                                                                                    onChange={(e) => clientLocation === "client site" ? "" : handleOnlyMealDetails(id, field.title, field.title === 'ex_date' ? e.target.value : Number(e.target.value), dataValue.uid)}
                                                                                    InputProps={{
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start" className='ml-10px'>
                                                                                                {field.title !== 'ex_date' && <img src={bill} />}
                                                                                            </InputAdornment>
                                                                                        ),
                                                                                    }}
                                                                                    variant="standard"
                                                                                    value={dataValue[field.title]}
                                                                                />
                                                                                {
                                                                                    field.title !== "ex_date" &&
                                                                                    <div className='row d-flex m-10px alignItem-center'>
                                                                                        <img src={tag} className='tagImg m-5px' onClick={() => tagFuction(id, true, `${field.title}_tag`, dataValue.uid)} />
                                                                                        <span className='m-5px light0_875Rem'>Tag</span>
                                                                                        <Tooltip title="tag your meal companions, be it customers or team members, to keep track of your dining experiences." arrow>
                                                                                            <img src={i} className='iImg m-5px' />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                }
                                                            </>
                                                            :
                                                            dataValue.type === "hotel" || dataValue.type === "da" ?//|| dataValue.type === "other" ?
                                                                <div className='d-flex row cccc'>
                                                                    {
                                                                        field.title === "invoice_file" ?
                                                                            <div className="m-10px">
                                                                                <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                                    onClick={() => uploadfilepopup(id, "", dataValue.type, field.title, dataValue.uid, '')}
                                                                                >
                                                                                    <img src={uploadImg} className="ml-5px mr-5px" />
                                                                                    <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <>
                                                                                <div className='m-10px' key={key}>
                                                                                    <TextField
                                                                                        id={`input-${field.title}-textfield`}
                                                                                        label={field.title === 'ex_date' ? 'Date' : field.title.charAt(0).toUpperCase() + field.title.slice(1)}
                                                                                        type={field.type}
                                                                                        placeholder={`Enter ${field.title} here`}
                                                                                        // onChange={(e) => handleMealDetails(id, field.title, field.type === 'date' ? e.target.value : field.type === 'string' ? e.target.value : Number(e.target.value), dataValue.uid)} 
                                                                                        onChange={(e) => handleDetails(id, field.field, field.type === 'date' ? e.target.value : field.type === 'string' ? e.target.value : Number(e.target.value), dataValue.uid)} //handleDetails
                                                                                        InputProps={{
                                                                                            startAdornment: (
                                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                                    {field.type !== 'date' && <img src={bill} />}
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        variant="standard"
                                                                                        // value={dataValue[field.title]}
                                                                                        value={dataValue[field.field]}
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                    }
                                                                </div>
                                                                :
                                                                <>
                                                                    {
                                                                        dataValue.type === "other" ?
                                                                            field.title === "invoice_file" ?
                                                                                <div className="m-10px">
                                                                                    <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                                        onClick={() => uploadfilepopup(id, "", dataValue.type, field.title, dataValue.uid, '')}
                                                                                    >
                                                                                        <img src={uploadImg} className="ml-5px mr-5px" />
                                                                                        <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                <div className='m-10px' key={key}>
                                                                                    <TextField
                                                                                        id={`input-${field.title}-textfield`}
                                                                                        label={field.title === 'ex_date' ? 'Date' : field.title.charAt(0).toUpperCase() + field.title.slice(1)}
                                                                                        type={field.type}
                                                                                        placeholder={`Enter ${field.title} here`}
                                                                                        // onChange={(e) => handleMealDetails(id, field.title, field.type === 'date' ? e.target.value : field.type === 'string' ? e.target.value : Number(e.target.value), dataValue.uid)} 
                                                                                        onChange={(e) => handleDetails(id, field.field, field.type === 'date' ? e.target.value : field.type === 'string' ? e.target.value : Number(e.target.value), dataValue.uid)} //handleDetails
                                                                                        InputProps={{
                                                                                            startAdornment: (
                                                                                                <InputAdornment position="start" className='ml-10px'>
                                                                                                    {field.type !== 'date' && <img src={bill} />}
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        variant="standard"
                                                                                        value={dataValue[field.field]}
                                                                                    />
                                                                                </div>
                                                                            :
                                                                            ""
                                                                    }
                                                                </>
                                                    }
                                                </div>
                                            ))}
                                            {
                                                actualData.data.filter((item) => item.type === expenseMode && item.type !== 'Travel')[0].data.length - 1 === id &&
                                                <div className="ml-20px">
                                                    <img src={add} onClick={() =>
                                                        handleAddNewRowMeal(id)}
                                                    // handleAddNewRow(id)} 
                                                    />
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                    {/*  Remark field of other type */}
                    {
                        actualData.data.filter((item) => item?.type === expenseMode && item?.type !== 'Travel')[0]?.type === "Other" &&
                        <div className='d-flex'>
                            <TextField
                                id={`input-remark-textfield`}
                                label={"Remark"}
                                type={"string"}
                                className='w-100per'
                                multiline
                                maxRows={4}
                                placeholder={`Enter Remarks here`}
                                onChange={(e) => updateOtherRemarks(0, 'remarks', e.target.value, 0)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" className='ml-10px'>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                value={actualData.data.filter((item) => item.type === expenseMode && item.type !== 'Travel')[0].remark}
                            // value={dataValue[field.field]}
                            />
                        </div>
                    }
                    {
                        expenseMode === "Travel" &&
                        <div>
                            <span onChange={(e) => onChangeValueTravel_type(e)} className='d-flex'>
                                <div className='radioButtonMealWithCustomer'>
                                    <span>
                                        <input type="radio" value="Local" name="travel" id='radioforlocalTravel' />
                                    </span>
                                    <label className='d-flex column alignItem-start' htmlFor='radioforlocalTravel'>
                                        <span className='bold0_875Rem fentBlack'>Local</span>
                                        <span className='light0_875Rem fentBlack'>You are creating this request for a trip
                                            within your home city.</span>
                                    </label>
                                </div>
                                <div className='radioButtonMealWithTeam'>
                                    <span>
                                        <input type="radio" value="Domestic" name="travel" id='radiofordometricTravel' />
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
                                    actualData.travelExpense.filter((item) => item.travelMode === travelType)[0]?.vehicalType.map((item, id) =>
                                        <span className='travelButton d-flex alignItem-center curser'
                                            onClick={() => handleTravelDetails(item.title)}
                                            style={{ backgroundColor: driveType === item.title ? '#027DC2' : '#EFEFEF', color: driveType === item.title ? "#ffff" : "#18181B" }}>
                                            <img src={item.icon} className='ml-5px mr-5px' />
                                            <span>{item.title}</span>
                                        </span>
                                    )
                                }
                            </div>
                            <div className=''>
                                {
                                    actualData.data.filter(item => item.type === "Travel")[0].data.filter((item) => item.travel_type === travelType.toLowerCase() && item.vehicle === driveType).map((dataValue, index) =>
                                        <>
                                            <div className='d-flex row alignItem-center flex-wrap'>
                                                {actualData.data.filter(item => item.type === "Travel")[0].field.map((field, key) =>
                                                    <div className=''>
                                                        {
                                                            Object.keys(dataValue).includes(field.field) === true ?
                                                                <>
                                                                    {
                                                                        field.title === "amount_file" ?
                                                                            <div className="m-10px">
                                                                                <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                                    onClick={() => uploadfilepopup(index, "", dataValue.type, field.title, dataValue.uid, "")}
                                                                                >
                                                                                    <img src={uploadImg} className="ml-5px mr-5px" />
                                                                                    <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            field.title !== "parking" || field.title !== "toll Tax" ?
                                                                                <div className='m-10px' key={key}>
                                                                                    <TextField
                                                                                        id={`input-${field.title}-textfield`}
                                                                                        label={field.title === 'ex_date' ? 'Date' : field.title.charAt(0).toUpperCase() + field.title.slice(1)}
                                                                                        type={field.type}
                                                                                        disabled={field.title === "Calculated distance" || field.title === "start location" || field.title === "end location" ? true : false}
                                                                                        placeholder={`Enter ${field.title} here`}
                                                                                        onChange={(e) => field.title === "Calculated distance" || field.title === "start location" || field.title === "end location" ? "" : handleMealDetails(index, field.field, field.type === 'number' ? Number(e.target.value) : e.target.value, dataValue.uid)}
                                                                                        InputProps={{
                                                                                            startAdornment: (
                                                                                                <div onClick={() => (field.title === "start location" || field.title === "end location") ? openMapFunction(index, field.field, dataValue.uid) : "nothing"}>
                                                                                                    <InputAdornment position="start" className='ml-10px'>
                                                                                                        {field.title === 'amount' ? <img src={bill} /> : field.title === "Calculated distance" ? <img src={distance} /> : field.title === "date" ? "" : field.title === "amount" ? <img src={bill} /> : <img src={map} />}
                                                                                                    </InputAdornment>
                                                                                                </div>
                                                                                            ),
                                                                                        }}
                                                                                        variant="standard"
                                                                                        value={dataValue[field.field]}
                                                                                    />
                                                                                </div>
                                                                                :
                                                                                <></>
                                                                    }
                                                                </>
                                                                :
                                                                ""
                                                        }
                                                    </div>
                                                )}
                                                <div className="ml-20px">
                                                    <img src={add} onClick={() => handleAddNewRow(index)} />
                                                </div>
                                            </div>
                                            {/* ---------- - ----------- parking  ---------- -   --     ---------------*/}
                                            <div className='aa'>
                                                {dataValue.parking?.map((park, id) =>
                                                    <div className='bb d-flex row'>
                                                        <div className='m-10px' key={id}>
                                                            <TextField
                                                                id={`input-parking-textfield`}
                                                                label={"Parking"}
                                                                type={'number'}
                                                                placeholder={'Enter Amount here'}
                                                                // onChange={(e) => handleMealDetails(id, 'parking', Number(e.target.value))} 
                                                                onChange={(e) => handleMealDetailsParking(index, 'parking', Number(e.target.value), id, dataValue.uid, park.pid,driveType)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start" className='ml-10px'>
                                                                            {<img src={parking} />}
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                variant="standard"
                                                                value={dataValue['Parking']}
                                                            />
                                                        </div>
                                                        <div className="m-10px">
                                                            <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                onClick={() => uploadfilepopup(id, "", dataValue.type, 'parking_file', dataValue.uid, park.pid)}
                                                            >
                                                                <img src={uploadImg} className="ml-5px mr-5px" />
                                                                <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                            </div>
                                                        </div>
                                                        {
                                                            dataValue.parking.length - 1 === id &&
                                                            <div className="ml-20px">
                                                                {/* <img src={add} onClick={() => handleAddNewRow(index)} /> */}
                                                                <img src={add} onClick={() => newHandleParkingAddRow(id, index, dataValue.uid, park.pid)} />
                                                            </div>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            {/* ---------- - ----------- toll  ---------- -   --     ---------------*/}
                                            <div>
                                                {
                                                    dataValue.toll?.map((toll, id) =>
                                                        <div className='d-flex row'>
                                                            <div className='m-10px' key={id}>
                                                                <TextField
                                                                    id={`input-toll-textfield`}
                                                                    label={"Toll"}
                                                                    type={'number'}
                                                                    placeholder={'Enter Amount here'}
                                                                    onChange={(e) => handleMealDetailsToll(index, 'toll', Number(e.target.value), id, dataValue.uid, toll.tid)}
                                                                    // onChange={(e) => handleMealDetails(id, 'toll', Number(e.target.value))}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start" className='ml-10px'>
                                                                                {<img src={parking} />}
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                    value={dataValue['Toll']}
                                                                />
                                                            </div>
                                                            <div className="m-10px">
                                                                <div className="blueButtonStyle w-200px white d-flex alignItem-center curser"
                                                                    onClick={() => uploadfilepopup(id, "", dataValue.type, 'toll_file', dataValue.uid, toll.tid)}
                                                                >
                                                                    <img src={uploadImg} className="ml-5px mr-5px" />
                                                                    <span className="light0_813Rem white ml-5px mr-5px">Upload Invoice here</span>
                                                                </div>
                                                            </div>
                                                            {
                                                                dataValue.toll.length - 1 === id &&
                                                                <div className="ml-20px">
                                                                    <img src={add} onClick={() => newHandleTollAddRow(id, index, dataValue.uid, toll.pid)} />
                                                                    {/* <img src={add} onClick={() => handleAddNewRow(index)} /> */}
                                                                </div>
                                                            }
                                                        </div>
                                                    )}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className='d-flex row justfyContent-end  flex-wrap'>
                <div className='d-flex row flex-wrap'>
                    <div className='m-10px'>
                        <CancelCommonButton
                            title={"Cancel"}
                            buttonClick={""}
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
                showPopup &&
                <ShareMealPopup
                    close={() => setShowPopup(false)}
                    passId={mealData}
                    data={(e: any) => setShareMealDataFunction(e)}
                    // data={(e: any) => console.log("data pass>>",e)}
                />
            }
            {editUpload &&
                <EditUpload
                    close={() => setEditUpload(false)}
                    fileId={fileId}
                    passidType={idType}
                    // parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandleFileChange(e)}
                />
            }
            {
                uploadFileParking &&
                <EditUpload
                    close={() => setUploadFileParking(false)}
                    fileId={fileId}
                    parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandleParkingFileChange(e)}
                />
            }
            {
                upload4WheelerFileParking &&
                <EditUpload
                    close={() => setUpload4WheelerFileParking(false)}
                    fileId={fileId}
                    parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandle4WheelerParkingFileChange(e)}
                />
            }

            {
                upload4WheelerDomesticFileParking &&
                <EditUpload
                    close={() => setUpload4WheelerDomesticFileParking(false)}
                    fileId={fileId}
                    parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandle4WheelerDomesticParkingFileChange(e)}
                />
            }
            {
                upload4WheelerFileToll &&
                <EditUpload
                    close={() => setUpload4WheelerFileToll(false)}
                    fileId={fileId}
                    parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandle4WheelerTollFileChange(e)}
                />
            }
            {
                upload4WheelerDomesticFileToll &&
                <EditUpload
                    close={() => setUpload4WheelerDomesticFileToll(false)}
                    fileId={fileId}
                    parkingID={fileIdPraking}
                    // data={(e)=> console.log("e>>>",e)}
                    data={(e: any) => uploadHandle4WheelerDomesticTollFileChange(e)}
                />
            }
            {showMap &&
                <GoogleMaps
                    close={() => setShowMap(false)}
                    fieldType={loacationFieldName}
                    passData={(e) => setGoogleLocation(e)}
                />
            }
            {toastContainer()}
        </div>
    )
}