import React, { useState } from 'react'
import { taskStatusOptions } from '../../Utils/options'


const summaryData = [
    { invoiceNumber: '#896574', avatar: '/images/avatar/1.png', name: 'Alexandra Della', email: 'alex@outlook.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-visa', cardType: 'Visa', status: taskStatusOptions },
    { invoiceNumber: '#478523', avatar: '/images/avatar/2.png', name: 'Green Cute', email: 'green.cute@hotmail.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-mastercard', cardType: 'Mastercard', status: taskStatusOptions },
    { invoiceNumber: '#568745', avatar: '/images/avatar/3.png', name: 'Marianne Audrey', email: 'marianne.audrey@live.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-paypal', cardType: 'Paypal', status: taskStatusOptions },
    { invoiceNumber: '#852369', avatar: '/images/avatar/4.png', name: 'Holland Scott', email: 'holland.scott@gmail.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-paypal', cardType: 'Paypal', status: taskStatusOptions },
    { invoiceNumber: '#558746', avatar: '/images/avatar/5.png', name: 'Gregory Miller', email: 'gregory.miller@live.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-mastercard', cardType: 'Mastercard', status: taskStatusOptions },
];
const InvoiceSummary = ({ title }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const defaultStatusList = ["completed", "rejected", "completed", "pending", "completed"]

    return (
        <div className="">
            <div className={`card`}>
                <div className="card-header">
                    <h5 className="card-title">{title}</h5>
                </div>
                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Coupon</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th className="wd-250">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData.map(({ avatar, icon, cardType, code, date, email, invoiceNumber, name, status }, index) => {
                                    const statusValue = status.find((v) => v.value === defaultStatusList[index])
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href="#">{invoiceNumber}</a>
                                            </td>
                                            <td>
                                                <div className="hstack gap-3">
                                                    <div className="avatar-image">
                                                        <img src={avatar} alt="" className="img-fluid" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{name}</div>
                                                        <div className="fs-12 text-muted">{email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge text-success border border-success border-dashed">{code}</span>
                                            </td>
                                            <td>{date}</td>
                                            <td><i className={`me-1 fs-18`}>{}</i>{cardType}</td>
                                            <td>
                                                <select className="form-select">
                                                    <option value="">Select</option>
                                                    {status.map((item) => (
                                                        <option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            {/* <td>
                                                <Dropdown dropdownItems={actionOptions} triggerClass='avatar-md ms-auto' triggerPosition={"0,28"} />
                                            </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <div className="card-footer"> <Pagination /></div> */}
            </div>
        </div>
    )
}

export default InvoiceSummary
