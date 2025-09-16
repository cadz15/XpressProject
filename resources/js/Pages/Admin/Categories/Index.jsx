import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { categories, flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link
                        href={route("admin.categories.create")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        + New Category
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
                            <th className="p-2 border">Slug</th>
                            <th className="p-2 border">Parent</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.data.map((cat) => (
                            <tr key={cat.id} className="border-t">
                                <td className="p-2 border">{cat.name}</td>
                                <td className="p-2 border">{cat.slug}</td>
                                <td className="p-2 border">
                                    {cat.parent?.name ?? "-"}
                                </td>
                                <td className="p-2 border">
                                    <Link
                                        href={route(
                                            "admin.categories.edit",
                                            cat.id
                                        )}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.categories.destroy",
                                            cat.id
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
                    {categories.links.map((link) => (
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
