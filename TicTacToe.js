function registerevent() {
  const sizeSelection = document.getElementById("size");
  const gamaOptionElement = document.getElementsByName("gameOption");
  const gameButton = document.getElementById("game");
  sizeSelection.addEventListener("change", getSize);
  for (let index = 0; index < gamaOptionElement.length; index++) {
    const radioElement = gamaOptionElement[index];
    radioElement.addEventListener("change", displaysDifficultyLevel);
  }
  gameButton.addEventListener("click", startgame);
}

function addEventListeners(algoritem) {
  const clickedButtonsGameElement = document.getElementsByClassName("button");
  for (let index = 0; index < clickedButtonsGameElement.length; index++) {
    const button = clickedButtonsGameElement[index];
    button.addEventListener("click", algoritem);
  }
}

function displaysDifficultyLevel(event) {
  clearBorder();
  const difficulty = document.getElementById("difficulty");
  const radioSelect = event.target;
  if (radioSelect.value === "alone") {
    difficulty.style.display = "none";
  } else {
    difficulty.style.display = "block";
    difficulty.addEventListener("change", getDifficultySelection);
  }
}

function getDifficultySelection(event) {
  clearBorder();
  const selectElement = event.target;
  let option;
  for (let index = 0; index < selectElement.options.length; index++) {
    if (selectElement.options[index].selected) {
      option = selectElement.options[index];
    }
  }
  setDifficulty(option);
}

let difficulty = 1;
function setDifficulty(select) {
  if (select.value === "regular") {
    difficulty = 2;
  } else {
    difficulty = 1;
  }
}

function getSize(event) {
  clearBorder();
  const selectElement = event.target;
  for (let index = 0; index < selectElement.options.length; index++) {
    const option = selectElement.options[index];
    if (option.selected) {
      setSize(index + 1);
    }
  }
}
function alertMe(event) {
  const buttonElement = event.target;
  const buttonRow = buttonElement.parentElement.name;
  const buttonCol = buttonElement.name;
  console.log("[" + buttonRow + "," + buttonCol + "]");
}

function alertbutton(button) {
  const buttonRow = button.parentElement.name;
  const buttonCol = button.name;
  console.log("[" + buttonRow + "," + buttonCol + "]");
}

let thereIsAWin = false;
let playerIsX = true;
let xChar = "X";
let oChar = "O";
function handleUserTurn(event) {
  const buttonElement = event.target;
  const buttonRow = buttonElement.parentElement.name;
  const buttonCol = buttonElement.name;
  let cell = matrix[buttonRow][buttonCol];
  if (!thereIsAWin) {
    if (cell === undefined) {
      if (playerIsX) {
        buttonElement.innerHTML = xChar;
        matrix[buttonRow][buttonCol] = xChar;
      } else {
        buttonElement.innerHTML = oChar;
        matrix[buttonRow][buttonCol] = oChar;
      }
      setButton(buttonElement);
      checkFullLine(buttonElement.parentElement);
      isItAWin(playerIsX);
      playerIsX = !playerIsX;
    }
  }
}

function playBotPlayer(event) {
  if (difficulty === 1) {
    easyBotPlayer(event);
  } else {
    regularBotPlayer(event);
  }
}

function easyBotPlayer(event) {
  playUserTurn(event);
  const borderElement = document.getElementById("border");
  let lastPlay = borderElement.childNodes[lastRowPlay].childNodes[lastColPlay];
  while (!playerIsX && !thereIsAWin && !itIsATie) {
    if (!aBotAlmostWins(lastPlay)) {
      row = randomNumber();
      col = randomNumber();
      while (matrix[row][col] !== undefined) {
        row = randomNumber();
        col = randomNumber();
      }
      const button = borderElement.childNodes[row].childNodes[col];
      matrix[row][col] = oChar;
      button.innerHTML = oChar;
      lastRowPlay = row;
      lastColPlay = col;
      setButton(button);
      checkFullLine(button.parentElement);
      isItAWin(playerIsX);
      playerIsX = !playerIsX;
    }
  }
}

let lastRowPlay = 0;
let lastColPlay = 0;
function regularBotPlayer(event) {
  playUserTurn(event);
  const borderElement = document.getElementById("border");
  let lastPlay = borderElement.childNodes[lastRowPlay].childNodes[lastColPlay];
  if (!playerIsX && !thereIsAWin && !itIsATie) {
    if (!aBotAlmostWins(lastPlay)) {
      if (!aPlayerFillARow(borderElement)) {
        if (!aPlayerFillACol(borderElement)) {
          if (!aPlayerFillDiagonally(borderElement)) {
            if (!aPlayerFillInReverseDiagonally(borderElement)) {
              row = randomNumber();
              col = randomNumber();
              while (matrix[row][col] !== undefined) {
                row = randomNumber();
                col = randomNumber();
              }
              const button = borderElement.childNodes[row].childNodes[col];
              matrix[row][col] = oChar;
              button.innerHTML = oChar;
              lastRowPlay = row;
              lastColPlay = col;
              setButton(button);
              checkFullLine(button.parentElement);
              isItAWin(playerIsX);
              playerIsX = !playerIsX;
            }
          }
        }
      }
    }
  }
}

