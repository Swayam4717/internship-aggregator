import type {JobPost} from "@/types/jobs";
const MOCK_JOBS: JobPost[] = [
    {
        id: "1",
        source: "GREENHOUSE",
        company: "STRIPE",
        title: "Software Engineer Intern",
        location: "Singapore",
        remoteType: "ONSITE",
        postURL: "https://www.stripe.com/careers/software-engineer-intern",
        ingestedAt: "2024-06-01T12:00:00Z",
        postedAt: "2024-05-30T12:00:00Z",
        hashKey: "stripe-software-engineer-intern-1"
    
    },
    {
        id: "2",
        source: "LEVER",
        company: "Notion",
        title: "Product Engineer Intern",
        location: "Remote",
        remoteType: "REMOTE",
        postURL: "https://www.notion.com/careers/product-engineer-intern",
        ingestedAt: "2024-06-02T12:00:00Z",
        postedAt: "2024-06-01T12:00:00Z",
        hashKey: "notion-product-engineer-intern-2"
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
    return(
        <div>
            <h1>Internship Opportunities</h1>
            {MOCK_JOBS.map((job) => (
                <div key = {job.id}>
                    <h2>{job.title}</h2>
                    <p>{job.company} - {job.location}</p>
                    <p>Source: {job.source}</p>
                    <a href = {job.postURL} target= "_blank">
                        View Job Posting
                    </a>
                    <hr />
                </div>

            )
        )}
        </div>
    );
}