const screens = document.querySelector('.screen')
const ratePopup = document.querySelector('.rate-popup')
const ratePopupInfo = document.querySelector('.not-founds')
const rateList = document.querySelector('#rate-list')
const rateInfo = document.querySelector('.rate')
const balanceInfo = document.querySelector('.balance')

const dealerCards = document.querySelector('.dealer-cards')
const playerCards = document.querySelector('.player-cards')
const dealerInfo = document.querySelector('.dealer')
const playerInfo = document.querySelector('.player')

const resultPopup = document.querySelector('.result-popup')
const resultInfo = document.createElement('div')

const info = document.querySelector('.info')
const addBtn = document.querySelector('#add-btn')
const stopBtn = document.querySelector('#stop-btn')
const selectCreditBtn = document.querySelector('#select-credit-btn')
const selectRateBtn = document.querySelector('#select-rate-btn')

let balance = 10
let rate = 0
let dealer = []
let dealerStop = 0
let player = []
let stop = 0
let newGame= 0
let credit = 0
let deck = []


balanceInfo.innerHTML = `Баланс: ${balance} &#8381;`
screens.classList.add('hide')
selectCreditBtn.classList.add('hide')
selectRateBtn.classList.add('hide')

function dealerMove() {
    const dealerMove = setInterval(() => {

        if (getSum(dealer) < getSum(player) && getSum(dealer) < 21 && getSum(player) < 21) {
            getCardFor(dealer)
            resultInfo.innerHTML = `Дилер берет карты.`
        } else if (dealer.length <= 1 && dealerStop !== 1 && newGame === 1) {
            getCardFor(dealer)
            resultInfo.innerHTML = `Дилер берет карты.`
        } else if (stop === 1 || getSum(player) >= 21 || getSum(dealer) >= 21) {
            dealerStop = 1
            newGame = 0
            info.classList.add('hide')
            getCheck(getSum(dealer), getSum(player), stop)
            resultInfo.innerHTML = `Игра окончена.`
            clearInterval(dealerMove)
        } else {
            resultInfo.innerHTML = `Дилер ждет.`
        }
    }, getRandomNumber(1500, 3000))
}

rateList.addEventListener('click', event => {
     if (event.target.classList.contains('rate-btn')) {
        rate = parseInt(event.target.getAttribute('data-rate'))

         if (balance < rate) {
             ratePopupInfo.innerHTML = `Недостаточно средств.`
         } else {
             rateInfo.innerHTML = `Ставка: ${rate} &#8381;`
             balanceInfo.innerHTML = `Баланс: ${balance} &#8381;`
             ratePopup.classList.add('hide')
             screens.classList.remove('hide')

             resultInfo.classList.add('result-info')
             resultInfo.innerHTML = `Началась новая игра.`
             resultPopup.append(resultInfo)
             ratePopupInfo.innerHTML = ``
             newGame = 1

             deck = getShuffle(getDeck())

             dealerMove()
         }
         ratePopup.append(ratePopupInfo)
     }
})

addBtn.addEventListener('click', () => {
    getCardFor(player)
    info.innerHTML = `Хотите еще карту?`
})

stopBtn.addEventListener('click', () => {
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
    info.classList.add('hide')
    stop = 1
})

selectRateBtn.addEventListener('click', () => {
    getGameNew()
    ratePopup.classList.remove('hide')
    screens.classList.add('hide')
})

function getGameNew() {
    dealer = []
    player = []
    dealerStop = 0
    stop = 0
    dealerCards.innerHTML = `${dealer}`
    dealerInfo.innerHTML = `Дилер`
    playerCards.innerHTML = `${player}`
    playerInfo.innerHTML = `Вы`
    selectRateBtn.classList.add('hide')
    addBtn.classList.remove('hide')
    stopBtn.classList.remove('hide')
    info.classList.remove('hide')
}

