import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import Spinner from "../../reusables/Spinner";
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import "./LuckyDraw.css";

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
    }
  }, [globalDistributorData]);

  // Function to prompt user to upload distributor CSV file
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

  // Function to convert distributor CSV to JSON
  const convertDistributorCsvToJson = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setDistributorData(results.data);
        setDataUploaded(true);
        console.log('Distributor data loaded:', results.data);
        
        Swal.fire({
          title: 'Success!',
          text: `Successfully loaded ${file.name} (${results.data.length} rows)`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Error parsing distributor CSV:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to parse CSV file: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  // Filter participants based on selected criteria
  const filterParticipants = () => {
    // Use global distributor data if available
    if (globalDistributorData.dataUploaded && globalDistributorData[selectedTier]) {
      return globalDistributorData[selectedTier].map((distributor, index) => ({
        id: index + 1,
        name: distributor.distributorName,
        region: distributor.region,
        area: distributor.region, // Using region as area for now
        distributorCode: distributor.distributorCode,
        totalGrossAmount: distributor.totalGrossAmount,
        customerCount: distributor.customerCount
      }));
    }
    
    // Fallback to sample data if global data not available
    const sampleData = {
      platinum: [
        { id: 1, name: "Ahmed Ali", region: "Karachi", area: "North", distributorCode: "D001" },
        { id: 2, name: "Fatima Malik", region: "Lahore", area: "South", distributorCode: "D002" }
      ],
      gold: [
        { id: 3, name: "Sara Khan", region: "Islamabad", area: "East", distributorCode: "D003" },
        { id: 4, name: "Omar Rashid", region: "Karachi", area: "West", distributorCode: "D004" },
        { id: 5, name: "Zara Hussain", region: "Lahore", area: "Central", distributorCode: "D005" }
      ],
      silver: [
        { id: 6, name: "Hassan Sheikh", region: "Faisalabad", area: "North", distributorCode: "D006" },
        { id: 7, name: "Aisha Tariq", region: "Multan", area: "South", distributorCode: "D007" },
        { id: 8, name: "Bilal Ahmed", region: "Peshawar", area: "East", distributorCode: "D008" }
      ]
    };
    
    return sampleData[selectedTier] || [];
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="lucky-draw-container">
      <div className="uk-container uk-container-xlarge">
        
        {!dataUploaded && !globalDistributorData.dataUploaded ? (
          // Upload Screen
          <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3>Upload Distributor Data</h3>
              <p>Please upload distributor data from the Home page first, or upload a CSV file here</p>
              <button onClick={promptDistributorUpload} className=" mx-auto container-btn-file">
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
              <div className="uk-card uk-card-default uk-card-body tier-selection-card">
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
                          <div className="giveaway-icon">{giveaway.icon}</div>
                          <h5>{giveaway.name}</h5>
                          <p>{giveaway.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                          <small>{filterParticipants().length} eligible participants</small>
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
                          <p>{participant.region} - {participant.area}</p>
                          <small>Code: {participant.distributorCode}</small>
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
