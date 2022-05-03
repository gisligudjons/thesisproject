// Requires your access token

let objects

d3.csv('data/sdv.csv')
    .then((data) =>{
        // console.log(data)
        // console.log(data.columns)
        // console.log(data.rows)
    })

// Loading geo.json features with dedicated d3 method        
d3.json('data/countries.geo-copy.json')
  .then((geojson) => {
    // Asynchronous JavaScript waiting for data promise to complete before moving on to .then() 
    if (geojson.features) {
      console.log('Number of features:', geojson.features.length)
      objects = geojson
    }
    // https://www.mapbox.com/mapbox-gl-js/api/#accesstoken
    // TODO: add personal mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoicmVhZHlsZXRzZ28iLCJhIjoiY2t0dTR2aGNjMXd3bDJubWgwcWwzcWJzMyJ9.4Qpfc2HBPT14KIrBhX0XGQ'

    // https://www.mapbox.com/mapbox-gl-js/api/#map
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/branigan/cjzsvonse027m1co4nkxp13b3',  // try your own, i.e. mapbox://styles/sauter/cksi9buw56sk918mkg9c58qjf
        center: [18.2812, 9.1021], // 9.1021° N, 18.2812° E
        zoom: 2
    })

    map.on('load', function() {

      var resetButton = document.getElementById('reset');

      resetButton.onclick = function() {
       map.resize();
       console.log("resize")
       }


      map.addSource('country_geo_data', {
        type: 'geojson',
        data: 'data/countries.geo-copy.json'
      });
    



      map.addLayer({
        'id': 'country',
        'source': 'country_geo_data',
      	'maxZoom': 9,
        'type': 'fill',
        'paint': {
            'fill-color': {
                property: 'sdv_2021_SDG_Index_Score',
                stops: [
                    [37, '#b10000'],
                    [43, '#bc3900'],
                    [49, '#c25c00'],
                    [55, '#c17c00'],
                    [61, '#ba9c00'],
                    [67, '#abba00'],
                    [74, '#92d700'],
                    [81, '#67f400'],
                    [88, '#00f484'],
                    
                ],
                
            },
            'fill-opacity': 0.2
            
            },
          });
    

    map.on('click', 'circle', (e) => {
        map.flyTo({
        center: e.features[0].geometry.coordinates,
        zoom: 8
        });
        });

      

    // select mapbox container 
    let container = map.getCanvasContainer()
    
    //add svg
    let svg = d3.select(container).append('svg')

    function projectPoint (lon, lat) {
        let point = map.project(new mapboxgl.LngLat(lon, lat))
        this.stream.point(point.x, point.y)
    }

    let transform = d3.geoTransform({point: projectPoint}) 
    let path = d3.geoPath().projection(transform) // https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md



  

    let featureElement = svg
        .selectAll('path')
        .data(geojson.features)
        // d3 data joins https://observablehq.com/@d3/selection-join
        .join('path')
        .attr('d', d3.geoPath().projection(transform))
        .attr('stroke', 'none')
        .attr('fill', 'lightgray')
        .attr('fill-opacity', 0.2)
        .on('mouseover', function (d) {
          // https://developer.mozilla.org/en-US/docs/Web/API/Event/srcElement
          // console.log(d.srcElement.__data__)
          d3.select(this).attr('fill', 'dodgerblue')
          //we control name
          d3.select('#hover')
            .text(d.srcElement.__data__.properties.name + ' score ' + (d.srcElement.__data__.properties.sdv_2021_SDG_Index_Score))
            console.log(d.srcElement.__data__.properties.sdv_2021_SDG_Index_Score)
          d3.select('#hover').attr('fill-opacity', 1)
        })
        .on('mouseout', function (d) {
          d3.select(this).attr('fill', 'lightgray')
          d3.select('#hover').attr('fill-opacity', 0)
        })
        .on('mousemove', (d) => {
          // console.log(d3.pointer(d))
          d3.select('#hover')
            .attr('x', () => { return d3.pointer(d)[0] + 20 })
            .attr('y', () => { return d3.pointer(d)[1] + 10 })


        })
        
        .on('click', function (d) {




            
            console.log(d.srcElement.__data__.properties.name + " clicked!" + d.srcElement.__data__.id)
            document.getElementById('controls').innerHTML = " " + d.srcElement.__data__.properties.name  ;
            // window.open('index2.html')
            map.fitBounds(d3.geoBounds(d.srcElement.__data__))

            dashboard(d)

          },)
    
    // add hover label text        
    svg.append('text')
        .attr('id', 'hover')
        
    // sync map views and scales on reset
    let update = () => {
        featureElement.attr('d', path)
    }

    var selectTag = d3.select("select");

    //we have select all options tags from inside select tag (which there are 0 atm)
    //and assigned data as to be the base of modelling that selection.
    var options = selectTag.selectAll('option')
      .data(geojson.features);
      // console.log(JSON.stringify(geojson.features))

    //d3 sees we have less elements (0) than the data (2), so we are tasked to create
    //these missing inside the `options.enter` pseudo selection.
    //if we had some elements from before, they would be reused, and we could access their
    //selection with just `options`
    options.enter()
      .append('option')
      .attr('value', function(d) {
        return d.properties.name;
      })
      .text(function(d) {
        return d.properties.name;
      })


      d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this)._groups[0][0][0].__data__.properties.name
        console.log(selectedOption)




        // run the updateChart function with this selected option
        update(selectedOption)
    })

    // manage layer visibility during map interactions that change projection
    map.on('viewreset', update)

    map.on('movestart', () => {
        svg.classed('hidden', true)
    })

    map.on('rotate', () => {
        svg.classed('hidden', true)
    })

    map.on('moveend', () => {
        update()
        svg.classed('hidden', false)
    })

    function resetMap(){
      map.fitBounds[
        map
      ]

    }

    document.getElementById('reset').addEventListener('click', () => {
      console.log("clicked")
      resetMap()})

    
      function dashboard(d) {

        // Get all the property values we need for the selected country:
        var countryName = d.srcElement.__data__.properties.name;
        var countryNameLong = d.srcElement.__data__.properties.name;
        var currentCountryCode = d.srcElement.__data__.properties.id;
    
        // Build the chart (this is in a separate javascript file,
        buildChart(currentCountryCode, countryName);
        buildEsgChart1(currentCountryCode, countryName)

      console.log(countryName)
        //Note: I use countryNameLong as an ID to match the csv data undelying the chart,
        // and I use countryName as a pretty name.
      }
      

    //Drop down menuið
    
    
})    

//   Register to get your Mapbox access token https://docs.mapbox.com/help/glossary/access-token/
//   Code from https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/ 
  })
