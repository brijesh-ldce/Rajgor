import { NextResponse } from "next/server";
import { generateUploadUrl, uploadFileToR2 } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string | null;

        if (!file || !type) {
            return NextResponse.json({ error: "File and type are required" }, { status: 400 });
        }

        const filename = file.name;
        const contentType = file.type;

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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await uploadFileToR2(buffer, key, contentType);

        return NextResponse.json({ key, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` });
    } catch (error: any) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
