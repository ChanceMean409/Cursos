// Clase que administra la lógica y operaciones del Árbol Binario de Búsqueda
class ArbolBinario {
    constructor(tipo = 'NUMEROS') {
        this.raiz = null;
        this.tipo = tipo;
    }

    // Compara dos valores: devuelve -1 si a < b, 1 si a > b, y 0 si son iguales
    comparar(a, b) {
        if (this.tipo === 'NUMEROS') {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (numA < numB) return -1;
            if (numA > numB) return 1;
            return 0;
        } else {
            const letraA = String(a).toUpperCase();
            const letraB = String(b).toUpperCase();
            const idxA = ALFABETO_ESP.indexOf(letraA);
            const idxB = ALFABETO_ESP.indexOf(letraB);
            if (idxA !== -1 && idxB !== -1) {
                if (idxA < idxB) return -1;
                if (idxA > idxB) return 1;
                return 0;
            }
            return letraA.localeCompare(letraB);
        }
    }

    // Calcula la cantidad de niveles desde la raíz hasta la hoja más lejana
    obtenerAltura(nodo = this.raiz) {
        if (nodo === null) return 0;
        return 1 + Math.max(this.obtenerAltura(nodo.izquierdo), this.obtenerAltura(nodo.derecho));
    }

    // Devuelve el nivel máximo del árbol (contando la Raíz desde Nivel 1)
    // Nota: Si tu maestra cuenta la Raíz como Nivel 0, cambia esta línea a: return this.obtenerAltura(this.raiz) - 1;
    obtenerNivelMaximo() {
        if (this.raiz === null) return 0;
        return this.obtenerAltura(this.raiz);
    }

    // Obtiene el grado del árbol (máximo de hijos directos que tiene un nodo: 0, 1 o 2)
    obtenerGrado(nodo = this.raiz) {
        if (nodo === null) return 0;
        let hijosActual = 0;
        if (nodo.izquierdo !== null) hijosActual++;
        if (nodo.derecho !== null) hijosActual++;
        return Math.max(
            hijosActual,
            this.obtenerGrado(nodo.izquierdo),
            this.obtenerGrado(nodo.derecho)
        );
    }

    // Devuelve el Orden del árbol (en un árbol binario por definición siempre es 2)
    obtenerOrden() {
        if (this.raiz === null) return 0;
        return 2;
    }

    // Cuenta la cantidad total de nodos (Peso del árbol)
    obtenerTotalNodos(nodo = this.raiz) {
        if (nodo === null) return 0;
        return 1 + this.obtenerTotalNodos(nodo.izquierdo) + this.obtenerTotalNodos(nodo.derecho);
    }

    // Inserta un nodo y guarda cada paso recorrido para animar la flecha
    insertarConPasos(valor) {
        const pasos = [];
        if (this.raiz === null) {
            this.raiz = new Nodo(valor);
            pasos.push({
                nodo: this.raiz,
                mensaje: `Árbol vacío. Se inserta '${valor}' como Nodo Raíz.`,
                consola: valor,
                procesar: true,
                etiqueta: 'NUEVA RAÍZ'
            });
            return pasos;
        }

        let actual = this.raiz;
        while (true) {
            const cmp = this.comparar(valor, actual.dato);

            if (cmp < 0) {
                pasos.push({
                    nodo: actual,
                    mensaje: `Comparando '${valor}' < '${actual.dato}' ➔ La flecha baja a la IZQUIERDA`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'ES MENOR (IZQ)'
                });
                if (actual.izquierdo === null) {
                    actual.izquierdo = new Nodo(valor);
                    pasos.push({
                        nodo: actual.izquierdo,
                        mensaje: `¡Posición encontrada! Se inserta '${valor}' a la izquierda de '${actual.dato}'.`,
                        consola: valor,
                        procesar: true,
                        etiqueta: 'INSERTADO'
                    });
                    break;
                }
                actual = actual.izquierdo;
            } else {
                const esRepetido = (cmp === 0);
                const rolNodo = (actual === this.raiz)
                    ? 'la Raíz'
                    : ((actual.izquierdo === null && actual.derecho === null) ? 'una Hoja' : 'un Padre');

                pasos.push({
                    nodo: actual,
                    mensaje: esRepetido
                        ? `Valor repetido '${valor}' en ${rolNodo} '${actual.dato}' ➔ Baja a la DERECHA`
                        : `Comparando '${valor}' > '${actual.dato}' ➔ La flecha baja a la DERECHA`,
                    consola: null,
                    procesar: false,
                    etiqueta: esRepetido ? 'IGUAL (DER)' : 'ES MAYOR (DER)'
                });

                if (actual.derecho === null) {
                    actual.derecho = new Nodo(valor);
                    pasos.push({
                        nodo: actual.derecho,
                        mensaje: esRepetido
                            ? `¡Posición encontrada! Se inserta el repetido '${valor}' a la derecha de '${actual.dato}'.`
                            : `¡Posición encontrada! Se inserta '${valor}' a la derecha de '${actual.dato}'.`,
                        consola: valor,
                        procesar: true,
                        etiqueta: 'INSERTADO'
                    });
                    break;
                }
                actual = actual.derecho;
            }
        }
        return pasos;
    }

