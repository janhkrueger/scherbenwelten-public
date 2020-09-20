//V1.27
var ie4up = (document.all)?1:0;
var ns6 = (document.getElementById && !document.all)?1:0;

var winX = ((ns6)?(5):(3));   //Koordinatenkorrektur: erste Zahl für  Mozilla/Firefox und Netscape, zweite für Internet Explorer
var winY = ((ns6)?(-10):(-17)); //************************************************************************************************

var xPos = 0;				//window Mouse position
var yPos = 0;
var xCapCo = 0;			//captured Game coordinates
var yCapCo = 0;
var nDistance = 0;	//distance
var lCaptured = 0;	//are we measuring a distance?
var zoom;						//zoom in pixel
var xStart;					//start coordinates
var yStart;

var xCapPos = 0;		//captured window Mouse Position for rectangle
var yCapPos = 0;
var hJG     = 0;		//graphics library handle
var alertWin;				//Alertfunktion
var bShift  = false;		//is shift key pressed?
var bShowCoord = true;	//Koordinaten anzeigen
var bShowLines = true;	//Linien zeichnen
var b

document.writeln('<input type=text value="" id="retval" onBlur="alertContinue(this.value);" style="position:absolute; top:-200px;">');	//Alertfunktion

///////////////////////////////////////////////////////////////////////////////
function init(zoomArg, xStartArg, yStartArg, nGridMod, sDataFile) {
	zoom = zoomArg;
	if(nGridMod == -1) { if(ns6) zoom++; }
	else zoom += nGridMod;
	xStart = xStartArg;
	yStart = yStartArg;

	document.write("<textarea id=\"clip\" style=\"position:absolute; top:-200px; left:-200px; visibility='hidden';\"><\/textarea>\n");
	if (ie4up) document.write("<div id=\"coord\" style=\"white-space:nowrap; position:absolute; top:-200px; left:-200px; visibility='hidden'; background-color:#FFFFFF; z-index:2\">0/0<\/div>\n");
	else document.write("<div id=\"coord\" style=\"white-space:nowrap; position:fixed; top:-200px; left:-200px; visibility='hidden'; background-color:#FFFFFF; z-index:2\">0/0<\/div>\n");
	document.onmousemove = getCoord;
	document.onkeyup     = keyUp;
	document.onkeydown   = keyPressed;
	//document.onmousedown = myMouseclick;

	document.write("<div id='myCanvas' onClick='captureCoord()' onMousemove='showCoord()' style='position:absolute; top:0px; left:0px; z-index:1000;'></div>");
	if(jsGraphics)
	{
		hJG = new jsGraphics('myCanvas');	//JavaGraphic Handle
		hJG.setColor("#ff0000");
	}

	if (ie4up) document.write("<div id=\"myAlert\" style=\"white-space:nowrap; background-color:#AAAAAA; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #FFFF00; border: medium ridge #AAAAAA;  position:absolute; width:200px; height:80px; top:-200px; left:-200px; z-index:2000\"> <\/div>\n");
	else document.write("<div id=\"myAlert\" style=\"white-space:nowrap; background-color:#AAAAAA; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #FFFF00; border: medium ridge #AAAAAA; position:fixed; width:200px; height:100px; top:-200px; left:-200px; visibility='hidden';  z-index:2000\"> <\/div>\n");

	if(sDataFile) loadFile(sDataFile, showPics);
	//document.writeln("<div id='myconsole' style='position:absolute; top:20px; left:20px;'>debug:<br></div>");
}

///////////////////////////////////////////////////////////////////////////////
function keyUp (Ereignis) {
	var Tastencode;

  if (!Ereignis)
    Ereignis = window.event;

  if (Ereignis.which) {
    Tastencode = Ereignis.which;
  } else if (Ereignis.keyCode) {
    Tastencode = Ereignis.keyCode;
  } else {
		Tastencode = Ereignis;
	}

  if(Tastencode==27)
	{
		if(lCaptured==1)
		{
			lCaptured = 0;
			nDistance = 0;
			hJG.clear();
			showCoord();
		}
	}
	else if(Tastencode==16)
	{
		bShift = false;
		showCoord();
	}
	else if((Tastencode==17) || (Tastencode==18)) captureCoord()
}
///////////////////////////////////////////////////////////////////////////////
function keyPressed (Ereignis) {
  if (!Ereignis)
    Ereignis = window.event;
  if (Ereignis.which) {
    Tastencode = Ereignis.which;
  } else if (Ereignis.keyCode) {
    Tastencode = Ereignis.keyCode;
  }
	if(Tastencode==16)
	{
		bShift = true;
		showCoord();
	}
}


