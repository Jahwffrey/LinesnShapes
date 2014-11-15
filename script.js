var cx;
var mouse = {x:0,y:0};
var points = [];
var width = 400;
var height = 400;

function redraw(){
	if(points.length > 1){
		cx.clearRect(0,0,width,height);
		cx.beginPath();
		cx.moveTo(points[points.length-1].x,points[points.length-1].y);
		for(var  i = 0; i < points.length; i++){
			cx.lineTo(points[i].x,points[i].y);
			cx.fillRect(points[i].x-1,points[i].y-1,3,3);
		}
		cx.stroke();
	}
}

function middlepoints(){
	var points_new = [];
	points_new.push(points[points.length-1]);
	points_new.push({x:(points[points.length-1].x+points[0].x)/2,
					 y:(points[points.length-1].y+points[0].y)/2});
	for(var  i = 0; i < points.length-1; i++){
			points_new.push(points[i]);
			points_new.push({x:(points[i].x+points[i+1].x)/2,
					 y:(points[i].y+points[i+1].y)/2});
		}
	points = points_new;
}

function average_points(leftWeights,ownWeight,rightWeights){
	var num = leftWeights.length + rightWeights.length + 1;
	var points_new = [];
	for(var i = 0; i < points.length;i++){
		points_new.push({
			x:,
			y:
		});
	}
	points[points.length-1] = {x:(points[points.length-1].x+temp.x)/2,
							   y:(points[points.length-1].y+temp.y)/2};
}

$(document).ready(function(){
	var canvas = document.getElementById("canv");
	cx = canvas.getContext("2d");
	
	$("#canv")
		.mousemove(function(evnt){
			mouse.x = evnt.pageX;
			mouse.y = evnt.pageY;
			var howFarRight = evnt.target.offsetLeft+1;
			var howFarDown = evnt.target.offsetTop+1;
			mouse.x = mouse.x-howFarRight;
			mouse.y = mouse.y-howFarDown;
		})
		.mousedown(function(evnt){
			switch(evnt.which){
				case 1:
					points.push({x:mouse.x,
								y:mouse.y})
					break;
				case 2:
					var lefts = $("#leftnums").val().split(",");
					var rights = $("#leftnums").val().split(",");
					var mid = parseInt($("#selfnum").val());
					for(var i = 0; i < lefts.length; i++){
						lefts[i] = parseInt(lefts[i]);
					}
					for(var i = 0; i < rights.length; i++){
						rights[i] = parseInt(rights[i]);
					}
					//setInterval(average_points,100);
					average_points(lefts,mid,rights);
					break;
				case 3:
					middlepoints();
					break;
			}
		});
		
	setInterval(redraw,100);
});