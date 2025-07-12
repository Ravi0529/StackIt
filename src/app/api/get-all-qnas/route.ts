import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: true,
        answers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch questions",
      },
      {
        status: 500,
      }
    );
  }
};
