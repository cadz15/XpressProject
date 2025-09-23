import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function Terms() {
    return (
        <AuthenticatedLayout>
            <Head title="Terms of Service" />

            <h1>Terms of Service</h1>

            <ol>
                <li>
                    <h1>1. Acceptance of Terms</h1>
                    <p>
                        By accessing XpressProject.com, you agree to these
                        Terms. If not, do not use the Website.
                    </p>
                </li>
                <li>
                    <h1>2. Use of the Website</h1>
                    <p>
                        The Website is a platform for bidding. Users must follow
                        all laws.
                    </p>
                </li>
                <li>
                    <h1>3. Account Registration</h1>
                    <p>
                        Users must provide accurate information and secure their
                        credentials.
                    </p>
                </li>
                <li>
                    <h1>4. Bidding Rules</h1>
                    <p>
                        All bids are binding and cannot be withdrawn. Winning
                        bidders must complete transactions. XpressProject.com is
                        not a party unless stated.
                    </p>
                </li>
                <li>
                    <h1>5. Fees and Payments</h1>
                    <p>Fees may apply and must be paid via approved methods.</p>
                </li>
                <li>
                    <h1>6. User Responsibilities</h1>
                    <p>
                        Users may not engage in fraud, post false content, or
                        interfere with the Website.
                    </p>
                </li>
                <li>
                    <h1>7. Dispute Resolution</h1>
                    <p>
                        Disputes are between buyers and sellers.
                        XpressProject.com may assist but is not obligated.
                    </p>
                </li>
                <li>
                    <h1>8. Limitation of Liability</h1>
                    <p>
                        XpressProject.com is not liable for losses, damages, or
                        disputes.
                    </p>
                </li>
                <li>
                    <h1>9. Termination of Access</h1>
                    <p>We may suspend or terminate accounts for violations.</p>
                </li>
                <li>
                    <h1>10. Changes</h1>
                    <p>
                        We may update these Terms. Continued use means
                        acceptance.
                    </p>
                </li>
                <li>
                    <h1>11. Governing Law</h1>
                    <p>
                        These Terms follow the laws of the United States and the
                        State of Florida.
                    </p>
                </li>
            </ol>
        </AuthenticatedLayout>
    );
}

export default Terms;
