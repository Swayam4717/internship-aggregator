import { fetchGreenhouseJobs } from "@/connectors/greenhouse";
import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await fetchGreenhouseJobs(
    "https://boards.greenhouse.io/stripe"
  );

  return NextResponse.json({ jobs });
}