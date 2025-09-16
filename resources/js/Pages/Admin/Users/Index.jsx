import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { users, filters, flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");
    const [status, setStatus] = useState(filters.status || "");
    const [sortBy, setSortBy] = useState(filters.sortBy || "created_at");
    const [sortDir, setSortDir] = useState(filters.sortDir || "desc");

    const applyFilters = () => {
        router.get(
            route("admin.users.index"),
            { search, role, status, sortBy, sortDir },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">User Management</h1>

                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name/email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                    </select>

                    {/* Sorting */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="created_at">Created Date</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="id">ID</option>
                    </select>

                    <select
                        value={sortDir}
                        onChange={(e) => setSortDir(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Apply
                    </button>
                </div>

                {/* Users Table */}
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Created</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-2 border">{user.id}</td>
                                <td className="p-2 border">{user.name}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">
                                    {user.is_admin ? "Admin" : "User"}
                                </td>
                                <td className="p-2 border">
                                    {user.is_banned ? (
                                        <span className="text-red-600">
                                            Banned
                                        </span>
                                    ) : (
                                        <span className="text-green-600">
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="p-2 border space-x-2">
                                    <Link
                                        href={route(
                                            "admin.users.toggleAdmin",
                                            user.id
                                        )}
                                        method="patch"
                                        as="button"
                                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        {user.is_admin
                                            ? "Revoke Admin"
                                            : "Make Admin"}
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.users.toggleBan",
                                            user.id
                                        )}
                                        method="patch"
                                        as="button"
                                        className={`px-3 py-1 rounded ${
                                            user.is_banned
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        } text-white`}
                                    >
                                        {user.is_banned ? "Unban" : "Ban"}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4">
                    {users.links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.url || "#"}
                            className={`px-2 ${
                                link.active
                                    ? "font-bold text-blue-600"
                                    : "text-gray-600"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
