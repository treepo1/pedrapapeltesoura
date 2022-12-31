
const mapChoiceImgs = {
    rock: "assets/rock-min.png",
    paper: "assets/paper-min.png",
    scissors: "assets/scissors-min.png"
}

const resultsMenu = (player1,player2) => `
<div style="display:flex;width:100%;overflow-x:hidden; justify-content:center; align-items:center; gap:10px">
                
    <div style="display:flex; flex-direction:column;gap:4px">
    <img style="border-radius:12px;" width=280 height=220 src="${mapChoiceImgs[player1.choice]}">
    <span>${player1.name}</span>
    </div>

    <div style="display:flex; flex-direction:column;gap:4px">
    <img style="border-radius:12px;" width=280 height=220 src="${mapChoiceImgs[player2.choice]}">
    <span>${player2.name}</span>
    </div>

    </div>
`

export default resultsMenu;