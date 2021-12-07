const ratePopup = document.querySelector('#rate-modal')
const ratePopupInfo = document.querySelector('.not-founds')

const rateInfo = document.querySelector('.rate')
const balanceInfo = document.querySelector('.balance')

const dealerCards = document.querySelector('.dealer-cards')
const playerCards = document.querySelector('.player-cards')
const message = document.querySelector('.message')
const sum = document.querySelectorAll('.sum')

const resultContent = document.querySelector('#result-modal')
const resultWin = document.querySelector('.win')
const resultDefeat = document.querySelector('.defeat')
const resultDraw = document.querySelector('.draw')

const addBtn = document.querySelector('#add-btn')
const stopBtn = document.querySelector('#stop-btn')
const selectCreditBtn = document.querySelector('#select-credit-btn')
const selectRateBtn = document.querySelector('#select-rate-btn')

let rate = 0
let playerStop = 0
let newGame= 0
let deck = []
let dealerMove
let account = []

const player = {
    name: 'Вы',
    card: [],
    balance: 100,
    credit: 0,
    draw: 0,
    win: 0,
    defeat: 0,
    winCount: function() {
        return this.win++
    }
}

if (localStorage.getItem('playerScore')) {
    account = JSON.parse(localStorage.getItem('playerScore'))
    player.balance = account[1]
}


const dealer = {
    name: 'Дилер',
    card: [],
    balance: 100,
}

getBalance(player.balance)

ratePopup.classList.add('hide')
addBtn.classList.add('hide')
stopBtn.classList.add('hide') 
selectCreditBtn.classList.add('hide')

function getAnimationMessage(text) {
    message.innerHTML = text
    document.querySelector('.message-container').classList.add('animation')
    setTimeout( () => {
        document.querySelector('.message-container').classList.remove('animation')
    }, 5000)
}

const dealerMakeMove = () => {
    let dealerWait
    dealerMove = setInterval(() => {

        if (getSum(dealer.card) < getSum(player.card) && getSum(dealer.card) < 21 && getSum(player.card) < 21 && dealerWait || dealer.card.length <= 0 && newGame === 1) {

            getCardFor(dealer)

            dealerWait = false
        } else if (!dealerWait) {
            dealerWait = true
        } else {
            getCheck(getSum(dealer.card), getSum(dealer.card), playerStop)
        }
    }, getRandomNumber(1000, 1000))
}


document.querySelector('#rate-list').addEventListener('click', event => {
     if (event.target.classList.contains('rate-btn')) {
        rate = parseInt(event.target.getAttribute('data-rate'))

         if (player.balance < rate) {
             ratePopupInfo.innerHTML = `Недостаточно средств.`
         } else {
             if (rate === 5) {
                 rateInfo.innerHTML = `<div class="chip chip-red">${rate}</div>`
             } else if (rate === 25) {
                 rateInfo.innerHTML = `<div class="chip chip-green">${rate}</div>`
             } else if (rate === 100) {
                 rateInfo.innerHTML = `<div class="chip chip-black">${rate}</div>`
             }
             getBalance(player.balance)
             ratePopup.classList.add('hide')
             getGameNew()
             getAnimationMessage('Началась новая игра.')

             ratePopupInfo.innerHTML = ``
             newGame = 1

             deck = getShuffle(getDeck())

             dealerMakeMove()
         }
         ratePopup.append(ratePopupInfo)
     }
})

addBtn.addEventListener('click', () => {
    getCardFor(player)
    
})

stopBtn.addEventListener('click', () => {
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
    playerStop = 1
})

selectRateBtn.addEventListener('click', () => {
    ratePopup.classList.remove('hide')
    selectRateBtn.classList.add('hide')
})

function getBalance(balance) {
    balanceInfo.innerHTML = `<div class="currency">&#8381;</div>${balance}`
}

