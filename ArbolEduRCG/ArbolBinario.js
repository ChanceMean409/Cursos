/**
 * ============================================================================
 * PARTE 1: MOTOR LÓGICO PROPIO (CERO "EFECTO CAJA NEGRA")
 * Clases Nodo y ArbolBinario implementadas desde cero.
 * ============================================================================
 */

class Nodo {
    constructor(dato) {
        this.dato = String(dato).trim();
        this.izquierdo = null;
        this.derecho = null;
        this.lx = 0;
        this.ly = 0;
        this.x = 0;
        this.y = 0;
    }
}

class ArbolBinario {
    constructor(tipo = 'NUMEROS') {
        this.raiz = null;
        this.tipo = tipo; // 'NUMEROS' o 'LETRAS'
    }

    comparar(a, b) {
        if (this.tipo === 'NUMEROS') {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (numA < numB) return -1;
            if (numA > numB) return 1;
            return 0;
        } else {
            return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
        }
    }

    // ==================== MÉTRICAS DEL ÁRBOL ====================

    obtenerAltura(nodo = this.raiz) {
        if (nodo === null) return 0;
        return 1 + Math.max(this.obtenerAltura(nodo.izquierdo), this.obtenerAltura(nodo.derecho));
    }

    obtenerNivelMaximo() {
        if (this.raiz === null) return 0;
        return this.obtenerAltura(this.raiz) - 1;
    }

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

    obtenerTotalNodos(nodo = this.raiz) {
        if (nodo === null) return 0;
        return 1 + this.obtenerTotalNodos(nodo.izquierdo) + this.obtenerTotalNodos(nodo.derecho);
    }

