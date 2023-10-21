export interface Job{
    id: string;
    title: string;
    description: string;
    salary: number;
    hire_name:string;
    company_name:string;
    hire_manager_id: string;
    zone:string
    profession:string;
    region:string
    manner:string
    experienced_level:string
    scope:string
}

export interface JobFilters{
    zone:string | null
    profession:string| null;
    region:string| null
    manner:string| null
    experienced_level:string| null
    scope:string| null
}