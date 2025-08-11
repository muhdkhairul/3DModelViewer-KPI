import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import "./App.css";

export default function STLViewer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111827");
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 200, 100);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mountRef.current.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleFiles = (files) => {
    const loader = new STLLoader();
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const geometry = loader.parse(e.target.result);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          wireframe: wireframe,
        });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        mesh.position.sub(center);
        sceneRef.current.add(mesh);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">3D STL Viewer</h1>
      <input type="file" accept=".stl" multiple onChange={(e) => handleFiles(e.target.files)} />
      <label className="ml-4">
        <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
        Wireframe
      </label>
      <div ref={mountRef} className="mt-4" style={{ height: 600 }} />
    </div>
  );
}
