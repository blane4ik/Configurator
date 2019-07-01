import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ThreejsService } from '../shared/services/threejs.service';
import { ExtrusionModeService } from '../shared/services/extrusion-mode.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;


  constructor(private threejsService: ThreejsService, private extrusionModeService: ExtrusionModeService) {

  }

  ngAfterViewInit() {
    this.threejsService.onInit(this.rendererContainer);
  }

  onMouseClick(event) {
    this.threejsService.onMouseClick(event);

  }

  onMouseUp() {
    this.threejsService.onMouseUp();
  }

  onClick(event) {
    this.extrusionModeService.onMouseClick(event);
  }

  onContextClick(event) {
    this.threejsService.onContextClick(event);
  }
}
