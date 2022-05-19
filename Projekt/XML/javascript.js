'use strict';

window.addEventListener('load', init);

//körs när sidan laddads klart
function init(){
    document.querySelector('#searchArtist').addEventListener('submit', searchArtist);
}

function searchArtist(e){
  //ta bort gammalt resultat
  let oldResult = document.querySelector('.displayResult');
  oldResult.innerHTML = "";

  //ta bort gammalt felmeddelande
  let errorMsg = document.querySelector('#errorMsg');
  errorMsg.innerHTML = "";

    e.preventDefault();
    let query = document.querySelector('#search').value;
    query.toLowerCase();

    //fetch-request för att få ut artists top tracks 
    window.fetch('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + encodeURIComponent(query) + '&api_key=5a68582c4c25d865112e219289d54ee7')
    .then(function(response) {
        return response.text();
    }).then(function(data) {

        let parser = new window.DOMParser();
        let xmlDom = parser.parseFromString(data, 'application/xml');

        //hämta ut lfm status för felhantering
        let lfm = xmlDom.querySelector('lfm');
        let status = lfm.getAttribute('status');

        //felhantering. funktionen ska avslutas om query inte hittas i databasen 
        if (status == "failed"){
            return 0;
        }
     
        //hämtar ut artist name för att skriva ut högst upp i main tagg
        let artist = xmlDom.querySelectorAll('artist')[0];
        let name = artist.querySelector('name').innerHTML;
        let nameH2 = document.querySelector('h2');
        nameH2.innerHTML = name;
    
        let result = document.querySelector('.displayResult');

        //skapar div för att visa tracks
        let resultTracks = document.createElement('div');
        resultTracks.setAttribute('class', 'sub');

        //skriver ut en heading
        let heading = document.createElement('h3');
        heading.innerHTML = 'Tracks';
        resultTracks.appendChild(heading);

        result.appendChild(resultTracks);

        
        //loopar igenom alla tracks och skriver ut title
        let allTracks = xmlDom.querySelectorAll('track');
        for(let i = 0; i < allTracks.length; i++ ){
            let currentTrack = allTracks[i];
            let title = currentTrack.querySelector('name').innerHTML;
            let titleP = document.createElement('p');
            titleP.innerHTML = title; 

            resultTracks.appendChild(titleP);
          
        }
     
    });

    //fetch-request med samma query för att få ut albums 
    window.fetch('http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + encodeURIComponent(query) + '&api_key=5a68582c4c25d865112e219289d54ee7')
    .then(function(response) {
            return response.text();
        }).then(function(data) {
            let parser = new window.DOMParser();
            let xmlDom = parser.parseFromString(data, 'application/xml');
            
            //hämta ut lfm status för felhantering
            let lfm = xmlDom.querySelector('lfm');
            let status = lfm.getAttribute('status');
    
           //det ska skrivas ut ett felmeddelande och funktionen ska avslutas när query inte hittas i databasen
            if (status == "failed"){
                printErrorMsg(query);
                return 0;
            }
               
            //hämtar alla albums
            let allAlbums = xmlDom.querySelectorAll('album');

            let result = document.querySelector('.displayResult');

            //skapar div för att visar albums
            let resultAlbums = document.createElement('div');
            resultAlbums.setAttribute('class', 'sub');

            //skriver ut en heading
            let heading = document.createElement('h3');
            heading.innerHTML = 'Albums';
            resultAlbums.appendChild(heading);

            result.appendChild(resultAlbums);

            //loopar igenom alla albums och skriva namnen i resultAlbums
            for(let i = 0; i < allAlbums.length; i++ ){
                let currentAlbum = allAlbums[i];
                let title = currentAlbum.querySelector('name').innerHTML;
                let titleP = document.createElement('p');
                titleP.innerHTML = title; 
    
                resultAlbums.appendChild(titleP);
            } 
            
        });
}
//skriver ut felmeddelande
function printErrorMsg(query){
    let errorDiv = document.querySelector('#errorMsg');
    let errorMsg = document.createElement('h4');
    errorDiv.appendChild(errorMsg);
    errorMsg.innerHTML = query + " not found. Try a different query";
}