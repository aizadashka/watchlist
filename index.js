const filmsContainer = document.getElementById('films-container')
const input = document.getElementById('search-input')
const watchlistFilmsContainer = document.getElementById('watchlist-films-container')

let filmIDs = []

let localStorageWatchList = JSON.parse(localStorage.getItem('watchlist')) || []

document.addEventListener('DOMContentLoaded', renderPage)

document.addEventListener('click', (e) => {
    if (e.target.id === 'search-btn') {
        e.preventDefault()
        if (input.value) {
            renderLoadingPageCover()
            searchFilm(input.value)
            input.value = ''
        } else {
            renderNoFilmPageCover()
        }
    }
    else if (e.target.dataset.add) {
        const filmID = e.target.dataset.add
        localStorageWatchList.push(filmID)
        localStorage.setItem('watchlist', JSON.stringify(localStorageWatchList))
        document.getElementById(filmID).innerHTML = `<span class='watchlist' data-remove=${filmID}><i class="fa-solid fa-minus" data-remove=${filmID}></i>Watchlist</span>`
    }
    else if (e.target.dataset.remove) {
        const filmID = e.target.dataset.remove
        console.log(typeof filmID)
        localStorageWatchList = localStorageWatchList.filter(item => item !== filmID)
        localStorage.setItem('watchlist', JSON.stringify(localStorageWatchList))
        document.getElementById(filmID).innerHTML = `<span class='watchlist' data-add=${filmID}><i class="fa-solid fa-plus" data-add=${filmID}></i>Watchlist</span>`
    }
})

function searchFilm(value) {
    if (value) {
        fetch(`https://www.omdbapi.com/?apikey=a8cf6ca9&s=${value}`)
            .then(res => res.json())
            .then(data => {
                if (filmIDs.length > 0) {
                    filmIDs = []
                }
                data.Search.forEach(item => {
                    filmIDs.push(item.imdbID)
                })
            }).then(data => getFilmsHTML())
    } else {
        renderSearchPageCover()
    }

}

function renderSearchPageCover() {
    filmsContainer.innerHTML = `
        <div class="default">
            <i class="fa-solid fa-film"></i>
            <p class="starting-text">Start exploring</p>
        </div>
    `
}

function renderNoFilmPageCover() {
    filmsContainer.innerHTML = `        
        <div class="default">
            <p class="starting-text">Unable to find what you’re looking for. Please try another search.</p>
        </div>
    `
}

function renderLoadingPageCover() {
    filmsContainer.innerHTML = `
        <div class="default">
            <p class="starting-text">LOADING...</p>
        </div>
    `
}

function renderWatclistPageCover() {
    watchlistFilmsContainer.innerHTML = `
    <div class="watchlist-default"">
        <p class="starting-text">Your watchlist is looking a little empty...</p>
        <i class="fa-solid fa-plus"></i><a href='index.html'>Let's add some movies!</a>
    </div>
    `
}

function getFilmsHTML() {
    filmsContainer.innerHTML = ''
    for (let i = 0; i < filmIDs.length; i++) {
        fetch(`https://www.omdbapi.com/?apikey=a8cf6ca9&i=${filmIDs[i]}`)
            .then(res => res.json())
            .then(data => {
                const {Title, imdbID, Poster, imdbRating, Runtime, Genre, Type, Plot} = data
                let filmHTML = `
                    <div class="film">
                        <img src=${Poster}>
                        <div>
                            <div class="film-title">
                                <h3>${Title}</h3>
                                <i class="fa-solid fa-star"></i>
                                <p>${imdbRating}</p>
                            </div>
                            <div class="film-genre">
                                <span>${Runtime}</span>
                                <span>${Genre}</span>
                                <div id=${imdbID}>
                                    <span class='watchlist' data-${localStorageWatchList.includes(imdbID) ? 'remove' : 'add'}=${imdbID}>
                                        <i class="fa-solid ${localStorageWatchList.includes(imdbID) ? 'fa-minus' : 'fa-plus'}" data-${localStorageWatchList.includes(imdbID) ? 'remove' : 'add'}=${imdbID}></i>
                                    Watchlist</span>
                                </div>
                            </div>
                            <p class="film-plot">${Plot}</p>
                        </div>
                    </div>
                    <hr class="solid">
                `
                filmsContainer.innerHTML += filmHTML
            })
    }
}


function getWatchlistFilmsHTML() {
    if (localStorageWatchList.length > 0) {
        watchlistFilmsContainer.innerHTML = ''
        for (let i = 0; i < localStorageWatchList.length; i++) {
            fetch(`https://www.omdbapi.com/?apikey=a8cf6ca9&i=${localStorageWatchList[i]}`)
                .then(res => res.json())
                .then(data => {
                    const {Title, imdbID, Poster, imdbRating, Runtime, Genre, Type, Plot} = data
                    let filmHTML = `
                        <div class="film">
                            <img src=${Poster}>
                            <div>
                                <div class="film-title">
                                    <h3>${Title}</h3>
                                    <i class="fa-solid fa-star"></i>
                                    <p>${imdbRating}</p>
                                </div>
                                <div class="film-genre">
                                    <span>${Runtime}</span>
                                    <span>${Genre}</span>
                                    <div id=${imdbID}>
                                        <span class='watchlist' data-remove=${imdbID}>
                                            <i class="fa-solid fa-minus" data-remove=${imdbID}></i>
                                        Watchlist</span>
                                    </div>
                                </div>
                                <p class="film-plot">${Plot}</p>
                            </div>
                        </div>
                        <hr class="solid">
                    `
                    watchlistFilmsContainer.innerHTML += filmHTML
                })
        }
    } else {
        renderWatclistPageCover()
    }
    
}

function renderPage() {
    let page = document.body.id
    switch (page) {
        case 'search': 
            searchFilm()
            break
        case 'watchlist':
            getWatchlistFilmsHTML()
            break
    }
}