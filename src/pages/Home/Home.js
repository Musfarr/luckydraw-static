import React, { useState, useEffect } from "react";
import PieChart from "../../components/Graph/PieChart";
import { useAuth } from "../../Context/AuthProvider";
import { useDistributorData } from "../../Context/DistributorDataProvider";
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
  const { distributorData, updateDistributorData } = useDistributorData();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState(null);
  const [dataUploaded, setDataUploaded] = useState(false);
  const colors = ["#14B8A6", "#FACC15", "#F59E0B"];
  const [sortConfig, setSortConfig] = useState({
    platinum: { key: "totalGrossAmount", dir: "desc" },
    gold: { key: "totalGrossAmount", dir: "desc" },
    silver: { key: "totalGrossAmount", dir: "desc" },
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
    // Step 1: Consolidate gross amounts by distributor
    const distributorMap = {};
    
    data.forEach(item => {
      const distributorName = item.DIST_NAME || item.DistrictName || item.district || 'Unknown Distributor';
      const grossAmount = parseFloat(item.GROSS_AMT || item.GrossAmount || item.Amount || '0');
      const customerName = item.CUST_NAME || item.CustomerName || item.AnchorName || 'Unknown Customer';
      
      if (!distributorMap[distributorName]) {
        distributorMap[distributorName] = {
          distributorName,
          totalGrossAmount: 0,
          customerCount: 0,
          customers: new Set(),
          transactions: [],
          // Keep other details from first occurrence
          region: item.REGION || item.Region || '',
          distributorCode: item.DIST_CD || item.DistributorCode || ''
        };
      }
      
      // Add to total gross amount
      distributorMap[distributorName].totalGrossAmount += grossAmount;
      
      // Track unique customers
      distributorMap[distributorName].customers.add(customerName);
      
      // Store transaction details
      distributorMap[distributorName].transactions.push({
        customerName: customerName,
        sku: item.SKU || '',
        skuDesc: item.SKU_DESC || '',
        format: item.Format || '',
        grossAmount: grossAmount,
        deliveryDate: item.DELIVERY_DT || '',
        invoiceNo: item.INV_NO || ''
      });
    });
    
    // Convert map to array and calculate customer counts
    const consolidatedDistributors = Object.values(distributorMap).map(distributor => ({
      ...distributor,
      customerCount: distributor.customers.size,
      customers: Array.from(distributor.customers) // Convert Set to Array for display
    }));
    
    // Step 2: Categorize distributors into platinum, gold, and silver tiers
    const platinum = [];
    const gold = [];
    const silver = [];
    
    // Categorize based on thresholds in Crore PKR (1 Crore = 10,000,000 PKR)
    consolidatedDistributors.forEach(distributor => {
      if (distributor.totalGrossAmount > 20000000) { // > 2 Crore PKR
        platinum.push(distributor);
      } else if (distributor.totalGrossAmount > 15000000 && distributor.totalGrossAmount <= 20000000) { // 1.5 to 2 Crore PKR
        gold.push(distributor);
      } else if (distributor.totalGrossAmount >= 10000000 && distributor.totalGrossAmount <= 15000000) { // 1 to 1.5 Crore PKR
        silver.push(distributor);
      }
    });
    
    // Sort each tier by total gross amount (descending)
    platinum.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    gold.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    silver.sort((a, b) => b.totalGrossAmount - a.totalGrossAmount);
    
    // Set data for the tables
    const tierData = {
      platinum,
      gold,
      silver,
      allDistributors: consolidatedDistributors
    };
    
    setData(tierData);
    
    // Update global context with distributor data
    updateDistributorData({
      ...tierData,
      csvData: data,
      dataUploaded: true
    });
    
    console.log('Categorized distributors:', { platinum, gold, silver });
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
      } else if (key === 'customerCount') {
        va = a.customerCount || 0;
        vb = b.customerCount || 0;
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
    // Show loading spinner
    Swal.fire({
      title: 'Processing Data...',
      html: `
        <div style="text-align: center;">
          
          <p style="margin-top: 15px; color: #64748b;">Parsing and transforming your CSV data</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    Papa.parse(file, {
      header: true, // First row as headers
      skipEmptyLines: true,
      worker: true, // Use web worker for better performance with large files
      complete: (results) => {
        // Remove limit - handle all rows for large datasets
        const processedData = results.data.filter(row => {
          // Filter out completely empty rows
          return Object.values(row).some(value => value && value.toString().trim() !== '');
        });
        
        setCsvData(processedData);
        setDataUploaded(true);
        
        // Update context with CSV data
        updateDistributorData({
          csvData: processedData,
          dataUploaded: true
        });

        // Process data in chunks for better performance
        setTimeout(() => {
          transformData(processedData);
          console.log(`Converted CSV to JSON (${processedData.length} rows):`, processedData);
          
          // Close loading and show success
          Swal.fire({
            title: 'Success!',
            text: `Successfully loaded ${file.name} (${processedData.length} rows)`,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true
          });
        }, 100);
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
                        <div className="uk-width-1-2 uk-flex uk-flex-right uk-margin-remove">
                          <button onClick={promptFileUpload} className="container-btn-file">
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
                            Upload CSV
                          </button>
                        </div>

                        {/* Lucky Draw Button - Centered */}
                        {data && (data.platinum?.length > 0 || data.gold?.length > 0 || data.silver?.length > 0) && (
                          <div className="uk-width-1-1 uk-text-center uk-margin-medium-top">
                            <button 
                              onClick={() => navigate('/luckydraw')} 
                              className="draw-btn"
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                padding: '18px 50px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                borderRadius: '50px',
                                color: 'white',
                                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                              }}
                            >
                              🎲 Start Lucky Draw
                            </button>
                          </div>
                        )}

                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent">
                            <div className="uk-margin">
                              <div className="uk-grid uk-grid-small" uk-grid="">
                                <div className="uk-width-1-1">
                                  <div className="uk-card uk-card-default uk-card-body">
                                    <h3 className="uk-card-title">Customer Tier Summary</h3>
                                    <div className="tier-buttons-home">
                                      <div className="tier-card-home tier-platinum">
                                        <div className="tier-icon">💎</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">PLATINUM</h4>
                                          <p className="tier-count">({data?.platinum?.length || 0} distributors)</p>
                                          <div className="tier-stats">
                                            <span className="tier-value">Greater than 2 Crore PKR</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-gold">
                                        <div className="tier-icon">🥇</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">GOLD</h4>
                                          <p className="tier-count">({data?.gold?.length || 0} distributors)</p>
                                          <div className="tier-stats">
                                            <span className="tier-value">1.5 to 2 Crore PKR</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="tier-card-home tier-silver">
                                        <div className="tier-icon">🥈</div>
                                        <div className="tier-content">
                                          <h4 className="tier-name">SILVER</h4>
                                          <p className="tier-count">({data?.silver?.length || 0} distributors)</p>
                                          <div className="tier-stats">
                                            <span className="tier-value">1 to 1.5 Crore PKR</span>
                                          </div>
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
                                    <span>Platinum: {data?.platinum?.length || 0} | Gold: {data?.gold?.length || 0} | Silver: {data?.silver?.length || 0}</span>
                                  </div>
                                </div>

                                <ul className="uk-tab tier-tabs" uk-tab="connect: #tier-switcher">
                                  <li className="uk-active"><a href="#" className="platinum">Platinum Tier (> 2 Crore PKR)</a></li>
                                  <li><a href="#" className="gold">Gold Tier (1.5 - 2 Crore PKR)</a></li>
                                  <li><a href="#" className="silver">Silver Tier (1 - 1.5 Crore PKR)</a></li>
                                </ul>

                                <ul id="tier-switcher" className="uk-switcher uk-margin">
                                  {/* Platinum Tier Table */}
                                  <li className="uk-active">
                                    <div className="uk-overflow-auto">
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table tier-platinum">
                                        <thead className="tier-header tier-platinum">
                                          <tr>
                                            <th className={`sortable ${sortConfig.platinum.key==='distributorName' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','distributorName')}>Distributor Name</th>
                                            <th className={`sortable ${sortConfig.platinum.key==='region' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.platinum.key==='distributorCode' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','distributorCode')}>Distributor Code</th>
                                            <th className={`sortable ${sortConfig.platinum.key==='customerCount' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','customerCount')}>Customer Count</th>
                                            <th className={`sortable ${sortConfig.platinum.key==='totalGrossAmount' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.platinum.key==='transactions' ? 'sorted-'+sortConfig.platinum.dir : ''}`} onClick={() => handleSort('platinum','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('platinum').map((distributor, index) => (
                                            <tr key={index}>
                                              <td>{distributor.distributorName}</td>
                                              <td>{distributor.region}</td>
                                              <td>{distributor.distributorCode}</td>
                                              <td>{distributor.customerCount}</td>
                                              <td>{distributor.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={distributor.transactions.length > 1 ? 'emphasis' : ''}>{distributor.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.platinum || data.platinum.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No platinum tier distributors found</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </li>
                                  
                                  {/* Gold Tier Table */}
                                  <li>
                                    <div className="uk-overflow-auto">
                                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover tier-table tier-gold">
                                        <thead className="tier-header tier-gold">
                                          <tr>
                                            <th className={`sortable ${sortConfig.gold.key==='distributorName' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','distributorName')}>Distributor Name</th>
                                            <th className={`sortable ${sortConfig.gold.key==='region' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.gold.key==='distributorCode' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','distributorCode')}>Distributor Code</th>
                                            <th className={`sortable ${sortConfig.gold.key==='customerCount' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','customerCount')}>Customer Count</th>
                                            <th className={`sortable ${sortConfig.gold.key==='totalGrossAmount' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.gold.key==='transactions' ? 'sorted-'+sortConfig.gold.dir : ''}`} onClick={() => handleSort('gold','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('gold').map((distributor, index) => (
                                            <tr key={index}>
                                              <td>{distributor.distributorName}</td>
                                              <td>{distributor.region}</td>
                                              <td>{distributor.distributorCode}</td>
                                              <td>{distributor.customerCount}</td>
                                              <td>{distributor.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={distributor.transactions.length > 1 ? 'emphasis' : ''}>{distributor.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.gold || data.gold.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No gold tier distributors found</td>
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
                                            <th className={`sortable ${sortConfig.silver.key==='distributorName' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','distributorName')}>Distributor Name</th>
                                            <th className={`sortable ${sortConfig.silver.key==='region' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','region')}>Region</th>
                                            <th className={`sortable ${sortConfig.silver.key==='distributorCode' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','distributorCode')}>Distributor Code</th>
                                            <th className={`sortable ${sortConfig.silver.key==='customerCount' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','customerCount')}>Customer Count</th>
                                            <th className={`sortable ${sortConfig.silver.key==='totalGrossAmount' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','totalGrossAmount')}>Total Gross Amount</th>
                                            <th className={`sortable ${sortConfig.silver.key==='transactions' ? 'sorted-'+sortConfig.silver.dir : ''}`} onClick={() => handleSort('silver','transactions')}>Transactions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getRows('silver').map((distributor, index) => (
                                            <tr key={index}>
                                              <td>{distributor.distributorName}</td>
                                              <td>{distributor.region}</td>
                                              <td>{distributor.distributorCode}</td>
                                              <td>{distributor.customerCount}</td>
                                              <td>{distributor.totalGrossAmount.toLocaleString()} PKR</td>
                                              <td className={distributor.transactions.length > 1 ? 'emphasis' : ''}>{distributor.transactions.length}</td>
                                            </tr>
                                          ))}
                                          {(!data?.silver || data.silver.length === 0) && (
                                            <tr>
                                              <td colSpan="6" className="uk-text-center">No silver tier distributors found</td>
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
