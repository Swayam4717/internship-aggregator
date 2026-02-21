import { NextResponse} from "next/server";
import type { JobPost } from "@/types/jobs";
import { fetchGreenhouseJobs } from "@/connectors/greenhouse";
const GREENHOUSE_BOARDS = [
    "https://boards.greenhouse.io/stripe",
    "https://boards.greenhouse.io/databricks",
    "https://boards.greenhouse.io/airbnb",
];
export async function GET() {
    try{
       const results = await Promise.allSettled(
  GREENHOUSE_BOARDS.map((url) => fetchGreenhouseJobs(url))
);

const jobs = results
  .filter((r): r is PromiseFulfilledResult<JobPost[]> => r.status === "fulfilled")
  .flatMap((r) => r.value);

// optional: collect failures for debugging
const failedBoards = results
  .map((r, i) => (r.status === "rejected" ? GREENHOUSE_BOARDS[i] : null))
  .filter((x): x is string => x != null);

const deduped = Array.from(new Map(jobs.map((j) => [j.hashKey, j])).values());

return NextResponse.json(
  { jobs: deduped, failedBoards },
  { status: 200 }
);
    }catch(err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch jobs"}, 
        { status: 500 });
    }
}