
function NMAddResize(func)
{
  var oldonresize = window.onresize;
  if (typeof window.onresize != 'function') {
    window.onresize = func;
  }
  else {
    window.onresize = function() {
      if (oldonresize) {
        oldonresize();
      }
      func();
    }
  }
}


/*------------- Image Zoom -------------*/

var divNMZoom = null;
var divNMZBg = null;

function NMAddZoom(obj)
{
	var div = document.createElement("div");
	div.style.cssText = "position:absolute; width:19px; height:19px; background:#CCC url(/images/nmzoom.gif) no-repeat 2px 2px; border:1px solid #000; border-radius:6px; cursor:pointer";
	
	div.style.top = obj.offsetTop + obj.offsetHeight - 20 + "px";
	div.style.left = obj.offsetLeft + obj.offsetWidth - 20 + "px";
	
	NMAddResize(function() {
		div.style.top = obj.offsetTop + obj.offsetHeight - 20 + "px";
		div.style.left = obj.offsetLeft + obj.offsetWidth - 20 + "px";
	});
	
	div.onmouseover = function() { div.style.backgroundColor = "#EBEBF1"; div.style.boxShadow = "2px 2px 2px #888" }
	div.onmouseout = function() { div.style.backgroundColor = "#CCC"; div.style.boxShadow = "" }
	div.onclick = function() { NMZoom(obj) };
	
	document.body.appendChild(div);
}

function NMZoom(obj)
{
	NMZoomClose();
	
	divNMZBg = document.createElement("div");
	divNMZBg.style.cssText = "position:fixed; top:0px; left:0px; bottom:0px; right:0px; background:#CCC; opacity:0.5";
	divNMZBg.onclick = function() { NMZoomClose() };
	document.body.appendChild(divNMZBg);
	
	var nLen = obj.src.length;
	var sFile = obj.src.substr(0,nLen-4) + "-zoom" + obj.src.substr(nLen-4,4);
	
	divNMZoom = document.createElement("div");
	divNMZoom.style.cssText = "position:absolute; background:#FFF; border:1px solid #000; box-shadow:3px 3px 3px #888; padding:12px";
	
	var imgZoom = document.createElement("img");
	imgZoom.src = sFile;
	
	imgZoom.onload = function() {
		if(divNMZoom.clientWidth > divNMZBg.clientWidth)
			imgZoom.style.width = divNMZBg.clientWidth - 40 + "px";
		divNMZoom.style.top = window.pageYOffset + (window.innerHeight / 2) - (divNMZoom.clientHeight / 2) + "px";
		divNMZoom.style.left = (divNMZBg.clientWidth / 2) - (divNMZoom.clientWidth / 2) + "px";
	};
	imgZoom.onclick = function() { NMZoomClose() };
	
	divNMZoom.appendChild(imgZoom);
	document.body.appendChild(divNMZoom);
}

function NMZoomClose()
{
	if(divNMZoom != null) document.body.removeChild(divNMZoom);
	if(divNMZBg != null) document.body.removeChild(divNMZBg);

	divNMZoom = null;
	divNMZBg = null;
}


/*------------- Legacy Code -------------*/

function LittleWindow(sPage)
{
  windowLittle = window.open(sPage,'LittleWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=360,height=360,screenX=100,screenY=75,left=100,top=75');
  return false;
}

function BigWindow(sPage)
{
  windowLittle = window.open(sPage,'LittleWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=640,height=480,screenX=100,screenY=75,left=100,top=75');
  return false;
}

function VBigWindow(sPage)
{
  windowLittle = window.open(sPage,'LittleWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600,screenX=0,screenY=0,left=0,top=0');
  return false;
}

function ListGo(objList)	// Go to a URL in a list box - if no URL given then does nothing
{
	var sLink = new String(objList.options[objList.selectedIndex].value);
	var bDone = false;
	
	objList.selectedIndex = 0;							// Set back to first option, ready for another selection

	if(sLink.length > 0) {
		if(sLink.indexOf("contactpop.asp") != -1) {		// Contact popup
		  LittleWindow(sLink);
		  bDone = true;
		}
		
		if((sLink.indexOf("stock.asp") != -1) || (sLink.indexOf("similar.asp") != -1)) {  // Stock check or find similar meter
		  LittleWindow(sLink);
		  bDone = true;
		}
	
		if(!bDone)										// None of the above, just link through
			parent.location = sLink;
	}
}

function TrRoll(trThis, bOver)
{
	if(bOver)
		trThis.style.backgroundColor="#EBEBF1";
	else
		trThis.style.backgroundColor="";
}


/*------------- Cookies -------------*/

function CreateCookie(name,value,days) {
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		var expires = ";expires=" + date.toGMTString();
	}
	else
		var expires = "";
		
	document.cookie = name + "=" + value + expires + "; path=/";

}

function ReadCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length,c.length);
	}
	return "";
}

