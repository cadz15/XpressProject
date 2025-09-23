// resources/js/Pages/Auctions/Show.jsx
import React, { useEffect, useState, useRef } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auction: initialAuction }) {
    const { auth } = usePage().props;
    const [auction, setAuction] = useState(initialAuction);
    const [bids, setBids] = useState(initialAuction.bids ?? []);
    const [amount, setAmount] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const presenceRef = useRef(null);

    useEffect(() => {
        if (!window.Echo) return;

        const auctionId = auction.id;

        // Private channel for bidding updates
        const channel = window.Echo.private(`auction.${auctionId}`);

        channel.listen(".bid.placed", (payload) => {
            // payload.bid is the bid object (server-side event classes loaded relations)
            setBids((prev) => [payload.bid, ...prev]);
            setAuction((prev) => ({
                ...prev,
                current_price: payload.bid.amount,
            }));
        });

        channel.listen(".auction.ended", (payload) => {
            setAuction((prev) => ({ ...prev, status: "ended" }));
            // optionally show toast / UI change
        });

        // (optional) presence channel to show who is viewing
        let presence;
        try {
            presence = window.Echo.join(`presence-auction.${auctionId}`)
                .here((users) => {
                    setOnlineUsers(users);
                })
                .joining((user) => {
                    setOnlineUsers((prev) => [...prev, user]);
                })
                .leaving((user) => {
                    setOnlineUsers((prev) =>
                        prev.filter((u) => u.id !== user.id)
                    );
                });

            presenceRef.current = presence;
        } catch (e) {
            // presence might not be enabled - ignore
        }

        return () => {
            channel.stopListening(".bid.placed");
            channel.stopListening(".auction.ended");
            window.Echo.leave(`auction.${auctionId}`);
            if (presenceRef.current) {
                presenceRef.current.stop();
            }
        };
    }, [auction.id]);

    async function submitBid(e) {
        e.preventDefault();
        if (!amount) return;

        try {
            await axios.post(`/auctions/${auction.id}/bids`, { amount });
            setAmount("");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.error?.[0] ||
                "Failed to place bid";
            alert(msg);
        }
    }

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <Head title={auction.title} />
                <h1 className="text-2xl font-bold">{auction.title}</h1>
                <p className="text-gray-600">{auction.description}</p>

                <div className="mt-4">
                    <strong>Current price:</strong> ${auction.current_price}
                </div>

                <div className="mt-4">
                    <form onSubmit={submitBid}>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Your bid
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min={
                                    auction.current_price +
                                    auction.current_price * 0.05
                                } // 5% increment
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 block w-48 rounded-md border"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Place bid
                        </button>
                    </form>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Live bids</h3>
                    <ul>
                        {bids.map((b) => (
                            <li key={b.id} className="py-2 border-b">
                                <div>
                                    <strong>
                                        {b.bidder?.name ?? "Unknown"}
                                    </strong>{" "}
                                    — ${b.amount}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(b.created_at).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold">Viewers</h4>
                    <div>
                        {onlineUsers.length ? (
                            onlineUsers.map((u) => (
                                <span
                                    key={u.id}
                                    className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded"
                                >
                                    {u.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400">
                                No viewers
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
