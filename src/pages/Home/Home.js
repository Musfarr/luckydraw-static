import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../LuckyDraw/LuckyDraw.css";

import yaris from "../../assets/images/yaris2x.png";
import gold_1_tola from "../../assets/images/barr.png";
import samsung_a06 from "../../assets/images/tv.png";
import daraz_gift_card from "../../assets/images/CARD.png";

// Static data with entries
const STATIC_DATA = [
  { name: "Muhammad Hanif", contact_number: "03182342620", outlet_name: "Imtiaz", cnic: "4230140019925", city: "Karachi", invoice_number: "00029 2.030526.1.103.S" },
  { name: "Ahmed Khan", contact_number: "03001234567", outlet_name: "Metro", cnic: "4230140019926", city: "Lahore", invoice_number: "00030 2.030526.1.104.S" },
  { name: "Fatima Ali", contact_number: "03211234567", outlet_name: "Carrefour", cnic: "4230140019927", city: "Islamabad", invoice_number: "00031 2.030526.1.105.S" },
  { name: "Bilal Hussain", contact_number: "03331234567", outlet_name: "Al-Fatah", cnic: "4230140019928", city: "Rawalpindi", invoice_number: "00032 2.030526.1.106.S" },
  { name: "Sara Malik", contact_number: "03451234567", outlet_name: "Hyperstar", cnic: "4230140019929", city: "Faisalabad", invoice_number: "00033 2.030526.1.107.S" },
  { name: "Usman Tariq", contact_number: "03121234567", outlet_name: "CSD", cnic: "4230140019930", city: "Multan", invoice_number: "00034 2.030526.1.108.S" },
  { name: "Ayesha Siddiqui", contact_number: "03031234567", outlet_name: "Utility", cnic: "4230140019931", city: "Peshawar", invoice_number: "00035 2.030526.1.109.S" },
  { name: "Hamza Sheikh", contact_number: "03231234567", outlet_name: "Madina", cnic: "4230140019932", city: "Quetta", invoice_number: "00036 2.030526.1.110.S" },
  { name: "Zainab Bukhari", contact_number: "03341234567", outlet_name: "Save Mart", cnic: "4230140019933", city: "Sialkot", invoice_number: "00037 2.030526.1.111.S" },
  { name: "Taimoor Akhtar", contact_number: "03441234567", outlet_name: "Green Store", cnic: "4230140019934", city: "Gujranwala", invoice_number: "00038 2.030526.1.112.S" },
  { name: "Hassan Ali", contact_number: "03551234567", outlet_name: "Alfatah", cnic: "4230140019935", city: "Multan", invoice_number: "00039 2.030526.1.113.S" },
  { name: "Nida Khan", contact_number: "03661234567", outlet_name: "Imtiaz", cnic: "4230140019936", city: "Karachi", invoice_number: "00040 2.030526.1.114.S" },
  { name: "Rashid Ahmed", contact_number: "03771234567", outlet_name: "Utility", cnic: "4230140019937", city: "Lahore", invoice_number: "00041 2.030526.1.115.S" },
  { name: "Amina Malik", contact_number: "03881234567", outlet_name: "Carrefour", cnic: "4230140019938", city: "Islamabad", invoice_number: "00042 2.030526.1.116.S" },
  { name: "Karim Hassan", contact_number: "03991234567", outlet_name: "Metro", cnic: "4230140019939", city: "Rawalpindi", invoice_number: "00043 2.030526.1.117.S" },
  { name: "Leila Siddiqui", contact_number: "03001111111", outlet_name: "Hyperstar", cnic: "4230140019940", city: "Faisalabad", invoice_number: "00044 2.030526.1.118.S" },
  { name: "Farhan Khan", contact_number: "03112222222", outlet_name: "CSD", cnic: "4230140019941", city: "Peshawar", invoice_number: "00045 2.030526.1.119.S" },
  { name: "Saira Ahmed", contact_number: "03223333333", outlet_name: "Save Mart", cnic: "4230140019942", city: "Quetta", invoice_number: "00046 2.030526.1.120.S" },
  { name: "Imran Hussain", contact_number: "03334444444", outlet_name: "Green Store", cnic: "4230140019943", city: "Sialkot", invoice_number: "00047 2.030526.1.121.S" },
  { name: "Hina Malik", contact_number: "03445555555", outlet_name: "Alfatah", cnic: "4230140019944", city: "Gujranwala", invoice_number: "00048 2.030526.1.122.S" },
  { name: "Tariq Khan", contact_number: "03556666666", outlet_name: "Imtiaz", cnic: "4230140019945", city: "Karachi", invoice_number: "00049 2.030526.1.123.S" },
  { name: "Zara Ahmed", contact_number: "03667777777", outlet_name: "Metro", cnic: "4230140019946", city: "Lahore", invoice_number: "00050 2.030526.1.124.S" },
  { name: "Amir Hassan", contact_number: "03778888888", outlet_name: "Carrefour", cnic: "4230140019947", city: "Islamabad", invoice_number: "00051 2.030526.1.125.S" },
  { name: "Rania Khan", contact_number: "03889999999", outlet_name: "Utility", cnic: "4230140019948", city: "Rawalpindi", invoice_number: "00052 2.030526.1.126.S" },
  { name: "Salim Ahmed", contact_number: "03990000000", outlet_name: "Hyperstar", cnic: "4230140019949", city: "Faisalabad", invoice_number: "00053 2.030526.1.127.S" },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return STATIC_DATA;
    const query = searchQuery.toLowerCase();
    return STATIC_DATA.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.outlet_name.toLowerCase().includes(query) ||
      item.contact_number.includes(query) ||
      item.cnic.includes(query)
    );
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Check if invoice number already won
  const isInvoiceWinner = (invoiceNumber) => {
    // This would check against winners data from LuckyDraw
    // For now, returning false as placeholder
    return false;
  };

  // Pagination handlers
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
                          {STATIC_DATA && STATIC_DATA.length > 0 && (
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
                                      placeholder="Search by outlet name or code"
                                      value={searchQuery}
                                      onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                  </div>
                                  <div className="uk-text-meta" style={{padding: '10px 0'}}>
                                    <span className="summary-badge">
                                      Showing {paginatedData.length} of {filteredData.length} customers
                                      {searchQuery && ` (filtered by "${searchQuery}")`}
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
                                        {paginatedData.map((customer, index) => (
                                          <tr key={customer.invoice_number} className="table-row" style={{opacity: isInvoiceWinner(customer.invoice_number) ? 0.5 : 1}}>
                                            <td className="table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="table-cell">{customer.name}</td>
                                            <td className="table-cell">{customer.contact_number}</td>
                                            <td className="table-cell">{customer.outlet_name}</td>
                                            <td className="table-cell-code">{customer.cnic}</td>
                                            <td className="table-cell">{customer.city}</td>
                                            <td className="table-cell">{customer.invoice_number}</td>
                                          </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                          <tr>
                                            <td colSpan="7" className="uk-text-center empty-state">No customers found</td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                  <div className="uk-padding" style={{paddingTop: 0}}>
                                    <div className="uk-flex uk-flex-between uk-flex-middle">
                                      <div className="uk-text-meta">
                                        Page {currentPage} of {totalPages}
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
