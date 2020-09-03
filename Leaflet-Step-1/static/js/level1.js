// code for creating Basic Map (Level 1)

// // Perform an API call to the USGS earthquake endpoint to get earthquake information. Call createMarkers when complete
const usgsURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';

// //add geoJSON layer:
d3.json(usgsURL).then(
  jsonData => {
    console.log(jsonData);
    createFeatures(jsonData.features)
  }
);
      
//define color scaling function based on signal range , earthquake signals range from 0 to 50 Hz.
function myColorScale(d){
  return  d>1000 ? '#ff0000':
          d>800 ? '#ff5040':
          d>600 ? '#ff7a70':
          d>400 ? '#ffa19b':
          d>200 ? '#ffc5c4':
                  '#ffd7d7';

};

function createFeatures(quakeData){
  //create a function to define the properties of each circle marker
  function myStyle(feature){
    return{
      opacity: 0.65,
      fillOpacity: 0.65,
      fillColor: myColorScale(feature.properties.sig),
      color:"black",
      radius: 3*(feature.properties.mag),
      stroke: true,
      weight: 0.3
    };
  }

  //define function to bind popups to each marker
  function onEachFeature(feature,layer){
    layer.bindPopup(`<h2> Earthquake: ${feature.properties.place}</h2>
    <br>
    <h3>Time: ${feature.properties.time}</h3>
    <h3>Magnitude: ${feature.properties.mag}</h3>
    <h3>Significance: ${feature.properties.sig}</h3>`);
  }

  //create geoJSON layer with each quake feature in it
  const quakes= L.geoJSON(quakeData,{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng);
    },
    style: myStyle
  });

  createMap(quakes);
}

//function to create all the map properties
function createMap(quakes){
  //create tile layer that will be map background:
  const lightmap= 
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
  });

  //create basemaps object for base layer:
  const baseMaps={
    "light map": lightmap,
  };

  //create overlay object for overlay layer
  const overlayMaps={
    Earthquakes:quakes
  };

  // create map:
  const myMap= L.map("map",{
    center:[37, -97],
    zoom:3,
    layers: [lightmap, quakes]
  });

  //create layer control:
  L.control.layers(baseMaps, overlayMaps,{
    collapsed:false
  }).addTo(myMap)

  //define function to create legend
  const legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      labels = ['<strong>Quake Significance</strong>'],
      categories = ['1001','801','601','401', '201', '0'];
      texts=['>1000', '>800', '>600', '>400', '>200', '>0']
     
      for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + myColorScale(categories[i]) + '"></i> ' +(texts[i] ? texts[i] : '+'));
      }
      div.innerHTML = labels.join('<br><br>');
      return div;
    };
  legend.addTo(myMap);
}

