import { Injectable } from '@angular/core';
import { IAppConfig, AppConfig } from '../models/app-config.model';

@Injectable()
export class ConfigService {

    public static settings: IAppConfig = new AppConfig();

    constructor() {

    }

    public load(config: IAppConfig) {
        if (!!config) {
            ConfigService.settings.production = config.production;
            if (!!config.core) {
                Object.keys(config.core).forEach(propertyName => {
                    if (typeof config.core[propertyName] !== 'undefined') {
                        ConfigService.settings.core[propertyName] = config.core[propertyName];
                    }
                });
            }
            if (!!config.resumablejs) {
                Object.keys(config.resumablejs).forEach(propertyName => {
                    if (typeof config.resumablejs[propertyName] !== 'undefined') {
                        ConfigService.settings.resumablejs[propertyName] = config.resumablejs[propertyName];
                    }
                });
            }
        }
    }
}
