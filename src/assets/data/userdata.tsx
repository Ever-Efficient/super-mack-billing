export interface User {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Viewer";
}

export const usersData: User[] = [
  {
    name: "Alice Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "Admin",
  },
  {
    name: "Mark Manager",
    email: "manager@company.com",
    password: "manager123",
    role: "Manager",
  },
  {
    name: "Vicky Viewer",
    email: "viewer@company.com",
    password: "viewer123",
    role: "Viewer",
  },
];
