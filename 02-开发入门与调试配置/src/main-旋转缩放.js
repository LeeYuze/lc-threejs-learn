import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// 立方体
const geomertry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const geomaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const parentGeomaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 创建网格
const parentGeocube = new THREE.Mesh(geomertry, parentGeomaterial);
const geocube = new THREE.Mesh(geomertry, geomaterial);

parentGeocube.add(geocube);

// 如果父亲就是相较于父亲
// 设置立方体的位置
geocube.position.set(3, 0, 0);

// parentGeocube.scale.set(2, 2, 2);

// 如果有父亲也是相较于父亲
// 设置立方体缩放
geocube.scale.set(2, 2, 2);

// 旋转也是较于父亲
parentGeocube.rotation.x = Math.PI / 4;
geocube.rotation.x = Math.PI / 4;

// 立方体添加到场景中
scene.add(parentGeocube);

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
