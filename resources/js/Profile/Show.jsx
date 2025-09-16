import React from "react";
import { Head } from "@inertiajs/react";

export default function Show({ user, auctions }) {
    return (
        <div className="p-6">
            <Head title={`${user.username}'s Profile`} />

            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">
                Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>

            <h2 className="mt-6 text-xl font-semibold">Recent Auctions</h2>
            <ul>
                {auctions.map((auction) => (
                    <li key={auction.id}>{auction.title}</li>
                ))}
            </ul>
        </div>
    );
}
