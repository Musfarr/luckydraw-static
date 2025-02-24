import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';



const DataTable1 = ({ 
  data, 
  isLoading, 
  currentPage, 
  setCurrentPage, 
  PageSize, 
  Paginationdata,
  onCancelCampaign,
  row
}) => {

  const navigate = useNavigate();

  return (
    <div className="userTableWrp">
      <table className="uk-table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>CALL ID</th>
            <th>CUSTOMER INFO</th>
            <th>CITY</th>
            <th>LOCATION</th>
            <th>CALL TIME</th>
            <th>CALL TIME STATUS</th>
            <th>CALL DURATION</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="text-center">
                
                  <div uk-spinner=""></div>
                
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((val, index) => (
              <tr key={val.id}>
                <td>{index + 1 + (currentPage - 1) * PageSize}</td>
                <td className='uk-text-bold'>{val.phone_no}</td>
                <td>{val.name || '-'}</td>
                <td>{val.city || '-'}</td>
                <td>{val.location || '-'}</td>
                <td>{new Date(val.call_time).toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</td>
                <td>
                  <span className={`status ${val.status}`}>
                    {val.status}
                  </span>
                </td>
                <td>{val.duration || '-'}</td>
                <td>
                  {val.status === 'pending' ? (
                    <button
                      className="start-call-btn"
                      onClick={() => navigate(`/survey-calls/${val.id}`)}
                    >
                      view Call
                    </button>
                  ) : (
                   '-'
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data?.length > 0 && (
        <div className=''>
          <div className="paginationcard uk-card uk-card-default uk-margin-remove-top">
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(Paginationdata?.total_records / PageSize)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={(e) => setCurrentPage(e.selected + 1)}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={currentPage - 1}
              disableInitialCallback={true}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable1;
