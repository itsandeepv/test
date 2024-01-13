import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import initProgressBar from '../assets/images/progressBar/init.svg'
import progressBar1 from '../assets/images/progressBar/progres1.svg'
import progressBar2 from '../assets/images/progressBar/progres2.svg'
import progressBar3 from '../assets/images/progressBar/progres3.svg'
import './progressBarStyles.css'
export const CustomeProgressBar = ({ data }) => {
    const percent = 40
    return (
        <>
            {
                data?.show_to_mgmnt === "no" ?
                    <ProgressBar
                        percent={data?.hr_approved === "yes" ? 100 : data?.hod_approved === "yes" ? 50 : 0}
                        // percent={45}
                        filledBackground="linear-gradient(to right, #FFC332, #FF9234, #E74A2C, #D92027)"
                    >
                        {/* positionItem */}
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px">
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={initProgressBar}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Submitted</div>
                                    <span className="commonGraycolor light0_875Rem"> Amount : {data?.total_amount}</span>

                                </div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px">
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={progressBar1}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Approved by HOD</div>
                                    <span className="commonGraycolor light0_875Rem">{data?.hod_approved_amount === null || data?.hod_approved_amount === '' ? "" : (data?.hod_approved_amount)}</span>
                                </div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px " style={{ width: '10vw' }}>
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={progressBar3}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Approved by Hr</div>
                                    <span className="commonGraycolor light0_875Rem">{data?.approved_amount === null || data?.approved_amount === '' ? "" : (data?.approved_amount)}</span>
                                </div>
                            )}
                        </Step>
                    </ProgressBar> : <ProgressBar
                        percent={data?.hr_approved === "yes" ? 100 : data?.mgmnt_approved === "yes" ? 66.6 : data?.hod_approved === "yes" ? 33 : 0}
                        // percent={45}
                        filledBackground="linear-gradient(to right, #FFC332, #FF9234, #E74A2C, #D92027)"

                    >
                        {/* positionItem */}

                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px">
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={initProgressBar}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Submitted</div>
                                    <span className="commonGraycolor light0_875Rem">Amount : {data?.total_amount}</span>
                                </div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px">
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={progressBar1}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Approved by HOD</div>
                                    <span className="commonGraycolor light0_875Rem">{data?.hod_approved_amount === null || data?.hod_approved_amount === '' ? "" : (data?.hod_approved_amount)}</span>
                                </div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px">
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={progressBar2}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Approved by Management</div>
                                    <span className="commonGraycolor light0_875Rem">{data?.mgmnt_approved_amount === null || data?.mgmnt_approved_amount === '' ? "" : (data?.mgmnt_approved_amount)}</span>

                                </div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <div className="d-flex column alignItem-center mt-40px " style={{ width: '10vw' }}>
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={progressBar3}
                                    />
                                    <div className="m-10px commonGraycolor light0_875Rem">Approved by Hr</div>
                                    <span className="commonGraycolor light0_875Rem">{data?.approved_amount === null || data?.approved_amount === '' ? "" : `Approved Amount : ${data?.approved_amount}`}</span>
                                </div>
                            )}
                        </Step>
                    </ProgressBar>

            }
        </>


    )
}