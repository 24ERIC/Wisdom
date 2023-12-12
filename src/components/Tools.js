import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description'; // Placeholder icon

function ToolCard({ title, subtitle, description }) {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 200, // Adjust width and height to fit your design
      height: 150,
      margin: 2,
      borderRadius: '16px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <DescriptionIcon color="primary" sx={{ fontSize: 40, marginBottom: 1 }} />
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant="caption" display="block" sx={{ textAlign: 'center' }}>
          {subtitle}
        </Typography>
        <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Category({ name, tools }) {
  return (
    <Paper elevation={0} sx={{ padding: 2, marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginLeft: 2 }}>
        {name}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {tools.map((tool, index) => (
          <Grid item key={index}>
            <ToolCard title={tool.title} subtitle={tool.subtitle} description={tool.description} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function Tools() {
  const categories = [
    {
      name: 'Category 1',
      tools: [
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        // ... other tools
      ],
    },
    {
      name: 'Category 1',
      tools: [
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        // ... other tools
      ],
    },
    {
      name: 'Category 1',
      tools: [
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        // ... other tools
      ],
    },
    {
      name: 'Category 1',
      tools: [
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        // ... other tools
      ],
    },
    {
      name: 'Category 1',
      tools: [
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        { title: 'Tool 1', subtitle: 'Subtitle 1', description: 'Desc 1' },
        // ... other tools
      ],
    },
    // ... other categories
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ margin: 2, textAlign: 'center' }}>
        Tool Categories
      </Typography>
      {categories.map((category, index) => (
        <Category key={index} name={category.name} tools={category.tools} />
      ))}
    </div>
  );
}

export default Tools;