function DeleteCookie(name)
{
	createCookie(name,"",-1);
}


/*------------- NMHelp -------------*/

var divNMHelp = null;
var divNMHBg = null;

function NMHelp(sHelp,e)
{
	NMHelpHide();		// In case one aalready visible
	
	divNMHBg = document.createElement("div");
	divNMHBg.style.cssText = "position:fixed; top:0px; left:0px; bottom:0px; right:0px; background:#CCC; opacity:0.5";
	divNMHBg.onclick = function() { NMHelpHide() };
	document.body.appendChild(divNMHBg);

	divNMHelp = document.createElement("div");
	divNMHelp.setAttribute("id","divNMHelp");
	
	var cxLeft = MousePosition(e).x - 100;
	var cyTop = MousePosition(e).y - 10;

	if(cxLeft + 250 > document.body.clientWidth)			// div width set to 250px in CSS
		cxLeft = document.body.clientWidth - 250;
	if(cxLeft < 8) cxLeft = 8;
	
	divNMHelp.style.left = cxLeft + "px";
	divNMHelp.style.top = cyTop + "px";
	divNMHelp.style.maxHeight = "30px";

	divNMHelp.innerHTML = "<h2>Loading...</h2>";
	
	document.body.appendChild(divNMHelp);

	AxLoad("/ax/help/" + sHelp + ".asp",null,NMHelpCCF,false);
}

function NMHelpCCF(sRx)
{
	var div = document.getElementById("divNMHelp");
	if(div != null) {
		div.innerHTML = "<h2>Information</h2><div id='divNMHelpCont'>" + sRx + "</div><input type='button' value='Close' onclick='NMHelpHide()'>";
		div.style.maxHeight = "350px";
	}
}

function NMHelpHide()
{
	if(divNMHelp != null) document.body.removeChild(divNMHelp);
	if(divNMHBg != null) document.body.removeChild(divNMHBg);
	divNMHelp = null;
	divNMHBg = null;
}

/*------------- Specs -------------*/

function ToggleSpecs(sDiv)
{
	var div = document.getElementById(sDiv);
	div.className = div.className == "divSpecs" ? "divSpecsHid" : "divSpecs";
}


/*------------- Pricing Tabs -------------*/

function PrTab(nTab)
{
	if(!document.getElementById("divPrTab" + nTab))
		return;
		
	for(var i=0; i<10; i++) {
		if(document.getElementById("divPrTab" + i)) {
			document.getElementById("divPrTab" + i).className = "ITabOff";
			document.getElementById("divPrCont" + i).style.display = "none";
		}
	}
	document.getElementById("divPrTab" + nTab).className = "ITabOn";
	document.getElementById("divPrCont" + nTab).style.display = "";

	var sDef = document.getElementById("divPrCont" + nTab).innerHTML;
	if(sDef.substr(0,3) == "ax:") {
		document.getElementById("divPrCont" + nTab).innerHTML = "Loading...";
		var sAx = sDef.substr(3,999);
		AxLoad(sAx,"divPrCont" + nTab);
	}
}


/*------------- Prod Extra Buttons -------------*/

function ProdExtra(obj)
{
	obj.style.maxHeight = "300px";
	
	obj.onclick = null;

	var aobjH2 = obj.getElementsByTagName("h2");
	if(aobjH2.length > 0) {
		aobjH2[0].onclick = function() { HideProdExtra(obj) };
		aobjH2[0].style.backgroundImage = "url(/images/cross.gif)";
	}
}

function HideProdExtra(obj)
{
	var aobjH2 = obj.getElementsByTagName("h2");
	if(aobjH2.length > 0) {
		aobjH2[0].onclick = function() { ProdExtra(obj) };
		aobjH2[0].style.backgroundImage = "url(/images/dropdown.gif)";
	}

	obj.style.maxHeight = "17px";
}


var iScrollMax;
var intervalScroll;
var nScrollHeight;

function ScrollToPrices()
{
	iScrollMax = 150;
	nScrollHeight = document.body.scrollHeight;
	
	intervalScroll = setInterval(function() {
			window.scrollBy(0,40);
			
			if(((nScrollHeight -= 40) <= 0) || (iScrollMax-- < 0))
				clearInterval(intervalScroll);
		}, 10);
}


/*------------- Prod Extra Range Movement -------------*/

var nPERangeCount = -1;
var nPERangeSel = 0;

function InitPERange(nDefProd)
{
	while(document.getElementById("divPEProd" + (++nPERangeCount))) ;
	nPERangeSel = nDefProd + 1;
	document.getElementById("divPERangeScroll").style.left = 0 - (--nPERangeSel * 128) + "px";
	EnablePERangeBtns();
}

function EnablePERangeBtns()
{
	document.getElementById("btnPERangeLeft").disabled = nPERangeSel <= 0;
	document.getElementById("btnPERangeRight").disabled = nPERangeSel > nPERangeCount-2;
}

