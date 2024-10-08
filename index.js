const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image}) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    static speed = 1.25
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 17
        this.radians = 0.75
        this.openRate = 0.025
        this.rotation = 0
        this.speed = 1.25
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill() 
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > .75) this.openRate
            = - this.openRate

            this.radians += this.openRate
    }
}

class Ghost {
    static speed = 1
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.radius = 17
        this.color = color
        this.prevCollisions = []
        this.speed = 1
        this.scared = false
        this.invisibled = false
        this.frozened = false
    }
    
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        if (this.invisibled) {
            c.fillStyle = 'rgba(0, 0, 0, 0)'; 
        } else if (this.scared) {
            c.fillStyle = 'blue'; 
        } else if (this.frozened) {
            c.fillStyle = '#ADD8E6';
        }
        else {
            c.fillStyle = this.color; 
        }
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        if (!this.frozened) {
            this.position.x += this.velocity.x * this.speed;
            this.position.y += this.velocity.y * this.speed;
        }
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

class Invisible {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'grey'
        c.fill()
        c.closePath()
    }
}

class Frozen {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#ADD8E6'
        c.fill()
        c.closePath()
    }
}


 
const pellets = []
const boundaries = []
const powerUps = []
const invisibles = []
const frozens = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 3 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'purple'
    })
]
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

let lastKey = ''
let score = 0

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', 'i', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'f', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
            boundaries.push(
                new Boundary({
                    position: {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeHorizontal.png')
                })
            )
                break
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeVertical.png')
                    })
                )
            break
            case '1':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeCorner1.png')
                 })
             )
             break
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCorner2.png')
                    })
                )
            break
            case '3':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeCorner3.png')
                 })
             )
             break
            case '4':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeCorner4.png')
                 })
             )
             break
            case 'b':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/block.png')
                 })
             )
             break
            case '[':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/capLeft.png')
                 })
             )
             break
            case ']':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/capRight.png')
                 })
             )
             break
            case '_':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/CapBottom.png')
                 })
             )
             break
            case '^':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/CapTop.png')
                 })
             )
             break
            case '+':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeCross.png')
                 })
             )
             break
            case '5':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeConnectorTop.png')
                 })
             )
             break
            case '6':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeConnectorRight.png')
                 })
             )
             break
            case '7':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeConnectorBottom.png')
                 })
             )
             break
            case '8':
             boundaries.push(
                 new Boundary({
                     position: {
                         x: Boundary.width * j,
                         y: Boundary.height * i
                     },
                     image: createImage('./img/pipeConnectorLeft.png')
                 })
             )
             break
            case '.':
             pellets.push(
                 new Pellet({
                     position: {
                         x: Boundary.width * j + Boundary.width / 2,
                         y: Boundary.height * i + Boundary.height / 2
                     },
                 })
             )
             break
            case 'p':
             powerUps.push(
                 new PowerUp({
                     position: {
                         x: Boundary.width * j + Boundary.width / 2,
                         y: Boundary.height * i + Boundary.height / 2
                     },
                 })
             )
             break
            case 'i':
             invisibles.push(
                 new Invisible({
                     position: {
                         x: Boundary.width * j + Boundary.width / 2,
                         y: Boundary.height * i + Boundary.height / 2
                     },
                 })
             )
             break
            case 'f':
                frozens.push(
                    new Frozen({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        },
                    })
                )
                break
        }
    })
})

