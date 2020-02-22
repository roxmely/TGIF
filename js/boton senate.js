$(window).scroll(function() {
  if ($(this).scrollTop() >= 50) {
    // If page is scrolled more than 50px
    $("#return-to-top").fadeIn(200); // Fade in the arrow
  } else {
    $("#return-to-top").fadeOut(200); // Else fade out the arrow
  }
});
$("#return-to-top").click(function() {
  // When arrow is clicked
  $("body,html").animate(
    {
      scrollTop: 0 // Scroll to top of body
    },
    500
  );
});

// var cbpAnimatedHeader = (function() {
//   var docElem = document.documentElement,
//     header = document.querySelector(".cbp-af-header"),
//     didScroll = false,
//     changeHeaderOn = 300;

//   function init() {
//     window.addEventListener(
//       "scroll",
//       function(event) {
//         if (!didScroll) {
//           didScroll = true;
//           setTimeout(scrollPage, 150);
//         }
//       },
//       false
//     );
//   }

//   function scrollPage() {
//     var sy = scrollY();
//     if (sy >= changeHeaderOn) {
//       classie.add(header, "cbp-af-header-shrink");
//     } else {
//       classie.remove(header, "cbp-af-header-shrink");
//     }
//     didScroll = false;
//   }

//   function scrollY() {
//     return window.pageYOffset || docElem.scrollTop;
//   }

//   init();
// })();
$(document).ready(function() {
  $("#toggle").click(function() {
    var elem = $("#toggle").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle").text("Read Less");
      $("#text").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle").text("Read More");
      $("#text").slideUp();
    }
  });
});
