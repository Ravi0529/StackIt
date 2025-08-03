import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const answerId = pathSegments[pathSegments.indexOf("answers") + 1];

  try {
    const answer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        question: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!answer) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer not found",
        },
        {
          status: 404,
        }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            id: answer.question.userId,
          },
          {
            answers: {
              some: {
                questionId: answer.questionId,
              },
            },
          },
          {
            comments: {
              some: {
                answerId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
      distinct: ["id"],
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching mentionable users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
};
