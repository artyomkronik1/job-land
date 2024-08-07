export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    role: string;
    // 0 - hr
    // 1 - search
    follow: string[];
    about: string;
    experience: string;
    education: string;
    profilePicture: string;
    backgroundPicture: string;
    companyName: string;

}