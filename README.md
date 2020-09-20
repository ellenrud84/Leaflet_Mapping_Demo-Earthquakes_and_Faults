# Earthquakes and Fault Lines:
## Summary:
In this demo I use the Leaflet mapping plugin to create interactive maps showing both United States fault lines and global earthquakes.

## Technologies Used:
Leaflet, html, CSS,

## Results:
TODO ADD PICTURES AND DESCRIPTIONS


## Methods:
The earthquake data was imported and each earthquakes position, significance and magnitude were pulled out of the dataset.  At each earthquakes position, a circle element was appended to the leaflet map. Each data marker reflects the magnitude of the earthquake in its size and the significance of earthquake in its color. Earthquakes with higher magnitudes appear larger and those with higher significance appear darker in color. When any marker is clicked a pop-up appears providing additional information about the quake.
A legend provides context for the map data.

A second set of data, of U.S. fault lines was imported and added to the map in a line marker group.  Each line represents a single fault line. Fault lines with slip rates less than 1.0mm/yr were excluded from the visualization.  The weight of the lines corresponds to the slip rate of the fault line; fault lines with higher slip rates appear as thicker lines. When any line is clicked, a pop-up appears providing the user with additional information about that fault line.

A number of basemap layers were included for the user to choose from, in addition to the earthquake and fault line overlay layers.  A layer control was coded in to allow the user to toggle between the different basemap and overlay layers.

## Data:
The USGS provides earthquake data in a number of different formats, updated every 5 minutes.
Earthquake data fro the past 30 days is pulled from the US GeoJSON Feed, Past 30 Days M1.0+ Earthquakes:
https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

Fault Data is from a csv file of faultline records.
