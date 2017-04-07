/* (c) NoiseMeters Limited 2016 */

var nexp = { day:28800, crit:90, action:85, exrate:5 };
var nexp_res = { twa:0, dose:0, time:0, actionlevel:0 };
var nexp_res_lines = [ { valid:false, twa:0, dose:0, actionlevel:0 } ];


function CalcExposure(aflLev,aflTime)
{
	if(aflLev.length != aflTime.length)
		return false;
	
	var flSum = 0;
	var nTime = 0;
	var flLineDose = 0;
	var flLineTwa = 0;
	var flT;
	
	nexp_res_lines = [];
	
	for(var iLine=0; iLine<aflLev.length; iLine++) {
		if((aflLev[iLine] >= 40) && (aflLev[iLine] <= 140) && (aflTime[iLine] >= 60) && (aflTime[iLine] <= 86400)) {
			flT = nexp.day / Math.pow(2,(aflLev[iLine]-nexp.crit) / nexp.exrate);
			flLineDose = aflTime[iLine] / flT * 100;
			flSum += aflTime[iLine] / flT;
			nTime += aflTime[iLine];
			
			flLineTwa = nexp.exrate * Math.log(flLineDose/100) / Math.log(2) + nexp.crit;
			var nActionLevel = flLineTwa >= nexp.crit ? 2 : flLineTwa >= nexp.action ? 1 : 0;
			nexp_res_lines.push({valid:true, twa:flLineTwa, dose:flLineDose, actionlevel:nActionLevel});
		}
		else
			nexp_res_lines.push({valid:false, twa:0, dose:0, actionlevel:0});
	}
	
	if((flSum > 0) && (nTime <= 86400)) {
		nexp_res.dose = flSum * 100;
		nexp_res.twa = nexp.exrate * Math.log(nexp_res.dose/100) / Math.log(2) + nexp.crit;
		nexp_res.time = nTime;
		nexp_res.actionlevel = nexp_res.twa >= nexp.crit ? 2 : nexp_res.twa >= nexp.action ? 1 : 0;
	}
	else
		return false;
	
	return true;
}