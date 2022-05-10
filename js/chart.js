// Note: This code is partially based on this block: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

// **********************************
// **********************************
// Remove the chart when it is unwanted (e.g., when resetting to generic homepage view).
function removeChart() {
    d3.select("#chart").select("svg").remove();
  }

function removeChart() {
    d3.select("#esgChart1").select("svg").remove();
  }
  
  // **********************************
  // **********************************
  // Build the chart for the current country and display it:
function buildChart(currentCountryCode, currentCountry) {
    //Note: I use countryNameLong as an ID to match the csv data undelying the chart,
    // and I use countryName as a pretty name.
  
    // **********************************
    // Load the data:
    var promises = [d3.csv("data/sdv4.csv")];
    Promise.all(promises).then(function(data) {
      ready(data[0]);
    }).catch(function(error) {
      console.log(error);
    });
  
    // When the data is ready, start putting together the chart:
    function ready(data) {
  
      // First, select the subset of data rows corresponding to the current country:
      data = data.filter(function(d) {
        return d.country_code == currentCountryCode;
      });
  
      // Change the type of some fields from string to number:
      data.forEach(function(d) {
        d.year = +d.year;
        d.rating = +d.rating;
        
      });
  
  
      // **********************************
      // Do some preliminary setup
  
      // In this line chart, I will trace data lines for 2 indicators,
      // rating and EcolFootprint:
      var indicatorsList = ["rating",];
  
      // Define the colors for the two indicators' data lines (green and red):
      var color = d3.scaleOrdinal()
        .domain(indicatorsList)
        .range(["#4cc313", "#d22f21"]);
  
      // Define pretty names for the two indicators:
      var prettyName = d3.scaleOrdinal()
        .domain(indicatorsList)
        .range(["rating",]);
  
      // Define the chart's line shape:
      var line = d3.line()
        .curve(d3.curveBasis) // apply smoothing to the line
        .x(function(d) {
          return x(d.year);
        })
        .y(function(d) {
          return y(d.gha);
        });
  
      // Prepare the indicators data so that it is ready to draw (in [year, gha] pairs):
      var indicatorsData = indicatorsList.map(function(indicName) {
        return {
          indicName: indicName,
          values: data.map(function(d) {
            return {
              year: d.year,
              gha: +d[indicName]
            };
          })
        };
      });
  
      // **********************************
      // Create the main svg to draw the chart on
  
      // First, remove the previous chart:
      removeChart();
  
      //Define the size and margins of the chart:
      var margin = {
          top: 30,
          right: 100,
          bottom: 50,
          left: 50
        },
        width = 450 - margin.left - margin.right,
        height = 290 - margin.top - margin.bottom;
  
      // Create a new svg element for the new chart:
      d3.select("#chart").select("svg").remove();
      svg = d3.select("#chart").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // **********************************
      // Put together the  x and y axes
  
      // Define the D3 scale for the x axis (showing the years)
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
          return d.year;
        }))
        .range([0, width]);
  
      // Find out the maximum gha value for either indicator:
      var maxGha = d3.max(indicatorsData, function(c) {
        return d3.max(c.values, function(v) {
          return v.gha;
        });
      });
  
      // Define the D3 scale for the y axis. it will go from 0 to the max gha value:
      var y = d3.scaleLinear()
        .range([height, 0])
        .domain([
          0,
          100
        ]);
  
      // Format the tick marks on the axes:
      var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format(".0f"));
      var yAxis = d3.axisLeft(y);
      if (maxGha >= 7) {
        yAxis.tickFormat(d3.format(".0f")); // Larger y ranges will show no decimals
      } else {
        yAxis.tickFormat(d3.format(".1f")); // Smaller y ranges will show no decimals
      }
  
      // Add the x axis, position it, and style it:
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(" + (width / 2) + ",30)")
        .attr("dy", ".71em")
        .attr("class", "axisCaption")
        .text("Historical data for " + currentCountry);
  
      // Add the y axis, position it, and style it:
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(" + "-46," + (height / 2) + ")rotate(-90)")
        .attr("dy", ".71em")
        .attr("class", "axisCaption")
        .text("gha");
  
      // **********************************
      // Draw the two indicators' data lines
  
      // Create the two line objects:
      var indicatorsLines = svg.selectAll(".indicatorLine")
        .data(indicatorsData)
        .enter().append("g")
        .attr("class", "indicatorLine");
  
      // Actually draw the lines and style them:
      indicatorsLines.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.indicName);
        });
  
      // Add the indicators' names at the end of the lines:
      // indicatorsLines.append("text")
      //   .datum(function(d) {
      //     return {
      //       indicName: d.indicName,
      //       value: d.values[d.values.length - 1]
      //     };
      //   })
      //   .attr("transform", function(d) {
      //     return "translate(" + x(d.value.year) + "," + y(d.value.gha) + ")";
      //   })
      //   .attr("x", 6)
      //   .attr("dy", ".35em")
      //   .attr("class", "line-text")
      //   .text(function(d) {
      //     return prettyName(d.indicName);
      //   })
  
  
      // **********************************
      // Define the mouseover behavior
  
      // Create a group to display the dotted vertical line that follows the mouse
      // and display extra information:
      var gMouse = svg.append("g")
        .attr("class", "mouse-over-effects");
  
      // Add object for the vertical line itself:
      gMouse.append("path")
        .attr("class", "mouse-line")
  
      // Create a group to display the year corresponding to the mouseover position
      // at the very top of the chart:
      svg.append("g")
        .attr("class", "year-text")
        .attr("transform", "translate(0,-10)");
  
      // Note: At the intersection between the dotted line and each indicator's line,
      // we will display a circle and the current gha value:
  
      // Get the two indicator line objects:
      var lines = document.getElementsByClassName('line');
  
      // Create objects to hold the circles and gha value:
      var mousePerLine = gMouse.selectAll('.mouse-per-line')
        .data(indicatorsData)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");
  
      // Add the circles:
      mousePerLine.append("circle")
        .attr("class", "mouse-circle")
        .attr("r", 7)
        .style("stroke", function(d) {
          return color(d.indicName);
        })
  
      // Position the gha text to the right of the circles:
      mousePerLine.append("text")
        .attr("transform", "translate(10,-8)")
        .attr("class", "gha-text");
  
      // Add a rectangle covering the entire chart to catch mouse movements
      // (we can't catch mouse events on a g element)
      gMouse.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none') // the rectangle is transparent
        .attr('pointer-events', 'all')
  
        // On mouse out, hide dotted vertical line, circles, gha value, and year:
        .on('mouseout', function() {
          d3.selectAll(".mouse-line, .mouse-per-line circle, .gha-text, .year-text")
            .style("opacity", "0");
        })
        // On mouse in, show dotted vertical line, circles, gha value, and year:
        .on('mouseover', function() {
          d3.selectAll(".mouse-line, .mouse-per-line circle, .gha-text, .year-text")
            .style("opacity", "1");
        })
        // As the mouse moves over the canvas, compute the coordinates of the dotted line:
        .on('mousemove', function() {
          var mouse = d3.mouse(this);
          d3.select(".mouse-line")
            .attr("d", function() {
              var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
            });
  
          // Based on the mouse position, find the x and y values for the
          // intersection with the indicators lines:
          d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
              var xyear = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) {
                  return d.year;
                }).right;
              idx = bisect(d.values, xyear);
              var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
              while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
                }
                if (pos.x > mouse[0]) end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
              }
  
              // Display the gha value:
              d3.select(this).select('.gha-text')
                .text(y.invert(pos.y).toFixed(2));
  
              // Remove the previous year at the top of the chart:
              d3.selectAll(".year-text").select("text")
                .remove();
  
              // Get the year at the mouse's position, and display it at the top of the chart:
              var yearTranslate = "translate(" + mouse[0] + ",0)";
              d3.selectAll(".year-text")
                .append("text")
                .text(x.invert(pos.x).toFixed(0))
                .attr("transform", yearTranslate);
  
              return "translate(" + mouse[0] + "," + pos.y + ")";
  
            });
        });
    }
  }



