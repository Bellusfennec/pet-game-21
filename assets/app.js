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

let player = {
    name: 'Вы',
    card: [],
    cardStop: false,
    sumCard: 0,
    balance: 100,
    rate: 0,
    credit: 0,
    statistics: {
        win: 0,
        lose: 0,
        total: 0,
    }
}

const dealer = {
    name: 'Дилер',
    card: [],
    cardStop: false,
    sumCard: 0,
    balance: 100,
}

if (!localStorage.getItem('account-game21')) {
    localStorage.setItem('account-game21', JSON.stringify(player))
} else {
    player = JSON.parse(localStorage.getItem('account-game21'))

    if (player.balance === 0) {
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Вам начислено 10 монет! ;)')
        classRemove('.board__message', '.animation__opacity', 5000)
        player.balance += 10
        localStorage.setItem('account-game21', JSON.stringify(player))
        getBalanceNew(player.balance, 0)
    }
}

if (player.name === 'Вы') {
    elementClassAdd('#modal-name', 'active', 1000)
    document.forms["name"].addEventListener('submit', event => {
        player.name = document.forms["name"].elements["nickname"].value
        localStorage.setItem('account-game21', JSON.stringify(player))
    })
}

textAdd('.profile__name', player.name)
textAdd('.profile__balance__number', player.balance)
updateStatisticElements()

function updateStatisticElements() {
    document.querySelector('.statistic__win').textContent = player.statistics.win
    document.querySelector('.statistic__lose').textContent = player.statistics.lose
    document.querySelector('.statistic__draw').textContent = (player.statistics.total - player.statistics.lose) - player.statistics.win
    document.querySelector('.statistic__total').textContent = player.statistics.total
    let total = (player.statistics.win * 100) / player.statistics.total || 0
    document.querySelector('.statistic__win__percent').textContent = Number(total.toFixed(1))
}

const dealerMakeMove = () => {
    dealerMove = setInterval(() => {
        if (getSum(dealer.card) < getSum(player.card) && getSum(dealer.card) < 21 && getSum(player.card) < 21 || dealer.card.length <= 0 && newGame) {
            getCardFor(dealer)
        } else if (player.cardStop) {
            dealer.cardStop = true
        }
    }, 2000)
}

// function getCardCount() {
//     let a = 0
//     return () =>{
//         return a++
//     }
// }

// let playerCount = getCardCount()
// let dealerCount = getCardCount()

// async function check() {
//     console.log('начало');
//     console.log(player.card.length + " " + playerCount());
//     playerCount1 = playerCount()
//     console.log('~ ' + playerCount1);
//     console.log(player.card.length > 2324);
//     if (player.card.length) {
//         console.log('yes');
//         playerCount()
//         console.log(playerCount());
//     } else {
//         console.log('set');
//         setTimeout(check, 2000)
//     }
// }

// setTimeout(check, 2000)

