import { Module, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import {
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
  MongooseHealthIndicator,
  SequelizeHealthIndicator,
  TerminusModule,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { isInspectableJobQueueStrategy } from "../config/job-queue/inspectable-job-queue-strategy";
import { JobQueueModule } from "../job-queue/job-queue.module";

import { HealthCheckRegistryService } from "./health-check-registry.service";
import { HealthController } from "./health-check.controller";
import { CustomHttpHealthIndicator } from "./http-health-check-strategy";

const terminusIndicatorsWithModuleRef: Array<Type<unknown>> = [
  TypeOrmHealthIndicator,
  HttpHealthIndicator,
  MongooseHealthIndicator,
  SequelizeHealthIndicator,
  MikroOrmHealthIndicator,
];

// pnpm can resolve Terminus against a different @nestjs/core instance than the
// application test module. Normalize Terminus' reflected ModuleRef parameter so
// Nest resolves the same ModuleRef token used by the active application module.
normalizeTerminusModuleRefMetadata(terminusIndicatorsWithModuleRef);

function normalizeTerminusModuleRefMetadata(providers: Array<Type<unknown>>) {
  for (const provider of providers) {
    const paramTypes = Reflect.getMetadata("design:paramtypes", provider) as
      | unknown[]
      | undefined;

    if (!Array.isArray(paramTypes)) {
      continue;
    }

    let hasDuplicateModuleRef = false;
    const normalizedParamTypes = paramTypes.map((paramType) => {
      if (isDuplicateModuleRef(paramType)) {
        hasDuplicateModuleRef = true;
        return ModuleRef;
      }
      return paramType;
    });

    if (hasDuplicateModuleRef) {
      Reflect.defineMetadata(
        "design:paramtypes",
        normalizedParamTypes,
        provider,
      );
    }
  }
}

function isDuplicateModuleRef(paramType: unknown): boolean {
  return (
    typeof paramType === "function" &&
    paramType !== ModuleRef &&
    paramType.name === ModuleRef.name
  );
}

@Module({
  imports: [TerminusModule, ConfigModule, JobQueueModule],
  controllers: [HealthController],
  providers: [HealthCheckRegistryService, CustomHttpHealthIndicator],
  exports: [HealthCheckRegistryService],
})
export class HealthCheckModule {
  constructor(
    private configService: ConfigService,
    private healthCheckRegistryService: HealthCheckRegistryService,
  ) {
    // Register all configured health checks
    for (const strategy of this.configService.systemOptions.healthChecks) {
      this.healthCheckRegistryService.registerIndicatorFunction(
        strategy.getHealthIndicator(),
      );
    }
  }
}
