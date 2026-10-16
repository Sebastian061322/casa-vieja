'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const {Engine}=require('../../fase4/commercial.js'),{commands}=require('../../fase4/scenario.js');
const clone=x=>JSON.parse(JSON.stringify(x));let j=[],e=[];const store={readJournal:()=>clone(j),readEffects:()=>clone(e),appendJournal:r=>j.push(clone(r)),appendEffect:r=>e.push(clone(r))};
const seed=new Engine(store,undefined,undefined,{role:'owner',now:()=> '2026-10-15T15:00:00.000Z'});for(const c of commands('loadseed','2026-10-15T15:00:00.000Z'))seed.execute(c);
const unitJ=clone(j),unitE=clone(e),commits=seed.state().revision;
function source(baseline){const c=vm.createContext({});for(const file of ['../../fase3/journal.js',baseline?'baseline-0.js':'../../fase3/inventory.js',baseline?'baseline-1.js':'../../fase4/commercial.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),c);return c.CVCommercial.Engine;}
const Original=source(true),New=source(false),results=[];
for(const copies of [1,5,15,64,320]){
 j=[];e=[];for(let n=0;n<copies;n++){const rename=rows=>JSON.parse(JSON.stringify(rows).replaceAll('loadseed','load'+n).replaceAll('LOADSEED','LOAD'+n));const js=rename(unitJ);for(const row of js)if(row.result)row.result.revision+=n*commits;j.push(...js);e.push(...rename(unitE));}
 const measure=C=>{const engine=new C(store);let start=performance.now(),state=engine.state(),replay=performance.now()-start;start=performance.now();const report=engine.reports(state);return {state:clone(state),report:clone(report),replayMs:+replay.toFixed(2),reportsMs:+(performance.now()-start).toFixed(2)}};
 const old=copies<=15?measure(Original):null,current=measure(New);if(old){assert.deepEqual(current.state,old.state);assert.deepEqual(current.report,old.report);}assert.equal(current.state.revision,copies*commits);
 results.push({commits:commits*copies,journalRows:j.length,effects:e.length,baselineReplayMs:old?.replayMs??null,indexedReplayMs:current.replayMs,baselineReportsMs:old?.reportsMs??null,indexedReportsMs:current.reportsMs,equivalent:old?true:null});
}
const result={runtime:process.version,environment:'LOCAL_VM_SYNTHETIC',samplesPerSize:1,googleMeasurement:false,results};fs.writeFileSync(__dirname+'/rendimiento-local.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
