import type { JobPost } from "@/types/job";
function extractBoardSlug(boardUrl: string): string {
    const parts = boardUrl.split("/");
    return parts[parts.length-1];
}

function generateHashKey(company: string, title: string, location: string) {
    return `${company}-${title}-${location}`.toLowerCase().replace(/\s+/g, '-');
}

export async function fetchGreenhouseJobs(boardUrl:string): Promist<JobPost[]>{
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
        remoteType: job.metadata?.remote ? "REMOTE" : "ONSITE",
        postUrl : job.absolute_url,
        ingestedAt: new Date().toISOString(),
        postedAt: job.updated_at ?? undefined,
        hashKey: generateHashKey(slug, job.title, job.location?.name ?? "UNKNOWN"),
    }));
    return jobs;
}
