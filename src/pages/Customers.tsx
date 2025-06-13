import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import TopNav from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';

interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditBalance?: number;
}

const mockData: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    address: "Colombo, Sri Lanka",
    creditBalance: 100.5,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0776543210",
    address: "Kandy, Sri Lanka",
    creditBalance: 230.0,
  },
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Customer>({});
  const toast = useRef<Toast>(null);

  const openModal = (mode: "add" | "edit", customer?: Customer) => {
    setFormMode(mode);
    setFormData(customer || {});
    setVisible(true);
  };

  const saveCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Name, Email and Phone are required.",
      });
      return;
    }

    if (formMode === "add") {
      const newCustomer = {
        ...formData,
        id: (Math.max(0, ...customers.map(c => parseInt(c.id || "0"))) + 1).toString(),
      };
      setCustomers([...customers, newCustomer]);
      toast.current?.show({ severity: "success", summary: "Added", detail: "Customer added." });
    } else {
      setCustomers(prev =>
        prev.map(c => (c.id === formData.id ? formData : c))
      );
      toast.current?.show({ severity: "success", summary: "Updated", detail: "Customer updated." });
    }

    setVisible(false);
  };

  const deleteCustomer = (customer: Customer) => {
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    toast.current?.show({ severity: "success", summary: "Deleted", detail: "Customer removed." });
  };

  const actionTemplate = (rowData: Customer) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => openModal("edit", rowData)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => deleteCustomer(rowData)} />
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-column w-full p-4">
        <TopNav />
        <div>
          <Toast ref={toast} />
          <h2>Customers</h2>

          <div className="flex justify-content-between align-items-center mb-3">
            <Button label="Add Customer" icon="pi pi-plus" onClick={() => openModal("add")} />
            <InputText
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-inputtext-sm"
            />
          </div>

          <DataTable
            value={customers}
            paginator rows={5}
            globalFilter={globalFilter}
            emptyMessage="No customers found."
          >
            <Column field="name" header="Name" sortable />
            <Column field="email" header="Email" />
            <Column field="phone" header="Phone" />
            <Column field="address" header="Address" />
            <Column
              field="creditBalance"
              header="Credit Balance"
              body={(row) => `$${row.creditBalance?.toFixed(2)}`}
            />
            <Column body={actionTemplate} header="Actions" />
          </DataTable>

          <Dialog
            visible={visible}
            onHide={() => setVisible(false)}
            header={formMode === "add" ? "Add Customer" : "Edit Customer"}
            style={{ width: "30vw" }}
            modal
          >
            <div className="p-fluid">
              <div className="field">
                <label>Name</label>
                <InputText value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Email</label>
                <InputText value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <InputText value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Address</label>
                <InputText value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="field">
                <label>Credit Balance</label>
                <InputText
                  type="number"
                  value={formData.creditBalance?.toString() || ""}
                  onChange={(e) => setFormData({ ...formData, creditBalance: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-content-end gap-2 mt-4">
              <Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
              <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setVisible(false)} />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;