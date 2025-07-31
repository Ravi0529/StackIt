import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

  try {
    const { answerId, voteType } = await req.json();

    if (!answerId || !voteType) {
      return NextResponse.json(
        {
          error: "Answer ID and vote type are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId: user.id,
          answerId,
        },
      },
    });

    let vote;

    if (existingVote) {
      if (existingVote.type === voteType) {
        vote = await prisma.vote.delete({
          where: {
            userId_answerId: {
              userId: user.id,
              answerId,
            },
          },
        });
      } else {
        vote = await prisma.vote.update({
          where: {
            userId_answerId: {
              userId: user.id,
              answerId,
            },
          },
          data: {
            type: voteType,
          },
        });
      }
    } else {
      vote = await prisma.vote.create({
        data: {
          userId: user.id,
          answerId,
          type: voteType,
        },
      });
    }

    const upvotes = await prisma.vote.count({
      where: {
        answerId,
        type: "UP",
      },
    });

    const downvotes = await prisma.vote.count({
      where: {
        answerId,
        type: "DOWN",
      },
    });

    return NextResponse.json({
      success: true,
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
