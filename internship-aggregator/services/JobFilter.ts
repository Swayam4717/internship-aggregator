import type { JobPost } from "@/types/job";

export function filterJobs(jobs: JobPost[], keyword: string, company: string): JobPost[] {
    const kw = keyword.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesCompany =
      company === "ALL" || job.company === company;

    const haystack = `
      ${job.title}
      ${job.company}
      ${job.location}
      ${job.remoteType}
      ${job.source}
    `.toLowerCase();

    const matchesKeyword =
      kw === "" || haystack.includes(kw);

    return matchesCompany && matchesKeyword;
  });
}