import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { plans, flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Subscription Plans</h1>
                    <Link
                        href={route("admin.plans.create")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        + New Plan
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Interval</th>
                            <th className="p-2 border">Active</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.data.map((plan) => (
                            <tr key={plan.id} className="border-t">
                                <td className="p-2 border">{plan.name}</td>
                                <td className="p-2 border">${plan.price}</td>
                                <td className="p-2 border">{plan.interval}</td>
                                <td className="p-2 border">
                                    {plan.is_active ? "Yes" : "No"}
                                </td>
                                <td className="p-2 border">
                                    <Link
                                        href={route(
                                            "admin.plans.edit",
                                            plan.id
                                        )}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.plans.destroy",
                                            plan.id
                                        )}
                                        method="delete"
                                        as="button"
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4">
                    {plans.links.map((link) => (
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
