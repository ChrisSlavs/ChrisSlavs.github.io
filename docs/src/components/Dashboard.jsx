import React from 'react'

import '../styles/Dashboard.css';
import BorderedContainer from './BorderedContainer';

const Dashboard = ( { mainPanel, sidebar, sidePanelId, mainPanelId, containerId} ) => {
  return (
    <div className='dashboard' id={containerId}>
        <BorderedContainer className="dashboard-sidebar" id={sidePanelId}>{sidebar}</BorderedContainer>
        <BorderedContainer className='dashboard-main-panel' id={mainPanelId}>{mainPanel}</BorderedContainer>
    </div>
  )
}

export default Dashboard