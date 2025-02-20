import React from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const DataTable2 = ({ 
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
            <th>ID</th>
            <th>CALL ID</th>
            <th>CUSTOMER INFO</th>
            <th>CITY/LOCATION</th>
            <th>CALL TIME</th>
            <th>CALL TIME STATUS</th>
            <th>CALL DURATION</th>
            <th>PRODUCT YOU PURCHASE ?</th>
            <th>PRODUCT EXPERIENCE</th>
            <th>MESSAGE</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && data?.length > 0 && (
            <tr>
              <td colSpan={10} style={{ position: 'relative', height: '200px' }}>
                <div className="loading-spinner">
                  <div uk-spinner=""></div>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && data?.length > 0 ? (
            data?.map((val, index) => (
              <tr key={val.id}>
                <td>{index + 1 + (currentPage - 1) * PageSize}</td>
                <td className='uk-text-bold'>{val.phone_no}</td>
                <td>{val.name || '-'}</td>
                <td>{val.city_location || '-'}</td>
                <td>{new Date(val.created_at).toLocaleTimeString('en-US', { 
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
                <td>{val.product_you_purchase || '-'}</td>
                <td >{val.product_experience || '-'}</td>
                <td><a>View</a></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="dataNotFound">
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

export default DataTable2;
