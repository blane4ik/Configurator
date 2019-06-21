import { Injectable, EventEmitter } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import { PerspectiveCamera, Scene, WebGLRenderer, Geometry, Material,
         AmbientLight, DirectionalLight, Raycaster, Intersection, AxesHelper,
         GridHelper, BufferGeometry, Mesh} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { SelectedMesh } from '../classes/selected-mesh';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {
  // Передача информации о фигуре родительскому компоненту
  public getInfo = new EventEmitter<object>();
  // определение необходимых переменных
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
// сетка
  grid: GridHelper;
// освещение
  ambientLight: AmbientLight;
  directionalLight: DirectionalLight;
// контроль орбит камеры
  orbitControls: OrbitControls;
  // контроль конкретной фигуры
  transformControls: TransformControls;
// свойства, необходимые для выделения объектов
  raycaster: Raycaster;

  rendererContainer: HTMLElement;
// определение свойств объекта
  geometry: Geometry;
  material: Material;

// Переменная для хранения информации об объекте
  info;
// Переменные для работы с осями
  axesFlag = false;
  axes: AxesHelper;
// Получение URL-адреса картинки текстуры
  src = '';
  modelSrc = '';

  //  метод-хелпер для инициализации всех необходимых элементов
   onInit(rendererContainer) {


    this.rendererContainer = rendererContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, rendererContainer.nativeElement.clientWidth /
                                                   rendererContainer.nativeElement.clientHeight, 0.1, 10000 );
    this.camera.position.z = 10;
    this.camera.position.y = 20;
    this.scene.add(this.camera);

    this.grid = new THREE.GridHelper(20, 20);

    this.scene.add(this.grid);

    this.axes = new THREE.AxesHelper(15);

    this.orbitControls = new OrbitControls(this.camera, rendererContainer.nativeElement);
    this.orbitControls.enableRotate = false;
    this.transformControls = new TransformControls(this.camera, rendererContainer.nativeElement);
    this.scene.add(this.transformControls);

    this.raycaster = new THREE.Raycaster();

    this.ambientLight = new THREE.AmbientLight('white');

    this.directionalLight = new THREE.DirectionalLight('white', 1);
    this.directionalLight.position.y = 20;
    this.directionalLight.position.x = 20;
    this.directionalLight.position.z = 10;


    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);


    this.renderer = new THREE.WebGLRenderer({canvas: rendererContainer.nativeElement, alpha: true});
    this.renderer.setSize(rendererContainer.nativeElement.clientWidth, rendererContainer.nativeElement.clientHeight);
    console.log(this.scene);

    this.animate();


  }
  // Метод, определяющий выбранные свойства для фигуры из дропдаунов
  defineTheProperties(material, color) {
    if (this.src) {
      const load = new THREE.TextureLoader().load(this.src);
      let mat: Material;
      switch (material) {
      case 'MeshBasicMaterial':
        mat = new THREE.MeshBasicMaterial({map: load});
        this.material = mat;
        break;

      case 'MeshDepthMaterial':
        mat = new THREE.MeshDepthMaterial();
        this.material = mat;
        break;

      case 'MeshDistanceMaterial':
        mat = new THREE.MeshDistanceMaterial();
        this.material = mat;
        break;

      case 'MeshPhongMaterial':
        mat = new THREE.MeshPhongMaterial({map: load, shininess: 100});
        this.material = mat;
        break;

      case 'MeshLambertMaterial':
        mat = new THREE.MeshLambertMaterial({map: load});
        this.material = mat;
        break;

      case 'MeshNormalMaterial':
        mat = new THREE.MeshNormalMaterial();
        this.material = mat;
        break;

      case 'MeshMatcapMaterial':
        mat = new THREE.MeshMatcapMaterial({map: load});
        this.material = mat;
        break;

      case 'MeshPhysicalMaterial':
        mat = new THREE.MeshPhysicalMaterial({map: load, flatShading: true});
        this.material = mat;
        break;

      case 'MeshStandardMaterial':
        mat = new THREE.MeshStandardMaterial({map: load});
        this.material = mat;
        break;

      case 'MeshToonMaterial':
        mat = new THREE.MeshToonMaterial({map: load});
        this.material = mat;
        break;
      }
    } else {
      let mat: Material;
      switch (material) {
      case 'MeshBasicMaterial':
        mat = new THREE.MeshBasicMaterial({color});
        this.material = mat;
        break;

      case 'MeshDepthMaterial':
        mat = new THREE.MeshDepthMaterial();
        this.material = mat;
        break;

      case 'MeshDistanceMaterial':
        mat = new THREE.MeshDistanceMaterial();
        this.material = mat;
        break;

      case 'MeshPhongMaterial':
        mat = new THREE.MeshPhongMaterial({color, shininess: 100});
        this.material = mat;
        break;

      case 'MeshLambertMaterial':
        mat = new THREE.MeshLambertMaterial({color});
        this.material = mat;
        break;

      case 'MeshNormalMaterial':
        mat = new THREE.MeshNormalMaterial();
        this.material = mat;
        break;

      case 'MeshMatcapMaterial':
        mat = new THREE.MeshMatcapMaterial({color});
        this.material = mat;
        break;

      case 'MeshPhysicalMaterial':
        mat = new THREE.MeshPhysicalMaterial({color, flatShading: true});
        this.material = mat;
        break;

      case 'MeshStandardMaterial':
        mat = new THREE.MeshStandardMaterial({color});
        this.material = mat;
        break;

      case 'MeshToonMaterial':
        mat = new THREE.MeshToonMaterial({color});
        this.material = mat;
        break;
    }
    }

  }
  // Метод-хелпер для рендеринга канваса
  private render() {

    this.renderer.render(this.scene, this.camera);
  }
  // метод для вкл/выкл осей
  onAxisToggle() {
   this.axesFlag = !this.axesFlag;

   if (this.axesFlag) {
     this.scene.add(this.axes);
   } else {
    this.scene.remove(this.axes);
   }
  }

  // Метод для выбора объектов по клику
  onMouseClick(event) {

    if (event.shiftKey) {
      this.orbitControls.enableRotate = true;
    } else if (event.ctrlKey) {
      this.transformControls.setMode('rotate');
    } else {
      this.orbitControls.enableRotate = false;
      this.transformControls.setMode('translate');
    }


// tslint:disable-next-line: new-parens
    const mouse = new THREE.Vector2;
    mouse.x = (event.offsetX / this.rendererContainer.clientWidth ) * 2 - 1;
    mouse.y = - (event.offsetY / this.rendererContainer.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);
    const sceneChildArray = [];

    this.scene.children.forEach( (e) => {
      if (e instanceof SelectedMesh) {
        sceneChildArray.push(e);
      }
    });
    const intersects: Intersection[] = this.raycaster.intersectObjects( sceneChildArray );
// tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < intersects.length; i++) {
      (intersects[i].object as SelectedMesh).toggleSelection();
      const isSelectedFlag = (intersects[i].object as SelectedMesh).isSelected;
      if ( isSelectedFlag) {
        this.info = (intersects[i].object as SelectedMesh);
        this.transformControls.attach(this.info);
      } else {
        this.info = '';
        this.transformControls.detach();
      }
    }
    this.getInfo.emit(this.info);
  }

  onContextClick(event) {
    if (event.ctrlKey) {
      this.transformControls.setMode('scale');
    } else {
      this.orbitControls.enableRotate = false;
      this.transformControls.setMode('translate');
    }
  }
  // Метод для удаления выбранных объектов
  onDeleteSelected() {
    const elem = this.scene.children;
    const mesh = elem.filter( e => e instanceof SelectedMesh ).filter( element => (element as SelectedMesh).material.opacity !== 1 );

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < mesh.length; i++) {
      this.scene.remove((mesh[i] as SelectedMesh));
    }
    this.info = '';
    this.transformControls.detach();
    this.getInfo.emit(this.info);

  }

  // Метод-хелпер для анимирования канваса
  private animate() {
    requestAnimationFrame( () => this.animate());

    this.orbitControls.update();
    this.transformControls.updateMatrix();
    this.render();
   }


  //  Определение методов создания объектов
   onBoxCreate(width, height, depth, mat) {
    mat = this.material;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onCircleCreate(radius, segments, mat) {
    mat = this.material;
    const geometry = new THREE.CircleGeometry(radius, segments);
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onSphereCreate(radius, width, height, mat) {
    mat = this.material;
    const geometry = new THREE.SphereGeometry(radius, width, height);
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onConeCreate(radius, height, segments, mat) {
    mat = this.material;
    const geometry = new THREE.ConeGeometry(radius, height, segments);
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onCylinderCreate(radiusTop, radiusBot, height, segments, mat) {
    mat = this.material;
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBot, height, segments);
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }
  //  Метод предварительлной очистки канваса и добавления элемента на канвас
   addElement(mesh, posX, posY, posZ) {

    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ;

    this.scene.add(mesh);

    this.camera.lookAt(mesh.position);
   }
  //  In Development...
   onSubtract() {
//     const intersects = [];

//     const meshes = this.scene.children.filter( e => e instanceof SelectedMesh );
//     meshes.forEach( (e) => {
//        if ((e as SelectedMesh).material.opacity !== 1) {
//          intersects.push(e);
//        }
//      } );

//     const unionGeometry = new THREE.Geometry();
//     const unionMaterial = new THREE.MeshPhongMaterial({color: 'indigo'});

//     const unionMesh = new SelectedMesh(unionGeometry, unionMaterial);
//     if (intersects.length >= 2) {
//   // tslint:disable-next-line: prefer-for-of

// // tslint:disable-next-line: prefer-for-of
//   for (let i = 0; i < intersects.length; i++) {

//         const meshI = intersects[i];
//         const geometryI = meshI.geometry;
//         const matrixI = intersects[i].matrix;
//         const vertI = geometryI.vertices;

//         // tslint:disable-next-line:prefer-for-of
//         for (let j = 0; j < intersects.length; j++) {
//           const meshJ = intersects[j];
//           const geometryJ = intersects[j].geometry;
//           const matrixJ = intersects[j].matrix;
//           const vertJ = geometryJ.vertices;


//           if (meshI !== meshJ) {
//             // const posXI = vertI[j].applyMatrix4(meshI.matrixWorld).x;
//             // const posXJ =  vertJ[j].applyMatrix4(meshJ.matrixWorld).x;
//             // const rez = posXI - posXJ;
//             // console.log(posXI + ' : ' + posXJ + ' = ' + rez);

//             console.log(geometryI.faceVertexUvs );
//             console.log(geometryJ.faceVertexUvs );
//           }
//         }
//       }
//    } else {
//      return;
//    }
     }


    //  Метод для мержа выбранных объектов
  onMerge() {
    const intersects = [];
    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;
    const unionMaterials: any = [];
    const unionGeometry = new THREE.Geometry();
    let unionMesh;
    let unionMaterial;


    const meshes = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e) => {
       if ((e as SelectedMesh).material.opacity !== 1) {
         intersects.push(e);
       }
     } );

    intersects.forEach( element => {
      if (element.material.length !== undefined) {
        element.material.forEach( material => unionMaterials.push(material));
        unionMesh = new SelectedMesh(unionGeometry, unionMaterials);

      } else {
        if (this.src) {
          unionMaterial = new THREE.MeshPhongMaterial({map: load});

        } else {
          unionMaterial = new THREE.MeshPhongMaterial({color: 'indigo'});
        }
        unionMesh = new SelectedMesh(unionGeometry, unionMaterial);
      }
    });

    if (intersects.length >= 2) {

// tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < intersects.length; i++) {

        const meshI = intersects[i];
        const boxI = new THREE.Box3();
        const geometryI = intersects[i].geometry;
        const matrixI = intersects[i].matrix;

        boxI.setFromObject(meshI);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < intersects.length; j++) {
          const meshJ = intersects[j];
          const geometryJ = intersects[j].geometry;
          const matrixJ = intersects[j].matrix;

          if (meshI !== meshJ) {
            const boxJ = new THREE.Box3();
            boxJ.setFromObject(meshJ);
            if (boxI.intersectsBox(boxJ)) {

  //  МЕРЖ ЕЛКИ СО СМАЙЛОМ (ЕЛКА ПЕРВАЯ) СРАБАТЫВАЕТ!!!!!!!!

              unionGeometry.merge(geometryJ, matrixJ, meshJ.material.length - meshI.material.length);
              unionGeometry.mergeMesh(meshJ);


              unionGeometry.colorsNeedUpdate = true;
              unionGeometry.uvsNeedUpdate = true;
              unionGeometry.verticesNeedUpdate = true;
              unionGeometry.elementsNeedUpdate = true;
              unionGeometry.normalsNeedUpdate = true;
              this.info = unionMesh;
              unionGeometry.sortFacesByMaterialIndex();
              unionMesh.updateMatrix();
              this.scene.add(unionMesh);
              console.log(unionMesh);

              this.getInfo.emit(this.info);

// tslint:disable-next-line: prefer-for-of
              for ( let k = 0; k < intersects.length; k++) {
      this.scene.remove((intersects[k] as SelectedMesh));
    }
              this.info = '';
              this.transformControls.detach();
              } else {
                continue;
              }
            } else {
              continue;
            }
        }
      }
   } else {
     return;
   }
     }

  onLoadObj() {
    const mtlLoader = new MTLLoader();
    const loader = new OBJLoader();

    mtlLoader.load(this.src, (materials) => {
        materials.preload();
        loader.setMaterials(materials);

        loader.load(this.modelSrc, (object) => {
          object.rotateX(-(Math.PI * 2));
          const l = object.children.length;
          const unitGeometry = new Geometry();
          console.log(object);

          for (let i = 0; i < l; i++) {

            const geometryMegre = (object.children[i] instanceof Mesh) &&
                                  (object.children[i].geometry) instanceof BufferGeometry ?
                                  new Geometry().fromBufferGeometry(object.children[i].geometry) : object.children[i].geometry;

            unitGeometry.merge(geometryMegre);
            unitGeometry.colorsNeedUpdate = true;
            unitGeometry.uvsNeedUpdate = true;
            unitGeometry.verticesNeedUpdate = true;
            unitGeometry.elementsNeedUpdate = true;
            unitGeometry.normalsNeedUpdate = true;
          }
          const result = new SelectedMesh(unitGeometry, object.children[0].material);

          this.scene.add(result);
        });
    });

  }
}
