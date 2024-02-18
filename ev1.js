// declaro las variables
const DIRECCION = ["N", "S", "O", "E"];
let ruta = [];
let minutos;

// Solicitar el número de minutos entre 6 y 16
do {
    minutos = Number(prompt("Ingresa el número de minutos que dispones entre 6 y 16:"));

    // Verificar si los valores son números válidos y dentro del rango
    if (isNaN(minutos) || minutos < 6 || minutos > 16) {
        alert("Por favor, introduce un número entre 6 y 16.");
    }
} while (isNaN(minutos) || minutos < 6 || minutos > 16);

// Generar la mitad de la ruta hacia adelante
for (let index = 0; index < minutos / 2; index++) {
    let randomDirection = Math.floor(Math.random() * 4);
    ruta.push(DIRECCION[randomDirection]);
}

// Generar la otra mitad de la ruta hacia atrás para regresar al punto inicial
ruta = ruta.concat(ruta.map(direction => {
    if (direction === "N") return "S";
    if (direction === "S") return "N";
    if (direction === "O") return "E";
    if (direction === "E") return "O";
}));

console.log(ruta.join(", "));