const getCheckGame = () => {
    checkGame = setInterval(() => {
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
             getGameNew()

             classAdd('.board__message', '.animation__opacity')
             textAdd('.board__message', 'Началась новая игра')
             classRemove('.board__message', '.animation__opacity', 5000)

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
    selectRateBtn.classList.add('hide')
})

function getGameNew() {
    newGame = true
    dealer.card = []
    player.card = []
    deck = []
    dealer.cardStop = false
    player.cardStop = false
    cards[0].innerHTML = `${dealer.card}`
    cards[1].innerHTML = `${player.card}`
    addBtn.classList.remove('hide')
    stopBtn.classList.remove('hide')
    sum[0].textContent = ''
    sum[1].textContent = ''
    sum[0].classList.add('hide')
    sum[1].classList.add('hide')
}

selectCreditBtn.addEventListener('click', () => {
    player.balance += 10
    getBalanceNew(player.balance, 0)
    getGameNew()
    addBtn.classList.add('hide')
    stopBtn.classList.add('hide')
})

function getBalanceNew(balance, balanceNew) {
    let ms = 2000
    let b = Math.abs(balance - balanceNew)
    let step = b > ms ? 1 + Math.pow((String(b).length - 2), 3) : 1
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
    if (getSum(dealer.card) === getSum(player.card) && player.cardStop && dealer.cardStop || getSum(player.card) === 21 && getSum(dealer.card) === 21){
        classAdd('.board__message', '.animation__opacity')
        textAdd('.board__message', 'Ничья.')
        classRemove('.board__message', '.animation__opacity', 5000)

        getStyle()
    } else if (getSum(player.card) > getSum(dealer.card) && getSum(player.card) <= 21 && player.cardStop && dealer.cardStop || getSum(dealer.card) > 21){ 
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
        player.statistics.win++
        getStyle()
    } else if (getSum(dealer.card) > getSum(player.card) && getSum(dealer.card) <= 21 && player.cardStop && dealer.cardStop || getSum(player.card) > 21 || getSum(dealer.card) === 21) {
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
        player.statistics.lose++
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
        player.statistics.win++
    }
    function getStyle() {
        if (player.balance <= 0) {
            classAdd('.board__message', '.animation__opacity')
            textAdd('.board__message', 'Вы банкрот.')
            classRemove('.board__message', '.animation__opacity', 5000)
            selectCreditBtn.classList.remove('hide')
        } else {
            selectRateBtn.classList.remove('hide')
        }
        addBtn.classList.add('hide')
        stopBtn.classList.add('hide')
        clearInterval(dealerMove)
        newGame = false
        player.statistics.total++
        updateStatisticElements()
        localStorage.setItem('account-game21', JSON.stringify(player))
    }
    
}
function getCardFor(name) {
    let sum = document.querySelectorAll('.board__sum')
    const cardNumber = document.querySelectorAll('.card').length

    getCardNew(name.card, deck)
    const [rank, suit] = name.card[name.card.length - 1].split('_of_')
    if (name.name === 'Дилер') {
        n = 0
        numberIncrease(sum[n], getSum(dealer.card))
        // sum[n].innerHTML = `${getSum(dealer.card)}`
    }  else {
        n = 1
        numberIncrease(sum[n], getSum(player.card))
        // sum[n].innerHTML = `${getSum(player.card)}`
    }
    sum[n].classList.remove('hide')
    // cards[n].innerHTML += `<img class="card" src="assets/cards/deck_${rank}_of_${suit}.svg" alt="${rank}_of_${suit}">`
    cards[n].innerHTML += `
    <div class="card card-${cardNumber}">
    <div class="card__front"></div>
    <div class="card__back">
        <div class="card__rank">${rank}</div>
        <div class="card__suits">${suitColor(suit)}</div>
        <div class="card__icon__lg">${suitColor(suit)}</div>
    </div>
    </div>`
    classAdd(`.card-${cardNumber}`, '.open', 100)
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

function elementClassAdd(element, classRemove, duration = 0) {
    if (element.charAt(0) === '.' || element.charAt(0) === '#') {
        element = document.querySelector(`${element}`)
    }
    setTimeout(() => {
        element.classList.add(`${classRemove}`)
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



// let modalButtons = document.querySelectorAll('.js-open-modal')
// modalButtons.forEach(function(item){
// });

// let modalClose = document.querySelectorAll('.modal__close');
// for (var i = 0; i < modalClose.length; i++) {
//     modalClose[i].addEventListener('click', (event) => {
//             event.target.closest('.modal').classList.toggle('hide')
//         })
// }


// !function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;return Boolean(o[n])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})}(window.Element.prototype);


document.addEventListener('DOMContentLoaded', function() {
   var modalButtons = document.querySelectorAll('.modal__open'),
       overlay      = document.querySelector('.modal__overlay'),
       closeButtons = document.querySelectorAll('.modal__close');
   modalButtons.forEach(function(item){
      item.addEventListener('click', function(e) {
         e.preventDefault();
         var modalId = this.getAttribute('data-modal'),
             modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');
         modalElem.classList.add('active');
         overlay.classList.add('active');
      })
   })
   
   closeButtons.forEach(function(item){
      item.addEventListener('click', function(e) {
         this.closest('.modal').classList.remove('active');
         overlay.classList.remove('active');
      })
   })

    document.body.addEventListener('keyup', function (e) {
        var key = e.keyCode;
        if (key == 27) {
            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        };
    }, false)

    overlay.addEventListener('click', function() {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    })
})