// ============================================
// FISH FRENZY – LEUCHTTURM
// Datei: leuchtturm.js
// ============================================

(() => {
    const THREE = window.THREE;
    const game = window.FishFrenzy;

    if (!THREE || !game || !game.scene) {
        console.error("Three.js oder FishFrenzy wurde nicht gefunden!");
        return;
    }

    const lighthouse = new THREE.Group();

    // Materialien
    const white = new THREE.MeshStandardMaterial({
        color: 0xe8e3d5,
        roughness: 0.85
    });

    const red = new THREE.MeshStandardMaterial({
        color: 0xb8322a,
        roughness: 0.75
    });

    const dark = new THREE.MeshStandardMaterial({
        color: 0x30363a,
        roughness: 0.8
    });

    const black = new THREE.MeshStandardMaterial({
        color: 0x171d22,
        roughness: 0.7
    });

    const glass = new THREE.MeshStandardMaterial({
        color: 0xffd66b,
        emissive: 0xffa500,
        emissiveIntensity: 1.5,
        roughness: 0.2
    });

    const brown = new THREE.MeshStandardMaterial({
        color: 0x60351f,
        roughness: 0.9
    });

    const gold = new THREE.MeshStandardMaterial({
        color: 0xd9a441,
        metalness: 0.65,
        roughness: 0.3
    });

    // Hilfsfunktion
    function addMesh(geometry, material, x, y, z) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        lighthouse.add(mesh);
        return mesh;
    }

    // ============================================
    // FUNDAMENT
    // ============================================

    addMesh(
        new THREE.CylinderGeometry(1.25, 1.4, 0.5, 12),
        dark,
        0, 0.25, 0
    );

    addMesh(
        new THREE.CylinderGeometry(1.05, 1.2, 0.25, 12),
        red,
        0, 0.62, 0
    );

    // ============================================
    // LEUCHTTURM-SCHAFT
    // ============================================

    addMesh(
        new THREE.CylinderGeometry(0.62, 0.95, 4.8, 12),
        white,
        0, 3.1, 0
    );

    // Roter Streifen unten
    addMesh(
        new THREE.CylinderGeometry(0.87, 0.94, 0.35, 12),
        red,
        0, 1.2, 0
    );

    // Roter Streifen oben
    addMesh(
        new THREE.CylinderGeometry(0.65, 0.69, 0.35, 12),
        red,
        0, 4.5, 0
    );

    // ============================================
    // FENSTER
    // ============================================

    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;

        const x = Math.sin(angle) * 0.78;
        const z = Math.cos(angle) * 0.78;

        const windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.45, 0.08),
            black
        );

        windowMesh.position.set(x, 3.2, z);
        windowMesh.lookAt(0, 3.2, 0);
        lighthouse.add(windowMesh);
    }

    // ============================================
    // GESCHLOSSENE TÜR
    // ============================================

    // Tür selbst
    addMesh(
        new THREE.BoxGeometry(0.68, 1.45, 0.12),
        brown,
        0, 1.35, 0.91
    );

    // Linker Türrahmen
    addMesh(
        new THREE.BoxGeometry(0.12, 1.65, 0.18),
        dark,
        -0.4, 1.4, 0.91
    );

    // Rechter Türrahmen
    addMesh(
        new THREE.BoxGeometry(0.12, 1.65, 0.18),
        dark,
        0.4, 1.4, 0.91
    );

    // Oberer Türrahmen
    addMesh(
        new THREE.BoxGeometry(0.9, 0.13, 0.18),
        dark,
        0, 2.23, 0.91
    );

    // Türgriff
    addMesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        gold,
        0.22, 1.4, 1.0
    );

    // Türschloss
    addMesh(
        new THREE.BoxGeometry(0.12, 0.18, 0.04),
        gold,
        0.22, 1.2, 1.0
    );

    // ============================================
    // LATERNE OBEN
    // ============================================

    addMesh(
        new THREE.CylinderGeometry(0.7, 0.65, 0.25, 12),
        dark,
        0, 5.55, 0
    );

    addMesh(
        new THREE.CylinderGeometry(0.58, 0.58, 0.85, 8),
        glass,
        0, 6.1, 0
    );

    // Dunkle Fensterstreben
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;

        const x = Math.sin(angle) * 0.58;
        const z = Math.cos(angle) * 0.58;

        addMesh(
            new THREE.BoxGeometry(0.07, 0.95, 0.07),
            dark,
            x, 6.1, z
        );
    }

    // Dachplatte
    addMesh(
        new THREE.CylinderGeometry(0.85, 0.72, 0.2, 12),
        dark,
        0, 6.62, 0
    );

    // Rotes Dach
    addMesh(
        new THREE.ConeGeometry(0.85, 0.9, 12),
        red,
        0, 7.15, 0
    );

    // Spitze
    addMesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        gold,
        0, 7.65, 0
    );

    // ============================================
    // LICHT
    // ============================================

    const light = new THREE.PointLight(
        0xffc85c,
        2.5,
        16
    );

    light.position.set(0, 6.1, 0);
    lighthouse.add(light);

    // ============================================
    // POSITION AUF DER INSEL
    // ============================================

    lighthouse.position.set(2, 0.5, -2);
    lighthouse.scale.setScalar(0.75);

    game.scene.add(lighthouse);

    game.lighthouse = lighthouse;

    console.log("Leuchtturm erfolgreich geladen!");
})();
