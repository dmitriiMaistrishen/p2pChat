var connectionsList = {};
var peer = 0;

$("#idChangeButton").click(setPeer);

function setPeer(){
	
	if($("#idChange").val().length > 16){throw new Error(alert("Please, select an id shorter then 17 symbols"));}
	
	if(peer){
		if($("#idChange").val() == peer.id) return;
		
		for(var p in connectionsList){
			connectionsList[p][0].send("CODE_400_CONNECTION_CLOSED");
			$(connectionsList[p][1]).remove();
			connectionsList[p][0].close();
		}
		connectionsList = {};
		$("li").remove();
		
		peer.destroy();
		}
	
	peer = new Peer($("#idChange").val(), {key: 'ykdu15d9rpki6bt9'});

	peer.on('open', function(id){
		//console.log("Current id: " + id);
		$("#ident").text(String(peer.id));
	})

	peer.on('connection', function(c){
		
		c.on('data', function(data){
			//console.log("Data receved: " + data);
			var message = document.createElement("div");
			$(connectionsList[c.peer][1].children[0]).append(message);
			
			var messageText = document.createElement("p");
			$(messageText).text(data).css({"width": "50%", "background-color": "#92d841", "color": "#00311e", "border-radius": "4px", "padding": "4px", "margin": "2px", "white-space": "normal"});
			$(message).append(messageText);
			$(message).css("height", $(messageText).outerHeight(true));
			connectionsList[c.peer][1].children[0].scrollTop = connectionsList[c.peer][1].children[0].scrollHeight;
		})
		
		c.on('close', function(){
			$(connectionsList[c.peer][1]).slideUp("fast");
			setTimeout(function(){
				$(connectionsList[c.peer][1]).remove();
				delete connectionsList[c.peer];
				$("li").each(function(i, li){
				if($(li).text() == c.peer) $(li).remove();
				})
			}, 200);
		})
		
		c.open = true; 
		if(!connectionsList[c.peer]){
			
			for(var p in connectionsList){
				$(connectionsList[p][1]).slideUp("fast");
			}
			connectionsList[c.peer] = [c, createChat()];
			
			$(connectionsList[c.peer][1].children[1].children[0].children[1].children[0]).click(function(){ //button onclick
				var sMessage = $(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).val(); //textarea val
				c.send(sMessage);
				$(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).val("");
				
				var message = document.createElement("div");
				$(connectionsList[c.peer][1].children[0]).append(message);
			
				var messageText = document.createElement("p");
				$(messageText).text(sMessage).css({"width": "50%","background-color": "#92e2af", "color": "#00311e", "padding": "4px", "margin": "2px","border-radius": "4px", "float": "right", "white-space": "normal"});
				$(message).append(messageText);
				$(message).css("height", $(messageText).outerHeight(true));
				connectionsList[c.peer][1].children[0].scrollTop = connectionsList[c.peer][1].children[0].scrollHeight;
			})
			
			$(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).keyup(function(e){ //textarea enter
				if((e.keyCode ? e.keyCode : e.which) == 13){
					$(connectionsList[c.peer][1].children[1].children[0].children[1].children[0]).click();//leads to button click
					return false;
				}
			})
			
			var partner = document.createElement("li");
			$(partner).text(c.peer).css({"width": "80%"});
			$("#partnersList").append(partner);
			
			$(partner).mouseover(function(){$(this).css({"border": "thin solid green"})});
			$(partner).mouseout(function(){$(this).css({"border": "none"})});
			$(partner).click(navigationHendler);
		}
	})
		
}

$("#idChange").keyup(function(e){
	if((e.keyCode ? e.keyCode : e.which) == 13){
		$("#idChangeButton").click();
		return false;
	}
})

$("#partnerButton").click(setConnection);

