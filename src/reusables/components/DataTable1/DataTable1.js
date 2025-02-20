import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="userTableWrp">
      <table className="uk-table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>CALL ID</th>
            <th>CUSTOMER INFO</th>
            <th>CITY/LOCATION</th>
            <th>CALL TIME</th>
            <th>CALL TIME STATUS</th>
            <th>CALL DURATION</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && data?.length > 0 && (
            <tr>
              <td colSpan={8} style={{ position: 'relative', height: '200px' }}>
                <div className="loading-spinner">
                  <div uk-spinner=""></div>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && data?.length > 0 ? (
            data?.map((val, index) => (
              <tr key={val.call_id}>
                <td>{index + 1 + (currentPage - 1) * PageSize}</td>
                <td>{val.call_id}</td>
                <td>{val.customer_info}</td>
                <td>{val.city_location}</td>
                <td>{val.call_time}</td>
                <td>
                  <span className={`status ${val.call_status.toLowerCase()}`}>
                    {val.call_status}
                  </span>
                </td>
                <td>{val.call_duration || '-'}</td>
                <td>
                  <button
                    className="start-call-btn"
                    onClick={() => onCancelCampaign(val.call_id, index)}
                  >
                    Start Call
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="dataNotFound">
                {data === null ? (
                  <div uk-spinner=""></div>
                ) : (
                  " No data found "
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data?.length > 0 && (
        <div>
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