    // ==================== OPERACIONES CON PASOS ====================

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
            if (cmp === 0) {
                pasos.push({
                    nodo: actual,
                    mensaje: `El valor '${valor}' ya existe en el árbol (no se duplican valores).`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'YA EXISTE'
                });
                break;
            } else if (cmp < 0) {
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
                pasos.push({
                    nodo: actual,
                    mensaje: `Comparando '${valor}' > '${actual.dato}' ➔ La flecha baja a la DERECHA`,
                    consola: null,
                    procesar: false,
                    etiqueta: 'ES MAYOR (DER)'
                });
                if (actual.derecho === null) {
                    actual.derecho = new Nodo(valor);
                    pasos.push({
                        nodo: actual.derecho,
                        mensaje: `¡Posición encontrada! Se inserta '${valor}' a la derecha de '${actual.dato}'.`,
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

    eliminar(valor) {
        this.raiz = this._eliminarRecursivo(this.raiz, valor);
    }

    _eliminarRecursivo(nodoActual, valor) {
        if (nodoActual === null) return null;

        const cmp = this.comparar(valor, nodoActual.dato);
        if (cmp < 0) {
            nodoActual.izquierdo = this._eliminarRecursivo(nodoActual.izquierdo, valor);
        } else if (cmp > 0) {
            nodoActual.derecho = this._eliminarRecursivo(nodoActual.derecho, valor);
        } else {
            if (nodoActual.izquierdo === null) return nodoActual.derecho;
            if (nodoActual.derecho === null) return nodoActual.derecho;

            let sucesor = this._encontrarMinimo(nodoActual.derecho);
            nodoActual.dato = sucesor.dato;
            nodoActual.derecho = this._eliminarRecursivo(nodoActual.derecho, sucesor.dato);
        }
        return nodoActual;
    }

    _encontrarMinimo(nodo) {
        while (nodo.izquierdo !== null) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    // ==================== RECORRIDOS RECURSIVOS ====================

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

/**
 * ============================================================================
 * PARTE 2: SIMULADOR Y POSICIONAMIENTO ANTI-COLISIONES (NÚMEROS Y LETRAS)
 * ============================================================================
 */

let modoActualSimulador = 'NUMEROS';
const arbolSimulador = new ArbolBinario('NUMEROS');
const arbolQuiz = new ArbolBinario('NUMEROS');

let intervaloAnimacion = null;
let nodoPunteroActual = null;
let caminoResaltado = [];
let nodosProcesados = [];

const TIEMPO_PASO_RECORRIDO_MS = 1400;
const TIEMPO_PASO_OPERACION_MS = 1150;

const flechaAnimada = {
    visible: false,
    xActual: 300,
    yActual: 80,
    xDestino: 300,
    yDestino: 80,
    esImpresion: true,
    etiqueta: 'RAÍZ',
    rebote: 0
};

function cambiarModulo(idModulo, botonClickeado) {
    document.querySelectorAll('.modulo').forEach(m => m.classList.remove('activo'));
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('activo'));

    document.getElementById(idModulo).classList.add('activo');
    botonClickeado.classList.add('activo');

    dibujarArbolEnCanvas('canvasSimulador', 'contenedorCanvasSimulador', arbolSimulador, nodoPunteroActual, caminoResaltado, true);
    if (!document.getElementById('quizContenidoActivo').classList.contains('oculto')) {
        dibujarArbolEnCanvas('canvasQuiz', 'contenedorCanvasQuiz', arbolQuiz, null, [], false);
    }
}

function cambiarTipoArbol(nuevoModo) {
    detenerAnimacion();
    limpiarResaltadosSimulador();

    modoActualSimulador = nuevoModo;
    arbolSimulador.tipo = nuevoModo;
    arbolSimulador.raiz = null;

    const btnNum = document.getElementById('btnModoNumeros');
    const btnLet = document.getElementById('btnModoLetras');
    const input = document.getElementById('inputValor');

    if (nuevoModo === 'NUMEROS') {
        btnNum.classList.add('activo');
        btnLet.classList.remove('activo');
        input.placeholder = 'Ingresa un entero (ej. 45)';
        input.maxLength = 5;
        actualizarBanner('Modo Números Enteros activo. Lienzo limpio: ingresa valores o usa "⚡ Ejemplo Rápido".', '#38bdf8');
    } else {
        btnLet.classList.add('activo');
        btnNum.classList.remove('activo');
        input.placeholder = 'Ingresa una letra (ej. m o M)';
        input.maxLength = 1;
        actualizarBanner('Modo Letras activo (convierte a MAYÚSCULAS). Lienzo limpio: ingresa letras o usa "⚡ Ejemplo Rápido".', '#38bdf8');
    }

    input.value = '';
    document.getElementById('consolaSalida').textContent = 'Esperando operaciones en el árbol...';
    actualizarPanelMetricasSimulador();
}

function actualizarPanelMetricasSimulador() {
    document.getElementById('lblGradoArbol').textContent = arbolSimulador.obtenerGrado();
    document.getElementById('lblNivelArbol').textContent = arbolSimulador.obtenerNivelMaximo();
    document.getElementById('lblAlturaArbol').textContent = arbolSimulador.obtenerAltura();
    document.getElementById('lblOrdenArbol').textContent = arbolSimulador.obtenerTotalNodos();
}

function validarYNormalizarEntrada(textoCrudo) {
    const limpio = textoCrudo.trim();
    if (!limpio) {
        actualizarBanner('Escribe un valor antes de continuar.', '#f59e0b');
        return null;
    }

    if (modoActualSimulador === 'NUMEROS') {
        if (limpio.includes('.') || limpio.includes(',')) {
            actualizarBanner('Error: No se permiten decimales. Ingresa únicamente números enteros.', '#ef4444');
            return null;
        }
        if (!/^-?\d+$/.test(limpio)) {
            actualizarBanner('Error: Solo se aceptan números enteros en esta sección.', '#ef4444');
            return null;
        }
        return String(parseInt(limpio, 10));
    } else {
        if (!/^[a-zA-ZñÑ]$/.test(limpio)) {
            actualizarBanner('Error: Ingresa únicamente una letra de la A a la Z.', '#ef4444');
            return null;
        }
        return limpio.toUpperCase();
    }
}

// ==================== ACCIONES DEL SIMULADOR ====================

function accionInsertar() {
    const input = document.getElementById('inputValor');
    const valorValidado = validarYNormalizarEntrada(input.value);
    if (valorValidado === null) return;

    input.value = '';
    const pasos = arbolSimulador.insertarConPasos(valorValidado);
    actualizarPanelMetricasSimulador();
    document.getElementById('consolaSalida').textContent = `Insertando nodo: ${valorValidado}`;
    reproducirAnimacionPasos(pasos, false);
}

function accionBuscar() {
    const input = document.getElementById('inputValor');
    const valorValidado = validarYNormalizarEntrada(input.value);
    if (valorValidado === null) return;

    if (!arbolSimulador.raiz) {
        actualizarBanner('El árbol está vacío. Inserta elementos primero.', '#ef4444');
        return;
    }
    const pasos = arbolSimulador.buscarConPasos(valorValidado);
    document.getElementById('consolaSalida').textContent = `Ruta buscando '${valorValidado}': `;
    reproducirAnimacionPasos(pasos, true);
}

function accionEliminar() {
    const input = document.getElementById('inputValor');
    const valorValidado = validarYNormalizarEntrada(input.value);
    if (valorValidado === null) return;

    if (!arbolSimulador.raiz) {
        actualizarBanner('El árbol está vacío.', '#f59e0b');
        return;
    }
    input.value = '';
    const pasosBusqueda = arbolSimulador.buscarConPasos(valorValidado);
    document.getElementById('consolaSalida').textContent = `Buscando '${valorValidado}' para eliminar: `;

    reproducirAnimacionPasos(pasosBusqueda, true, () => {
        const ultimoPaso = pasosBusqueda[pasosBusqueda.length - 1];
        if (ultimoPaso && ultimoPaso.encontrado) {
            arbolSimulador.eliminar(valorValidado);
            limpiarResaltadosSimulador();
            actualizarPanelMetricasSimulador();
            actualizarBanner(`Nodo '${valorValidado}' eliminado y árbol reestructurado.`, '#10b981');
            document.getElementById('consolaSalida').textContent = `Nodo '${valorValidado}' eliminado.`;
        }
    });
}

function accionRecorrido(tipo) {
    if (!arbolSimulador.raiz) {
        actualizarBanner('El árbol está vacío. Crea tu árbol o usa "⚡ Ejemplo Rápido".', '#ef4444');
        return;
    }

    const dims = ajustarCanvasNitido('canvasSimulador', 'contenedorCanvasSimulador');
    posicionarYAutoAjustarArbol(arbolSimulador, dims.ancho, dims.alto);

    let pasos = [];
    if (tipo === 'PREORDEN') pasos = arbolSimulador.obtenerPasosPreorden();
    if (tipo === 'INORDEN') pasos = arbolSimulador.obtenerPasosInorden();
    if (tipo === 'POSTORDEN') pasos = arbolSimulador.obtenerPasosPostorden();

    const consola = document.getElementById('consolaSalida');
    consola.textContent = `${tipo}: `;
    document.getElementById('indicadorRecursividad').textContent = `Recorriendo ${tipo}...`;

    detenerAnimacion();
    caminoResaltado = [];
    nodosProcesados = [];
    let i = 0;

    flechaAnimada.visible = true;
    flechaAnimada.xActual = arbolSimulador.raiz.x;
    flechaAnimada.yActual = arbolSimulador.raiz.y;
    flechaAnimada.xDestino = arbolSimulador.raiz.x;
    flechaAnimada.yDestino = arbolSimulador.raiz.y;

    ejecutarPasoRecorrido();
    intervaloAnimacion = setInterval(ejecutarPasoRecorrido, TIEMPO_PASO_RECORRIDO_MS);

    function ejecutarPasoRecorrido() {
        if (i < pasos.length) {
            const paso = pasos[i];
            nodoPunteroActual = paso.nodo;

            flechaAnimada.xDestino = paso.nodo.x;
            flechaAnimada.yDestino = paso.nodo.y;
            flechaAnimada.esImpresion = paso.procesar;
            flechaAnimada.etiqueta = paso.etiqueta || (paso.procesar ? 'IMPRIMIENDO' : 'REGRESANDO');

            if (!caminoResaltado.includes(paso.nodo)) {
                caminoResaltado.push(paso.nodo);
            }

            if (paso.procesar && paso.consola !== null) {
                if (!nodosProcesados.includes(paso.nodo)) {
                    nodosProcesados.push(paso.nodo);
                }
                consola.textContent += `[ ${paso.consola} ]  `;
                actualizarBanner(paso.mensaje, '#ef4444');
            } else {
                actualizarBanner(paso.mensaje, '#38bdf8');
            }
            i++;
        } else {
            detenerAnimacion();
            nodoPunteroActual = null;
            flechaAnimada.visible = false;
            document.getElementById('indicadorRecursividad').textContent = 'Completado';
            actualizarBanner(`Recorrido ${tipo} finalizado.`, '#10b981');
        }
    }
}

function reproducirAnimacionPasos(pasos, mantenerCamino, callbackFinal = null) {
    detenerAnimacion();
    const dims = ajustarCanvasNitido('canvasSimulador', 'contenedorCanvasSimulador');
    posicionarYAutoAjustarArbol(arbolSimulador, dims.ancho, dims.alto);

    if (arbolSimulador.raiz) {
        flechaAnimada.xActual = arbolSimulador.raiz.x;
        flechaAnimada.yActual = arbolSimulador.raiz.y;
    }

    caminoResaltado = [];
    nodosProcesados = [];
    let i = 0;
    document.getElementById('indicadorRecursividad').textContent = 'Animando...';

    ejecutarPaso();
    intervaloAnimacion = setInterval(ejecutarPaso, TIEMPO_PASO_OPERACION_MS);

    function ejecutarPaso() {
        if (i < pasos.length) {
            const paso = pasos[i];
            nodoPunteroActual = paso.nodo;
            if (paso.nodo) {
                flechaAnimada.visible = true;
                flechaAnimada.xDestino = paso.nodo.x;
                flechaAnimada.yDestino = paso.nodo.y;
                flechaAnimada.esImpresion = paso.procesar;
                flechaAnimada.etiqueta = paso.etiqueta || (paso.procesar ? '¡AQUÍ!' : 'COMPARANDO');

                caminoResaltado.push(paso.nodo);
                if (paso.procesar) nodosProcesados.push(paso.nodo);

                if (mantenerCamino) {
                    document.getElementById('consolaSalida').textContent += `${paso.nodo.dato} ➔ `;
                }
            }
            actualizarBanner(paso.mensaje, '#38bdf8');
            i++;
        } else {
            detenerAnimacion();
            nodoPunteroActual = null;
            flechaAnimada.visible = false;
            if (!mantenerCamino) {
                caminoResaltado = [];
                nodosProcesados = [];
            }
            document.getElementById('indicadorRecursividad').textContent = 'En espera';
            if (callbackFinal) callbackFinal();
        }
    }
}

function detenerAnimacion() {
    if (intervaloAnimacion) {
        clearInterval(intervaloAnimacion);
        intervaloAnimacion = null;
    }
}

function limpiarResaltadosSimulador() {
    nodoPunteroActual = null;
    caminoResaltado = [];
    nodosProcesados = [];
    flechaAnimada.visible = false;
}

function limpiarSimulador() {
    detenerAnimacion();
    arbolSimulador.raiz = null;
    limpiarResaltadosSimulador();
    actualizarPanelMetricasSimulador();
    actualizarBanner('Lienzo limpio. Ingresa valores o presiona "⚡ Ejemplo Rápido".', '#38bdf8');
    document.getElementById('consolaSalida').textContent = 'Esperando operaciones en el árbol...';
}

function cargarArbolEjemplo() {
    detenerAnimacion();
    arbolSimulador.raiz = null;
    limpiarResaltadosSimulador();

    const cantidadNodos = 6 + Math.floor(Math.random() * 3);
    const generados = [];
    const usados = new Set();

    if (modoActualSimulador === 'NUMEROS') {
        while (usados.size < cantidadNodos) {
            const n = 10 + Math.floor(Math.random() * 89);
            if (!usados.has(n)) {
                usados.add(n);
                arbolSimulador.insertarConPasos(String(n));
                generados.push(n);
            }
        }
    } else {
        const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (usados.size < cantidadNodos) {
            const letra = alfabeto[Math.floor(Math.random() * alfabeto.length)];
            if (!usados.has(letra)) {
                usados.add(letra);
                arbolSimulador.insertarConPasos(letra);
                generados.push(letra);
            }
        }
    }

    actualizarPanelMetricasSimulador();
    actualizarBanner(`Árbol aleatorio generado (${generados.join(', ')}). ¡Prueba los recorridos!`, '#10b981');
    document.getElementById('consolaSalida').textContent = `Nodos insertados: ${generados.join(', ')}`;
}

function actualizarBanner(texto, colorBorde) {
    const banner = document.getElementById('bannerEstado');
    banner.textContent = texto;
    banner.style.borderLeftColor = colorBorde;
}

// ============================================================================
// MOTOR DE RENDERIZADO SIN SUPERPOSICIÓN DE NODOS (INORDEN + CENTRADO DE PADRES)
// ============================================================================

function ajustarCanvasNitido(idCanvas, idContenedor) {
    const canvas = document.getElementById(idCanvas);
    const contenedor = document.getElementById(idContenedor);
    if (!canvas || !contenedor) return { ctx: null, ancho: 0, alto: 0 };

    const anchoCSS = Math.max(240, contenedor.clientWidth);
    const altoCSS = Math.max(200, contenedor.clientHeight);
    const dpr = window.devicePixelRatio || 1;

    const anchoBuffer = Math.floor(anchoCSS * dpr);
    const altoBuffer = Math.floor(altoCSS * dpr);

    if (canvas.width !== anchoBuffer || canvas.height !== altoBuffer) {
        canvas.width = anchoBuffer;
        canvas.height = altoBuffer;
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, ancho: anchoCSS, alto: altoCSS };
}

window.addEventListener('resize', () => {
    if (!document.getElementById('quizContenidoActivo').classList.contains('oculto')) {
        dibujarArbolEnCanvas('canvasQuiz', 'contenedorCanvasQuiz', arbolQuiz, null, [], false);
    }
});

/**
 * Asigna a cada nodo una columna horizontal única basada en su recorrido Inorden
 * y centra los padres de abajo hacia arriba cuando tienen dos hijos, garantizando
 * que dos nodos (sean números o letras) jamás tengan la misma coordenada X.
 */
function asignarCoordenadasSinTraslape(raiz) {
    let indiceColumna = 0;
    const SEPARACION_COLUMNA_X = 60;
    const SEPARACION_NIVEL_Y = 84;

    // 1. Asignación inicial en orden estricto de izquierda a derecha (0% colisiones)
    function recorrerInorden(nodo, nivel) {
        if (!nodo) return;
        recorrerInorden(nodo.izquierdo, nivel + 1);
        nodo.lx = indiceColumna * SEPARACION_COLUMNA_X;
        nodo.ly = nivel * SEPARACION_NIVEL_Y;
        indiceColumna++;
        recorrerInorden(nodo.derecho, nivel + 1);
    }
    recorrerInorden(raiz, 0);

    // 2. Si un padre tiene ambos hijos, lo centra suavemente entre ellos
    //    (manteniendo siempre los subárboles izquierdo y derecho separados)
    function centrarPadresConDosHijos(nodo) {
        if (!nodo) return;
        centrarPadresConDosHijos(nodo.izquierdo);
        centrarPadresConDosHijos(nodo.derecho);
        if (nodo.izquierdo && nodo.derecho) {
            nodo.lx = (nodo.izquierdo.lx + nodo.derecho.lx) / 2;
        }
    }
    centrarPadresConDosHijos(raiz);
}

function posicionarYAutoAjustarArbol(arbol, anchoCanvas, altoCanvas) {
    if (!arbol.raiz) return 20;

    asignarCoordenadasSinTraslape(arbol.raiz);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    function buscarLimites(n) {
        if (!n) return;
        if (n.lx < minX) minX = n.lx;
        if (n.lx > maxX) maxX = n.lx;
        if (n.ly < minY) minY = n.ly;
        if (n.ly > maxY) maxY = n.ly;
        buscarLimites(n.izquierdo);
        buscarLimites(n.derecho);
    }
    buscarLimites(arbol.raiz);

    const esPantallaPequena = anchoCanvas < 520;
    const margenX = esPantallaPequena ? 34 : 62;
    const margenSuperior = esPantallaPequena ? 66 : 78;
    const margenInferior = esPantallaPequena ? 32 : 42;

    const anchoDisponible = Math.max(80, anchoCanvas - margenX * 2);
    const altoDisponible = Math.max(80, altoCanvas - margenSuperior - margenInferior);

    const anchoLogico = Math.max(1, maxX - minX);
    const altoLogico = Math.max(1, maxY - minY);

    const escalaX = anchoLogico > 0 ? anchoDisponible / anchoLogico : 1;
    const escalaY = altoLogico > 0 ? altoDisponible / altoLogico : 1;
    const escala = Math.min(1, escalaX, escalaY);

    const centroLogicoX = (minX + maxX) / 2;
    const centroCanvasX = anchoCanvas / 2;

    function transformarAPantalla(n) {
        if (!n) return;
        n.x = centroCanvasX + (n.lx - centroLogicoX) * escala;
        n.y = margenSuperior + (n.ly - minY) * escala;
        transformarAPantalla(n.izquierdo);
        transformarAPantalla(n.derecho);
    }
    transformarAPantalla(arbol.raiz);

    const radioBase = esPantallaPequena ? 18 : 22;
    return Math.max(13, Math.min(radioBase, Math.round(radioBase * Math.max(0.68, escala))));
}

function dibujarArbolEnCanvas(idCanvas, idContenedor, arbol, nodoActual, visitados, mostrarFlecha) {
    const { ctx, ancho, alto } = ajustarCanvasNitido(idCanvas, idContenedor);
    if (!ctx) return;

    ctx.clearRect(0, 0, ancho, alto);

    if (!arbol.raiz) {
        ctx.fillStyle = '#64748b';
        ctx.font = `600 ${ancho < 500 ? 13 : 15}px Segoe UI`;
        ctx.textAlign = 'center';
        ctx.fillText('Lienzo vacío — Ingresa un valor o usa "⚡ Ejemplo Rápido"', ancho / 2, alto / 2);
        return;
    }

    const radioNodo = posicionarYAutoAjustarArbol(arbol, ancho, alto);
    dibujarEnlaces(ctx, arbol.raiz, visitados);
    dibujarNodosPedagogicos(ctx, arbol.raiz, arbol.raiz, nodoActual, visitados, radioNodo);

    if (mostrarFlecha && flechaAnimada.visible) {
        dibujarFlechaPuntero(ctx, radioNodo);
    }
}

function dibujarEnlaces(ctx, nodo, visitados) {
    if (!nodo) return;
    if (nodo.izquierdo) {
        trazarLineaConFlecha(ctx, nodo, nodo.izquierdo, visitados);
        dibujarEnlaces(ctx, nodo.izquierdo, visitados);
    }
    if (nodo.derecho) {
        trazarLineaConFlecha(ctx, nodo, nodo.derecho, visitados);
        dibujarEnlaces(ctx, nodo.derecho, visitados);
    }
}

function trazarLineaConFlecha(ctx, padre, hijo, visitados) {
    const esCaminoResaltado = visitados.includes(padre) && visitados.includes(hijo);
    ctx.beginPath();
    ctx.moveTo(padre.x, padre.y);
    ctx.lineTo(hijo.x, hijo.y);
    ctx.strokeStyle = esCaminoResaltado ? '#fbbf24' : '#475569';
    ctx.lineWidth = esCaminoResaltado ? 3.5 : 2;
    ctx.stroke();

    if (esCaminoResaltado) {
        const mx = (padre.x + hijo.x) / 2;
        const my = (padre.y + hijo.y) / 2;
        const angulo = Math.atan2(hijo.y - padre.y, hijo.x - padre.x);

        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angulo);
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.restore();
    }
}

function obtenerEstiloPedagogicoNodo(nodo, raizArbol) {
    if (nodo === raizArbol) {
        return { relleno: '#0284c7', borde: '#38bdf8' };
    }
    if (nodo.izquierdo === null && nodo.derecho === null) {
        return { relleno: '#059669', borde: '#34d399' };
    }
    return { relleno: '#6366f1', borde: '#a5b4fc' };
}

function dibujarNodosPedagogicos(ctx, nodo, raizArbol, nodoActual, visitados, radio) {
    if (!nodo) return;
    const fueProcesado = nodosProcesados.includes(nodo);
    const estilo = obtenerEstiloPedagogicoNodo(nodo, raizArbol);

    if (nodo === nodoActual) {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, radio + 8, 0, Math.PI * 2);
        ctx.fillStyle = flechaAnimada.esImpresion
            ? 'rgba(239, 68, 68, 0.38)'
            : 'rgba(56, 189, 248, 0.35)';
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, radio, 0, Math.PI * 2);
    ctx.fillStyle = estilo.relleno;
    ctx.fill();

    ctx.lineWidth = fueProcesado ? 3.8 : (visitados.includes(nodo) ? 3 : 2);
    ctx.strokeStyle = fueProcesado ? '#fde047' : (visitados.includes(nodo) ? '#fbbf24' : estilo.borde);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(11, radio - 6)}px Segoe UI`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nodo.dato, nodo.x, nodo.y);

    dibujarNodosPedagogicos(ctx, nodo.izquierdo, raizArbol, nodoActual, visitados, radio);
    dibujarNodosPedagogicos(ctx, nodo.derecho, raizArbol, nodoActual, visitados, radio);
}

function dibujarFlechaPuntero(ctx, radio = 20) {
    flechaAnimada.xActual += (flechaAnimada.xDestino - flechaAnimada.xActual) * 0.11;
    flechaAnimada.yActual += (flechaAnimada.yDestino - flechaAnimada.yActual) * 0.11;
    flechaAnimada.rebote += 0.1;

    const offsetRebote = Math.sin(flechaAnimada.rebote) * 3;
    const x = flechaAnimada.xActual;
    const yPunta = Math.max(flechaAnimada.yActual - radio - 4 + offsetRebote, 44);

    const colorFlecha = flechaAnimada.esImpresion ? '#ef4444' : '#38bdf8';

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, yPunta);
    ctx.lineTo(x - 9, yPunta - 11);
    ctx.lineTo(x - 3.5, yPunta - 11);
    ctx.lineTo(x - 3.5, yPunta - 22);
    ctx.lineTo(x + 3.5, yPunta - 22);
    ctx.lineTo(x + 3.5, yPunta - 11);
    ctx.lineTo(x + 9, yPunta - 11);
    ctx.closePath();

    ctx.fillStyle = colorFlecha;
    ctx.fill();

    ctx.font = 'bold 10.5px Segoe UI';
    const anchoTexto = ctx.measureText(flechaAnimada.etiqueta).width + 12;
    const yCaja = Math.max(yPunta - 40, 4);

    ctx.fillStyle = colorFlecha;
    ctx.beginPath();
    ctx.roundRect(x - anchoTexto / 2, yCaja, anchoTexto, 17, 4);
    ctx.fill();

    ctx.fillStyle = '#090e1a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flechaAnimada.etiqueta, x, yCaja + 8.5);
    ctx.restore();
}

// ============================================================================
// MÓDULO 2: GLOSARIO PROPORCIONAL Y ESTABLE
// ============================================================================

const diccionarioTeoria = {
    raiz: {
        titulo: '👑 Nodo Raíz',
        texto: 'Es el nodo superior donde comienza el árbol (color Azul Cian). No tiene padre y su nivel siempre es 0. En el diagrama de abajo, el nodo 50 es la Raíz.'
    },
    padres: {
        titulo: '🧭 Nodos Internos (Padres)',
        texto: 'Son los nodos intermedios que tienen al menos un hijo conectado debajo (color Violeta). En el ejemplo, el 30 es un nodo interno porque es padre de 20 y 40.'
    },
    hijos: {
        titulo: '🌱 Nodos Hijos',
        texto: 'Son los nodos que descienden directamente de un nodo padre. Cada nodo puede tener como máximo dos hijos: Izquierdo (menores) y Derecho (mayores).'
    },
    hojas: {
        titulo: '🍃 Nodos Hojas (Terminales)',
        texto: 'Son los nodos ubicados al final de las ramas que NO tienen ningún hijo (color Verde Esmeralda). Aquí los nodos 20, 40 y 70 son Hojas.'
    },
    subarboles: {
        titulo: '🌿 Subárboles',
        texto: 'Cualquier hijo junto con sus descendientes forma un Subárbol. El recuadro verde muestra el Subárbol Izquierdo completo que nace en el nodo 30.'
    },
    propiedades: {
        titulo: '📐 Grado, Nivel, Altura y Orden',
        texto: '• GRADO: Máximo de hijos que tiene un nodo (máx. 2).\n• NIVEL: Distancia desde la raíz (Raíz = Nivel 0).\n• ALTURA: Total de niveles del árbol (Altura = 3).\n• ORDEN: Cantidad total de nodos (5 nodos).'
    },
    preorden: {
        titulo: '1️⃣ Recorrido Preorden (Raíz ➔ Izquierda ➔ Derecha)',
        texto: 'Visita e imprime primero la Raíz, después recorre todo el subárbol izquierdo y finalmente el derecho.\nSecuencia animada: 50 ➔ 30 ➔ 20 ➔ 40 ➔ 70.'
    },
    inorden: {
        titulo: '2️⃣ Recorrido Inorden (Izquierda ➔ Raíz ➔ Derecha)',
        texto: 'Visita primero el extremo izquierdo, luego la Raíz y después la derecha. Entrega los elementos ordenados de menor a mayor.\nSecuencia animada: 20 ➔ 30 ➔ 40 ➔ 50 ➔ 70.'
    },
    postorden: {
        titulo: '3️⃣ Recorrido Postorden (Izquierda ➔ Derecha ➔ Raíz)',
        texto: 'Visita primero todos los hijos (izquierdo y derecho) y deja la Raíz hasta el final.\nSecuencia animada: 20 ➔ 40 ➔ 30 ➔ 70 ➔ 50.'
    }
};

let conceptoTeoriaActivo = 'raiz';
let contadorFramesTeoria = 0;

function mostrarConcepto(clave, tarjetaElemento) {
    conceptoTeoriaActivo = clave;
    contadorFramesTeoria = 0;
    document.querySelectorAll('.tarjeta-concepto').forEach(t => t.classList.remove('activa'));
    tarjetaElemento.classList.add('activa');

    document.getElementById('tituloConcepto').textContent = diccionarioTeoria[clave].titulo;
    document.getElementById('textoConcepto').textContent = diccionarioTeoria[clave].texto;
}

function dibujarGlosarioAdaptativo() {
    const { ctx, ancho, alto } = ajustarCanvasNitido('canvasTeoria', 'contenedorCanvasTeoria');
    if (!ctx) return;

    ctx.clearRect(0, 0, ancho, alto);
    contadorFramesTeoria++;
    const pulsoSuave = Math.sin(contadorFramesTeoria * 0.05) * 3.5;

    const cx = ancho / 2;
    const sepX1 = Math.min(130, ancho * 0.24);
    const sepX2 = Math.min(72, ancho * 0.13);
    const y0 = Math.round(alto * 0.20);
    const y1 = Math.round(alto * 0.50);
    const y2 = Math.round(alto * 0.78);

    const nodos = [
        { id: 0, dato: '50', x: cx, y: y0, relleno: '#0284c7', borde: '#38bdf8' },
        { id: 1, dato: '30', x: cx - sepX1, y: y1, relleno: '#6366f1', borde: '#a5b4fc' },
        { id: 2, dato: '70', x: cx + sepX1, y: y1, relleno: '#059669', borde: '#34d399' },
        { id: 3, dato: '20', x: cx - sepX1 - sepX2, y: y2, relleno: '#059669', borde: '#34d399' },
        { id: 4, dato: '40', x: cx - sepX1 + sepX2, y: y2, relleno: '#059669', borde: '#34d399' }
    ];

    if (conceptoTeoriaActivo === 'subarboles') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(nodos[3].x - 36, y1 - 34, (nodos[4].x - nodos[3].x) + 72, (y2 - y1) + 68, 14);
        ctx.fill();
        ctx.stroke();
    }

    if (conceptoTeoriaActivo === 'propiedades') {
        [y0, y1, y2].forEach((ny, idx) => {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(20, ny);
            ctx.lineTo(ancho - 20, ny);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 12px Segoe UI';
            ctx.textAlign = 'left';
            ctx.fillText(`Nivel ${idx}`, 24, ny - 8);
        });
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Grado = 2  |  Altura = 3  |  Orden = 5 nodos', cx, alto - 14);
    }

    const enlaces = [[0, 1], [0, 2], [1, 3], [1, 4]];
    enlaces.forEach(([p, h]) => {
        ctx.beginPath();
        ctx.moveTo(nodos[p].x, nodos[p].y);
        ctx.lineTo(nodos[h].x, nodos[h].y);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.2;
        ctx.stroke();
    });

    let ordenRecorridoIds = null;
    let textoSecuencia = '';
    if (conceptoTeoriaActivo === 'preorden') {
        ordenRecorridoIds = [0, 1, 3, 4, 2];
        textoSecuencia = 'Preorden: 50 ➔ 30 ➔ 20 ➔ 40 ➔ 70';
    } else if (conceptoTeoriaActivo === 'inorden') {
        ordenRecorridoIds = [3, 1, 4, 0, 2];
        textoSecuencia = 'Inorden: 20 ➔ 30 ➔ 40 ➔ 50 ➔ 70';
    } else if (conceptoTeoriaActivo === 'postorden') {
        ordenRecorridoIds = [3, 4, 1, 2, 0];
        textoSecuencia = 'Postorden: 20 ➔ 40 ➔ 30 ➔ 70 ➔ 50';
    }

    const pasoActualIdx = ordenRecorridoIds
        ? Math.floor(contadorFramesTeoria / 95) % ordenRecorridoIds.length
        : -1;
    const idNodoRecorridoActivo = ordenRecorridoIds ? ordenRecorridoIds[pasoActualIdx] : -1;

    const radioBase = ancho < 450 ? 18 : 21;

    nodos.forEach(n => {
        const esDestacado =
            (conceptoTeoriaActivo === 'raiz' && n.id === 0) ||
            (conceptoTeoriaActivo === 'padres' && (n.id === 0 || n.id === 1)) ||
            (conceptoTeoriaActivo === 'hijos' && n.id > 0) ||
            (conceptoTeoriaActivo === 'hojas' && (n.id === 2 || n.id === 3 || n.id === 4)) ||
            (conceptoTeoriaActivo === 'subarboles' && (n.id === 1 || n.id === 3 || n.id === 4)) ||
            (n.id === idNodoRecorridoActivo);

        const r = esDestacado ? radioBase + 3 + Math.abs(pulsoSuave) : radioBase;
        if (esDestacado) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.relleno;
        ctx.fill();
        ctx.lineWidth = esDestacado ? 3.2 : 2;
        ctx.strokeStyle = esDestacado ? '#fde047' : n.borde;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${ancho < 450 ? 12 : 13}px Segoe UI`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.dato, n.x, n.y);
    });

    if (ordenRecorridoIds) {
        const nodoVisitado = nodos.find(n => n.id === idNodoRecorridoActivo);
        if (nodoVisitado) {
            const fy = nodoVisitado.y - radioBase - 10;
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(nodoVisitado.x, fy);
            ctx.lineTo(nodoVisitado.x - 8, fy - 11);
            ctx.lineTo(nodoVisitado.x + 8, fy - 11);
            ctx.closePath();
            ctx.fill();
        }
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13.5px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(textoSecuencia, cx, alto - 12);
    }
}

