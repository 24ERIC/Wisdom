import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Switch } from '@mui/material';

export default function Audio() {


  const initialData = { memory: "--", cpu: "--" };
  const [systemInfo, setSystemInfo] = useState(initialData);
  const [fetchingData, setFetchingData] = useState(true);

  const toggleDataFetching = () => {
    setFetchingData(false);
  };

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/tools/audio/system_info')
                .then(response => response.json())
                .then(data => setSystemInfo(data));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Audio/Video Editing App
        </Typography>
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
      </Toolbar>
    </AppBar>
    );
}
