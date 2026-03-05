"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

// We're omitting full Zod validation purely for speed here, 
// but typically you would define it explicitly per step.
export default function EditBiodataPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<File[]>([]);
    const [kundli, setKundli] = useState<File | null>(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const handleNext = () => setStep((s) => Math.min(s + 1, 7));
    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const { getRootProps: getPhotoProps, getInputProps: getPhotoInputProps } = useDropzone({
        onDrop: (files) => setPhotos([...photos, ...files].slice(0, 5)),
        accept: { 'image/*': [] },
        maxFiles: 5
    });

    const { getRootProps: getKundliProps, getInputProps: getKundliInputProps } = useDropzone({
        onDrop: (files) => setKundli(files[0]),
        accept: { 'application/pdf': [] },
        maxFiles: 1
    });

    const onSubmit = async (data: any) => {
        if (step !== 7) {
            handleNext();
            return;
        }

        try {
            setIsLoading(true);

            // 1. Upload photos to R2
            const photoUrls = [];
            for (const photo of photos) {
                const formData = new FormData();
                formData.append("file", photo);
                formData.append("type", "biodata_photo");

                const pRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });

                if (!pRes.ok) throw new Error("Could not upload photo");
                const { publicUrl } = await pRes.json();
                photoUrls.push(publicUrl);
            }

            // 2. Upload Kundli to R2
            let kundliUrl = null;
            if (kundli) {
                const formData = new FormData();
                formData.append("file", kundli);
                formData.append("type", "biodata_pdf");

                const kRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });

                if (!kRes.ok) throw new Error("Could not upload Kundli PDF");
                const { publicUrl } = await kRes.json();
                kundliUrl = publicUrl;
            }

            // 3. Save Biodata
            const payload = { ...data, photos: photoUrls, horoscope: kundliUrl };

            const res = await fetch("/api/matrimony/biodata", {
                method: "POST", // we'll define this POST / PUT route next
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Could not save biodata");

            toast.success("Biodata submitted and pending admin approval");
            router.push("/matrimony");
        } catch (e: any) {
            toast.error(e.message || "Failed to submit biodata");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold text-foreground">Create / Edit Biodata</h1>
                <div className="mt-4 flex items-center justify-between">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <div key={num} className={`flex-1 h-2 rounded-full mx-1 ${num <= step ? 'bg-primary' : 'bg-gray-200'}`} />
                    ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground text-right">Step {step} of 7</p>
            </div>

            <div className="bg-card border border-border shadow rounded-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">1. Personal Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Full Name</label>
                                    <input {...register("fullName", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Gender</label>
                                    <select {...register("gender")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Date of Birth</label>
                                    <input type="date" {...register("dateOfBirth", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary inline-flex" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Birth Time</label>
                                    <input type="time" {...register("birthTime")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Birth Place</label>
                                    <input {...register("birthPlace")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Height</label>
                                    <input placeholder="5'7&quot;" {...register("height")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Complexion</label>
                                    <input {...register("complexion")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Blood Group</label>
                                    <select {...register("bloodGroup")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                                        <option value="">Select...</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">2. Education & Career</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Highest Education</label>
                                    <input {...register("education", { required: true })} placeholder="B.E. Computer Science" className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Occupation / Job Title</label>
                                    <input {...register("occupation", { required: true })} placeholder="Software Engineer" className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Annual Income</label>
                                    <input {...register("annualIncome")} placeholder="e.g. 10-15 LPA" className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Work Location (City)</label>
                                    <input {...register("workLocation")} placeholder="Pune" className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">3. Family Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium">Father's Name</label><input {...register("fatherName", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Father's Occupation</label><input {...register("fatherOccupation")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Mother's Name</label><input {...register("motherName", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Mother's Occupation</label><input {...register("motherOccupation")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-medium">Siblings</label><input {...register("siblings")} placeholder="1 Brother (Married), 1 Sister" className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div>
                                    <label className="block text-sm font-medium">Family Type</label>
                                    <select {...register("familyType")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary">
                                        <option value="JOINT">Joint</option>
                                        <option value="NUCLEAR">Nuclear</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Family Status</label>
                                    <input {...register("familyStatus")} placeholder="Middle Class" className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">4. Religious / Community Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium">Gotra</label><input {...register("gotra", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Kuldevi</label><input {...register("kuldevi")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div className="flex items-center space-x-2 mt-6">
                                    <input type="checkbox" {...register("manglik")} id="manglik" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                    <label htmlFor="manglik" className="block text-sm font-medium">Is Manglik?</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">5. Partner Expectations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium">Min Age</label><input type="number" {...register("partnerAgeMin", { valueAsNumber: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Max Age</label><input type="number" {...register("partnerAgeMax", { valueAsNumber: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Min Height</label><input {...register("partnerHeightMin")} placeholder="e.g. 5'0&quot;" className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Education</label><input {...register("partnerEducation")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">Occupation</label><input {...register("partnerOccupation")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                                <div><label className="block text-sm font-medium">City</label><input {...register("partnerCity")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 focus:ring-primary" /></div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">6. Media Uploads</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Photos (Up to 5)</label>
                                    <div {...getPhotoProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary">
                                        <input {...getPhotoInputProps()} />
                                        <p className="text-sm text-muted-foreground">Drop up to 5 photos here</p>
                                    </div>
                                    {photos.length > 0 && (
                                        <div className="mt-2 flex gap-2">
                                            {photos.map((p, i) => <span key={i} className="text-xs bg-gray-100 p-1 rounded">{p.name}</span>)}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Kundli / Horoscope PDF (Optional)</label>
                                    <div {...getKundliProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary">
                                        <input {...getKundliInputProps()} />
                                        <p className="text-sm text-muted-foreground">Drop PDF here</p>
                                    </div>
                                    {kundli && <span className="text-xs bg-gray-100 p-1 rounded mt-2 inline-block">{kundli.name}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">7. Review & Submit</h2>
                            <p className="text-sm text-muted-foreground mb-4">Please review all information before submitting. Once submitted, an admin will review your profile before it becomes visible to others.</p>

                            <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                                <p className="text-sm font-medium text-orange-800">Note on Privacy</p>
                                <p className="text-xs text-orange-700 mt-1">Your contact details are hidden by default. Interested members must click "Show Interest" which will notify you.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6 border-t font-medium">
                        {step > 1 ? (
                            <button type="button" onClick={handleBack} className="px-4 py-2 border rounded-md text-foreground hover:bg-muted">Back</button>
                        ) : <div></div>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center gap-2"
                        >
                            {isLoading ? "Processing..." : step === 7 ? "Submit Biodata" : "Next Step"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
