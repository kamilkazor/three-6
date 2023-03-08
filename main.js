import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

// INITIAL SETTINGS
const scene = new THREE.Scene();

const defaultColor = {
  r: 1,
  g: 1,
  b: 1,
};
const clickedColor = {
  r: 1,
  g: 0,
  b: 0,
};
const loader = new GLTFLoader();
loader.load(
  "Plik_do_zadania_6.glb",
  function (gltf) {
    gltf.scene.children.forEach((child) => {
      child.material.color.r = defaultColor.r;
      child.material.color.g = defaultColor.g;
      child.material.color.b = defaultColor.b;
      child.material.metalness = 0;
    });
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
scene.add(pointLight1);
pointLight1.position.set(0, 4, 5);

const pointLight2 = new THREE.PointLight(0xffffff, 0.2);
scene.add(pointLight2);
pointLight2.position.set(0, -2, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ADDING CAMERA CONTROL
const controls = new OrbitControls(camera, renderer.domElement);

// HANDLE SCREEN RESIZE
window.addEventListener("resize", (e) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// HANDLING CLICK
function changeColor(color) {
  const obj = scene.getObjectByName("Scene");
  if (!obj) return;
  obj.children.forEach((child) => {
    gsap.to(child.material.color, 1, color);
  });
}
function rotateX(deg) {
  const obj = scene.getObjectByName("Scene");
  if (!obj) return;
  gsap.fromTo(obj.rotation, { x: 0 }, { duration: 1, x: deg });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isClicked = false;
let mouseDownTime = undefined;
window.addEventListener("mousedown", () => {
  mouseDownTime = Date.now();
});

function isLongClick() {
  let isLong = false;
  const mouseUpTime = Date.now();
  if (mouseDownTime && mouseUpTime - mouseDownTime > 250) {
    isLong = true;
  }
  mouseDownTime = undefined;
  return isLong;
}

function onClick(e) {
  if (isLongClick()) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  const isIntersecting = intersects.length ? true : false;

  if (isIntersecting) {
    if (!isClicked) {
      changeColor(clickedColor);
      rotateX(Math.PI * 2);
    }
    isClicked = true;
  } else {
    changeColor(defaultColor);
    isClicked = false;
  }
}
window.addEventListener("click", onClick);

// INITIALIZING ANIMATION
function animate() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
animate();