function bucleAnimacionGeneral() {
    dibujarArbolEnCanvas('canvasSimulador', 'contenedorCanvasSimulador', arbolSimulador, nodoPunteroActual, caminoResaltado, true);
    dibujarGlosarioAdaptativo();
    requestAnimationFrame(bucleAnimacionGeneral);
}

// ============================================================================
// MÓDULO 3: QUIZ CON INICIO MANUAL, MODO POR APARTE Y RESUMEN WORDLE
// ============================================================================

let modoEvaluacionConfig = 'COMPLETO';
let totalPreguntasConfig = 5;
let dificultadConfig = 'MEDIA';
let tipoArbolConfig = 'MIXTO';
let modoTiempoConfig = 'SIN_TIEMPO';

let preguntaActualNum = 1;
let puntajeAcumuladoQuiz = 0;
let recorridoQuizActual = 'INORDEN';
let examenFinalizado = false;
let timerRelojQuiz = null;
let segundosRestantesPregunta = 0;

let resultadosPartidaWordle = [];

function volverAConfiguracionQuiz() {
    detenerRelojQuiz();
    document.getElementById('modalResumenWordle').classList.add('oculto');
    document.getElementById('quizContenidoActivo').classList.add('oculto');
    document.getElementById('quizLobby').classList.remove('oculto');
}