///////////////////////////////////////////////////////////////////////////////
function getCoord(Ereignis) {
	if (ie4up) {
		xPos = window.event.x+winX+document.body.scrollLeft;
		yPos = window.event.y+winY+document.body.scrollTop;
	}
	if (ns6)   {
		xPos = Ereignis.pageX+winX;
		yPos = Ereignis.pageY+winY;
	}
}

///////////////////////////////////////////////////////////////////////////////
function showLines(bShow) {
	if(bShow || bShow==false) bShowLines=bShow;		//wenn bShow definiert ist
	else bShowLines=!bShowLines;
}
///////////////////////////////////////////////////////////////////////////////
function showCoord(bShow) {
	if(bShow || bShow==false) bShowCoord=bShow;		//wenn bShow definiert ist
	else bShowCoord=!bShowCoord;

	var xCoord;
	var yCoord;

	if(bShowCoord)
	{
		//if(!(document.body) || !(document.coord)) return this;
		xCoord = Math.floor(xPos/zoom)+xStart;		//Math.ceil((xPos-document.getElementById("map").style.left)/zoom)
		yCoord = Math.floor(yPos/zoom)+yStart;		//Math.ceil((yPos-document.getElementById("map").style.top)/zoom)
		if (lCaptured==1)
		{
			document.getElementById("coord").innerHTML = xCoord+"/"+yCoord+" | "+(xCoord-xCapCo)+"/"+(yCoord-yCapCo)+":"+(nDistance+Math.max(Math.abs(xCoord-xCapCo),Math.abs(yCoord-yCapCo)));
			if(bShowLines && hJG!=0)
			{
				hJG.clear();
				var x1,y1,x2,y2;
				if(xPos-winX>xCapPos) {x1=xCapPos; x2=xPos-winX-xCapPos;}
				else {x1=xPos-winX; x2=xCapPos-x1;}
				if(yPos-winY>yCapPos) {y1=yCapPos; y2=yPos-winY-yCapPos;}
				else {y1=yPos-winY; y2=yCapPos-y1;}
				var nDist=Math.max(x2, y2)
				if(bShift) hJG.drawRect(Math.round(xCapPos-nDist),Math.round(yCapPos-nDist),Math.round(nDist+nDist),Math.round(nDist+nDist));
				else
				{
					if(nDist>20) hJG.drawRect(Math.round(x1),Math.round(y1),Math.round(x2),Math.round(y2));
					if(nDist<1000) hJG.drawLine(Math.round(xCapPos),Math.round(yCapPos),Math.round(xPos-winX),Math.round(yPos-winY));
				}
				hJG.paint();
			}
		}
		else document.getElementById("coord").innerHTML = xCoord+"/"+yCoord;

		if (ie4up)
		{
			if(yPos>document.body.offsetHeight+document.body.scrollTop-80) document.getElementById("coord").style.top=document.body.offsetHeight+document.body.scrollTop-80;
			else document.getElementById("coord").style.top=yPos+40;
			document.getElementById("coord").style.left=Math.max(Math.min(document.body.offsetWidth+document.body.scrollLeft-((lCaptured)?100:70), xPos)-((lCaptured)?40:10), 0);
		}
		else
		{
			if(yPos-document.body.scrollTop>window.innerHeight-75) document.getElementById("coord").style.top=window.innerHeight-90;
			else document.getElementById("coord").style.top=yPos-document.body.scrollTop+30;
			document.getElementById("coord").style.left=Math.max(Math.min(window.innerWidth-((lCaptured)?110:70), xPos-document.body.scrollLeft)-((lCaptured)?55:20), 0);
		}
		document.getElementById("coord").style.visibility='visible';
	}
}

