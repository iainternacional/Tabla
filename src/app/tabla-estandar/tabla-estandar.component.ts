import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ADTSettings } from '../../../node_modules/angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { IDemoNgComponentEventType } from '../Interfaces/IDemoNgComponentEventType';
import { ITableConfig, ITableAction } from '../Interfaces/ITableConfig';
import { DataTablesModule } from "angular-datatables";
import { CommonModule } from '@angular/common';
import { EnumAcciones } from '../enums/action-buttons.enum';
@Component({
  selector: 'app-tabla-estandar',
  imports: [DataTablesModule, CommonModule],
  templateUrl: './tabla-estandar.component.html',
  styleUrl: './tabla-estandar.component.css',
  standalone: true,
})
export class TablaEstandarComponent implements OnInit, AfterViewInit {
  @Input() tableConfig!: ITableConfig;
  @Input() actionKey: string = ''; // Nueva propiedad para recibir la clave
  actions: ITableAction[] = [];
  @Output() rowSelect = new EventEmitter<any[]>();
  @Output() rowAction = new EventEmitter<{action: string, data: any}>();
  @Output() tableReady = new EventEmitter<void>();

  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  
  @ViewChild('demoNg') demoNg!: TemplateRef<any>;
  message = '';
  selectedRow: any = null;
  selectedRows: Set<any> = new Set();
  allData: any[] = [];

  ngOnInit(): void {
    this.initializeActions();
    this.initializeDataTable();
  }

  private initializeActions(): void {
    // Validación de la clave de acción
    if (!this.actionKey) {
        console.warn('No se proporcionó una clave de acción');
        return;
    }

    // Validación de existencia de acciones en el enum
    const actionSet = EnumAcciones[this.actionKey as keyof typeof EnumAcciones];
    if (!actionSet) {
        console.warn(`No se encontraron acciones para la clave: ${this.actionKey}`);
        return;
    }

    try {
        this.actions = actionSet.map(item => {
            // Validación de estructura del item
            if (!item || typeof item !== 'object') {
                throw new Error('Formato de acción inválido');
            }

            const entries = Object.entries(item);
            if (entries.length === 0) {
                throw new Error('Acción sin configuración');
            }

            const [actionType, config] = entries[0];

            // Validación de configuración requerida
            if (!config.label || !config.action) {
                throw new Error(`Configuración incompleta para la acción: ${actionType}`);
            }

            return {
                label: config.label,
                action: config.action,
                icon: config.icon?.replace('fa fa-', ''),
                class: config.class?.replace('btn btn-sm ', ''),
                showCondition: (row: any) => true
            } as ITableAction;
        });

        console.log(`Acciones inicializadas para ${this.actionKey}:`, this.actions);
    } catch (error) {
        console.error('Error al inicializar acciones:', error);
        this.actions = []; // Resetear acciones en caso de error
    }
  }

  private initializeDataTable(): void {
    debugger
    const columns = [
      ...(this.tableConfig.selectable ? [{
        title: '',
        data: null,
        orderable: false,
        searchable: false,
        width: '40px',
        render: (data: any, type: any, row: any) => {
          return `<input type="checkbox" class="form-check-input" ${this.selectedRows.has(row) ? 'checked' : ''}>`;
        }
      }] : []),
      ...this.tableConfig.columns,
      // Solo agregar la columna de acciones si hay acciones definidas
      ...(this.actions && this.actions.length > 0 ? [{
        title: 'Acciones',
        data: null,
        orderable: false,
        searchable: false,
        defaultContent: '',
        createdCell: (cell: any, cellData: any, rowData: any) => {
          this.createActionsCell(cell, rowData);
        }
      }] : [])
    ];

    this.dtOptions = {
      ajax: this.tableConfig.dataUrl ? {
        url: this.tableConfig.dataUrl,
        dataSrc: (json: any[]) => {
          this.allData = json;
          return json;
        }
      } : undefined,
      data: this.tableConfig.data,
      columns: columns,
      rowCallback: (row: Node, data: any) => {
        if (this.tableConfig.selectable) {
          const checkbox = $(row).find('.form-check-input');
          checkbox.on('change', () => this.toggleRow(data));
        }
        return row;
      },
      pageLength: this.tableConfig.pageLength || 10,
      searching: this.tableConfig.searching ?? true,
      ordering: this.tableConfig.ordering ?? true,
      language: {
        emptyTable: 'No hay datos disponibles'
      }
    };
  }

  private createActionsCell(cell: any, rowData: any): void {
    debugger
    const context = {
      $implicit: rowData,         // Datos implícitos de la fila
      rowData: rowData,           // Datos de la fila actual
      actions: this.actions.filter(action =>  // Filtra las acciones según condiciones
        !action.showCondition || action.showCondition(rowData)
      ),
      captureEvents: (e: IDemoNgComponentEventType) => { // Manejador de eventos
        e.data = rowData;
        this.onCaptureEvent(e);
      }
    };

    // Crear una nueva vista embebida con el contexto
    const view = this.demoNg.createEmbeddedView(context);
    
    // Limpiar el contenido actual de la celda
    cell.innerHTML = '';
    
    // Agregar todos los nodos raíz a la celda
    view.rootNodes.forEach(node => {
      cell.appendChild(node);
    });

    // Detectar cambios en la vista
    view.detectChanges();
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.dtTrigger.next(this.dtOptions);
      this.tableReady.emit();
    }).catch(error => {
      console.error('Error initializing DataTable:', error);
    });
  }

  onCaptureEvent(event: IDemoNgComponentEventType): void {
    if (!event) {
      console.error('Event is undefined or null');
      return;
    }
    this.selectedRow = event.data;
    this.rowAction.emit({ 
      action: event.cmd, 
      data: event.cmd === 'deleteSelected' ? Array.from(this.selectedRows) : event.data 
    });
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  toggleRow(row: any): void {
    if (this.tableConfig.multiSelect) {
      if (this.selectedRows.has(row)) {
        this.selectedRows.delete(row);
      } else {
        this.selectedRows.add(row);
      }
    } else {
      this.selectedRows.clear();
      this.selectedRows.add(row);
    }
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
        // Si todas están seleccionadas, deseleccionar todas
        this.selectedRows.clear();
    } else {
        // Si no todas están seleccionadas, seleccionar todas
        this.allData.forEach(row => this.selectedRows.add(row));
    }
    
    // Emitir el evento con las filas seleccionadas
    this.rowSelect.emit(Array.from(this.selectedRows));
    
    // Actualizar el estado visual de los checkboxes de las filas
    const table = $('table').DataTable();
    table.rows().every((rowIdx) => {
        const node = table.row(rowIdx).node();
        const checkbox = $(node).find('.form-check-input');
        checkbox.prop('checked', this.selectedRows.has(table.row(rowIdx).data()));
    });
}

  isAllSelected(): boolean {
    return this.allData.length > 0 && this.selectedRows.size === this.allData.length;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
