/* Cell.js

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mon Apr 23, 2007 17:29:18 AM , Created by sam
}}IS_NOTE

Copyright (C) 2007 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under GPL Version 2.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
(function () {
	var Div = zul.wgt.Div;
	zss.BaseInner = zk.$extends(zul.wgt.Div, {
		setSheet: function (sheet) {
			this._sheet = sheet;
		},
		doClick_: function (evt) {
			this._sheet._doMouseleftclick(evt);
		},
		doMouseDown_: function (evt) {
			this._sheet._doMousedown(evt);
		},
		doMouseUp_: function (evt) {
			this._sheet._doMouseup(evt);
		},
		doRightClick_: function (evt) {
			this._sheet._doMouserightclick(evt);
		},
		doDoubleClick_: function (evt) {
			this._sheet._doMousedblclick(evt);
		},
		doKeyDown_: function (evt) {
			this._sheet.doKeyDown_(evt);
		},
		afterKeyDown_: function (evt) {
			this._sheet._wgt.afterKeyDown_(evt);
		},
		doKeyPress_: function (evt) {
			this._sheet._doKeypress(evt);
		}
	});

	/**
	 * Cell inner container base on ZK flex for vertical alignment.
	 */
	zss.FlexInner = zk.$extends(zss.BaseInner, {
		$init: function () {
			this.$supers('$init', arguments);
			this.appendChild(new Div());
			this.appendChild(new Div());
			this.appendChild(new Div());
			this.setWidth('100%');
			this.setHeight('100%');
		},
		/**
		 * Sets the text
		 * @param string indicate vertical alignment
		 * @param string indicate horizontal alignment
		 * @param boolean wrap text or not
		 * @param boolean whether the height of the cell is default row height or not
		 */
		setText: function (t, valign, halign, defaultRowHgh) {
			var $t = this.firstChild,
				$c = $t.nextSibling,
				$b = this.lastChild;
			this.valign = valign;
			switch (valign) {
			// set top div visible; hide other div
			case 't':
				$t.$n().innerHTML = t;
				$c.setVisible(false);
				$b.setVisible(false);
				if (!defaultRowHgh)
					this._initShowAndFlex([$t]);
				if (zk.ie6_)
					this._restoreFontSize($t.$n());
				break;
			//set top div flex=true, center div flex=min, bottom div flex=true
			case 'c':
				$c.$n().innerHTML = t;
				$c.setVisible(true);
				if (!defaultRowHgh)
					this._initShowAndFlex([$t, $b], true);
				if (zk.ie6_)
					this._restoreFontSize($c.$n());
				break;
			//set top flex=true; center div invisible, bottom div flex=min
			case 'b':
				$c.setVisible(false);
				$b.$n().innerHTML = t;
				$b.setVisible(true);
				$b.setVflex(-65500);
				if (!defaultRowHgh)
					this._initShowAndFlex([$t], true);
				if (zk.ie6_)
					this._restoreFontSize($b.$n());
			}
			this.fixFlexHeight();
		},
		/**
		 * Fix flexed height
		 */
		fixFlexHeight: zk.ie6_ ? function () {
			var n = this.$n();
			if (!n)
				this._node = n = jq(this.uuid, zk)[0];
			if (n) {
				var cellHgh = n.parentNode.offsetHeight,
					curHgh = n.offsetHeight,
					$t = this.firstChild,
					$c = $t.nextSibling,
					$b = this.lastChild;
				if (curHgh > cellHgh) {
					var differHgh = curHgh - cellHgh;
					switch (this.valign) {
					case 'c':
						var tn = $t.$n(),
							bn = $b.$n(),
							setHgh = Math.round(((tn.offsetHeight + bn.offsetHeight) - differHgh) / 2),
							cssProp = {'height': setHgh + 'px', 'font-size': '0'};
						jq(tn).css(cssProp);
						jq(bn).css(cssProp);
						break;
					case 'b':
						var tn = $t.$n(),
							tnHgh = tn.offsetHeight,
							tnOffsetTop = tn.offsetTop,
							setHgh = tnHgh - differHgh;
						jq(tn).css({'height': setHgh + 'px', 'font-size': '0'});
					}
				}
			}
		} : zk.$void,
		_restoreFontSize: function (n) {
			jq(n).css('font-size', jq(this.$n()).css('font-size'));
		},
		getText: function () {
			var $t = this.firstChild;
			switch (this.valign) {
			case 't':
				return $t.$n().innerHTML;
			case 'c':
				var $c = $t.nextSibling;
				return $c.$n().innerHTML;
			case 'b':
				var $b = this.lastChild; 
				return $b.$n().innerHTML;
			}
			return null;
		},
		getPureText: function () { //feature #26:Support copy/paste value to local Excel
			var $t = this.firstChild;
			switch (this.valign) {
			case 't':
				var tn = $t.$n();
				return tn.textContent || tn.innerText;
			case 'c':
				var $c = $t.nextSibling, cn = $c.$n();
				return cn.textContent || cn.innerText;
			case 'b':
				var $b = this.lastChild, bn = $b.$n();
				return bn.textContent || bn.innerText;
			}
			return null;
		},
		onSize: function () {
			var $t = this.firstChild,
				$c = $t.nextSibling,
				$b = this.lastChild;
			switch (this.valign) {
			case 't':
				this._initShowAndFlex([$t], false);
				break;
			case 'c':
				this._initShowAndFlex([$t, $b], false);
				break;
			case 'b':
				this._initShowAndFlex([$t], false);
				break;
			}
			this.fixFlexHeight();
		},
		/**
		 * Clean widget's text, set visible and flex it.
		 * @param widget list to show and flex
		 * @param boolean whether to clear text or not
		 */
		_initShowAndFlex: function (visWgts, clear) {
			var $t = this.firstChild,
				wgts = [$t, $t.nextSibling, this.lastChild],
				flex = false; 
			for (var i = 0; i < wgts.length; i++) {
				var w = wgts[i];
				if (visWgts.$contains(w)) {
					flex = true;
					if (clear)
						w.$n().innerHTML = '';
					w.$n().style.height = '';
					w.setVisible(true);
					w.setVflex(true);
				}	
			}
			if (flex)
				zWatch.fireDown('onSize', this);
		}
	});


	/**
	 * Cell inner container base on CSS flexbox for vertical alignment.
	 */
	zss.FlexboxInner = zk.$extends(zss.BaseInner, {
		_vtal: {'t': 'top', 'c': 'mid', 'b': 'btm'},
		_htal: {'l': 'left', 'c': 'center', 'r': 'right'},
		$init: function () {
			this.$supers('$init', arguments);
			this.appendChild(new Div());
			this.setWidth('100%');
			this.setHeight('100%');
		},
		setText: function (t, valign, halign) {
			var n = this.firstChild.$n(),
				cls = 'zscell-inner-';
			n.innerHTML = t;
			cls += this._vtal[valign] + '-' + this._htal[halign];
			jq(n.parentNode).attr('class', '').addClass(cls);
			this.onSize();
		},
		getText: function () {
			return this.firstChild.$n().innerHTML;
		},
		getPureText: function () { //feature #26: Support copy/paste value to local Excel
			var tn = this.firstChild.$n(); 
			return tn.textContent || tn.innerText;
		},
		onSize: zk.gecko ? function () {
			var $n = jq(this.$n());
			jq(this.firstChild.$n()).css('width', $n.css('width'));
		} : zk.$void
	});

