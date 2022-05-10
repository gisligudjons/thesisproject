var wrapper = document.querySelector('.wrapper svg')
var firstMaldivesWrapper = document.querySelector('.firstMaldivesWrapper svg')
var tuvaluWrapper = document.querySelector('.tuvaluWrapper svg')
var firstTuvaluWrapper = document.querySelector('.firstTuvaluWrapper svg')
var icelandWrapper = document.querySelector('.icelandWrapper svg')
var firstIcelandWrapper = document.querySelector('.firstIcelandWrapper svg')


d3.select("#step-zero").on('stepin', function(e) {
  console.log("Got to step 0")
  function draw() {
    firstMaldivesWrapper.classList.add('active')
  }
  setTimeout(draw, 100)

})

d3.select("#step-one").on('stepin', function(e) {
  console.log("Got to step 1")
  function erase() {
    firstMaldivesWrapper.classList.remove('active')
  }
  setTimeout(erase, 50)

  console.log("Got to step 2")
  function draw() {
    wrapper.classList.add('active')
  }
  setTimeout(draw, 700)

})

d3.select("#step-two").on('stepin', function(e) {

  function erase() {
    wrapper.classList.remove('active')
  }
  setTimeout(erase, 50)


  console.log("Got to step 2")
  function draw() {
    firstTuvaluWrapper.classList.add('active')
  }
  setTimeout(draw, 800)

})


d3.select("#step-three").on('stepin', function(e) {
  console.log("Got to step 3")
  function erase() {
    firstTuvaluWrapper.classList.remove('active')
  }
  setTimeout(erase, 10)

  function draw() {
    tuvaluWrapper.classList.add('active')
  }
  setTimeout(draw, 700)

})

d3.select("#step-four").on('stepin', function(e) {
  console.log("Got to step 4")
  function erase() {
    tuvaluWrapper.classList.remove('active')
  }
  setTimeout(erase, 10)

  function draw() {
    firstIcelandWrapper.classList.add('active')
  }
  setTimeout(draw, 700)

})

d3.select("#step-five").on('stepin', function(e) {
  console.log("Got to step 3")
  function erase() {
    firstIcelandWrapper.classList.remove('active')
  }
  setTimeout(erase, 100)

  function draw() {
    icelandWrapper.classList.add('active')
  }
  setTimeout(draw, 800)

})

d3.select("#step-six").on('stepin', function(e) {
  console.log("Got to step 3")
  function erase() {
    icelandWrapper.classList.remove('active')
  }
  setTimeout(erase, 100)
})







// d3.select("#step-two").on('stepin', function(e) {
//   console.log("Got to step 2")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset1.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";
// })

// d3.select("#step-three").on('stepin', function(e) {
//   console.log("Got to step 3")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset1.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-four").on('stepin', function(e) {
//   console.log("Got to step 4")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset2.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";})
// d3.select("#step-five").on('stepin', function(e) {
//   console.log("Got to step 5")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset2.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-six").on('stepin', function(e) {
//   console.log("Got to step 6")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset3.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";
  
//   var wrapper = document.querySelector('#step-six')
//   function draw() {
//       wrapper.classList.add('active')
//     }

//     setTimeout(draw, 0)
// })

// d3.select("#step-seven").on('stepin', function(e) {
//   console.log("Got to step 7")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset3.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-eight").on('stepin', function(e) {
//   console.log("Got to step 8")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset4.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";})
// d3.select("#step-nine").on('stepin', function(e) {
//   console.log("Got to step 9")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset4.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-ten").on('stepin', function(e) {
//   console.log("Got to step 10")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset5.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";})


// d3.select("#step-eleven").on('stepin', function(e) {
//   console.log("Got to step 11")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset5.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-twelve").on('stepin', function(e) {
//   console.log("Got to step 12")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset6.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="1";})
// d3.select("#step-thirteen").on('stepin', function(e) {
//   console.log("Got to step 13")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset6.svg";
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").style.opacity="0";
// })
// d3.select("#step-fourteen").on('stepin', function(e) {
//   console.log("Got to step 14")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset7.svg";
// })

// d3.select("#step-fifteen").on('stepin', function(e) {
//   console.log("Got to step 15")
//   document.getElementById("g-line-art-illustration_svg-Artboard_1-img").src="svg/Asset8.svg";
// })

