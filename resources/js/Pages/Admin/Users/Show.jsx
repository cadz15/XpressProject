import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show() {
    const { user } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-bold mb-4">User Details</h1>

                <div className="space-y-2">
                    <p>
                        <strong>ID:</strong> {user.id}
                    </p>
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Role:</strong>{" "}
                        {user.is_admin ? "Admin" : "User"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {user.is_banned ? "Banned" : "Active"}
                    </p>
                </div>

                <div className="mt-6">
                    <Link
                        href={route("admin.users.index")}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
