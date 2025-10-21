export interface CreateFeedbackInput {
    productId: string;
    comment: string;
    rating?: number;
}

export interface UpdateFeedbackInput {
    feedbackId: string;
    comment: string;
    rating?: number;
}

export interface DeleteFeedbackInput {
    feedbackId: string;
    productId?: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    count?: number;
}
