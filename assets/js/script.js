var cardDiv = document.querySelector(".games")
var searchBtn = document.getElementById("search")
var submitForm = document.getElementById("submit-form")

$(document).ready(function(){
    $('select').formSelect();
  });

var youtube = function (card, searchTerm) {
    var apiYoutube ='https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAB2XQ98P3h7KXGdn5XV2P09buyExiPDT4&type=video&q=howtoplay%20' + searchTerm;
    return fetch(apiYoutube, {
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.log(response)
        return response.json()
    }).then(data => {
        console.log(data);
        var videoId = data.items[0].id.videoId
        var videoUrl = 'https://www.youtube.com/watch?v=' + videoId
        var ytLink = document.createElement("a")
        var link2Text = document.createTextNode("Game Tutorial")
        ytLink.appendChild(link2Text)
        ytLink.href = videoUrl
        card.append(ytLink)
    }).catch(error => {
            console.error(error);
        });
}


// create function for API call based on age, time, players.
var pullGames = function (minAge, minPlayers, maxPlayTime) {
    var apiURL = `https://api.boardgameatlas.com/api/search?order_by=popularity&min_players=${minPlayers}&max_playtime=${maxPlayTime}&min_age=${minAge}&client_id=JLBr5npPhV`;
    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json()
                .then(function (data) {
                    console.log(data);
                    console.log(data.games[0].name, "min age:" + data.games[0].min_age, "max playtime:" + data.games[0].max_playtime, "min players:" + data.games[0].min_players)
                    if (data.count === 0) {
                        var errorCard = document.createElement("div")
                        errorCard.classList.add("card")

                        var img = document.createElement("img")
                        img.setAttribute("src", "https://images.unsplash.com/photo-1606823616058-541d59dadcb2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80")
                        img.classList.add("img")
                        errorCard.appendChild(img)

                        var errorMsg = document.createElement("h3")
                        errorMsg.textContent = "There has been an error, please try your search again!"
                        errorCard.appendChild(errorMsg)

                        cardDiv.appendChild(errorCard)

                    } else {

                        for (var i = 0; i < data.games.length; i++) {
                            if (i < 10) {
                                var card = document.createElement("div")
                                card.classList.add("card")
                                cardDiv.appendChild(card)

                                var title = document.createElement("div")
                                title.classList.add("title")
                                title.textContent = data.games[i].name
                                card.appendChild(title)

                                var img = document.createElement("img")
                                img.setAttribute("src", data.games[i].thumb_url)
                                img.classList.add("img")
                                card.append(img)

                                var price = document.createElement("p")
                                price.classList.add("card-content")
                                price.textContent = "$" + data.games[i].price
                                card.appendChild(price)

                                // https://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-javascript
                                var buyLink = document.createElement("a")
                                var link1Text = document.createTextNode("Buy Here")
                                buyLink.appendChild(link1Text)
                                buyLink.href = data.games[i].url
                                buyLink.classList.add("card-content")
                                card.appendChild(buyLink)
                                youtube(card, data.games[i].name)
                            }
                        }
                    }
                })
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// function gameSearch (ageSelect, playerSelect, timeSelect){
//     var baseUrl = `https://api.boardgameatlas.com/api/search?order_by=popularity&min_players=${playerSelect}&max_playtime=${timeSelect}&min_age=${ageSelect}&client_id=JLBr5npPhV`;
//     fetch(baseUrl)
//     .then(function (response) {
//         if (response.ok) {
//             console.log(response);
//             response.json()
//             .then(function (data) {
//                 console.log(data)
//             })
// }})}


submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let cards = document.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
        cards[i].replaceWith('');
    };
    console.log(event)
    let age = event.target[1].value;
    let player = event.target[3].value;
    let time = event.target[5].value;
    console.log(age, player, time)
    // gameSearch(age,player, time);
    pullGames(age, player, time);
    searchHistory(age, player, time)

    var change = document.querySelector(".gameDisp");
    change.classList.add("gameDispTwo");
});
