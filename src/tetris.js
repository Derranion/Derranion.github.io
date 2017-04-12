const utility = function () {

    this.get = function (id) {
        return document.getElementById(id);
    };
    this.hide = function (id) {
        utility.get(id).style.visibility = 'hidden';
    };
    this.show = function (id) {
        utility.get(id).style.visibility = null;
    };
    this.html = function (id, html) {
        utility.get(id).innerHTML = html;
    };
    this.timestamp = function () {
        return new Date().getTime();
    };
    this.random = function random(min, max) {
        return (min + (Math.random() * (max - min)));
    };

    return this
}.apply({});


const button = {ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40},
    direction = {UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3},
    speed = {start: 0.6, decrement: 0.005, min: 0.1},
    fieldWidth = 10,
    fieldHeight = 20,
    canvas = utility.get('canvas'),
    upCanvas = utility.get('upcoming'),
    canvasContext = canvas.getContext('2d'),
    upCanvasContext = upCanvas.getContext('2d'),
    nextFigureField = 5;


let blockWidth, blockHeight,
    tetrisField,
    actions,
    playing,
    next,
    score,
    vscore,
    gamingTime,
    currentFigure,
    rows,
    step;

const figures = (() => {
    function defineFigure(size, blocks, color) {
        return {size: size, blocks: blocks, color: color};
    }

    return [
        defineFigure(4, [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ]
        ], 'cyan'),

        defineFigure(3, [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ]
        ], 'blue'),

        defineFigure(3, [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ], 'orange'),

        defineFigure(2, [
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ], 'yellow'),

        defineFigure(3, [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ]
        ], 'green'),

        defineFigure(3, [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ], 'purple'),

        defineFigure(3, [
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ], 'red'),
    ]
})();

function eachblock(type, x, y, dir, fn) {
    type.blocks[dir].forEach((row, rowNumber) => {
        row.forEach((cell, colNumber) => {
            if (cell) {
                fn(x + colNumber, y + rowNumber);
            }
        });
    });
}


function occupied(type, x, y, dir) {
    let result = false;

    function checkBorder(x, y) {
        if ((x < 0) || (x >= fieldWidth) || (y < 0) || (y >= fieldHeight) || gameLogic.getBlock(x, y))
            result = true;
    };

    eachblock(type, x, y, dir, checkBorder);
    return result;
}

function unoccupied(type, x, y, dir) {
    return !occupied(type, x, y, dir);
}


function randomFigure() {
    const type = figures[Math.floor(Math.random() * figures.length)];
    return {
        type: type,
        dir: direction.UP,
        x: Math.round(utility.random(0, fieldWidth - type.size)),
        y: 0
    };
}


const game = function () {

    this.run = function () {
        game.addEvents();
        let last = now = utility.timestamp();

        function frame() {
            now = utility.timestamp();
            gameLogic.update(Math.min(1, (now - last) / 1000.0));
            rendering.draw();
            last = now;
            requestAnimationFrame(frame, canvas);
        }

        game.resize();
        gameLogic.reset();
        frame();
    };

    this.addEvents = function () {
        document.addEventListener('keydown', game.keydown, false);
        window.addEventListener('resize', game.resize, false);
    };

    this.resize = function () {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        upCanvas.width = upCanvas.clientWidth;
        upCanvas.height = upCanvas.clientHeight;
        blockWidth = canvas.width / fieldWidth;
        blockHeight = canvas.height / fieldHeight;
        rendering.invalidate();
        rendering.invalidateNext();
    };

    this.keydown = function (event) {
        let handled = false;
        if (playing) {
            switch (event.keyCode) {
                case button.LEFT:
                    actions.push(direction.LEFT);
                    handled = true;
                    break;
                case button.RIGHT:
                    actions.push(direction.RIGHT);
                    handled = true;
                    break;
                case button.UP:
                    actions.push(direction.UP);
                    handled = true;
                    break;
                case button.DOWN:
                    actions.push(direction.DOWN);
                    handled = true;
                    break;
                case button.ESC:
                    gameLogic.lose();
                    handled = true;
                    break;
            }
        }
        else if (event.keyCode == button.SPACE) {
            gameLogic.play();
            handled = true;
        }
        if (handled)
            event.preventDefault();
    };

    return this
}.apply({});


