import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/dashboard'),
    },
    {
      label: 'Billing / POS',
      icon: 'pi pi-credit-card',
      command: () => navigate('/billingMain'),
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      command: () => navigate('/customers'),
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      command: () => navigate('/products'),
    },
    {
      label: 'Invoices',
      icon: 'pi pi-file',
      command: () => navigate('/invoices'),
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-line',
      command: () => navigate('/reports'),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => navigate('/settings'),
    },
  ];

  return (
    <div className="surface-0 p-3 shadow-2 h-screen w-18rem">
      <h3 className="text-xl font-semibold mb-4 text-primary">Super Mack</h3>
      <Menu model={items} className="w-full" />
    </div>
  );
};
