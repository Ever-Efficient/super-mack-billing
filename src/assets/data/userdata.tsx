export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Viewer";
}

export const usersData: User[] = [
  {
    id: "1",
    name: "Alice Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "Admin",
  },
  {
    id: "2",
    name: "Mark Manager",
    email: "manager@company.com",
    password: "manager123",
    role: "Manager",
  },
  {
    id: " 3",
    name: "Vicky Viewer",
    email: "viewer@company.com",
    password: "viewer123",
    role: "Viewer",
  },
];
