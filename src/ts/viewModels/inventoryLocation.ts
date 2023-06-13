import * as AccUtils from "../accUtils";
import Message = require("ojs/ojmessaging");
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import * as ko from "knockout";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojtable";
import DataBuilder from "../Models/dataBuilder";
import rootViewModel from "../appController";


/** Interface describing the structure of inventory data */
interface InventoryData {
	ItemNumber: string;
	Description: string;
	LotSerial: string;
	QuantityOnHand: number;
	QuantityAvailable: number;
	UM: string;
}

/** ViewModel for the Inventory by Location page */
class DashboardViewModel {

	/** The selected location */
	public Location = ko.observable("");
	/** The selected branch/plant */
	public Branch_Plant = ko.observable("");


	/** The inventory data array */
	private readonly inventoryData: ko.ObservableArray<InventoryData> = ko.observableArray([]);

	/** The data structure for inventory items */
	readonly data: InventoryData[] = [
		{
			"ItemNumber": "",
			"Description": "",
			"LotSerial": "",
			"QuantityOnHand": 0,
			"QuantityAvailable": 0,
			"UM": ""
		}
	];

	/** The data provider for the inventory table */
	private readonly dataProvider = new ArrayDataProvider(this.inventoryData, {
		keyAttributes: "ItemNumber",
		implicitSort: [{ attribute: "ItemNumber", direction: "ascending" }],
	});
	/** Constructs a new instance of the InventoryByLocation class */
	constructor() { }


	/** 
	* Submits user input and retrieves inventory data   
	*/
	public submitInput = async (): Promise<void> => {
		const inventoryData = await DataBuilder.getInventoryByLocation(this.Location(), this.Branch_Plant());
		console.log(inventoryData);

		this.inventoryData(inventoryData.rowset);
	};

	/**  
	* Lifecycle method called when the page is connected 
		*/
	connected(): void {
		AccUtils.announce("Dashboard pag loaded.");
		document.title = "Dashboard";
		rootViewModel.checkIfConnected();
	}

	/**   
	* Lifecycle method called when the page is disconnected   
	*/
	disconnected(): void { }

	/**   
	* Lifecycle method called when the page transition is completed   
	*/
	transitionCompleted(): void { }
}



export = DashboardViewModel;