
	//선언
	var canvas = document.getElementById('ideaBoard');
	var canvas2 = document.getElementById('groupBoard');
	var cs = getComputedStyle(canvas);
	var canvasHeight = parseInt(cs.getPropertyValue('height'), 10);
	var canvasWidth = parseInt(cs.getPropertyValue('width'), 10);
	var canvas = new fabric.Canvas('ideaBoard');
	var canvas2 = new fabric.Canvas('groupBoard');

	canvas.setHeight(canvasHeight);
	canvas.setWidth(canvasWidth);
	canvas2.setHeight(canvasHeight);
	canvas2.setWidth(canvasWidth);


	//현재 투표 현황
	var voteList = document.getElementById('voteList').getElementsByTagName('li');
	var votedPeople = 0; //투표에 참여한 인원 수
	var voteCount = new Array(); //각 항목에 대한 투표 수

	var opinionList = new Array(); //의견 리스트 배열


	/*
	* 데이터 전송 파트
	*/
	function setOpinion (content) { //json 데이터에 들어갈 의견 데이터

		for (var i = 0; i < canvas._objects.length; i++) //의견 중복 체크
			if (canvas._objects[i].text == content) {
				Materialize.toast('중복된 의견입니다.', 4000);
				return null;
			}

		var text = {
			content:content,
			left: getRandomX() + "",
    		top: getRandomY() + "", 
    		fill: 'black',
    		fontSize:20 + ""
		};

		return text;
	}

	function setMerge (title, comment) {
		
		var mergedOpinions =  document.getElementById("mergedOpinions").getElementsByTagName('li');

		//그룹명 중복 방지
		for (var i = 0; i < mergedOpinions.length; i++) {
			if(mergedOpinions[i].getElementsByTagName('span')[0].innerHTML == title) {
				Materialize.toast('같은 이름의 그룹이 이미 존재합니다.', 4000);
				return;
			}
		}

		//TODO 방장권한
		if(canvas2.getActiveGroup()) { //의견들이 드래그된 상태
			var mergeGroup = new Array();

			for (var i = 0; i < canvas2.getActiveGroup()._objects.length; i++)
				mergeGroup.push(canvas2.getActiveGroup()._objects[i].text);

			var data = {
				title:title,
				comment:comment,
				mergeGroup:mergeGroup
			};

			var json = {
				patternCode : "5",
				id : "@myID",
				teamInviteCode:"@teamInviteCode",
				data : data
			};
			// json = JSON.stringify(json);
			// send(json);
			merge(json.data);
		}
		else //드래그된 의견이 하나도 없을 경우 -> 그룹화할 의견을 선택하지 않은 경우
			Materialize.toast('최소 둘 이상의 의견을 드래그하여 다시 실행해주세요.', 4000);
	}

	function removeOpinion () {

		//TODO private 권한
		var selectedObject = canvas.getActiveObject();
		var selectedGroup = canvas.getActiveGroup();

		if (selectedObject) //단일 대상 삭제
		{
			var json = {
				patternCode : "4",
				id:"@myID",
				teamInviteCode:"@teamInviteCode",
				data: selectedObject
			};

			// json = JSON.stringify(json);
			// send(json);
			remove(json);
		}
		else if (selectedGroup) //드래그된 그룹은 삭제할 수 없도록 표시
			Materialize.toast('여러개의 의견은 동시에 삭제할 수 없습니다!', 4000);
		else //의견을 선택하지 않고 삭제 요청을 하는 경우
			Materialize.toast('삭제할 의견을 먼저 선택해주세요!', 4000);
	}

	function modifyOpinion () {

		//TODO private 권한
		var selectedObject;

		canvas.on('mouse:up', function (e) {
		    // panning = false;


			if (e && e.e && selectedObject != null) { //panning && 
				var json = {
					patternCode:"3",
					id:"@myID",
					teamInviteCode:"@teamInviteCode",
					data: selectedObject
				};

				// json = JSON.stringify(json);
				// send(json);
				modify(json);
			}
		});
		canvas.on('mouse:out', function (e) {
		    // panning = false;
		});
		canvas.on('mouse:down', function (e) {
		    // panning = true;
		});
		canvas.on('mouse:move', function(e) {
			selectedObject = canvas.getActiveObject();
		});
	}

	function setVote (voteTitle, isMultiple) {

		//TODO 방장 권한
		var itemList = document.getElementById("mergedOpinions").getElementsByTagName("li");
		var titles = new Array();
		var opinions = new Array();
		var comments = new Array();


		for (var i = 0; i < itemList.length; i++) {
			titles[i] = itemList[i].getElementsByTagName("span")[0].innerHTML;
			var temp = itemList[i].getElementsByTagName("p")[0].innerHTML.split("<br>");
			opinions[i] = temp[0];
			comments[i] = temp[1];
		}

		var vote = {
			voteTitle:voteTitle, //투표 제목
			multiple:isMultiple, //중복 투표 허용
			title:titles,
			comment:comments,
			opinion:opinions,
		}
		var json = {
			patternCode:"6",
			id:"@myID",
			teamInviteCode:"@teamInviteCode",
			data:vote
		}

		// json = JSON.stringify(json);
		// send(json);
		createVote(json.data);
	}

	function submitVote () {
		//투표 차트 파싱
		var voteList =  document.getElementById("voteList").getElementsByTagName("li"); //투표 목록 갯수
		var choseList = new Array(); //투표한 리스트가 들어갈 변수

		for (var i = 0, j = 0; i < voteList.length; i++) {
			if (document.getElementById("list" + i).checked) {
				choseList[j] = ("list" + i); //voteList[i].id;
				j++;
			}
		}

		if (choseList.length == 0) {
			Materialize.toast('최소한 하나 이상의 항목을 선택해주세요.', 4000);
			return;
		}

		var data = {
			list:choseList
		};

		var json = {
			patternCode : "7",
			id : "@myID",
			teamInviteCode:"@teamInviteCode",
			data : data
		};

		// json = JSON.stringify(json);
		// send(json);
		receiveVote(json.data);

		document.getElementById('voteSubmitButton').setAttribute('disabled', 'true');
		Materialize.toast('투표하였습니다. 방장이 투표를 종료할 때까지 기다려주십시오.', 4000);
	}

	function finishVote () {

		//TODO 방장 권한
		var title = new Array();
		var sumCount = 0;

		for (var i = 0; i < voteList.length; i++) {
			title[i] = voteList[i].getElementsByTagName("label")[0].innerHTML;
		}

		for (var i = 0; i < voteCount.length; i++) {
			sumCount += voteCount[i];
		}

		var data = {
			title:title, //투표 항목명 배열
			voteCount:voteCount, //득표수 배열
			people:votedPeople, //총 투표 인원
			sumCount:sumCount //총 투표수
		};

		var json = {
			patternCode : "8",
			id:"@myID",
			teamInviteCode:"@teamInviteCode",
			data:data
		};

		// json = JSON.stringify(json);
		// send(json);

		showResult(json.data);
	}

	/*
	* ideaBoard 조작 파트
	*/
	function add (json) { //json으로부터 받아와 의견 데이터를 canvas에 그리는 함수
		var text = new fabric.Text(json.data.content, { 
    		left: parseInt(json.data.left),
    		top: parseInt(json.data.top), 
    		fill: json.data.fill,
    		fontSize:parseInt(json.data.fontSize)
		});

		opinionList.push(json);
		canvas.add(text);
		canvas2.add(text);
	}

	function remove (json) {
		for (var i = 0; i < canvas._objects.length; i++)
		{
			if (typeof json === 'object')
			{
				if (canvas._objects[i].text == json.data.text) {
					opinionList.splice(i, 1);
					canvas.remove(json.data);
					canvas2.remove(json.data);
				}
			}
			else if (typeof json === 'string')
			{
				if (canvas._objects[i].text == json) { //그룹화에서 호출한 경우
					canvas.remove(canvas._objects[i]);
					canvas2.remove(canvas2._objects[i]);
					opinionList.splice(i, 1);
				}
			}
		}
	}

	function clear () {
		//canvas위에 그려진 모든 오브젝트 삭제
	}

	function merge (json) {	
		console.log(json);

		var mergedOpinions =  document.getElementById("mergedOpinions"); //그룹화 표
		var mergedData = "";
		var html = "";

		for (var i = 0; i < json.mergeGroup.length; i++) //2중 for문을 써서 canvas의 멤버와 매치 시켜야하는 부분
		{
			mergedData += json.mergeGroup[i] + ", ";
			remove(json.mergeGroup[i]);
		}

		mergedData = mergedData.slice(0, mergedData.length - 2); //"..., "에서 , 를 잘라냄

		html += '<li class="collection-item">';
		html += '<span class="title" style="font-size:30px;">' + json.title + '</span>';
		html += '<p>' + mergedData + '<br>';
		html += json.comment;
		html += '</p>';
		html += '<a href="#!" class="secondary-content"></a>';
		html += '</li>';

		mergedOpinions.innerHTML += html;

		Materialize.toast('의견그룹 ' + json.title + ' 이(가) 아래 표에 추가되었습니다.', 4000);
	}

	function modify (json) {
		remove(json);
		canvas.add(json.data);
		canvas2.add(json.data);
	}

	function createVote (json) {
		//투표 주제(제목) 적용
		var voteTitle = document.getElementById('topic');
			voteTitle.innerHTML = "주제 : " + json.voteTitle;

		//투표 차트 생성
		var voteList = document.getElementById('voteList');
		var html = ""; //투표 각 항목
		var isMultiple = (json.multiple == true)? true : false; //중복 허용인가?

		for (var i = 0; i < json.title.length; i++) {
			html += '<li class="collection-item">';

			if (isMultiple)
				html += '<input type="checkbox" id="list' + i + '" />';
			else
				html += '<input name="group1" type="radio" id="list' + i + '" class="with-gap"/>';

			html += '<label for="list' + i + '" class="title" style="font-size:30px;">' + json.title[i] + '</label>';
			html += '<p>' + json.opinion[i] + '<br>';
			html += json.comment[i];
			html += '</p>';
			html += '<a href="#!" class="secondary-content"></a>';
			html += '</li>';

			voteCount[i] = 0;
		}

		voteList.innerHTML = html;
	}

	function receiveVote (json) {
		var list = json.list; //누군가가 투표한 항목들

		for (var i = 0; i < voteList.length; i++) {
			for (var j = 0; j < list.length; j++) {
				if(document.getElementById("list" + i).id == list[j]) {
					voteCount[i]++;
				}
			}
		}

		votedPeople++;
	} 

	function showResult (json) {
		var resultGraph = document.getElementById("resultGraph");
		var title = json.title;
		var count = json.voteCount;

		//득표율이 높은 순으로 정렬 (내림차순)
		for (var i = 0; i < title.length; i++) {
			for (var j = 0; j < title.length; j++) {
				if (count[i] > count[j]) {
					var temp1 = count[i];
					count[i] = count[j];
					count[j] = temp1;

					var temp2 = title[i];
					title[i] = title[j];
					title[j] = temp2;
				}
			}
		}

		var html = "";
		var color = "reddeep";

		for (var i = 0; i < title.length; i++) {

			if (i % 10 == 0)
				color = "reddeep";
			else if (i % 10 == 1)
				color = "redpink";
			else if (i % 10 == 2)
				color = "pink";
			else if (i % 10 == 3)
				color = "orangered";
			else if (i % 10 == 4)
				color = "orange";
			else if (i % 10 == 5)
				color = "yellow";
			else if (i % 10 == 6)
				color = "green";
			else if (i % 10 == 7)
				color = "greenbright";
			else if (i % 10 == 8)
				color = "greenblue";
			else if (i % 10 == 9)
				color = "blue";


			html += '<li class="' + color + '" style="width:' + count[i] / json.people * 100 + '%;">' + title[i] + '</li>'
		}

    	html += '<li id="voteStats" style="color:black; font-style: normal;">투표 인원 : ' +
      			json.people + '명, 최다 득표 의견 : ' + title[0] + '</li>';

		resultGraph.innerHTML = html;
	}

	function changeTab (json) {
		switch (json.modalNumber) {
			case 1: //브레인스토밍 -> 의견 그룹화
				$jq('ul.tabs').tabs('select_tab', 'tab2');
				document.getElementById('tabMenu1').setAttribute('class', 'tab col s3 disabled');
				Materialize.toast('브레인스토밍이 종료되었습니다. 그룹화된 의견을 바탕으로 투표를 준비합니다.', 4000);
			break;
			case 2: //의견 그룹화 -> 투표 진행
				$jq('ul.tabs').tabs('select_tab', 'tab3');
				document.getElementById('tabMenu2').setAttribute('class', 'tab col s3 disabled');
				Materialize.toast('투표가 개설되었습니다. 최대한 투표에 참여해주시기 바랍니다.', 4000);
			break;
			case 3: //투표 진행 -> 회의 결과
				$jq('ul.tabs').tabs('select_tab', 'tab4');
				document.getElementById('tabMenu3').setAttribute('class', 'tab col s3 disabled');
				Materialize.toast('투표가 종료되었습니다.', 4000);
			break;
			default:
			break;
		}
	}

	/*
	* 다음 단계로 넘어가는 파트
	*/
	function next (modalNumber) {
		var json = {
			patternCode:"11",
			id:"@myID",
			teamInviteCode:"@teamInviteCode",
			modalNumber:modalNumber
		}

		// send(json);
		changeTab(json);
	}

	//---------------------------------------------------------------
	function getRandomX () {
		return  Math.floor(Math.random() * 900) + 1;  // returns a X
	}

	function getRandomY () {
		return Math.floor(Math.random() * 390) + 1;  // returns a Y
	}