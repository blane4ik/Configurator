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

  // Текущие элементы дропдаун списка
  currentElement = {id: 1, type: 'box', value: 'Куб', arg: [
    {arg: 'boxWidth', value: 'Ширину'},
    {arg: 'boxHeight', value: 'Высоту'},
    {arg: 'boxDepth', value: 'Глубину'}
  ]};

  currentMaterial = {id: 1, value: 'MeshPhongMaterial'};
  currentColor = {type: 'black', value: 'Черный'};
  // массив из всех элементов дропдаун списка
  typeOfElement = [
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
    ]}
  ];

  materials = [
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

  colors = [
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

  // определение сервиса для работы с Three.js
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
    const value = elem.value;
    const res = this.typeOfElement.find( (e) => e.value === value );
    this.currentElement = res;
  }

  getMaterial(elem) {
    const value = elem.value;
    const res = this.materials.find( (e) => e.value === value );
    this.currentMaterial = res;
  }

  getColor(elem) {
    const value = elem.value;
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
    const boxWidth = this.form.controls.boxWidth.value;
    const boxHeight = this.form.controls.boxHeight.value;
    const boxDepth = this.form.controls.boxDepth.value;

    const planeWidth = this.form.controls.planeWidth.value;
    const planeHeight = this.form.controls.planeHeight.value;

    const sphereRadius = this.form.controls.sphereRadius.value;
    const sphereSegmentsWidth = this.form.controls.sphereSegmentsWidth.value;
    const sphereSegmentsHeight = this.form.controls.sphereSegmentsHeight.value;

    const coneRadius = this.form.controls.coneRadius.value;
    const coneSegmentsHeight = this.form.controls.coneSegmentsHeight.value;
    const coneSegments = this.form.controls.coneSegments.value;

    const cilinderRadiusTop = this.form.controls.cilinderRadiusTop.value;
    const cilinderRadiusBot = this.form.controls.cilinderRadiusBot.value;
    const cilinderHeight = this.form.controls.cilinderHeight.value;
    const cilinderSegmentsRadius = this.form.controls.cilinderSegmentsRadius.value;

    // определение позиции
    const posX = this.position.controls.positionX.value;
    const posY = this.position.controls.positionY.value;
    const posZ = this.position.controls.positionZ.value;
    // определение материала и цвета
    const material = this.currentMaterial.value;
    const color = this.currentColor.type;

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
    }
    this.form.reset();
    this.position.reset();
  }

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

  onExtrusionModeActivate() {
   this.extrusionIsActivated = !this.extrusionIsActivated;
   this.extrusionModeService.extrudeIsActivated = this.extrusionIsActivated;
   this.extrusionModeService.onExtrudeActivate();
  }

  onShapeCreate() {
    const depth = this.extrudeConfig.controls.depth.value;
    const bevelSegments = this.extrudeConfig.controls.bevelSegments.value;
    const bevelThickness = this.extrudeConfig.controls.bevelThickness.value;
    const bevelSize = this.extrudeConfig.controls.bevelSize.value;
    const bevelOffset = this.extrudeConfig.controls.bevelOffset.value;
    const enableBevel = this.extrudeConfig.controls.enableBevel.value;


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
}
