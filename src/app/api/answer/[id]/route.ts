import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// GET: Get answer by ID (with user and votes)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        votes: true,
      },
    });
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: answer });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch answer" }, { status: 500 });
  }
}

// PUT: Edit answer content (only by author)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { content } = body;
  if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
  try {
    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    if (answer.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const updated = await prisma.answer.update({ where: { id }, data: { content } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update answer" }, { status: 500 });
  }
}

// DELETE: Delete answer (only by author)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = params;
  try {
    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    if (answer.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await prisma.answer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete answer" }, { status: 500 });
  }
}

// POST: Like/unlike answer (toggle, only for authenticated users)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: answerId } = params;
  try {
    // Check if user already liked this answer
    const existing = await prisma.answerVote.findUnique({
      where: { userId_answerId: { userId, answerId } },
    });
    if (existing) {
      // Unlike (remove vote)
      await prisma.answerVote.delete({ where: { userId_answerId: { userId, answerId } } });
      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like (add vote)
      await prisma.answerVote.create({ data: { userId, answerId, value: 1 } });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
