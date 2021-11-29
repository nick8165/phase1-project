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

//Placing Player in Bracket//
playerSearch.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        let playerId = event.target.value
        console.log(playerId)
    }
})
 
//Registry//
register.addEventListener('submit', function(event) {
    event.preventDefault()
    let fullname = document.querySelector('#fullname')
    let playertag = document.querySelector('#playertag')
    let birthday = document.querySelector('#birthday')
    
    let createdPlayer = createPlayerFile(fullname, playertag, birthday)
    checkForExistingTag(createdPlayer)
})

function createPlayerFile(fullname, playertag, birthday) {
    let newPlayer = {
        fullname: fullname.value,
        playertag: playertag.value,
        birthday: birthday.value,
        wins: 0
    }
    return newPlayer
}

function checkForExistingTag(createdPlayer) {
    fetch('http://localhost:3000/playerId')
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
    console.log(JSON.stringify(createdPlayer))
    fetch('http://localhost:3000/playerId',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createdPlayer),
    })
    .then(res => res.json())
    .then(json => console.log(json))
}


