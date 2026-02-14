"use client";

import { useMemo, useState } from "react";
import type { JobPost } from "@/types/job";
import { filterJobs } from "@/services/JobFilter";

const MOCK_JOBS: JobPost[] = [
  {
    id: "1",
    source: "GREENHOUSE",
    company: "Stripe",
    title: "Software Engineering Intern",
    location: "Singapore",
    remoteType: "ONSITE",
    postUrl: "https://boards.greenhouse.io/stripe/jobs/1",
    ingestedAt: "2026-02-14T09:00:00.000Z",
    postedAt: "2026-02-10T00:00:00.000Z",
    hashKey: "stripe-software-engineering-intern-singapore"
  },
  {
    id: "2",
    source: "LEVER",
    company: "Notion",
    title: "Product Engineering Intern",
    location: "Remote",
    remoteType: "REMOTE",
    postUrl: "https://jobs.lever.co/notion/2",
    ingestedAt: "2026-02-14T09:05:00.000Z",
    postedAt: "2026-02-12T00:00:00.000Z",
    hashKey: "notion-product-engineering-intern-remote"
  },
  {
    id: "3",
    source: "GREENHOUSE",
    company: "Databricks",
    title: "Data Engineering Intern",
    location: "Singapore",
    remoteType: "HYBRID",
    postUrl: "https://boards.greenhouse.io/databricks/jobs/3",
    ingestedAt: "2026-02-14T09:10:00.000Z",
    postedAt: "2026-02-08T00:00:00.000Z",
    hashKey: "databricks-data-engineering-intern-singapore"
  },
  {
    id: "4",
    source: "LEVER",
    company: "Coinbase",
    title: "Backend Engineering Intern",
    location: "Remote",
    remoteType: "REMOTE",
    postUrl: "https://jobs.lever.co/coinbase/4",
    ingestedAt: "2026-02-14T09:15:00.000Z",
    postedAt: "2026-02-13T00:00:00.000Z",
    hashKey: "coinbase-backend-engineering-intern-remote"
  },
  {
    id: "5",
    source: "GREENHOUSE",
    company: "Airbnb",
    title: "Frontend Engineering Intern",
    location: "Singapore",
    remoteType: "HYBRID",
    postUrl: "https://boards.greenhouse.io/airbnb/jobs/5",
    ingestedAt: "2026-02-14T09:20:00.000Z",
    postedAt: "2026-02-09T00:00:00.000Z",
    hashKey: "airbnb-frontend-engineering-intern-singapore"
  },
  {
    id: "6",
    source: "LEVER",
    company: "Canva",
    title: "Full Stack Engineering Intern",
    location: "Sydney",
    remoteType: "ONSITE",
    postUrl: "https://jobs.lever.co/canva/6",
    ingestedAt: "2026-02-14T09:25:00.000Z",
    postedAt: "2026-02-11T00:00:00.000Z",
    hashKey: "canva-fullstack-engineering-intern-sydney"
  },
  {
    id: "7",
    source: "GREENHOUSE",
    company: "Shopify",
    title: "DevOps Engineering Intern",
    location: "Remote",
    remoteType: "REMOTE",
    postUrl: "https://boards.greenhouse.io/shopify/jobs/7",
    ingestedAt: "2026-02-14T09:30:00.000Z",
    postedAt: "2026-02-07T00:00:00.000Z",
    hashKey: "shopify-devops-engineering-intern-remote"
  },
  {
    id: "8",
    source: "LEVER",
    company: "Grab",
    title: "Machine Learning Intern",
    location: "Singapore",
    remoteType: "HYBRID",
    postUrl: "https://jobs.lever.co/grab/8",
    ingestedAt: "2026-02-14T09:35:00.000Z",
    postedAt: "2026-02-06T00:00:00.000Z",
    hashKey: "grab-machine-learning-intern-singapore"
  }
];


export default function InternshipPage() {

  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("ALL");

  const companies = useMemo(() => {
    const unique = Array.from(
      new Set(MOCK_JOBS.map((j) => j.company))
    ).sort((a, b) => a.localeCompare(b));

    return ["ALL", ...unique];
  }, []);

  const filteredJobs = useMemo(() => {
    return filterJobs(MOCK_JOBS, keyword, company);
  }, [keyword, company]);

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
          Showing {filteredJobs.length} of {MOCK_JOBS.length}
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
