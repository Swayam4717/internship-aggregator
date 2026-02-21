import { NextResponse } from "next/server";
import { fetchGreenhouseJobs } from "@/connectors/greenhouse";

const GREENHOUSE_BOARDS = [
  "https://boards.greenhouse.io/stripe",
  "https://boards.greenhouse.io/databricks",
  "https://boards.greenhouse.io/airbnb",
  "https://boards.greenhouse.io/shopify",
];

export async function POST() {
  try {
    const results = await Promise.all(
      GREENHOUSE_BOARDS.map((url) => fetchGreenhouseJobs(url))
    );

    const jobs = results.flat();

    // Later: write to DB here
    return NextResponse.json(
      { ok: true, refreshedCount: jobs.length },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Refresh failed" },
      { status: 500 }
    );
  }
}