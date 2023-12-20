import React, { useState, useEffect } from 'react';
import { Typography, Box, Switch } from '@mui/material';

export default function HeaderBarCPU() {
  const initialData = { memory: "--", cpu: "--" };
  const [systemInfo, setSystemInfo] = useState(initialData);
  const [fetchingData, setFetchingData] = useState(false);

  const toggleDataFetching = () => {
    setFetchingData(prev => !prev);
  };

  useEffect(() => {
    let interval;
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/tools/audio/system_info');
        if (response.ok) {
          const data = await response.json();
          if (isSubscribed) {
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
      isSubscribed = false;
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
