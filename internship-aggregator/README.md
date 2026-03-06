# Internship Aggregator

A full-stack internship aggregation platform that fetches and consolidates internship listings from public company job boards.

## Features

- Aggregates jobs from multiple sources:
  - Greenhouse
  - Lever
- Backend API aggregation layer with Next.js route handlers
- Deduplication using normalized hash keys
- Keyword search with improved matching logic
- Sorting and filtering by company
- Responsive UI for browsing live internships

## Tech Stack

- Next.js
- TypeScript
- Route Handlers / REST-style API endpoints
- External job board APIs
- Custom filtering and scoring logic

## Architecture

Frontend (`/internship`) calls:

- `GET /api/jobs`

Which aggregates data from:

- Greenhouse connector
- Lever connector

## Running Locally

```bash
npm install
npm run dev

Open http://localhost:3000/internship

Notes

This project currently uses live public job board data and lightweight caching.
Future improvements could include:

database persistence

scheduled refresh jobs

additional ATS connectors

advanced search ranking

