// Variables globales de estado para el Simulador (Módulo 1)
let modoActualSimulador = 'NUMEROS';
const arbolSimulador = new ArbolBinario('NUMEROS');

let intervaloAnimacion = null;
let nodoPunteroActual = null;
let caminoResaltado = [];
let nodosProcesados = [];

const TIEMPO_PASO_RECORRIDO_MS = 1400;
const TIEMPO_PASO_OPERACION_MS = 1150;

// Estado de posición de la flecha animada
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

// Limpia la consola y coloca el título de la operación actual
function iniciarConsolaConTitulo(titulo) {
    const consola = document.getElementById('consolaSalida');
    consola.innerHTML = `<span class="consola-etiqueta">${titulo}</span>`;
}

// Agrega una etiqueta visual en la consola por cada nodo visitado o impreso
function agregarChipConsola(valor, conFlecha = false) {
    const consola = document.getElementById('consolaSalida');
    const chip = document.createElement('span');
    chip.className = 'consola-chip';
    chip.textContent = `[ ${valor} ]`;
    consola.appendChild(chip);

    if (conFlecha) {
        const flecha = document.createElement('span');
        flecha.className = 'consola-flecha-paso';
        flecha.textContent = '➔';
        consola.appendChild(flecha);
    }
}

// Cambia entre las 3 pestañas principales (Simulador, Glosario y Quiz)
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

// Alterna entre el árbol de números y el de letras limpiando el lienzo anterior
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
        input.placeholder = 'Ingresa una letra (ej. M)';
        input.maxLength = 1;
        actualizarBanner('Modo Letras activo. Lienzo limpio: ingresa letras o usa "⚡ Ejemplo Rápido".', '#38bdf8');
    }

    input.value = '';
    document.getElementById('consolaSalida').textContent = 'Esperando operaciones en el árbol...';
    actualizarPanelMetricasSimulador();
}

// Actualiza los contadores de Grado, Nivel, Altura y Orden en la barra superior
// Actualiza los contadores de Grado, Nivel, Altura y Orden en la barra superior
function actualizarPanelMetricasSimulador() {
    document.getElementById('lblGradoArbol').textContent = arbolSimulador.obtenerGrado();
    document.getElementById('lblNivelArbol').textContent = arbolSimulador.obtenerNivelMaximo();
    document.getElementById('lblAlturaArbol').textContent = arbolSimulador.obtenerAltura();
    document.getElementById('lblOrdenArbol').textContent = arbolSimulador.obtenerOrden();
}

// Verifica que el usuario ingrese enteros sin decimales o letras válidas según el modo activo
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

// Evento del botón Insertar
function accionInsertar() {
    const input = document.getElementById('inputValor');
    const valorValidado = validarYNormalizarEntrada(input.value);
    if (valorValidado === null) return;

    input.value = '';
    const pasos = arbolSimulador.insertarConPasos(valorValidado);
    actualizarPanelMetricasSimulador();
    iniciarConsolaConTitulo('INSERTANDO:');
    agregarChipConsola(valorValidado, false);
    reproducirAnimacionPasos(pasos, false);
}

// Evento del botón Buscar
function accionBuscar() {
    const input = document.getElementById('inputValor');
    const valorValidado = validarYNormalizarEntrada(input.value);
    if (valorValidado === null) return;

    if (!arbolSimulador.raiz) {
        actualizarBanner('El árbol está vacío. Inserta elementos primero.', '#ef4444');
        return;
    }
    const pasos = arbolSimulador.buscarConPasos(valorValidado);
    iniciarConsolaConTitulo(`BUSCANDO '${valorValidado}':`);
    reproducirAnimacionPasos(pasos, true);
}

// Evento del botón Eliminar
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
    iniciarConsolaConTitulo(`ELIMINANDO '${valorValidado}':`);

    reproducirAnimacionPasos(pasosBusqueda, true, () => {
        const ultimoPaso = pasosBusqueda[pasosBusqueda.length - 1];
        if (ultimoPaso && ultimoPaso.encontrado) {
            arbolSimulador.eliminar(valorValidado);
            limpiarResaltadosSimulador();
            actualizarPanelMetricasSimulador();
            actualizarBanner(`Nodo '${valorValidado}' eliminado y árbol reestructurado.`, '#10b981');
            iniciarConsolaConTitulo('ELIMINADO:');
            agregarChipConsola(valorValidado, false);
        }
    });
}

// Ejecuta la animación paso a paso de los recorridos Preorden, Inorden o Postorden
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

    iniciarConsolaConTitulo(`${tipo}:`);
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
                agregarChipConsola(paso.consola, false);
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

// Reproduce la animación de inserción o búsqueda usando un temporizador
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
                    agregarChipConsola(paso.nodo.dato, i < pasos.length - 1);
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

// Detiene cualquier temporizador de animación activo
function detenerAnimacion() {
    if (intervaloAnimacion) {
        clearInterval(intervaloAnimacion);
        intervaloAnimacion = null;
    }
}

// Quita los colores de resaltado y oculta la flecha
function limpiarResaltadosSimulador() {
    nodoPunteroActual = null;
    caminoResaltado = [];
    nodosProcesados = [];
    flechaAnimada.visible = false;
}

// Vacía por completo el árbol actual del simulador
function limpiarSimulador() {
    detenerAnimacion();
    arbolSimulador.raiz = null;
    limpiarResaltadosSimulador();
    actualizarPanelMetricasSimulador();
    actualizarBanner('Lienzo limpio. Ingresa valores o presiona "⚡ Ejemplo Rápido".', '#38bdf8');
    document.getElementById('consolaSalida').textContent = 'Esperando operaciones en el árbol...';
}

// Genera un árbol con valores al azar según el modo activo (Números o Letras)
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
        while (usados.size < cantidadNodos) {
            const letra = ALFABETO_ESP[Math.floor(Math.random() * ALFABETO_ESP.length)];
            if (!usados.has(letra)) {
                usados.add(letra);
                arbolSimulador.insertarConPasos(letra);
                generados.push(letra);
            }
        }
    }

    actualizarPanelMetricasSimulador();
    actualizarBanner(`Árbol aleatorio generado (${generados.join(', ')}). ¡Prueba los recorridos!`, '#10b981');
    iniciarConsolaConTitulo('GENERADOS:');
    generados.forEach(g => agregarChipConsola(g, false));
}

// Cambia el mensaje y color del banner informativo del simulador
function actualizarBanner(texto, colorBorde) {
    const banner = document.getElementById('bannerEstado');
    banner.textContent = texto;
    banner.style.borderLeftColor = colorBorde;
}