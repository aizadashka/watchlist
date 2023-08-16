import { filmsContainer, watchlistFilmsContainer, filmIDs, localStorageWatchList } from '/index.js'

export { searchFilm, renderNoFilmPageCover, renderLoadingPageCover, getWatchlistFilmsHTML }

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

