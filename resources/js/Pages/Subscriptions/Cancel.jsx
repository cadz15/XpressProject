import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function SubscriptionCancel() {
    return (
        <AuthenticatedLayout>
            <div className="max-w-lg mx-auto text-center p-8">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    Subscription Canceled
                </h1>
                <p className="mb-6">
                    Your subscription has been canceled. You can still use your
                    account until the end of your billing cycle.
                </p>
                <Link
                    href="/subscriptions"
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    View Plans
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
