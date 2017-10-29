function aircraftDefine() {
	var maxPl,bew,cgBew,fuel,wCpt,wFo,totPaxKg;
	bew = document.getElementById("bew").value;
	armBew = document.getElementById("armBew").value;
	fuel = document.getElementById("fuel").value;
	wCpt = document.getElementById("wCpt").value;
	wFo = document.getElementById("wFo").value;
	totPaxKg = document.getElementById("totPaxKgTop").value;

	var nonPayload = getNonPayload();
	maxPl = Math.floor((9097-bew-fuel-(wCpt*2.20462)-(wFo*2.20462))/2.20462) - +nonPayload;

	document.getElementById("maxPlTop").value = maxPl;
	document.getElementById("maxPlBottom").value = maxPl;

	calcPayload();
	calcMasterCG();
} // end function aircraftDefine

function checkCheck() {
	var row4single = document.getElementById("row4single");
	var row4double = document.getElementById("row4double");
	
	for(var i = 1; i < 4; i++) {
		rowSingle = document.getElementById("row" + i + "single");
		rowDouble = document.getElementById("row" + i + "double");
		if(rowSingle.checked) {
			rowSingle.value = 0;
		} else {
			rowSingle.value = -14;
		}
		if(rowDouble.checked) {
			rowDouble.value = 0;
		} else {
			rowDouble.value = -24;
		}
	}
	
	if(row4single.checked) {
		row4single.value = 14;
	} else {
		row4single.value = 0;
	}
	
	if(row4double.checked) {
		row4double.value = 24;
	} else {
		row4double.value = 0;
	}
	calcPax();
}	

// Calculates pilot weights
function calcPilots() {
	var wCpt,wCptLb,wFo,wFoLb,armCpt,momentCpt,armFo,momentFo,pilotKg,pilotLb,totPilotMoment,pilotArm,pilotMoment;
	wCpt = document.getElementById("wCpt").value;
	wFo = document.getElementById("wFo").value;
	wCptLb = document.getElementById("wCptLb").value;
	wFoLb = document.getElementById("wFoLb").value;
	momentCpt = document.getElementById("momentCpt").value;
	momentFo = document.getElementById("momentFo").value;
	document.getElementById("pilotKg").value = Math.round(+wCpt + +wFo);
	document.getElementById("pilotLb").value = Math.round(+wCptLb + +wFoLb);
	totPilotMoment = +momentCpt + +momentFo;
	document.getElementById("pilotMoment").value = Math.round(totPilotMoment*100)/100;
} // end function calcPilots


// Calculates the moment and CG for every seat row
function calcPax() {
	var weight, arm, moment, weightKg, weightLb, numPax, rowSingle, rowDouble, seatWeightKg;
	var row, rowwKg, rowwLb, avgPaxKgValue, rowwKgLocalValue;

	var indPaxWght = document.getElementById("indPaxWght");
	var adults = document.getElementById("a").value;	
	var children = document.getElementById("c").value;	
	var infants = document.getElementById("i").value;	
	var crew = document.getElementById("crw").value;	
	var totPaxKgDef = document.getElementById("totPaxKgDef").value;
	
	var totNumPaxDef = +adults + +children + +crew;
	var pob = +adults + +children + +infants + +crew + 2;

	document.getElementById("pob").innerHTML = pob;
	document.getElementById("totNumPaxDef").value = totNumPaxDef;

	if(infants > 0) {
		document.getElementById("inf").innerHTML = "&nbsp;(+" + infants + ")";
	} else if(!infants || infants < 1) {
		document.getElementById("inf").innerHTML = "&nbsp;";
	}
	
	if(totNumPaxDef < 1) {
		avgPaxKgValue = 0;
	} else {
		avgPaxKgValue = Math.round((totPaxKgDef/totNumPaxDef)*100)/100;
	}
	
	document.getElementById("avgPaxKg").value = avgPaxKgValue;
	kgToLb('avgPaxKg','avgPaxLb');
	
	// calculate every row
	for(i=1;i<6;i++) {
 		checkSeatConfig(i);
		row = document.getElementById("row" + i);
		rowwKg = document.getElementById("row" + i + "wKg");
		rowwLb = document.getElementById("row" + i + "wLb");
		seatWeightSpan = document.getElementById("seat" + i + "weight");
		rowSeat1 = document.getElementById("row" + i + "seat1");
		rowSeat2 = document.getElementById("row" + i + "seat2");
		rowSeat3 = document.getElementById("row" + i + "seat3");
		
		if(i == 5) {
			seatWeightKg = 0;
		} else {
			rowSingle = document.getElementById("row" + i + "single");
			rowDouble = document.getElementById("row" + i + "double");

			seatWeightKg = +rowSingle.value + +rowDouble.value;
		}

		if(!indPaxWght.checked) {
			row.style.color = "#000000";
			if(row.value < 0 || row.value > 3) {
				row.value = "";
			} else {
				numPax = row.value;
			}

			if(seatWeightKg < 1 && seatWeightKg > -1) {
				seatWeightSpan.innerHTML = "";
			} else {
				if(seatWeightKg > 0) {
					seatWeightSpan.innerHTML = "(+" + seatWeightKg + ")";
				} else {
					seatWeightSpan.innerHTML = "(" + seatWeightKg + ")";
				}
			}

			rowwKg.value = Math.round(((avgPaxKgValue*numPax) + +seatWeightKg)*100)/100;
			kgToLb("row" + i + "wKg","row" + i + "wLb");

		} else if(indPaxWght.checked) {
			seatWeightSpan.innerHTML = "";
			if(i == 5) {
				row.value = "";
			} else {
				row.value = seatWeightKg;
				if(row.value < 1 && row.value > -1) {
					row.style.color = "#000000";
				} else {
					row.style.color = "#ff0000";
				}
			}

			for(var number = 1; number < 4; number++) {
				seatRowLocalValue = localStorage.getItem("row" + i + "seat" + number);
				seatRow = document.getElementById("row" + i + "seat" + number);
				if(seatRowLocalValue !== "false") {
					seatRow.value = seatRowLocalValue;
				} // end if row
			} // end for number
			rowwLb.value = Math.round((+row.value + +rowSeat1.value + +rowSeat2.value + +rowSeat3.value)*2.20462);
		}

	} // end for i, calculate every row
	
	// Calculate moment for each row
	for(i=1;i<6;i++) {
		weight = document.getElementById("row"+i+"wLb").value;
		arm = document.getElementById("row"+i+"arm").value;
		moment = weight * arm / 1000;
		document.getElementById("row"+i+"moment").value = Math.round(moment*100)/100;
	}
	
	// Calculate totals for each category
	var totPaxKgDet = 0;
	var totPaxLbDet = 0;
	var totPaxMomentDet = 0;
	var row = [];
	if(!indPaxWght.checked) {
		for(i=1;i<6;i++) {
			row[i] = document.getElementById("row"+i+"wKg").value;
			totPaxKgDet = totPaxKgDet + +row[i];
	
			row[i] = document.getElementById("row"+i+"wLb").value;
			totPaxLbDet = totPaxLbDet + +row[i];
	
			row[i] = document.getElementById("row"+i+"moment").value;
			totPaxMomentDet = totPaxMomentDet + +row[i];
		} // end for i
	} else if(indPaxWght.checked) {
		for(i=1;i<6;i++) {
			rowSeat1 = document.getElementById("row" + i + "seat1");
			rowSeat2 = document.getElementById("row" + i + "seat2");
			rowSeat3 = document.getElementById("row" + i + "seat3");
			
			row[i] = +rowSeat1.value + +rowSeat2.value + +rowSeat3.value;
			totPaxKgDet = totPaxKgDet + +row[i];
	
			row[i] = document.getElementById("row"+i+"wLb").value;
			totPaxLbDet = totPaxLbDet + +row[i];
	
			row[i] = document.getElementById("row"+i+"moment").value;
			totPaxMomentDet = totPaxMomentDet + +row[i];
		} // end for i
	} // end if else indPaxWeight

	var totPaxArmDet = totPaxMomentDet/totPaxLbDet*1000;
	if(!totPaxArmDet || totPaxArmDet < 1) {
		document.getElementById("totPaxArm").value = 0;
	} else {
		document.getElementById("totPaxArm").value = Math.round(totPaxArmDet*100)/100;
	}

	
	document.getElementById("totPaxKgTop").value = Math.round(totPaxKgDet);
	document.getElementById("totPaxLb").value = Math.round(totPaxLbDet);
	document.getElementById("totPaxMoment").value = Math.round(totPaxMomentDet*100)/100;
	
	calcPaxWeight();	
} // end function calcPax()

