import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Switch } from '@mui/material';

export default function CPURAM() {
  const initialData = { memory: "--", cpu: "--" };
  const [systemInfo, setSystemInfo] = useState(initialData);
  const [fetchingData, setFetchingData] = useState(false);

  const toggleDataFetching = () => {
    setFetchingData(prev => !prev);
  };

  useEffect(() => {
    let interval;
    let isSubscribed = true; // Flag to control updates

    const fetchData = async () => {
      try {
        const response = await fetch('/api/tools/audio/system_info');
        if (response.ok) {
          const data = await response.json();
          if (isSubscribed) { // Update state only if isSubscribed is true
            setSystemInfo(data);
          }
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (fetchingData) {
      interval = setInterval(fetchData, 1000);
      fetchData();
    } else {
      clearInterval(interval);
      setSystemInfo(initialData);
    }

    return () => {
      clearInterval(interval);
      isSubscribed = false; // Prevent updates when component is unmounted or switch is off
    };
  }, [fetchingData]);

  return (
    <>
    <Box sx={{ width: '150px', mr: 1 }}>
          <Typography variant="body2">CPU: {systemInfo.cpu}%</Typography>
          <Typography variant="body2">RAM: {systemInfo.memory}%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={fetchingData}
            onChange={toggleDataFetching}
            color="primary"
          />
        </Box>
        </>
  );
}
