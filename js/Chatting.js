var chattingList = document.getElementById('chattingInput');

function addChatContent (json) {
	// json.name;
	// json.content;
	chattingList.value += json.name + json.content; //채팅 내역 추가
}