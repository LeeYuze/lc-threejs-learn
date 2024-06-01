import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

import gsap from "gsap";

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

function animate() {
  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);

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
const torusKnot = new THREE.Mesh(geometry, material1);
torusKnot.position.set(4, 0, 0);
scene.add(torusKnot);

let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const material2 = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
});
const sphere = new THREE.Mesh(sphereGeometry, material2);
// 设置球接收阴影
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material3 = new THREE.MeshPhysicalMaterial({
  color: 0xffcccc,
});
const box = new THREE.Mesh(boxGeometry, material3);
box.position.set(-4, 0, 0);
scene.add(box);

// 创建平面
let planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1);
let planeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x999999,
});
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.set(0, -2, 0);
scene.add(planeMesh);

planeMesh.castShadow = true;
planeMesh.receiveShadow = true;

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 100);
spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true;

spotLight.angle = Math.PI / 8;
spotLight.distance = 100;
spotLight.penumbra = 0.5;
spotLight.decay = 2;

spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048


scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

gui.add(sphere.position, "z", -10, 10).name("z");
