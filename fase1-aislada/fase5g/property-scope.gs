/* Memo por solicitud, nunca entre usuarios/peticiones. Releer físicamente tras cada escritura. */
let cvPropertyScope5g_=null;
function cvProps5g_(){
 const base=PropertiesService.getScriptProperties();if(cvPropertyScope5g_===null)return base;const memo=cvPropertyScope5g_;
 return {getProperty(key){if(!memo.has(key))memo.set(key,base.getProperty(key));return memo.get(key);},setProperty(key,value){try{base.setProperty(key,value)}finally{memo.delete(key)}return this;}};
}
function zeroRequest(envelope){const previous=cvPropertyScope5g_;cvPropertyScope5g_=new Map();try{return zeroRequestBase5g_(envelope)}finally{cvPropertyScope5g_=previous;}}