function buildEsgChart1(currentCountryCode, currentCountry) {


      // Load the data:
    //   var promises = [d3.csv("data/sdv4.csv")];
    //   Promise.all(promises).then(function(data) {
    //     ready(data[0]);
    //   }).catch(function(error) {
    //     console.log(error);
    //   });

    //   removeChart();

    //   var margin = {top: 70, right: 20, bottom: 40, left: 40},
    //   w = 500 - margin.left - margin.right,
    //   h = 400 - margin.top - margin.bottom;

    //   var color = d3.scale.category20();

    //   var circleConstraint = d3.min([h, w]);
    //   var radius = d3.scale.linear()
    //  .range([0, (circleConstraint / 2)]);

    //   var centerXPos = w / 2 + margin.left;
    //   var centerYPos = h / 2 + margin.top;

    //   d3.select("#esgChart").select("svg").remove();

    //   var svg = d3.select("#esgChart").append("svg")
    //   .attr("width", w + margin.left + margin.right)
    //   .attr("height", h + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform", "translate(" + centerXPos + ", " + centerYPos + ")");

    var promises = [d3.csv("data/sdv4.csv")];
    Promise.all(promises).then(function(data) {
      ready(data[0]);
    }).catch(function(error) {
      console.log(error);
    });
  
    // When the data is ready, start putting together the chart:
    function ready(data) {
  
      // First, select the subset of data rows corresponding to the current country:
      data = data.filter(function(d) {
        return d.country_code == currentCountryCode;
      });
  
      // Change the type of some fields from string to number:
      data.forEach(function(d) {
        d.year = +d.year;
        d.rating = +d.rating;
        
      });
  
  
      // **********************************
      // Do some preliminary setup
  
      // In this line chart, I will trace data lines for 2 indicators,
      // rating and EcolFootprint:
      var indicatorsList = ["rating",];
  
      // Define the colors for the two indicators' data lines (green and red):
      var color = d3.scaleOrdinal()
        .domain(indicatorsList)
        .range(["#4cc313", "#d22f21"]);
  
      // Define pretty names for the two indicators:
      var prettyName = d3.scaleOrdinal()
        .domain(indicatorsList)
        .range(["rating",]);
  
      // Define the chart's line shape:
      var line = d3.line()
        .curve(d3.curveBasis) // apply smoothing to the line
        .x(function(d) {
          return x(d.year);
        })
        .y(function(d) {
          return y(d.gha);
        });
  
      // Prepare the indicators data so that it is ready to draw (in [year, gha] pairs):
      var indicatorsData = indicatorsList.map(function(indicName) {
        return {
          indicName: indicName,
          values: data.map(function(d) {
            return {
              year: d.year,
              gha: +d[indicName]
            };
          })
        };
      });
  
      // **********************************
      // Create the main svg to draw the chart on
  
      // First, remove the previous chart:
      removeChart();
  
      //Define the size and margins of the chart:
      var margin = {
          top: 30,
          right: 100,
          bottom: 50,
          left: 50
        },
        width = 450 - margin.left - margin.right,
        height = 290 - margin.top - margin.bottom;
  
      // Create a new svg element for the new chart:
      d3.select("#esgChart1").select("svg").remove();
      svg = d3.select("#esgChart1").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // **********************************
      // Put together the  x and y axes
  
      // Define the D3 scale for the x axis (showing the years)
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
          return d.year;
        }))
        .range([0, width]);
  
      // Find out the maximum gha value for either indicator:
      var maxGha = d3.max(indicatorsData, function(c) {
        return d3.max(c.values, function(v) {
          return v.gha;
        });
      });
  
      // Define the D3 scale for the y axis. it will go from 0 to the max gha value:
      var y = d3.scaleLinear()
        .range([height, 0])
        .domain([
          0,
          100
        ]);
  
      // Format the tick marks on the axes:
      var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format(".0f"));
      var yAxis = d3.axisLeft(y);
      if (maxGha >= 7) {
        yAxis.tickFormat(d3.format(".0f")); // Larger y ranges will show no decimals
      } else {
        yAxis.tickFormat(d3.format(".1f")); // Smaller y ranges will show no decimals
      }
  
      // Add the x axis, position it, and style it:
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(" + (width / 2) + ",30)")
        .attr("dy", ".71em")
        .attr("class", "axisCaption")
        .text("Historical data for " + currentCountry);
  
      // Add the y axis, position it, and style it:
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(" + "-46," + (height / 2) + ")rotate(-90)")
        .attr("dy", ".71em")
        .attr("class", "axisCaption")
        .text("gha");
  
      // **********************************
      // Draw the two indicators' data lines
  
      // Create the two line objects:
      var indicatorsLines = svg.selectAll(".indicatorLine")
        .data(indicatorsData)
        .enter().append("g")
        .attr("class", "indicatorLine");
  
      // Actually draw the lines and style them:
      indicatorsLines.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.indicName);
        });
  
      // Add the indicators' names at the end of the lines:
      // indicatorsLines.append("text")
      //   .datum(function(d) {
      //     return {
      //       indicName: d.indicName,
      //       value: d.values[d.values.length - 1]
      //     };
      //   })
      //   .attr("transform", function(d) {
      //     return "translate(" + x(d.value.year) + "," + y(d.value.gha) + ")";
      //   })
      //   .attr("x", 6)
      //   .attr("dy", ".35em")
      //   .attr("class", "line-text")
      //   .text(function(d) {
      //     return prettyName(d.indicName);
      //   })
  
  
      // **********************************
      // Define the mouseover behavior
  
      // Create a group to display the dotted vertical line that follows the mouse
      // and display extra information:
      var gMouse = svg.append("g")
        .attr("class", "mouse-over-effects");
  
      // Add object for the vertical line itself:
      gMouse.append("path")
        .attr("class", "mouse-line")
  
      // Create a group to display the year corresponding to the mouseover position
      // at the very top of the chart:
      svg.append("g")
        .attr("class", "year-text")
        .attr("transform", "translate(0,-10)");
  
      // Note: At the intersection between the dotted line and each indicator's line,
      // we will display a circle and the current gha value:
  
      // Get the two indicator line objects:
      var lines = document.getElementsByClassName('line');
  
      // Create objects to hold the circles and gha value:
      var mousePerLine = gMouse.selectAll('.mouse-per-line')
        .data(indicatorsData)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");
  
      // Add the circles:
      mousePerLine.append("circle")
        .attr("class", "mouse-circle")
        .attr("r", 7)
        .style("stroke", function(d) {
          return color(d.indicName);
        })
  
      // Position the gha text to the right of the circles:
      mousePerLine.append("text")
        .attr("transform", "translate(10,-8)")
        .attr("class", "gha-text");
  
      // Add a rectangle covering the entire chart to catch mouse movements
      // (we can't catch mouse events on a g element)
      gMouse.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none') // the rectangle is transparent
        .attr('pointer-events', 'all')
  
        // On mouse out, hide dotted vertical line, circles, gha value, and year:
        .on('mouseout', function() {
          d3.selectAll(".mouse-line, .mouse-per-line circle, .gha-text, .year-text")
            .style("opacity", "0");
        })
        // On mouse in, show dotted vertical line, circles, gha value, and year:
        .on('mouseover', function() {
          d3.selectAll(".mouse-line, .mouse-per-line circle, .gha-text, .year-text")
            .style("opacity", "1");
        })
        // As the mouse moves over the canvas, compute the coordinates of the dotted line:
        .on('mousemove', function() {
          var mouse = d3.mouse(this);
          d3.select(".mouse-line")
            .attr("d", function() {
              var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
            });
  
          // Based on the mouse position, find the x and y values for the
          // intersection with the indicators lines:
          d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
              var xyear = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) {
                  return d.year;
                }).right;
              idx = bisect(d.values, xyear);
              var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
              while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
                }
                if (pos.x > mouse[0]) end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
              }
  
              // Display the gha value:
              d3.select(this).select('.gha-text')
                .text(y.invert(pos.y).toFixed(2));
  
              // Remove the previous year at the top of the chart:
              d3.selectAll(".year-text").select("text")
                .remove();
  
              // Get the year at the mouse's position, and display it at the top of the chart:
              var yearTranslate = "translate(" + mouse[0] + ",0)";
              d3.selectAll(".year-text")
                .append("text")
                .text(x.invert(pos.x).toFixed(0))
                .attr("transform", yearTranslate);
  
              return "translate(" + mouse[0] + "," + pos.y + ")";
  
            });
        });
    }
}

