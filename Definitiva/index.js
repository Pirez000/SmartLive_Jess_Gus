/* =================================================
   SMARTLIVE - ESFERA HERO (VERSIÓN ULTRA-ESTABLE)
   ================================================= */

// Usamos window.onload porque es el evento más seguro de todos
window.onload = function() {
    
    const container = document.getElementById('contenedor-esfera');
    
    // Si el div no existe, salimos en silencio para no romper nada
    if (!container) return;

    // 1. Escena y Cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // 2. Renderizador (Alpha para fondo transparente)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 3. Geometría y Material (Igual a tu versión original)
    const geometry = new THREE.IcosahedronGeometry(2.5, 2); 
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x5ab9c1, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.7 
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Variables de movimiento
    let mX = 0, mY = 0, time = 0;

    window.addEventListener('mousemove', (e) => {
        mX = (e.clientX / window.innerWidth) - 0.5;
        mY = (e.clientY / window.innerHeight) - 0.5;
    });

    // 5. Función de Animación (Simple y directa)
    function animate() {
        requestAnimationFrame(animate);
        time += 0.02;

        // Rotación base
        mesh.rotation.y += 0.015;
        mesh.rotation.z += 0.005;

        // Flotación (Levitación)
        mesh.position.y = Math.sin(time * 1.5) * 0.15;
        mesh.position.x = Math.cos(time) * 0.15;

        // Seguimiento del ratón (Lerp suave)
        mesh.rotation.x += (mY * 3.0 - mesh.rotation.x) * 0.1;
        mesh.rotation.y += (mX * 3.0 - mesh.rotation.y) * 0.1;

        renderer.render(scene, camera);
    }

    // 6. Resize (Ajuste de pantalla)
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    // ¡Arrancamos!
    animate();
    console.log("Esfera de SmartLive cargada correctamente.");
};