// Calculates number of pax and average weight/pax
function calcPaxWeight() {
	var row,rowWeight,totRowWeight;
	var indPaxWght = document.getElementById("indPaxWght");
	var totNumPax = document.getElementById("totNumPax");
	var totNumPaxTd = document.getElementById("totNumPaxTd");
	var seatingWeight = document.getElementById("seatingWeight");
	var totPaxKgDef = document.getElementById("totPaxKgDef").value;
	var totNumPaxDef = document.getElementById("totNumPaxDef").value;
	var totPaxKgTop = document.getElementById("totPaxKgTop");
	var totPaxKgTopTd = document.getElementById("totPaxKgTopTd");

	if(indPaxWght.checked) {	
		rowWeight = [];
		totRowWeight = 0;
		totNumPax.style.backgroundColor = "#efefef";
		totNumPaxTd.style.backgroundColor = "#efefef";

		seatingWeight.innerHTML = "Seats (kg)";

		for(i=1;i<5;i++) {
			rowWeight[i] = document.getElementById("row"+i).value;
			totRowWeight = totRowWeight + +rowWeight[i];
		}
		totNumPax.value = totRowWeight;
		
		if(totPaxKgTop.value != totPaxKgDef) {
			totPaxKgTop.style.backgroundColor = "#ff0000"; 
			totPaxKgTopTd.style.backgroundColor = "#ff0000";
		} else {
			totPaxKgTop.style.backgroundColor = "#00ff00";
			totPaxKgTopTd.style.backgroundColor = "#00ff00";
		}

		totNumPaxCount = 0;
		for(i=1;i<6;i++) {
				if(document.getElementById("row" + i + "seat1").value > 0) {
					rowSeat1 = 1;
				} else {
					rowSeat1 = 0;
				}
				if(document.getElementById("row" + i + "seat2").value > 0) {
					rowSeat2 = 1;
				} else {
					rowSeat2 = 0;
				}
				if(document.getElementById("row" + i + "seat3").value > 0) {
					rowSeat3 = 1;
				} else {
					rowSeat3 = 0;
				}
				totNumPaxCount += +rowSeat1 + +rowSeat2 + +rowSeat3;
			}
		
		if(totNumPaxCount != totNumPaxDef) {
			document.getElementById("totNumPaxDef").style.backgroundColor = "#ff0000";
			document.getElementById("totNumPaxDefTd").style.backgroundColor = "#ff0000";
		} else {
			document.getElementById("totNumPaxDef").style.backgroundColor = "#00ff00";
			document.getElementById("totNumPaxDefTd").style.backgroundColor = "#00ff00";
		}
	} else if(!indPaxWght.checked) {
		row = [];
		totNumPaxCount = 0;
		totNumPax.value = 0;
		totNumPax.style.backgroundColor = "#00ff00";
		totNumPaxTd.style.backgroundColor = "#00ff00";
		totPaxKgTop.style.backgroundColor = "#efefef"; 
		totPaxKgTopTd.style.backgroundColor = "#efefef";

		seatingWeight.innerHTML = "Seating";
		
		// Counting total passengers
		var rowSeat1,rowSeat2,rowSeat3;
			for(i=1;i<6;i++) {
				row[i] = document.getElementById("row"+i).value;
				totNumPaxCount += +row[i];
			}
		totNumPax.value = totNumPaxCount;

		if(totNumPaxCount != totNumPaxDef) {
			document.getElementById("totNumPaxDef").style.backgroundColor = "#ff0000";
			document.getElementById("totNumPaxDefTd").style.backgroundColor = "#ff0000";
			totNumPax.style.backgroundColor = "#ff0000"; 
			totNumPaxTd.style.backgroundColor = "#ff0000";
		} else {
			document.getElementById("totNumPaxDef").style.backgroundColor = "#00ff00";
			document.getElementById("totNumPaxDefTd").style.backgroundColor = "#00ff00";
			totNumPax.style.backgroundColor = "#00ff00";
			totNumPaxTd.style.backgroundColor = "#00ff00";
		}
	}
} // end function calcPaxWeight()


// Calculates weights, cg and moment for cargo zones
function calcCgCargoZone() {
	var totKg,zoneKg,zoneLb;
	var zoneKg,zoneSpecial;

	// Get already stored values for calculating with special load	
	calcSpecial();
	for(var zone = 1; zone < 7; zone++) {
		if(zone == 2 || zone == 3 || zone == 4) {
			zoneKg = document.getElementById("zone" + zone + "Kg");
			zoneSpecial = document.getElementById("specialLoadZone" + zone);
			totKg = +zoneKg.value + +zoneSpecial.value;	
			
			document.getElementById("zone" + zone + "Lb").value = Math.round(totKg * 2.20462);
		} else {
			zoneKg = "zone" + zone + "Kg";
			zoneLb = "zone" + zone + "Lb";
			kgToLb(zoneKg,zoneLb);
		} // end if zone
	} // end for zone

	// Calculate moment for each zone
	var weight, arm, moment;
	for(i=1;i<7;i++) {
		weight = document.getElementById("zone"+i+"Lb").value;
		arm = document.getElementById("zone"+i+"Arm").value;
		moment = Math.round((weight * arm / 1000)*100)/100;
		document.getElementById("zone"+i+"Moment").value = moment;
	}

	var totZoneKg = 0;
	var totZoneLb = 0;
	var totZoneMoment = 0;
	var totZoneSpecialLoad = 0;
	var row = [];

	// Calculate totals of every category
	for(i=1;i<7;i++) {
		row[i] = document.getElementById("zone"+i+"Kg").value;
		totZoneKg += +row[i];

		row[i] = document.getElementById("zone"+i+"Lb").value;
		totZoneLb += +row[i];

		row[i] = document.getElementById("zone"+i+"Moment").value;
		totZoneMoment += +row[i];

		row[i] = document.getElementById("specialLoadZone" + i).value;
		totZoneSpecialLoad += +row[i];
	}

	// Calculate totals for specials
	for(i=3;i<5;i++) {
	}

	// Do we have special load onboard the zones?
	if(totZoneSpecialLoad > 0) {
		document.getElementById("zoneSpecialLoadHdg").innerHTML = "Special (Kg)";
		document.getElementById("totZoneSpecialLoad").value = totZoneSpecialLoad;
	} else {
		document.getElementById("zoneSpecialLoadHdg").innerHTML = "";
		document.getElementById("totZoneSpecialLoad").value = "";
	}
	
	// Calculate moment for each row
	var totZoneArm = Math.round((totZoneMoment/totZoneLb*1000)*100)/100;
	if(!totZoneArm || totZoneArm < 1) {
		document.getElementById("totZoneArmTop").value = 0;
	} else {
		document.getElementById("totZoneArmTop").value = totZoneArm;
	}

	document.getElementById("totZoneKgTop").value = totZoneKg;
	document.getElementById("totZoneLbTop").value = totZoneLb;
	document.getElementById("totZoneMomentTop").value = Math.round(totZoneMoment*100)/100;

} // end function calcCgCargoZone()

// Calculates weights, arm and moment for cargo pod
function calcCgPod() {
	var weight, arm, moment;
	calcSpecial();

  var podKg, podSpecial;
	for(var pod = 1; pod < 5; pod++) {
	  podKg = document.getElementById("pod" + pod + "Kg");
		podSpecial = document.getElementById("specialLoadPod" + pod);
		totKg = +podKg.value + +podSpecial.value;
		document.getElementById("pod" + pod + "Lb").value = Math.round(totKg * 2.20462);
	}

	// Calculate moment for each pod
	for(i=1;i<5;i++) {
		weight = document.getElementById("pod"+i+"Lb").value;
		arm = document.getElementById("pod"+i+"Arm").value;
		moment = Math.round((weight * arm / 1000)*100)/100;
		document.getElementById("pod"+i+"Moment").value = moment;
	}
	
	// Calculate totals for each category
	var totPodKg = 0;
	var totPodLb = 0;
	var totPodMoment = 0;
	var totPodSpecialLoad = 0;
	var row = [];
	for(i=1;i<5;i++) {
		row[i] = document.getElementById("pod"+i+"Kg").value;
		totPodKg += +row[i];

		row[i] = document.getElementById("pod"+i+"Lb").value;
		totPodLb += +row[i];

		row[i] = document.getElementById("pod"+i+"Moment").value;
		totPodMoment += +row[i];
		
		row[i] = document.getElementById("specialLoadPod" + i).value;
		totPodSpecialLoad += +row[i];
	}

	// Do we have special load onboard in the pods?	
	if(totPodSpecialLoad > 0) {
		document.getElementById("totPodSpecialLoad").value = totPodSpecialLoad;
	} else {
		document.getElementById("totPodSpecialLoad").value = "";
	}

	var totPodArm = Math.round((totPodMoment/totPodLb*1000)*100)/100;
	if(!totPodArm || totPodArm < 1) {
		document.getElementById("totPodArmTop").value = 0;
	} else {
		document.getElementById("totPodArmTop").value = totPodArm;
	}
	
	document.getElementById("totPodKgTop").value = totPodKg;
	document.getElementById("totPodLbTop").value = totPodLb;
	document.getElementById("totPodMomentTop").value = Math.round(totPodMoment*100)/100;

} // end function calcCgPod()

