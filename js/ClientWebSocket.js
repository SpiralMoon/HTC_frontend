<!-- 서버 연결 -->
var webSocket = new WebSocket("ws://m");

webSocket.onmessage = function (event) {

	switch (event.patternCode) {
		case 1: //채팅
		break;
		case 2: //의견도형
		break;
		case 3:
		break;
		case 4:
		break;
		case 5:
		break;
		case 6:
		break;
		case 7:
		break;
	}
} //데이터 수신

webSocket.onopen = function (event) {
	console.log("서버 연결 완료");
}
webSocket.onclose = function (event) {
	console.log("서버 연결 종료");
}

<!-- 데이터 송신 -->
function send(json) {
	webSocket.send(json);
}