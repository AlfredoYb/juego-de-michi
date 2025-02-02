let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let player1Name = "";
let player2Name = "";
let playerName = "";
let isSinglePlayer = false;

function startTwoPlayerGame() {
    player1Name = document.getElementById("player1Name").value;
    player2Name = document.getElementById("player2Name").value;

    if (player1Name && player2Name) {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
        document.getElementById("gameHeader").textContent = `${player1Name} (X) vs ${player2Name} (O)`;
        gameActive = true;
        currentPlayer = "X";
    } else {
        alert("Por favor ingrese los nombres de los jugadores.");
    }
}

function startSinglePlayerGame() {
    playerName = document.getElementById("playerName").value;

    if (playerName) {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
        document.getElementById("gameHeader").textContent = `${playerName} (X) vs IA (O)`;
        gameActive = true;
        currentPlayer = "X";
        isSinglePlayer = true;
    } else {
        alert("Por favor ingrese el nombre del jugador.");
    }
}

function makeMove(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    const cell = document.getElementsByClassName("cell")[index];
    cell.textContent = currentPlayer;
    cell.style.transform = 'scale(1.3)';
    
    setTimeout(() => cell.style.transform = 'scale(1)', 300);

    if (checkWinner()) {
        document.getElementById("message").textContent = `${getCurrentPlayerName()} ha ganado! 🎉`;
        document.getElementById("message").style.color = '#ff7a00';
        gameActive = false;
        showWinnerMessage(getCurrentPlayerName());
    } else if (board.every(cell => cell !== "")) {
        document.getElementById("message").textContent = "¡Empate! 🤝";
        document.getElementById("message").style.color = '#ff7a00';
        gameActive = false;
        showWinnerMessage("Empate");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (isSinglePlayer && currentPlayer === "O") {
            setTimeout(aiMove, 2000);  // Espera 2 segundos para que la IA piense
        }
    }
}

function getCurrentPlayerName() {
    return currentPlayer === "X" ? (isSinglePlayer ? playerName : player1Name) : (isSinglePlayer ? "IA" : player2Name);
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementsByClassName("cell")[a].style.background = '#ff7a00';
            document.getElementsByClassName("cell")[b].style.background = '#ff7a00';
            document.getElementsByClassName("cell")[c].style.background = '#ff7a00';
            return true;
        }
    }
    return false;
}

function aiMove() {
    const bestMove = minimax(board, "O");
    board[bestMove.index] = "O";
    const cell = document.getElementsByClassName("cell")[bestMove.index];
    cell.textContent = "O";
    cell.style.transform = 'scale(1.3)';
    
    setTimeout(() => cell.style.transform = 'scale(1)', 300);
    
    if (checkWinner()) {
        document.getElementById("message").textContent = `¡La IA ha ganado! 🎉`;
        document.getElementById("message").style.color = '#ff7a00';
        gameActive = false;
        showWinnerMessage("IA");
    } else if (board.every(cell => cell !== "")) {
        document.getElementById("message").textContent = "¡Empate! 🤝";
        document.getElementById("message").style.color = '#ff7a00';
        gameActive = false;
        showWinnerMessage("Empate");
    } else {
        currentPlayer = "X";
    }
}

function minimax(board, player) {
    const availableMoves = getAvailableMoves(board);
    
    // Verificar si alguien ha ganado o si es empate
    if (checkWinner()) return { score: -10 };
    if (checkWinner() === "O") return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };
    
    let bestMove = { score: player === "O" ? -Infinity : Infinity };

    // Primero, buscamos si la IA puede ganar
    for (let i = 0; i < availableMoves.length; i++) {
        let move = availableMoves[i];
        board[move] = player;
        
        let score = minimax(board, player === "O" ? "X" : "O").score;
        
        board[move] = "";
        
        if (player === "O" && score > bestMove.score) {
            bestMove = { score, index: move };
        } else if (player === "X" && score < bestMove.score) {
            bestMove = { score, index: move };
        }
    }

    // Si hay una jugada ganadora, se prioriza
    return bestMove;
}

function getAvailableMoves(board) {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") availableMoves.push(i);
    }
    return availableMoves;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("message").textContent = "";

    // Ocultar el cuadro de felicitación
    document.getElementById("winMessage").style.display = "none";

    const cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.textContent = "";
        cell.style.background = 'rgba(255, 255, 255, 0.2)';
    }
}

function goToStartMenu() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "block";
    document.getElementById("winMessage").style.display = "none";
    
    // Reset all variables and states to restart the game
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    player1Name = "";
    player2Name = "";
    playerName = "";
    isSinglePlayer = false;

    // Clear the input fields
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";
    document.getElementById("playerName").value = "";
}

function showWinnerMessage(winnerName) {
    if (winnerName === "Empate") {
        document.getElementById("winnerText").textContent = `¡Es un empate! 🤝`;
    } else {
        document.getElementById("winnerText").textContent = `¡Felicidades, ${winnerName}! Has ganado.`;
    }
    document.getElementById("winMessage").style.display = "block";
}
