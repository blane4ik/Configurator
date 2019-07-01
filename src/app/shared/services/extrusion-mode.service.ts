import { Injectable } from '@angular/core';
import { ThreejsService } from './threejs.service';
import * as THREE from 'three';
import { Intersection, GridHelper, Mesh } from 'three';
import { SelectedMesh } from '../classes/selected-mesh';

@Injectable({
  providedIn: 'root'
})
export class ExtrusionModeService {
  // Флаг для проверки, активирован ли режим экструзии
  extrudeIsActivated;
  // массив, хранящий объекты с координатами
  shapeCoordinates = [];
  //  объект, хранящий координаты кликов
  coordinatesObj: {valX: number, valZ: number, valY?: number};
  // отметки нажатия на мышку
  spheres = [];
  // URL-адерс текстуры
  src = '';
  // вынос метода ивента нажатия на кнопку мыши
  onExtrudeHandler = (event) => this.onMouseClick(event);

  constructor(public threejsService: ThreejsService) { }
  // METHOD IS NOT USED!!!!!!!
  onMouseMove(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const geometry = new THREE.SphereGeometry(0.3, 21);
    const material = new THREE.PointsMaterial({color: 'gray'});
    const mesh = new THREE.Mesh(geometry, material);




    mouse.x = (event.offsetX / this.threejsService.rendererContainer.clientWidth ) * 2 - 1;
    mouse.y = - (event.offsetY / this.threejsService.rendererContainer.clientHeight) * 2 + 1;


    raycaster.setFromCamera(mouse, this.threejsService.camera);
    const intersects: Intersection[] = raycaster.intersectObjects(
      this.threejsService.scene.children.filter( e => e instanceof GridHelper)
      );
    if (intersects.length !== 0) {
        mesh.position.x = intersects[0].point.x;
        mesh.position.z = intersects[0].point.z;
        this.threejsService.scene.add(mesh);
        setTimeout( () => this.threejsService.scene.remove(mesh), 1000 );
      }
  }
  //  метод щелка кнопки мыши
  onMouseClick(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    // Создание сферы для отметки места щелчка мыши
    const geometry = new THREE.SphereGeometry(0.3, 21);
    const material = new THREE.PointsMaterial({color: 'gray'});
    const mesh: Mesh = new THREE.Mesh(geometry, material);
    // координаты мыши
    mouse.x = (event.offsetX / this.threejsService.rendererContainer.offsetWidth ) * 2 - 1;
    mouse.y = - (event.offsetY / this.threejsService.rendererContainer.offsetHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.threejsService.camera);
    const intersects: Intersection[] = raycaster.intersectObjects(
      this.threejsService.scene.children.filter( e => e instanceof GridHelper)
      );
      // Проверка щелчка по полю
    if (intersects.length !== 0) {
      // задание координат для построения фигруы
    this.coordinatesObj = {
      valX: intersects[0].point.x,
      valZ: intersects[0].point.z,
    };
    // добавление координат в массив
    this.shapeCoordinates.push(this.coordinatesObj);
    // позиционирование сфер-индикаторов
    mesh.position.x = intersects[0].point.x;
    mesh.position.z = intersects[0].point.z;
    mesh.position.y = 0.5;
    // добавление индикаторов на сцену
    this.threejsService.scene.add(mesh);
    // занесение иендикаторов в массив для последующего удаления
    this.spheres.push(mesh);
  } else {
    return;
    }
  }


  onShapeCreate(depth, bevelSegments, bevelThickness, bevelSize, bevelOffset, enableBevel) {
    // создание элемента формы для будущего объекта
    const shape = new THREE.Shape();
    // создание ограничивающей коробки для отцентровки
    const box = new THREE.Box3();
    // определение координат для построения фигуры (первые координада - начало)
    for (let i = 0; i < this.shapeCoordinates.length; i++) {
      if (i === 0) {
        shape.moveTo(this.shapeCoordinates[i].valX, this.shapeCoordinates[i].valZ);
      }
      shape.lineTo(this.shapeCoordinates[i].valX, this.shapeCoordinates[i].valZ);
    }

// Определение настроек экструзии
    const extrudeSettings = {
      depth,
      bevelEnabled: enableBevel,
      bevelThickness,
      bevelSize,
      bevelOffset,
      bevelSegments
    };
// Создание объекта на сцене по заданным свойствам и координатам
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT = THREE.RepeatWrapping;
    load.anisotropy = 16;
    let material;
    if (this.src) {
      material  = new THREE.MeshStandardMaterial({map: load});
    } else {
      material = new THREE.MeshNormalMaterial();
    }
    const mesh = new SelectedMesh(geometry, material);
    // присвоение ограничивающей коробки для объекта
    box.setFromObject(mesh);
    const vector = new THREE.Vector3();
    // определение цетра
    box.getCenter(vector);
    // позиционирование в пространстве
    mesh.rotateX(Math.PI / 2);
    mesh.position.setY(extrudeSettings.depth);

    this.threejsService.scene.add(mesh);
    // После построения фигуры обнуленеие массива координат и удаление сфер-индикаторов с поля
    this.shapeCoordinates.splice(0);
// tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.spheres.length; i++) {
        this.threejsService.scene.remove(this.spheres[i]);
      }
  }
  // Если режим экструзии активирован - добавление ивента клика мышки
  onExtrudeActivate() {
    if (this.extrudeIsActivated) {
      this.threejsService.rendererContainer.addEventListener('mouseup', this.onExtrudeHandler);
    } else {
      this.threejsService.rendererContainer.removeEventListener('mouseup', this.onExtrudeHandler);
    }
  }

}
