// global variable for the project
// the number of the selected news displaid in #selectedNews
var selectedNewsNum = 0;
// the list of the numbers of kept news, displaid in #favList
var favNewsList = [];



//this function is used to add new event on the DOM
var setupListeners = () => {
    displaySelectedNews();
    displayNewsList();
    document.getElementById("filter").addEventListener("keyup", filter);
    document.getElementById("pinit").addEventListener("click", displayFavList);
    //initFavList();
    //localStorage.clear();
}

//Add the load event on the window
window.addEventListener("load", setupListeners);

//displays the information corresponding to the news item number
//selectedNewsNum in the #selectedNews element.
var displaySelectedNews = () => { 
    let selectedNews = document.getElementById("selectedNews");
    let h1 = selectedNews.querySelector("h1"); // the title of the selected news
    let selectedImg = document.querySelector("figure > img"); // the selected news image
    let newsContent = document.getElementById("content"); // the content of the selected news
    h1.textContent = newsListData[selectedNewsNum].title;
    selectedImg.setAttribute("src", newsListData[selectedNewsNum].image);
    selectedImg.setAttribute("alt", /*"&quot;" +*/ newsListData[selectedNewsNum].title);
    newsContent.innerHTML = newsListData[selectedNewsNum].content;
    pinitEvents();
    changePinitImg();
}


//create an item div 
var createNewsItem = (_newsIndice) => {
    let divList = document.querySelector("#newsList > div.list");
    let divNews = document.createElement("div");
    divNews.classList.add( "news", newsListData[_newsIndice].group);
    divNews.id = _newsIndice + "-news";
    divNews.innerHTML = newsListData[_newsIndice].title;
    divList.appendChild(divNews);
}

// this function is used to get the selectedNewsNum and add the selected news in #selectedNews
function addEventSelect() {
    selectedNewsNum = parseInt(this.id);
    displaySelectedNews();
}

// displays all the news of the newsListData in  #newsList
var displayNewsList = () => {
    for (var i in newsListData) {
        createNewsItem(i);
        document.getElementById(i + "-news").addEventListener("click", addEventSelect);
    }
}

//Texts are filtered here to display only the elements of the search during keyup events
var filter = () => {
    var filterInput = document.getElementById("filter");
    var filterInputValue = filterInput.value.toLowerCase();
    for (var i in newsListData) {
        let divNews = document.getElementById(i + "-news");
        let _title = divNews.textContent.toLowerCase();
        if (!_title.includes(filterInputValue)) {
            divNews.style.display = "none";
        }
        else {
            divNews.style.display = "";
        }
    }
}


//displays the favorist news list in #favList
var displayFavList = (_num) => {
    if (isNaN(_num)) {
        _num = selectedNewsNum;
    }
    let divFavList = document.querySelector("#favList > div.list");
    let divFav = document.createElement("div");
    let pinitImg = document.getElementById("pinit");
    divFav.id = _num + "-fav";
    divFav.classList.add("news", newsListData[_num].group);
    divFav.innerHTML = newsListData[_num].title;
    divFav.addEventListener("click", addEventSelect);
    pinitImg.src = "style/images/pined.png";
    favNewsList.push(_num);
    divFavList.appendChild(divFav);
    divFav.style.color = "yellow";
    divFav.style.borderTop = "solid 2px black";
    divFav.style.borderBottom = "solid 2px white";
    pinitEvents();// add the pinit image events
    //favListStorage();//update the localStorage
}


// this function is used to change the pinit image based on the status of the news
var changePinitImg = () => {
    let pinitImg = document.getElementById("pinit");
    if (favNewsList.includes(selectedNewsNum)) {
        pinitImg.src = "style/images/pined.png";
    }
    else {
        pinitImg.src = "style/images/unpined.png";
    } 
}

//this function is used to remove the selected news in the fav news List
var removeFavNews = () => {
    let pinitImg = document.getElementById("pinit");
    let divFavList = document.querySelector("#favList > div.list");
    let divFav = document.getElementById(selectedNewsNum + "-fav");
    divFavList.removeChild(divFav);
    favNewsList.splice(favNewsList.indexOf(selectedNewsNum), 1);// delete the fav news num in the fav news list
    //removeFromFavListStorage();//update the localStorage
    changePinitImg();
    pinitImg.removeEventListener("click", removeFavNews);
    pinitImg.addEventListener("click", displayFavList);
}


//this function is used to add events on click on the pinit image
var pinitEvents = () => {
    let pinitImg = document.getElementById("pinit");
    if (favNewsList.includes(selectedNewsNum)) {
        pinitImg.removeEventListener("click", displayFavList);
        pinitImg.addEventListener("click", removeFavNews);
    }
    else {
        pinitImg.removeEventListener("click", removeFavNews);
        pinitImg.addEventListener("click", displayFavList);
    }
}

// this function save the favorite news in the localStorage
var favListStorage = () => {
    let storage = localStorage;
    //storage.clear();
    for (let index in favNewsList) {
        storage.setItem(index, favNewsList[index]);
    }
    return storage;
}

var removeFromFavListStorage = ()=> {
    let storage = localStorage;
    storage.removeItem(favNewsList.indexOf(selectedNewsNum));
    return storage;
}
//This function loads the favorite news when reloading the page.
var initFavList = () => {
    let storage = favListStorage();
    let favoriteList = Object.values(storage);
    for (let index of favoriteList) {
        index = parseInt(index);
        displayFavList(index);
        if (!favNewsList.includes(index)) {
            favNewsList.push(index);
        }
        pinitEvents();
    }
}