    // Busca un valor desde la raíz y guarda la ruta recorrida
    buscarConPasos(valor) {
        const pasos = [];
        let actual = this.raiz;

        while (actual !== null) {
            const cmp = this.comparar(valor, actual.dato);
            if (cmp === 0) {
                pasos.push({
                    nodo: actual,
                    mensaje: `¡Elemento '${valor}' ENCONTRADO en este nodo!`,
                    consola: valor,
                    encontrado: true,
                    procesar: true,
                    etiqueta: '¡ENCONTRADO!'
                });
                return pasos;
            } else if (cmp < 0) {
                pasos.push({
                    nodo: actual,
                    mensaje: `Buscando '${valor}': es menor que '${actual.dato}' ➔ Camino IZQUIERDO`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'BUSCANDO (IZQ)'
                });
                actual = actual.izquierdo;
            } else {
                pasos.push({
                    nodo: actual,
                    mensaje: `Buscando '${valor}': es mayor que '${actual.dato}' ➔ Camino DERECHO`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'BUSCANDO (DER)'
                });
                actual = actual.derecho;
            }
        }

        pasos.push({
            nodo: null,
            mensaje: `Búsqueda finalizada: El elemento '${valor}' NO existe en el árbol.`,
            consola: null,
            encontrado: false,
            procesar: false,
            etiqueta: 'NO ENCONTRADO'
        });
        return pasos;
    }

    // Inicia la eliminación de un nodo por su valor
    eliminar(valor) {
        this.raiz = this._eliminarRecursivo(this.raiz, valor);
    }

    // Busca el nodo a eliminar y reestructura los enlaces
    _eliminarRecursivo(nodoActual, valor) {
        if (nodoActual === null) return null;

        const cmp = this.comparar(valor, nodoActual.dato);
        if (cmp < 0) {
            nodoActual.izquierdo = this._eliminarRecursivo(nodoActual.izquierdo, valor);
        } else if (cmp > 0) {
            nodoActual.derecho = this._eliminarRecursivo(nodoActual.derecho, valor);
        } else {
            if (nodoActual.izquierdo === null) return nodoActual.derecho;
            if (nodoActual.derecho === null) return nodoActual.izquierdo;

            let sucesor = this._encontrarMinimo(nodoActual.derecho);
            nodoActual.dato = sucesor.dato;
            nodoActual.derecho = this._eliminarRecursivo(nodoActual.derecho, sucesor.dato);
        }
        return nodoActual;
    }

