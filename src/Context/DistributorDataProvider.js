import React, { createContext, useContext, useState } from 'react';

const DistributorDataContext = createContext();

export const useDistributorData = () => {
  const context = useContext(DistributorDataContext);
  if (!context) {
    throw new Error('useDistributorData must be used within a DistributorDataProvider');
  }
  return context;
};

export const DistributorDataProvider = ({ children }) => {
  const [distributorData, setDistributorData] = useState({
    platinum: [],
    gold: [],
    silver: [],
    allDistributors: [],
    csvData: null,
    dataUploaded: false
  });

  const updateDistributorData = (data) => {
    setDistributorData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const clearDistributorData = () => {
    setDistributorData({
      platinum: [],
      gold: [],
      silver: [],
      allDistributors: [],
      csvData: null,
      dataUploaded: false
    });
  };

  const value = {
    distributorData,
    updateDistributorData,
    clearDistributorData
  };

  return (
    <DistributorDataContext.Provider value={value}>
      {children}
    </DistributorDataContext.Provider>
  );
};
