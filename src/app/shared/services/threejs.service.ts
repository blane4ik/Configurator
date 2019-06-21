import { Injectable, EventEmitter, ɵConsole } from '@angular/core';
import * as THREE from 'three';
import CSG from 'three-js-csg/index.js';
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

  //  Метод-хелпер для инициализации всех необходимых элементов
   onInit(rendererContainer) {

     this.rendererContainer = rendererContainer.nativeElement;
     this.renderer = new THREE.WebGLRenderer({canvas: rendererContainer.nativeElement, alpha: true, preserveDrawingBuffer: true});
     this.renderer.setSize(rendererContainer.nativeElement.clientWidth, rendererContainer.nativeElement.clientHeight);
     this.renderer.localClippingEnabled = true;

     this.scene = new THREE.Scene();
     this.camera = new THREE.PerspectiveCamera(90, rendererContainer.nativeElement.clientWidth /
                                                   rendererContainer.nativeElement.clientHeight, 0.1, 10000 );
     this.camera.position.z = 30;
     this.camera.position.y = 50;
     this.scene.add(this.camera);

     this.grid = new THREE.GridHelper(80, 80);
     this.scene.add(this.grid);

     this.axes = new THREE.AxesHelper(15);

     this.orbitControls = new OrbitControls(this.camera, rendererContainer.nativeElement);
     this.orbitControls.enableRotate = false;
     this.transformControls = new TransformControls(this.camera, rendererContainer.nativeElement);
     this.transformControls.setSize(1.5);
     this.transformControls.pointerUp(new THREE.Mesh(new THREE.PlaneGeometry(1, 4, 1), new THREE.MeshStandardMaterial({color: 0xff0000})));
     this.scene.add(this.transformControls);

     this.raycaster = new THREE.Raycaster();

     this.ambientLight = new THREE.AmbientLight('white');
     this.scene.add(this.ambientLight);

     this.directionalLight = new THREE.DirectionalLight('white', 1);
     this.directionalLight.position.y = 40;
     this.directionalLight.position.x = 20;
     this.directionalLight.position.z = 20;
     this.scene.add(this.directionalLight);

     this.renderer = new THREE.WebGLRenderer({canvas: rendererContainer.nativeElement, alpha: true, preserveDrawingBuffer: true});
     this.renderer.setSize(rendererContainer.nativeElement.clientWidth, rendererContainer.nativeElement.clientHeight);
     this.renderer.localClippingEnabled = true;
     console.log(this.scene);

     this.animate();
  }

  // Метод, определяющий выбранные свойства для фигуры из дропдаунов
  defineTheProperties(material, color) {
    // Если определена текстура
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
      // Если текстура не выбрана
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

  private onWindowResize() {
    this.camera.aspect = this.rendererContainer.clientWidth / this.rendererContainer.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.rendererContainer.clientWidth, this.rendererContainer.clientHeight );
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
// Установка контролов в зависимости от нажатой клавиши
    if (event.shiftKey) {
      this.orbitControls.enableRotate = true;
    } else if (event.ctrlKey) {
      this.transformControls.setMode('rotate');
    } else {
      this.orbitControls.enableRotate = false;
      this.transformControls.setMode('translate');
    }

    // Определение положения мыши
    const mouse = new THREE.Vector2();
    mouse.x = (event.offsetX / this.rendererContainer.clientWidth ) * 2 - 1;
    mouse.y = - (event.offsetY / this.rendererContainer.clientHeight) * 2 + 1;
    // Отправляем луч от камеры к мышке
    this.raycaster.setFromCamera(mouse, this.camera);
// Выборка потомков необходимых нам
    const sceneChildArray = [];

    this.scene.children.forEach( (e) => {
      if (e instanceof SelectedMesh) {
        sceneChildArray.push(e);
      }
    });
    const intersects: Intersection[] = this.raycaster.intersectObjects( sceneChildArray );
    // Делаем объект активным/неактивным
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
    // Отправляем объект родителю
    this.getInfo.emit(this.info);
  }

  // Включение режима скейла на ПКМ
  onContextClick(event) {
    if (event.ctrlKey) {
      this.transformControls.setMode('scale');
    } else {
      this.orbitControls.enableRotate = false;
      this.transformControls.setMode('translate');
    }
  }

  // Метод, пресекающий выход за поля Grid
  onMouseUp() {

      if (this.info !== '' && this.info instanceof SelectedMesh && this.info.geometry.boundingBox !== null) {
      this.info.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 0.5 );
      const box = this.info.geometry.boundingBox.getSize(new THREE.Vector3());

      if (this.info.position.x < (box.x / 2) - 40) {
        this.info.position.x = (box.x / 2) - 40;
      }

      if (this.info.position.x > 40 - (box.x / 2)) {
        this.info.position.x = 40 - (box.x / 2);
      }

      if (this.info.position.z < (box.z / 2) - 40) {
        this.info.position.z = (box.z / 2) - 40;
      }

      if (this.info.position.z > 40 - (box.z / 2)) {
        this.info.position.z = 40 - (box.z / 2);
      }

      if (this.info.position.y < (box.y / 2)) {
        this.info.position.y = (box.y / 2);
      }

    } else {
      return;
    }
  }

  // Метод для удаления выбранных объектов
  onDeleteSelected() {
    const elem = this.scene.children;
    const mesh = elem.filter( e => e instanceof SelectedMesh ).filter( element => (element.material.opacity !== 1) &&
                                                                                  (element.material.length === undefined));

    const objects = elem.filter( object => object instanceof SelectedMesh && object.material.length !== undefined);
    objects.forEach( object => {
      object.material.forEach( obj => {
        if (obj.opacity !== 1) {
          object.material.opacity = 0.5;
          mesh.push(object);
        } else {
          return;
        }
      } );
    } );

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
    this.onWindowResize();
   }

  //  Определение методов создания объектов
   onBoxCreate(width, height, depth, mat) {
    mat = this.material;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onPlaneCreate(width, height, mat) {
    mat = this.material;
    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new SelectedMesh(geometry, mat);
    mat.side = THREE.DoubleSide;
    mat.opacity = 0.5;

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

  //  хелпер для работы с CSG библиотекой
   doCSG(a, b, op, mat) {
      const bspA = CSG.fromMesh( a );
      const bspB = CSG.fromMesh( b );
      const bspC = bspA[op]( bspB );
      const result = CSG.toMesh( bspC, a.matrix );
      result.material = mat;
      result.castShadow  = result.receiveShadow = true;
      return result;
  }

  //  Метод предварительлной очистки канваса и добавления элемента на канвас
   addElement(mesh, posX, posY, posZ) {
    const box = new THREE.Box3();
    box.setFromObject(mesh);
    mesh.geometry.boundingBox = box;
    const boudingBox = mesh.geometry.boundingBox.max.y;

    mesh.position.x = posX;
    mesh.position.y = posY + boudingBox;
    mesh.position.z = posZ;

    this.scene.add(mesh);
    this.camera.lookAt(mesh.position);
   }

  //  Метод вычитания объектов
   onSubtract() {
    const intersects = [];

    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const meshes = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e) => {
       if ((e as SelectedMesh).material.opacity !== 1) {
         intersects.push(e);
       }
     } );

    if (intersects.length < 3) {


      const meshA = intersects[0];
      const boxA = new THREE.Box3();
      boxA.setFromObject(meshA);

      const meshB = intersects[1];
      const boxB = new THREE.Box3();
      boxB.setFromObject(meshB);

      if (boxA.intersectsBox(boxB) && this.src === '') {
        const meshC = this.doCSG( meshA, meshB, 'subtract', new THREE.MeshNormalMaterial());
        this.info = meshC;
        this.scene.add(meshC);
      } else if (boxA.intersectsBox(boxB) && this.src !== '') {
        const meshC = this.doCSG( meshA, meshB, 'subtract', new THREE.MeshPhongMaterial({map: load}));
        this.info = meshC;
        this.scene.add(meshC);
      } else {
        return;
      }
    } else {
        return;
      }

    this.getInfo.emit(this.info);

// tslint:disable-next-line: prefer-for-of
    for ( let k = 0; k < intersects.length; k++) {
      this.scene.remove((intersects[k] as SelectedMesh));
    }
    this.info = '';
    this.transformControls.detach();
  }

  // метод пересечения объектов
  onIntersect() {
    const intersects = [];

    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const meshes = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e) => {
       if ((e as SelectedMesh).material.opacity !== 1) {
         intersects.push(e);
       }
     } );

    if (intersects.length < 3) {


      const meshA = intersects[0];
      const boxA = new THREE.Box3();
      boxA.setFromObject(meshA);

      const meshB = intersects[1];
      const boxB = new THREE.Box3();
      boxB.setFromObject(meshB);

      if (boxA.intersectsBox(boxB) && this.src === '') {
        const meshC = this.doCSG( meshA, meshB, 'intersect', new THREE.MeshNormalMaterial());
        this.info = meshC;
        this.scene.add(meshC);
      } else if (boxA.intersectsBox(boxB) && this.src !== '') {
        const meshC = this.doCSG( meshA, meshB, 'intersect', new THREE.MeshPhongMaterial({map: load}));
        this.info = meshC;
        this.scene.add(meshC);
      } else {
        return;
      }
    } else {
        return;
      }

    this.getInfo.emit(this.info);

