// const game = document.querySelector('#game')
const modalRate = document.querySelector('#modal-rate')

const rateInfo = document.querySelector('.profile__rate')
const balanceNumber = document.querySelector('.profile__balance__number')

const cards = document.querySelectorAll('.board__cards')
const boardMessage = document.querySelector('.board__message')
const sum = document.querySelectorAll('.board__sum')

const addBtn = document.querySelector('#add-btn')
const stopBtn = document.querySelector('#stop-btn')
const selectCreditBtn = document.querySelector('#select-credit-btn')
const selectRateBtn = document.querySelector('#select-rate-btn')

let newGame= false
let deck = []
let dealerMove
let account = []

const player = {
    name: 'Вы',
    card: [],
    cardStop: false,
    sumCard: 0,
    balance: 100,
    rate: 0,
    credit: 0,
    draw: 0,
    win: 0,
    defeat: 0,
    winCount: function() {
        return this.win++
    }
}
if (localStorage.getItem('account-game21')) {
    account = JSON.parse(localStorage.getItem('account-game21'))
    player.name = account[0]
    player.balance = account[1]
    textAdd('.profile__name', account[0])
    textAdd('.profile__balance__number', account[1])
} else {
    elementClassRemove('#modal-name', 'hide', 1000)
    document.forms["name"].addEventListener('submit', event => {
        player.name = document.forms["name"].elements["nickname"].value
        account[0] = player.name
        account[1] = player.balance
        localStorage.setItem('account-game21', JSON.stringify(account))
    })
    textAdd('.profile__name', player.name)
    textAdd('.profile__balance__number', player.balance)
}

const dealer = {
    name: 'Дилер',
    card: [],
    sumCard: 0,
    balance: 100,
}

const dealerMakeMove = () => {
    dealerMove = setInterval(() => {
        if (getSum(dealer.card) < getSum(player.card) && getSum(dealer.card) < 21 && getSum(player.card) < 21 || dealer.card.length <= 0 && newGame) {
            getCardFor(dealer)
        } 
    }, 2000)
}

const getCheckGame = () => {
    checkGame = setInterval(() => {
        console.log('sdd');
        if (newGame) {
            getCheck()
        } else {
            clearInterval(checkGame)
        }
    }, 100)
}

document.querySelector('#rate-list').addEventListener('click', event => {
     if (event.target.classList.contains('rate-btn')) {
        player.rate = parseInt(event.target.getAttribute('data-rate'))

         if (player.balance < player.rate) {
             console.log('Недостаточно средств.');
         } else {
             if (player.rate === 5) {
                 rateInfo.innerHTML = `<div class="chip chip-red">${player.rate}</div>`
             } else if (player.rate === 25) {
                 rateInfo.innerHTML = `<div class="chip chip-green">${player.rate}</div>`
             } else if (player.rate === 100) {
                 rateInfo.innerHTML = `<div class="chip chip-black">${player.rate}</div>`
             }
             modalRate.classList.add('hide')
             getGameNew()

             classAdd('.board__message', '.animation__opacity')
             textAdd('.board__message', 'Началась новая игра')
             classRemove('.board__message', '.animation__opacity', 5000)

             newGame = true
             deck = getShuffle(getDeck())
             dealerMakeMove()
             getCheckGame()
         }
     }
})

addBtn.addEventListener('click', () => {
    getCardFor(player)
})

stopBtn.addEventListener('click', () => {
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
    player.cardStop = true
})

selectRateBtn.addEventListener('click', () => {
    modalRate.classList.remove('hide')
    selectRateBtn.classList.add('hide')
})

function getBalanceNew(balance, balanceNew) {
    let ms = 2000
    let b = Math.abs(balance - balanceNew)
    let step = 1
    step = b > ms ? step = 1 + Math.pwc((String(b).length - 2), 3) : step
    let t = Math.round(ms / (b / step))
    let interval = setInterval(() => {
        if (balanceNew == balance) {
            balanceNumber.classList.remove('bold', 'red', 'green')
            clearInterval(interval)
        } else if (balanceNew < balance) {
            balanceNumber.classList.add('bold', 'green')
            step = balance - step <= balanceNew ? 1 : step
            balanceNew += step
        } else if (balanceNew > balance) {
            balanceNumber.classList.add('bold', 'red')
            step = balance + step >= balanceNew ? 1 : step
            balanceNew -= step
        }
        balanceNumber.textContent = `${balanceNew}`
    }, t)
}

function numberIncrease(element, to) {
    let from = !element.textContent ? 0 : Number(element.textContent)
    element.textContent = `${from}`
    let b = Math.abs(from - to)
    let ms = 1400
    let step = 1
    let t = Math.round(ms / (b / step))
    let interval = setInterval(() => {
        if (from < to) {
            from += step
        } else {
            clearInterval(interval)
        }
        element.textContent = `${from}`
    }, t)
}