zss.Cell = zk.$extends(zk.Object, {
	lock: true,
	$init: function (sheet, block, cmp, edit) {
		this.$supers('$init', arguments);
		this.id = cmp.id;
		this.sheetid = sheet.sheetid;
		this.sheet = sheet;
		this.block = block;
		this.comp = cmp;
		this.overby = null;
		this.overhead = false;//overhead, this cell is a overflow's left cell
		this.edit = edit;

		var $n = jq(cmp);
		this.r = zk.parseInt($n.attr('z.r'));
		this.c = zk.parseInt($n.attr('z.c'));
		this.defaultRowHgh = ('1' == $n.attr('z.drh'));
			
		this.zsw = $n.attr('z.zsw');

		if (this.zsw)
			this.zsw = zk.parseInt(this.zsw);

		this.zsh = $n.attr('z.zsh');

		if (this.zsh)
			this.zsh = zk.parseInt(this.zsh);
		var lock = $n.attr('z.lock');
		if (lock != undefined)
			this.lock = !(lock == "f");
		var wrap = this.wrap = $n.attr('z.wrap') == "t";
		this.halign = $n.attr('z.hal');
		if (!this.halign)
			this.halign = "l";//default h align is left;
		var vtal = this.valign = $n.attr('z.vtal');
		if (!vtal)
			vtal = this.valign = "t";//default v align is top;
		
		var inner = null,
			txtCmp = this.txtcomp = $n.children('DIV:first')[0],
			txt = this.txtcomp.innerHTML,
			vflex = this._vflex = sheet._wgt._cssFlex; /*support CSS flexbox or not*/
		if (this.valign != "t" && txt) {
			inner = this._appendInner();
		}
		//is this cell has right border,
		//i must do some special processing when textoverfow when with rborder.
		this.rborder = $n.attr('z.rbo') == "t";

		if (!txt) {
			txt = "";
		} else {
			//TODO should i check space cell for better performance?
			/*var t = txt.trim();
			(txt.charCodeAt(0)==160 ){//160 is &nbsp;
			if(t.length ==0){
				
			}*/
		}

		if (!txt)
			this._updateHasTxt(false);
		else {
			this._updateHasTxt(true);
			if (inner) {
				//set text directly when DOM is ready
				if (inner.$n() && this.defaultRowHgh)
					inner.setText(txt, vtal, this.halign, true);
				else /*TODO: avoid use addSSInitLater */
					sheet.addSSInitLater(zss.Cell._processInnerText, this, inner, txt);
			}
			if (sheet.config.textOverflow && !this.wrap) {
				sheet.addSSInitLater(zss.Cell._processOverflow, this);
			}
		}
		//process merge.
		var mid = $n.attr('z.merid');
		if (zkS.t(mid)) {
			this.merr = zk.parseInt($n.attr('z.merr')); 
			this.merid = zk.parseInt(mid);
			this.merl = zk.parseInt($n.attr('z.merl')); 
			this.mert = zk.parseInt($n.attr('z.mert')); 
			this.merb = zk.parseInt($n.attr('z.merb')); 
		}
		cmp.ctrl = this;
	},
	/**
	 * Returns whether cell locked or not
	 * @return boolean
	 */
	isLocked: function () {
		return this.lock;
	},
	_updateHasTxt: function (bool) {
		var block = this.block;
		if (this.hastxt && !bool) {
			block._textedcell.$remove(this);	
		} else if (bool && !this.hastxt) {
			block._textedcell.push(this);
		}
		this.hastxt = bool;
		jq(this.comp).css('z-index', bool ? "" : 1);
	},
	/**
	 * Append inner child for vertical alignment
	 * @param boolean support flexbox or not
	 */
	_appendInner: function () {
		var inner = null,
			txtCmp = this.txtcomp,
			ctmp = jq('<div id="ctmp"></div>');
		$(txtCmp).empty().append(ctmp);
		inner = this._inner = this._vflex ? new zss.FlexboxInner() : new zss.FlexInner();
		if (inner.onSize)
			this.onSize = function () {
				inner.onSize();
			};
		inner.replaceHTML(ctmp);
		inner.setSheet(this.sheet);
		return inner;
	},
	/**
	 * Sets the text of the cell
	 * @param string text
	 */
	setText: function (txt) {
		if (!txt)
			txt = "";
		this._updateHasTxt(txt != "");
		this._setText(txt);

		if (this.sheet.config.textOverflow)
			zss.Cell._processOverflow(this);
	},
	getText: function () {
		if (this._inner)
			return this._inner.getText();
		return this.txtcomp.innerHTML;
	},
	getPureText: function () { //feature #26: Support copy/paste value to local Excel
		if (this._inner)
			return this._inner.getPureText();
		return this.txtcomp.textContent || this.txtcomp.innerText;
	},
	_setText: function (txt) {
		if (!txt)
			txt = "";

		var vtal = this.valign,
			hal =  this.halign,
			wrap = this.wrap;
		if (this._inner)
			this._inner.setText(txt, vtal, hal);
		else if (vtal == 't')
			this.txtcomp.innerHTML = txt;
		else if (txt) {
			this._appendInner();
			this._inner.setText(txt, vtal, hal);
		}
	},
	/**
	 * Invoke after append this cell to DOM tree
	 */
	afterAppend: zk.ie6_ ? function () {
		if (this._inner)
			this._inner.fixFlexHeight();
	} : zk.$void,
	cleanup: function () {
		this.invalid = true;
		this._updateHasTxt(false);
		if (this.overhead && !this.block.invalid) {
			//remove the overby relation , because the cell that is overbyed maybe not be destroied.
			zss.Cell._clearOverbyRelation(this);
			this.block._overflowcell.$remove(this);	
		}
		var inner = this._inner;
		if (inner) {
			inner.unbind();
			this._inner = null;
		}
		if (this.comp) this.comp.ctrl = null;
		this.comp = this.txtcomp = this.sheet = this.overby = 
			this.block = this._inner = this._vflex = this.lock = this.defaultRowHgh = null;
	},
	/**
	 * Sets the width position index
	 * @param int zsw the width position index
	 */
	appendZSW: function (zsw) {
		this.zsw = zsw;
		jq(this.comp).attr("z.zsw", zsw).addClass("zsw" + zsw);
		jq(this.txtcomp).addClass("zswi" + zsw);
	},
	/**
	 * Sets the height position index
	 * @param int zsh the height position index
	 */
	appendZSH: function (zsh) {
		this.zsh = zsh;
		jq(this.comp).attr("z.zsh", zsh).addClass("zshi" + zsh);
		jq(this.txtcomp).addClass("zshi" + zsh);
	},
	/**
	 * Sets the column index of the cell
	 * @param int column index
	 */
	resetColumnIndex: function (newcol) {
		jq(this.comp).attr("z.c", (this.c = newcol));
	},
	/**
	 * Sets the row index of the cell
	 * @param int row index
	 */
	resetRowIndex: function (newrow) {
		jq(this.comp).attr("z.r", (this.r = newrow));
	}
}, {
	/**
	 * Create DOM node and Cell object
	 * @return object Cell
	 */
	createComp: function (sheet, block, parm) {
		var row = parm.row,
			col = parm.col,
			txt = parm.txt,
			st = parm.st,//style
			ist = parm.ist,//style of inner div
			hal = parm.hal,
			vtal = parm.vtal, //vertical align
			merr = parm.merr,
			merid = parm.merid,
			merl = parm.merl,
			mert = parm.mert,
			merb = parm.merb,
			zsw = parm.zsw,
			zsh = parm.zsh,
			cmp = document.createElement("div"),
			drh = parm.drh,
			lock = parm.lock,
			$n = jq(cmp);

		$n.attr({"zs.t": "SCell", "z.c": col, "z.r": row, 
			"z.hal": (hal ? hal : "l"), "z.vtal": (vtal ? vtal : "t"), 'z.drh': !drh ? '0' : drh});
		
		if (lock != undefined && !lock) $n.attr("z.lock", "f");
		if (zsw) $n.attr("z.zsw", zsw);
		if (zsh) $n.attr("z.zsh", zsh);
		if (parm.wrap) $n.attr("z.wrap", "t");
		if (parm.rbo) $n.attr("z.rbo", "t");
		
		if (zkS.t(merid))
			$n.attr({"z.merr": merr, "z.merid": merid, "z.merl": merl, "z.mert": mert, "z.merb": merb}).addClass(merl == col && mert == row? "zsmerge" + merid : mert == row ? "zsmergee" : "zsmergeeu");
		
		if (st)
			cmp.style.cssText = st;
		
		var txtcmp = document.createElement("div");
		if (ist)
			txtcmp.style.cssText = ist;
		txtcmp.innerHTML = txt ? txt : "";
		cmp.appendChild(txtcmp);
		
		var sclazz = "zscell" + (zsw ? " zsw" + zsw : "") + (zsh ? " zshi" + zsh : "");
		$n.addClass(sclazz);
		
		sclazz = "zscelltxt" + (zsw ? " zswi" + zsw : "") + (zsh ? " zshi" + zsh : "");
		jq(txtcmp).addClass(sclazz);
		return new zss.Cell(sheet, block, cmp, parm.edit);
	},
	/**
	 * Update cell's text and style
	 * @param zss.Cell ctrl
	 * @param map parameter setting
	 */
	updateCell: function (ctrl, parm) {
		var txt = parm.txt,
			edit = parm.edit,
			st = parm.st,//style
			ist = parm.ist,//style of inner div
			wrap = parm.wrap,
			hal = parm.hal,
			vtal = parm.vtal,
			lock = parm.lock,
			rbo = parm.rbo,
			cmp = ctrl.comp;
		if (lock != undefined)
			ctrl.lock = lock;
		if (!wrap)
			wrap = false;
		jq(cmp).attr("z.wrap", wrap);	
		ctrl.wrap = wrap;
		var txtcmp = ctrl.txtcomp;
		
		if (!st)
			st = "";
		if (!ist)
			ist = "";
		cmp.style.cssText = st;
		txtcmp.style.cssText = ist;
		
		ctrl.halign = hal;
		if (!ctrl.halign)
			ctrl.halign = "l";//default h align is left;
		if (!vtal)
			vtal = 't';//default v align is top
		if (vtal != ctrl.valign) {
			ctrl.valign = vtal;
		}
		
		ctrl.rborder = (rbo == true);
		ctrl.setText(txt);
		ctrl.edit = parm.edit;
	},
	_clearOverbyRelation: function (ctrl) {
		var cmp = ctrl.comp,
			sheet = ctrl.sheet;
		if (ctrl.overhead && !sheet.invalid) {
			var next = jq(cmp).next('DIV')[0],
				nctrl;
			while (next) {
				nctrl = next.ctrl;
				if (nctrl && nctrl.overby == ctrl) {
					nctrl.overby = null;
					next = jq(next).next('DIV')[0];
					continue;	
				}
				break;
			}
		}
	},
	/**
	 * Invoke after CSS ready, set text and alignment
	 */
	_processInnerText: function (ctrl, cellInnerWgt, txt) {
		if (ctrl.invalid)
			return;
		
		cellInnerWgt.setText(txt, ctrl.valign, ctrl.halign, ctrl.defaultRowHgh);
	},
	_processOverflow: function (ctrl) {
		var sheet = ctrl.sheet;
		if (ctrl.invalid || !sheet.config.textOverflow) {
			//a cell might load on demand, it will cause a initial later to process text overflow(see also,CellBlock._createCell)
			//but it some time, it will be prune after load ,
			//so we must ignore this when ctrl.invliad
			return;
		}
		var cmp = ctrl.comp,
			block = ctrl.block,
			txtcmp = ctrl.txtcomp;

		jq(txtcmp).css({'width': '', 'position': ''});//remove old value.
		//1995735,force IE recaluate some thing first
		if (zk.ie && txtcmp.clientWidth) {}

		var sw = txtcmp.scrollWidth,
			cw = cmp.clientWidth - 2 * sheet.cellPad,
			oldoverby = ctrl.overby,
			overflow = (ctrl.hastxt && ctrl.halign == "l" && !ctrl.wrap  && !zkS.t(ctrl.merid)  && sw > cw); 
		
		if (overflow) {//process condition, halign is left, no wrap
			if (!ctrl.overhead && !block._overflowcell.$contains(ctrl))
				block._overflowcell.push(ctrl);

			ctrl.overhead = true;
			txtcmp.style.position = zk.ie || zk.safari ? "absolute" : "relative";

			var w = cmp.clientWidth,
				prev = cmp,
				next = jq(cmp).next('DIV')[0],
				count = 0;
			while (next) {
				if (!next.ctrl) {//next no initial yet, then delay and process again.
					zkS.addDelayBatch(zss.Cell._processOverflow, false, ctrl);
					return;
				}
				next.ctrl.overby = ctrl;
				if (next.ctrl.hastxt) {
					jq(prev).removeClass(prev.ctrl.rborder ? "zscell-over-b" : "zscell-over");
					break;
				}
				if (prev.ctrl.rborder) {
					jq(prev).removeClass("zscell-over").addClass("zscell-over-b");
				} else {
					jq(prev).removeClass("zscell-over-b").addClass("zscell-over");
				}
				
				var ow = next.offsetWidth;
				w = w + ow;
				if (w > sw) {
					jq(next).removeClass(next.ctrl.rborder ? "zscell-over-b" : "zscell-over");
					
					//keep remove next overflow if it is over by this cell
					next = jq(next).next('DIV')[0];//next.nextSibling;
					while (next) {
						if (ctrl != next.ctrl.overby)
							break;
						jq(next).removeClass(next.ctrl.rborder ? "zscell-over-b" : "zscell-over");

						next.ctrl.overby = null;
						next = jq(next).next('DIV')[0];
					}
					break;
				}
				prev = next;
				next = jq(next).next('DIV')[0];
			}
			w =  w - sheet.cellPad;
			if (w < 0) w = 0;// bug, when some column or row is invisible, the w might be samlle then zero
			jq(txtcmp).css('width', jq.px0(w));
		} else {
			if (ctrl.overhead)
				block._overflowcell.$remove(ctrl);	
			ctrl.overhead = false;
			jq(cmp).removeClass(cmp.ctrl.rborder ? "zscell-over-b" : "zscell-over");

			var next = jq(cmp).next('DIV')[0];
			while (next) {
				//next no initial yet skip to check
				if(!next.ctrl || 
					ctrl != next.ctrl.overby && (oldoverby ? oldoverby != next.ctrl.overby : true))
					break;
				jq(next).removeClass(next.ctrl.rborder ? "zscell-over-b" : "zscell-over");

				next.ctrl.overby = null;
				next = jq(next).next('DIV')[0];
			}
		}
		
		if (oldoverby)
			zss.Cell._processOverflow(oldoverby);
	}
});
})();