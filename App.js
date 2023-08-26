let pageNumber;
let totalPage = 0;
let sortBtnByReleaseDate = document.querySelector('#sort-date');
let sortBtnByPopularity = document.querySelector('#sort-rate');
let movieList = document.querySelector('#movie-list');
let nextPageBtn = document.querySelector('#next-page');
let prevPageBtn = document.querySelector('#prev-page');
let currPageBtn = document.querySelector('#curr-page');
let showFavoriteMovies = document.querySelector('#show-fav');
let shwoAllMovies = document.querySelector('#show-all');
let favoriteMoviesArray = [];
let sortByProperty = "vote_count.desc";
let searchInput = document.querySelector("#search-bar--input");
// let searchBtn = document.querySelector("#search-bar--button");
let query = "";

searchInput.addEventListener('input',()=>{
   
    query = searchInput.value;
    paginationShow();
    pageNumber = 1;
    if(showFavoriteMovies.classList.contains('active-tab')){
        getData(pageNumber,sortByProperty,favoriteMoviesArray,query);
    }
    else{
        getData(pageNumber,sortByProperty,null,query);
    }
})
function showLikeAndUnlikeEffect(heart){
    heart.classList.add('like-effect')
    setTimeout(()=>{
        heart.classList.remove('like-effect')
    },300)
}

async function getData(pageNumber, sort, customMovieArray = null,query=null){

    movieList.innerHTML = "";
    let result;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGZiOTk3Zjg4YzBkNmQ4NDE5MmI2MGZhMmMyNmQ1YyIsInN1YiI6IjY0ZDNkMWExYjZjMjY0MTE1NWVmMmJhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.519w3pS21bArNWc_8cbDQqj76SPVmvY5Xv7vfOlqZG4'
        }
    };
    let response;
    let dataObj;
    if(!customMovieArray && !query){

          
        response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=${sort}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
    }
    else{
        result = customMovieArray;
        paginationHide()
    }
    if(query && customMovieArray === null){
        response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
        result.length === 0 ? movieList.innerHTML = `Sorry, No such movie found.` : null
        paginationHide()
    }
    else if(query && customMovieArray !== null){
        result = customMovieArray.filter((movie)=>{
            let regex = new RegExp(query,"i")
            return regex.test(movie.title)
        })
        result.length === 0 ? movieList.innerHTML = `No such movie found in Favorites.` : null
        paginationHide()
    }
    result.forEach((element)=>{
        let movieCard = document.createElement('section');
        movieCard.classList.add('movies-card');
        movieCard.id = element.id;
        movieCard.title = element.title

        // creating poster section
        let poster = document.createElement('section');
        poster.classList.add('poster')
        let moviePoster = document.createElement('img');
        moviePoster.classList.add("movie-poster");
        moviePoster.src = `https://image.tmdb.org/t/p/w300${element.backdrop_path}`;
        moviePoster.alt = "Oops something broke...";
        poster.appendChild(moviePoster);
        //creating title and overview sections
        let movieTitle = document.createElement('h2');
        movieTitle.classList.add("movie-title");
        movieTitle.innerText = element.title;
        // creating footer
        let movieCardFooter = document.createElement('footer');
        movieCardFooter.classList.add("movie-card--footer");

        let movieRating = document.createElement('section');
        movieRating.classList.add("movie-rating");
        let voteCount = document.createElement('p');
        voteCount.classList.add("movie--vote-count")
        voteCount.innerText=`Vote count: ${element.vote_average}` ;
        let averageVote = document.createElement('p');
        averageVote.classList.add("movie--vote-avg");
        averageVote.innerText= `Average vote: ${element.vote_average}`;
        movieRating.appendChild(voteCount);
        movieRating.appendChild(averageVote);

        let favMovie = document.createElement('section');
        favMovie.classList.add('fav-movie');
        let heart = document.createElement('i');
        heart.classList.add('fa-regular','fa-heart','fav-movie-icon');

        if(favoriteMoviesArray.find((currentMovie)=>{
            return currentMovie.id === element.id
        })){
            heart.classList.toggle("fa-regular");
            heart.classList.toggle("fa-solid");
        }
        heart.addEventListener('click',(e)=>{
            favoriteMovieList(heart,element);
            showLikeAndUnlikeEffect(heart)
        })
        favMovie.appendChild(heart);
        movieCardFooter.appendChild(movieRating);
        movieCardFooter.appendChild(favMovie);

        movieCard.appendChild(poster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieCardFooter);
        movieCard.addEventListener('dblclick',(e)=>{
            favoriteMovieList(heart,element)
            showLikeAndUnlikeEffect(heart)
        })

        movieList.appendChild(movieCard)
    })
    
    // Updated current page Number
    currPageBtn.innerText = `Current Page: ${pageNumber}`
}
// Displayed sorted movies by release date
function displaySortByReleaseDate(){
    sortBtnByReleaseDate.addEventListener('click', ()=> {
        
        sortBtnByReleaseDate.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByPopularity.classList.remove('active-tab')
        if(sortByProperty !== "primary_release_date.desc"){
            sortByProperty ="primary_release_date.desc";
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-down">`
        }
        else{
            sortByProperty= 'primary_release_date.asc';
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-up">`
        }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber, sortByProperty);
    })
}
// Displayed sorted movies by popularity
function displaySortByPopularity(){
    sortBtnByPopularity.addEventListener('click', () => {

        sortBtnByPopularity.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByReleaseDate.classList.remove('active-tab')
        if(sortByProperty === "vote_count.desc"){
            sortByProperty = "vote_count.asc"
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-up">`
        }
        else{
            sortByProperty="vote_count.desc";
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-down">`
        }
        sortBtnByReleaseDate.innerHTML = `Sort By date`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);
    })
}
// Showed All Movies when clicked on All button
function displayAllMovies(){
    shwoAllMovies.addEventListener('click',()=>{
        // if(!shwoAllMovies.classList.contains('active-tab')){
            shwoAllMovies.classList.add('active-tab');
            showFavoriteMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        sortByProperty="vote_count.desc"
        // pageNumber = 1;
        paginationShow();
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);

    })
};

