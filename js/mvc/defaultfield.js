(function defaultField(){
	
	var mvc = window.mvc;
	
	
	mvc.Field = Backbone.Model.extend({
		
		url: function(){ return this.id?"api/fields/"+this.id:"api/fields/";}
		
	});
	
	mvc.FieldView = Backbone.View.extend({
		model:		mvc.Field,
		tagName:	"div",
		template: 	getTemplate("templates/field.html","templates/field.css"),
		render:		function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			
			this.viewParents();
			this.viewSubfields();
			
			this.viewItems();
			
			
			
			return this;
		},
		events:{
			"click	.subfieldsheader .addbutton":function(){
				var self=this;
				$("#desktop").createPopup("","new field",function(btn,fields){
					if(btn!="ok" || !fields || !fields.title)
						return;
					var newf = new mvc.Field(fields);
					newf.set("newrelation", "fields:"+self.model.id+ " parentto $this");
					newf.save();
				},null, null, null, [
					{name:"title"},
					{name:"description"}			
				]);
			}
		},
		viewItems:function(){
			var ideaList = new window.mvc.IdeaList();
			ideaList.id= this.model.id;
			var app = new window.mvc.AppView({collection:ideaList});
			window.mvc.apps.listViewApp = app;
			var items = this.$el.find(".fielditems");
			ideaList.fetch({add:true, data:{
				//types:"highdea"
			}, success:function(){
				app.$el.appendTo(items);
				app.showFilter();
			},error:function(data,response){
			
				showError("vituiksman",response.responseText);
			}
	
			});
		},
		viewParents:function(){
			var dd = this.$el.find(".fieldparents");
			dd.html("");
			var d = $("<a/>", {
				class:"fieldlink",
				href:"#/main",
				html: "&#248;" 
			});
			dd.append(d);
			dd.append(" >")
			if(this.model.get("parents"))
			_(this.model.get("parents").reverse()).each(function(val,key){
			
				var d = $("<a/>", {
					class:"fieldlink",
					href:"#/fields/"+val[0],
					html:" "+val[1]+" "
				});
				dd.append(d);
				dd.append(" >")
			});
			var d = $("<a/>", {
				class:"fieldlink",
				href:"#/fields/"+this.model.get("id"),
				html:" "+this.model.get("title")+" "
			});
			dd.append(d);
			
			
			
		},
		
		viewSubfields:function(){
			var dd = this.$el.find(".subfieldlist");
			
			dd.html("");
			
			_(this.model.get("subfields")).each(function(val,key){

				var d = $("<a/>", {
					class:"fieldlink",
					href:"#/fields/"+val[0],
					html:val[1]+" "
				});
				dd.append(d);
				
			});
		}
		
		
	});
})();