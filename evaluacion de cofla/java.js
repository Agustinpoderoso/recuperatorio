const board =
document.getElementById("board");

const turnoTexto =
document.getElementById("turno");

const reiniciarBtn =
document.getElementById("reiniciar");

const chess = new Chess();

let selectedSquare = null;

// PIEZAS

const piezas = {

  // negras
  p:"♟",
  r:"♜",
  n:"♞",
  b:"♝",
  q:"♛",
  k:"♚",

  // blancas
  P:"♙",
  R:"♖",
  N:"♘",
  B:"♗",
  Q:"♕",
  K:"♔"
};

// DIBUJAR TABLERO

function dibujarTablero(){

  board.innerHTML = "";

  const posicion = chess.board();

  for(let fila = 0; fila < 8; fila++){

    for(let col = 0; col < 8; col++){

      const square =
      document.createElement("div");

      square.classList.add("square");

      // COLOR TABLERO

      const color =
      (fila + col) % 2 === 0
      ? "white"
      : "black";

      square.classList.add(color);

      // CASILLA

      const casilla =
      String.fromCharCode(97 + col)
      + (8 - fila);

      square.dataset.square = casilla;

      // PIEZA

      const pieza =
      posicion[fila][col];

      if(pieza){

        const simbolo =
        pieza.color === "w"
        ? piezas[pieza.type.toUpperCase()]
        : piezas[pieza.type];

        const piezaHTML =
        document.createElement("div");

        piezaHTML.classList.add("piece");

        piezaHTML.textContent = simbolo;

        piezaHTML.draggable = true;

        // COLOR PIEZAS

        if(pieza.color === "w"){

          piezaHTML.style.color = "#ffffff";

          piezaHTML.style.textShadow =
          `
          0 0 4px #000,
          0 0 8px rgba(255,255,255,0.5)
          `;

        }else{

          piezaHTML.style.color = "#111111";

          piezaHTML.style.textShadow =
          `
          0 0 3px rgba(255,255,255,0.2)
          `;
        }

        // EMPEZAR A ARRASTRAR

        piezaHTML.addEventListener(
          "dragstart",
          (e) => {

            selectedSquare = casilla;

            mostrarMovimientos(casilla);

            e.dataTransfer.setData(
              "text/plain",
              casilla
            );
          }
        );

        square.appendChild(piezaHTML);
      }

      // SOLTAR PIEZA

      square.addEventListener(
        "dragover",
        (e) => {

          e.preventDefault();
        }
      );

      square.addEventListener(
        "drop",
        (e) => {

          e.preventDefault();

          const from =
          e.dataTransfer.getData(
            "text/plain"
          );

          moverPieza(from, casilla);
        }
      );

      // CLICK NORMAL

      square.addEventListener(
        "click",
        () => clickCasilla(casilla)
      );

      board.appendChild(square);
    }
  }

  actualizarTurno();
}

// MOVER PIEZA

function moverPieza(from, to){

  limpiarMovimientos();

  const move = chess.move({

    from:from,
    to:to,
    promotion:"q"
  });

  selectedSquare = null;

  if(move){

    reproducirSonido();

    if(chess.in_checkmate()){

      setTimeout(() => {

        alert("♚ JAQUE MATE");

      },100);

    }else if(chess.in_draw()){

      setTimeout(() => {

        alert("Empate");

      },100);
    }
  }

  dibujarTablero();
}

// CLICK CASILLA

function clickCasilla(casilla){

  limpiarMovimientos();

  if(selectedSquare){

    moverPieza(
      selectedSquare,
      casilla
    );

  }else{

    selectedSquare = casilla;

    mostrarMovimientos(casilla);
  }
}

// MOSTRAR MOVIMIENTOS

function mostrarMovimientos(casilla){

  const movimientos =
  chess.moves({

    square:casilla,
    verbose:true
  });

  movimientos.forEach(move => {

    const square =
    document.querySelector(
      `[data-square="${move.to}"]`
    );

    if(square){

      square.classList.add(
        "possible-move"
      );
    }
  });

  // PIEZA SELECCIONADA

  const seleccionada =
  document.querySelector(
    `[data-square="${casilla}"]`
  );

  if(seleccionada){

    seleccionada.classList.add(
      "selected"
    );
  }
}

// LIMPIAR

function limpiarMovimientos(){

  document
  .querySelectorAll(".possible-move")
  .forEach(square => {

    square.classList.remove(
      "possible-move"
    );
  });

  document
  .querySelectorAll(".selected")
  .forEach(square => {

    square.classList.remove(
      "selected"
    );
  });
}

// ACTUALIZAR TURNO

function actualizarTurno(){

  turnoTexto.textContent =
  "Turno: " +

  (chess.turn() === "w"
  ? "Blancas"
  : "Negras");
}

// SONIDO

function reproducirSonido(){

  const audio = new Audio(
    "https://www.soundjay.com/buttons/sounds/button-16.mp3"
  );

  audio.volume = 0.3;

  audio.play();
}

// REINICIAR

reiniciarBtn.addEventListener(
  "click",
  () => {

    chess.reset();

    limpiarMovimientos();

    dibujarTablero();
  }
);

// INICIAR

dibujarTablero();