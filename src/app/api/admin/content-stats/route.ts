import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

interface SessionUser {
  id?: string;
  email?: string;
  username?: string;
  image?: string | null;
  role?: string;
}

export const GET = async () => {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: SessionUser;
    } | null;

    if (session?.user.role !== "ADMIN") {
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

    const totalQuestions = await prisma.question.count();
    const totalAnswers = await prisma.answer.count();
    const totalComments = await prisma.comment.count();
    const unansweredQuestions = await prisma.question.count({
      where: {
        answers: {
          none: {},
        },
      },
    });
    const approvedAnswers = await prisma.answer.count({
      where: {
        isApproved: true,
      },
    });

    const approvalRate =
      totalAnswers > 0
        ? Math.round((approvedAnswers / totalAnswers) * 100 * 10) / 10
        : 0;

    return NextResponse.json({
      success: true,
      totalQuestions,
      totalAnswers,
      totalComments,
      unansweredQuestions,
      approvalRate,
    });
  } catch (error) {
    console.error("Error fetching content stats:", error);
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