//Billabong charts

// for ESM environment, need to import modules as:
// import bb, {scatter} from "billboard.js"



const dataPrev = {

  2021: [
      ['Natural Capital', 48.2],
      ['Resource Intensity', 49.9],
      ['Social Capital', 44.6],
      ['Intellectual Capital', 38.8],
      ['Governance', 49.9],
  ],
  2020: [
      ['Natural Capital', 44.2],
      ['Resource Intensity', 48.7],
      ['Social Capital', 42.0],
      ['Intellectual Capital', 35.9],
      ['Governance', 46.9],
  ],
  2019: [
      ['Natural Capital', 44.0],
      ['Resource Intensity', 48.5],
      ['Social Capital', 41.3],
      ['Intellectual Capital', 39.0],
      ['Governance', 46.4],

  ],
  2018: [
      ['Natural Capital', 44.5],
      ['Resource Intensity', 46.7],
      ['Social Capital', 41.4],
      ['Intellectual Capital', 38.3],
      ['Governance', 47.4],
  ],
      2017: [
      ['Natural Capital', 0],
      ['Resource Intensity', 0],
      ['Social Capital', 0],
      ['Intellectual Capital', 0],
      ['Governance', 0],
  ],
};

const data = {
  2021: [
      ['Natural Capital', 49.0],
      ['Resource Intensity', 46.7],
      ['Social Capital', 44.1],
      ['Intellectual Capital', 35.3],
      ['Governance', 50.0],
  ],
  2020: [
     ['Natural Capital', 48.2],
      ['Resource Intensity', 49.9],
      ['Social Capital', 44.6],
      ['Intellectual Capital', 38.8],
      ['Governance', 49.9],
  ],
  2019: [
      ['Natural Capital', 44.2],
      ['Resource Intensity', 48.7],
      ['Social Capital', 42.0],
      ['Intellectual Capital', 35.9],
      ['Governance', 46.9],
  ],
  2018: [
      ['Natural Capital', 44.0],
      ['Resource Intensity', 48.5],
      ['Social Capital', 41.3],
      ['Intellectual Capital', 39.0],
      ['Governance', 46.4],
  ],
  2017: [
      ['Natural Capital', 44.5],
      ['Resource Intensity', 46.7],
      ['Social Capital', 41.4],
      ['Intellectual Capital', 38.3],
      ['Governance', 47.4],
  ]
};




