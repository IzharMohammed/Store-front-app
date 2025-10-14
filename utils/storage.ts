import { AuthResponse, User } from "@/types/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    AUTH_TOKEN: "@auth_token",
    USER_DATA: "@user_data",
} as const;

export const storage = {
    /**
   * Save authentication data to AsyncStorage
   * @param data - Authentication response from backend
   */
    async setAuthData(data: AuthResponse): Promise<boolean> {
        try {
            await AsyncStorage.multiSet([
                [KEYS.AUTH_TOKEN, data.token || ""],
                [KEYS.USER_DATA, JSON.stringify(data.user || {})]
            ])
            return true;
        } catch (error) {
            console.error("Error saving auth data:", error);
            return false;
        }
    },

    /**
   * Get authentication token
   * @returns Token string or null
   */
    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error("Error getting token", error);
            return null;
        }
    },

    /**
     * Get user data
     * @returns User object or null  
     * 
     */
    async getUserData(): Promise<User | null> {
        try {
            const data = await AsyncStorage.getItem(KEYS.USER_DATA);
            return data ? JSON.parse(data) : null
        } catch (error) {
            console.error("Error getting user data", error);
            return null;
        }
    },

    /**
    * Clear all authentication data (used for logout)
    * @returns Success boolean
    */
    async clearAuthData(): Promise<boolean> {
        try {
            await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.USER_DATA]);
            return true;
        } catch (error) {
            console.error("Error cleaning auth data", error);
            return false;
        }
    },
    
    /**
     * Check if user is authenticated
     * @returns Boolean indicating authentication status
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    },

}

