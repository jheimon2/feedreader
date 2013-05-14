$(function defaultMVCs(){
	var mvc = window.mvc;
	mvc.Skill = Backbone.Model.extend({
		
		defaults:{
		
		},
		url: function(){
			if(this.id)
				return 'api/skills/'+this.id;
			else
				return 'api/skills';
		}
	});
	
	
	
	mvc.SkillList = Backbone.Collection.extend({
		model:mvc.Skill,
		url:'api/skills'
	});
	
	mvc.SkillView = Backbone.View.extend({
		tagName:	"li",
		template: getTemplate("templates/skillview.html","templates/skillview.css"),
		initialize: function(){
			//this.model.bind('change',this.render,this);
		},
		render: function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			var tmp = this.$el.children(":first")
			//this.$el.html(tmp.html());
			//this.className = tmp.attr("class");
			this.setElement(tmp);
			
			
			createDropDownMenus(this.$el);
			
			this.$el.children(".wrapper").unwrap();
			
			return this;
		},
		events:{
			"click .skillname":function(){
				
				viewSkill(this.model.attributes);
			}
		}
		
	});
	
		
	mvc.SkillListView = Backbone.View.extend({
		tagName:"ul",
		className:"skillist",
		
		initialize:	function(){
			
			//_.bindAll(this);
			
			this.collection.bind('add', this.addOne, this);
			this.$el.html("");
			
			//ideaList.fetch();
		},
		render:function(){
			this.$el.html("");
			
			_(this.collection.models).each(function(item){
				
				
				this.$el.append(new mvc.IdeaView({model:item}).render().el);	
			})
			
			
			//this.$el.html(this.template(this.model.toJSON()));
			//this.$el.html(ideaList);
			
		},
		
		addOne:function(item){
			var view=new mvc.SkillView({model:item});
			
			this.$el.append(view.render().el);
			
		},
		change:function(){
			
			this.render();
		}
		
	});
	
});