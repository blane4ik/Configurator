import { EventEmitter, Injectable } from '@angular/core';
import * as THREE from 'three';
import { AmbientLight, AxesHelper, BufferGeometry, DirectionalLight, Geometry, GridHelper, Intersection, Material,
         Mesh, PerspectiveCamera, Raycaster, Scene, WebGLRenderer, Vector2, Vector3, Object3D, Box3, Matrix4, Texture } from 'three';
import CSG from 'three-js-csg/index.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
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
  font;

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
     this.camera.position.y = 60;
     this.scene.add(this.camera);

     this.grid = new THREE.GridHelper(80, 80);
     this.scene.add(this.grid);

     this.axes = new THREE.AxesHelper(80);

     this.orbitControls = new OrbitControls(this.camera, rendererContainer.nativeElement);
     this.orbitControls.enableRotate = false;
     this.transformControls = new TransformControls(this.camera, rendererContainer.nativeElement);
     this.transformControls.setSize(1.5);
     this.scene.add(this.transformControls);

     this.raycaster = new THREE.Raycaster();

     this.ambientLight = new THREE.AmbientLight('white');
     this.scene.add(this.ambientLight);

     this.directionalLight = new THREE.DirectionalLight('white', 1);
     this.directionalLight.position.y = 40;
     this.directionalLight.position.x = 20;
     this.directionalLight.position.z = 20;
     this.scene.add(this.directionalLight);

