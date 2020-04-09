let theme = 0
let maxStars = 25
const themeSwitch = document.querySelector("#switch-theme")

if(localStorage.getItem("theme")) {
    theme = parseInt(localStorage.getItem("theme"))
    if(theme == 1) {
        document.documentElement.dataset.theme = "dark"
        themeSwitch.querySelector("i").setAttribute("class", "icon-sun")
    }
}

themeSwitch.addEventListener("click", function () {
    if(document.documentElement.dataset.theme == "dark") {
        document.documentElement.dataset.theme = "light"
        theme = 0
        themeSwitch.querySelector("i").setAttribute("class", "icon-cloud-moon")
    } else {
        document.documentElement.dataset.theme = "dark"
        theme = 1
        themeSwitch.querySelector("i").setAttribute("class", "icon-sun")
    }
    localStorage.setItem("theme", theme)
})

function coverAnimation() {
    const canvas = document.querySelector("#cover-animation")
    const ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false

    const scale = 2

    let colors = [
        [
            "black",
            "black"
        ],
        [
            "#e1e1e1",
            "#ffffff"
        ]
    ]

    const stars = [
        [
            [0, 1, 0],
            [1, 2, 1],
            [0, 1, 0]
        ],
        [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 0]
        ],
        [
            [1, 0, 1],
            [0, 0, 0],
            [1, 0, 1]
        ]
    ]

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    class Star {
        constructor() {
            this.x = randomInt(0, canvas.width)
            this.y = randomInt(0, canvas.height)
            this.createdAt = Date.now()
            this.life = randomInt(700, 1500)
            this.frame = 0
            const maxSpeed = 1000
            this.direction = [randomInt(-maxSpeed, maxSpeed) / 1000, randomInt(-maxSpeed, maxSpeed) / 1000]
            this.dead = false
            this.size = scale
        }

        update() {
            this.x += this.direction[0]
            this.y += this.direction[1]

            let time = Date.now() - this.createdAt
            let life = time / this.life
            if(life > 1) {
                this.dead = true
            } else if(life > 0.95) {
                this.frame = 2
            } else if(life > 0.40) {
                this.frame = 1
            } else if(life > 0) {
                this.frame = 0
            }
        }

        draw() {
            for(let i = 0; i < stars[this.frame].length; i++) {
                for(let j = 0; j < stars[this.frame][i].length; j++) {
                    let value = stars[this.frame][i][j]
                    if(value > 0) {
                        ctx.fillStyle = colors[theme][value-1]
                        ctx.fillRect(this.x + j * this.size, this.y + i * this.size, this.size, this.size)
                    }
                }
            }
        }
    }

    let entities = []

    const update = () => {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        entities = entities.filter(entity => entity.dead == false)
        for(let i = entities.length, j = 0; i <= maxStars && j <= randomInt(1, 5); i++, j++) {
            entities.push(new Star())
        }
        entities.forEach(entity => entity.update())
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        entities.forEach(entity => entity.draw())
    }

    const loop = () => {
        update()
        draw()
        requestAnimationFrame(loop)
    }

    loop()
}

coverAnimation()