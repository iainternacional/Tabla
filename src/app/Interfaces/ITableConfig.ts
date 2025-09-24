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
  label: string;      // Texto del botón
  icon?: string;      // Icono opcional
  action: string;     // Identificador de la acción
  class?: string;     // Clases CSS para estilo
  showCondition?: (row: any) => boolean;  // Función que determina si se muestra el botón
}