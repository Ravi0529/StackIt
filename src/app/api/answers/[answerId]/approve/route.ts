// approve answer
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const answerId = pathSegments[pathSegments.indexOf("answers") + 1];

  if (!answerId) {
    return NextResponse.json(
      {
        success: false,
        message: "Answer ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        question: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!answer) {
      return NextResponse.json(
        {
          error: "Answer not found",
        },
        {
          status: 404,
        }
      );
    }

    if (answer.question.user.email !== session.user.email) {
      return NextResponse.json(
        {
          error: "Not authorized to approve this answer",
        },
        {
          status: 403,
        }
      );
    }

    const updatedAnswer = await prisma.answer.update({
      where: {
        id: answerId,
      },
      data: {
        isApproved: true,
        status: "approved",
      },
    });

    return NextResponse.json({
      success: true,
      updatedAnswer,
      status: 200,
    });
  } catch (error) {
    console.error("Approve Answer Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
