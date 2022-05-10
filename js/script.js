
//VARIABLE --------------------------------
const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0
const audioStart = document.getElementById('audio-start'); 
const audioLaser = document.getElementById('audio-laser');
const audioBoom = document.getElementById('audio-boom');
const audioDie = document.getElementById('audio-die'); 
const audioWin = document.getElementById('audio-win'); 


//SELECTORS --------------------------------
const startButton = document.getElementById('start');
const shootButton = document.querySelector('.btn-shoot');
const rightButton = document.querySelector('.btn-right');
const leftButton = document.querySelector('.btn-left');


//EVENT LISTENERS --------------------------
document.addEventListener('keydown', shoot)
startButton.addEventListener('click', startGame);
shootButton.addEventListener('click', shoot);
rightButton.addEventListener('click', moveShooterRight);
leftButton.addEventListener('click', moveShooterLeft);


//GRID --------------------------------

for (let i = 0; i < 255; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))

//INVADERS --------------------------------

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {  
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}


//SHOOTER --------------------------------

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case 'ArrowRight':
            if(currentShooterIndex % width < width -1) currentShooterIndex +=1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
} 

function moveShooterRight() {
    squares[currentShooterIndex].classList.remove('shooter')
    if(currentShooterIndex % width < width -1) currentShooterIndex +=1
    squares[currentShooterIndex].classList.add('shooter')
}

function moveShooterLeft() {
    squares[currentShooterIndex].classList.remove('shooter')
    if(currentShooterIndex % width !== 0) currentShooterIndex -=1
    squares[currentShooterIndex].classList.add('shooter')
}



//MOVE INVADERS --------------------------------

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width +1
            direction = -1 
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }    
    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        audioDie.play()
        clearInterval(invadersId)
    }

    for  (let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > squares.length) {
            resultsDisplay.innerHTML = 'GAME OVER'
            audioDie.play()
            clearInterval(invadersId)
        }
    }
    
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
        audioWin.play()
        clearInterval(invadersId)
    } 
}

 
//SHOOT ------------------------------------

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    audioLaser.play()
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')
            audioBoom.play()
        
            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

           const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
           aliensRemoved.push(alienRemoved)
           results++
           resultsDisplay.innerHTML = results
        } 

    }
    switch(e.keyCode) {  
        case 32:  
        laserId = setInterval(moveLaser, 100)
    }
}     
invadersId = setInterval(moveInvaders, 300) 

//FUNCTIONS -------------------------------- 

function startGame() {
    audioStart.play()
    console.log("teste")
    draw()
}