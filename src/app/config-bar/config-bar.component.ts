import { Component, OnInit } from '@angular/core';
import { ThreejsService } from '../shared/services/threejs.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ExtrusionModeService } from '../shared/services/extrusion-mode.service';
import { TexturesService } from '../shared/services/textures.service';


@Component({
  selector: 'app-config-bar',
  templateUrl: './config-bar.component.html',
  styleUrls: ['./config-bar.component.css']
})
export class ConfigBarComponent implements OnInit {

  form: FormGroup;
  position: FormGroup;
  extrudeConfig: FormGroup;
  extrusionIsActivated = false;
  isChecked = false;
  fontSelected = false;

  // Текущие элементы дропдаун списка
  currentElement: {id: number, type: string, value: string, arg: {arg: string, value: string}[]} = {id: 1, type: 'box', value: 'Куб', arg: [
    {arg: 'boxWidth', value: 'Ширину'},
    {arg: 'boxHeight', value: 'Высоту'},
    {arg: 'boxDepth', value: 'Глубину'}
  ]};

  currentMaterial: {id: number, value: string} = {id: 1, value: 'MeshPhongMaterial'};
  currentColor: {type: string, value: string} = {type: 'black', value: 'Черный'};
  // массив из всех элементов дропдаун списка
  typeOfElement: {id: number, type: string, value: string, arg: {arg: string, value: string}[]}[] = [
    {id: 1, type: 'box', value: 'Куб', arg: [
      {arg: 'boxWidth', value: 'Ширину'},
      {arg: 'boxHeight', value: 'Высоту'},
      {arg: 'boxDepth', value: 'Глубину'}
    ]},
    {id: 2, type: 'plane', value: 'Плосткость', arg: [
      {arg: 'planeWidth', value: 'Ширина'},
      {arg: 'planeHeight', value: 'Высота'},
    ]},
    {id: 3, type: 'sphere', value: 'Сфера', arg: [
      {arg: 'sphereRadius', value: 'Радиус'},
      {arg: 'sphereSegmentsWidth', value: 'Сегментов в Ширину'},
      {arg: 'sphereSegmentsHeight', value: 'Сегментов в Высоту'}
    ]},
    {id: 4, type: 'cone', value: 'Конус', arg: [
      {arg: 'coneRadius', value: 'Радиус'},
      {arg: 'coneSegmentsHeight', value: 'Высоту'},
      {arg: 'coneSegments', value: 'Кол-во Сегментов'}
    ]},
    {id: 5, type: 'cilinder', value: 'Цилиндр', arg: [
      {arg: 'cilinderRadiusTop', value: 'Радиус Верха'},
      {arg: 'cilinderRadiusBot', value: 'Радиус Низа'},
      {arg: 'cilinderHeight', value: 'Высоту'},
      {arg: 'cilinderSegmentsRadius', value: 'Кол-во Сегментов'}
    ]},
    {id: 6, type: 'text', value: 'Текст', arg: [
      {arg: 'text', value: 'Текст'},
      {arg: 'textSize', value: 'Размер'},
      {arg: 'textHeight', value: 'Высоту'},
    ]}
  ];

  materials: {id: number, value: string}[] = [
    {id: 1, value: 'MeshPhongMaterial'},
    {id: 2, value: 'MeshDepthMaterial'},
    {id: 3, value: 'MeshDistanceMaterial'},
    {id: 4, value: 'MeshLambertMaterial'},
    {id: 5, value: 'MeshMatcapMaterial'},
    {id: 6, value: 'MeshNormalMaterial'},
    {id: 7, value: 'MeshBasicMaterial'},
    {id: 8, value: 'MeshPhysicalMaterial'},
    {id: 9, value: 'MeshStandardMaterial'},
    {id: 10, value: 'MeshToonMaterial'},
  ];

