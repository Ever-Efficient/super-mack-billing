import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function TopNav() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'Unknown Role';

  const op = useRef<OverlayPanel | null>(null);


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
        onClick={(e) => op.current?.toggle(e)}
      />

      <OverlayPanel ref={op} style={{ width: '250px' }}>
        <div className="flex flex-column gap-2">
          <h4 className="m-0 p-0 text-center">Notifications</h4>

          {/*<div className="p-2 border-round surface-100">
            No new notifications
          </div>*/}

          <div className="p-2 border-round surface-card shadow-1">
            New booking received!
          </div>
        </div>
      </OverlayPanel>

      <div className="flex align-items-center gap-2">
        <Avatar icon="pi pi-user" shape="circle" size="large" />
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
}