import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BillingMain from './pages/BillingMain';
import Customers from './pages/Customers';
import CustomerForm from './pages/CustomerFormPage';
import Products from './pages/Products';
import ProductForm from './pages/ProductFormPage';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Unauthorized from './components/Unauthorized';
import Users from './pages/UsersPage';

import PrivateRoute from './components/PrivateRoute';

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/settings" element={<Settings />} />
          <Route path='/users' element={< Users />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['Admin', 'Manager']} />}>
          <Route path="/customers" element={<Customers />} />
          <Route path="/customerForm" element={<CustomerForm />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productForm" element={<ProductForm />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['Admin', 'Manager', 'Viewer']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/billingMain" element={<BillingMain />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