const getData = data => data.map((country, i) => ({
  name: country[0],
  y: country[1],
}));

// const chart = Highcharts.chart('subIndexGlobal', {

  let subIndexOptions = {
  chart: {
      type: 'column',
      height: "120%",
  },
  title: {
      text: '2021 GSCI Sub-Index Performance',
      align: 'left'
  },
  subtitle: {
      text: 'Average GSCI Sub-Index Scores For The Past 5 Years ',
      align: 'left'
  },
  plotOptions: {
      series: {
          grouping: false,
          borderWidth: 0
          
      }
      
  },
  legend: {
      enabled: true
  },
  tooltip: {
      shared: true,
      headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
  },
  xAxis: {
      type: 'category',
      accessibility: {
          description: 'Sub-Indexes'
      },
      max: 4,
      labels: {
          animate: true,
          
          style: {
              textAlign: 'center'
          }
      }
  },
  yAxis: [{
      title: {
          text: 'Global Average'
      },
      showFirstLabel: false,
      min: 0,
      max: 100,
  }],
  
  credits: false,
  
     colors: [
                      '#f2ae1c',
                      '#f8f7f4',
                      '#8c3839',
                      '#050a30',
                      '#dc661f'
                  ],
  
  series: [{
      color: 'rgb(158, 159, 163)',
      pointPlacement: -0.2,
      linkedTo: 'main',
      data: dataPrev[2021].slice(),
      name: '2020'
  }, {
      name: '2021',
      id: 'main',
      dataSorting: {
          enabled: false,
          matchByName: true
      },
      dataLabels: [{
          enabled: true,
          inside: true,
          style: {
              fontSize: '16px'
          }
      }],
      data: getData(data[2021]).slice()
  }],
  exporting: {
      allowHTML: false
  }
  
};




