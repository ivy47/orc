import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { OrcConfig } from './orc.config';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(config?: Partial<OrcConfig>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: OrcConfig,
          useValue: new OrcConfig(config),
        },
      ],
    };
  }
}
