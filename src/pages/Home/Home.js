import React, { useState, useEffect } from "react";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import { apiGetasync } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
// import lifeboylogo from "../../assets/images/gllogo.png";
// import campaignlogo from "../../assets/images/WINTERPLAN.png";
import "../LuckyDraw/LuckyDraw.css";

import yaris from "../../assets/images/yaris2x.png";
import gold_1_tola from "../../assets/images/barr.png";
import samsung_a06 from "../../assets/images/tv.png";
import daraz_gift_card from "../../assets/images/CARD.png";


const baseUrl = process.env.REACT_APP_BASEURL;

const Home = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { distributorData, updateDistributorData } = useDistributorData();
  const [sortConfig, setSortConfig] = useState({ key: "total_amount", dir: "desc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {data: dashboardData , isLoading: dashboardLoading , error: dashboardError} = useQuery({
    queryKey: ['dashboardData', currentPage, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 100,
        ...(debouncedSearch && { search: debouncedSearch })
      });
      return apiGetasync(`${baseUrl}/api/new-customer-data?${params}`);
      // return apiGetasync(`https://unilever.convexinteractive.com/api/new-customer-data?${params}`);
    },
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    keepPreviousData: true,
  })
  
  const data = dashboardData?.data;
  const pagination = dashboardData?.pagination;
  // console.log(data, pagination)
  
  
  // Helpers: sorting and filtering
  const applySort = (list) => {
    if (!sortConfig?.key) return list;
    const key = sortConfig.key;
    const sorted = [...list].sort((a, b) => {
      let va, vb;
      
      // Handle nested properties
      if (key === 'region') {
        va = a.GeoData?.[0]?.Region || '';
        vb = b.GeoData?.[0]?.Region || '';
      } else if (key === 'cust_name') {
        va = a.cust_name;
        vb = b.cust_name;
      } else if (key === 'cust_cd') {
        va = a.cust_cd;
        vb = b.cust_cd;
      } else if (key === 'total_amount') {
        va = a.total_amount || 0;
        vb = b.total_amount || 0;
      } else if (key === 'platinum_entries') {
        va = a.entry_count?.platinum || 0;
        vb = b.entry_count?.platinum || 0;
      } else if (key === 'gold_entries') {
        va = a.entry_count?.gold || 0;
        vb = b.entry_count?.gold || 0;
      } else if (key === 'silver_entries') {
        va = a.entry_count?.silver || 0;
        vb = b.entry_count?.silver || 0;
      } else {
        va = a[key];
        vb = b[key];
      }

      if (typeof va === 'number' && typeof vb === 'number') {
        return va - vb;
      }

      return String(va ?? '').toLowerCase().localeCompare(String(vb ?? '').toLowerCase());
    });
    return sortConfig.dir === 'desc' ? sorted.reverse() : sorted;
  };

  const getRows = () => {
    // Data is already filtered and paginated from server
    return applySort(data || []);
  };


  // Calculate total entry counts from current page data
  const totalCounts = data?.reduce((acc, customer) => {
    acc.platinum += customer.entry_count?.platinum || 0;
    acc.gold += customer.entry_count?.gold || 0;
    acc.silver += customer.entry_count?.silver || 0;
    return acc;
  }, { platinum: 0, gold: 0, silver: 0 }) || { platinum: 0, gold: 0, silver: 0 };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const current = currentPage;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  

  

  return (
    <div className="boradcastWrp">
      { dashboardLoading ? (
        <Spinner />
      ) : dashboardError ? (
        <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
          <div className="uk-card uk-card-default uk-card-body uk-text-center">
            <h3>Error Loading Dashboard</h3>
            <p>{dashboardError?.message || 'Failed to load dashboard data'}</p>
            <button onClick={() => window.location.reload()} className="uk-button uk-button-primary">
              Retry
            </button>
          </div>
        </div>
      ) : (
            <div className="newLayout">
              <div className="uk-container uk-container-large" style={{paddingBottom: '50px'}}>

                <div className="lucky-draw-header-actions uk-width-1-1">
              {/* <button className="header-action-btn" onClick={() => navigate(-1)}>
                ← Back
              </button> */}
              <button
                className="header-action-btn logout"
                onClick={() => {
                  localStorage.clear();
                  setAuth({ token: null, user: {} });
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
                          <img className="logo-image" src='assets/images/gllogo.png' alt="Winter Plan Logo" />
                        </div>
                        <div className="uk-flex uk-flex-center" style={{gap: '20px'}}>
                          {data && data.length > 0 && (
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
                          <img className="logo-image" src='assets/images/WINTERPLAN.png' alt="Campaign Logo" />
                        </div>
                      </div>                        

                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent " >
                            <div className="uk-margin">
                              <div className="uk-grid " uk-grid="">
                                <div className="uk-width-1-1 main-content-card">
                                  <div className=" uk-padding " style={{paddingTop:0}}>
                                    <div className="tier-buttons-home">
                                      <div className="tier-card-home tier-platinum">
                                        <div className="tier-icon"><img style={{width: '100px'}} src={yaris} alt="Yaris" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">PLATINUM</h4>
                                          <div className="tier-stats">
                                            {/* <span className="tier-value">{totalCounts.platinum} Entries</span> */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-gold">
                                        <div className="tier-icon"><img style={{width: '100px'}} src={gold_1_tola} alt="Gold" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">GOLD</h4>
                                          <div className="tier-stats">
                                            {/* <span className="tier-value">{totalCounts.gold} Entries</span> */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-silver">
                                        <div className="tier-icon"><img style={{width: '60px'}} src={samsung_a06} alt="Silver" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">SILVER</h4>
                                          <div className="tier-stats">
                                            {/* <span className="tier-value">{totalCounts.silver} Entries</span> */}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="tier-card-home tier-bronze">
                                        <div className="tier-icon"><img style={{width: '60px'}} src={daraz_gift_card} alt="Bronze" /></div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">Bronze</h4>
                                          <div className="tier-stats">
                                            {/* <span className="tier-value">{totalCounts.silver} Entries</span> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="uk-grid" uk-grid="" uk-height-match="target: >div> div">
                              <div className="uk-card uk-card-default uk-card-body uk-width-1-1 main-content-card">
                                <div className="tier-toolbar">
                                  <div className="tier-search">
                                    <span className="tier-search-icon" aria-hidden="true"></span>
                                    <input
                                      className="uk-input tier-search-input"
                                      type="text"
                                      placeholder="Search by outlet name or code"
                                      value={searchQuery}
                                      onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                  </div>
                                  <div className="uk-text-meta" style={{padding: '10px 0'}}>
                                    <span className="summary-badge">
                                      Showing {data?.length || 0} of {pagination?.total || 0} customers
                                      {debouncedSearch && ` (filtered by "${debouncedSearch}")`}
                                    </span>
                                  </div>
                                </div>

                                <div className="uk-padding">
                                  <div className="uk-overflow-auto" style={{maxHeight: '500px'}}>
                                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table">
                                      <thead style={{position: 'sticky', top: 0, background: '#fff', zIndex: 10}}>
                                        <tr>
                                          <th className="table-header-cell">Region</th>
                                          <th className="table-header-cell">Outlet Name</th>
                                          <th className="table-header-cell">Outlet Code</th>
                                          <th className="table-header-cell">Total Amount</th>
                                          <th className="table-header-cell">Platinum Entries</th>
                                          <th className="table-header-cell">Gold Entries</th>
                                          <th className="table-header-cell">Silver Entries</th>
                                          <th className="table-header-cell">Bronze Entries</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getRows().map((customer, index) => (
                                          <tr key={customer._id || index} className="table-row">
                                            <td className="table-cell">{customer.Region || 'N/A'}</td>
                                            <td className="table-cell">{customer["Customer Name"]}</td>
                                            <td className="table-cell-code">{customer["Customer Code"]}</td>
                                            <td className="table-cell">{customer["Total Amount"]?.toLocaleString() || 0}</td>
                                            <td className="table-cell-entries table-cell-entries-platinum">
                                              <span className="entry-badge entry-badge-platinum">{customer.Platinum || 0}</span>
                                            </td>
                                            <td className="table-cell-entries table-cell-entries-gold">
                                              <span className="entry-badge entry-badge-gold">{customer.Gold || 0}</span>
                                            </td>
                                            <td className="table-cell-entries table-cell-entries-silver">
                                              <span className="entry-badge entry-badge-silver">{customer.Silver || 0}</span>
                                            </td>
                                            <td className="table-cell-entries table-cell-entries-bronze">
                                              <span className="entry-badge entry-badge-bronze">{customer.Bronze || 0}</span>
                                            </td>
                                          </tr>
                                        ))}
                                        {(!data || data.length === 0) && (
                                          <tr>
                                            <td colSpan="7" className="uk-text-center empty-state">No customers found</td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Pagination Controls */}
                                {pagination && pagination.totalPages > 1 && (
                                  <div className="uk-padding" style={{paddingTop: 0}}>
                                    <div className="uk-flex uk-flex-between uk-flex-middle">
                                      <div className="uk-text-meta">
                                        Page {pagination.page} of {pagination.totalPages}
                                      </div>
                                      
                                      <ul className="uk-pagination uk-flex-center" style={{margin: 0}}>
                                        <li className={!pagination.hasPrevPage ? 'uk-disabled' : ''}>
                                          <a onClick={() => handlePageChange(currentPage - 1)} style={{cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'}}>
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
                                        
                                        <li className={!pagination.hasNextPage ? 'uk-disabled' : ''}>
                                          <a onClick={() => handlePageChange(currentPage + 1)} style={{cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'}}>
                                            <span uk-pagination-next=""></span>
                                          </a>
                                        </li>
                                      </ul>

                                      <div className="uk-text-meta">
                                        {/* Jump to page */}
                                        <span style={{marginRight: '8px'}}>Go to:</span>
                                        <input 
                                          type="number" 
                                          min="1" 
                                          max={pagination.totalPages}
                                          value={currentPage}
                                          onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            if (page >= 1 && page <= pagination.totalPages) {
                                              handlePageChange(page);
                                            }
                                          }}
                                          className="uk-input"
                                          style={{width: '70px', display: 'inline-block', padding: '5px', textAlign: 'center'}}
                                        />
                                      </div>
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
      )}
    </div>
  );
};

export default Home;
