
	var canvas = document.getElementById('ideaBoard');
	var cs = getComputedStyle(canvas);
	var canvasHeight = parseInt(cs.getPropertyValue('height'), 10);
	var canvasWidth = parseInt(cs.getPropertyValue('width'), 10);

	var canvas = new fabric.Canvas('ideaBoard');
	canvas.setHeight(canvasHeight);
	canvas.setWidth(canvasWidth);


	function add (json, title) {

		var leftPos = Math.floor(Math.random() * 600) + 1;  // returns a number
		var topPos = Math.floor(Math.random() * 450) + 1;  // returns a number
		var color = getRandomColor();

		//의견도형 데이터 추가
		var rect = new fabric.Rect({
			left: leftPos,
  			top: topPos,
  			fill: color,
  			width: 100,
  			height: 50
		});

		//의견내용 데이터 추가
		var content = new fabric.Text(title, { 
    		left: rect.left,
    		top: rect.top, 
    		fill: 'white',
    		fontSize:20
		});

		var group = new fabric.Group([ rect, content ], {
  			left: leftPos,
  			top: topPos,
		});

		var json = {
			name:"admin",
			id:"1234",
			opinion:group };

		canvas.add(group);
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

	function merge () {	

 		var mergeGroup = new fabric.Group([canvas.getActiveGroup()]);
		remove();

		return mergeGroup;
	}

	function getRandomColor () {

		var color = Math.floor(Math.random() * 17) + 1;

		switch(color) {
			case 1:
			color = "aqua";
			break;
			case 2:
			color = "black";
			break;
			case 3:
			color = "blue";
			break;
			case 4:
			color = "fuchsia";
			break;
			case 5:
			color = "gray";
			break;
			case 6:
			color = "green";
			break;
			case 7:
			color = "lime";
			break;
			case 8:
			color = "maroon";
			break;
			case 9:
			color = "navy";
			break;
			case 10:
			color = "olive";
			break;
			case 11:
			color = "orange";
			break;
			case 12:
			color = "purple";
			break;
			case 13:
			color = "red";
			break;
			case 14:
			color = "silver";
			break;
			case 15:
			color = "teal";
			break;
			case 16:
			color = "white"; //배경이 하얀색이라 좋지 않음
			break;
			case 17:
			color = "yellow";
			break;
			default:
			break;
		}

		return color;
	}