import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    name: string;
    comment: string;
    rating: bigint;
}
export interface backendInterface {
    getAllReviews(): Promise<Array<Review>>;
    getAllReviewsSortedByRating(): Promise<Array<Review>>;
    submitReview(name: string, rating: bigint, comment: string): Promise<void>;
}
