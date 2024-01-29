



// Functions to open and close a modal
    function openModal($el) {
        $el.addClass('is-active');
        console.log("CLICK");
    }

    function closeModal($el) {
        $($el).removeClass('is-active');
    }

    function closeAllModals() {
        closeModal($('.modal'));
    }

    // Add a click event on buttons to open a specific modal
    $('.js-modal-trigger').each(() => {
        const trigger = $('.js-modal-trigger');
        const modal = $('.modal');
        
        trigger.on('click', () => {
        openModal(modal);
        });
    });

    // // Add a click event on various child elements to close the parent modal
    $('.modal-close').on('click', () => {
        closeModal($('.modal'));
    });

    // Add a keyboard event to close all modals
    $('html').on('keydown', (event) => {
        if(event.key === "Escape") {
        closeAllModals();
        }
    });
 


var submit = $('#submit');

var searchQuery = $('#searchQuery');

submit.on('click', function () {

    // If Empty - show message and border color
    if(!searchQuery.val()){
        searchQuery.attr('placeholder', 'Please Enter');
        searchQuery.addClass('searchAlert');
        setInterval(() => {
            searchQuery.attr('placeholder', 'Vincent Van Gogh');
            searchQuery.removeClass('searchAlert');

        }, 3500);
    }


    getArt(searchQuery);
    searchQuery.val('');

})



async function getArt(search) {

    // I have specified to api to return only relevant fields:
    // Artist name - for Wiki api
    //image_id, country of origin, title, alt-text

    search = 'cats'; //FIXED
    var url = `https://api.artic.edu/api/v1/artworks/search?q=${search}&fields=id,artist_title,image_id,place_of_origin,title`;

    // Api Call
    var response = await fetch(url);
    if(response.status != 200){
        throw new Error("Unsuccesful Artwork Search"); 
    }

    var data = await response.json();
    var artworks = data.data;

    // Create the Tiles for each piece
    for(var index = 0; index < artworks.length; index++){
        var card = createArtTile(artworks[index]);
        $('#searchResults').append(card);
    }

}


// Generate Tiles
function createArtTile({ id, artist_title, image_id, place_of_origin, title }){
    var col = $('<div>').addClass('column is-one-quarter');
    var card = $('<div>').addClass('card');

     // Using jquery data function to add data to element for the sake of launching modal
    card.data('place_of_origin', place_of_origin);
    card.data('id', id);
    card.data('Artist', artist_title);
    card.attr('id', `artwork-${id}`);

    var cardImage = $('<div>').addClass('card-image');
    var figure = $('<figure>').addClass('image is-1by1');
    var img = $('<img>').addClass('artwork');

    imgUrl = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
    img.attr('src', imgUrl);
    img.attr('alt', title);

    figure.append(img);
    cardImage.append(figure);
    card.append(cardImage);
    
    var cardCont = $('<div>').addClass('card-content');
    var media = $('<div>').addClass('media');
    var mediaCont = $('<div>').addClass('media-content');
    var p = $('<p>').addClass('title is-5 artistName');
    p.text(artist_title);
    mediaCont.append(p);
    media.append(mediaCont);
    cardCont.append(media);

    card.append(cardCont);

    col.append(card);
   
   
    return col;
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