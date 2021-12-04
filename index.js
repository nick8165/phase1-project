const bracketNumber = document.querySelector('#participants')
const main = document.querySelector('main')
const playerSearch = document.querySelector('.search')
const register = document.querySelector('#registration')

// Forming the bracket//
bracketNumber.addEventListener('submit', function (e) {
    e.preventDefault()
    let num = document.querySelector('#participant-number')
    let cls4 = document.getElementsByClassName('brk4')
    let cls4h = document.getElementsByClassName('brk4-hidden')
    let cls8 = document.getElementsByClassName('brk8')
    let cls8h = document.getElementsByClassName('brk8-hidden')
    if (num.value === '4') {
        while(cls4.length) {
            cls4[0].className = 'brk4-hidden'
        }
        while (cls8.length) {
            cls8[0].className = 'brk8-hidden'
        }
    }
    if (num.value === '8' && cls8.length != 0) {
        while (cls8.length) {
            cls8[0].className = 'brk8-hidden'
        }
    } 
    if (num.value === '8') {
        while (cls4h.length) {
            cls4h[0].className = 'brk4'
        }
    }
    if (num.value === '16' && cls4.length === 0) {
        while(cls4h.length) {
            cls4h[0].className = 'brk4'
        }
        while(cls8h.length) {
            cls8h[0].className = 'brk8'
        }
    }
    if (num.value === '16' && cls4.length != 0) {
        while(cls8h.length) {
            cls8h[0].className = 'brk8'
        }
    }
})

//Registry//
register.addEventListener('submit', function(event) {
    event.preventDefault()
    let fullname = document.querySelector('#fullname')
    let playertag = document.querySelector('#playertag')
    
    let createdPlayer = createPlayerFile(fullname, playertag)
    checkForExistingTag(createdPlayer)
    window.alert("New Player Made")
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
    .then(json => console.log(json))
}

//Placing Player in Bracket//
const playerNumber = document.getElementsByClassName('search')
for (const element of playerNumber) {
    element.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            fetch('http://localhost:3000/players')
            .then(res => res.json())
            .then(data => {
                let tag = data.find(key => key.playertag === event.target.value)
                if (tag !== undefined) {
                    event.target.className = "search-hidden"
                    let playerId = event.target.value
                    let p = event.target.nextSibling.nextSibling.nextSibling.nextSibling
                    p.innerText = playerId
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
    element.addEventListener('click', function(event) {
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
    element.addEventListener('click', function add(event) {
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
                let patchWinner = data.find(key => key.playertag === winner.innerText)
                patchWinner.wins ++
                patchWin(patchWinner) 
            })
        }
    })
}

function patchWin(patchWinner) {
    fetch(`http://localhost:3000/players/${patchWinner.id}`,{
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patchWinner)
    })
    .then(res => res.json())
    .then(json => console.log(json))
}

let subButton = document.getElementsByClassName('sub')
for (const obj of subButton) {
    obj.addEventListener('click', function sub(obj) {
        let decrease = obj.target.parentNode
        decrease.children[0].innerText --
    })
}


