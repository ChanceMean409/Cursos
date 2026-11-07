// Textos explicativos de cada tarjeta del Glosario (Módulo 2)
const diccionarioTeoria = {
    raiz: {
        titulo: '👑 Nodo Raíz',
        texto: 'Es el nodo superior donde comienza el árbol (color Azul Cian). No tiene padre y su nivel siempre es 0. En el diagrama de abajo, el nodo 50 es la Raíz.'
    },
    padres: {
        titulo: '🧭 Nodos Padres',
        texto: 'Son los nodos que tienen al menos un hijo conectado debajo de ellos (color Violeta). En el ejemplo, el 50 es padre de 30 y 70, y el 30 es padre de 20 y 40.'
    },
    hijos: {
        titulo: '🌱 Nodos Hijos',
        texto: 'Son los nodos que descienden directamente de un nodo padre. Cada nodo puede tener como máximo dos hijos: Izquierdo (menores) y Derecho (mayores o iguales).'
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

// Cambia el concepto activo cuando el usuario selecciona una tarjeta del glosario
function mostrarConcepto(clave, tarjetaElemento) {
    conceptoTeoriaActivo = clave;
    contadorFramesTeoria = 0;
    document.querySelectorAll('.tarjeta-concepto').forEach(t => t.classList.remove('activa'));
    tarjetaElemento.classList.add('activa');

    document.getElementById('tituloConcepto').textContent = diccionarioTeoria[clave].titulo;
    document.getElementById('textoConcepto').textContent = diccionarioTeoria[clave].texto;
}

// Dibuja el árbol demostrativo del glosario y resalta los nodos según el tema seleccionado
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