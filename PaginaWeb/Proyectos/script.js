const tarjetas = document.querySelectorAll('.tarjeta-interactiva');

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('mousemove', (e) => {
        const rect = tarjeta.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centroX = rect.width / 2;
        const centroY = rect.height / 2;

        const rotX = (y - centroY) / 25;
        const rotY = (centroX - x) / 25;

        tarjeta.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
    });

    tarjeta.addEventListener('mouseleave', () => {
        tarjeta.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });

    tarjeta.addEventListener('click', () => {
        console.log("Has seleccionado un proyecto de Smart Live");
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const botonFlotante = document.getElementById('boton-flotante');
    const ventana = document.getElementById('ventana-chat');
    const btnCerrar = document.getElementById('boton-cerrar');
    const zonaMsj = document.getElementById('zona-mensajes');
    const escribiendo = document.getElementById('indicador-escribiendo');
    
    let yaIniciado = false;

    function alternar() {
        if (ventana.style.display === "none") {
            ventana.style.display = "flex";
            if (!yaIniciado) {
                lanzarBienvenida();
                yaIniciado = true;
            }
        } else {
            ventana.style.display = "none";
        }
    }

    botonFlotante.addEventListener('click', alternar);
    btnCerrar.addEventListener('click', alternar);

    function lanzarBienvenida() {
        escribiendo.style.display = "block";
        setTimeout(() => {
            escribiendo.style.display = "none";
            const msj = document.createElement('div');
            msj.className = "mensaje-bot";
            msj.innerText = "Hola, soy tu asistente de Smartlive, ¿qué desea?";
            zonaMsj.appendChild(msj);
        }, 1000);
    }
});

function irASeccion(rutaRelativa, nombre) {
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