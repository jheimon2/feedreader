include("css/idea.css");

var curField="$private";

var ideas={};


if(!(window.mvc))
	window.mvc={};

include(["js/mvc/defaultnewidea.js","js/mvc/clipboard.js"],function(){
	$(function(){
		
		if(!window.clipboard)
			window.clipboard = new window.mvc.ClipBoardAppView();
		
		ideas.newIdeaModel = new window.mvc.NewIdea;
		
		ideas.newIdeaView = new window.mvc.NewIdeaView({model:ideas.newIdeaModel});
		$("#main > .wrapper").append(ideas.newIdeaView.render().$el);
		include("js/mvc/defaultview.js",function(){include("js/mvc/router.js");});
		
		
		$(document).bindkey('return',newIdea);
		
	});	

});




function toggleNewIdea(){
	if($(".ideainput").is(":visible"))
		closeNewIdea();
	else
		newIdea();
}

function closeNewIdea(){
	$(".ideainput").unbindkey();
	$(document).bindkey('return',newIdea);
	//$(document).jkey('return',newIdea);
	$(".ideainput").hide('fast');
	
}


function newIdea(parentInfo){
    
    $(document).unbindkey('return');
	$(".ideainput").bindkey('esc',closeNewIdea);
	$(".ideainput #titlefield").bindkey('esc',closeNewIdea,{escapeInput:false});
	
	$(".ideainput #titlefield").bindkey('return',function(){
		
		$(".ideainput #titlefield").blur();
		$(".ideainput").focus();
		
	},{escapeInput:false});
	
	
	$(".ideainput").bindkey('s',function(evt){
		
		$(".ideainput #sendbutton").trigger("click");
	});
	$(".ideainput").bindkey('e',function(evt){
		
		$(".ideainput .collapsebutton").trigger("click");
	});
	$(".ideainput").bindkey('t',function(evt){
		
		$(".ideainput #typeselector").focus();
		$(".ideainput #typeselector .selectedoption").trigger("click");
	});
	$(".ideainput").bindkey('p',function(evt){
		
		$(".ideainput #protectionselector").focus();
		$(".ideainput #protectionselector .selectedoption").trigger("click");
	});
	
	$(".ideainput").bindkey('return',function(evt){
		
		$(".ideainput #titlefield").focus();
	});
	
	$('.ideainput input[name="parenttitle"]').val("fields:"+curField);
	$('.ideainput input[name="parentid"]').val(curField);
	$('.ideainput input[name="parenttype"]').val("field");
	
	if(parentInfo){
		if(parentInfo.defaultType){
			$(".ideainput #typeselector .selectedoption").removeClass("selectedoption").hide();
			
			$('.ideainput #typeselector li[name="'+parentInfo.defaultType+'"]').addClass("selectedoption").show();
			$(".ideainput").attr("typeselector",parentInfo.defaultType);
			$(".ideainput #typeselector input:first").attr("data",parentInfo.defaultType);
			if(parentInfo.parentTitle)
				$('.ideainput input[name="parenttitle"]').val(parentInfo.parentTitle);
			if(parentInfo.parentId)	
				$('.ideainput input[name="parentid"]').val(parentInfo.parentId);
			if(parentInfo.parentType)		
				$('.ideainput input[name="parenttype"]').val(parentInfo.parentType);
			if(parentInfo.parentUpdate){
				console.log(parentInfo.parentUpdate);
				$(".ideainput").one("sendsuccess",parentInfo.parentUpdate.payload,parentInfo.parentUpdate.callback);
				
			}
		}
	}
	
	
	
    $(".ideainput").show();//show('fast');
	
    $(".ideainput #titlefield").focus();
	//console.log($("<div/>").text($("body").html()).html());
	
  
}



function expandNewIdea(){
  $(".ideainput").toggleClass("expanded");
  if($(".ideaextras").is(":visible")){
    collapseNewIdea();
    
    return;
  }
  var newH = $("#main").height();
  
  $(".ideainput").animate({
    height:newH
    
  },420);  
  $(".ideaextras").fadeIn('slow');
}
function collapseNewIdea(){
  $(".ideaextras").fadeOut('fast');
  
  $(".ideainput").animate({
   height:'30px'
   
  },420);  
  
}


