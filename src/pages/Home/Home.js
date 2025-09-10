import React, { useState, useEffect } from "react";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import { apiGetasync } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import lifeboylogo from "../../assets/images/lifeboylogo.png";
import campaignlogo from "../../assets/images/campaignlogo.png";
import "../LuckyDraw/LuckyDraw.css";


const Home = () => {
  const navigate = useNavigate();
  const { distributorData, updateDistributorData } = useDistributorData();
  const [sortConfig, setSortConfig] = useState({
    Platinum: { key: "totalGrossAmount", dir: "desc" },
    Gold: { key: "totalGrossAmount", dir: "desc" },
    Silver: { key: "totalGrossAmount", dir: "desc" },
  });

  const {data: dashboardData , isLoading: dashboardLoading , error: dashboardError} = useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => apiGetasync('https://unilever.convexinteractive.com/api/customer-dashboard-data')
  })
  
  const data = dashboardData?.data;
  
  
  // Function to prompt user to upload CSV file



  

  // Helpers: sorting per tier

  const applySort = (list, tier) => {
    const cfg = sortConfig[tier];
    if (!cfg?.key) return list;
    const key = cfg.key;
    const sorted = [...list].sort((a, b) => {
      let va;
      let vb;
      if (key === 'transactions') {
        va = (a.transactions || []).length;
        vb = (b.transactions || []).length;
      } else if (key === 'transactionCount') {
        va = a.transactionCount || 0;
        vb = b.transactionCount || 0;
      } else if (key === 'customerName') {
        va = a.customerName;
        vb = b.customerName;
      } else if (key === 'customerCode') {
        va = a.customerCode;
        vb = b.customerCode;
      } else if (key === 'distributorName') {
        va = a.distributorName;
        vb = b.distributorName;
      } else {
        va = a[key];
        vb = b[key];
      }

      if (typeof va === 'number' && typeof vb === 'number') {
        return va - vb;
      }

      return String(va ?? '').toLowerCase().localeCompare(String(vb ?? '').toLowerCase());
    });
    return cfg.dir === 'desc' ? sorted.reverse() : sorted;
  };

  const getRows = (tier) => {
    const base = data?.[tier]?.data || [];
    return applySort(base, tier);
  };

  const handleSort = (tier, key) => {
    setSortConfig((prev) => {
      const cur = prev[tier] || {};
      const dir = cur.key === key && cur.dir === "asc" ? "desc" : "asc";
      return { ...prev, [tier]: { key, dir } };
    });
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
              <div className="uk-container uk-container-large">
                <div className="uk-grid uk-flex-middle uk-flex-baseline" uk-grid="">
                  <div className="uk-width-1-1 uk-margin-remove-top">
                    <div className="analyticsWhatsappContent analytics-content">
                      <div className="uk-grid " style={{ alignItems: "baseline" }} uk-grid="">

                      <div className="  uk-width-1-1 uk-flex uk-flex-between main-content-card " style={{alignItems: 'baseline', padding: '16px 50px'}}> 
                        <div className="uk-margin-remove">
                          <img className="logo-image" src={lifeboylogo} alt="Lifeboy Logo" />
                        </div>
                        {data && (data.Platinum?.data?.length > 0 || data.Gold?.data?.length > 0 || data.Silver?.data?.length > 0) && (
                          <div className="uk-text-center">
                            <button 
                              onClick={() => navigate('/luckydraw')} 
                              className="draw-button"
                            >
                              🎲 Start Lucky Draw
                            </button>
                          </div>
                        )}
                        <div className="uk-margin-remove">
                          <img className="logo-image" src={campaignlogo} alt="Campaign Logo" />
                        </div>
                      </div>                        

                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent " >
                            <div className="uk-margin">
                              <div className="uk-grid " uk-grid="">
                                <div className="uk-width-1-1 main-content-card">
                                  <div className=" uk-padding " style={{paddingTop:0}}>
                                    {/* <h1 className="uk-card-title">Customer Tier Summary</h1> */}
                                    <div className="tier-buttons-home">
                                      <div className="tier-card-home tier-platinum">
                                        <div className="tier-icon">💎</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">PLATINUM</h4>
                                          {/* <p className="tier-count">({data?.platinum?.length || 0} Customers)</p> */}
                                          <div className="tier-stats">
                                            <span className="tier-value">({data?.Platinum?.count || 0} Customers)</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-gold">
                                        <div className="tier-icon">🥇</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">GOLD</h4>
                                          {/* <p className="tier-count">({data?.gold?.length || 0} Customers)</p> */}
                                          <div className="tier-stats">
                                            <span className="tier-value">({data?.Gold?.count || 0} Customers)</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-silver">
                                        <div className="tier-icon">🥈</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">SILVER</h4>
                                          {/* <p className="tier-count">({data?.silver?.length || 0} Customers)</p> */}
                                          <div className="tier-stats">
                                            <span className="tier-value">({data?.Silver?.count || 0} Customers)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="uk-grid " uk-grid="" uk-height-match="target: >div> div">
                              <div className="uk-card uk-card-default uk-card-body uk-width-1-1 main-content-card">
                                {/* Summary counts toolbar (search removed) */}
                                {/* <div className="uk-flex uk-flex-middle uk-margin-small-bottom uk-grid-small" uk-grid="">
                                  <div className="uk-width-auto uk-text-meta">
                                    <span className="summary-badge">Platinum: {data?.Platinum?.count || 0} | Gold: {data?.Gold?.count || 0} | Silver: {data?.Silver?.count || 0}</span>
                                  </div>
                                </div> */}

                                <ul className="uk-tab tier-tabs uk-flex uk-flex-center uk-flex-middle " uk-tab="connect: #tier-switcher" style={{paddingBottom: '10px'}}>
                                  <li className="uk-active"><a href="#" className="platinum tier-tab-platinum">💎 Platinum Tier (>20 Lac PKR)</a></li>
                                  <li><a href="#" className="gold tier-tab-gold">🥇 Gold Tier (15 - 20 Lac PKR)</a></li>
                                  <li><a href="#" className="silver tier-tab-silver">🥈 Silver Tier (10 - 15 Lac PKR)</a></li>
                                </ul>

                                <ul id="tier-switcher" className="uk-switcher uk-margin">
                                  {/* Platinum Tier Table */}
                                  <li className="uk-active uk-padding" >
                                    <div className="uk-overflow-auto" style={{maxHeight: '400px'}}>
                                      <table className="  uk-table uk-table-small uk-table-divider uk-table-hover tier-table" >
                                        <thead className="tier-header-platinum">
                                          <tr>
                                            <th className={`sortable  table-header-cell ${sortConfig.Platinum.key==='Region' ? 'sorted-'+sortConfig.Platinum.dir : ''}`} onClick={() => handleSort('Platinum','Region')}> Region</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Platinum.key==='customerName' ? 'sorted-'+sortConfig.Platinum.dir : ''}`} onClick={() => handleSort('Platinum','customerName')}> Outlet Name</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Platinum.key==='customerCode' ? 'sorted-'+sortConfig.Platinum.dir : ''}`} onClick={() => handleSort('Platinum','customerCode')}> Outlet Code</th>
                                           
                                            <th className="table-header-cell">💎 Platinum Entries</th>
                                            <th className="table-header-cell">🥇 Gold Entries</th>
                                            <th className="table-header-cell">🥈 Silver Entries</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('Platinum').map((customer, index) => (
                                            <tr key={index} className="table-row table-row-platinum">
                                              <td className="table-cell">{customer.Region}</td>
                                              <td className="table-cell">{customer.customerName}</td>
                                              <td className="table-cell-code">{customer.customerCode}</td>
                                              <td className="table-cell-entries table-cell-entries-platinum">
                                                <span className="entry-badge entry-badge-platinum">{customer.entries?.platinumEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-gold">
                                                <span className="entry-badge entry-badge-gold">{customer.entries?.goldEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-silver">
                                                <span className="entry-badge entry-badge-silver">{customer.entries?.silverEntries || 0}</span>
                                              </td>
                                            </tr>
                                          ))}
                                          {(!data?.Platinum?.data || data.Platinum.data.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center empty-state">💎 No platinum tier customers found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                  
                                  {/* Gold Tier Table */}
                                  <li className="uk-padding">
                                    <div className="uk-overflow-auto" style={{maxHeight: '400px'}}>
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table">
                                        <thead className="tier-header-gold">
                                          <tr>
                                            <th className={`sortable table-header-cell ${sortConfig.Gold.key==='Region' ? 'sorted-'+sortConfig.Gold.dir : ''}`} onClick={() => handleSort('Gold','Region')}>📍 Region</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Gold.key==='customerName' ? 'sorted-'+sortConfig.Gold.dir : ''}`} onClick={() => handleSort('Gold','customerName')}>🏪 Outlet Name</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Gold.key==='customerCode' ? 'sorted-'+sortConfig.Gold.dir : ''}`} onClick={() => handleSort('Gold','customerCode')}>🏷️ Outlet Code</th>
                                            <th className="table-header-cell">💎 Platinum Entries</th>
                                            <th className="table-header-cell">🥇 Gold Entries</th>
                                            <th className="table-header-cell">🥈 Silver Entries</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('Gold').map((customer, index) => (
                                            <tr key={index} className="table-row table-row-gold">
                                              <td style={{
                                                padding: '1rem',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                              }}>{customer.Region}</td>
                                              <td style={{
                                                padding: '1rem',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                              }}>{customer.customerName}</td>
                                              <td style={{
                                                padding: '1rem',
                                                fontWeight: '500',
                                                color: '#7f8c8d',
                                                fontSize: '0.9rem',
                                                fontFamily: 'monospace'
                                              }}>{customer.customerCode}</td>
                                             
                                              <td className="table-cell-entries table-cell-entries-platinum">
                                                <span className="entry-badge entry-badge-platinum">{customer.entries?.platinumEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-gold">
                                                <span className="entry-badge entry-badge-gold">{customer.entries?.goldEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-silver">
                                                <span className="entry-badge entry-badge-silver">{customer.entries?.silverEntries || 0}</span>
                                              </td>
                                            </tr>
                                          ))}
                                          {(!data?.Gold?.data || data.Gold.data.length === 0) && (
                                            <tr>
                                              <td colSpan="7" className="uk-text-center empty-state">🥇 No gold tier customers found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                  
                                  {/* Silver Tier Table */}
                                  <li className="uk-padding">
                                    <div className="uk-overflow-auto" style={{maxHeight: '400px'}}>
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table">
                                        <thead className="tier-header-silver">
                                          <tr>
                                            <th className={`sortable table-header-cell ${sortConfig.Silver.key==='Region' ? 'sorted-'+sortConfig.Silver.dir : ''}`} onClick={() => handleSort('Silver','Region')}>📍 Region</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Silver.key==='customerName' ? 'sorted-'+sortConfig.Silver.dir : ''}`} onClick={() => handleSort('Silver','customerName')}>🏪 Outlet Name</th>
                                            <th className={`sortable table-header-cell ${sortConfig.Silver.key==='customerCode' ? 'sorted-'+sortConfig.Silver.dir : ''}`} onClick={() => handleSort('Silver','customerCode')}>🏷️ Outlet Code</th>
                                            <th className="table-header-cell">💎 Platinum Entries</th>
                                            <th className="table-header-cell">🥇 Gold Entries</th>
                                            <th className="table-header-cell">🥈 Silver Entries</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('Silver').map((customer, index) => (
                                            <tr key={index} className="table-row table-row-silver">
                                              <td className="table-cell">{customer.Region}</td>
                                              <td className="table-cell">{customer.customerName}</td>
                                              <td className="table-cell-code">{customer.customerCode}</td>
                                              <td className="table-cell-entries table-cell-entries-platinum">
                                                <span className="entry-badge entry-badge-platinum">{customer.entries?.platinumEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-gold">
                                                <span className="entry-badge entry-badge-gold">{customer.entries?.goldEntries || 0}</span>
                                              </td>
                                              <td className="table-cell-entries table-cell-entries-silver">
                                                <span className="entry-badge entry-badge-silver">{customer.entries?.silverEntries || 0}</span>
                                              </td>
                                            </tr>
                                          ))}
                                          {(!data?.Silver?.data || data.Silver.data.length === 0) && (
                                            <tr>
                                              <td colSpan="7" className="uk-text-center empty-state">🥈 No silver tier customers found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              

                              

                              {/* <div className="uk-width-1-3" >
                                <LeadsOverviewChart chartHeight={340} />
                              </div> */}
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
