import * as THREE from 'three';
import { scene, camera, renderer } from './main.js';

export function takeScreenshot(width = 4000, height = 3000) {
  const originalSize = new THREE.Vector2();
  renderer.getSize(originalSize);

  const originalAspect = camera.aspect;

  // Resize renderer for high-res export
  renderer.setSize(width, height, false);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);

  // Export image
  const dataURL = renderer.domElement.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `wos-map-${Date.now()}.png`;
  link.click();

  // Restore original size
  renderer.setSize(originalSize.x, originalSize.y, false);

  camera.aspect = originalAspect;
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);
}