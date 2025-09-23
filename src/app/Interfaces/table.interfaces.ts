export interface ITableColumn {
  title: string;
  data: string;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  width?: string;
  class?: string;
  render?: (data: any, type: any, row: any) => string;
}

export interface ITableConfig {
  columns: ITableColumn[];
  dataUrl?: string;
  data?: any[];
  pageLength?: number;
  searching?: boolean;
  ordering?: boolean;
  serverSide?: boolean;
  responsive?: boolean;
  rowClickable?: boolean;
  language?: {
    search?: string;
    lengthMenu?: string;
    info?: string;
    paginate?: {
      first?: string;
      last?: string;
      next?: string;
      previous?: string;
    };
  };
}

export interface ITableAction {
  id: string;
  label?: string;
  icon?: string;
  buttonClass?: string;
  showCondition?: (row: any) => boolean;
  disabled?: (row: any) => boolean;
  tooltip?: string | ((row: any) => string);
}

export interface ITableEvent {
  type: 'rowClick' | 'action' | 'refresh' | 'pageChange' | 'search';
  actionId?: string;
  data?: any;
}

export interface ITableState {
  selectedRows: any[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  searchTerm?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}