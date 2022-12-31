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
        timeToChoose: "You have {time} seconds to choose",
        backToMenu: "Back to menu"
    },
    br: {
        computer: "Computador",
        play: "Jogar",
        title: "Pedra, Papel, Tesoura",
        you: "Você",
        lose: "Perdeu!",
        rock: "Pedra",
        paper: "Papel",
        scissors: "Tesoura",
        win: "ganhou",
        draw: "Empate!",
        playAgain: "Jogar novamente",
        score: "Sua pontuação",
        language: "Idioma",
        english: "Inglês",
        portuguese: "Português",
        chooseLanguage: "Escolha um idioma",
        chooseYourWeapon: "Escolha sua arma",
        timeToChoose: "Você tem {time} segundos para escolher",
        backToMenu: "Voltar ao menu"
    }
}

 const translateName = (name, language) => {

    console.log(name,language)

    if(!Object.getOwnPropertyNames(translations).includes(language)) {
        throw new Error("Invalid language");
    }

    if(name === "You" || name === "Você") {
        console.log(translations[language].you)
        return translations[language].you;
    }

    if(name === "Computer" || name === "Computador") {
        return translations[language].computer;
    }

    return name


}



function typeEffect(text, element) {
    let index = 0;
    let interval = setInterval(function() {
      element.innerHTML += text[index];
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 100);
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
                title: `<p id="titleMainMenu"></p>`,
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

            typeEffect(translations[this.language].title,document.getElementById('titleMainMenu'));
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
            try {
                await player.play();
            } catch (error) {
                Swal.fire({
                    title: translations[this.language].lose,
                    html: 'Foi de nelson!',
                    width: 800,
                    showCancelButton: true,
                    cancelButtonText:translations[this.language].backToMenu,
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
        }
        const winner = this.getWinner();
        const looser = this.players.find(player => player !== winner);
        if(winner) {
            winner.score = winner.score + 1;
            Swal.fire({
                title: `${winner.name} ${translations[this.language].win}`,
                html: resultsMenu(winner, looser),
                width: 800,
                showCancelButton: true,
                cancelButtonText:translations[this.language].backToMenu,
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
                showCancelButton: true,
                cancelButtonText:translations[this.language].backToMenu,
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
        return translateName(this._name, localStorage.getItem('language'));
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


                        const timer = document.getElementById('timeLeft');
                        const timeLeft = 10;
                        let time = timeLeft;
                        const interval = setInterval(() => {
                            timer.innerHTML = `${time}`;
                            time--;
                            if(time < 0) {
                                clearInterval(interval);
                                reject('Time is up');
                            }
                        }, 900);



                  

                },
                didClose: () => {
                    reject('Time is up');
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



window.onload = async function () {
    document.getElementById('player').play()
    const game = new Game();
    game.start();
}