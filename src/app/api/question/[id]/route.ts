import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// GET: Fetch a single question by ID with user and tags
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const questionId = params.id;
    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: {
                user: { select: { id: true, username: true } },
                tags: true,
            },
        });
        if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: question });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
    }
}

// PUT: Update a question (only by author)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { title, description, tags } = body;
    const questionId = params.id;
    if (!title || !description) return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    try {
        const question = await prisma.question.findUnique({ where: { id: questionId } });
        if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
        if (question.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // Update or connect tags if provided
        let tagConnect = undefined;
        if (Array.isArray(tags) && tags.length > 0) {
            tagConnect = {
                set: [], // Remove all previous tags
                connectOrCreate: tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag },
                })),
            };
        }
        const updated = await prisma.question.update({
            where: { id: questionId },
            data: {
                title,
                description,
                ...(tagConnect ? { tags: tagConnect } : {}),
            },
            include: { tags: true },
        });
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
    }
}

// DELETE: Delete a question (only by author)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const questionId = params.id;
    try {
        const question = await prisma.question.findUnique({ where: { id: questionId } });
        if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
        if (question.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        await prisma.question.delete({ where: { id: questionId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
    }
}