function cerrarModalResumen() {
    document.getElementById('modalResumenWordle').classList.add('oculto');
}

function iniciarQuizPersonalizado() {
    detenerRelojQuiz();
    document.getElementById('modalResumenWordle').classList.add('oculto');

    modoEvaluacionConfig = document.getElementById('cfgModoEvaluacion').value;

    const numInput = parseInt(document.getElementById('cfgNumPreguntas').value.trim(), 10);
    totalPreguntasConfig = (!isNaN(numInput) && numInput >= 1 && numInput <= 20) ? numInput : 5;
    document.getElementById('cfgNumPreguntas').value = totalPreguntasConfig;

    dificultadConfig = document.getElementById('cfgDificultad').value;
    tipoArbolConfig = document.getElementById('cfgTipoArbol').value;
    modoTiempoConfig = document.getElementById('cfgTiempo').value;

    preguntaActualNum = 1;
    puntajeAcumuladoQuiz = 0;
    resultadosPartidaWordle = [];
    examenFinalizado = false;

    document.getElementById('quizLobby').classList.add('oculto');
    document.getElementById('quizContenidoActivo').classList.remove('oculto');

    const bloqueRec = document.getElementById('bloqueInputRecorrido');
    const bloqueProp = document.getElementById('bloqueInputPropiedades');

    if (modoEvaluacionConfig === 'SOLO_RECORRIDOS') {
        bloqueRec.classList.remove('oculto');
        bloqueProp.classList.add('oculto');
    } else if (modoEvaluacionConfig === 'SOLO_PROPIEDADES') {
        bloqueRec.classList.add('oculto');
        bloqueProp.classList.remove('oculto');
    } else {
        bloqueRec.classList.remove('oculto');
        bloqueProp.classList.remove('oculto');
    }

    document.getElementById('lblProgresoQuiz').textContent = `1 / ${totalPreguntasConfig}`;
    document.getElementById('lblCalificacion').textContent = 'En curso';
    document.getElementById('btnResponderQuiz').disabled = false;
    document.getElementById('feedbackQuiz').classList.add('oculto');

    const cajaReloj = document.getElementById('cajaRelojQuiz');
    if (modoTiempoConfig === 'CON_TIEMPO') {
        cajaReloj.classList.remove('oculto');
    } else {
        cajaReloj.classList.add('oculto');
    }

    generarPreguntaQuiz();
}

