import { AppError } from "./base.error";

export function handleApiError(error: unknown) {
  console.log(error);

  if (error instanceof AppError) {
    return Response.json(
      {
        error: true,
        code: error.code,
        message: error.message,
      },
      { status: error.statusCode },
    );
  }

  return Response.json(
    {
      error: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
    { status: 500 },
  );
}