function getGameNew() {
    dealer.card = []
    player.card = []
    deck = []
    playerStop = false
    cards[0].innerHTML = `${dealer.card}`
    cards[1].innerHTML = `${player.card}`
    selectRateBtn.classList.add('hide')
    addBtn.classList.remove('hide')
    stopBtn.classList.remove('hide')
    sum[0].textContent = ''
    sum[1].textContent = ''
    sum[0].classList.add('hide')
    sum[1].classList.add('hide')
}

selectCreditBtn.addEventListener('click', () => {
    player.balance += 10
    getBalance(player.balance)
    getGameNew()
    selectCreditBtn.classList.add('hide')
    modalRate.classList.remove('hide')
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
})

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (min - max) + max)
}

function getDeck() {
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    // const suits = ["clubs", "diamonds", "hearts", "spades"]
    // const suits = ["&clubs;", "&diams;", "&hearts;", "&spades;"]
    const suits = ["&clubs;&#xFE0E;", "&diams;&#xFE0E;", "&hearts;&#xFE0E;", "&spades;&#xFE0E;"]
    
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
        if (card.split('_of_')[0] !== 'A') {
            if (card === 'J' || card === 'Q' || card === 'K') {
                sum = sum + 10
            } else {
                sum = sum + parseInt(card)
            }
        } else if (card.split('_of_')[0] === 'A') {
            if (sum > 10) {
                sum = sum + 1
            } else {
                sum = sum + 11
            }
        }
    }
    return sum
}

function getCheck() {
    let balance
    if (getSum(dealer.card) === getSum(player.card) && player.cardStop || getSum(player.card) === 21 && getSum(dealer.card) === 21){
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Ничья.')
        classRemove('.board__message', '.animation__opacity', 5000)

        getStyle()
        player.cardStop = false
    } else if (getSum(player.card) > getSum(dealer.card) && getSum(player.card) <= 21 && player.cardStop || getSum(dealer.card) > 21){ 
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Вы выиграли!')
        classRemove('.board__message', '.animation__opacity', 5000)
        elementAdd('.profile__rate', ['.profile__rate__text'])
        classAdd('.profile__rate__text', '.green')
        textAdd('.profile__rate__text', `+${player.rate}`)
        elementDelete('.profile__rate__text', 2400)
        elementDelete('.chip', 100)

        balance = player.balance + player.rate
        getBalanceNew(balance, player.balance)
        player.balance += player.rate
        getStyle()
    } else if (getSum(dealer.card) > getSum(player.card) && getSum(dealer.card) <= 21 && player.cardStop || getSum(player.card) > 21 || getSum(dealer.card) === 21) {
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Вы проиграли.')
        classRemove('.board__message', '.animation__opacity', 5000)
        elementAdd('.profile__rate', ['.profile__rate__text'])
        classAdd('.profile__rate__text', '.red')
        textAdd('.profile__rate__text', `-${player.rate}`)
        elementDelete('.profile__rate__text', 2400)
        elementDelete('.chip', 100)

        balance = player.balance - player.rate
        getBalanceNew(balance, player.balance)
        player.balance -= player.rate
        getStyle()
    } else if (getSum(player.card) === 21 && getSum(dealer.card) !== 21) {
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Black Jack!')
        classRemove('.board__message', '.animation__opacity', 5000)
        elementAdd('.profile__rate', ['.profile__rate__text'])
        classAdd('.profile__rate__text', '.green')
        textAdd('.profile__rate__text', `+${player.rate}`)
        elementDelete('.profile__rate__text', 2400)
        elementDelete('.chip', 100)
        
        balance = player.balance + player.rate
        getBalanceNew(balance, player.balance)
        player.balance += player.rate
        getStyle()
    }
    function getStyle() {
        if (player.balance <= 0) {
            classAdd('.board__message', '.animation__opacity')
            textAdd('.board__message', 'Вы банкрот.')
            classRemove('.board__message', '.animation__opacity', 5000)
            selectCreditBtn.classList.remove('hide')
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
            clearInterval(dealerMove)
            newGame = false
        } else {
            addBtn.classList.add('hide')
            stopBtn.classList.add('hide')
            selectRateBtn.classList.remove('hide')
            clearInterval(dealerMove)
            newGame = false
            
        }
    }
    account = [player.name, player.balance]
    localStorage.setItem('account-game21', JSON.stringify(account))
}