    // Encuentra el nodo más a la izquierda de un subárbol
    _encontrarMinimo(nodo) {
        while (nodo.izquierdo !== null) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    // Genera la lista de pasos para el recorrido Preorden
    obtenerPasosPreorden() {
        const pasos = [];
        this._preorden(this.raiz, pasos);
        return pasos;
    }

    _preorden(nodo, pasos) {
        if (nodo === null) return;

        pasos.push({
            nodo: nodo,
            mensaje: `Preorden (Raíz ➔ Izq ➔ Der): La flecha visita e imprime '${nodo.dato}'`,
            consola: nodo.dato,
            procesar: true,
            etiqueta: `IMPRIME: ${nodo.dato}`
        });

        if (nodo.izquierdo !== null) {
            this._preorden(nodo.izquierdo, pasos);
            pasos.push({
                nodo: nodo,
                mensaje: `Recursividad: Terminó rama izquierda, la flecha regresa al padre '${nodo.dato}'`,
                consola: null,
                procesar: false,
                etiqueta: 'REGRESANDO'
            });
        }

        if (nodo.derecho !== null) {
            this._preorden(nodo.derecho, pasos);
            pasos.push({
                nodo: nodo,
                mensaje: `Recursividad: Terminó rama derecha, la flecha regresa al padre '${nodo.dato}'`,
                consola: null,
                procesar: false,
                etiqueta: 'REGRESANDO'
            });
        }
    }

    // Genera la lista de pasos para el recorrido Inorden
    obtenerPasosInorden() {
        const pasos = [];
        this._inorden(this.raiz, pasos);
        return pasos;
    }

    _inorden(nodo, pasos) {
        if (nodo === null) return;

        if (nodo.izquierdo !== null) {
            pasos.push({
                nodo: nodo,
                mensaje: `Recursividad Inorden: La flecha pasa por '${nodo.dato}' y baja primero a su IZQUIERDA`,
                consola: null,
                procesar: false,
                etiqueta: 'BAJANDO IZQ'
            });
            this._inorden(nodo.izquierdo, pasos);
        }

        pasos.push({
            nodo: nodo,
            mensaje: `Inorden (Izq ➔ Raíz ➔ Der): La flecha visita e imprime '${nodo.dato}'`,
            consola: nodo.dato,
            procesar: true,
            etiqueta: `IMPRIME: ${nodo.dato}`
        });

        if (nodo.derecho !== null) {
            this._inorden(nodo.derecho, pasos);
            pasos.push({
                nodo: nodo,
                mensaje: `Recursividad Inorden: Terminó rama derecha, la flecha regresa al padre '${nodo.dato}'`,
                consola: null,
                procesar: false,
                etiqueta: 'REGRESANDO'
            });
        }
    }

    // Genera la lista de pasos para el recorrido Postorden
    obtenerPasosPostorden() {
        const pasos = [];
        this._postorden(this.raiz, pasos);
        return pasos;
    }

    _postorden(nodo, pasos) {
        if (nodo === null) return;

        if (nodo.izquierdo !== null || nodo.derecho !== null) {
            pasos.push({
                nodo: nodo,
                mensaje: `Recursividad Postorden: La flecha llega a '${nodo.dato}' y explora primero sus hijos`,
                consola: null,
                procesar: false,
                etiqueta: 'EXPLORANDO'
            });
        }

        if (nodo.izquierdo !== null) {
            this._postorden(nodo.izquierdo, pasos);
            if (nodo.derecho !== null) {
                pasos.push({
                    nodo: nodo,
                    mensaje: `Recursividad Postorden: La flecha regresa a '${nodo.dato}' para bajar ahora a la DERECHA`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'REGRESANDO'
                });
            }
        }

        if (nodo.derecho !== null) {
            this._postorden(nodo.derecho, pasos);
        }

        pasos.push({
            nodo: nodo,
            mensaje: `Postorden (Izq ➔ Der ➔ Raíz): La flecha termina hijos e imprime '${nodo.dato}'`,
            consola: nodo.dato,
            procesar: true,
            etiqueta: `IMPRIME: ${nodo.dato}`
        });
    }
}