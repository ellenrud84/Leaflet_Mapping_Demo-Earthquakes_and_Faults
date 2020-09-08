// code for creating Advanced Map (Level 2)
    //PART1: CREATE BASE MAPS:
//______________________________


    //create map baselayers:
    const lightmap= 
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    const satmap=
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
    });

    const darkmap=
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

    const myMap= L.map("map",{
    center:[40, -120],
    zoom:5,
    layers:[lightmap, satmap,darkmap]
    });

    //add lightmap to map
    lightmap.addTo(myMap);

    //create basemaps object for base layer:
    const baseMaps={
    light: lightmap,
    satellite: satmap,
    dark:darkmap
    };

    //create layer groups that will become overlays:
    const faultLayer = new L.LayerGroup();
    const quakeLayer = new L.LayerGroup();

    //create overlay layers for data we will later read in:
    const overlays ={
    "Faults": faultLayer,
    "Earthquakes": quakeLayer
    };

    // add layer control:
    L.control.layers(baseMaps,overlays).addTo(myMap);

// QUAKES PART-----------------------------------------------------------------------------

// // Perform an API call to the USGS earthquake endpoint to get earthquake information. Call createMarkers when complete
const usgsURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';

// //add geoJSON layer:
d3.json(usgsURL).then(
    jsonData => {
      console.log(jsonData);
      createQuakeFeatures(jsonData.features)
    }
);
  
function createQuakeFeatures(feature){
    
    //define color scaling function based on significance:
    function myColorScale(significance){
        return  significance>1000 ? '#ff0000':
                significance>800 ? '#ff5040':
                significance>600 ? '#ff7a70':
                significance>400 ? '#ffa19b':
                significance>200 ? '#ffc5c4':
                        '#ffd7d7';

    };

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
    const quakes= L.geoJSON(feature,{
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng);
        },
      style: myStyle
    }).addTo(quakeLayer)
};
   
quakeLayer.addTo(myMap);


    
//PART 2:CREATE FAULT LINES
//________________________

//1. define fault path
const faultPath='static/data/qfaults_latest_quaternary.geojson';
    
    //pull data from faultPath:
d3.json(faultPath).then(
    jsonData => {
    createFaultFeatures(jsonData.features)
    }
);


function createFaultFeatures(feature){
 
    //define line weights based on slip rate
    function myLineWeight(slipRate){
    return slipRate=="Greater than 5.0 mm/yr" ? 5.0:
        slipRate=="Between 1.0 and 5.0 mm/yr" ? 2.5:
        0.0// do not show faults with other slip values
    };    

    function lineStyle(feature){
        return{
        color:"purple",
        weight: myLineWeight(feature.properties.slip_rate)
        };
    }

    function onEachFeature(feature, layer){
        layer.bindPopup(`<h2> Faultline: ${feature.properties.fault_name}</h2>
        <br>
        <h3>Slip rate: ${feature.properties.slip_rate}</h3>`);
    };

    const faults = L.geoJSON(feature,{
        onEachFeature: onEachFeature,
        style:lineStyle
    }).addTo(faultLayer);
} ;

faultLayer.addTo(myMap);