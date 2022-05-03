


  (async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

      const mapData = Highcharts.geojson(topology);
  mapData.forEach(function (country) {
    country.id = country.properties['hc-key']; // for Chart.get()
    country.flag = country.id.replace('UK', 'GB').toLowerCase();
  });

  let mapChart;

  Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {
  
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    const points = mapChart.getSelectedPoints();
    if (points.length) {
      

      if (!countryChart) {
        countryChart = Highcharts.chart('country-chart', {
          chart: {
            height: 250,
            spacingLeft: 0
          },
          credits: {
            enabled: false
          },
          title: {
            text: null
          },
          subtitle: {
            text: null
          },
          xAxis: {
            tickPixelInterval: 50,
            crosshair: true
          },
          yAxis: {
            title: null,
            opposite: true
          },
          tooltip: {
            split: true
          },
          plotOptions: {
            series: {
              animation: {
                duration: 500
              },
              marker: {
                enabled: false
              },
              threshold: 0,
              pointStart: parseInt(categories[0], 10)
            }
          }
        });
      }

      countryChart.series.slice(0).forEach(function (s) {
        s.remove(false);
      });
      points.forEach(function (p) {
        countryChart.addSeries({
          name: p.name,
          data: countries[p.code3].data,
          type: points.length > 1 ? 'line' : 'area'
        }, false);
      });
      countryChart.redraw();

    } else {
      if (countryChart) {
        countryChart = countryChart.destroy();
      }
    }
  });

  function drawChart(data) {
    const mapChart = Highcharts.mapChart('container', {
        chart: {
            map: topology,
            borderWidth: 1,
            
        },

        colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
            'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

        title: {
            text: 'SDG Score'
        },

        mapNavigation: {
            enabled: true
        },

        legend: {
            title: {
                text: 'Individuals per km²',
                style: {
                    color: ( // theme
                        Highcharts.defaultOptions &&
                        Highcharts.defaultOptions.legend &&
                        Highcharts.defaultOptions.legend.title &&
                        Highcharts.defaultOptions.legend.title.style &&
                        Highcharts.defaultOptions.legend.title.style.color
                    ) || 'black'
                }
            },
            align: 'left',
            verticalAlign: 'bottom',
            floating: true,
            layout: 'vertical',
            valueDecimals: 0,
            backgroundColor: ( // theme
                Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.backgroundColor
            ) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14
        },

        plotOptions: {
            series: {
                point: {
                    events: {
                        select: function drawChart1() {           
                        const test = Highcharts.chart('bin', {
                            chart: {
                                type: 'bar'
                            },
                            title: {
                                text: 'Fruit Consumption'
                            },
                            xAxis: {
                                categories: ['Apples', 'Bananas', 'Oranges']
                            },
                            yAxis: {
                                title: {
                                    text: 'Fruit eaten'
                                }
                            },
                            series: [{
                                name: 'Jane',
                                data: [1, 0, 4]
                            }, {
                                name: 'John',
                                data: [5, 7, 3]
                            }]
                        })
                    }
                    }
                }
            }
        },

        colorAxis: {
            type: 'logarithmic',
            endOnTick: false,
            startOnTick: false,
            min: 25
          },

        series: [{
            data: data,
            joinBy: ['iso-a3', 'code'],
            animation: true,
            name: 'Population density',
            allowPointSelect: true,
            cursor: 'pointer',
            events: {
                click: function (e) {
                    e.point.zoomTo();
                }
            },
            states: {
                hover: {
                    color: '#a4edba'
                },
             
                select: {
                      color: '#a4edba',
                      borderColor: 'black',
                      dashStyle: 'shortdot',
                      
                    },
                    events: {
                        click: function(event) {
                            alert (
                                'Fuck You'
                            );
                        }
                    }
                  
            },
            tooltip: {
                valueSuffix: '/km²'
            },
            shadow: false
        }]
    });
}
  // Wrap point.select to get to the total selected points
//   Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

//     proceed.apply(this, Array.prototype.slice.call(arguments, 1));

//     const points = mapChart.getSelectedPoints();
//     if (points.length) {
//       if (points.length === 1) {
//         document.querySelector('#info #flag')
//           .className = 'flag ' + points[0].flag;
//         document.querySelector('#info h2').innerHTML = points[0].name;
//       } else {
//         document.querySelector('#info #flag')
//           .className = 'flag';
//         document.querySelector('#info h2').innerHTML = 'Comparing countries';
//       }
//       document.querySelector('#info .subheader')
//         .innerHTML = '<h4>Historical population</h4><small><em>Shift + Click on map to compare countries</em></small>';
//         if (!countryChart) {
//             countryChart = Highcharts.chart('country-chart', {
//               chart: {
//                 height: 250,
//                 spacingLeft: 0
//               },
//               credits: {
//                 enabled: false
//               },
//               title: {
//                 text: null
//               },
//               subtitle: {
//                 text: null
//               },
//               xAxis: {
//                 tickPixelInterval: 50,
//                 crosshair: true
//               },
//               yAxis: {
//                 title: null,
//                 opposite: true
//               },
//               tooltip: {
//                 split: true
//               },
//               plotOptions: {
//                 series: {
//                   animation: {
//                     duration: 500
//                   },
//                   marker: {
//                     enabled: false
//                   },
//                   threshold: 0,
//                   pointStart: parseInt(categories[0], 10)
//                 }
//               }
//             });
//           }
    
//           countryChart.series.slice(0).forEach(function (s) {
//             s.remove(false);
//           });
//           points.forEach(function (p) {
//             countryChart.addSeries({
//               name: p.name,
//               data: countries[p.code3].data,
//               type: points.length > 1 ? 'line' : 'area'
//             }, false);
//           });
//           countryChart.redraw();
    
//         } else {
//           document.querySelector('#info #flag').className = '';
//           document.querySelector('#info h2').innerHTML = '';
//           document.querySelector('#info .subheader').innerHTML = '';
//           if (countryChart) {
//             countryChart = countryChart.destroy();
//           }
//         }
//       });
    

   

    // Load the data from a Google Spreadsheet
    // https://docs.google.com/spreadsheets/d/1WBx3mRqiomXk_ks1a5sEAtJGvYukguhAkcCuRDrY1L0/pubhtml
    Highcharts.data({
        googleAPIKey: 'AIzaSyBu-ktIooWMn_TZA_SK8QwmYomB2eNozbA',
        googleSpreadsheetKey: '11wMsSZduB_sqCo_Qx0gT_MtQbboQYMdZFTSrdMiHm-A',

        // Custom handler when the spreadsheet is parsed
        parsed: function (columns) {

            // Read the columns into the data array
            const data = columns[0].slice(1).map((code, i) => ({
                code: code.toUpperCase(),
                value: parseFloat(columns[2][i + 1]),
                name: columns[1][i + 1]
            }));

            drawChart(data);
        },
        error: function () {
            const chart = drawChart();
            chart.showLoading(
                '<i class="icon-frown icon-large"></i> ' +
                'Error loading data from Google Spreadsheets'
            );
        }
    });

})();