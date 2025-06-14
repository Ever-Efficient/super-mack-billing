import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import TopNav from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';

import type { FileUploadHandlerEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";

interface ProductData {
    id: string;
    name: string;
    category: string;
    price: number | null;
    stock: number | null;
    barcode?: string;
}

const defaultProduct: ProductData = {
    id: "00000000-0000-0000-0000-000000000000",
    name: "",
    category: "",
    price: null,
    stock: null,
    barcode: "",
};

const categories = [
    { label: "Electronics", value: "Electronics" },
    { label: "Clothing", value: "Clothing" },
    { label: "Grocery", value: "Grocery" },
];

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState<ProductData>({ ...defaultProduct });
    const toast = useRef<Toast>(null);
    const [globalFilter, setGlobalFilter] = useState("");

    const openNew = () => {
        setFormData({ ...defaultProduct });
        setSelectedProduct(null);
        setModalVisible(true);
    };

    const openEdit = (product: ProductData) => {
        setFormData(product);
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.current?.show({ severity: "warn", summary: "Validation", detail: "Name is required", life: 2500 });
            return false;
        }
        if (!formData.category) {
            toast.current?.show({ severity: "warn", summary: "Validation", detail: "Category is required", life: 2500 });
            return false;
        }
        if (formData.price === null || formData.price < 0) {
            toast.current?.show({ severity: "warn", summary: "Validation", detail: "Valid Price is required", life: 2500 });
            return false;
        }
        if (formData.stock === null || formData.stock < 0) {
            toast.current?.show({ severity: "warn", summary: "Validation", detail: "Valid Stock is required", life: 2500 });
            return false;
        }
        return true;
    };

    const saveProduct = () => {
        if (!validateForm()) return;

        let updatedProducts = [...products];

        if (selectedProduct) {
            updatedProducts = updatedProducts.map((p) => (p.id === selectedProduct.id ? formData : p));
            toast.current?.show({ severity: "success", summary: "Updated", detail: "Product updated", life: 2500 });
        } else {
            const newProduct = { ...formData, id: crypto.randomUUID() };
            updatedProducts.push(newProduct);
            toast.current?.show({ severity: "success", summary: "Created", detail: "Product added", life: 2500 });
        }

        setProducts(updatedProducts);
        setModalVisible(false);
    };

    const handleFileUpload = (e: FileUploadHandlerEvent) => {
        const file = e.files[0];
        setFormData((prev) => ({ ...prev, barcode: file.name }));
        toast.current?.show({
            severity: "info",
            summary: "Barcode Uploaded",
            detail: file.name,
            life: 2000,
        });
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setModalVisible(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} autoFocus />
        </>
    );

    const actionBodyTemplate = (rowData: ProductData) => {
        return (
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => openEdit(rowData)} aria-label="Edit" />
        );
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex flex-column w-full ml-6 mr-4">
                <TopNav />
                <div className="p-1 flex-1 overflow-y-auto mb-4">
                    <Toast ref={toast} />
                    <div className="flex justify-content-between align-items-center">
                        <h2>Products</h2>
                    </div>

                    <div className="flex justify-content-between align-items-center mb-3">
                        <Button label="Add Product" icon="pi pi-box" onClick={openNew} />
                        <InputText
                            placeholder="Search"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-inputtext-sm"
                        />
                    </div>

                    <DataTable
                        value={products}
                        globalFilter={globalFilter}
                        responsiveLayout="scroll"
                        emptyMessage="No products found."
                    >
                        <Column field="name" header="Name" sortable />
                        <Column field="category" header="Category" sortable />
                        <Column
                            field="price"
                            header="Price"
                            body={(row) => (row.price != null ? `$${row.price.toFixed(2)}` : "")}
                            sortable
                        />
                        <Column field="stock" header="Stock" sortable />
                        <Column
                            header="Barcode"
                            body={(row) => (row.barcode ? <span>{row.barcode}</span> : <i>No Barcode</i>)}
                        />
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: "80px" }} />
                    </DataTable>

                    <Dialog header={selectedProduct ? "Edit Product" : "Add Product"} visible={modalVisible} style={{ width: "400px" }} onHide={() => setModalVisible(false)} footer={dialogFooter} modal>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 mb-3">
                                <label htmlFor="name">Name*</label>
                                <InputText id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="field col-12 mb-3">
                                <label htmlFor="category">Category*</label>
                                <Dropdown
                                    id="category"
                                    value={formData.category}
                                    options={categories}
                                    onChange={(e) => setFormData({ ...formData, category: e.value })}
                                    placeholder="Select Category"
                                />
                            </div>

                            <div className="field col-12 mb-3">
                                <label htmlFor="price">Price*</label>
                                <InputNumber
                                    id="price"
                                    value={formData.price}
                                    onValueChange={(e) => setFormData({ ...formData, price: e.value ?? null })}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    min={0}
                                    showButtons
                                    buttonLayout="horizontal"
                                    incrementButtonClassName="p-button-text"
                                    decrementButtonClassName="p-button-text"
                                />
                            </div>

                            <div className="field col-12 mb-3">
                                <label htmlFor="stock">Stock*</label>
                                <InputNumber
                                    id="stock"
                                    value={formData.stock}
                                    onValueChange={(e) => setFormData({ ...formData, stock: e.value ?? null })}
                                    min={0}
                                    showButtons
                                />
                            </div>

                            <div className="field col-12 mb-3">
                                <label>Barcode (optional)</label>
                                <FileUpload
                                    name="barcode"
                                    customUpload
                                    uploadHandler={handleFileUpload}
                                    mode="basic"
                                    chooseLabel="Upload Barcode"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    auto
                                    emptyTemplate={<p className="m-0">No file chosen.</p>}
                                />
                                {formData.barcode && <small>Uploaded: {formData.barcode}</small>}
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;