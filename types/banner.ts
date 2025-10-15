export interface BannerItem {
    id: string;
    image: string;
    order: number;
    status: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface BannerData {
    count: number;
    data: BannerItem[];
    message: string;
    success: boolean;
}

export interface BannerResponse {
    data?: BannerData;
    error?: string | unknown;
}