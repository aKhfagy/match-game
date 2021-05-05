document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const width = 8;
    const squares = [];
    let score = 0;
    scoreDisplay.innerHTML = score;

    const candyColors = [
        'red',
        'yellow',
        'orange',
        'purple',
        'green',
        'blue'
    ];

    function isTouchDevice(){
        return typeof window.ontouchstart !== 'undefined';
    }
    
    
    // create board
    const createBoard = () => {
        for (let i = 0; i < width * width; ++i) {
            const square = document.createElement('div');
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            square.style.backgroundColor = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    };
    
    if(isTouchDevice()) {
        alert("Unfortunately no touch support is available yet");
    }
    
    createBoard();

    // drag the candies
    let colorBeingDraged = null, colorBeingReplaced = null;
    let squareIdBeingDraged = null, squareIdBeingReplaced = null;

    function dragStart(e) {
        squareIdBeingDraged = parseInt(this.id);
        colorBeingDraged = this.style.backgroundColor;
    }

    function dragEnd(e) {
        let validMoves = [
            squareIdBeingDraged - 1,
            squareIdBeingDraged - width,
            squareIdBeingDraged + 1,
            squareIdBeingDraged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        }
        else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
            squares[squareIdBeingDraged].style.backgroundColor = colorBeingDraged;
        }
        else {
            squares[squareIdBeingDraged].style.backgroundColor = colorBeingDraged;
        }
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave(e) {

    }

    function dragDrop(e) {
        colorBeingReplaced = this.style.backgroundColor;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundColor = colorBeingDraged;
        squares[squareIdBeingDraged].style.backgroundColor = colorBeingReplaced;
    }

    const loopEach = (items, e, callback) => {
        items.forEach(item => item.addEventListener(e, callback));
    };

    loopEach(squares, 'dragstart', dragStart);
    loopEach(squares, 'dragend', dragEnd);
    loopEach(squares, 'dragover', dragOver);
    loopEach(squares, 'dragenter', dragEnter);
    loopEach(squares, 'dragleave', dragLeave);
    loopEach(squares, 'drop', dragDrop);

    // drop candies

    const updateScore = (inc) => {
        score += inc;
        scoreDisplay.innerHTML = score;
    };

    function moveDown() {
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        for (let i = 0; i < 56; ++i) {
            if (squares[i + width].style.backgroundColor === '') {
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';
            }
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i].style.backgroundColor === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundColor = candyColors[randomColor];
            }
        }
    }

    // Check for matches
    function checkRowForThree() {
        for (let i = 0; i < 62; ++i) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 38, 46, 47, 54, 55];

            if (notValid.includes(i))
                continue;

            if (
                rowOfThree.every(
                    index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                updateScore(3);
                //console.log("found 3 in row", i, i + 1, i + 2, "with color", decidedColor);
                rowOfThree.forEach(
                    index => {
                        squares[index].style.backgroundColor = '';
                    }
                );
            }
        }
    }
    function checkColForThree() {
        for (let i = 0; i < 48; ++i) {
            let colOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';
            if (
                colOfThree.every(
                    index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                updateScore(3);
                //console.log("found 3 in col", i, i + width, i + width * 2, "with color", decidedColor);
                colOfThree.forEach(
                    index => {
                        squares[index].style.backgroundColor = '';
                    }
                );
            }
        }
    }

    function checkMatches() {
        checkRowForThree();
        checkColForThree();
        moveDown();
    }

    const startDate = new Date().getTime();

    window.setInterval(function () {
        checkMatches();
    }, 100);

    window.setInterval(function () {
        const now = new Date().getTime();
        let ellapsed = now - startDate;
        let minutes = Math.floor((ellapsed % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((ellapsed % (1000 * 60)) / 1000);
        timeDisplay.innerHTML = minutes + ':' + seconds;
    }, 1000);

});
