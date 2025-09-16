import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { parents } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        parent_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"));
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-bold mb-6">Create Category</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.name && (
                            <div className="text-red-600 text-sm">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Parent Category</label>
                        <select
                            value={data.parent_id}
                            onChange={(e) =>
                                setData("parent_id", e.target.value)
                            }
                            className="w-full border rounded p-2"
                        >
                            <option value="">None</option>
                            {parents.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        {errors.parent_id && (
                            <div className="text-red-600 text-sm">
                                {errors.parent_id}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                        <Link
                            href={route("admin.categories.index")}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
