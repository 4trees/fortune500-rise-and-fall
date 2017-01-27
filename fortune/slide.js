//scroll to top when reload page
window.onload = function(){setTimeout(function(){$(window).scrollTop(0)},10);}
// //init ScrollMagic controller and set scenes
// var controller = new ScrollMagic.Controller({
//     // container:'#word'
// });
// var slides=document.querySelectorAll('section.slide');
// var slide=[];
// for (var i=0;i<slides.length;i++){
//     slide[i]=new ScrollMagic.Scene({
//         triggerElement:slides[i],
//     })
//     // .setPin(slides[i])
//     .update(true)
//     .addTo(controller)
//     ;
// }

function debounce(func, wait = 50, immediate = true) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
};