function PERangeLeft()
{
	if(nPERangeSel > 0)
		document.getElementById("divPERangeScroll").style.left = 0 - (--nPERangeSel * 128) + "px";
	EnablePERangeBtns();
	document.getElementById("btnPERangeLeft").blur();		// For Chrome
}


function PERangeRight()
{
	if(nPERangeSel < nPERangeCount-1)
		document.getElementById("divPERangeScroll").style.left = 0 - (++nPERangeSel * 128) + "px";
	EnablePERangeBtns();
	document.getElementById("btnPERangeRight").blur();		// For Chrome
}


/*------------- Prod Extra Contact Form -------------*/

function QEmailClk()
{
	var obj = document.getElementById("editQEmail");
	if(obj.value == "Email address")
		obj.value = "";
	obj.className = "editQEmailSel";
}

function QOtherClk()
{
	var obj = document.getElementById("editQOther");
	if(obj.value == "Other question")
		obj.value = "";
	obj.className = "editQOtherSel";
}

function QSendReq()
{
	var sEmail = escape(document.getElementById("editQEmail").value);
	var sQuote = document.getElementById("chkQQuote").checked ? "Yes" : "No";
	var sInfo = document.getElementById("chkQInfo").checked ? "Yes" : "No";
	var sOther = escape(document.getElementById("editQOther").value);

	if((sEmail.indexOf("@") != -1) && (sEmail.indexOf(".") != -1)) {
		document.getElementById("btnQSend").disabled = true;
		AxLoad("/ax/qform.asp?email=" + sEmail + "&quote=" + sQuote + "&info=" + sInfo + "&other=" + sOther + "&page=" + escape(sPage),"divQForm",null);
	}
	else {
		document.getElementById("editQEmail").value = "Email address";
		document.getElementById("editQEmail").className = "editQEmail";
		document.getElementById("editQEmail").style.borderColor = "#F00";
	}
}


/*------------- FAQ -------------*/

function ExpandFaq(obj)
{
	var div = obj.parentNode;
	if(div.className == "faqline")
		div.className = "faqexp";
	else
		div.className = "faqline";
}


/*------------- Live Support -------------*/

function LiveSupport()
{
	document.write("<div id=\"ciryil\" style=\"z-index:100;position:absolute\"></div>");
	document.write("<div id=\"scryil\" style=\"display:inline\"></div>");
	document.write("<div id=\"sdryil\" style=\"display:none\"></div>");

	setTimeout("LiveSupportLoad()",500);
}

function LiveSupportLoad()
{
	var seryil = document.createElement("script");
	seryil.type = "text/javascript";
	seryil.src = (location.protocol.indexOf("https") == 0 ? "https" : "http") + "://image.providesupport.com/js/noisemeters/safe-standard.js?ps_h=ryil\u0026ps_t=" + new Date().getTime();

	document.getElementById('sdryil').appendChild(seryil);
}


/*------------- Location -------------*/

function LocationCCF(sResp)
{
	if(sResp != "ok") {
		asResp = sResp.split(";");
		
		if(asResp.length == 2) {
			var divIPLoc = document.createElement("div");
			divIPLoc.setAttribute("id","divIPLoc");
			
			divIPLoc.style.position = "absolute";
			divIPLoc.style.zIndex = "1001";
			divIPLoc.style.top = "6px";
			divIPLoc.style.padding = "2px";
			
			divIPLoc.style.backgroundColor = "#C00";
			divIPLoc.style.color = "#FFF";
			divIPLoc.style.border = "solid 3px #F00";
			divIPLoc.style.borderRadius = "6px";
			
			if(document.body.clientWidth > 980)
				divIPLoc.style.right = (document.body.clientWidth / 2) - 464 + "px";
			else
				divIPLoc.style.right = "8px";
			
			sContent = asResp[0] + "&nbsp;&nbsp;";
			sContent += "<input type=\"submit\" name=\"btnIPLocYes\" id=\"btnIPLocYes\" value=\"Yes\" style=\"width:48px\" onClick=\"location.href='" + asResp[1] + "'\">"
			sContent += "<input type=\"submit\" name=\"btnIPLocNo\" id=\"btnIPLocNo\" value=\"No\" style=\"width:48px\" onClick=\"document.getElementById('divIPLoc').style.display = 'none'\">"
			
			divIPLoc.innerHTML = sContent;

			document.body.appendChild(divIPLoc);
		}
	}
}


/********************** THINGS NOT IMPLEMENTED IN ALL BROWSERS ****************************/

if(!Array.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for(var i=0; i<this.length; i++) {
			if(this[i]==obj)
				return i;
		}
		return -1;
	}
}

function GetRadValue(rad)
{
	for(var i=0; i<rad.length; i++)
		if(rad[i].checked)
			return rad[i].value;
	
	return "";
}

function MousePosition(e)
{
    e = e || window.event;
    var cursor = {x:0, y:0};
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}