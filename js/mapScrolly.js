 // Default Configs
 mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzaGF5dmVybWEiLCJhIjoiY2lpMG1xdzEzMDR5bXUxbTFxYmN4M3Q4diJ9.B1Vnb4Q-IBGGp4lRmUCO4A';

 var targetTuvalu = {
     "center": [177.99753, -7.94737],
     "pitch": 0,
     "zoom": 7,
     "bearing": -40.0
 };

var targetMaldives = {
    "center": [73.51364, 4.18675],
    "pitch": 0,
    "zoom": 10,
    "bearing": 0
};

 var size = 200;

 // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
 // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
 var pulsingDot = {
     width: size,
     height: size,
     data: new Uint8Array(size * size * 4),

     // get rendering context for the map canvas when layer is added to the map
     onAdd: function() {
         var canvas = document.createElement('canvas');
         canvas.width = this.width;
         canvas.height = this.height;
         this.context = canvas.getContext('2d');
     },

     // called once before every frame where the icon will be used
     render: function() {
         var duration = 1000;
         var t = (performance.now() % duration) / duration;

         var radius = (size / 2) * 0.3;
         var outerRadius = (size / 2) * 0.7 * t + radius;
         var context = this.context;

         // draw outer circle
         context.clearRect(0, 0, this.width, this.height);
         context.beginPath();
         context.arc(
             this.width / 2,
             this.height / 2,
             outerRadius,
             0,
             Math.PI * 2
         );
         context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
         context.fill();

         // draw inner circle
         context.beginPath();
         context.arc(
             this.width / 1,
             this.height / 1,
             radius,
             0,
             Math.PI * 2
         );


         // update this image's data with data from the canvas
         this.data = context.getImageData(
             0,
             0,
             this.width,
             this.height
         ).data;

         // continuously repaint the map, resulting in the smooth animation of the dot
         map.triggerRepaint();

         // return `true` to let the map know that the image was updated
         return true;
     }
 };


 var targetPoints = {
     'type': 'geojson',
     'data': {
         'type': 'FeatureCollection',
         'features': [{
                 // feature for Mapbox DC
                 'type': 'Feature',
                 'geometry': {
                     'type': 'Point',
                     'coordinates': [
                        -18.86083, 64.72502
                     ]
                 },
                 'properties': {
                     'title': '',
                 }
             },
             {
                 // feature for Mapbox SF
                 'type': 'Feature',
                 'geometry': {
                     'type': 'Point',
                     'coordinates': [-18.86083, 64.72502]
                 },
                 'properties': {
                     'title': '',
                     'icon': 'harbor'
                 }
             },
             {
                 // feature for Mapbox SF
                 'type': 'Feature',
                 'geometry': {
                     'type': 'Point',
                     'coordinates': [73.51364, 4.18675]
                 },
                 'properties': {
                     'title': 'Maldives',
                     'icon': 'harbor'
                 }
             },
             {
                 // feature for Mapbox SF
                 'type': 'Feature',
                 'geometry': {
                     'type': 'Point',
                     'coordinates': [177.99753, -7.94737]
                 },
                 'properties': {
                     'title': 'Tuvalu',
                     'icon': 'harbor'
                 }
             },
         ]
     }
 }


 var source = {
     "center": [-18.86083, 64.72502],
     "pitch": 10,
     "zoom": 5,
     "bearing": 0
 };

 var map = new mapboxgl.Map({
     container: 'map-wrapper',
     style: 'mapbox://styles/branigan/cjzsvonse027m1co4nkxp13b3',
     // camera options properties - https://docs.mapbox.com/help/glossary/camera/
     center: source.center,
     pitch: source.pitch, // pitch in degrees
     bearing: source.bearing, // bearing in degrees
     zoom: source.zoom
 });





 map.scrollZoom.disable();

 // using d3 for convenience
 var main = d3.select("main");
 var scrolly = main.select("#mapScrolly");
 var figure = scrolly.select(".background-overlay");
 var article = scrolly.select("article");
 var step = article.selectAll(".mapStep");

 figure.style("opacity", 1)

 // initialize the scrollama
 var mapScroller = scrollama();

 // generic window resize listener event
 function handleResize() {
     // 1. update height of step elements
     var stepH = Math.floor(window.innerHeight * 0.75);
     step.style("height", stepH + "px");

     var figureHeight = window.innerHeight;
     console.log(figureHeight);
     var figureMarginTop = (window.innerHeight - figureHeight) / 2;

     figure
         .style("height", figureHeight + "px")
         .style("top", figureMarginTop + "px");

     // 3. tell scrollama to update new element dimensions
     mapScroller.resize();
 }

 function changeLocationOnMap(toPoint) {
     console.log(toPoint);


     map.flyTo(toPoint);

 }


 // scrollama event handlers
 function handleStepEnter(response) {

     // response = { element, direction, index }

     // add color to current step only
     step.classed("is-active", function(d, i) {
         return i === response.index;
     });

     console.log(response.index)

     // update graphic based on step
     //figure.select("p").text(response.index + 1);
     //
     if (response.index == 0) {
         changeLocationOnMap(source)

         // Hide Layers            
         map.setLayoutProperty("acc-layers-19", 'visibility', 'none');

         // Show Layers
         map.setLayoutProperty("sec-1", 'visibility', 'visible');

     } else if (response.index == 4) {
         changeLocationOnMap(targetTuvalu)
        } else if (response.index == 5) {
            changeLocationOnMap(targetTuvalu)

     } else if (response.index == 2) {
            changeLocationOnMap(targetMaldives)
        } else if (response.index == 3) {
            changeLocationOnMap(targetMaldives)
    } else if (response.index == 1) {
            changeLocationOnMap(source)




         // Hide Layers
         map.setLayoutProperty("sec-1", 'visibility', 'none');

         // Show Layers
         map.setLayoutProperty("acc-layers-19", 'visibility', 'visible');
         setTimeout(function() {}, 2000);
     }


 }

 function setupStickyfill() {
     d3.selectAll(".sticky").each(function() {
         Stickyfill.add(this);
     });
 }

 function handleProgress(response) {
     console.log(response)

     //map.setOpacity(response.progress);

     if (response.index < 1) {

         figure.transition().delay(100).style("opacity", 1);
     }
 }

 function init() {

     map.on("load", function() {

         map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 3 });

         map.addSource('acc-points-19', targetPoints);



         map.addSource('points', {
             'type': 'geojson',
             'data': {
                 'type': 'FeatureCollection',
                 'features': [{
                         'type': 'Feature',
                         'geometry': {
                             'type': 'Point',
                             'coordinates': [-18.86083, 64.72502]
                         },
                         'properties': {
                             'title': 'TITLE',

                         }
                     },
                    
                 ]
             }
         });



         map.addLayer({
             'id': 'sec-1',
             'type': 'symbol',
             'source': 'points',
             'layout': {
                 'icon-image': 'pulsing-dot',
                 'text-field': ['get', 'title'],
                 'text-font': ["Open Sans Semibold", "Arial Unicode MS Bold"],
                 'text-offset': [2, 1],
                 'text-anchor': 'left'
             },
             paint: {
                 "text-color": "#ffffff"
             }
         });

         map.addLayer({
             'id': 'acc-layers-19',
             'type': 'symbol',
             'source': 'acc-points-19',
             'layout': {
                 'icon-image': 'pulsing-dot',
                 'icon-allow-overlap': true,
                 'text-field': ['get', 'title'],
                 'text-font': ["Open Sans Semibold", "Arial Unicode MS Bold"],
                 'text-offset': [1, 0.5],
                 'text-anchor': 'left'
             },
             paint: {
                 "text-color": "#ffffff"
             }
         });

         map.setLayoutProperty("acc-layers-19", 'visibility', 'none');
         map.setLayoutProperty("sec-1", 'visibility', 'none');

     })

     setupStickyfill();

     // 1. force a resize on load to ensure proper dimensions are sent to scrollama
     handleResize();


     // 2. setup the mapScroller passing options
     //      this will also initialize trigger observations
     // 3. bind scrollama event handlers (this can be chained like below)
     mapScroller
         .setup({
             step: "#mapScrolly article .mapStep",
             offset: 0.5,
             progress: true,
             debug: false
         })
         //.onStepProgress(handleProgress)
         .onStepEnter(handleStepEnter);


     // setup resize event
     window.addEventListener("resize", handleResize);
 }

 // kick things off
 init();