function viewIdea(data){
	if(data.col == "fields"){
		viewField(data.id);
		return;
	}
	else if(data.type == "debate"){
		viewDebate(data.id);
		return;
	}
	
	var model = new window.mvc.IdeaLarge(data);
	
	
	model.fetch({success:function(){
			
			if(model.get("type")=="project"){
				var ideaLarge = new window.mvc.ProjectViewLarge({model:model});
				$("#desktop").append(ideaLarge.render().$el);
			}
			else{
				var ideaLarge = new window.mvc.IdeaViewLarge({model:model});
				$("#desktop").append(ideaLarge.render().$el);
			}
			
		},
		error:function(data,response){
			
			$('body').createError('vituiksman:<pre>'+response.responseText+'</pre>');
		}
	});
	
	
}


function showError(msg,data){
	if(data)
		$('body').createError(msg+'<pre>'+data+'</pre>');
	else
		$('body').createError(msg);
}


function addRelation(a,b,op,strength){
	//console.log(a);
	//console.log(b);
	$.get("api/addrelation/",{
		
		a:a.id,
		b:b.id,
		typea:a.get("type"),
		typeb:b.get("type"),
		op:op,
		strength:strength
		
		},function(data){
			console.log(data);
		}
	);
}
function removeRelation(a,b,op,strength){
	
	$.get("api/removerelation/",{
		
		a:a.id,
		b:b.id,
		typea:a.get("type"),
		typeb:b.get("type"),
		op:op,
		strength:strength
		
		},function(data){
			console.log(data);
		}
	);
}

















function viewList(){
	//ideoiden lataus serverilt�+n�ytt�
	
	include("js/mvc/mvcdefaults.js",function(){
		
		$(viewList2);
	});
	
	
	
}
function viewList2(){
	
	var ideaList = new window.mvc.IdeaList();
	ideaList.id= curField;
	var app = new window.mvc.AppView({collection:ideaList});
	window.mvc.apps.listViewApp = app;
	
	ideaList.fetch({add:true, data:{
		//types:"highdea"
	}, success:function(){
		app.$el.appendTo("#desktop");
		app.showFilter();
	},error:function(data,response){
			
			showError("vituiksman",response.responseText);
	}
	
	});
	
	
	
}


function viewField(id){
	if(id)
		curField=id;
	include(["js/mvc/defaultfield.js","js/mvc/mvcdefaults.js" ],function(){;
		//includeSync("js/test.js");
	
	
		var field = new window.mvc.Field({id:id});
		
		field.fetch().success(function(){
		
			var fieldView = new window.mvc.FieldView({model:field});
			$("#desktop").html("");
			$("#desktop").append(fieldView.render().$el);
		}).error(function(data,response){
			
			showError("vituiksman",response.responseText);
		});
	});
	
	
	
}
function viewDebate(id){
	if(id)
		curField="debates:"+id;
	include(["js/mvc/defaultdebate.js","js/mvc/mvcdefaults.js" ],function(){;
		//includeSync("js/test.js");
	
	
		var debate = new window.mvc.Debate({id:id});
		
		debate.fetch().success(function(){
		
			var debateView = new window.mvc.DebateView({model:debate});
			$("#desktop").html("");
			$("#desktop").append(debateView.render().$el);
		}).error(function(data,response){
			
			showError("vituiksman",response.responseText);
		});
	});
	
	
	
}



function testStuff(){
	viewList();
	
	var cb  = window.clipboard;
	
}

function testOtherStuff(){
	/*
	var model = {};
	model.title="pilu";
	model.description="yll�ni on kullipuku ja kullipuku on musta";
	var d = $("<div/>");
	console.log("plaa");
	//d.html(getTemplate("templates/test.html")({model:model}));
	d[0].innerHTML=(getTemplate("templates/test.html")({model:model}));
	console.log("ploo");
	d.appendTo("#desktop");*/
	viewField(curField);
	
}


