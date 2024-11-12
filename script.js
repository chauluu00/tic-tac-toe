const Gameboard = (() => {
    // the array
    const gameboard = ["","","","","","","","",""];
    // the DOM element
    const board = document.querySelector("#gameboard");
    const getGameboard = () => gameboard;
    const printBoard = () => {
        gameboard.forEach((cell) => {
            const div = document.createElement("div");
            div.classList.add("cell");       
            board.appendChild(div);
        });
    };
    
    const update = (index, value) => {
        // update array
        gameboard[index] = value;
        // get current cell index
        const currentCellIndex = board.children[index];
        // create the tokens
        const x = document.createElement("img");
        x.setAttribute("src", "x.png");
        const o = document.createElement("img");
        o.setAttribute("src", "o.png");
        // if value === X, add X token to clicked cell
        if (value === "X"){
            currentCellIndex.appendChild(x);
        } else {
            currentCellIndex.appendChild(o);
        }    
        console.log(gameboard);
    }

    const clear = () => {
        // clear array
        gameboard.fill("");
        // clear display
        board.textContent = '';
    }
    return {
        getGameboard,
        printBoard,
        update,
        clear,
    };
})();

const gameController = (() => {
    let players = [];
    let currentPlayerIndex;
    const message = document.querySelector("#message");
    const p1NameInput = document.querySelector("#player1");
    const p2NameInput = document.querySelector("#player2");
    const start = () => {
        Gameboard.clear();
        players = [
            createPlayer(p1NameInput.value, "X"),
            createPlayer(p2NameInput.value, "O")
        ];
        // if no name entered, use default names "Player 1" and "Player 2"
        if (p1NameInput.value === ''){
            players[0].name = "Player 1";
        }
        if (p2NameInput.value === ''){
            players[1].name = "Player 2"; 
        }
        
        // assign first turn randomly
        currentPlayerIndex = (Math.random()<0.5) ? 0 : 1;
        message.innerText = `${players[currentPlayerIndex].name} goes first.`;
        
        Gameboard.printBoard();
        
        // player interactions (clicking the cells)
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                // get index of current cell as a child of #gameboard
                const board = document.querySelector("#gameboard");
                const index = Array.prototype.indexOf.call(board.children, cell);
                // update array
                Gameboard.update(index, players[currentPlayerIndex].token);
                // check for win
                if(checkWin(Gameboard.getGameboard())){
                    alert(`${players[currentPlayerIndex].name} won!`);
                    console.log(checkWin(Gameboard.getGameboard()));
                    start(); 
                };
                if(checkTie(Gameboard.getGameboard())){
                    alert(`It's a tie!`);
                    start();
                }
                // switch turn
                currentPlayerIndex = (currentPlayerIndex === 0) ? 1 : 0;
                message.innerText = `${players[currentPlayerIndex].name}'s turn.`;
            }, {once : true}); // each cell can only be clicked once
        });
    }
    return {
        start,
    }
})();

function createPlayer (name, token) {
    return {
        name, token,
    };
};

function checkWin (board) {
    const winningCombinations = [
        // horizontal
        [0,1,2],
        [3,4,5],
        [6,7,8],
        // vertical
        [0,3,6],
        [1,4,7],
        [2,5,8],
        // diagonal
        [0,4,8],
        [2,4,6]
    ]
    for (let i=0; i<winningCombinations.length; i++){
        const [a,b,c] = winningCombinations[i]; // destructuring assignment
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }       
    }
    return false;
}

function checkTie (board) {
    if (board.every(cell => cell !== '')){
        return true;
    }
    return false;
}

document.querySelector("#new-game").addEventListener("click", () => {
    enterPlayerNames.showModal();
});

document.querySelector("#start-button").addEventListener("click", () => {
    document.querySelector("#enterPlayerNames").close();
    gameController.start();
});

document.querySelector("#restart-button").addEventListener("click", () =>{
    gameController.start();
});