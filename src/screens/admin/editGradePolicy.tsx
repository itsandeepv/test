import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import bill from '../../assets/images/bill.svg'
import { TextBoxReact } from '../../components/textBox.tsx';
import { BlueCommonButton, WhiteCommonButton, UploadCommonButton, CancelCommonButton, FunctionalCommonButton, AddButton } from '../../components/button.tsx'
import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loader.tsx';

export const EditGradePolicy = () => {
    const [grade, setGrade] = useState('');
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<any>([])
    const [editGradeData, setEditGradeData] = useState<any>([])
    const location = useLocation();
    const { gradedata, gradeid } = location.state || {};
    console.log('grade daatattaa', gradedata)
    const navigate = useNavigate();

    // done
    const getGradePolicy = async () => {
        const formdata = new FormData();
        formdata.append("grade", gradedata);
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
                    setEditGradeData(res?.data?.result)
                    console.log('edit grade policy data reponse ???????//', res?.data?.result)
                }
                else {
                    setEditGradeData([])
                }
                console.log("getGradePolicy called with gradeid>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setEditGradeData([])
                console.log("getGradePolicy called with gradeid>>", err)
            })
    }

    const gradePolicySave = async () => {
        const gradePolicyData = {
            grade_name: gradedata,
            policies: JSON.stringify(editGradeData ? editGradeData : [])
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.editgradePolicy,
            headers: {},
            data: gradePolicyData
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                console.log("gradePolicySave res>>", res)
                if (res?.status === 200) {
                    notifySuccess(res?.data?.message)
                }
                navigate('/admin/gradePolicyList')
                console.log("getGrade res>>>", res)
            })
            .catch((err) => {
                console.log("getGrade reerrs>>>", err)
            })
    }

    useEffect(() => {
        getGradePolicy()
    }, [])

    const handleExpenseType = (e, arg) => {
        console.log("handleExpenseType e, arg>>", e, arg)
        console.log("handleExpenseType data>>", data)
        const updateData = data.expense.map((item => {
            if (item.type === arg) {
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


    const handleExpenseDetails = (e, row, type) => {
        console.log(`handleExpenseDetails e>>${e?.target?.checked} and row>>${row?.expenseType} and type>>${type}`)
        console.log("handleExpenseDetails data>>", data)
        const updatedData = data.expense.map(item => {
            if (item.type === type) {
                console.log("handleExpenseDetails item>>", item.data)
                const updatedInnerData = item.data.map(vehicalData => {
                    if (vehicalData.expenseType === row.expenseType) {
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

    const handleDetails = (e: any, id: number, gradeData: any) => {
        const { value } = e.target;
        // Create a new array with the updated unit_cost for the specific item
        const updatedEditGradeData = editGradeData.map((item, index) => {
            if (index === id) {
                return { ...item, unit_cost: value };
            }
            return item;
        });
        // Update the state with the new array
        setEditGradeData(updatedEditGradeData);
    };
    const handleDistanceDetails = (e: any, id: number, gradeData: any) => {
        const { value } = e.target;
        const updatedEditGradeData = editGradeData.map((item, index) => {
            if (index === id) {
                return { ...item, max_distance: value };
            }
            return item;
        });
        // Update the state with the new array
        setEditGradeData(updatedEditGradeData);
    };
    const handleAmountDetails = (e: any, id: number, gradeData: any) => {
        const { value } = e.target;
        console.log(`e>>${value} and id>> ${id}`)
        const updatedEditGradeData = editGradeData.map((item, index) => {
            if (index === id) {
                return { ...item, max_amount: value };
            }
            return item;
        });
        // Update the state with the new array
        setEditGradeData(updatedEditGradeData);
    };

    console.log("editGradeData>>", editGradeData)
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
                                            value={gradedata}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            disabled={gradedata === undefined ? false : true}
                                        >
                                            <MenuItem value="" disabled>
                                                {gradedata}
                                            </MenuItem>
                                            <MenuItem key={gradeid} value={gradedata}>
                                                {gradedata}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <span className="bold1_26Rem commonBlackcolor d-flex m-10px justfyContent-start textAlign-Start">Expense Types</span>
                        <div className='moduleBorderWithoutPadding '>
                            <div className='d-flex column m-10px justfyContent-start textAlign-Start'>
                                <div className='bold1Rem commonBlackcolor '>Set Policy for Expense</div>
                                {editGradeData.map((gradeData: any, id) =>
                                    <div className='m-10px' key={id}>
                                        <div className='d-flex column nn'>
                                            <div className='addButton'>
                                                <div className="localBg white d-flex align-center justfyContent-center addButton">
                                                    <input value={gradeData?.expense_name} type="checkbox"
                                                        onChange={(e) => console.log('e.target.value', e.target.value)}
                                                        checked={gradeData?.expense_name}
                                                        className='ml-10px mr-10px' />
                                                    <span className="light1Rem flentBlack mr-10px">{gradeData?.expense_name.charAt(0).toUpperCase() + gradeData?.expense_name.slice(1)}</span>
                                                </div>
                                            </div>
                                            <div className='d-flex column aa mt-20px'>
                                                <div className='tt d-flex'>
                                                    <div className='qq d-flex column'>
                                                        <div className='d-flex'>
                                                            <div className='w-15per mr-20px '>
                                                                <span className='light1Rem flentBlack m-10px mr-20px'>{gradeData?.subexpense_name}</span>
                                                            </div>
                                                            {
                                                                (gradeData?.expense_name === "DA" || gradeData?.expense_name === "Hotel") ?
                                                                    <div className='w-15per mr-20px '>
                                                                        <span className='light1Rem flentBlack m-10px mr-20px'>{gradeData?.tier_name}</span>
                                                                    </div>
                                                                    :
                                                                    ""
                                                            }
                                                            {
                                                                (gradeData?.expense_name === "DA" || gradeData?.expense_name === "Hotel") ?
                                                                    "" :
                                                                    <div className='ww mb-20px '>
                                                                        <div key={id} className='d-flex row bb'>
                                                                            <TextBoxReact
                                                                                multiline={false}
                                                                                labelText={`Price per ${gradeData?.expense_name === 'Meal' ? 'meal' : gradeData?.expense_name === 'Travel' ? 'km' : 'Tier'} `}
                                                                                img={<img src={bill} />}
                                                                                onchangeText={(e: any) => handleDetails(e, id, gradeData)}
                                                                                placeholder={`Enter Price per ${gradeData?.expense_name === 'Meal' ? 'meal' : gradeData?.expense_name === 'Travel' ? 'km' : 'Tier'}`}
                                                                                value={gradeData?.unit_cost}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                            }
                                                            {
                                                                (gradeData?.expense_name === "DA" || gradeData?.expense_name === "Hotel") ?
                                                                    "" :
                                                                    <div className='ww mb-20px ml-20px'>
                                                                        <div key={id} className='d-flex row bb'>
                                                                            <TextBoxReact
                                                                                multiline={false}
                                                                                labelText={"Allowed Distance"}
                                                                                img={<img src={bill} />}
                                                                                onchangeText={(e: any) => handleDistanceDetails(e, id, gradeData)}
                                                                                placeholder={`Enter value`}
                                                                                value={gradeData?.max_distance}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                            }
                                                            <div className='ww mb-20px ml-20px'>
                                                                <div key={id} className='d-flex row bb'>
                                                                    <TextBoxReact
                                                                        multiline={false}
                                                                        labelText={'Maximum Amount'}
                                                                        img={<img src={bill} />}
                                                                        onchangeText={(e: any) => handleAmountDetails(e, id, gradeData)}
                                                                        placeholder={`Enter value`}
                                                                        value={gradeData?.max_amount}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {
                                                            (gradeData?.expense_name === "DA" || gradeData?.expense_name === "Hotel") ?
                                                                "" :
                                                                <div className='mt-15px mb-15px mr-20px d-flex'>
                                                                    <div className='d-flex mr-20px'>
                                                                        <input value={gradeData?.has_unit_cost} type="checkbox"
                                                                            onChange={(e) => console.log('tarhegt value ', e.target.value)}
                                                                            checked={gradeData?.has_unit_cost === 'yes' ? true : false}
                                                                            className='' />
                                                                        <span className='light1Rem flentBlack'>unit Cost</span>
                                                                    </div>

                                                                    <div className='d-flex mr-20px'>
                                                                        <input value={gradeData?.has_max_distance} type="checkbox"
                                                                            onChange={(e) => console.log('tarhegt value ', e.target.value)}
                                                                            checked={gradeData?.has_max_distance === 'yes' ? true : false}
                                                                            className='' />

                                                                        <span className='light1Rem flentBlack'>Maximum distance</span>
                                                                    </div>

                                                                    <div className='d-flex mr-20px'>
                                                                        <input value={gradeData?.has_max_amount} type="checkbox"
                                                                            onChange={(e) => console.log('tarhegt value ', e.target.value)}
                                                                            checked={gradeData?.has_max_amount === 'yes' ? true : false}
                                                                            className='' />

                                                                        <span className='light1Rem flentBlack'>Maximum Amount</span>
                                                                    </div>

                                                                    <div className='d-flex '>
                                                                        <input value={gradeData?.has_invoice} type="checkbox"
                                                                            onChange={(e) => console.log('tarhegt value ', e.target.value)}
                                                                            checked={gradeData?.has_invoice === 'yes' ? true : false}
                                                                            className='' />

                                                                        <span className='light1Rem flentBlack'>Invoice</span>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}
                                {toastContainer()}
                            </div>
                        </div>
                        <div className='d-flex row justfyContent-end  flex-wrap'>
                            <div className='d-flex row flex-wrap'>
                                <div className='m-10px'>
                                    <CancelCommonButton
                                        title={"Cancel"}
                                        buttonClick={() => navigate('/admin/gradePolicyList')}
                                    />
                                </div>
                                <div className='m-10px'>
                                    <BlueCommonButton
                                        title={"Submit"}
                                        subTitle={""}
                                        buttonClick={() => gradePolicySave()}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
            }

        </div>
    )
}
