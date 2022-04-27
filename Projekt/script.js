'use strict';

window.addEventListener('load', init);

function init() {
  //printVillagers();
  document.querySelector('#searchForm').addEventListener('submit', searchFish);
}

//skriver ut namn på alla villagers
function printVillagers(){
  
  //hämta ut data för varje villager genom att loopa igenom alla id som finns
    for(let i = 1; i < 392; i++){

      //skrivs ibland inte ut i rätt ordning och måste ersättas med något bättre
      window.fetch('http://acnhapi.com/v1/villagers/' /*+ encodeURIComponent(i)*/).then(function(response){
        return response.json();
      }).then(function(data) {
      
      let displayResult = document.querySelector('#villagers');
      let villagerName = document.createElement('h5');

      //skriver ut villager namn och id
      let textNode = document.createTextNode(data.name['name-EUen'] + " " + data.id);
      villagerName.appendChild(textNode);
      displayResult.appendChild(villagerName);
      });
      
    }
   
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
      fishImg.alt = 'A picture of a ' + fishData.name['name-EUen'];
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
    //}
  })
}