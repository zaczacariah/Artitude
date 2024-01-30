



// Functions to open and close a modal
    function openModal($el) {
        $el.addClass('is-active');
        
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
    
$('#searchQuery').on('keydown', (event) => {
    if(event.key === "Enter") {
    // If Empty - show message and border color
    if(!searchQuery.val()){
        searchQuery.attr('placeholder', 'Please Enter');
        searchQuery.addClass('searchAlert');
        setInterval(() => {
            searchQuery.attr('placeholder', 'Vincent Van Gogh');
            searchQuery.removeClass('searchAlert');

        }, 3500);
    }

    getArt(searchQuery.val());
    searchQuery.val('');
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


    getArt(searchQuery.val());
    searchQuery.val('');

})



async function getArt(search) {

    // I have specified to api to return only relevant fields:
    // Artist name - for Wiki api
    //image_id, country of origin, title, alt-text

    
    var url = `https://api.artic.edu/api/v1/artworks/search?q=${search}&fields=id,artist_title,image_id,place_of_origin,title`;

    // Api Call
    try{
        var response = await fetch(url);

        if(response.status != 200){
            throw new Error("Unsuccesful Artwork Search"); 
        }
    } catch(error){
        console.log('shit');
    }
   

    var data = await response.json();
    var artworks = data.data;
    $('#searchResults').html('');
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
        
    col.on('click', (event) => {
       
        populateModal(event.currentTarget);
        openModal($('.modal'));
    })
    

    var cardImage = $('<div>').addClass('card-image');
    var figure = $('<figure>').addClass('image is-1by1');
    var img = $('<img>').addClass('artwork');

    imgUrl = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
    img.attr('src', imgUrl);
    img.attr('alt', title);

     // Using jquery data function to add data to element for the sake of launching modal
     col.data('place_of_origin', place_of_origin);
     col.data('id', id);
     col.data('artist', artist_title);
   
     col.data('imageUrl', imgUrl);
     col.attr('id', `artwork-${id}`);

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
    if(artist_title == null || artist_title == undefined || artist_title == ''){
        return '';
    }
    var artist = artist_title.replace(/ /g, "_");
   
    var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${artist}`;

    var response = await fetch(url); 
    
    if(response.status == 404){
        'No Wikipedia Information for this Artist or Period.'
    }
    if(response.status != 200){
       return 'No Wikipedia Information for this Artist or Period.'
    }

    var data = await response.json();
    return data.extract;
}
getArtistInfo('Pablo Picasso');


async function populateModal(card) {
    card = $(card);
    var country = $('#modal_country');
    var artistHeader = $('#modal_artist');
    var wiki = $('#modal_wikiInfo');
    // Clear Existing Data
    country.text('');
    artistHeader.text('');
    wiki.text('');

    $('#modal_art').attr('src', card.data('imageUrl'));

    country.text(card.data('place_of_origin'));
    var artist = card.data('artist');
    artistHeader.text(artist);

    // Get wiki info
    var exerpt = await getArtistInfo(artist);

    wiki.text(exerpt);

}