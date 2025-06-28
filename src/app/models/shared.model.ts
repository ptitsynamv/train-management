import { Train } from './train.model';

export interface TrainInfo {
  data: Train[];
  total: number;
  pageSize: number;
  page: number;
  hasNext: boolean;
}