function getGameNew() {
    dealer.card = []
    player.card = []
    playerStop = 0
    dealerCards.innerHTML = `${dealer.card}`
    playerCards.innerHTML = `${player.card}`
    selectRateBtn.classList.add('hide')
    addBtn.classList.remove('hide')
    stopBtn.classList.remove('hide')
    sum[0].classList.add('hide')
    sum[1].classList.add('hide')
}

selectCreditBtn.addEventListener('click', () => {
    player.balance += 10
    getBalance(player.balance)
    getGameNew()
    selectCreditBtn.classList.add('hide')
    ratePopup.classList.remove('hide')
    screens.classList.add('hide')
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
})

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (min - max) + max)
}

function getDeck() {
    const deck = []
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
    const suits = ["clubs", "diamonds", "hearts", "spades"]

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

function getCheck(playerStop = 0) {
    newGame = 0

    if (getSum(dealer.card) === getSum(player.card) && playerStop === 1 || getSum(player.card) === 21 && getSum(dealer.card) === 21){
        getAnimationMessage('Ничья.')
        // resultDraw.innerHTML = ++draw
        getStyle()
    } else if (getSum(player.card) > getSum(dealer.card) && getSum(player.card) <= 21 && playerStop === 1 || getSum(dealer.card) > 21){
        getAnimationMessage('Вы выиграли!')
        resultWin.innerHTML = player.winCount
        player.balance += rate
        getStyle()
    } else if (getSum(dealer.card) > getSum(player.card) && getSum(dealer.card) <= 21 && playerStop === 1 || getSum(player.card) > 21 || getSum(dealer.card) === 21) {
        getAnimationMessage('Вы проиграли.')
        // resultDefeat.innerHTML = ++defeat
        player.balance -= rate
        getStyle()
    } else if (getSum(player.card) === 21 && getSum(dealer.card) !== 21) {
        getAnimationMessage('Black Jack!')
        // resultWin.innerHTML = ++win
        player.balance += rate
        getStyle()
    }

    function getStyle() {
        getBalance(player.balance)
        if (player.balance <= 0) {
            message.innerHTML = `Вы банкрот.`
            selectCreditBtn.classList.remove('hide')
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
            clearInterval(dealerMove)
        } else {
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
            selectRateBtn.classList.remove('hide')
            clearInterval(dealerMove)
        }
    }
    account = [player.name, player.balance]
    localStorage.setItem('playerScore', JSON.stringify(account))
}

function getCardFor(name) {
    let rank, suit
    getCardNew(name.card, deck)
    rank = name.card[name.card.length - 1].split('_of_')[0]
    suit = name.card[name.card.length - 1].split('_of_')[1]
    getCardSum()
    if (name.name === 'Дилер') {
        sum[0].classList.remove('hide')
        dealerCards.innerHTML += `<img class="card" src="assets/cards/deck_${rank}_of_${suit}.svg" alt="${rank}_of_${suit}">`
    }  else if (name.name === 'Вы') {
        sum[1].classList.remove('hide')
        playerCards.innerHTML += `<img class="card" src="assets/cards/deck_${rank}_of_${suit}.svg" alt="${rank}_of_${suit}">`
    }
}

function getCardNew(name, deck) {
    if (deck.length >= 1) {
        name.push(deck.pop())
        return name
    }
}

function getCardSum() {
    const sum = document.querySelectorAll('.sum')
    sum[0].innerHTML = `${getSum(dealer.card)}`
    sum[1].innerHTML = `${getSum(player.card)}`
}

document.querySelector('#result-modal').addEventListener('click', (event) => {
    if (event.target.classList.contains('icon-bubble2')) {
        event.target.classList.toggle('icon-bubble2')
        event.target.classList.add('icon-bubble')
        resultContent.classList.remove('hide')
    } else if (event.target.classList.contains('icon-bubble')) {
        event.target.classList.toggle('icon-bubble')
        event.target.classList.add('icon-bubble2')
        resultContent.classList.add('hide')
    }
})

// document.querySelector('.close').forEach(item => {
//     console.log(item)
//     item.addEventListener('click', event => {
//         console.log(event)
//     })
// })


