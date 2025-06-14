import { useState, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import TopNav from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';

const Settings = () => {
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

  const [userSettings, setUserSettings] = useState({
    maxUsers: 5,
    allowInvites: true,
  });

  const taxTypes = [
    { label: "GST", value: "GST" },
    { label: "VAT", value: "VAT" },
    { label: "None", value: "None" },
  ];

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
      <div className="flex flex-column w-full ml-6 mr-4">
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
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </div>
            <div className="col-12 md:col-6">
              <label>Email</label>
              <InputText
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="col-12 md:col-6">
              <label>Phone</label>
              <InputText
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label>Address</label>
              <InputText
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
          </div>
          <Button label="Save" icon="pi pi-check" onClick={handleSave} className="mt-3" />
        </TabPanel>

        <TabPanel header="User Management">
          <div className="grid p-fluid">
            <div className="col-12 md:col-6">
              <label>Maximum Users</label>
              <InputText
                value={userSettings.maxUsers.toString()}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, maxUsers: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="col-12">
              <Checkbox
                inputId="invites"
                checked={userSettings.allowInvites}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, allowInvites: e.checked ?? false })
                }
              />
              <label htmlFor="invites" className="ml-2">
                Allow user invites
              </label>
            </div>
          </div>
          <Button label="Save" icon="pi pi-check" onClick={handleSave} className="mt-3" />
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
                  setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })
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

export default Settings;