import React, { useState, useEffect } from "react";
import PieChart from "../../components/Graph/PieChart";
import { useAuth } from "../../Context/AuthProvider";
import { apiGet } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";
import SiteOverviewChart from "../../components/newcomponents/graphcards/SiteOverviewChart";
import LeadsOverviewChart from "../../components/newcomponents/circlechart/LeadsOverviewChart";
import BarChart from "../../components/newcomponents/barchart/InquiryTrackingChart";
import LeadsStatusTwo from "../../components/newcomponents/LeadsStatusTwo";
import ScheduleTwo from "../../components/newcomponents/ScheduleTwo";
import { leadsStatusData } from '../../Utils/fackData/leadsStatusData';
import Swal from 'sweetalert2';
import Papa from 'papaparse';

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState(null);
  const [dataUploaded, setDataUploaded] = useState(false);
  const colors = ["#14B8A6", "#FACC15", "#F59E0B"];
  const [sortConfig, setSortConfig] = useState({
    gold: { key: "totalGrossAmount", dir: "desc" },
    silver: { key: "totalGrossAmount", dir: "desc" },
    bronze: { key: "totalGrossAmount", dir: "desc" },
  });
  
  // const fetchDashboard = () => {
  //   setIsLoading(true);
  //   const onSuccess = (response) => {
  //     setData(response.data);
  //     setIsLoading(false);
      
  //     // Check if data is already uploaded
  //     if (!dataUploaded) {
  //       // Prompt for file upload before showing dashboard
  //       promptFileUpload();
  //     }
  //   };

  //   const onFailure = (error) => {
  //     console.error("Failed to fetch dashboard:", error);
  //     setIsLoading(false);
      
  //     // Still prompt for file upload even if dashboard fails
  //     if (!dataUploaded) {
  //       promptFileUpload();
  //     }
  //   };

  //   apiGet('/admin/dashboard', onSuccess, onFailure);
  // };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      
    }, 2000);
  }, []);



  useEffect(() => {
    console.log(dataUploaded);
  }, [dataUploaded]);
  
  // Function to prompt user to upload CSV file
  const promptFileUpload = () => {
    Swal.fire({
      title: 'Upload CSV File',
      text: 'Please upload your CSV file to view the dashboard',
      icon: 'info',
      html: `
        <div class="custom-file-upload">
          <input type="file" id="csv-file" accept=".csv" style="display: none;" />
          <label for="csv-file" class="uk-button uk-button-primary">
            Choose File
          </label>
          <span id="file-name" style="margin-left: 10px;">No file selected</span>
        </div>
      `,
      allowOutsideClick: dataUploaded, // Prevent closing if first upload
      showCancelButton: dataUploaded, // Only show cancel if data already uploaded
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const fileInput = document.getElementById('csv-file');
        const fileNameSpan = document.getElementById('file-name');
        
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            fileNameSpan.textContent = e.target.files[0].name;
          } else {
            fileNameSpan.textContent = 'No file selected';
          }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('csv-file');
        if (!fileInput.files.length) {
          Swal.showValidationMessage('Please select a file');
          return false;
        }
        return fileInput.files[0];
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;
        convertCsvToJson(file);
      } else if (!dataUploaded && result.dismiss) {
        // If first time and dismissed, prompt again
        promptFileUpload();
      }
    });
  };


  const transformData = (data) => {
    // Step 1: Consolidate gross amounts by customer name
    const customerMap = {};
    
    data.forEach(item => {
      const customerName = item.CUST_NAME || item.CustomerName || item.AnchorName || 'Unknown';
      const grossAmount = parseFloat(item.GROSS_AMT || item.GrossAmount || item.Amount || '0');
      
      if (!customerMap[customerName]) {
        customerMap[customerName] = {
          customerName,
          totalGrossAmount: 0,
          transactions: [],
          // Keep other customer details from first occurrence
          region: item.REGION || item.Region || '',
          district: item.DIST_NAME || item.DistrictName || '',
          customerCode: item.CUST_CD || item.CustomerCode || '',
          city: item.City || item.AnchorCity || ''
        };
      }
      
      // Add to total gross amount
      customerMap[customerName].totalGrossAmount += grossAmount;
      
      // Store transaction details
      customerMap[customerName].transactions.push({
        sku: item.SKU || '',
        skuDesc: item.SKU_DESC || '',
        format: item.Format || '',
        grossAmount: grossAmount,
        deliveryDate: item.DELIVERY_DT || '',
        invoiceNo: item.INV_NO || ''
      });
    });
    
    // Convert map to array
    const consolidatedCustomers = Object.values(customerMap);
    
    // Step 2: Categorize customers into gold, silver, and bronze tiers
    const gold = [];
    const silver = [];
    const bronze = [];
    
    consolidatedCustomers.forEach(customer => {
      if (customer.totalGrossAmount > 10000) {
        gold.push(customer);
      } else if (customer.totalGrossAmount > 5000) {
        silver.push(customer);
      } else {
        bronze.push(customer);
      }
    });
    
    // Sort each tier by total gross amount (descending)
    gold.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    silver.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    bronze.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    
    // Set data for the tables
    setData({
      gold,
      silver,
      bronze,
      allCustomers: consolidatedCustomers
    });
    
    console.log('Categorized data:', { gold, silver, bronze });
  };

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
    const base = data?.[tier] || [];
    return applySort(base, tier);
  };

  const handleSort = (tier, key) => {
    setSortConfig((prev) => {
      const cur = prev[tier] || {};
      const dir = cur.key === key && cur.dir === "asc" ? "desc" : "asc";
      return { ...prev, [tier]: { key, dir } };
    });
  };

  // Function to convert CSV to JSON using PapaParser
  const convertCsvToJson = (file) => {
    Papa.parse(file, {
      header: true, // First row as headers
      skipEmptyLines: true,
      complete: (results) => {
        // Limit to 200 rows if there are more
        const limitedData = results.data.length > 200 
          ? results.data.slice(0, 200) 
          : results.data;
        
        setCsvData(limitedData);
        setDataUploaded(true);

        transformData(limitedData);
        console.log('Converted CSV to JSON (limited to 200 rows):', limitedData);
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          // text: `Successfully loaded ${file.name} (${limitedData.length} rows)`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to parse CSV file: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          // If error and no data uploaded yet, prompt again
          if (!dataUploaded) {
            promptFileUpload();
          }
        });
      }
    });
  };

  

  return (
    <div className="boradcastWrp">
      {isLoading ? (
        <Spinner />
      ) : !dataUploaded ? (
        <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
          <div className="uk-card uk-card-default uk-card-body uk-text-center">
            <h3>Please Upload CSV Data</h3>
            <p>You need to upload a CSV file to view the dashboard</p>
            <button onClick={promptFileUpload} className=" mx-auto container-btn-file">
  <svg
    fill="#fff"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 50 50"
  >
    <path
      d="M28.8125 .03125L.8125 5.34375C.339844 
    5.433594 0 5.863281 0 6.34375L0 43.65625C0 
    44.136719 .339844 44.566406 .8125 44.65625L28.8125 
    49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
    50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
    30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
    .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
    6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
    29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
    43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
    13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
    21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
    22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
    15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
    28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
    27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
    14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
    20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
    ></path>
  </svg>
  Upload File
  {/* <input class="file" name="text" type="file" /> */}
</button>
          </div>
        </div>
      ) : (
          <div className="broadcastContentWrp">
            <div className="overviewContent">
              <div className="uk-container uk-container-xlarge">
                <div className="uk-grid uk-flex-middle" uk-grid="">
                  <div className="uk-width-1-1 uk-margin-remove-top">
                    <div
                      className="analyticsWhatsappContent"
                      style={{ marginTop: "16px" }}
                    >
                      <div className="uk-grid uk-flex-middle" uk-grid="">
                        <div className="uk-width-1-2 uk-margin-remove">
                          <h2 className="uk-margin-remove">{auth?.user?.name}</h2>
                          <p className="uk-margin-remove">
                            Customer Stats 
                          </p>
                        </div>
                        <div className="uk-width-1-2 d-flex justify-content-end uk-margin-remove uk-text-right">
                        <button onClick={promptFileUpload} className=" container-btn-file">
                            <svg
                              fill="#fff"
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 40 40"
                            >
                              <path
                                d="M28.8125 .03125L.8125 5.34375C.339844 
                              5.433594 0 5.863281 0 6.34375L0 43.65625C0 
                              44.136719 .339844 44.566406 .8125 44.65625L28.8125 
                              49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
                              50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
                              30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
                              .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
                              6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
                              29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
                              43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
                              13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
                              21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
                              22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
                              15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
                              28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
                              27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
                              14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
                              20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
                              ></path>
                            </svg>
                            Change File
                            {/* <input class="file" name="text" type="file" /> */}
                          </button>
                        </div>

                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent">
                            <div className="uk-margin">
                              <div className="uk-grid uk-grid-small" uk-grid="">
                                <div className="uk-width-1-1">
                                  <div className="uk-card uk-card-default uk-card-body">
                                    <h3 className="uk-card-title">Customer Tier Summary</h3>
                                    <div className="uk-grid uk-grid-small" uk-grid="">
                                      <div className="uk-width-1-3">
                                        <div className="uk-card uk-card-default uk-card-body tier-card tier-gold">
                                          <h4>Gold Tier</h4>
                                          <p>Customers: {data?.gold?.length || 0}</p>
                                          <p>Total Value: {data?.gold?.reduce((sum, customer) => sum + customer.totalGrossAmount, 0).toLocaleString()} PKR</p>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-3">
                                        <div className="uk-card uk-card-default uk-card-body tier-card tier-silver">
                                          <h4>Silver Tier</h4>
                                          <p>Customers: {data?.silver?.length || 0}</p>
                                          <p>Total Value: {data?.silver?.reduce((sum, customer) => sum + customer.totalGrossAmount, 0).toLocaleString()} PKR</p>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-3">
                                        <div className="uk-card uk-card-default uk-card-body tier-card tier-bronze">
                                          <h4>Bronze Tier</h4>
                                          <p>Customers: {data?.bronze?.length || 0}</p>
                                          <p>Total Value: {data?.bronze?.reduce((sum, customer) => sum + customer.totalGrossAmount, 0).toLocaleString()} PKR</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="uk-grid uk-grid-small"  uk-grid="" uk-height-match="target: >div> div " >
                              <div className= " uk-card uk-card-default uk-card-body uk-width-1-1" style={{marginLeft: '15px'}}>
                                {/* Summary counts toolbar (search removed) */}
                                <div className="uk-flex  uk-flex-middle uk-margin-small-bottom uk-grid-small" uk-grid="">
                                  <div className="uk-width-auto uk-text-meta">
                                    <span>Gold: {data?.gold?.length || 0} | Silver: {data?.silver?.length || 0} | Bronze: {data?.bronze?.length || 0}</span>
                                  </div>
                                </div>

                                <ul className="uk-tab tier-tabs" uk-tab="connect: #tier-switcher">
                                  <li className="uk-active"><a href="#" className="gold">Gold Tier ({'>'}10,000 PKR)</a></li>
                                  <li><a href="#" className="silver">Silver Tier ({'>'}5,000 PKR)</a></li>
                                  <li><a href="#" className="bronze">Bronze Tier ({'<'}5,000 PKR)</a></li>
                                </ul>

                                <ul id="tier-switcher" className="uk-switcher uk-margin">
                                  {/* Gold Tier Table */}
                                  <li className="uk-active">
                                    <div className="uk-overflow-auto">
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table tier-gold">
                                        <thead className="tier-header tier-gold">
                                          <tr>
                                            <th className={`sortable ${sortConfig.gold.key==='customerName' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','customerName')}>Customer Name</th>
                                            <th className={`sortable ${sortConfig.gold.key==='region' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.gold.key==='district' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','district')}>Distributor</th>
                                            <th className={`sortable ${sortConfig.gold.key==='customerCode' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','customerCode')}>Customer Code</th>
                                            <th className={`sortable ${sortConfig.gold.key==='totalGrossAmount' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.gold.key==='transactions' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('gold').map((customer, index) => (
                                            <tr key={index}>
                                              <td>{customer.customerName}</td>
                                              <td>{customer.region}</td>
                                              <td>{customer.district}</td>
                                              <td>{customer.customerCode}</td>
                                              <td>{customer.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={customer.transactions.length > 1 ? 'emphasis' : ''}>{customer.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.gold || data.gold.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No gold tier customers found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                  
                                  {/* Silver Tier Table */}
                                  <li>
                                    <div className="uk-overflow-auto">
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table tier-silver">
                                        <thead className="tier-header tier-silver">
                                          <tr>
                                            <th className={`sortable ${sortConfig.silver.key==='customerName' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','customerName')}>Customer Name</th>
                                            <th className={`sortable ${sortConfig.silver.key==='region' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.silver.key==='district' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','district')}>Distributor</th>
                                            <th className={`sortable ${sortConfig.silver.key==='customerCode' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','customerCode')}>Customer Code</th>
                                            <th className={`sortable ${sortConfig.silver.key==='totalGrossAmount' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.silver.key==='transactions' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('silver').map((customer, index) => (
                                            <tr key={index}>
                                              <td>{customer.customerName}</td>
                                              <td>{customer.region}</td>
                                              <td>{customer.district}</td>
                                              <td>{customer.customerCode}</td>
                                              <td>{customer.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={customer.transactions.length > 1 ? 'emphasis' : ''}>{customer.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.silver || data.silver.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No silver tier customers found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                  
                                  {/* Bronze Tier Table */}
                                  <li>
                                    <div className="uk-overflow-auto">
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table tier-bronze">
                                        <thead className="tier-header tier-bronze">
                                          <tr>
                                            <th className={`sortable ${sortConfig.bronze.key==='customerName' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','customerName')}>Customer Name</th>
                                            <th className={`sortable ${sortConfig.bronze.key==='region' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.bronze.key==='district' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','district')}>Distributor</th>
                                            <th className={`sortable ${sortConfig.bronze.key==='customerCode' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','customerCode')}>Customer Code</th>
                                            <th className={`sortable ${sortConfig.bronze.key==='totalGrossAmount' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.bronze.key==='transactions' ? 'sorted-'+sortConfig.bronze.dir : ''}`} onClick={() => handleSort('bronze','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('bronze').map((customer, index) => (
                                            <tr key={index}>
                                              <td>{customer.customerName}</td>
                                              <td>{customer.region}</td>
                                              <td>{customer.district}</td>
                                              <td>{customer.customerCode}</td>
                                              <td>{customer.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={customer.transactions.length > 1 ? 'emphasis' : ''}>{customer.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.bronze || data.bronze.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No bronze tier customers found</td>
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
          </div>
      )}
    </div>
  );
};

export default Home;