selectCreditBtn.addEventListener('click', () => {
    const resultInfo = document.createElement('div')
    resultInfo.classList.add('result-info')
    credit -= 10
    resultInfo.innerHTML = `Ваш долг ${credit} &#8381;.`
    resultPopup.append(resultInfo)
    balance += 10
    balanceInfo.innerHTML = `Баланс: ${balance} &#8381;`
    getGameNew()
    selectCreditBtn.classList.add('hide')
    ratePopup.classList.remove('hide')
    screens.classList.add('hide')
})

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (min - max) + max)
}

function getDeck() {
    const deck = []
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
    const suits = ["Clubs", "Diamonds", "Hearts", "Spades"]

    suits.forEach(function(suit) {
        values.forEach(function (value) {
            deck.push(`${value}_of_${suit}`)
        })
    })
    return deck
}

function getShuffle(array){
    let j, temp;
    for(let i = array.length - 1; i > 0; i--){
        j = Math.floor(Math.random() * (i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array;
}

function getSum(hand) {
    let sum = 0
    for (let i=0; i<hand.length; i++) {
        let card = hand[i]
        card = card.split('_of_')[0]
        if (card.split('_of_')[0] !== 'Ace') {
            if (card === 'Jack' || card === 'Queen' || card === 'King') {
                sum = sum + 10
            } else {
                sum = sum + parseInt(card)
            }
        } else if (card.split('_of_')[0] === 'Ace') {
            if (sum > 10) {
                sum = sum + 1
            } else {
                sum = sum + 11
            }
        }
    }
    return sum
}

function getCheck(dealerSum, playerSum, stop = 0) {
    const resultInfo = document.createElement('div')
    resultInfo.classList.add('result-info')
    if (dealerSum === playerSum && stop === 1 || playerSum === 21 && dealerSum === 21){
        resultInfo.innerHTML = `Ничья.`
        getStyle()
    } else if (playerSum > dealerSum && playerSum <= 21 && stop === 1 || dealerSum > 21){
        resultInfo.innerHTML = `Вы выиграли!`
        resultInfo.classList.add('green')
        balanceInfo.innerHTML = `Баланс: ${balance = balance+rate} &#8381;`
        getStyle()
    } else if (dealerSum > playerSum && dealerSum <= 21 && stop === 1 || playerSum > 21 || dealerSum === 21) {
        resultInfo.innerHTML = `Вы проиграли.`
        resultInfo.classList.add('red')
        balanceInfo.innerHTML = `Баланс: ${balance = balance-rate} &#8381;`
        getStyle()
    } else if (playerSum === 21 && dealerSum !== 21) {
        resultInfo.innerHTML = `Black Jack!`
        resultInfo.classList.add('green')
        balanceInfo.innerHTML = `Баланс: ${balance = balance+rate} &#8381;`
        getStyle()
    }

    function getStyle() {
        if (balance <= 0) {
            resultInfo.innerHTML = `Вы банкрот.`
            selectCreditBtn.classList.remove('hide')
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
        } else {
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
            selectRateBtn.classList.remove('hide')
            clearInterval(dealerMove)
        }
    }
    resultPopup.append(resultInfo)
}

function getCardFor(name) {
    let rank, suit
    newCard(name, deck)
    rank = name[name.length - 1].split('_of_')[0]
    suit = name[name.length - 1].split('_of_')[1]
    if (name === dealer) {
        dealerCards.innerHTML += `<img class="card" src="cards/deck_${rank}_of_${suit}.svg" alt="">`
        dealerInfo.innerHTML = `Дилер (${getSum(dealer)}).`
    }  else if (name === player) {
        playerCards.innerHTML += `<img class="card" src="cards/deck_${rank}_of_${suit}.svg" alt="">`
        playerInfo.innerHTML = `Вы (${getSum(player)}).`
    }
}

function newCard(name, deck) {
    if (deck.length >= 1) {
        name.push(deck.pop())
        return name
    }
}
