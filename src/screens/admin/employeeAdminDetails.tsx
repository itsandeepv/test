import React, { useState, useEffect } from "react";
import { TextBoxReact } from "../../components/textBox.tsx";
import people from '../../assets/images/people.svg'
import phone from '../../assets/images/phone.svg'
import mail from '../../assets/images/mail.svg'
import { useNavigate, useLocation } from 'react-router-dom';
import { BlueCommonButton, WhiteCommonButton } from '../../components/button.tsx';

import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import { CustomAdminPopUp } from './customAdminPopUp.tsx';

import MultipleSelectChip from "../../components/customMultiSelector.js";
import DropDownCustom from "../../components/customDropdown.js";
import LoadingSpinner from "../../components/loader.tsx";
export const EmployeeAdminDetails = () => {
    const { state } = useLocation();
    const [allRole, setAllRole] = useState([])
    const [hodList, setHodList] = useState([])
    const [gradeList, setGradeList] = useState([])
    const location = useLocation();
    const [isLoading, setLoading] = useState(false)
    const { data } = location.state || {};
    console.log('empData::::><<<<?????', data)

    const [ispopupOpen, setPopup] = useState(false)

    // Hod List
    const getHodList = async () => {
        var formdata = new FormData();
        formdata.append("mgm_id", data?.mgmnt_id);
        formdata.append("hod_id", data?.hod_id);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.getHodList,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setHodList(res?.data?.result)
                }
                else {
                    setHodList([])
                }
                console.log("getHodlist res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setHodList([])
                console.log("getHodlist reerrs>>>", err)
            })
    }
    // All Roles list for dropdown
    const getAllRoles = async () => {
        const formdata = new FormData();
        formdata.append("name", data?.name);
        formdata.append("email", data?.email);
        formdata.append("phone", data?.phone);
        formdata.append("grade_id", data?.grade_id);
        formdata.append("employe_id", data?.employe_id);
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: initUrl + admin.getAllRoles,
            headers: {},
            data: formdata
        };

        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setAllRole(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setAllRole([])
                    notifyError("Something went wrong!")
                }
                console.log("getAllRoles res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setAllRole([])
                console.log("getAllRoles reerrs>>>", err)
            })
    }
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
                if (res.status === 200) {
                    setGradeList(res?.data?.result ? res?.data?.result : [])
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

    useEffect(() => {
        getAllRoles()
        getHodList()
        getGrade()
    }, [])


    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState('');

    const [fieldValue, setFieldValue] = useState({
        name: state?.data?.name,
        empID: state?.data?.employe_id,
        email: state?.data?.email,
        phoneNo: state?.data?.phone,
        grade: state?.data?.grade,
        hod: state?.data?.hod,
        // hod: state?.data?.hod_id,
        role: state?.data?.role,
    })
    console.log("fieldValue>>", fieldValue)
    const handleInput = (e: any, type: any) => {
        if (type === "name") {
            setFieldValue((prevData) => ({
                ...prevData,
                name: e.target.value
            }))
        }
        else if (type === "empID") {
            setFieldValue((prevData) => ({
                ...prevData,
                empID: e.target.value
            }))
        }
        else if (type === "email") {
            setFieldValue((prevData) => ({
                ...prevData,
                email: e.target.value
            }))
        }
        else if (type === "phoneNo") {
            setFieldValue((prevData) => ({
                ...prevData,
                phoneNo: e.target.value
            }))
        }
        else if (type === "grade") {
            setFieldValue((prevData) => ({
                ...prevData,
                grade: e
            }))
        }
        else if (type === "hod") {
            setFieldValue((prevData) => ({
                ...prevData,
                hod: e
            }))
        }
        else if (type === "role") {
            console.log("e>>", e)
            const filteredData = allRole.filter((item: any) => e?.includes(item?.role)).map((item: any) => ({ id: item.id, role: item.role }));
            setFieldValue((prevData) => ({
                ...prevData,
                role: filteredData
            }))
        }
    }

    const updateEmployeeDetails = async () => {
        const formdata = new FormData();
        formdata.append("name", fieldValue.name);
        formdata.append("email", fieldValue.email);
        formdata.append("phone", fieldValue.phoneNo);
        formdata.append("grade_id", fieldValue?.grade?.name);
        formdata.append("employe_id", fieldValue.empID);
        formdata.append("hod_id", fieldValue?.hod?.employee_id);
        formdata.append("role", fieldValue.role?.map((item: any) => item.id))
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.editEmployee,
            headers: {},
            data: formdata
        };
        console.log("config>>", config)
        setLoading(true)
        await NewServiceCall(config)
            .then((res: any) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    navigate('/admin/employeeAdmin')
                }
                else {
                    notifyWarning("Something went wrong")
                }
                console.log("updateEmployeeDetails res>>>", res)
            })
            .catch((err: any) => {
                setLoading(false)
                notifyWarning("Something went wrong")
                console.log("updateEmployeeDetails reerrs>>>", err)
            })
    }

    console.log("fieldValue>>>", fieldValue)
    return (
        <div>
            <LoadingSpinner loading={isLoading} />
            <div className='moduleBorderWithoutPadding '>
                <div className='d-flex column m-10px justfyContent-start textAlign-Start'>
                    <div className='bold1Rem commonBlackcolor '>Edit Employee Profile</div>
                    <div className="d-flex row flex-wrap gap-20px">
                        <div className='m-10px'>
                            <TextBoxReact
                                multiline={false}
                                labelText="Full Name"
                                img={<img src={people} />}
                                onchangeText={(e: any) => handleInput(e, "name")}
                                placeholder={"Olivia Rhye"}
                                // onchangeText={(e: any) => setCityName(e.target.value)}
                                value={fieldValue.name}
                            />
                        </div>
                        <div className='m-10px'>
                            <TextBoxReact
                                multiline={false}
                                labelText="Employee ID"
                                img={<img src={people} />}
                                onchangeText={(e: any) => handleInput(e, "empID")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.empID}
                            />
                        </div>
                        <div className='m-10px'>
                            <TextBoxReact
                                multiline={false}
                                labelText="Email"
                                img={<img src={mail} />}
                                onchangeText={(e: any) => handleInput(e, "email")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.email}
                            />
                        </div>

                        <div className='m-10px'>
                            <TextBoxReact
                                multiline={false}
                                labelText="Phone Number"
                                img={<img src={phone} />}
                                onchangeText={(e: any) => handleInput(e, "phoneNo")}
                                placeholder={"Olivia Rhye"}
                                value={fieldValue.phoneNo}
                            />
                        </div>

                        <div className="m-10px">
                            <DropDownCustom
                                icon={<img src={people} />}
                                lable="Select Grade"
                                data={gradeList}
                                selectedValue={fieldValue?.grade}
                                setValue={(e) => handleInput(e, "grade")}
                                viewKeyName="name"
                            />
                        </div>

                        <div className="m-10px">
                            <DropDownCustom
                                icon={<img src={people} />}
                                lable="Assign HOD"
                                data={hodList}
                                selectedValue={fieldValue?.hod}
                                setValue={(e) => handleInput(e, "hod")}
                                viewKeyName="name"
                            />
                        </div>

                        <div className="m-10px">
                            <MultipleSelectChip
                                icon={<img src={people} />}
                                lable="Role"
                                data={allRole}
                                selectedValue={fieldValue.role}
                                setValue={(e) => handleInput(e, "role")}
                                // setValue={(e) => console.log("eee>>",e)}
                                viewKeyName="name"
                                otherKeyName='role'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex row'>
                <div className='m-5px'>
                    <WhiteCommonButton
                        title={"Cancel"}
                        subTitle={""}
                        buttonClick={() => navigate('/admin/employeeAdmin')}
                    />
                </div>
                <div className='m-5px'>
                    <BlueCommonButton
                        title={"Save Changes"}
                        subTitle={""}
                        buttonClick={() => setPopup(true)}
                    />
                </div>
                {toastContainer()}
            </div>
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"employeeEdit"}
                    fileId={1}
                    passTempData={''}
                    buttonClick={() => updateEmployeeDetails()}
                    getValue={(e) => console.log("")}
                />
            }

        </div>
    )
}