function aBotAlmostWins(button) {
  if (!almostWinsInARow(button)) {
    if (!almostWinsInACol(button)) {
      if (!almostWinsInADiagonal(button)) {
        if (!almostWinsInAReverseDiagonal(button)) {
          return false;
        }
      }
    }
  }
  return true;
}

function almostWinsInARow(button) {
  const rowElement = button.parentElement;
  let oCounter = 0;
  let rowKeeper = rowElement.name;
  let colKeeper = 0;
  for (let col = 0; col < xMax; col++) {
    if (matrix[rowKeeper][col] === oChar) {
      oCounter++;
    } else {
      colKeeper = col;
    }
  }
  if (oCounter === xMax - 1) {
    if (matrix[rowKeeper][colKeeper] === undefined) {
      const button = rowElement.childNodes[colKeeper];
      matrix[rowKeeper][colKeeper] = oChar;
      button.innerHTML = oChar;
      lastRowPlay = rowKeeper;
      lastColPlay = colKeeper;
      setButton(button);
      checkFullLine(rowElement);
      isItAWin(playerIsX);
      playerIsX = !playerIsX;
      return true;
    }
  }
}

function almostWinsInACol(button) {
  const borderElement = button.parentElement.parentElement;
  let oCounter = 0;
  let rowKeeper = 0;
  let colKeeper = button.name;
  for (let row = 0; row < yMax; row++) {
    if (matrix[row][colKeeper] === oChar) {
      oCounter++;
    } else {
      rowKeeper = row;
    }
  }
  if (oCounter === xMax - 1) {
    if (matrix[rowKeeper][colKeeper] === undefined) {
      const button = borderElement.childNodes[rowKeeper].childNodes[colKeeper];
      matrix[rowKeeper][colKeeper] = oChar;
      button.innerHTML = oChar;
      setButton(button);
      checkFullLine(button.parentElement);
      isItAWin(playerIsX);
      playerIsX = !playerIsX;
      return true;
    }
  }
}

function almostWinsInADiagonal(button) {
  const rowElement = button.parentElement.name;
  const colElement = parseInt(button.name);
  if (rowElement === colElement) {
    const borderElement = button.parentElement.parentElement;
    let oCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let row = 0; row < yMax; row++) {
      if (matrix[row][row] === oChar) {
        oCounter++;
      } else {
        rowKeeper = row;
        colKeeper = row;
      }
    }
    if (oCounter === xMax - 1) {
      if (matrix[rowKeeper][colKeeper] === undefined) {
        const button =
          borderElement.childNodes[rowKeeper].childNodes[colKeeper];
        matrix[rowKeeper][colKeeper] = oChar;
        button.innerHTML = oChar;
        setButton(button);
        checkFullLine(button.parentElement);
        isItAWin(playerIsX);
        playerIsX = !playerIsX;
        return true;
      }
    }
  }
}

function almostWinsInAReverseDiagonal(button) {
  const rowElement = button.parentElement.name;
  const colElement = parseInt(button.name);
  if (rowElement + colElement === xMax - 1) {
    const borderElement = button.parentElement.parentElement;
    let oCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let row = 0; row < yMax; row++) {
      if (matrix[row][yMax - (row + 1)] === oChar) {
        oCounter++;
      } else {
        rowKeeper = row;
        colKeeper = yMax - (row + 1);
      }
    }
    if (oCounter === xMax - 1) {
      if (matrix[rowKeeper][colKeeper] === undefined) {
        const button =
          borderElement.childNodes[rowKeeper].childNodes[colKeeper];
        matrix[rowKeeper][colKeeper] = oChar;
        button.innerHTML = oChar;
        setButton(button);
        checkFullLine(button.parentElement);
        isItAWin(playerIsX);
        playerIsX = !playerIsX;
        return true;
      }
    }
  }
}
let rowValue = 1;
function aPlayerFillARow(border) {
  if (rowValue !== 2520) {
    let xCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let row = 0; row < yMax; row++) {
      for (let col = 0; col < xMax; col++) {
        if (matrix[row][col] === xChar) {
          xCounter++;
        } else {
          rowKeeper = row;
          colKeeper = col;
        }
      }
      if (rowValue % (rowKeeper + 3) !== 0 && xCounter === xMax - 1) {
        if (matrix[rowKeeper][colKeeper] === undefined) {
          const button = border.childNodes[rowKeeper].childNodes[colKeeper];
          matrix[rowKeeper][colKeeper] = oChar;
          button.innerHTML = oChar;
          lastRowPlay = rowKeeper;
          lastColPlay = colKeeper;
          setButton(button);
          checkFullLine(button.parentElement);
          isItAWin(playerIsX);
          rowValue = rowValue * (rowKeeper + 3);
          playerIsX = !playerIsX;
          return true;
        }
      } else {
        xCounter = 0;
      }
    }
  }
}

