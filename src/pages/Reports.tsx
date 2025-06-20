import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TopNav from "../components/Topbar";
import { Sidebar } from "../components/Sidebar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const customers = ["John Doe", "Jane Smith", "Michael Brown"];
const products = ["Product A", "Product B", "Product C"];

const dummyData = [
    { date: "2024-08-01", customer: "John Doe", product: "Product A", total: 700 },
    { date: "2024-08-02", customer: "Jane Smith", product: "Product B", total: 500 },
    { date: "2024-08-03", customer: "Michael Brown", product: "Product C", total: 500 },
];

const Reports = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const filteredData = dummyData.filter((item) => {
        const matchesCustomer = !selectedCustomer || item.customer === selectedCustomer;
        const matchesProduct = !selectedProduct || item.product === selectedProduct;
        return matchesCustomer && matchesProduct;
    });

    const chartData = {
        labels: filteredData.map((d) => d.date),
        datasets: [
            {
                label: "Sales",
                data: filteredData.map((d) => d.total),
                fill: false,
                borderColor: "#42A5F5",
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const formatDateTime = (date: Date) =>
        date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["Date", "Customer", "Product", "Total"]],
            body: filteredData.map((item) => [
                item.date,
                item.customer,
                item.product,
                item.total.toFixed(2),
            ]),
        });
        doc.save("sales-report.pdf");
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
        XLSX.writeFile(workbook, "sales-report.xlsx");
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex flex-column w-full ml-3 mr-2">
                <TopNav />
                <div className="p-1 flex-1 overflow-y-auto mb-4">
                    <h2>Reports</h2>
                    <div className="flex align-items-end justify-content-between flex-wrap gap-4 mb-4">
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex flex-column">
                                <label htmlFor="customer">Customer:</label>
                                <Dropdown
                                    id="customer"
                                    value={selectedCustomer}
                                    options={customers}
                                    onChange={(e) => setSelectedCustomer(e.value)}
                                    placeholder="Select a customer"
                                />
                            </div>

                            <div className="flex flex-column">
                                <label htmlFor="product">Product:</label>
                                <Dropdown
                                    id="product"
                                    value={selectedProduct}
                                    options={products}
                                    onChange={(e) => setSelectedProduct(e.value)}
                                    placeholder="Select a product"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Button label="Update" icon="pi pi-refresh" className="p-button-info" />
                            <Button label="PDF" icon="pi pi-file-pdf" className="p-button-success" onClick={exportPDF} />
                            <Button label="Excel" icon="pi pi-file-excel" className="p-button-success" onClick={exportExcel} />
                        </div>
                    </div>

                    <Card className="mb-4">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-500">Generated on {formatDateTime(new Date())}</p>
                            <h2 className="m-0">Profit and Loss</h2>
                            <h3 className="m-1 font-bold">Dev-v1</h3>
                        </div>

                        <DataTable value={filteredData} className="mb-4" stripedRows>
                            <Column field="date" header="Date" sortable />
                            <Column field="customer" header="Customer" sortable />
                            <Column field="product" header="Product" sortable />
                            <Column field="total" header="Total" sortable body={(rowData) => rowData.total.toFixed(2)} />
                        </DataTable>

                        <h4 className="mt-4">Sales Chart</h4>
                        <Chart type="line" data={chartData} options={chartOptions} className="w-full md:w-31rem" />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;