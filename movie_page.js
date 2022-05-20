let wrapper = document.getElementById('wrapper');
let main = document.getElementById('main');

getFilmData();

async function getFilmData() {
  let movieId = getCurrentFilmId();
  let filmData = await axios.get(`https://swapi.dev/api/films/${movieId}/`)
                  .then(response => {
                    return response;
                  });
  filmData = filmData.data;
  console.log(filmData)
  
  generateMoviePage(filmData);
}

function getCurrentFilmId() {
  let movieId = localStorage.getItem('movieId');
  console.log(movieId)
  let filmDep = JSON.parse(localStorage.getItem('filmsDependencies'));
  console.log(filmDep)
  let result = filmDep[movieId];
  console.log(result)
  return result;
}



async function generateMoviePage(film) {
  let movie = film;
  wrapper.innerHTML = `<div class="main">
                        <img class="poster" src="./images/${movie.episode_id}.jpg" alt='poster'>
                        <h3 class="title">Star wars - ${movie.title}</h3>
                        <p class="episode_id">Episode: ${movie.episode_id}</p>
                        <p class="release_date">${movie.release_date}</p>
                        <p class="opening_crawl">${movie.opening_crawl}</p>
                      </div>`
  // console.log(movie.characters)
  let charId = [];
  let adress = "https://star--wars.herokuapp.com/people/";

  for (let i = 0; i < movie.characters.length; i++) {
    charId[i] = adress + movie.characters[i].match(/\d+/).join('');
  }
  // console.log(charId)
  
  let characters = await getCharacters(movie.characters);
  // console.log(characters)

  let charPicsLinks = await getcharPicsLinks(charId);
  console.log(charPicsLinks)
  let ol = document.createElement('ol');

  for (let i = 0; i < characters.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = `<a href="${charPicsLinks[i].data.wiki}">
                      <p>${characters[i].data.name}</p>
                      <img class="charPicture" src="${charPicsLinks[i].data.image}" alt="character_image">
                    </a>
                    `;
    ol.append(li);
  }
  
  main.append(ol);
}

async function getCharacters(data) {
  let charactersLinks = data;
  let charactersPack = [];

  for (let i = 0; i < charactersLinks.length; i++) {
    charactersPack[i] = axios.get(charactersLinks[i]);
  }

  let charactersDataPack = await axios.all(charactersPack)
        .then(axios.spread((...responses) => {
          return responses;
        }))
  // console.log(charactersDataPack)
  return charactersDataPack;
}


async function getcharPicsLinks(data) {
  let charList = data;

  for (let i = 0; i < charList.length; i++) {
    charList[i] = axios.get(charList[i]);
  }

  let picsLinks = await axios.all(charList)
                  .then(axios.spread((...responses) => {
                    return responses;
                  }));

  return picsLinks;
}