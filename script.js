var cx;
var mouse = {x:0,y:0, rightclick: false,xprev: 0,yprev: 0};
var points = [];
var anim_points = [];
var anim_counter = 0;
var width = 800;
var height = 800;
var xshift = width/2;
var yshift = height/2;

function redraw(){
	cx.clearRect(0,0,width,height);
	if(anim_points.length === 0){
		draw_array(points);
	} else {
		draw_array(anim_points);
		for(var i = 0;i < anim_points.length; i++){
			anim_points[i].x = (anim_points[i].x+((anim_points[i].x + points[i].x)/2))/2;
			anim_points[i].y = (anim_points[i].y+((anim_points[i].y + points[i].y)/2))/2;
		}
		anim_counter-=1;
		if(anim_counter<1){
			anim_points = [];
		}
	}
}

function draw_array(array){
	if(array.length > 0){
		cx.beginPath();
		cx.moveTo(array[array.length-1].x+xshift,array[array.length-1].y+yshift);
		for(var  i = 0; i < array.length; i++){
			cx.lineTo(array[i].x+xshift,array[i].y+yshift);
			cx.fillRect(array[i].x+xshift-1,array[i].y+yshift-1,3,3);
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

Number.prototype.mod = function(n) {
return ((this%n)+n)%n;
}

function average_points(leftWeights,ownWeight,rightWeights){
	var num = leftWeights.length + rightWeights.length + 1;
	leftWeights = leftWeights.reverse();
	var points_new = [];
	for(var i = 0; i < points.length;i++){
		var xavg = 0;
		var yavg = 0;
		for(var ii = 0; ii < leftWeights.length; ii++){
			xavg += points[(i-(ii+1)).mod(points.length)].x*leftWeights[ii]
			yavg += points[(i-(ii+1)).mod(points.length)].y*leftWeights[ii]
		}
		xavg += points[i].x*ownWeight;
		yavg += points[i].y*ownWeight;
		for(var ii = 0; ii < rightWeights.length; ii++){
			xavg += points[(i+(ii+1))%points.length].x*rightWeights[ii]
			yavg += points[(i+(ii+1))%points.length].y*rightWeights[ii]
		}
		points_new.push({
			x: xavg/num,
			y: yavg/num
		});
	}
	points = points_new;
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
			if(mouse.rightclick){
				xshift += mouse.x-mouse.xprev
				yshift += mouse.y-mouse.yprev;
				mouse.xprev = mouse.x;
				mouse.yprev = mouse.y;
			}
		})
		.mousedown(function(evnt){
			switch(evnt.which){
				case 1:
					points.push({x:mouse.x-xshift,
								y:mouse.y-yshift})
					break;
				case 3:
					mouse.rightclick = true;
					mouse.xprev = mouse.x;
					mouse.yprev = mouse.y;
					break;
			}
		})
		.mouseup(function(evnt){
			switch(evnt.which){
				case 3:
					mouse.rightclick = false;
					break;
			}
		})
		.bind('contextmenu', function(e){ //Disble context menu!
			return false;
		});
		
	$("#average_button").click(function(){
		var lefts = $("#leftnums").val().split(",") || [];
		var rights = $("#rightnums").val().split(",") || [];
		var mid = parseFloat($("#selfnum").val());
		for(var i = 0; i < lefts.length; i++){
			lefts[i] = parseFloat(lefts[i]);
		}
		for(var i = 0; i < rights.length; i++){
			rights[i] = parseFloat(rights[i]);
		}
		if(!lefts[0]) lefts = [];
		if(!rights[0]) rights = [];
		//setInterval(average_points,100);
		if($("#animate_checkbox").prop('checked')===true){
			anim_points = points;
			anim_counter = 12;
		}
		average_points(lefts,mid,rights);
	});
	
	$("#midpoints_button").click(function(){
		middlepoints();
	});
	
	$("#clear_button").click(function(){
		points = [];
		xshift = width/2;
		yshift = height/2;
	});
	$("#center_button").click(function(){
		xshift = width/2;
		yshift = height/2;
	});
	
	$("#remove_point_button").click(function(){
		points.pop();
	});
	
	$("#zoom_out_button").click(function(){
		average_points([],.8,[]);
	});
	$("#zoom_in_button").click(function(){
		average_points([],1.2,[]);
	});
	
		
	setInterval(redraw,10);
});