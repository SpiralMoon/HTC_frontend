<!-- 서버 연결 -->
var webSocket = new WebSocket("ws://m");

webSocket.onmessage = function (event) {

	try {
		switch (event.patternCode) {
			case "1": //채팅
			addChatMessage(event.data);
			break;
			case "2": //의견 추가
			add(event.data);
			break;
			case "3": //의견 수정
			modify(event.data);
			break;
			case "4": //의견 삭제
			remove(event.data);
			break;
			case "5": //의견 그룹화 (화면 하단 표에 추가)
			merge(event.data);
			break;
			case "6": //투표 개설
			createVote(event.data);
			break;
			case "7": //투표 참여
			receiveVote(event.data);
			break;
			case "8": //투표 결과 출력
			showResult(event.data);
			break;
			case "9": //누군가가 방 입장
			break;
			case "10": //누군가가 방 퇴장
			break;
			case "11": //다음 탭으로 전환
			next(event.data);
			break;
			default:
			break;
		}
	}
	catch (ex) {
		console.log(ex);
	}
} //데이터 수신

webSocket.onopen = function (event) {
	var json = {
		patternCode:"9",
		id:"",
		nickname:""
	}

	// json = JSON.stringify(json);

	send(json);

	console.log("서버 연결 완료");
}

webSocket.onclose = function (event) {
	var json = {
		patternCode:"10",
		id:"",
		nickname:""
	}

	// json = JSON.stringify(json);

	send(json);

	console.log("서버 연결 해제");
}

<!-- 데이터 송신 -->
function send(json) {
	webSocket.send(json);
}