include("js/mvc/skills.js");

function showSkills(field){
	var skillList = new window.mvc.SkillList();
	var app = new window.mvc.SkillListView({collection:skillList});
	
	skillList.fetch({add:true, data:{
		
	}, success:function(){
		$("#desktop").append(app.$el);
	},error:function(data,response){
			
			showError("vituiksman",response.responseText);
	}
	
	});
}