function NM_onload()
{
	document.getElementById("fldLocation0").focus();
	SetRegs();
    
    function callAnothePage()
             {
                window.location = "legal.html";
             }
}

function SetRegs()
{
	var bCustom = false;
	
	switch(GetRadValue(document.formRegs.radRegs)) {
		case "osha" : nexp = { day:28800, crit:90, action:85, exrate:5 }; break;
		case "niosh" : nexp = { day:28800, crit:85, action:85, exrate:3 }; break;
		case "dod3" : nexp = { day:28800, crit:85, action:85, exrate:3 }; break;
		case "dod4" : nexp = { day:28800, crit:85, action:85, exrate:4 }; break;
		case "eu" : nexp = { day:28800, crit:85, action:80, exrate:3 }; break;
		
		default : 
			bCustom = true;
			nexp.day = Number(document.getElementById("listCritTime").value) * 3600;
			nexp.crit = Number(document.getElementById("listCritLevel").value);
			nexp.action = Number(document.getElementById("listActionLevel").value);
			nexp.exrate = Number(document.getElementById("listExRate").value);
	}
	
	if(!bCustom) {
		document.getElementById("listCritTime").value = Number(nexp.day / 3600).toFixed(0);
		document.getElementById("listCritLevel").value = nexp.crit;
		document.getElementById("listActionLevel").value = nexp.action;
		document.getElementById("listExRate").value = nexp.exrate;
	}

	document.getElementById("divParams").className = bCustom ? "params" : "paramsoff";

	document.getElementById("listCritTime").disabled = !bCustom;
	document.getElementById("listCritLevel").disabled = !bCustom;
	document.getElementById("listActionLevel").disabled = !bCustom;
	document.getElementById("listExRate").disabled = !bCustom;

	calcdose();
}

function ZeroPad(n)
{
	sPad = n.toFixed(0);
	if(sPad.length == 1)
		sPad = "0" + sPad;
		
	return sPad;
}

function calcdose()
{
	var aflLev = [];
	var aflTime = [];
	
	var iLine = 0;
	
	while(document.getElementById("fldLocation" + iLine) != null) {
		aflLev.push(Number(document.getElementById("fldLevel" + iLine).value));
		aflTime.push(Number(document.getElementById("fldTimeHr" + iLine).value) * 3600 + Number(document.getElementById("fldTimeMin" + iLine).value) * 60);
		iLine++;
	}
	
	if(CalcExposure(aflLev,aflTime)) {
		iLine = 0;
		while(document.getElementById("fldLocation" + iLine) != null) {
			if(nexp_res_lines[iLine].valid) {
				document.getElementById("divDose" + iLine).className = nexp_res_lines[iLine].actionlevel == 2 ? "secondaction" : nexp_res_lines[iLine].actionlevel == 1 ? "firstaction" : "";
				document.getElementById("divDose" + iLine).innerHTML = nexp_res_lines[iLine].dose.toFixed(1) + "%";
				document.getElementById("fldDose" + iLine).value = nexp_res_lines[iLine].dose.toFixed(1);
			}
			else {
				document.getElementById("divDose" + iLine).innerHTML = "";
				document.getElementById("fldDose" + iLine).value = "";
			}
			iLine++;
		}
		
		var nHours = Math.floor(nexp_res.time / 3600);
		var nMins = ((nexp_res.time / 3600) - Math.floor(nexp_res.time / 3600)) * 60;
		var sExpTime = ZeroPad(nHours) + ":" + ZeroPad(nMins);
		document.getElementById("divTotalTime").innerHTML = sExpTime;
		
		document.getElementById("divTotalDose").className = document.getElementById("divTWA").className = nexp_res.actionlevel == 2 ? "secondaction" : nexp_res.actionlevel == 1 ? "firstaction" : "";

		document.getElementById("divTotalDose").innerHTML = nexp_res.dose.toFixed(1) + "%";
		document.getElementById("divTWA").innerHTML = nexp_res.twa.toFixed(1) + " dB";

		document.getElementById("fldTotalDose").value = nexp_res.dose.toFixed(1);
		document.getElementById("fldTotalExpTime").value = sExpTime;		
		document.getElementById("fldTWA").value = nexp_res.twa.toFixed(1);
		
		ShowActions(nexp_res.twa);
	}
	else {
		document.getElementById("divTotalDose").innerHTML = "";
		document.getElementById("divTotalTime").innerHTML = "";
		document.getElementById("divTWA").innerHTML = "";
		ShowActions(0);
	}
}

