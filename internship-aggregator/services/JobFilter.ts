import type { JobPost } from "@/types/jobs";

type JobFilters = {
  keyword?: string;
  company?: string;
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function hasWordStart(haystack: string, token: string): boolean {
  // \btoken  => "intern" matches "internship" but not "internal"
  const re = new RegExp(`\\b${escapeRegex(token)}`, "i");
  return re.test(haystack);
}

function isInternToken(t: string) {
  return t === "intern" || t === "internship" || t === "interns" || t === "internships";
}

function internshipSignal(h: string): boolean {
  // Strong signals that it's an internship listing
  return (
    /\bintern\b/i.test(h) ||
    /\binternship\b/i.test(h) ||
    /\b(co[-\s]?op)\b/i.test(h) ||
    /\bindustrial training\b/i.test(h) ||
    /\bundergraduate\b/i.test(h)
  );
}

function scoreJob(job: JobPost, tokens: string[]): number {
  const title = (job.title ?? "").toLowerCase();
  const company = (job.company ?? "").toLowerCase();
  const location = (job.location ?? "").toLowerCase();

  // weighted haystacks
  const titleH = title;
  const companyH = company;
  const locationH = location;

  let score = 0;

  // Internship boost
  const internBoost = internshipSignal(`${title} ${company} ${location}`) ? 50 : 0;
  score += internBoost;

  // Token matches: OR-style scoring (no strict AND)
  for (const t of tokens) {
    if (isInternToken(t)) continue; // handled separately by internBoost + internshipSignal
    if (hasWordStart(titleH, t)) score += 20;
    else if (hasWordStart(companyH, t)) score += 8;
    else if (hasWordStart(locationH, t)) score += 5;
    else {
      // mild penalty for totally missing token, but not a hard reject
      score -= 2;
    }
  }

  // Extra boost if title contains "intern" / "internship"
  if (/\bintern\b/i.test(title) || /\binternship\b/i.test(title)) score += 30;

  return score;
}

export function filterJobs(jobs: JobPost[], filters: JobFilters): JobPost[] {
  const keyword = (filters.keyword ?? "").trim();
  const company = filters.company ?? "ALL";

  const tokens = tokenize(keyword);
  const wantsInternships = tokens.some(isInternToken) || /\bintern\b/i.test(keyword) || /\binternship\b/i.test(keyword);

  const filtered = jobs.filter((job) => {
    const matchesCompany = company === "ALL" || job.company === company;
    if (!matchesCompany) return false;

    if (!keyword) return true;

    const h = `${job.title} ${job.company} ${job.location} ${job.remoteType} ${job.source}`.toLowerCase();

    // If user intent includes intern/internship, only show internship-like jobs
    if (wantsInternships && !internshipSignal(h)) return false;

    // Otherwise don’t hard-filter by tokens; ranking will handle relevance
    return true;
  });

  if (!keyword) return filtered;

  // Rank by score descending
  return [...filtered].sort((a, b) => scoreJob(b, tokens) - scoreJob(a, tokens));
}