function circleCollidesWidthRectangle({ circle, rectangle }) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y <=
            rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >=
            rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >=
            rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <=
            rectangle.position.x + rectangle.width + padding
    )
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    console.log(animationId)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') { 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                circleCollidesWidthRectangle({
                    circle: {...player, velocity: {
                      x: 0,
                      y: -player.speed
                    }},
                    rectangle: boundary
                })
            )   {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -player.speed
            }
        }   
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                circleCollidesWidthRectangle({
                    circle: {...player, velocity: {
                      x: -player.speed,
                      y: 0
                    }},
                    rectangle: boundary
                })
            )   {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -player.speed
            }
        }   
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                circleCollidesWidthRectangle({
                    circle: {
                    ...player,
                    velocity: {
                      x: 0,
                      y: player.speed
                    }},
                    rectangle: boundary
                })
            )   {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = player.speed
            }
        }   
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                circleCollidesWidthRectangle({
                    circle: {...player, velocity: {
                      x: player.speed,
                      y: 0
                    }},
                    rectangle: boundary
                })
            )   {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = player.speed
            }
        }  
    }  

    // detect collision between ghosts and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        // ghost touches player
        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
            ) <
                ghost.radius + player.radius 
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1)
            } 
            else if (ghost.invisibled) {
                
            }  else {
                cancelAnimationFrame(animationId)
                if (confirm("You lose!")) {
                    location.reload(); 
                }
            }
            
        }
    }

    // win condition goes here
    if (pellets.length === 0) {
        if (confirm("You win!")) {
            location.reload(); 
        }
        cancelAnimationFrame(animationId)
    }

    // power ups go
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        //player collides with powerup
        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y
            ) <
                powerUp.radius + player.radius
        )   {
            powerUps.splice(i, 1)

            //make ghosts scared
            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                    console.log(ghost.scared)
                }, 5000)
            })
        }
    }

    // Invisible go
    for (let i = invisibles.length - 1; 0 <= i; i--) {
        const invisible = invisibles[i]
        invisible.draw()

        //player collides with invisible
        if (
            Math.hypot(
                invisible.position.x - player.position.x,
                invisible.position.y - player.position.y
            ) <
                invisible.radius + player.radius
        )   {
            invisibles.splice(i, 1)

            //make ghosts invisibled
            ghosts.forEach(ghost => {
                ghost.invisibled = true

                setTimeout(() => {
                    ghost.invisibled = false
                    console.log(ghost.invisibled)
                }, 5000)
            })
        }
    }

    // Frozen go
    for (let i = frozens.length - 1; 0 <= i; i--) {
        const frozen = frozens[i]
        frozen.draw()

        //player collides with frozen
        if (
            Math.hypot(
                frozen.position.x - player.position.x,
                frozen.position.y - player.position.y
            ) <
                frozen.radius + player.radius
        )   {
            frozens.splice(i, 1)

            //make ghosts frozened
            ghosts.forEach(ghost => {
                ghost.frozened= true;

                setTimeout(() => {
                    ghost.frozened = false;
                    console.log(ghost.frozened)
                }, 5000)
            })
        }
    }

    // touch pellets
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) <
                pellet.radius + player.radius
        ) {
            pellets.splice(i, 1)
            score+= 10
            scoreEl.innerHTML = score
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if(
            circleCollidesWidthRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []
        boundaries.forEach((boundary) => {
            if(
                !collisions.includes('right') && 
                circleCollidesWidthRectangle({
                    circle: {...ghost, velocity: {
                      x: ghost.speed,
                      y: 0
                    }},
                    rectangle: boundary
                })     
            ) {
                collisions.push('right')
            }

            if(
                !collisions.includes('left') && 
                circleCollidesWidthRectangle({
                    circle: {...ghost, velocity: {
                      x: -ghost.speed,
                      y: 0
                    }},
                    rectangle: boundary
                })     
            ) {
                collisions.push('left')
            }

            if(
                !collisions.includes('up') && 
                circleCollidesWidthRectangle({
                    circle: {...ghost, velocity: {
                      x: 0,
                      y: -ghost.speed
                    }},
                    rectangle: boundary
                })     
            ) {
                collisions.push('up')
            }

            if(
                !collisions.includes('down') && 
                circleCollidesWidthRectangle({
                    circle: {...ghost, velocity: {
                      x: 0,
                      y: ghost.speed
                    }},
                    rectangle: boundary
                })     
            ) {
                collisions.push('down')
            }
        })
        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== 
            JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) 
                ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) 
                ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) 
                ghost.prevCollisions.push('up') 
            else if (ghost.velocity.y > 0) 
                ghost.prevCollisions.push('down')

            console.log(collisions)
            console.log(ghost.prevCollisions)

            const pathways = ghost.prevCollisions.filter((collision
                )=> {
                    return !collisions.includes(collision)
            })
            console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            console.log({direction})

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break
            
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break

                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break

                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }

            ghost.prevCollisions = []
        }
    })


    if (player.velocity.x > 0) player.rotation = 0 
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})