import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function Unauthorized() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGoHome = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <div className="text-center surface-card p-4 shadow-2 border-round">
        <h2 className="mb-3">Unauthorized</h2>
        <p className="mb-4">You do not have permission to access this page.</p>
        <Button
          label="Go Back to Home"
          icon="pi pi-home"
          className="p-button-primary"
          onClick={handleGoHome}
        />
      </div>
    </div>
  );
}
