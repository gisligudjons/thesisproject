$(document).ready(function() { 
  
    /* get the real length of the path and set it for dasharray and dashoffset */
    // console.log(document.querySelector('path').getTotalLength())
  
    var $dashOffset = $("path").css("stroke-dashoffset");
  
    $(window).scroll(function() { 
      var $percentageComplete = (($(window).scrollTop() / ($("html").height() - $(window).height())) * 100);
      var $newUnit = parseInt($dashOffset, 10);
      var $offsetUnit = $percentageComplete * ($newUnit / 100);
      $("path").css("stroke-dashoffset", $newUnit - $offsetUnit);
      $("polygon").css("stroke-dashoffset", $newUnit - $offsetUnit);
    });
  });