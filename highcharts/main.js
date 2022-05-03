(async () => {

    const topology = await fetch(
      'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
  
    const csv = await fetch(
      'world-population-history (1).csv'
    ).then(response => response.text());
    console.log(csv)
  
    // Very simple and case-specific CSV string splitting
    const CSVtoArray = text => text.replace(/^"/, '')
    .replace(/",$/, '')
    .split('","');

const csvArr = csv.split(/\n/),
    countries = {},
    numRegex = /^[0-9\.]+$/,
    lastCommaRegex = /,\s$/,
    quoteRegex = /\"/g;
    categories = CSVtoArray(csvArr[1].slice(0));

let countryChart;

// Parse the CSV into arrays, one array each country
csvArr.slice(3).forEach(function (line) {
    var row = CSVtoArray(line),
        data = row.slice(0);

    data.forEach(function (val, i) {
        val = val.replace(quoteRegex, '');
        data[i] = val;
    });

    countries[row[1]] = {
        name: row[0],
        code3: row[1],
        data: data
    };
    console.log(data)
});
  
    // For each country, use the latest value for current population
    const data = [];
    for (const code3 in countries) {
      if (Object.hasOwnProperty.call(countries, code3)) {
        const itemData = countries[code3].data;
        let value = null,
          i = itemData.length,
          year;
  
        while (i--) {
          if (typeof itemData[i] === 'number') {
            value = itemData[i];
            year = categories[i];
            break;
          }
        }
        data.push({
          name: countries[code3].name,
          code3: code3,
          value: value,
          year: year
        });
      }
    }
  
    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    const mapData = Highcharts.geojson(topology);
    mapData.forEach(function (country) {
      country.id = country.properties['hc-key']; // for Chart.get()
      country.flag = country.id.replace('UK', 'GB').toLowerCase();
    });
  
    // Wrap point.select to get to the total selected points
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

      
      // The speed gauge
      Highcharts.chart('gauge-chart',  {
        chart: {
            type: 'solidgauge',
            height: 300
          },
        
          title: null,
        
          pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },

        yAxis: {
            stops: [
                [0.3, '#DF5353'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.7, '#55BF3B'] // red
                
              ],
              lineWidth: 0,
              tickWidth: 0,
              minorTickInterval: null,
              tickAmount: 2,
              title: {
                y: -70
              },
              labels: {
                y: 16
              },
          min: 0,
          max: 200,
          title: {
            text: 'Score'
          }
        },

        plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
              }
            }
          },
      
        credits: {
          enabled: false
        },
      
        series: [{
          name: 'Score',
          data: [80],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:25px">{y}</span><br/>' +
              '<span style="font-size:12px;opacity:0.4"></span>' +
              '</div>'
          },
          tooltip: {
            valueSuffix: ' '
          }
        }]
      
      });
      
      
      


    Highcharts.chart('bar-chart', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Sub-Index Performance'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [
            'Natural Capital',
            'Resource intesity',
            'Intellectual Capital',
            'Social Capital',
            'Governance',
           
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Index Score'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Iceland',
          data: [62.5, 43.0, 62.5, 64.1, 64.1, ]
      
        }, 
       ]
      });
      
      Highcharts.chart('radar-chart', {
      
        chart: {
          polar: true,
          height: 300
        },
      
        title: {
          text: 'Highcharts Polar Chart'
        },
      
        subtitle: {
          text: 'Also known as Radar Chart'
        },
      
        pane: {
          startAngle: 0,
          endAngle: 360
        },
      
        xAxis: {
          tickInterval: 1,
          min: 1,
          max: 17,
          labels: {
            format: 'Goal {value}'
          }
        },
      
        yAxis: {
          min: 0
        },
      
        plotOptions: {
          series: {
            pointStart: 0,
            pointInterval: 1
          },
          column: {
            pointPadding: 0,
            groupPadding: 0
          }
        },
      
        series: [ {
          type: 'area',
          name: 'SDG Goals Score',
          data: [99.798,	58.23585714, 96.00192308,	99.26204167,	85.62666667,	74.643,	99.44633333,	79.449,	85.72416667,	96.897,	91.23375,	28.53433333,	50.33833333,	65.03016667,	53.2175,	94.291,	71.1695]
        }]
      });
      
      Highcharts.chart('line-chart', {
      
        title: {
          text: 'SDG Index Score'
        },
      
        subtitle: {
          text: ''
        },
      
        yAxis: {
          title: {
            text: 'Score'
          }
        },
      
        xAxis: {
          accessibility: {
            rangeDescription: 'Range: 2018 to 2021'
          },
          categories: ['2018', '2019', '2020', '2021']
        },
      
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
      
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2018, 
            pointEnd: 2021,
            points: 4
          }
        },
      
        series: [{
          name: 'SDG Score',
          data: [63.3, 65.8, 70, 75.7,]
        }, ],
      
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      
      });
  
    // Initiate the map chart
    const mapChart = Highcharts.mapChart('container', {
  
      chart: {
        map: topology,
        
        
      },
  
      title: {
        text: 'Population history by country'
      },
  
      subtitle: {
        text: 'Source: <a href="http://data.worldbank.org/indicator/SP.POP.TOTL/countries/1W?display=default">The World Bank</a>'
      },
  
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
  
      colorAxis: {
        type: 'logarithmic',
        endOnTick: false,
        startOnTick: false,
        min: 50000
      },
  
      tooltip: {
        footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
      },
  
      series: [{
        csvURL: window.location.origin + 'data/sdv4.csv',
        mapData: mapData,
        joinBy: ['iso-a3', 'code3'],
        name: 'Current population',
        allowPointSelect: true,
        cursor: 'pointer',
        states: {
          select: {
            color: '#a4edba',
            borderColor: 'black',
            dashStyle: 'shortdot'
          }
        },
        borderWidth: 0.5
      }]
    });
  
    // Pre-select a country
    mapChart.get('us').select();
  
  })();