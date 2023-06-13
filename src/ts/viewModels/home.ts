import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojformlayout";
import "ojs/ojlabelvalue";
import "ojs/ojbutton";
import "ojs/ojlabel";
import rootViewModel from "../appController";
import "ojs/ojlistview";
import "ojs/ojavatar";
import "ojs/ojlistitemlayout";


class HomeViewModel {
  constructor() {
    rootViewModel.displayerHeader("off");
    rootViewModel.displayerFooter("off");
  }


  connected(): void {
    AccUtils.announce("Home page loaded.");
    document.title = "Home";
    rootViewModel.checkIfConnected();
  }

  disconnected(): void {
  }
  transitionCompleted(): void {
  }
}

export = HomeViewModel;