const gameLogic = function () {

    this.play = function () {
        utility.hide('start');
        gameLogic.reset();
        playing = true;
    };

    this.lose = function () {
        utility.show('start');
        gameLogic.setVisualScore();
        playing = false;
    };

    this.setVisualScore = function (n) {
        vscore = n || score;
        rendering.invalidateScore();
    };

    this.setScore = function (n) {
        score = n;
        gameLogic.setVisualScore(n);
    };

    this.addScore = function (n) {
        score = score + n;
    };

    this.clearScore = function () {
        gameLogic.setScore(0);
    };

    this.clearRows = function () {
        gameLogic.setRows(0);
    };

    this.setRows = function (n) {
        rows = n;
        step = Math.max(speed.min, speed.start - (speed.decrement * rows));
        rendering.invalidateRows();
    };

    this.addRows = function (n) {
        gameLogic.setRows(rows + n);
    };

    this.getBlock = function (x, y) {
        return (tetrisField && tetrisField[x] ? tetrisField[x][y] : null);
    };

    this.setBlock = function (x, y, type) {
        tetrisField[x] = tetrisField[x] || [];
        tetrisField[x][y] = type;
        rendering.invalidate();
    };

    this.clearBlocks = function () {
        tetrisField = [];
        rendering.invalidate();
    };

    this.clearActions = function () {
        actions = [];
    };

    this.setCurrentFigure = function (figure) {
        currentFigure = figure || randomFigure();
        rendering.invalidate();
    };

    this.setNextFigure = function (figure) {
        next = figure || randomFigure();
        rendering.invalidateNext();
    };

    this.reset = function () {
        gamingTime = 0;
        gameLogic.clearActions();
        gameLogic.clearBlocks();
        gameLogic.clearRows();
        gameLogic.clearScore();
        gameLogic.setCurrentFigure(next);
        gameLogic.setNextFigure();
    };

    this.update = function (diff) {
        if (playing) {
            if (vscore < score)
                gameLogic.setVisualScore(vscore + 1);
            gameLogic.handle(actions.shift());
            gamingTime = gamingTime + diff;
            if (gamingTime > step) {
                gamingTime = gamingTime - step;
                gameLogic.drop();
            }
        }
    };

    this.handle = function (action) {
        switch (action) {
            case direction.LEFT:
                gameLogic.move(direction.LEFT);
                break;
            case direction.RIGHT:
                gameLogic.move(direction.RIGHT);
                break;
            case direction.UP:
                gameLogic.rotate();
                break;
            case direction.DOWN:
                gameLogic.drop();
                break;
        }
    };

    this.move = function (direct) {
        let x = currentFigure.x, y = currentFigure.y;
        switch (direct) {
            case direction.RIGHT:
                x = x + 1;
                break;
            case direction.LEFT:
                x = x - 1;
                break;
            case direction.DOWN:
                y = y + 1;
                break;
        }
        if (unoccupied(currentFigure.type, x, y, currentFigure.dir)) {
            currentFigure.x = x;
            currentFigure.y = y;
            rendering.invalidate();
            return true;
        }
        else {
            return false;
        }
    };

    this.rotate = function () {
        let newDirection = (currentFigure.dir == direction.MAX ? direction.MIN : currentFigure.dir + 1);
        if (unoccupied(currentFigure.type, currentFigure.x, currentFigure.y, newDirection)) {
            currentFigure.dir = newDirection;
            rendering.invalidate();
        }
    };

    this.drop = function () {
        if (!gameLogic.move(direction.DOWN)) {
            gameLogic.addScore(10);
            gameLogic.dropFigure();
            gameLogic.removeLines();
            gameLogic.setCurrentFigure(next);
            gameLogic.setNextFigure(randomFigure());
            gameLogic.clearActions();
            if (occupied(currentFigure.type, currentFigure.x, currentFigure.y, currentFigure.dir)) {
                gameLogic.lose();
            }
        }
    };

    this.dropFigure = function () {
        eachblock(currentFigure.type, currentFigure.x, currentFigure.y, currentFigure.dir, function (x, y) {
            gameLogic.setBlock(x, y, currentFigure.type);
        });
    };

    this.removeLines = function () {
        let x, y, complete, n = 0;
        for (y = fieldHeight; y > 0; --y) {
            complete = true;
            for (x = 0; x < fieldWidth; ++x) {
                if (!gameLogic.getBlock(x, y))
                    complete = false;
            }
            if (complete) {
                gameLogic.removeLine(y);
                y = y + 1;
                n++;
            }
        }
        if (n > 0) {
            gameLogic.addRows(n);
            gameLogic.addScore(100 * Math.pow(2, n - 1));
        }
    };

    this.removeLine = function (n) {
        let x, y;
        for (y = n; y >= 0; --y) {
            for (x = 0; x < fieldWidth; ++x)
                gameLogic.setBlock(x, y, (y == 0) ? null : gameLogic.getBlock(x, y - 1));
        }
    };

    return this
}.apply({});


