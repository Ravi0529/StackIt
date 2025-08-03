// GET and POST answers on single question
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface User {
  id: string;
  username: string;
  image: string | null;
}

interface Vote {
  type: "UP" | "DOWN";
}

interface AnswerWithRelations {
  id: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: { id: string }[];
  votes: Vote[];
}

// GET all the answers of the particular question
export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const questionId = pathSegments[pathSegments.indexOf("questions") + 1];

  if (!questionId) {
    return NextResponse.json(
      {
        success: false,
        message: "Question not found",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const answers: AnswerWithRelations[] = await prisma.answer.findMany({
      where: {
        questionId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        votes: true,
      },
    });

    const formattedAnswers = answers.map((answer: AnswerWithRelations) => {
      const upvotes = answer.votes.filter((v) => v.type === "UP").length;
      const downvotes = answer.votes.filter((v) => v.type === "DOWN").length;

      return {
        id: answer.id,
        description: answer.description,
        status: answer.status,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        user: answer.user,
        commentCount: answer.comments.length,
        upvotes,
        downvotes,
      };
    });

    formattedAnswers.sort((a, b) => {
      if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      answers: formattedAnswers,
    });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch answers",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// POST a new answer on particular question
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const questionId = pathSegments[pathSegments.indexOf("questions") + 1];

  if (!questionId) {
    return NextResponse.json(
      {
        success: false,
        message: "Question not found",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const { description, userId } = await req.json();

    if (!description || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing description or userId.",
        },
        {
          status: 400,
        }
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        {
          status: 404,
        }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        description,
        questionId,
        userId,
        isApproved: false,
        status: "pending",
      },
    });

    if (userId !== question.userId) {
      await prisma.notification.create({
        data: {
          senderId: userId,
          receiverId: question.userId,
          type: "ANSWERED",
          message: "Added answer to your question.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Answer submitted successfully. Awaiting approval.",
      answer,
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to post answer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
