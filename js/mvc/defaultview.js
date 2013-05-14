$(function defaultView(){
	var mvc = window.mvc;
	
	
	mvc.IdeaLarge = mvc.NewIdea.extend({
		url: function(){
			if(this.id){
				return "api/"+this.get("type")+"/"+this.id;
			}
			return "api/ideas/";
		}
	});
	
	mvc.IdeaViewLarge = Backbone.View.extend({                
		model:		mvc.IdeaLarge,
		tagName:	"div",
		template: 	getTemplate("templates/ideaviewlarge.html","templates/ideaviewlarge.css"),
		mainTemplate: 	getTemplate("templates/ideaviewlarge_main.html","templates/ideaviewlarge_main.css"),
		render:		function(){
			//this.$el.html(this.template(this.model.toJSON()));
			
			//console.log(this.model.toJSON());
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			//this.setElement(this.$el.children(":first"));
			var tmp = this.$el.children(":first")
			//console.log(tmp);
			this.setElement(tmp);
			$("body").bindkey("esc",function(){
				tmp.find(".closebutton").trigger("click");
			});
			
			tmp.find(".tabholder").createTabHolder();
			
			tmp.find(".tabholder").addTab("main",this.mainTemplate({model:this.model.toJSON()}));
			tmp.find(".tabholder").addTab("children","",undefined,this.viewChildren,this.model);
			
			tmp.find(".tabholder").addTab("miu","mau");
			tmp.find(".tabholder").addTab("kulli","pillu",undefined, function(evt){console.log(evt.data); evt.data.element.html("prööööö");});
			tmp.find(".tabholder").addTab("vähän pidempi taskin nimi","mut ei juuri tekstiä");
			tmp.find(".tabholder").addTab("lyhkäsempi taas","ei tässäkään");
			
			
			tmp.find(".tabholder").fillVertical(tmp.children(":first"));
			tmp.find(".tabcontainer").fillVertical();
			tmp.find(".fillvertical").fillVertical();
			tmp.find(".fillhorizontal").fillHorizontal();
			
			/*
			this.$el.draggable();
			this.$el.droppable();
			this.$el.resizable();
			*/
			createSelectors(this.$el);
			return this;
		},
		viewChildren:function(evt){
			console.log(evt.data.model);
			evt.data.element.append(window.mvc.listAll(evt.data.model.id,evt.data.model.attributes.type));
		},
		events:{
			
			"click .closebutton": 		function(){
				var self=this;
				this.$el.hide('fast',function(){
					self.remove();
				});
        //$("body").unbindkey("esc");
			}
		},
		
		
		
	});
	
	mvc.ProjectLarge = mvc.NewIdea.extend({
		url: function(){
			if(this.id){
				return "api/"+this.get("type")+"/"+this.id;
			}
			return "api/projects/";
		}
	});
	
	mvc.ProjectViewLarge = Backbone.View.extend({                
		model:		mvc.ProjectLarge,
		tagName:	"div",
		template: 	getTemplate("templates/ideaviewlarge.html","templates/ideaviewlarge.css"),
		mainTemplate: 	getTemplate("templates/ideaviewlarge_main.html","templates/ideaviewlarge_main.css"),
		render:		function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			
			var tmp = this.$el.children(":first")
			
			this.setElement(tmp);
			$("body").bindkey("esc",function(){
				tmp.find(".closebutton").trigger("click");
			});
			
			tmp.find(".tabholder").createTabHolder();
			
			tmp.find(".tabholder").addTab("main",this.mainTemplate({model:this.model.toJSON()}));
			tmp.find(".tabholder").addTab("ideas","",undefined,this.viewIdeas,this.model,this);
			tmp.find(".tabholder").addTab("tasks","",undefined,this.viewTasks,this.model,this);
			tmp.find(".tabholder").addTab("roles","",undefined,this.viewRoles,this.model,this);
			tmp.find(".tabholder").addTab("discussion","",undefined,this.viewDiscussion,this.model,this);
			
			
			tmp.find(".tabholder").fillVertical(tmp.children(":first"));
			tmp.find(".tabcontainer").fillVertical();
			tmp.find(".fillvertical").fillVertical();
			tmp.find(".fillhorizontal").fillHorizontal();
			
			
			
			createSelectors(this.$el);
			return this;
		},
		
		viewChildren:function(evt){
			console.log(evt.data.model);
			evt.data.element.append(window.mvc.listAll(evt.data.model.id,evt.data.model.attributes.type));
		},
		viewIdeas:function(evt){
			console.log(evt);
			evt.data.element.html("");
			var header = $("<div/>");
			var self=evt.data;
			var evtvittu=evt;
			$("<div/>",{
				class:"button",
				style:"display:inline-block;",
				html:'<img src="img/idea.png"/> add idea'
				
			}).on("click",{vittu:evtvittu.data},function addTask(evt){
				newIdea({parentTitle:self.model.get("title"),parentId:self.model.get("id"),parentType:self.model.get("type"), defaultType:"idea", parentUpdate:{payload:evt.data.vittu,callback:self.obj.viewIdeas}});
			}).appendTo(header);
			evt.data.element.append(header);
			evt.data.element.append(window.mvc.listAllTree(evt.data.model.id,evt.data.model.attributes.type));
		},
		viewTasks:function(evt){
			evt.data.element.html("");
			var header = $("<div/>");
			var self=evt.data;
			var evtvittu=evt;
			$("<div/>",{
				class:"button",
				style:"display:inline-block;",
				html:'<img src="img/task.png"/> add task'
				
			}).on("click",{vittu:evtvittu.data},function addTask(evt){
				newIdea({parentTitle:self.model.get("title"),parentId:self.model.get("id"),parentType:self.model.get("type"), defaultType:"task", parentUpdate:{payload:evt.data.vittu,callback:self.obj.viewTasks}});
			}).appendTo(header);
			evt.data.element.append(header);
			evt.data.element.append(window.mvc.listAllTree(evt.data.model.id,evt.data.model.attributes.type));
			
		},
		viewDiscussion:function(evt){
			
			evt.data.element.append(window.mvc.listAll(evt.data.model.id,evt.data.model.attributes.type));
		},
		viewRoles:function(evt){
			
			evt.data.element.append(window.mvc.listAll(evt.data.model.id,evt.data.model.attributes.type));
		},
		events:{
			
			"click .closebutton": 		function(){
				var self=this;
				this.$el.hide('fast',function(){
					self.remove();
				});
        //$("body").unbindkey("esc");
			}
		}
		
		
		
	});
	
	
});