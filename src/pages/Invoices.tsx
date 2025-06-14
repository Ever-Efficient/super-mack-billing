import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import TopNav from "../components/Topbar";
import { Sidebar } from "../components/Sidebar";

interface Invoice {
    id: string;
    invoiceNumber: string;
    reference: string;
    contactName: string;
    date: string;
    dueDate: string;
    amountTypeName: string;
    paymentTypeName: string;
    total: number;
}

const Invoices = () => {
    const toast = useRef<Toast>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [dialog, setDialog] = useState(false);
    const [formDialog, setFormDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selected, setSelected] = useState<Invoice | null>(null);

    const [formData, setFormData] = useState<Omit<Invoice, "id"> | Invoice>({
        invoiceNumber: "",
        reference: "",
        contactName: "",
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        amountTypeName: "Exclusive",
        paymentTypeName: "Cash",
        total: 0,
    });

    const [filters, setFilters] = useState({
        search: "",
    });

    useEffect(() => {
        setInvoices([
            {
                id: crypto.randomUUID(),
                invoiceNumber: "INV-1001",
                reference: "REF-2023-001",
                contactName: "John Doe",
                date: new Date().toISOString(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
                amountTypeName: "Exclusive",
                paymentTypeName: "Cash",
                total: 1250.75,
            },
            {
                id: crypto.randomUUID(),
                invoiceNumber: "INV-1002",
                reference: "REF-2023-002",
                contactName: "Jota Smith",
                date: new Date().toISOString(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
                amountTypeName: "Exclusive",
                paymentTypeName: "Cash",
                total: 1700.75,
            },
        ]);
    }, []);

    const handleDelete = (invoice: Invoice) => {
        setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
        toast.current?.show({ severity: "success", summary: "Deleted", detail: `Invoice ${invoice.invoiceNumber} deleted.` });
    };

    const handlePreview = (invoice: Invoice) => {
        setSelected(invoice);
        setDialog(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = (invoice: Invoice) => {
        toast.current?.show({ severity: "info", summary: "Export", detail: `Exported Invoice ${invoice.invoiceNumber} to PDF.` });
    };

    const handleCreateNew = () => {
        setFormData({
            invoiceNumber: "",
            reference: "",
            contactName: "",
            date: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            amountTypeName: "Exclusive",
            paymentTypeName: "Cash",
            total: 0,
        });
        setIsEditing(false);
        setFormDialog(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setFormData(invoice);
        setIsEditing(true);
        setFormDialog(true);
    };

    const submitNewInvoice = () => {
        if (isEditing) {
            setInvoices((prev) =>
                prev.map((inv) => (inv.id === (formData as Invoice).id ? { ...(formData as Invoice) } : inv))
            );
            toast.current?.show({ severity: "success", summary: "Updated", detail: "Invoice updated." });
        } else {
            const newInvoice: Invoice = {
                ...(formData as Omit<Invoice, "id">),
                id: crypto.randomUUID(),
            };
            setInvoices((prev) => [...prev, newInvoice]);
            toast.current?.show({ severity: "success", summary: "Created", detail: "Invoice created." });
        }
        setFormDialog(false);
    };

    const filterInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const searchText = filters.search.toLowerCase();

            const globalMatch = Object.values(inv).some((val) =>
                String(val).toLowerCase().includes(searchText)
            );

            return globalMatch;
        });
    }, [filters, invoices]);

    const getDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    const formatAmount = (amount: number) =>
        amount.toLocaleString(undefined, { style: "currency", currency: "USD" });

    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex flex-column w-full ml-6 mr-4">
                <TopNav />
                <div className="p-1 flex-1 overflow-y-auto mb-4">
                    <Toast ref={toast} />
                    <h2>Invoices</h2>
                    <div className="flex justify-content-between align-items-center mb-3">
                        <SplitButton
                            label="New Invoice"
                            icon="pi pi-plus"
                            className="p-button-primary"
                            onClick={handleCreateNew}
                            model={[
                                {
                                    label: "Import",
                                    icon: "pi pi-upload",
                                    command: () =>
                                        toast.current?.show({
                                            severity: "info",
                                            summary: "Import",
                                            detail: "Import dialog coming soon",
                                        }),
                                },
                            ]}
                        />
                        <InputText
                            placeholder="Search"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <DataTable
                        value={filterInvoices}
                        paginator
                        rows={10}
                        className="text-sm"
                        emptyMessage="No invoices found."
                    >
                        <Column field="invoiceNumber" header="Invoice #" sortable />
                        <Column field="reference" header="Reference #" />
                        <Column field="contactName" header="Customer" sortable />
                        <Column field="date" header="Date" body={(rowData) => getDate(rowData.date)} sortable />
                        <Column field="dueDate" header="Due Date" body={(rowData) => getDate(rowData.dueDate)} sortable />
                        <Column field="total" header="Total" body={(rowData) => formatAmount(rowData.total)} sortable />
                        <Column
                            header="Actions"
                            body={(rowData) => (
                                <div className="flex gap-2">
                                    <Button icon="pi pi-eye" tooltip="View" onClick={() => handlePreview(rowData)} text severity="info" />
                                    <Button icon="pi pi-pencil" tooltip="Edit" onClick={() => handleEdit(rowData)} text severity="warning" />
                                    <Button icon="pi pi-print" tooltip="Print" onClick={() => handlePrint()} text />
                                    <Button icon="pi pi-file-pdf" tooltip="Export PDF" onClick={() => handleExportPDF(rowData)} text severity="secondary" />
                                    <Button icon="pi pi-trash" tooltip="Delete" onClick={() => handleDelete(rowData)} text severity="danger" />
                                </div>
                            )}
                        />
                    </DataTable>

                    <Dialog header="Invoice Preview" visible={dialog} onHide={() => setDialog(false)} style={{ width: "50vw" }}>
                        <pre>{JSON.stringify(selected, null, 2)}</pre>
                    </Dialog>

                    <Dialog
                        header={isEditing ? "Edit Invoice" : "Create New Invoice"}
                        visible={formDialog}
                        onHide={() => setFormDialog(false)}
                        style={{ width: "40vw" }}
                    >
                        <div className="p-fluid formgrid grid">
                            <div className="col-12">
                                <InputText
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    placeholder="Invoice Number"
                                />
                            </div>
                            <div className="col-12">
                                <InputText
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="Reference"
                                />
                            </div>
                            <div className="col-12">
                                <InputText
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="Customer Name"
                                />
                            </div>
                            <div className="col-6">
                                <Calendar
                                    value={new Date(formData.date)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: (e.value as Date).toISOString() })
                                    }
                                    showIcon
                                    placeholder="Invoice Date"
                                />
                            </div>
                            <div className="col-6">
                                <Calendar
                                    value={new Date(formData.dueDate)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dueDate: (e.value as Date).toISOString() })
                                    }
                                    showIcon
                                    placeholder="Due Date"
                                />
                            </div>
                            <div className="col-6">
                                <Dropdown
                                    value={formData.amountTypeName}
                                    options={["Exclusive", "Inclusive"]}
                                    onChange={(e) => setFormData({ ...formData, amountTypeName: e.value })}
                                    placeholder="Amount Type"
                                />
                            </div>
                            <div className="col-6">
                                <Dropdown
                                    value={formData.paymentTypeName}
                                    options={["Cash", "Card", "Bank Transfer"]}
                                    onChange={(e) => setFormData({ ...formData, paymentTypeName: e.value })}
                                    placeholder="Payment Method"
                                />
                            </div>
                            <div className="col-12">
                                <InputNumber
                                    value={formData.total}
                                    onValueChange={(e) =>
                                        setFormData({ ...formData, total: e.value ?? 0 })
                                    }
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    placeholder="Total Amount"
                                />
                            </div>
                        </div>
                        <div className="flex justify-content-end gap-2 mt-4">
                            <Button label="Cancel" onClick={() => setFormDialog(false)} className="p-button-secondary" />
                            <Button label={isEditing ? "Update" : "Create"} onClick={submitNewInvoice} autoFocus />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Invoices;