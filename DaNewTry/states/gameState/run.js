canvas.width=gs*levelData.width;
canvas.height=gs*levelData.width;


canvas.tabIndex=-1;
Input.listen(window);

let app = new App(60,ctx);
let gameState = new GameState(levelData);
gameState.init();
app.init(gameState);
