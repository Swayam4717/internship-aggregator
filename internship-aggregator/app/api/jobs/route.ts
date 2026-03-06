import { NextResponse } from "next/server";
import type { JobPost } from "@/types/jobs";
import { fetchGreenhouseJobs } from "@/connectors/greenhouse";
import { fetchLeverJobs } from "@/connectors/lever";

export const revalidate = 300;

const GREENHOUSE_BOARDS = [
  "https://boards.greenhouse.io/stripe",
  "https://boards.greenhouse.io/databricks",
  "https://boards.greenhouse.io/airbnb",
];

const LEVER_COMPANIES = [
  "https://jobs.lever.co/notion",
  "https://jobs.lever.co/coinbase",
  "https://jobs.lever.co/canva",
  "https://jobs.lever.co/grab",
];

export async function GET() {
  try {
    const greenhouseResults = await Promise.allSettled(
      GREENHOUSE_BOARDS.map((url) => fetchGreenhouseJobs(url))
    );

    const leverResults = await Promise.allSettled(
      LEVER_COMPANIES.map((url) => fetchLeverJobs(url))
    );

    const allResults = [...greenhouseResults, ...leverResults];

    const jobs = allResults
      .filter((r): r is PromiseFulfilledResult<JobPost[]> => r.status === "fulfilled")
      .flatMap((r) => r.value);

    const failedSources = allResults
      .map((r, i) => {
        const allSources = [...GREENHOUSE_BOARDS, ...LEVER_COMPANIES];
        return r.status === "rejected" ? allSources[i] : null;
      })
      .filter((x): x is string => x !== null);

    const deduped = Array.from(
      new Map(jobs.map((j) => [j.hashKey, j])).values()
    );

    return NextResponse.json(
      { jobs: deduped, failedSources },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}