///////////////////////////////////////////////////////////////////////////////
function captureCoord() {
	var xCurCo = Math.floor(xPos/zoom)+xStart;
	var yCurCo = Math.floor(yPos/zoom)+yStart;

	if(lCaptured && (xCurCo==xCapCo) && (yCurCo==yCapCo)) {
		lCaptured = 0;
		nDistance = 0;
		hJG.clear();
	}
	else {
		if(!lCaptured) nDistance = 0;
		else           nDistance += Math.max(Math.abs(xCurCo-xCapCo), Math.abs(yCurCo-yCapCo));
		xCapCo = xCurCo;
		yCapCo = yCurCo;
		xCapPos = xPos-winX;
		yCapPos = yPos-winY;
		lCaptured = 1;
	}
	showCoord();
}

///////////////////////////////////////////////////////////////////////////////
function hideCoord() {
	//if(!(document.body) || !(document.coord)) return this;
	document.getElementById("coord").style.visibility='hidden';
}

///////////////////////////////////////////////////////////////////////////////
function scrollToCoord(xMap, yMap, sImg) {
	var xWin, yWin

	if(!yMap)
	{
		var aData = xMap.split('/');
		if(aData.length!=2) {alert("Fehler: Ungültige Koordinatenangaben!"); return;}
		xMap = aData[0];
		yMap = aData[1];
	}
	if (ie4up)
	{
		xWin = (xMap-xStart)*zoom-(document.body.offsetWidth)/2;
		yWin = (yMap-yStart)*zoom-(document.body.offsetHeight)/2;
	}
	else
	{
		xWin = (xMap-xStart)*zoom-(window.innerWidth)/2;
		yWin = (yMap-yStart)*zoom-(window.innerHeight)/2;
	}
	scrollTo(xWin,yWin);
	if(sImg)
	{
		//var myOut = document.getElementsByTagName("body");//[0].firstChild;
		var myOut = document.getElementById("map");
		putImg(myOut, xMap, yMap, sImg, null, 1);
		//conWriteln(null, "left:"+xMap+" - top:"+yMap);
	}
}

///////////////////////////////////////////////////////////////////////////////
function putImg(oOut, xWin, yWin, sImg, bWinCoords, bModal) {	//entweder Karten oder Bildschirmkoordinaten übergeben ...
	if(!bWinCoords)
	{
		xWin = (xWin-xStart)*zoom-winX;
		yWin = (yWin-yStart)*zoom-winY;
	}
	//conWriteln(null, "xWin:"+xWin+" - yWin:"+yWin);

	var myDiv = document.getElementById(sImg);
	if(!myDiv || !bModal)
	{
		myDiv = document.createElement("div");
		myDiv.style.position="absolute";
		myDiv.style.zIndex=101;
		myDiv.style.VISIBILITY="visible";
		var divId = document.createAttribute("id");
		divId.nodeValue = sImg;
		myDiv.setAttributeNode(divId);

		var myImg = document.createElement("img");
		var imgSrc = document.createAttribute("src");
		imgSrc.nodeValue = sImg;
		myImg.setAttributeNode(imgSrc);

		myDiv.appendChild(myImg);
		oOut.appendChild(myDiv);
	}
	myDiv.style.left=xWin;
	myDiv.style.top=yWin;
}

