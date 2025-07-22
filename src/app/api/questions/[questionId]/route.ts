import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// GET single question by ID
export const GET = async (req: NextRequest) => {
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

  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required",
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
      },
    });

    if (!question) {
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

    return NextResponse.json(
      {
        success: true,
        question,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch question",
      },
      {
        status: 500,
      }
    );
  }
};

// PUT particular question by ID
export const PUT = async (req: NextRequest) => {
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

  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const { title, description, tags, coverImage } = await req.json();

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

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
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

    if (question.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this question",
        },
        {
          status: 403,
        }
      );
    }

    const uploadedImageUrl = coverImage
      ? (
          await cloudinary.uploader.upload(coverImage, {
            folder: "stackit/questions",
          })
        ).secure_url
      : question.coverImage;

    await prisma.questionTag.deleteMany({
      where: {
        questionId: questionId,
      },
    });

    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        title,
        description,
        coverImage: uploadedImageUrl,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question updated successfully",
        question: updatedQuestion,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update question",
      },
      {
        status: 500,
      }
    );
  }
};

// DELETE particular question by ID
export const DELETE = async (req: NextRequest) => {
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

  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required",
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
    });

    if (!question) {
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

    if (question.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this question",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete question",
      },
      {
        status: 500,
      }
    );
  }
};
