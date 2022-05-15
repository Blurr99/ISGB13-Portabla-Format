'use strict';

window.addEventListener('load', init);

function init(){
    console.log('init');
    document.querySelector('#searchArtist').addEventListener('submit', searchMovie);
}

function searchMovie(e){
    
    e.preventDefault();
    let query = document.querySelector('#search').value;
    console.log('searchArtist');

    query.toLowerCase();
    //5a68582c4c25d865112e219289d54ee7
    window.fetch('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + query + '&api_key=5a68582c4c25d865112e219289d54ee7')
  .then(function(response) {
        return response.text();
    }).then(function(data) {
        let parser = new window.DOMParser();
        let xmlDom = parser.parseFromString(data, 'application/xml');

        let element = xmlDom.querySelectorAll('artist');
        console.log(element);
            let artist = element[0];
            console.log(artist);
            let name = artist.querySelector('name').innerHTML;
            
    
            console.log(name);
    
            let result = document.querySelector('.displayResult');
            let nameTextNode = document.createTextNode(name);
            result.appendChild(nameTextNode);
    })
}