import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const DELETE = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user.email) {
    return NextResponse.json(
      {
        success: true,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const commentId = pathSegments[pathSegments.indexOf("answers") + 1];

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found",
        },
        {
          status: 404,
        }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized to delete this comment",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete comment",
      },
      {
        status: 500,
      }
    );
  }
};
