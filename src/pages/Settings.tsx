import { useState, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import TopNav from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';

export default function Settings () {
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [profile, setProfile] = useState({
    companyName: "",
    address: "",
    email: "",
    phone: "",
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    taxType: "GST",
    invoicePrefix: "INV",
    nextInvoiceNumber: 1001,
  });

  const [users, setUsers] = useState<
    { name: string; email: string; password: string; role: string }[]
  >([
    { name: "Alice Admin", email: "alice@company.com", password: "admin123", role: "Admin" },
    { name: "Mark Manager", email: "mark@company.com", password: "manager123", role: "Manager" },
    { name: "Vicky Viewer", email: "vicky@company.com", password: "viewer123", role: "Viewer" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Viewer", value: "Viewer" },
  ];

  const taxTypes = [
    { label: "GST", value: "GST" },
    { label: "VAT", value: "VAT" },
    { label: "None", value: "None" },
  ];

  const handleAddUser = () => {
    const { name, email, password, role } = newUser;

    if (!name || !email || !password || !role) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please fill in all fields.",
        life: 3000,
      });
      return;
    }

    setUsers([...users, newUser]);
    setNewUser({ name: "", email: "", password: "", role: "" });

    toast.current?.show({
      severity: "success",
      summary: "User Added",
      detail: `${name} added successfully`,
      life: 3000,
    });
  };

  const handleSave = () => {
    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: "Settings updated successfully",
      life: 3000,
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-column w-full ml-3 mr-2">
        <TopNav />
        <div className="p-1 flex-1 overflow-y-auto mb-4">
          <Toast ref={toast} />
          <h2 className="mb-3">Settings</h2>

          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>

            <TabPanel header="Business Profile">
              <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                  <label>Company Name</label>
                  <InputText
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Email</label>
                  <InputText
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Phone</label>
                  <InputText
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label>Address</label>
                  <InputText
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button label="Save" icon="pi pi-check" onClick={handleSave} className="mt-3" />
            </TabPanel>

            <TabPanel header="User Management">
              <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                  <label>Full Name</label>
                  <InputText
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Email</label>
                  <InputText
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Password</label>
                  <InputText
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="Enter password"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Role</label>
                  <Dropdown
                    value={newUser.role}
                    options={roleOptions}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.value })
                    }
                    placeholder="Select role"
                  />
                </div>
                <div className="col-12 md:col-2">
                  <Button
                    label="Add User"
                    icon="pi pi-user-plus"
                    onClick={handleAddUser}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <h5>Current Users</h5>
                {users.length > 0 ? (
                  <ul className="p-0 m-0 list-none">
                    {users.map((user, idx) => (
                      <li key={idx} className="mb-2">
                        <strong>{user.name}</strong> ({user.email}) - <em>{user.role}</em>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No users added yet.</p>
                )}
              </div>
            </TabPanel>

            <TabPanel header="Tax & Invoice Formats">
              <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                  <label>Tax Type</label>
                  <Dropdown
                    value={invoiceSettings.taxType}
                    options={taxTypes}
                    onChange={(e: DropdownChangeEvent) =>
                      setInvoiceSettings({ ...invoiceSettings, taxType: e.value })
                    }
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Invoice Prefix</label>
                  <InputText
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        invoicePrefix: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label>Next Invoice Number</label>
                  <InputText
                    value={invoiceSettings.nextInvoiceNumber.toString()}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        nextInvoiceNumber: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <Button label="Save" icon="pi pi-check" onClick={handleSave} className="mt-3" />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
};