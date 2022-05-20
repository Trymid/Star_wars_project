let moviePageURL = 'file:///D:/Documents/Course_JS_HTML_ACADEMY/Star_wars_project/movie_page.html'
let wrapper = document.getElementById('wrapper');
let header = document.getElementById('header');
let main = document.getElementById('main');
let viewControlPanel = document.getElementById('viewControlPanel');
let sortType = document.getElementById('select');
let tileView = document.getElementById('tileView');
let listView = document.getElementById('listView');



let data;



setLoader();
getAllFilms();

viewControlPanel.addEventListener('click', changeGridView)

function changeGridView() {
    let item = viewControlPanel.elements;
   
    for (let i = 0; i < item.length; i++) {
      if (item[i].checked === true & item[i].value === 'tile') {
        setTileStyle();
      } 
      if (item[i].checked === true & item[i].value === 'list') {
        setListStyle();
      }
    }
   
}


sortType.addEventListener('change', changeSortStatus)

function changeSortStatus() {
    localStorage.setItem('currentSortType', sortType.value);
    getNameSorting(data.data.results);
    main.innerHTML = "";
    generatePage(data.data.results)
}


function setTileStyle() {
  let movie_list = document.querySelector('.movie_list')
  let listItem = document.querySelectorAll('.list_item')
  
  localStorage.setItem('currentGridView', 'tile');
  movie_list.classList.remove('listView');
  movie_list.classList.add('tileView')
  listItem.forEach(element => {
    element.classList.remove('devide_border');
  })
  listView.classList.remove('active');
  tileView.classList.add('active');
}

function setListStyle() {
  let movie_list = document.querySelector('.movie_list')
  let listItem = document.querySelectorAll('.list_item')

  localStorage.setItem('currentGridView', 'list');
  movie_list.classList.remove('tileView');
  movie_list.classList.add('listView');
  listItem.forEach(element => {
    element.classList.add('devide_border');
  })
  tileView.classList.remove('active');
  listView.classList.add('active');
}

async function getAllFilms() {
  data = await axios.get("https://swapi.dev/api/films/")
      .then(res => {
        console.log(res.data.results) 
        return res; 
        })

  sortStatus();
  getNameSorting(data.data.results);
  generatePage(data.data.results); 
  setFilmsDependencies();
}

function setFilmsDependencies() {
  // let filmData = data;
  // let dep = {};
  // for (let i = 0; i <= filmData.length; i++) {
  //   dep[filmData[i].episode_id] = i;
  // }
  let dep = {1: "4", 2: "5", 3: "6", 4: '1', 5: "2", 6: "3",}
  localStorage.setItem('filmsDependencies', JSON.stringify(dep));
}

function generatePage(data) {
  let ul = document.createElement('ul');
  ul.classList.add('movie_list');

  for (film of data) {
    let li = document.createElement('li');
    li.classList.add('list_item');
    // li.innerHTML = `<a class="movie_page" href="movie_page.html"><img class="poster" src="./images/${film.episode_id}.jpg" alt='poster'></a>
    li.innerHTML = `<img id="poster_${film.episode_id}" class="poster" src="./images/${film.episode_id}.jpg" alt='poster'>
                    <div class="decription">
                      <h3 id="title_${film.episode_id}" class="title">Star wars - ${film.title}</h3>
                      <p class="episode_id">Episode: ${film.episode_id}</p>
                      <p class="release_date">${film.release_date}</p>
                    </div>`;
    ul.append(li);
  }
  main.append(ul);
  gridViewStatus();
  ul.addEventListener('click', goToMoviePage);
  deleteLoader();  
}

function goToMoviePage(event) {
  let elementId = event.target.id;
  let wordPart = elementId.match(/[a-z]+_/);
  if (wordPart === null) {
    return 0;
  }
  console.log(elementId)
  console.log(wordPart)
  if(wordPart[0] === 'poster_' || 'title_') {
    let digitPart = elementId.match(/\d+/);
    console.log(digitPart)
    localStorage.setItem('movieId', digitPart[0])
    window.location.href = moviePageURL;
  } 

}

function setLoader() {
  main.innerHTML = `<div class="preloader">
  <div id="loader" class="loader"></div>
  </div>`;
}

function deleteLoader() {
  let preloader = document.getElementById('preloader');
  let loader = document.getElementById('loader');
  loader.remove();
  // preloader.remove();
}



function gridViewStatus()  {
  let movie_list = document.querySelector('.movie_list')
  let currentGridView = localStorage.getItem('currentGridView');

  if (currentGridView === null || undefined) {
    localStorage.setItem('currentGridView', 'tile');
    tileView.classList.add('active');
    movie_list.classList.add('tileView')
  }
  if (currentGridView === 'tile') {
    tileView.classList.add('active');
    movie_list.classList.add('tileView')
  }
  if (currentGridView === 'list') {
    listView.classList.add('active');
    movie_list.classList.add('listView');
  }

}


function sortStatus() {
  let currentSortType = localStorage.getItem('currentSortType');

  if (currentSortType === null || undefined) {
    localStorage.setItem('currentSortType', 'num_ep_up');
    sortType.value = 'num_ep_up';
  } else {
    sortType.value = currentSortType;
  }
}
        


function getNameSorting(data) {
  let currentSortType = localStorage.getItem('currentSortType');
  console.log(currentSortType)
  
  let sortFuncs = {
    num_ep_up: (dataFor) => {
      dataFor.sort((a, b) => {
        return a.episode_id - b.episode_id;
      })
    },
    
    num_ep_down: (dataFor) => {
      dataFor.sort((a, b) => {
        return b.episode_id - a.episode_id;
      })
    },
    
    
    release_date_up: (dataFor) => {
      dataFor.sort((a, b) => {
        let date1 = new Date(a.release_date).getTime();
        let date2 = new Date(b.release_date).getTime();
        return date1 - date2;
      })
    },
    
    release_date_down: (dataFor) => {
      dataFor.sort((a, b) => {
        let date1 = new Date(a.release_date).getTime();
        let date2 = new Date(b.release_date).getTime();
        return date2 - date1;
      })
    }
  }
  
  sortFuncs[currentSortType]?.(data) ?? "Method not founded";
}



