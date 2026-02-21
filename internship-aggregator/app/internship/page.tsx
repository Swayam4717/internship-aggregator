"use client";

import { useEffect, useMemo, useState } from "react";
import type { JobPost } from "@/types/job";
import { filterJobs } from "@/services/JobFilter";
import "./internship.css";


export default function InternshipPage() {

  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("ALL");
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [sort, setSort] = useState<"RECENT" | "COMPANY" | "TITLE">("RECENT");

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
    const filtered = filterJobs(jobs, { keyword, company });
    const toTime = (s?: string) => (s ? new Date(s).getTime() : 0);
    return [...filtered].sort((a,b) => {
      if (sort === "RECENT"){
        return toTime(b.postedAt || b.ingestedAt) - toTime(a.postedAt || a.ingestedAt);
      }
      if (sort === "COMPANY"){
        return a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
      }
      if (sort === "TITLE"){
        return a.title.localeCompare(b.title) || a.company.localeCompare(b.company);
      }
    })
    
  }, [jobs, keyword, company,sort]);

  return (
    <div className="internshipPage">
    <div className="container">
      <div className="header">
        <div className="titleWrap">
          <h1>Internship Aggregator</h1>
          <p>Search internships across company boards (Greenhouse now, more sources next).</p>
        </div>
        <div className="statPill">
          Showing <b>{filteredJobs.length}</b> of <b>{jobs.length}</b>
        </div>
      </div>

      <div className="filters">
        <input
          className="input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search title, company, location..."
        />

        <select
          className="select"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="RECENT">Sort: Recent</option>
          <option value="COMPANY">Sort: Company</option>
          <option value="TITLE">Sort: Title</option>
        </select>
        {/* <select
          className="select"
          value={"RECENT"}
          onChange={() => {}}
          disabled
          title="Sorting coming next"
        >
          <option value="RECENT">Sort: Recent</option>
        </select> */}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty">No internships match your filters.</div>
      ) : (
        <div className="grid">
          {filteredJobs.map((job) => {
            const showRemote = job.remoteType !== "UNKNOWN";
            const companyName =
              job.company.length ? job.company[0].toUpperCase() + job.company.slice(1) : job.company;

            return (
              <div className="card" key={job.id}>
                <div className="cardTop">
                  <div>
                    <h2 className="jobTitle">{job.title}</h2>
                    <div className="meta">
                      <span><b>{companyName}</b></span>
                      <span className="dot">•</span>
                      <span>{job.location}</span>
                      {showRemote && (
                        <>
                          <span className="dot">•</span>
                          <span>{job.remoteType}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="badges">
                    <span className="badge">{job.source}</span>
                    {showRemote && <span className="badge badgeAccent">{job.remoteType}</span>}
                  </div>
                </div>

                <div className="cardBottom">
                  <div className="small">
                    {job.postedAt ? `Updated: ${new Date(job.postedAt).toLocaleDateString()}` : "Updated: —"}
                  </div>

                  <a className="button" href={job.postUrl} target="_blank" rel="noreferrer">
                    View posting <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}
