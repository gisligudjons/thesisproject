
var body = d3.select("body")
var main = body.select("#main");
var scrolly = main.select("#explainerScrolly");
var figure = scrolly.select("figure");
var scrollText = scrolly.select("scroll__Text");
var step = article.selectAll(".explainerStep");

// initialize the scrollama
var explainScroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() {
	// 1. update height of step elements for breathing room between steps
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.75);
			step.style("height", stepH + "px");

			var figureHeight = window.innerHeight / 2;
			var figureMarginTop = (window.innerHeight - figureHeight) / 2;

			figure
				.style("height", figureHeight + "px")
				.style("top", figureMarginTop + "px");

			// 3. tell scrollama to update new element dimensions
			explainScroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    step.classed("is-active", function (d, i) {
        return i === response.index;
    });

    // update graphic based on step
    figure.select("p").text(response.index + 1);
	
}

function setupStickyfill() {
    d3.selectAll(".sticky").each(function () {
        Stickyfill.add(this);
    });
}

function handleContainerEnter(response) {
	// response = { direction }

	// sticky the graphic
	$graphic.classed('is-fixed', true);
	$graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
	// response = { direction }

	// un-sticky the graphic, and pin to top/bottom of container
	$graphic.classed('is-fixed', false);
	$graphic.classed('is-bottom', response.direction === 'down');
}

// kick-off code to run once on load

    function init() {
        setupStickyfill();

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                step: "#scrolly article .step",
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter);
    }

    // kick things off
    init();


// start it up
init();