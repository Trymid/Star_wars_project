let wrapper = document.getElementById('wrapper');
let currentDownloadedInfo = 0;
let numberDownloadInfo = 10;
let j = 0;
let ol;


getFilmData();

async function getFilmData() {
  let movieId = getCurrentFilmId();
  let filmData = await axios.get(`https://swapi.dev/api/films/${movieId}/`)
                  .then(response => {
                    return response;
                  });
  filmData = filmData.data;
  // console.log(filmData)
  
  generateMoviePage(filmData);
}


function getCurrentFilmId() {
  let movieId = localStorage.getItem('movieId');
  // console.log(movieId)
  let filmDep = JSON.parse(localStorage.getItem('filmsDependencies'));
  // console.log(filmDep)
  let result = filmDep[movieId];
  // console.log(result)
  return result;
}



function generateMoviePage(film) {
  let movie = film;
  // console.log(movie)
  wrapper.innerHTML = `<div id="main" class="main">
                        <img class="poster" src="./images/${movie.episode_id}.jpg" alt='poster'>
                        <h3 class="title">Star wars - ${movie.title}</h3>
                        <p class="episode_id">Episode: ${movie.episode_id}</p>
                        <p class="release_date">${movie.release_date}</p>
                        <p class="opening_crawl">${movie.opening_crawl}</p>
                      </div>`
  // console.log(movie.characters)
  loadInfo(movie)
}

async function loadInfo(data) {
  
  let main = document.getElementById('main');
  let movie = data;
  console.log(movie)
  let charId = [];
  let adress = "https://star--wars.herokuapp.com/people/";
  let arrayIndex = 0;
  
  console.log(currentDownloadedInfo);
      console.log(numberDownloadInfo);
      console.log(j)

  if (currentDownloadedInfo === 0) {
    currentDownloadedInfo = numberDownloadInfo;
    ol = document.createElement('ol');
  }

  if (movie.characters.length < currentDownloadedInfo) {
    currentDownloadedInfo = movie.characters.length;
  }

  // if (movie.characters.length < currentDownloadedInfo) {
  //   numberDownloadInfo = movie.characters.length;
  //   currentDownloadedInfo = movie.characters.length;
  // }

  for (let i = j; i < currentDownloadedInfo; i++) { // movie.characters.length   numberDownloadInfo
    
    charId[arrayIndex] = adress + movie.characters[i].match(/\d+/).join('');
    arrayIndex++;
  }
  arrayIndex = 0;
  console.log(charId)

  let characters = await getCharacters(movie.characters, j);
  console.log(characters)

  let charPicsLinks = await getCharPicsLinks(charId, j);
  console.log(charPicsLinks)

  for (let i = 0; i < characters.length; i++) { // characters.length    currentDownloadedInfo
    let li = document.createElement('li');
    li.innerHTML = `<a href="${charPicsLinks[i].data.wiki}">
                      <p>${characters[i].data.name}</p>
                      <img class="charPicture" src="${charPicsLinks[i].data.image}" alt="character_image">
                    </a>
                    `;
    ol.append(li);
  }
  main.append(ol);

  if (movie.characters.length > currentDownloadedInfo) {
    let btnloadMore = document.createElement('button');
    btnloadMore.setAttribute('id', 'btnloadMore');
    btnloadMore.setAttribute('type', 'button');
    btnloadMore.textContent = 'load more';
    
    ol.after(btnloadMore);

    console.log(currentDownloadedInfo);
    console.log(numberDownloadInfo);
    console.log(j)

    btnloadMore.addEventListener('click', () => {
      j += numberDownloadInfo;
      currentDownloadedInfo += numberDownloadInfo;
      btnloadMore.remove();
      loadMoreInfo(movie);
      
      console.log(`currentDownloadedInfo ` + currentDownloadedInfo);
      console.log(`numberDownloadInfo ` + numberDownloadInfo);
      console.log(`j ` + j)
    });
  }
  
}


function loadMoreInfo(data) {
  loadInfo(data);
}

async function getCharacters(data, index) {
  let charactersLinks = data;
  let charactersPack = [];
  let arrayIndex = 0;

  for (let i = index; i < currentDownloadedInfo; i++) { // charactersLinks.length  numberDownloadInfo
    charactersPack[arrayIndex] = axios.get(charactersLinks[i]);
    arrayIndex++;
  }

  let charactersDataPack = await axios.all(charactersPack)
        .then(axios.spread((...responses) => {
          return responses;
        }))
  // console.log(charactersDataPack)
  return charactersDataPack;
}


async function getCharPicsLinks(data, index) {
  let charList = data;
  console.log(charList)

  for (let i = 0; i < charList.length; i++) { //charList.length   numberDownloadInfo
    charList[i] = axios.get(charList[i]);
  }

  let picsLinks = await axios.all(charList)
                  .then(axios.spread((...responses) => {
                    return responses;
                  }));

  return picsLinks;
}