const years = [2021, 2020, 2019, 2018, 2017];

years.forEach(year => {
  const btn = document.getElementById(year);

  btn.addEventListener('click', () => {

      document.querySelectorAll('.buttons button.active')
          .forEach(active => {
              active.className = '';
          });
      btn.className = 'active';

      subIndexGlobalChart.update({
          title: {
              text: `${year} GSCI Sub-Index Performance`
          },
          subtitle: {
              text: 'Average GSCI Sub-Index Scores For The Past 5 Years'
          },
          series: [{
              name: year - 1,
              data: dataPrev[year].slice()
          }, {
              name: year,
              data: getData(data[year]).slice()
          }]
      }, true, false, {
          duration: 800
      });
  });
});


let lineTheme = {
  colors: ["#f2ae1c", '#A3EDBA', '#F19E53', '#6699A1',
  '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'],

chart: {
  backgroundColor: {
      stops: [
          [1, '#45445d']
      ]
  },
  style: {
      fontFamily: 'IBM Plex Sans, sans-serif'
  }
},
title: {
  style: {
      fontSize: '22px',
      fontWeight: '500',
      color: '#fff'
  }
},
subtitle: {
  style: {
      fontSize: '16px',
      fontWeight: '400',
      color: '#fff'
  }
},
credits: false,

caption: {
  style: {
      color: '#f0f0f0'
  }
},
tooltip: {
  borderWidth: 0,
  backgroundColor: '#f0f0f0',
  shadow: true
},
legend: {
  backgroundColor: 'transparent',
  itemStyle: {
      fontWeight: '400',
      fontSize: '12px',
      color: '#fff'
  },
  itemHoverStyle: {
      fontWeight: '700',
      color: '#fff'
  }
},
labels: {
  style: {
      color: '#707073'
  }
},
plotOptions: {
  series: {
      dataLabels: {
          color: '#46465C',
          style: {
              fontSize: '13px'
          }
      },
      marker: {
          lineColor: '#333'
      }
  },
  boxplot: {
      fillColor: '#505053'
  },
  candlestick: {
      upColor: '#DA6D85',
      upLineColor: '#DA6D85'
  },
  errorbar: {
      color: 'white'
  },
  dumbbell: {
      lowColor: '#f0f0f0'
  },
  map: {
      borderColor: 'rgba(200, 200, 200, 1)',
      nullColor: '#78758C'

  }
},

drilldown: {
  activeAxisLabelStyle: {
      color: '#F0F0F3'
  },
  activeDataLabelStyle: {
      color: '#F0F0F3'
  },
  drillUpButton: {
      theme: {
          fill: '#fff'
      }
  }
},
xAxis: {
  gridLineColor: '#707073',
  labels: {
      style: {
          color: '#fff',
          fontSize: '12px'
      }
  },
  lineColor: '#707073',
  minorGridLineColor: '#505053',
  tickColor: '#707073',
  title: {
      style: {
          color: '#fff'
      }
  }
},
yAxis: {
  gridLineColor: '#707073',
  labels: {
      style: {
          color: '#fff',
          fontSize: '12px'
      }
  },
  lineColor: '#707073',
  minorGridLineColor: '#505053',
  tickColor: '#707073',
  tickWidth: 1,
  title: {
      style: {
          color: '#fff',
          fontWeight: '300'
      }
  }
},
mapNavigation: {
  enabled: false,
  buttonOptions: {
      theme: {
          fill: '#46465C',
          'stroke-width': 1,
          stroke: '#BBBAC5',
          r: 2,
          style: {
              color: '#fff'
          },
          states: {
              hover: {
                  fill: '#000',
                  'stroke-width': 1,
                  stroke: '#f0f0f0',
                  style: {
                      color: '#fff'
                  }
              },

              select: {
                  fill: '#000',
                  'stroke-width': 1,
                  stroke: '#f0f0f0',
                  style: {
                      color: '#fff'
                  }
              }
          }
      },
      verticalAlign: 'bottom'
  }
},
// scroll charts
rangeSelector: {
  buttonTheme: {
      fill: '#46465C',
      stroke: '#BBBAC5',
      'stroke-width': 1,
      style: {
          color: '#fff'
      },
      states: {
          hover: {
              fill: '#1f1836',
              style: {
                  color: '#fff'
              },
              'stroke-width': 1,
              stroke: 'white'
          },
          select: {
              fill: '#1f1836',
              style: {
                  color: '#fff'
              },
              'stroke-width': 1,
              stroke: 'white'
          }
      }
  },
  inputBoxBorderColor: '#BBBAC5',
  inputStyle: {
      backgroundColor: '#2F2B38',
      color: '#fff'
  },
  labelStyle: {
      color: '#fff'
  }
},
navigator: {
  handles: {
      backgroundColor: '#BBBAC5',
      borderColor: '#2F2B38'
  },
  outlineColor: '#CCC',
  maskFill: 'rgba(255,255,255,0.1)',
  series: {
      color: '#A3EDBA',
      lineColor: '#A3EDBA'
  },
  xAxis: {
      gridLineColor: '#505053'
  }
},
scrollbar: {
  barBackgroundColor: '#BBBAC5',
  barBorderColor: '#808083',
  buttonArrowColor: '#2F2B38',
  buttonBackgroundColor: '#BBBAC5',
  buttonBorderColor: '#2F2B38',
  rifleColor: '#2F2B38',
  trackBackgroundColor: '#78758C',
  trackBorderColor: '#2F2B38'
}

}

