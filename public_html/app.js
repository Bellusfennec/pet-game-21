const game = document.querySelector('#game')
const startBtn = document.createElement('button')
const scoreInfo = document.createElement('div')
const dealerInfo = document.createElement('div')
const playerInfo = document.createElement('div')
const result = document.createElement('div')
const resultBlock = document.createElement('div')
const info = document.createElement('div')
const addBtn = document.createElement('button')
const stopBtn = document.createElement('button')
const reBtn = document.createElement('button')
let dealer = []
let player = []
let score = 0
let dealerSum = 0
let playerSum = 0

scoreInfo.classList.add('score')
scoreInfo.innerHTML = `${score}.`
game.appendChild(scoreInfo)

startBtn.classList.add('start-btn')
startBtn.innerHTML = 'Старт'
game.appendChild(startBtn)

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'

    dealerInfo.classList.add('dealer-info')
    game.appendChild(dealerInfo)

    playerInfo.classList.add('player-info')
    game.appendChild(playerInfo)

    info.classList.add('info')
    game.appendChild(info)

    addBtn.classList.add('add-btn')
    addBtn.innerHTML = 'Взять карту'
    game.appendChild(addBtn)

    stopBtn.classList.add('stop-btn')
    stopBtn.innerHTML = 'Стоп'
    game.appendChild(stopBtn)

    reBtn.classList.add('add-btn')
    reBtn.innerHTML = 'Новая игра'
    game.appendChild(reBtn)

    resultBlock.classList.add('result-block')
    game.appendChild(resultBlock)

    dealer.push(getCard())
    player.push(getCard())
    dealerSum = getSum(dealer)
    playerSum = getSum(player)
    dealerInfo.innerHTML = `${getStatus(dealer)} (${dealerSum}).`
    playerInfo.innerHTML = `${getStatus(player)} (${playerSum}).`
    info.innerHTML = `Взять карту?`
})

addBtn.addEventListener('click', () => {

    getDealerAction()

    player.push(getCard())
    playerSum = getSum(player)

    dealerInfo.innerHTML = `${getStatus(dealer)} (${dealerSum}).`
    playerInfo.innerHTML = `${getStatus(player)} (${playerSum}).`
    info.innerHTML = `Хотите еще карту?`

    const result = document.createElement('div')
    result.classList.add('result')
    result.innerHTML = `Вы взяли карту.`
    resultBlock.append(result)

    getCheck(dealerSum, playerSum)
})
stopBtn.addEventListener('click', () => {

    getDealerAction()
    getDealerAction()
    getDealerAction()

    dealerInfo.innerHTML = `${getStatus(dealer)} (${dealerSum}).`
    playerInfo.innerHTML = `${getStatus(player)} (${playerSum}).`

    getCheck(dealerSum, playerSum, 1)
})
reBtn.addEventListener('click', () => {
    dealer.splice(0,5)
    player.splice(0,5)
    dealer.push(getCard())
    player.push(getCard())
    dealerSum = 0
    playerSum = 0
    dealerSum = getSum(dealer)
    playerSum = getSum(player)
    dealerInfo.innerHTML = `${getStatus(dealer)} (${dealerSum}).`
    playerInfo.innerHTML = `${getStatus(player)} (${playerSum}).`
    info.innerHTML = `Хотите еще карту?`
    reBtn.style.display = 'none'
    addBtn.style.display = 'inline-block'
    stopBtn.style.display = 'inline-block'

    const result = document.createElement('div')
    result.classList.add('result')
    result.innerHTML = `Началась новая игра.`
    resultBlock.append(result)
})
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (min - max) + max)
}

function getCard() {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    return cards[getRandomNumber(0, cards.length - 1)]
}

function getSum(hand) {
    let sum = 0
    for (let i=0; i<hand.length; i++) {
        let card = hand[i]
        if (card !== 'A') {
            if (card === 'J' || card === 'Q' || card === 'K') {
                sum = sum + 10
            } else {
                sum = sum + parseInt(card)
            }
        }
    }
    for (let i=0; i<hand.length; i++) {
        let card = hand[i]
        if (card === 'A') {
            if (sum > 10) {
                sum = sum + 1
            } else {
                sum = sum + 11
            }
        }

    }
    return sum
}

function getStatus(name) {
    if (name === dealer) {
        return `Дилер: ${dealer.join(' ')}.`
    } else if (name === player) {
        return `Игрок: ${player.join(' ')}.`
    } else {
        return `Новый игрок: ${name.join(' ')}.`
    }
}

function getCheck(dealerSum, playerSum, stop = 0) {
    const result = document.createElement('div')
    result.classList.add('result')

    if (dealerSum > playerSum && dealerSum <= 21 && stop === 1) {
        result.innerHTML = `Вы проиграли.`
        result.classList.add('red')
        scoreInfo.innerHTML = `${--score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (dealerSum < playerSum && dealerSum <= 21 && stop === 1){
        result.innerHTML = `Вы выиграли!`
        result.classList.add('green')
        scoreInfo.innerHTML = `${++score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (dealerSum === playerSum && stop === 1){
        result.innerHTML = `Ничья.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (playerSum === 21 && dealerSum === 21) {
        result.innerHTML = `Ничья.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (playerSum > 21) {
        result.innerHTML = `Вы проиграли.`
        result.classList.add('red')
        scoreInfo.innerHTML = `${--score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (dealerSum > 21) {
        result.innerHTML = `Вы выиграли!`
        result.classList.add('green')
        scoreInfo.innerHTML = `${++score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (playerSum === 21 && dealerSum !== 21) {
        result.innerHTML = `Black Jack!`
        result.classList.add('green')
        scoreInfo.innerHTML = `${++score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    } else if (dealerSum === 21) {
        result.innerHTML = `Вы проиграли.`
        result.classList.add('red')
        scoreInfo.innerHTML = `${--score}.`
        addBtn.style.display = 'none'
        stopBtn.style.display = 'none'
        reBtn.style.display = 'block'
    }

    resultBlock.append(result)
}

function getDealerAction() {
    const result = document.createElement('div')
    result.classList.add('result')

    if (dealerSum <= 14) {
        dealer.push(getCard())
        dealerSum = getSum(dealer)
        result.innerHTML = `Дилер взял карту.`
    } else if (playerSum > dealerSum) {
        dealer.push(getCard())
        dealerSum = getSum(dealer)
        result.innerHTML = `Дилер взял карту.`
    } else {
        dealerSum = getSum(dealer)
    }


    resultBlock.append(result)
}