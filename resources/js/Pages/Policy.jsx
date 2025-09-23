import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function Policy() {
    return (
        <AuthenticatedLayout>
            <Head title="Privacy Policy" />

            <h1>Privacy Policy</h1>

            <p>
                At XpressProject.com, we respect your privacy and are committed
                to protecting your personal information. This Privacy Policy
                explains how we collect, use, and safeguard the information you
                provide when using our platform.
            </p>

            <ol>
                <li>
                    <h1>1. Information We Collect</h1>
                    <p>
                        We may collect your name, email, phone number, billing
                        information, and activity on the Website. We also
                        collect technical details such as IP address, browser
                        type, and device data.
                    </p>
                </li>
                <li>
                    <h1>2. How We Use Your Information</h1>
                    <p>
                        We use your data to provide services, process
                        transactions, verify accounts, prevent fraud, and send
                        important updates.
                    </p>
                </li>
                <li>
                    <h1>3. Sharing of Information</h1>
                    <p>
                        We do not sell your data. We may share it with trusted
                        third parties like payment processors or disclose it if
                        required by law.
                    </p>
                </li>
                <li>
                    <h1>4. Data Security</h1>
                    <p>
                        We implement safeguards to protect your information,
                        though no system is completely secure.
                    </p>
                </li>
                <li>
                    <h1>5. Cookies and Tracking</h1>
                    <p>
                        We use cookies for analytics and improving services.
                        Disabling cookies may affect functionality.
                    </p>
                </li>
                <li>
                    <h1>6. User Responsibility</h1>
                    <p>
                        You are responsible for keeping your account credentials
                        secure and providing accurate information.
                    </p>
                </li>
                <li>
                    <h1>7. Children’s Privacy</h1>
                    <p>
                        We do not knowingly collect information from children
                        under 13.
                    </p>
                </li>
                <li>
                    <h1>8. Changes</h1>
                    <p>
                        We may update this policy, and continued use of the
                        Website means acceptance of changes.
                    </p>
                </li>
                <li>
                    <h1>9. Contact Us</h1>
                    <p>For questions, email us at support@xpressproject.com.</p>
                </li>
            </ol>
        </AuthenticatedLayout>
    );
}

export default Policy;
