document.getElementById("burger").addEventListener("click",()=>{document.getElementById("menu").classList.add("menu--open")}),document.getElementById("closeMenu").addEventListener("click",()=>{document.getElementById("menu").classList.remove("menu--open")}),document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(".tabs-column li");$(function(){$("#tabs-mobile").tabs({activate:function(e,t){$("#tabs-mobile .tabs-column-mobile li").removeClass("active"),t.newTab.addClass("active")}})}),$(function(){$("#tabs-desktop").tabs({activate:function(e,t){$("#tabs-desktop .tabs-column li").removeClass("active"),t.newTab.addClass("active")}})})});