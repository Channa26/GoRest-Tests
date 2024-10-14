export interface User extends UserData {
    id: number;
}

export interface UserData {
    name?: string;
    email?: string;
    gender?: string;
    status?: string;
}
