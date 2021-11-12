const ratePopup = document.querySelector('#rate-modal')
const ratePopupInfo = document.querySelector('.not-founds')

const rateList = document.querySelector('#rate-list')
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

let balance = 100
getBalance(balance)

let rate = 0
let dealerArray = []
let playerArray = []
let playerStop = 0
let newGame= 0
let credit = 0
let deck = []
let dealerMove
let draw = 0
let win = 0
let defeat = 0


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

function dealerMove1() {
    let dealerWait
    dealerMove = setInterval(() => {

        if (getSum(dealerArray) < getSum(playerArray) && getSum(dealerArray) < 21 && getSum(playerArray) < 21 && dealerWait || dealerArray.length <= 0 && newGame === 1) {

            getCardFor(dealerArray)
            // getResultMessage('Дилер взял карту.')
            dealerWait = false
        } else if (!dealerWait) {
            // getResultMessage('Дилер ждёт.')
            dealerWait = true
        } else {
            getCheck(getSum(dealerArray), getSum(playerArray), playerStop)
        }
    }, getRandomNumber(1000, 1000))
}

rateList.addEventListener('click', event => {
     if (event.target.classList.contains('rate-btn')) {
        rate = parseInt(event.target.getAttribute('data-rate'))

         if (balance < rate) {
             ratePopupInfo.innerHTML = `Недостаточно средств.`
         } else {
             if (rate === 5) {
                 rateInfo.innerHTML = `<div class="chip chip-red">${rate}</div>`
             } else if (rate === 25) {
                 rateInfo.innerHTML = `<div class="chip chip-green">${rate}</div>`
             } else if (rate === 100) {
                 rateInfo.innerHTML = `<div class="chip chip-black">${rate}</div>`
             }
             getBalance(balance)
             ratePopup.classList.add('hide')
             getGameNew()
             getAnimationMessage('Началась новая игра.')
             // message.innerHTML = `Началась новая игра.`
             // document.querySelector('.message-container').classList.add('animation')
             // setTimeout( () => {
             //     document.querySelector('.message-container').classList.remove('animation')
             // }, 5000)

             ratePopupInfo.innerHTML = ``
             newGame = 1

             deck = getShuffle(getDeck())

             dealerMove1()
         }
         ratePopup.append(ratePopupInfo)
     }
})

addBtn.addEventListener('click', () => {
    getCardFor(playerArray)
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
    dealerArray = []
    playerArray = []
    playerStop = 0
    dealerCards.innerHTML = `${dealerArray}`
    playerCards.innerHTML = `${playerArray}`
    selectRateBtn.classList.add('hide')
    addBtn.classList.remove('hide')
    stopBtn.classList.remove('hide')
    sum[0].classList.add('hide')
    sum[1].classList.add('hide')
}

selectCreditBtn.addEventListener('click', () => {
    const resultInfo = document.createElement('div')
    resultInfo.classList.add('result-info')
    credit -= 10
    resultInfo.innerHTML = `Ваш долг ${credit} &#8381;.`
    resultContent.append(resultInfo)
    balance += 10
    getBalance(balance)
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

function getCheck(dealerSum, playerSum, playerStop = 0) {
    newGame = 0

    if (getSum(dealerArray) === getSum(playerArray) && playerStop === 1 || getSum(playerArray) === 21 && getSum(dealerArray) === 21){
        // message.innerHTML = `Ничья.`
        getAnimationMessage('Ничья.')
        resultDraw.innerHTML = ++draw
        getStyle()
    } else if (getSum(playerArray) > getSum(dealerArray) && getSum(playerArray) <= 21 && playerStop === 1 || getSum(dealerArray) > 21){
        // message.innerHTML = `Вы выиграли!`
        getAnimationMessage('Вы выиграли!')
        resultWin.innerHTML = ++win
        balance += rate
        getStyle()
    } else if (getSum(dealerArray) > getSum(playerArray) && getSum(dealerArray) <= 21 && playerStop === 1 || getSum(playerArray) > 21 || getSum(dealerArray) === 21) {
        // message.innerHTML = `Вы проиграли.`
        getAnimationMessage('Вы проиграли.')
        resultDefeat.innerHTML = ++defeat
        balance -= rate
        getStyle()
    } else if (getSum(playerArray) === 21 && getSum(dealerArray) !== 21) {
        // message.innerHTML = `Black Jack!`
        getAnimationMessage('Black Jack!')
        resultWin.innerHTML = ++win
        balance += rate
        getStyle()
    }

    function getStyle() {
        getBalance(balance)
        if (balance <= 0) {
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
}

function getCardFor(name) {
    let rank, suit
    getCardNew(name, deck)
    rank = name[name.length - 1].split('_of_')[0]
    suit = name[name.length - 1].split('_of_')[1]
    getCardSum()
    if (name === dealerArray) {
        sum[0].classList.remove('hide')
        dealerCards.innerHTML += `<img class="card" src="assets/cards/deck_${rank}_of_${suit}.svg" alt="${rank}_of_${suit}">`
    }  else if (name === playerArray) {
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
    sum[0].innerHTML = `${getSum(dealerArray)}`
    sum[1].innerHTML = `${getSum(playerArray)}`

}

document.querySelector('#result').addEventListener('click', (event) => {
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


