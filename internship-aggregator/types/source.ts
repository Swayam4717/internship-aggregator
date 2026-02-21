export type JobSource = {
    id: string;
    sourcetype: "GREENHOUSE" | "LEVER";
    company: string;
    boardUrl: string;
    active: boolean;
    lastFetchedAt?: string;
}