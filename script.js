
// ####################################################
// ####################################################
// gameBoard object
// stores the gameboard as an array
// [module - since need only one of it]
// ####################################################
// ####################################################
const gameBoard = function() {

    // board array [private variable]
    let board_array = [];
    // initialize the board array
    const initialize = () => {
        board_array = ["", "", "", "", "", "", "", "", ""];
    };
    // update the board
    const update = (player, celli) => {
        if (board_array[celli] == "") {  
            board_array[celli] = (player.id==1)? "O" : "X";
        } 
    }
    // check status of the board 
    const checkok = (celli) => {
        let ok = false;
        if (board_array[celli] == "") {  
            ok = true;
        } 
        return ok;
    }
    // render board 
    const cells = document.querySelectorAll(".cell");
    const render = () => {
        let i = 0;
        cells.forEach( (c) => {
            c.textContent = board_array[i];
            i++;
        })
    }
    // check if game finished
    const win = () => {
        let won = false;
        let b = board_array;
        if ( ((b[0]==b[1]) && (b[1]==b[2]) && (b[0]!="")) 
            || ((b[3]==b[4]) && (b[4]==b[5]) && (b[3]!="")) 
            || ((b[6]==b[7]) && (b[7]==b[8]) && (b[6]!="")) 
            || ((b[0]==b[3]) && (b[3]==b[6]) && (b[0]!=""))             
            || ((b[1]==b[4]) && (b[4]==b[7]) && (b[1]!=""))             
            || ((b[2]==b[5]) && (b[5]==b[8]) && (b[2]!="")) 
            || ((b[0]==b[4]) && (b[4]==b[8]) && (b[0]!=""))             
            || ((b[2]==b[4]) && (b[4]==b[6]) && (b[2]!="")) ) 
            {
                won = true;
            };
        return won;
    } 
    // check if game finished
    const finished = () => {
        let fini = true;
        for (let i=0; i<9; i++) {
            if (board_array[i] == "") {
                fini = false;
            }
        }
        return fini;
    }

    return {initialize, checkok, update, render, win, finished};
}();

// ####################################################
// ####################################################
// Players object
// [factory - since need multiple of it]
// ####################################################
// ####################################################
// Factory function:
// 1. create a function with the object methods
// 2. create the factory function
//   - include with properties 
//   - include the function defined in 1 as a prototype of this factory function

const playerActions = {
    change() {
        this.playing = !this.playing;
        return this.playing;
    }, 
    render() {
        // const div_player = document.getElementById("div-player" + this.id);
        const div_player = document.querySelector(".div-player" + this.id);
        let symb = (this.id==1)? "O" : "X";
        div_player.textContent = this.name + "  (" + symb + ")";
        if (this.playing) {
            div_player.style = "background-color: white";
        } else {
            div_player.style = "background-color: grey";
        }
    }
}

function createPlayer(name, id, playing) {
    let player = Object.create(playerActions);
    player.name = name;
    player.id = id;
    player.playing = playing;
    return player;
}


// ####################################################
// ####################################################
// Game object
// to control the flow of the game
// [module - since need only one of it]
// ####################################################
// ####################################################
function game() {
    // general variables
    const cells = document.querySelectorAll(".cell");

    // initialize board and players:
    gameBoard.initialize(); // this initializes the board stored in gameBoard (ie board not public)
    let player1 = createPlayer("Bob", 1, true); // name, id=1, currentPlayer=true
    let player2 = createPlayer("Jil", 2, false); // name, id=2, currentPlayer=false

    // display board and players:
    gameBoard.render();
    player1.render();
    player2.render();

    // current player:
    let currentPlayer = (player1.playing)? player1 : player2;

    // winner:
    let winner = "";

    // click listener
    cells.forEach( (c) =>
        c.onclick = (e) => {
            let iclicked = e.target.attributes[1].value;

            // if the move is valid then update the board + display            
            if (gameBoard.checkok(iclicked)==true) {
                gameBoard.update(currentPlayer, iclicked);
                gameBoard.render();
            }
            // if the game is finished with winner
            if (gameBoard.win() == true) {
                console.log(currentPlayer.name + " wins!");
            }

            // if the game is finished with tie
            if (gameBoard.finished() == true) {
                console.log("finished (tie)");
            }

            // change current player:
            player1.change();
            player2.change();
            currentPlayer = (player1.playing)? player1 : player2;
            player1.render();
            player2.render();
        
        }
    )
}

game();


