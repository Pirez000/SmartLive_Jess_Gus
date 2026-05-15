let escena, camara, render, particulas;

// 1. INICIALIZAR THREE.JS
function iniciar3D() {
    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.z = 5;

    render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    render.setSize(window.innerWidth, window.innerHeight);
    render.setPixelRatio(window.devicePixelRatio);
    
    const bgContainer = document.getElementById('fondo-3d');
    if (bgContainer) bgContainer.appendChild(render.domElement);

    const geometria = new THREE.BufferGeometry();
    const posArray = new Float32Array(3000 * 3);
    for(let i = 0; i < 3000 * 3; i++) posArray[i] = (Math.random() - 0.5) * 20;

    geometria.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x5ab9c1,
        transparent: true,
        opacity: 0.6
    });

    particulas = new THREE.Points(geometria, material);
    escena.add(particulas);
    animar();
}

function animar() {
    requestAnimationFrame(animar);
    if(particulas) particulas.rotation.y += 0.001;
    render.render(escena, camara);
}

// 2. LÓGICA DE SCROLL UNIFICADA
window.onload = () => {
    iniciar3D();

    const mainScroll = document.getElementById('contenedor-principal');
    const visualizador3D = document.getElementById('fondo-3d');
    
    // Referencias de Secciones
    const pista = document.querySelector('.pista-cartas');
    const seccionAyuda = document.querySelector('.contenedor-horizontal-bloqueado');
    const seccionContacto = document.getElementById('contacto');
    const contenidoAnimadoContacto = document.querySelector('.animar-entrada');
    const seccionRotador = document.getElementById('especialidades-circulo');
    const anillo = document.querySelector('.anillo-especialidades');
    const detalles = document.querySelectorAll('.detalle');
    const seccionProyectos = document.getElementById('proyectos');
    const itemsProyectos = document.querySelectorAll('.proyecto-item');
    const seccionEquipo = document.getElementById('equipo');
    const cartasEquipo = document.querySelectorAll('.carta-equipo');
    const seccionFaq = document.getElementById('faq');
    const itemsFaq = document.querySelectorAll('.faq-item');
    
    const dots = document.querySelectorAll('.dot');
    const seccionesNav = document.querySelectorAll('section');

    mainScroll.addEventListener('scroll', () => {
        const st = mainScroll.scrollTop;
        const wh = window.innerHeight;

        // A. FONDO 3D (Opacidad dinámica)
        if(visualizador3D) visualizador3D.style.opacity = st > wh * 0.5 ? "0.3" : "1";

        // B. TREN DE CARTAS (AYUDA)
        if (seccionAyuda && pista) {
            const oTop = seccionAyuda.offsetTop;
            const oHeight = seccionAyuda.offsetHeight;
            if (st >= oTop && st <= oTop + (oHeight - wh)) {
                const progreso = (st - oTop) / (oHeight - wh);
                const desplazamientoMax = pista.scrollWidth - (window.innerWidth * 0.8);
                pista.style.transform = `translateX(-${progreso * desplazamientoMax}px)`;
            }
        }

        // C. CONTACTO (Revelado)
        if (seccionContacto && contenidoAnimadoContacto) {
            if (st > seccionContacto.offsetTop - wh * 0.8) {
                contenidoAnimadoContacto.classList.add('revelado');
            } else {
                contenidoAnimadoContacto.classList.remove('revelado');
            }
        }

        // D. RULETA (Especialidades / Núcleo IA)
        if (seccionRotador && anillo) {
            const oTop = seccionRotador.offsetTop;
            const oHeight = seccionRotador.offsetHeight;

            if (st >= oTop && st <= oTop + (oHeight - wh)) {
                const progresoRot = (st - oTop) / (oHeight - wh);
                
                // Rotación suave del anillo
                anillo.style.transform = `rotate(-${progresoRot * 360}deg)`;

                // Efecto Turbo en Three.js (Aumenta según el progreso)
                if(particulas) {
                    particulas.rotation.y += 0.02; 
                    particulas.material.color.setHex(0x00f2ff); // Color cyan eléctrico
                }

                // Sincronización de textos y puntos
                const puntos = document.querySelectorAll('.punto-especialidad');
                const total = detalles.length;
                const indice = Math.min(Math.floor(progresoRot * detalles.length), detalles.length - 1);

                detalles.forEach((det, i) => {
                    if (i === indice) {
                        det.classList.add('activo');
                        if(puntos[i]) puntos[i].classList.add('activo');
                    } else {
                        det.classList.remove('activo');
                        if(puntos[i]) puntos[i].classList.remove('activo');
                    }
                });
            }
        }

        // E. PROYECTOS (Portal Shift)
        if (seccionProyectos) {
            const oTop = seccionProyectos.offsetTop;
            const oHeight = seccionProyectos.offsetHeight;

            if (st >= oTop && st <= oTop + (oHeight - wh)) {
                const progresoProy = (st - oTop) / (oHeight - wh);
                const indiceProy = Math.min(Math.floor(progresoProy * itemsProyectos.length), itemsProyectos.length - 1);

                itemsProyectos.forEach((item, i) => item.classList.toggle('visible', i === indiceProy));
                if(particulas) particulas.material.color.setHex(0xffffff); // Partículas blancas
            } else if (st < oTop) {
                if(particulas) particulas.material.color.setHex(0x5ab9c1); // Reset a azul
            }
        }

        // F. EQUIPO (Revelación en Cascada)
        if (seccionEquipo) {
            const oTop = seccionEquipo.offsetTop;
            if (st > oTop - wh * 0.7) {
                cartasEquipo.forEach((carta, i) => {
                    setTimeout(() => {
                        carta.classList.add('revelada');
                    }, i * 150); 
                });
                if(particulas) particulas.material.color.setHex(0x5ab9c1);
            }
        }

        // G. FAQ (Revelación escalonada)
        if (seccionFaq) {
            const oTop = seccionFaq.offsetTop;
            if (st > oTop - wh * 0.7) {
                itemsFaq.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('revelado');
                    }, i * 200);
                });
            }
        }

        // H. SCROLL DOTS (Navegación lateral)
        seccionesNav.forEach((sec) => {
            const sTop = sec.offsetTop;
            const sHeight = sec.offsetHeight;
            if (st >= sTop - wh / 2 && st < sTop + sHeight - wh / 2) {
                const idActual = sec.getAttribute('id');
                dots.forEach((dot) => {
                    dot.classList.toggle('activo', dot.getAttribute('data-sec') === idActual);
                });
            }
        });
    });

    // Interactividad FAQ (Apertura/Cierre)
    itemsFaq.forEach(item => {
        const pregunta = item.querySelector('.faq-pregunta');
        pregunta.addEventListener('click', () => {
            itemsFaq.forEach(otro => {
                if (otro !== item) otro.classList.remove('abierto');
            });
            item.classList.toggle('abierto');
        });
    });

    // Clic en los puntos de navegación
    dots.forEach(dot => {
        dot.onclick = (e) => {
            e.preventDefault();
            const destino = document.getElementById(dot.getAttribute('data-sec'));
            if (destino) mainScroll.scrollTo({ top: destino.offsetTop, behavior: 'smooth' });
        };
    });
};

// 3. PARALLAX MOUSE EN TÍTULO
document.addEventListener('mousemove', (e) => {
    const titulo = document.querySelector('.titulo-tech');
    if (titulo) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        titulo.style.transform = `translate(${x}px, ${y}px)`;
    }
});

window.addEventListener('resize', () => {
    if(!camara) return;
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    if(render) render.setSize(window.innerWidth, window.innerHeight);
});

