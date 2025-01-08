export interface Podetails {
    poNumber: string,
    supplierCode:string,
    supplierName:string,
    poDate :string,
    docType : string,
    status: string,
    supplierremark :string,
    tpsremark : string
}

export interface ponos {
    supplierCode: string,
    poNumber:number
}

export interface status {
    status: string
    // poNumber:number
}


export interface Adduser
{
    userName:string,
    fullName:string,
    emailId:string,
    roleId:number,
    isActive:Boolean,
    createdBy:number

}
export interface Po_details {
    suppliercode: string;
    suppliername: string;
    pono: number;
    itemno: number;
    materialcode: string | null;
    materialdes: string | null;
    materialqty: number;
    materialuom: string | null;
    etd: string; // Ensure this is a string or parse it to a Date in the component
    deliverystatus: string | null;
    eta: string;
  }

export interface lotdeletiondetails{
  id: number;                  // ID - Primary Key, auto-increment
  poNumber: string | null;     // PONumber - Purchase Order Number
  itemNumber: string | null;   // ItemNumber - Item Identifier
  lotNumber: number | null;    // LotNumber - Lot Identifier
  itemQty: number | null;      // ItemQty - Quantity of Items
  remark: string | null;       // Remark - Reason/Note for Deletion
  createDate: Date | null;     // CreateDate - Date of Record Creation
  createdBy: number | null;    // CreatedBy - ID of the User who created the record
}