let lineOptions = {
chart: {
    height: "120%"
},

  title: {
    text: 'Average SDG Goal Index Score and GSCI Index Score '
},

subtitle: {
    text: '2015 - 2021'
},

yAxis: {
    title: {
        text: 'Index Score'
    }
},

xAxis: {
    accessibility: {
        rangeDescription: 'Range: 2017 to 2021'
    }
},

credits: false,

// legend: {
//     layout: 'vertical',
//     align: 'right',
//     verticalAlign: 'middle'
// },

plotOptions: {
    height: "120%",
    series: {
        label: {
            connectorAllowed: false
        },
        pointStart: 2017
    }
},

series: [{
    name: 'Global SDG Index Score',
    data: [64.8, 64.9, 66.0, 66.77, 66.8]
}, 
{
    name: 'Global GSCI Index Score',
    data: [43.7, 43.9, 43.6, 46.3, 45.0
]}],

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

}


let chart1 = new Highcharts.Chart('lineCompare', Highcharts.merge(lineOptions, lineTheme));


const radarData = {
  2021: [
    ['SDG goal 1', 72.5],
    ['SDG goal 2', 58.9],
    ['SDG goal 3', 69.5],
    ['SDG goal 4', 80.9],
    ['SDG goal 5', 61.4],
    ['SDG goal 6', 67.4],
    ['SDG goal 7', 72.5],
    ['SDG goal 8', 68.7],
    ['SDG goal 9', 43.2],
    ['SDG goal 10', 53.6],
    ['SDG goal 11', 70.8],
    ['SDG goal 12', 76.3],
    ['SDG goal 13', 82.1],
    ['SDG goal 14', 63.5],
    ['SDG goal 15', 65.0],
    ['SDG goal 16', 67.3],
    ['SDG goal 17', 58.8],

  ],
  2020: [
    ['SDG goal 1', 73.8],
    ['SDG goal 2', 55.2],
    ['SDG goal 3', 69.3],
    ['SDG goal 4', 78.7],
    ['SDG goal 5', 61.0],
    ['SDG goal 6', 67.9],
    ['SDG goal 7', 71.7],
    ['SDG goal 8', 71.8],
    ['SDG goal 9', 41.8],
    ['SDG goal 10', 57.0],
    ['SDG goal 11', 71.6],
    ['SDG goal 12', 76.5],
    ['SDG goal 13', 83.3],
    ['SDG goal 14', 60.7],
    ['SDG goal 15', 65.9],
    ['SDG goal 16', 66.3],
    ['SDG goal 17', 62.2],
  ],
  2019: [
    ['SDG goal 1', 74.4],
    ['SDG goal 2', 53.6],
    ['SDG goal 3', 70.0],
    ['SDG goal 4', 76.9],
    ['SDG goal 5', 60.17],
    ['SDG goal 6', 67.64],
    ['SDG goal 7', 71.1],
    ['SDG goal 8', 71.6],
    ['SDG goal 9', 35.1],
    ['SDG goal 10', 59.1],
    ['SDG goal 11', 71.8],
    ['SDG goal 12', 77.4],
    ['SDG goal 13', 86.6],
    ['SDG goal 14', 50.5],
    ['SDG goal 15', 64.8],
    ['SDG goal 16', 66.0],
    ['SDG goal 17', 64.5],
  ],
  2018: [
    ['SDG goal 1', 86.3],
    ['SDG goal 2', 54.4],
    ['SDG goal 3', 71.0],
    ['SDG goal 4', 71.1],
    ['SDG goal 5', 64.2],
    ['SDG goal 6', 75.6],
    ['SDG goal 7', 66.0],
    ['SDG goal 8', 64.9],
    ['SDG goal 9', 35.3],
    ['SDG goal 10', 57.3],
    ['SDG goal 11', 70.8],
    ['SDG goal 12', 69.2],
    ['SDG goal 13', 82.3],
    ['SDG goal 14', 48.6],
    ['SDG goal 15', 60.4],
    ['SDG goal 16', 63.8],
    ['SDG goal 17', 62.1],

  ],
  2017: [
    ['SDG goal 1', 85.2],
    ['SDG goal 2', 52.4],
    ['SDG goal 3', 70.7],
    ['SDG goal 4', 72.3],
    ['SDG goal 5', 59.9],
    ['SDG goal 6', 78.3],
    ['SDG goal 7', 66.1],
    ['SDG goal 8', 61.9],
    ['SDG goal 9', 33.5],
    ['SDG goal 10', 62.5],
    ['SDG goal 11', 73.6],
    ['SDG goal 12', 68.9],
    ['SDG goal 13', 78.8],
    ['SDG goal 14', 45.5],
    ['SDG goal 15', 59.9],
    ['SDG goal 16', 63.3],
    ['SDG goal 17', 65.0],
  ]
};