  colors: {type: string, value: string}[] = [
    { type: 'black', value: 'Черный'},
    { type: 'white', value: 'Белый'},
    { type: 'red', value: 'Красный'},
    { type: 'green', value: 'Зеленый'},
    { type: 'blue', value: 'Синий'},
    { type: 'yellow', value: 'Желтый'},
    { type: 'orange', value: 'Оранжевый'},
    { type: 'gold', value: 'Золотой'},
    { type: 'purple', value: 'Розовый'},
    { type: 'coral', value: 'Коралловый'},
    { type: 'brown', value: 'Коричневый'},
    { type: 'gray', value: 'Серый'},
    { type: 'indigo', value: 'Индиго'},
  ];

  fonts: {name: string, value: string, checked: boolean}[] = [
    {name: 'gothicFont', value: 'Gothic', checked: false},
    {name: 'helvetikerFont', value: 'Helvetiker', checked: false},
    {name: 'font3Font', value: 'Font3', checked: false},
  ];

  constructor(
    private threejsService: ThreejsService,
    private extrusionModeService: ExtrusionModeService,
    private textureService: TexturesService
  ) { }

  // инициализация имен и значений динамически создаваемых input для получения значений
  ngOnInit() {
    this.form = new FormGroup({
      boxWidth: new FormControl('1'),
      boxHeight: new FormControl('1'),
      boxDepth: new FormControl('1'),

      planeWidth: new FormControl('5'),
      planeHeight: new FormControl('5'),

      sphereRadius: new FormControl('1'),
      sphereSegmentsWidth: new FormControl('21'),
      sphereSegmentsHeight: new FormControl('21'),

      coneRadius: new FormControl('1'),
      coneSegmentsHeight: new FormControl('2'),
      coneSegments: new FormControl('21'),

      cilinderRadiusTop: new FormControl('1'),
      cilinderRadiusBot: new FormControl('1'),
      cilinderHeight: new FormControl('2'),
      cilinderSegmentsRadius: new FormControl('21'),

      text: new FormControl('Hello World'),
      textSize: new FormControl('1'),
      textHeight: new FormControl('1')
    });

    this.position = new FormGroup({
      positionX: new FormControl(),
      positionY: new FormControl(),
      positionZ: new FormControl()
    });

    this.extrudeConfig = new FormGroup({
      depth: new FormControl(),
      enableBevel: new FormControl(this.isChecked),
      bevelThickness: new FormControl(),
      bevelSize: new FormControl(),
      bevelOffset: new FormControl(),
      bevelSegments: new FormControl(),
      inputFile: new FormControl()
    });

  }

// Получение конкретного объекта элемента в зависимости от выбранного элемента списка
  getAttributes(elem) {
    const value: string = elem.value;
    const res = this.typeOfElement.find( (e) => e.value === value );
    this.currentElement = res;
  }

  getMaterial(elem) {
    const value: string = elem.value;
    const res = this.materials.find( (e) => e.value === value );
    this.currentMaterial = res;
  }

  getColor(elem) {
    const value: string = elem.value;
    const res = this.colors.find( (e) => e.value === value );
    this.currentColor = res;
  }

  OnAxesAdd() {
    this.threejsService.onAxisToggle();
  }

  onDeleteElement() {
      this.threejsService.onDeleteSelected();
  }