let colValue = 1;
function aPlayerFillACol(border) {
  if (colValue !== 2520) {
    let xCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let col = 0; col < yMax; col++) {
      for (let row = 0; row < xMax; row++) {
        if (matrix[row][col] === xChar) {
          xCounter++;
        } else {
          rowKeeper = row;
          colKeeper = col;
        }
      }
      if (colValue % (colKeeper + 3) !== 0 && xCounter === xMax - 1) {
        if (matrix[rowKeeper][colKeeper] === undefined) {
          const button = border.childNodes[rowKeeper].childNodes[colKeeper];
          matrix[rowKeeper][colKeeper] = oChar;
          button.innerHTML = oChar;
          lastRowPlay = rowKeeper;
          lastColPlay = colKeeper;
          setButton(button);
          checkFullLine(button.parentElement);
          isItAWin(playerIsX);
          colValue = colValue * (colKeeper + 3);
          playerIsX = !playerIsX;
          return true;
        }
      } else {
        xCounter = 0;
      }
    }
  }
}
let diagonalIsChecked = false;
function aPlayerFillDiagonally(border) {
  if (!diagonalIsChecked) {
    let xCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let row = 0; row < yMax; row++) {
      if (matrix[row][row] === xChar) {
        xCounter++;
      } else {
        rowKeeper = row;
        colKeeper = row;
      }
    }
    if (xCounter === xMax - 1) {
      if (matrix[rowKeeper][colKeeper] === undefined) {
        const button = border.childNodes[rowKeeper].childNodes[colKeeper];
        matrix[rowKeeper][colKeeper] = oChar;
        button.innerHTML = oChar;
        lastRowPlay = rowKeeper;
        lastColPlay = colKeeper;
        setButton(button);
        checkFullLine(button.parentElement);
        isItAWin(playerIsX);
        diagonalIsChecked = true;
        playerIsX = !playerIsX;
        return true;
      }
    }
  }
}

let reversDiagonalIsChecked = false;
function aPlayerFillInReverseDiagonally(border) {
  if (!reversDiagonalIsChecked) {
    let xCounter = 0;
    let rowKeeper = 0;
    let colKeeper = 0;
    for (let row = 0; row < yMax; row++) {
      if (matrix[row][yMax - (row + 1)] === xChar) {
        xCounter++;
      } else {
        rowKeeper = row;
        colKeeper = yMax - (row + 1);
      }
    }
    if (xCounter === xMax - 1) {
      if (matrix[rowKeeper][colKeeper] === undefined) {
        const button = border.childNodes[rowKeeper].childNodes[colKeeper];
        matrix[rowKeeper][colKeeper] = oChar;
        button.innerHTML = oChar;
        lastRowPlay = rowKeeper;
        lastColPlay = colKeeper;
        setButton(button);
        checkFullLine(button.parentElement);
        isItAWin(playerIsX);
        reversDiagonalIsChecked = true;
        playerIsX = !playerIsX;
        return true;
      }
    }
  }
}

function playUserTurn(event) {
  const buttonElement = event.target;
  const buttonRow = buttonElement.parentElement.name;
  const buttonCol = buttonElement.name;
  let cell = matrix[buttonRow][buttonCol];
  if (!thereIsAWin) {
    while (cell === undefined && playerIsX) {
      buttonElement.innerHTML = xChar;
      matrix[buttonRow][buttonCol] = xChar;
      setButton(buttonElement);
      checkFullLine(buttonElement.parentElement);
      isItAWin(playerIsX);
      playerIsX = !playerIsX;
    }
  }
}

function checkFullLine(rowElement) {
  // console.log(rowElement.className+" "+rowElement.name);
  for (let col = 0; col < xMax; col++) {
    if (matrix[rowElement.name][col] === undefined) {
      return false;
    }
  }
  rowElement.style.position = "relative";
  rowElement.style.top = 23 + "px";
}

function setButton(button) {
  // const buttonElement= event.target;
  button.style.position = "relative";
  button.style.bottom = 23 + "px";
}

let itIsATie = false;
function isItAWin(playerIsX) {
  let player;
  if (playerIsX) {
    player = xChar;
  } else {
    player = oChar;
  }
  checkRowWin(player);
  checkColWin(player);
  checkDiagonalWin(player);
  checkInvertedDiagonalWin(player);
  if (theBoardIsFull() && !thereIsAWin) {
    itIsATie = true;
    showADraw();
  }
}
function theBoardIsFull() {
  for (let row = 0; row < yMax; row++) {
    for (let col = 0; col < xMax; col++) {
      if (matrix[row][col] === undefined) {
        return false;
      }
    }
  }

  return true;
}

