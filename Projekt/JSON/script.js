'use strict';

window.addEventListener('load', init);

function init() {
  //Kod från Stackoverflow för att avgöra vilken sida är öppet just nu för att köra rätt funktioner: https://stackoverflow.com/questions/16133491/detect-what-page-you-are-on-javascript
  //har lagt till else-if statement, ändrat namn på fil och skrivat all kod inom if och if-else statement.
  if ( document.URL.includes("Fish.html") ) {
    //Code here
    document.querySelector('#searchFish').addEventListener('submit', searchFish);
    printFish();
  }

  else if(document.URL.includes("Bugs.html")){
    document.querySelector('#searchBugs').addEventListener('submit', searchBugs);
    printBugs();
  }
}

//söka fisk
function searchFish(e){
  e.preventDefault();

  //hämtar och ändra på användarens indata så att api:et hämtar rätt inlägg
  let query = document.querySelector('#search').value;
  query = query.toLowerCase();
  query = query.replace(' ', '_');
  
//query skickas vidare till funktionen displayFish();
  displayFish(query);
}

//skriva ut en lista med alla fiskar
function printFish(){
  //hämtar data om fiskar från API:et
  window.fetch('http://acnhapi.com/v1/fish').then(function(response){
    return response.json();
  }).then(function(data) {

  ////loopar igenom all data. Hjälp från https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_iterable
  //Har användt Object.keys och data[bugData]
    for(let fishData of Object.keys(data)){
      
      let currentFish = data[fishData];

      //skapar och hämtar DOM-element för listan
      let listFish = document.querySelector('#listFish');
      let ul = document.createElement('ul');
      let listElement = document.createElement('li');
      listElement.setAttribute('class', 'listElement');
      
      //skriver ut icon
      let fishIcon = document.createElement('img');
      fishIcon.src = currentFish.icon_uri;
      fishIcon.alt = 'icon';
      fishIcon.setAttribute('class', 'icon');
      listElement.appendChild(fishIcon);

      //skapa a-element som ska visas i listan
      let fishLink = document.createElement('a');
      fishLink.setAttribute('data-id', currentFish['file-name']); //skapa data-* attribute för att spara villagers id
      fishLink.setAttribute('href', " ");
      fishLink.innerHTML = currentFish.name['name-EUen'];
      
      //lägger till a-element till listan
      listElement.appendChild(fishLink);
      ul.appendChild(listElement);
      listFish.appendChild(ul);
      
      //event listener när användaren klickar på en element i listan
      ul.addEventListener("click", function(e){
        e.stopPropagation();
        e.preventDefault();

        let fish = e.target;

        //get query som skickas vidare till funktion displayBugs();
        let query = fish.getAttribute('data-id'); //hämta värde i data-id

        //query skickas vidare till display Fish
        displayFish(query);
      });
      
    }
    
  });
}

