import { Injectable } from "@nestjs/common";
import {
  FSM,
  RequestContext,
  StateMachineConfig,
  Transitions,
} from "@deenruv/core";
import { ReviewState } from "../constants.js";
import { ReviewEntity } from "../entities/review.entity.js";

type ChangeReviewStateInput = {
  state: ReviewState;
  message?: string;
};

type ReferralTransitionData = {
  ctx: RequestContext;
  review: ReviewEntity;
  message?: string;
};

const transitions: Transitions<ReviewState> = {
  ACCEPTED: { to: [ReviewState.DECLINED] },
  DECLINED: { to: [ReviewState.ACCEPTED] },
  PENDING: { to: [ReviewState.ACCEPTED, ReviewState.DECLINED] },
};

@Injectable()
export class ReviewStateMachine {
  constructor() {}

  private readonly config: StateMachineConfig<
    ReviewState,
    ReferralTransitionData
  > = {
    transitions,
    onTransitionStart: async (fromState, toState, { ctx, review, message }) => {
      if ([ReviewState.ACCEPTED, ReviewState.DECLINED].includes(toState)) {
        review.responseCreatedAt = new Date();
        review.response = message;
        if (ctx.activeUserId) {
          // we need only id to make proper relation
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          review.responseAuthor = { id: ctx.activeUserId } as any;
        }
      }
    },
  };

  getNextStates(review: ReviewEntity): readonly ReviewState[] {
    const fsm = new FSM(this.config, review.state);
    return fsm.getNextStates();
  }

  async transition(
    ctx: RequestContext,
    review: ReviewEntity,
    { state, ...rest }: ChangeReviewStateInput,
  ) {
    const fsm = new FSM(this.config, review.state);
    const result = await fsm.transitionTo(state, {
      ctx,
      review,
      ...rest,
    });
    review.state = state;

    return result;
  }
}
