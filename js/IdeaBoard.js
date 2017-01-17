
	//선언
	var canvas = document.getElementById('ideaBoard');
	var cs = getComputedStyle(canvas);
	var canvasHeight = parseInt(cs.getPropertyValue('height'), 10);
	var canvasWidth = parseInt(cs.getPropertyValue('width'), 10);
	var canvas = new fabric.Canvas('ideaBoard');
	canvas.setHeight(canvasHeight);
	canvas.setWidth(canvasWidth);


	/*
	* 데이터 전송 파트
	*/
	function setOpinion (content) { //json 데이터에 들어갈 의견 데이터

		for (var i = 0; i < canvas._objects.length; i++) //의견 중복 체크
			if (canvas._objects[i].text == content) {
				Materialize.toast('중복된 의견입니다.', 4000);
				return null;
			}

		var text = new fabric.Text(content, { 
    		left: getRandomX(),
    		top: getRandomY(), 
    		fill: 'black',
    		fontSize:20
		});

		return text;
	}

	function setMerge (title, coment) {
		var data = {
			title:title,
			coment:coment,
			mergeGroup:new fabric.Group([canvas.getActiveGroup()])
		};

		var json = {
			patternCode : 5,
			id : "",
			data : data
		};

		// send(json);
		merge(json.data);
	}

	function removeOpinion () {
		//선택한 오브젝트를 삭제

		var selectedObject = canvas.getActiveObject();
		var selectedGroup = canvas.getActiveGroup();

		if (selectedObject) //단일 대상 삭제
		{
			var json = {
				patternCode : 4,
				id:"",
				data: selectedObject
			};

			// send(json);
			remove(json.data);
		}
		else if (selectedGroup) //드래그된 그룹은 삭제할 수 없도록 표시
			Materialize.toast('여러개의 의견은 동시에 삭제할 수 없습니다!', 4000);
		else //의견을 선택하지 않고 삭제 요청을 하는 경우
			Materialize.toast('삭제할 의견을 먼저 선택해주세요!', 4000);
	}

	function modifyOpinion () {

		// var panning = false;

		canvas.on('mouse:up', function (e) {
		    // panning = false;

		    var selectedObject = canvas.getActiveObject();

			if (e && e.e && selectedObject != null) { //panning && 
				var json = {
					patternCode:3,
					id:"",
					data: selectedObject
				};

				// send(json);
				modify(json.data);
			}
		});
		canvas.on('mouse:out', function (e) {
		    // panning = false;
		});
		canvas.on('mouse:down', function (e) {
		    // panning = true;
		});
		canvas.on('mouse:move', function(e) {
			
		});
	}

	/*
	* canvas 조작 파트
	*/
	function add (json) { //json으로부터 받아와 의견 데이터를 canvas에 그리는 함수
		canvas.add(json);
	}

	function remove (json) {
		for (var i = 0; i < canvas._objects.length; i++)
			if (canvas._objects[i].text == json.text) {
				canvas.remove(json);
			}
	}

	function clear () {
		//canvas위에 그려진 모든 오브젝트 삭제
	}

	function merge (json) {	

		var mergedOpinions =  document.getElementById("mergedOpinions"); //그룹화 표
		var mergedData = "";
		var html = "";

		for (var i = 0; i < json.mergeGroup._objects[0]._objects.length; i++) //2중 for문을 써서 canvas의 멤버와 매치 시켜야하는 부분
		{
			mergedData += json.mergeGroup._objects[0]._objects[i].text + ", ";
			canvas.remove(json.mergeGroup._objects[0]._objects[i]); //하단 표로 이동시킬 그룹화된 의견을 캔버스에서 삭제
		}

		html += '<li class="collection-item avatar">';
		html += '<span class="title">' + json.title + '</span>';
		html += '<p>' + mergedData + ' <br>';
		html += json.coment;
		html += '</p>';
		html += '<a href="#!" class="secondary-content"><i class="material-icons">mode_edit</i></a>';
		html += '</li>';

		mergedOpinions.innerHTML += html;

		Materialize.toast('의견그룹 ' + json.title + ' 이(가) 아래 표에 추가되었습니다.', 4000);
	}

	function modify (json) {
		remove(json);
		canvas.add(json);
	}


	//---------------------------------------------------------------
	function getRandomX () {
		return  Math.floor(Math.random() * 900) + 1;  // returns a X
	}

	function getRandomY () {
		return Math.floor(Math.random() * 390) + 1;  // returns a Y
	}