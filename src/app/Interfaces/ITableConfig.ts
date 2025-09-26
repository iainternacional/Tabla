export interface ITableColumn {
  title: string;
  data: string;
  sortable?: boolean;
  visible?: boolean;
}

export interface ITableConfig {
  columns: any[];
  dataUrl?: string;
  data?: any[];
  pageLength?: number;
  searching?: boolean;
  ordering?: boolean;
  responsive?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
}

export interface ITableAction {
  label: string;
  icon?: string;
  action: string;
  class?: string;
  showCondition?: (row: any) => boolean;
}