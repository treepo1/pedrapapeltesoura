const mainMenuTemplate = (player1,player2, scoreText) => 
    `<div class="main-menu">
    <img src="assets/rockpaperscissors.gif" style="border-radius:50px"></img>
        <h4>${scoreText}</h4>
        <span id ="scoreHuman">${player1.score || 0}</span>
        </div>`


export default mainMenuTemplate;