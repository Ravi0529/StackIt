import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
// POST handler for creating a new question
export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user || !user.email) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const { title, description, tags } = await req.json();

  if (!title || !description || !Array.isArray(tags)) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required fields: title, description, or tags",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const userEmail = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!userEmail) {
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

    const TagConnectOrCreate = tags.map((tagName: string) => ({
      where: {
        name: tagName,
      },
      create: {
        name: tagName,
      },
    }));

    const newQuestion = await prisma.question.create({
      data: {
        title,
        description,
        userId: userEmail.id,
        tags: {
          create: TagConnectOrCreate.map(({ where, create }) => ({
            tag: {
              connectOrCreate: {
                where,
                create,
              },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Question created successfully",
        question: newQuestion,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to create question",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// GET all questions
const ITEMS_PER_PAGE = 10;

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const totalQuestions = await prisma.question.count();

    const questions = await prisma.question.findMany({
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        questions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / ITEMS_PER_PAGE),
        totalQuestions,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch questions",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
