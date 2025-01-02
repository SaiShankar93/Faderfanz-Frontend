import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const ARViewer = ({ modelUrl }) => {
  useEffect(() => {
    let container, renderer, scene, camera, controller;
    let arButton;

    const init = () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      // Create a new scene
      scene = new THREE.Scene();

      // Set up the camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      // Set up the renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      // Add AR button
      arButton = ARButton.createButton(renderer);
      document.body.appendChild(arButton);

      // Load the 3D model
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        scene.add(gltf.scene);
      });

      // Set up the AR controller
      controller = renderer.xr.getController(0);
      scene.add(controller);

      // Add light
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // Handle window resize
      window.addEventListener('resize', onWindowResize, false);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      renderer.setAnimationLoop(render);
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      if (renderer.xr.getSession()) {
        renderer.xr.getSession().end();
      }
      if (container) {
        document.body.removeChild(container);
      }
      if (arButton) {
        document.body.removeChild(arButton);
      }
      window.removeEventListener('resize', onWindowResize, false);
    };
  }, [modelUrl]);

  return null;
};

export default ARViewer;
