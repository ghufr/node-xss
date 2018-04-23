var socket = io();

function chatKeyDown() {
	if (event.keyCode == 13) {
		sendChat();
	}
}

function sendChat() {
	var text = document.getElementById("chat_input").value;
	document.getElementById("chat_input").value = "";
	if(text.length < 1) {
		console.log("Ignoring empty message");
		return;
	}
	console.log("[Send]: " + text);
	socket.emit("send_chat", text);
}

socket.on("chat", function(data) {
	var chatDiv = document.getElementById('chatDiv');
	console.log("[received]: " + data);
	chatDiv.innerHTML += data + "<br>";
	chatDiv.scrollTop = chatDiv.scrollHeight;
});

socket.on("chat_data", function(data) {
	while(data.length > 0) {
		document.getElementById("chatDiv").innerHTML += data.shift() + "<br>";
	}
	var elem = document.getElementById('chatDiv');
	elem.scrollTop = elem.scrollHeight;
});