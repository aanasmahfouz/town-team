import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { gsap } from 'gsap';

const canvas = document.querySelector("#herocanvas");
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);

  gsap.to(camera.position, {
    z: 17,
    delay: 8,
    ease: "circ.out"
  });

  const isDesktop = window.matchMedia("(min-width: 600px)");
  if (!isDesktop.matches) {
    gsap.to(camera.position, {
      z: 20,
      delay: 8
    });
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const loader = new GLTFLoader();
  loader.setResourcePath("/models/");
  let model;

  try {
    new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr', function(texture) {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();

      loader.load("/models/town-team-hero-garment.glb", (gltf) => {
        model = gltf.scene;
        scene.add(model);
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());

        gltf.scene.position.x -= center.x;
        gltf.scene.position.y -= center.y;
        gltf.scene.position.z -= center.z;

        const MODEL_SCALE = 2.5;
        gltf.scene.scale.setScalar(MODEL_SCALE);

        startIdleRotation();
      }, undefined, () => {
        // Model file optional - fails gracefully
      });
    }, undefined, () => {
      // HDR optional - fails gracefully
    });
  } catch (e) {}

  let resizeTimeout;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  }, { passive: true });

  let idleTween = null;
  let idleTimer = null;
  const IDLE_DELAY = 2000;

  function startIdleRotation() {
    if (!model) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!model) return;
      idleTween = gsap.to(model.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 20,
        ease: "none",
        repeat: -1
      });
    }, IDLE_DELAY);
  }

  // Capability-aware mouse tracking with requestAnimationFrame throttling (large screens with mouse only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024) {
    let mouseTicking = false;
    window.addEventListener("mousemove", (e) => {
      if (!model || mouseTicking) return;
      mouseTicking = true;

      requestAnimationFrame(() => {
        const rotY = (e.clientX / window.innerWidth - 0.5) * (Math.PI * 0.3);
        const rotX = (e.clientY / window.innerHeight - 0.5) * (Math.PI * 0.3);

        if (idleTween) {
          idleTween.kill();
          idleTween = null;
        }

        gsap.to(model.rotation, {
          x: rotX,
          y: rotY,
          duration: 0.2,
          ease: "power2.out"
        });

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!model) return;
          idleTween = gsap.to(model.rotation, {
            y: "+=" + Math.PI * 2,
            duration: 20,
            ease: "none",
            repeat: -1
          });
        }, IDLE_DELAY);

        mouseTicking = false;
      });
    }, { passive: true });
  }

  // Visibility-Aware Rendering Loop: Pause RAF when off-screen!
  let isVisible = true;
  let animId = null;

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        animate();
      }
    });
  }, { threshold: 0.01 });

  visibilityObserver.observe(canvas);

  function animate() {
    if (!isVisible) {
      animId = null;
      return;
    }
    animId = window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
