import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, ChildEntity, Column, Index, ManyToOne } from "typeorm";

import { User } from "../user/user.entity";

import { Session } from "./session.entity";

/**
 * @description
 * An AuthenticatedSession is created upon successful authentication.
 *
 * @docsCategory entities
 */
@ChildEntity()
export class AuthenticatedSession extends Session {
  constructor(input: DeepPartial<AuthenticatedSession>) {
    super(input);
  }

  /**
   * @description
   * The {@link User} who has authenticated to create this session.
   */
  @Index()
  @ManyToOne((type) => User, (user) => user.sessions)
  user: Relation<User>;

  /**
   * @description
   * The name of the {@link AuthenticationStrategy} used when authenticating
   * to create this session.
   */
  @Column()
  authenticationStrategy: string;
}