const rendering = function () {
    this.invalid = {};

    this.invalidate = function () {
        rendering.invalid.court = true;
    };

    this.invalidateNext = function () {
        rendering.invalid.next = true;
    };

    this.invalidateScore = function () {
        rendering.invalid.score = true;
    };

    this.invalidateRows = function () {
        rendering.invalid.rows = true;
    };

    this.draw = function () {
        canvasContext.save();
        canvasContext.lineWidth = 1;
        canvasContext.translate(0.5, 0.5);
        rendering.drawCourt();
        rendering.drawNext();
        rendering.drawScore();
        rendering.drawRows();
        canvasContext.restore();
    };

    this.drawCourt = function () {
        if (rendering.invalid.court) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            if (playing)
                rendering.drawFigure(canvasContext, currentFigure.type, currentFigure.x, currentFigure.y, currentFigure.dir);
            let x, y, block;
            for (y = 0; y < fieldHeight; y++) {
                for (x = 0; x < fieldWidth; x++) {
                    if (block = gameLogic.getBlock(x, y))
                        rendering.drawBlock(canvasContext, x, y, block.color);
                }
            }
            canvasContext.strokeRect(0, 0, fieldWidth * blockWidth - 1, fieldHeight * blockHeight - 1);
            rendering.invalid.court = false;
        }
    };

    this.drawNext = function () {
        if (rendering.invalid.next) {
            let padding = (nextFigureField - next.type.size) / 2;
            upCanvasContext.save();
            upCanvasContext.translate(0.5, 0.5);
            upCanvasContext.clearRect(0, 0, nextFigureField * blockWidth, nextFigureField * blockHeight);
            rendering.drawFigure(upCanvasContext, next.type, padding, padding, next.dir);
            upCanvasContext.strokeStyle = 'black';
            upCanvasContext.strokeRect(0, 0, nextFigureField * blockWidth - 1, nextFigureField * blockHeight - 1);
            upCanvasContext.restore();
            rendering.invalid.next = false;
        }
    };

    this.drawScore = function () {
        if (rendering.invalid.score) {
            utility.html('score', ("" + Math.floor(vscore)).slice(-5));
            rendering.invalid.score = false;
        }
    };

    this.drawRows = function () {
        if (rendering.invalid.rows) {
            utility.html('rows', rows);
            rendering.invalid.rows = false;
        }
    };

    this.drawFigure = function (canvasCont, type, x, y, dir) {
        eachblock(type, x, y, dir, function (x, y) {
            rendering.drawBlock(canvasCont, x, y, type.color);
        });
    };

    this.drawBlock = function (canvasCont, x, y, color) {
        canvasCont.fillStyle = color;
        canvasCont.fillRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
        canvasCont.strokeRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight)
    };

    return this
}.apply({});


game.run();