function setConnection(){
	if(!peer){throw new Error(alert("Please, select an ID before setting connection to someone!"));}
	if(!connectionsList[$("#partner").val()]){
		var c = peer.connect($("#partner").val());
	
		/*c.on('open', function(){
			console.log("connection established!");
			//c.send("connection established!");
		}) */
	
		c.on('data', function(data){
			//console.log("Data receved: " + data);
			
			var message = document.createElement("div");
			$(connectionsList[c.peer][1].children[0]).append(message);
			
			var messageText = document.createElement("p");
			$(messageText).text(data).css({"width": "50%", "background-color": "#92d841", "color": "#00311e", "border-radius": "4px", "padding": "4px", "margin": "2px", "white-space": "normal"});
			$(message).append(messageText);
			$(message).css("height", $(messageText).outerHeight(true));
			connectionsList[c.peer][1].children[0].scrollTop = connectionsList[c.peer][1].children[0].scrollHeight;
			
			/*if(data == "CODE_400_CONNECTION_CLOSED"){
				$(connectionsList[c.peer][1]).remove();
				delete connectionsList[c.peer];
				$("li").each(function(i, li){
					if($(li).text() == c.peer) $(li).remove();
				})
			}*/
		})
		
		
		c.on('close', function(){
			$(connectionsList[c.peer][1]).slideUp("fast");
			setTimeout(function(){
				$(connectionsList[c.peer][1]).remove();
				delete connectionsList[c.peer];
				$("li").each(function(i, li){
				if($(li).text() == c.peer) $(li).remove();
				})
			}, 200);
		})

		for(var p in connectionsList){
			$(connectionsList[p][1]).slideUp("fast");
		}
		connectionsList[$("#partner").val()] = [c, createChat()];
		
		$(connectionsList[c.peer][1].children[1].children[0].children[1].children[0]).click(function(){ //button onclick
			var sMessage = $(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).val(); //textarea val
			c.send(sMessage);
			$(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).val("");
				
			var message = document.createElement("div");
			$(connectionsList[c.peer][1].children[0]).append(message);
		
			var messageText = document.createElement("p");
			$(messageText).text(sMessage).css({"width": "50%","background-color": "#92e2af", "color": "#00311e", "padding": "4px", "margin": "2px","border-radius": "4px", "float": "right", "white-space": "normal"});
			$(message).append(messageText);
			$(message).css("height", $(messageText).outerHeight(true));
			connectionsList[c.peer][1].children[0].scrollTop = connectionsList[c.peer][1].children[0].scrollHeight;
		})
		
		$(connectionsList[c.peer][1].children[1].children[0].children[0].children[0]).keyup(function(e){ //textarea enter
			if((e.keyCode ? e.keyCode : e.which) == 13){
				$(connectionsList[c.peer][1].children[1].children[0].children[1].children[0]).click();//leads to button click
				return false;
			}
		})
		
		var partner = document.createElement("li");
		$(partner).text($("#partner").val()).css({"width": "80%"});
		$("#partnersList").append(partner);
		
		$(partner).mouseover(function(){$(this).css({"border": "thin solid green"})});
		$(partner).mouseout(function(){$(this).css({"border": "none"})});
		$(partner).click(navigationHendler);
	}
}

$("#partner").keyup(function(e){
	if((e.keyCode ? e.keyCode : e.which) == 13){
		$("#partnerButton").click();
		return false;
	}
})

function createChat(){

	var fundation = document.createElement("div");
	$(fundation).css({position: "absolute", left: "0px", "top": "10px", width: "390px", 
					  background: "#ffffff", height: "420px", border: "thin solid silver", "border-radius": "2px"});
	$(fundation).slideUp(1);
	$($("div#main > table tr td")[1]).append(fundation);
	
	var chat = document.createElement("div");
	$(chat).css({width: "90%", background: "white", height: "348px", "margin-left": "auto", "margin-right": "auto", 
				 "margin-top": "5px","margin-bottom": "2px", border: "thin solid darkgray", "border-radius": "2px", "overflow": "auto"});
	fundation.append(chat);
	
	var send = document.createElement("table");
	$(send).html('<tr><td style = "width: 80%; height: 35px; padding: 0px; padding-top: 2px; margin: 0px;"><textarea style = "width: 100%; height: 100%; padding: 0px"></textarea></td><td style = "padding: 0px; margin: 0px; width: 20%; height: 100%;"><button style = "-webkit-appearance: button; vertical-align: middle; height: 100%; width: 100%; text-align: center; font: Arial;">Send</button></td></tr>').css({"width": "90%", "height": "35px", "margin-left": "auto", "margin-right": "auto",});
	fundation.append(send);
	//$(fundation).slideDown("fast");
	setTimeout (function(){$(fundation).slideDown("fast");}, 400);
	
	if($("#stub")){$("#stub").remove();}
	
	return fundation;
}

function navigationHendler(){
	$("li").each(function(){$(this).css({"background": "#ffffff"});}) ;
	$(this).css({"background": "#92d841"});
	for(var p in connectionsList){
		$(connectionsList[p][1]).slideUp("fast");
	}
	var peerName = $(this).text();
	setTimeout (function(){$(connectionsList[peerName][1]).slideDown("fast");}, 400);
}