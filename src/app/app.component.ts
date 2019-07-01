import { Component, OnInit } from '@angular/core';
import { ThreejsService } from './shared/services/threejs.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectedMesh } from './shared/classes/selected-mesh';
import { BoxGeometry, SphereGeometry, ConeGeometry, CylinderGeometry, PlaneGeometry } from 'three';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Массив, хранящи информацию об оъекте
  infoAboutElement = [];
  // Текущий объект для динамического изменения
  elementToChange: SelectedMesh;
  // Группа инпутов для динамического изменения
  footerInputsForm: FormGroup;
  // Флаг для проверки выбона объекта
  isSelected = false;
  // Список цветов и их значения для их изменения
  colors: {value: string, name: string}[] = [
    {
      value: '000000', name: 'Black'
    },
    {
      value: 'ffffff', name: 'White'
    },
    {
      value: 'ff0000', name: 'Red'
    },
    {
      value: '00ff00', name: 'Green'
    },
    {
      value: '0000ff', name: 'Blue'
    },
    {
      value: 'ffff00', name: 'Yellow'
    },
    {
      value: 'ffa500', name: 'Orange'
    },
    {
      value: 'ffd700', name: 'Gold'
    },
    {
      value: '800080', name: 'Violet'
    },
    {
      value: 'ff7f50', name: 'Coral'
    },
    {
      value: 'a52a2a', name: 'Brown'
    },
    {
      value: '808080', name: 'Gray'
    },
    {
      value: '4b0082', name: 'Indigo'
    },
  ];

  showHintFlag = false;

  constructor(public threejsService: ThreejsService) {}

  ngOnInit() {
    // Получаем доступ к переданному объекту
    this.threejsService.getInfo
    .subscribe( selectedElement => {
      // Проверка еслть ли объект и не мерж ли это
      if (selectedElement && selectedElement.geometry.type !== 'Geometry') {
        this.isSelected = true;
        // Манипуляции для доступа и проверки цвета
        let color = selectedElement.material.color;
        if (color) {
          color = color.getHexString();
          this.colors.forEach( element => {
            if (element.value === color) {
              color = element.name;
            }
          } );
        } else {
          color = 'Свойство цвета отсутствует';
        }
        // передаем в переменную длдя дальнейших изменений
        this.elementToChange = selectedElement;
        // характеристики объекта
        this.infoAboutElement = [
          {
            id: 'posX', name: 'Позиция X', value: selectedElement.position.x
          },
          {
            id: 'posY', name: 'Позиция Y', value: selectedElement.position.y
          },
          {
            id: 'posZ', name: 'Позиция Z', value: selectedElement.position.z
          },
          {
            id: 'width', name: 'Ширина', value: selectedElement.geometry.parameters.width
          },
          {
            id: 'height', name: 'Высота', value: selectedElement.geometry.parameters.height
          },
          {
            id: 'depth', name: 'Глубина', value: selectedElement.geometry.parameters.depth
          },
          {
            id: 'segments', name: 'Кол-во сегментов', value: selectedElement.geometry.parameters.segments
          },
          {
            id: 'radius', name: 'Радиус', value: selectedElement.geometry.parameters.radius
          },
          {
            id: 'heightSegments', name: 'Сегментов в высоту', value: selectedElement.geometry.parameters.heightSegments
          },
          {
            id: 'radialSegments', name: 'Кол-во граней', value: selectedElement.geometry.parameters.radialSegments
          },
          {
            id: 'widthSegments', name: 'Сегментов в ширину', value: selectedElement.geometry.parameters.widthSegments
          },
          {
            id: 'radiusTop', name: 'Радиус верха', value: selectedElement.geometry.parameters.radiusTop
          },
          {
            id: 'radiusBottom', name: 'Радиус низа', value: selectedElement.geometry.parameters.radiusBottom
          },
          {
            id: 'color', name: 'Цвет', value: color
          },
        ];
        // Если объект - мерж, тогда получаем только цвет
      } else if (selectedElement && selectedElement.geometry.type === 'Geometry') {
        this.isSelected = true;
        let color = selectedElement.material.color;

        if (color) {
          color = color.getHexString();
          this.colors.forEach( element => {
            if (element.value === color) {
              color = element.name;
            }
          } );
        } else {
          color = 'Свойство цвета отсутствует';
        }
        this.elementToChange = selectedElement;
        this.infoAboutElement = [
          {
            id: 'color', name: 'Цвет', value: color
          }
        ];
      } else {
        this.isSelected = false;
      }
    } );
// Определение группы инпутов
    this.footerInputsForm = new FormGroup({
      posX: new FormControl(),
      posY: new FormControl(),
      posZ: new FormControl(),
      width: new FormControl('1'),
      height: new FormControl('1'),
      depth: new FormControl('1'),
      segments: new FormControl('21'),
      radius: new FormControl('1'),
      heightSegments: new FormControl('21'),
      radialSegments: new FormControl('21'),
      widthSegments: new FormControl('21'),
      radiusTop: new FormControl('1'),
      radiusBottom: new FormControl('1'),
      material: new FormControl('MeshBasicMaterial'),
      color: new FormControl('Black'),
    });
  }

  // изменение свойств выбранного объекта
  onChangeElement() {
    const posX: number = this.footerInputsForm.controls.posX.value;
    const posY: number = this.footerInputsForm.controls.posY.value;
    const posZ: number = this.footerInputsForm.controls.posZ.value;
    const width: number = this.footerInputsForm.controls.width.value;
    const height: number = this.footerInputsForm.controls.height.value;
    const depth: number = this.footerInputsForm.controls.depth.value;
    const radius: number = this.footerInputsForm.controls.radius.value;
    const heightSegments: number = this.footerInputsForm.controls.heightSegments.value;
    const radialSegments: number = this.footerInputsForm.controls.radialSegments.value;
    const widthSegments: number = this.footerInputsForm.controls.widthSegments.value;
    const radiusTop: number = this.footerInputsForm.controls.radiusTop.value;
    const radiusBottom: number = this.footerInputsForm.controls.radiusBottom.value;
    const color: string = this.footerInputsForm.controls.color.value;

    switch (this.elementToChange.geometry.type) {
      case 'BoxGeometry': this.elementToChange.geometry = new BoxGeometry(width, height, depth);
                          break;
      case 'SphereGeometry': this.elementToChange.geometry = new SphereGeometry(radius, widthSegments, heightSegments);
                             break;
      case 'PlaneGeometry': this.elementToChange.geometry = new PlaneGeometry(width, height);
                            break;
      case 'ConeGeometry': this.elementToChange.geometry = new ConeGeometry(radius, height, radialSegments);
                           break;
      case 'CylinderGeometry': this.elementToChange.geometry = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
                               break;
      case 'Geometry': this.elementToChange.geometry = this.elementToChange.geometry;
                       break;
                               default: return;
    }
    this.elementToChange.position.set(posX, posY, posZ);
    this.colors.forEach( e => {

      if (e.name.toLowerCase() === color.toLowerCase()) {
          (this.elementToChange as SelectedMesh).material.color.setStyle('#' + e.value);
        } else {
          return;
        }
    } );
  }

  showHint() {
    this.showHintFlag = !this.showHintFlag;
  }
}
