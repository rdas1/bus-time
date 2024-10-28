import { Box } from '@chakra-ui/core';
import './App.css';
import BusStopDashboard from './components/BusStopDashboard/BusStopDashboard';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  const mockData = {
    stopcode: "402506",
    name: "W 125th St and 5th Ave",
    // Add more mock properties as needed
  };

  return (
    <Router>
      <Box>
        <NavBar />
        <Box className="main-content" px={4}> {/* Added padding for better spacing */}
          <Routes>
            <Route 
              path="/" 
              element={<BusStopDashboard {...mockData} />} 
            />
            <Route 
              path="/:stopcode" 
              element={<BusStopDashboard />} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );

};

export default App;
