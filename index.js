const bracketNumber = document.querySelector('#participants')
const playerSearch = document.querySelector('.search')
const register = document.querySelector('#registration')

// Forming the bracket//
bracketNumber.addEventListener('submit', (event) => {
    event.preventDefault()
    let num = document.querySelector('#participant-number')
    let cls4 = document.getElementsByClassName('brk4')
    let cls4h = document.getElementsByClassName('brk4-hidden')
    let cls8 = document.getElementsByClassName('brk8')
    let cls8h = document.getElementsByClassName('brk8-hidden')

    if (num.value === '4') {
        whileLoop(cls4, 'brk4-hidden')
        whileLoop(cls8, 'brk8-hidden')
    }

    if (num.value === '8' && cls8.length != 0) {
        whileLoop(cls8, 'brk8-hidden')
    }

    if (num.value === '8') {
        whileLoop(cls4h, 'brk4')
    }

    if (num.value === '16' && cls4.length === 0) {
        whileLoop(cls4h, 'brk4')
        whileLoop(cls8h, 'brk8')
    }

    if (num.value === '16' && cls4.length != 0) {
        whileLoop(cls8h, 'brk8')
    }
})

function whileLoop (obj, thisClass) {
    while(obj.length) {
        obj[0].className = thisClass
    }
}

//Registry//
register.addEventListener('submit', (event) => {
    event.preventDefault()
    let fullname = document.querySelector('#fullname')
    let playertag = document.querySelector('#playertag')
    
    let createdPlayer = createPlayerFile(fullname, playertag)
    checkForExistingTag(createdPlayer)
})

function createPlayerFile(fullname, playertag) {
    let newPlayer = {
        fullname:fullname.value,
        playertag:playertag.value,
        wins: 0
    }
    return newPlayer
}

function checkForExistingTag(createdPlayer) {
    fetch('http://localhost:3000/players')
    .then(res => res.json())
    .then(data => {
        let tag = data.find(key => key.playertag === createdPlayer.playertag)
        if (tag !== undefined) {
            window.alert("Tag already registered")
        } else {
            postPlayerId(createdPlayer)
        }
    })
}

function postPlayerId(createdPlayer) {
    fetch('http://localhost:3000/players',{
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createdPlayer)
    })
    .then(res => res.json())
    .then(json => window.alert("New Player Made"))
}

//Placing Player in Bracket//
const player = document.getElementsByClassName('search')
for (const element of player) {
    element.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault()
            let playerName = event.target
            fetch('http://localhost:3000/players')
            .then(res => res.json())
            .then(data => {
                let tag = data.find(key => key.playertag === playerName.value)
                if (tag !== undefined) {
                    playerName.className = "search-hidden"
                    let p = event.target.nextSibling.nextSibling.nextSibling.nextSibling
                    p.innerText = playerName.value
                } else {
                    window.alert("Must register first")
                }
            })
        }
    })
}

//Delete Player From Bracket//
let del = document.getElementsByClassName('delete')
for (const element of del) {
    element.addEventListener('click', (event) => {
        let para = event.target.parentNode.nextSibling.nextSibling
        let search = event.target.parentNode.parentNode.children
        let div = event.target.parentNode
        para.innerText = ''
        search[0].className = 'search'
        div.children[0].innerText = '0'
        div.className = "wins"
        div.children[2].className = 'add'
        div.children[3].className = 'sub'
    })
}
//Increase and Decrease Win//
let addButton = document.getElementsByClassName('add')
for (const element of addButton) {
    element.addEventListener('click', (event) => {
        let increase = event.target.parentNode
        increase.children[0].innerText ++
        if (increase.children[0].innerText === '3') {
            increase.className = 'green'
            increase.children[2].className = 'hidden'
            increase.children[3].className = 'hidden'
            let winner = increase.nextSibling.nextSibling
            fetch('http://localhost:3000/players')
                .then(res => res.json())
                .then(data => {
                let roundWinner = data.find(key => key.playertag === winner.innerText)
                roundWinner.wins ++
                patchWin(roundWinner) 
            })
        }
    })
}

function patchWin(roundWinner) {
    fetch(`http://localhost:3000/players/${roundWinner.id}`,{
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(roundWinner)
    })
    .then(res => res.json())
    .then(json => console.log(json))
}

let subButton = document.getElementsByClassName('sub')
for (const element of subButton) {
    element.addEventListener('click', (event) => {
        let decrease = event.target.parentNode
        decrease.children[0].innerText --
    })
}


