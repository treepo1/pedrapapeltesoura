const mainMenuTemplate = (player1,player2, scoreText) => 
    `<div class="main-menu">
        <h4>${scoreText}</h4>
        <span id ="scoreHuman">${player1.score || 0}</span>
        </div>`


export default mainMenuTemplate;