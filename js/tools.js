include("css/tools.css");
function createSelectors(el){
	
	_(el.find("ul.selector")).each(createSelection);
}
function createSelection(sel){
  if(!sel.jQuery)
	sel = $(sel);
  
  sel.keypress(function(evt){
	var ind = sel.children(".selectedoption").index();
	
	var k = evt.keyCode||evt.which;
	var unknown=false;
	
	switch(k){
		case 38://up
			ind = Math.max(ind-1,1);
			sel.children(".selectedoption").removeClass("selectedoption");
			sel.children(":nth-child("+(ind+1)+")").addClass("selectedoption");
		break;
		case 40://down
			ind = Math.min(ind+1,sel.children().length-1);
			sel.children(".selectedoption").removeClass("selectedoption");
			sel.children(":nth-child("+(ind+1)+")").addClass("selectedoption");
		break;
		case 13://enter
			sel.children(".selectedoption").trigger("click");
			if(sel.hasClass("collapsed"))
				sel.closest(".selectorparent").focus();
		break;
		case 27://esc
			
			sel.addClass("collapsed");
			sel.closest(".selectorparent").focus();
		break;
		
		default:
			if(k>=97&&k<=122)
				k-=32;
			if(k>=65&&k<=90){
				var s = String.fromCharCode(k).toLowerCase();
				var ind = sel.children(".selectedoption").index();
				var len = sel.children().length;
				for(var i=(ind+1)%len;i!=ind;i=(i+1)%len){
					if(i==0)
						continue;
					if(sel.children(":nth-child("+(i+1)+")").is('[name^="'+s+'"]')){
						sel.children(".selectedoption").removeClass("selectedoption");
						sel.children(":nth-child("+(i+1)+")").addClass("selectedoption");
						break;
					}
				}
				
			}
			else{
				unknown=true;
			}
		
			
	}
	
	if(sel.hasClass("collapsed")){
		
		sel.children().hide();
		sel.children(".selectedoption").show();
		
	}
	if(!unknown){
		
		var so = sel.children(".selectedoption");
		
		so.closest('.selectorparent').attr(so.parent().attr('id'),so.attr('name'));
		
		so.siblings('input').attr('data',so.attr("name"));
		
		evt.preventDefault();
	}
	else{
		
	}
  });
  
    
  sel.children().each(function(){
    $(this).attr('name',$(this).html());
  });
  sel.children().hide();
  sel.children("li").first().addClass("selectedoption");
  sel.addClass("collapsed");
  sel.children(".selectedoption").show();
  sel.children("li").on("click", function(){
    if($(this).hasClass("selectedoption")){
      if(sel.hasClass("collapsed")){
       
       sel.children('li').show();
       sel.removeClass("collapsed");
       /*$(".selector").one("mouseout",function(){
        console.log(this);
        sel.children().not(".selectedoption").hide();
        sel.addClass("collapsed"); 
       });*/
      } else{
		
		//sel.children('input').val(sel.attr("value"));
		sel.children('input').attr('value',sel.attr("value"));
        sel.children().not(".selectedoption").hide();
        sel.addClass("collapsed");
      }
	  
	  
    }
    else{
	  
      sel.children(".selectedoption").removeClass("selectedoption");
      $(this).addClass("selectedoption");
	  
	  $(this).closest('.selectorparent').attr($(this).parent().attr('id'),"");
	  $(this).closest('.selectorparent').attr($(this).parent().attr('id'),$(this).attr('name'));
      sel.children().not(".selectedoption").hide();
      sel.addClass("collapsed");
	  //sel.children('input').addClass("VITTUSAATANA");
	  sel.children('input').attr('data',sel.children(".selectedoption").attr("name"));
	  
	  
	  
	  
	  if($(this).attr("callback")){
		
		eval($(this).attr("callback"));
		
	  }
	  
	  
    } 
  });
  
  sel.wrap('<div class="wrapper"/>');
}

function getSelection(q){
	return $(q).children('input:first').attr("data"); 
}

function collapseSelections(){
   $(".selector").children().hide();
   $(".selector").children(".selectedoption").show();
}




function createFilters(el){
	_(el.find("ul.filter")).each(createFilter);
}
function createFilter(sel){
  if(!sel.jQuery)
	sel = $(sel);
  
  var firstIsAll = sel.children("li").first().attr("name")=="all";
  sel.children("li").first().addClass("selectedoption");
  
  
  
  
  
  
  if(firstIsAll){
	var others =sel.children("li:first-child"); 
	sel.children("li:not(:first-child)").on("click", function(){
		others.removeClass("selectedoption");
		
	});
	
	
	/*
	sel.children("li:first-child").on("click", function(){
		if($(this).hasClass("selectedoption")){
			console.log("hep");
			others.each(function(el){
				$(el).addClass("selectedoption");
			});
		}
		else{
			console.log("hep");
			others.each(function(el){
				$(el).removeClass("selectedoption");
			});
		}	
		
		
	});
	*/
  }
  sel.children("li").on("click", function(){
	$(this).toggleClass("selectedoption");
	
	if($(this).hasClass("selectedoption")){	  
	  if($(this).attr("callback")){
		
		eval($(this).attr("callback"));
		
	  }
	  
    }
	filterUpdated(sel,$(this).closest(".filterparent"));
  });
  
  
  
  sel.wrap('<div class="wrapper"/>');
}

function findSelected(sel,attr){
	if(!attr)
		attr="name";
	var ret=[];
	sel.find(".selectedoption").each(function(ind,e){

		ret.push($(e).attr(attr));
	});
	return ret;
}

function filterUpdated(sel,el){
	
	var attr = el.attr("filtervalue");
	
	if(!attr)
		return;
	var selected = findSelected(sel);
	
	sel.find('[name="all"]').addClass("debughilight");	
	var allSelected  = selected.indexOf("all")>=0;
	
	el.find("["+attr+"]").each(function(ind,e){
		e=$(e);
		
		if(allSelected || selected.indexOf(e.attr(attr))>=0){
			e.show();
		}
		else{
			e.hide();
		}
	});
	
}



function createDropDownMenus(el){
	_(el.find("ul.dropdownmenu")).each(createDropDownMenu);
}
function createDropDownMenu(sel){
  if(!sel.jQuery)
	sel = $(sel);
  //console.log(sel);
  
  sel.children("li").first().addClass("selectedoption");
  
  sel.children("li").on("click", function(){
	$(this).toggleClass("selectedoption");
	
	if($(this).hasClass("selectedoption")){	
	  
	  if($(this).attr("callback")){
		
		eval($(this).attr("callback"));
		
	  }
	  if($(this).attr("trigger")){
		
		$(this).trigger(($(this).attr("trigger")));
		
	  }
	  
	  
    }
	else{
		
	}
	
  });
  
  //sel.wrap('<div class="wrapper"/>');
}




function loadFile(url)
{

var req = false;
// branch for native XMLHttpRequest object
if (window.XMLHttpRequest && !(window.ActiveXObject))
{
try { req = new XMLHttpRequest() }
catch(e) { req = false }
}
else // branch for IE/Windows ActiveX version
{
if (window.ActiveXObject)
{
try { req = new ActiveXObject("Msxml2.XMLHTTP") }
catch(e) { try { req = new ActiveXObject("Microsoft.XMLHTTP") }
catch(e) { req = false }
}
}
}

if(req)
{
req.open("GET", url, false);
req.send("");
return req.responseText
}
return ''
}