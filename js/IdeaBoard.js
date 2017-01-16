
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

	function setMerge () {
		var mergeGroup = new fabric.Group([canvas.getActiveGroup()]);
		var json = {
			patternCode : 5,
			id : "",
			data : mergeGroup
		};

		// send(json);
		merge(json.data);
	}

	/*
	* canvas 조작 파트
	*/
	function add (json) { //json으로부터 받아와 의견 데이터를 canvas에 그리는 함수
		canvas.add(json);
	}

	function remove () {
		//선택한 오브젝트를 삭제

		var selectedObject = canvas.getActiveObject();
		var selectedGroup = canvas.getActiveGroup();

		if (selectedObject) //단일 대상 삭제
			canvas.remove(selectedObject);

		else if (selectedGroup) //드래그된 그룹 삭제
			var temp = selectedGroup.getObjects();
			canvas.discardActiveGroup();

			temp.forEach(function(object) {
            	canvas.remove(object);
            });
	}

	function clear () {
		//canvas위에 그려진 모든 오브젝트 삭제
	}

	function merge (json) {	

 		console.log(json._objects[0]._objects);

		for (var i = 0; i < json._objects[0]._objects.length; i++)
		{
			canvas.remove(json._objects[0]._objects[i]); //그룹화된 의견을 캔버스에서 삭제하고 하단 표로 이동시킴
		}
	}


	//---------------------------------------------------------------
	function getRandomX () {
		return  Math.floor(Math.random() * 600) + 1;  // returns a X
	}

	function getRandomY () {
		return Math.floor(Math.random() * 450) + 1;  // returns a Y
	}

	// function getRandomColor () {

	// 	var color = Math.floor(Math.random() * 17) + 1;

	// 	switch(color) {
	// 		case 1:
	// 		color = "aqua";
	// 		break;
	// 		case 2:
	// 		color = "black";
	// 		break;
	// 		case 3:
	// 		color = "blue";
	// 		break;
	// 		case 4:
	// 		color = "fuchsia";
	// 		break;
	// 		case 5:
	// 		color = "gray";
	// 		break;
	// 		case 6:
	// 		color = "green";
	// 		break;
	// 		case 7:
	// 		color = "lime";
	// 		break;
	// 		case 8:
	// 		color = "maroon";
	// 		break;
	// 		case 9:
	// 		color = "navy";
	// 		break;
	// 		case 10:
	// 		color = "olive";
	// 		break;
	// 		case 11:
	// 		color = "orange";
	// 		break;
	// 		case 12:
	// 		color = "purple";
	// 		break;
	// 		case 13:
	// 		color = "red";
	// 		break;
	// 		case 14:
	// 		color = "silver";
	// 		break;
	// 		case 15:
	// 		color = "teal";
	// 		break;
	// 		case 16:
	// 		color = "white"; //배경이 하얀색이라 좋지 않음
	// 		break;
	// 		case 17:
	// 		color = "yellow";
	// 		break;
	// 		default:
	// 		break;
	// 	}

	// 	return color;
	// }