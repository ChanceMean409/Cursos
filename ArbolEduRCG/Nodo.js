// Alfabeto español para ordenar letras incluyendo la Ñ
const ALFABETO_ESP = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

// Clase que representa cada nodo individual del árbol
class Nodo {
    constructor(dato) {
        this.dato = String(dato).trim(); // Valor almacenado en el nodo
        this.izquierdo = null;           // Referencia al hijo izquierdo
        this.derecho = null;             // Referencia al hijo derecho
        this.lx = 0;                     // Coordenada X lógica (columna)
        this.ly = 0;                     // Coordenada Y lógica (nivel)
        this.x = 0;                      // Coordenada X real en el canvas
        this.y = 0;                      // Coordenada Y real en el canvas
    }
}