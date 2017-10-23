export default class Idbify{constructor({schema:e,storeName:t,v:r}){this.schema=e,this.storeName=t,this.v=r,this.go()}go(){return new Promise((e,t)=>{const r=indexedDB.open(this.storeName,this.v);r.addEventListener("error",e=>t(e.target.error)),r.addEventListener("success",t=>e(t.target.result)),r.addEventListener("upgradeneeded",void 0===this.schema?t("upgrade needed, but no schema"):e=>this.upgrade(e.target.result)),r.addEventListener("blocked",e=>t("blocked"))})}upgrade(e){let t=this.schema[0].options||{};"keyPath"===this.schema[0].type&&(t.keyPath=this.schema[0].name);const r=e.createObjectStore(this.storeName,t);this.schema.filter(e=>"index"===e.type).forEach(e=>r.createIndex(e.name,e.keyPath||e.name,e.options))}getTransaction(e,t="readwrite"){const r=e.transaction(this.storeName,t);return{trx:r,store:r.objectStore(this.storeName)}}put(e){return this.go().then(t=>{const{trx:r,store:s}=this.getTransaction(t);return!Array.isArray(e)&&(e=[e]),e.forEach(e=>s.put(e)),new Promise((e,s)=>{r.oncomplete=(()=>{t.close(),e("completed")}),r.onerror=(e=>s(e.target.error))})})}get(e){return this.go().then(t=>{const{trx:r,store:s}=this.getTransaction(t,"readonly"),n=s.get(e);return new Promise((e,t)=>{n.onsuccess=(()=>e(n.result)),n.onerror=(()=>t("failed to read"))})})}find({index:e,term:t,type:r="key"}){return this.go().then(s=>{const{trx:n,store:o}=this.getTransaction(s,"readonly"),a=e?o.index(e):o,i=t?a.openCursor(IDBKeyRange.only(t)):a.openCursor();return new Promise((e,t)=>{let s=[];i.onsuccess=(t=>{const n=t.target.result;n?(s.push("value"===r?n.value:n.key),n.continue()):e(s)}),i.onerror=(()=>t("finding failed"))})})}delete(e){return this.go().then(t=>{const{trx:r,store:s}=this.getTransaction(t),n=s.delete(e);return new Promise((e,t)=>{n.onsuccess=(()=>e("deleted")),n.onerror=(()=>t("failed to delete"))})})}};