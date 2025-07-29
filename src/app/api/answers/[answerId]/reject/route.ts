// reject answer
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { answerId: string } }
) => {
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

  const { answerId } = await params;

  try {
    const answer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
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
        user: true,
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
          error: "Not authorized to reject this answer",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.notification.deleteMany({
      where: {
        OR: [
          {
            senderId: answer.userId,
          },
          {
            receiverId: answer.userId,
          },
        ],
        message: {
          contains: answer.id,
        },
      },
    });

    await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Answer rejected and deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Reject Answer Error:", error);
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
