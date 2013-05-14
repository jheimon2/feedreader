$(function defaultRouter(){
	if(!window.mvc)
		window.mvc={};
	var mvc = window.mvc;
	mvc.Router = Backbone.Router.extend({
		routes:{
			"test/*pilu":	"test",
			"fields/:id":	"showField",
			"debates/:id":		"showDebate",
			":col/:id":		"viewIdea",
			"skills":		"viewSkills",
			"main":			"viewMain",
			"newidea":		"newidea"
			
			
		},
		test:function(args){
			alert(args);
			
		},
		viewIdea:function(col,id){
			console.log(col+" "+id);
			var data = {col:col,id:id,type:col};
			console.log(data);
			viewIdea(data);
		},
		showField:function(id){

			viewField(id);	
		},
		showDebate:function(id){
			console.log("jejee");
			viewDebate(id);	
		},

		
		viewSkills:showSkills,
		viewMain:showMain,
		newidea:toggleNewIdea
		
	});
	var router = new mvc.Router;
	Backbone.history.start();
});