// Calculates total weights for the special load, and return an array with the values
function calcSpecial() {;
	var totLifeRaft,totSurKit,totSurf,raftLoc,surKitLoc;
	// Is the special loading onboard
	var numLifeRaft = document.getElementById("numLifeRaft");
	var numSurKit = document.getElementById("numSurKit");
	
	// What is the weights of the special loading
	var weightLifeRaft = document.getElementById("weightLifeRaft");
	var weightSurKit = document.getElementById("weightSurKit");

	var raft3 = document.getElementById("raft3");
	var raft4 = document.getElementById("raft4");
	var surKit1 = document.getElementById("surKitPod1");
	var surKit2 = document.getElementById("surKitPod2");
	var surKit3 = document.getElementById("surKitPod3");
	var surKit4 = document.getElementById("surKitPod4");

	var specialLoadZone1 = document.getElementById("specialLoadZone1");
	var specialLoadZone2 = document.getElementById("specialLoadZone2");
	var specialLoadZone3 = document.getElementById("specialLoadZone3");
	var specialLoadZone4 = document.getElementById("specialLoadZone4");
	
	var specialLoadPod1 = document.getElementById("specialLoadPod1");
	var specialLoadPod2 = document.getElementById("specialLoadPod2");
	var specialLoadPod3 = document.getElementById("specialLoadPod3");
	var specialLoadPod4 = document.getElementById("specialLoadPod4");

	specialLoadZone1.value = '';
	specialLoadZone2.value = '';
	specialLoadZone3.value = '';
	specialLoadZone4.value = '';

	specialLoadPod1.value = '';
	specialLoadPod2.value = '';
	specialLoadPod3.value = '';
	specialLoadPod4.value = '';
	
	// Location of life raft
	if(numLifeRaft.checked) {
		document.getElementById("zoneSpecialLoadHdg").innerHTML = "Special (kg)";
		raft3.disabled = false;
		raft4.disabled = false;
		raftLoc = loadingSpecial('lifeRaft');
		if(raftLoc == 0) {
			totLifeRaft = 0;
		} else if(raftLoc == 7) {
			totLifeRaft = weightLifeRaft.value;
			specialLoadZone3.value = totLifeRaft/2;
			specialLoadZone4.value = totLifeRaft/2;
		} else {
			totLifeRaft = weightLifeRaft.value;
			document.getElementById("specialLoadZone" + raftLoc).value = totLifeRaft;
		}
	} else if(!numLifeRaft.checked) {
		document.getElementById("zoneSpecialLoadHdg").innerHTML = "";
		raft3.disabled = true;
		raft4.disabled = true;
		totLifeRaft = 0;
	}
	
	// Location of survival kit
	if(numSurKit.checked) {
		document.getElementById("podSpecialLoadHdg").innerHTML = "Special (kg)";
		surKit1.disabled = surKit2.disabled = surKit3.disabled = surKit4.disabled = false;
		surKitLoc = loadingSpecial('surKit');
		totSurKit = weightSurKit.value;
		document.getElementById("specialLoadPod" + surKitLoc).value = totSurKit;
	} else if(!numSurKit.checked) {
		document.getElementById("podSpecialLoadHdg").innerHTML = "";
		surKit1.disabled = surKit2.disabled = surKit3.disabled = surKit4.disabled = true;
		totSurKit = 0;
	}
	
	var special = +totLifeRaft + +totSurKit;
	if(special < 1) { special = 0; }
	return special;	
} // end function calcSpecial()

// Determines location of the special load
function loadingSpecial(id) {
	var specialLocation = 0;

	// Life raft
	if(id == 'lifeRaft') {
		var raft;
		var raft3 = document.getElementById("raft3");
		var raft4 = document.getElementById("raft4");
		for(i = 3; i < 5; i++) {
			raft = document.getElementById("raft" + i);
			if(raft.checked) {
					specialLocation += +raft.value;
			} // end if lifeRaftElements
		} // end for i
		
	// Survival kit
	} else if(id == 'surKit') {
		var surKitElements = document.forms['surKitForm'].elements[id];
		for(i = 0; i < surKitElements.length; i++) {
			if(surKitElements[i].checked) {
				specialLocation = surKitElements.value;
			} // end if
		} // end for i
		
	} // end if elseif id
	return specialLocation;
} // end loadingSpecial

// Calculates total payload. Checks if more or less than maximum.
// Shows red if over maximim permitted payload
function calcPayload() {
	var pax,zone,pod,maxPl,actPl;
	pax = document.getElementById("totPaxKgDef").value;
	zone = document.getElementById("totZoneKgTop").value;
	pod = document.getElementById("totPodKgTop").value;


	actPl = document.getElementById("actPlTop").value = +pax + +zone + +pod;
	maxPl = document.getElementById("maxPlTop").value;
	document.getElementById("actPlBottom").value = actPl;
	document.getElementById("maxPlBottom").value = maxPl;
	
	if(actPl > maxPl) {
		document.getElementById("actPlTop").style.backgroundColor = "#ff0000";
		document.getElementById("actPlTopTd").style.backgroundColor = "#ff0000";
		document.getElementById("maxPlTop").style.backgroundColor = "#ff0000";
		document.getElementById("maxPlTopTd").style.backgroundColor = "#ff0000";
		document.getElementById("actPlBottom").style.backgroundColor = "#ff0000";
		document.getElementById("actPlBottomTd").style.backgroundColor = "#ff0000";
		document.getElementById("maxPlBottom").style.backgroundColor = "#ff0000";
		document.getElementById("maxPlBottomTd").style.backgroundColor = "#ff0000";
	} else {
		document.getElementById("actPlTop").style.backgroundColor = "#00ff00";
		document.getElementById("actPlTopTd").style.backgroundColor = "#00ff00";
		document.getElementById("maxPlTop").style.backgroundColor = "#00ff00";
		document.getElementById("maxPlTopTd").style.backgroundColor = "#00ff00";
		document.getElementById("actPlBottom").style.backgroundColor = "#00ff00";
		document.getElementById("actPlBottomTd").style.backgroundColor = "#00ff00";
		document.getElementById("maxPlBottom").style.backgroundColor = "#00ff00";
		document.getElementById("maxPlBottomTd").style.backgroundColor = "#00ff00";
	}
} // end function calcPayload()

