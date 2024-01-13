import React, { useEffect, useState } from "react";
import { ViolationPopUp } from "./violationPopUp.tsx";

export const PolicyViolation = ({data,submitUser}) => {
    const [violationPopUp, SetViolationPopUp] = useState(false)
    const openViolation = () => {
        SetViolationPopUp(true)
    }
    console.log("PolicyViolation data>>", data,submitUser)
    const [violationData, setViolationData]= useState([])
    useEffect(()=>{
        setViolationData(data)
    },[])
    return (
        <>
            <div className="d-flex textAlign-Start column">
                <div className="bold1Rem commonBlackcolor">Policy Violations
                    <span className="justfyContent-center ml-5px" style={{ backgroundColor: 'red', display: 'inline-flex', height: '25px', width: '25px', borderRadius: '12.5px' }}>
                        <span className="bold1Rem white">{data?.length}</span>
                    </span>
                </div>
                <hr style={{ width: '100%' }} />
                <div>
                    <span className="light0_875Rem commonGraycolor">Click to View Reason to see all violations.{" "}</span>
                    <span className="bold0_875Rem commonBlackcolor curser txtstyle" onClick={() => openViolation()}>View Reason</span>
                </div>
            </div>
            {
              violationPopUp &&
                <ViolationPopUp
                    close={() => SetViolationPopUp(false)}
                    data = {violationData}
                    submitUser={submitUser}
                />
            }
        </>
    )
}