//visar sökresultat
function displayFish(query){

  //ta bort gammalt resultat
  let oldResult = document.querySelector('#resultFish');
  oldResult.innerHTML = "";

  //ta bort gammalt felmeddelande
  let errorMsg = document.querySelector('.errorDiv');
  errorMsg.innerHTML = "";

  //tar emot query från searchFish() eller printFish() och söker efter query
  window.fetch('http://acnhapi.com/v1/fish/' + query).then(function(response){
    //felhantering om query inte finns
    if (!response.ok || query == '') {
      printErrorMsg(query);
    } else {
      return response.json();
    }
    //return response.json();
  }).then(function(data){

    let fishData = data; 

    console.log(fishData);
    let result = document.querySelector('#resultFish');

    //skriver ut namn
    let fishName = document.createElement('h2');
    let fishNameNode = document.createTextNode((fishData.name['name-EUen'].toUpperCase()));
    fishName.appendChild(fishNameNode);
    result.appendChild(fishName);

    //skriver ut bild
    let fishImg = document.createElement('img');
    fishImg.src = fishData.image_uri;
    fishImg.alt = 'En bild av en ' + fishData.name['name-EUen'];
    result.appendChild(fishImg);

    //skriver ut plats 
    let fishLocation = document.createElement('p');
    let fishLocationNode = document.createTextNode('Location: ' + fishData.availability.location);
    fishLocation.appendChild(fishLocationNode);
    result.append(fishLocation);

    //skriver ut skuggans storlet 
    let fishShadow = document.createElement('p');
    let fishShadowNode = document.createTextNode('Shadow-Size: ' + fishData.shadow);
    fishShadow.appendChild(fishShadowNode);
    result.appendChild(fishShadow);
    
    //skriver ut sällsynthet
    let fishRarity = document.createElement('p');
    let fishRarityNode = document.createTextNode('Rarity: ' + fishData.availability.rarity);
    fishRarity.appendChild(fishRarityNode);
    result.appendChild(fishRarity);

    //skriver ut dagstid
    let fishTime = document.createElement('p');
    let fishTimeNode;
      if (fishData.availability.isAllDay == false){ //skrivs ut när fisken bara finns under vissa tider
        fishTimeNode = document.createTextNode('You can catch ' + fishData.name['name-EUen'] + ' between ' + fishData.availability.time +'.');
      }
      else{ //skriver ut när fisken finns hela dagen
        fishTimeNode = document.createTextNode('The ' + fishData.name['name-EUen'] + ' is available all day.');
      }
    fishTime.appendChild(fishTimeNode);
    result.appendChild(fishTime);

    //skriver ut månad
    let fishMonth = document.createElement('p');
    let fishMonthNode;
    if (fishData.availability.isAllYear == false){ //körs när fisken inte finns hela året 
      let monthArray = fishData.availability['month-array-northern'];

      //funktionen getMonth() ändrar int som finns i monthArray till sträng
      let months = getMonth(monthArray);
    
      fishMonthNode = document.createTextNode('You can catch ' + fishData.name['name-EUen'] + ' in the months '+ months +  '.');
    }
    else{ //körs när fisken finns hela året 
      fishMonthNode = document.createTextNode('The ' + fishData.name['name-EUen'] + ' is available all year.');
    }
    fishMonth.appendChild(fishMonthNode);
    result.appendChild(fishMonth);

  });
}

//hämta query från formulär på 'Bugs.html'
function searchBugs(e){
  e.preventDefault();

  //hämtar och ändra på användarens indata så att api:et hämtar rätt inlägg
  let query = document.querySelector('#search').value;
  query = query.toLowerCase();
  query = query.replace(' ', '_');

  //query skickas vidare till funktion displayBugs();
  displayBugs(query);
}

//skriva ut en lista av alla bugs
function printBugs(){
  //hämtar data från API:et 
  window.fetch('http://acnhapi.com/v1/bugs').then(function(response){
    return response.json();
  }).then(function(data) {

  //loopar igenom all data. Hjälp från https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_iterable 
  //Har användt Object.keys och data[bugData]
    for(let bugData of Object.keys(data)){
      let currentBug = data[bugData]; //hämtar aktuell element 
      
      //skapar och hämtar DOM-element för listan
      let listBugs = document.querySelector('#listBugs');
      let ul = document.createElement('ul');
      let listElement = document.createElement('li');
      listElement.setAttribute('class', 'listElement');

      //skriver ut icon 
      let bugIcon = document.createElement('img');
      bugIcon.src = currentBug.icon_uri;
      bugIcon.alt = 'icon';
      bugIcon.setAttribute('class', 'icon');
      listElement.appendChild(bugIcon);

      //skapa a-element som ska visas i listan
      let bugLink = document.createElement('a');
      bugLink.setAttribute('data-id', currentBug['file-name']); //skapa data-* attribute för att spara attributet file-name
      bugLink.setAttribute('href', " ");
      bugLink.setAttribute('class', 'villagerLink');
      bugLink.innerHTML = currentBug.name['name-EUen'];

      //lägger till a-element till listan
      listElement.appendChild(bugLink);
      ul.appendChild(listElement);
      listBugs.appendChild(ul);
      
      //event listener för alla element i listan
      ul.addEventListener("click", function(e){
        e.stopPropagation();
        e.preventDefault();

        let bug = e.target;

        //get query som skickas vidare till funktion displayBugs();
        let query = bug.getAttribute('data-id'); //hämta värde i data-id

        displayBugs(query);
      });
      
    }
    
  });
}

