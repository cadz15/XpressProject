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
import {
    Shield,
    Lock,
    Eye,
    Cookie,
    User,
    Mail,
    Settings,
    Bell,
    FileText,
} from "lucide-react";

function Policy() {
    const sections = [
        {
            number: "1",
            title: "Information We Collect",
            icon: User,
            content:
                "We may collect your name, email, phone number, billing information, and activity on the Website. We also collect technical details such as IP address, browser type, and device data.",
            details: [
                "Personal identification information",
                "Contact details and preferences",
                "Payment and transaction data",
                "Technical and usage analytics",
            ],
        },
        {
            number: "2",
            title: "How We Use Your Information",
            icon: Settings,
            content:
                "We use your data to provide services, process transactions, verify accounts, prevent fraud, and send important updates.",
            details: [
                "Service delivery and account management",
                "Transaction processing and verification",
                "Security and fraud prevention",
                "Communication and updates",
            ],
        },
        {
            number: "3",
            title: "Sharing of Information",
            icon: Shield,
            content:
                "We do not sell your data. We may share it with trusted third parties like payment processors or disclose it if required by law.",
            details: [
                "Trusted service providers only",
                "Legal compliance requirements",
                "Business transfer scenarios",
                "With your explicit consent",
            ],
        },
        {
            number: "4",
            title: "Data Security",
            icon: Lock,
            content:
                "We implement safeguards to protect your information, though no system is completely secure.",
            details: [
                "Encryption and secure protocols",
                "Regular security assessments",
                "Access control measures",
                "Continuous monitoring",
            ],
        },
        {
            number: "5",
            title: "Cookies and Tracking",
            icon: Cookie,
            content:
                "We use cookies for analytics and improving services. Disabling cookies may affect functionality.",
            details: [
                "Essential functionality cookies",
                "Analytics and performance tracking",
                "Personalization preferences",
                "Third-party service cookies",
            ],
        },
        {
            number: "6",
            title: "User Responsibility",
            icon: User,
            content:
                "You are responsible for keeping your account credentials secure and providing accurate information.",
            details: [
                "Account security maintenance",
                "Accurate information provision",
                "Prompt breach reporting",
                "Password management",
            ],
        },
        {
            number: "7",
            title: "Children's Privacy",
            icon: Eye,
            content:
                "We do not knowingly collect information from children under 13.",
            details: [
                "COPPA compliance",
                "Parental consent requirements",
                "Age verification processes",
                "Child data protection",
            ],
        },
        {
            number: "8",
            title: "Policy Changes",
            icon: Bell,
            content:
                "We may update this policy, and continued use of the Website means acceptance of changes.",
            details: [
                "Notification of material changes",
                "Review period for updates",
                "Acceptance through continued use",
                "Archive of previous versions",
            ],
        },
        {
            number: "9",
            title: "Contact Us",
            icon: Mail,
            content: "For questions, email us at support@xpressproject.com.",
            details: [
                "Privacy-related inquiries",
                "Data access requests",
                "Concern resolution",
                "Policy clarification",
            ],
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Privacy Policy" />

            <div className="flex justify-center">
                <div className="container max-w-4xl py-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            How we protect and handle your personal information
                        </p>
                    </div>

                    {/* Important Notice */}
                    <Alert className="bg-blue-50 border-blue-200">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">
                            Your Privacy Matters
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                            This policy explains how we collect, use, and
                            safeguard your information when you use our
                            platform. Last updated:{" "}
                            {new Date().toLocaleDateString()}
                        </AlertDescription>
                    </Alert>

                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Our Commitment to Your Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                At XpressProject.com, we respect your privacy
                                and are committed to protecting your personal
                                information. This Privacy Policy explains how we
                                collect, use, and safeguard the information you
                                provide when using our platform.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Policy Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => {
                            const IconComponent = section.icon;
                            return (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader className="bg-muted/30 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-full">
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
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Contact Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Need More Information?</CardTitle>
                            <CardDescription>
                                We're here to help with any privacy concerns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p className="text-muted-foreground">
                                    If you have questions about this privacy
                                    policy or how we handle your data, please
                                    don't hesitate to reach out to our privacy
                                    team.
                                </p>
                                <div className="bg-primary/5 p-4 rounded-lg">
                                    <p className="font-medium">
                                        Email: support@xpressproject.com
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Typically respond within 24-48 hours
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

export default Policy;
