import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                </div>

                <div>
                    <h2 className="mt-6 text-3xl font-heading font-extrabold text-foreground">
                        Page Not Found
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                        Oops! The page you are looking for does not exist or has been moved.
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
