import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { auctions, categories } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Live Auctions</h1>

                {/* Category filter */}
                <div className="flex gap-2 mb-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={route("auctions.index", {
                                category: cat.slug,
                            })}
                            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Auctions list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {auctions.data.map((auction) => (
                        <Link
                            key={auction.id}
                            href={route("auctions.show", auction.id)}
                            className="border rounded-lg shadow-sm hover:shadow-lg p-4 bg-white"
                        >
                            <h2 className="font-semibold text-lg">
                                {auction.title}
                            </h2>
                            <p className="text-sm text-gray-600 truncate">
                                {auction.description}
                            </p>
                            <p className="mt-2 font-bold text-green-600">
                                Current: $
                                {auction.current_price ??
                                    auction.starting_price}
                            </p>
                            <p className="text-xs text-gray-500">
                                Ends at:{" "}
                                {new Date(auction.ends_at).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