// Calculates the final weights, moment and CG
function calcMasterCG() {
	var weightItemKg = ['bewKg','fuelKg','wCpt','wFo','totPaxKgTop','totZoneKgTop','totPodKgTop'];
	var rampKg,taxiKg,tkofKg,ldgKg;
	var weightItemLb = ['bew','fuel','wCptLb','wFoLb','totPaxLb','totZoneLbTop','totPodLbTop'];
	var rampLb,taxiLb,tkofLb,ldgLb,rampArm,tkofArm,ldgArm,fuelUsedLb;
	var momentItem = ['momentBew','momentFuel','momentCpt','momentFo','totPaxMoment','totZoneMomentTop','totPodMomentTop'];
	var rampMoment,taxiMoment,tkofMoment,ldgMoment;
	
	rampKg = 0;
	var row = [];
	for(var i = 0, len = weightItemKg.length;i<len;i++) {
		row[i] = document.getElementById(weightItemKg[i]).value;
		rampKg = rampKg + +row[i];
	}
	rampKg = document.getElementById("rampKg").value = Math.round(rampKg);
	taxiKg = document.getElementById("taxiKg").value;
	tkofKg = rampKg - taxiKg;
	document.getElementById("tkofKg").value = tkofKg;
	fuelUsedKg = document.getElementById("fuelUsedKg").value;
	ldgKg = tkofKg - fuelUsedKg;
	document.getElementById("ldgKg").value = Math.round(ldgKg);
	
	rampLb = 0;
	var row = [];
	for(var i = 0, len = weightItemLb.length;i<len;i++) {
		row[i] = document.getElementById(weightItemLb[i]).value;
		rampLb = rampLb + +row[i];
	}
	rampLb = document.getElementById("rampLb").value = Math.round(rampLb);
	taxiLb = document.getElementById("taxiLb").value;
	tkofLb = rampLb - taxiLb;
	document.getElementById("tkofLb").value = tkofLb;
	fuelUsedLb = document.getElementById("fuelUsedLb").value;
	ldgLb = tkofLb - fuelUsedLb;
	document.getElementById("ldgLb").value = Math.round(ldgLb);
	
	rampMoment = 0;
	var row = [];
	for(var i = 0, len = momentItem.length;i<len;i++) {
		row[i] = document.getElementById(momentItem[i]).value;
		rampMoment = rampMoment + +row[i];
	}
	rampMoment = document.getElementById("rampMoment").value = Math.round(rampMoment*100)/100;
	taxiMoment = document.getElementById("taxiMoment").value;
	tkofMoment = rampMoment - taxiMoment;
	document.getElementById("tkofMoment").value = Math.round(tkofMoment*100)/100;
	fuelUsedMoment = document.getElementById("fuelUsedMoment").value;
	ldgMoment = tkofMoment - +fuelUsedMoment;
	document.getElementById("ldgMoment").value = Math.round(ldgMoment*100)/100;
	
	if(!rampMoment || rampMoment < 1) {
		rampArm = 0;
	} else {
		rampArm = Math.round(((rampMoment/rampLb)*1000)*100)/100;
	}
	
	tkofArm = Math.round(((tkofMoment/tkofLb)*1000)*100)/100;
	ldgArm = Math.round(((ldgMoment/ldgLb)*1000)*100)/100;
	
	document.getElementById("rampArm").value = rampArm;
	document.getElementById("tkofArm").value = tkofArm;
	document.getElementById("ldgArm").value = ldgArm;
	
	var weights = ["rampLb","tkofLb","ldgLb"];
	var arms = ["rampArm","tkofArm","ldgArm"];
	var len = weights.length;
	for(i = 0;i < len;i++) {
		var weight = document.getElementById(weights[i]).value;
		var arm = document.getElementById(arms[i]).value;
		checkCgEnvelope(weight,arm,weights[i],arms[i]);
		checkFinalWeights(weight,i,weights[i]);
	}
	cgEnvelope();
	calcSpeed(tkofLb,ldgLb);
} // end function calcMasterCG()

// Checking if weight for ghe given id is above limits. Shows red if not, yellow if within
function checkWeightLimits(limit,id) {
	var weight,colour;
	weight = document.getElementById(id).value;
	if(weight > limit) {
		colour = "#ff0000";
	} else {
		colour = "#ffff00";
	}
	document.getElementById(id).style.backgroundColor = colour;
	document.getElementById(id + "Td").style.backgroundColor = colour;
} // end function checkWeightLimits()

// Checking if final weights are within limits. Shows red if not, green if within
function checkFinalWeights(weight,phase,id) {
	var wLimits = [9097,9062,9000];
	var colour;
	if(weight > wLimits[phase]) {
		colour = "#ff0000";
	} else {
		colour = "#00ff00";
	}
	document.getElementById(id).style.backgroundColor = colour;
	document.getElementById(id + "Td").style.backgroundColor = colour;
} // end function checkFinalWeights()

// Calculates and check if CG is within limits for a given weight
function checkCgEnvelope(weight,cg,idWeight,idArm) {
	var wLimits = [4000,5500,8000,8750,9062,9062,9097];
	var armLimits = [179.6,179.6,193.37,199.15,200.23,204.35];
	var colour,weightRange,armRange,ratio,defineWeight,defineCg;
	
	if(weight > wLimits[0] && weight <= wLimits[1]) {
		if(cg < armLimits[0] || cg > armLimits[5]) {
			colour = "#ff0000";
		} else {
			colour = "#00ff00";
		}
	} else if(weight > wLimits[1] && weight <= wLimits[2]) {
		weightRange = wLimits[2] - wLimits[1];
		armRange = armLimits[2] - armLimits[1];
		ratio = weightRange/armRange;
		defineWeight = weight - wLimits[1];
		defineCg = armLimits[1] + (defineWeight/ratio);
		
		if(cg < defineCg || cg > armLimits[5]) {
			colour = "#ff0000";
		} else {
			colour = "#00ff00";
		}
	} else if(weight > wLimits[2] && weight <= wLimits[3]) {
		weightRange = wLimits[3] - wLimits[2];
		armRange = armLimits[3] - armLimits[2];
		ratio = weightRange/armRange;
		defineWeight = weight - wLimits[2];
		defineCg = armLimits[2] + (defineWeight/ratio);
		
		if(cg < defineCg || cg > armLimits[5]) {
			colour = "#ff0000";
		} else {
			colour = "#00ff00";
		}
	} else if(weight > wLimits[3] && weight <= wLimits[4]) {
		weightRange = wLimits[4] - wLimits[3];
		armRange = armLimits[4] - armLimits[3];
		ratio = weightRange/armRange;
		defineWeight = weight - wLimits[3];
		defineCg = armLimits[3] + (defineWeight/ratio);
		
		if(cg < defineCg || cg > armLimits[5]) {
			colour = "#ff0000";
		} else {
			colour = "#00ff00";
		}
	} else if(weight > wLimits[4] && weight <= wLimits[5]) {
		weightRange = wLimits[5] - wLimits[4];
		armRange = armLimits[5] - armLimits[4];
		ratio = weightRange/armRange;
		defineWeight = weight - wLimits[4];
		defineCg = armLimits[4] + (defineWeight/ratio);
		
		if(cg < defineCg || cg > armLimits[5]) {
			colour = "#ff0000";
		} else {
			colour = "#00ff00";
		}
	} else {
		colour ="#00ff00";
	}
	document.getElementById(idArm).style.backgroundColor = colour;
	document.getElementById(idArm + "Td").style.backgroundColor = colour;
} // end function checkCgEnelope()


// Calculates moment for the selected row
function calcMoment(weightId,armId,momentId) {
	var moment,weight,arm;
	weight = document.getElementById(weightId).value;
	arm = document.getElementById(armId).value;
	moment = Math.round((weight * arm / 1000)*100)/100;
	document.getElementById(momentId).value = moment;
} // end function calcMoment()

