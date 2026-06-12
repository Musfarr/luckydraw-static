import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../LuckyDraw/LuckyDraw.css";
import { useQuery } from "@tanstack/react-query";
import { apiGetasync } from "../../Utils/apiServices";

const baseUrl = process.env.REACT_APP_BASEURL;
const ITEMS_PER_PAGE = 50;

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: apiData, isLoading, isFetching } = useQuery({
    queryKey: ['participants', currentPage, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
      if (debouncedSearch) params.append('search', debouncedSearch);
      return apiGetasync(`${baseUrl}/api/new-customer-data?${params}`);
    },
    keepPreviousData: true,
    staleTime: 60000,
  });

  const participants = apiData?.data || [];
  const pagination = apiData?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.total || 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="boradcastWrp">
      <div className="newLayout">
              <div className="uk-container uk-container-large" style={{paddingBottom: '50px'}}>

                <div className="lucky-draw-header-actions uk-width-1-1">
              {/* <button className="header-action-btn" onClick={() => navigate(-1)}>
                ← Back
              </button> */}
              <div></div>
              <button
                className="header-action-btn logout"
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
                <div className="uk-grid uk-flex-middle uk-flex-baseline" uk-grid="">
                  <div className="uk-width-1-1 uk-margin-remove-top">
                    <div className="analyticsWhatsappContent analytics-content">
                      <div className="uk-grid " style={{ alignItems: "baseline" }} uk-grid="">

                      <div className="  uk-width-1-1 uk-flex uk-flex-between main-content-card " style={{alignItems: 'baseline', padding: '16px 50px'}}> 
                        <div className="uk-margin-remove">
                          <img className="logo-image" src='assets/images/nfllogo.png' alt="NFL Logo" />
                        </div>
                        <div className="uk-flex uk-flex-center" style={{gap: '20px'}}>
                          {!isLoading && totalCount > 0 && (
                            <button
                              onClick={() => navigate('/luckydraw')}
                              className="draw-button"
                            >
                              🎲 Start Lucky Draw
                            </button>
                          )}
                          {/* <button
                            className="header-action-btn logout"
                            onClick={() => {
                              localStorage.clear();
                              setAuth({ token: null, user: {} });
                              navigate('/');
                            }}
                          >
                            Logout
                          </button> */}
                        </div>
                        <div className="uk-margin-remove">
                          <h2 style={{margin: 0}}>NFL Campaign</h2>
                          
                          {/* <img className="logo-image" src='assets/images/WINTERPLAN.png' alt="Campaign Logo" /> */}
                        </div>
                      </div>                        

                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent " >
                            {/* <div className="uk-margin">
                              <div className="uk-grid " uk-grid="">
                                <div className="uk-width-1-1 main-content-card">
                                  <div className=" uk-padding " style={{paddingTop:0}}>
                                    <div className="tier-buttons-home">
                                      <div className="tier-card-home tier-platinum">
                                        <div className="tier-icon"><img style={{width: '100px'}} src={yaris} alt="Yaris" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">PLATINUM</h4>
                                          <div className="tier-stats">
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-gold">
                                        <div className="tier-icon"><img style={{width: '100px'}} src={gold_1_tola} alt="Gold" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">GOLD</h4>
                                          <div className="tier-stats">
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-silver">
                                        <div className="tier-icon"><img style={{width: '60px'}} src={samsung_a06} alt="Silver" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">SILVER</h4>
                                          <div className="tier-stats">
                                          </div>
                                        </div>
                                      </div>

                                      <div className="tier-card-home tier-bronze">
                                        <div className="tier-icon"><img style={{width: '60px'}} src={daraz_gift_card} alt="Bronze" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">Bronze</h4>
                                          <div className="tier-stats">
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> */}

                            <div className="uk-grid" uk-grid="" uk-height-match="target: >div> div">
                              <div className="uk-card uk-card-default uk-card-body uk-width-1-1 main-content-card">
                                <div className="tier-toolbar">
                                  <div className="tier-search">
                                    <span className="tier-search-icon" aria-hidden="true"></span>
                                    <input
                                      className="uk-input tier-search-input"
                                      type="text"
                                      placeholder="Search by name, invoice, contact or CNIC..."
                                      value={searchQuery}
                                      onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                  </div>
                                  <div className="uk-text-meta" style={{padding: '10px 0'}}>
                                    <span className="summary-badge">
                                      {isLoading ? 'Loading...' : isFetching ? `Showing ${participants.length} of ${totalCount} customers (refreshing...)` : `Showing ${participants.length} of ${totalCount} customers`}
                                      {debouncedSearch && ` · filtered by "${debouncedSearch}"`}
                                    </span>
                                  </div>
                                </div>

                                <div className="uk-padding">
                                  <div className="uk-overflow-auto" style={{maxHeight: '500px'}}>
                                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table">
                                      <thead style={{position: 'sticky', top: 0, background: '#fff', zIndex: 10}}>
                                        <tr>
                                          <th className="table-header-cell">S.No</th>
                                          <th className="table-header-cell">Name</th>
                                          <th className="table-header-cell">Contact Number</th>
                                          <th className="table-header-cell">Outlet Name</th>
                                          <th className="table-header-cell">CNIC</th>
                                          <th className="table-header-cell">City</th>
                                          <th className="table-header-cell">Invoice Number</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {isLoading ? (
                                          <tr><td colSpan="7" className="uk-text-center empty-state">Loading customers...</td></tr>
                                        ) : participants.length === 0 ? (
                                          <tr><td colSpan="7" className="uk-text-center empty-state">No customers found</td></tr>
                                        ) : participants.map((customer, index) => (
                                          <tr key={customer._id || customer.invoice_number} className="table-row">
                                            <td className="table-cell">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                            <td className="table-cell">{customer.Name}</td>
                                            <td className="table-cell">{customer.Contact}</td>
                                            <td className="table-cell">{customer.Store}</td>
                                            <td className="table-cell-code">{customer.Cnic}</td>
                                            <td className="table-cell">{customer.City}</td>
                                            <td className="table-cell">{customer.invoice_number}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                  <div className="uk-padding" style={{paddingTop: 0}}>
                                    <div className="uk-flex uk-flex-between uk-flex-middle">
                                      <div className="uk-text-meta">
                                        Page {currentPage} of {totalPages} · {totalCount} total
                                      </div>
                                      
                                      <ul className="uk-pagination uk-flex-center" style={{margin: 0}}>
                                        <li className={currentPage === 1 ? 'uk-disabled' : ''}>
                                          <a onClick={() => handlePageChange(currentPage - 1)} style={{cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>
                                            <span uk-pagination-previous=""></span>
                                          </a>
                                        </li>
                                        
                                        {getPageNumbers().map((page, idx) => (
                                          page === '...' ? (
                                            <li key={`ellipsis-${idx}`} className="uk-disabled"><span>...</span></li>
                                          ) : (
                                            <li key={page} className={currentPage === page ? 'uk-active' : ''}>
                                              <a onClick={() => handlePageChange(page)} style={{cursor: 'pointer'}}>{page}</a>
                                            </li>
                                          )
                                        ))}
                                        
                                        <li className={currentPage === totalPages ? 'uk-disabled' : ''}>
                                          <a onClick={() => handlePageChange(currentPage + 1)} style={{cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>
                                            <span uk-pagination-next=""></span>
                                          </a>
                                        </li>
                                      </ul>

                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};

export default Home;
