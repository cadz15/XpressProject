import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function SubscriptionSuccess() {
    return (
        <AuthenticatedLayout>
            <div className="max-w-lg mx-auto text-center p-8">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Subscription Activated 🎉
                </h1>
                <p className="mb-6">
                    Your subscription has been successfully activated. You can
                    now access all platform features.
                </p>
                <Link
                    href="/auctions"
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    Go to Auctions
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
