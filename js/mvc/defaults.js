$(function defaultMVCs(){
	mvc.Idea = Backbone.Model.extend({
		change:function(){
			console.log("HOJO HOJO");
		},
		defaults:{
			title:"titlements",
			type:"limbo"
		}
	});
	
	
	
	mvc.IdeaList = Backbone.Collection.extend({
		model:mvc.Idea,
		url:'api/fields'
	});
	
	mvc.IdeaView = Backbone.View.extend({
		tagName:	"div",
		template: getTemplate("templates/ideaview.html","templates/ideaview.css"),
		initialize: function(){
			//this.model.bind('change',this.render,this);
		},
		render: function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			return this;
		}
		
	});
	
		
	mvc.AppView = Backbone.View.extend({
		el:	$("#desktop"),
		initialize:	function(){
			
			//_.bindAll(this);
			
			ideaList.bind('add', this.addOne, this);
			$el.html("<br/>");
			//ideaList.fetch();
		},
		render:function(){
			console.log(ideaList.models);
			_(ideaList.models).each(function(item){
				
				
				$("#desktop").append(new mvc.IdeaView({model:item}).render().el);	
			})
			
			//this.$el.html(this.template(this.model.toJSON()));
			//this.$el.html(ideaList);
			
		},
		addOne:function(item){
			
			this.$el.append("KULLI");
			this.$el.append(new mvc.IdeaView({model:item}).render().el);//this.template(item.toJSON()));	
		},
		change:function(){
			console.log("CHANGE");
			this.render();
		}
		
	});
	
});