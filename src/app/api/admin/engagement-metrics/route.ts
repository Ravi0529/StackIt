import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if ((session?.user as { role?: string })?.role !== "ADMIN") {
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

    const topTags = await prisma.tag.findMany({
      take: 5,
      orderBy: {
        questions: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    const upvotes = await prisma.vote.count({
      where: {
        type: "UP",
      },
    });
    const downvotes = await prisma.vote.count({
      where: {
        type: "DOWN",
      },
    });

    return NextResponse.json({
      success: true,
      topTags: topTags.map((tag) => ({
        name: tag.name,
        questionCount: tag._count.questions,
      })),
      votingActivity: {
        upvotes,
        downvotes,
      },
    });
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};
