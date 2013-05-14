$(function clipboard(){
	var mvc = window.mvc;
	mvc.ClipBoardItem = Backbone.Model.extend({
	});
		
	mvc.ClipBoard = Backbone.Collection.extend({
		model:mvc.ClipBoardItem,
		createView:function(){
			var v = new mvc.ClipBoardAppView({collection:this});
			v.render();
			return v;
		}
		
	});
	
	mvc.ClipBoardItemView = Backbone.View.extend({
		tagName:	"div",
		className:"clipboarditem",
		model:	mvc.ClipBoardItem,
		
		template: getTemplate("templates/clipboarditem.html","templates/clipboard.css"),
		initialize: function(){
			//this.model.bind('change',this.render,this);
			this.model.view=this;
		},
		render: function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			
			//var tmp = this.$el.children(":first")
			//this.$el.html(tmp.html());
			//this.className = tmp.attr("class");
			//this.setElement(tmp);
			
			
			return this;
		},
		events:{
			"click .ideaname":function(){
				
				viewIdea(this.model.attributes);
			}
		}
		
	});
	
		
	mvc.ClipBoardAppView = Backbone.View.extend({
		el:	$("#clipboard"),
		collection:new mvc.ClipBoard(),
		parents:{},
		initialize:	function(){
			
						
			this.collection.bind('add', this.addOne, this);
			
			this.$el.html(getTemplate("templates/clipboard.html","templates/clipboard.css"));
			this.render();
      //this.$el.draggable();
			
			
		},
		render:function(){
			var self = this;
			this.collection.each(function (val,key){
				self.addOne(val);
			});
			return this;
			
		},
		addOne:function(item){
			this.parents[item]= new mvc.Idea({id:curField,type:"field"});
			this.$el.find(".clipboard_content").append(new mvc.ClipBoardItemView({model:item}).render().el);
		},
		addItem:function(data){
			this.collection.add(new mvc.ClipBoardItem(data));
			this.$el.fadeIn('fast');
		},
		toggleItem:function(data){
			var old = this.containsItem(data);
			
			if(old){
				this.collection.remove(old);
				
				old.view.$el.fadeOut('fast', function(){$(this).remove()});
				
			}
			else{
				this.collection.add(new mvc.ClipBoardItem(data));
				this.$el.fadeIn('fast');
			}
			if(this.collection.isEmpty())
				this.$el.fadeOut('fast');
		},
		containsItem:function(data){
			return _(this.collection.models).find(function(val,num){
				
				return _(val.attributes).isEqual(data.attributes);
			});
		},
		getSelectedModels:function(){
			var ret = [];
			this.collection.each(function(val){
				if(!val.view)
					return;
				if(val.view.$el.find("input:checked").length==0)
					return
				ret.push(val);
			});
			//var cb = this.$el.find('input[type="checkbox"]');
			return ret;
		},
		events:{
			"click .closebutton":function(){
				this.$el.fadeOut('fast');
				
				
			},
			"click .clipboard_all":function(){
				var cb = this.$el.find('input[type="checkbox"]');
				if(cb.filter(":not(:checked)").length<1){
					cb.removeProp("checked");
				}
				else{
					cb.prop("checked","checked");
				}
				
			},
			"click .clipboard_paste":function(){
				var model = new mvc.Idea({id:curField,type:"field"});
				var self=this;
				_(window.clipboard.getSelectedModels()).each(function(val){
					if(self.parents[val]){
						removeRelation(self.parents[val],val,"parentto");
					}
					addRelation(model,val,"parentto");
					window.clipboard.toggleItem(val);
				});
			},
			"click .clipboard_pasteas":function(){
				console.log("moi");
			},
			"click .clipboard_clear":function(){//PO: vain valituille
				var self=this;
				var toRemove =[];
				this.collection.each(function(val,key){
					
					if(val.view.$el.find('input[type="checkbox"]').is(":checked")){
						//self.collection.remove(val);
						toRemove.push(val);
						//val.view.$el.fadeOut('fast', function(){$(this).remove()});
						//self.$el.remove(val.view.el);
						
					}
				});
				_(toRemove).each(function (val){
					self.collection.remove(val);
					val.view.$el.fadeOut('fast', function(){$(this).remove()});
					if(val.attributes && val.attributes.$el)
						val.attributes.$el.removeClass("cut_idea");
				});
				if(this.collection.isEmpty()){
					this.$el.find(".closebutton").trigger("click");
				}
				
				//this.$el.find(".clipboard_content").empty();
			}
		}
	});
	
});