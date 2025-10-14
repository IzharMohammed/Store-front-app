export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    user: User;
    message?: string;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}