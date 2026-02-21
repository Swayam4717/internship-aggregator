"use client";

import { useEffect, useMemo, useState } from "react";
import type { JobPost } from "@/types/job";
import { filterJobs } from "@/services/JobFilter";



export default function InternshipPage() {

  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("ALL");
  const [jobs, setJobs] = useState<JobPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load(){
      const res = await fetch("/api/jobs", { cache: "no-store" });
      const data = await res.json();
      if(!cancelled){
        setJobs(data.jobs ?? []);
      }
    }
    load();
    return () => {
      cancelled = true;
    }
  }, []);
  const companies = useMemo(() => {
    const unique = Array.from(
      new Set(jobs.map((j) => j.company))
    ).sort((a, b) => a.localeCompare(b));

    return ["ALL", ...unique];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, { keyword, company });
  }, [jobs, keyword, company]);

  return (
    <div>
      {/* Filters FIRST */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search..."
          style={{
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            color: "black",
            backgroundColor: "white"

          }}
        />

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            color: "black",
            backgroundColor: "white"
            }}
        >
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div>
          Showing {filteredJobs.length} of {jobs.length}
        </div>
      </div>

      {/* Results */}
      {filteredJobs.map((job) => (
        <div key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.company} - {job.location}</p>
          <p>Source: {job.source}</p>
          <a href={job.postUrl} target="_blank" rel="noreferrer">
            View Job Posting
          </a>
          <hr />
        </div>
      ))}
    </div>
  );
}
