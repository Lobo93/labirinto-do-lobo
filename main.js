// Tamanho do labirinto (valores ímpares)
const mazeHeight = 21
const mazeWidth = 31

// Array que representa o labirinto: 0 = caminho, 1 = parede
const maze = Array(mazeHeight).fill(null)
maze.forEach((row, index) => maze[index] = Array(mazeWidth).fill(1))

// Escavador (Cria os caminhos do labirinto)
const digger = {
	direction: 'left',
	x: 1,
	y: 1,
	digsLeft: Math.floor(mazeWidth / 2) * Math.floor(mazeHeight / 2) - 1
}
maze[digger.y][digger.x] = 0

// Escavar caminhos
while(digger.digsLeft > 0) {
	const allowedDirections = ['left', 'right', 'up', 'down']
	if (digger.y <= 1) allowedDirections.splice(allowedDirections.indexOf('up'), 1)
	if (digger.x <= 1) allowedDirections.splice(allowedDirections.indexOf('left'), 1)
	if (digger.y >= mazeHeight - 2) allowedDirections.splice(allowedDirections.indexOf('down'), 1)
	if (digger.x >= mazeWidth - 2) allowedDirections.splice(allowedDirections.indexOf('right'), 1)

	digger.direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)]

	switch(digger.direction) {
		case 'left': digger.x -= 2; break;
		case 'right': digger.x += 2; break;
		case 'up': digger.y -= 2; break;
		case 'down': digger.y += 2; break;
	}

	if (maze[digger.y][digger.x] === 1) {
		digger.digsLeft--
		maze[digger.y][digger.x] = 0
		switch(digger.direction) {
			case 'left': maze[digger.y][digger.x + 1] = 0; break;
			case 'right': maze[digger.y][digger.x - 1] = 0; break;
			case 'up': maze[digger.y + 1][digger.x] = 0; break;
			case 'down': maze[digger.y - 1][digger.x] = 0; break;
		}
	}
}

// Jogador
const player = {
	x: 0,
	y: 0
}

// Criar entrada e saída
const entry = Math.floor(Math.random()*(mazeHeight - 1) / 2) * 2 + 1
const exit = Math.floor(Math.random()*(mazeHeight - 1) / 2) * 2 + 1

maze[entry][0] = 0
maze[exit][mazeWidth - 1] = 0

player.y = entry

// Renderizar o labirinto na tela
const render = document.getElementById('render')

function renderMaze() {
	render.textContent = ''
	for (let y = 0; y < mazeHeight; y++) {
		render.textContent += y === entry ? '→' : ' '
		for (let x = 0; x < mazeWidth; x++) {
			render.textContent += player.x === x && player.y === y ? '☺' : maze[y][x] === 1 ? '■' : ' ' 
		}
		render.textContent += y === exit ? '→\n' : ' \n'
	}
}
renderMaze()

// Contador de movimentos
const movesDisplay = document.getElementById('movesDisplay')
let moves = 0

// Vitória
let win = false

// Controlar jogador
window.addEventListener('keydown', ({code}) => {
	if (code === 'KeyA' || code === 'ArrowLeft') move('left')
	else if (code === 'KeyD' || code === 'ArrowRight') move('right')
	else if (code === 'KeyW' || code === 'ArrowUp') move('up')
	else if (code === 'KeyS' || code === 'ArrowDown') move('down')
})

const buttonLeft = document.getElementById('buttonLeft')
const buttonRight = document.getElementById('buttonRight')
const buttonUp = document.getElementById('buttonUp')
const buttonDown = document.getElementById('buttonDown')

buttonLeft.addEventListener('click', ()=> move('left'))
buttonRight.addEventListener('click', ()=> move('right'))
buttonUp.addEventListener('click', ()=> move('up'))
buttonDown.addEventListener('click', ()=> move('down'))

function move(direction) {
	if (!win) {
		if (direction === 'left' && player.x > 0 && !maze[player.y][player.x - 1]) {
			player.x--
			moves++
		}
		else if (direction === 'right' && player.x < mazeWidth - 1 && !maze[player.y][player.x + 1]) {
			player.x++
			moves++
		}
		else if (direction === 'up' && player.y > 0 && !maze[player.y - 1][player.x]) {
			player.y--
			moves++
		}
		else if (direction === 'down' && player.y < mazeHeight - 1 && !maze[player.y + 1][player.x]) {
			player.y++
			moves++
		}

		movesDisplay.textContent = `Movimentos: ${moves}`

		if (player.x >= mazeWidth - 1) {
			win = true;
			movesDisplay.innerHTML += ' <strong>Ganhou!</strong>'
		}

		renderMaze()
	}
}

// Novo labirinto
const newMaze = document.getElementById('newMaze')
newMaze.addEventListener('click', ()=> {
	window.location.reload()
})