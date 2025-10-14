import { API_CONFIG } from "@/constants/config";
import { AuthResponse, SignInCredentials, SignUpCredentials } from "@/types/auth";
import { storage } from "@/utils/storage";

interface AuthServiceResponse {
    success: boolean;
    data?: AuthResponse;
    message?: string;
}

export const authService = {
    /**
     * Sign in user with email and password
     */

    async signin(credentials: SignInCredentials): Promise<AuthServiceResponse> {
        const { email, password } = credentials;

        try {
            const response = await fetch(
                `${API_CONFIG.baseURL}${API_CONFIG.endpoints.signin}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_CONFIG.apiKey,
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => { { } });
                throw new Error(
                    errorData.message || `Server error: ${response.status}. Please try again`
                );
            }

            const data: AuthResponse = await response.json();
            console.log("signin response", data);

            await storage.setAuthData(data);

            return {
                success: true,
                data
            }
        } catch (error) {
            console.error('Signin error:', error);
            throw error;
        }
    },

    async signup(credentials: SignUpCredentials): Promise<AuthServiceResponse> {
        const { email, name, password } = credentials;
        try {
            const response = await fetch(
                `${API_CONFIG.baseURL}${API_CONFIG.endpoints.signup}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_CONFIG.apiKey,
                    },
                    body: JSON.stringify({ name, email, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => { { } });
                throw new Error(
                    errorData.message || `Server error: ${response.status}. Please try again`
                );
            }

            const data: AuthResponse = await response.json();
            console.log("signup response", data);

            await storage.setAuthData(data);

            return {
                success: true,
                data,
                message: "Account created successfully!"
            }

        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    async logout(): Promise<boolean> {
        try {
            return await storage.clearAuthData();
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }
}