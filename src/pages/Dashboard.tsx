import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import TopNav from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: [1200, 1900, 1500, 2300, 2000, 2700, 2200],
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-column w-full ml-3 mr-2">
        <TopNav />
        <div className="p-1 flex-1 overflow-y-auto">
          <h2>Dashboard</h2>

          <div className="grid">
            <div className="col-12 md:col-6 xl:col-3">
              <Card className="shadow-2">
                <div className="text-xl font-bold text-primary">Rs. 12,300</div>
                <div className="text-600">Daily Sales</div>
              </Card>
            </div>

            <div className="col-12 md:col-6 xl:col-3">
              <Card className="shadow-2">
                <div className="text-xl font-bold text-orange-500">7</div>
                <div className="text-600">Outstanding Invoices</div>
              </Card>
            </div>

            <div className="col-12 md:col-6 xl:col-3">
              <Card className="shadow-2">
                <div className="text-xl font-bold text-green-500">126</div>
                <div className="text-600">Customers</div>
              </Card>
            </div>

            <div className="col-12 md:col-6 xl:col-3">
              <Card className="shadow-2">
                <div className="text-xl font-bold text-pink-500">349</div>
                <div className="text-600">Products in Stock</div>
              </Card>
            </div>
          </div>

          <div className="grid mt-2">
            <div className="col-12 md:col-8">
              <Card title="Weekly Sales Overview" className="shadow-2">
                <Chart type="bar" data={salesChartData} options={salesChartOptions} />
              </Card>
            </div>

            <div className="col-12 md:col-4">
              <Card title="Quick Actions" className="shadow-2">
                <div className="flex flex-column gap-2">
                  <Button label="Create Invoice" icon="pi pi-plus" className="p-button-success w-full" onClick={() => {navigate('/invoices')}} />
                  <Button label="Add Product" icon="pi pi-box" className="p-button-secondary w-full" onClick={() => {navigate('/productForm')}} />
                  <Button label="Add Customer" icon="pi pi-user-plus" className="p-button-info w-full" onClick={() => {navigate('/customerForm')}} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};