import { NextResponse } from "next/server";
import { generateUploadUrl } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // For registration, we don't have a session yet, but for other uploads we might check
        const body = await req.json();
        const { filename, contentType, type } = body;

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Filename and content type are required" }, { status: 400 });
        }

        const ext = filename.split(".").pop();
        const uniqueId = crypto.randomUUID();
        let key = "";

        if (type === "aadhar") {
            key = `verifications/${uniqueId}.${ext}`;
        } else {
            // Need session for other uploads like biodata, jobs, business
            const session = await getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const userId = session.user.id;

            if (type === "profile") key = `profiles/${userId}/${uniqueId}.${ext}`;
            else if (type === "biodata_photo") key = `biodatas/${userId}/photos/${uniqueId}.${ext}`;
            else if (type === "biodata_pdf") key = `biodatas/${userId}/pdf/${uniqueId}.${ext}`;
            else if (type === "business_logo") key = `businesses/${userId}/logo_${uniqueId}.${ext}`;
            else if (type === "business_photo") key = `businesses/${userId}/photos/${uniqueId}.${ext}`;
            else key = `misc/${userId}/${uniqueId}.${ext}`;
        }

        const url = await generateUploadUrl(key, contentType);

        return NextResponse.json({ url, key, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` });
    } catch (error: any) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
