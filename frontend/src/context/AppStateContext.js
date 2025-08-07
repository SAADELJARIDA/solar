import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const [fileUploadState, setFileUploadState] = useState({
    file: null,
    sensorDataId: null,
    isUploading: false,
    uploadSuccess: false,
    uploadError: '',
    showChart: false
  });

  const [chartData, setChartData] = useState({
    Isc_mod: [],
    Voc_mod: [],
    Vmpp_vec: [],
    Impp_vec: [],
    mpp_vec: []
  });

  const updateFileUploadState = (updates) => {
    setFileUploadState(prev => ({ ...prev, ...updates }));
  };

  const updateChartData = (newData) => {
    setChartData(newData);
  };

  const value = {
    fileUploadState,
    updateFileUploadState,
    chartData,
    updateChartData
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}; 