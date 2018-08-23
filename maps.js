var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 27.501677, lng: -109.9325527},
        zoom: 14
    });
}

function setPosition(lat, lng){
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: lat, lng: lng}
    });

    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);
}

function getDirection(){
    localizar(function(data){
        console.log( data );

        var address = data.details[0].formatted_address;
        console.log( address );

        var pos = data.position;
        setPosition( pos.lat, pos.lng );
        $('#address').html(address);
    });
}


function localizar(callback){
    if (navigator.geolocation) {
    	//Browser request to the user allow gelocation
        navigator.geolocation.getCurrentPosition( function(position) {
        	//getting coordinates
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //see: 	https://developers.google.com/maps/documentation/geocoding/intro
            //		https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding
            var uri = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.lat+","+pos.lng+"&key=API_TOKEN&sensor=false";
            //request location info with reverse geocoding
			$.get(uri, function (response){
					if( response.status === "OK" ){
                        var data = {
                            "position": pos,
                            "details": response.results
                        }
                        callback(data);
                    }
					else
                        console.error( "Reverse geocoding: "+ response.error_message );
				}
			);

        }, function(error) {
            console.info("An error ocurred: "+error.message);
        });
    } else {
        // Browser doesn't support Geolocation
        console.info("Browser doesn't support Geolocation");
    }
}


$(document).ready(function(){

    $('#localice').click(function() {
        getDirection();
    });

});