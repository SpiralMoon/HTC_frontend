var chattingList = document.getElementById('chattingList');

function addChatMessage (json) {
	var newMessage = json.name + json.message;
	chattingList.value += newMessage;
}	