
interface ApiConfig {
    baseURL: string;
    apiKey: string;
    endpoints: {
        signin: string;
        signup: string;
        banner: string;
    };
}

export const API_CONFIG: ApiConfig = {
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:9999',
    apiKey: process.env.EXPO_PUBLIC_BACKEND_API_KEY || '',
    endpoints: {
        signin: '/v1/signin',
        signup: '/v1/signup',
        banner: '/v1/banners'
    }
}