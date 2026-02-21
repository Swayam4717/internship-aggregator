import type { JobPost } from "@/types/job";
type JobFilters = {
        keyword?: string
        company?:string

    }
export function filterJobs(jobs: JobPost[], filters: JobFilters): JobPost[] {
    const keyword = (filters.keyword ?? "").trim().toLowerCase();
    const company = filters.company ?? "ALL";

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
      keyword === "" || haystack.includes(keyword);

    return matchesCompany && matchesKeyword;
  });
}
