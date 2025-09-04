import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { TypeOrmLogger } from "../config/logger/typeorm-logger";

import { TransactionSubscriber } from "./transaction-subscriber";
import { TransactionWrapper } from "./transaction-wrapper";
import { TransactionalConnection } from "./transactional-connection";
import { DataSourceFactoryHook } from "../index.js";

let defaultTypeOrmModule: DynamicModule;
type DataSourceOptionsWithHooks = DataSourceOptions & {
  dataSourceHooks: DataSourceFactoryHook[];
};

@Module({
  imports: [ConfigModule],
  providers: [
    TransactionalConnection,
    TransactionSubscriber,
    TransactionWrapper,
  ],
  exports: [TransactionalConnection, TransactionSubscriber, TransactionWrapper],
})
export class ConnectionModule {
  static forRoot(): DynamicModule {
    if (!defaultTypeOrmModule) {
      defaultTypeOrmModule = TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const { dbConnectionOptions, dataSourceHooks = [] } = configService;
          const logger = ConnectionModule.getTypeOrmLogger(dbConnectionOptions);
          return { ...dbConnectionOptions, logger, dataSourceHooks };
        },
        dataSourceFactory: async (params) => {
          if (!params) {
            throw new Error("No DataSourceOptions were provided");
          }
          const { dataSourceHooks, ...options } =
            params as DataSourceOptionsWithHooks;

          const dataSource = await new DataSource(options).initialize();
          for (const hook of dataSourceHooks || []) {
            await hook(dataSource);
          }
          return dataSource;
        },
        inject: [ConfigService],
      });
    }
    return {
      module: ConnectionModule,
      imports: [defaultTypeOrmModule],
    };
  }

  static forPlugin(): DynamicModule {
    return {
      module: ConnectionModule,
      imports: [TypeOrmModule.forFeature()],
    };
  }

  static getTypeOrmLogger(dbConnectionOptions: DataSourceOptions) {
    if (!dbConnectionOptions.logger) {
      return new TypeOrmLogger(dbConnectionOptions.logging);
    } else {
      return dbConnectionOptions.logger;
    }
  }
}
