import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            gender, fullName, dateOfBirth, birthTime, birthPlace, height, complexion, bloodGroup, disability,
            education, occupation, annualIncome, workLocation,
            fatherName, fatherOccupation, motherName, motherOccupation, siblings, familyType, familyStatus,
            gotra, kuldevi, manglik, horoscope,
            partnerAgeMin, partnerAgeMax, partnerHeightMin, partnerEducation, partnerOccupation, partnerCity,
            photos
        } = await req.json();

        const existingBiodata = await prisma.biodata.findUnique({
            where: { userId: session.user.id }
        });

        const dataPayload = {
            gender: gender as any,
            fullName,
            dateOfBirth: new Date(dateOfBirth),
            birthTime,
            birthPlace,
            height,
            complexion,
            bloodGroup,
            disability,
            education,
            occupation,
            annualIncome,
            workLocation,
            fatherName,
            fatherOccupation,
            motherName,
            motherOccupation,
            siblings,
            familyType: familyType as any,
            familyStatus,
            gotra,
            kuldevi,
            manglik: typeof manglik === 'boolean' ? manglik : manglik === 'true',
            horoscope,
            partnerAgeMin,
            partnerAgeMax,
            partnerHeightMin,
            partnerEducation,
            partnerOccupation,
            partnerCity,
            photos: photos || [],
            isApproved: false, // Must be approved by admin
        };

        let biodata;
        if (existingBiodata) {
            biodata = await prisma.biodata.update({
                where: { id: existingBiodata.id },
                data: dataPayload,
            });
        } else {
            biodata = await prisma.biodata.create({
                data: {
                    ...dataPayload,
                    userId: session.user.id,
                },
            });
        }

        return NextResponse.json({ success: true, biodataId: biodata.id });
    } catch (error: any) {
        console.error("[BIODATA_POST]", error);
        return NextResponse.json({ error: "Failed to save biodata" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";
        // implement filtering in the DB query here as well based on search params

        const biodatas = await prisma.biodata.findMany({
            where: {
                isApproved: true,
                isActive: true,
                ...(search && {
                    OR: [
                        { gotra: { contains: search, mode: "insensitive" } },
                        { user: { city: { contains: search, mode: 'insensitive' as const } } }
                    ]
                })
            },
            include: {
                user: {
                    select: { city: true, state: true }
                }
            },
            take: 20
        });

        return NextResponse.json(biodatas);
    } catch (error) {
        console.error("[BIODATA_GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
