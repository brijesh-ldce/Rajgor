import Link from "next/link";
import { Clock } from "lucide-react";

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100">
                    <Clock className="h-12 w-12 text-primary" />
                </div>

                <div>
                    <h2 className="mt-6 text-3xl font-heading font-extrabold text-foreground">
                        Account Pending Approval
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                        Thank you for registering with the Rajgor Brahmin Samaj platform! Your account has been created successfully.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                        To maintain the security and trust of our community, an administrator will review your details and Aadhar document shortly.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground font-medium">
                        You will receive an email notification once your profile is approved.
                    </p>
                </div>

                <div className="pt-6 border-t border-border">
                    <Link
                        href="/"
                        className="text-sm font-medium text-primary hover:text-orange-600 transition-colors"
                    >
                        ← Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
