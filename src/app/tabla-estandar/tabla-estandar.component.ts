import { 
  AfterViewInit, 
  Component, 
  OnInit, 
  OnDestroy,
  TemplateRef, 
  ViewChild, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectorRef 
} from '@angular/core';
import { ADTSettings } from '../../../node_modules/angular-datatables/src/models/settings';
import { Subject, Subscription } from 'rxjs';
import { IDemoNgComponentEventType } from '../Interfaces/IDemoNgComponentEventType';
import { BotonesComponent } from '../botones/botones.component';
import { 
  ITableConfig, 
  ITableAction, 
  ITableEvent, 
  ITableState 
} from '../Interfaces/table.interfaces';
import { DataTablesModule } from "angular-datatables";
import { CommonModule } from '@angular/common';

interface ActionTemplateContext {
  rowData: any;
  captureEvents: (event: IDemoNgComponentEventType) => void;
}

@Component({
  selector: 'app-tabla-estandar',
  imports: [DataTablesModule, CommonModule, BotonesComponent],
  templateUrl: './tabla-estandar.component.html',
  styleUrl: './tabla-estandar.component.css',
  standalone: true,
})
export class TablaEstandarComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  @ViewChild('demoNg') demoNg!: TemplateRef<ActionTemplateContext>;
  message = '';
  selectedRow: any = null;

  ngOnInit(): void {
    setTimeout(() => {
      debugger
      this.dtOptions = {
      ajax: {
        url: 'assets/data.json',
        dataSrc: ''
      },
      columns: [
        { title: 'ID', data: 'id' },
        { title: 'First name', data: 'firstName' },
        { title: 'Last name', data: 'lastName' },
        {
          title: 'Actions',
          data: null,
          createdCell: (cell: any, rowData: any) => {
            const context = {
              rowData: rowData,
              captureEvents: (e: IDemoNgComponentEventType) => {
                console.log('Event captured in template with data:', rowData);
                e.data = rowData;
                this.onCaptureEvent(e);
              }
            };
            const view = this.demoNg.createEmbeddedView(context);
            if (view && view.rootNodes.length > 0) {
              cell.innerHTML = '';
              cell.appendChild(view.rootNodes[0]);
            }
          }
        }
      ]
    };
  });
}

  ngAfterViewInit() {
    setTimeout(() => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }

  onCaptureEvent(event: IDemoNgComponentEventType) {
    if (!event) {
      console.error('Event is undefined or null');
      return;
    }
    this.selectedRow = event.data;
    this.message = `Event '${event.cmd}' with data '${JSON.stringify(event.data)}`;
    console.log('Message set to:', this.message);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
