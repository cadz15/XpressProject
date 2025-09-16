import React from "react";
import { Link } from "@inertiajs/react";

export default function ProfileShow({ user, tokens, subscription, auctions }) {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* User Info */}
            <section className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                <p>
                    <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                    <span className="font-semibold">Email:</span> {user.email}
                </p>
            </section>

            {/* Tokens */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">My Tokens</h2>
                <p className="text-2xl font-semibold">
                    {tokens.balance} tokens
                </p>
                <Link
                    href="/tokens"
                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Buy Tokens
                </Link>
            </section>

            {/* Subscription */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Subscription</h2>
                {subscription ? (
                    <div>
                        <p>
                            <span className="font-semibold">Plan:</span>{" "}
                            {subscription.plan.name}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span>{" "}
                            {subscription.status}
                        </p>
                        <Link
                            href="/subscriptions"
                            className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Manage Subscription
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/subscriptions"
                        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Subscribe Now
                    </Link>
                )}
            </section>

            {/* My Auctions */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">My Auctions</h2>
                {auctions.length ? (
                    <ul className="divide-y">
                        {auctions.map((auction) => (
                            <li
                                key={auction.id}
                                className="py-4 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {auction.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Current Price: ${auction.current_price}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status: {auction.status}
                                    </p>
                                </div>
                                <Link
                                    href={`/auctions/${auction.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">You have no auctions yet.</p>
                )}
                <Link
                    href="/auctions/create"
                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Create Auction
                </Link>
            </section>
        </div>
    );
}
