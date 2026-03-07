"use strict";var pr=Object.create;var fe=Object.defineProperty;var gr=Object.getOwnPropertyDescriptor;var mr=Object.getOwnPropertyNames;var vr=Object.getPrototypeOf,yr=Object.prototype.hasOwnProperty;var x=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),br=(s,e)=>{for(var t in e)fe(s,t,{get:e[t],enumerable:!0})},nt=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of mr(e))!yr.call(s,n)&&n!==t&&fe(s,n,{get:()=>e[n],enumerable:!(r=gr(e,n))||r.enumerable});return s};var k=(s,e,t)=>(t=s!=null?pr(vr(s)):{},nt(e||!s||!s.__esModule?fe(t,"default",{value:s,enumerable:!0}):t,s)),_r=s=>nt(fe({},"__esModule",{value:!0}),s);var O=x((Ys,at)=>{"use strict";var it=["nodebuffer","arraybuffer","fragments"],ot=typeof Blob<"u";ot&&it.push("blob");at.exports={BINARY_TYPES:it,CLOSE_TIMEOUT:3e4,EMPTY_BUFFER:Buffer.alloc(0),GUID:"258EAFA5-E914-47DA-95CA-C5AB0DC85B11",hasBlob:ot,kForOnEventAttribute:Symbol("kIsForOnEventAttribute"),kListener:Symbol("kListener"),kStatusCode:Symbol("status-code"),kWebSocket:Symbol("websocket"),NOOP:()=>{}}});var re=x((Js,ue)=>{"use strict";var{EMPTY_BUFFER:Sr}=O(),Me=Buffer[Symbol.species];function xr(s,e){if(s.length===0)return Sr;if(s.length===1)return s[0];let t=Buffer.allocUnsafe(e),r=0;for(let n=0;n<s.length;n++){let i=s[n];t.set(i,r),r+=i.length}return r<e?new Me(t.buffer,t.byteOffset,r):t}function lt(s,e,t,r,n){for(let i=0;i<n;i++)t[r+i]=s[i]^e[i&3]}function ct(s,e){for(let t=0;t<s.length;t++)s[t]^=e[t&3]}function wr(s){return s.length===s.buffer.byteLength?s.buffer:s.buffer.slice(s.byteOffset,s.byteOffset+s.length)}function Oe(s){if(Oe.readOnly=!0,Buffer.isBuffer(s))return s;let e;return s instanceof ArrayBuffer?e=new Me(s):ArrayBuffer.isView(s)?e=new Me(s.buffer,s.byteOffset,s.byteLength):(e=Buffer.from(s),Oe.readOnly=!1),e}ue.exports={concat:xr,mask:lt,toArrayBuffer:wr,toBuffer:Oe,unmask:ct};if(!process.env.WS_NO_BUFFER_UTIL)try{let s=require("bufferutil");ue.exports.mask=function(e,t,r,n,i){i<48?lt(e,t,r,n,i):s.mask(e,t,r,n,i)},ue.exports.unmask=function(e,t){e.length<32?ct(e,t):s.unmask(e,t)}}catch{}});var ft=x((Xs,ht)=>{"use strict";var dt=Symbol("kDone"),Te=Symbol("kRun"),Ie=class{constructor(e){this[dt]=()=>{this.pending--,this[Te]()},this.concurrency=e||1/0,this.jobs=[],this.pending=0}add(e){this.jobs.push(e),this[Te]()}[Te](){if(this.pending!==this.concurrency&&this.jobs.length){let e=this.jobs.shift();this.pending++,e(this[dt])}}};ht.exports=Ie});var ne=x((Qs,mt)=>{"use strict";var se=require("zlib"),ut=re(),kr=ft(),{kStatusCode:pt}=O(),Er=Buffer[Symbol.species],Cr=Buffer.from([0,0,255,255]),ge=Symbol("permessage-deflate"),T=Symbol("total-length"),V=Symbol("callback"),B=Symbol("buffers"),G=Symbol("error"),pe,Le=class{constructor(e,t,r){if(this._maxPayload=r|0,this._options=e||{},this._threshold=this._options.threshold!==void 0?this._options.threshold:1024,this._isServer=!!t,this._deflate=null,this._inflate=null,this.params=null,!pe){let n=this._options.concurrencyLimit!==void 0?this._options.concurrencyLimit:10;pe=new kr(n)}}static get extensionName(){return"permessage-deflate"}offer(){let e={};return this._options.serverNoContextTakeover&&(e.server_no_context_takeover=!0),this._options.clientNoContextTakeover&&(e.client_no_context_takeover=!0),this._options.serverMaxWindowBits&&(e.server_max_window_bits=this._options.serverMaxWindowBits),this._options.clientMaxWindowBits?e.client_max_window_bits=this._options.clientMaxWindowBits:this._options.clientMaxWindowBits==null&&(e.client_max_window_bits=!0),e}accept(e){return e=this.normalizeParams(e),this.params=this._isServer?this.acceptAsServer(e):this.acceptAsClient(e),this.params}cleanup(){if(this._inflate&&(this._inflate.close(),this._inflate=null),this._deflate){let e=this._deflate[V];this._deflate.close(),this._deflate=null,e&&e(new Error("The deflate stream was closed while data was being processed"))}}acceptAsServer(e){let t=this._options,r=e.find(n=>!(t.serverNoContextTakeover===!1&&n.server_no_context_takeover||n.server_max_window_bits&&(t.serverMaxWindowBits===!1||typeof t.serverMaxWindowBits=="number"&&t.serverMaxWindowBits>n.server_max_window_bits)||typeof t.clientMaxWindowBits=="number"&&!n.client_max_window_bits));if(!r)throw new Error("None of the extension offers can be accepted");return t.serverNoContextTakeover&&(r.server_no_context_takeover=!0),t.clientNoContextTakeover&&(r.client_no_context_takeover=!0),typeof t.serverMaxWindowBits=="number"&&(r.server_max_window_bits=t.serverMaxWindowBits),typeof t.clientMaxWindowBits=="number"?r.client_max_window_bits=t.clientMaxWindowBits:(r.client_max_window_bits===!0||t.clientMaxWindowBits===!1)&&delete r.client_max_window_bits,r}acceptAsClient(e){let t=e[0];if(this._options.clientNoContextTakeover===!1&&t.client_no_context_takeover)throw new Error('Unexpected parameter "client_no_context_takeover"');if(!t.client_max_window_bits)typeof this._options.clientMaxWindowBits=="number"&&(t.client_max_window_bits=this._options.clientMaxWindowBits);else if(this._options.clientMaxWindowBits===!1||typeof this._options.clientMaxWindowBits=="number"&&t.client_max_window_bits>this._options.clientMaxWindowBits)throw new Error('Unexpected or invalid parameter "client_max_window_bits"');return t}normalizeParams(e){return e.forEach(t=>{Object.keys(t).forEach(r=>{let n=t[r];if(n.length>1)throw new Error(`Parameter "${r}" must have only a single value`);if(n=n[0],r==="client_max_window_bits"){if(n!==!0){let i=+n;if(!Number.isInteger(i)||i<8||i>15)throw new TypeError(`Invalid value for parameter "${r}": ${n}`);n=i}else if(!this._isServer)throw new TypeError(`Invalid value for parameter "${r}": ${n}`)}else if(r==="server_max_window_bits"){let i=+n;if(!Number.isInteger(i)||i<8||i>15)throw new TypeError(`Invalid value for parameter "${r}": ${n}`);n=i}else if(r==="client_no_context_takeover"||r==="server_no_context_takeover"){if(n!==!0)throw new TypeError(`Invalid value for parameter "${r}": ${n}`)}else throw new Error(`Unknown parameter "${r}"`);t[r]=n})}),e}decompress(e,t,r){pe.add(n=>{this._decompress(e,t,(i,o)=>{n(),r(i,o)})})}compress(e,t,r){pe.add(n=>{this._compress(e,t,(i,o)=>{n(),r(i,o)})})}_decompress(e,t,r){let n=this._isServer?"client":"server";if(!this._inflate){let i=`${n}_max_window_bits`,o=typeof this.params[i]!="number"?se.Z_DEFAULT_WINDOWBITS:this.params[i];this._inflate=se.createInflateRaw({...this._options.zlibInflateOptions,windowBits:o}),this._inflate[ge]=this,this._inflate[T]=0,this._inflate[B]=[],this._inflate.on("error",Pr),this._inflate.on("data",gt)}this._inflate[V]=r,this._inflate.write(e),t&&this._inflate.write(Cr),this._inflate.flush(()=>{let i=this._inflate[G];if(i){this._inflate.close(),this._inflate=null,r(i);return}let o=ut.concat(this._inflate[B],this._inflate[T]);this._inflate._readableState.endEmitted?(this._inflate.close(),this._inflate=null):(this._inflate[T]=0,this._inflate[B]=[],t&&this.params[`${n}_no_context_takeover`]&&this._inflate.reset()),r(null,o)})}_compress(e,t,r){let n=this._isServer?"server":"client";if(!this._deflate){let i=`${n}_max_window_bits`,o=typeof this.params[i]!="number"?se.Z_DEFAULT_WINDOWBITS:this.params[i];this._deflate=se.createDeflateRaw({...this._options.zlibDeflateOptions,windowBits:o}),this._deflate[T]=0,this._deflate[B]=[],this._deflate.on("data",$r)}this._deflate[V]=r,this._deflate.write(e),this._deflate.flush(se.Z_SYNC_FLUSH,()=>{if(!this._deflate)return;let i=ut.concat(this._deflate[B],this._deflate[T]);t&&(i=new Er(i.buffer,i.byteOffset,i.length-4)),this._deflate[V]=null,this._deflate[T]=0,this._deflate[B]=[],t&&this.params[`${n}_no_context_takeover`]&&this._deflate.reset(),r(null,i)})}};mt.exports=Le;function $r(s){this[B].push(s),this[T]+=s.length}function gt(s){if(this[T]+=s.length,this[ge]._maxPayload<1||this[T]<=this[ge]._maxPayload){this[B].push(s);return}this[G]=new RangeError("Max payload size exceeded"),this[G].code="WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",this[G][pt]=1009,this.removeListener("data",gt),this.reset()}function Pr(s){if(this[ge]._inflate=null,this[G]){this[V](this[G]);return}s[pt]=1007,this[V](s)}});var H=x((Zs,me)=>{"use strict";var{isUtf8:vt}=require("buffer"),{hasBlob:Mr}=O(),Or=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0];function Tr(s){return s>=1e3&&s<=1014&&s!==1004&&s!==1005&&s!==1006||s>=3e3&&s<=4999}function Be(s){let e=s.length,t=0;for(;t<e;)if(!(s[t]&128))t++;else if((s[t]&224)===192){if(t+1===e||(s[t+1]&192)!==128||(s[t]&254)===192)return!1;t+=2}else if((s[t]&240)===224){if(t+2>=e||(s[t+1]&192)!==128||(s[t+2]&192)!==128||s[t]===224&&(s[t+1]&224)===128||s[t]===237&&(s[t+1]&224)===160)return!1;t+=3}else if((s[t]&248)===240){if(t+3>=e||(s[t+1]&192)!==128||(s[t+2]&192)!==128||(s[t+3]&192)!==128||s[t]===240&&(s[t+1]&240)===128||s[t]===244&&s[t+1]>143||s[t]>244)return!1;t+=4}else return!1;return!0}function Ir(s){return Mr&&typeof s=="object"&&typeof s.arrayBuffer=="function"&&typeof s.type=="string"&&typeof s.stream=="function"&&(s[Symbol.toStringTag]==="Blob"||s[Symbol.toStringTag]==="File")}me.exports={isBlob:Ir,isValidStatusCode:Tr,isValidUTF8:Be,tokenChars:Or};if(vt)me.exports.isValidUTF8=function(s){return s.length<24?Be(s):vt(s)};else if(!process.env.WS_NO_UTF_8_VALIDATE)try{let s=require("utf-8-validate");me.exports.isValidUTF8=function(e){return e.length<32?Be(e):s(e)}}catch{}});var De=x((en,kt)=>{"use strict";var{Writable:Lr}=require("stream"),yt=ne(),{BINARY_TYPES:Br,EMPTY_BUFFER:bt,kStatusCode:Ur,kWebSocket:Nr}=O(),{concat:Ue,toArrayBuffer:Rr,unmask:Ar}=re(),{isValidStatusCode:Dr,isValidUTF8:_t}=H(),ve=Buffer[Symbol.species],E=0,St=1,xt=2,wt=3,Ne=4,Re=5,ye=6,Ae=class extends Lr{constructor(e={}){super(),this._allowSynchronousEvents=e.allowSynchronousEvents!==void 0?e.allowSynchronousEvents:!0,this._binaryType=e.binaryType||Br[0],this._extensions=e.extensions||{},this._isServer=!!e.isServer,this._maxPayload=e.maxPayload|0,this._skipUTF8Validation=!!e.skipUTF8Validation,this[Nr]=void 0,this._bufferedBytes=0,this._buffers=[],this._compressed=!1,this._payloadLength=0,this._mask=void 0,this._fragmented=0,this._masked=!1,this._fin=!1,this._opcode=0,this._totalPayloadLength=0,this._messageLength=0,this._fragments=[],this._errored=!1,this._loop=!1,this._state=E}_write(e,t,r){if(this._opcode===8&&this._state==E)return r();this._bufferedBytes+=e.length,this._buffers.push(e),this.startLoop(r)}consume(e){if(this._bufferedBytes-=e,e===this._buffers[0].length)return this._buffers.shift();if(e<this._buffers[0].length){let r=this._buffers[0];return this._buffers[0]=new ve(r.buffer,r.byteOffset+e,r.length-e),new ve(r.buffer,r.byteOffset,e)}let t=Buffer.allocUnsafe(e);do{let r=this._buffers[0],n=t.length-e;e>=r.length?t.set(this._buffers.shift(),n):(t.set(new Uint8Array(r.buffer,r.byteOffset,e),n),this._buffers[0]=new ve(r.buffer,r.byteOffset+e,r.length-e)),e-=r.length}while(e>0);return t}startLoop(e){this._loop=!0;do switch(this._state){case E:this.getInfo(e);break;case St:this.getPayloadLength16(e);break;case xt:this.getPayloadLength64(e);break;case wt:this.getMask();break;case Ne:this.getData(e);break;case Re:case ye:this._loop=!1;return}while(this._loop);this._errored||e()}getInfo(e){if(this._bufferedBytes<2){this._loop=!1;return}let t=this.consume(2);if(t[0]&48){let n=this.createError(RangeError,"RSV2 and RSV3 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_2_3");e(n);return}let r=(t[0]&64)===64;if(r&&!this._extensions[yt.extensionName]){let n=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(n);return}if(this._fin=(t[0]&128)===128,this._opcode=t[0]&15,this._payloadLength=t[1]&127,this._opcode===0){if(r){let n=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(n);return}if(!this._fragmented){let n=this.createError(RangeError,"invalid opcode 0",!0,1002,"WS_ERR_INVALID_OPCODE");e(n);return}this._opcode=this._fragmented}else if(this._opcode===1||this._opcode===2){if(this._fragmented){let n=this.createError(RangeError,`invalid opcode ${this._opcode}`,!0,1002,"WS_ERR_INVALID_OPCODE");e(n);return}this._compressed=r}else if(this._opcode>7&&this._opcode<11){if(!this._fin){let n=this.createError(RangeError,"FIN must be set",!0,1002,"WS_ERR_EXPECTED_FIN");e(n);return}if(r){let n=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(n);return}if(this._payloadLength>125||this._opcode===8&&this._payloadLength===1){let n=this.createError(RangeError,`invalid payload length ${this._payloadLength}`,!0,1002,"WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");e(n);return}}else{let n=this.createError(RangeError,`invalid opcode ${this._opcode}`,!0,1002,"WS_ERR_INVALID_OPCODE");e(n);return}if(!this._fin&&!this._fragmented&&(this._fragmented=this._opcode),this._masked=(t[1]&128)===128,this._isServer){if(!this._masked){let n=this.createError(RangeError,"MASK must be set",!0,1002,"WS_ERR_EXPECTED_MASK");e(n);return}}else if(this._masked){let n=this.createError(RangeError,"MASK must be clear",!0,1002,"WS_ERR_UNEXPECTED_MASK");e(n);return}this._payloadLength===126?this._state=St:this._payloadLength===127?this._state=xt:this.haveLength(e)}getPayloadLength16(e){if(this._bufferedBytes<2){this._loop=!1;return}this._payloadLength=this.consume(2).readUInt16BE(0),this.haveLength(e)}getPayloadLength64(e){if(this._bufferedBytes<8){this._loop=!1;return}let t=this.consume(8),r=t.readUInt32BE(0);if(r>Math.pow(2,21)-1){let n=this.createError(RangeError,"Unsupported WebSocket frame: payload length > 2^53 - 1",!1,1009,"WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");e(n);return}this._payloadLength=r*Math.pow(2,32)+t.readUInt32BE(4),this.haveLength(e)}haveLength(e){if(this._payloadLength&&this._opcode<8&&(this._totalPayloadLength+=this._payloadLength,this._totalPayloadLength>this._maxPayload&&this._maxPayload>0)){let t=this.createError(RangeError,"Max payload size exceeded",!1,1009,"WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");e(t);return}this._masked?this._state=wt:this._state=Ne}getMask(){if(this._bufferedBytes<4){this._loop=!1;return}this._mask=this.consume(4),this._state=Ne}getData(e){let t=bt;if(this._payloadLength){if(this._bufferedBytes<this._payloadLength){this._loop=!1;return}t=this.consume(this._payloadLength),this._masked&&this._mask[0]|this._mask[1]|this._mask[2]|this._mask[3]&&Ar(t,this._mask)}if(this._opcode>7){this.controlMessage(t,e);return}if(this._compressed){this._state=Re,this.decompress(t,e);return}t.length&&(this._messageLength=this._totalPayloadLength,this._fragments.push(t)),this.dataMessage(e)}decompress(e,t){this._extensions[yt.extensionName].decompress(e,this._fin,(n,i)=>{if(n)return t(n);if(i.length){if(this._messageLength+=i.length,this._messageLength>this._maxPayload&&this._maxPayload>0){let o=this.createError(RangeError,"Max payload size exceeded",!1,1009,"WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");t(o);return}this._fragments.push(i)}this.dataMessage(t),this._state===E&&this.startLoop(t)})}dataMessage(e){if(!this._fin){this._state=E;return}let t=this._messageLength,r=this._fragments;if(this._totalPayloadLength=0,this._messageLength=0,this._fragmented=0,this._fragments=[],this._opcode===2){let n;this._binaryType==="nodebuffer"?n=Ue(r,t):this._binaryType==="arraybuffer"?n=Rr(Ue(r,t)):this._binaryType==="blob"?n=new Blob(r):n=r,this._allowSynchronousEvents?(this.emit("message",n,!0),this._state=E):(this._state=ye,setImmediate(()=>{this.emit("message",n,!0),this._state=E,this.startLoop(e)}))}else{let n=Ue(r,t);if(!this._skipUTF8Validation&&!_t(n)){let i=this.createError(Error,"invalid UTF-8 sequence",!0,1007,"WS_ERR_INVALID_UTF8");e(i);return}this._state===Re||this._allowSynchronousEvents?(this.emit("message",n,!1),this._state=E):(this._state=ye,setImmediate(()=>{this.emit("message",n,!1),this._state=E,this.startLoop(e)}))}}controlMessage(e,t){if(this._opcode===8){if(e.length===0)this._loop=!1,this.emit("conclude",1005,bt),this.end();else{let r=e.readUInt16BE(0);if(!Dr(r)){let i=this.createError(RangeError,`invalid status code ${r}`,!0,1002,"WS_ERR_INVALID_CLOSE_CODE");t(i);return}let n=new ve(e.buffer,e.byteOffset+2,e.length-2);if(!this._skipUTF8Validation&&!_t(n)){let i=this.createError(Error,"invalid UTF-8 sequence",!0,1007,"WS_ERR_INVALID_UTF8");t(i);return}this._loop=!1,this.emit("conclude",r,n),this.end()}this._state=E;return}this._allowSynchronousEvents?(this.emit(this._opcode===9?"ping":"pong",e),this._state=E):(this._state=ye,setImmediate(()=>{this.emit(this._opcode===9?"ping":"pong",e),this._state=E,this.startLoop(t)}))}createError(e,t,r,n,i){this._loop=!1,this._errored=!0;let o=new e(r?`Invalid WebSocket frame: ${t}`:t);return Error.captureStackTrace(o,this.createError),o.code=i,o[Ur]=n,o}};kt.exports=Ae});var qe=x((rn,$t)=>{"use strict";var{Duplex:tn}=require("stream"),{randomFillSync:Fr}=require("crypto"),Et=ne(),{EMPTY_BUFFER:Wr,kWebSocket:qr,NOOP:jr}=O(),{isBlob:K,isValidStatusCode:zr}=H(),{mask:Ct,toBuffer:R}=re(),C=Symbol("kByteLength"),Vr=Buffer.alloc(4),be=8*1024,A,Y=be,P=0,Gr=1,Hr=2,Fe=class s{constructor(e,t,r){this._extensions=t||{},r&&(this._generateMask=r,this._maskBuffer=Buffer.alloc(4)),this._socket=e,this._firstFragment=!0,this._compress=!1,this._bufferedBytes=0,this._queue=[],this._state=P,this.onerror=jr,this[qr]=void 0}static frame(e,t){let r,n=!1,i=2,o=!1;t.mask&&(r=t.maskBuffer||Vr,t.generateMask?t.generateMask(r):(Y===be&&(A===void 0&&(A=Buffer.alloc(be)),Fr(A,0,be),Y=0),r[0]=A[Y++],r[1]=A[Y++],r[2]=A[Y++],r[3]=A[Y++]),o=(r[0]|r[1]|r[2]|r[3])===0,i=6);let a;typeof e=="string"?(!t.mask||o)&&t[C]!==void 0?a=t[C]:(e=Buffer.from(e),a=e.length):(a=e.length,n=t.mask&&t.readOnly&&!o);let l=a;a>=65536?(i+=8,l=127):a>125&&(i+=2,l=126);let c=Buffer.allocUnsafe(n?a+i:i);return c[0]=t.fin?t.opcode|128:t.opcode,t.rsv1&&(c[0]|=64),c[1]=l,l===126?c.writeUInt16BE(a,2):l===127&&(c[2]=c[3]=0,c.writeUIntBE(a,4,6)),t.mask?(c[1]|=128,c[i-4]=r[0],c[i-3]=r[1],c[i-2]=r[2],c[i-1]=r[3],o?[c,e]:n?(Ct(e,r,c,i,a),[c]):(Ct(e,r,e,0,a),[c,e])):[c,e]}close(e,t,r,n){let i;if(e===void 0)i=Wr;else{if(typeof e!="number"||!zr(e))throw new TypeError("First argument must be a valid error code number");if(t===void 0||!t.length)i=Buffer.allocUnsafe(2),i.writeUInt16BE(e,0);else{let a=Buffer.byteLength(t);if(a>123)throw new RangeError("The message must not be greater than 123 bytes");i=Buffer.allocUnsafe(2+a),i.writeUInt16BE(e,0),typeof t=="string"?i.write(t,2):i.set(t,2)}}let o={[C]:i.length,fin:!0,generateMask:this._generateMask,mask:r,maskBuffer:this._maskBuffer,opcode:8,readOnly:!1,rsv1:!1};this._state!==P?this.enqueue([this.dispatch,i,!1,o,n]):this.sendFrame(s.frame(i,o),n)}ping(e,t,r){let n,i;if(typeof e=="string"?(n=Buffer.byteLength(e),i=!1):K(e)?(n=e.size,i=!1):(e=R(e),n=e.length,i=R.readOnly),n>125)throw new RangeError("The data size must not be greater than 125 bytes");let o={[C]:n,fin:!0,generateMask:this._generateMask,mask:t,maskBuffer:this._maskBuffer,opcode:9,readOnly:i,rsv1:!1};K(e)?this._state!==P?this.enqueue([this.getBlobData,e,!1,o,r]):this.getBlobData(e,!1,o,r):this._state!==P?this.enqueue([this.dispatch,e,!1,o,r]):this.sendFrame(s.frame(e,o),r)}pong(e,t,r){let n,i;if(typeof e=="string"?(n=Buffer.byteLength(e),i=!1):K(e)?(n=e.size,i=!1):(e=R(e),n=e.length,i=R.readOnly),n>125)throw new RangeError("The data size must not be greater than 125 bytes");let o={[C]:n,fin:!0,generateMask:this._generateMask,mask:t,maskBuffer:this._maskBuffer,opcode:10,readOnly:i,rsv1:!1};K(e)?this._state!==P?this.enqueue([this.getBlobData,e,!1,o,r]):this.getBlobData(e,!1,o,r):this._state!==P?this.enqueue([this.dispatch,e,!1,o,r]):this.sendFrame(s.frame(e,o),r)}send(e,t,r){let n=this._extensions[Et.extensionName],i=t.binary?2:1,o=t.compress,a,l;typeof e=="string"?(a=Buffer.byteLength(e),l=!1):K(e)?(a=e.size,l=!1):(e=R(e),a=e.length,l=R.readOnly),this._firstFragment?(this._firstFragment=!1,o&&n&&n.params[n._isServer?"server_no_context_takeover":"client_no_context_takeover"]&&(o=a>=n._threshold),this._compress=o):(o=!1,i=0),t.fin&&(this._firstFragment=!0);let c={[C]:a,fin:t.fin,generateMask:this._generateMask,mask:t.mask,maskBuffer:this._maskBuffer,opcode:i,readOnly:l,rsv1:o};K(e)?this._state!==P?this.enqueue([this.getBlobData,e,this._compress,c,r]):this.getBlobData(e,this._compress,c,r):this._state!==P?this.enqueue([this.dispatch,e,this._compress,c,r]):this.dispatch(e,this._compress,c,r)}getBlobData(e,t,r,n){this._bufferedBytes+=r[C],this._state=Hr,e.arrayBuffer().then(i=>{if(this._socket.destroyed){let a=new Error("The socket was closed while the blob was being read");process.nextTick(We,this,a,n);return}this._bufferedBytes-=r[C];let o=R(i);t?this.dispatch(o,t,r,n):(this._state=P,this.sendFrame(s.frame(o,r),n),this.dequeue())}).catch(i=>{process.nextTick(Kr,this,i,n)})}dispatch(e,t,r,n){if(!t){this.sendFrame(s.frame(e,r),n);return}let i=this._extensions[Et.extensionName];this._bufferedBytes+=r[C],this._state=Gr,i.compress(e,r.fin,(o,a)=>{if(this._socket.destroyed){let l=new Error("The socket was closed while data was being compressed");We(this,l,n);return}this._bufferedBytes-=r[C],this._state=P,r.readOnly=!1,this.sendFrame(s.frame(a,r),n),this.dequeue()})}dequeue(){for(;this._state===P&&this._queue.length;){let e=this._queue.shift();this._bufferedBytes-=e[3][C],Reflect.apply(e[0],this,e.slice(1))}}enqueue(e){this._bufferedBytes+=e[3][C],this._queue.push(e)}sendFrame(e,t){e.length===2?(this._socket.cork(),this._socket.write(e[0]),this._socket.write(e[1],t),this._socket.uncork()):this._socket.write(e[0],t)}};$t.exports=Fe;function We(s,e,t){typeof t=="function"&&t(e);for(let r=0;r<s._queue.length;r++){let n=s._queue[r],i=n[n.length-1];typeof i=="function"&&i(e)}}function Kr(s,e,t){We(s,e,t),s.onerror(e)}});var Nt=x((sn,Ut)=>{"use strict";var{kForOnEventAttribute:ie,kListener:je}=O(),Pt=Symbol("kCode"),Mt=Symbol("kData"),Ot=Symbol("kError"),Tt=Symbol("kMessage"),It=Symbol("kReason"),J=Symbol("kTarget"),Lt=Symbol("kType"),Bt=Symbol("kWasClean"),I=class{constructor(e){this[J]=null,this[Lt]=e}get target(){return this[J]}get type(){return this[Lt]}};Object.defineProperty(I.prototype,"target",{enumerable:!0});Object.defineProperty(I.prototype,"type",{enumerable:!0});var D=class extends I{constructor(e,t={}){super(e),this[Pt]=t.code===void 0?0:t.code,this[It]=t.reason===void 0?"":t.reason,this[Bt]=t.wasClean===void 0?!1:t.wasClean}get code(){return this[Pt]}get reason(){return this[It]}get wasClean(){return this[Bt]}};Object.defineProperty(D.prototype,"code",{enumerable:!0});Object.defineProperty(D.prototype,"reason",{enumerable:!0});Object.defineProperty(D.prototype,"wasClean",{enumerable:!0});var X=class extends I{constructor(e,t={}){super(e),this[Ot]=t.error===void 0?null:t.error,this[Tt]=t.message===void 0?"":t.message}get error(){return this[Ot]}get message(){return this[Tt]}};Object.defineProperty(X.prototype,"error",{enumerable:!0});Object.defineProperty(X.prototype,"message",{enumerable:!0});var oe=class extends I{constructor(e,t={}){super(e),this[Mt]=t.data===void 0?null:t.data}get data(){return this[Mt]}};Object.defineProperty(oe.prototype,"data",{enumerable:!0});var Yr={addEventListener(s,e,t={}){for(let n of this.listeners(s))if(!t[ie]&&n[je]===e&&!n[ie])return;let r;if(s==="message")r=function(i,o){let a=new oe("message",{data:o?i:i.toString()});a[J]=this,_e(e,this,a)};else if(s==="close")r=function(i,o){let a=new D("close",{code:i,reason:o.toString(),wasClean:this._closeFrameReceived&&this._closeFrameSent});a[J]=this,_e(e,this,a)};else if(s==="error")r=function(i){let o=new X("error",{error:i,message:i.message});o[J]=this,_e(e,this,o)};else if(s==="open")r=function(){let i=new I("open");i[J]=this,_e(e,this,i)};else return;r[ie]=!!t[ie],r[je]=e,t.once?this.once(s,r):this.on(s,r)},removeEventListener(s,e){for(let t of this.listeners(s))if(t[je]===e&&!t[ie]){this.removeListener(s,t);break}}};Ut.exports={CloseEvent:D,ErrorEvent:X,Event:I,EventTarget:Yr,MessageEvent:oe};function _e(s,e,t){typeof s=="object"&&s.handleEvent?s.handleEvent.call(s,t):s.call(e,t)}});var ze=x((nn,Rt)=>{"use strict";var{tokenChars:ae}=H();function M(s,e,t){s[e]===void 0?s[e]=[t]:s[e].push(t)}function Jr(s){let e=Object.create(null),t=Object.create(null),r=!1,n=!1,i=!1,o,a,l=-1,c=-1,h=-1,f=0;for(;f<s.length;f++)if(c=s.charCodeAt(f),o===void 0)if(h===-1&&ae[c]===1)l===-1&&(l=f);else if(f!==0&&(c===32||c===9))h===-1&&l!==-1&&(h=f);else if(c===59||c===44){if(l===-1)throw new SyntaxError(`Unexpected character at index ${f}`);h===-1&&(h=f);let y=s.slice(l,h);c===44?(M(e,y,t),t=Object.create(null)):o=y,l=h=-1}else throw new SyntaxError(`Unexpected character at index ${f}`);else if(a===void 0)if(h===-1&&ae[c]===1)l===-1&&(l=f);else if(c===32||c===9)h===-1&&l!==-1&&(h=f);else if(c===59||c===44){if(l===-1)throw new SyntaxError(`Unexpected character at index ${f}`);h===-1&&(h=f),M(t,s.slice(l,h),!0),c===44&&(M(e,o,t),t=Object.create(null),o=void 0),l=h=-1}else if(c===61&&l!==-1&&h===-1)a=s.slice(l,f),l=h=-1;else throw new SyntaxError(`Unexpected character at index ${f}`);else if(n){if(ae[c]!==1)throw new SyntaxError(`Unexpected character at index ${f}`);l===-1?l=f:r||(r=!0),n=!1}else if(i)if(ae[c]===1)l===-1&&(l=f);else if(c===34&&l!==-1)i=!1,h=f;else if(c===92)n=!0;else throw new SyntaxError(`Unexpected character at index ${f}`);else if(c===34&&s.charCodeAt(f-1)===61)i=!0;else if(h===-1&&ae[c]===1)l===-1&&(l=f);else if(l!==-1&&(c===32||c===9))h===-1&&(h=f);else if(c===59||c===44){if(l===-1)throw new SyntaxError(`Unexpected character at index ${f}`);h===-1&&(h=f);let y=s.slice(l,h);r&&(y=y.replace(/\\/g,""),r=!1),M(t,a,y),c===44&&(M(e,o,t),t=Object.create(null),o=void 0),a=void 0,l=h=-1}else throw new SyntaxError(`Unexpected character at index ${f}`);if(l===-1||i||c===32||c===9)throw new SyntaxError("Unexpected end of input");h===-1&&(h=f);let p=s.slice(l,h);return o===void 0?M(e,p,t):(a===void 0?M(t,p,!0):r?M(t,a,p.replace(/\\/g,"")):M(t,a,p),M(e,o,t)),e}function Xr(s){return Object.keys(s).map(e=>{let t=s[e];return Array.isArray(t)||(t=[t]),t.map(r=>[e].concat(Object.keys(r).map(n=>{let i=r[n];return Array.isArray(i)||(i=[i]),i.map(o=>o===!0?n:`${n}=${o}`).join("; ")})).join("; ")).join(", ")}).join(", ")}Rt.exports={format:Xr,parse:Jr}});var ke=x((ln,Yt)=>{"use strict";var Qr=require("events"),Zr=require("https"),es=require("http"),Ft=require("net"),ts=require("tls"),{randomBytes:rs,createHash:ss}=require("crypto"),{Duplex:on,Readable:an}=require("stream"),{URL:Ve}=require("url"),U=ne(),ns=De(),is=qe(),{isBlob:os}=H(),{BINARY_TYPES:At,CLOSE_TIMEOUT:as,EMPTY_BUFFER:Se,GUID:ls,kForOnEventAttribute:Ge,kListener:cs,kStatusCode:ds,kWebSocket:b,NOOP:Wt}=O(),{EventTarget:{addEventListener:hs,removeEventListener:fs}}=Nt(),{format:us,parse:ps}=ze(),{toBuffer:gs}=re(),qt=Symbol("kAborted"),He=[8,13],L=["CONNECTING","OPEN","CLOSING","CLOSED"],ms=/^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/,g=class s extends Qr{constructor(e,t,r){super(),this._binaryType=At[0],this._closeCode=1006,this._closeFrameReceived=!1,this._closeFrameSent=!1,this._closeMessage=Se,this._closeTimer=null,this._errorEmitted=!1,this._extensions={},this._paused=!1,this._protocol="",this._readyState=s.CONNECTING,this._receiver=null,this._sender=null,this._socket=null,e!==null?(this._bufferedAmount=0,this._isServer=!1,this._redirects=0,t===void 0?t=[]:Array.isArray(t)||(typeof t=="object"&&t!==null?(r=t,t=[]):t=[t]),jt(this,e,t,r)):(this._autoPong=r.autoPong,this._closeTimeout=r.closeTimeout,this._isServer=!0)}get binaryType(){return this._binaryType}set binaryType(e){At.includes(e)&&(this._binaryType=e,this._receiver&&(this._receiver._binaryType=e))}get bufferedAmount(){return this._socket?this._socket._writableState.length+this._sender._bufferedBytes:this._bufferedAmount}get extensions(){return Object.keys(this._extensions).join()}get isPaused(){return this._paused}get onclose(){return null}get onerror(){return null}get onopen(){return null}get onmessage(){return null}get protocol(){return this._protocol}get readyState(){return this._readyState}get url(){return this._url}setSocket(e,t,r){let n=new ns({allowSynchronousEvents:r.allowSynchronousEvents,binaryType:this.binaryType,extensions:this._extensions,isServer:this._isServer,maxPayload:r.maxPayload,skipUTF8Validation:r.skipUTF8Validation}),i=new is(e,this._extensions,r.generateMask);this._receiver=n,this._sender=i,this._socket=e,n[b]=this,i[b]=this,e[b]=this,n.on("conclude",bs),n.on("drain",_s),n.on("error",Ss),n.on("message",xs),n.on("ping",ws),n.on("pong",ks),i.onerror=Es,e.setTimeout&&e.setTimeout(0),e.setNoDelay&&e.setNoDelay(),t.length>0&&e.unshift(t),e.on("close",Gt),e.on("data",we),e.on("end",Ht),e.on("error",Kt),this._readyState=s.OPEN,this.emit("open")}emitClose(){if(!this._socket){this._readyState=s.CLOSED,this.emit("close",this._closeCode,this._closeMessage);return}this._extensions[U.extensionName]&&this._extensions[U.extensionName].cleanup(),this._receiver.removeAllListeners(),this._readyState=s.CLOSED,this.emit("close",this._closeCode,this._closeMessage)}close(e,t){if(this.readyState!==s.CLOSED){if(this.readyState===s.CONNECTING){w(this,this._req,"WebSocket was closed before the connection was established");return}if(this.readyState===s.CLOSING){this._closeFrameSent&&(this._closeFrameReceived||this._receiver._writableState.errorEmitted)&&this._socket.end();return}this._readyState=s.CLOSING,this._sender.close(e,t,!this._isServer,r=>{r||(this._closeFrameSent=!0,(this._closeFrameReceived||this._receiver._writableState.errorEmitted)&&this._socket.end())}),Vt(this)}}pause(){this.readyState===s.CONNECTING||this.readyState===s.CLOSED||(this._paused=!0,this._socket.pause())}ping(e,t,r){if(this.readyState===s.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof e=="function"?(r=e,e=t=void 0):typeof t=="function"&&(r=t,t=void 0),typeof e=="number"&&(e=e.toString()),this.readyState!==s.OPEN){Ke(this,e,r);return}t===void 0&&(t=!this._isServer),this._sender.ping(e||Se,t,r)}pong(e,t,r){if(this.readyState===s.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof e=="function"?(r=e,e=t=void 0):typeof t=="function"&&(r=t,t=void 0),typeof e=="number"&&(e=e.toString()),this.readyState!==s.OPEN){Ke(this,e,r);return}t===void 0&&(t=!this._isServer),this._sender.pong(e||Se,t,r)}resume(){this.readyState===s.CONNECTING||this.readyState===s.CLOSED||(this._paused=!1,this._receiver._writableState.needDrain||this._socket.resume())}send(e,t,r){if(this.readyState===s.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof t=="function"&&(r=t,t={}),typeof e=="number"&&(e=e.toString()),this.readyState!==s.OPEN){Ke(this,e,r);return}let n={binary:typeof e!="string",mask:!this._isServer,compress:!0,fin:!0,...t};this._extensions[U.extensionName]||(n.compress=!1),this._sender.send(e||Se,n,r)}terminate(){if(this.readyState!==s.CLOSED){if(this.readyState===s.CONNECTING){w(this,this._req,"WebSocket was closed before the connection was established");return}this._socket&&(this._readyState=s.CLOSING,this._socket.destroy())}}};Object.defineProperty(g,"CONNECTING",{enumerable:!0,value:L.indexOf("CONNECTING")});Object.defineProperty(g.prototype,"CONNECTING",{enumerable:!0,value:L.indexOf("CONNECTING")});Object.defineProperty(g,"OPEN",{enumerable:!0,value:L.indexOf("OPEN")});Object.defineProperty(g.prototype,"OPEN",{enumerable:!0,value:L.indexOf("OPEN")});Object.defineProperty(g,"CLOSING",{enumerable:!0,value:L.indexOf("CLOSING")});Object.defineProperty(g.prototype,"CLOSING",{enumerable:!0,value:L.indexOf("CLOSING")});Object.defineProperty(g,"CLOSED",{enumerable:!0,value:L.indexOf("CLOSED")});Object.defineProperty(g.prototype,"CLOSED",{enumerable:!0,value:L.indexOf("CLOSED")});["binaryType","bufferedAmount","extensions","isPaused","protocol","readyState","url"].forEach(s=>{Object.defineProperty(g.prototype,s,{enumerable:!0})});["open","error","close","message"].forEach(s=>{Object.defineProperty(g.prototype,`on${s}`,{enumerable:!0,get(){for(let e of this.listeners(s))if(e[Ge])return e[cs];return null},set(e){for(let t of this.listeners(s))if(t[Ge]){this.removeListener(s,t);break}typeof e=="function"&&this.addEventListener(s,e,{[Ge]:!0})}})});g.prototype.addEventListener=hs;g.prototype.removeEventListener=fs;Yt.exports=g;function jt(s,e,t,r){let n={allowSynchronousEvents:!0,autoPong:!0,closeTimeout:as,protocolVersion:He[1],maxPayload:104857600,skipUTF8Validation:!1,perMessageDeflate:!0,followRedirects:!1,maxRedirects:10,...r,socketPath:void 0,hostname:void 0,protocol:void 0,timeout:void 0,method:"GET",host:void 0,path:void 0,port:void 0};if(s._autoPong=n.autoPong,s._closeTimeout=n.closeTimeout,!He.includes(n.protocolVersion))throw new RangeError(`Unsupported protocol version: ${n.protocolVersion} (supported versions: ${He.join(", ")})`);let i;if(e instanceof Ve)i=e;else try{i=new Ve(e)}catch{throw new SyntaxError(`Invalid URL: ${e}`)}i.protocol==="http:"?i.protocol="ws:":i.protocol==="https:"&&(i.protocol="wss:"),s._url=i.href;let o=i.protocol==="wss:",a=i.protocol==="ws+unix:",l;if(i.protocol!=="ws:"&&!o&&!a?l=`The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`:a&&!i.pathname?l="The URL's pathname is empty":i.hash&&(l="The URL contains a fragment identifier"),l){let u=new SyntaxError(l);if(s._redirects===0)throw u;xe(s,u);return}let c=o?443:80,h=rs(16).toString("base64"),f=o?Zr.request:es.request,p=new Set,y;if(n.createConnection=n.createConnection||(o?ys:vs),n.defaultPort=n.defaultPort||c,n.port=i.port||c,n.host=i.hostname.startsWith("[")?i.hostname.slice(1,-1):i.hostname,n.headers={...n.headers,"Sec-WebSocket-Version":n.protocolVersion,"Sec-WebSocket-Key":h,Connection:"Upgrade",Upgrade:"websocket"},n.path=i.pathname+i.search,n.timeout=n.handshakeTimeout,n.perMessageDeflate&&(y=new U(n.perMessageDeflate!==!0?n.perMessageDeflate:{},!1,n.maxPayload),n.headers["Sec-WebSocket-Extensions"]=us({[U.extensionName]:y.offer()})),t.length){for(let u of t){if(typeof u!="string"||!ms.test(u)||p.has(u))throw new SyntaxError("An invalid or duplicated subprotocol was specified");p.add(u)}n.headers["Sec-WebSocket-Protocol"]=t.join(",")}if(n.origin&&(n.protocolVersion<13?n.headers["Sec-WebSocket-Origin"]=n.origin:n.headers.Origin=n.origin),(i.username||i.password)&&(n.auth=`${i.username}:${i.password}`),a){let u=n.path.split(":");n.socketPath=u[0],n.path=u[1]}let m;if(n.followRedirects){if(s._redirects===0){s._originalIpc=a,s._originalSecure=o,s._originalHostOrSocketPath=a?n.socketPath:i.host;let u=r&&r.headers;if(r={...r,headers:{}},u)for(let[_,j]of Object.entries(u))r.headers[_.toLowerCase()]=j}else if(s.listenerCount("redirect")===0){let u=a?s._originalIpc?n.socketPath===s._originalHostOrSocketPath:!1:s._originalIpc?!1:i.host===s._originalHostOrSocketPath;(!u||s._originalSecure&&!o)&&(delete n.headers.authorization,delete n.headers.cookie,u||delete n.headers.host,n.auth=void 0)}n.auth&&!r.headers.authorization&&(r.headers.authorization="Basic "+Buffer.from(n.auth).toString("base64")),m=s._req=f(n),s._redirects&&s.emit("redirect",s.url,m)}else m=s._req=f(n);n.timeout&&m.on("timeout",()=>{w(s,m,"Opening handshake has timed out")}),m.on("error",u=>{m===null||m[qt]||(m=s._req=null,xe(s,u))}),m.on("response",u=>{let _=u.headers.location,j=u.statusCode;if(_&&n.followRedirects&&j>=300&&j<400){if(++s._redirects>n.maxRedirects){w(s,m,"Maximum redirects exceeded");return}m.abort();let ee;try{ee=new Ve(_,e)}catch{let z=new SyntaxError(`Invalid URL: ${_}`);xe(s,z);return}jt(s,ee,t,r)}else s.emit("unexpected-response",m,u)||w(s,m,`Unexpected server response: ${u.statusCode}`)}),m.on("upgrade",(u,_,j)=>{if(s.emit("upgrade",u),s.readyState!==g.CONNECTING)return;m=s._req=null;let ee=u.headers.upgrade;if(ee===void 0||ee.toLowerCase()!=="websocket"){w(s,_,"Invalid Upgrade header");return}let tt=ss("sha1").update(h+ls).digest("base64");if(u.headers["sec-websocket-accept"]!==tt){w(s,_,"Invalid Sec-WebSocket-Accept header");return}let z=u.headers["sec-websocket-protocol"],te;if(z!==void 0?p.size?p.has(z)||(te="Server sent an invalid subprotocol"):te="Server sent a subprotocol but none was requested":p.size&&(te="Server sent no subprotocol"),te){w(s,_,te);return}z&&(s._protocol=z);let rt=u.headers["sec-websocket-extensions"];if(rt!==void 0){if(!y){w(s,_,"Server sent a Sec-WebSocket-Extensions header but no extension was requested");return}let $e;try{$e=ps(rt)}catch{w(s,_,"Invalid Sec-WebSocket-Extensions header");return}let st=Object.keys($e);if(st.length!==1||st[0]!==U.extensionName){w(s,_,"Server indicated an extension that was not requested");return}try{y.accept($e[U.extensionName])}catch{w(s,_,"Invalid Sec-WebSocket-Extensions header");return}s._extensions[U.extensionName]=y}s.setSocket(_,j,{allowSynchronousEvents:n.allowSynchronousEvents,generateMask:n.generateMask,maxPayload:n.maxPayload,skipUTF8Validation:n.skipUTF8Validation})}),n.finishRequest?n.finishRequest(m,s):m.end()}function xe(s,e){s._readyState=g.CLOSING,s._errorEmitted=!0,s.emit("error",e),s.emitClose()}function vs(s){return s.path=s.socketPath,Ft.connect(s)}function ys(s){return s.path=void 0,!s.servername&&s.servername!==""&&(s.servername=Ft.isIP(s.host)?"":s.host),ts.connect(s)}function w(s,e,t){s._readyState=g.CLOSING;let r=new Error(t);Error.captureStackTrace(r,w),e.setHeader?(e[qt]=!0,e.abort(),e.socket&&!e.socket.destroyed&&e.socket.destroy(),process.nextTick(xe,s,r)):(e.destroy(r),e.once("error",s.emit.bind(s,"error")),e.once("close",s.emitClose.bind(s)))}function Ke(s,e,t){if(e){let r=os(e)?e.size:gs(e).length;s._socket?s._sender._bufferedBytes+=r:s._bufferedAmount+=r}if(t){let r=new Error(`WebSocket is not open: readyState ${s.readyState} (${L[s.readyState]})`);process.nextTick(t,r)}}function bs(s,e){let t=this[b];t._closeFrameReceived=!0,t._closeMessage=e,t._closeCode=s,t._socket[b]!==void 0&&(t._socket.removeListener("data",we),process.nextTick(zt,t._socket),s===1005?t.close():t.close(s,e))}function _s(){let s=this[b];s.isPaused||s._socket.resume()}function Ss(s){let e=this[b];e._socket[b]!==void 0&&(e._socket.removeListener("data",we),process.nextTick(zt,e._socket),e.close(s[ds])),e._errorEmitted||(e._errorEmitted=!0,e.emit("error",s))}function Dt(){this[b].emitClose()}function xs(s,e){this[b].emit("message",s,e)}function ws(s){let e=this[b];e._autoPong&&e.pong(s,!this._isServer,Wt),e.emit("ping",s)}function ks(s){this[b].emit("pong",s)}function zt(s){s.resume()}function Es(s){let e=this[b];e.readyState!==g.CLOSED&&(e.readyState===g.OPEN&&(e._readyState=g.CLOSING,Vt(e)),this._socket.end(),e._errorEmitted||(e._errorEmitted=!0,e.emit("error",s)))}function Vt(s){s._closeTimer=setTimeout(s._socket.destroy.bind(s._socket),s._closeTimeout)}function Gt(){let s=this[b];if(this.removeListener("close",Gt),this.removeListener("data",we),this.removeListener("end",Ht),s._readyState=g.CLOSING,!this._readableState.endEmitted&&!s._closeFrameReceived&&!s._receiver._writableState.errorEmitted&&this._readableState.length!==0){let e=this.read(this._readableState.length);s._receiver.write(e)}s._receiver.end(),this[b]=void 0,clearTimeout(s._closeTimer),s._receiver._writableState.finished||s._receiver._writableState.errorEmitted?s.emitClose():(s._receiver.on("error",Dt),s._receiver.on("finish",Dt))}function we(s){this[b]._receiver.write(s)||this.pause()}function Ht(){let s=this[b];s._readyState=g.CLOSING,s._receiver.end(),this.end()}function Kt(){let s=this[b];this.removeListener("error",Kt),this.on("error",Wt),s&&(s._readyState=g.CLOSING,this.destroy())}});var Zt=x((dn,Qt)=>{"use strict";var cn=ke(),{Duplex:Cs}=require("stream");function Jt(s){s.emit("close")}function $s(){!this.destroyed&&this._writableState.finished&&this.destroy()}function Xt(s){this.removeListener("error",Xt),this.destroy(),this.listenerCount("error")===0&&this.emit("error",s)}function Ps(s,e){let t=!0,r=new Cs({...e,autoDestroy:!1,emitClose:!1,objectMode:!1,writableObjectMode:!1});return s.on("message",function(i,o){let a=!o&&r._readableState.objectMode?i.toString():i;r.push(a)||s.pause()}),s.once("error",function(i){r.destroyed||(t=!1,r.destroy(i))}),s.once("close",function(){r.destroyed||r.push(null)}),r._destroy=function(n,i){if(s.readyState===s.CLOSED){i(n),process.nextTick(Jt,r);return}let o=!1;s.once("error",function(l){o=!0,i(l)}),s.once("close",function(){o||i(n),process.nextTick(Jt,r)}),t&&s.terminate()},r._final=function(n){if(s.readyState===s.CONNECTING){s.once("open",function(){r._final(n)});return}s._socket!==null&&(s._socket._writableState.finished?(n(),r._readableState.endEmitted&&r.destroy()):(s._socket.once("finish",function(){n()}),s.close()))},r._read=function(){s.isPaused&&s.resume()},r._write=function(n,i,o){if(s.readyState===s.CONNECTING){s.once("open",function(){r._write(n,i,o)});return}s.send(n,o)},r.on("end",$s),r.on("error",Xt),r}Qt.exports=Ps});var tr=x((hn,er)=>{"use strict";var{tokenChars:Ms}=H();function Os(s){let e=new Set,t=-1,r=-1,n=0;for(n;n<s.length;n++){let o=s.charCodeAt(n);if(r===-1&&Ms[o]===1)t===-1&&(t=n);else if(n!==0&&(o===32||o===9))r===-1&&t!==-1&&(r=n);else if(o===44){if(t===-1)throw new SyntaxError(`Unexpected character at index ${n}`);r===-1&&(r=n);let a=s.slice(t,r);if(e.has(a))throw new SyntaxError(`The "${a}" subprotocol is duplicated`);e.add(a),t=r=-1}else throw new SyntaxError(`Unexpected character at index ${n}`)}if(t===-1||r!==-1)throw new SyntaxError("Unexpected end of input");let i=s.slice(t,n);if(e.has(i))throw new SyntaxError(`The "${i}" subprotocol is duplicated`);return e.add(i),e}er.exports={parse:Os}});var lr=x((un,ar)=>{"use strict";var Ts=require("events"),Ee=require("http"),{Duplex:fn}=require("stream"),{createHash:Is}=require("crypto"),rr=ze(),F=ne(),Ls=tr(),Bs=ke(),{CLOSE_TIMEOUT:Us,GUID:Ns,kWebSocket:Rs}=O(),As=/^[+/0-9A-Za-z]{22}==$/,sr=0,nr=1,or=2,Ye=class extends Ts{constructor(e,t){if(super(),e={allowSynchronousEvents:!0,autoPong:!0,maxPayload:100*1024*1024,skipUTF8Validation:!1,perMessageDeflate:!1,handleProtocols:null,clientTracking:!0,closeTimeout:Us,verifyClient:null,noServer:!1,backlog:null,server:null,host:null,path:null,port:null,WebSocket:Bs,...e},e.port==null&&!e.server&&!e.noServer||e.port!=null&&(e.server||e.noServer)||e.server&&e.noServer)throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');if(e.port!=null?(this._server=Ee.createServer((r,n)=>{let i=Ee.STATUS_CODES[426];n.writeHead(426,{"Content-Length":i.length,"Content-Type":"text/plain"}),n.end(i)}),this._server.listen(e.port,e.host,e.backlog,t)):e.server&&(this._server=e.server),this._server){let r=this.emit.bind(this,"connection");this._removeListeners=Ds(this._server,{listening:this.emit.bind(this,"listening"),error:this.emit.bind(this,"error"),upgrade:(n,i,o)=>{this.handleUpgrade(n,i,o,r)}})}e.perMessageDeflate===!0&&(e.perMessageDeflate={}),e.clientTracking&&(this.clients=new Set,this._shouldEmitClose=!1),this.options=e,this._state=sr}address(){if(this.options.noServer)throw new Error('The server is operating in "noServer" mode');return this._server?this._server.address():null}close(e){if(this._state===or){e&&this.once("close",()=>{e(new Error("The server is not running"))}),process.nextTick(le,this);return}if(e&&this.once("close",e),this._state!==nr)if(this._state=nr,this.options.noServer||this.options.server)this._server&&(this._removeListeners(),this._removeListeners=this._server=null),this.clients?this.clients.size?this._shouldEmitClose=!0:process.nextTick(le,this):process.nextTick(le,this);else{let t=this._server;this._removeListeners(),this._removeListeners=this._server=null,t.close(()=>{le(this)})}}shouldHandle(e){if(this.options.path){let t=e.url.indexOf("?");if((t!==-1?e.url.slice(0,t):e.url)!==this.options.path)return!1}return!0}handleUpgrade(e,t,r,n){t.on("error",ir);let i=e.headers["sec-websocket-key"],o=e.headers.upgrade,a=+e.headers["sec-websocket-version"];if(e.method!=="GET"){W(this,e,t,405,"Invalid HTTP method");return}if(o===void 0||o.toLowerCase()!=="websocket"){W(this,e,t,400,"Invalid Upgrade header");return}if(i===void 0||!As.test(i)){W(this,e,t,400,"Missing or invalid Sec-WebSocket-Key header");return}if(a!==13&&a!==8){W(this,e,t,400,"Missing or invalid Sec-WebSocket-Version header",{"Sec-WebSocket-Version":"13, 8"});return}if(!this.shouldHandle(e)){ce(t,400);return}let l=e.headers["sec-websocket-protocol"],c=new Set;if(l!==void 0)try{c=Ls.parse(l)}catch{W(this,e,t,400,"Invalid Sec-WebSocket-Protocol header");return}let h=e.headers["sec-websocket-extensions"],f={};if(this.options.perMessageDeflate&&h!==void 0){let p=new F(this.options.perMessageDeflate,!0,this.options.maxPayload);try{let y=rr.parse(h);y[F.extensionName]&&(p.accept(y[F.extensionName]),f[F.extensionName]=p)}catch{W(this,e,t,400,"Invalid or unacceptable Sec-WebSocket-Extensions header");return}}if(this.options.verifyClient){let p={origin:e.headers[`${a===8?"sec-websocket-origin":"origin"}`],secure:!!(e.socket.authorized||e.socket.encrypted),req:e};if(this.options.verifyClient.length===2){this.options.verifyClient(p,(y,m,u,_)=>{if(!y)return ce(t,m||401,u,_);this.completeUpgrade(f,i,c,e,t,r,n)});return}if(!this.options.verifyClient(p))return ce(t,401)}this.completeUpgrade(f,i,c,e,t,r,n)}completeUpgrade(e,t,r,n,i,o,a){if(!i.readable||!i.writable)return i.destroy();if(i[Rs])throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");if(this._state>sr)return ce(i,503);let c=["HTTP/1.1 101 Switching Protocols","Upgrade: websocket","Connection: Upgrade",`Sec-WebSocket-Accept: ${Is("sha1").update(t+Ns).digest("base64")}`],h=new this.options.WebSocket(null,void 0,this.options);if(r.size){let f=this.options.handleProtocols?this.options.handleProtocols(r,n):r.values().next().value;f&&(c.push(`Sec-WebSocket-Protocol: ${f}`),h._protocol=f)}if(e[F.extensionName]){let f=e[F.extensionName].params,p=rr.format({[F.extensionName]:[f]});c.push(`Sec-WebSocket-Extensions: ${p}`),h._extensions=e}this.emit("headers",c,n),i.write(c.concat(`\r
`).join(`\r
`)),i.removeListener("error",ir),h.setSocket(i,o,{allowSynchronousEvents:this.options.allowSynchronousEvents,maxPayload:this.options.maxPayload,skipUTF8Validation:this.options.skipUTF8Validation}),this.clients&&(this.clients.add(h),h.on("close",()=>{this.clients.delete(h),this._shouldEmitClose&&!this.clients.size&&process.nextTick(le,this)})),a(h,n)}};ar.exports=Ye;function Ds(s,e){for(let t of Object.keys(e))s.on(t,e[t]);return function(){for(let r of Object.keys(e))s.removeListener(r,e[r])}}function le(s){s._state=or,s.emit("close")}function ir(){this.destroy()}function ce(s,e,t,r){t=t||Ee.STATUS_CODES[e],r={Connection:"close","Content-Type":"text/html","Content-Length":Buffer.byteLength(t),...r},s.once("finish",s.destroy),s.end(`HTTP/1.1 ${e} ${Ee.STATUS_CODES[e]}\r
`+Object.keys(r).map(n=>`${n}: ${r[n]}`).join(`\r
`)+`\r
\r
`+t)}function W(s,e,t,r,n,i){if(s.listenerCount("wsClientError")){let o=new Error(n);Error.captureStackTrace(o,W),s.emit("wsClientError",o,t,e)}else ce(t,r,n,i)}});var Hs={};br(Hs,{activate:()=>Vs,deactivate:()=>Gs});module.exports=_r(Hs);var $=k(require("vscode"));var d=k(require("vscode"));var Fs=k(Zt(),1),Ws=k(De(),1),qs=k(qe(),1),js=k(ke(),1),Je=k(lr(),1);var dr=k(require("http")),v=k(require("fs")),S=k(require("path")),N=k(require("os")),q=require("child_process");function Z(s){return process.platform==="win32"&&s.startsWith("\\\\")}function hr(s){if(Z(s)){try{(0,q.execSync)(`mkdir "${s}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4})}catch{}return}v.mkdirSync(s,{recursive:!0})}function Q(s){if(Z(s))try{return(0,q.execSync)(`dir /b "${s}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3}),!0}catch{return!1}return v.existsSync(s)}function de(s){if(Z(s)){let e=S.join(N.tmpdir(),`bba-rd-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{(0,q.execSync)(`copy /Y "${s}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});let t=v.readFileSync(e,"utf-8");try{v.unlinkSync(e)}catch{}return t}catch(t){try{v.unlinkSync(e)}catch{}throw t}}return v.readFileSync(s,"utf-8")}function fr(s,e){if(Z(s)){let t=S.join(N.tmpdir(),`bba-wr-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{v.writeFileSync(t,e,"utf-8"),(0,q.execSync)(`copy /Y "${t}" "${s}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});try{v.unlinkSync(t)}catch{}}catch(r){try{v.unlinkSync(t)}catch{}throw r}return}v.writeFileSync(s,e)}function Xe(s){if(Z(s)){try{(0,q.execSync)(`del /F /Q "${s}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3})}catch{}return}v.unlinkSync(s)}function cr(s){if(Z(s))try{return(0,q.execSync)(`dir /b "${s}"`,{shell:"cmd.exe",timeout:1e4}).toString("utf-8").split(/\r?\n/).filter(t=>t.trim().length>0)}catch{return[]}return v.readdirSync(s)}var Qe=class{syncPath="";serverKey="";backlogPollInterval=null;onBacklogResponse=null;recentBacklogEntries=[];onBacklogArrived=null;configure(e,t,r,n){this.syncPath=e,this.serverKey=t,this.onBacklogResponse=r,this.onBacklogArrived=n??null}get isConfigured(){return!!this.syncPath}get syncPathValue(){return this.syncPath}scanRegisteredClients(){if(!this.isConfigured)return[];let e=S.join(this.syncPath,"clients",this.serverKey);if(!Q(e))return[];let t=[];try{let r=cr(e).filter(n=>n.endsWith(".json"));for(let n of r)try{let i=JSON.parse(de(S.join(e,n)));i.clientKey&&i.clientLabel&&t.push(i)}catch{console.warn(`[ServerFallback] Skipping malformed presence file: ${n}`)}}catch(r){console.warn("[ServerFallback] Error scanning clients dir:",r)}return t}startPolling(){this.stopPolling(),this.isConfigured&&(this.backlogPollInterval=setInterval(()=>this.pollServerBacklog(),15e3),console.log(`[ServerFallback] Polling server-backlog from: ${this.syncPath}`))}stopPolling(){this.backlogPollInterval&&(clearInterval(this.backlogPollInterval),this.backlogPollInterval=null)}enqueueCommand(e,t,r,n){if(!this.isConfigured)throw new Error("Sync path is not configured. Set serverMonitor.syncPath in settings.");try{let i=S.join(this.syncPath,"queue");hr(i);let o=S.join(i,`${e}.json`),a=[];if(Q(o))try{a=JSON.parse(de(o))}catch{a=[]}let l=`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,c={id:l,clientKey:t,clientLabel:e,command:r,payload:n,timestamp:Date.now(),serverKey:this.serverKey};return a.push(c),fr(o,JSON.stringify(a,null,2)),console.log(`[ServerFallback] Enqueued command "${r}" for ${e} \u2192 ${o}`),l}catch(i){throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${e}.json": ${i?.message||i}`)}}dequeueCommands(e){if(!this.isConfigured)return[];let t=S.join(this.syncPath,"queue",`${e}.json`);if(!Q(t))return[];try{let r=JSON.parse(de(t));return Xe(t),console.log(`[ServerFallback] Dequeued ${r.length} command(s) for ${e}`),r}catch(r){return console.error(`[ServerFallback] Error reading queue for ${e}:`,r),[]}}pollServerBacklog(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=S.join(this.syncPath,"server-backlog");if(!Q(e))return;let t=cr(e).filter(n=>n.endsWith(".json")),r=[];for(let n of t){let i=S.join(e,n);try{let o=JSON.parse(de(i)),a=n.replace(/\.json$/,"");for(let l of o)console.log(`[ServerFallback] Got server-backlog entry from ${a}: ${l.command}`),r.push({...l,clientLabel:a}),this.onBacklogResponse(a,l);Xe(i)}catch(o){console.error(`[ServerFallback] Error reading backlog file ${n}:`,o)}}r.length>0&&(this.recentBacklogEntries.push(...r),this.onBacklogArrived&&this.onBacklogArrived(r))}catch(e){console.error("[ServerFallback] Backlog poll error:",e)}}getRecentBacklog(){return this.recentBacklogEntries}clearRecentBacklog(){this.recentBacklogEntries=[]}},Ce=class{wss=null;server=null;clients=new Map;provider=null;context=null;running=!1;port=54321;serverId="default";heartbeatCheckInterval=null;syncScanInterval=null;offlineTimeoutMs=3e5;fallback=new Qe;clientReleasePath="";serverPresenceInterval=null;version="1.0.0";configuredPort=54321;initialize(e){this.context=e,this.version=e.extension?.packageJSON?.version||"1.0.0";let t=d.workspace.getConfiguration("serverMonitor"),r=e.globalState.get("serverKey");this.serverId=r||t.get("serverId")||"default";let n=e.globalState.get("serverPort");this.configuredPort=n||t.get("port")||54321,this.port=this.configuredPort,console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`),this.loadPersistentClients(),this.setupFallback(),console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`)}setupFallback(){let e=d.workspace.getConfiguration("serverMonitor"),t=e.get("syncPath")||"";this.clientReleasePath=e.get("clientReleasePath")||"",t&&(this.fallback.configure(t,this.serverId,(r,n)=>{this.handleBacklogResponse(r,n)},r=>{let n=r.length;d.window.showInformationMessage(`${n} backlog result${n===1?"":"s"} received from offline clients`,"View Backlog").then(i=>{i==="View Backlog"&&this.showBacklogWebview()})}),this.fallback.startPolling(),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),6e4))}async changeServerKey(e){!e||!this.context||(this.removeServerPresenceFile(),this.serverId=e,await this.context.globalState.update("serverKey",e),this.running&&this.writeServerPresenceFile("online"),console.log(`[MonitorServer] Server key changed to: ${e}`),d.window.showInformationMessage(`Server key changed to: ${e}`),this.triggerUpdate())}async changePort(e){!e||e<1024||e>65535||!this.context||(this.configuredPort=e,await this.context.globalState.update("serverPort",e),console.log(`[MonitorServer] Port changed to: ${e}`),this.running?(d.window.showInformationMessage(`Port changed to ${e} \u2014 restarting server...`),this.stop(),await new Promise(t=>setTimeout(t,500)),await this.start()):(this.port=e,this.triggerUpdate(),d.window.showInformationMessage(`Port set to ${e} \u2014 will be used on next server start`)))}serverPresenceFilePath(){let e=this.fallback.syncPathValue;return S.join(e,"servers",`${this.serverId}-${N.hostname()}.json`)}writeServerPresenceFile(e){if(this.fallback.isConfigured)try{let t=S.join(this.fallback.syncPathValue,"servers");hr(t);let r=this.serverPresenceFilePath(),n=Date.now();if(e==="online"&&Q(r))try{let l=JSON.parse(de(r));l.status==="online"&&(n=l.startedAt)}catch{}let i=Array.from(this.clients.values()).map(l=>({key:l.key,label:l.clientLabel,status:l.status})),o=N.hostname(),a={key:this.serverId,machine:o,port:this.port,username:N.userInfo().username,version:this.version,clients:i,startedAt:n,lastSeen:Date.now(),status:e};fr(r,JSON.stringify(a,null,2)),console.log(`[MonitorServer] Server presence file written (${e}): ${r}`)}catch(t){console.warn(`[MonitorServer] Could not write server presence file: ${t?.message||t}`)}}removeServerPresenceFile(){if(this.fallback.isConfigured)try{let e=this.serverPresenceFilePath();Q(e)&&(Xe(e),console.log(`[MonitorServer] Server presence file removed: ${e}`))}catch(e){console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message||e}`)}}showBacklogWebview(){let e=o=>String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t=this.fallback.getRecentBacklog(),r={};for(let o of t){let a=o.clientLabel||"unknown";r[a]||(r[a]=[]),r[a].push(o)}let n=d.window.createWebviewPanel("serverBacklog",`Server Backlog (${t.length})`,d.ViewColumn.Beside,{enableScripts:!0}),i=Object.entries(r).map(([o,a])=>{let l=a.map(c=>`
                <tr>
                    <td class="cell time">${e(new Date(c.timestamp||Date.now()).toLocaleString())}</td>
                    <td class="cell cmd">${e(c.command||"")}</td>
                    <td class="cell result"><pre>${e(JSON.stringify(c.payload??c.result??null,null,2))}</pre></td>
                </tr>`).join("");return`<div class="section"><h3>${e(o)}</h3>
                    <table><thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
                    <tbody>${l}</tbody></table></div>`}).join("");n.webview.html=`<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"><style>
body{background:#1e1e2e;color:#cdd6f4;font-family:ui-sans-serif,system-ui,sans-serif;padding:24px;margin:0}
h2{margin:0 0 4px;font-size:1.1rem}h3{color:#a6e3a1;font-size:.85rem;border-bottom:1px solid #313244;padding-bottom:6px;margin:0 0 8px}
.section{margin-bottom:28px}table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.7rem;color:#6c7086;padding-bottom:6px;font-weight:600;text-transform:uppercase}
.cell{padding:4px 8px 4px 0;vertical-align:top;font-size:.75rem}.time{color:#a6adc8;white-space:nowrap}
.cmd{color:#89b4fa;font-family:monospace}.result{color:#cdd6f4}
pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem}
.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.empty{color:#6c7086;font-style:italic;margin-top:20px}
button{background:#313244;border:1px solid #45475a;color:#cdd6f4;padding:5px 14px;border-radius:6px;cursor:pointer;font-size:.8rem}
button:hover{background:#45475a}
</style></head>
<body>
<div class="toolbar">
  <h2>Server Backlog \u2014 ${t.length} result${t.length===1?"":"s"}</h2>
  <button onclick="clearAll()">Clear All</button>
</div>
${t.length===0?'<p class="empty">No backlog entries.</p>':i}
<script>const vscode=acquireVsCodeApi();function clearAll(){vscode.postMessage({action:'clearBacklog'});}</script>
</body></html>`,n.webview.onDidReceiveMessage(o=>{o.action==="clearBacklog"&&(this.fallback.clearRecentBacklog(),n.dispose(),this.triggerUpdate())})}handleBacklogResponse(e,t){let r=Array.from(this.clients.values()).find(i=>i.clientLabel===e);if(!r){console.warn(`[MonitorServer] Backlog response for unknown clientLabel: ${e}`);return}let n=r.commandLog.find(i=>i.id===t.id);n?(n.status="executed",n.result=t.payload):r.commandLog.push({id:t.id,command:t.command,status:"executed",timestamp:t.timestamp,result:t.payload}),r.lastResponse={command:t.command,data:t.payload,timestamp:Date.now()},t.command==="checkBBrainy"&&t.payload&&(r.info||(r.info={}),r.info.bbrainyStatus=t.payload),t.command==="getUsageReport"&&t.payload?.success&&t.payload?.agents&&this.showUsageReportWebview(t.payload,r.info?.username,r.info?.hostname),console.log(`[MonitorServer] Processed server-backlog entry for ${e}: ${t.command}`),this.triggerUpdate()}importSyncClients(){let e=this.fallback.scanRegisteredClients();if(e.length===0)return;let t=0;for(let r of e){if(this.clients.has(r.clientKey)){let n=this.clients.get(r.clientKey);n.extensionStatus=r.status??"active";continue}this.clients.set(r.clientKey,{key:r.clientKey,ws:null,info:{username:r.username,hostname:r.hostname},lastSeen:r.lastSeen,status:"offline",clientLabel:r.clientLabel,commandLog:[],extensionStatus:r.status??"active"}),console.log(`[MonitorServer] Discovered new client via presence file: ${r.clientLabel} (${r.clientKey})`),t++}t>0&&(this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Imported ${t} new client(s) from sync folder`))}loadPersistentClients(){if(!this.context||!this.serverId){console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let t=(this.context.globalState.get("persistentAssets")||{})[this.serverId]||[];console.log(`[MonitorServer] Loading ${t.length} persistent clients for serverId: ${this.serverId}`),t.forEach(r=>{this.clients.set(r.key,{...r,ws:null,status:"offline",clientLabel:r.clientLabel||`${r.info?.username||"unknown"}-${r.info?.hostname||"unknown"}`,commandLog:r.commandLog||[]})})}deduplicateClients(){let e=new Set,t=[];for(let[r,n]of this.clients){let i=`${n.info?.hostname}:${n.info?.username}`;e.has(i)?(t.push(r),console.log(`[MonitorServer] Found duplicate client: ${r} (${n.info?.username}@${n.info?.hostname})`)):e.add(i)}t.forEach(r=>this.clients.delete(r)),t.length>0&&(this.savePersistentClients(),console.log(`[MonitorServer] Removed ${t.length} duplicate client entries`),d.window.showInformationMessage(`Cleaned up ${t.length} duplicate clients on startup`))}savePersistentClients(){if(!this.context||!this.serverId){console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let e=this.context.globalState.get("persistentAssets")||{};e[this.serverId]=Array.from(this.clients.values()).map(t=>({key:t.key,info:t.info,lastSeen:t.lastSeen,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100)})),this.context.globalState.update("persistentAssets",e),console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`)}setProvider(e){this.provider=e}async start(){if(this.running){console.warn("[MonitorServer] Already running, ignoring start request");return}if(!this.context){console.error("[MonitorServer] Cannot start: context not initialized"),d.window.showErrorMessage("Server not initialized with Context");return}let e=d.workspace.getConfiguration("serverMonitor"),r=this.context.globalState.get("serverPort")||this.configuredPort||e.get("port")||54321,n=this.context.globalState.get("serverKey");this.serverId=n||e.get("serverId")||"default",console.log(`[MonitorServer] Starting server with serverId: ${this.serverId} on port: ${r}`),this.clients.clear(),this.loadPersistentClients(),this.deduplicateClients(),this.setupFallback(),this.importSyncClients(),this.server=dr.createServer(),this.wss=new Je.default({server:this.server}),this.wss.on("connection",i=>{console.log("[MonitorServer] New WebSocket connection established"),i.on("message",o=>this.handleClientMessage(i,o)),i.on("close",()=>this.handleClientDisconnect(i)),i.on("error",o=>{console.error(`[MonitorServer] WebSocket error: ${o.message}`)})}),this.listenWithRetry(r)}startHeartbeatCheck(){this.heartbeatCheckInterval&&clearInterval(this.heartbeatCheckInterval),this.heartbeatCheckInterval=setInterval(()=>{this.checkHeartbeats()},3e4)}listenWithRetry(e,t=0){if(t>=10){console.error(`[MonitorServer] Failed to start: Ports ${e-10} to ${e-1} are busy`),d.window.showErrorMessage(`Failed to start server: Ports ${e-10} to ${e-1} are busy.`);return}this.server?.listen(e,()=>{this.port=e,this.running=!0,this.startHeartbeatCheck(),this.writeServerPresenceFile("online"),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),3e4),this.triggerUpdate(),console.log(`[MonitorServer] \u2705 Server started successfully on port ${this.port}`),d.window.showInformationMessage(`Monitor server [${this.serverId}] running on port ${this.port}`)}).on("error",r=>{r.code==="EADDRINUSE"?(console.log(`[MonitorServer] Port ${e} is in use, trying ${e+1}...`),this.listenWithRetry(e+1,t+1)):(console.error(`[MonitorServer] Server error: ${r.message}`),d.window.showErrorMessage(`Server error: ${r.message}`))})}stop(){if(!this.running){console.warn("[MonitorServer] Not running, ignoring stop request");return}console.log("[MonitorServer] Stopping server"),this.heartbeatCheckInterval&&(clearInterval(this.heartbeatCheckInterval),this.heartbeatCheckInterval=null),this.syncScanInterval&&(clearInterval(this.syncScanInterval),this.syncScanInterval=null),this.writeServerPresenceFile("offline"),this.serverPresenceInterval&&(clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=null),this.fallback.stopPolling(),this.wss?.close(),this.server?.close(),this.wss=null,this.server=null,this.running=!1;for(let e of this.clients.values())e.status="offline",e.ws=null;this.triggerUpdate(),console.log("[MonitorServer] \u2705 Server stopped"),d.window.showInformationMessage("Monitor server stopped")}handleClientMessage(e,t){let r;try{r=JSON.parse(t.toString())}catch(i){console.error("[MonitorServer] Failed to parse message:",i);return}console.log(`[MonitorServer] Received message type: ${r.type} from client: ${r.clientKey}`);let n=r.serverKey||r.serverId;if(r.type==="register"){if(n!==this.serverId){console.warn(`[MonitorServer] Client ${r.clientKey} attempted to register with wrong Server Key: ${n} (expected: ${this.serverId})`),e.send(JSON.stringify({type:"error",message:"Invalid Server Key"}));return}this.registerClient(e,r)}else r.type==="response"?(console.log(`[MonitorServer] Response from ${r.clientKey} for command: ${r.command}`),this.handleResponse(r)):r.type==="heartbeat"?(console.debug(`[MonitorServer] Heartbeat from ${r.clientKey}`),this.updateHeartbeat(r.clientKey)):console.warn(`[MonitorServer] Unknown message type: ${r.type} from ${r.clientKey}`);this.triggerUpdate()}registerClient(e,t){let r=`${t.payload?.username||"unknown"}-${t.payload?.hostname||"unknown"}`,n=this.clients.get(t.clientKey);if(n)console.log(`[MonitorServer] Updating existing client: ${t.clientKey} (${r})`),n.ws=e,n.status="online",n.info=t.payload,n.lastSeen=Date.now(),n.clientLabel=r;else{console.log(`[MonitorServer] Registering new client: ${t.clientKey} (${r})`);let i={key:t.clientKey,ws:e,info:t.payload,lastSeen:Date.now(),status:"online",clientLabel:r,commandLog:[]};this.clients.set(t.clientKey,i)}this.savePersistentClients(),console.log(`[MonitorServer] Total clients: ${this.clients.size}`),d.window.showInformationMessage(`Client registered: ${t.payload?.username}@${t.payload?.hostname}`),this.dequeueAndSend(t.clientKey,r)}async dequeueAndSend(e,t){if(!this.fallback.isConfigured)return;let r=this.fallback.dequeueCommands(t);if(r.length===0)return;let n=this.clients.get(e);if(n){console.log(`[MonitorServer] Delivering ${r.length} queued command(s) to ${t} via WebSocket`),d.window.showInformationMessage(`Client ${t} is back online \u2014 delivering ${r.length} queued command(s)`);for(let i of r){let o=n.commandLog.find(a=>a.id===i.id);o&&(o.status="sent"),n.ws?.readyState===1&&(n.ws.send(JSON.stringify({command:i.command,payload:i.payload,timestamp:Date.now(),queuedCommandId:i.id})),console.log(`[MonitorServer] Delivered queued command "${i.command}" (${i.id}) to ${t}`)),await new Promise(a=>setTimeout(a,100))}this.triggerUpdate()}}handleClientDisconnect(e){let t=null;for(let[r,n]of this.clients)if(n.ws===e){n.status="offline",n.ws=null,t=r,console.log(`[MonitorServer] Client disconnected: ${r} (${n.info?.username}@${n.info?.hostname})`),this.triggerUpdate();break}t||console.warn("[MonitorServer] Disconnect event received but no matching client found")}updateHeartbeat(e){let t=this.clients.get(e);t?(t.lastSeen=Date.now(),t.status="online",this.savePersistentClients(),console.debug(`[MonitorServer] Updated heartbeat for ${e}`)):console.warn(`[MonitorServer] Heartbeat from unknown client: ${e}`)}checkHeartbeats(){let e=Date.now(),t=[];for(let[r,n]of this.clients)n.status==="online"&&e-n.lastSeen>9e4?(n.status="offline",n.ws=null,console.log(`[MonitorServer] Client marked offline due to missed heartbeat: ${r} (${n.info?.username}@${n.info?.hostname})`)):n.status==="offline"&&e-n.lastSeen>this.offlineTimeoutMs&&(t.push(r),console.log(`[MonitorServer] Removing stale offline client: ${r} (${n.info?.username}@${n.info?.hostname})`));t.forEach(r=>this.clients.delete(r)),t.length>0&&(console.log(`[MonitorServer] Removed ${t.length} stale client(s)`),this.savePersistentClients(),this.triggerUpdate())}handleResponse(e){let t=this.clients.get(e.clientKey);if(t){if(t.lastResponse={command:e.command||"unknown",data:e.payload,timestamp:Date.now()},console.log(`[MonitorServer] Stored response for ${e.clientKey} (${e.command})`,{success:e.payload?.success,totalEntries:e.payload?.totalEntries,agents:e.payload?.agents?.length}),e.queuedCommandId){let r=t.commandLog.find(n=>n.id===e.queuedCommandId);r&&(r.status="executed",r.result=e.payload)}e.command==="checkBBrainy"&&e.payload&&(t.info||(t.info={}),t.info.bbrainyStatus=e.payload),e.command==="getUsageReport"&&e.payload?.success&&e.payload?.agents&&this.showUsageReportWebview(e.payload,t.info?.username,t.info?.hostname),this.triggerUpdate()}else console.warn(`[MonitorServer] Response from unknown client: ${e.clientKey}`)}showUsageReportWebview(e,t="Unknown",r="Unknown"){try{let n={labels:e.agents.map(o=>o.name),datasets:[{label:"Usage Count",data:e.agents.map(o=>o.count),backgroundColor:["rgba(59, 130, 246, 0.2)","rgba(16, 185, 129, 0.2)","rgba(168, 85, 247, 0.2)","rgba(251, 146, 60, 0.2)","rgba(244, 63, 94, 0.2)","rgba(236, 72, 153, 0.2)"],borderColor:["rgba(59, 130, 246, 1)","rgba(16, 185, 129, 1)","rgba(168, 85, 247, 1)","rgba(251, 146, 60, 1)","rgba(244, 63, 94, 1)","rgba(236, 72, 153, 1)"],borderWidth:2}]},i=d.window.createWebviewPanel("bbrainyUsageReport",`BBrainy Usage: ${e.timeframe}`,d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});i.webview.html=this.getUsageReportHtml(e,n,t,r),console.log(`[MonitorServer] Opened usage report webview for ${t}@${r}: ${e.timeframe}`)}catch(n){console.error("[MonitorServer] Failed to show usage report:",n),d.window.showErrorMessage(`Failed to show usage report: ${n}`)}}getUsageReportHtml(e,t,r,n){let i=e.agents.map(o=>`<tr>
                <td><span class="agent-name">${o.name}</span></td>
                <td class="count">${o.count}</td>
                <td class="percentage">${o.percentage}%</td>
            </tr>`).join("");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Usage Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        color: #e2e8f0;
                        padding: 32px;
                        min-height: 100vh;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    
                    .header {
                        margin-bottom: 32px;
                        border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                        padding-bottom: 20px;
                    }
                    
                    h1 {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .client-info {
                        font-size: 14px;
                        color: #94a3b8;
                        margin-bottom: 8px;
                    }
                    
                    .timeframe {
                        font-size: 18px;
                        color: #cbd5e1;
                        font-weight: 600;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                        margin-bottom: 32px;
                    }
                    
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 20px;
                        backdrop-filter: blur(10px);
                    }
                    
                    .stat-label {
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        color: #60a5fa;
                    }
                    
                    .agents-table {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        overflow: hidden;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th {
                        background: rgba(15, 23, 42, 0.6);
                        padding: 16px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                    }
                    
                    td {
                        padding: 14px 16px;
                        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                        font-size: 14px;
                    }
                    
                    tr:hover {
                        background: rgba(59, 130, 246, 0.05);
                    }
                    
                    tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .agent-name {
                        font-weight: 600;
                        color: #60a5fa;
                    }
                    
                    .count {
                        text-align: right;
                        font-weight: 600;
                        color: #34d399;
                    }
                    
                    .percentage {
                        text-align: right;
                        color: #94a3b8;
                        font-size: 12px;
                    }
                    
                    .chart-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                        position: relative;
                        height: 400px;
                    }
                    
                    .chart-container h2 {
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #cbd5e1;
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #64748b;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>\u{1F3AF} BBrainy Usage Report</h1>
                        <div class="client-info">\u{1F4CD} Client: <strong>${r}@${n}</strong></div>
                        <div class="timeframe">${e.timeframe}</div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Total Usages</div>
                            <div class="stat-value">${e.totalEntries}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Unique Agents</div>
                            <div class="stat-value">${e.agents.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Most Used</div>
                            <div class="stat-value" style="font-size: 18px; color: #34d399;">${e.agents[0]?.name||"N/A"}</div>
                        </div>
                    </div>
                    
                    <div class="agents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Agent Name</th>
                                    <th class="count">Count</th>
                                    <th class="percentage">Usage %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${i}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="chart-container">
                        <h2>Usage Distribution</h2>
                        <canvas id="usageChart"></canvas>
                    </div>
                    
                    <div class="footer">
                        <p>Generated: ${new Date(e.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                
                <script>
                    const ctx = document.getElementById('usageChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'bar',
                        data: ${JSON.stringify(t)},
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        color: '#e2e8f0',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(59, 130, 246, 0.1)'
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                y: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `}async sendCommand(e,t,r){let n=this.clients.get(e);if(!n){console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${e}`),d.window.showErrorMessage("Client not found");return}if(n.status==="offline"){let o={id:`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,command:t,status:"queued",timestamp:Date.now()};if(n.commandLog.push(o),this.triggerUpdate(),!this.fallback.isConfigured){o.status="error";let l=`Client offline \u2014 sync path not configured. Current value: "${d.workspace.getConfiguration("serverMonitor").get("syncPath")||"(empty)"}". Set serverMonitor.syncPath in settings.`;console.error(`[MonitorServer] ${l}`),d.window.showErrorMessage(l),this.savePersistentClients(),this.triggerUpdate();return}try{let a=this.fallback.enqueueCommand(n.clientLabel,e,t,r);o.id=a,this.savePersistentClients(),this.triggerUpdate();let l=`Queued "${t}" for ${n.clientLabel} \u2192 ${this.fallback.syncPathValue}\\queue\\${n.clientLabel}.json`;console.log(`[MonitorServer] ${l}`),d.window.showInformationMessage(l)}catch(a){o.status="error";let l=`Failed to queue command: ${a?.message||a}`;console.error(`[MonitorServer] ${l}`),d.window.showErrorMessage(l),this.savePersistentClients(),this.triggerUpdate()}return}console.log(`[MonitorServer] Sending command to ${e}: ${t}`,r||"{}"),n.ws.send(JSON.stringify({command:t,payload:r,timestamp:Date.now()})),console.log(`[MonitorServer] Command sent successfully to ${e}`)}async queryAllClients(e){console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${e}`);let t=Array.from(this.clients.keys()).map(r=>this.sendCommand(r,e));await Promise.all(t),console.log(`[MonitorServer] Broadcast complete for command: ${e}`)}getAllClientsInfo(){return Array.from(this.clients.values()).map(e=>({key:e.key,username:e.info?.username||"Unknown",hostname:e.info?.hostname||"Unknown",workspace:e.info?.workspace,bbrainyActive:e.info?.bbrainyStatus?.active||!1,status:e.status,lastSeen:e.lastSeen,onlineStatus:e.status==="online"?"online":"offline"}))}showAllAssetsWebview(){let e=this.getAllClientsInfo(),t=d.window.createWebviewPanel("allAssets","All Assets",d.ViewColumn.One,{enableScripts:!0});t.webview.html=this.getAllAssetsHtml(e)}getAllAssetsHtml(e){let t=e.map(r=>`
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${r.onlineStatus==="online"?"#34d399":"#ef4444"};"></span>
                    ${r.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.bbrainyActive?"\u2713 Active":"\u2717 Inactive"}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">${r.lastSeen?new Date(r.lastSeen).toLocaleString():"Never"}</td>
            </tr>
        `).join("");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Assets Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 30px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .summary-stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 20px;
                        backdrop-filter: blur(8px);
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 12px;
                        margin-top: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .table-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        overflow: hidden;
                        backdrop-filter: blur(8px);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th {
                        background: rgba(96, 165, 250, 0.1);
                        padding: 15px;
                        text-align: left;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                        font-weight: 600;
                        color: #60a5fa;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    tr:hover {
                        background: rgba(96, 165, 250, 0.05);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>\u{1F4CA} All Assets (${e.length} Total)</h1>
                    
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-value">${e.length}</div>
                            <div class="stat-label">Total Clients</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(r=>r.onlineStatus==="online").length}</div>
                            <div class="stat-label">Online</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(r=>r.bbrainyActive).length}</div>
                            <div class="stat-label">BBrainy Active</div>
                        </div>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Hostname</th>
                                    <th>Status</th>
                                    <th>BBrainy</th>
                                    <th>Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${t}
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            </html>
        `}showBBrainyStatusWebview(e){let t=this.clients.get(e);if(!t){d.window.showErrorMessage(`Client ${e} not found`);return}let r=t.info?.bbrainyStatus||{installed:!1,active:!1,version:"Unknown",lastUsedTime:"Never",totalUsage:0},n=d.window.createWebviewPanel(`bbrainyStatus-${e}`,`BBrainy Status - ${t.info?.username}@${t.info?.hostname}`,d.ViewColumn.One,{enableScripts:!0});n.webview.html=this.getBBrainyStatusHtml(r,t.info?.username,t.info?.hostname)}getBBrainyStatusHtml(e,t="Unknown",r="Unknown"){let n=e.installed,i=e.active,o=e.version||"Unknown",a=e.lastUsedTime||"Never",l=e.totalUsage||0,c=n?i?"#34d399":"#f59e0b":"#ef4444";return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 800px; margin: 0 auto; }
                    .client-info {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                    }
                    .client-name {
                        font-size: 18px;
                        color: #94a3b8;
                        margin-bottom: 5px;
                    }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 10px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: ${c}20;
                        color: ${c};
                        border: 2px solid ${c};
                        margin-top: 15px;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 25px;
                        backdrop-filter: blur(8px);
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        font-weight: 600;
                    }
                    .stat-value {
                        color: #60a5fa;
                        font-size: 24px;
                        font-weight: 700;
                        word-break: break-word;
                    }
                    .contribution-graph {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 30px;
                        backdrop-filter: blur(8px);
                        margin-top: 30px;
                    }
                    .graph-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #60a5fa;
                    }
                    .graph-grid {
                        display: grid;
                        grid-template-columns: repeat(12, 1fr);
                        gap: 4px;
                        margin-bottom: 15px;
                    }
                    .graph-cell {
                        width: 100%;
                        aspect-ratio: 1;
                        background: rgba(100, 116, 139, 0.3);
                        border-radius: 4px;
                        border: 1px solid rgba(100, 116, 139, 0.2);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="client-info">
                        <div class="client-name">\u{1F4F1} ${t}@${r}</div>
                        <h1>\u{1F9E0} BBrainy Status</h1>
                        <div class="status-badge">${n?i?"Active":"Installed - Inactive":"Not Installed"}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${n?"\u2713 Yes":"\u2717 No"}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Version</div>
                            <div class="stat-value">${o}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Last Used</div>
                            <div class="stat-value" style="font-size: 14px;">${a}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Usage</div>
                            <div class="stat-value">${l}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">\u{1F4CA} Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length:84},(f,p)=>`<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random()*.5});"></div>`).join("")}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `}async generateReport(){if(!d.workspace.workspaceFolders){d.window.showErrorMessage("Open a workspace to generate reports");return}let e={timestamp:new Date().toISOString(),totalClients:this.clients.size,onlineClients:Array.from(this.clients.values()).filter(r=>r.status==="online").length,clients:Array.from(this.clients.values()).map(r=>({key:r.key,hostname:r.info.hostname,username:r.info.username,workspace:r.info.workspace,bbrainyActive:r.info.bbrainyStatus?.active,lastSeen:new Date(r.lastSeen).toISOString(),status:r.status}))},t=d.Uri.joinPath(d.workspace.workspaceFolders[0].uri,"reports",`report-${Date.now()}.json`);try{await d.workspace.fs.writeFile(t,Buffer.from(JSON.stringify(e,null,2))),d.window.showInformationMessage(`Report saved to ${t.fsPath}`)}catch(r){d.window.showErrorMessage(`Failed to save report: ${r}`)}}async publishClientUpdate(){let e=await d.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"VSIX Extension":["vsix"]},title:"Select client extension VSIX to publish"});if(e&&e[0])if(this.clientReleasePath)try{let t=S.join(this.clientReleasePath,"updates");v.mkdirSync(t,{recursive:!0});let r=S.basename(e[0].fsPath);v.copyFileSync(e[0].fsPath,S.join(t,r)),console.log(`[MonitorServer] Published update to client-release: ${r}`),d.window.showInformationMessage(`Update published: ${r}`)}catch(t){console.error("[MonitorServer] Failed to publish update:",t),d.window.showErrorMessage(`Failed to publish update: ${t}`)}else d.window.showErrorMessage("Client release path not configured. Set serverMonitor.clientReleasePath first.")}triggerUpdate(){if(this.provider){let e=Array.from(this.clients.values());this.provider.update({serverStatus:{running:this.running,port:this.port,serverId:this.serverId},total:this.clients.size,online:e.filter(t=>t.status==="online").length,offline:e.filter(t=>t.status==="offline").length,clients:e.map(t=>({key:t.key,hostname:t.info?.hostname,username:t.info?.username,workspace:t.info?.workspace,bbrainyActive:t.info?.bbrainyStatus?.active,lastSeen:t.lastSeen,status:t.status,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-50),lastResponse:t.lastResponse,extensionStatus:t.extensionStatus})),backlogCount:this.fallback.getRecentBacklog().length,configuredPort:this.configuredPort})}}};var Ze=k(require("vscode")),he=class{constructor(e,t){this._extensionUri=e;this.server=t}static viewType="monitor-dashboard";_view;resolveWebviewView(e,t,r){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[Ze.Uri.joinPath(this._extensionUri,"dist")]},e.webview.html=this._getWebviewContent(e.webview),e.webview.onDidReceiveMessage(async n=>{switch(n.action){case"sendCommand":await this.server.sendCommand(n.clientKey,n.command,n.payload);break;case"queryAll":await this.server.queryAllClients(n.command);break;case"showAssets":this.server.showAllAssetsWebview();break;case"showBBrainyStatus":this.server.showBBrainyStatusWebview(n.clientKey);break;case"generateReport":await this.server.generateReport();break;case"startServer":await this.server.start();break;case"stopServer":this.server.stop();break;case"changeServerKey":await this.server.changeServerKey(n.newKey);break;case"viewBacklog":this.server.showBacklogWebview();break;case"changePort":{let i=parseInt(n.newPort,10);isNaN(i)||await this.server.changePort(i);break}}}),this.server.triggerUpdate()}update(e){this._view&&this._view.webview.postMessage({type:"update",data:e})}_getWebviewContent(e){let t=zs(),r=o=>e.asWebviewUri(Ze.Uri.joinPath(this._extensionUri,"dist",o)),n=r("monitor-webview.js"),i=r("monitor-webview.css");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="
                    default-src 'none';
                    style-src ${e.cspSource} 'unsafe-inline';
                    font-src ${e.cspSource};
                    img-src ${e.cspSource} https: data:;
                    script-src 'nonce-${t}';
                    connect-src 'self' ${e.cspSource} https: ws:;
                ">
                <link href="${i}" rel="stylesheet">
                <title>Monitor Dashboard</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${t}" src="${n}"></script>
            </body>
            </html>
        `}};function zs(){let s="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)s+=e.charAt(Math.floor(Math.random()*e.length));return s}var et=null;function Vs(s){let e=new Ce;et=e,e.initialize(s);let t=new he(s.extensionUri,e);e.setProvider(t),s.subscriptions.push($.window.registerWebviewViewProvider(he.viewType,t),$.commands.registerCommand("serverMonitor.start",()=>e.start()),$.commands.registerCommand("serverMonitor.showDashboard",()=>{$.commands.executeCommand("workbench.view.extension.monitor-explorer")}),$.commands.registerCommand("serverMonitor.generateReport",()=>e.generateReport()),$.commands.registerCommand("serverMonitor.publishUpdate",()=>e.publishClientUpdate()),$.commands.registerCommand("serverMonitor.stop",()=>e.stop()),$.commands.registerCommand("serverMonitor.viewBacklog",()=>e.showBacklogWebview())),$.workspace.getConfiguration("serverMonitor").get("autoStart")&&e.start()}function Gs(){et?.removeServerPresenceFile(),et=null}0&&(module.exports={activate,deactivate});
