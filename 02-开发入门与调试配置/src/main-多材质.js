import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

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

// 创建几何体
const bufferGeometry = new THREE.BufferGeometry();

// // 创建顶点数据
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
//   1.0,1.0,0.0,-1.0,1.0,0.0,-1.0,-1.0,0.0
// ]);
// bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// 使用索引的方式绘制定点
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
]);
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);

bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

// 设置2个顶点组 设置2个材质
bufferGeometry.addGroup(0, 3, 0);
bufferGeometry.addGroup(3, 3, 1);

const bufferMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  // side: THREE.DoubleSide,
  wireframe: true,
});

const bufferMaterial1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // side: THREE.DoubleSide,
  // wireframe: true,
});

const bufferCube = new THREE.Mesh(bufferGeometry, [
  bufferMaterial,
  bufferMaterial1,
]);

console.log(bufferGeometry);

scene.add(bufferCube);

// 设置一个立方体6个面不同材质
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const meshBasicMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const meshBasicMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const meshBasicMaterial3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const meshBasicMaterial4 = new THREE.MeshBasicMaterial({ color: 0x000fff });
const meshBasicMaterial5 = new THREE.MeshBasicMaterial({ color: 0xfff000 });
const meshBasicMaterial6 = new THREE.MeshBasicMaterial({ color: 0x00fff0 });

const cube = new THREE.Mesh(boxGeometry, [
  meshBasicMaterial1,
  meshBasicMaterial2,
  meshBasicMaterial3,
  meshBasicMaterial4,
  meshBasicMaterial5,
  meshBasicMaterial6,
]);

cube.position.set(2, 0, 0);
scene.add(cube);

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
