import * as AccUtils from "../accUtils";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojknockout";
import * as ko from "knockout";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojtable";
import DataBuilder from "../Models/dataBuilder";

interface InventoryData {
  z_LOCNE1_62: string,
  z_LOTN_11: string,
  z_PQOH_13: number,
  z_QAVAL_47: number
}

class DashboardViewModel {
 
  /*
   * Variables use for the form process
   */
  private readonly itemNumber: ko.Observable<string> = ko.observable("");
  private readonly branchPlant: ko.Observable<string> = ko.observable("");
  
  private readonly inventoryData: ko.ObservableArray<InventoryData> = ko.observableArray<InventoryData>([]);
  private readonly dataProvider = new ArrayDataProvider(this.inventoryData, {
    keyAttributes: "location",
    implicitSort: [{ attribute: "location", direction: "ascending" }],
  })

  constructor() {
   
  }
  /**
   * Starts the request to retrieve available stocks
   */
  private submitInput = async () => {
      const inventoryData = await DataBuilder.getItemAvailability(this.itemNumber(), this.branchPlant())
      console.log(inventoryData);
      this.inventoryData(inventoryData.ServiceRequest1.fs_P41202_W41202A.data.gridData["rowset"]); 
  };


  connected(): void {
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Dashboard";
  }
  disconnected(): void {
  }
  transitionCompleted(): void {
  }
}

export = DashboardViewModel;
