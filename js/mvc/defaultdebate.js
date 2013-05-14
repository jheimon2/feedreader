(function defaultDebate(){
	
	var mvc = window.mvc;
	
	
	mvc.Debate = Backbone.Model.extend({
		
		url: function(){ return this.id?"api/debates/"+this.id:"api/debates/";}
		
	});
	
	mvc.DebateView = Backbone.View.extend({
		model:		mvc.Debate,
		tagName:	"div",
		template: 	getTemplate("templates/debate.html","templates/debate.css"),
		render:		function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			this.viewAllItems();
			create1dVote(this.$el.find(".mainvote"),-1,1);
			create1dVote(this.$el.find(".voteweight"),0,1);
			this.viewParents();
			return this;
		},
		viewAllItems:function(){
			this.viewItems("supporting");
			this.viewItems("neutral");
			this.viewItems("opposing");
			
			
		},
		
		addArgument:function(type){
			var self=this;
				$("#desktop").createPopup("","new "+type+" argument",function(btn,fields){
					if(btn!="ok" || !fields || !fields.title)
						return;
					var newf = new mvc.Debate(fields);
					newf.set("type","debate");
					newf.set("newrelation", "$this "+type+"argumentto "+"debates:"+self.model.id+";"+"debates:"+self.model.id+ " parentto $this");
					//newf.set("newrelation", "debates:"+self.model.id+ " parentto $this");
					newf.save().success(function(){
						self.viewItems(type);
					});
				},null, null, null, [
					{name:"title"},
					{name:"description"}			
				]);
		},
		events:{
			"click	.addsupporting":function(){
				this.addArgument("supporting");
			},
			"click	.addneutral":function(){
				this.addArgument("neutral");
			}
			,"click	.addopposing":function(){
				this.addArgument("opposing");
			},
			"click .sendvote":function(){
				var ok=true;
				if(!this.$el.find(".mainvote").attr("value")){
					ok=false;
					this.$el.find(".mainvote").css("border-color","red");
				}
				else{
					this.$el.find(".mainvote").css("border-color","black");
				}
				if(!this.$el.find(".voteweight").attr("value")){
					ok=false;
					this.$el.find(".voteweight").css("border-color","red");
				}
				else{
					this.$el.find(".voteweight").css("border-color","black");
				}
				if(ok)
					addVote("debates",this.model.id,{validity:[this.$el.find(".mainvote").attr("value"),this.$el.find(".voteweight").attr("value")]});
			}
			
		},
		viewItems:function(type){
			this.$el.find(".toparguments .arguments."+type+" ol").empty();
			this.$el.find(".otherarguments .arguments."+type+" ul").empty();
			
			var ideaList = new window.mvc.IdeaList();
			ideaList.id=this.model.id;
			ideaList.setGatherInfo(this.model.id,"debates");
			
			
			
			
			var self=this;
			ideaList.fetch({add:true, data:{
				gatherrelation:type+"argumentto",
				lefthand:true
			}, success:function(){
				ideaList.each(function(arg){
					self.addArgumentElement(type, new mvc.ArgumentView({model:arg}).render().$el);
				});
				
				
			},error:function(data,response){
			
				showError("vituiksman",response.responseText);
			}
	
			});
		},
		addArgumentElement:function(type,el){
			console.log(".toparguments .arguments."+type+" ol");
			var e = this.$el.find(".toparguments .arguments."+type+" ol");
			if(e.find("li").size()>=5){
				e= this.$el.find(".otherarguments .arguments."+type+" ul");
			}
			console.log(e);
				
			el.appendTo(e);
		},
		viewParents:function(){
			var dd = this.$el.find(".debateparents");
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
					class:+val[2]+"link",
					href:"#/"+val[2]+"s/"+val[0],
					html:" "+val[1]+" "
				});
				dd.append(d);
				dd.append(" >")
			});
			var d = $("<a/>", {
				class:"debatelink",
				href:"#/debates/"+this.model.get("id"),
				html:" "+this.model.get("title")+" "
			});
			dd.append(d);
			
			
			
		}
		
	});
	
	mvc.ArgumentView = Backbone.View.extend({
		model:		mvc.Debate,
		tagName:	"li",
		template: 	getTemplate("templates/argument.html","templates/argument.css"),
		render:		function(){
			
			this.$el.html(this.template({model:this.model.toJSON()}));
			
			return this;
		},
		events:{
			"click .morebutton":function(){
				this.$el.find(".argumentdetails").toggle("fast");
			},
			"click .upvote":function(){
				addVote("debates",this.model.id,{genericVote:1},this.$el.find(".score"));
			},
			"click .downvote":function(){
				addVote("debates",this.model.id,{genericVote:-1},this.$el.find(".score"));
			}
		}
	});
	
})();