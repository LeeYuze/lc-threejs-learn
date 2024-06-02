import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
// 物体变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

let guiParams,
  sceneMeshs = [],
  currentMesh;

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 试图
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机
camera.position.z = 12;
camera.position.y = 5;
camera.position.x = 0;
// camera.lookAt(0, 1.5, 0);

// 添加时间坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 网格辅助器

const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.material.opacity = 0.25;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼
controls.enableDamping = true;
// 设置阻尼的系数
controls.dampingFactor = 0.05;
// 自动旋转
controls.autoRotate = false;
// 设置看的高度
controls.target.set(-2, 1, 0);
// 禁用平移
// controls.enablePan = false;

// controls.minDistance = 3
// controls.maxDistance = 5.5

// // 垂直最小
// controls.minPolarAngle = Math.PI / 2 - Math.PI / 20
// // 垂直最大
// controls.maxPolarAngle = Math.PI / 2 + Math.PI / 20

// // 水平最小
// controls.minAzimuthAngle =  Math.PI / 2 - Math.PI / 20
// // 水平最大
// controls.maxAzimuthAngle =  Math.PI / 2 + Math.PI / 20

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onClick(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersectObjects = raycaster.intersectObjects(
    sceneMeshs.map((item) => item.object3d),
    true
  );
  if (intersectObjects.length > 0) {
    currentMesh = intersectObjects[0].object.parent.parent;
    tControlsSelect(currentMesh);
    // const objectToRemove = intersectObjects[0].object;
    // removeFromParent(objectToRemove);
  }
}

// 删除递归
function removeFromParent(object) {
  while (object.parent && object.parent !== scene) {
    object = object.parent;
  }
  if (object.parent === scene) {
    scene.remove(object);
  }
}

window.addEventListener("click", onClick);

function animate() {
  controls.update();
  // geocube.rotation.x += 0.01;
  // geocube.rotation.y += 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);

  TWEEN.update();
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix;
});

// 加载模型背景
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
const textureLoader = new THREE.TextureLoader();

// 创建变换控制器
const tControls = new TransformControls(camera, renderer.domElement);
tControls.addEventListener("change", animate);
// 监听拖动事件 当拖动物体时 禁用轨道控制器
tControls.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});
tControls.addEventListener("change", () => {
  if (guiParams.isClampGroup) {
    tControls.object.position.y = 0;
  }
});
scene.add(tControls);

dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);

rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 反射
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 折射
  envMap.mapping = THREE.EquirectangularRefractionMapping;

  scene.environment = envMap;
  scene.background = new THREE.Color(0xcccccc);
});

let basicScene;

gltfLoader.load("./model/house/house-scene-min.glb", (gltf) => {
  basicScene = gltf.scene;
});

const eventObj = {
  addScene: function () {
    scene.add(basicScene);
  },
  setTranslate: function () {
    tControls.setMode("translate");
  },
  setRotate: function () {
    tControls.setMode("rotate");
  },
  setScale: function () {
    tControls.setMode("scale");
  },
  toggleSpace: function () {
    tControls.setSpace(tControls.space === "world" ? "local" : "world");
  },
  cancelMesh: function () {
    tControls.detach();
  },
};

guiParams = {
  translateSnapNum: 0,
  rotateSnapNum: 0,
  scaleSnapNum: 0,
  isClampGroup: false,
  isLight: true,
};

const gui = new GUI();

const folderAddMesh = gui.addFolder("添加物体");
const folderMethod = gui.addFolder("功能设置");

folderAddMesh.add(eventObj, "addScene").name("添加户型的基础模型");
folderMethod.add(eventObj, "toggleSpace").name("切换空间模式");
folderMethod.add(eventObj, "setTranslate").name("位移模式");
folderMethod.add(eventObj, "setRotate").name("旋转模式");
folderMethod.add(eventObj, "setScale").name("缩放模式");
folderMethod.add(eventObj, "cancelMesh").name("取消显示");
folderMethod
  .add(guiParams, "isLight")
  .name("灯光设置")
  .onChange((value) => {
    if (value) {
      renderer.toneMappingExposure = 1;
    } else {
      renderer.toneMappingExposure = 0.1;
    }
  });

const snapFolder = gui.addFolder("固定设置");
snapFolder
  .add(guiParams, "translateSnapNum", {
    不固定: null,
    1: 1,
    10: 10,
  })
  .name("位移步长")
  .onChange((value) => {
    tControls.setTranslationSnap(value);
  });

snapFolder
  .add(guiParams, "rotateSnapNum", 0, 1)
  .step(0.1)
  .name("旋转步长")
  .onChange((value) => {
    tControls.setRotationSnap(value * Math.PI * 2);
  });

snapFolder
  .add(guiParams, "scaleSnapNum", 0, 1)
  .step(0.1)
  .name("缩放步长")
  .onChange((value) => {
    tControls.setScaleSnap(value);
  });

snapFolder.add(guiParams, "isClampGroup").name("吸附地面");

window.addEventListener("keydown", (event) => {
  if (event.key === "t") {
    tControls.setMode("translate");
  } else if (event.key === "r") {
    tControls.setMode("rotate");
  } else if (event.key === "s") {
    tControls.setMode("scale");
  } else if (event.key === "Backspace") {
    removeFromParent(currentMesh);
    tControls.detach();
  }
});

const folderMeshs = gui.addFolder("家具列表");

// 添加盆栽
let meshList = [
  { name: "盆栽", path: "./model/house/plants-min.glb" },
  { name: "单人沙发", path: "./model/house/sofa_chair_min.glb" },
];

let meshCountObj = {};
meshList.forEach((item) => {
  item.addMesh = function () {
    gltfLoader.load(item.path, (gltf) => {
      const object3d = gltf.scene;
      sceneMeshs.push({
        ...item,
        object3d,
      });

      scene.add(object3d);
      tControlsSelect(object3d);

      const meshObj = {
        toggleMesh: function () {
          tControlsSelect(object3d);
        },
      };

      meshCountObj[item.name] = meshCountObj[item.name]
        ? meshCountObj[item.name] + 1
        : 1;
      const meshCount = meshCountObj[item.name];

      folderMeshs.add(meshObj, "toggleMesh").name(item.name + meshCount);
    });
  };
  folderAddMesh.add(item, "addMesh").name(item.name);
});

function tControlsSelect(mesh) {
  tControls.attach(mesh);
}
