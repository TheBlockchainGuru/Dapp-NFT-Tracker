import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeConfig from './theme';

import Header from './layouts/Header';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';

import 'react-block-ui/style.css';

function App() {
  return (
    <ThemeConfig>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeConfig>
  );
}

export default App;
