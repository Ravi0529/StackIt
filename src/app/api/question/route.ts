import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { title, description, tags } = body;
    if (!title || !description) return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    try {
        // Create or connect tags if provided
        let tagConnect = undefined;
        if (Array.isArray(tags) && tags.length > 0) {
            tagConnect = {
                connectOrCreate: tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag },
                })),
            };
        }
        const question = await prisma.question.create({
            data: {
                title,
                description,
                userId,
                tags: tagConnect,
            },
            include: {
                tags: true,
            },
        });
        return NextResponse.json({ success: true, data: question }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
    }
}