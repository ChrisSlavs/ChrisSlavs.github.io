import React from 'react'
import { Routes, Route } from 'react-router-dom';
import './styles/App.css'

import PageContainer from './components/PageContainer';
import AuthProvider from './components/AuthProvider';
import PlinkoDashboard from './components/PlinkoDashboard';
import UserDashboard, { EmailPanel, SelfExclusionPanel, VerificationPanel } from './components/UserDashboard';
import EmailConfirmedPage from './components/EmailConfirmedPage';
import UnsubscribePage from './components/UnsubscribePage';
import AboutPage from './components/AboutPage';

function App() {
  return (
    <div className="App">
      <AuthProvider> 
        <Routes>
          <Route path='/' element={<PageContainer />}>
            <Route path='/' element={<PlinkoDashboard />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='account/email' element={<UserDashboard 
                                                mainPanelContent={<EmailPanel/>}
                                                />}/>
            <Route path='account/verification' element={<UserDashboard
                                                mainPanelContent={<VerificationPanel />}
                                                />}/>
            <Route path='account/exclusion' element={<UserDashboard
                                                      mainPanelContent={<SelfExclusionPanel />}
                                                      />}/>
            <Route path='account/confirmEmail'element={<EmailConfirmedPage/>}/>
            <Route path='account/unsubscribe' element={<UnsubscribePage />}/> 

          </Route>
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App