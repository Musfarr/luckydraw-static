import React from 'react';
import { ArrowUpRight, ArrowDownRight } from '@carbon/icons-react';

const CallCenterStats = ({ data }) => {
  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      totalCalls: data.length,
      answered: 0,
      failed: 0,
      busy: 0,
      retries: 0,
      avgDuration: 0
    };

    let totalDuration = 0;
    let callsWithDuration = 0;

    data.forEach(call => {
      // Count by response type
      if (call.response === 'ANSWER') {
        stats.answered++;
        if (call.call_duration) {
          totalDuration += parseInt(call.call_duration);
          callsWithDuration++;
        }
      } else if (call.response === 'FAILED') {
        stats.failed++;
      } else if (call.response === 'BUSY') {
        stats.busy++;
      }

      // Count retries
      if (call.retry_done === '1') {
        stats.retries++;
      }
    });

    // Calculate average call duration
    stats.avgDuration = callsWithDuration > 0 ? Math.round(totalDuration / callsWithDuration) : 0;

    return stats;
  };

  const stats = calculateStats();

  // Card data
  const cards = [
    {
      title: 'Total Calls',
      value: stats.totalCalls,
      trend: 'up',
      percent: '12%',
      color: 'primary'
    },
    {
      title: 'Answered Calls',
      value: stats.answered,
      trend: 'up',
      percent: '8%',
      color: 'success'
    },
    {
      title: 'Failed Calls',
      value: stats.failed,
      trend: 'down',
      percent: '3%',
      color: 'danger'
    },
    {
      title: 'Busy Numbers',
      value: stats.busy,
      trend: 'up',
      percent: '5%',
      color: 'warning'
    },
    {
      title: 'Avg. Duration',
      value: `${stats.avgDuration}s`,
      trend: 'up',
      percent: '2%',
      color: 'info'
    }
  ];

  return (
    <div className="uk-grid uk-grid-medium" uk-grid="">
      {cards.map((card, index) => (
        <div key={index} className="uk-width-1-5@m uk-width-1-2@s">
          <div className={`stat-card stat-card-${card.color}`}>
            <div className="stat-card-content">
              <h3 className="stat-card-title fs-6">{card.title}</h3>
              <p className="stat-card-value">{card.value}</p>
              <div className="stat-card-trend">
                <span className={`trend-${card.trend}`}>
                  {card.trend === 'up' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {card.percent}
                </span>
                <span className="trend-period">vs last week</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallCenterStats;
