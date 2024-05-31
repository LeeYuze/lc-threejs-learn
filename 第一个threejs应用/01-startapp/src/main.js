import * as THREE from "three";

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
// 创建网格
const geocube = new THREE.Mesh(geomertry, geomaterial);

scene.add(geocube);

camera.position.z = 5;
camera.lookAt(0, 0, 0);

function animate() {
  geocube.rotation.x += 0.01;
  geocube.rotation.y += 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
