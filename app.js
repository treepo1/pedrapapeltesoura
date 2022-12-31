import resultsMenu from "./menus/results.js";
import choiceMenu from "./menus/choice.js";
import mainMenuTemplate from "./menus/main.js";
import languageMenu from "./menus/language.js";




const translations = { 
    eng: {
        computer: "Computer",
        play: "Play",
        title: "Rock Paper Scissors",
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
        win: "won!",
        lose: "lost!",
        you: "You",
        draw: "Draw!",
        playAgain: "Play again",
        score: "Your score",
        language: "Language",
        english: "English",
        portuguese: "Portuguese",
        chooseLanguage: "Choose a language",
        chooseYourWeapon: "Choose your weapon",
        timeToChoose: "You have 10 seconds to choose"
    },
    br: {
        computer: "Computador",
        play: "Jogar",
        title: "Pedra, Papel, Tesoura",
        you: "Você",
        rock: "Pedra",
        paper: "Papel",
        scissors: "Tesoura",
        win: "ganhou",
        lose: "perdeu",
        draw: "Empate!",
        playAgain: "Jogar novamente",
        score: "Sua pontuação",
        language: "Idioma",
        english: "Inglês",
        portuguese: "Português",
        chooseLanguage: "Escolha um idioma",
        chooseYourWeapon: "Escolha sua arma",
        timeToChoose: "Você tem 10 segundos para escolher"
    }
}






class Game {
    constructor() {
        if(window.localStorage.getItem("players")) {
            console.log(JSON.parse(window.localStorage.getItem("players")))
            this.players = JSON.parse(window.localStorage.getItem("players")).map(player => (new Player(player._name, player.computer, player._score) ));
        } else {
        this.players = [];
    }

    if(window.localStorage.getItem("language")) {
        this.language = window.localStorage.getItem("language");
    } else {
        this.language = "br";
    }
}


    get language() {
        return this._language;
    }

    set language(value) {
        this._language = value;
        window.localStorage.setItem("language", value);
    }




    rules = {
        rock: {
            scissors: true,
            paper: false
        },
        paper: {
            rock: true,
            scissors: false
        },
        scissors: {
            paper: true,
            rock: false
        }
    }

    async start() {
        if(this.players.length < 2) {
            const namePlayer1 = translations[this.language].you;
            const namePlayer2 =  translations[this.language].computer;
            this.addPlayer(namePlayer1);
            this.addPlayer(namePlayer2, true);
        }
        window.localStorage.setItem("players", JSON.stringify(this.players));
        await this.showMenu()

    }

    showMenu() {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: translations[this.language].title,
                html: mainMenuTemplate(this.players[0], this.players[1], translations[this.language].score),
                padding: '3em',
                showConfirmButton: true,
                confirmButtonText: translations[this.language].play,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                grow: 'fullscreen',
                position: 'center',
                allowEnterKey: false,
                background:'white',
                width:'100%',
                height:'100%',
            }).then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: translations[this.language].chooseLanguage,
                        html: languageMenu(),
                        padding: '3em',
                        fullscreen: true,
                        showConfirmButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        background:'white',
                        width:'100%',
                    })

                    const btns = document.getElementById('language-menu__buttons').children;

                    for (const btn of btns) {
                        btn.addEventListener('click', (e) => {
                            this.language = e.target.id;
                            this.play();
                            resolve();
                        })
                    }




                } 
                
            })
        })
    }

    addPlayer(name, computer, score) {
        this.players.push(new Player(name, computer, score));
    }

    getWinner() {
        const player1 = this.players[0];
        const player2 = this.players[1];
        if(player1.choice === player2.choice) {
            return null;
        }
        if(this.rules[player1.choice][player2.choice]) {
            return player1;
        }
        return player2;
    }

    async play() {

        for (const player of this.players) {
            await player.play();
        }
        const winner = this.getWinner();
        const looser = this.players.find(player => player !== winner);
        if(winner) {
            winner.score = winner.score + 1;
            Swal.fire({
                title: `${winner.name} ${translations[this.language].win}`,
                html: resultsMenu(winner, looser),
                width: 800,
                padding: '3em',
                confirmButtonText: translations[this.language].playAgain,
            }).then((result) => {
                if(result.isConfirmed)
                this.play();
                else {
                    this.showMenu();
                }
            })
        } else {
            Swal.fire({
                title: translations[this.language].draw,
                html: resultsMenu(this.players[0], this.players[1]),
                width: 800,
                padding: '3em',
                confirmButtonText: translations[this.language].playAgain,
            }).then((result) => {
                if(result.isConfirmed)
                this.play();
                else {
                    this.showMenu();
                }
            })
        }
        window.localStorage.setItem("players", JSON.stringify(this.players));
        this.players.forEach(player => player.choice = null);
        


    }
}



class Player {
    constructor(name, computer = false, score = 0) {
        this.name = name;
        this.computer = computer;
        this.score = score;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get choice() {
        return this._choice;
    }

    set choice(value) {
        this._choice = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    setChoice(choice) {
        this._choice = choice;
    }

    playComputer()  {
        const randomNumber = Math.floor(Math.random() * 3);
        const randomChoice = ['rock', 'paper', 'scissors'][randomNumber];
        this._choice = randomChoice;
    }


    async playHuman() {

       return new Promise((resolve, reject) => {

            Swal.fire({
                title: translations[localStorage.getItem('language')]['chooseYourWeapon'],
                footer: translations[localStorage.getItem('language')]['timeToChoose'],
                html: choiceMenu(),
                width:'100%',
                position: 'center',
                grow: 'fullscreen',
                timer: 10000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                background:"transparent",
                didOpen: () => {

                   const choices =  document.getElementById("choiceMenu").children

                   for (const choice of choices) {

                    const choiceEl = document.getElementById(choice.id);
                    choiceEl.addEventListener("mouseover", function () {
                        this.src = `assets/${this.id}-hover.png`;
                        this.style.cursor = "pointer";
                    });

                    choiceEl.addEventListener("mouseout", function () {
                        this.src = `assets/${this.id}.png`;
                    });

                    choiceEl.addEventListener("click", function () {
                        console.log(this.id)
                        this.setChoice(choice.id);
                        Swal.close();
                        resolve();
                    }.bind(this));
                   }

                }
        
        });
    })
                
    }

    async play() {
        if(this.computer) {
            this.playComputer();
        } else {
            await this.playHuman();

        }
    }
}



document.getElementById("btnStart").addEventListener("click",function () {
    const game = new Game();
    game.start();
} )

window.onload = async function () {
    const game = new Game();
    game.start();
}