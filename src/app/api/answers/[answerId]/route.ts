// PUT, DELETE particular answer
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { answerId: string } }
) => {
  const { answerId } = await params;

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No active session.",
        },
        {
          status: 401,
        }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const { description } = await req.json();

    if (!description || description.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      select: {
        userId: true,
      },
    });

    if (!existingAnswer) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (existingAnswer.userId !== currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not own this answer.",
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
        description,
        updatedAt: new Date(),
        isApproved: false,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Answer updated successfully.",
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update answer",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { answerId: string } }
) => {
  const { answerId } = await params;

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

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingAnswer) {
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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!user || user.id !== existingAnswer.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.notification.deleteMany({
      where: {
        AND: [
          {
            type: "ANSWERED",
          },
          {
            sender: {
              answers: {
                some: {
                  id: answerId,
                },
              },
            },
          },
        ],
      },
    });

    await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Answer and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to delete answer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
