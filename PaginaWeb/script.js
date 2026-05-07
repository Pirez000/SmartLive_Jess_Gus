window.abrirFAQ = function(button) {
    const item = button.parentElement;
    const respuesta = button.nextElementSibling;
    if (item.classList.contains('activo')) {
        item.classList.remove('activo');
        respuesta.style.maxHeight = null;
    } else {
        document.querySelectorAll('.faq-item').forEach(el => {
            el.classList.remove('activo');
            el.querySelector('.faq-respuesta').style.maxHeight = null;
        });
        item.classList.add('activo');
        respuesta.style.maxHeight = respuesta.scrollHeight + "px";
    }
}

window.irASeccion = function(rutaRelativa, nombre) {
    const zonaMsj = document.getElementById('zona-mensajes');
    const msj = document.createElement('div');
    msj.className = "mensaje-bot";
    msj.innerText = "Abriendo " + nombre + "...";
    zonaMsj.appendChild(msj);
    zonaMsj.scrollTop = zonaMsj.scrollHeight;
    setTimeout(() => {
        document.getElementById('ventana-chat').style.display = "none";
        window.location.href = rutaRelativa;
    }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INICIALIZAR CARRUSEL
    const track = document.getElementById('track');
    if(track) track.style.transform = "translateX(0px)";

    // 2. ASISTENTE DE CHAT
    const botonFlotante = document.getElementById('boton-flotante');
    const ventana = document.getElementById('ventana-chat');
    const btnCerrar = document.getElementById('boton-cerrar');
    const zonaMsj = document.getElementById('zona-mensajes');
    const escribiendo = document.getElementById('indicador-escribiendo');
    let yaIniciado = false;

    if (botonFlotante) {
        botonFlotante.addEventListener('click', () => {
            ventana.style.display = (ventana.style.display === "none" || ventana.style.display === "") ? "flex" : "none";
            if (!yaIniciado && ventana.style.display === "flex") {
                escribiendo.style.display = "block";
                setTimeout(() => {
                    escribiendo.style.display = "none";
                    const msj = document.createElement('div');
                    msj.className = "mensaje-bot";
                    msj.innerText = "Hola, soy tu asistente de Smartlive, ¿qué desea?";
                    zonaMsj.appendChild(msj);
                }, 1000);
                yaIniciado = true;
            }
        });
    }
    if (btnCerrar) btnCerrar.addEventListener('click', () => ventana.style.display = "none");

    // 3. CONTADORES ANIMADOS
    const contadores = document.querySelectorAll('.numero');
    const animarContador = (elemento) => {
        const span = elemento.querySelector('.valor-variable');
        const meta = parseInt(elemento.getAttribute('data-meta'));
        let actual = 0;
        const incremento = meta / 100; 
        const actualizar = () => {
            actual += incremento;
            if (actual < meta) {
                span.innerText = Math.ceil(actual);  
                requestAnimationFrame(actualizar);
            } else {
                span.innerText = meta; 
            }
        };
        actualizar();
    };

    const observerContadores = new IntersectionObserver((entradas) => {
        entradas.forEach(ent => {
            if (ent.isIntersecting) {
                animarContador(ent.target);
                observerContadores.unobserve(ent.target); 
            }
        });
    }, { threshold: 0.5 });
    contadores.forEach(c => observerContadores.observe(c));

    // 4. THREE.JS
    const container = document.getElementById('canvas-container');
    if (container) {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.03; 
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4; 


        const colorCianBase = new THREE.Color(0x5ab9c1); 
        const colorAzulProfundo = new THREE.Color(0x0055ff); 
        const colorBrilloNeon = new THREE.Color(0x00d2ff); 
        const colorSombra = new THREE.Color(0x0a1a1c); 

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        const coreGeo = new THREE.IcosahedronGeometry(2.1, 2); 
        const coreMat = new THREE.MeshStandardMaterial({
            color: colorSombra,
            emissive: colorAzulProfundo,
            emissiveIntensity: 2.5,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
            metalness: 1,
            roughness: 0
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        mainGroup.add(coreMesh);

        const innerGeo = new THREE.IcosahedronGeometry(1.5, 4);
        const innerMat = new THREE.MeshBasicMaterial({
            color: colorBrilloNeon,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        mainGroup.add(innerMesh);

        const partCount = 2000; 
        const partGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(partCount * 3);
        const scales = new Float32Array(partCount);

        for (let i = 0; i < partCount; i++) {
            const i3 = i * 3;
            const r = 1.9 + Math.random() * 0.4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            scales[i] = Math.random();
        }

        partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const partMat = new THREE.PointsMaterial({
            size: 0.03,
            color: colorBrilloNeon,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(partGeo, partMat);
        mainGroup.add(particles);

        const pointLight = new THREE.PointLight(colorBrilloNeon, 5, 15);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 5, 0);
        scene.add(topLight);

        const clock = new THREE.Clock();

        function animate() {
            const time = clock.getElapsedTime();
            
            coreMesh.rotation.y += 0.002;
            innerMesh.rotation.y -= 0.003;
            particles.rotation.y += 0.0015;

            const breathe = 1 + Math.sin(time * 0.6) * 0.04;
            mainGroup.scale.set(breathe, breathe, breathe);

            const glowIntensity = 1.5 + Math.sin(time * 0.8) * 0.8;
            coreMat.emissiveIntensity = glowIntensity;
            pointLight.intensity = 4 + Math.sin(time * 0.8) * 2;

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
});