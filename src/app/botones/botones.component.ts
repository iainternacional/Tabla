import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject } from "rxjs";
import { IDemoNgComponentEventType } from '../Interfaces/IDemoNgComponentEventType'


@Component({
  selector: 'app-botones',
  imports: [],
  templateUrl: './botones.component.html',
  styleUrl: './botones.component.css',
  standalone: true
})
export class BotonesComponent implements OnInit {

  @Output() emitter = new EventEmitter<IDemoNgComponentEventType>();
  @Input() data: any = {};

  ngOnInit(): void {}

  onAction1(): void {
    if (!this.data) {
      console.warn('No data available for the action');
      return;
    }
    const eventData: IDemoNgComponentEventType = {
      cmd: 'action1',
      data: this.data
    };
    console.log('Emitting event:', eventData);
    this.emitter.emit(eventData);
  }

  ngOnDestroy() {
    // No need to unsubscribe from EventEmitter
  }
}
