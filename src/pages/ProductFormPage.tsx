import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import TopNav from "../components/Topbar";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const ProductFormPage = () => {
  const [productData, setProductData] = useState<{
    name: string;
    category: string;
    price: string;
    stock: string;
    barcode: number | null;
  }>({
    name: "",
    category: "",
    price: "",
    stock: "",
    barcode: null,
  });

  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
    { label: "Grocery", value: "grocery" },
  ];

  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Submitted:", productData);

    const formattedProduct = {
      id: crypto.randomUUID(),
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      barcode: productData.barcode?.toString() || "",
    };

    navigate("/products", { state: { newProduct: formattedProduct } });
  };


  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-column w-full ml-3 mr-2">
        <TopNav />
        <Card className="mt-2" title="Add Product Details">
          <div className="p-fluid formgrid">
            <div className="grid col-12">
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="name">Name*</label>
                <InputText
                  id="name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="category">Category</label>
                <Dropdown
                  id="category"
                  value={productData.category}
                  options={categories}
                  onChange={(e) => setProductData({ ...productData, category: e.value })}
                  placeholder="Select Category"
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="price">Price*</label>
                <InputText
                  id="price"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="stock">Stock*</label>
                <InputText
                  id="stock"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                />
              </div>
              <div className="field col-6 mb-3">
                <label className="ml-1" htmlFor="barcode">Barcode</label>
                <InputNumber
                  id="barcode"
                  value={productData.barcode}
                  onValueChange={(e) => setProductData({ ...productData, barcode: e.value ?? null })}
                  min={0}
                />
              </div>
            </div>
            <div className="flex col-3 mt-2">
              <Button label="Add Product" icon="pi pi-check" onClick={handleSubmit} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductFormPage;
