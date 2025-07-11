import { RequestContext, DeenruvEvent } from "@deenruv/core";
import { ReviewEntity } from "./entities/review.entity.js";

export default class ReviewChangeStateEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public review: ReviewEntity,
    public fromState: string,
    public toState: string,
    public message?: string,
  ) {
    super();
  }
}