function displayBugs(query){
  //ta bort gammalt resultat
  let oldResult = document.querySelector('#resultBugs');
  oldResult.innerHTML = "";

  //ta bort gammalt felmeddelande
  let errorMsg = document.querySelector('.errorDiv');
  errorMsg.innerHTML = "";

  //hämta önskad data från API:et genom att söka efter query
  window.fetch('http://acnhapi.com/v1/bugs/' + query).then(function(response){

    //skriver ut ett felmeddelande om query inte hittas
    if (!response.ok || query == '') {
      printErrorMsg(query);
    } 
    else {
      return response.json();
    }
    
  }).then(function(data){

    let bugData = data; 

    let result = document.querySelector('#resultBugs');

    //skriver ut namn
    let bugName = document.createElement('h2');
    let bugNameNode = document.createTextNode((bugData.name['name-EUen'].toUpperCase()));
    bugName.appendChild(bugNameNode);
    result.appendChild(bugName);

    //skriver ut bild
    let bugImg = document.createElement('img');
    bugImg.src = bugData.image_uri;
    bugImg.alt = 'En bild av en ' + bugData.name['name-EUen'];
    bugImg.setAttribute('class', 'bugImg');
    result.appendChild(bugImg);


    //skriver ut plats 
    let bugLocation = document.createElement('p');
    let bugLocationNode = document.createTextNode('Location: ' + bugData.availability.location);
    bugLocation.appendChild(bugLocationNode);
    result.append(bugLocation);
    
    //skriver ut sällsynthet
    let bugRarity = document.createElement('p');
    let bugRarityNode = document.createTextNode('Rarity: ' + bugData.availability.rarity);
    bugRarity.appendChild(bugRarityNode);
    result.appendChild(bugRarity);

    //skriver ut dagstid
    let bugTime = document.createElement('p');
    let bugTimeNode;
      if (bugData.availability.isAllDay == false){ //skriver ut om bug bara finns under vissa timmar
        bugTimeNode = document.createTextNode('You can catch ' + bugData.name['name-EUen'] + ' between ' + bugData.availability.time +'.');
      }
      else{ //skrivs ut när bug finns hela dagen
        bugTimeNode = document.createTextNode('The ' + bugData.name['name-EUen'] + ' is available all day.');
      }
    bugTime.appendChild(bugTimeNode);
    result.appendChild(bugTime);

    //skriver ut månad
    let bugMonth = document.createElement('p');
    let bugMonthNode;
    if (bugData.availability.isAllYear == false){ //skrivs ut när bug bara finns under vissa månader

      let monthArray = bugData.availability['month-array-northern'];
      let months = getMonth(monthArray); //funktion som ändrar int i monthArray till sträng
    
      bugMonthNode = document.createTextNode('You can catch ' + bugData.name['name-EUen'] + ' in the months '+ months +  '.');
    }
    else{ //skrivs ut när bug finns hela året
      bugMonthNode = document.createTextNode('The ' + bugData.name['name-EUen'] + ' is available all year.');
    }
    bugMonth.appendChild(bugMonthNode);
    result.appendChild(bugMonth);
  });
}



//ändra månads-tal (1-12) i en vektor till string av månadens namn. har en vektor av tal som indata 
function getMonth(array){
  const monthString = [" January", " February", " March", " April", " May", " June", " July", " August", " September", " October", " November", " December"];
  let stringArray = []; //vektor som spara månader som string

  //hämtar ut alla tal som finns i vektor
  for(let i = 0; i < (array.length + 1); i ++){

    //värde i array avgör vilket string ur monthString som hämtas, om värdet är 5 så hämtas monthString[4] vilket motsvarar "May"
    let string = monthString[array[i] - 1]; 

    stringArray.push(string); //lägga till ny string till array som skickas tillbaka. 
  }
  return stringArray;
}

//skriver ut felmeddelande
function printErrorMsg(query){
  console.log('printerror');
  //tar bort gammal felmedellande 
  let errorDiv = document.querySelector('.errorDiv');
  errorDiv.innerHTML = "";

  //skriver felmedellande
  let errorMsg = document.createElement('h4');
  errorMsg.setAttribute('class', 'errorMsg');
  errorMsg.innerHTML = query + " not found. Try a different query";
  errorDiv.appendChild(errorMsg);
}