// tslint:disable-next-line: max-line-length
     const texture: Texture = new THREE.TextureLoader().load('data:image/jpeg;base64,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');
     const mat: Material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
     const geo: Geometry = new THREE.PlaneGeometry(25, 3);
     const plane: Mesh = new THREE.Mesh(geo, mat);
     plane.position.set(0, 0, 42);
     plane.rotateX(-(Math.PI / 2));
     this.scene.add(plane);

     this.renderer = new THREE.WebGLRenderer({canvas: rendererContainer.nativeElement, alpha: true, preserveDrawingBuffer: true});
     this.renderer.setSize(rendererContainer.nativeElement.clientWidth, rendererContainer.nativeElement.clientHeight);

     this.animate();
  }

  // Метод, определяющий выбранные свойства для фигуры из дропдаунов
  defineTheProperties(material, color) {
    // Если определена текстура
    if (this.src) {
      const load: Texture = new THREE.TextureLoader().load(this.src);
      load.wrapS = THREE.RepeatWrapping;
      load.wrapT = THREE.RepeatWrapping;
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
    const mouse: Vector2 = new THREE.Vector2();
    mouse.x = (event.offsetX / this.rendererContainer.clientWidth ) * 2 - 1;
    mouse.y = - (event.offsetY / this.rendererContainer.clientHeight) * 2 + 1;
    // Отправляем луч от камеры к мышке
    this.raycaster.setFromCamera(mouse, this.camera);
// Выборка потомков необходимых нам
    const sceneChildArray: SelectedMesh[] = [];

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
      const isSelectedFlag: boolean = (intersects[i].object as SelectedMesh).isSelected;
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
      const box: Vector3 = this.info.geometry.boundingBox.getSize(new THREE.Vector3());

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
    const mesh: Object3D[] = elem.filter( e => e instanceof SelectedMesh ).filter( element => (element.material.opacity !== 1) &&
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
   }

  //  Определение методов создания объектов
   onBoxCreate(width, height, depth, mat) {
    mat = this.material;
    const geometry: Geometry = new THREE.BoxGeometry( width, height, depth );
    const mesh: SelectedMesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onTextCreate(text, size, height, mat) {
     const loader = new THREE.FontLoader();
     loader.load(this.font, (font) => {
      const textGeo: Geometry = new THREE.TextGeometry( text, {
        font,
        size,
        height,
      });
      mat = this.material;
      const mesh: Mesh = new SelectedMesh(textGeo, mat);
      const box: Box3 = new THREE.Box3();
      box.setFromObject(mesh);
      textGeo.boundingBox = null;
      this.scene.add(mesh);
    });
   }

   onPlaneCreate(width, height, mat) {
    mat = this.material;
    const geometry: Geometry = new THREE.PlaneGeometry(width, height);
    const mesh: Mesh = new SelectedMesh(geometry, mat);
    mat.side = THREE.DoubleSide;
    mat.opacity = 0.5;

    return mesh;
   }

   onSphereCreate(radius, width, height, mat) {
    mat = this.material;
    const geometry: Geometry = new THREE.SphereGeometry(radius, width, height);
    const mesh: Mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onConeCreate(radius, height, segments, mat) {
    mat = this.material;
    const geometry: Geometry = new THREE.ConeGeometry(radius, height, segments);
    const mesh: Mesh = new SelectedMesh(geometry, mat);

    return mesh;
   }

   onCylinderCreate(radiusTop, radiusBot, height, segments, mat) {
    mat = this.material;
    const geometry: Geometry = new THREE.CylinderGeometry(radiusTop, radiusBot, height, segments);
    const mesh: Mesh = new SelectedMesh(geometry, mat);

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
      const box: Box3 = new THREE.Box3();
      if (mesh && mesh.geometry.type !== 'TextGeometry') {
      box.setFromObject(mesh);
      } else {
        return;
      }

      mesh.geometry.boundingBox = box;
      const boudingBoxYSize: number = mesh.geometry.boundingBox.max.y;
      mesh.position.x = posX;
      mesh.position.y = posY + boudingBoxYSize;
      mesh.position.z = posZ;

      this.scene.add(mesh);
      this.camera.lookAt(mesh.position);
   }

  //  Метод вычитания объектов
   onSubtract() {
    const intersects: SelectedMesh[] = [];

    const load = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const meshes: Object3D[] = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e: SelectedMesh) => {
       if (e.isSelected) {
         intersects.push(e);
       }
     } );

    if (intersects.length < 3 && intersects.length > 1) {


      const meshA: Mesh = intersects[0];
      const boxA: Box3 = new THREE.Box3();
      boxA.setFromObject(meshA);

      const meshB: Mesh = intersects[1];
      const boxB: Box3 = new THREE.Box3();
      boxB.setFromObject(meshB);

      if (boxA.intersectsBox(boxB) && this.src === '') {
        const meshC: SelectedMesh = this.doCSG( meshA, meshB, 'subtract', new THREE.MeshNormalMaterial());
        this.info = meshC;
        this.scene.add(meshC);
      } else if (boxA.intersectsBox(boxB) && this.src !== '') {
        const meshC: SelectedMesh = this.doCSG( meshA, meshB, 'subtract', new THREE.MeshPhongMaterial({map: load}));
        this.info = meshC;
        this.scene.add(meshC);
      } else {
        alert('Объекты не пересекаются!');
        return;
      }
    } else {
        alert('Не выбрано два объекта!');
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
    const intersects: SelectedMesh[] = [];

    const load: Texture = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const meshes: Object3D[] = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e: SelectedMesh) => {
       if (e.isSelected) {
         intersects.push(e);
       }
     } );

    if (intersects.length < 3 && intersects.length > 1) {


      const meshA: Mesh = intersects[0];
      const boxA: Box3 = new THREE.Box3();
      boxA.setFromObject(meshA);

      const meshB: Mesh = intersects[1];
      const boxB: Box3 = new THREE.Box3();
      boxB.setFromObject(meshB);

      if (boxA.intersectsBox(boxB) && this.src === '') {
        const meshC: SelectedMesh = this.doCSG( meshA, meshB, 'intersect', new THREE.MeshNormalMaterial());
        this.info = meshC;
        this.scene.add(meshC);
      } else if (boxA.intersectsBox(boxB) && this.src !== '') {
        const meshC: SelectedMesh = this.doCSG( meshA, meshB, 'intersect', new THREE.MeshPhongMaterial({map: load}));
        this.info = meshC;
        this.scene.add(meshC);
      } else {
        alert('Объекты не пересекаются!');
        return;
      }
    } else {
      alert('Не выбрано два объекта!');
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
    const intersects: SelectedMesh[] = [];
    const load: Texture = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;
    const unionMaterials: any = [];
    const unionGeometry: Geometry = new THREE.Geometry();
    let unionMesh: SelectedMesh;
    let unionMaterial: Material;


    const meshes: Object3D[] = this.scene.children.filter( e => e instanceof SelectedMesh );
    meshes.forEach( (e: SelectedMesh) => {
       if (e.isSelected) {
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

        const meshI: SelectedMesh = intersects[i];
        const boxI: Box3 = new THREE.Box3();

        boxI.setFromObject(meshI);

        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < intersects.length; j++) {
          const meshJ: SelectedMesh = intersects[j];
          const geometryJ: Geometry = intersects[j].geometry;
          const matrixJ: Matrix4 = intersects[j].matrix;

          if (meshI !== meshJ) {
            const boxJ: Box3 = new THREE.Box3();
            boxJ.setFromObject(meshJ);
            if (boxI.intersectsBox(boxJ)) {

  unionGeometry.merge(geometryJ, matrixJ, meshI.material.length);

  this.info = unionMesh;
  unionMesh.updateMatrix();
  unionMesh.geometry.boundingBox = null;

  this.scene.add(unionMesh);

  this.getInfo.emit(this.info);

// tslint:disable-next-line: prefer-for-of
  for ( let k = 0; k < intersects.length; k++) {
      this.scene.remove((intersects[k] as SelectedMesh));
    }
  this.info = '';
  this.transformControls.detach();
              } else {
                alert('Объекты не пересекаются');
                return;
              }
            } else {
              continue;
            }
        }
      }
   } else {
    alert('Объектов меньше двух!');
    return;
   }
  }
  // Метод "Ножницы"
  onClippingByPlane() {

    const load: Texture = new THREE.TextureLoader().load(this.src);
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT =  THREE.RepeatWrapping;

    const intersects: Object3D[] = this.scene.children.filter( e => e instanceof SelectedMesh && e.geometry.type === 'PlaneGeometry');

    const boxSize = 40;
    const boxGeometry: Geometry = new THREE.BoxGeometry(boxSize * 2, boxSize * 3, boxSize);
    const boxMaterial: Material = new THREE.MeshBasicMaterial({color: 0xFF0000, transparent: true, opacity: 0.5});
    const box: Mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    box.geometry.boundingBox = null;
    intersects[0].geometry.computeFaceNormals();

    box.rotation.copy(intersects[0].rotation);
    box.position.copy(intersects[0].position);

    const axis: Vector3 = new THREE.Vector3();
    axis.copy(intersects[0].geometry.faces[0].normal).normalize();

    box.translateOnAxis(axis, boxSize / 2);
    box.updateMatrix();

    const boxGeometry2: Geometry = new THREE.BoxGeometry(boxSize * 2, boxSize * 3, boxSize);
    const boxMaterial2: Material = new THREE.MeshBasicMaterial({color: 0x0000FF, transparent: true, opacity: 0.5});
    const box2: Mesh = new THREE.Mesh(boxGeometry2, boxMaterial2);
    box2.geometry.boundingBox = null;
    box2.rotation.copy(intersects[0].rotation);
    box2.position.copy(intersects[0].position);

    box2.translateOnAxis(axis, -boxSize / 2);
    box2.updateMatrix();

    if (this.src !== '') {
      const meshC: SelectedMesh = this.doCSG( box2, this.info, 'intersect', new THREE.MeshPhongMaterial({map: load}));
      meshC.geometry.boundingBox = null;

      const meshD: SelectedMesh = this.doCSG( box, this.info, 'intersect', new THREE.MeshPhongMaterial({map: load}));
      meshD.geometry.boundingBox = null;

      this.scene.add(meshC);
      this.scene.add(meshD);
    } else {
      const meshC: SelectedMesh = this.doCSG( box, this.info, 'intersect', new THREE.MeshNormalMaterial());
      meshC.geometry.boundingBox = null;


      const meshD: SelectedMesh = this.doCSG( box2, this.info, 'intersect', new THREE.MeshNormalMaterial());
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

    const mtlLoader: MTLLoader = new MTLLoader();
    const loader: OBJLoader = new OBJLoader();

    mtlLoader.load(this.src, (materials) => {
        materials.preload();
        loader.setMaterials(materials);

        loader.load(this.modelSrc, (object) => {
          object.rotateX(-(Math.PI * 2));
          const length: number = object.children.length;
          const unitGeometry: Geometry = new Geometry();

          for (let i = 0; i < length; i++) {
            const geometryMegre: Geometry = (object.children[i] instanceof Mesh) &&
            (object.children[i].geometry) instanceof BufferGeometry ?
            new Geometry().fromBufferGeometry(object.children[i].geometry) : object.children[i].geometry;
            unitGeometry.merge(geometryMegre);
          }
          const result: SelectedMesh = new SelectedMesh(unitGeometry, object.children[0].material);
          result.updateMatrix();
          this.scene.add(result);

        });
    });

  }
}
