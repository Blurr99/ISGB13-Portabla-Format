'use strict';

window.addEventListener('load', init);

function init() {
  document.querySelector('#searchForm').addEventListener('submit', searchFish);
  printFish();
}

function chooseFunction(e) {
  let choice = e.target.value; 
  if (choice == 1){
    printFish();
  }
  else if(choice == 2){
    printBugs();
  }
}

function searchFish(e){
  e.preventDefault();
  console.log('searchFish');

  //hämtar och ändra på användarens indata så att api:et hämtar rätt inlägg
  let query = document.querySelector('#search').value;
  query = query.toLowerCase();
  query = query.replace(' ', '_');

  displayFish(query);
}

function printFish(){
  window.fetch('http://acnhapi.com/v1/fish').then(function(response){
    return response.json();
  }).then(function(data) {
    console.log(data);

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_iterable
    for(let fishData of Object.keys(data)){
      //console.log(data[villagerData]); 
      let currentFish = data[fishData];
      let displayList = document.querySelector('.displayList');
      let ul = document.createElement('ul');
      let listElement = document.createElement('li');
      let fishLink = document.createElement('a');

      fishLink.setAttribute('data-id', currentFish['file-name']); //skapa data-* attribute för att spara villagers id
      fishLink.setAttribute('href', " ");
      fishLink.setAttribute('class', 'villagerLink')
      fishLink.innerHTML = currentFish.name['name-EUen'];

      listElement.appendChild(fishLink);
      ul.appendChild(listElement);
      displayList.appendChild(ul);
      
      ul.addEventListener("click", function(e){
        e.stopPropagation();
        e.preventDefault();

        let fish = e.target;

        let query = fish.getAttribute('data-id'); //hämta värde i data-id

        displayFish(query);
      });
      
    }
    
  });
}

function displayFish(query){
  
  let oldResult = document.querySelector('.displayResult');
  let newResult = document.createElement('section');
  let main = document.querySelector('main');

  newResult.setAttribute('class', 'displayResult');
  main.replaceChild(newResult, oldResult);

  window.fetch('http://acnhapi.com/v1/fish/' + query).then(function(response){
    return response.json();
  }).then(function(data){

    let fishData = data; 

    let result = document.querySelector('.displayResult');
    let fishName = document.createElement('h2');
    let fishNameNode = document.createTextNode((data.name['name-EUen'].toUpperCase()));
    fishName.appendChild(fishNameNode);
    result.appendChild(fishName);

    let fishImg = document.createElement('img');
    fishImg.src = fishData.image_uri;
    fishImg.alt = 'En bild av en ' + fishData.name['name-EUen'];
    result.appendChild(fishImg);

    let fishLocation = document.createElement('p');
    let fishLocationNode = document.createTextNode('Location: ' + fishData.availability.location);
    fishLocation.appendChild(fishLocationNode);
    result.append(fishLocation);

    let fishShadow = document.createElement('p');
    let fishShadowNode = document.createTextNode('Shadow-Size: ' + fishData.shadow);
    fishShadow.appendChild(fishShadowNode);
    result.appendChild(fishShadow);
    
    let fishRarity = document.createElement('p');
    let fishRarityNode = document.createTextNode('Rarity: ' + fishData.availability.rarity);
    fishRarity.appendChild(fishRarityNode);
    result.appendChild(fishRarity);

    let fishTime = document.createElement('p');
    let fishTimeNode;
      if (fishData.availability.isAllDay == false){
        fishTimeNode = document.createTextNode('You can catch ' + fishData.name['name-EUen'] + ' between ' + fishData.availability.time +'.');
      }
      else{
        fishTimeNode = document.createTextNode('The ' + fishData.name['name-EUen'] + ' is available all day.');
      }
    fishTime.appendChild(fishTimeNode);
    result.appendChild(fishTime);

  });
}

