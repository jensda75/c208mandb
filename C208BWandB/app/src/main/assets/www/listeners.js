var row1single = document.getElementById("row1single");
var row1double = document.getElementById("row1double");
var row2single = document.getElementById("row2single");
var row2double = document.getElementById("row2double");
var row3single = document.getElementById("row3single");
var row3double = document.getElementById("row3double");
var row4single = document.getElementById("row4single");
var row4double = document.getElementById("row4double");

// var seat1single = document.getElementById("seat1single");
// var seat1double = document.getElementById("seat1double");

row1single.addEventListener("click",function(){
	if(row1single.checked) {
		row1single.value = 0;
	} else {
		row1single.value = -14;
	}
	calcPax();
	aircraftDefine();
});

row1double.addEventListener("click",function(){
	if(row1double.checked) {
		row1double.value = 0;
	} else {
		row1double.value = -24;
	}
	calcPax();
	aircraftDefine();
});

row2single.addEventListener("click",function(){
	if(row2single.checked) {
		row2single.value = 0;
	} else {
		row2single.value = -14;
	}
	calcPax();
	aircraftDefine();
});

row2double.addEventListener("click",function(){
	if(row2double.checked) {
		row2double.value = 0;
	} else {
		row2double.value = -24;
	}
	calcPax();
	aircraftDefine();
});

row3single.addEventListener("click",function(){
	if(row3single.checked) {
		row3single.value = 0;
	} else {
		row3single.value = -14;
	}
	calcPax();
	aircraftDefine();
});

row3double.addEventListener("click",function(){
	if(row3double.checked) {
		row3double.value = 0;
	} else {
		row3double.value = -24;
	}
	calcPax();
	aircraftDefine();
});

row4single.addEventListener("click",function(){
	if(row4single.checked) {
		row4single.value = 14;
	} else {
		row4single.value = 0;
	}
	calcPax();
	aircraftDefine();
});

row4double.addEventListener("click",function(){
	if(row4double.checked) {
		row4double.value = 24;
	} else {
		row4double.value = 0;
	}
	calcPax();
	aircraftDefine();
});

