import { searchFilm, renderNoFilmPageCover, renderLoadingPageCover, getWatchlistFilmsHTML,} from '/utils.js'

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

export { filmsContainer, watchlistFilmsContainer, filmIDs, localStorageWatchList }