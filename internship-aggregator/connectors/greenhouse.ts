import type { JobPost } from "@/types/jobs";
function extractBoardSlug(boardUrl: string): string {
    const clean = boardUrl.replace(/\/+$/,"");
    const parts = clean.split("/");
    return parts[parts.length-1];
}

function generateHashKey(company: string, title: string, location: string) {
    return `${company}-${title}-${location}`.toLowerCase().replace(/\s+/g, '-');
}
function inferRemoteType(locationName: string): JobPost["remoteType"] {
    const s = locationName.toLowerCase();
    if (s.includes("remote")) return "REMOTE";
    if (s.includes("hybrid")) return "HYBRID";
    if (s.includes("onsite") || s.includes("on-site")) return "ONSITE";
    return "UNKNOWN";
}
export async function fetchGreenhouseJobs(boardUrl:string): Promise<JobPost[]>{
    const slug = extractBoardSlug(boardUrl);
    const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
    if(!response.ok){
        throw new Error(`Failed to fetch jobs from Greenhouse for board ${slug}`);
    }
    const data = await response.json();
    const jobs: JobPost[] = data.jobs.map((job:any) => ({
        id: `${slug}-${job.id}`,
        source : "GREENHOUSE",
        company: slug,
        title : job.title,
        location : job.location?.name ?? "UNKNOWN",
        remoteType: inferRemoteType(job.location?.name ?? "UNKNOWN"),
        postUrl : job.absolute_url,
        ingestedAt: new Date().toISOString(),
        postedAt: job.updated_at ? new Date(job.updated_at).toISOString() : undefined,
        hashKey: generateHashKey(slug, job.title, job.location?.name ?? "UNKNOWN"),
    }));
    return jobs;
}
