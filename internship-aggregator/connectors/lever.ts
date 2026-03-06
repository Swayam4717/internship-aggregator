import type { JobPost } from "@/types/jobs";

function extractLeverSlug(companyUrl: string): string {
  const clean = companyUrl.replace(/\/+$/, "");
  const parts = clean.split("/");
  return parts[parts.length - 1];
}

function generateHashKey(company: string, title: string, location: string) {
  return `${company}-${title}-${location}`.toLowerCase().replace(/\s+/g, "-");
}

function inferRemoteType(locationName: string): JobPost["remoteType"] {
  const s = locationName.toLowerCase();
  if (s.includes("remote")) return "REMOTE";
  if (s.includes("hybrid")) return "HYBRID";
  if (s.includes("onsite") || s.includes("on-site")) return "ONSITE";
  return "UNKNOWN";
}

function titleCaseSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchLeverJobs(companyUrl: string): Promise<JobPost[]> {
  const slug = extractLeverSlug(companyUrl);

  const response = await fetch(
    `https://api.lever.co/v0/postings/${slug}?mode=json`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs from Lever for company ${slug}`);
  }

  const data = await response.json();

  const jobs: JobPost[] = (data ?? []).map((job: any) => {
    const locationName = job.categories?.location ?? "UNKNOWN";

    return {
      id: `${slug}-${job.id}`,
      source: "LEVER",
      company: titleCaseSlug(slug),
      title: job.text,
      location: locationName,
      remoteType: inferRemoteType(locationName),
      postUrl: job.hostedUrl,
      ingestedAt: new Date().toISOString(),
      postedAt: undefined,
      hashKey: generateHashKey(slug, job.text, locationName),
    };
  });

  return jobs;
}