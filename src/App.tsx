import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TravelDetailPage from './pages/TravelDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/travels/:travelId" element={<TravelDetailPage />} />
    </Routes>
  );
}

export default App;
