import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
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

export default function Invoices() {
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
        if (!selected) return;

        const dialogContent = document.querySelector(".p-dialog-content");
        if (!dialogContent) return;

        const cloned = dialogContent.cloneNode(true) as HTMLElement;

        const content = cloned.innerHTML;

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(`
            <html>
            <head>
                <title>Invoice Print</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2, h3 { margin: 0; }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `);
        doc.close();

        iframe.onload = function () {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 500);
        };
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
        amount.toLocaleString(undefined, { style: "currency", currency: "LKR" });

    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex flex-column w-full ml-3 mr-2">
                <TopNav />
                <div className="p-1 flex-1 overflow-y-auto mb-4">
                    <Toast ref={toast} />
                    <h2>Invoices</h2>
                    <div className="flex justify-content-between align-items-center mb-3">
                        <Button
                            label="New Invoice"
                            icon="pi pi-plus"
                            className="p-button-primary"
                            onClick={handleCreateNew}
                        /*model={[
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
                        ]}*/
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
                                    {/*<Button icon="pi pi-print" tooltip="Print" onClick={() => handlePrint()} text />
                                    <Button icon="pi pi-file-pdf" tooltip="Export PDF" onClick={() => handleExportPDF(rowData)} text severity="secondary" />*/}
                                    <Button icon="pi pi-trash" tooltip="Delete" onClick={() => handleDelete(rowData)} text severity="danger" />
                                </div>
                            )}
                        />
                    </DataTable>

                    <Dialog
                        header={`Invoice Preview`}
                        visible={dialog}
                        onHide={() => setDialog(false)}
                        style={{ width: "45rem" }}
                        draggable={false}
                        footer={
                            <div className="flex justify-content-end gap-2">
                                <Button
                                    label="Print"
                                    icon="pi pi-print"
                                    severity="secondary"
                                    onClick={handlePrint}
                                />
                                <Button
                                    label="Export PDF"
                                    icon="pi pi-file-pdf"
                                    severity="danger"
                                    onClick={() => handleExportPDF(selected!)}
                                />
                            </div>
                        }
                    >
                        {selected && (
                            <div className="p-3">
                                <div className="mb-4">
                                    <h2 className="m-0">Invoice #{selected.invoiceNumber}</h2>
                                    <p className="text-sm text-gray-600 mt-1">Reference: {selected.reference}</p>
                                </div>

                                <div className="grid mb-4">
                                    <div className="col-6">
                                        <h4 className="m-0">Customer</h4>
                                        <p className="mt-2 text-sm">{selected.contactName}</p>
                                    </div>

                                    <div className="col-6">
                                        <h4 className="m-0">Invoice Details</h4>
                                        <p className="mt-2 text-sm">
                                            <strong>Date:</strong> {getDate(selected.date)} <br />
                                            <strong>Due Date:</strong> {getDate(selected.dueDate)} <br />
                                            <strong>Amount Type:</strong> {selected.amountTypeName} <br />
                                            <strong>Payment Type:</strong> {selected.paymentTypeName}
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="flex justify-content-between align-items-center mt-4">
                                    <h3 className="m-0">Total</h3>
                                    <h2 className="m-0" style={{ color: "#0f6bff" }}>
                                        {formatAmount(selected.total)}
                                    </h2>
                                </div>
                            </div>
                        )}
                    </Dialog>

                    <Dialog
                        header={isEditing ? "Edit Invoice" : "Create New Invoice"}
                        visible={formDialog}
                        onHide={() => setFormDialog(false)}
                        style={{ width: "40vw" }}
                        draggable={false}
                    >
                        <div className="p-fluid formgrid grid gap-3">
                            <div className="col-12">
                                <label className="flex mb-2 ml-1" htmlFor="Invoice Number">Invoice Number</label>
                                <InputText
                                    className="w-full"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    placeholder="Invoice Number"
                                />
                            </div>
                            <div className="col-12">
                                <label className="flex mb-2 ml-1" htmlFor="Reference">Reference</label>
                                <InputText
                                    className="w-full"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="Reference"
                                />
                            </div>
                            <div className="col-12">
                                <label className="flex mb-2 ml-1" htmlFor="Customer Name">Customer Name</label>
                                <InputText
                                    className="w-full"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="Customer Name"
                                />
                            </div>
                            <div className="grid col-12 mt-1">
                                <div className="col-6">
                                    <label className="flex mb-2 ml-1" htmlFor="Invoice Date">Invoice Date</label>
                                    <Calendar
                                        className="w-full"
                                        value={new Date(formData.date)}
                                        onChange={(e) => setFormData({ ...formData, date: (e.value as Date).toISOString() })}
                                        showIcon
                                        placeholder="Invoice Date"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="flex mb-2 ml-1" htmlFor="Due Date">Due Date</label>
                                    <Calendar
                                        className="w-full"
                                        value={new Date(formData.dueDate)}
                                        onChange={(e) => setFormData({ ...formData, dueDate: (e.value as Date).toISOString() })}
                                        showIcon
                                        placeholder="Due Date"
                                    />
                                </div>
                            </div>
                            <div className="grid col-12 mt-1">
                                <div className="col-6">
                                    <label className="flex mb-2 ml-1" htmlFor="Amount Type">Amount Type</label>
                                    <Dropdown
                                        className="w-full"
                                        value={formData.amountTypeName}
                                        options={["Exclusive", "Inclusive"]}
                                        onChange={(e) => setFormData({ ...formData, amountTypeName: e.value })}
                                        placeholder="Amount Type"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="flex mb-2 ml-1" htmlFor="Payment Method">Payment Method</label>
                                    <Dropdown
                                        className="w-full"
                                        value={formData.paymentTypeName}
                                        options={["Cash", "Card", "Bank Transfer"]}
                                        onChange={(e) => setFormData({ ...formData, paymentTypeName: e.value })}
                                        placeholder="Payment Method"
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="flex mb-2 ml-1" htmlFor="Total Amount">Total Amount</label>
                                <InputNumber
                                    className="w-full"
                                    value={formData.total}
                                    onValueChange={(e) => setFormData({ ...formData, total: e.value ?? 0 })}
                                    mode="currency"
                                    currency="LKR"
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