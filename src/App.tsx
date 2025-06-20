import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BillingMain from './pages/BillingMain.tsx';
import Customers from './pages/Customers.tsx';
import CustomerForm from './pages/CustomerFormPage.tsx'
import Products from './pages/Products.tsx';
import ProductForm from './pages/ProductFormPage.tsx'
import Invoices from './pages/Invoices.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
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
        <Route path="/customerForm" element={<CustomerForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path='/invoices' element={<Invoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
