import * as ko from "knockout";
import DataBuilder from "../Models/dataBuilder";
import rootViewModel from "../appController";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import 'ojs/ojformlayout';
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojinputnumber";
import 'ojs/ojconveyorbelt';
import 'ojs/ojtable';
import "ojs/ojselectsingle";

class ItemTransfersViewModel {

  /**
   * Variables use for the form process
   * 
   */
  private readonly MCUF: ko.Observable<string> = ko.observable("");
  private readonly LOTN: ko.Observable<string> = ko.observable("");
  private readonly TRQT: ko.Observable<number> = ko.observable();
  private readonly LOCNE2: ko.Observable<string> = ko.observable("");
  private readonly LOCN: ko.Observable<string> = ko.observable("");
  private readonly MCU: ko.Observable<string> = ko.observable("");
  private readonly DSC1: ko.Observable<string> = ko.observable("");
  private readonly LITM: ko.Observable<string> = ko.observable("");
  private readonly UOM1: ko.Observable<string> = ko.observable("");
  private readonly UOM2: ko.Observable<string> = ko.observable("");
  private readonly LOC: ko.Observable<string> = ko.observable("");
  private readonly maxQT: ko.Observable<string> = ko.observable();


  private readonly data = ko.observableArray();
  private readonly dataProvider = new ArrayDataProvider(this.data, {
    keyAttributes: "value"
  });

  private readonly dataLoc = ko.observableArray()
  private readonly dataProviderLoc = new ArrayDataProvider(this.dataLoc, {
    keyAttributes: "value"
  });

  /**
   * These variables are there to allow translation from French to English 
   * So every text on the page should be an variable.
   */
  private readonly titreIT01: ko.Observable<string> = ko.observable("Item Transfer")
  private readonly labelTRUM: ko.Observable<string> = ko.observable("Unité de mesure")
  private readonly labelTRQT: ko.Observable<string> = ko.observable("Quantité");
  private readonly labelLOCNE2: ko.Observable<string> = ko.observable("à l'emplacement...");
  private readonly labelMCU: ko.Observable<string> = ko.observable("Au magasin...");
  private readonly labelLOCNE1: ko.Observable<string> = ko.observable("Transfer de l'emplacement...");
  private readonly labelMCUF: ko.Observable<string> = ko.observable("Du Magasin...");
  private readonly labelLOTN: ko.Observable<string> = ko.observable("Numéro de lot");
  private readonly labelDSC1: ko.Observable<string> = ko.observable("Description article");
  private readonly labelLITM: ko.Observable<string> = ko.observable("Article");

  constructor() {

    this.LITM.subscribe(() => {
      this.itemDesc()
    })
    this.MCUF.subscribe(() => {
      this.dataLoc([])
      this.itemLoc()
    })
    this.LOCN.subscribe(() => {
      this.itemQuantity()
    })

  }


  /**
   * Function who check undisabled the button if you
   * fill all the required field
   */
  private isComplete = ko.computed(() => {
    return this.LITM().length === 0 || this.LOTN().length === 0
      || this.LOCN().length === 0 || this.LOCNE2().length === 0
  })


  /**
   * That Function return the item description and the unit of measure
   * the returns is based on what you put as a item number
   * this function use the request getItemData from the dataBuilder file
   * @param  {string} LITM 
   * @returns The item Description (DSC1) and the Units of measure (UOM1 || UOM2)
   * 
   */
  private itemDesc = async () => {
    const item = await DataBuilder.getItemData(this.LITM());
    this.DSC1(item[0].F4101_DSC1);
    this.UOM1(item[0].F4101_UOM1);
    this.UOM2(item[0].F4101_UOM2);

    this.data([
      { value: "uom1", label: this.UOM1() },
      { value: "uom2", label: this.UOM2() }
    ])
  }

  /**
   * That Function return the location who was store the item
   * the returns is based on what you put as a item number and branch plant  
   * this function use the request getItemLocation from the dataBuilder file
   * @param LITM
   * @param MCUF
   * 
   * @returns the item locations (LOCN)
   */
  private itemLoc = async () => {
    const item = await DataBuilder.getItemLocation(this.LITM(), this.MCUF());
    console.log(item)
    //This is for extract and put the multiple result (location) on table
    item.forEach(element => {
      var test = {
        value: element.F41021_LOCN,
        label: element.F41021_LOCN
      }
      this.dataLoc.push(test);
    })
    console.log(this.dataLoc())
    if (this.dataLoc().length === 0) {
      alert("MCU not found ! (you should change the MCU)")
    }
  }

  /**
   * This function returns the quantity available for the item number on this branch plant where stock
   * at this locations
   * This function use the request getItemQuantity from dataBuilder file
   * 
   * @param {string} LITM
   * @param {string} MCUF
   * @param {string} LOCN 
   * 
   * @returns this quantity available (PQOH)
   */
  private itemQuantity = async () => {
    const item = await DataBuilder.getItemQuantity(this.LITM(), this.MCUF(), this.LOCN());
    this.maxQT(item[0].F41021_PQOH)
    console.log(this.maxQT())
  }

  /**
   * This function call the orchestration and returns 
   * a message if your transaction was success or not
   * 
   * This function need a lot of parameter
   * 
   * @param {string} LITM
   * @param {string} MCUF
   * @param {string} MCU
   * @param {string} LOTN
   * @param {string} TRQT
   * @param {string} LOCN
   * @param {string} LOCNE2
   * 
   * @return a message if the transaction was success or not 
   */
  private itemTransfer = async () => {
    const item = await DataBuilder.itemTransfert(this.LITM(), this.MCUF(), this.MCU(), this.LOTN(), this.TRQT(), this.LOCN(), this.LOCNE2());
    if (item != undefined) {
      alert(item);
    } else {
      alert("Success !")
    }
  }

  /**
   * Submit function launch the item transfer 
   * against what   you fill on the form
   */
  private submit = () => {
    this.itemTransfer()
  }

  connected(): void {
    rootViewModel.checkIfConnected();
  }

  disconnected(): void {
  }

  transitionCompleted(): void {
  }
}

export = ItemTransfersViewModel;
