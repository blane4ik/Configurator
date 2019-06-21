import { Injectable } from '@angular/core';
import { ThreejsService } from './threejs.service';
import { ExtrusionModeService } from './extrusion-mode.service';

@Injectable({
  providedIn: 'root'
})
export class TexturesService {
  textureSrc = '';
  modelTextureSrc = '';

  constructor(public threejsService: ThreejsService, public extrusionModeService: ExtrusionModeService) { }

  onTextureLoad(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.textureSrc = e.target.result;
      this.threejsService.src = this.textureSrc;
      this.extrusionModeService.src = this.textureSrc;
    };
    if (input.files.length !== 0) {
      reader.readAsDataURL(input.files[0]);
    }
  }

  onTextureDelete() {
    this.textureSrc = '';
    this.threejsService.src = this.textureSrc;
    this.extrusionModeService.src = this.textureSrc;
    const input: any = document.getElementById('inputFile');
    input.value = '';
  }

  onModelLoad(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.modelTextureSrc = e.target.result;
      this.threejsService.modelSrc = this.modelTextureSrc;
    };
    if (input.files.length !== 0) {
      reader.readAsDataURL(input.files[0]);
    }
  }
}
