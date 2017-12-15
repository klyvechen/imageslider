package test.ctrl;

import org.test.mycomps.ImageSlider;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;
import org.zkoss.zul.Button;
import org.zkoss.zul.Image;
import org.zkoss.zul.Listbox;
import org.zkoss.zul.Textbox;

public class DemoWindowComposer extends SelectorComposer {

	@Wire
	private ImageSlider imageSlider;
	
	@Wire
	private Button addIronman;
	@Wire
	private Listbox whichIronman;
	@Wire
	private Button setViewportSize;
	@Wire
	private Listbox viewportSizeNo;
	@Wire
	private Button removeSelectImg;	
	@Wire
	private Textbox imageSizeInput;	
	@Wire
	private Button selectImg;
	@Wire
	private Listbox selectImgId;
	
	public void doAfterCompose(Component comp) throws Exception {
		System.out.println("in the demo: do doAfterCompose");
		super.doAfterCompose(comp);
		// if we set the attribute and the imageSlider will run the define

	}

	@Listen("onFoo=#imageSlider")
	public void imageSliderListen(Event event) {
		// Event mouseEvent = (Event) event.getData();
		System.out.println("in the demo: do onFoo$myComp");
		// Clients.alert("You listen onFoo: " +event.toString());
		// Clients.loadCSS("/css/imageSliderweb.css");
	}

	@Listen("onClick=#setViewportSize")
	public void setViewportSize(Event event) {
		System.out.println(Integer.parseInt(viewportSizeNo.getSelectedItem().getLabel()) + "$label");
		imageSlider.setViewportSize(Integer.parseInt(viewportSizeNo.getSelectedItem().getLabel()));
	}

	@Listen("onClick=#removeSelectImg")
	public void removeSelectImg(Event event) {
		//imageSlider.removeSelectedImg();
		//imageSlider.removeChild(imageSlider.getSelectedItem());
		System.out.println(imageSlider.getSelectedItem());
		imageSlider.removeChild(imageSlider.getSelectedItem());
	}
	
	@Listen("onClick=#addIronman")
	public void addIronman(Event event){
		//imageSlider.addImage(whichIronman.getSelectedItem().getImage());
		//we should add the ironman class at this place
		Image img = new Image(whichIronman.getSelectedItem().getImage());
		img.setClass("ironman");
		imageSlider.appendChild(img);
		System.out.println(imageSlider.getChildren());
	}

	@Listen("onClick=#setImageSize")
	public void setImageSize(Event event) {
		System.out.println(imageSizeInput.getValue());
		if (imageSizeInput.getValue() != null) {
			imageSlider.setImageWidth(Integer.parseInt(imageSizeInput.getValue()));
		}
	}
	@Listen("onClick=#selectImg")
	public void selectImg(Event event) {
		System.out.println("setSelector");
			imageSlider.setSelectedIndex((Integer.parseInt(selectImgId.getSelectedItem().getLabel())));
		//	imageSlider.setSelectedItem((Image)imageSlider.getChildren().get((Integer.parseInt(selectImgId.getSelectedItem().getLabel()))));
	}
	@Listen("onSelect=#imageSlider")
	public void imageSelect(SelectEvent event) {
		System.out.println("onselect call");
		System.out.println(event.getReference().getId());
	}
}