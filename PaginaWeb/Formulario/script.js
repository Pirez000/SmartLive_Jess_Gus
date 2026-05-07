document.getElementById('formulario-datos').addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('campo-nombre').value;
    const terminos = document.getElementById('acepto-terminos').checked;

    if(!terminos) {
        alert("Debes aceptar los términos.");
        return;
    }

    alert("Gracias " + nombre + ", hemos recibido tu mensaje.");
    this.reset();
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