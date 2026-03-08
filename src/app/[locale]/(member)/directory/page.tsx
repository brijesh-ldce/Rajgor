"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Users, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

type FamilyMember = {
    id: string;
    name: string;
    relation: string;
    occupation: string | null;
    maritalStatus: string | null;
    dateOfBirth: string | null;
};

type SamajMember = {
    id: string;
    name: string;
    phone: string | null;
    city: string;
    state: string;
    village: string | null;
    profilePhoto: string | null;
    familyMembers: FamilyMember[];
};

export default function DirectoryPage() {
    const [members, setMembers] = useState<SamajMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchDirectory = async () => {
            try {
                const res = await fetch("/api/directory");
                if (!res.ok) throw new Error("Failed to load directory");
                const data = await res.json();
                setMembers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDirectory();
    }, []);

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    const filteredMembers = members.filter(m => {
        const q = searchQuery.toLowerCase();
        return (
            m.name.toLowerCase().includes(q) ||
            m.city.toLowerCase().includes(q) ||
            (m.village && m.village.toLowerCase().includes(q)) ||
            (m.phone && m.phone.includes(q)) ||
            m.familyMembers.some(fm => fm.name.toLowerCase().includes(q))
        );
    });

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-4">
                    Samaj Directory
                </h1>
                <p className="text-muted-foreground">
                    Connect with fellow Rajgor Brahmin Samaj members across the globe. Search by name, city, native village, or family members.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                    placeholder="Search directory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No members found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map(member => {
                        const isExpanded = expandedIds.has(member.id);
                        return (
                            <div key={member.id} className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-2xl text-primary flex-shrink-0">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg text-foreground line-clamp-1">{member.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">{member.city}, {member.state}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        {member.village && (
                                            <div className="flex items-start gap-2 text-muted-foreground">
                                                <span className="font-medium text-foreground min-w-[70px]">Native:</span>
                                                <span className="truncate">{member.village}</span>
                                            </div>
                                        )}
                                        {member.phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Family Section */}
                                {member.familyMembers.length > 0 && (
                                    <div className="border-t border-border bg-muted/10">
                                        <button
                                            onClick={() => toggleExpand(member.id)}
                                            className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                Family ({member.familyMembers.length})
                                            </span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="px-6 pb-4 space-y-3">
                                                {member.familyMembers.map(fm => (
                                                    <div key={fm.id} className="text-sm border-l-2 border-primary/30 pl-3 py-1">
                                                        <div className="font-semibold text-foreground">{fm.name}</div>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                            <span className="uppercase text-primary font-medium tracking-wider">{fm.relation}</span>
                                                            {fm.occupation && <span>• {fm.occupation}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
