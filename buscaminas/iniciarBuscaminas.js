function validacionNumeros() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);

    if (!isNaN(filas) && !isNaN(columnas) && filas > 0 && columnas > 0) {
        generarTableroJS(filas, columnas);
        generarMinas();
        numeroMinasCercanas();
    } else {
        alert("Por favor, introduzca valores válidos para filas y columnas.");
    }
}

function generarTableroJS(filas, columnas) {
    let tabla = document.getElementById("tabla");
    let html = "";

    for (let i = 0; i < filas; i++) {
        html += "<tr>";
        for (let j = 0; j < columnas; j++) {
            html += "<td class='oculto' onclick='clicIzquierdo(this)' oncontextmenu='clicDerecho(event, this)'></td>";
        }
        html += "</tr>";
    }

    tabla.innerHTML = html;
}

function generarMinas() {
    let porcentajeMinas = document.querySelector('input[name="dificultad"]:checked').value;
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    let tabla = document.getElementById("tabla");
    let totalCeldas = filas * columnas;
    let totalMinas = Math.ceil((porcentajeMinas / 100) * totalCeldas);

    for (let cont = 0; cont < totalMinas; ) {
        let ejex = Math.floor(Math.random() * filas) + 1;
        let ejey = Math.floor(Math.random() * columnas) + 1;
        let celdaSeleccionada = document.querySelector("#tabla tr:nth-child(" + ejex + ") td:nth-child(" + ejey + ")");

        if (!celdaSeleccionada.classList.contains('mina')) {
            celdaSeleccionada.classList.add("mina");
            console.log("mina colocada");
            cont++;
        }
    }
}

function numeroMinasCercanas() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);

    for (let i = 1; i <= filas; i++) {
        for (let j = 1; j <= columnas; j++) {
            let celdaSeleccionada = document.querySelector("#tabla tr:nth-child(" + i + ") td:nth-child(" + j + ")");

            if (!celdaSeleccionada.classList.contains('mina')) {
                let minasVecinas = 0;

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        let filaVecina = i + x;
                        let columnaVecina = j + y;
                        let celdaVecina = document.querySelector("#tabla tr:nth-child(" + filaVecina + ") td:nth-child(" + columnaVecina + ")");

                        if (celdaVecina && celdaVecina.classList.contains('mina')) {
                            minasVecinas++;
                        }
                    }
                }

                celdaSeleccionada.textContent = minasVecinas;
            }
        }
    }
}

function clicIzquierdo(celda) {
    if (!celdaSeleccionada.classList.contains('mina')) {
        numeroMinasCercanas()
    }
}

function clicDerecho(event, celda) {
    event.preventDefault();

    if (!celda.classList.contains('descubierta')) {
        if (!celda.classList.contains('bandera')) {
            celda.classList.add('bandera');
        } else {
            celda.classList.remove('bandera');
        }
    }
}

    function revelarCasillasVecinas(celda) {
        let fila = celda.parentNode.rowIndex + 1;
        let columna = celda.cellIndex + 1;
        let filas = document.getElementById("tabla").rows.length;
        let columnas = document.getElementById("tabla").rows[0].cells.length;

        for (let i = fila - 1; i <= fila + 1; i++) {
            for (let j = columna - 1; j <= columna + 1; j++) {
                if (i > 0 && i <= filas && j > 0 && j <= columnas) {
                    let celdaVecina = document.querySelector("#tabla tr:nth-child(" + i + ") td:nth-child(" + j + ")");
                    if (!celdaVecina.classList.contains('descubierta')) {
                        clicIzquierdo(celdaVecina);
                    }
                }
            }
        }
    }