///////////////////////////////////////////////////////////////////////////////
function mClick(EventType)
{
	if(!EventType) EventType=window.event;
	//if ((((ns6)&&(e.which>1)) || (event.button>1)) && (document.getElementById("coord").createTextRange))
	//if(ie4up)
	//{
		if ((ie4up) && ((EventType.button==2) || (EventType.button==3)))
		{
			alert('Schreibe Koordinaten in die Zwischenablage ...');
			//if (lCaptured==1) document.getElementById("clip").innerHTML = (0+Math.floor(Math.min(xPos,xCapPos+winX)/zoom)+xStart)+","+(0+Math.floor(Math.min(yPos,yCapPos+winY)/zoom)+yStart)+","+(0+Math.floor(Math.max(xPos,xCapPos+winX)/zoom)+xStart)+","+(0+Math.floor(Math.max(yPos,yCapPos+winY)/zoom)+yStart);
			if (lCaptured==1) document.getElementById("clip").innerHTML = (0+Math.floor((xCapPos+winX)/zoom)+xStart)+","+(0+Math.floor((yCapPos+winY)/zoom)+yStart)+","+(0+Math.floor(xPos/zoom)+xStart)+","+(0+Math.floor(yPos/zoom)+yStart);
			else              document.getElementById("clip").innerHTML = (0+Math.floor(xPos/zoom))+xStart+","+(0+Math.floor(yPos/zoom)+yStart);
			var myText=document.getElementById("clip").createTextRange();
			myText.execCommand("Copy");
			return false;
		}
		else if((EventType.button==(ie4up)?1:0) && (parseInt(document.getElementById("myAlert").style.top)<0))
		{
			var xCurCo = Math.floor(xPos/zoom)+xStart;
			var yCurCo = Math.floor(yPos/zoom)+yStart;

			for(var i=0;i<numRegister;i++)		//ueberpruefen des mit registerLink zusammengestellten Arrays
			{
				if((xCurCo>=regX1[i]) && (xCurCo<=regX2[i]) && (yCurCo>=regY1[i]) && (yCurCo<=regY2[i]))
				{
					if(regText[i]) alertWin(regText[i],null,null,null,null,true);
					if(regURL[i]) location.href=regURL[i];

					window.setTimeout("if(lCaptured==1) {lCaptured = 0; nDistance = 0; hJG.clear(); showCoord();}", 250);	//todo: no setTimeout; set flag, to clear coodmesure
					return false;
				}
			}
		}
	//}
	return true;
}
var numRegister=0;
var regURL=new Array();
var regX1=new Array();
var regY1=new Array();
var regX2=new Array();
var regY2=new Array();
var regText=new Array();
///////////////////////////////////////////////////////////////////////////////
function registerLink(url, x1, y1, x2, y2, text)
{
	if(url) regURL[numRegister]=url;
	regX1[numRegister]=x1;
	regY1[numRegister]=y1;
	regX2[numRegister]=x2;
	regY2[numRegister]=y2;
	if(text) regText[numRegister]=text;
	numRegister++;
}

///////////////////////////////////////////////////////////////////////////////
function t(xMap,yMap,cText, nPos, cColor, cStyle)
{
	var tWidth = (cText.length)*Math.min(8, zoom-2)
	var xWin   = (xMap-xStart)*zoom-winX+0.5*zoom-tWidth/2;
	var yWin   = (yMap+0.5+((nPos)?nPos:0)-yStart)*zoom-winY;

	//document.write("<div STYLE=\"cursor:crosshair; text-align:center; position:absolute; left:"+xWin+"px; top:"+yWin+"px;\"><table onClick=\"captureCoord()\" onMousemove=\"showCoord()\"><tr><td width=\"120\" align=\"center\"><font color=\""+((cColor)?cColor:"#FF0000")+"\" size=\"-1\"><b>"+cText+"</b></font></td></tr></table></div>");	//z-index:2;
	document.write("<div STYLE=\"cursor:crosshair; position:absolute; left:"+xWin+"px; top:"+yWin+"px;\"><table onClick=\"captureCoord()\" onMousemove=\"showCoord()\"><tr><td style=\"width:"+tWidth+"px; text-align:center; color:"+((cColor)?cColor:"#FF0000")+"; font-size:"+Math.min(8, zoom-2)+"pt;"+((cStyle)?cStyle:"")+"\">"+cText+"</td></tr></table></div>");	//z-index:2;
}

///////////////////////////////////////////////////////////////////////////////
function t2(xMap,yMap,cText, nSize, cClass)
{
	var tWidth = (cText.length)*nSize
	var xWin   = (xMap-xStart)*zoom-winX+((ns6)?(16):(0))+0.5*zoom-tWidth/2;
	var yWin   = (yMap+0.5-yStart)*zoom-winY-10-nSize;
	//var xWin   = (xMap-xStart)*zoom+winX+((ns6)?29:13)+0.5*zoom-tWidth/2;
	//var yWin   = (yMap+0.5-yStart)*zoom+winY-((ns6)?16:8);

	document.write("<div class=\""+cClass+"\" STYLE=\"cursor:crosshair; position:absolute; left:"+xWin+"px; top:"+yWin+"px;\"><table class=\""+cClass+"\" onClick=\"captureCoord()\" onMousemove=\"showCoord()\"><tr><td style=\"width:"+tWidth+"px; text-align:center; font-size:"+nSize+"pt;\">"+cText+"</td></tr></table></div>");	//z-index:2;
}

