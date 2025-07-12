import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// GET: List notifications for the current user
export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

// POST: Accept an answer (by question author, expects { answerId, notificationId })
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { answerId, notificationId } = body;
    if (!answerId || !notificationId) return NextResponse.json({ error: "Missing answerId or notificationId" }, { status: 400 });
    try {
        const answer = await prisma.answer.findUnique({ where: { id: answerId }, include: { question: true } });
        if (!answer) return NextResponse.json({ error: "Answer not found" }, { status: 404 });
        if (answer.question.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // Set acceptedAnswerId on the question
        await prisma.question.update({ where: { id: answer.questionId }, data: { acceptedAnswerId: answerId } });
        // Mark notification as read
        await prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to accept answer" }, { status: 500 });
    }
}
