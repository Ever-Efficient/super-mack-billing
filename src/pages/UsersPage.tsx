import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Topbar from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';
import { usersData as initialUsers } from '../assets/data/userdata';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [visible, setVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [userForm, setUserForm] = useState<Partial<User>>({ id: '', name: '', email: '', role: '' });

    const openAddDialog = () => {
        setIsEditMode(false);
        setUserForm({ id: '', name: '', email: '', role: '' });
        setVisible(true);
    };

    const openEditDialog = (user: User) => {
        setIsEditMode(true);
        setEditingUser({ id: user.id });
        setUserForm({ name: user.name, role: user.role, email: user.email });
        setVisible(true);
    };

    const handleSaveUser = () => {
        if (!userForm.name || !userForm.role) return;

        if (isEditMode && editingUser?.id) {
            const updatedUsers = users.map(u =>
                u.id === editingUser.id ? { ...u, name: userForm.name!, role: userForm.role! } : u
            );
            setUsers(updatedUsers);
        } else {
            const newUser: User = {
                id: crypto.randomUUID(),
                name: userForm.name || '',
                email: userForm.email || `user${Math.floor(Math.random() * 100)}@demo.com`,
                role: userForm.role || ''
            };

            setUsers([...users, newUser]);
        }

        setVisible(false);
        setUserForm({ name: '', email: '', role: '' });
        setEditingUser(null);
        setIsEditMode(false);
    };

    const handleDeleteUser = (userId: string) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-column flex-1">
                <Topbar />
                <div className='p-4'>
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h3>Users</h3>
                        <Button
                            label="Add User"
                            icon="pi pi-user-plus"
                            onClick={openAddDialog}
                            className="p-button p-3"
                            style={{
                                backgroundColor: '#000000',
                                color: '#FFE1E2',
                                border: 'none',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFE1E2';
                                e.currentTarget.style.color = '#000000';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#000000';
                                e.currentTarget.style.color = '#FFE1E2';
                            }}
                        />
                    </div>

                    <DataTable value={users} paginator rows={5} className="p-datatable-sm">
                        <Column field="id" header="ID" style={{ width: '120px' }} />
                        <Column field="name" header="Name" />
                        <Column field="email" header="Email" />
                        <Column field="role" header="Role" />
                        <Column
                            header="Actions"
                            body={(rowData: User) => (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-text p-button-sm"
                                        onClick={() => openEditDialog(rowData)}
                                        disabled={rowData.role.toLowerCase() === 'admin'}
                                        tooltip={rowData.role.toLowerCase() === 'admin' ? 'Admin user cannot be edited' : ''}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-sm"
                                        severity="danger"
                                        onClick={() => handleDeleteUser(rowData.id)}
                                        disabled={rowData.role.toLowerCase() === 'admin'}
                                        tooltip={rowData.role.toLowerCase() === 'admin' ? 'Admin user cannot be deleted' : ''}
                                    />
                                </div>
                            )}
                        />
                    </DataTable>

                    <Dialog
                        header={isEditMode ? 'Edit User' : 'Add User'}
                        visible={visible}
                        onHide={() => setVisible(false)}
                        style={{ width: '400px' }}
                    >
                        <div className="flex flex-column gap-3">
                            <InputText
                                placeholder="Name"
                                value={userForm.name}
                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                            />
                            {!isEditMode && (
                                <InputText
                                    placeholder="Email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                />
                            )}
                            <InputText
                                placeholder="Role"
                                value={userForm.role}
                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            />
                            <Button
                                label={isEditMode ? 'Update' : 'Add'}
                                icon="pi pi-check"
                                className="p-button-sm"
                                onClick={handleSaveUser}
                            />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}