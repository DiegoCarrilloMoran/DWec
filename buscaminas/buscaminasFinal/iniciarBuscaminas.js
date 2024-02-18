document.addEventListener("DOMContentLoaded", () => {
  // Selectores
  const contenedorJuego = document.querySelector(".contenedor-juego");
  const juego = document.querySelector(".juego");
  const resultado = document.querySelector(".resultado-juego");
  const contadorBanderas = document.getElementById("num-banderas");
  const contadorBanderasRes = document.getElementById("banderas-restantes");
  const botonGenerar = document.querySelector(".generar-juego");
  const tabla = document.querySelector(".tabla");

  //evento de inicio del juego
  botonGenerar.addEventListener("click", dibujarTableroHTML);

  // Variables globales
  let filas;
  let columnas;
  let dificultad;
  let numMinas; // Número de Minas, redondeamos hacia arriba
  let numBanderas = 0; // Número de banderas marcadas
  let minasCorrectas = 0;
  let finPartida = false; // fin de partida victoria o derrota

  function dibujarTableroHTML() {
      // Eliminamos la clase 'hidden' si está presente
      if (contenedorJuego.classList.contains("hidden")) {
          contenedorJuego.classList.remove("hidden");
      }
      // Si no está oculto, limpiamos el juego y restablecemos las variables, es decir preparamos todo para la siguiente partida
      juego.innerHTML = "";
      resultado.innerHTML = "";
      resultado.className = "resultado-juego";
      finPartida = false;
      numBanderas = 0;
      minasCorrectas = 0;

      // valores actuales de filas, columnas y dificultad
      filas = parseInt(document.getElementById("filas").value);
      columnas = parseInt(document.getElementById("columnas").value);
      dificultad = parseInt(document.querySelector('input[name="dificultad"]:checked').value);

      // Calcular el número de minas
      numMinas = calcularNumMinas(filas, columnas, dificultad);

      // Generamos la tabla y minas
      generarTableroJS(filas, columnas);
      generarMinas();
  }

  // generacion de tabla
  function generarTableroJS(filas, columnas) {
      let tablaHTML = "<table id='tabla'>";

      for (let i = 0; i < filas; i++) {
          tablaHTML += "<tr>";
          for (let j = 0; j < columnas; j++) {
              tablaHTML += `<td id="${i}-${j}"></td>`;
          }
          tablaHTML += "</tr>";
      }

      tablaHTML += "</table>";
      juego.innerHTML = tablaHTML; //tabla al contenedor del juego

      // agregar eventos a las celdas
      const celdas = document.querySelectorAll("td");
      celdas.forEach((celda) => {
          celda.addEventListener("click", function (event) {
              //  el clic izquierdo
              if (!finPartida) clicIzquierdo(this);
          });

          celda.addEventListener("contextmenu", function (event) {
              //  el clic derecho
              event.preventDefault();
              if (!finPartida) clicDerecho(this);
          });
      });
  }

  // calcular el número de minas
  function calcularNumMinas(filas, columnas, dificultad) {
      return Math.ceil((dificultad / 100) * (filas * columnas));
  }

  // Colocación de minas de manera aleatoria en el tablero
  function generarMinas() {
      for (let cont = 0; cont < numMinas; ) {
          let ejex = Math.floor(Math.random() * filas);
          let ejey = Math.floor(Math.random() * columnas);
          let celdaSeleccionada = document.getElementById(`${ejex}-${ejey}`);

          // Si la mina existe no repetir
          if (!celdaSeleccionada.classList.contains("mina")) {
              celdaSeleccionada.classList.add("mina");
              cont++;
          }
      }
  }

  // clic izquierdo
  function clicIzquierdo(celda) {
      // Verificacion de clases existenetes
      if (
          celda.classList.contains("vista") ||
          celda.classList.contains("bandera") ||
          celda.classList.contains("revelado")
      ) {
          return;
      }

      // si la clase 'mina' existe en la celda
      if (celda.classList.contains("mina")) {
          // Acción si la clase 'mina' existe
          derrota();
      } else {
          // clase 'mina' no existe
          const numMinasVecinas = contarMinasVecinas(celda); 
          celda.textContent = numMinasVecinas;
          celda.classList.add("vista");
          // numero de minas vecinas es cero
          if (numMinasVecinas === 0) {
              //revelar las casillas vecinas
              revelarCasillasVecinas(celda);
          }
      }
  }

  function clicDerecho(celda) {
      //condicion de funcion
      if (resultado.classList.contains("derrota") || celda.classList.contains("vista")) {
          return; // nada
      }

      //condicion clase bandera existe en la celda
      if (celda.classList.contains("bandera")) {
          // Si la clase bandera existe, quitar la bandera
          celda.classList.remove("bandera");
          celda.innerHTML = ""; // Eliminar el emoji
          numBanderas--; // Decrementar el contador de banderas
          //contador minas correctas condicion de vicotria
          if (celda.classList.contains("mina")) {
            minasCorrectas--
          }
      } else {
          // bandera no existe, colocar la bandera
          celda.classList.add("bandera");
          celda.innerHTML = "🚩"; // Agregar el emoji 
          numBanderas++; // Incrementar el contador de banderas
          //condicon de victoria
          if (celda.classList.contains("mina")) {
            minasCorrectas++
          }
      }

      // Actualizar el número de banderas colocadas
      contadorBanderas.textContent = numBanderas;

      // Calcular y actualizar el número de banderas restantes
      const banderasRestantes = numMinas - numBanderas;
      contadorBanderasRes.textContent = banderasRestantes;

      // Verificar si el número de minas correctas es igual al número total de minas
      if (minasCorrectas === numMinas) {
          // Si son iguales, activar la función de victoria
          victoria();
      }
  }

  // Función para contar el número de minas vecinas a una celda dada
  function contarMinasVecinas(celda) {
      // Obtener las coordenadas de la celda actual
      const [fila, columna] = celda.id.split("-").map(Number);
      let contador = 0;

      // Iterar sobre las casillas vecinas
      for (let i = fila - 1; i <= fila + 1; i++) {
          for (let j = columna - 1; j <= columna + 1; j++) {
              // Verificar si la celda vecina es una mina y existe
              if (
                  document.getElementById(`${i}-${j}`) &&
                  document.getElementById(`${i}-${j}`).classList.contains("mina")
              ) {
                  contador++;
              }
          }
      }

      return contador;
  }

  // Función para revelar las casillas vecinas cuando se hace clic en una casilla vacía
  function revelarCasillasVecinas(celda) {
      // Obtener las coordenadas de la celda actual
      const [fila, columna] = celda.id.split("-").map(Number);
      // Iterar sobre las casillas vecinas
      for (let i = fila - 1; i <= fila + 1; i++) {
          for (let j = columna - 1; j <= columna + 1; j++) {
              // Obtener la celda vecina
              const celdaVecina = document.getElementById(`${i}-${j}`);
              // Verificar si la celda vecina existe y no está revelada ni tiene bandera
              if (
                  celdaVecina &&
                  !celdaVecina.classList.contains("revelado") &&
                  !celdaVecina.classList.contains("bandera")
              ) {
                  // Revelar la celda vecina
                  clicIzquierdo(celdaVecina);
              }
          }
      }
  }

  // funcion derrota
  function derrota() {
      // todas las celdas de la tabla
      const celdas = document.querySelectorAll("td");

      // Iterar sobre todas las celdas
      celdas.forEach((celda) => {
          // Si la celda es una mina, revelarla y mostrar el icono de bomba
          if (celda.classList.contains("mina")) {
              celda.classList.add("revelado");
              celda.innerHTML = "💣"; // Mostrar el icono de bomba
          }

          // Marcar todas las celdas como reveladas para evitar seguir jugando
          celda.classList.add("revelado");
          celda.classList.add("derrota"); // Aplicar la clase derrota a todas las celdas
      });

      // Mostrar mensaje de derrota
      resultado.textContent = "¡Has perdido!";
      resultado.classList.add("derrota");
      finPartida = true; // Marcar el fin de la partida
  }

  // Función de victoria
  function victoria() {
      // Mostrar mensaje de victoria
      resultado.textContent = "¡Has ganado!";
      resultado.classList.add("victoria");
      finPartida = true; // Marcar el fin de la partida
  }
});
