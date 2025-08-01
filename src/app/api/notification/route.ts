import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

type NotificationType = "ANSWERED" | "COMMENTED" | "MENTIONED";

export const GET = async (req: NextRequest) => {
  try {
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

    const { searchParams } = new URL(req.url);
    const isRead = searchParams.get("isRead");
    const type = searchParams.get("type") as NotificationType | null;

    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: session.user.email,
        ...(isRead !== null && {
          isRead: isRead === "true",
        }),
        ...(type && {
          type,
        }),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
      },
      {
        status: 500,
      }
    );
  }
};
