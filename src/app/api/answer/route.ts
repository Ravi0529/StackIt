import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const userId = (await auth()).userId;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { questionId, content } = body;

    if (!questionId || !content) {
        return NextResponse.json({ error: "Missing questionId or content" }, { status: 400 });
    }

    try {
        const answer = await prisma.answer.create({
            data: {
                content,
                questionId,
                userId,
            },
        });
        return NextResponse.json({ success: true, data: answer }, { status: 201 });
    } catch (error) {
        console.error("Error creating answer:", error);
        return NextResponse.json({ error: "Failed to create answer" }, { status: 500 });
    }
}
