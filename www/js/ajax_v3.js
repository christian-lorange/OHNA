/********************** STRONGER THAN DIRT *************************/
// (c) NoiseMeters Ltd
// v3.0.0 2014-12-14

var xmlhttpAx = null;
var sAxRxDiv = "";
var CustomCCF = null;

var asUrlQ = new Array();
var asRxDivQ = new Array();
var accfQ = new Array();
var abSwirl = new Array();
var asMethod = new Array();
var abKillScr = new Array();
var iAx = 0;

function AxLoad(sUrl,sRxDiv,ccf,bSwirl,sMethod,bKillScreen)
{
	if(typeof(bSwirl) === "undefined") bSwirl = true;
	if(typeof(sMethod) === "undefined") sMethod = "";
	if(sMethod != "POST") sMethod = "GET";
	if(typeof(bKillScreen) === "undefined") bKillScreen = false;

	if(xmlhttpAx == null) {												// Nothing queued, send immediately
		sAxRxDiv = sRxDiv;
		
		if(bSwirl) ShowAxLoad(true);
		if(bKillScreen) AxKillScreen();
		
		if(window.XMLHttpRequest)				// Mozilla & new IE
			xmlhttpAx = new XMLHttpRequest();
		else									// Old IE versions
			if(window.ActiveXObject)
				xmlhttpAx = new ActiveXObject("Microsoft.XMLHTTP")

		if(xmlhttpAx != null) {
			CustomCCF = ccf;
			xmlhttpAx.onreadystatechange = AxLoadCCF;
			
			if(sUrl.indexOf("?") != -1)									// Make URL unique (stop caching)
				sUrl += "&";
			else
				sUrl += "?";
			sUrl += "x=" + (new Date()).getTime();
			
			if(sMethod == "GET") {										// A standard GET
				xmlhttpAx.open("GET",sUrl,true);
				xmlhttpAx.send(null);
			}
			else {														// POST
				var asUrlParts = sUrl.split("?");
				xmlhttpAx.open("POST",asUrlParts[0],true);
				xmlhttpAx.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				xmlhttpAx.send(asUrlParts[1]);
			}
		}
			
		return xmlhttpAx != null;
	}
	else																// Already waiting for response, queue this one
	{
		asUrlQ[iAx] = sUrl;
		asRxDivQ[iAx] = sRxDiv;
		accfQ[iAx] = ccf;
		abSwirl[iAx] = bSwirl;
		asMethod[iAx] = sMethod;
		abKillScr[iAx] = bKillScreen;
		iAx++;
		
		return true;
	}
}

function AxLoadCCF()
{
	if(xmlhttpAx.readyState == 4) {
		if(sAxRxDiv != null) {
			if(xmlhttpAx.status == 200)
				document.getElementById(sAxRxDiv).innerHTML = xmlhttpAx.responseText;
			else
				document.getElementById(sAxRxDiv).innerHTML = "Error<br><br>" + xmlhttpAx.responseText;
		}
		
		if(CustomCCF != null)
			CustomCCF(xmlhttpAx.responseText);
		
		xmlhttpAx = null;
		
		if(iAx > 0) {
			iAx--;
			AxLoad(asUrlQ[iAx],asRxDivQ[iAx],accfQ[iAx],abSwirl[iAx],asMethod[iAx]);				// Send next queued ajax call
		}
		else
			ShowAxLoad(false);
	}
}

function ShowAxLoad(bShow)
{
	if(document.getElementById("divAxLoad") != null)
		document.getElementById("divAxLoad").className = bShow ? "axloadshow" : "axload";
	
	if(!bShow)
		RemoveAxKillScreen();
}


/*------------- Stop Any Clicks During Protected AX Calls -------------*/

var divAxKillScr = null;

function AxKillScreen()
{
	RemoveAxKillScreen();

	divAxKillScr = document.createElement("div");
	divAxKillScr.style.position = "absolute";
	divAxKillScr.style.left = divAxKillScr.style.top = divAxKillScr.style.bottom = divAxKillScr.style.right = "0px";

	document.body.appendChild(divAxKillScr);
}

function RemoveAxKillScreen()
{
	if(divAxKillScr != null) {
		document.body.removeChild(divAxKillScr);
		divAxKillScr = null;
	}
}