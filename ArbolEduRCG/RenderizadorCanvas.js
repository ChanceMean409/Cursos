// Ajusta la resolución del canvas según la pantalla del dispositivo (PC o celular)
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

// Asigna una columna horizontal única a cada nodo usando orden Inorden para que no se encimen
function asignarCoordenadasSinTraslape(raiz) {
    let columnaExclusiva = 0;
    const ANCHO_COLUMNA_X = 64;
    const ALTO_NIVEL_Y = 82;

    function asignarInordenPuro(nodo, nivel) {
        if (!nodo) return;
        asignarInordenPuro(nodo.izquierdo, nivel + 1);
        nodo.lx = columnaExclusiva * ANCHO_COLUMNA_X;
        nodo.ly = nivel * ALTO_NIVEL_Y;
        columnaExclusiva++;
        asignarInordenPuro(nodo.derecho, nivel + 1);
    }

    asignarInordenPuro(raiz, 0);
}

// Centra y escala automáticamente el árbol para que siempre quepa dentro del canvas
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

// Función principal que dibuja enlaces, nodos y la flecha animada en el canvas indicado
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

// Recorre el árbol para trazar las líneas que conectan padres con hijos
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

// Dibuja una línea entre dos nodos y la resalta en amarillo si es parte del recorrido activo
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

// Define el color del nodo según su función: Azul (Raíz), Verde (Hoja) o Violeta (Padre)
function obtenerEstiloPedagogicoNodo(nodo, raizArbol) {
    if (nodo === raizArbol) {
        return { relleno: '#0284c7', borde: '#38bdf8' };
    }
    if (nodo.izquierdo === null && nodo.derecho === null) {
        return { relleno: '#059669', borde: '#34d399' };
    }
    return { relleno: '#6366f1', borde: '#a5b4fc' };
}

// Dibuja el círculo y el texto de cada nodo de forma recursiva
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

// Dibuja y mueve suavemente la flecha indicadora sobre el nodo que se está visitando
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