// Removes or installs seatrows and subtract or add seat weight and moment
function checkSeatConfig(rowNr) {
	var i = rowNr;

	var seatStateSingle = document.getElementById("row" + i + "single");
	var seatStateDouble = document.getElementById("row" + i + "double");
	var indPaxWght = document.getElementById("indPaxWght");
	var row = document.getElementById("row" + i);
	var rowTd = document.getElementById("row" + i + "Td");
	var rowwKg = document.getElementById("row" + i + "wKg");
	var rowwKgTd = document.getElementById("row" + i + "wKgTd");
	var rowwLb = document.getElementById("row" + i + "wLb");
	var rowwLbTd = document.getElementById("row" + i + "wLbTd");
	var rowMoment = document.getElementById("row" + i + "moment");
	var rowMomentTd = document.getElementById("row" + i + "momentTd");
	var rowSingle = document.getElementById("row" + i + "single");
	var rowDouble = document.getElementById("row" + i + "double");
	var indPaxTable = document.getElementById("indPaxTable" + i);
	var rowSeat1 = document.getElementById("row" + i + "seat1");
	var rowSeat2 = document.getElementById("row" + i + "seat2");
	var rowSeat3 = document.getElementById("row" + i + "seat3");
	var rowSeat1Td = document.getElementById("row" + i + "seat1Td");
	var rowSeat2Td = document.getElementById("row" + i + "seat2Td");
	var rowSeat3Td = document.getElementById("row" + i + "seat3Td");
	var rowSeat1LocalKey = "row" + i + "seat1";
	var rowSeat2LocalKey = "row" + i + "seat2";
	var rowSeat3LocalKey = "row" + i + "seat3";
	
	if(i == 4) {
		if(!seatStateSingle.checked && !seatStateDouble.checked) {
			if(!indPaxWght.checked) {
				row.value = "";
				row.disabled = true;
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.value = "";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";
				rowwLb.style.backgroundColor = "#efefef";
				rowwLbTd.style.backgroundColor = "#efefef";
				rowMoment.style.backgroundColor = "#efefef";
				rowMomentTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
			
			} else if(indPaxWght.checked) {
				row.value = "";
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.value = 0;
				localStorage.setItem("row" + i + "wKg",0);
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";
				rowwLb.style.backgroundColor = "#efefef";
				rowwLbTd.style.backgroundColor = "#efefef";
				rowMoment.style.backgroundColor = "#efefef";
				rowMomentTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				localStorage.setItem(rowSeat1LocalKey,"");
				localStorage.setItem(rowSeat2LocalKey,"");
				localStorage.setItem(rowSeat3LocalKey,"");
			
			}
		} else if(seatStateSingle.checked && seatStateDouble.checked) {
			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";
				
				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				
			} else if(indPaxWght.checked) {
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";
				
				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat1.disabled = rowSeat2.disabled = rowSeat3.disabled = false;
				rowSeat1.style.backgroundColor = rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#ffff00";
				rowSeat1Td.style.backgroundColor = rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#ffff00";
				
			}
			rowwLb.style.backgroundColor = "#00ff00";
			rowwLbTd.style.backgroundColor = "#00ff00";
			rowMoment.style.backgroundColor = "#00ff00";
			rowMomentTd.style.backgroundColor = "#00ff00";
		} else if(seatStateSingle.checked && !seatStateDouble.checked) {
			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";

			} else if(indPaxWght.checked) {
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";
				
				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat2.value = rowSeat3.value = "";
				rowSeat1.disabled = false;
				rowSeat2.disabled = true;
				rowSeat3.disabled = true;
				rowSeat1.style.backgroundColor = "#ffff00";
				rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#efefef";
				rowSeat1Td.style.backgroundColor = "#ffff00";
				rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#efefef";
				localStorage.setItem(rowSeat2LocalKey,"");
				localStorage.setItem(rowSeat3LocalKey,"");
				
			}
			rowwLb.style.backgroundColor = "#00ff00";
			rowwLbTd.style.backgroundColor = "#00ff00";
			rowMoment.style.backgroundColor = "#00ff00";
			rowMomentTd.style.backgroundColor = "#00ff00";
		} else if(seatStateDouble.checked && !seatStateSingle.checked) {
			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";
				
				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				
			} else if(indPaxWght.checked) {
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";
				
				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat1.value = "";
				rowSeat1.disabled = true;
				rowSeat2.disabled = false;
				rowSeat3.disabled = false;
				rowSeat1.style.backgroundColor = "#efefef";
				rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#ffff00";
				rowSeat1Td.style.backgroundColor = "#efefef";
				rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#ffff00";
				localStorage.setItem(rowSeat1LocalKey,"");
				
			}
			rowwLb.style.backgroundColor = "#00ff00";
			rowwLbTd.style.backgroundColor = "#00ff00";
			rowMoment.style.backgroundColor = "#00ff00";
			rowMomentTd.style.backgroundColor = "#00ff00";
		}
	} else if(i == 5) {
		if(!indPaxWght.checked) {
			row.disabled = false;
			row.style.backgroundColor = "#ffff00";
			rowTd.style.backgroundColor = "#ffff00";
			rowwKg.disabled = true;
			rowwKg.style.backgroundColor = "#efefef";
			rowwKgTd.style.backgroundColor = "#efefef";

			indPaxTable.style.display="none";
			rowwKg.style.display="initial";
			rowSeat1.value = rowSeat2.value = rowSeat3.value = "";

		} else if(indPaxWght.checked) {
			row.value = "";
			row.disabled = true;	
			row.style.backgroundColor = "#efefef";
			rowTd.style.backgroundColor = "#efefef";
			rowwKg.disabled = false;
			rowwKg.style.backgroundColor = "#ffff00";
			rowwKgTd.style.backgroundColor = "#ffff00";

			indPaxTable.style.display="initial";
			rowwKg.style.display="none";
			rowSeat1.disabled = false;
			rowSeat2.disabled = false;
			rowSeat3.disabled = false;

		}
		rowwLb.style.backgroundColor = "#00ff00";
		rowwLbTd.style.backgroundColor = "#00ff00";
		rowMoment.style.backgroundColor = "#00ff00";
		rowMomentTd.style.backgroundColor = "#00ff00";
	} else {
		if(seatStateSingle.checked && seatStateDouble.checked) {
			rowSingle.style.backgroundColor = "#000000";
			rowDouble.style.backgroundColor = "#000000";

			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";

			} else if(indPaxWght.checked) {
				row.value = "";
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";
				
				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat1.disabled = rowSeat2.disabled = rowSeat3.disabled = false;
				rowSeat1.style.backgroundColor = rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#ffff00";
				rowSeat1Td.style.backgroundColor = rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#ffff00";
				
			}
		} else if(!seatStateSingle.checked && !seatStateDouble.checked) {
			rowSingle.style.backgroundColor = "#ff0000";
			rowDouble.style.backgroundColor = "#ff0000";

			if(!indPaxWght.checked) {
				row.value = 0;
				row.disabled = true;
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";

			} else if(indPaxWght.checked) {
				row.disabled = true;
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = true;
				rowwKg.value = 0;
				localStorage.setItem("row" + i + "wKg",0);
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				localStorage.setItem(rowSeat1LocalKey,"");
				localStorage.setItem(rowSeat2LocalKey,"");
				localStorage.setItem(rowSeat3LocalKey,"");
			}
		} else if(!seatStateSingle.checked && seatStateDouble.checked) {
			rowSingle.style.backgroundColor = "#ff0000";
			rowDouble.style.backgroundColor = "#000000";

			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";

				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				
			} else if(indPaxWght.checked) {
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";

				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat1.value = "";
				rowSeat1.disabled = true;
				rowSeat2.disabled = rowSeat3.disabled = false;
				rowSeat1.style.backgroundColor = "#efefef"; 
				rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#ffff00";
				rowSeat1Td.style.backgroundColor = "#efefef"; 
				rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#ffff00";
				localStorage.setItem(rowSeat1LocalKey,"");
			}
		} else if(!seatStateDouble.checked && seatStateSingle.checked) {
			rowSingle.style.backgroundColor = "#000000";
			rowDouble.style.backgroundColor = "#ff0000";

			if(!indPaxWght.checked) {
				row.disabled = false;
				row.style.backgroundColor = "#ffff00";
				rowTd.style.backgroundColor = "#ffff00";
				rowwKg.disabled = true;
				rowwKg.style.backgroundColor = "#efefef";
				rowwKgTd.style.backgroundColor = "#efefef";
				
				indPaxTable.style.display="none";
				rowwKg.style.display="initial";
				rowSeat1.value = rowSeat2.value = rowSeat3.value = "";
				
			} else if(indPaxWght.checked) {
				row.disabled = true;	
				row.style.backgroundColor = "#efefef";
				rowTd.style.backgroundColor = "#efefef";
				rowwKg.disabled = false;
				rowwKg.style.backgroundColor = "#ffff00";
				rowwKgTd.style.backgroundColor = "#ffff00";
				
				indPaxTable.style.display="initial";
				rowwKg.style.display="none";
				rowSeat2.value = rowSeat3.value = "";
				rowSeat1.disabled = false;
				rowSeat2.disabled = rowSeat3.disabled = true;
				rowSeat1.style.backgroundColor = "#ffff00";
				rowSeat2.style.backgroundColor = rowSeat3.style.backgroundColor = "#efefef";
				rowSeat1Td.style.backgroundColor = "#ffff00";
				rowSeat2Td.style.backgroundColor = rowSeat3Td.style.backgroundColor = "#efefef";
				localStorage.setItem(rowSeat2LocalKey,"");
				localStorage.setItem(rowSeat3LocalKey,"");
				
			}
		}
		rowwLb.style.backgroundColor = "#00ff00";
		rowwLbTd.style.backgroundColor = "#00ff00";
		rowMoment.style.backgroundColor = "#00ff00";
		rowMomentTd.style.backgroundColor = "#00ff00";
	}
} // end function checkSeatConfig()

