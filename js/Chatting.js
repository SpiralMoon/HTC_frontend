var chattingList = document.getElementById('chattingList');

function addChatMessage (json) {
	chattingList.value += json.name + json.message; //채팅 내역 추가
}