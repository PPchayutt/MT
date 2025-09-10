function init() {
    const scene = new THREE.Scene();
    const gui = new dat.GUI();

    const plane = getPlane(30);
    plane.rotation.x = Math.PI / 2;

    const spotLight = getSpotLight(2);
    spotLight.position.set(0, 4, 0);
    
    const sphere = getSphere(0.05);
    spotLight.add(sphere);

    const boxGrid = getBoxGrid(10, 1.5);

    scene.add(plane);
    scene.add(spotLight);
    scene.add(boxGrid);

    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight.target);

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setClearColor('rgb(120, 120, 120)');
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    gui.add(spotLight, 'intensity', 0, 10).name('Intensity');
    gui.add(spotLight.position, 'x', -20, 20).name('Position X');
    gui.add(spotLight.position, 'y', 0, 20).name('Position Y');
    gui.add(spotLight.position, 'z', -20, 20).name('Position Z');
    gui.add(spotLight, 'angle', 0, Math.PI / 2).name('Angle');
    gui.add(spotLight, 'penumbra', 0, 1).name('Penumbra');

    update(renderer, scene, camera, controls);
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(() => update(renderer, scene, camera, controls));
}

function getBox(w, h, d) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshPhongMaterial({ color: 'rgb(120, 120, 120)' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

function getPlane(size) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function getSpotLight(intensity) {
    const light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.angle = Math.PI / 4;
    light.penumbra = 0.1;
    return light;
}

function getSphere(size) {
    const geometry = new THREE.SphereGeometry(size, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 'rgb(255, 255, 255)' });
    return new THREE.Mesh(geometry, material);
}

function getBoxGrid(amount, separationMultiplier) {
    const group = new THREE.Group();

    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
            const obj = getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.z = j * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            group.add(obj);
        }
    }

    group.position.x = -separationMultiplier * (amount - 1) / 2;
    group.position.z = -separationMultiplier * (amount - 1) / 2;

    return group;
}

function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
        light.castShadow = true;
        light.shadow.bias = 0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
    return light;
}

init();
