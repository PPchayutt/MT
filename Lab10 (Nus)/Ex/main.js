function init() {
    const scene = new THREE.Scene();
    const gui = new dat.GUI();

    const sphereMaterial = getMaterial('rgb(255, 245, 245)');
    const planeMaterial = getMaterial('rgb(255, 255, 255)');

    const sphere = getSphere(sphereMaterial, 1, 24);
    const plane = getPlane(planeMaterial, 30);
    const lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');

    const loader = new THREE.TextureLoader();
    sphereMaterial.map = loader.load('/resorce/assets/textures/concrete.jpg');
    planeMaterial.map = loader.load('/resorce/assets/textures/checkerboard.jpg');

    sphere.visible = false;

    const sphereGrid = getSphereGrid(10, 3, sphereMaterial, 1, 24);

    sphere.position.y = sphere.geometry.parameters.radius;
    plane.rotation.x = Math.PI / 2;
    lightLeft.position.set(-5, 4, -4);

    const folder1 = gui.addFolder('light_1');
    folder1.add(lightLeft, 'intensity', 0, 10);
    folder1.add(lightLeft.position, 'x', -10, 10);
    folder1.add(lightLeft.position, 'y', 0, 10);
    folder1.add(lightLeft.position, 'z', -10, 10);

    const folder2 = gui.addFolder('materials');
    folder2.add(sphereMaterial, 'roughness', 0, 1);
    folder2.add(planeMaterial, 'roughness', 0, 1);
    folder2.add(sphereMaterial, 'metalness', 0, 1);
    folder2.add(planeMaterial, 'metalness', 0, 1);
    folder2.open();

    scene.add(sphere);
    scene.add(plane);
    scene.add(lightLeft);
    scene.add(sphereGrid);

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(-2, 7, 7);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    update(renderer, scene, camera, controls);
}

function getSphere(material, size, segments) {
    const geometry = new THREE.SphereGeometry(size, segments, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

function getSphereGrid(amount, separationMultiplier, material, size, segments) {
    const group = new THREE.Group();

    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
          const sphere = getSphere(material, size, segments);
          sphere.position.x = i * separationMultiplier;
          sphere.position.z = j * separationMultiplier;
          sphere.position.y = size;
          group.add(sphere);
        }
    }

    group.position.x = -separationMultiplier * (amount - 1) / 2;
    group.position.z = -separationMultiplier * (amount - 1) / 2;

    return group;
}

function getMaterial(color) {
    return new THREE.MeshStandardMaterial({
        color: color || 'rgb(255, 255, 255)'
    });
}

function getSpotLight(intensity, color) {
    const light = new THREE.SpotLight(color || 'rgb(255, 255, 255)', intensity);
    light.castShadow = true;
    light.penumbra = 0.5;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = 0.001;
    return light;
}

function getPlane(material, size) {
    const geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function update(renderer, scene, camera, controls) {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => update(renderer, scene, camera, controls));
}

init();
