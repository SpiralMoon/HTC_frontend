var chattingList = document.getElementById('chattingList');

function addChatMessage (json) {
	var newMessage = "";

	// TODO
	if ("나" == json.data.name) //내가 보낸 메시지면
		newMessage = '<p align="right" style="color: red;">' + json.data.name + " : " + json.data.message + '</p>';
	else //내가 보낸 메시지가 아니면
		newMessage = '<p align="left">' + json.data.name + " : " + json.data.message + '</p>';


	chattingList.innerHTML += newMessage;
}

function newPeople (json) {
	var newMessage = "";
	
	newMessage = '<p align="left">' + json.name + ' joined.</p>';

	chattingList.innerHTML += newMessage;
}