function getCardFor(name) {
    let sum = document.querySelectorAll('.board__sum')
    let rank, suit
    getCardNew(name.card, deck)
    rank = name.card[name.card.length - 1].split('_of_')[0]
    suit = name.card[name.card.length - 1].split('_of_')[1]
    if (name.name === 'Дилер') {
        n = 0

        numberIncrease(sum[n], getSum(dealer.card))
        // textAdd(className,`${getSum(dealer.card)}`)

        // sum[n].innerHTML = `${getSum(dealer.card)}`
    }  else if (name.name === account[0]) {
        n = 1

        numberIncrease(sum[n], getSum(player.card))
        // textAdd(className, text)

        // sum[n].innerHTML = `${getSum(player.card)}`
    }
    sum[n].classList.remove('hide')
    // cards[n].innerHTML += `<img class="card" src="assets/cards/deck_${rank}_of_${suit}.svg" alt="${rank}_of_${suit}">`
    const card = document.querySelectorAll('.card')
    let q = card.length
    cards[n].innerHTML += `
    <div class="card card-${q}">
    <div class="card__front"></div>
    <div class="card__back">
        <div class="card__rank">${rank}</div>
        <div class="card__suits">${suitColor(suit)}</div>
        <div class="card__icon__lg">${suitColor(suit)}</div>
    </div>
    </div>`
    classAdd(`.card-${q}`, '.open', 100)
}
function suitColor(suit) {
    if (suit.indexOf('diams') !== -1 || suit.indexOf('hearts') !== -1) {
        return `<div class="red">${suit}</div>`
    } else {
        return `<div class="">${suit}</div>`
    }
}
function getCardNew(name, deck) {
    if (deck.length >= 1) {
        name.push(deck.pop())
        return name
    }
}
function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }

function delta(progress) {
    return progress;
}

function moveToBlock(element, element2, duration) {
    let toLeft = getCoords(element2).left - getCoords(element).left
    let toTop = getCoords(element2).top - getCoords(element).top
    const from = 0; // Начальная координата X
    const start = new Date().getTime(); // Время старта

    setTimeout(function() {
        const now = (new Date().getTime()) - start // Текущее время
        let progress = now / duration // Прогресс анимации
        let result = (toLeft - from) * delta(progress) + from
        element.style.left = result + "px"
        if (progress < 1) { // Если анимация не закончилась, продолжаем
            setTimeout(arguments.callee, 10)
        } else {
            element.style.left = toLeft + "px"
        }
    }, 10)
    setTimeout(function() {
        const now = (new Date().getTime()) - start // Текущее время
        let progress = now / duration // Прогресс анимации
        let result = (toTop - from) * delta(progress) + from
        element.style.top = result + "px"
        if (progress < 1) { // Если анимация не закончилась, продолжаем
            setTimeout(arguments.callee, 10)
        } else {
            element.style.top = toTop + "px"
        }
    }, 10)
}

function elementAdd(element, className) {
    let e
    if (element.charAt(0) === '.' || element.charAt(0) === '#') {
        element = document.querySelector(`${element}`)
        e = document.createElement('div')
    }
    for (let i = 0; i < className.length; i++) {
        if (className[i].charAt(0) === '.') {
            e.classList.add(`${className[i].substring(1, className[i].length)}`)
        } else if (className[i].charAt(0) === '#') {
            e.id = `${className[i].substring(1, className[i].length)}`
        }
    }
    element.append(e)
}
function elementDelete(className, duration = 0) {
    let e = document.querySelector(`${className}`)
    setTimeout(() => {
        e.remove()
    }, duration)
}
function classAdd(className, classAdd, duration = 0) {
    let e = document.querySelector(`${className}`)
    setTimeout(() => {
        e.classList.add(`${classAdd.substring(1, classAdd.length)}`)
    }, duration)
}
function elementClassRemove(element, classRemove, duration = 0) {
    if (element.charAt(0) === '.' || element.charAt(0) === '#') {
        element = document.querySelector(`${element}`)
    }
    setTimeout(() => {
        element.classList.remove(`${classRemove}`)
    }, duration)
}

function classRemove(className, classRemove, duration = 0) {
    let e = document.querySelector(`${className}`)
    setTimeout(() => {
        e.classList.remove(`${classRemove.substring(1, classRemove.length)}`)
    }, duration)
}

function textAdd(className, text) {
    let e = document.querySelector(`${className}`)
    e.innerText = `${text}`
}

function setChildNodesText(element, className, text) {
    const elements = document.querySelector(`${element}`)
    let notes
    for (let i = 0; i < elements.childNodes.length; i++) {
        if (elements.childNodes[i].className === `${className}`) {
        notes = elements.childNodes[i]
        notes.innerText = `${text}`
        }
    }
}



// classRemove(className, classRemove, duration = 0)
// elementDelete('board__message', 5000)

// elementAdd('#game', ['#modal-name', '.modal']) // , '.hide'
// elementAdd('#modal-name', ['.modal__header'])
// elementAdd('#modal-name', ['.modal__body'])
// setChildNodesText('#modal-name', 'modal__header', 'Ваше Имя:')


// function getBalance(a) {
//     return function(b) {
//         return a * b
//     }
// }

// const balance = getBalance(100)

// console.log(balance(2));