///////////////////////////////////////////////////////////////////////////////
var alertArg1, alertArg2, alertArg3
function alertEx(sTarget, arg1, arg2, arg3)	//obsolete
{
	if(lCaptured==1)
	{
		lCaptured = 0;
		nDistance = 0;
		hJG.clear();
		showCoord();
	}

	var winWidth=310;
	var winHeight=150;
	if(navigator.appName=="Netscape") {winWidth-=50; winHeight-=20;}
	if(arg3) winHeight+=65;

	var sOption="width="+winWidth+",height="+winHeight+",left="+(screen.width-winWidth)/2+",top="+(screen.height-winHeight)/2+",menubar=no,scrollbars=no,location=no,status=no,toolbar=no,resizable=yes";
	alertWin=window.open(sTarget, "alertWin", sOption);
	alertWin.resizeTo(winWidth,winHeight);
	alertWin.moveTo((screen.width-winWidth)/2,(screen.height-winHeight)/2);
	alertWin.focus();

	alertArg1=arg1;
	alertArg2=arg2;
	alertArg3=arg3;
	window.setTimeout("setArgs(alertWin, alertArg1, alertArg2, alertArg3);", 300);	//arg1 und andere lokale Variablen sind bei setTimeout nicht mehr gültig ...
}
function alertContinue(retval)
{
	if(retval=="") return;

	var sOption="width="+screen.width+",height="+(screen.height-110)+",left=0,top=0,menubar=yes,scrollbars=yes,resizable=yes";
	newWindow=window.open(retval, "_blank", sOption);
	newWindow.focus();

	document.getElementById("retval").value="";
	alertWin.close();
}
function setArgs(alertWin, arg1, arg2, arg3)
{
	alertWin.arg1=arg1;
	alertWin.arg2=arg2;
	if(arg3) alertWin.arg3=arg3;
}

///////////////////////////////////////////////////////////////////////////////
function alertWin(sHtml, winWidth, winHeight, cColor, cStyle, bClose)
{
	if(lCaptured==1)
	{
		lCaptured = 0;
		nDistance = 0;
		hJG.clear();
		showCoord();
	}

	if(bClose) sHtml+="<div style=\"position:absolute; top:0px; right:0px; cursor:pointer; vertical-align:middle; width:10; text-align:center; border:thin outset #AAAAAA;\" onClick='javascript:document.getElementById(\"myAlert\").style.top=-200;'>X</div>";

	var AlertWin = document.getElementById("myAlert");
	AlertWin.innerHTML = sHtml;

	if(winWidth) AlertWin.style.width=winWidth;
	else AlertWin.style.width=200;
	if(winHeight) AlertWin.style.height=winHeight;
	else AlertWin.style.height=80;

	if(navigator.appName == "Microsoft Internet Explorer")
	{
		AlertWin.style.left=document.body.scrollLeft+document.body.offsetWidth/2;
		AlertWin.style.top=document.body.scrollTop+document.body.offsetHeight/2;
	}
	else
	{
		AlertWin.style.top=(screen.height-parseInt(AlertWin.style.height))/2;
		AlertWin.style.left=(screen.width-parseInt(AlertWin.style.width))/2;
	}
}

///////////////////////////////////////////////////////////////////////////////
function loadFile(cFile, fResult, arg1, arg2, arg3)	//FileName, CallBack
{
	var xmlhttp;

	if (ie4up)
	{
		try
		{
			xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e)
		{
			try
			{
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {xmlhttp=false;}
		}
	}
	else
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		} catch (e) {xmlhttp=false}
	}
	if(!xmlhttp) {alert("kein xmlhttp"); return;}

	xmlhttp.open("GET", cFile, true);
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4) fResult(xmlhttp.responseText, arg1, arg2, arg3);	//alert(escape(xmlhttp.responseText));
		//else alert(xmlhttp.readyState);
	}
	xmlhttp.send(null);
}

