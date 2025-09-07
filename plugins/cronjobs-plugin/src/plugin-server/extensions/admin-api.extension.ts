import * as _ from "graphql";
import { gql } from "graphql-tag";

export const AdminAPIExtension = gql`
  type CronJob {
    name: String!
    schedule: String!
    lastScheduleTime: String!
    lastSuccessfulTime: String!
    channelToken: String!
  }

  input CronJobsListInput {
    take: Int
    channelToken: String
    jobQueueName: String
  }

  type CronJobsList {
    items: [CronJob!]!
    totalItems: Int!
  }

  input CronJobInput {
    name: String!
    schedule: String!
  }

  input CronJobCreateInput {
    jobQueueName: String!
    schedule: String!
  }

  type CronJobsPreset {
    label: String!
    value: String!
    default: Boolean!
  }

  type CronJobsConfig {
    suggestedJobs: [String!]!
    presets: [CronJobsPreset!]!
  }

  extend type Query {
    cronJobsConfig: CronJobsConfig!
    cronJobs(input: CronJobsListInput!): CronJobsList!
  }

  extend type Mutation {
    createCronJob(input: CronJobCreateInput!): Boolean
    updateCronJob(job: CronJobInput!): Boolean
    removeCronJob(jobs: [CronJobInput!]!): Boolean
  }
`;