function generarPreguntaQuiz() {
    detenerRelojQuiz();

    let usarLetras = false;
    if (tipoArbolConfig === 'LETRAS') usarLetras = true;
    else if (tipoArbolConfig === 'NUMEROS') usarLetras = false;
    else usarLetras = (preguntaActualNum % 2 === 0);

    arbolQuiz.tipo = usarLetras ? 'LETRAS' : 'NUMEROS';
    arbolQuiz.raiz = null;

    let minNodos = 6, maxNodos = 7;
    if (dificultadConfig === 'FACIL') { minNodos = 4; maxNodos = 5; }
    else if (dificultadConfig === 'DIFICIL') { minNodos = 8; maxNodos = 10; }

    const cantidad = minNodos + Math.floor(Math.random() * (maxNodos - minNodos + 1));
    const usados = new Set();

    if (!usarLetras) {
        while (usados.size < cantidad) {
            const aleatorio = 10 + Math.floor(Math.random() * 85);
            if (!usados.has(aleatorio)) {
                usados.add(aleatorio);
                arbolQuiz.insertarConPasos(String(aleatorio));
            }
        }
    } else {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (usados.size < cantidad) {
            const l = letras[Math.floor(Math.random() * letras.length)];
            if (!usados.has(l)) {
                usados.add(l);
                arbolQuiz.insertarConPasos(l);
            }
        }
    }

    const tipos = ['PREORDEN', 'INORDEN', 'POSTORDEN'];
    recorridoQuizActual = tipos[Math.floor(Math.random() * tipos.length)];

    const etiquetaTipo = usarLetras ? 'de Letras' : 'de Números Enteros';
    if (modoEvaluacionConfig === 'SOLO_RECORRIDOS') {
        document.getElementById('preguntaQuiz').textContent =
            `Pregunta ${preguntaActualNum}/${totalPreguntasConfig}: Escribe el recorrido ${recorridoQuizActual} de este Árbol ${etiquetaTipo}.`;
    } else if (modoEvaluacionConfig === 'SOLO_PROPIEDADES') {
        document.getElementById('preguntaQuiz').textContent =
            `Pregunta ${preguntaActualNum}/${totalPreguntasConfig}: Identifica el Grado, Nivel máximo, Altura y Orden de este Árbol ${etiquetaTipo}.`;
    } else {
        document.getElementById('preguntaQuiz').textContent =
            `Pregunta ${preguntaActualNum}/${totalPreguntasConfig}: Escribe el recorrido ${recorridoQuizActual} e identifica las propiedades de este Árbol ${etiquetaTipo}.`;
    }

    document.getElementById('lblInputRecorrido').textContent = `Secuencia del Recorrido ${recorridoQuizActual}:`;

    document.getElementById('inputRespuestaRecorrido').value = '';
    document.getElementById('inputRespuestaGrado').value = '';
    document.getElementById('inputRespuestaNivel').value = '';
    document.getElementById('inputRespuestaAltura').value = '';
    document.getElementById('inputRespuestaOrden').value = '';

    dibujarArbolEnCanvas('canvasQuiz', 'contenedorCanvasQuiz', arbolQuiz, null, [], false);

    if (modoTiempoConfig === 'CON_TIEMPO') {
        segundosRestantesPregunta = dificultadConfig === 'FACIL' ? 60 : (dificultadConfig === 'MEDIA' ? 50 : 40);
        actualizarEtiquetaReloj();
        timerRelojQuiz = setInterval(() => {
            segundosRestantesPregunta--;
            actualizarEtiquetaReloj();
            if (segundosRestantesPregunta <= 0) {
                detenerRelojQuiz();
                verificarRespuestaQuiz(true);
            }
        }, 1000);
    }
}

