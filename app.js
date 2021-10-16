const screens = document.querySelectorAll('.screen')
const rateList = document.querySelector('#rate-list')
const rateInfo = document.querySelector('.rate')
const balanceInfo = document.querySelector('.balance')

const dealerCards = document.querySelector('.dealer-cards')
const playerCards = document.querySelector('.player-cards')
const dealerInfo = document.querySelector('.dealer')
const playerInfo = document.querySelector('.player')

const result = document.querySelector('.result')
const resultInfo = document.createElement('div')

const info = document.querySelector('.info')
const addBtn = document.querySelector('#add-btn')
const stopBtn = document.querySelector('#stop-btn')
const reBtn = document.querySelector('#re-btn')

let balance = 100
let rate = 0
let dealer = []
let player = []
screens[1].classList.add('hide')


rateList.addEventListener('click', event => {
     if (event.target.classList.contains('rate-btn')) {
        rate = parseInt(event.target.getAttribute('data-rate'))
        rateInfo.innerHTML = `Ставка: ${rate} &#8381;`
        balanceInfo.innerHTML = `Баланс: ${balance} &#8381;`
         screens[0].classList.add('hide')
         screens[1].classList.remove('hide')

        resultInfo.classList.add('result-info')
        resultInfo.innerHTML = `Началась новая игра.`
        result.append(resultInfo)
     }
})

addBtn.addEventListener('click', () => {

    getCardFor(dealer)
    getCardFor(player)

    info.innerHTML = `Хотите еще карту?`

    getCheck(getSum(dealer), getSum(player))
})

stopBtn.addEventListener('click', () => {

    // for (let i=0; i<3; i++) {

    if (getSum(dealer) <= 14 || getSum(player) > getSum(dealer)) {
        getCardFor(dealer)
    }
    if (getSum(dealer) <= 14 || getSum(player) > getSum(dealer)) {
        getCardFor(dealer)
    }
    if (getSum(dealer) <= 14 || getSum(player) > getSum(dealer)) {
        getCardFor(dealer)
    }
    // }

    getCheck(getSum(dealer), getSum(player), 1)
})
reBtn.addEventListener('click', () => {
    dealer.splice(0,5)
    player.splice(0,5)

    dealerCards.innerHTML = `${dealer}`
    dealerInfo.innerHTML = `Дилер`

    playerCards.innerHTML = `${player}`
    playerInfo.innerHTML = `Вы`

     reBtn.style.display = 'none'
    addBtn.style.display = 'inline-block'
    stopBtn.style.display = 'inline-block'
    screens[0].classList.remove('hide')
    screens[1].classList.add('hide')
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

// function getStatus(name) {
//     if (name === dealer) {
//         return `Карты дилера: ${dealer.join(' ')}.`
//     } else if (name === player) {
//         return `Ваши карты: ${player.join(' ')}.`
//     } else {
//         return `Новый игрок: ${name.join(' ')}.`
//     }
// }

function getCheck(dealerSum, playerSum, stop = 0) {
    const resultInfo = document.createElement('div')
    resultInfo.classList.add('result-info')

    if (dealerSum > playerSum && dealerSum <= 21 && stop === 1 || playerSum > 21 || dealerSum === 21) {
        resultInfo.innerHTML = `Вы проиграли.`
        resultInfo.classList.add('red')
        balanceInfo.innerHTML = `Баланс: ${balance = balance-rate} &#8381;`
        getStyle()
    } else if (dealerSum < playerSum && dealerSum <= 21 && stop === 1 || dealerSum > 21){
        resultInfo.innerHTML = `Вы выиграли!`
        resultInfo.classList.add('green')
        balanceInfo.innerHTML = `Баланс: ${balance = balance+rate} &#8381;`
        getStyle()
    } else if (dealerSum === playerSum && stop === 1 || playerSum === 21 && dealerSum === 21){
        resultInfo.innerHTML = `Ничья.`
        getStyle()
    } else if (playerSum === 21 && dealerSum !== 21) {
        resultInfo.innerHTML = `Black Jack!`
        resultInfo.classList.add('green')
        balanceInfo.innerHTML = `Баланс: ${balance = balance+rate} &#8381;`
        getStyle()
    }

    function getStyle() {
        if (balance <= 0) {
            resultInfo.classList.add('red')
            resultInfo.innerHTML = `Вы банкрот.`
            addBtn.style.display = 'none'
            stopBtn.style.display = 'none'
        } else {
            addBtn.style.display = 'none'
            stopBtn.style.display = 'none'
            reBtn.style.display = 'block'
        }
    }
    result.append(resultInfo)
}

function getCardFor(name) {
    if (name === dealer) {
        if (getSum(dealer) <= 14 || getSum(player) > getSum(dealer)) {
            dealer.push(getCard())
            dealerCards.innerHTML = `${dealer}`
            dealerInfo.innerHTML = `Дилер (${getSum(dealer)}).`
        }
    }  else if (name === player) {
        player.push(getCard())
        playerCards.innerHTML = `${player}`
        playerInfo.innerHTML = `Вы (${getSum(player)}).`
    }
}
