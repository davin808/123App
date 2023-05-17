import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

const ThreeScene = () => {
    const containerRef = useRef(null);
    const [renderer, setRenderer] = useState(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [box, setBox] = useState(null);
  
    useEffect(() => {
      const container = containerRef.current;
  
      // Initialize renderer
      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      setRenderer(renderer);
      container.appendChild(renderer.domElement);
  
      // Initialize scene
      const scene = new Scene();
      setScene(scene);
  
      // Initialize camera
      const camera = new PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 10000);
      camera.position.set(0, 0, 10);
      setCamera(camera);
  
      // Initialize box geometry
      const geometry = new BoxGeometry(1, 1, 1);
  
      // Initialize box material
      const material = new MeshBasicMaterial({ color: 0xff0000 });
  
      // Initialize box mesh
      const box = new Mesh(geometry, material);
      scene.add(box);
      setBox(box);
  
      // Render scene
      const render = () => {
        requestAnimationFrame(render);
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      render();
  
      // Clean up
      return () => {
        container.removeChild(renderer.domElement);
      };
    }, []);
  
    return <View style={{ flex: 1 }} ref={containerRef} />;
  };

export default ThreeScene;