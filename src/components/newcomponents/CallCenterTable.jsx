import React from 'react';

const CallCenterTable = ({ data }) => {
  // Select useful keys only
  const usefulKeys = [
    'id',
    'msisdn',
    'response',
    'call_duration',
    'outbound_datetime',
    'retry_done'
  ];

  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get response status class
  const getStatusClass = (response) => {
    switch(response) {
      case 'ANSWER':
        return 'text-success';
      case 'FAILED':
        return 'text-danger';
      case 'BUSY':
        return 'text-warning';
      case 'NOT_ANSWER':
        return 'text-secondary';
      default:
        return '';
    }
  };

  return (
    <div className="mainBox">
      <div className="boxHeading">
        <span>Call Center Campaign Data</span>
      </div>
      <div className="boxCntent">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Response</th>
                <th>Duration (sec)</th>
                <th>Call Time</th>
                <th>Retry</th>
              </tr>
            </thead>
            <tbody>
              {data && data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.msisdn}</td>
                  <td className={getStatusClass(item.response)}>{item.response}</td>
                  <td>{item.call_duration || '-'}</td>
                  <td>{formatDate(item.outbound_datetime)}</td>
                  <td>{item.retry_done === '1' ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CallCenterTable;
