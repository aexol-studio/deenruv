export const REVIEWS_PLUGIN_OPTIONS = Symbol("reviews-plugin-options");

export enum ReviewState {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}