// Converting kg to lb
function kgToLb(kgId,lbId) {
	var kg,lb;
	kg = document.getElementById(kgId).value;
	lb = Math.round(kg * 2.20462);
	document.getElementById(lbId).value = lb;	
} // end function kgToLb()

// Converting lb to kg
function lbToKg(kgId,lbId) {
	var kg,lb;
	lb = document.getElementById(lbId).value;
	kg = Math.round(lb / 2.20462);
	document.getElementById(kgId).value = kg;	
} // end function lbToKg()


function getNonPayload() {
	var seatWeightKg = 0;
	var rowSingle = 0;
	var rowDouble = 0;
	for(i=1;i<5;i++) {
		rowSingle += +document.getElementById("row" + i + "single").value;
		rowDouble += +document.getElementById("row" + i + "double").value;
	}
	seatWeightKg = +rowSingle + +rowDouble;
	
	var specialLoad = calcSpecial();
//	var lifeRaft = specialLoad[0]*2;
	var nonPayload = +seatWeightKg + +specialLoad;
	return nonPayload;
} // getNonPayload()

// Calculates lift off, glide, ref and va speeds
function calcSpeed(tkofWeight,ldgWeight) {
	var weightRange,glideRange,VaRange,refRange,ratioGlide,defineWeightGlide,defineGlide,defineVa,defineRef;
	var ratioVa,defineWeightVa,ratioRef,defineWeightRef,liftRange,ratioLift,defineWeightLift,defineLift;
	
	// Calculate glide speed
	var glidePoh = [96,95,87,79,71];
	var weightsGlide = [9062,8750,7500,6250,5000];
	if(tkofWeight >= weightsGlide[4] && tkofWeight <= weightsGlide[3]) {
		weightRange = weightsGlide[3] - weightsGlide[4];
		glideRange = glidePoh[3] - glidePoh[4];
		ratioGlide = weightRange/glideRange;

		defineWeightGlide = +tkofWeight - weightsGlide[4];
		defineGlide = glidePoh[4] + (defineWeightGlide/ratioGlide);
	} else if(tkofWeight > weightsGlide[3] && tkofWeight <= weightsGlide[2]) {
		weightRange = weightsGlide[2] - weightsGlide[3];
		glideRange = glidePoh[2] - glidePoh[3];
		ratioGlide = weightRange/glideRange;

		defineWeightGlide = +tkofWeight - weightsGlide[3];
		defineGlide = glidePoh[3] + (defineWeightGlide/ratioGlide);
	} else if(tkofWeight > weightsGlide[2] && tkofWeight <= weightsGlide[1]) {
		weightRange = weightsGlide[1] - weightsGlide[2];
		glideRange = glidePoh[1] - glidePoh[2];
		ratioGlide = weightRange/glideRange;

		defineWeightGlide = +tkofWeight - weightsGlide[2];
		defineGlide = glidePoh[2] + (defineWeightGlide/ratioGlide);
	} else if(tkofWeight > weightsGlide[1] && tkofWeight <= weightsGlide[0]) {
		weightRange = weightsGlide[0] - weightsGlide[1];
		glideRange = glidePoh[0] - glidePoh[1];
		ratioGlide = weightRange/glideRange;

		defineWeightGlide = +tkofWeight - weightsGlide[1];
		defineGlide = glidePoh[1] + (defineWeightGlide/ratioGlide);
	}
	
	if(tkofWeight < 5000 || tkofWeight > 9062) {
		document.getElementById("glideSpeed").innerHTML = "---";
		document.getElementById("vaSpeed").innerHTML = "---";
	} else {
		if(defineGlide < 71) {
			document.getElementById("glideSpeed").innerHTML = 71;
		} else {
			document.getElementById("glideSpeed").innerHTML = Math.round(defineGlide);
		}

	}

	// Calculate Va speed
	var VaPoh = [143,137,125,112];
	var weightsVa = [9062,7500,6250,5000];
	if(tkofWeight >= weightsVa[3] && tkofWeight <= weightsVa[2]) {
		weightRange = weightsVa[2] - weightsVa[3];
		VaRange = VaPoh[2] - VaPoh[3];
		ratioVa = weightRange/VaRange;

		defineWeightVa = +tkofWeight - weightsVa[3];
		defineVa = VaPoh[3] + (defineWeightVa/ratioVa);
	} else if(tkofWeight > weightsVa[2] && tkofWeight <= weightsVa[1]) {
		weightRange = weightsVa[1] - weightsVa[2];
		VaRange = VaPoh[1] - VaPoh[2];
		ratioVa = weightRange/VaRange;

		defineWeightVa = +tkofWeight - weightsVa[2];
		defineVa = VaPoh[2] + (defineWeightVa/ratioVa);
	} else if(tkofWeight > weightsVa[1] && tkofWeight <= weightsVa[0]) {
		weightRange = weightsVa[0] - weightsVa[1];
		VaRange = VaPoh[0] - VaPoh[1];
		ratioVa = weightRange/VaRange;

		defineWeightVa = +tkofWeight - weightsVa[1];
		defineVa = VaPoh[1] + (defineWeightVa/ratioVa);
	}
	
	if(tkofWeight < 5000 || tkofWeight > 9062) {
		document.getElementById("vaSpeed").innerHTML = "---";
	} else {
			document.getElementById("vaSpeed").innerHTML = Math.round(defineVa);
	}

	// Calculate Vref speed
	var refPoh = [80,79,78,75,73,71];
	var weightsLdg = [9000,8750,8500,8000,7500,7000];
	if(ldgWeight >= weightsLdg[5] && ldgWeight <= weightsLdg[4]) {
		weightRange = weightsLdg[4] - weightsLdg[5];
		refRange = refPoh[4] - refPoh[5];
		ratioRef = weightRange/refRange;

		defineWeightRef = +ldgWeight - weightsLdg[5];
		defineRef = refPoh[5] + (defineWeightRef/ratioRef);
	} else if(ldgWeight > weightsLdg[4] && ldgWeight <= weightsLdg[3]) {
		weightRange = weightsLdg[3] - weightsLdg[4];
		refRange = refPoh[3] - refPoh[4];
		ratioRef = weightRange/refRange;

		defineWeightRef = +ldgWeight - weightsLdg[4];
		defineRef = refPoh[4] + (defineWeightRef/ratioRef);
	} else if(ldgWeight > weightsLdg[3] && ldgWeight <= weightsLdg[2]) {
		weightRange = weightsLdg[2] - weightsLdg[3];
		refRange = refPoh[2] - refPoh[3];
		ratioRef = weightRange/refRange;

		defineWeightRef = +ldgWeight - weightsLdg[3];
		defineRef = refPoh[3] + (defineWeightRef/ratioRef);
	} else if(ldgWeight > weightsLdg[2] && ldgWeight <= weightsLdg[1]) {
		weightRange = weightsLdg[1] - weightsLdg[2];
		refRange = refPoh[1] - refPoh[2];
		ratioRef = weightRange/refRange;

		defineWeightRef = +ldgWeight - weightsLdg[2];
		defineRef = refPoh[2] + (defineWeightRef/ratioRef);
	} else if(ldgWeight > weightsLdg[1] && ldgWeight <= weightsLdg[0]) {
		weightRange = weightsLdg[0] - weightsLdg[1];
		refRange = refPoh[0] - refPoh[1];
		ratioRef = weightRange/refRange;

		defineWeightRef = +ldgWeight - weightsLdg[1];
		defineRef = refPoh[1] + (defineWeightRef/ratioRef);
	}
	
	if(ldgWeight < 5000 || ldgWeight > 9000) {
		document.getElementById("vrefSpeed").innerHTML = "---";
	} else {
		if(ldgWeight < 7000) {
			document.getElementById("vrefSpeed").innerHTML = 71;
		} else {
			document.getElementById("vrefSpeed").innerHTML = Math.round(defineRef);
		}
	}
	
	// Calculate lift off speed
	var liftPoh = [71,70,67,64,61];
	var liftWeightPoh = [9062,8750,8300,7800,7300];
	if(tkofWeight >= liftWeightPoh[4] && tkofWeight <= liftWeightPoh[3]) {
		weightRange = liftWeightPoh[3] - liftWeightPoh[4];
		liftRange = liftPoh[3] - liftPoh[4];
		ratioLift = weightRange/liftRange;

		defineWeightLift = +tkofWeight - liftWeightPoh[4];
		defineLift = liftPoh[4] + (defineWeightLift/ratioLift);
	} else if(tkofWeight > liftWeightPoh[3] && tkofWeight <= liftWeightPoh[2]) {
		weightRange = liftWeightPoh[2] - liftWeightPoh[3];
		liftRange = liftPoh[2] - liftPoh[3];
		ratioLift = weightRange/liftRange;

		defineWeightLift = +tkofWeight - liftWeightPoh[3];
		defineLift = liftPoh[3] + (defineWeightLift/ratioLift);
	} else if(tkofWeight > liftWeightPoh[2] && tkofWeight <= liftWeightPoh[1]) {
		weightRange = liftWeightPoh[1] - liftWeightPoh[2];
		liftRange = liftPoh[1] - liftPoh[2];
		ratioLift = weightRange/liftRange;

		defineWeightLift = +tkofWeight - liftWeightPoh[2];
		defineLift = liftPoh[2] + (defineWeightLift/ratioLift);
	} else if(tkofWeight > liftWeightPoh[1] && tkofWeight <= liftWeightPoh[0]) {
		weightRange = liftWeightPoh[0] - liftWeightPoh[1];
		liftRange = liftPoh[0] - liftPoh[1];
		ratioLift = weightRange/liftRange;

		defineWeightLift = +tkofWeight - liftWeightPoh[1];
		defineLift = liftPoh[1] + (defineWeightLift/ratioLift);
	}
	
	if(tkofWeight < 5000 || tkofWeight > 9062) {
		document.getElementById("liftSpeed").innerHTML = "---";
	} else {
		if(tkofWeight < 7300) {
			document.getElementById("liftSpeed").innerHTML = 61;
		} else {
			document.getElementById("liftSpeed").innerHTML = Math.round(defineLift);
		}
	}
	
} // end function calcSpeed()

