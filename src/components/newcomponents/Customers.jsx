import React from 'react'
// import Pagination from '@/components/shared/Pagination'
// import Dropdown from '@/components/shared/Dropdown'

const actionOptions = [
    { label: "View User" },
    { label: "Delete User" },
]
const customerData = [
    { name: 'Alexandra Della', email: 'alex.della@email.com', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', flag: 'https://flagcdn.com/us.svg', country: 'United States', cardNumber: '****6231', date: '21 Sep, 2023' },
    { name: 'Valentine Maton', email: 'valentine.maton@email.com', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', flag: 'https://flagcdn.com/gb.svg', country: 'United Kingdom', cardNumber: '****8563', date: '25 Sep, 2023' },
    { name: 'Kenneth Hune', email: 'kenneth.hune@email.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', flag: 'https://flagcdn.com/fr.svg', country: 'France', cardNumber: '****4524', date: '16 Sep, 2023' },
    { name: 'Malanie Hanvey', email: 'malanie.hanvey@email.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', flag: 'https://flagcdn.com/de.svg', country: 'Germany', cardNumber: '****3486', date: '20 Sep, 2023' },
    { name: 'Archie Cantones', email: 'archie.cantones@email.com', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', flag: 'https://flagcdn.com/bd.svg', country: 'Bangladesh', cardNumber: '****7896', date: '20 Sep, 2023' },
];

const Customers = ({ title }) => {

    return (
        <div className="">
            <div className={`card stretch stretch-full widget-tasks-content`}>
                <div className="card-header">
                    <h5 className="card-title">{title}</h5>
                </div>
                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table customers-table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Country</th>
                                    <th>Payment method</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((customer, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-image">
                                                    <img src={customer.avatar} className="img-fluid" alt="Customer" />
                                                </div>
                                                <div>
                                                    <a href="#">{customer.name}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>
                                            <div className="hstack gap-2">
                                                <div className="avatar-image avatar-sm">
                                                    <img src={customer.flag} className="img-fluid" alt="img" />
                                                </div>
                                                <span className="d-inline-block align-middle">{customer.country}</span>
                                            </div>
                                        </td>
                                        <td><span>{customer.cardNumber}</span></td>
                                        <td>{customer.date}</td>
                                        {/* <td className="text-end">
                                            <Dropdown dropdownItems={actionOptions} triggerClass='avatar-md ms-auto' />
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* <div className="card-footer"> <Pagination /></div> */}
            </div>
        </div>
    )
}

export default Customers
