import { Injectable } from '@nestjs/common';
import { OrcConfig } from './orc.config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: OrcConfig) {}

  get(): OrcConfig {
    return this.config;
  }
}
