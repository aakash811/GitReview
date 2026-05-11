import { NextResponse } from "next/server";
import { ReviewsRepository } from "@reviewai/db";

const reviewsRepo = new ReviewsRepository();

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const review = await reviewsRepo.findBySlug(slug);

    if (!review) {
      return NextResponse.json(
        {
          error: "Review not found",
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to fetch review",
      },
      {
        status: 500,
      },
    );
  }
}
