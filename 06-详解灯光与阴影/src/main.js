import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { CSM } from "three/addons/csm/CSM.js";
import { CSMHelper } from "three/addons/csm/CSMHelper.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

import gsap from "gsap";

let csm, csmHelper;

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 渲染器允许投射阴影
renderer.shadowMap.enabled = true;

// 设置相机
camera.position.z = 15;
camera.position.y = 2.4;
camera.position.x = 0.4;
camera.lookAt(0, 0, 0);

// 添加时间坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼
controls.enableDamping = true;
// 设置阻尼的系数
controls.dampingFactor = 0.05;
// 自动旋转
controls.autoRotate = false;

const params = {
  orthographic: false,
  fade: false,
  shadows: true,
  far: 1000,
  mode: "practical",
  lightX: -1,
  lightY: -1,
  lightZ: -1,
  margin: 100,
  lightFar: 5000,
  lightNear: 1,
  autoUpdateHelper: true,
  updateHelper: function () {
    csmHelper.update();
  },
};

csm = new CSM({
  maxFar: params.far,
  cascades: 4,
  mode: params.mode,
  parent: scene,
  shadowMapSize: 1024,
  lightDirection: new THREE.Vector3(
    params.lightX,
    params.lightY,
    params.lightZ
  ).normalize(),
  camera: camera,
});

csmHelper = new CSMHelper(csm);
csmHelper.visible = false;
scene.add(csmHelper);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  camera.updateMatrixWorld();
  csm.update();

  renderer.render(scene, camera);

  TWEEN.update();
}

animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

const guiParams = {};
const gui = new GUI();

// 加载模型背景
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
const textureLoader = new THREE.TextureLoader();

dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);

rgbeLoader.load("./texture/Video_Copilot-Back Light_0007_4k.hdr", (envMap) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 设置环境贴图
  // scene.environment = envMap;
});

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material1 = new THREE.MeshPhysicalMaterial({
  color: 0xccccff,
});
csm.setupMaterial(material1);

const torusKnot = new THREE.Mesh(geometry, material1);
torusKnot.position.set(4, 0, 0);
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
scene.add(torusKnot);

let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const material2 = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
});
csm.setupMaterial(material2);

const sphere = new THREE.Mesh(sphereGeometry, material2);
// 设置球接收阴影
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material3 = new THREE.MeshPhysicalMaterial({
  color: 0xffcccc,
});
csm.setupMaterial(material3);

const box = new THREE.Mesh(boxGeometry, material3);
box.castShadow = true;
box.receiveShadow = true;
box.position.set(-4, 0, 0);
scene.add(box);

// 创建平面
let planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1);
let planeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x999999,
});
csm.setupMaterial(planeMaterial);

let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.set(0, -2, 0);

scene.add(planeMesh);

planeMesh.castShadow = true;
planeMesh.receiveShadow = true;

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position
  .set(params.lightX, params.lightY, params.lightZ)
  .normalize()
  .multiplyScalar(-200);
// // 设置平行光照的位置
// directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

// 光投射阴影
// directionalLight.castShadow = true;

// 添加平光辅助器
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

gui.add(sphere.position, "z", -10, 10).name("z");

// console.log(directionalLight);
// directionalLight.shadow.camera.left = -100;
// directionalLight.shadow.camera.right = 100;
// directionalLight.shadow.camera.top = 100;
// directionalLight.shadow.camera.bottom = -100;

// // 设置阴影的纹理大小
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);

gui.add(params, "orthographic").onChange(function (value) {
  csm.camera = value ? orthoCamera : camera;
  csm.updateFrustums();
});

gui.add(params, "fade").onChange(function (value) {
  csm.fade = value;
  csm.updateFrustums();
});

gui.add(params, "shadows").onChange(function (value) {
  renderer.shadowMap.enabled = value;

  scene.traverse(function (child) {
    if (child.material) {
      child.material.needsUpdate = true;
    }
  });
});

gui
  .add(params, "far", 1, 5000)
  .step(1)
  .name("shadow far")
  .onChange(function (value) {
    csm.maxFar = value;
    csm.updateFrustums();
  });

gui
  .add(params, "mode", ["uniform", "logarithmic", "practical"])
  .name("frustum split mode")
  .onChange(function (value) {
    csm.mode = value;
    csm.updateFrustums();
  });

gui
  .add(params, "lightX", -1, 1)
  .name("light direction x")
  .onChange(function (value) {
    csm.lightDirection.x = value;
  });

gui
  .add(params, "lightY", -1, 1)
  .name("light direction y")
  .onChange(function (value) {
    csm.lightDirection.y = value;
  });

gui
  .add(params, "lightZ", -1, 1)
  .name("light direction z")
  .onChange(function (value) {
    csm.lightDirection.z = value;
  });

gui
  .add(params, "margin", 0, 200)
  .name("light margin")
  .onChange(function (value) {
    csm.lightMargin = value;
  });

gui
  .add(params, "lightNear", 1, 10000)
  .name("light near")
  .onChange(function (value) {
    for (let i = 0; i < csm.lights.length; i++) {
      csm.lights[i].shadow.camera.near = value;
      csm.lights[i].shadow.camera.updateProjectionMatrix();
    }
  });

gui
  .add(params, "lightFar", 1, 10000)
  .name("light far")
  .onChange(function (value) {
    for (let i = 0; i < csm.lights.length; i++) {
      csm.lights[i].shadow.camera.far = value;
      csm.lights[i].shadow.camera.updateProjectionMatrix();
    }
  });

const helperFolder = gui.addFolder("helper");

helperFolder.add(csmHelper, "visible");

helperFolder.add(csmHelper, "displayFrustum").onChange(function () {
  csmHelper.updateVisibility();
});

helperFolder.add(csmHelper, "displayPlanes").onChange(function () {
  csmHelper.updateVisibility();
});

helperFolder.add(csmHelper, "displayShadowBounds").onChange(function () {
  csmHelper.updateVisibility();
});

helperFolder.add(params, "autoUpdateHelper").name("auto update");

helperFolder.add(params, "updateHelper").name("update");

helperFolder.open();
