import React, { useEffect, useState } from 'react'
import { BlueCommonButton, CustomAddButton } from '../../components/button.tsx'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CustomAdminPopUp } from './customAdminPopUp.tsx';
import edit from '../../assets/images/edit.svg'
import { Link, useNavigate } from 'react-router-dom';
import { admin, initUrl } from '../../service/url.js';
import { ServiceCall } from '../../service/config.js';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';
import { ManagementProfilePopup } from '../../components/managemntAddPopup.tsx';
import plus2 from '../../assets/images/plus2.svg'
import LoadingSpinner from '../../components/loader.tsx';

export const ManagementProfile: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isShow, setIsShow] = useState(false)

    const [mngmntData, setMngmntData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEmployee, setSelectedEmployee] = useState([])
    const[mngmentId,setMngmentId] = useState(null)
    const[hodId,setHodId] = useState(null)
    const handleCreateDataPopUp = (id: any) => {
        console.log('emp id>>>',id.employe_id)
        setMngmentId(id.employe_id ? id?.employe_id : '')
        // setMngmentId(id.mgmnt_id===null||id.mgmnt_id===''?"NPI061":id.mgmnt_id)
        // setHodId(id.hod_id===null?"1,2,3":id.hod_id)
        setIsShow(!isShow)
    }
    const getManagementProfile = async () => {
        setLoading(true)
        const url = initUrl + admin.getmanagementProfile;
        const formdata = new FormData();
        const response = await ServiceCall(url, formdata)
            .then((res) => {
                setLoading(false)
                console.log("getManagementProfile res>>", res.result)
                if (res?.responseCode === 200) {
                    setMngmntData(res?.result)
                    console.log('mngmntData:::::??????',mngmntData)
                }
                else {
                    notifyError("Something went wrong.")
                }
            })
            .catch((err) => {
                console.log("getmanagementProfile err>>", err)
                notifyError("Something went wrong.")
            })
    }
    useEffect(() => {
        getManagementProfile()
    }, [])

    const navigate = useNavigate();
    const goToAdminManagementProfileDetails = (data: any) => {
        navigate('/admin/managementAdminDetails', { state: { data: data } })
    };
console.log("mngmntData>>",mngmntData)
    return (
        <div className='p-20px'>
            {loading ?
                <LoadingSpinner loading={loading} />
                :
                <>
                    {/* <div className='justfyContent-end d-flex'>
                        <BlueCommonButton
                            title={"Create Master Expense"}
                            subTitle={""}
                            buttonClick={() => console.log()}
                        />
                    </div> */}
                    <div className='mt-20px'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Name</span></TableCell>
                                        <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Role</span></TableCell>
                                        <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Employees</span></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mngmntData.map((row:any, index) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                <span className="commonGraycolor"> {row.name}</span>
                                            </TableCell>
                                            <TableCell align="center"><span className="commonGraycolor">{row.role}</span></TableCell>
                                            <TableCell align="center">
                                                <div className='d-flex justfyContent-center column alignItem-center'>
                                                    {row?.assigned_hod.map((hodList,id)=>
                                                    <div className='m-5px commonGraycolor regular0_875Rem'>{hodList.name}</div>
                                                    )}
                                                    
                                                    <CustomAddButton
                                                        onclick={() => handleCreateDataPopUp(row)}
                                                        title={"Add Hod"}
                                                        icon={<img src={plus2} className='pl-5px pr-5px' />}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    {
                        isShow &&
                        <ManagementProfilePopup
                            close={() => setIsShow(false)}
                            mngmntId={mngmentId}
                            hodId={hodId}
                            refresh={(e)=> getManagementProfile()}
                            selectedEmployee={(item) => setSelectedEmployee(item) }
                        />
                    }
                    {
                        ispopupOpen &&
                        <CustomAdminPopUp
                            close={() => setPopup(false)}
                            popUpType={"masterExpense"}
                            fileId={1}
                        />
                    }
                </>
            }
        </div>
    )
}