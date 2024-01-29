


async function getArt(search) {

    // I have specified to api to return only relevant fields:
    // Artist name - for Wiki api
    //image_id, country of origin, title, alt-text


    search = 'cats'; //FIXED FOR NOW

    var url = `https://api.artic.edu/api/v1/artworks/search?q=${search}&fields=id,artist_title,image_id,place_of_origin,title`;

    // Api Call
    var response = await fetch(url);
    if(response.status != 200){

        throw new Error("Unsuccesful Artwork Search"); 


    }

    var data = await response.json();
    var artworks = data.data;

    // Create the Tiles for each piece
    for(var index = 0; index < artworks.length-8; index++){
        createArtTile(artworks[index]);
    }

}

// getArt();


// Generate Tiles
function createArtTile({ id, artist_title, image_id, place_of_origin, title }){

    imgUrl = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
    //Note to self: use jquery data function to add data to element for the sake of launching modal

}

async function getArtistInfo(artist_title){

    var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${artist_title}`;

    var response = await fetch(url);
   
    if(response.status != 200){
        throw new Error("Unsuccesful Wiki"); 
    }

    var data = await response.json();
    return data.extract;
}
getArtistInfo('Pablo Picasso');

