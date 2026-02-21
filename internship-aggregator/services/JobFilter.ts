import type { JobPost } from "@/types/jobs";

type JobFilters = {
  keyword?: string;
  company?: string;
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Word-start match:
 * - "intern" matches "intern", "internship", "interns"
 * - does NOT match "internal"
 */
function matchesKeywordQuery(haystack: string, keyword: string): boolean {
  const q = keyword.trim().toLowerCase();
  if (!q) return true;

  const tokens = q.split(/\s+/).filter(Boolean);

  return tokens.every((t) => {
    const re = new RegExp(`\\b${escapeRegex(t)}`, "i");
    return re.test(haystack);
  });
}

export function filterJobs(jobs: JobPost[], filters: JobFilters): JobPost[] {
  const keyword = (filters.keyword ?? "").trim().toLowerCase();
  const company = filters.company ?? "ALL";

  return jobs.filter((job) => {
    const matchesCompany = company === "ALL" || job.company === company;

    const haystack = `
      ${job.title}
      ${job.company}
      ${job.location}
      ${job.remoteType}
      ${job.source}
    `.toLowerCase();

    const matchesKeyword = matchesKeywordQuery(haystack, keyword);

    return matchesCompany && matchesKeyword;
  });
}