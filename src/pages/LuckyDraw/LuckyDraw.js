import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import Spinner from "../../reusables/Spinner";
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import "./LuckyDraw.css";
import yaris from "../../assets/images/yaris.png";
import gold_1_tola from "../../assets/images/goldbar.png";
import coin from "../../assets/images/coin.png";

const LuckyDraw = () => {
  const { auth } = useAuth();
  const { distributorData: globalDistributorData } = useDistributorData();
  const [isLoading, setIsLoading] = useState(false);
  const [distributorData, setDistributorData] = useState([]);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [selectedTier, setSelectedTier] = useState('platinum');
  const [selectedGiveaway, setSelectedGiveaway] = useState('');
  const [eligibleParticipants, setEligibleParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Giveaway configuration by tier
  const giveawayConfig = {
    platinum: [
      { id: 'car', name: 'Car Giveaway', icon: '🚗', description: 'Brand new car for platinum customers' }
    ],
    gold: [
      { id: 'gold_1_tola', name: '1 Tola Gold', icon: '🥇', description: '1 Tola pure gold' },
      { id: 'gold_5_grams', name: '5 Grams Gold', icon: '🏅', description: '5 grams pure gold' }
    ],
    silver: [
      { id: 'washing_machine', name: 'Washing Machine', icon: '🧺', description: 'Automatic washing machine' },
      { id: 'lcd_tv', name: 'LCD TV', icon: '📺', description: '32 inch LCD television' },
      { id: 'refrigerator', name: 'Refrigerator', icon: '❄️', description: 'Double door refrigerator' }
    ]
  };
  
  console.log(distributorData , 'distributorData from Gloabal ')

  useEffect(() => {
    // Load draw history from localStorage
    const savedHistory = localStorage.getItem('luckyDrawHistory');
    if (savedHistory) {
      setDrawHistory(JSON.parse(savedHistory));
    }
    
    // Check if distributor data is available from global context
    if (globalDistributorData.dataUploaded) {
      setDataUploaded(true);
      console.log('Global distributor data available:', globalDistributorData);
      
      // Prompt for geo data if not already uploaded
      if (geoData.length === 0) {
        setTimeout(() => {
          promptGeoDataUpload();
        }, 500);
      }
    }
  }, [globalDistributorData, geoData.length]);

  // Function to prompt user to upload geo CSV file
  const promptGeoDataUpload = () => {
    Swal.fire({
      title: 'Upload Geographic Data',
      text: 'Please upload the distributor geographic information CSV to enable location-based filtering',
      icon: 'info',
      html: `
        <div class="custom-file-upload">
          <input type="file" id="geo-csv" accept=".csv" style="display: none;" />
          <label for="geo-csv" class="uk-button uk-button-primary">
            Choose Geographic CSV File
          </label>
          <span id="geo-file-name" style="margin-left: 10px;">No file selected</span>
        </div>
      `,
      allowOutsideClick: true,
      // showCancelButton: true,
      confirmButtonText: 'Upload',
      // cancelButtonText: 'Skip for now',
      didOpen: () => {
        const fileInput = document.getElementById('geo-csv');
        const fileNameSpan = document.getElementById('geo-file-name');
        
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            fileNameSpan.textContent = e.target.files[0].name;
          } else {
            fileNameSpan.textContent = 'No file selected';
          }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('geo-csv');
        if (!fileInput.files.length) {
          Swal.showValidationMessage('Please select a file');
          return false;
        }
        return fileInput.files[0];
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;
        convertDistributorCsvToJson(file);
      }
    });
  };

  // Function to prompt user to upload distributor CSV file (fallback)
  const promptDistributorUpload = () => {
    Swal.fire({
      title: 'Upload Distributor CSV File',
      text: 'Please upload distributor data (CSV format)',
      icon: 'info',
      html: `
        <div class="custom-file-upload">
          <input type="file" id="distributor-csv" accept=".csv" style="display: none;" />
          <label for="distributor-csv" class="uk-button uk-button-primary">
            Choose CSV File
          </label>
          <span id="distributor-file-name" style="margin-left: 10px;">No file selected</span>
        </div>
      `,
      allowOutsideClick: false,
      showCancelButton: false,
      confirmButtonText: 'Upload',
      didOpen: () => {
        const fileInput = document.getElementById('distributor-csv');
        const fileNameSpan = document.getElementById('distributor-file-name');
        
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            fileNameSpan.textContent = e.target.files[0].name;
          } else {
            fileNameSpan.textContent = 'No file selected';
          }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('distributor-csv');
        if (!fileInput.files.length) {
          Swal.showValidationMessage('Please select a file');
          return false;
        }
        return fileInput.files[0];
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;
        convertDistributorCsvToJson(file);
      }
    });
  };

  // Function to convert distributor CSV to JSON (for geo data)
  const convertDistributorCsvToJson = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processedGeoData = results.data.filter(row => {
          return Object.values(row).some(value => value && value.toString().trim() !== '');
        });
        
        setGeoData(processedGeoData);
        setDataUploaded(true);
        console.log('Geo data loaded:', processedGeoData);
        
        Swal.fire({
          title: 'Success!',
          text: `Successfully loaded ${file.name} (${processedGeoData.length} rows)`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Error parsing geo CSV:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to parse CSV file: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  // Get unique values for dropdowns
  const getUniqueZones = () => {
    const zones = geoData.map(item => item.ZoneDesc || item.Zone).filter(Boolean);
    return [...new Set(zones)].sort();
  };

  const getUniqueRegions = () => {
    let regions = geoData.map(item => item.Region).filter(Boolean);
    if (selectedZone) {
      regions = geoData
        .filter(item => (item.ZoneDesc || item.Zone) === selectedZone)
        .map(item => item.Region)
        .filter(Boolean);
    }
    return [...new Set(regions)].sort();
  };

  const getUniqueAreas = () => {
    let areas = geoData.map(item => item.Area).filter(Boolean);
    if (selectedRegion) {
      areas = geoData
        .filter(item => item.Region === selectedRegion)
        .map(item => item.Area)
        .filter(Boolean);
    }
    return [...new Set(areas)].sort();
  };

  // Filter participants based on selected criteria
  const filterParticipants = () => {
    let participants = [];
    
    // Use global customer data if available
    if (globalDistributorData.dataUploaded && globalDistributorData[selectedTier]) {
      participants = globalDistributorData[selectedTier].map((customer, index) => {
        // Find matching geo data using distributor code
        const geoInfo = geoData.find(geo => 
          (geo['Distributor Code'] || geo.distributorCode) === customer.distributorCode
        );
        
        return {
          id: index + 1,
          name: customer.customerName, // Use customer name instead of distributor name
          customerCode: customer.customerCode,
          region: geoInfo?.Region || customer.region || 'Unknown',
          area: geoInfo?.Area || 'Unknown', 
          zone: geoInfo?.ZoneDesc || geoInfo?.Zone || 'Unknown',
          distributorCode: customer.distributorCode,
          distributorName: customer.distributorName,
          totalGrossAmount: customer.totalGrossAmount,
          transactionCount: customer.transactionCount
        };
      });
    } else {
      // Fallback to sample customer data if global data not available
      const sampleData = {
        platinum: [
          { id: 1, name: "Ahmed Ali", customerCode: "C001", region: "KARACHI", area: "KMD", zone: "South", distributorCode: "D001", distributorName: "ABC Traders" },
          { id: 2, name: "Fatima Malik", customerCode: "C002", region: "LAHORE", area: "LHR DHA", zone: "Central", distributorCode: "D002", distributorName: "XYZ Distributors" }
        ],
        gold: [
          { id: 3, name: "Sara Khan", customerCode: "C003", region: "ISLAMABAD", area: "ISB", zone: "North", distributorCode: "D003", distributorName: "PQR Trading" },
          { id: 4, name: "Omar Rashid", customerCode: "C004", region: "KARACHI", area: "Baldia", zone: "South", distributorCode: "D004", distributorName: "LMN Suppliers" },
          { id: 5, name: "Zara Hussain", customerCode: "C005", region: "LAHORE", area: "LHR JOHAR TOWN", zone: "Central", distributorCode: "D005", distributorName: "DEF Enterprises" }
        ],
        silver: [
          { id: 6, name: "Hassan Sheikh", customerCode: "C006", region: "FAISALABAD", area: "JHANG", zone: "North", distributorCode: "D006", distributorName: "GHI Traders" },
          { id: 7, name: "Aisha Tariq", customerCode: "C007", region: "MULTAN", area: "MULTAN CITY", zone: "Central", distributorCode: "D007", distributorName: "JKL Distributors" },
          { id: 8, name: "Bilal Ahmed", customerCode: "C008", region: "PESHAWAR", area: "PESHAWAR", zone: "North", distributorCode: "D008", distributorName: "MNO Trading" }
        ]
      };
      participants = sampleData[selectedTier] || [];
    }
    
    // Apply filters
    let filteredParticipants = participants;
    
    if (selectedZone) {
      filteredParticipants = filteredParticipants.filter(p => p.zone === selectedZone);
    }
    
    if (selectedRegion) {
      filteredParticipants = filteredParticipants.filter(p => p.region === selectedRegion);
    }
    
    if (selectedArea) {
      filteredParticipants = filteredParticipants.filter(p => p.area === selectedArea);
    }
    
    return filteredParticipants;
  };

  const startLuckyDraw = () => {
    if (!selectedGiveaway) {
      Swal.fire({
        title: 'Select Giveaway',
        text: 'Please select a giveaway type before starting the draw',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const participants = filterParticipants();
    if (participants.length === 0) {
      Swal.fire({
        title: 'No Eligible Participants',
        text: 'No participants found for the selected criteria',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setEligibleParticipants(participants);
    setIsSpinning(true);
    setWinner(null);

    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[randomIndex];
      const giveaway = giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway);
      
      setWinner({ ...selectedWinner, giveaway });
      setIsSpinning(false);

      // Add to history
      const newEntry = {
        id: Date.now(),
        winner: selectedWinner,
        giveaway: giveaway,
        tier: selectedTier,
        date: new Date().toLocaleString(),
        totalParticipants: participants.length
      };
      const updatedHistory = [newEntry, ...drawHistory];
      setDrawHistory(updatedHistory);
      localStorage.setItem('luckyDrawHistory', JSON.stringify(updatedHistory));

      // Show winner announcement
      Swal.fire({
        title: '🎉 Congratulations!',
        html: `
          <div class="winner-announcement">
            <div class="giveaway-icon">${giveaway.icon}</div>
            <h3>${selectedWinner.name}</h3>
            <p><strong>Won:</strong> ${giveaway.name}</p>
            <p><strong>Region:</strong> ${selectedWinner.region}</p>
            <p><strong>Area:</strong> ${selectedWinner.area}</p>
            <p>Tier: <span class="tier-badge tier-${selectedTier}">${selectedTier.toUpperCase()}</span></p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Great!',
        customClass: {
          popup: 'winner-popup'
        }
      });
    }, 3000);
  };

  const resetDraw = () => {
    setWinner(null);
    setIsSpinning(false);
    setEligibleParticipants([]);
  };

  const clearHistory = () => {
    Swal.fire({
      title: 'Clear History?',
      text: 'This will remove all previous draw results',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setDrawHistory([]);
        localStorage.removeItem('luckyDrawHistory');
        Swal.fire('Cleared!', 'Draw history has been cleared.', 'success');
      }
    });
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    setSelectedGiveaway('');
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleGiveawayChange = (giveawayId) => {
    setSelectedGiveaway(giveawayId);
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleZoneChange = (zone) => {
    setSelectedZone(zone);
    setSelectedRegion(''); // Reset region when zone changes
    setSelectedArea(''); // Reset area when zone changes
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedArea(''); // Reset area when region changes
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
    setWinner(null);
    setEligibleParticipants([]);
  };

  const clearFilters = () => {
    setSelectedZone('');
    setSelectedRegion('');
    setSelectedArea('');
    setWinner(null);
    setEligibleParticipants([]);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="lucky-draw-container" style={{marginBottom: '80px'}}>
      <div className="uk-container uk-container-xlarge">
        
        {!dataUploaded && !globalDistributorData.dataUploaded ? (
          // Upload Screen
          <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3>Upload Distributor Data</h3>
              <p>Please upload distributor data from the Home page first, or upload a CSV file here</p>
              <button onClick={promptGeoDataUpload} className=" mx-auto container-btn-file">
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
          // Main Lucky Draw Interface
          <div className="uk-grid uk-grid-large " uk-grid="" style={{ marginTop: "86px" }}>
            
            {/* Header */}
            

            {/* Tier Selection */}
            <div className="uk-width-1-1 ">
              <div className="uk-card uk-card-default uk-card-body tier-selection-card" style={{backgroundImage: 'url(/src/assets/images/green bg.png)'}}>
                <h3 className="uk-card-title">Select Tier & Giveaway</h3>
                
                <div className="tier-buttons">
                  {Object.keys(giveawayConfig).map((tier) => (
                    <button
                      key={tier}
                      className={`tier-btn tier-${tier} ${selectedTier === tier ? 'active' : ''}`}
                      onClick={() => handleTierChange(tier)}
                    >
                      <span className="tier-name">{tier.toUpperCase()}</span>
                      <span className="tier-count">({giveawayConfig[tier].length} giveaways)</span>
                    </button>
                  ))}
                </div>

                {selectedTier && (
                  <div className="giveaway-selection">
                    <h4>Select {selectedTier.toUpperCase()} Giveaway:</h4>
                    <div className="giveaway-grid">
                      {giveawayConfig[selectedTier].map((giveaway) => (
                        <div
                          key={giveaway.id}
                          className={`giveaway-card ${selectedGiveaway === giveaway.id ? 'selected' : ''}`}
                          onClick={() => handleGiveawayChange(giveaway.id)}
                        >
                          <div className="giveaway-icon"><img style={{width: '40%'}} 
                          
                          
                          src={ giveaway.id === 'car' ? yaris :
                             giveaway.id === 'gold_1_tola' ? gold_1_tola :
                             giveaway.id === 'gold_5_grams' ? coin :
                             '/src/assets/images/gift.png'}
                          
                          
                          
                          
                          
                          alt={giveaway.name} /></div>
                          <h5>{giveaway.name}</h5>
                          <p>{giveaway.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geographic Filters */}
                {selectedGiveaway && (geoData.length > 0 || globalDistributorData.dataUploaded) && (
                  <div className="filter-section">
                    <h4>Filter Participants by Location:</h4>
                    <div className="uk-grid uk-grid-small uk-margin-small-top" uk-grid="">
                      
                      {/* Zone Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Zone:</label>
                        <select 
                          className="uk-select" 
                          value={selectedZone} 
                          onChange={(e) => handleZoneChange(e.target.value)}
                        >
                          <option value="">All Zones</option>
                          {getUniqueZones().map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>

                      {/* Region Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Region:</label>
                        <select 
                          className="uk-select" 
                          value={selectedRegion} 
                          onChange={(e) => handleRegionChange(e.target.value)}
                        >
                          <option value="">All Regions</option>
                          {getUniqueRegions().map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      {/* Area Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Area:</label>
                        <select 
                          className="uk-select" 
                          value={selectedArea} 
                          onChange={(e) => handleAreaChange(e.target.value)}
                        >
                          <option value="">All Areas</option>
                          {getUniqueAreas().map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Summary and Clear Button */}
                      <div className="uk-width-1-1 uk-margin-small-top">
                        <div className="uk-flex uk-flex-between uk-flex-middle">
                          <div className="filter-summary">
                            <span className="uk-text-small uk-text-muted">
                              Eligible Participants: <strong>{filterParticipants().length}</strong>
                              {selectedZone && <span className="filter-tag">Zone: {selectedZone}</span>}
                              {selectedRegion && <span className="filter-tag">Region: {selectedRegion}</span>}
                              {selectedArea && <span className="filter-tag">Area: {selectedArea}</span>}
                            </span>
                          </div>
                          {(selectedZone || selectedRegion || selectedArea) && (
                            <button 
                              className="uk-button uk-button-secondary uk-button-small"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Eligible Participants */}
            {selectedGiveaway && (
              <div className="uk-width-1-1@m">
                <div className="uk-card uk-card-default uk-card-body participants-card">
                  <h3 className="uk-card-title">Eligible Participants</h3>
                  <p className="uk-text-small uk-text-muted">For {selectedTier.toUpperCase()} - {giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.name}</p>
                  
                  <div className="participants-list">
                    {filterParticipants().map((participant) => (
                      <div key={participant.id} className="participant-item">
                        <div className="participant-info">
                          <h5>{participant.name}</h5>
                          <p><strong>Customer Code:</strong> {participant.customerCode}</p>
                          <p><strong>Zone:</strong> {participant.zone}</p>
                          <p><strong>Region:</strong> {participant.region}</p>
                          <p><strong>Area:</strong> {participant.area}</p>
                          <p><strong>Distributor:</strong> {participant.distributorName}</p>
                          <small>Purchase Amount: {participant.totalGrossAmount?.toLocaleString()} PKR</small>
                        </div>
                        <span className={`tier-badge tier-${selectedTier}`}>
                          {selectedTier.toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {filterParticipants().length === 0 && (
                      <p className="uk-text-center uk-text-muted">No eligible participants found</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Draw Section */}
            {selectedGiveaway && (
              <div className="uk-width-1-1@m">
                <div className="uk-card uk-card-default uk-card-body draw-card">
                  <h3 className="uk-card-title">
                    {giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.name} Draw
                  </h3>
                  
                  <div className="draw-wheel-container">
                    <div className={`draw-wheel ${isSpinning ? 'spinning' : ''}`}>
                      {isSpinning ? (
                        <div className="spinning-content">
                          <div className="spinner-icon">🎯</div>
                          <p>Drawing...</p>
                        </div>
                      ) : winner ? (
                        <div className="winner-content">
                          <div className="winner-icon">{winner.giveaway?.icon}</div>
                          <h4>{winner.name}</h4>
                          <p>{winner.region} - {winner.area}</p>
                          <span className={`tier-badge tier-${selectedTier}`}>
                            {selectedTier.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="ready-content">
                          <div className="ready-icon">{giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.icon}</div>
                          <p>Ready to Draw</p>
                          {/* <small>{filterParticipants().length} eligible participants</small> */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="draw-controls">
                    <button 
                      className="uk-button uk-button-primary uk-button-large draw-btn"
                      onClick={startLuckyDraw}
                      disabled={isSpinning}
                    >
                      {isSpinning ? 'Drawing...' : 'Start Lucky Draw'}
                    </button>
                    
                    {winner && (
                      <button 
                        className="uk-button uk-button-secondary reset-btn"
                        onClick={resetDraw}
                      >
                        Reset Draw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            

            {/* Draw History */}
            <div className="uk-width-1-1">
              <div className="uk-card uk-card-default uk-card-body history-card">
                <div className="uk-flex uk-flex-between uk-flex-middle">
                  <h3 className="uk-card-title">Draw History</h3>
                  {drawHistory.length > 0 && (
                    <button 
                      className="uk-button uk-button-danger uk-button-small"
                      onClick={clearHistory}
                    >
                      Clear History
                    </button>
                  )}
                </div>
                
                {drawHistory.length === 0 ? (
                  <p className="uk-text-center uk-text-muted">No draws conducted yet</p>
                ) : (
                  <div className="uk-overflow-auto">
                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Winner</th>
                          <th>Giveaway</th>
                          <th>Tier</th>
                          <th>Region</th>
                          <th>Participants</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawHistory.map((entry) => (
                          <tr key={entry.id}>
                            <td>{entry.date}</td>
                            <td>{entry.winner.name}</td>
                            <td>{entry.giveaway?.icon} {entry.giveaway?.name}</td>
                            <td>
                              <span className={`tier-badge tier-${entry.tier}`}>
                                {entry?.tier?.toUpperCase()}
                              </span>
                            </td>
                            <td>{entry.winner.region}</td>
                            <td>{entry.totalParticipants}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDraw;
