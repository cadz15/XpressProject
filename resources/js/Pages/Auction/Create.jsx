import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { categories, errors } = usePage().props;
    const [values, setValues] = useState({
        title: "",
        description: "",
        category_id: "",
        starting_price: "",
        ends_at: "",
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("auctions.store"), values);
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Create Auction</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.title && (
                            <p className="text-red-500">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Category</label>
                        <select
                            name="category_id"
                            value={values.category_id}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold">
                            Starting Price
                        </label>
                        <input
                            type="number"
                            name="starting_price"
                            value={values.starting_price}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">End Date</label>
                        <input
                            type="datetime-local"
                            name="ends_at"
                            value={values.ends_at}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Create Auction
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
