import { Component } from '@angular/core';
import { ITableConfig } from '../Interfaces/ITableConfig';
import { TablaEstandarComponent } from '../tabla-estandar/tabla-estandar.component';
@Component({
  selector: 'app-ejemplo',
  template: `
    <app-tabla-estandar
      [tableConfig]="config"
      [actionKey]="'CRUD'"
      (rowSelect)="onRowSelect($event)"
      (rowAction)="onRowAction($event)"
      (tableReady)="onTableReady()">
    </app-tabla-estandar>
  `,
  imports: [TablaEstandarComponent],
})
export class EjemploComponent {
  selectedRows: any[] = []; // Array para almacenar las filas seleccionadas
     
  config: ITableConfig = {
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Nombre', data: 'firstName' },
      { title: 'Apellido', data: 'lastName' }
    ],
    dataUrl: 'assets/data.json',
    pageLength: 5,
    searching: true,
    ordering: true,
    responsive: true,
    selectable: true,
    multiSelect: true
  };
  
  onRowSelect(selectedRows: any[]): void {
    this.selectedRows = selectedRows;
    console.log('Filas seleccionadas:', selectedRows);
  }

  onRowAction(event: {action: string, data: any}): void {
    switch(event.action) {
      case 'edit':
        console.log('Editando:', event.data);
        break;
      case 'delete':
        console.log('Eliminando:', event.data);
        break;
      case 'deleteSelected':
        console.log('Eliminando filas seleccionadas:', this.selectedRows);
        // Implementa aquí la lógica para eliminar múltiples filas
        break;
    }
  }

  onTableReady(): void {
    console.log('Tabla inicializada');
  }
}