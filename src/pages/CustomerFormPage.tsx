import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import TopNav from "../components/Topbar";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const CustomerFormPage = () => {
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    creditBalance: number | null;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    creditBalance: null,
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Submitted:", customerData);
    navigate("/customers", { state: { newCustomer: customerData } });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-column w-full ml-3 mr-2">
        <TopNav />
        <Card className="mt-2" title="Add Customer Details">
          <div className="p-fluid formgrid">
            <div className="grid col-12">
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="name">Name*</label>
                <InputText
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="email">Email*</label>
                <InputText
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="phone">Phone*</label>
                <InputText
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="address">Address</label>
                <InputText
                  id="address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="creditBalance">Credit Balance</label>
                <InputNumber
                  id="creditBalance"
                  value={customerData.creditBalance}
                  onValueChange={(e) =>
                    setCustomerData({ ...customerData, creditBalance: e.value ?? null })
                  }
                  min={0}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
            </div>
            <div className="flex col-3 mt-2">
              <Button label="Save Customer" icon="pi pi-check" onClick={handleSubmit} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerFormPage;