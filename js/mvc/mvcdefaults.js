$(function defaultMVCs(){
	var mvc = window.mvc;
	mvc.Idea = Backbone.Model.extend({
		change:function(){
			
		},
		defaults:{
			title:"untitled",
			type:"limbo"
		},
		url: function(){
			if(this.id)
				return 'api/'+(this.attributes.type?this.attributes.type:"ideas")+"/"+this.id;
			else
				return 'api/ideas';
		}
	});
	
	
	
	mvc.IdeaList = Backbone.Collection.extend({
		model:mvc.Idea,
		setGatherInfo:function(id,gatherType){
			this.id=id;
			this.gatherType=gatherType;
			//console.log("huoraaaa");
			//console.log(this.gatherType+" "+gatherType+" "+id+"... mitävittuuuuu");
		},
		url:function(gatherType){
			if(this.id)
				return 'api/'+ (this.gatherType?this.gatherType:'fields')+'?gatherid='+this.id;
			else
				return	'api/'+(this.gatherType?this.gatherType:'fields');
		}
	});
	
	mvc.IdeaView = Backbone.View.extend({
		tagName:	"div",
		template: getTemplate("templates/ideaview.html","templates/ideaview.css"),
		initialize: function(){
			//this.model.bind('change',this.render,this);
		},
		render: function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			var tmp = this.$el.children(":first")
			
			this.setElement(tmp);
			
			this.getStatusIcons(this.model.attributes,this.$el.find(".statusicon ul"));
			createDropDownMenus(this.$el);
			
			this.$el.children(".wrapper").unwrap();
			
			return this;
		},
		updateStatus:function(){
			this.model.set("status",this.$el.find(".statusicon").attr("name"));
			console.log(this.model.get("status"));
			this.model.save();
		},
		
		getStatusIcons:function(model, ul){
			var icons=[];
			switch(model.type){
				case "highdea":
					for(var i=0;i<11;i++)
						icons.push("highness_"+i);
				break;
				case "task":
					icons.push("todo");
					icons.push("on_it");
					icons.push("done");
					icons.push("blocked");
					icons.push("abandoned");
				break;
				default:
				icons.push("undefined");
				icons.push("test");
				icons.push("pilu");
			}
			
			_(icons).each(function(val){
				ul.append($("<li/>",{
					name:val,
					html:val
				}));
			});
			
		},
		events:{
			"click .ideaname":function(evt){
				
				viewIdea(this.model.attributes);
				evt.stopPropagation();
			},
			"click .icon":function(evt){
				
				var e = $(evt.target);
				if(!(e.hasClass("icon") || e.is(".icon > *")))
					return;
				
				e.find(".dropdownmenu").toggle('fast');
				e.closest(".icon").toggleClass("menuopen");
				evt.stopPropagation();

			},
			"click .statusicon":function(evt){
				
				var e = $(evt.target);
				if(!(e.hasClass("statusicon") || e.is(".statusicon > *")))
					return;
				e.find(".dropdownmenu").toggle('fast');
				e.closest(".statusicon").toggleClass("menuopen");
				evt.stopPropagation();

			},
			"click .statusicon li":function(evt){
				
				var e = $(evt.target);
				e.closest(".dropdownmenu").hide('fast');
				e.closest(".statusicon").toggleClass("menuopen");
				e.closest(".statusicon").attr("name",e.attr("name"));
				this.updateStatus();
				evt.stopPropagation();

			},
			'click .dropdownmenu [name="addchild"]':function(evt){
				var e = $(evt.target);
				
				var self=this;
				e.closest(".dropdownmenu").hide('fast');
				e.closest(".icon").removeClass("menuopen");
				
				newIdea({parentType:this.model.get("type"),parentId:this.model.get("id"), parentTitle:this.model.get("title"), defaultType:this.model.get("type"),
					parentUpdate:{payload:{},callback:function(){console.log("parentupdate");console.log(self);self.updateChildren();}}
				});
				evt.stopPropagation();
				
			},
			'click .dropdownmenu [name="delete"]':function(evt){
				var e = $(evt.target);
				this.model.destroy({error:function(data,response){showError("vituiksman",response.responseText);}});
				
				e.closest(".dropdownmenu").hide('fast');
				e.closest(".icon").toggleClass("menuopen");
				this.$el.remove();
				evt.stopPropagation();
				
			},
			'click .dropdownmenu [name="cut"]':function(evt){
				var e = $(evt.target);
				e.closest(".dropdownmenu").hide('fast');
				e.closest(".icon").toggleClass("menuopen");
				this.$el.toggleClass("cut_idea");
				this.model.attributes.$el=this.$el;
				window.clipboard.toggleItem(this.model);
				evt.stopPropagation();
				//e.closest(".icon").toggleClass("menuopen");
			},
			'click .dropdownmenu [name="paste"]':function(evt){
				var e = $(evt.target);
				e.closest(".dropdownmenu").hide('fast');
				e.closest(".icon").toggleClass("menuopen");
				var self=this;
				_(window.clipboard.getSelectedModels()).each(function(val){
					addRelation(self.model,val,"parentto");
					window.clipboard.toggleItem(val);
				});
				viewList();
				evt.stopPropagation();
				//e.closest(".icon").toggleClass("menuopen");
			}
			
		
		}
		
	});
	/*
	mvc.HighdeaView = mvc.IdeaView.extend({
		className: "highdea",
		template:  getTemplate("templates/highdeaview.html","templates/highdeaview.css","templates/ideaview.css")
	});
	*/
	mvc.listAll = function(gatherId,gatherType){
		var App = mvc.AppView.extend({
			el: $("<div/>")
		});
		var ideaList = new window.mvc.IdeaList();
		//console.log(gatherId+" "+gatherType);
		ideaList.setGatherInfo(gatherId,gatherType);
		
		var app = new App({collection:ideaList});
		
	
		ideaList.fetch({add:true, data:{
			//types:"highdea"
			}, success:function(){
				app.showFilter();
			},error:function(data,response){
				
				showError("vituiksman",response.responseText);
			}
	
		});
		return app.$el;
	};
	mvc.listAllTree = function(gatherId,gatherType){
		
		var ideaList = new window.mvc.IdeaList();
		//console.log(gatherId+" "+gatherType);
		ideaList.setGatherInfo(gatherId,gatherType);
		
		var app = new mvc.TreeListView({collection:ideaList});
		
		
		ideaList.fetch({add:true, data:{
				types:gatherType
			}, success:function(){
				console.log(ideaList);
				app.render();
			},error:function(data,response){
				
				showError("vituiksman",response.responseText);
			}
	
		});
		console.log(app.$el);
		return app.$el;
	};
	
		
	mvc.AppView = Backbone.View.extend({
		el:	$("<div/>"),
		addToTop:false,
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
			this.showFilter();
			
			//this.$el.html(this.template(this.model.toJSON()));
			//this.$el.html(ideaList);
			
		},
		updateView: function(){
			//this.collection.reset();
			var self=this;
			this.addToTop=true;
			this.collection.fetch({
				add:true,
				success: function(data,response){
					
					/*
					console.log(data);
					self.initialize();
					self.render();
					*/
				}
			
			});
			
			
		},
		showFilter:function(){
			this.$el.addClass("filterparent");
			this.$el.attr("filtervalue","type");
			var data= $('<ul class="filter"/>');
			var typenames = _(_(this.collection.models).pluck('attributes')).pluck('type');
			var types = {}
			_(typenames).each(function(val){
				if(!types[val])
					types[val] = 1;
				else
					types[val]++;
				
			});
			
			
			var d = $("<li/>",{
				name:"all",
				html:"all"+" ("+typenames.length+")"
			});
			d.appendTo(data);
			
			_(types).each(function(val,key){
				d = $("<li/>",{
					name:key,
					html:key+" ("+val+")"
				});
				d.appendTo(data);
			});
			
			
			
			
			
			this.$el.find("ul.filter").remove();
			
			this.$el.prepend(data);
			createFilters(this.$el);
		},
		addOne:function(item){
			var view;
			switch(item.attributes.type){
				/*case "highdea":	
					view = new mvc.HighdeaView({model:item});
				break;*/
				default:
					view=new mvc.IdeaView({model:item});
			}
			if(this.addToTop){
				this.$el.prepend(view.render().el);
				this.showFilter();
			}
			else{
				this.$el.append(view.render().el);
			}
			
		},
		change:function(){
			console.log("CHANGE");
			this.render();
		}
		
	});
	
	mvc.TreeListView = Backbone.View.extend({
		tagName:"ul",
		className:"treeview",
		initialize:	function(){
						
			this.collection.bind('add', this.addOne, this);
			this.$el.html("");
			this.render();
			
			//ideaList.fetch();
		},
		render:function(){
			this.$el.html("");
			//console.log(this.collection);
			var self=this;
			_(this.collection.models).each(function(item){
				
				console.log(item);
				//this.$el.append(new mvc.IdeaView({model:item}).render().el);
				self.addOne(item);
			})
			
			
			//this.$el.html(this.template(this.model.toJSON()));
			//this.$el.html(ideaList);
			
		},
		addOne:function(item){
			this.$el.append(new mvc.TreeView({model:item}).render());
		}
		
	});
	
	mvc.TreeView = mvc.IdeaView.extend({
		/*el:("<li/>", {
			class:"treeviewitem"
		})*/
		tagName:"li",
		className:"treeviewitem",
		childrenLoaded:false,
		
		template: getTemplate("templates/treeviewitem.html","templates/treeviewitem.css"),
		render:function(){
			this.$el.html(this.template({model:this.model.toJSON()}));
			createDropDownMenus(this.$el);
			return this.$el;
		},
		events: _.extend({
			"click .expandtree":function(evt){
				
				var d = this.$el.find(".subtree");
				var t = $(evt.currentTarget);
 			
				if(!this.childrenLoaded && this.model.get("hasChildren")=="true"){
					this.childrenLoaded=true;
					var ideaList = new window.mvc.IdeaList();
					
					ideaList.setGatherInfo(this.model.get("id"),this.model.get("type"));
		
					var app = new mvc.TreeListView({collection:ideaList});
		
			
					ideaList.fetch({add:true, data:{
							//types:this.model.get("type")
						}, success:function(){
							app.render();
						},error:function(data,response){
				
							showError("vituiksman",response.responseText);
						}
	
					});
					app.$el.appendTo(d);
					t.addClass("expanded");
					d.toggle("fast");
				}
				else if(this.model.get("hasChildren")){
					t.toggleClass("expanded");
					d.toggle("fast");
				}
				evt.stopPropagation();
			}
			
		
			
		},mvc.IdeaView.prototype.events),
		updateChildren:function(evt){
			
			console.log("updateChildren");
			this.childrenLoaded=false;
			
			this.$el.find(".nochildren").removeClass(".nochildren");
			this.model.set("hasChildren","true");
			var d = this.$el.find(".subtree").html("");
			this.render();
			//this.trigger("click .expandtree");
			
				
		}
	});
	
	
});