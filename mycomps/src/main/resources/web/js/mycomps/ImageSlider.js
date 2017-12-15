/**
 *
 * Base naming rule: The stuff start with "_" means private , end with "_" means
 * protect , others mean public.
 *
 * All the member field should be private.
 *
 * Life cycle: (It's very important to know when we bind the event) A widget
 * will do this by order : 1. $init 2. set attributes (setters) 3. rendering
 * mold (@see mold/mycomps.js ) 4. call bind_ to bind the event to dom .
 *
 * this.deskop will be assigned after super bind_ is called, so we use it to
 * determine whether we need to update view manually in setter or not. If
 * this.desktop exist , means it's after mold rendering.
 *
 */
mycomps.ImageSlider = zk.$extends(zul.Widget, {
    _viewportSize: 4,
    _selectedIndex: -1,
    _imageWidth: 200,
    /**
     * Don't use array/object as a member field, it's a restriction for ZK
     * object, it will work like a static , share with all the same Widget class
     * instance.
     *
     * if you really need this , assign it in bind_ method to prevent any
     * trouble.
     *
     * TODO:check array or object , must be one of them ...I forgot. -_- by Tony
     */

    $define: {
        /**
         * The member in $define means that it has its own setter/getter. (It's
         * a coding sugar.)
         *
         * If you don't get this , you could see the comment below for another
         * way to do this.
         *
         * It's more clear.
         *
         */
        viewportSize: function(val) {
            if (this.desktop) {
                this.$n('view').style.width = val * this.getImageWidth() + 'px';
                this.resetCss_();
            }
        },
        imageWidth: function(width) {
            if (this.desktop) {
                var container = this.$n('container');
                jq('.ironmanBox').css({
                    width: width,
                    height: width,
                });
                jq('.selected').css({
                    width: width - 6,
                    height: width - 6,
                });
                jq(this.$n('view')).css({
                    width: width * this._viewportSize,
                    height: width
                });
                jq(container).css({
                    width: width * this.nChildren,
                    height: width,
                    scrollLeft: container.scrollLeft * width / 200
                });
                jq(this.$n('leftArrow')).css("marginTop", (width - 40) / 2);
                jq(this.$n('rightArrow')).css("marginTop", (width - 40) / 2);
                this.ironmanContainerPos *= (width / 200);
                this.resetCss_();
            }
        },
        selectedIndex: function(val) {
            if (this.desktop) {
                jq('.selected').removeClass('selected');
                if (val != -1) {
                    jq(this.getChildAt(val).$n()).parent().addClass("selected");
                    this.moveToSelected();
                }
            }
        },
    },

    removeChildHTML_: function(child) {
        jq(child.$n()).parent().remove();
        this.$supers('removeChildHTML_', arguments); // 需要有把小孩remove調
        // 小孩才會真的確定刪除不會有memory leak
    },

    insertChildHTML_: function(child, before, desktop) {
        if (before) {
            jq(before.$n()).parent().before(this.encloseChildHTML_(child));
        } else {
            jq(this).find('.ironmanContainer').append(this.encloseChildHTML_(child));
        }
        child.bind(desktop);
    },

    encloseChildHTML_: function(child, out) {
        var oo = new zk.Buffer();
        oo.push('<div id="', child.uuid, '-chdex" class="ironmanBox" style="width: ', this.getImageWidth(), 'px; height: ', this.getImageWidth() + 'px;">');
        child.redraw(oo);
        oo.push('</div>');
        if (!out) return oo.join('');
        out.push(oo.join(''));
    },

    resetCss_: function() {
        var _showArrow = (this.getViewportSize() < this.nChildren);
        if (!_showArrow) {
            this.$n('leftArrow').className = 'arrow noArrow';
            this.$n('rightArrow').className = 'arrow noArrow';;
        } else {
            this.$n('leftArrow').className = 'arrow leftArrow';
            this.$n('rightArrow').className = 'arrow rightArrow';
        }
        jq(this.$n('leftArrow')).css("marginTop", (this._imageWidth - 40) / 2);
        jq(this.$n('rightArrow')).css("marginTop", (this._imageWidth - 40) / 2);
        jq(this.$n('container')).css({
            width: this._imageWidth * this.nChildren,
            height: this._imageWidth,
            scrollLeft: this.$n('container').scrollLeft * this._imageWidth / 200
        });
    },

    /**
     * If you don't like the way in $define , you could do the setter/getter by
     * yourself here.
     *
     * Like the example below, they are the same as we mentioned in $define
     * section.
     */
    // zWatch
    bind_: function() {
        /**
         * For widget lifecycle , the super bind_ should be called as FIRST
         * STATEMENT in the function. DONT'T forget to call supers in bind_ , or
         * you will get error.
         */
    	// A example for domListen_ , REMEMBER to do domUnlisten in unbind_.
        this.$supers(mycomps.ImageSlider, 'bind_', arguments);
        this.resetCss_();
        this.setImageSlideParameter();
        this.domListen_(this.$n('leftArrow'), "onClick", "slide");
        this.domListen_(this.$n('rightArrow'), "onClick", "slide");
        zWatch.listen({ 
            onResponse: this
        });
    },
    /*
     * this.domListen_(this.$n(), "onClick", "doClick_"); A example for
     * domListen_ listener. _doItemsClick: function (evt) { alert("item click
     * event fired"); },
     */

    unbind_: function() {
        // A example for domUnlisten_ , should be paired with bind_
        zWatch.unlisten({ 
            onResponse: this
        });
        this.domUnListen_(this.$n('rightArrow'), "onClick", "slide");
        this.domUnListen_(this.$n('leftArrow'), "onClick", "slide");
        this.$supers(mycomps.ImageSlider, 'unbind_', arguments);
        /*
         * this.domUnlisten_(this.$n(), "onClick", "_doClick_"); For widget
         * lifecycle , the super unbind_ should be called as LAST STATEMENT in
         * the function.
         */
    },
    /*
     * widget event, more detail please refer to
     * http://books.zkoss.org/wiki/ZK%20Client-side%20Reference/Notifications
     */
    onResponse: function() {
        this.resetCss_();
    },
    doSelect_: function(evt) {
        if (evt.currentTarget != this) {
            if (this._selectedIndex != evt.currentTarget.getChildIndex()) {
                jq(evt.currentTarget).parent().addClass("selected");
                this.setSelectedIndex(evt.currentTarget.getChildIndex());
                this.fire('onSelect', {
                    items: [evt.currentTarget],
                    reference: evt.currentTarget
                });
                // if use this'jq(evt.currentTarget).parent().index()', is not so unique in zk html, may be override 
                // this.$super('doClick_', evt, true);// change to do select or
                // do not need it
            }
        }
    },

    setImageSlideParameter: function() {
        this.ironmanContainerPos = 0;
        this.sliding = false;
    },

    moveToSelected: function() {
        if (this._selectedIndex != -1) {
            var theWidget = this,
                moveToSelectAction = setInterval(function() {
                    var imagePos = (theWidget._selectedIndex + 0.5) * theWidget._imageWidth,
                        containerScrollLef = theWidget.$n('view').scrollLeft,
                        viewWidth = theWidget._viewportSize * theWidget._imageWidth,
                        delta = imagePos - containerScrollLef;
                    if (delta > viewWidth) {
                        theWidget.slide(null, 1, 'left')
                    } else if (delta < 0) { // extract to a function
                        theWidget.slide(null, 1, 'right')
                    } else {
                        clearInterval(moveToSelectAction);
                    }
                }, 3, theWidget)

        }
    },
    // go to _slide
    slide: function(e, setStepDivision, setDir) {
        var dir, targetPos, moveDist, slideable, theWidget, timestep, stepDivision;
        theWidget = this;
        timestep = 5 * 200 / this._imageWidth;

        if (!setDir) {
            dir = (e.domTarget == this.$n('leftArrow')) ? 'left' : 'right';
        } else {
            dir = setDir;
        }
        stepDivision = (!setStepDivision) ? 1 : setStepDivision;

        if (!this.sliding) {
            targetPos = this.ironmanContainerPos;
            if (dir == 'left') {
                slideable = (this.ironmanContainerPos < this._imageWidth * (this.nChildren - this._viewportSize));
            } else {
                slideable = (this.ironmanContainerPos > 0);
            }
            if (slideable) {
                moveDist = (dir == 'left') ? targetPos + this._imageWidth / stepDivision : targetPos - this._imageWidth / stepDivision;
                this.sliding = true;
                this.slideAction = setInterval(function() {
                    if (theWidget.ironmanContainerPos == moveDist) {
                        clearInterval(theWidget.slideAction);
                        theWidget.sliding = false;
                    } else if (dir == 'left') {
                        theWidget.ironmanContainerPos++;
                    } else {
                        theWidget.ironmanContainerPos--;
                    }
                    theWidget.$n('view').scrollLeft = theWidget.ironmanContainerPos;
                }, timestep, theWidget, moveDist, dir)
            } else {
                this.sliding = false;
            }
        }
    }
});