import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";

export default function Index({ metrics }) {
    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-gray-500 text-sm">Total Users</h2>
                        <p className="text-2xl font-bold">
                            {metrics.total_users}
                        </p>
                    </div>

                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-gray-500 text-sm">
                            Active Subscriptions
                        </h2>
                        <p className="text-2xl font-bold">
                            {metrics.active_subscriptions}
                        </p>
                    </div>

                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-gray-500 text-sm">Total Revenue</h2>
                        <p className="text-2xl font-bold">
                            ${metrics.total_revenue}
                        </p>
                    </div>

                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-gray-500 text-sm">
                            Active Auctions
                        </h2>
                        <p className="text-2xl font-bold">
                            {metrics.active_auctions}
                        </p>
                    </div>

                    <div className="bg-white shadow rounded-lg p-4">
                        <h2 className="text-gray-500 text-sm">Total Bids</h2>
                        <p className="text-2xl font-bold">
                            {metrics.total_bids}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
