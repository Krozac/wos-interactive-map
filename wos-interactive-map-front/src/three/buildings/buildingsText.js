
import i18n from '../../i18n/index.js';
import * as THREE from 'three';
import { createTextTexture } from '../textures.js'

const textTextureCache = new Map();

async function createTextSprite(building, texture) {
    const name = building?.extraData?.name || '';
    const alliance = building?.alliance?.acronym || '';
    const displayName = texture?.displayname || '';
    const fullText = `[${alliance}] ${name}${displayName != "buildings.furnace" ? i18n.t(displayName) : ""}`;

    const spriteMaterial = new THREE.SpriteMaterial({
        transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 999;
    sprite.material.depthTest = false;
    sprite.scale.set(3, 1.7, 1);
    sprite.position.set(
        -building.size.h / 2 + 0.5,
        -building.size.h / 2 + 0.5,
        0
    );


    if (textTextureCache.has(fullText)) {
        sprite.material.map = textTextureCache.get(fullText);
    }
    else {
        const textTexture = await createTextTexture(fullText);
        textTextureCache.set(fullText, textTexture);
        sprite.material.map = textTexture;
    }

    return sprite;
}

export async function attachBuildingText(mesh, building, textureData) {
    const sprite = await createTextSprite(building, textureData);
    mesh.add(sprite);

    window.buildingTextSprites.set(building._id, { sprite, building });
}

export async function updateAllBuildingTexts() {
    const textures = window.buildingTextures;
    if (!textures) return;

    for (const [id, entry] of window.buildingTextSprites.entries()) {
        const { sprite, building } = entry;

        const textureData = textures[building.type];

        const name = building?.extraData?.name || '';
        const alliance = building?.alliance?.acronym || '';
        const displayName = textureData?.displayname || '';

        const fullText = `[${alliance}] ${name}${
            displayName !== "buildings.furnace"
                ? i18n.t(displayName)
                : ""
        }`;

        const newTexture = await createTextTexture(fullText);

        sprite.material.map.dispose();
        sprite.material.map = newTexture;
        sprite.material.needsUpdate = true;
    }
}

i18n.on('languageChanged', updateAllBuildingTexts);