// Changes value of checkbox
function statusSpecial(id) {
	if(id == "numLifeRaft") {
		elementWeight = "weightLifeRaft";
		elementWeightTd = "weightLifeRaftTd";
	} else if(id == "numSurKit") {
		elementWeight = "weightSurKit";
		elementWeightTd = "weightSurKitTd";
	}
	var elementId = document.getElementById(id);
	var localValue = localStorage.getItem(id);
	var element = document.getElementById(elementWeight);
	var elementTd = document.getElementById(elementWeightTd);
	if(localValue === "true" || elementId.checked) {
			element.disabled = false;
			element.style.backgroundColor = "#ffff00";
			elementTd.style.backgroundColor = "#ffff00";
	} else if(localValue === "false" || !elementId.checked) {
		if(id =="numLifeRaft") {
			element.disabled = true;
			element.style.backgroundColor = "#efefef";
			elementTd.style.backgroundColor = "#efefef";
			element.value = 0;
		} else if(id =="numSurKit") {
			element.disabled = true;
			element.style.backgroundColor = "#efefef";
			elementTd.style.backgroundColor = "#efefef";
			element.value = 0;
		}
	}
} // end function statusSpecial()

// Makes the graphical cg envelope
function cgEnvelope() {
//	var wLimits = [4000,5500,8000,8750,9062,9062,9097];
//	var armLimits = [179.6,179.6,193.37,199.15,200.23,204.35,200.5];
	var weights = ["tkofLb","ldgLb"];
	var arms = ["tkofArm","ldgArm"];
	var weight = [];
	var arm = [];
	
	for(i=0;i<weights.length;i++) {
		weight[i] = document.getElementById(weights[i]).value;
		arm[i] = document.getElementById(arms[i]).value;
	}
	
	
	var envelope = document.getElementById("cgEnvelope");
	var points = envelope.getContext("2d");

	// Prepares the canvas	
	points.beginPath();
	points.clearRect(0,0,envelope.width,envelope.height);
	points.fillStyle = "#fff";
	points.fillRect(0,0,envelope.width,envelope.height);
	
	// Makes the limit lines
	points.beginPath();
	points.moveTo(10*5,55*3);
	points.lineTo(10*5,(55-15)*3);
	points.lineTo(23.77*5,(55-40)*3);
	points.lineTo(29.55*5,(55-47.5)*3);
	points.lineTo(30.63*5,(55-50.62)*3);
	points.lineTo(34.75*5,(55-50.62)*3);
	points.lineTo(34.75*5,55*3);
	points.lineTo(10*5,55*3);
	points.fillStyle = "#0f0";
	points.fill();
	points.stroke();
	
	// Defines the grey area
	points.beginPath();
	points.fillStyle = "#ff0";
	points.fillRect(33.4*5,14,6,50*3);
	
	// Sets weights
	points.fillStyle = "#000";
	points.font = "12px Arial";
	points.fillText("5000",18,(55-14)*3);
	points.fillText("8000",85,(55-39)*3);
	points.fillText("8750",110,(55-46.5)*3);
	points.fillText("9062",120,(55-49.62)*3);
	
//	var armLimits = [179.6,179.6,193.37,199.15,200.23,204.35];
	
	// Sets forward cg limit
	points.fillText("179.6",35,180);

	// Sets aft cg limit
	points.fillText("204.35",159,180);
	
	// Sets info text
	points.fillText("Click/tap image to remove",45,195);

	// Makes the actual calculation of cg point within envelope
	len = weight.length;
	for(i = 0;i < len;i++) {
		weightDef = (55 - (weight[i] - 4000)/100)*3;
		armDef = (10 + +arm[i] - 179.6)*5;
		
		points.beginPath();
		points.arc(armDef,weightDef,2,0,2*Math.PI);
		points.fillStyle = "#000000";
		points.fill();
	}
} // end function cgEnvelope()

// Toggles state of hidden/visible layer
function showHide(id,command) {
	document.getElementById(id).style.visibility = command;
} // end function showHide()


// Fuel calculation
function fuelCalc() {
	var needed = document.getElementById("fuelNeeded").value;
	var leftTank = document.getElementById("leftTank").value;
	var rightTank = document.getElementById("rightTank").value;
	var leftTankUplift57 = Math.round(((needed/2)-leftTank)*0.57);
	var rightTankUplift57 = Math.round(((needed/2)-rightTank)*0.57);
	var leftTankUplift60 = Math.round(((needed/2)-leftTank)*0.6);
	var rightTankUplift60 = Math.round(((needed/2)-rightTank)*0.6);
	var totalUpliftLiters57 = +leftTankUplift57 + +rightTankUplift57;
	var totalUpliftLiters60 = +leftTankUplift60 + +rightTankUplift60;
	var totalUpliftLb = +((needed/2)-leftTank) + +((needed/2)-rightTank);
	document.getElementById("leftTankUpliftLb").value = (needed/2)-leftTank;
	document.getElementById("rightTankUpliftLb").value  = (needed/2)-rightTank;
	document.getElementById("leftTankUplift57").value = leftTankUplift57;
	document.getElementById("rightTankUplift57").value  = rightTankUplift57;
	document.getElementById("leftTankUplift60").value = leftTankUplift60;
	document.getElementById("rightTankUplift60").value  = rightTankUplift60;
	document.getElementById("totalUpliftLiters57").innerHTML = totalUpliftLiters57;
	document.getElementById("totalUpliftLiters60").innerHTML = totalUpliftLiters60;
	document.getElementById("totalUpliftLb").innerHTML = totalUpliftLb;
	
} // end function fuelCalc()

function setLocal(key, value) {
	localStorage.setItem(key,value);
}

function getLocal(cname) {
	value = localStorage.getItem(cname);
	return value;
}

