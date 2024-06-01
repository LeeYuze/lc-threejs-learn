import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
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

const gui = new GUI();

// 加载模型背景
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
const textureLoader = new THREE.TextureLoader();

dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// 添加颜色的纹理
const colorTexture = textureLoader.load(
  "./public/texture/watercover/CityNewYork002_COL_VAR1_1K.png"
);
colorTexture.colorSpace = THREE.SRGBColorSpace;

// 高光贴图
const specularMap = textureLoader.load(
  "./public/texture/watercover/CityNewYork002_GLOSS_1K.jpg"
);

// 高光贴图
const normalMap = textureLoader.load(
  "./public/texture/watercover/CityNewYork002_NRM_1K.jpg"
);

// 位移贴图
const displacementMap = textureLoader.load(
  "./public/texture/watercover/CityNewYork002_DISP_1K.jpg"
);

// ao贴图
const aoMap = textureLoader.load(
  "./public/texture/watercover/CityNewYork002_AO_1K.jpg"
);

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const planeMaterial = new THREE.MeshPhongMaterial({
  map: colorTexture,
  specularMap,
  bumpMap: displacementMap,
  normalMap,
  displacementMap,
  aoMap,
  displacementScale: 0.02,
  transparent: true,
});
const planeCube = new THREE.Mesh(planeGeometry, planeMaterial);
planeCube.rotation.x = -Math.PI / 2;
scene.add(planeCube);

rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
  scene.background = envMap;
  planeMaterial.envMap = envMap;
});