// Added and Removed Favorite movies in an Array of Favorite movies
function favoriteMovieList(target,movie){
    target.classList.toggle("fa-regular");
    target.classList.toggle('fa-solid');
    if(target.classList.contains('fa-solid')){
        favoriteMoviesArray.unshift(movie);
    }
    else{
        favoriteMoviesArray = favoriteMoviesArray.filter((currentMovie)=>{
            return currentMovie.id !== movie.id
        })
    }
    localStorage.setItem('favMovies',JSON.stringify(favoriteMoviesArray))
};
// Displayed Favorite Movies when clicked on Favorite button
function displayFavoriteMovies(){

    showFavoriteMovies.addEventListener('click',()=>{
        paginationHide()
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        // if(!showFavoriteMovies.classList.contains('active-tab')){
            showFavoriteMovies.classList.add('active-tab');
            shwoAllMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        if(favoriteMoviesArray.length == 0){
            movieList.innerHTML = "No movies added to your favorites yet";
            return;
        }
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty,favoriteMoviesArray)
        
    })
};
// Loaded Next or Previous page
function addNavigationButtons(){

    // Loaded next page
    nextPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if(totalPage > pageNumber){
            pageNumber++;
            getData(pageNumber,sortByProperty,null,query)
        }
        
    });
    // Loaded previous page
    prevPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if (pageNumber > 1 ){
            pageNumber--;
            getData(pageNumber,sortByProperty,null,query)
        }

    })
};
function paginationHide(){
    nextPageBtn.style.visibility = 'hidden'
    prevPageBtn.style.visibility = 'hidden'
    currPageBtn.style.visibility = 'hidden'
}
function paginationShow(){
    nextPageBtn.style.visibility = 'visible'
    prevPageBtn.style.visibility = 'visible'
    currPageBtn.style.visibility = 'visible'
}

// Initialized the page
async function init(){
    pageNumber = 1;
    favoriteMoviesArray = localStorage.getItem("favMovies")
    ? JSON.parse(localStorage.getItem("favMovies"))
    : [];
    await getData(1,sortByProperty);
    displaySortByReleaseDate()
    displaySortByPopularity()
    addNavigationButtons();
    displayFavoriteMovies();
    displayAllMovies();
};
init();