import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ConversationsIndex({ conversations }) {
    return (
        <AuthenticatedLayout>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Conversations</h1>

                {conversations.length ? (
                    <ul className="divide-y">
                        {conversations.map((conversation) => (
                            <li
                                key={conversation.id}
                                className="py-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {conversation.participants
                                            .map((p) => p.name)
                                            .join(", ")}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Last message:{" "}
                                        {conversation.last_message?.body ||
                                            "No messages yet"}
                                    </p>
                                </div>
                                <Link
                                    href={`/conversations/${conversation.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Open
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">
                        You don’t have any conversations yet.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
