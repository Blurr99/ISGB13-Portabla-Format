'use strict';

window.addEventListener('load', init);



function init() {
  printVillagers();

  let allVillagers = document.querySelector('#allVillagers');
  allVillagers.addEventListener("click", displayVillager);

  //document.querySelector('#searchForm').addEventListener('submit', searchFish);
}

function displayVillager(event){

  let villager = event.target;
  console.log(villager);

  let villagerID = event.querySelector('.villagerID').innerHTML;
  console.log(villagerID);

  window.fetch('http://acnhapi.com/v1/villagers/' + villagerID).then(function(response){
    return response.json();
  }).then(function(data){
    
    let displayResult = document.querySelector('#displayVillager');

    
    let villagerName = document.createElement('h2');
    villagerName.innerHTML = data.name['name-EUen'];
    displayResult.appendChild(villagerName);

    
    let villagerImg = document.createElement('img');
    villagerImg.src = data.image_uri;
    villagerImg.alt = 'En bild av ' + data.name['name-EUen'];
    displayResult.appendChild(villagerImg);
    

  });
}

//skriver ut namn på alla villagers
function printVillagers(){
  window.fetch('https://restcountries.com/v3.1/all').then(function(response){
    return response.json();
  }).then(function(data) {
    //console.log(data[1]);
  });
  window.fetch('http://acnhapi.com/v1/villagers').then(function(response){
    return response.json();
  }).then(function(data) {
    console.log(data);

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_iterable
    for(let villagerData of Object.keys(data)){
      console.log(data[villagerData]);
      let currentVillager = data[villagerData];

      let displayVillagers = document.querySelector('#allVillagers');
      let villagerList = document.createElement('li');
      let villagerLink = document.createElement('a');

      villagerLink.setAttribute('data-attribute', currentVillager.id);
      villagerLink.setAttribute('href', " ");
      villagerLink.innerHTML = currentVillager.name['name-EUen'];
      villagerList.appendChild(villagerLink);
      displayVillagers.appendChild(villagerList);
      
    }
   
  });
  
  }
   
  


function searchFish(e){
  e.preventDefault();
  console.log('searchFish');

  //hämtar och ändra på användarens indata så att api:et hämtar rätt inlägg
  let query = document.querySelector('#search').value;
  query = query.toLowerCase();
  query = query.replace(' ', '_');

  window.fetch('http://acnhapi.com/v1/fish/' + encodeURIComponent(query)).then(function(response) {
    return response.json()
  }).then(function(data) {
    console.log (data);
    //for(let fishData of data){
      let fishData = data;
      console.log(data['file-name']);

      let resultDiv = document.querySelector('#showResult');
      let fishName = document.createElement('h2');
      let fishNameNode = document.createTextNode((fishData.name['name-EUen'].toUpperCase()));
      fishName.appendChild(fishNameNode);
      resultDiv.appendChild(fishName);

      let fishImg = document.createElement('img');
      fishImg.src = fishData.image_uri;
      fishImg.alt = 'En bild av en ' + fishData.name['name-EUen'];
      resultDiv.appendChild(fishImg);

      let fishLocation = document.createElement('p');
      let fishLocationNode = document.createTextNode('Location: ' + fishData.availability.location);
      fishLocation.appendChild(fishLocationNode);
      resultDiv.append(fishLocation);

      let fishShadow = document.createElement('p');
      let fishShadowNode = document.createTextNode('Shadow-Size: ' + fishData.shadow);
      fishShadow.appendChild(fishShadowNode);
      resultDiv.appendChild(fishShadow);
      
      let fishRarity = document.createElement('p');
      let fishRarityNode = document.createTextNode('Rarity: ' + fishData.availability.rarity);
      fishRarity.appendChild(fishRarityNode);
      resultDiv.appendChild(fishRarity);

      let fishTime = document.createElementNS('p');
      if (fishData.availability.time.isAllDay == false){
        let fishTimeNode = document.createTextNode('You can catch ' + fishData.name['name-EUen'] + 'between ' + fish.availability.time);
      }
      else{
        let fishTimeNode = document.createTextNode('The fish is available all day');
      }
      fishTime.appendChild(fishTimeNode);
      resultDiv.appendChild(fishTime);
    //}
  })
}