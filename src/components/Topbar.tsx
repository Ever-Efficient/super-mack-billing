import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role') || 'Unknown Role';

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/dashboard'),
    },
  ];

  const endTemplate = (
    <div className="flex align-items-center gap-3">
      <Button
        icon="pi pi-bell"
        className="p-button-text p-button-plain p-overlay-badge"
        tooltip="Notifications"
        tooltipOptions={{ position: 'bottom' }}
      >
        <Badge value="3" severity="info" />
      </Button>

      <div className="flex align-items-center gap-2">
        <Avatar
          icon="pi pi-user"
          className="p-overlay-badge"
          shape="circle"
          size="large"
        />
        <div className="flex flex-column">
          <small className="text-xs text-500">{role}</small>
        </div>
      </div>

      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-danger"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          navigate('/');
        }}
        tooltip="Logout"
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );

  return <Menubar className="mt-2" model={items} end={endTemplate} />;
};

export default TopNav;
