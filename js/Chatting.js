var chattingList = document.getElementById('chattingList');

function addChatMessage (json) {
	var newMessage = "";

	if (false) //내가 보낸 메시지면
		newMessage = '<p align="right" style="color: red;">' + json.name + " : " + json.message + '</p>';
	else //내가 보낸 메시지가 아니면
		newMessage = '<p align="left">' + json.name + " : " + json.message + '</p>';


	chattingList.innerHTML += newMessage;
}

function newPeople (json) {
	var newMessage = "";
	
	newMessage = '<p align="left">' + json.name + ' joined.</p>';

	chattingList.innerHTML += newMessage;
}