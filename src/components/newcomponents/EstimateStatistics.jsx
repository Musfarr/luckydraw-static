import React from 'react'
import { Bar, CurrencyDollar, ShoppingCart, TagGroup, ChartBubblePacked } from '@carbon/icons-react';


const statisticsData = [
    { amount: '84,059', description: 'Total Sales', icon: <ShoppingCart/>, bgColor: 'bg-primary' },
    { amount: '23', description: 'Total Programs', icon: <ChartBubblePacked/>, bgColor: 'bg-success' },
    { amount: '120,000', description: 'Yearly Target', icon: <TagGroup/>, bgColor: 'bg-warning' },
    { amount: '70%', description: 'Target Achieved', icon: <Bar/>, bgColor: 'bg-teal' }
];

const EstimateStatistics = () => {
    return (
        <>

            {statisticsData.map(({ amount, description, icon, bgColor }, index) => (
                    <div>
                    <div className="card card-body" key={index} style={{borderRadius:'8px'}} >
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="me-3">
                                <h5 className="fs-4">{amount}</h5>
                                <span className="text-muted">{description}</span>
                            </div>
                            <div className={`avatar-text avatar-lg ${bgColor} text-white rounded`}>
                                <i>{icon}</i>
                            </div>
                        </div>
                    </div>
                    </div>
            ))}
        </>
    )
}

export default EstimateStatistics