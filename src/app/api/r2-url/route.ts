import { NextResponse } from "next/server";
import { getSignedReadUrl } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const key = searchParams.get("key");

        if (!key) {
            return new NextResponse("Key is required", { status: 400 });
        }
        
        // Use presigned URL to fetch resource securely from R2
        const url = await getSignedReadUrl(key);
        
        // We redirect the user directly to the presigned S3 url. 
        // This allows using this API endpoint directly in <img src="..." /> or <a href="..." />
        return NextResponse.redirect(url);
    } catch (error) {
        console.error("[R2_URL_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
