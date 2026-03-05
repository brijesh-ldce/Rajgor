"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type HelpOfferFormProps = {
    isOpen: boolean;
    onClose: () => void;
    helpRequestId: string;
    helpType: string;
    businessName: string;
};

export function HelpOfferForm({ isOpen, onClose, helpRequestId, helpType, businessName }: HelpOfferFormProps) {
    const [message, setMessage] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("/api/vyapar/help", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ helpRequestId, message, contactInfo })
            });

            if (!res.ok) throw new Error("Could not send help offer");

            toast.success("Help offer sent! You've taken a step to support our Samaj.", { duration: 5000 });
            onClose();
            // Optionally reload the page to show the help offer in the list
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit offer");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-foreground">Offer Help</h2>
                        <p className="text-sm text-muted-foreground mt-1">To {businessName} (As {helpType})</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">How can you help? *</label>
                        <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                            placeholder="E.g. I have 10 years experience in this domain and can spend 2 hours a week..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Your Contact Info (Optional)</label>
                        <input
                            type="text"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                            placeholder="Phone number, LinkedIn profile, etc."
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-right">The owner will also see your email.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Submit Offer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
