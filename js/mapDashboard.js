(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const csv = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-history.csv'
    ).then(response => response.text());
    // get Charts CSVs Data
    const gaugeCSV = await fetch('./data/gaugeChart.csv').then(response => response.text());
    const columnCSV = await fetch('./data/columnChart.csv').then(response => response.text());
    const radarCSV = await fetch('./data/radar.csv').then(response => response.text());
    const lineCSV = await fetch('./data/lineChart.csv').then(response => response.text());

    // Very simple and case-specific CSV string splitting
    const CSVtoArray = text => text.replace(/^"/, '')
        .replace(/",$/, '')
        .split('","');

    const csvArr = csv.split(/\n/),
        countries = {},
        numRegex = /^[0-9\.]+$/,
        lastCommaRegex = /,\s$/,
        quoteRegex = /\"/g,
        categories = CSVtoArray(csvArr[2]).slice(4);

    const gaugeCSVArray = gaugeCSV.split(/\n/);
    const columnCSVArray = columnCSV.split(/\n/);
    const radarCSVArray = radarCSV.split(/\n/);
    const lineCSVArray = lineCSV.split(/\n/);

    const lineChartCategories = lineCSVArray[1].split(',').slice(1).map(el => el.replaceAll('"', ''))
    console.log(lineChartCategories)
    let countryChart;


    // Parse the CSV into arrays, one array each country
    csvArr.slice(3).forEach(function (line) {
        var row = CSVtoArray(line),
            data = row.slice(4);

        data.forEach(function (val, i) {
            val = val.replace(quoteRegex, '');
            if (numRegex.test(val)) {
                val = parseInt(val, 10);
            } else if (!val || lastCommaRegex.test(val)) {
                val = null;
            }
            data[i] = val;
        });

        countries[row[1]] = {
            name: row[0],
            code3: row[1],
            data: data
        };
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
            if (points.length === 1) {
                document.querySelector('#info #flag')
                    .className = 'flag ' + points[0].flag;
                document.querySelector('#info h2').innerHTML = points[0].name;
            } else {
                document.querySelector('#info #flag')
                    .className = 'flag';
                document.querySelector('#info h2').innerHTML = 'Comparing countries';

            }
            document.querySelector('#info .subheader')
            console.log(points);

            let gaugeChartToPresentData;
            let columnChartToPresentData;
            let radarChartToPresentData;
            let lineChartToPresentData;

            // Get Country Gauge chart Data;
            for (let item of gaugeCSVArray.slice(1)) {
                if (item.split(',')[2].trim().toUpperCase() === points[0]['iso-a3']) {
                    gaugeChartToPresentData = parseFloat(item.split(',')[1].trim());
                    break;
                }
            }
            // Get Country Column Chart data;
            for (let item of columnCSVArray.slice(1)) {
                if (item.split(',')[1].trim().toUpperCase() === points[0]['iso-a3']) {
                    columnChartToPresentData = item.split(',').slice(2).map((el) => parseFloat(el))
                    break;
                }
            }
            // Get Country Radar Chart Data;
            for (let item of radarCSVArray.slice(1)) {
                if (item.split(',')[0].trim().toUpperCase() === points[0]['iso-a3']) {
                    radarChartToPresentData = item.split(',').slice(2).map((el) => parseFloat(el));
                    break;
                }
            }

            // Get Country Line Chart Dta;
            for (let item of lineCSVArray.slice(2)) {
                if (item.split(',"')[0].trim().toUpperCase() === points[0]['iso-a3']) {
                    lineChartToPresentData = item.split(',"').slice(1).map(el => parseFloat(el.replace('"', '')))
                    console.log(lineChartToPresentData)
                }
            }

            if (true) {
                Highcharts.chart('gauge-chart', {
                    chart: {
                        type: 'solidgauge',
                        height: 350
                    },

                    title: {
                        text: "GSCI Score",
                    },

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
                        max: 100,
                        
                    },

                    credits: {
                        enabled: false
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
                        data: [gaugeChartToPresentData],
                        dataLabels: {
                            enabled: true,
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
                        max: 100,
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
                            borderWidth: 0,
                            colorByPoint: true
                        }
                    },
                    colors: [
                        '#f2ae1c',
                        '#f8f7f4',
                        '#8c3839',
                        '#050a30',
                        '#dc661f'
                    ],
                    series: [{
                        showInLegend: false,     
                        name: points[0]['name'],
                        data: columnChartToPresentData,
                        borderWidth: 1,
                        borderColor: 'black'

                    },
                    ],
                    credits: {
                        enabled: false
                    },
                });

                Highcharts.chart('radar-chart', {

                    chart: {
                        polar: true,
                        height: 300
                    },

                    credits: {
                        enabled: false
                    },

                    title: {
                        text: 'SDG Goal Score'
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
                            format: 'SDG {value}'
                        }
                    },

                    yAxis: {
                        min: 0,
                        max: 100
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

                    series: [{
                        type: 'area',
                        name: 'SDG Goals Score',
                        data: radarChartToPresentData
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
                        categories: lineChartCategories
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
                        data: lineChartToPresentData
                    },],

                    credits: {
                        enabled: false
                    },

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
            }


        } else {
            document.querySelector('#info #flag').className = '';
            document.querySelector('#info h2').innerHTML = '';
            document.querySelector('#info .subheader').innerHTML = '';
        }
    });

    // Initiate the map chart
    const mapChart = Highcharts.mapChart('dashboardContainer', {

        chart: {
            map: topology,
            height: 700
        },

        title: {
            text: 'Sustainable Development Dashboard',
            subtitle: "With population as a geographic characteristic"
        },

        subtitle: {
            text: '</a>'
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

        credits: {
            enabled: false
        },

        series: [{
            data: data,
            mapData: mapData,
            joinBy: ['iso-a3', 'code3'],
            name: '',
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