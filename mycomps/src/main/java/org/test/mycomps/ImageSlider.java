package org.test.mycomps;

import java.util.Map;

import org.zkoss.lang.Objects;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zul.Image;
import org.zkoss.zul.impl.XulElement;

public class ImageSlider extends XulElement {

	private int _viewportSize = 4;
	private int _selectedIndex = -1;
	private int _imageWidth = 200;

	static {
		addClientEvent(ImageSlider.class, Events.ON_SELECT, CE_IMPORTANT);
	}

	public boolean removeChild(Component child) {
		int delta = this.getChildren().indexOf(child) - this.getSelectedIndex();
		if (delta == 0) {
			this.setSelectedIndex(-1);
		} else if (delta < 0) {
			this.setSelectedIndex(this._selectedIndex - 1);
		}
		return super.removeChild(child);
	}

	public boolean insertBefore(Component newChild, Component refChild) {
		int delta = this.getChildren().indexOf(newChild) - this.getSelectedIndex();
		if (delta > 0) {
			setSelectedIndex(this._selectedIndex + 1);
		}
		return super.insertBefore(newChild, refChild);
	}

	public void setViewportSize(String viewportSize) {
		if (!Objects.equals(_viewportSize, viewportSize)) {
			_viewportSize = Integer.parseInt(viewportSize);
			setViewportSize(_viewportSize);
		}
	}

	public void setViewportSize(int size) {
		if (!Objects.equals(_viewportSize, size)) {
			smartUpdate("viewportSize", size);
		}
	}

	public int getViewportSize() {
		return this._viewportSize;
	}

	public void setSelectedItem(Image item) {
		if (this.getChildren().contains(item)) {
			this._selectedIndex = this.getChildren().indexOf(item);
			smartUpdate("selectedItem", item);
		}
	}

	public Image getSelectedItem() {
		return (Image) this.getChildren().get(this._selectedIndex);
	}

	public void setSelectedIndex(int index) {
		if (!Objects.equals(this._selectedIndex, index)) {
			this._selectedIndex = index;
			smartUpdate("selectedIndex", index);
		}
	}

	public int getSelectedIndex() {
		return this._selectedIndex;
	}

	public void setImageWidth(int width) {
		if (!Objects.equals(this._imageWidth, width)) {
			System.out.println("setImageWidth");
			this._imageWidth = width;
			smartUpdate("imageWidth", width);
		}
	}

	public int getImageWidth() {
		return this._imageWidth;
	}

	// super//
	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer) throws java.io.IOException {
		System.out.println("start to render");
		super.renderProperties(renderer);
		render(renderer, "viewportSize", _viewportSize);
	}

	public void service(AuRequest request, boolean everError) {
		final String cmd = request.getCommand();
		final Map data = request.getData();
		System.out.println(cmd + " " + Events.ON_SELECT);
		if (cmd.equals(Events.ON_SELECT)) {
			SelectEvent evt = SelectEvent.getSelectEvent(request);
			this._selectedIndex = this.getChildren().indexOf(evt.getReference());
			System.out.println(this._selectedIndex);
			Events.postEvent(evt);
		} else
			super.service(request, everError);
	}

	/**
	 * The default zclass is "z-mylabel"
	 */
	public String getZclass() {
		System.out.println("in the component(imageSlider): do getZclass");
		return (this._zclass != null ? this._zclass : "z-mylabel");
	}
}