const getradarData = radarData => radarData.map((country, i) => ({
  name: country[0],
  y: country[1],
}));

let radarGlobalOptions = {
  chart: {
    polar: 'true',
    height: "120%",
  },
  title: {
    text: 'Inidvidual SDG Goals Score in 2021 - Global Average',
    align: 'left'
  },

  rangeSelector:{
    enabled:false
},

  plotOptions: {
    series: {
      pointStart: 1,
      pointInterval: 1
    },
    column: {
      pointPadding: 0,
      groupPadding: 0
    }
  },
  credits:
  false,
  
  legend: {
    enabled: false
  },
  tooltip: {
    shared: true,
    headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} </b><br/>'
  },
  xAxis: {
    tickInterval: 1,
    min: 1,
    max: 18,
    
    
  },
  pane: {
    startAngle: 0,
    endAngle: 360
  },
  yAxis: [{
    title: {
      text: 'SDG Score'
    },
    showFirstLabel: true
  }],
  series: [{
    color: 'rgb(158, 159, 163)',
    pointStart: 1,
    pointInterval: 1
  }, {
    name: '2021',
    id: 'main',
    dataSorting: {
      enabled: false,
      matchByName: true
    },
    dataLabels: [{
      enabled: false,
      inside: false,
      style: {
        fontSize: '16px'
      }
    }],
    data: getData(radarData[2021]).slice()
  }],
  exporting: {
    allowHTML: true
  }
};

const radarYears = [2021, 2020, 2019, 2018, 2017];

years.forEach(radarYears => {
  const btn = document.getElementById("radar"+radarYears);

  btn.addEventListener('click', () => {

    document.querySelectorAll('.radarbuttons button.active')
      .forEach(active => {
        active.className = '';
      });
    btn.className = 'active';

    radarGlobalChart.update({
      title: {
        text: `Individual SDG Goals Score in ${radarYears} - Global Average`
      },

      series: [{
        name: radarYears,
        data: getData(radarData[radarYears]).slice()
      }]
    }, true, false, {
      duration: 800
    });
  });
});
let subIndexGlobalChart = new Highcharts.Chart('subIndexGlobal', Highcharts.merge(subIndexOptions, lineTheme));

let radarGlobalChart = new Highcharts.Chart('radarGlobal', Highcharts.merge(radarGlobalOptions, lineTheme));