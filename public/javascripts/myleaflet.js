
var Map = function(){

  this.numMarkers = 0;
  this.geoJsonPlaces = [];
  self = this;

  // Generates map + tiling
  this.renderMap = function(){
    // Create map
    var map = L.map( "map" ).setView( [38.9038829, -77.0360032], 11 );
    // Add tiling
    L.tileLayer( "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "amaseda.674e6d2d",
      accessToken: "pk.eyJ1IjoiYW1hc2VkYSIsImEiOiI0YWY3MzQxYjIwMWUwZjQ1Mjc0MDBkNGVhOGVlNWUyOCJ9.bSlBmauhEsW9xl8jEY2p3w"
    }).addTo( map );

    return map;
  };

  this.addMarkerPopup = function( lat, lng, name, addy ){
    // Add marker and popup to map
    var loc = L.marker( [ lat, lng ] ).addTo( map );
    loc.bindPopup( name + addy);
  };
}

$(document).ready(function() {
  var app = new Map();
  map = app.renderMap();
  $.ajax({
    url: "/posts",
    type: "GET",
    dataType: "json"
  }).done(function(res) {
    console.log(res.length)
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].address);
      var searchTerm = res[i].address;
      $.ajax({
        url: "https://api.opencagedata.com/geocode/v1/json?query=" + searchTerm + "&pretty=1&key=62ee540db24fba16c87a0ba5d353d3a7"
      }).done( function( response ){
        response = response.results[0];
        console.log(response)
        // Save response values: latitude, longitude, location name
        var lat = response.geometry.lat;
        var lng = response.geometry.lng;
        var name = response.components.attraction || response.components.building
        var addy = response.formatted;
        self.geoJsonPlaces.push([ lng, lat ]);
        // Run rendering methods for markers, popups and, if necessary, lines
        self.addMarkerPopup( lat, lng, name, addy );
        self.numMarkers++;
      });
    }
  })
})
