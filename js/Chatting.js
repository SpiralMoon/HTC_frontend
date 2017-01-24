var chattingList = document.getElementById('chattingList');

function addChatMessage (json) {
	var newMessage = "";

	// TODO
	if ("@myID" == json.id) //내가 보낸 메시지면
		newMessage = '<p align="right" style="color: red;">' + json.data.name + " : " + json.data.message + '</p>';
	else //내가 보낸 메시지가 아니면
		newMessage = '<p align="left">' + json.data.name + " : " + json.data.message + '</p>';

	chattingList.innerHTML += newMessage;
	chattingList.scrollTop = chattingList.scrollHeight; //스크롤 자동 내리기
}

function joinPeople (json) {
	var newMessage = "";
	
	newMessage = '<p align="left">' + json.name + ' joined.</p>';

	chattingList.innerHTML += newMessage;
}

function leftPeople (json) {
	var newMessage = "";
	
	newMessage = '<p align="left">' + json.name + ' left.</p>';

	chattingList.innerHTML += newMessage;
}