function checkLocals() {
	for(i=0;i<localStorage.length;i++) {
		localKey = localStorage.key(i);
		localValue = localStorage.getItem(localKey);
		if(localValue != null) {
			if(localKey == 'surKitPod') {
				document.getElementById('surKitPod' + localValue).checked = true;
			} else if(localKey == 'indPaxWght' || localKey == 'row1single' || localKey == 'row1double' || localKey == 'row2single' ||
				localKey == 'row2double' || localKey == 'row3single' || localKey == 'row3double' || localKey == 'row4single' ||
				localKey == 'row4double'  || localKey == 'numLifeRaft' || localKey == 'numSurKit' ||
				localKey == 'raft3' || localKey == 'raft4') {
				if(localValue == "false") {
					document.getElementById(localKey).checked = false;
				} else if(localValue == "true") {
					document.getElementById(localKey).checked = true;
				}
			} else {

				document.getElementById(localKey).value = localValue;
	
				if(localKey == 'bew') {
					lbToKg('bewKg','bew');
					calcMoment('bew','armBew','momentBew');
				} else if(localKey == 'armBew') {
					calcMoment('bew','armBew','momentBew');
				} else if(localKey == 'wCpt' || localKey == 'wFo') {
					if(localKey == 'wCpt') {
						kgToLb('wCpt','wCptLb');
						calcMoment('wCptLb','armCpt','momentCpt');
					} else if(localKey == 'wFo') {
						kgToLb('wFo','wFoLb');
						calcMoment('wFoLb','armFo','momentFo');
					}
					calcPilots();
				}
			} // end if localKey == arrays
		
		} else {
			document.getElementById(localKey).value = 0;
		}
	}
//	var special = ['numLifeRaft','numSurKit','numSurf'];
	var special = ['numLifeRaft','numSurKit'];
	for(i=0;i<special.length;i++) {
		statusSpecial(special[i]);
	}
	calcPax();
	calcCgPod();
	calcCgCargoZone();
	lbToKg('fuelKg','fuel');
	calcMoment('fuelUsedLb','fuelUsedArm','fuelUsedMoment');
	calcMoment('fuel','armFuel','momentFuel');
} // end function checkLocals()


// Reset fields
function reset() {
	var savedPax = ['a','c','i','crw'];
	var savedFields = ['fuelUsedLb','totNumPaxDef','totPaxKgDef','avgPaxKg','avgPaxLb'];
	var savedWeights = ['row','rowKg','zone','pod'];
	var checkboxFalse = ['indPaxWght']; //,'row4single','row4double'];
	var id;

		for(i=0;i<savedPax.length;i++) {
			document.getElementById(savedPax[i]).value = "";
		}
		for(i=0;i<savedFields.length;i++) {
			document.getElementById(savedFields[i]).value = "0";
		}
		for(i=0;i<checkboxFalse.length;i++) {
			document.getElementById(checkboxFalse[i]).checked = false;
		}
		for(i=0;i<savedWeights.length;i++) {
			if(savedWeights[i] == 'row') {
				max = 6;
				end = "";
			} else if(savedWeights[i] == 'rowKg') {
				savedWeights[i] = 'row';
				max = 6;
				end = "wKg";
			} else if(savedWeights[i] == 'zone') {
				max = 7;
				end = "Kg";
			} else if(savedWeights[i] == 'pod') {
				max = 5;
				end = "Kg";
			}
			for(num = 1;num<max;num++) {
				id = savedWeights[i] + num + end;
				document.getElementById(id).value = "0";
			}
		}
	resetLocals();
	lbToKg('fuelKg','fuel');
	calcMoment('fuel','armFuel','momentFuel');
	calcMoment('fuelUsedLb','fuelUsedArm','fuelUsedMoment');
	calcMoment('totPaxLb','totPaxArm','totPaxMoment');
	calcMoment('totZoneLbTop','totZoneArmTop','totZoneMomentTop');
	calcMoment('totPodLbTop','totPodArmTop','totPodMomentTop');
	calcMoment('rampLb','rampArm','rampMoment');
	checkCheck();
	calcPax();
	calcCgCargoZone();
	calcCgPod();
	aircraftDefine();
} // end function reset()

function resetLocals() {
	var pax = ['a','c','i','crw'];
	var keys = ['fuelUsedLb','totNumPaxDef','totPaxKgDef','avgPaxKg','avgPaxLb',
		'pod1Kg','pod2Kg','pod3Kg','pod4Kg','pod1Lb','pod2Lb','pod3Lb','pod4Lb',
		'row1','row1wKg','row2','row2wKg','row3','row3wKg','row4','row4wKg','row5','row5wKg',
		'row1seat1','row1seat2','row1seat3','row2seat1','row2seat2','row2seat3',
		'row3seat1','row3seat2','row3seat3','row4seat1','row4seat2','row4seat3',
		'row5seat1','row5seat2','row5seat3',
		'zone1Kg','zone2Kg','zone3Kg','zone4Kg','zone5Kg','zone6Kg',
		'zone1Lb','zone2Lb','zone3Lb','zone4Lb','zone5Lb','zone6Lb'];
	var checkboxFalse = ['indPaxWght'];

	for(i=0;i < pax.length;i++) {
		localStorage.setItem(pax[i],"");
	}
	
	for(i=0;i < keys.length;i++) {
		localStorage.setItem(keys[i],"0");
	}

	for(i=0;i < checkboxFalse.length;i++) {
		localStorage.setItem(checkboxFalse[i],false);
	}
} // end function resetLocals()

function resetAll() {
} // end function resetAll

function showCargo() {
	var diagram = document.getElementById("cargo");
	var points = diagram.getContext("2d");
	
	// set the canvas dimensions
	points.beginPath();
	points.clearRect(0,0,diagram.width,diagram.height);
	points.fillStyle = "#fff";
	points.fillRect(0,0,diagram.width,diagram.height);
	
	// make the fuselage
	points.beginPath();
	points.moveTo(20,0);
	points.lineTo(70,0);
	points.lineTo(80,55);
	points.lineTo(80,182);
	points.lineTo(70,256);
	points.lineTo(20,256);
	points.lineTo(10,182);
	points.lineTo(10,55);
	points.lineTo(20,0);
	points.stroke();
	 
	 // setting zones
	 points.beginPath();
	 points.moveTo(15.2,18);
	 points.lineTo(74.8,18);
	 points.moveTo(10,55.4);
	 points.lineTo(80,55.4);
	 points.moveTo(10,88.7);
	 points.lineTo(80,88.7);
	 points.moveTo(10,146.8);
	 points.lineTo(80,146.8);
	 points.moveTo(10,182);
	 points.lineTo(80,182);
	 points.moveTo(13.4,207);
	 points.lineTo(76.6,207);
	 points.moveTo(15,232);
	 points.lineTo(75,232);
	 points.moveTo(20,256);
	 points.lineTo(70,256);
	 
	 // pilot seats
	 points.moveTo(25,25.5);
	 points.lineTo(35,25.5);
	 points.lineTo(35,45.5);
	 points.lineTo(25,45.5);
	 points.lineTo(25,25.5);
 
	 points.moveTo(55,25.5);
	 points.lineTo(65,25.5);
	 points.lineTo(65,45.5);
	 points.lineTo(55,45.5);
	 points.lineTo(55,25.5);
	 
	 // windows and doors
	 points.moveTo(10,65);
	 points.lineTo(12,65);
	 points.lineTo(12,80);
	 points.lineTo(10,80);
 
	 points.moveTo(10,95);
	 points.lineTo(12,95);
	 points.lineTo(12,115);
	 points.lineTo(10,115);
 
	 points.moveTo(10,124);
	 points.lineTo(12,124);
	 points.lineTo(12,144);
	 points.lineTo(10,144);
 
	 points.moveTo(10,158);
	 points.lineTo(12,158);
	 points.lineTo(12,178);
	 points.lineTo(10,178);
 
	 points.moveTo(11,187);
	 points.lineTo(13,186);
	 points.lineTo(15,203);
	 points.lineTo(12,204);
 
	 points.moveTo(14,212);
	 points.lineTo(16,213);
	 points.lineTo(18,226);
	 points.lineTo(15,227);
 
	 points.moveTo(17,237);
	 points.lineTo(20,238);
	 points.lineTo(21,248);
	 points.lineTo(18,249);
	 
	 // cargo door
	 points.moveTo(10,182);
	 points.lineTo(6,182);
	 points.lineTo(12,232);
	 points.lineTo(15,231);
	 
	 points.stroke();
	 
	// make zone numbers
	 points.fillStyle = "#000";
	 points.font = "12px Arial";
	 points.fillText("1-172.1",25,76);
	 points.fillText("2-217.8",25,122);
	 points.fillText("3-264.4",25,168);
	 points.fillText("4-294.5",25,199);
	 points.fillText("5-319.5",25,224);
	 points.fillText("6-344.0",25,248);
	 
	 points.fillText("118.0",80,22);
	 points.fillText("155.4",90,59);
	 points.fillText("188.7",90,93);
	 points.fillText("246.8",90,153);
	 points.fillText("282.0",90,186);
	 points.fillText("307.0",87,211);
	 points.fillText("332.0",84,236);
	 points.fillText("356.0",80,260);
} // end function showCargo()