function actualizarEtiquetaReloj() {
    document.getElementById('lblTiempoQuiz').textContent = `${segundosRestantesPregunta}s`;
}

function detenerRelojQuiz() {
    if (timerRelojQuiz) {
        clearInterval(timerRelojQuiz);
        timerRelojQuiz = null;
    }
}

function obtenerRespuestaCorrectaRecorrido() {
    let pasos = [];
    if (recorridoQuizActual === 'PREORDEN') pasos = arbolQuiz.obtenerPasosPreorden();
    if (recorridoQuizActual === 'INORDEN') pasos = arbolQuiz.obtenerPasosInorden();
    if (recorridoQuizActual === 'POSTORDEN') pasos = arbolQuiz.obtenerPasosPostorden();
    return pasos.filter(p => p.procesar).map(p => p.consola).join(' ');
}

function verificarRespuestaQuiz(porTiempoAgotado = false) {
    if (examenFinalizado) return;
    detenerRelojQuiz();

    const evalRecorrido = (modoEvaluacionConfig === 'SOLO_RECORRIDOS' || modoEvaluacionConfig === 'COMPLETO');
    const evalPropiedades = (modoEvaluacionConfig === 'SOLO_PROPIEDADES' || modoEvaluacionConfig === 'COMPLETO');

    const respRecorrido = document.getElementById('inputRespuestaRecorrido').value
        .trim().toUpperCase().replace(/[,]+/g, ' ').replace(/\s+/g, ' ');
    const respGrado = parseInt(document.getElementById('inputRespuestaGrado').value.trim(), 10);
    const respNivel = parseInt(document.getElementById('inputRespuestaNivel').value.trim(), 10);
    const respAltura = parseInt(document.getElementById('inputRespuestaAltura').value.trim(), 10);
    const respOrden = parseInt(document.getElementById('inputRespuestaOrden').value.trim(), 10);

    if (!porTiempoAgotado) {
        if (evalRecorrido && !respRecorrido) {
            mostrarAvisoIncompletoQuiz('Escribe la secuencia del recorrido antes de calificar.');
            return;
        }
        if (evalPropiedades && (isNaN(respGrado) || isNaN(respNivel) || isNaN(respAltura) || isNaN(respOrden))) {
            mostrarAvisoIncompletoQuiz('Completa los 4 campos numéricos (Grado, Nivel, Altura y Orden).');
            return;
        }
    }

    const corrRecorrido = obtenerRespuestaCorrectaRecorrido().toUpperCase();
    const corrGrado = arbolQuiz.obtenerGrado();
    const corrNivel = arbolQuiz.obtenerNivelMaximo();
    const corrAltura = arbolQuiz.obtenerAltura();
    const corrOrden = arbolQuiz.obtenerTotalNodos();

    let aciertosPregunta = 0;
    let totalItemsPregunta = 0;
    const detallesPregunta = [];

    if (evalRecorrido) {
        totalItemsPregunta++;
        const okRec = (respRecorrido === corrRecorrido);
        if (okRec) aciertosPregunta++;
        detallesPregunta.push({
            campo: `Recorrido ${recorridoQuizActual}`,
            correcto: okRec,
            usuario: respRecorrido || '(Sin responder)',
            esperado: corrRecorrido
        });
    }

    if (evalPropiedades) {
        totalItemsPregunta += 4;
        const okGrado = (respGrado === corrGrado);
        const okNivel = (respNivel === corrNivel);
        const okAltura = (respAltura === corrAltura);
        const okOrden = (respOrden === corrOrden || respOrden === 2);

        if (okGrado) aciertosPregunta++;
        if (okNivel) aciertosPregunta++;
        if (okAltura) aciertosPregunta++;
        if (okOrden) aciertosPregunta++;

        detallesPregunta.push(
            { campo: 'Grado', correcto: okGrado, usuario: isNaN(respGrado) ? '-' : respGrado, esperado: corrGrado },
            { campo: 'Nivel máx', correcto: okNivel, usuario: isNaN(respNivel) ? '-' : respNivel, esperado: corrNivel },
            { campo: 'Altura', correcto: okAltura, usuario: isNaN(respAltura) ? '-' : respAltura, esperado: corrAltura },
            { campo: 'Orden', correcto: okOrden, usuario: isNaN(respOrden) ? '-' : respOrden, esperado: corrOrden }
        );
    }

    const proporcion = aciertosPregunta / totalItemsPregunta;
    puntajeAcumuladoQuiz += proporcion;

    let estadoWordle = 'mal';
    let emojiWordle = '🟥';
    if (proporcion === 1) {
        estadoWordle = 'bien';
        emojiWordle = '🟩';
    } else if (proporcion > 0) {
        estadoWordle = 'parcial';
        emojiWordle = '🟨';
    }

    resultadosPartidaWordle.push({
        numero: preguntaActualNum,
        estado: estadoWordle,
        emoji: emojiWordle,
        aciertos: aciertosPregunta,
        total: totalItemsPregunta,
        detalles: detallesPregunta
    });

    const cajaFeedback = document.getElementById('feedbackQuiz');
    cajaFeedback.classList.remove('oculto', 'correcto', 'incorrecto');

    if (proporcion === 1) {
        cajaFeedback.classList.add('correcto');
        cajaFeedback.textContent = `🟩 ¡Correcto! (${aciertosPregunta}/${totalItemsPregunta} aciertos en esta pregunta).`;
    } else {
        cajaFeedback.classList.add('incorrecto');
        cajaFeedback.textContent = `${emojiWordle} Obtuviste ${aciertosPregunta}/${totalItemsPregunta} aciertos en esta pregunta. Al finalizar verás el resumen completo.`;
    }

    document.getElementById('btnResponderQuiz').disabled = true;

    setTimeout(() => {
        if (preguntaActualNum < totalPreguntasConfig) {
            preguntaActualNum++;
            document.getElementById('lblProgresoQuiz').textContent = `${preguntaActualNum} / ${totalPreguntasConfig}`;
            document.getElementById('btnResponderQuiz').disabled = false;
            cajaFeedback.classList.add('oculto');
            generarPreguntaQuiz();
        } else {
            examenFinalizado = true;
            mostrarResumenFinalWordle();
        }
    }, 1500);
}

