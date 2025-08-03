import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const searchType = searchParams.get("type") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    let questions = [];
    let totalCount = 0;

    switch (searchType) {
      case "title":
        [questions, totalCount] = await prisma.$transaction([
          prisma.question.findMany({
            where: {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            include: {
              user: true,
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
            skip,
            take: limit,
            orderBy: {
              updatedAt: "desc",
            },
          }),
          prisma.question.count({
            where: {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
          }),
        ]);
        break;

      case "user":
        [questions, totalCount] = await prisma.$transaction([
          prisma.question.findMany({
            where: {
              user: {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
            include: {
              user: true,
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
            skip,
            take: limit,
            orderBy: {
              updatedAt: "desc",
            },
          }),
          prisma.question.count({
            where: {
              user: {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          }),
        ]);
        break;

      case "tag":
        [questions, totalCount] = await prisma.$transaction([
          prisma.question.findMany({
            where: {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
            include: {
              user: true,
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
            skip,
            take: limit,
            orderBy: {
              updatedAt: "desc",
            },
          }),
          prisma.question.count({
            where: {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          }),
        ]);
        break;

      default:
        [questions, totalCount] = await prisma.$transaction([
          prisma.question.findMany({
            where: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  user: {
                    username: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  tags: {
                    some: {
                      tag: {
                        name: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
            },
            include: {
              user: true,
              tags: {
                include: {
                  tag: true,
                },
              },
              _count: {
                select: { answers: true },
              },
            },
            skip,
            take: limit,
            orderBy: {
              updatedAt: "desc",
            },
          }),
          prisma.question.count({
            where: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  user: {
                    username: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  tags: {
                    some: {
                      tag: {
                        name: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
            },
          }),
        ]);
    }

    return NextResponse.json({
      questions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
      },
      {
        status: 500,
      }
    );
  }
}
