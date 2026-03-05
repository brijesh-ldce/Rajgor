"use client";

import { useState } from "react";
import { HelpOfferForm } from "@/components/vyapar/HelpOfferForm";
import { ThumbsUp, CheckCircle, Handshake, Mail, MapPin, Building2, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BusinessDetailPageClient({ business, sessionUser }: { business: any, sessionUser: any }) {
    const [activeRequest, setActiveRequest] = useState<{ id: string, type: string } | null>(null);

    const totalHelpReceived = business.helpNeeded.reduce((acc: number, req: any) => acc + req.helpOffers.length, 0);

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/vyapar" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Directory
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-xl shadow border border-border p-8">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-xl bg-gray-100 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                {business.logo ? (
                                    <img src={business.logo} alt={business.businessName} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-heading font-bold text-foreground">{business.businessName}</h1>
                                <div className="flex items-center text-sm font-medium text-muted-foreground mt-2">
                                    <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded uppercase tracking-wider">{business.category}</span>
                                    {business.established && <span className="ml-3">Est. {business.established}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-heading font-semibold mb-4 text-foreground">About the Business</h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                                {business.description}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                            {business.location && (
                                <div className="flex items-start text-sm text-foreground">
                                    <MapPin className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" />
                                    {business.location}, {business.city}, {business.state}
                                </div>
                            )}
                            {business.contactEmail && (
                                <div className="flex items-center text-sm text-foreground">
                                    <Mail className="w-4 h-4 mr-2 text-primary shrink-0" />
                                    <a href={`mailto:${business.contactEmail}`} className="hover:text-primary hover:underline">{business.contactEmail}</a>
                                </div>
                            )}
                            {business.contactPhone && (
                                <div className="flex items-center text-sm text-foreground">
                                    <Phone className="w-4 h-4 mr-2 text-primary shrink-0" />
                                    <a href={`tel:${business.contactPhone}`} className="hover:text-primary hover:underline">{business.contactPhone}</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Help Requests Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-heading font-bold text-foreground">Community Help Requests</h2>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {business.helpNeeded.length} Request(s)
                            </span>
                        </div>

                        {totalHelpReceived > 0 && (
                            <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-4 flex items-center text-sm font-medium shadow-sm">
                                <Handshake className="w-5 h-5 mr-3 text-primary" />
                                {totalHelpReceived} community member(s) have stepped forward to help this business. Be the next!
                            </div>
                        )}

                        {business.helpNeeded.length === 0 ? (
                            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                                No active help requests at the moment.
                            </div>
                        ) : (
                            business.helpNeeded.map((req: any) => (
                                <div key={req.id} className="bg-card rounded-xl shadow border border-border p-6 relative overflow-hidden">
                                    {req.isResolved && (
                                        <div className="absolute top-4 right-4 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                                            <CheckCircle className="w-3 h-3 mr-1" /> RESOLVED
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Required: {req.helpType}</span>
                                        <p className="mt-2 text-foreground font-medium text-lg leading-relaxed">{req.description}</p>
                                    </div>

                                    {!req.isResolved && sessionUser.id !== business.userId && (
                                        <button
                                            onClick={() => setActiveRequest({ id: req.id, type: req.helpType })}
                                            className="mt-4 w-full sm:w-auto bg-primary text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all"
                                        >
                                            I Can Help
                                        </button>
                                    )}

                                    {/* Offers List */}
                                    {req.helpOffers.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Offers ({req.helpOffers.length})</h4>
                                            <div className="space-y-4">
                                                {req.helpOffers.map((offer: any) => (
                                                    <div key={offer.id} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-semibold text-sm text-foreground">{offer.user.name}</span>
                                                            {offer.isAccepted && (
                                                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">ACCEPTED ✅</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{offer.message}</p>

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(offer.createdAt))} ago</span>
                                                            <button className="flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                                                                <ThumbsUp className="w-3 h-3 mr-1" /> {offer.likes}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center font-heading text-2xl font-bold text-primary mb-4">
                            {business.user.name.charAt(0)}
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-foreground">{business.user.name}</h3>
                        <p className="text-sm text-muted-foreground">Business Owner</p>
                        <div className="mt-6 pt-6 border-t border-border">
                            <Link href={`mailto:${business.contactEmail}`} className="text-primary hover:underline text-sm font-medium">Contact Owner</Link>
                        </div>
                    </div>
                </div>
            </div>

            {activeRequest && (
                <HelpOfferForm
                    isOpen={true}
                    onClose={() => setActiveRequest(null)}
                    helpRequestId={activeRequest.id}
                    helpType={activeRequest.type}
                    businessName={business.businessName}
                />
            )}
        </div>
    );
}
