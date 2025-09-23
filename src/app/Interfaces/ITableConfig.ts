export interface ITableColumn {
  title: string;
  data: string;
  sortable?: boolean;
  visible?: boolean;
  render?: (data: any, type: any, row: any) => string;
}

export interface ITableConfig {
  columns: ITableColumn[];
  dataUrl?: string;
  pageLength?: number;
  searching?: boolean;
  ordering?: boolean;
  serverSide?: boolean;
  responsive?: boolean;
}

export interface ITableAction {
  label?: string;
  icon?: string;
  action: (rowData: any) => void;
  showCondition?: (rowData: any) => boolean;
}