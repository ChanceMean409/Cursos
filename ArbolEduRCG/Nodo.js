// Alfabeto español para ordenar letras incluyendo la Ñ
const ALFABETO_ESP = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

// Paleta de colores para asignar al azar a cada nodo
const PALETA_COLORES_NODOS = [
    { relleno: '#0284c7', borde: '#38bdf8' },
    { relleno: '#e11d48', borde: '#fb7185' },
    { relleno: '#059669', borde: '#34d399' },
    { relleno: '#d97706', borde: '#fbbf24' },
    { relleno: '#7c3aed', borde: '#a78bfa' },
    { relleno: '#0d9488', borde: '#2dd4bf' },
    { relleno: '#ea580c', borde: '#fb923c' },
    { relleno: '#4f46e5', borde: '#818cf8' },
    { relleno: '#c026d3', borde: '#e879f9' },
    { relleno: '#16a34a', borde: '#4ade80' },
    { relleno: '#dc2626', borde: '#f87171' },
    { relleno: '#2563eb', borde: '#60a5fa' }
];

// Clase que representa cada nodo individual del árbol
class Nodo {
    constructor(dato) {
        this.dato = String(dato).trim();
        this.izquierdo = null;
        this.derecho = null;
        this.lx = 0;
        this.ly = 0;
        this.x = 0;
        this.y = 0;

        // Selecciona un color aleatorio de la paleta para este nodo
        const indiceAleatorio = Math.floor(Math.random() * PALETA_COLORES_NODOS.length);
        this.color = PALETA_COLORES_NODOS[indiceAleatorio];
    }
}