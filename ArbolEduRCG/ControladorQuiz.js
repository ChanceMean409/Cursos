// Variables de configuración y estado del Quiz (Módulo 3)
const arbolQuiz = new ArbolBinario('NUMEROS');

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

// Regresa a la pantalla de configuración inicial del Quiz
function volverAConfiguracionQuiz() {
    detenerRelojQuiz();
    document.getElementById('modalResumenWordle').classList.add('oculto');
    document.getElementById('quizContenidoActivo').classList.add('oculto');
    document.getElementById('quizLobby').classList.remove('oculto');
}

// Cierra la ventana emergente de resultados
function cerrarModalResumen() {
    document.getElementById('modalResumenWordle').classList.add('oculto');
}

// Valida las opciones elegidas por el usuario e inicia el cuestionario
function iniciarQuizPersonalizado() {
    const inputPreguntas = document.getElementById('cfgNumPreguntas');
    const cajaErrorConfig = document.getElementById('errorConfigQuiz');
    const textoCant = inputPreguntas.value.trim();

    // Verifica que sea un entero válido sin modificar el valor escrito
    if (!/^\d+$/.test(textoCant)) {
        cajaErrorConfig.textContent = '⚠️ Error: Ingresa un número entero válido entre 1 y 20 en la cantidad de preguntas para poder iniciar el Quiz.';
        cajaErrorConfig.classList.remove('oculto');
        inputPreguntas.classList.add('input-error');
        return;
    }

    // Si es mayor a 20 o menor a 1, muestra error, conserva el número y no inicia el Quiz
    const numInput = parseInt(textoCant, 10);
    if (numInput > 20 || numInput < 1) {
        cajaErrorConfig.textContent = `⚠️ Error: Ingresaste "${textoCant}" preguntas. El límite permitido es de 1 a 20 preguntas. Corrige el número indicado arriba para poder iniciar el Quiz.`;
        cajaErrorConfig.classList.remove('oculto');
        inputPreguntas.classList.add('input-error');
        return;
    }

    cajaErrorConfig.classList.add('oculto');
    inputPreguntas.classList.remove('input-error');

    detenerRelojQuiz();
    document.getElementById('modalResumenWordle').classList.add('oculto');

    modoEvaluacionConfig = document.getElementById('cfgModoEvaluacion').value;
    totalPreguntasConfig = numInput;
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

// Crea un árbol aleatorio nuevo para la pregunta actual según la dificultad elegida
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
        while (usados.size < cantidad) {
            const l = ALFABETO_ESP[Math.floor(Math.random() * ALFABETO_ESP.length)];
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

// Muestra los segundos restantes en el marcador
function actualizarEtiquetaReloj() {
    document.getElementById('lblTiempoQuiz').textContent = `${segundosRestantesPregunta}s`;
}

// Detiene el temporizador del modo contra reloj
function detenerRelojQuiz() {
    if (timerRelojQuiz) {
        clearInterval(timerRelojQuiz);
        timerRelojQuiz = null;
    }
}

// Obtiene la cadena de texto con la solución correcta del recorrido pedido
function obtenerRespuestaCorrectaRecorrido() {
    let pasos = [];
    if (recorridoQuizActual === 'PREORDEN') pasos = arbolQuiz.obtenerPasosPreorden();
    if (recorridoQuizActual === 'INORDEN') pasos = arbolQuiz.obtenerPasosInorden();
    if (recorridoQuizActual === 'POSTORDEN') pasos = arbolQuiz.obtenerPasosPostorden();
    return pasos.filter(p => p.procesar).map(p => p.consola).join(' ');
}

// Compara las respuestas del usuario con los datos reales del árbol y avanza de pregunta
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

// Muestra una alerta cuando faltan campos por llenar en la pregunta actual
function mostrarAvisoIncompletoQuiz(mensaje) {
    const cajaFeedback = document.getElementById('feedbackQuiz');
    cajaFeedback.classList.remove('oculto', 'correcto');
    cajaFeedback.classList.add('incorrecto');
    cajaFeedback.textContent = mensaje;
}

// Construye y muestra el resumen final de aciertos y errores al terminar el Quiz
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

// Bucle gráfico continuo que refresca el lienzo del Simulador y del Glosario
function bucleAnimacionGeneral() {
    dibujarArbolEnCanvas('canvasSimulador', 'contenedorCanvasSimulador', arbolSimulador, nodoPunteroActual, caminoResaltado, true);
    dibujarGlosarioAdaptativo();
    requestAnimationFrame(bucleAnimacionGeneral);
}

// Redibuja el árbol del Quiz cuando cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    if (!document.getElementById('quizContenidoActivo').classList.contains('oculto')) {
        dibujarArbolEnCanvas('canvasQuiz', 'contenedorCanvasQuiz', arbolQuiz, null, [], false);
    }
});

// Inicializa las métricas y arranca el ciclo de dibujo al cargar la página
window.onload = () => {
    actualizarPanelMetricasSimulador();
    bucleAnimacionGeneral();
};