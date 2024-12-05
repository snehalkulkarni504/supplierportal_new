export interface Podetails {
    poNumber: number,
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
    suppliercode: number;
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