///////////////////////////////////////////////////////////////////////////////
function showPics(sData)
{
	var aData = sData.split(String.fromCharCode(13,10));
	if(aData.length==1)
	{
		aData = sData.split(String.fromCharCode(13));
		if(aData.length==1) aData = sData.split(String.fromCharCode(10));
	}

	var sResult='<html><head><style type="text/css"><!-- div { position:absolute; height:'+zoom+'px; width:'+zoom+'px; min-width:'+zoom+'px; }; img { height:'+zoom+5+'px; width:'+zoom+5+'px; }--></style></head><body bgcolor="black">';
	sResult+="<div STYLE=\"top:0px; left:0px;\"><img STYLE=\"width:3560; height:3891;\" src=\"welt.png\"></div>";

	var aLine;
	for(var i=0; i<aData.length; i++)
	{
		aLine = aData[i].split(",");
		if(aLine.length==3)
		{
			sResult+="<div STYLE=\"top:"+((parseInt(aLine[1])-yStart)*zoom)+"px; left:"+((parseInt(aLine[0])-xStart)*zoom)+"px;\"><img src=\"/sw/"+aLine[2]+".gif\"></div>";
		}
	}
	document.write(sResult+"</body></html>");
}

var bAlert=true;
/////////////////////////////////////////////////////////////////////////////
function conWrite(oCon, sText)
{
	if(!oCon) oCon = document.getElementById("myconsole");
	if(!oCon) {if(bAlert) {alert("conWrite: kein Ausgabebereich gefunden!"); bAlert=false;}return;}
	oCon.appendChild(document.createTextNode(sText));
}
function conWriteln(oCon, sText)
{
	if(!oCon) oCon = document.getElementById("myconsole");
	if(!oCon) {if(bAlert) {alert("conWriteln: kein Ausgabebereich gefunden!"); bAlert=false;}return;}
	oCon.appendChild(document.createTextNode(sText));
	oCon.appendChild(document.createElement("br"));
}
/////////////////////////////////////////////////////////////////////////////
function showDOM(basis, mycon)
{
	var i;

	if(!basis) basis  = document.getElementById("screen");
	if(!mycon) mycon  = document.getElementById("myconsole");
	if(!mycon) {if(bAlert) {alert("showDOM: kein Ausgabebereich gefunden!"); bAlert=false;}return;}

	if(!basis.childNodes) conWriteln(mycon, "ungueltiges Objekt!");
	else if(basis.childNodes.length==0) conWriteln(mycon, "Objekt leer!");
	else for(i=0; i<basis.childNodes.length; i++)
	{
		conWriteln(mycon, i+": "+basis.childNodes[i].nodeName+" ("+basis.childNodes[i].nodeType+") "+basis.childNodes[i].nodeValue);
	}
}
/////////////////////////////////////////////////////////////////////////////
function getChild(obj, iNum)
{
	var i;
	var mycount=-1;

	if(!iNum) iNum = 0;

	for(i=0; i<obj.childNodes.length; i++)
	{
		if(obj.childNodes[i].nodeType==1)
		{
			mycount++;
			if(mycount==iNum) return i;
		}
	}
	return -1;
}

var myCookie;
var aCookieData=new Array();
/////////////////////////////////////////////////////////////////////////////
function parseCookie()
{
	if (document.cookie)
	{
		myCookie = document.cookie;
  }
}
/////////////////////////////////////////////////////////////////////////////
function writeCookie()
{
	var cookieDate = new Date();
	cookieDate.setTime(cookieDate.getTime() + (5*24*60*60*1000));	//5 Tage, bis Cookie abgelaufen ist
	document.cookie += myCookie+" expires=" + cookieDate.toGMTString();
}
/////////////////////////////////////////////////////////////////////////////
function clearCookie()
{
	if (document.cookie)
	{
		var cookieDate = new Date();
		document.cookie="expires=" + cookieDate.toGMTString();
  }
}
/////////////////////////////////////////////////////////////////////////////
function getCookieVar(sVarName)
{
	var sRetVal="";
	return sRetVal;
}
/////////////////////////////////////////////////////////////////////////////
function setCookieVar(sVarName, sValue)
{
	myCookie+=sVarName+"="+sValue+";";
}
