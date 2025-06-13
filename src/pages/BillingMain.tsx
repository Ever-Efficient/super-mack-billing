import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

interface Item {
  id: string;
  name: string;
  barcode: string;
  price: number;
}

interface InvoiceLine {
  lineId: string;
  item: Item;
  qty: number;
  price: number;
}

const MOCK_ITEMS: Item[] = [
  { id: "1", name: "Apple", barcode: "111", price: 1.0 },
  { id: "2", name: "Banana", barcode: "222", price: 0.5 },
  // ... more catalog items
];

export default function BillingPOS() {
  const toast = useRef<Toast>(null);
  const [catalog] = useState<Item[]>(MOCK_ITEMS);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);

  const addItemToInvoice = (item: Item) => {
    const existing = invoiceLines.find((l) => l.item.id === item.id);
    if (existing) {
      setInvoiceLines((lines) =>
        lines.map((l) =>
          l.lineId === existing.lineId
            ? { ...l, qty: l.qty + 1 }
            : l
        )
      );
    } else {
      setInvoiceLines((lines) => [
        ...lines,
        { lineId: Date.now().toString(), item, qty: 1, price: item.price },
      ]);
    }
  };

  const onBarcodeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && barcodeInput.trim()) {
      const found = catalog.find((it) => it.barcode === barcodeInput.trim());
      if (found) addItemToInvoice(found);
      else toast.current?.show({ severity: "error", summary: "Not Found", detail: "Barcode not found" });
      setBarcodeInput("");
    }
  };

  const subtotal = invoiceLines.reduce((acc, l) => acc + l.qty * l.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const updateLine = (lineId: string, field: "qty" | "price", val: number) => {
    setInvoiceLines((lines) =>
      lines.map((l) =>
        l.lineId === lineId ? { ...l, [field]: val } : l
      )
    );
  };

  const removeLine = (lineId: string) => {
    setInvoiceLines((lines) => lines.filter((l) => l.lineId !== lineId));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    localStorage.setItem("lastInvoice", JSON.stringify({ date: new Date(), invoiceLines }));
    toast.current?.show({ severity: "success", summary: "Saved", detail: "Invoice stored locally" });
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <h2>Billing / POS</h2>

      {/* --- Input Row --- */}
      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <InputText
          placeholder="Scan barcode & Enter"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={onBarcodeKey}
        />

        <InputText
          placeholder="Search item..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            const found = catalog.find((it) => it.name.toLowerCase().includes(e.target.value.toLowerCase()));
            if (found) { addItemToInvoice(found); setSearchInput(""); }
          }}
        />
      </div>

      {/* --- Invoice Table --- */}
      <DataTable value={invoiceLines} className="w-full mb-4">
        <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: "3rem" }}/>
        <Column field="item.name" header="Item" />
        <Column
          header="Qty"
          body={(row: InvoiceLine) => (
            <InputText
              type="number"
              value={String(row.qty)}
              onChange={(e) => updateLine(row.lineId, "qty", +e.target.value)}
              style={{ width: "4rem" }}
            />
          )}
        />
        <Column
          header="Price"
          body={(row: InvoiceLine) => (
            <InputText
              type="number"
              value={String(row.price)}
              step="0.01"
              onChange={(e) => updateLine(row.lineId, "price", +e.target.value)}
              style={{ width: "6rem" }}
            />
          )}
        />
        <Column header="Line Total" body={(r) => `$${(r.qty * r.price).toFixed(2)}`} />
        <Column header="Actions" body={(row) => <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => removeLine(row.lineId)}/>} />
      </DataTable>

      {/* --- Totals & Operations --- */}
      <div className="flex justify-content-end mb-2">
        <div className="mr-8">Subtotal: <b>${subtotal.toFixed(2)}</b></div>
        <div className="mr-8">Tax 10%: <b>${tax.toFixed(2)}</b></div>
        <div>Total: <b>${total.toFixed(2)}</b></div>
      </div>

      <div className="flex gap-2 justify-content-end">
        <Button label="Save Invoice" icon="pi pi-save" onClick={handleSave} />
        <Button label="Print Invoice" icon="pi pi-print" onClick={handlePrint} />
      </div>
    </div>
  );
}