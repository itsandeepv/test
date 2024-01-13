import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import bill from '../../assets/images/bill.svg'
import { TextBoxReact } from '../../components/textBox.tsx';
import { BlueCommonButton, CancelCommonButton } from '../../components/button.tsx'
import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import { json, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/loader.tsx';
import { Link, useNavigate } from 'react-router-dom';

export const GradePolicy = () => {
    const [grade, setGrade] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [gradeExpenseData, setGradeExpenseData] = useState([])
    const [mappedData, setMappedData] = useState([])
    const location = useLocation();
    const { gradedata, gradeid } = location.state || {};
    const [travelType, setTravelType] = useState("")
    const [gradeList, setGradeList] = useState([]);
    const [daTier, setDaTier] = useState('')
    const [hoteltier, sethoteltier] = useState('')
    const [DaValue, setDaValue] = useState('')
    const [hotelvalue, setHotelValue] = useState('')
    const navigate = useNavigate();

    const handleChangeHotel = (event: SelectChangeEvent) => {
        const newData = [...hotelDetails];
        newData[0].tier_id = event.target.value;
        sethoteltier(event.target.value)
        setHotelDetails(newData);
    };
    const handleChangeDa = (event: SelectChangeEvent) => {
        const newData = [...daDetails];
        newData[0].tier_id = event.target.value;
        setDADetails(newData)
        setDaTier(event.target.value)
        console.log("event.target.value>>>", event.target.value)
    };
    useEffect(() => {
        setTravelType('');
        getCityTier();
        setLoading(true)
    }, [])

    const [cityTier, setCityTier] = useState([])
    const getCityTier = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.cityTire,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setCityTier(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setCityTier([])
                    notifyWarning("Something went wrong!!")
                }
                console.log("getCityTier res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setCityTier([])
                notifyWarning("Something went wrong!!")
                console.log("getCityTier reerrs>>>", err)
            })
    }

    const [hotelDetails, setHotelDetails] = useState([{ expense_id: '', tier_id: '', max_amount: '' }])
    const [daDetails, setDADetails] = useState([{ expense_id: '', tier_id: '', max_amount: '' }])
    const hotelDetailUpdate = (id: string, field: string, value: any) => {
        console.log(`id>>${id} and field>>${field} and value>>${value.target.value}`)
        const newData = [...hotelDetails];
        newData[0].max_amount = value?.target?.value;
        newData[0].expense_id = id;
        setHotelDetails(newData);
    }
    const daDetailUpdate = (id: string, field: string, value: any) => {
        console.log(`id>>${id} and field>>${field} and value>>${value.target.value}`)
        const newData = [...daDetails];
        newData[0].max_amount = value?.target?.value;
        newData[0].expense_id = id;
        setDADetails(newData);
    }
    console.log("hotelDetails>>", hotelDetails)

    const handleDetails = (e: React.ChangeEvent<HTMLInputElement>, id: number, dataValue: any) => {
        console.log('dataVlaue ???????????', dataValue)
        const { value } = e.target;

        setMappedData((prevMappedData: any) => {

            return prevMappedData.map((item: any) => {
                console.log(item.subexpense_id, dataValue.id, 'Matchedd')
                if (item.subexpense_id === dataValue.id) {
                    console.log('updated datatatat????????', item)
                    return {
                        ...item,
                        unit_cost: value,
                    };
                }
                return item;
            });
        });
    };

    const handleDistanceDetails = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { value } = e.target;
        console.log('distance value ?????????????', value)
        setMappedData((prevMappedData: any) => {
            return prevMappedData.map((item: any) => {
                if (item.subexpense_id === id) {
                    return {
                        ...item,
                        max_distance: value,
                    };
                }
                return item;
            });
        });
    };
    const handleHotelDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setHotelValue(value)

    };
    const handleDaDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setDaValue(value)

    };

    const handleAmountDetails = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { value } = e.target;

        setMappedData((prevMappedData: any) => {
            return prevMappedData.map((item: any) => {
                if (item.subexpense_id == id) {
                    return {
                        ...item,
                        max_amount: value,
                    };
                }
                return item;
            });
        });
    };

    const handleChangeGrade = (event: React.ChangeEvent<{ value: unknown }>) => {
        setGrade(event.target.value as string);
        getGradePolicy(event.target.value)
    };

    console.log(gradeList, 'GradeeListtt')

    const handleInvoiceDetails = (e: any, id: number, gradeData: any) => {
        const { value } = e.target.value;

        setMappedData((prevEditGradeData) => {
            return prevEditGradeData.map((item, index) => {
                if (index === id) {
                    return { ...item, invoice: value };
                }
                return item;
            });
        });
    };

    const AddGradePolicy = async () => {
        const tempFilteredData = [...filteredData, ...hotelDetails, ...daDetails].filter((item) => item?.expense_id !== "")
        var formdata = new FormData();
        formdata.append("grade_name", grade);
        formdata.append("policies", JSON.stringify(tempFilteredData));
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.addGradePolicy,
            headers: {},
            data: formdata
        };
        console.log("tempFilteredData>>", tempFilteredData)
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.message)
                    console.log('AddGradePolicy:::::::::::??????', res?.data?.message)
                }
                navigate('/admin/gradePolicyList')
                console.log("AddGradePolicy res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                // setHodList([])
                console.log("AddGradePolicy reerrs>>>", err)
            })
    }


    // for grade master data
    const getGrade = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.grade,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    const newData = res?.data?.result ? res?.data?.result : [];
                    const newArray = newData.filter(item => parseInt(item.policy_status) <= 0);

                    setGradeList(newArray)
                }
                else {
                    setGradeList([])
                }
                console.log("getGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setGradeList([])
                console.log("getGrade reerrs>>>", err)
            })
    }
    // done
    const gradePolicySave = async () => {
        console.log("gradePolicySave called")
        const gradePolicyData = {
            grade_id: gradeid === undefined ? 11 : gradeid,
            policy: data
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.editgradePolicy,
            headers: {},
            data: gradePolicyData
        };
        console.log("gradePolicySave config>>", config)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                console.log("gradePolicySave res>>", res)
                if (res?.status === 200) {
                    notifySuccess(res?.data?.message)
                    // setData(res?.data?.result[0]?.policy ? JSON.parse(res?.data?.result[0]?.policy) : [])
                }
                // else {
                //     setData([])
                // }
                console.log("getGrade res>>>", res)
            })
            .catch((err) => {
                // setLoading(false)
                // setData([])
                console.log("getGrade reerrs>>>", err)
            })
    }
    const getGradePolicy = async (grade) => {
        console.log('grade???????????', grade)
        const formdata = new FormData();
        formdata.append("grade", grade);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.getgradePolicy,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.data?.responseCode === 200) {
                    setGradeExpenseData(res?.data?.result)
                    console.log('get grade policy data reponse ???????//', res?.data?.result)
                    let expensePolicy = res?.data?.result
                    console.log('datatattatat????????????????', expensePolicy)
                    const resultArray: any = [];

                    expensePolicy.forEach((expenseCategory) => {
                        if (expenseCategory.has_subexpense === "yes") {
                            expenseCategory.subexpenses.forEach((subexpense) => {
                                const resultItem: any = {
                                    expense_id: subexpense.expense_id || "",
                                    subexpense_id: subexpense.id || "",
                                    unit_cost: subexpense.has_unit_cost === "yes" ? subexpense.unit_cost || "" : "",
                                    max_distance: subexpense.has_max_distance === "yes" ? subexpense.max_distance || "" : "",
                                    max_amount: subexpense.has_max_amount === "yes" ? subexpense.max_amount || "" : "",
                                };
                                resultArray.push(resultItem);
                            });
                        }
                    });

                    setMappedData(resultArray)
                    console.log('resultArray?????????????', resultArray);

                }
                else {
                    setGradeExpenseData([])
                }
                console.log("getGradePolicy called with gradeid>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setGradeExpenseData([])
                console.log("getGradePolicy called with gradeid>>", err)
            })
    }

    useEffect(() => {
        getGrade()
        setLoading(true)
    }, [])

    const handleExpenseType = (e, arg) => {
        console.log("handleExpenseType e, arg>>", e, arg)
        console.log("handleExpenseType data>>", data)
        const updateData = data.expense?.map((item => {
            if (item.type == arg) {
                return { ...item, active: e?.target?.checked ? 1 : 0 };
            }
            return item;
        }));
        const temp = { expense: updateData }
        console.log("handleExpenseType updateData>>", updateData)
        console.log("handleExpenseType temp>>", temp)
        setData(temp)
        return updateData
    }

    const filteredData = mappedData.filter((item: any) => {
        // Check if all specified fields are empty
        return !(item.invoice === "" && item.unit_cost === "" && item.max_distance === "" && item.max_amount === "");
    });

    console.log('Updateddsdsdsd', filteredData)

    const handleExpenseDetails = (e, row, type) => {
        console.log(`handleExpenseDetails e>>${e?.target?.checked} and row>>${row?.expenseType} and type>>${type}`)
        console.log("handleExpenseDetails data>>", data)
        const updatedData = data.expense.map(item => {
            if (item.type == type) {
                console.log("handleExpenseDetails item>>", item.data)
                const updatedInnerData = item.data.map(vehicalData => {
                    if (vehicalData.expenseType == row.expenseType) {
                        console.log("handleExpenseDetails vehicalData>>", vehicalData)
                        return { ...vehicalData, expenseActive: e?.target?.checked ? 1 : 0 };
                    }
                    return vehicalData;
                });
                return { ...item, data: updatedInnerData };
            }
            return item;
        });
        const temp = { expense: updatedData }
        console.log("handleExpenseDetails updatedData>>", temp)
        setData(temp)
    }

    // console.log("mappedData>>", mappedData)
    console.log("gradeExpenseData>>", gradeExpenseData)
    console.log("isLoading>>", isLoading)
    return (
        <div>
            {
                isLoading ?
                    <LoadingSpinner loading={isLoading} />
                    :
                    <>
                        <div className='moduleBorderWithoutPadding'>
                            <div className='m-10px textAlign-Start column'>
                                <span className="bold1Rem commonBlackcolor">Select Grade from this list</span>
                                <div>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <Select
                                            value={grade}
                                            onChange={handleChangeGrade}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        // disabled={gradedata === undefined ? false : true}
                                        >
                                            <MenuItem value="" disabled>
                                                {"Click to select Grade"}
                                            </MenuItem>
                                            {gradeList?.map((expense: any) => (
                                                <MenuItem key={expense?.id} value={expense?.name}>
                                                    {expense?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <span className="bold1_26Rem commonBlackcolor d-flex m-10px justfyContent-start textAlign-Start">Expense Types</span>
                        {gradeExpenseData.map((expense: any, index) =>
                            <div className='moduleBorderWithoutPadding' key={index}>
                                <div className='d-flex column m-10px justfyContent-start textAlign-Start'>
                                    <div className='bold1Rem commonBlackcolor '>Set Policy for {expense?.expense_name}</div>
                                    <div>
                                        <div className='m-10px'>
                                            <div className='d-flex column nn'>
                                                <div className='addButton'>
                                                    <div className="localBg white d-flex align-center justfyContent-center addButton">
                                                        <span className="light1Rem flentBlack mr-10px">{expense?.expense_name.charAt(0).toUpperCase() + expense?.expense_name.slice(1)}</span>
                                                    </div>
                                                </div>
                                                {/* {expense?.type.toLowerCase() === 'travel' ? (
                                                    <div className='d-flex'>
                                                        <div className='d-flex alignItem-center ml-20px'>
                                                            <input value={travelType === 'Local'} type="checkbox"
                                                                onChange={(e) => onChangeValueTravel_type('Local')}
                                                                checked={travelType === 'Local'}
                                                                className='' />

                                                            <span className='light1Rem flentBlack'>Local</span>
                                                        </div>
                                                        <div className='d-flex alignItem-center ml-20px'>
                                                            <input value={travelType === 'Domestic'} type="checkbox"
                                                                onChange={(e) => onChangeValueTravel_type('Domestic')}
                                                                checked={travelType === 'Domestic'}
                                                                className='' />

                                                            <span className='light1Rem flentBlack'>Domestic</span>
                                                        </div>
                                                    </div>
                                                ) : null} */}
                                                <>
                                                    {expense?.expense_name.toLowerCase() === 'travel' &&
                                                        <>
                                                            {expense?.subexpenses?.map((item: any, key) => (
                                                                <div className='d-flex column aa mt-2px' key={key}>
                                                                    <div className='d-flex alignItem-center m-20px w-15per'>
                                                                        <span className='light1Rem flentBlack m-10px localBg p-10px'>{item?.travelType}</span>
                                                                    </div>
                                                                    {item?.expenses?.map((dataValue: any, id: any) =>
                                                                        <div className='tt d-flex'>
                                                                            {expense?.expense_name === 'Travel' &&
                                                                                <div>
                                                                                    {dataValue?.travel_type === 'local' && (
                                                                                        <div className='qq d-flex column'>
                                                                                            <div className='d-flex'>
                                                                                                <div className='d-flex alignItem-center ml-20px'>
                                                                                                    {/* <input value={travelType === 'local'} type="checkbox"
                                                                                                        checked={travelType === 'local'}
                                                                                                        className='' /> */}
                                                                                                    <div className='w-15per alignItem-center '>
                                                                                                        <span className='light1Rem flentBlack m-10px'>{dataValue?.subexpense_name}</span>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {dataValue?.has_unit_cost === 'yes' &&
                                                                                                    <div className='ww mb-20px mr-20px d-flex '>
                                                                                                        <div key={id} className='d-flex bb column'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={`Unit cost`}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleDetails(e, dataValue.id, dataValue)}
                                                                                                                placeholder={`Unit cost`}
                                                                                                                value={dataValue?.unit_cost}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {dataValue?.has_max_distance === 'yes' &&
                                                                                                    <div className='ww mb-20px mr-20px'>
                                                                                                        <div key={id} className='d-flex row bb'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={"Maximum Distance (KM)"}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleDistanceDetails(e, dataValue?.id)}
                                                                                                                placeholder={`Enter value`}
                                                                                                                value={dataValue?.max_distance}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {dataValue?.has_max_amount === 'yes' &&
                                                                                                    <div className='ww mb-20px'>
                                                                                                        <div key={id} className='d-flex row bb'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={'Maximum Amount'}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleAmountDetails(e, dataValue?.id,)}
                                                                                                                placeholder={`Enter value`}
                                                                                                                value={dataValue?.max_amount}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )} {dataValue?.travel_type === 'domestic' && (
                                                                                        <div className='qq d-flex column'>

                                                                                            <div className='d-flex'>

                                                                                                <div className='d-flex alignItem-center ml-20px'>
                                                                                                    {/* <input value={travelType === 'Domestic'} type="checkbox"
                                                                                                        checked={travelType === 'Domestic'}
                                                                                                        className='' /> */}
                                                                                                    <div className='w-25per mr-20px '>
                                                                                                        <span className='light1Rem flentBlack m-10px mr-20px'>{dataValue?.subexpense_name}</span>
                                                                                                    </div>
                                                                                                </div>


                                                                                                {dataValue?.has_unit_cost === 'yes' &&
                                                                                                    <div className='ww mb-20px '>
                                                                                                        <div key={id} className='d-flex row bb'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={`Unit cost`}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleDetails(e, dataValue.subexpense_id, dataValue)}
                                                                                                                placeholder={`Unit cost`}
                                                                                                                value={dataValue?.unit_cost}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {dataValue?.has_max_distance === 'yes' &&
                                                                                                    <div className='ww mb-20px ml-20px'>
                                                                                                        <div key={id} className='d-flex row bb'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={"Maximum Distance (KM)"}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleDistanceDetails(e, dataValue?.id)}
                                                                                                                placeholder={`Enter value`}
                                                                                                                value={dataValue?.max_distance}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {dataValue?.has_max_amount === 'yes' &&
                                                                                                    <div className='ww mb-20px ml-20px'>
                                                                                                        <div key={id} className='d-flex row bb'>
                                                                                                            <TextBoxReact
                                                                                                                multiline={false}
                                                                                                                labelText={'Maximum Amount'}
                                                                                                                img={<img src={bill} />}
                                                                                                                onchangeText={(e: any) => handleAmountDetails(e, dataValue?.id,)}
                                                                                                                placeholder={`Enter value`}
                                                                                                                value={dataValue?.max_amount}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </>
                                                    }
                                                    {expense?.expense_name?.toLowerCase() === 'meal' &&
                                                        <div className='qq d-flex column'>
                                                            {expense?.subexpenses?.map((item: any, id) => (
                                                                <div className='d-flex'>
                                                                    <div className='w-15per mr-20px '>
                                                                        <span className='light1Rem flentBlack m-10px mr-20px'>{item?.subexpense_name}</span>
                                                                    </div>
                                                                    <div>
                                                                    </div>
                                                                    {item?.has_unit_cost === 'yes' &&
                                                                        <div className='ww mb-20px '>
                                                                            <div key={id} className='d-flex row bb'>
                                                                                <TextBoxReact
                                                                                    multiline={false}
                                                                                    labelText={`Unit cost`}
                                                                                    img={<img src={bill} />}
                                                                                    onchangeText={(e: any) => handleDetails(e, item.id, item)}
                                                                                    placeholder={`Unit cost`}
                                                                                    value={item?.unit_cost}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item?.has_max_distance === 'yes' &&
                                                                        <div className='ww mb-20px ml-20px'>
                                                                            <div key={id} className='d-flex row bb'>
                                                                                <TextBoxReact
                                                                                    multiline={false}
                                                                                    labelText={"Maximum Distance (KM)"}
                                                                                    img={<img src={bill} />}
                                                                                    onchangeText={(e: any) => handleDistanceDetails(e, item?.id)}
                                                                                    placeholder={`Enter value`}
                                                                                    value={item?.max_distance}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item?.has_max_amount === 'yes' &&
                                                                        <div className='ww mb-20px ml-20px'>
                                                                            <div key={id} className='d-flex row bb'>
                                                                                <TextBoxReact
                                                                                    multiline={false}
                                                                                    labelText={'Maximum Amount'}
                                                                                    img={<img src={bill} />}
                                                                                    onchangeText={(e: any) => handleAmountDetails(e, item?.id,)}
                                                                                    placeholder={`Enter value`}
                                                                                    value={item?.max_amount}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </>

                                                <>
                                                    {expense?.expense_name.toLowerCase() === 'hotel' ?
                                                        <>
                                                            {cityTier.map((tier: any, id) => (
                                                                <div className='m-10px d-flex row'>
                                                                    <div className='m-10px'>
                                                                        <div className='mb-20px '>
                                                                            <div key={id} className='d-flex row bb'>
                                                                                <TextBoxReact
                                                                                    multiline={false}
                                                                                    labelText={`City Tier`}
                                                                                    img={<img src={bill} />}
                                                                                    disabled={true}
                                                                                    placeholder={`City Tier`}
                                                                                    value={tier?.name}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='m-10px'>
                                                                        <div className='d-flex'
                                                                            key={id}
                                                                        >
                                                                            <TextBoxReact
                                                                                multiline={false}
                                                                                labelText={'Maximum amount'}
                                                                                img={<img src={bill} />}
                                                                                onchangeText={(e: any) => hotelDetailUpdate(id, "max_amount", e)}
                                                                                placeholder={`Enter price`}
                                                                                value={hotelDetails[0].max_amount}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </>
                                                        : null}

                                                </>
                                                <>
                                                    {expense?.expense_name.toLowerCase() === 'da' ?
                                                        <>
                                                            {cityTier.map((tier: any, id) => (
                                                                <div className='m-10px d-flex row'>
                                                                    <div className='m-10px'>
                                                                        <div className='mb-20px '>
                                                                            <div key={id} className='d-flex row bb'>
                                                                                <TextBoxReact
                                                                                    multiline={false}
                                                                                    labelText={`Hotel Tier`}
                                                                                    img={<img src={bill} />}
                                                                                    disabled={true}
                                                                                    placeholder={`City Tier`}
                                                                                    value={tier?.name}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='m-10px'>
                                                                        <div className='d-flex'
                                                                            key={id}
                                                                        >
                                                                            <TextBoxReact
                                                                                multiline={false}
                                                                                labelText={'Maximum amount'}
                                                                                img={<img src={bill} />}
                                                                                onchangeText={(e: any) => handleDaDetails(id, "max_amount", e)}
                                                                                placeholder={`Enter price`}
                                                                                value={daDetails[0].max_amount}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </>
                                                        : null}
                                                </>
                                            </div >
                                            {/* )} */}
                                        </div>

                                    </div>
                                    {toastContainer()}
                                </div>

                            </div>
                        )}
                        <div className='d-flex row justfyContent-end  flex-wrap'>
                            <div className='d-flex row flex-wrap'>
                                <div className='m-10px'>
                                    <CancelCommonButton
                                        title={"Cancel"}
                                        buttonClick={() => console.log('gcdvhgjwqk')}
                                    />
                                </div>
                                <div className='m-10px'>
                                    <BlueCommonButton
                                        title={"Submit"}
                                        subTitle={""}
                                        buttonClick={() => AddGradePolicy()}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
            }

        </div>
    )
}
