import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { bundle } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: bundle.name || "",
        tokens: bundle.tokens || "",
        price: bundle.price || "",
        is_active: bundle.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.bundles.update", bundle.id));
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-bold mb-6">Edit Token Bundle</h1>

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
                        <label className="block mb-1">Tokens</label>
                        <input
                            type="number"
                            value={data.tokens}
                            onChange={(e) => setData("tokens", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.tokens && (
                            <div className="text-red-600 text-sm">
                                {errors.tokens}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.price && (
                            <div className="text-red-600 text-sm">
                                {errors.price}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                        />
                        <label>Active</label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Update
                        </button>
                        <Link
                            href={route("admin.bundles.index")}
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
