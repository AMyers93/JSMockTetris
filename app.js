document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId 
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //Tetriminoes
    const lTetrimino = [
        [1, width+1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
     ]

     const zTetrimino = [
         [0, width, width + 1, width * 2 + 1],
         [width + 1, width + 2, width * 2, width * 2 + 1],
         [0, width, width + 1, width * 2 + 1],
         [width + 1, width + 2, width * 2, width * 2 + 1]
     ]

     const tTetrimino = [
         [1, width, width + 1, width + 2],
         [1, width + 1, width + 2, width * 2 + 1],
         [width, width + 1, width + 2, width * 2 + 1],
         [1, width, width + 1, width * 2 + 1]
     ]

     const oTetrimino = [
         [0, 1, width, width + 1],
         [0, 1, width, width + 1],
         [0, 1, width, width + 1],
         [0, 1, width, width + 1]
     ]

     const iTetrimino = [
         [1, width + 1, width * 2 + 1, width * 3 + 1],
         [width, width + 1, width + 2, width + 3],
         [1, width + 1, width * 2 + 1, width * 3 + 1],
         [width, width + 1, width + 2, width + 3]
     ]

     const theTetriminoes = [lTetrimino, zTetrimino, tTetrimino, oTetrimino, iTetrimino]

     let currentPosition = 4
     let currentRotation = 0
     let random = Math.floor(Math.random() *theTetriminoes.length)
     let current = theTetriminoes[random] [0]

     //draw first rotation in first tetrimino
     function draw() {
         current.forEach(index => {
             squares[currentPosition + index].classList.add('tetrimino')
             squares[currentPosition + index].style.backgroundColor = colors[random]
         })
     }

     //undraw a tetrimino
     function undraw() {
         current.forEach(index => {
             squares[currentPosition + index].classList.remove('tetrimino')
             squares[currentPosition + index].style.backgroundColor = ""
         })
     }

     //Move tetrimino move down each second
    //  timerId = setInterval(moveDown, 1000)

     //assign functions to keycode
     function control(e) {
         if(e.keyCode === 37) {
             moveLeft()
         } else if (e.keyCode === 38) {
             rotate()
         } else if(e.keyCode === 39) {
             moveRight()
         } else if(e.keyCode === 40) {
             moveDown()
         }

     }
     document.addEventListener('keyup', control)
     function moveDown () {
         undraw()
         currentPosition += width
         draw()
         freeze()
     }

     //Freeze Function
     function freeze() {
         if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
             current.forEach(index => squares[currentPosition + index].classList.add('taken'))
             //start new tetrimino falling
             random = nextRandom
             nextRandom = Math.floor(Math.random() * theTetriminoes.length)
             current = theTetriminoes[random][currentRotation]
             currentPosition = 4
             draw()
             displayShape()
             addScore()
             gameOver()
         }
     }

     //move the tetrimino left, unless it's at the edge or there's a blockage
     function moveLeft() {
         undraw()
         const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

         if(!isAtLeftEdge) currentPosition -= 1

         if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
             currentPosition += 1
         }
         draw()
     }

     //move tetrimino right, unless there's a blockage
     function moveRight() {
         undraw()
         const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        
         if(!isAtRightEdge) currentPosition += 1

         if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
             currentPosition -= 1
         }
         draw()
     }

     //rotate the tetrimino
     function rotate() {
         undraw()
         currentRotation ++
         if(currentRotation === current.length) { //if the current rotation gets to 4, send it back to 0.
             currentRotation = 0
         }
         current = theTetriminoes[random][currentRotation]
         draw()
     }

     //show up-next tetrimino in mini-grid display
     const displaySquares = document.querySelectorAll('.mini-grid div')
     const displayWidth = 4
     const displayIndex = 0
     

     //the tetriminoes without rotations
     const upNextTetriminoes = [
         [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetrimino
         [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetrimino
         [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetrimino
         [0, 1, displayWidth, displayWidth + 1], //oTetrimino
         [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetrimino
     ]

     //display shape in the mini-grid display
     function displayShape() {
         displaySquares.forEach(square => {
             square.classList.remove('tetrimino')
             square.style.backgroundColor = ''
         })
         upNextTetriminoes[nextRandom].forEach(index => {
             displaySquares[displayIndex + index].classList.add('tetrimino')
             displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
         })
     }

     //add functionality to start button
     
     startBtn.addEventListener('click', () => {
         if(timerId) {
             clearInterval(timerId)
             timerId = null
         } else {
             draw()
             timerId = setInterval(moveDown, 1000)
             nextRandom = Math.floor(Math.random() * theTetriminoes.length)
             displayShape()
         }
     })

     //add score
     function addScore() {
         for(let i = 0; i < 199; i += width) {
             const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

             if(row.every(index => squares[index].classList.contains('taken'))) {
                 score += 10
                 scoreDisplay.innerHTML = score
                 row.forEach(index => {
                     squares[index].classList.remove('taken')
                     squares[index].classList.remove('tetrimino')
                     squares[index].style.backgroundColor = ''
                 })
                 const squaresRemoved = squares.splice(i, width)
                 squares = squaresRemoved.concat(squares)
                 squares.forEach(cell => grid.appendChild(cell))
             }
         }
     }

     //game over
     function gameOver() {
         if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
             scoreDisplay.innerHTML = 'end'
             clearInterval(timerId)
         }
     }

})