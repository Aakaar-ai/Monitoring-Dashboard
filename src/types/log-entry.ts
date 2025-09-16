import { LogEntry as BaseLogEntry } from './index';

export interface LogEntry extends BaseLogEntry {
  log_data?: Record<string, any>;
}