function ShowActions(flTWA)
{
	if(flTWA > 0) {
		if(flTWA < nexp.action) {
			document.getElementById("divActionLevels").innerHTML = "TWA is less<br>than " + nexp.action.toFixed(0) + " dB";
			document.getElementById("divActionAction").innerHTML = "TWA < action level. <strong>No corrective action is required</strong>. We recommend regular noise measurement, especially if any changes are made to the working environment.";
			document.getElementById("fldAction").value = "TWA < action level. <strong>No corrective action is required</strong>. We recommend regular noise measurement, especially if any changes are made to the working environment.";
		}

		if((flTWA >= nexp.action) && (flTWA < nexp.crit)) {
			document.getElementById("divActionLevels").innerHTML = "TWA is between<br>" + nexp.action.toFixed(0) + " and " + nexp.crit.toFixed(0) + " dB";
			document.getElementById("divActionAction").innerHTML = "<p>TWA > action level of " + nexp.action.toFixed(0) + " dB.</p><ul><li>Reduce the noise at source (if possible).</li><li>Provide training on hearing damage and protection.</li><li>Provide suitable hearing protection to be worn at worker descretion.</li><li>Conduct regular monitoring of noise exposure levels.  </li></ul>";
			document.getElementById("fldAction").value = "<p>TWA > action level of " + nexp.action.toFixed(0) + " dB.</p><ul><li>Reduce the noise at source (if possible).</li><li>Provide training on hearing damage and protection.</li><li>Provide suitable hearing protection to be worn at worker descretion.</li><li>Conduct regular monitoring of noise exposure levels.  </li></ul>";
		}
		if((flTWA >= nexp.crit) && (flTWA < nexp.crit+10)) {
			document.getElementById("divActionLevels").innerHTML = "TWA is<br>above " + nexp.crit.toFixed(0) + " dB";
			document.getElementById("divActionAction").innerHTML = "<p>TWA > criterion level of " + nexp.crit.toFixed(0) + " dB.</p><ul><li>Reduce the noise at source (if possible)</li><li>Provide training on hearing damage and protection.</li><li><strong>Provide suitable hearing protection, which must be worn</strong></li><li>Conduct regular monitoring of noise exposure levels.</li></ul>";
			document.getElementById("fldAction").value = "<p>TWA > criterion level of " + nexp.crit.toFixed(0) + " dB.</p><ul><li>Reduce the noise at source (if possible)</li><li>Provide training on hearing damage and protection.</li><li><strong>Provide suitable hearing protection, which must be worn</strong></li><li>Conduct regular monitoring of noise exposure levels.</li></ul>";
		}
		if(flTWA >= nexp.crit+10) {
			document.getElementById("divActionLevels").innerHTML = "Exposure is<br>very high";
			document.getElementById("divActionAction").innerHTML = "<p>TWA >> criterion level. This noise level is so high that a more detailed analysis will be required to ensure that the hearing protection provided is adequate.</p><ul><li>Reduce the noise at source (if possible)</li><li>Provide the worker with training about hearing damage and protection.</li><li><strong>Provide suitable hearing protection, which must be worn</strong></li><li><strong>Carry out further analysis to ensure that the protection provided is adequate for the job</strong>. </li></ul>";
			document.getElementById("fldAction").value = "<p>TWA >> criterion level. This noise level is so high that a more detailed analysis will be required to ensure that the hearing protection provided is adequate.</p><ul><li>Reduce the noise at source (if possible)</li><li>Provide the worker with training about hearing damage and protection.</li><li><strong>Provide suitable hearing protection, which must be worn</strong></li><li><strong>Carry out further analysis to ensure that the protection provided is adequate for the job</strong>. </li></ul>";
		}

		document.getElementById("btnPrint").style.visibility = "visible";
	}
	else {
		document.getElementById("divActionLevels").innerHTML = "";
		//document.getElementById("divActionAction").innerHTML = "Details will be shown when valid levels and times have been entered.";
		document.getElementById("fldAction").value = "";
		
		document.getElementById("btnPrint").style.visibility = "hidden";
	}
}

function help(sSubject)
{
	sHelp = "";
	
	if(sSubject == "location")
		sHelp = "Enter the location of the measurement.<br><br>Only needed if you want a printed report.";
	if(sSubject == "level")
		sHelp = "The average sound level in dB(A), measured for the worker at this location.";
	if(sSubject == "exptime")
		sHelp = "The length of time that the worker spends at this location each day.";
	if(sSubject == "partial")
		sHelp = "The noise dose % at each location based on the time spent at that paticular point. Useful in identifying the areas that would most benefit from improvement.";
	if(sSubject == "totalexptime")
		sHelp = "The total amount of time that the worker is exposed to noise during a working day.";
	if(sSubject == "dose")
		sHelp = "The worker's daily noise exposure <strong>Dose %</strong>. This is the parameter to check against the regulatory action levels of 50% and 100%.";
	if(sSubject == "twa")
		sHelp = "The worker's time weighted average <strong>TWA</strong> in dB. This is the parameter to check against the regulatory action levels of 85 and 90 dB.";
		
	if(sHelp != "")
		sHelp = "<strong>Help</strong><br><br>" + sHelp;

	document.getElementById("divHelp").innerHTML = sHelp;
	document.getElementById("divHelp").style.visibility = (sHelp == "" ? "hidden" : "visible");
}

function CheckSubmit()
{
	return (document.getElementById("btnPrint").style.visibility == "visible");
}