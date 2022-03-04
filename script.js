
function loadGame() {
    listenChangeNames();
    startGame();
}
loadGame();

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
            if (c.textContent == "") {
                c.setAttribute("played", "false"); // for hover effect
            } else {
                c.setAttribute("played", "true"); // for hover effect
            }

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
        const div_player = document.querySelector(".div-player" + this.id);
        const div_symbol = document.querySelector(".div-symbol" + this.id);
        let symb = (this.id==1)? "O" : "X";

        if (this.playing) {
            div_player.textContent = this.name + " Playing"; 
            div_player.style = "background-color: yellow";
            div_symbol.style = "background-color: yellow";
        } else {
            div_player.textContent = this.name + " Waiting..."; 
            div_player.style = "background-color: rgb(90, 87, 87)";
            div_symbol.style = "background-color: rgb(90, 87, 87)";
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
    const player1_name = document.querySelector(".div-player1").textContent;
    const player2_name = document.querySelector(".div-player2").textContent;

    // initialize board and players:
    gameBoard.initialize(); // this initializes the board stored in gameBoard (ie board not public)

    let player1 = createPlayer(player1_name, 1, true); // name, id=1, currentPlayer=true
    let player2 = createPlayer(player2_name, 2, false); // name, id=2, currentPlayer=false

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
                const div_result = document.getElementById("div-result");
                div_result.style.display = "block";
                div_result.textContent = currentPlayer.name + " wins!";
            }

            // if the game is finished with tie
            if (gameBoard.finished() == true) {
                const div_result = document.getElementById("div-result");
                div_result.style.display = "block";
                div_result.textContent = "Tie!";
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






// ####################################################
// ####################################################
// Starting the Game
// - listen to start button
// ####################################################
// ####################################################
function startGame() {
    const btn_startstop = document.querySelector(".btn-startstop");
    // const btn_stop = document.querySelector(".btn-stop");
    const btns_player = document.querySelectorAll(".btn-player");

    btn_startstop.onclick = () => {

        // if START
        if (btn_startstop.textContent == "START NEW GAME") {

            // hide change name buttons
            btns_player.forEach( (btn) => {btn.hidden = true});
            // change the button to stop button
            btn_startstop.textContent = "STOP THE GAME";
            // start the game
            game();

        }
        // if STOP
        else {
            // loadGame();
            location.reload();
        }
    }
}

// ####################################################
// ####################################################
// Changing the player names
// ####################################################
// ####################################################
function listenChangeNames() {
    const btns_change_name = document.querySelectorAll(".btn-player");

    btns_change_name.forEach( (btn) => {
        btn.onclick = (e) => {

            let ip = e.target.attributes[1].value;
            const div_plyi = document.querySelector(".div-player" + ip);
            const inp_plyi = document.querySelector(".input-player" + ip);
            const btn_plyi = document.querySelector(".btn-player" + ip);

            // if CHANGE NAME
            if (btn.textContent == "CHANGE NAME") {
                div_plyi.style.display = "none";
                inp_plyi.style.display = "block";
                btn_plyi.textContent = "SUBMIT NAME";
            }
            // if SUBMIT NEW NAME
            else {
                div_plyi.textContent = inp_plyi.value;
                div_plyi.style.display = "block";
                inp_plyi.style.display = "none";
                btn_plyi.textContent = "CHANGE NAME";
            }
        }
    })
}


