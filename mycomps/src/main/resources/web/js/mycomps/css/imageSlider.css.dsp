<%--
	Here you could do any styling job you want , all CSS stuff.
--%>
<%@ taglib uri="http://www.zkoss.org/dsp/web/core" prefix="c" %>

.z-imageslider{
	width: 680px;
	height: 200px;
	margin-right : 0px;
/*	left: 200px;*/
}
body {
	
}

.z-imageslider .noArrow {
	display:none;
}

.z-imageslider .arrow {
	height: 40px;
	width: 40px;
	margin-right:0px;
	position: relative;	

}

.z-imageslider .leftArrow {
	float: left;
	background-image: url('/mycomps/image/40_40_left_wb.PNG');
}

.z-imageslider .rightArrow {
	float: left;
	background-image: url('/mycomps/image/40_40_right_wb.PNG');
}

.z-imageslider .ironmanViewContainer {
	
	position: relative;
	overflow: hidden;
	float:left;
}

.z-imageslider .ironman {
	height: 100%;
	width: 100%;
	float:left;
}

.z-imageslider .ironmanContainer {
	width: 1000px;
	height: 200px;
	position: relative;
/* 	left: 400px; */

}
z.-imageslider image{
	height: 100%;
	width: 100%;
}


.z-imageslider .ironmanBox{
	height: 200px;
	width: 200px;
	float:left;
}


.z-imageslider .carousel {

}
.z-imageslider .clear{
	clear:left;
}

.z-imageslider .selected{
	box-sizing: border-box;
	border: 3px solid green;
}