// tslint:disable-next-line: prefer-for-of
    for ( let k = 0; k < intersects.length; k++) {
      this.scene.remove((intersects[k] as SelectedMesh));
    }
    this.info = '';
    this.transformControls.detach();
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
          unionMaterial = new THREE.MeshNormalMaterial();
        }
        unionMesh = new SelectedMesh(unionGeometry, unionMaterial);
      }
    });

    if (intersects.length >= 2) {

// tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < intersects.length; i++) {

        const meshI = intersects[i];
        const boxI = new THREE.Box3();

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

  unionGeometry.merge(geometryJ, matrixJ, meshI.material.length);

  this.info = unionMesh;
  unionMesh.updateMatrix();

  const box = new THREE.Box3();
  box.setFromObject(unionMesh);
  unionMesh.geometry.boundingBox = box;

  this.scene.add(unionMesh);

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
  // Метод "Ножницы"
  onClippingByPlane() {

    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const intersects = this.scene.children.filter( e => e instanceof SelectedMesh && e.geometry.type === 'PlaneGeometry');

    const boxSize = 40;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, transparent: true, opacity: 0.5});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    intersects[0].geometry.computeFaceNormals();

    box.rotation.copy(intersects[0].rotation);
    box.position.copy(intersects[0].position);

    const axis = new THREE.Vector3();
    axis.copy(intersects[0].geometry.faces[0].normal).normalize();

    box.translateOnAxis(axis, boxSize / 2);
    box.updateMatrix();

    const boxGeometry2 = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMaterial2 = new THREE.MeshBasicMaterial({color: 0x0000FF, transparent: true, opacity: 0.5});
    const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);

    box2.rotation.copy(intersects[0].rotation);
    box2.position.copy(intersects[0].position);

    box2.translateOnAxis(axis, -boxSize / 2);
    box2.updateMatrix();


    if (this.src !== '') {
    const meshC = this.doCSG( box2, this.info, 'intersect', new THREE.MeshPhongMaterial({map: load}));
    meshC.geometry.boundingBox = null;

    const meshD = this.doCSG( box, this.info, 'intersect', new THREE.MeshPhongMaterial({map: load}));
    meshD.geometry.boundingBox = null;
    this.scene.add(meshC);
    this.scene.add(meshD);
   } else {
    const meshC = this.doCSG( box2, this.info, 'intersect', new THREE.MeshNormalMaterial());
    meshC.geometry.boundingBox = null;

    const meshD = this.doCSG( box, this.info, 'intersect', new THREE.MeshNormalMaterial());
    meshD.geometry.boundingBox = null;
    this.scene.add(meshC);
    this.scene.add(meshD);
   }

    // tslint:disable-next-line:prefer-for-of
    for ( let k = 0; k < intersects.length; k++) {
      this.scene.remove(intersects[0]);
      this.scene.remove(this.info);
    }
    this.info = '';
    this.transformControls.detach();
  }

    //  Метод загрузки пользовательских объектов
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

          for (let i = 0; i < l; i++) {
            const geometryMegre = (object.children[i] instanceof Mesh) &&
            (object.children[i].geometry) instanceof BufferGeometry ?
            new Geometry().fromBufferGeometry(object.children[i].geometry) : object.children[i].geometry;
            unitGeometry.merge(geometryMegre);
          }
          const result = new SelectedMesh(unitGeometry, object.children[0].material);
          result.updateMatrix();
          this.scene.add(result);

        });
    });

  }
}