function mostrarAvisoIncompletoQuiz(mensaje) {
    const cajaFeedback = document.getElementById('feedbackQuiz');
    cajaFeedback.classList.remove('oculto', 'correcto');
    cajaFeedback.classList.add('incorrecto');
    cajaFeedback.textContent = mensaje;
}

function mostrarResumenFinalWordle() {
    const notaFinal = Math.round((puntajeAcumuladoQuiz / totalPreguntasConfig) * 100);
    const preguntasPerfectas = resultadosPartidaWordle.filter(r => r.estado === 'bien').length;

    document.getElementById('lblCalificacion').textContent = `${notaFinal}%`;
    document.getElementById('statTotalPreguntas').textContent = totalPreguntasConfig;
    document.getElementById('statCalificacionFinal').textContent = `${notaFinal}%`;
    document.getElementById('statPerfectas').textContent = `${preguntasPerfectas}/${totalPreguntasConfig}`;

    const contenedorEmojis = document.getElementById('wordleEmojisGrid');
    contenedorEmojis.innerHTML = '';
    resultadosPartidaWordle.forEach(r => {
        const span = document.createElement('span');
        span.textContent = r.emoji;
        span.title = `Pregunta ${r.numero}: ${r.aciertos}/${r.total}`;
        contenedorEmojis.appendChild(span);
    });

    const contenedorLista = document.getElementById('wordleListaDetalle');
    contenedorLista.innerHTML = '';

    resultadosPartidaWordle.forEach(r => {
        const div = document.createElement('div');
        div.className = `item-resumen-pregunta ${r.estado}`;

        let htmlInterno = `<h4>${r.emoji} Pregunta ${r.numero} (${r.aciertos}/${r.total} aciertos)</h4>`;
        r.detalles.forEach(d => {
            if (d.correcto) {
                htmlInterno += `<div class="linea-comparacion"><span class="tag-ok">✔ ${d.campo}:</span> ${d.usuario} (Correcto)</div>`;
            } else {
                htmlInterno += `<div class="linea-comparacion"><span class="tag-err">✖ ${d.campo}:</span> Pusiste "${d.usuario}" ➔ <strong>Correcto: "${d.esperado}"</strong></div>`;
            }
        });

        div.innerHTML = htmlInterno;
        contenedorLista.appendChild(div);
    });

    document.getElementById('modalResumenWordle').classList.remove('oculto');
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
window.onload = () => {
    actualizarPanelMetricasSimulador();
    bucleAnimacionGeneral();
};