import express from "express";

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type ApiError =
  | "invalid-date-format"
  | "invalid-date-range"
  | "invalid-pagination";

const apiErrorToProblemDetails = (error: ApiError) => {
  switch (error) {
    case "invalid-date-format":
      return {
        status: 400,
        title: "Invalid date format",
        detail: "Requires ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
      };
    case "invalid-date-range":
      return {
        status: 400,
        title: "Invalid date range",
        detail: "Start date must be before end date",
      };
    case "invalid-pagination":
      return {
        status: 400,
        title: "Invalid pagination",
        detail: "Offset and limit must be positive integers",
      };
  }
};

export const applyProblemDetails = (
  res: express.Response,
  type: ApiError,
  extensions: { [key: string]: JSONValue } | null = null
) => {
  const problemDetails = apiErrorToProblemDetails(type);
  res
    .status(problemDetails.status)
    .header("Content-Type", "application/problem+json")
    .send({
      type: `/errors/${type}`,
      ...problemDetails,
      ...extensions,
    });
};
