/**
* Here's the mold file , a mold means a HTML struct that the widget really presented.
* yep, we build html in Javascript , that make it more clear and powerful.
*/	

function (out) {
	var widgetuuid = this.uuid;
	console.log('in the mold/imageSlider.js');
	// combine with the uuid
    out.push('<div ', this.domAttrs_(), '><div id="'+this.uuid+'-leftArrow" class="arrow leftArrow" ></div>');
	// combine with the uuid
	// use the #zclass to produce the class name
    // the style is done in the Widget bind loop
    out.push('<div id="'+this.uuid+'-view" class="ironmanViewContainer" style="width:',this._imageWidth*this.getViewportSize() ,'px;float:left" >');
    
    out.push('<div id="'+this.uuid+'-container" class="ironmanContainer" style="float:left">');
	for (var w = this.firstChild; w; w = w.nextSibling){		
		this.encloseChildHTML_(w , out);
	}
    out.push('</div></div><div id="'+this.uuid+'-rightArrow" class="arrow rightArrow"></div></div><div class="clear"></div>');
}



