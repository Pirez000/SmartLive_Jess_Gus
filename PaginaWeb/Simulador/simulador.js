document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn-validar');
    const resultadoDiv = document.getElementById('resultado');
    const descripcion = document.getElementById('descripcion-proyecto');

    btn.addEventListener('click', () => {
        const tipo = document.getElementById('tipo-proyecto').value;
        const texto = descripcion.value.trim();

        if (texto.length < 10) {
            alert("Por favor, describe un poco más tu idea para poder validarla.");
            return;
        }

        let plazo = "";
        let diagnostico = "";

        switch(tipo) {
            case 'web':
                plazo = "2 a 4 semanas";
                diagnostico = "Es totalmente viable. Disponemos de frameworks modernos para acelerar el desarrollo de tu plataforma.";
                break;
            case 'app':
                plazo = "2 a 4 meses";
                diagnostico = "Proyecto viable. Requiere diseño de interfaz (UI/UX) y desarrollo de backend seguro.";
                break;
            case 'robotica':
                plazo = "3 a 6 meses";
                diagnostico = "Reto aceptado. Contamos con ingenieros especializados en integración de hardware e IA.";
                break;
            case 'impresion3d':
                plazo = "3 a 7 días";
                diagnostico = "Viable de inmediato. Podemos comenzar con el modelado en cuanto recibamos los planos.";
                break;
        }

        // Mostrar resultados
        document.getElementById('res-plazo').innerText = plazo;
        document.getElementById('res-diagnostico').innerText = diagnostico;

        resultadoDiv.style.display = 'block';
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    });
});