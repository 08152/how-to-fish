// ================================================
// FISH FRENZY - INSEL.JS
// REINE LOW-POLY-STEININSEL
// DURCHMESSER: CA. 15 METER
// ================================================

(() => {
    const THREE = window.THREE;
    const container = document.getElementById("game");

    if (!THREE || !container) {
        console.error("Three.js oder Game-Container fehlt!");
        return;
    }

    // ================================================
    // SZENE
    // ================================================

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );

    camera.position.set(19, 15, 21);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // ================================================
    // LICHT
    // ================================================

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x55545a,
            2.0
        )
    );

    const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunlight.position.set(-20, 30, 20);
    sunlight.castShadow = true;
    scene.add(sunlight);

    // ================================================
    // INSEL-KONFIGURATION
    // ================================================

    const CONFIG = {
        radius: 7.5,
        segments: 40,
        rings: 16,
        rockDepth: 3.5
    };

    // Deterministisches Rauschen
    function noise(x, z) {
        return (
            Math.sin(x * 1.7 + z * 0.8) * 0.32 +
            Math.cos(z * 1.4 - x * 0.9) * 0.25 +
            Math.sin(x * 2.8 + z * 2.1) * 0.12
        );
    }

    function getRadius(angle) {
        return CONFIG.radius
            + Math.sin(angle * 3) * 0.45
            + Math.cos(angle * 5) * 0.35
            + Math.sin(angle * 9) * 0.18;
    }

    function getHeight(x, z, factor) {
        const hill1 =
            Math.exp(-((x + 2) ** 2 + (z + 1) ** 2) / 8) * 2.2;

        const hill2 =
            Math.exp(-((x - 2) ** 2 + (z - 1) ** 2) / 7) * 1.5;

        const hill3 =
            Math.exp(-((x + 1) ** 2 + (z - 3) ** 2) / 5) * 1.0;

        return 0.8 + hill1 + hill2 + hill3
            + noise(x, z) * 0.5
            - factor * 0.5;
    }

    // ================================================
    // OBERFLÄCHE
    // ================================================

    const positions = [];
    const colors = [];
    const indices = [];

    for (let r = 0; r <= CONFIG.rings; r++) {
        const factor = r / CONFIG.rings;

        for (let i = 0; i < CONFIG.segments; i++) {
            const angle = i / CONFIG.segments * Math.PI * 2;
            const distance = factor * getRadius(angle);

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = getHeight(x, z, factor);

            positions.push(x, y, z);

            const variation = noise(x, z) * 0.035;

            colors.push(
                0.40 + variation,
                0.40 + variation,
                0.41 + variation
            );
        }
    }

    // Dreiecke
    for (let r = 0; r < CONFIG.rings; r++) {
        for (let i = 0; i < CONFIG.segments; i++) {
            const next = (i + 1) % CONFIG.segments;

            const a = r * CONFIG.segments + i;
            const b = r * CONFIG.segments + next;
            const c = (r + 1) * CONFIG.segments + i;
            const d = (r + 1) * CONFIG.segments + next;

            indices.push(a, c, b);
            indices.push(b, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 1,
        flatShading: true,
        side: THREE.DoubleSide
    });

    const island = new THREE.Mesh(geometry, surfaceMaterial);
    island.castShadow = true;
    island.receiveShadow = true;

    scene.add(island);

    // ================================================
    // FELSIGER UNTERBAU
    // ================================================

    const rockGeometry = new THREE.CylinderGeometry(
        7.3,
        6.5,
        CONFIG.rockDepth,
        40,
        4,
        false
    );

    // Seitenflächen leicht unregelmäßig machen
    const rockPositions = rockGeometry.attributes.position;

    for (let i = 0; i < rockPositions.count; i++) {
        const x = rockPositions.getX(i);
        const y = rockPositions.getY(i);
        const z = rockPositions.getZ(i);

        rockPositions.setX(
            i,
            x + noise(x, z) * 0.3
        );

        rockPositions.setZ(
            i,
            z + noise(z, x) * 0.3
        );

        rockPositions.setY(
            i,
            y + noise(x, z) * 0.2
        );
    }

    rockPositions.needsUpdate = true;
    rockGeometry.computeVertexNormals();

    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x68696c,
        roughness: 1,
        flatShading: true
    });

    const rockBase = new THREE.Mesh(
        rockGeometry,
        rockMaterial
    );

    rockBase.position.y = -0.9;
    rockBase.castShadow = true;
    rockBase.receiveShadow = true;

    scene.add(rockBase);

    // ================================================
    // ANIMATION
    // ================================================

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

    // ================================================
    // FENSTERGRÖSSE
    // ================================================

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });

    // ================================================
    // SPIELDATEN
    // ================================================

    window.FishFrenzy = window.FishFrenzy || {};

    Object.assign(window.FishFrenzy, {
        scene,
        camera,
        renderer,
        island
    });

    console.log("[INSEL] Steininsel erfolgreich geladen!");

})();
