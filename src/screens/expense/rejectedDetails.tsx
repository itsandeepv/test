import React, { useEffect, useState } from "react";
import '../expenseDetail/expenseDetailHome.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import description from '../../assets/images/description.svg'
import openArrow from '../../assets/images/openArrow.svg'
import closeArrow from '../../assets/images/closeArrow.svg'
import Tooltip from '@mui/material/Tooltip';
import i from '../../assets/images/i.svg'
import amount from '../../assets/images/travel/amount.svg'
import city from '../../assets/images/city.svg'

export const RejectedExpenseDetails = (data: any) => {
    console.log("RejectedExpenseDetails data>>", data?.data)
    const [activeCard, setActiveCard] = useState(false)
    const handleTab = () => {
        setActiveCard(!activeCard)
        // setActiveCard(tabName === activeCard ? "" : tabName)
    }
    const filterKeys = (obj, keysToExclude) =>
        Object.fromEntries(
            Object.entries(obj).filter(([key]) => !keysToExclude.includes(key))
        );
    // Keys to exclude
    const excludedKeys = ['id', 'expense_id', 'updated_at', 'created_at'];
    const excludedTravelKeys = ['id', 'expense_id', 'updated_at', 'created_at', "invoices"];

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
console.log("ddddd>>",data.data)
    return (
        <div className="mainContainer">
            <div onClick={() => handleTab()} className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                <span className={"activetab tabSupport bold0_875Rem"}>Rejected Expense Details</span>
                <img src={activeCard ? openArrow : closeArrow} />
            </div>
            {
                activeCard === true && data?.data?.length !==0 &&
                <>
                    <div className='moduleBorderWithoutPadding'>
                        <div className='d-flex alignItem-start row'>
                            <div className='m-10px'>
                                <TextField
                                    id="input-with-icon-textfield"
                                    label="Start Date"
                                    type='date'
                                    value={data?.data[0]?.start_date}
                                    disabled={true}
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
                                    disabled={true}
                                    value={data?.data[0]?.end_date}
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
                                disabled={true}
                                placeholder="Max 250 characters"
                                value={data?.data[0]?.description}
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
                    {
                        data?.data[0]?.meals?.length !== 0 &&
                        <div className='moduleBorderWithoutPadding d-flex column'>
                            <div className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                                <span className={"activetab tabSupport bold0_875Rem"}>Meal Expense</span>
                                <img src={closeArrow} />
                            </div>
                            {
                                data?.data[0]?.meals?.map((entry, id) => {
                                    const filteredEntry = filterKeys(entry, excludedKeys);
                                    return (
                                        <div className="d-flex row aa flex-wrap">
                                            {Object.entries(filteredEntry)?.map(([key, value]) => (
                                                <>
                                                    {value !== "" && value !== null && key !== "invoice_file" ?
                                                        <div className='m-10px'>
                                                            <TextField
                                                                id="input-with-icon-textfield"
                                                                label={key === "ex_date" ? "Date" : key.charAt(0).toUpperCase() + key.slice(1)}
                                                                type={key === "ex_date" ? 'date' : "string"}
                                                                value={key.includes("_tag") ? value.split(',')[0] : value}
                                                                disabled={true}
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
                                                        :
                                                        ""
                                                    }
                                                    {
                                                        value !== "" && value !== null && key === "invoice_file" ?
                                                            (
                                                                <div className='m-10px d-flex alignItem-center'>
                                                                    {key?.charAt(0).toUpperCase() + key?.slice(1)}{invoiceView(value)}
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
                                                                        Tag: {renderTeamMembers(value.split(',')?.map(member => member.trim()))}
                                                                    </span>
                                                                    <img src={i} className='iImg m-5px' />
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    ) : null}
                                                </>

                                            ))}
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                    }
                    {
                        <div>
                            {
                                data?.data[0]?.travels?.length !== 0 &&
                                <div className='moduleBorderWithoutPadding d-flex column'>
                                    <div className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                                        <span className={"activetab tabSupport bold0_875Rem"}>Travel Expense</span>
                                        <img src={closeArrow} />
                                    </div>
                                    {
                                        data?.data[0]?.travels?.map((entry, index) => {
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
                                                                                disabled={true}
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
                                                                        disabled={true}
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
                                                            </div>
                                                            {
                                                                invoice?.invoice_file !== null ?
                                                                    <div className='m-10px d-flex alignItem-center'>
                                                                        Invoice_file {invoiceView(invoice?.invoice_file)}
                                                                    </div>
                                                                    :
                                                                    ""
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            }
                        </div>
                    }
                    {
                        <div>
                            {
                                data?.data[0]?.hotels?.length !== 0 &&
                                <div className='moduleBorderWithoutPadding d-flex column'>
                                    <div className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                                        <span className={"activetab tabSupport bold0_875Rem"}>Hotel Expense</span>
                                        <img src={closeArrow} />
                                    </div>
                                    {
                                        data?.data[0]?.hotels?.map((item, id) =>
                                            <div className='d-flex row alignItem-center flex-wrap'>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="City"
                                                        type='string'
                                                        disabled={true}
                                                        placeholder='City Name'
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <img src={city} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={item?.city}
                                                    />
                                                </div>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Check In"
                                                        type='date'
                                                        disabled={true}
                                                        className='datepicker'
                                                        // placeholder='Select location'
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" className='ml-10px'>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={item.check_in_date}
                                                    />
                                                </div>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Check Out"
                                                        type='date'
                                                        disabled={true}
                                                        className='datepicker'
                                                        // placeholder='Select location'
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" className='ml-10px'>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={item?.check_out_date}
                                                    />
                                                </div>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Number of days"
                                                        type='date'
                                                        disabled={true}
                                                        className='datepicker'
                                                        // placeholder='Select location'
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" className='ml-10px'>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        variant="standard"
                                                        value={item?.days_count}
                                                    />
                                                </div>
                                                {
                                                    item?.invoices.map((item, id) =>
                                                        <>
                                                            <div key={id}>
                                                                <TextField
                                                                    id="input-with-icon-textfield"
                                                                    label={item.ei_type}
                                                                    type='number'
                                                                    disabled={true}
                                                                    placeholder='Select location'
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <img src={amount} />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    variant="standard"
                                                                    value={item?.amount}
                                                                />
                                                            </div>
                                                            {
                                                                item.invoice_file !== null ?
                                                                    <div className='m-10px d-flex alignItem-center'>
                                                                        Invoice file {invoiceView(item.invoice_file)}
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            }
                        </div>
                    }
                    {
                        <div>
                            {
                                data?.data[0]?.das?.length !== 0 &&
                                <div className='moduleBorderWithoutPadding d-flex column'>
                                    <div className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                                        <span className={"activetab tabSupport bold0_875Rem"}>DA Expense</span>
                                        <img src={closeArrow} />
                                    </div>
                                    {
                                        data?.data[0]?.das?.map((item, id) =>
                                            <div className='d-flex row alignItem-center flex-wrap' key={id}>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Number of days"
                                                        type='date'
                                                        disabled={true}
                                                        value={item?.ex_date}
                                                        className='datepicker'
                                                        // placeholder='Select location'
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
                                                        disabled={true}
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
                                                        disabled={true}
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
                                        )
                                    }
                                </div>
                            }
                        </div>
                    }
                    {
                        <div>
                            {
                                data?.data[0]?.others?.length !== 0 &&
                                <div className='moduleBorderWithoutPadding d-flex column'>
                                    <div className="d-flex row space-between alignItem-center curser pl-20px pr-20px">
                                        <span className={"activetab tabSupport bold0_875Rem"}>Other Expense</span>
                                        <img src={closeArrow} />
                                    </div>
                                    {
                                        data?.data[0]?.others?.map((item, id) =>
                                            <div className='d-flex row alignItem-center flex-wrap' key={id}>
                                                <div className='m-10px'>
                                                    <TextField
                                                        id="input-with-icon-textfield"
                                                        label="Title"
                                                        type='string'
                                                        disabled={true}
                                                        value={item?.title}
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
                                                        label="Amount"
                                                        type='number'
                                                        disabled={true}
                                                        value={item?.title}
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
                                        )
                                    }
                                </div>
                            }
                        </div>
                    }
                </>
            }

        </div>
    )
}