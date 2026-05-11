document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERENCIAS DE ELEMENTOS
    const contactForm = document.getElementById('contact-form');
    const columnas = document.querySelectorAll('.columna');

    // 2. EFECTO DE ENTRADA (FADE IN)
    // Hacemos que las tres partes de la tarjeta aparezcan una tras otra
    columnas.forEach((col, index) => {
        col.style.opacity = '0';
        col.style.transform = 'translateY(20px)';
        col.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            col.style.opacity = '1';
            col.style.transform = 'translateY(0)';
        }, 200 * index);
    });

    // 3. LÓGICA DEL FORMULARIO
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.boton-envio');
            const originalText = btn.innerText;

            // Estado: Enviando
            btn.innerText = 'TRANSMITIENDO...';
            btn.style.pointerEvents = 'none';
            btn.style.background = '#2c3e50'; // Color oscuro para feedback de carga

            // Simulamos una petición al servidor
            setTimeout(() => {
                // Estado: Éxito
                btn.innerText = 'SEÑAL RECIBIDA';
                btn.style.background = '#5ab9c1';
                btn.style.boxShadow = '0 0 20px rgba(90, 185, 193, 0.4)';
                
                // Limpiar el formulario
                contactForm.reset();

                // Volver al estado original después de 3 segundos
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.pointerEvents = 'all';
                    btn.style.boxShadow = 'none';
                }, 3000);

            }, 1500);
        });
    }

    // 4. EXTRA: EFECTO PARALLAX SUTIL EN EL MAPA
    const mapaCol = document.querySelector('.mapa');
    if (mapaCol) {
        mapaCol.addEventListener('mousemove', (e) => {
            const iframe = mapaCol.querySelector('iframe');
            const x = (window.innerWidth / 2 - e.pageX) / 100;
            const y = (window.innerHeight / 2 - e.pageY) / 100;
            iframe.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
        });
    }
});