import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BillingMain from './pages/BillingMain.tsx';
import Customers from './pages/Customers.tsx';
import Products from './pages/Products.tsx';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billingMain" element={<BillingMain />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />'
      </Routes>
    </Router>
  );
}

export default App;
