import { useEffect, useState } from 'react';
import { User } from '../../types/user';
import AdminUserService from '../../services/AdminUserService';
import React from 'react';
import { Button } from '@material-ui/core';

export function AdminUserPanel() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        AdminUserService.getUsers()
            .then(res => setUsers(res))
    }, []);

    return (<div className="p-4 bg-opacity-25 bg-gray-500 rounded-md">
        <div className="mb-4">
            <span className="font-bold text-xl mr-auto">User Panel</span>

        </div>
        <div className="grid grid-cols-4 max-h-80">
            <div className="text-lg px-1.5 py-2 border-gray-500 border-b-gray-300 border">Name</div>
            <div className="text-lg px-1.5 py-2 border-gray-500 border-b-gray-300 border">Email</div>
            <div className="text-lg px-1.5 py-2 border-gray-500 border-b-gray-300 border">Verified</div>
            <div className="text-lg px-1.5 py-2 border-gray-500 border-b-gray-300 border">Role</div>
            {users.map(user => <React.Fragment key={user._id}>
                <div className="px-1.5 py-2 border-gray-500 border">{user.name}</div>
                <div className="px-1.5 py-2 border-gray-500 border">{user.email}</div>
                <div className="px-1.5 py-2 border-gray-500 border">{user.verified ? 'Yes' : 'No'}</div>
                <div className="px-1.5 border-gray-500 border flex items-center">
                    <div>{user.isAdmin ? 'Admin' : 'User'}</div>
                    <Button variant="outlined" color="inherit" size="small" className="ml-auto my-auto"
                        onClick={() => {
                            AdminUserService.setUserData({ id: user._id, data: { isAdmin: !user.isAdmin } })
                                .then(() => {
                                    AdminUserService.getUsers()
                                        .then(res => setUsers(res))
                                })
                                .catch(err => {
                                    alert('Error: ' + (err?.message ?? err));
                                })
                        }}>
                        {user.isAdmin ? 'Demote' : 'Promote'}
                    </Button>
                </div>
            </React.Fragment>)}
        </div>
    </div>);
}
