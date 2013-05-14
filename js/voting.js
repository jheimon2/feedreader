function addVote(col,id, votes, scoreel){
	var vs="";
	_(votes).each(function(val,key){
		vs+=key;
		if(val instanceof Array){
			_(val).each(function(val){
				vs+=","+val;
			});
		}
		else
			vs+=","+val;
		vs+=";";
		
	});
	$.get("api/"+col+"/"+id+"?votes="+vs).success(function(data){
		if(scoreel)
			scoreel.html(data.score);
	});
}
function create1dVote(target,min,max, labels){
	//targetin kokoa ei määrätä, eikä myöskään pakoteta labeleja sivuun?
	$("<div/>",{
		class:"votemark",
		style:"height:100%;width:1px;background-color:black;position:absolute;"
	}).appendTo(target);
	
	var positionVoteMark=function(){
		target.find(".votemark").css("left", target.width()*target.attr("x")+-1);
	}
	
	target.click(function(evt){
		
		var x = (evt.pageX- target.offset().left)/target.width();
		x=Math.min(1,Math.max(0,x));
		target.attr("value",x*(max-min)+min);
		target.attr("x",x);
		positionVoteMark();
		
	});
	target.mousemove(function(evt){
		
		var x = (evt.pageX- target.offset().left)/target.width();
		x=Math.min(1,Math.max(0,x));
		target.find(".votemark").css("left", target.width()*x);
		
	});
	target.mouseout(positionVoteMark);
}

