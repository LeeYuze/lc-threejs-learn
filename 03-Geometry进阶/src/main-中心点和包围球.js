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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机
camera.position.z = 10;
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

// 加载环境贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球型贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.environment = envMap;
  // 设置场景背景
  scene.background = envMap;
});

// 加载鸭子
// 实例化加载器gltf
const gltfLoader = new GLTFLoader();

gltfLoader.load("./model/Duck.glb", (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);

  let duckMesh = gltf.scene.getObjectByName("LOD3spShape");

  const duckGeometry = duckMesh.geometry;
  // 计算包围盒
  duckGeometry.computeBoundingBox();

  // 获取duck包围盒
  let duckBox = duckGeometry.boundingBox;
  // 更新世界矩阵 不更新的话 包围盒很大
  duckMesh.updateMatrixWorld(true, true);
  duckBox.applyMatrix4(duckMesh.matrixWorld);

  // 获取包围盒中心点
  const center = duckBox.getCenter(new THREE.Vector3());
  console.log(center);

  // 创建包围盒辅助器
  const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00);
  scene.add(boxHelper);

  // // 设置几何体居中
  // duckGeometry.center();

  // 创建包围球
  const duckSphere = duckGeometry.boundingSphere;
  // 更新世界矩阵
  duckSphere.applyMatrix4(duckMesh.matrixWorld);

  const sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphereMesh.position.copy(duckSphere.center);
  scene.add(sphereMesh);
});
