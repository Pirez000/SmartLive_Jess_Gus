/**
 * LogBook FFE - Lógica de Negocio con Colores Dinámicos
 */
const STORAGE_KEY = 'logbook_entradas';
const GOAL_HOURS = 180;

// Obtener colores del CSS para usarlos en JS si es necesario
const style = getComputedStyle(document.documentElement);
const colorPeligro = style.getPropertyValue('--color-peligro').trim() || '#ef4444';
const colorAlerta = style.getPropertyValue('--color-alerta').trim() || '#f59e0b';
const colorExito = style.getPropertyValue('--color-exito').trim() || '#10b981';
const colorSecundario = style.getPropertyValue('--color-secundario').trim() || '#3b82f6';

function getEntries() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al leer LocalStorage:", e);
        return [];
    }
}

function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    const tableBody = document.getElementById('table-body');

    // Inicializar fecha
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }

    if (entryForm) setupRegistrationForm(entryForm);
    if (tableBody) updateHistoryUI();
});

function setupRegistrationForm(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fecha = document.getElementById('fecha').value;
        const horas = parseFloat(document.getElementById('horas').value);
        const tareas = document.getElementById('tareas').value.trim();

        if (!fecha || horas <= 0 || isNaN(horas) || !tareas) {
            showToast("⚠️ Completa los campos correctamente");
            return;
        }

        const currentEntries = getEntries();
        const newEntry = {
            id: 'log_' + Date.now() + Math.floor(Math.random() * 1000),
            fecha,
            horas,
            tareas
        };

        currentEntries.push(newEntry);
        saveEntries(currentEntries);
        
        showToast("✅ Registro guardado");
        form.reset();
        
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
        
        if (document.getElementById('table-body')) updateHistoryUI();
    });
}

function updateHistoryUI() {
    const tableBody = document.getElementById('table-body');
    const totalDisplay = document.getElementById('total-hours-display');
    const goalMsg = document.getElementById('goal-msg');
    const barFill = document.getElementById('progress-bar-fill');
    const percentageText = document.getElementById('progress-percentage');

    if (!tableBody) return;

    const currentEntries = getEntries();
    const total = currentEntries.reduce((sum, e) => sum + parseFloat(e.horas), 0);
    const percent = (total / GOAL_HOURS) * 100;

    // Actualizar Textos
    if (totalDisplay) totalDisplay.innerText = total.toFixed(1);
    if (percentageText) percentageText.innerText = Math.round(percent) + '%';
    
    // Lógica de Colores Dinámica
    let colorActual = colorSecundario;
    if (total >= GOAL_HOURS) {
        colorActual = colorExito;
        if (goalMsg) goalMsg.style.display = 'block';
    } else {
        if (goalMsg) goalMsg.style.display = 'none';
        if (percent < 30) colorActual = colorPeligro;
        else if (percent >= 30 && percent < 75) colorActual = colorAlerta;
        else colorActual = colorSecundario;
    }

    if (barFill) {
        barFill.style.width = Math.min(percent, 100) + '%';
        barFill.style.backgroundColor = colorActual;
    }
    if (totalDisplay) totalDisplay.style.color = colorActual;

    // Renderizar Tabla
    tableBody.innerHTML = '';
    const sorted = [...currentEntries].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (sorted.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 3rem; color: #94a3b8;">No se han encontrado registros</td></tr>';
    } else {
        sorted.forEach(entry => {
            const row = document.createElement('tr');
            const [y, m, d] = entry.fecha.split('-');
            row.innerHTML = `
                <td style="font-weight: 700; color: var(--color-primario);">${d}/${m}/${y}</td>
                <td style="color: #475569; font-size: 0.9rem;">${entry.tareas}</td>
                <td class="text-center"><span style="background: #f1f5f9; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-weight: 800;">${entry.horas}h</span></td>
                <td class="text-right">
                    <button class="btn-delete" onclick="deleteEntry('${entry.id}')">Borrar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

window.deleteEntry = function(id) {
    if (confirm("¿Estás seguro de que quieres borrar este registro diario?")) {
        const entries = getEntries();
        const updatedEntries = entries.filter(item => item.id !== id);
        saveEntries(updatedEntries);
        updateHistoryUI();
        showToast("Registro eliminado");
    }
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2500);
}