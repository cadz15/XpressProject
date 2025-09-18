import React, { useEffect, useState, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import Echo from "laravel-echo";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import { Send, ArrowLeft, Users, Clock, MoreVertical } from "lucide-react";

export default function ConversationsShow({ conversation, user }) {
    const [chatMessages, setChatMessages] = useState(conversation.messages);
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const auth = user;
    const { data, setData, post, reset } = useForm({
        body: "",
    });

    console.log(conversation);

    // Get other participants (excluding current user)
    const otherParticipants =
        conversation.buyer?.id === auth.id
            ? conversation.seller
            : conversation.buyer;

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Setup Echo listener
    // useEffect(() => {
    //     if (!window.Echo) {
    //         window.Pusher = require("pusher-js");
    //         window.Echo = new Echo({
    //             broadcaster: "pusher",
    //             key: import.meta.env.VITE_PUSHER_APP_KEY,
    //             cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    //             forceTLS: true,
    //         });
    //     }

    //     window.Echo.private(`conversations.${conversation.id}`)
    //         .listen("MessageSent", (e) => {
    //             setChatMessages((prev) => [...prev, e.message]);
    //         })
    //         .listenForWhisper("typing", (e) => {
    //             setIsTyping(e.typing);
    //             // Clear typing indicator after 2 seconds
    //             setTimeout(() => setIsTyping(false), 2000);
    //         });

    //     return () => {
    //         window.Echo.leave(`conversations.${conversation.id}`);
    //     };
    // }, [conversation.id]);

    // Handle typing indicator
    const handleInputChange = (e) => {
        setData("body", e.target.value);

        // Broadcast typing indicator
        if (window.Echo) {
            window.Echo.private(`conversations.${conversation.id}`).whisper(
                "typing",
                {
                    typing: e.target.value.length > 0,
                    user: auth.name,
                }
            );
        }
    };

    // Submit message
    const sendMessage = (e) => {
        e.preventDefault();
        post(`/conversations/${conversation.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => {
                reset("body");
                setIsTyping(false);
            },
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString();
        }
    };

    // Group messages by date
    const groupedMessages = chatMessages?.reduce((groups, message) => {
        const date = formatDate(message.created_at);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                {/* Header */}
                <Card className="border-0 shadow-none rounded-none rounded-t-lg">
                    <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/conversations">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    {otherParticipants?.length === 1 ? (
                                        <>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={
                                                        otherParticipants[0]
                                                            .avatar
                                                    }
                                                    alt={
                                                        otherParticipants[0]
                                                            .name
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {otherParticipants[0].name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {otherParticipants[0].name}
                                                </CardTitle>
                                                {isTyping && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs animate-pulse"
                                                    >
                                                        typing...
                                                    </Badge>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex -space-x-2">
                                                {[otherParticipants].map(
                                                    (participant, index) => (
                                                        <Avatar
                                                            key={participant.id}
                                                            className="h-10 w-10 border-2 border-background"
                                                        >
                                                            <AvatarImage
                                                                src={
                                                                    participant.avatar
                                                                }
                                                                alt={
                                                                    participant.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {participant.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Group Chat
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {otherParticipants?.length}{" "}
                                                    participants
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-muted/30">
                    <div className="space-y-6">
                        {Object.entries(groupedMessages ?? {})?.map(
                            ([date, messages]) => (
                                <div key={date}>
                                    <div className="flex justify-center my-4">
                                        <Badge
                                            variant="secondary"
                                            className="px-3 py-1"
                                        >
                                            {date}
                                        </Badge>
                                    </div>
                                    {messages.map((msg) => {
                                        const isOwnMessage =
                                            msg.user_id === auth.id;
                                        const sender = otherParticipants;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex gap-3 mb-4 ${
                                                    isOwnMessage
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                {!isOwnMessage &&
                                                    otherParticipants.length >
                                                        1 && (
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarImage
                                                                src={
                                                                    sender?.avatar
                                                                }
                                                                alt={
                                                                    sender?.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {sender?.name
                                                                    ?.charAt(0)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                <div
                                                    className={`max-w-xs lg:max-w-md ${
                                                        isOwnMessage
                                                            ? "order-1"
                                                            : "order-2"
                                                    }`}
                                                >
                                                    {!isOwnMessage &&
                                                        otherParticipants.length >
                                                            1 && (
                                                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                                                {sender?.name}
                                                            </p>
                                                        )}
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl ${
                                                            isOwnMessage
                                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                                : "bg-background border rounded-bl-md"
                                                        }`}
                                                    >
                                                        <p className="text-sm">
                                                            {msg.body}
                                                        </p>
                                                    </div>
                                                    <p
                                                        className={`text-xs text-muted-foreground mt-1 ${
                                                            isOwnMessage
                                                                ? "text-right"
                                                                : "text-left"
                                                        }`}
                                                    >
                                                        {formatTime(
                                                            msg.created_at
                                                        )}
                                                    </p>
                                                </div>
                                                {isOwnMessage && (
                                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                                        <AvatarImage
                                                            src={auth.avatar}
                                                            alt={auth.name}
                                                        />
                                                        <AvatarFallback>
                                                            {auth.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <Card className="border-0 shadow-none rounded-none rounded-b-lg">
                    <CardContent className="p-4">
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <Input
                                type="text"
                                value={data.body}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1"
                                required
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="flex-shrink-0"
                                disabled={!data.body.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