  // метод для отображения элемента
  onElementDisplay() {
    // определение параметров для всех фигур
    const boxWidth: number = this.form.controls.boxWidth.value;
    const boxHeight: number = this.form.controls.boxHeight.value;
    const boxDepth: number = this.form.controls.boxDepth.value;

    const planeWidth: number = this.form.controls.planeWidth.value;
    const planeHeight: number = this.form.controls.planeHeight.value;

    const sphereRadius: number = this.form.controls.sphereRadius.value;
    const sphereSegmentsWidth: number = this.form.controls.sphereSegmentsWidth.value;
    const sphereSegmentsHeight: number = this.form.controls.sphereSegmentsHeight.value;

    const coneRadius: number = this.form.controls.coneRadius.value;
    const coneSegmentsHeight: number = this.form.controls.coneSegmentsHeight.value;
    const coneSegments: number = this.form.controls.coneSegments.value;

    const cilinderRadiusTop: number = this.form.controls.cilinderRadiusTop.value;
    const cilinderRadiusBot: number = this.form.controls.cilinderRadiusBot.value;
    const cilinderHeight: number = this.form.controls.cilinderHeight.value;
    const cilinderSegmentsRadius: number = this.form.controls.cilinderSegmentsRadius.value;

    const text: string = this.form.controls.text.value;
    const textSize: number = this.form.controls.textSize.value;
    const textHeight: number = this.form.controls.textHeight.value;

    // определение позиции
    const posX: number = this.position.controls.positionX.value;
    const posY: number = this.position.controls.positionY.value;
    const posZ: number = this.position.controls.positionZ.value;
    // определение материала и цвета
    const material: string = this.currentMaterial.value;
    const color: string = this.currentColor.type;

    // вызов метода из сервиса в соответствии с выбранной фигурой из дропдаун списка
    switch (this.currentElement.id) {
      case 1:
        this.threejsService.addElement(
          this.threejsService.onBoxCreate(
            boxWidth, boxHeight, boxDepth, this.threejsService.defineTheProperties(material, color)
          ), posX, posY, posZ
        );
        break;
      case 2:
        this.threejsService.addElement(
          this.threejsService.onPlaneCreate(
            planeWidth, planeHeight, this.threejsService.defineTheProperties(material, color)
          ), posX, posY, posZ
        );
        break;
      case 3:
        this.threejsService.addElement(
          this.threejsService.onSphereCreate(
            sphereRadius, sphereSegmentsWidth, sphereSegmentsHeight, this.threejsService.defineTheProperties(material, color)
          ), posX, posY, posZ
        );
        break;
      case 4:
        this.threejsService.addElement(
          this.threejsService.onConeCreate(
            coneRadius, coneSegmentsHeight, coneSegments, this.threejsService.defineTheProperties(material, color)
          ), posX, posY, posZ
        );
        break;
      case 5:
        this.threejsService.addElement(
          this.threejsService.onCylinderCreate(
            cilinderRadiusTop, cilinderRadiusBot, cilinderHeight, cilinderSegmentsRadius, this.threejsService.defineTheProperties(
              material, color
            )
          ), posX, posY, posZ
        );
        break;
      case 6:
        this.threejsService.addElement(
          this.threejsService.onTextCreate(
          text, textSize, textHeight, this.threejsService.defineTheProperties(
            material, color
            )
          ), posX, posY, posZ
        );
        break;
    }
    this.form.reset();
    this.position.reset();
  }
  // Методы транформации объекта
  onMerge() {
    this.threejsService.onMerge();
  }

  onSubtract() {
    this.threejsService.onSubtract();
  }

  onIntersect() {
    this.threejsService.onIntersect();
  }

  onClipping() {
    this.threejsService.onClippingByPlane();
  }
  // Метод активации экструзии
  onExtrusionModeActivate() {
   this.extrusionIsActivated = !this.extrusionIsActivated;
   this.extrusionModeService.extrudeIsActivated = this.extrusionIsActivated;
   this.extrusionModeService.onExtrudeActivate();
  }
  // Отрисовка фигуры с заданными параметрами
  onShapeCreate() {
    const depth: number = this.extrudeConfig.controls.depth.value;
    const bevelSegments: number = this.extrudeConfig.controls.bevelSegments.value;
    const bevelThickness: number = this.extrudeConfig.controls.bevelThickness.value;
    const bevelSize: number = this.extrudeConfig.controls.bevelSize.value;
    const bevelOffset: number = this.extrudeConfig.controls.bevelOffset.value;
    const enableBevel: boolean = this.extrudeConfig.controls.enableBevel.value;


    this.extrusionModeService.onShapeCreate(depth, bevelSegments, bevelThickness, bevelSize, bevelOffset, enableBevel);
  }

  onTextureLoad(event) {
    this.textureService.onTextureLoad(event);
  }

  onModelInput(event) {
    this.textureService.onModelLoad(event);
  }

  onTextureDelete() {
    this.textureService.onTextureDelete();
  }

  onModelLoad() {
    this.threejsService.onLoadObj();
  }

  onFontLoad(event) {
    const reader: FileReader = new FileReader();
    reader.onload = (ev: any) => {
        this.threejsService.font = ev.target.result;
        };
    if (event.target.files.length !== 0) {
          reader.readAsDataURL(event.target.files[0]);
        }
  }
}
