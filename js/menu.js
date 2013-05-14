include("css/menu.css");
function createMenu(){
  $(".menuitem").on("click",
    function(event){
      expand($(this));
    }
  );
}
function expand(mi){
  $(".selectedmi").removeClass("selectedmi");
  mi.addClass("selectedmi");
  var tmp =mi.children(".hidemenu");
  $(".menu").addClass("hidemenu");
  tmp.removeClass("hidemenu");
}