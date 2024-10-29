import { Box } from '@chakra-ui/react';
import './App.css';
import BusStopDashboard from './components/BusStopDashboard/BusStopDashboard';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

function App() {
  const mockData = {
    stopcode: "402506",
    // preopenedRoute: "M101",
    // name: "W 125th St & 5th Ave",
    // routes: ["M60-SBS", "M101", "M125"],
    // Add more mock properties as needed
  };

  return (
    <Router>
      <Box className='top-container'>
        <NavBar />
        <Box className="main-content" px={4}>
          <Routes>
            <Route 
              path="/" 
              element={<BusStopDashboard {...mockData} />} 
            />
            <Route 
              path="/:stopcode/:preopenedRoute?"  // Optional parameter with ?
              element={<BusStopWithParams />} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

// Helper component to retrieve and pass URL params
function BusStopWithParams() {
  const { stopcode, preopenedRoute } = useParams();
  
  return (
    <BusStopDashboard 
      stopcode={stopcode} 
      preopenedRoute={preopenedRoute} 
    />
  );
}

export default App;
