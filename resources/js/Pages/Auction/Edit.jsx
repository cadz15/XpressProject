import React from "react";
import { useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auction, categories }) {
    const { data, setData, put, errors, processing } = useForm({
        title: auction.title || "",
        description: auction.description || "",
        starting_price: auction.starting_price || "",
        ends_at: auction.ends_at || "",
        category_id: auction.category_id || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("auctions.update", auction.id));
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Edit Auction</h1>

                {auction.status === "live" && (
                    <div className="p-4 bg-red-100 text-red-700 rounded mb-6">
                        This auction is live and cannot be edited.
                    </div>
                )}

                {auction.status !== "live" && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full border p-2 rounded"
                            />
                            {errors.title && (
                                <p className="text-red-600 text-sm">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full border p-2 rounded"
                            />
                            {errors.description && (
                                <p className="text-red-600 text-sm">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Starting Price
                            </label>
                            <input
                                type="number"
                                value={data.starting_price}
                                onChange={(e) =>
                                    setData("starting_price", e.target.value)
                                }
                                className="w-full border p-2 rounded"
                            />
                            {errors.starting_price && (
                                <p className="text-red-600 text-sm">
                                    {errors.starting_price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                value={data.ends_at}
                                onChange={(e) =>
                                    setData("ends_at", e.target.value)
                                }
                                className="w-full border p-2 rounded"
                            />
                            {errors.ends_at && (
                                <p className="text-red-600 text-sm">
                                    {errors.ends_at}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Category
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-600 text-sm">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    router.visit(
                                        route("auctions.show", auction.id)
                                    )
                                }
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
