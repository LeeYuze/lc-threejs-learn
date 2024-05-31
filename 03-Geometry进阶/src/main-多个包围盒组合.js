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

// 设置3个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
sphere1.position.x = -4;
scene.add(sphere1);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
scene.add(sphere2);

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
sphere3.position.x = 4;
scene.add(sphere3);

var box = new THREE.Box3();

let arrSphere = [sphere1, sphere2, sphere3];
for (let i = 0; i < arrSphere.length; i++) {
  // // 获取当前物体的包围盒
  // // 1、计算包围盒
  // arrSphere[i].geometry.computeBoundingBox();
  // // 2、拿到包围盒
  // let box3 = arrSphere[i].geometry.boundingBox;
  // arrSphere[i].updateWorldMatrix(true, true);
  // box3.applyMatrix4(arrSphere[i].matrixWorld)
  // // 合并包围盒
  // box.union(box3);

  // 第二种方式
  let box3 = new THREE.Box3().setFromObject(arrSphere[i])
  box.union(box3)
}

// 创建包围盒辅助器
let box3Helper = new THREE.Box3Helper(box, 0xffff00);
scene.add(box3Helper);
