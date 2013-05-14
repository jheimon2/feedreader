$(function defaultNewIdea(){
	var mvc = window.mvc;
	
	
	mvc.NewIdea = Backbone.Model.extend({
		defaults:{
			title:"",
			description:"",
			type:"limbo",
			parenttitle:"",
			newtags:"",
			priority:"",
			deadline:"",
			status:"",
			
		},
		url:"api/ideas/"
		
	});
	
	
	
	mvc.NewIdeaView = Backbone.View.extend({
		model:		mvc.NewIdea,
		tagName:	"div",
		template: 	getTemplate("templates/newidea.html"),
		render:		function(){
			//this.$el.html(this.template(this.model.toJSON()));
			
			//console.log(this.model.toJSON());
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			createSelectors(this.$el);
			return this;
		},
		events:{
			"click #sendbutton":		function(){
				//vois eka tsekata et tarvittavat jutut l�ytyy, title ainakin jne
				
				this.updateModel();
				
				if(this.model.get("title")){
					if(!this.model.get("id")){//ei pit�s olla ikin� inputin kohdalla id:t�
						var parent;
						if(this.$el.find("[name=\"parentid\"]").val()[0]=="$")
							parent = this.$el.find("[name=\"parentid\"]").val();
						else
							parent = this.$el.find("[name=\"parenttype\"]").val()+":"+this.$el.find("[name=\"parentid\"]").val();
						//console.log(parent);
						//this.model.set({newrelation:(curField[0]=="$"?curField:("fields:"+curField))+" parentto $this"});
						this.model.set({newrelation:parent+" parentto $this"});
				
					}
					var t=getSelection("#typeselector");
					
					this.model.set({type:t});
					
					var b = this.model.save({
						error:function(data,response){showError("vituiksman",response.responseText);},
						success:function(){
							console.log("jeeeeeeeeeeeeeeeeeeeeeeeee");
							$(".ideainput").trigger("sendsuccess");
						}
					});
					if(b){
						this.clear();
						if(window.mvc.apps.listViewApp)
							window.mvc.apps.listViewApp.updateView();
						$(".ideainput").trigger("sendsuccess");	
						closeNewIdea();
					}
            
				}else{
					$(".ideainput input").addClass("hilight");
				}   
			}
		},
		clear:function(){
			this.model.set(this.model.defaults);
			this.$el.find('input[type="text"]').each(function(ind,e){
				
				$(e).attr("value","");
			});
			this.$el.find('textarea').each(function(ind,e){
				$(e).attr("value","");
			});
			
		},
		updateModel:function(){
			
			var self=this;
			_(this.model.attributes).each(function(val,key){
				
				self.updateModelVal(key);
				
				
				
			});
		},
		updateModelVal:function(key){
			var e = this.$el.find("[data-bind=\""+key+"\"]");
				//this.$el.find("input");
			
			if(e.size()==0)
				this.model.set(key, this.model.defaults[key]);
			else	
				this.model.set(key, e.val());
		}
		
		
		
		
	});
	
	
});