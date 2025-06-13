import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();

  const user = {
    name: localStorage.getItem('username') || 'Admin',
    avatar: '',
  };

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
        <span className="text-sm font-semibold">{user.name}</span>
      </div>

      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-danger"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/');
        }}
        tooltip="Logout"
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );

  return (
    <div className="shadow-1">
      <Menubar model={items} end={endTemplate} />
    </div>
  );
};

export default TopNav;