import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

async function loadTextures() {
    const texturePromises = {
        Banner: loadTexture('./img/alliance/banner.png', "Bannière d'Alliance"),
        HQ: loadTexture('./img/alliance/hq.png', "QG d'Alliance"),
        Furnace: loadTexture('./img/furnace.png', ""),
        Trap: loadTexture('./img/alliance/trap.png', "Piège à Ours"),
        SunFire: loadTexture('./img/sunfire.png', "Chateau Solaire"),
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
        textureLoader.load(path, texture => resolve({ texture, path, displayname }), reject);
    });
}

async function createTextTexture(text) {
    // Ensure the font is loaded before using it
    await document.fonts.load('80px Rowdies');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 512;
    
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = '80px Rowdies';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // better vertical alignment
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}


export { loadTextures, createTextTexture };
