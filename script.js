document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('menu').classList.add('menu--open');
  });
  
  document.getElementById('closeMenu').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('menu--open');
  });
  document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tabs-column li");
  
    $(function () {
      $("#tabs-mobile").tabs({
        activate: function (event, ui) {
        
          $("#tabs-mobile .tabs-column-mobile li").removeClass("active");
          ui.newTab.addClass("active");
        },
      });
    });
    
 
    $(function () {
      $("#tabs-desktop").tabs({
        activate: function (event, ui) {
         
          $("#tabs-desktop .tabs-column li").removeClass("active");
          
          ui.newTab.addClass("active");
        },
      });
    });
  });