function checkRowWin(char) {
  let progressCounter = 0;
  for (let row = 0; row < yMax; row++) {
    for (let col = 0; col < xMax; col++) {
      if (matrix[row][col] === char) {
        progressCounter++;
      } else {
        progressCounter = 0;
        break;
      }
    }
    if (progressCounter === yMax) {
      presentTheWinner(char);
    }
  }
}

function checkColWin(char) {
  let progressCounter = 0;
  for (let col = 0; col < xMax; col++) {
    for (let row = 0; row < yMax; row++) {
      if (matrix[row][col] === char) {
        progressCounter++;
      } else {
        progressCounter = 0;
        break;
      }
    }
    if (progressCounter === xMax) {
      presentTheWinner(char);
    }
  }
}

function checkDiagonalWin(char) {
  let progressCounter = 0;
  for (let index = 0; index < xMax; index++) {
    if (matrix[index][index] === char) {
      progressCounter++;
    } else {
      progressCounter = 0;
      break;
    }
  }
  if (progressCounter === xMax) {
    presentTheWinner(char);
  }
}

function checkInvertedDiagonalWin(char) {
  let progressCounter = 0;
  for (let row = 0; row < yMax; row++) {
    if (matrix[row][yMax - (row + 1)] === char) {
      progressCounter++;
    } else {
      progressCounter = 0;
      break;
    }
  }
  if (progressCounter === xMax) {
    presentTheWinner(char);
  }
}

let xMax = 3;
let yMax = 3;
let matrix;
function setSize(num) {
  xMax = 3;
  yMax = 3;
  if (!isNaN(num)) {
    let pixNum = 2 * num;
    num = num + 2;
    if (num >= 3 && num <= 5) {
      xMax = num;
      yMax = num;
    }
    const borderElement = document.getElementById("border");
    borderElement.style.width = yMax * 100 - pixNum + "px";
    borderElement.style.height = yMax * 100 - pixNum + "px";
  }
}

function startgame() {
  clearBorder();
  const gameOptionElement = document.getElementsByName("gameOption");
  const containerElement = document.getElementById("container");
  containerElement.style.display = "block";
  // const borderElement = document.getElementById('border')
  // borderElement.style.display="block";
  setMatrix();
  setUpABoard();
  for (let index = 0; index < gameOptionElement.length; index++) {
    const select = gameOptionElement[index];
    if (select.checked) {
      if (select.value === "alone") {
        addEventListeners(handleUserTurn);
      } else {
        addEventListeners(playBotPlayer);
      }
    }
  }
}

function setMatrix() {
  matrix = new Array();
  for (let index = 0; index < yMax; index++) {
    matrix.push(new Array());
  }
}

function setUpABoard() {
  // alert("creating a button: "+xMax+" X "+yMax);
  const borderElement = document.getElementById("border");
  for (let row = 0; row < yMax; row++) {
    const divElement = document.createElement("div");
    divElement.name = row;
    divElement.className = "div";
    divElement.style.width = 100 + "%";
    divElement.style.height = (1 / xMax) * 100 + "%";
    borderElement.appendChild(divElement);
    for (let col = 0; col < xMax; col++) {
      const buttonElement = document.createElement("button");
      buttonElement.name = col;
      buttonElement.className = "button";
      buttonElement.style.width = (1 / xMax) * 100 + "%";
      buttonElement.style.height = 100 + "%";
      divElement.appendChild(buttonElement);
    }
  }
}

function clearBorder() {
  thereIsAWin = false;
  playerIsX = true;
  itIsATie = false;
  lastRowPlay = 0;
  lastColPlay = 0;
  rowValue = 1;
  colValue = 1;
  diagonalIsChecked = false;
  reversDiagonalIsChecked = false;
  // const borderElement = document.getElementById('border')
  // borderElement.style.display="none";
  const messageElement = document.getElementById("victoryDeclaration");
  messageElement.innerHTML = "";
  const divs = document.getElementsByClassName("div");
  let length = divs.length;
  for (let index = 0; index < length; index++) {
    divs[0].remove();
  }
}

function presentTheWinner(player) {
  const messageElement = document.getElementById("victoryDeclaration");
  messageElement.innerHTML = player + " win!!";
  messageElement.style.display = "block";
  thereIsAWin = true;
}

function showADraw(params) {
  const messageElement = document.getElementById("victoryDeclaration");
  messageElement.innerHTML = "it's a tie";
  messageElement.style.display = "block";
}

function randomNumber() {
  return parseInt(Math.round(Math.random() * 999)) % xMax;
}
