export type SourceType = "GREENHOUSE"|"LEVER";
export type RemoteType = "REMOTE"|"HYBRID"|"ONSITE"|"UNKNOWN";
export type JobPost = {
    id:string;
    source:SourceType;
    company:string;
    title:string;
    location:string;
    remoteType:RemoteType;
    postURL:string;
    ingestedAt:string;

    postedAt?:string;
    team?:string;
    descriptionSnippet?:string;
    sourceJobId?:string;
    hashKey:string;

};
