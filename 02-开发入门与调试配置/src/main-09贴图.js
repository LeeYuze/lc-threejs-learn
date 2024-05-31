import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

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
const renderer = new THREE.WebGLRenderer();
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
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix;
});

// 纹理加载器
const textureLoader = new THREE.TextureLoader();
// 加载纹理
const texture = textureLoader.load(
  "./texture/watercover/CityNewYork002_COL_VAR1_1K.png"
);
// 设置srgb空间
texture.colorSpace = THREE.SRGBColorSpace;

// 加载ao贴图
const aoMap = textureLoader.load(
  "./texture/watercover/CityNewYork002_AO_1K.jpg"
);
// 透明贴图
const alphaMap = textureLoader.load("./texture/door/alpha.jpg");
// 光照贴图
const lightMap = textureLoader.load("./texture/colors.png");
// 高光贴图
const specularMap = textureLoader.load(
  "./texture/watercover/CityNewYork002_GLOSS_1K.jpg"
);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  aoMap,
  // alphaMap,
  // lightMap,
  specularMap,
  transparent: true,
  reflectivity: 0.5,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// rgbeloader加载hdr贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球型映射
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境背景
  scene.background = envMap;
  // plane设置环境贴图
  planeMaterial.envMap = envMap;
});

const gui = new GUI();

gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao贴图强度");

gui
  .add(texture, "colorSpace", {
    srgb: THREE.SRGBColorSpace,
    linear: THREE.LinearSRGBColorSpace,
  })
  .onChange(() => {
    texture.needsUpdate = true;
  });
