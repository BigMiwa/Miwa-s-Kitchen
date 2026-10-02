'use client';
export type CheckoutDraft={name:string;email:string;phone:string;fulfilmentType:'collection'|'delivery';address:{line1:string;line2:string;city:string;postcode:string};notes:string;collectionTime:string};
const key='miwas-checkout-draft';export const emptyDraft:CheckoutDraft={name:'',email:'',phone:'',fulfilmentType:'collection',address:{line1:'',line2:'',city:'',postcode:''},notes:'',collectionTime:'As soon as possible'};
export function readDraft():CheckoutDraft{try{return {...emptyDraft,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return emptyDraft}}export function writeDraft(draft:CheckoutDraft){localStorage.setItem(key,JSON.stringify(draft))}export function clearDraft(){localStorage.removeItem(key)}
