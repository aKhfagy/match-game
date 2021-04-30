document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
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

    // create board
    const createBoard = () => {
        for (let i = 0; i < width*width; ++i) {
            const square = document.createElement('div');
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            square.style.backgroundColor = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    };

    createBoard();
    console.log(squares.length)
    
    // drag the candies
    let colorBeingDraged = null, colorBeingReplaced = null;
    let squareIdBeingDraged = null, squareIdBeingReplaced = null;

    function dragStart(e) {
        squareIdBeingDraged = parseInt(this.id);
        colorBeingDraged = this.style.backgroundColor;
        console.log(this.id, 'dragstart', colorBeingDraged);
    }

    function dragEnd(e) {
        let validMoves = [
            squareIdBeingDraged - 1, 
            squareIdBeingDraged - width,
            squareIdBeingDraged + 1,
            squareIdBeingDraged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if(squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        }
        else if(squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
            squares[squareIdBeingDraged].style.backgroundColor = colorBeingDraged;
        }
        else {
            squares[squareIdBeingDraged].style.backgroundColor = colorBeingDraged;
        }

        console.log(this.id, 'dragend');
    }

    function dragOver(e) {
        e.preventDefault();
        console.log(this.id, 'dragover');
    }

    function dragEnter(e) {
        e.preventDefault();
        console.log(this.id, 'dragenter');
    }

    function dragLeave(e) {
        console.log(this.id, 'dragleave');
    }

    function dragDrop(e) {
        colorBeingReplaced = this.style.backgroundColor;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundColor = colorBeingDraged;
        squares[squareIdBeingDraged].style.backgroundColor = colorBeingReplaced;
        console.log(this.id, 'drop', colorBeingReplaced, colorBeingDraged);
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
        let hadWhite = false;
        for(let i = 0; i < 56; ++i) {
            if(squares[i + width].style.backgroundColor === '') {
                hadWhite = true;
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';
            }
            const isFirstRow = firstRow.includes(i);
            if(isFirstRow && squares[i].style.backgroundColor === '') {
                hadWhite = true;
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundColor = candyColors[randomColor];
            }
        }
        return hadWhite;
    }

    // Check for matches
    function checkRowForThree() {
        for(let i = 0; i < 62; ++i) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 38, 46, 47, 54, 55];

            if(notValid.includes(i))
                continue;

            if(
                rowOfThree.every(
                    index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                        updateScore(3);
                        rowOfThree.forEach(
                            index => {
                                squares[index].style.backgroundColor = '';
                            }
                        );
            }
        }
    }
    function checkColForThree() {
        for(let i = 0; i < 48; ++i) {
            let colOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';
            if(
                colOfThree.every(
                    index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                        updateScore(3);
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
        while(moveDown());
    }

    window.setInterval(function() {
        checkMatches();
    }, 100);

});
