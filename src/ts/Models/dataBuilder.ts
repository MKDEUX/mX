import CallAIS from "./callAIS";

class DataBuilder {


    /**
     * Deploy the orchestration item transfert
     * @param {string} LITM Item number
     * @param {string} MCUF From branch plant
     * @param {string} MCU To branch plant
     * @param {string} LOTN Batch number
     * @param {number} TRQT Quantity send
     * @param {string} LOCNE1 From location
     * @param {string} LOCNE2 To location 
     * @returns a message if your transfert was successful or not
     */
    public static itemTransfert = async (LITM: string, MCUF: string, MCU: string, LOTN: string, TRQT: number, LOCNE1: string, LOCNE2: string) => {
        const orchestration = "X_IT01_SR_Inventory_Transfer";
        const body = {
            Explanation: "Transfert via appli Mobeex",
            From_Branch_Plant: MCUF,
            To_Branch_Plant: MCU,
            GridIn_1_2: [
                {
                    Item_Number: LITM,
                    Quantity: TRQT,
                    From_Location: LOCNE1,
                    From_Lot_Serial: LOTN,
                    To_Location: LOCNE2
                }
            ]
        };
        const response = await this.executeOrchestration(orchestration, body);
        return response;
    };
    /**
     * an data request to get the description linked to an item number
     * @param {string} LITM 
     * @returns your item description
     */
    public static getItemData = async (LITM: string) => {
        const body = {
            "outputType": "GRID_DATA",
            "maxPageSize": "1",
            "cacheTime": 0,
            "targetName": "V41021E",
            "targetType": "view",
            "dataServiceType": "BROWSE",
            "returnControlIDs": "F4101.DSC1|F4101.UOM1|F4101.UOM2",
            "query": {
                "autoFind": true,
                "autoClear": true,
                "complexQuery": [{
                    "query": {
                        "matchType": "0",
                        "condition": [{
                            "controlId": "F4101.LITM",
                            "operator": "EQUAL",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": LITM
                            }]
                        }]
                    }
                }]
            }
        };
        const response = await this.executeDataService(body);
        return response.fs_DATABROWSE_V41021E.data.gridData.rowset;
    };


    /**
     *  an data request to get the location available for an item number on a branch plant
     * @param {string} LITM 
     * @param {string} MCU 
     * @returns a list of location available
     */
    public static getItemLocation = async (LITM: string, MCU: string) => {
        const body = {
            "outputType": "GRID_DATA",
            "maxPageSize": "No Max",
            "pageSize": 1000,
            "cacheTime": 0,
            "targetName": "V41021E",
            "targetType": "view",
            "dataServiceType": "BROWSE",
            "returnControlIDs": "F41021.LOCN",
            "query": {
                "autoFind": true,
                "autoClear": true,
                "complexQuery": [{
                    "query": {
                        "matchType": "0",
                        "condition": [{
                            "controlId": "F4101.LITM",
                            "operator": "EQUAL",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": LITM
                            }]
                        }, {
                            "controlId": "F41021.MCU",
                            "operator": "EQUAL",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": MCU
                            }]
                        }, {
                            "controlId": "F41021.PQOH",
                            "operator": "GREATER",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": 0
                            }]
                        }
                        ]
                    }
                }
                ]
            }
        };
        const response = await this.executeDataService(body);
        return response.fs_DATABROWSE_V41021E.data.gridData.rowset;
    };

    /**
     * an data request to get the quantity available for an item number on a branch plant
     * @param {string} LITM 
     * @param {string} MCUF 
     * @param {string} LOCN 
     * @returns the quantity available
     */
    public static getItemQuantity = async (LITM: string, MCUF: string, LOCN: string) => {
        const body = {
            "outputType": "GRID_DATA",
            "maxPageSize": "No Max",
            "pageSize": 1000,
            "cacheTime": 0,
            "targetName": "V41021E",
            "targetType": "view",
            "dataServiceType": "BROWSE",
            "returnControlIDs": "F41021.PQOH",
            "query": {
                "autoFind": true,
                "autoClear": true,
                "complexQuery": [{
                    "query": {
                        "matchType": "0",
                        "condition": [{
                            "controlId": "F4101.LITM",
                            "operator": "EQUAL",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": LITM
                            }]
                        }, {
                            "controlId": "F41021.MCU",
                            "operator": "EQUAL",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": MCUF
                            }]
                        }, {
                            "controlId": "F41021.LOCN",
                            "operator": "EQUAL",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": LOCN
                            }]
                        }, {
                            "controlId": "F41021.PQOH",
                            "operator": "GREATER",
                            "andOr": "and",
                            "value": [{
                                "specialValueId": "LITERAL",
                                "content": 0
                            }]
                        }
                        ]
                    }
                }]
            }
        };
        const response = await this.executeDataService(body);
        return response.fs_DATABROWSE_V41021E.data.gridData.rowset;
    };

    public static getInventoryByLocation = async (Location: string, Branch_Plant: string) => {
        const orchestration = "TEST_IN_02_FR";
        const body = {
            Location: Location,
            Branch_Plant: Branch_Plant
        };
        const response = await this.executeOrchestration(orchestration, body);
        return response;
    };

      /**
     * X_IN01_SR_Item_Availability_03_IN
     * qui récupère la liste des emplacements avec du stock
     * @param itemNumber
     * @param branchPlant 
     * @returns 
     */
      public static getItemAvailability = async (itemNumber: string, branchPlant: string) => {
        const orchestration = "X_IN01_SR_Item_Availability_03_IN";
        const body = {
            itemNumber: itemNumber,
            branchPlant: branchPlant
        };
        const response = await this.executeOrchestration(orchestration, body);
        return response;
    };

    private static executeOrchestration = async (orchestrationName: string, body) => {
        const route = "/jderest/v3/orchestrator/" + orchestrationName;
        return await CallAIS.callAIS("POST", route, body);
    };

    private static executeDataService = async (body) => {
        const route = "/jderest/v2/dataservice";
        return await CallAIS.callAIS("POST", route, body);
    }
}
export default DataBuilder;