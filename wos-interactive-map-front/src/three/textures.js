import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
import {fitCanvasText} from '../utils/fitText.js';

async function loadTextures() {
    const texturePromises = {
        Banner: loadTexture('/img/alliance/banner.png', "buildings.alliance.banner"),
        HQ: loadTexture('/img/alliance/hq.png', "buildings.alliance.hq"),
        Furnace: loadTexture('/img/furnace.png', "buildings.furnace"),
        Trap: loadTexture('/img/alliance/trap.png', "buildings.alliance.trap"),
        SunFire: loadTexture('/img/sunfire.png', "buildings.sunfire"),
        Iron: loadTexture('/img/alliance/iron.png', "buildings.alliance.iron"),
        Coal: loadTexture('/img/alliance/coal.png', "buildings.alliance.coal"),
        Farm: loadTexture('/img/alliance/farm.png', "buildings.alliance.farm"),
        Wood: loadTexture('/img/alliance/wood.png', "buildings.alliance.wood"),
        // obstacles:
        Mountain_Big: loadTexture('/img/obstacles/mountain-big-8x8-gray.png', "obstacle.mountain.big"),
    };

    const loadedTextures = await Promise.all(Object.values(texturePromises));
    const textures = Object.keys(texturePromises).reduce((acc, key, index) => {
        acc[key] = loadedTextures[index];
        return acc;
    }, {});

    return textures;
}

function loadTexture(path, displayname) {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      path,
      texture => {
        texture.encoding = THREE.sRGBEncoding;
        resolve({ texture, path, displayname });
      },
      undefined,
      () => {
        console.error(`❌ Failed to load texture "${displayname}" at path: ${path}`);
        reject(new Error(`Failed to load texture "${displayname}" at path: ${path}`));
      }
    );
  });
}

async function createTextTexture(text) {
    await document.fonts.load('80px "Rowdies"');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 512;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const maxWidth = canvas.width - 20;

    const fontSize = fitCanvasText(context, text, maxWidth, 80);

    context.font = `${fontSize}px Rowdies`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}

export { loadTextures, createTextTexture };
