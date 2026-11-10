// Alfabeto español para ordenar letras incluyendo la Ñ
const ALFABETO_ESP = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

// Paleta de colores variados para que cada nodo tenga un color distinto
const PALETA_COLORES_NODOS = [
    { relleno: '#0284c7', borde: '#38bdf8' }, // Azul cielo
    { relleno: '#e11d48', borde: '#fb7185' }, // Rosa intenso
    { relleno: '#059669', borde: '#34d399' }, // Esmeralda
    { relleno: '#d97706', borde: '#fbbf24' }, // Ámbar
    { relleno: '#7c3aed', borde: '#a78bfa' }, // Violeta
    { relleno: '#0d9488', borde: '#2dd4bf' }, // Turquesa
    { relleno: '#ea580c', borde: '#fb923c' }, // Naranja
    { relleno: '#4f46e5', borde: '#818cf8' }, // Índigo
    { relleno: '#c026d3', borde: '#e879f9' }, // Fucsia
    { relleno: '#16a34a', borde: '#4ade80' }, // Verde lima
    { relleno: '#dc2626', borde: '#f87171' }, // Rojo
    { relleno: '#2563eb', borde: '#60a5fa' }  // Azul real
];

let contadorColorNodo = 0;

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

        // Asigna un color distinto de la paleta a cada nodo creado
        this.color = PALETA_COLORES_NODOS[contadorColorNodo % PALETA_COLORES_NODOS.length];
        contadorColorNodo++;
    }
}