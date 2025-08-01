import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const GET = async (
  req: NextRequest,
  { params }: { params: { answerId: string } }
) => {
  const { answerId } = await params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        mentions: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { answerId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.email) {
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

  const { answerId } = await params;
  const { content, mentionedUserIds = [] } = await req.json();

  if (!content) {
    return NextResponse.json(
      {
        success: false,
        message: "Content is required",
      },
      {
        status: 400,
      }
    );
  }

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

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        answerId,
      },
    });

    if (mentionedUserIds.length > 0) {
      await prisma.mention.createMany({
        data: mentionedUserIds.map((mentionedUserId: string) => ({
          mentionedUserId,
          commentId: comment.id,
        })),
      });

      await prisma.notification.createMany({
        data: mentionedUserIds.map((mentionedUserId: string) => ({
          senderId: user.id,
          receiverId: mentionedUserId,
          type: "MENTIONED",
          message: `${user.username} mentioned you in a comment`,
        })),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment created",
        comment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create comment",
      },
      {
        status: 500,
      }
    );
  }
};
