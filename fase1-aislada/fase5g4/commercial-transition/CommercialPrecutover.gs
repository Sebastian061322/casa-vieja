/* Destino comercial separado. Precorte de solo lectura: no acepta ventas. */
const CV_COMMERCIAL_PRECUTOVER_NAME_='CasaVieja_COMERCIAL_PRECORTE_2026-11-13';

function commercialBook_(){
 const sheetId=PropertiesService.getScriptProperties().getProperty('CV_COMMERCIAL_SHEET_ID');
 if(!sheetId||!/^[a-zA-Z0-9_-]{20,100}$/.test(sheetId))throw Error('DESTINATION_NOT_CONFIGURED');
 const ss=SpreadsheetApp.openById(sheetId);
 if(ss.getName()!==CV_COMMERCIAL_PRECUTOVER_NAME_)throw Error('WRONG_DESTINATION');
 return ss;
}

function commercialRows_(ss,name,range){
 const sheet=ss.getSheetByName(name);
 if(!sheet)throw Error('SETUP_REQUIRED');
 return sheet.getRange(range).getValues();
}

function commercialCount_(ss,name){
 const sheet=ss.getSheetByName(name);
 if(!sheet)throw Error('SETUP_REQUIRED');
 return Math.max(0,sheet.getLastRow()-5);
}

function commercialPrecutoverStatus_(){
 const ss=commercialBook_();
 const control=Object.fromEntries(commercialRows_(ss,'Control','A5:B16').slice(1));
 if(control.Entorno!=='COMMERCIAL_PRE_CUTOVER'||control.Estado!=='CARGADO_SIN_VENTAS_NUEVAS')throw Error('WRONG_STATE');
 if(control['Ventas nuevas habilitadas']!=='NO'||control['Escritor de stock autorizado']!=='SISTEMA_ANTIGUO')throw Error('CUTOVER_GUARD_REQUIRED');
 const opening=commercialRows_(ss,'Apertura','A5:R6');
 const row=Object.fromEntries(opening[0].map((key,index)=>[key,opening[1][index]]));
 if(row.state!=='PREPARED_NOT_ACTIVE'||Number(row.grams)!==139500||Number(row.unitCostPerKg)!==36.35)throw Error('OPENING_MISMATCH');
 const counts={sales:commercialCount_(ss,'VentasLegado'),movements:commercialCount_(ss,'MovimientosLegado'),expenses:commercialCount_(ss,'EgresosLegado'),ads:commercialCount_(ss,'AdsLegado')};
 if(counts.sales!==328||counts.movements!==430||counts.expenses!==17||counts.ads!==103)throw Error('IMPORT_COUNTS_MISMATCH');
 return {environment:'COMMERCIAL_PRE_CUTOVER',status:'VERIFIED_READ_ONLY',newSalesEnabled:false,stockWriter:'OLD_SYSTEM_ONLY',opening:{state:row.state,poolId:row.poolId,grams:Number(row.grams),unitCostPerKg:Number(row.unitCostPerKg)},counts};
}

function doGet(){
 try{return ContentService.createTextOutput(JSON.stringify(commercialPrecutoverStatus_())).setMimeType(ContentService.MimeType.JSON);}
 catch(error){return ContentService.createTextOutput(JSON.stringify({environment:'COMMERCIAL_PRE_CUTOVER',status:'BLOCKED',error:/^[A-Z_]+$/.test(error.message)?error.message:'SERVER_UNAVAILABLE',newSalesEnabled:false})).setMimeType(ContentService.MimeType.JSON);}
}

function doPost(){
 return ContentService.createTextOutput(JSON.stringify({error:'CUTOVER_NOT_APPROVED',retryable:false,newSalesEnabled:false})).setMimeType(ContentService.MimeType.JSON);
}
