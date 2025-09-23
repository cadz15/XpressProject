import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    FileText,
    Scale,
    User,
    Gavel,
    CreditCard,
    Shield,
    Ban,
    RefreshCw,
    MapPin,
} from "lucide-react";

function Terms() {
    const sections = [
        {
            number: "1",
            title: "Acceptance of Terms",
            icon: CheckCircle,
            content:
                "By accessing XpressProject.com, you agree to these Terms. If not, do not use the Website.",
            important: true,
            details: [
                "Agreement to be bound by these terms upon access",
                "Implicit acceptance through continued use",
                "Right to refuse service for non-compliance",
            ],
        },
        {
            number: "2",
            title: "Use of the Website",
            icon: FileText,
            content:
                "The Website is a platform for bidding. Users must follow all laws.",
            details: [
                "Platform for auction-based transactions",
                "Compliance with all applicable laws required",
                "Proper use of bidding features expected",
            ],
        },
        {
            number: "3",
            title: "Account Registration",
            icon: User,
            content:
                "Users must provide accurate information and secure their credentials.",
            details: [
                "Accurate personal information required",
                "Secure password and account protection",
                "Immediate reporting of unauthorized access",
            ],
        },
        {
            number: "4",
            title: "Bidding Rules",
            icon: Gavel,
            content:
                "All bids are binding and cannot be withdrawn. Winning bidders must complete transactions. XpressProject.com is not a party unless stated.",
            important: true,
            details: [
                "Bids are legally binding commitments",
                "No withdrawal of placed bids permitted",
                "Transaction completion mandatory for winners",
                "Platform acts as intermediary only",
            ],
        },
        {
            number: "5",
            title: "Fees and Payments",
            icon: CreditCard,
            content: "Fees may apply and must be paid via approved methods.",
            details: [
                "Transaction fees may be applicable",
                "Approved payment methods only",
                "Timely payment required for services",
            ],
        },
        {
            number: "6",
            title: "User Responsibilities",
            icon: Shield,
            content:
                "Users may not engage in fraud, post false content, or interfere with the Website.",
            details: [
                "Prohibition of fraudulent activities",
                "Accurate listing information required",
                "No interference with platform operations",
                "Respect for other users' rights",
            ],
        },
        {
            number: "7",
            title: "Dispute Resolution",
            icon: Scale,
            content:
                "Disputes are between buyers and sellers. XpressProject.com may assist but is not obligated.",
            details: [
                "Primary responsibility with transacting parties",
                "Platform assistance at our discretion",
                "Mediation available but not guaranteed",
            ],
        },
        {
            number: "8",
            title: "Limitation of Liability",
            icon: Ban,
            content:
                "XpressProject.com is not liable for losses, damages, or disputes.",
            important: true,
            details: [
                "No liability for transactional disputes",
                "Exclusion of consequential damages",
                "Limitation to direct damages only",
                "Maximum liability limitations apply",
            ],
        },
        {
            number: "9",
            title: "Termination of Access",
            icon: Shield,
            content: "We may suspend or terminate accounts for violations.",
            details: [
                "Right to suspend for terms violations",
                "Immediate termination for serious breaches",
                "Appeal process available",
            ],
        },
        {
            number: "10",
            title: "Changes to Terms",
            icon: RefreshCw,
            content:
                "We may update these Terms. Continued use means acceptance.",
            details: [
                "Right to modify terms at any time",
                "Notification of material changes",
                "Continued use constitutes acceptance",
            ],
        },
        {
            number: "11",
            title: "Governing Law",
            icon: MapPin,
            content:
                "These Terms follow the laws of the United States and the State of Florida.",
            details: [
                "Jurisdiction: United States courts",
                "Governing law: State of Florida",
                "Venue for disputes: Florida courts",
            ],
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Terms of Service" />

            <div className="flex justify-center">
                <div className="container max-w-4xl py-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
                            <Scale className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Rules and guidelines for using our platform
                        </p>
                        <Badge variant="outline" className="text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </Badge>
                    </div>

                    {/* Important Notice */}
                    <Alert variant="destructive">
                        <FileText className="h-4 w-4" />
                        <AlertTitle>Legal Agreement</AlertTitle>
                        <AlertDescription>
                            These Terms of Service constitute a legally binding
                            agreement between you and XpressProject.com. Please
                            read them carefully.
                        </AlertDescription>
                    </Alert>

                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to XpressProject.com</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms of Service govern your use of
                                XpressProject.com and all related services. By
                                accessing or using our platform, you agree to be
                                bound by these terms and our Privacy Policy.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Terms Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => {
                            const IconComponent = section.icon;
                            return (
                                <Card
                                    key={index}
                                    className={`overflow-hidden ${
                                        section.important
                                            ? "border-primary/20"
                                            : ""
                                    }`}
                                >
                                    <CardHeader
                                        className={`pb-4 ${
                                            section.important
                                                ? "bg-primary/5"
                                                : "bg-muted/30"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                                                        section.important
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
                                                    }`}
                                                >
                                                    <span className="font-bold">
                                                        {section.number}
                                                    </span>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl flex items-center gap-2">
                                                        <IconComponent className="h-5 w-5" />
                                                        {section.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            {section.important && (
                                                <Badge
                                                    variant="destructive"
                                                    className="animate-pulse"
                                                >
                                                    Important
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Acceptance Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Agreement</CardTitle>
                            <CardDescription>
                                Understanding and acceptance of terms
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    By continuing to use XpressProject.com, you
                                    acknowledge that you have read, understood,
                                    and agree to be bound by these Terms of
                                    Service and our Privacy Policy.
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium">
                                        For questions about these terms:
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        support@xpressproject.com
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Terms;
