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

rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 反射
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 折射
  envMap.mapping = THREE.EquirectangularRefractionMapping;

  scene.environment = envMap;
  scene.background = envMap;

  // 加载鸭子模型
  gltfLoader.load("./model/Duck.glb", (gltf) => {
    scene.add(gltf.scene);
    // 先拿到鸭子的mesh
    const duckMesh = gltf.scene.getObjectByName("LOD3spShape");

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const preMaterial = duckMesh.material;

    duckMesh.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      refractionRatio: 0.7,
      reflectivity: 0.9,
      map: preMaterial.map,
      envMap,
    });


  });
});
