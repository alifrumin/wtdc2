(function(){

var Map = function(){

  this.numMarkers = 0;
  this.geoJsonPlaces = [];
  self = this;

  // Submit button click listener
  $("#submit").on( "click", function(){
    event.preventDefault();
    var searchTerm = $("#placeName").val().replace( / /g, "+" );
    $.ajax({
      url: "http://api.opencagedata.com/geocode/v1/json?query=" + searchTerm + "&pretty=1&key=62ee540db24fba16c87a0ba5d353d3a7"
    }).done( function( res ){
      response = res.results[0];

      // Save response values: latitude, longitude, location name
      var lat = response.geometry.lat;
      var lng = response.geometry.lng;
      var name = response.components.attraction || response.components.building
      self.geoJsonPlaces.push([ lng, lat ]);

      // Run rendering methods for markers, popups and, if necessary, lines
      self.addMarkerPopup( lat, lng, name );
      self.numMarkers++;
      if( self.numMarkers > 1 ){
        self.connectMarkers();
      }
    });
  });

  // Generates map + tiling
  this.renderMap = function(){
    // Create map
    var map = L.map( "map" ).setView( [38.9038829, -77.0360032], 5 );

    // Add tiling
    L.tileLayer( "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "amaseda.674e6d2d",
      accessToken: "pk.eyJ1IjoiYW1hc2VkYSIsImEiOiI0YWY3MzQxYjIwMWUwZjQ1Mjc0MDBkNGVhOGVlNWUyOCJ9.bSlBmauhEsW9xl8jEY2p3w"
    }).addTo( map );

    return map;
  };

  this.addMarkerPopup = function( lat, lng, name ){
    // Add marker and popup to map
    var loc = L.marker( [ lat, lng ] ).addTo( map );
    loc.bindPopup( name + "<br/><br/>" + "<span>To-Do</span><ul><li>" + $( "#placeTodo" ).val() + "</li></ul>" );
  };

  this.connectMarkers = function(){
    // Save length of geoJsonPlaces array
    var numPlace = self.geoJsonPlaces.length - 1

    // Generate geoJSON string
    var connection = {
      "type": "LineString",
      "coordinates": [
        [ self.geoJsonPlaces[ numPlace-1 ][0], self.geoJsonPlaces[ numPlace-1 ][1] ],
        [ self.geoJsonPlaces[ numPlace ][0], self.geoJsonPlaces[ numPlace ][1] ]
      ]
    };

    // Attach geoJSON object to map
    L.geoJson( connection ).addTo( map );
  };
}

$( document ).ready( function(){
  var app = new Map();
  map = app.renderMap();
})
}());
