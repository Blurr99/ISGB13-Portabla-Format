'use strict';

window.addEventListener('load', init);

function init() {
  printVillagers();
}

//skriver ut namn på alla villagers
function printVillagers(){
  
  //hämta ut data för varje villager genom att loopa igenom alla id som finns
    for(let i = 1; i < 392; i++){

      //skrivs ibland inte ut i rätt ordning och måste ersättas med något bättre
      window.fetch('http://acnhapi.com/v1/villagers/' + encodeURIComponent(i)).then(function(response){
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