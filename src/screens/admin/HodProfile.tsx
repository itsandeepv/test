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
import { NewServiceCall, ServiceCall } from '../../service/config.js';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';
import plus2 from '../../assets/images/plus2.svg'
import LoadingSpinner from '../../components/loader.tsx';
import { HodAddPopup } from '../../components/HodAddPopup.tsx';

const data = [
    { id: 0, name: "Olivia Rhye", role: "Management", idName: 'N7868754', status: 'Activated' },
    { id: 1, name: "Olivia Rhye", role: "Management", idName: 'N7868754', status: 'Deactivated' },
    { id: 2, name: "Olivia Rhye", role: "Management", idName: 'N7868754', status: 'Deactivated' },
    { id: 3, name: "Olivia Rhye", role: "Management", idName: 'N7868754', status: 'Activated' },
]
export const HodProfileNew: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [mngmentId, setMngmentId] = useState(null)
    const [hodId, setHodId] = useState(null)
    const [mngmntData, setMngmntData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEmployee, setSelectedEmployee] = useState([])
    const handleCreateDataPopUp = (id) => {
        // setMngmentId(id.mgmnt_id === null || id.mgmnt_id === '' ? '' : id.mgmnt_id)
        setHodId(id.employe_id === null ? "" : id.employe_id)
        setIsShow(!isShow)
    }
    const getHodProfile = async () => {
        var formdata = new FormData();
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
                    console.log('vcjkwx??????', res?.data?.result)
                    setMngmntData(res?.data?.result)
                }
                else {
                    setMngmntData([])
                }
                console.log("getHodlist res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setMngmntData([])
                console.log("getHodlist reerrs>>>", err)
            })
    }
    useEffect(() => {
        getHodProfile()
    }, [])

    const navigate = useNavigate();
    const goToAdminManagementProfileDetails = (data: any) => {
        navigate('/admin/managementAdminDetails', { state: { data: data } })
    };

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
                                        {/* <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Status</span></TableCell> */}
                                        {/* <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mngmntData?.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                <span className="commonGraycolor"> {row?.name}</span>
                                            </TableCell>
                                            <TableCell align="center"><span className="commonGraycolor">{row?.role}</span></TableCell>
                                            <TableCell align="center">
                                                <div className='d-flex justfyContent-center column alignItem-center'>
                                                    {row?.empByHod.map((hodList, id) =>
                                                        <div className='m-5px commonGraycolor regular0_875Rem'>{hodList.name}</div>
                                                    )}
                                                    {/* <span className='d-flex justfyContent-center row alignItem-center curser'>
                                                        <span className='m-5px commonGraycolor regular0_875Rem'>Name</span>
                                                    </span> */}
                                                    <CustomAddButton
                                                        onclick={() => handleCreateDataPopUp(row)}
                                                        title={"Add Employee"}
                                                        icon={<img src={plus2} className='pl-5px pr-5px' />}
                                                    />
                                                </div>
                                            </TableCell>
                                            {/* <TableCell align="center"><span className="commonGraycolor">{row.status}</span></TableCell> */}
                                            {/* <TableCell align="center"><span className="commonGraycolor">
                                                <div className='d-flex justfyContent-center row alignItem-center'
                                                // onClick={() => handleCreateDataPopUp()}
                                                >
                                                    <span className='d-flex justfyContent-center row alignItem-center curser'>
                                                        <input type="radio" value="Activate" checked={true} className='m-5px' />
                                                        <span className='m-5px commonGraycolor regular0_875Rem'>Activate</span>
                                                    </span>
                                                    <span className='d-flex justfyContent-center row alignItem-center curser'>
                                                        <input type="radio" value="Deactivate" checked={true} className='m-5px' />
                                                        <span className='m-5px commonGraycolor regular0_875Rem'>Deactivate</span>
                                                    </span>
                                                    <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => goToAdminManagementProfileDetails(row)}>
                                                        <img src={edit} className='m-5px' />
                                                        <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                    </span>
                                                </div>
                                            </span></TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    {
                        isShow &&
                        <HodAddPopup
                            close={() => {
                                setIsShow(false)
                            }}
                            refresh={(e)=> getHodProfile()}
                            hodId={hodId}
                            selectedEmployee={(item) => {
                                console.log('selecetdEmployee:::::', item)
                                setSelectedEmployee(item)
                            }
                            }

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