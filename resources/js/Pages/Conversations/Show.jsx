import React, { useEffect, useState, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import Echo from "laravel-echo";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ConversationsShow({ conversation, messages, auth }) {
    const [chatMessages, setChatMessages] = useState(messages);
    const messagesEndRef = useRef(null);

    const { data, setData, post, reset } = useForm({
        body: "",
    });

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Setup Echo listener
    useEffect(() => {
        if (!window.Echo) {
            window.Pusher = require("pusher-js");
            window.Echo = new Echo({
                broadcaster: "pusher",
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                forceTLS: true,
            });
        }

        window.Echo.private(`conversations.${conversation.id}`).listen(
            "MessageSent",
            (e) => {
                setChatMessages((prev) => [...prev, e.message]);
            }
        );

        return () => {
            window.Echo.leave(`conversations.${conversation.id}`);
        };
    }, [conversation.id]);

    // Submit message
    const sendMessage = (e) => {
        e.preventDefault();
        post(`/conversations/${conversation.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => reset("body"),
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-3xl mx-auto p-6 flex flex-col h-[80vh]">
                {/* Header */}
                <div className="border-b pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        Chat with{" "}
                        {conversation.participants
                            .map((p) => p.name)
                            .join(", ")}
                    </h1>
                    <Link
                        href="/conversations"
                        className="text-gray-600 hover:underline"
                    >
                        Back
                    </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 p-4 rounded-lg">
                    {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.user_id === auth.user.id
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs ${
                                    msg.user_id === auth.user.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                <p>{msg.body}</p>
                                <span className="text-xs opacity-75">
                                    {new Date(
                                        msg.created_at
                                    ).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={data.body}
                        onChange={(e) => setData("body", e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-4 py-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Send
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
