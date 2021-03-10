function newElement(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function Wall(reverse = false) {
    this.element = newElement('div', 'wall')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

// const w = new Wall(true)
// w.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(w.element)


function PairOfWalls(height, opening, x) {

    this.element = newElement('div', 'pair-of-walls')

    this.upper = new Wall(true)
    this.over = new Wall(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.over.element)

    this.sortOpening = () => {
        const heightUpper = Math.random() * (height - opening)
        const heightOver = height - opening - heightUpper
        this.upper.setHeight(heightUpper)
        this.over.setHeight(heightOver)
    }
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortOpening()
    this.setX(x)
}


//const w = new PairOfWalls(700,200,400)
//document.querySelector('[wm-flappy]').appendChild(w.element)

function Walls(height, width, opening, space, notifyPoints) {
    this.pairs = [
        // when the game starts the first x = width
        new PairOfWalls(height, opening, width),
        new PairOfWalls(height, opening, width + space),
        new PairOfWalls(height, opening, width * 2),
        new PairOfWalls(height, opening, width * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            // when the element get out of the screen
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.sortOpening()
            }

            const middle = width / 2
            const crossedMiddle = pair.getX() + displacement >= middle
                && pair.getX() < middle

            if (crossedMiddle) notifyPoints()
        })
    }

}

function Bird(heightGame) {
    let fly = false
    this.element = newElement('img', 'bird')
    this.element.src = 'imgs/passaro.png'


    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`


    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newY = this.getY() + (flying ? 10 : -3)
        const maxHeight = heightGame - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }

    }

    this.setY(heightGame / 2)




}




function Progress() {
    this.element = newElement('span', 'progress')
    this.updatePoints = points => {
        this.element.innerHTML = points
    }
    this.updatePoints(0)
}

//const walls = new Walls(700, 1200, 250, 400)
//const bird = new Bird (700)
//const gameArea = document.querySelector('[wm-flappy]')
//gameArea.appendChild(new Progress().element)
//gameArea.appendChild(bird.element)
//walls.pairs.forEach(pair => gameArea.appendChild(pair.element))
//setInterval(() => {
//  walls.animate()
//bird.animate()
//}, 20)

function overlap(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function collided(bird, walls) {
    let collided = false
    walls.pairs.forEach(PairOfWalls => {
        if (!collided) {
            const over = PairOfWalls.over.element
            const upper = PairOfWalls.upper.element
         
            collided = overlap(bird.element, upper)
                || overlap(bird.element, over)
        }
    })
    return collided
}

function FlappyBird(){
    let points = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth



    const progress = new Progress()
    const walls = new Walls(height,width,190,400, () => progress.updatePoints(++points))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    walls.pairs.forEach(pair => gameArea.appendChild(pair.element))
  
    this.start = () => {
       
         //loop do jogo
        const timeCount = setInterval(()=> {
            walls.animate()
            bird.animate()
            if (collided(bird, walls)) {
                clearInterval(timeCount)
            }
        }, 20)
    }
}

new FlappyBird().start()