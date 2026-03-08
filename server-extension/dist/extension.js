"use strict";var pr=Object.create;var ue=Object.defineProperty;var gr=Object.getOwnPropertyDescriptor;var mr=Object.getOwnPropertyNames;var vr=Object.getPrototypeOf,br=Object.prototype.hasOwnProperty;var E=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),yr=(n,e)=>{for(var t in e)ue(n,t,{get:e[t],enumerable:!0})},ot=(n,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of mr(e))!br.call(n,s)&&s!==t&&ue(n,s,{get:()=>e[s],enumerable:!(r=gr(e,s))||r.enumerable});return n};var $=(n,e,t)=>(t=n!=null?pr(vr(n)):{},ot(e||!n||!n.__esModule?ue(t,"default",{value:n,enumerable:!0}):t,n)),xr=n=>ot(ue({},"__esModule",{value:!0}),n);var B=E((Js,ct)=>{"use strict";var at=["nodebuffer","arraybuffer","fragments"],lt=typeof Blob<"u";lt&&at.push("blob");ct.exports={BINARY_TYPES:at,CLOSE_TIMEOUT:3e4,EMPTY_BUFFER:Buffer.alloc(0),GUID:"258EAFA5-E914-47DA-95CA-C5AB0DC85B11",hasBlob:lt,kForOnEventAttribute:Symbol("kIsForOnEventAttribute"),kListener:Symbol("kListener"),kStatusCode:Symbol("status-code"),kWebSocket:Symbol("websocket"),NOOP:()=>{}}});var se=E((Qs,pe)=>{"use strict";var{EMPTY_BUFFER:_r}=B(),Me=Buffer[Symbol.species];function Sr(n,e){if(n.length===0)return _r;if(n.length===1)return n[0];let t=Buffer.allocUnsafe(e),r=0;for(let s=0;s<n.length;s++){let i=n[s];t.set(i,r),r+=i.length}return r<e?new Me(t.buffer,t.byteOffset,r):t}function dt(n,e,t,r,s){for(let i=0;i<s;i++)t[r+i]=n[i]^e[i&3]}function ht(n,e){for(let t=0;t<n.length;t++)n[t]^=e[t&3]}function wr(n){return n.length===n.buffer.byteLength?n.buffer:n.buffer.slice(n.byteOffset,n.byteOffset+n.length)}function Ie(n){if(Ie.readOnly=!0,Buffer.isBuffer(n))return n;let e;return n instanceof ArrayBuffer?e=new Me(n):ArrayBuffer.isView(n)?e=new Me(n.buffer,n.byteOffset,n.byteLength):(e=Buffer.from(n),Ie.readOnly=!1),e}pe.exports={concat:Sr,mask:dt,toArrayBuffer:wr,toBuffer:Ie,unmask:ht};if(!process.env.WS_NO_BUFFER_UTIL)try{let n=require("bufferutil");pe.exports.mask=function(e,t,r,s,i){i<48?dt(e,t,r,s,i):n.mask(e,t,r,s,i)},pe.exports.unmask=function(e,t){e.length<32?ht(e,t):n.unmask(e,t)}}catch{}});var pt=E((Ys,ut)=>{"use strict";var ft=Symbol("kDone"),Te=Symbol("kRun"),Le=class{constructor(e){this[ft]=()=>{this.pending--,this[Te]()},this.concurrency=e||1/0,this.jobs=[],this.pending=0}add(e){this.jobs.push(e),this[Te]()}[Te](){if(this.pending!==this.concurrency&&this.jobs.length){let e=this.jobs.shift();this.pending++,e(this[ft])}}};ut.exports=Le});var ie=E((Xs,bt)=>{"use strict";var ne=require("zlib"),gt=se(),kr=pt(),{kStatusCode:mt}=B(),Er=Buffer[Symbol.species],Cr=Buffer.from([0,0,255,255]),me=Symbol("permessage-deflate"),U=Symbol("total-length"),K=Symbol("callback"),A=Symbol("buffers"),J=Symbol("error"),ge,Be=class{constructor(e,t,r){if(this._maxPayload=r|0,this._options=e||{},this._threshold=this._options.threshold!==void 0?this._options.threshold:1024,this._isServer=!!t,this._deflate=null,this._inflate=null,this.params=null,!ge){let s=this._options.concurrencyLimit!==void 0?this._options.concurrencyLimit:10;ge=new kr(s)}}static get extensionName(){return"permessage-deflate"}offer(){let e={};return this._options.serverNoContextTakeover&&(e.server_no_context_takeover=!0),this._options.clientNoContextTakeover&&(e.client_no_context_takeover=!0),this._options.serverMaxWindowBits&&(e.server_max_window_bits=this._options.serverMaxWindowBits),this._options.clientMaxWindowBits?e.client_max_window_bits=this._options.clientMaxWindowBits:this._options.clientMaxWindowBits==null&&(e.client_max_window_bits=!0),e}accept(e){return e=this.normalizeParams(e),this.params=this._isServer?this.acceptAsServer(e):this.acceptAsClient(e),this.params}cleanup(){if(this._inflate&&(this._inflate.close(),this._inflate=null),this._deflate){let e=this._deflate[K];this._deflate.close(),this._deflate=null,e&&e(new Error("The deflate stream was closed while data was being processed"))}}acceptAsServer(e){let t=this._options,r=e.find(s=>!(t.serverNoContextTakeover===!1&&s.server_no_context_takeover||s.server_max_window_bits&&(t.serverMaxWindowBits===!1||typeof t.serverMaxWindowBits=="number"&&t.serverMaxWindowBits>s.server_max_window_bits)||typeof t.clientMaxWindowBits=="number"&&!s.client_max_window_bits));if(!r)throw new Error("None of the extension offers can be accepted");return t.serverNoContextTakeover&&(r.server_no_context_takeover=!0),t.clientNoContextTakeover&&(r.client_no_context_takeover=!0),typeof t.serverMaxWindowBits=="number"&&(r.server_max_window_bits=t.serverMaxWindowBits),typeof t.clientMaxWindowBits=="number"?r.client_max_window_bits=t.clientMaxWindowBits:(r.client_max_window_bits===!0||t.clientMaxWindowBits===!1)&&delete r.client_max_window_bits,r}acceptAsClient(e){let t=e[0];if(this._options.clientNoContextTakeover===!1&&t.client_no_context_takeover)throw new Error('Unexpected parameter "client_no_context_takeover"');if(!t.client_max_window_bits)typeof this._options.clientMaxWindowBits=="number"&&(t.client_max_window_bits=this._options.clientMaxWindowBits);else if(this._options.clientMaxWindowBits===!1||typeof this._options.clientMaxWindowBits=="number"&&t.client_max_window_bits>this._options.clientMaxWindowBits)throw new Error('Unexpected or invalid parameter "client_max_window_bits"');return t}normalizeParams(e){return e.forEach(t=>{Object.keys(t).forEach(r=>{let s=t[r];if(s.length>1)throw new Error(`Parameter "${r}" must have only a single value`);if(s=s[0],r==="client_max_window_bits"){if(s!==!0){let i=+s;if(!Number.isInteger(i)||i<8||i>15)throw new TypeError(`Invalid value for parameter "${r}": ${s}`);s=i}else if(!this._isServer)throw new TypeError(`Invalid value for parameter "${r}": ${s}`)}else if(r==="server_max_window_bits"){let i=+s;if(!Number.isInteger(i)||i<8||i>15)throw new TypeError(`Invalid value for parameter "${r}": ${s}`);s=i}else if(r==="client_no_context_takeover"||r==="server_no_context_takeover"){if(s!==!0)throw new TypeError(`Invalid value for parameter "${r}": ${s}`)}else throw new Error(`Unknown parameter "${r}"`);t[r]=s})}),e}decompress(e,t,r){ge.add(s=>{this._decompress(e,t,(i,o)=>{s(),r(i,o)})})}compress(e,t,r){ge.add(s=>{this._compress(e,t,(i,o)=>{s(),r(i,o)})})}_decompress(e,t,r){let s=this._isServer?"client":"server";if(!this._inflate){let i=`${s}_max_window_bits`,o=typeof this.params[i]!="number"?ne.Z_DEFAULT_WINDOWBITS:this.params[i];this._inflate=ne.createInflateRaw({...this._options.zlibInflateOptions,windowBits:o}),this._inflate[me]=this,this._inflate[U]=0,this._inflate[A]=[],this._inflate.on("error",Pr),this._inflate.on("data",vt)}this._inflate[K]=r,this._inflate.write(e),t&&this._inflate.write(Cr),this._inflate.flush(()=>{let i=this._inflate[J];if(i){this._inflate.close(),this._inflate=null,r(i);return}let o=gt.concat(this._inflate[A],this._inflate[U]);this._inflate._readableState.endEmitted?(this._inflate.close(),this._inflate=null):(this._inflate[U]=0,this._inflate[A]=[],t&&this.params[`${s}_no_context_takeover`]&&this._inflate.reset()),r(null,o)})}_compress(e,t,r){let s=this._isServer?"server":"client";if(!this._deflate){let i=`${s}_max_window_bits`,o=typeof this.params[i]!="number"?ne.Z_DEFAULT_WINDOWBITS:this.params[i];this._deflate=ne.createDeflateRaw({...this._options.zlibDeflateOptions,windowBits:o}),this._deflate[U]=0,this._deflate[A]=[],this._deflate.on("data",$r)}this._deflate[K]=r,this._deflate.write(e),this._deflate.flush(ne.Z_SYNC_FLUSH,()=>{if(!this._deflate)return;let i=gt.concat(this._deflate[A],this._deflate[U]);t&&(i=new Er(i.buffer,i.byteOffset,i.length-4)),this._deflate[K]=null,this._deflate[U]=0,this._deflate[A]=[],t&&this.params[`${s}_no_context_takeover`]&&this._deflate.reset(),r(null,i)})}};bt.exports=Be;function $r(n){this[A].push(n),this[U]+=n.length}function vt(n){if(this[U]+=n.length,this[me]._maxPayload<1||this[U]<=this[me]._maxPayload){this[A].push(n);return}this[J]=new RangeError("Max payload size exceeded"),this[J].code="WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",this[J][mt]=1009,this.removeListener("data",vt),this.reset()}function Pr(n){if(this[me]._inflate=null,this[J]){this[K](this[J]);return}n[mt]=1007,this[K](n)}});var Q=E((Zs,ve)=>{"use strict";var{isUtf8:yt}=require("buffer"),{hasBlob:Or}=B(),Mr=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0];function Ir(n){return n>=1e3&&n<=1014&&n!==1004&&n!==1005&&n!==1006||n>=3e3&&n<=4999}function Ue(n){let e=n.length,t=0;for(;t<e;)if(!(n[t]&128))t++;else if((n[t]&224)===192){if(t+1===e||(n[t+1]&192)!==128||(n[t]&254)===192)return!1;t+=2}else if((n[t]&240)===224){if(t+2>=e||(n[t+1]&192)!==128||(n[t+2]&192)!==128||n[t]===224&&(n[t+1]&224)===128||n[t]===237&&(n[t+1]&224)===160)return!1;t+=3}else if((n[t]&248)===240){if(t+3>=e||(n[t+1]&192)!==128||(n[t+2]&192)!==128||(n[t+3]&192)!==128||n[t]===240&&(n[t+1]&240)===128||n[t]===244&&n[t+1]>143||n[t]>244)return!1;t+=4}else return!1;return!0}function Tr(n){return Or&&typeof n=="object"&&typeof n.arrayBuffer=="function"&&typeof n.type=="string"&&typeof n.stream=="function"&&(n[Symbol.toStringTag]==="Blob"||n[Symbol.toStringTag]==="File")}ve.exports={isBlob:Tr,isValidStatusCode:Ir,isValidUTF8:Ue,tokenChars:Mr};if(yt)ve.exports.isValidUTF8=function(n){return n.length<24?Ue(n):yt(n)};else if(!process.env.WS_NO_UTF_8_VALIDATE)try{let n=require("utf-8-validate");ve.exports.isValidUTF8=function(e){return e.length<32?Ue(e):n(e)}}catch{}});var Fe=E((en,Ct)=>{"use strict";var{Writable:Lr}=require("stream"),xt=ie(),{BINARY_TYPES:Br,EMPTY_BUFFER:_t,kStatusCode:Ur,kWebSocket:Nr}=B(),{concat:Ne,toArrayBuffer:Rr,unmask:Ar}=se(),{isValidStatusCode:Dr,isValidUTF8:St}=Q(),be=Buffer[Symbol.species],P=0,wt=1,kt=2,Et=3,Re=4,Ae=5,ye=6,De=class extends Lr{constructor(e={}){super(),this._allowSynchronousEvents=e.allowSynchronousEvents!==void 0?e.allowSynchronousEvents:!0,this._binaryType=e.binaryType||Br[0],this._extensions=e.extensions||{},this._isServer=!!e.isServer,this._maxPayload=e.maxPayload|0,this._skipUTF8Validation=!!e.skipUTF8Validation,this[Nr]=void 0,this._bufferedBytes=0,this._buffers=[],this._compressed=!1,this._payloadLength=0,this._mask=void 0,this._fragmented=0,this._masked=!1,this._fin=!1,this._opcode=0,this._totalPayloadLength=0,this._messageLength=0,this._fragments=[],this._errored=!1,this._loop=!1,this._state=P}_write(e,t,r){if(this._opcode===8&&this._state==P)return r();this._bufferedBytes+=e.length,this._buffers.push(e),this.startLoop(r)}consume(e){if(this._bufferedBytes-=e,e===this._buffers[0].length)return this._buffers.shift();if(e<this._buffers[0].length){let r=this._buffers[0];return this._buffers[0]=new be(r.buffer,r.byteOffset+e,r.length-e),new be(r.buffer,r.byteOffset,e)}let t=Buffer.allocUnsafe(e);do{let r=this._buffers[0],s=t.length-e;e>=r.length?t.set(this._buffers.shift(),s):(t.set(new Uint8Array(r.buffer,r.byteOffset,e),s),this._buffers[0]=new be(r.buffer,r.byteOffset+e,r.length-e)),e-=r.length}while(e>0);return t}startLoop(e){this._loop=!0;do switch(this._state){case P:this.getInfo(e);break;case wt:this.getPayloadLength16(e);break;case kt:this.getPayloadLength64(e);break;case Et:this.getMask();break;case Re:this.getData(e);break;case Ae:case ye:this._loop=!1;return}while(this._loop);this._errored||e()}getInfo(e){if(this._bufferedBytes<2){this._loop=!1;return}let t=this.consume(2);if(t[0]&48){let s=this.createError(RangeError,"RSV2 and RSV3 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_2_3");e(s);return}let r=(t[0]&64)===64;if(r&&!this._extensions[xt.extensionName]){let s=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(s);return}if(this._fin=(t[0]&128)===128,this._opcode=t[0]&15,this._payloadLength=t[1]&127,this._opcode===0){if(r){let s=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(s);return}if(!this._fragmented){let s=this.createError(RangeError,"invalid opcode 0",!0,1002,"WS_ERR_INVALID_OPCODE");e(s);return}this._opcode=this._fragmented}else if(this._opcode===1||this._opcode===2){if(this._fragmented){let s=this.createError(RangeError,`invalid opcode ${this._opcode}`,!0,1002,"WS_ERR_INVALID_OPCODE");e(s);return}this._compressed=r}else if(this._opcode>7&&this._opcode<11){if(!this._fin){let s=this.createError(RangeError,"FIN must be set",!0,1002,"WS_ERR_EXPECTED_FIN");e(s);return}if(r){let s=this.createError(RangeError,"RSV1 must be clear",!0,1002,"WS_ERR_UNEXPECTED_RSV_1");e(s);return}if(this._payloadLength>125||this._opcode===8&&this._payloadLength===1){let s=this.createError(RangeError,`invalid payload length ${this._payloadLength}`,!0,1002,"WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");e(s);return}}else{let s=this.createError(RangeError,`invalid opcode ${this._opcode}`,!0,1002,"WS_ERR_INVALID_OPCODE");e(s);return}if(!this._fin&&!this._fragmented&&(this._fragmented=this._opcode),this._masked=(t[1]&128)===128,this._isServer){if(!this._masked){let s=this.createError(RangeError,"MASK must be set",!0,1002,"WS_ERR_EXPECTED_MASK");e(s);return}}else if(this._masked){let s=this.createError(RangeError,"MASK must be clear",!0,1002,"WS_ERR_UNEXPECTED_MASK");e(s);return}this._payloadLength===126?this._state=wt:this._payloadLength===127?this._state=kt:this.haveLength(e)}getPayloadLength16(e){if(this._bufferedBytes<2){this._loop=!1;return}this._payloadLength=this.consume(2).readUInt16BE(0),this.haveLength(e)}getPayloadLength64(e){if(this._bufferedBytes<8){this._loop=!1;return}let t=this.consume(8),r=t.readUInt32BE(0);if(r>Math.pow(2,21)-1){let s=this.createError(RangeError,"Unsupported WebSocket frame: payload length > 2^53 - 1",!1,1009,"WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");e(s);return}this._payloadLength=r*Math.pow(2,32)+t.readUInt32BE(4),this.haveLength(e)}haveLength(e){if(this._payloadLength&&this._opcode<8&&(this._totalPayloadLength+=this._payloadLength,this._totalPayloadLength>this._maxPayload&&this._maxPayload>0)){let t=this.createError(RangeError,"Max payload size exceeded",!1,1009,"WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");e(t);return}this._masked?this._state=Et:this._state=Re}getMask(){if(this._bufferedBytes<4){this._loop=!1;return}this._mask=this.consume(4),this._state=Re}getData(e){let t=_t;if(this._payloadLength){if(this._bufferedBytes<this._payloadLength){this._loop=!1;return}t=this.consume(this._payloadLength),this._masked&&this._mask[0]|this._mask[1]|this._mask[2]|this._mask[3]&&Ar(t,this._mask)}if(this._opcode>7){this.controlMessage(t,e);return}if(this._compressed){this._state=Ae,this.decompress(t,e);return}t.length&&(this._messageLength=this._totalPayloadLength,this._fragments.push(t)),this.dataMessage(e)}decompress(e,t){this._extensions[xt.extensionName].decompress(e,this._fin,(s,i)=>{if(s)return t(s);if(i.length){if(this._messageLength+=i.length,this._messageLength>this._maxPayload&&this._maxPayload>0){let o=this.createError(RangeError,"Max payload size exceeded",!1,1009,"WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");t(o);return}this._fragments.push(i)}this.dataMessage(t),this._state===P&&this.startLoop(t)})}dataMessage(e){if(!this._fin){this._state=P;return}let t=this._messageLength,r=this._fragments;if(this._totalPayloadLength=0,this._messageLength=0,this._fragmented=0,this._fragments=[],this._opcode===2){let s;this._binaryType==="nodebuffer"?s=Ne(r,t):this._binaryType==="arraybuffer"?s=Rr(Ne(r,t)):this._binaryType==="blob"?s=new Blob(r):s=r,this._allowSynchronousEvents?(this.emit("message",s,!0),this._state=P):(this._state=ye,setImmediate(()=>{this.emit("message",s,!0),this._state=P,this.startLoop(e)}))}else{let s=Ne(r,t);if(!this._skipUTF8Validation&&!St(s)){let i=this.createError(Error,"invalid UTF-8 sequence",!0,1007,"WS_ERR_INVALID_UTF8");e(i);return}this._state===Ae||this._allowSynchronousEvents?(this.emit("message",s,!1),this._state=P):(this._state=ye,setImmediate(()=>{this.emit("message",s,!1),this._state=P,this.startLoop(e)}))}}controlMessage(e,t){if(this._opcode===8){if(e.length===0)this._loop=!1,this.emit("conclude",1005,_t),this.end();else{let r=e.readUInt16BE(0);if(!Dr(r)){let i=this.createError(RangeError,`invalid status code ${r}`,!0,1002,"WS_ERR_INVALID_CLOSE_CODE");t(i);return}let s=new be(e.buffer,e.byteOffset+2,e.length-2);if(!this._skipUTF8Validation&&!St(s)){let i=this.createError(Error,"invalid UTF-8 sequence",!0,1007,"WS_ERR_INVALID_UTF8");t(i);return}this._loop=!1,this.emit("conclude",r,s),this.end()}this._state=P;return}this._allowSynchronousEvents?(this.emit(this._opcode===9?"ping":"pong",e),this._state=P):(this._state=ye,setImmediate(()=>{this.emit(this._opcode===9?"ping":"pong",e),this._state=P,this.startLoop(t)}))}createError(e,t,r,s,i){this._loop=!1,this._errored=!0;let o=new e(r?`Invalid WebSocket frame: ${t}`:t);return Error.captureStackTrace(o,this.createError),o.code=i,o[Ur]=s,o}};Ct.exports=De});var je=E((rn,Ot)=>{"use strict";var{Duplex:tn}=require("stream"),{randomFillSync:Fr}=require("crypto"),$t=ie(),{EMPTY_BUFFER:Wr,kWebSocket:qr,NOOP:jr}=B(),{isBlob:Y,isValidStatusCode:zr}=Q(),{mask:Pt,toBuffer:F}=se(),O=Symbol("kByteLength"),Vr=Buffer.alloc(4),xe=8*1024,W,X=xe,I=0,Gr=1,Hr=2,We=class n{constructor(e,t,r){this._extensions=t||{},r&&(this._generateMask=r,this._maskBuffer=Buffer.alloc(4)),this._socket=e,this._firstFragment=!0,this._compress=!1,this._bufferedBytes=0,this._queue=[],this._state=I,this.onerror=jr,this[qr]=void 0}static frame(e,t){let r,s=!1,i=2,o=!1;t.mask&&(r=t.maskBuffer||Vr,t.generateMask?t.generateMask(r):(X===xe&&(W===void 0&&(W=Buffer.alloc(xe)),Fr(W,0,xe),X=0),r[0]=W[X++],r[1]=W[X++],r[2]=W[X++],r[3]=W[X++]),o=(r[0]|r[1]|r[2]|r[3])===0,i=6);let a;typeof e=="string"?(!t.mask||o)&&t[O]!==void 0?a=t[O]:(e=Buffer.from(e),a=e.length):(a=e.length,s=t.mask&&t.readOnly&&!o);let c=a;a>=65536?(i+=8,c=127):a>125&&(i+=2,c=126);let h=Buffer.allocUnsafe(s?a+i:i);return h[0]=t.fin?t.opcode|128:t.opcode,t.rsv1&&(h[0]|=64),h[1]=c,c===126?h.writeUInt16BE(a,2):c===127&&(h[2]=h[3]=0,h.writeUIntBE(a,4,6)),t.mask?(h[1]|=128,h[i-4]=r[0],h[i-3]=r[1],h[i-2]=r[2],h[i-1]=r[3],o?[h,e]:s?(Pt(e,r,h,i,a),[h]):(Pt(e,r,e,0,a),[h,e])):[h,e]}close(e,t,r,s){let i;if(e===void 0)i=Wr;else{if(typeof e!="number"||!zr(e))throw new TypeError("First argument must be a valid error code number");if(t===void 0||!t.length)i=Buffer.allocUnsafe(2),i.writeUInt16BE(e,0);else{let a=Buffer.byteLength(t);if(a>123)throw new RangeError("The message must not be greater than 123 bytes");i=Buffer.allocUnsafe(2+a),i.writeUInt16BE(e,0),typeof t=="string"?i.write(t,2):i.set(t,2)}}let o={[O]:i.length,fin:!0,generateMask:this._generateMask,mask:r,maskBuffer:this._maskBuffer,opcode:8,readOnly:!1,rsv1:!1};this._state!==I?this.enqueue([this.dispatch,i,!1,o,s]):this.sendFrame(n.frame(i,o),s)}ping(e,t,r){let s,i;if(typeof e=="string"?(s=Buffer.byteLength(e),i=!1):Y(e)?(s=e.size,i=!1):(e=F(e),s=e.length,i=F.readOnly),s>125)throw new RangeError("The data size must not be greater than 125 bytes");let o={[O]:s,fin:!0,generateMask:this._generateMask,mask:t,maskBuffer:this._maskBuffer,opcode:9,readOnly:i,rsv1:!1};Y(e)?this._state!==I?this.enqueue([this.getBlobData,e,!1,o,r]):this.getBlobData(e,!1,o,r):this._state!==I?this.enqueue([this.dispatch,e,!1,o,r]):this.sendFrame(n.frame(e,o),r)}pong(e,t,r){let s,i;if(typeof e=="string"?(s=Buffer.byteLength(e),i=!1):Y(e)?(s=e.size,i=!1):(e=F(e),s=e.length,i=F.readOnly),s>125)throw new RangeError("The data size must not be greater than 125 bytes");let o={[O]:s,fin:!0,generateMask:this._generateMask,mask:t,maskBuffer:this._maskBuffer,opcode:10,readOnly:i,rsv1:!1};Y(e)?this._state!==I?this.enqueue([this.getBlobData,e,!1,o,r]):this.getBlobData(e,!1,o,r):this._state!==I?this.enqueue([this.dispatch,e,!1,o,r]):this.sendFrame(n.frame(e,o),r)}send(e,t,r){let s=this._extensions[$t.extensionName],i=t.binary?2:1,o=t.compress,a,c;typeof e=="string"?(a=Buffer.byteLength(e),c=!1):Y(e)?(a=e.size,c=!1):(e=F(e),a=e.length,c=F.readOnly),this._firstFragment?(this._firstFragment=!1,o&&s&&s.params[s._isServer?"server_no_context_takeover":"client_no_context_takeover"]&&(o=a>=s._threshold),this._compress=o):(o=!1,i=0),t.fin&&(this._firstFragment=!0);let h={[O]:a,fin:t.fin,generateMask:this._generateMask,mask:t.mask,maskBuffer:this._maskBuffer,opcode:i,readOnly:c,rsv1:o};Y(e)?this._state!==I?this.enqueue([this.getBlobData,e,this._compress,h,r]):this.getBlobData(e,this._compress,h,r):this._state!==I?this.enqueue([this.dispatch,e,this._compress,h,r]):this.dispatch(e,this._compress,h,r)}getBlobData(e,t,r,s){this._bufferedBytes+=r[O],this._state=Hr,e.arrayBuffer().then(i=>{if(this._socket.destroyed){let a=new Error("The socket was closed while the blob was being read");process.nextTick(qe,this,a,s);return}this._bufferedBytes-=r[O];let o=F(i);t?this.dispatch(o,t,r,s):(this._state=I,this.sendFrame(n.frame(o,r),s),this.dequeue())}).catch(i=>{process.nextTick(Kr,this,i,s)})}dispatch(e,t,r,s){if(!t){this.sendFrame(n.frame(e,r),s);return}let i=this._extensions[$t.extensionName];this._bufferedBytes+=r[O],this._state=Gr,i.compress(e,r.fin,(o,a)=>{if(this._socket.destroyed){let c=new Error("The socket was closed while data was being compressed");qe(this,c,s);return}this._bufferedBytes-=r[O],this._state=I,r.readOnly=!1,this.sendFrame(n.frame(a,r),s),this.dequeue()})}dequeue(){for(;this._state===I&&this._queue.length;){let e=this._queue.shift();this._bufferedBytes-=e[3][O],Reflect.apply(e[0],this,e.slice(1))}}enqueue(e){this._bufferedBytes+=e[3][O],this._queue.push(e)}sendFrame(e,t){e.length===2?(this._socket.cork(),this._socket.write(e[0]),this._socket.write(e[1],t),this._socket.uncork()):this._socket.write(e[0],t)}};Ot.exports=We;function qe(n,e,t){typeof t=="function"&&t(e);for(let r=0;r<n._queue.length;r++){let s=n._queue[r],i=s[s.length-1];typeof i=="function"&&i(e)}}function Kr(n,e,t){qe(n,e,t),n.onerror(e)}});var At=E((sn,Rt)=>{"use strict";var{kForOnEventAttribute:oe,kListener:ze}=B(),Mt=Symbol("kCode"),It=Symbol("kData"),Tt=Symbol("kError"),Lt=Symbol("kMessage"),Bt=Symbol("kReason"),Z=Symbol("kTarget"),Ut=Symbol("kType"),Nt=Symbol("kWasClean"),N=class{constructor(e){this[Z]=null,this[Ut]=e}get target(){return this[Z]}get type(){return this[Ut]}};Object.defineProperty(N.prototype,"target",{enumerable:!0});Object.defineProperty(N.prototype,"type",{enumerable:!0});var q=class extends N{constructor(e,t={}){super(e),this[Mt]=t.code===void 0?0:t.code,this[Bt]=t.reason===void 0?"":t.reason,this[Nt]=t.wasClean===void 0?!1:t.wasClean}get code(){return this[Mt]}get reason(){return this[Bt]}get wasClean(){return this[Nt]}};Object.defineProperty(q.prototype,"code",{enumerable:!0});Object.defineProperty(q.prototype,"reason",{enumerable:!0});Object.defineProperty(q.prototype,"wasClean",{enumerable:!0});var ee=class extends N{constructor(e,t={}){super(e),this[Tt]=t.error===void 0?null:t.error,this[Lt]=t.message===void 0?"":t.message}get error(){return this[Tt]}get message(){return this[Lt]}};Object.defineProperty(ee.prototype,"error",{enumerable:!0});Object.defineProperty(ee.prototype,"message",{enumerable:!0});var ae=class extends N{constructor(e,t={}){super(e),this[It]=t.data===void 0?null:t.data}get data(){return this[It]}};Object.defineProperty(ae.prototype,"data",{enumerable:!0});var Jr={addEventListener(n,e,t={}){for(let s of this.listeners(n))if(!t[oe]&&s[ze]===e&&!s[oe])return;let r;if(n==="message")r=function(i,o){let a=new ae("message",{data:o?i:i.toString()});a[Z]=this,_e(e,this,a)};else if(n==="close")r=function(i,o){let a=new q("close",{code:i,reason:o.toString(),wasClean:this._closeFrameReceived&&this._closeFrameSent});a[Z]=this,_e(e,this,a)};else if(n==="error")r=function(i){let o=new ee("error",{error:i,message:i.message});o[Z]=this,_e(e,this,o)};else if(n==="open")r=function(){let i=new N("open");i[Z]=this,_e(e,this,i)};else return;r[oe]=!!t[oe],r[ze]=e,t.once?this.once(n,r):this.on(n,r)},removeEventListener(n,e){for(let t of this.listeners(n))if(t[ze]===e&&!t[oe]){this.removeListener(n,t);break}}};Rt.exports={CloseEvent:q,ErrorEvent:ee,Event:N,EventTarget:Jr,MessageEvent:ae};function _e(n,e,t){typeof n=="object"&&n.handleEvent?n.handleEvent.call(n,t):n.call(e,t)}});var Ve=E((nn,Dt)=>{"use strict";var{tokenChars:le}=Q();function T(n,e,t){n[e]===void 0?n[e]=[t]:n[e].push(t)}function Qr(n){let e=Object.create(null),t=Object.create(null),r=!1,s=!1,i=!1,o,a,c=-1,h=-1,u=-1,d=0;for(;d<n.length;d++)if(h=n.charCodeAt(d),o===void 0)if(u===-1&&le[h]===1)c===-1&&(c=d);else if(d!==0&&(h===32||h===9))u===-1&&c!==-1&&(u=d);else if(h===59||h===44){if(c===-1)throw new SyntaxError(`Unexpected character at index ${d}`);u===-1&&(u=d);let b=n.slice(c,u);h===44?(T(e,b,t),t=Object.create(null)):o=b,c=u=-1}else throw new SyntaxError(`Unexpected character at index ${d}`);else if(a===void 0)if(u===-1&&le[h]===1)c===-1&&(c=d);else if(h===32||h===9)u===-1&&c!==-1&&(u=d);else if(h===59||h===44){if(c===-1)throw new SyntaxError(`Unexpected character at index ${d}`);u===-1&&(u=d),T(t,n.slice(c,u),!0),h===44&&(T(e,o,t),t=Object.create(null),o=void 0),c=u=-1}else if(h===61&&c!==-1&&u===-1)a=n.slice(c,d),c=u=-1;else throw new SyntaxError(`Unexpected character at index ${d}`);else if(s){if(le[h]!==1)throw new SyntaxError(`Unexpected character at index ${d}`);c===-1?c=d:r||(r=!0),s=!1}else if(i)if(le[h]===1)c===-1&&(c=d);else if(h===34&&c!==-1)i=!1,u=d;else if(h===92)s=!0;else throw new SyntaxError(`Unexpected character at index ${d}`);else if(h===34&&n.charCodeAt(d-1)===61)i=!0;else if(u===-1&&le[h]===1)c===-1&&(c=d);else if(c!==-1&&(h===32||h===9))u===-1&&(u=d);else if(h===59||h===44){if(c===-1)throw new SyntaxError(`Unexpected character at index ${d}`);u===-1&&(u=d);let b=n.slice(c,u);r&&(b=b.replace(/\\/g,""),r=!1),T(t,a,b),h===44&&(T(e,o,t),t=Object.create(null),o=void 0),a=void 0,c=u=-1}else throw new SyntaxError(`Unexpected character at index ${d}`);if(c===-1||i||h===32||h===9)throw new SyntaxError("Unexpected end of input");u===-1&&(u=d);let g=n.slice(c,u);return o===void 0?T(e,g,t):(a===void 0?T(t,g,!0):r?T(t,a,g.replace(/\\/g,"")):T(t,a,g),T(e,o,t)),e}function Yr(n){return Object.keys(n).map(e=>{let t=n[e];return Array.isArray(t)||(t=[t]),t.map(r=>[e].concat(Object.keys(r).map(s=>{let i=r[s];return Array.isArray(i)||(i=[i]),i.map(o=>o===!0?s:`${s}=${o}`).join("; ")})).join("; ")).join(", ")}).join(", ")}Dt.exports={format:Yr,parse:Qr}});var Ee=E((ln,Yt)=>{"use strict";var Xr=require("events"),Zr=require("https"),es=require("http"),qt=require("net"),ts=require("tls"),{randomBytes:rs,createHash:ss}=require("crypto"),{Duplex:on,Readable:an}=require("stream"),{URL:Ge}=require("url"),D=ie(),ns=Fe(),is=je(),{isBlob:os}=Q(),{BINARY_TYPES:Ft,CLOSE_TIMEOUT:as,EMPTY_BUFFER:Se,GUID:ls,kForOnEventAttribute:He,kListener:cs,kStatusCode:ds,kWebSocket:S,NOOP:jt}=B(),{EventTarget:{addEventListener:hs,removeEventListener:fs}}=At(),{format:us,parse:ps}=Ve(),{toBuffer:gs}=se(),zt=Symbol("kAborted"),Ke=[8,13],R=["CONNECTING","OPEN","CLOSING","CLOSED"],ms=/^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/,y=class n extends Xr{constructor(e,t,r){super(),this._binaryType=Ft[0],this._closeCode=1006,this._closeFrameReceived=!1,this._closeFrameSent=!1,this._closeMessage=Se,this._closeTimer=null,this._errorEmitted=!1,this._extensions={},this._paused=!1,this._protocol="",this._readyState=n.CONNECTING,this._receiver=null,this._sender=null,this._socket=null,e!==null?(this._bufferedAmount=0,this._isServer=!1,this._redirects=0,t===void 0?t=[]:Array.isArray(t)||(typeof t=="object"&&t!==null?(r=t,t=[]):t=[t]),Vt(this,e,t,r)):(this._autoPong=r.autoPong,this._closeTimeout=r.closeTimeout,this._isServer=!0)}get binaryType(){return this._binaryType}set binaryType(e){Ft.includes(e)&&(this._binaryType=e,this._receiver&&(this._receiver._binaryType=e))}get bufferedAmount(){return this._socket?this._socket._writableState.length+this._sender._bufferedBytes:this._bufferedAmount}get extensions(){return Object.keys(this._extensions).join()}get isPaused(){return this._paused}get onclose(){return null}get onerror(){return null}get onopen(){return null}get onmessage(){return null}get protocol(){return this._protocol}get readyState(){return this._readyState}get url(){return this._url}setSocket(e,t,r){let s=new ns({allowSynchronousEvents:r.allowSynchronousEvents,binaryType:this.binaryType,extensions:this._extensions,isServer:this._isServer,maxPayload:r.maxPayload,skipUTF8Validation:r.skipUTF8Validation}),i=new is(e,this._extensions,r.generateMask);this._receiver=s,this._sender=i,this._socket=e,s[S]=this,i[S]=this,e[S]=this,s.on("conclude",ys),s.on("drain",xs),s.on("error",_s),s.on("message",Ss),s.on("ping",ws),s.on("pong",ks),i.onerror=Es,e.setTimeout&&e.setTimeout(0),e.setNoDelay&&e.setNoDelay(),t.length>0&&e.unshift(t),e.on("close",Kt),e.on("data",ke),e.on("end",Jt),e.on("error",Qt),this._readyState=n.OPEN,this.emit("open")}emitClose(){if(!this._socket){this._readyState=n.CLOSED,this.emit("close",this._closeCode,this._closeMessage);return}this._extensions[D.extensionName]&&this._extensions[D.extensionName].cleanup(),this._receiver.removeAllListeners(),this._readyState=n.CLOSED,this.emit("close",this._closeCode,this._closeMessage)}close(e,t){if(this.readyState!==n.CLOSED){if(this.readyState===n.CONNECTING){C(this,this._req,"WebSocket was closed before the connection was established");return}if(this.readyState===n.CLOSING){this._closeFrameSent&&(this._closeFrameReceived||this._receiver._writableState.errorEmitted)&&this._socket.end();return}this._readyState=n.CLOSING,this._sender.close(e,t,!this._isServer,r=>{r||(this._closeFrameSent=!0,(this._closeFrameReceived||this._receiver._writableState.errorEmitted)&&this._socket.end())}),Ht(this)}}pause(){this.readyState===n.CONNECTING||this.readyState===n.CLOSED||(this._paused=!0,this._socket.pause())}ping(e,t,r){if(this.readyState===n.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof e=="function"?(r=e,e=t=void 0):typeof t=="function"&&(r=t,t=void 0),typeof e=="number"&&(e=e.toString()),this.readyState!==n.OPEN){Je(this,e,r);return}t===void 0&&(t=!this._isServer),this._sender.ping(e||Se,t,r)}pong(e,t,r){if(this.readyState===n.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof e=="function"?(r=e,e=t=void 0):typeof t=="function"&&(r=t,t=void 0),typeof e=="number"&&(e=e.toString()),this.readyState!==n.OPEN){Je(this,e,r);return}t===void 0&&(t=!this._isServer),this._sender.pong(e||Se,t,r)}resume(){this.readyState===n.CONNECTING||this.readyState===n.CLOSED||(this._paused=!1,this._receiver._writableState.needDrain||this._socket.resume())}send(e,t,r){if(this.readyState===n.CONNECTING)throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");if(typeof t=="function"&&(r=t,t={}),typeof e=="number"&&(e=e.toString()),this.readyState!==n.OPEN){Je(this,e,r);return}let s={binary:typeof e!="string",mask:!this._isServer,compress:!0,fin:!0,...t};this._extensions[D.extensionName]||(s.compress=!1),this._sender.send(e||Se,s,r)}terminate(){if(this.readyState!==n.CLOSED){if(this.readyState===n.CONNECTING){C(this,this._req,"WebSocket was closed before the connection was established");return}this._socket&&(this._readyState=n.CLOSING,this._socket.destroy())}}};Object.defineProperty(y,"CONNECTING",{enumerable:!0,value:R.indexOf("CONNECTING")});Object.defineProperty(y.prototype,"CONNECTING",{enumerable:!0,value:R.indexOf("CONNECTING")});Object.defineProperty(y,"OPEN",{enumerable:!0,value:R.indexOf("OPEN")});Object.defineProperty(y.prototype,"OPEN",{enumerable:!0,value:R.indexOf("OPEN")});Object.defineProperty(y,"CLOSING",{enumerable:!0,value:R.indexOf("CLOSING")});Object.defineProperty(y.prototype,"CLOSING",{enumerable:!0,value:R.indexOf("CLOSING")});Object.defineProperty(y,"CLOSED",{enumerable:!0,value:R.indexOf("CLOSED")});Object.defineProperty(y.prototype,"CLOSED",{enumerable:!0,value:R.indexOf("CLOSED")});["binaryType","bufferedAmount","extensions","isPaused","protocol","readyState","url"].forEach(n=>{Object.defineProperty(y.prototype,n,{enumerable:!0})});["open","error","close","message"].forEach(n=>{Object.defineProperty(y.prototype,`on${n}`,{enumerable:!0,get(){for(let e of this.listeners(n))if(e[He])return e[cs];return null},set(e){for(let t of this.listeners(n))if(t[He]){this.removeListener(n,t);break}typeof e=="function"&&this.addEventListener(n,e,{[He]:!0})}})});y.prototype.addEventListener=hs;y.prototype.removeEventListener=fs;Yt.exports=y;function Vt(n,e,t,r){let s={allowSynchronousEvents:!0,autoPong:!0,closeTimeout:as,protocolVersion:Ke[1],maxPayload:104857600,skipUTF8Validation:!1,perMessageDeflate:!0,followRedirects:!1,maxRedirects:10,...r,socketPath:void 0,hostname:void 0,protocol:void 0,timeout:void 0,method:"GET",host:void 0,path:void 0,port:void 0};if(n._autoPong=s.autoPong,n._closeTimeout=s.closeTimeout,!Ke.includes(s.protocolVersion))throw new RangeError(`Unsupported protocol version: ${s.protocolVersion} (supported versions: ${Ke.join(", ")})`);let i;if(e instanceof Ge)i=e;else try{i=new Ge(e)}catch{throw new SyntaxError(`Invalid URL: ${e}`)}i.protocol==="http:"?i.protocol="ws:":i.protocol==="https:"&&(i.protocol="wss:"),n._url=i.href;let o=i.protocol==="wss:",a=i.protocol==="ws+unix:",c;if(i.protocol!=="ws:"&&!o&&!a?c=`The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`:a&&!i.pathname?c="The URL's pathname is empty":i.hash&&(c="The URL contains a fragment identifier"),c){let l=new SyntaxError(c);if(n._redirects===0)throw l;we(n,l);return}let h=o?443:80,u=rs(16).toString("base64"),d=o?Zr.request:es.request,g=new Set,b;if(s.createConnection=s.createConnection||(o?bs:vs),s.defaultPort=s.defaultPort||h,s.port=i.port||h,s.host=i.hostname.startsWith("[")?i.hostname.slice(1,-1):i.hostname,s.headers={...s.headers,"Sec-WebSocket-Version":s.protocolVersion,"Sec-WebSocket-Key":u,Connection:"Upgrade",Upgrade:"websocket"},s.path=i.pathname+i.search,s.timeout=s.handshakeTimeout,s.perMessageDeflate&&(b=new D(s.perMessageDeflate!==!0?s.perMessageDeflate:{},!1,s.maxPayload),s.headers["Sec-WebSocket-Extensions"]=us({[D.extensionName]:b.offer()})),t.length){for(let l of t){if(typeof l!="string"||!ms.test(l)||g.has(l))throw new SyntaxError("An invalid or duplicated subprotocol was specified");g.add(l)}s.headers["Sec-WebSocket-Protocol"]=t.join(",")}if(s.origin&&(s.protocolVersion<13?s.headers["Sec-WebSocket-Origin"]=s.origin:s.headers.Origin=s.origin),(i.username||i.password)&&(s.auth=`${i.username}:${i.password}`),a){let l=s.path.split(":");s.socketPath=l[0],s.path=l[1]}let v;if(s.followRedirects){if(n._redirects===0){n._originalIpc=a,n._originalSecure=o,n._originalHostOrSocketPath=a?s.socketPath:i.host;let l=r&&r.headers;if(r={...r,headers:{}},l)for(let[f,m]of Object.entries(l))r.headers[f.toLowerCase()]=m}else if(n.listenerCount("redirect")===0){let l=a?n._originalIpc?s.socketPath===n._originalHostOrSocketPath:!1:n._originalIpc?!1:i.host===n._originalHostOrSocketPath;(!l||n._originalSecure&&!o)&&(delete s.headers.authorization,delete s.headers.cookie,l||delete s.headers.host,s.auth=void 0)}s.auth&&!r.headers.authorization&&(r.headers.authorization="Basic "+Buffer.from(s.auth).toString("base64")),v=n._req=d(s),n._redirects&&n.emit("redirect",n.url,v)}else v=n._req=d(s);s.timeout&&v.on("timeout",()=>{C(n,v,"Opening handshake has timed out")}),v.on("error",l=>{v===null||v[zt]||(v=n._req=null,we(n,l))}),v.on("response",l=>{let f=l.headers.location,m=l.statusCode;if(f&&s.followRedirects&&m>=300&&m<400){if(++n._redirects>s.maxRedirects){C(n,v,"Maximum redirects exceeded");return}v.abort();let k;try{k=new Ge(f,e)}catch{let H=new SyntaxError(`Invalid URL: ${f}`);we(n,H);return}Vt(n,k,t,r)}else n.emit("unexpected-response",v,l)||C(n,v,`Unexpected server response: ${l.statusCode}`)}),v.on("upgrade",(l,f,m)=>{if(n.emit("upgrade",l),n.readyState!==y.CONNECTING)return;v=n._req=null;let k=l.headers.upgrade;if(k===void 0||k.toLowerCase()!=="websocket"){C(n,f,"Invalid Upgrade header");return}let st=ss("sha1").update(u+ls).digest("base64");if(l.headers["sec-websocket-accept"]!==st){C(n,f,"Invalid Sec-WebSocket-Accept header");return}let H=l.headers["sec-websocket-protocol"],re;if(H!==void 0?g.size?g.has(H)||(re="Server sent an invalid subprotocol"):re="Server sent a subprotocol but none was requested":g.size&&(re="Server sent no subprotocol"),re){C(n,f,re);return}H&&(n._protocol=H);let nt=l.headers["sec-websocket-extensions"];if(nt!==void 0){if(!b){C(n,f,"Server sent a Sec-WebSocket-Extensions header but no extension was requested");return}let Pe;try{Pe=ps(nt)}catch{C(n,f,"Invalid Sec-WebSocket-Extensions header");return}let it=Object.keys(Pe);if(it.length!==1||it[0]!==D.extensionName){C(n,f,"Server indicated an extension that was not requested");return}try{b.accept(Pe[D.extensionName])}catch{C(n,f,"Invalid Sec-WebSocket-Extensions header");return}n._extensions[D.extensionName]=b}n.setSocket(f,m,{allowSynchronousEvents:s.allowSynchronousEvents,generateMask:s.generateMask,maxPayload:s.maxPayload,skipUTF8Validation:s.skipUTF8Validation})}),s.finishRequest?s.finishRequest(v,n):v.end()}function we(n,e){n._readyState=y.CLOSING,n._errorEmitted=!0,n.emit("error",e),n.emitClose()}function vs(n){return n.path=n.socketPath,qt.connect(n)}function bs(n){return n.path=void 0,!n.servername&&n.servername!==""&&(n.servername=qt.isIP(n.host)?"":n.host),ts.connect(n)}function C(n,e,t){n._readyState=y.CLOSING;let r=new Error(t);Error.captureStackTrace(r,C),e.setHeader?(e[zt]=!0,e.abort(),e.socket&&!e.socket.destroyed&&e.socket.destroy(),process.nextTick(we,n,r)):(e.destroy(r),e.once("error",n.emit.bind(n,"error")),e.once("close",n.emitClose.bind(n)))}function Je(n,e,t){if(e){let r=os(e)?e.size:gs(e).length;n._socket?n._sender._bufferedBytes+=r:n._bufferedAmount+=r}if(t){let r=new Error(`WebSocket is not open: readyState ${n.readyState} (${R[n.readyState]})`);process.nextTick(t,r)}}function ys(n,e){let t=this[S];t._closeFrameReceived=!0,t._closeMessage=e,t._closeCode=n,t._socket[S]!==void 0&&(t._socket.removeListener("data",ke),process.nextTick(Gt,t._socket),n===1005?t.close():t.close(n,e))}function xs(){let n=this[S];n.isPaused||n._socket.resume()}function _s(n){let e=this[S];e._socket[S]!==void 0&&(e._socket.removeListener("data",ke),process.nextTick(Gt,e._socket),e.close(n[ds])),e._errorEmitted||(e._errorEmitted=!0,e.emit("error",n))}function Wt(){this[S].emitClose()}function Ss(n,e){this[S].emit("message",n,e)}function ws(n){let e=this[S];e._autoPong&&e.pong(n,!this._isServer,jt),e.emit("ping",n)}function ks(n){this[S].emit("pong",n)}function Gt(n){n.resume()}function Es(n){let e=this[S];e.readyState!==y.CLOSED&&(e.readyState===y.OPEN&&(e._readyState=y.CLOSING,Ht(e)),this._socket.end(),e._errorEmitted||(e._errorEmitted=!0,e.emit("error",n)))}function Ht(n){n._closeTimer=setTimeout(n._socket.destroy.bind(n._socket),n._closeTimeout)}function Kt(){let n=this[S];if(this.removeListener("close",Kt),this.removeListener("data",ke),this.removeListener("end",Jt),n._readyState=y.CLOSING,!this._readableState.endEmitted&&!n._closeFrameReceived&&!n._receiver._writableState.errorEmitted&&this._readableState.length!==0){let e=this.read(this._readableState.length);n._receiver.write(e)}n._receiver.end(),this[S]=void 0,clearTimeout(n._closeTimer),n._receiver._writableState.finished||n._receiver._writableState.errorEmitted?n.emitClose():(n._receiver.on("error",Wt),n._receiver.on("finish",Wt))}function ke(n){this[S]._receiver.write(n)||this.pause()}function Jt(){let n=this[S];n._readyState=y.CLOSING,n._receiver.end(),this.end()}function Qt(){let n=this[S];this.removeListener("error",Qt),this.on("error",jt),n&&(n._readyState=y.CLOSING,this.destroy())}});var tr=E((dn,er)=>{"use strict";var cn=Ee(),{Duplex:Cs}=require("stream");function Xt(n){n.emit("close")}function $s(){!this.destroyed&&this._writableState.finished&&this.destroy()}function Zt(n){this.removeListener("error",Zt),this.destroy(),this.listenerCount("error")===0&&this.emit("error",n)}function Ps(n,e){let t=!0,r=new Cs({...e,autoDestroy:!1,emitClose:!1,objectMode:!1,writableObjectMode:!1});return n.on("message",function(i,o){let a=!o&&r._readableState.objectMode?i.toString():i;r.push(a)||n.pause()}),n.once("error",function(i){r.destroyed||(t=!1,r.destroy(i))}),n.once("close",function(){r.destroyed||r.push(null)}),r._destroy=function(s,i){if(n.readyState===n.CLOSED){i(s),process.nextTick(Xt,r);return}let o=!1;n.once("error",function(c){o=!0,i(c)}),n.once("close",function(){o||i(s),process.nextTick(Xt,r)}),t&&n.terminate()},r._final=function(s){if(n.readyState===n.CONNECTING){n.once("open",function(){r._final(s)});return}n._socket!==null&&(n._socket._writableState.finished?(s(),r._readableState.endEmitted&&r.destroy()):(n._socket.once("finish",function(){s()}),n.close()))},r._read=function(){n.isPaused&&n.resume()},r._write=function(s,i,o){if(n.readyState===n.CONNECTING){n.once("open",function(){r._write(s,i,o)});return}n.send(s,o)},r.on("end",$s),r.on("error",Zt),r}er.exports=Ps});var sr=E((hn,rr)=>{"use strict";var{tokenChars:Os}=Q();function Ms(n){let e=new Set,t=-1,r=-1,s=0;for(s;s<n.length;s++){let o=n.charCodeAt(s);if(r===-1&&Os[o]===1)t===-1&&(t=s);else if(s!==0&&(o===32||o===9))r===-1&&t!==-1&&(r=s);else if(o===44){if(t===-1)throw new SyntaxError(`Unexpected character at index ${s}`);r===-1&&(r=s);let a=n.slice(t,r);if(e.has(a))throw new SyntaxError(`The "${a}" subprotocol is duplicated`);e.add(a),t=r=-1}else throw new SyntaxError(`Unexpected character at index ${s}`)}if(t===-1||r!==-1)throw new SyntaxError("Unexpected end of input");let i=n.slice(t,s);if(e.has(i))throw new SyntaxError(`The "${i}" subprotocol is duplicated`);return e.add(i),e}rr.exports={parse:Ms}});var dr=E((un,cr)=>{"use strict";var Is=require("events"),Ce=require("http"),{Duplex:fn}=require("stream"),{createHash:Ts}=require("crypto"),nr=Ve(),j=ie(),Ls=sr(),Bs=Ee(),{CLOSE_TIMEOUT:Us,GUID:Ns,kWebSocket:Rs}=B(),As=/^[+/0-9A-Za-z]{22}==$/,ir=0,or=1,lr=2,Qe=class extends Is{constructor(e,t){if(super(),e={allowSynchronousEvents:!0,autoPong:!0,maxPayload:100*1024*1024,skipUTF8Validation:!1,perMessageDeflate:!1,handleProtocols:null,clientTracking:!0,closeTimeout:Us,verifyClient:null,noServer:!1,backlog:null,server:null,host:null,path:null,port:null,WebSocket:Bs,...e},e.port==null&&!e.server&&!e.noServer||e.port!=null&&(e.server||e.noServer)||e.server&&e.noServer)throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');if(e.port!=null?(this._server=Ce.createServer((r,s)=>{let i=Ce.STATUS_CODES[426];s.writeHead(426,{"Content-Length":i.length,"Content-Type":"text/plain"}),s.end(i)}),this._server.listen(e.port,e.host,e.backlog,t)):e.server&&(this._server=e.server),this._server){let r=this.emit.bind(this,"connection");this._removeListeners=Ds(this._server,{listening:this.emit.bind(this,"listening"),error:this.emit.bind(this,"error"),upgrade:(s,i,o)=>{this.handleUpgrade(s,i,o,r)}})}e.perMessageDeflate===!0&&(e.perMessageDeflate={}),e.clientTracking&&(this.clients=new Set,this._shouldEmitClose=!1),this.options=e,this._state=ir}address(){if(this.options.noServer)throw new Error('The server is operating in "noServer" mode');return this._server?this._server.address():null}close(e){if(this._state===lr){e&&this.once("close",()=>{e(new Error("The server is not running"))}),process.nextTick(ce,this);return}if(e&&this.once("close",e),this._state!==or)if(this._state=or,this.options.noServer||this.options.server)this._server&&(this._removeListeners(),this._removeListeners=this._server=null),this.clients?this.clients.size?this._shouldEmitClose=!0:process.nextTick(ce,this):process.nextTick(ce,this);else{let t=this._server;this._removeListeners(),this._removeListeners=this._server=null,t.close(()=>{ce(this)})}}shouldHandle(e){if(this.options.path){let t=e.url.indexOf("?");if((t!==-1?e.url.slice(0,t):e.url)!==this.options.path)return!1}return!0}handleUpgrade(e,t,r,s){t.on("error",ar);let i=e.headers["sec-websocket-key"],o=e.headers.upgrade,a=+e.headers["sec-websocket-version"];if(e.method!=="GET"){z(this,e,t,405,"Invalid HTTP method");return}if(o===void 0||o.toLowerCase()!=="websocket"){z(this,e,t,400,"Invalid Upgrade header");return}if(i===void 0||!As.test(i)){z(this,e,t,400,"Missing or invalid Sec-WebSocket-Key header");return}if(a!==13&&a!==8){z(this,e,t,400,"Missing or invalid Sec-WebSocket-Version header",{"Sec-WebSocket-Version":"13, 8"});return}if(!this.shouldHandle(e)){de(t,400);return}let c=e.headers["sec-websocket-protocol"],h=new Set;if(c!==void 0)try{h=Ls.parse(c)}catch{z(this,e,t,400,"Invalid Sec-WebSocket-Protocol header");return}let u=e.headers["sec-websocket-extensions"],d={};if(this.options.perMessageDeflate&&u!==void 0){let g=new j(this.options.perMessageDeflate,!0,this.options.maxPayload);try{let b=nr.parse(u);b[j.extensionName]&&(g.accept(b[j.extensionName]),d[j.extensionName]=g)}catch{z(this,e,t,400,"Invalid or unacceptable Sec-WebSocket-Extensions header");return}}if(this.options.verifyClient){let g={origin:e.headers[`${a===8?"sec-websocket-origin":"origin"}`],secure:!!(e.socket.authorized||e.socket.encrypted),req:e};if(this.options.verifyClient.length===2){this.options.verifyClient(g,(b,v,l,f)=>{if(!b)return de(t,v||401,l,f);this.completeUpgrade(d,i,h,e,t,r,s)});return}if(!this.options.verifyClient(g))return de(t,401)}this.completeUpgrade(d,i,h,e,t,r,s)}completeUpgrade(e,t,r,s,i,o,a){if(!i.readable||!i.writable)return i.destroy();if(i[Rs])throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");if(this._state>ir)return de(i,503);let h=["HTTP/1.1 101 Switching Protocols","Upgrade: websocket","Connection: Upgrade",`Sec-WebSocket-Accept: ${Ts("sha1").update(t+Ns).digest("base64")}`],u=new this.options.WebSocket(null,void 0,this.options);if(r.size){let d=this.options.handleProtocols?this.options.handleProtocols(r,s):r.values().next().value;d&&(h.push(`Sec-WebSocket-Protocol: ${d}`),u._protocol=d)}if(e[j.extensionName]){let d=e[j.extensionName].params,g=nr.format({[j.extensionName]:[d]});h.push(`Sec-WebSocket-Extensions: ${g}`),u._extensions=e}this.emit("headers",h,s),i.write(h.concat(`\r
`).join(`\r
`)),i.removeListener("error",ar),u.setSocket(i,o,{allowSynchronousEvents:this.options.allowSynchronousEvents,maxPayload:this.options.maxPayload,skipUTF8Validation:this.options.skipUTF8Validation}),this.clients&&(this.clients.add(u),u.on("close",()=>{this.clients.delete(u),this._shouldEmitClose&&!this.clients.size&&process.nextTick(ce,this)})),a(u,s)}};cr.exports=Qe;function Ds(n,e){for(let t of Object.keys(e))n.on(t,e[t]);return function(){for(let r of Object.keys(e))n.removeListener(r,e[r])}}function ce(n){n._state=lr,n.emit("close")}function ar(){this.destroy()}function de(n,e,t,r){t=t||Ce.STATUS_CODES[e],r={Connection:"close","Content-Type":"text/html","Content-Length":Buffer.byteLength(t),...r},n.once("finish",n.destroy),n.end(`HTTP/1.1 ${e} ${Ce.STATUS_CODES[e]}\r
`+Object.keys(r).map(s=>`${s}: ${r[s]}`).join(`\r
`)+`\r
\r
`+t)}function z(n,e,t,r,s,i){if(n.listenerCount("wsClientError")){let o=new Error(s);Error.captureStackTrace(o,z),n.emit("wsClientError",o,t,e)}else de(t,r,s,i)}});var Hs={};yr(Hs,{activate:()=>Vs,deactivate:()=>Gs});module.exports=xr(Hs);var M=$(require("vscode"));var p=$(require("vscode"));var Fs=$(tr(),1),Ws=$(Fe(),1),qs=$(je(),1),js=$(Ee(),1),Ye=$(dr(),1);var hr=$(require("http")),x=$(require("fs")),_=$(require("path")),w=$(require("os")),G=require("child_process");function te(n){return process.platform==="win32"&&n.startsWith("\\\\")}function fr(n){if(te(n)){try{(0,G.execSync)(`mkdir "${n}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4})}catch{}return}x.mkdirSync(n,{recursive:!0})}function L(n){if(te(n))try{return(0,G.execSync)(`dir /b "${n}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3}),!0}catch{return!1}return x.existsSync(n)}function V(n){if(te(n)){let e=_.join(w.tmpdir(),`bba-rd-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{(0,G.execSync)(`copy /Y "${n}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});let t=x.readFileSync(e,"utf-8");try{x.unlinkSync(e)}catch{}return t}catch(t){try{x.unlinkSync(e)}catch{}throw t}}return x.readFileSync(n,"utf-8")}function Ze(n,e){if(te(n)){let t=_.join(w.tmpdir(),`bba-wr-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{x.writeFileSync(t,e,"utf-8"),(0,G.execSync)(`copy /Y "${t}" "${n}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});try{x.unlinkSync(t)}catch{}}catch(r){try{x.unlinkSync(t)}catch{}throw r}return}x.writeFileSync(n,e)}function he(n){if(te(n)){try{(0,G.execSync)(`del /F /Q "${n}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3})}catch{}return}x.unlinkSync(n)}function Xe(n){if(te(n))try{return(0,G.execSync)(`dir /b "${n}"`,{shell:"cmd.exe",timeout:1e4}).toString("utf-8").split(/\r?\n/).filter(t=>t.trim().length>0)}catch{return[]}return x.readdirSync(n)}var et=class{syncPath="";serverKey="";backlogPollInterval=null;onBacklogResponse=null;recentBacklogEntries=[];onBacklogArrived=null;configure(e,t,r,s){this.syncPath=e,this.serverKey=t,this.onBacklogResponse=r,this.onBacklogArrived=s??null}get isConfigured(){return!!this.syncPath}get syncPathValue(){return this.syncPath}scanRegisteredClients(){if(!this.isConfigured)return[];let e=_.join(this.syncPath,"clients",this.serverKey);if(!L(e))return[];let t=[];try{let r=Xe(e).filter(s=>s.endsWith(".json"));for(let s of r)try{let i=JSON.parse(V(_.join(e,s)));i.clientKey&&i.clientLabel&&t.push(i)}catch{console.warn(`[ServerFallback] Skipping malformed presence file: ${s}`)}}catch(r){console.warn("[ServerFallback] Error scanning clients dir:",r)}return t}startPolling(){this.stopPolling(),this.isConfigured&&(this.backlogPollInterval=setInterval(()=>this.pollServerBacklog(),15e3),console.log(`[ServerFallback] Polling server-backlog from: ${this.syncPath}`))}stopPolling(){this.backlogPollInterval&&(clearInterval(this.backlogPollInterval),this.backlogPollInterval=null)}enqueueCommand(e,t,r,s,i){if(!this.isConfigured)throw new Error("Sync path is not configured. Set serverMonitor.syncPath in settings.");try{let o=_.join(this.syncPath,"queue");fr(o);let a=_.join(o,`${e}.json`),c=[];if(L(a))try{c=JSON.parse(V(a))}catch{c=[]}let h=i??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,u={id:h,clientKey:t,clientLabel:e,command:r,payload:s,timestamp:Date.now(),serverKey:this.serverKey};return c.push(u),Ze(a,JSON.stringify(c,null,2)),console.log(`[ServerFallback] Enqueued command "${r}" for ${e} \xE2\u2020\u2019 ${a}`),h}catch(o){throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${e}.json": ${o?.message||o}`)}}peekQueuedCommands(e){if(!this.isConfigured)return[];let t=_.join(this.syncPath,"queue",`${e}.json`);if(!L(t))return[];try{return JSON.parse(V(t))}catch{return[]}}listQueuedClients(){if(!this.isConfigured)return[];let e=_.join(this.syncPath,"queue");return L(e)?Xe(e).filter(t=>t.endsWith(".json")).map(t=>t.replace(/\.json$/,"")):[]}dequeueCommands(e){if(!this.isConfigured)return[];let t=_.join(this.syncPath,"queue",`${e}.json`);if(!L(t))return[];try{let r=JSON.parse(V(t));return he(t),console.log(`[ServerFallback] Dequeued ${r.length} command(s) for ${e}`),r}catch(r){return console.error(`[ServerFallback] Error reading queue for ${e}:`,r),[]}}pollServerBacklog(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=_.join(this.syncPath,"server-backlog");if(!L(e))return;let t=Xe(e).filter(s=>s.endsWith(".json")),r=[];for(let s of t){let i=_.join(e,s);try{let o=JSON.parse(V(i)),a=s.replace(/\.json$/,"");for(let c of o)console.log(`[ServerFallback] Got server-backlog entry from ${a}: ${c.command}`),r.push({...c,clientLabel:a}),this.onBacklogResponse(a,c);he(i)}catch(o){console.error(`[ServerFallback] Error reading backlog file ${s}:`,o)}}r.length>0&&(this.recentBacklogEntries.push(...r),this.onBacklogArrived&&this.onBacklogArrived(r))}catch(e){console.error("[ServerFallback] Backlog poll error:",e)}}getRecentBacklog(){return this.recentBacklogEntries}clearRecentBacklog(){this.recentBacklogEntries=[]}},$e=class n{wss=null;server=null;clients=new Map;provider=null;context=null;running=!1;port=54321;serverId="default";heartbeatCheckInterval=null;syncScanInterval=null;offlineTimeoutMs=3e5;fallback=new et;clientReleasePath="";serverPresenceInterval=null;version="1.0.0";configuredPort=54321;initialize(e){this.context=e,this.version=e.extension?.packageJSON?.version||"1.0.0";let t=p.workspace.getConfiguration("serverMonitor"),r=e.globalState.get("serverKey");this.serverId=r||t.get("serverId")||"default";let s=e.globalState.get("serverPort");this.configuredPort=s||t.get("port")||54321,this.port=this.configuredPort,console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`),this.loadPersistentClients(),this.setupFallback(),console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`)}setupFallback(){let e=p.workspace.getConfiguration("serverMonitor"),t=e.get("syncPath")||"";this.clientReleasePath=e.get("clientReleasePath")||"",t&&(this.fallback.configure(t,this.serverId,(r,s)=>{this.handleBacklogResponse(r,s)},r=>{let s=r.length;p.window.showInformationMessage(`${s} backlog result${s===1?"":"s"} received from offline clients`,"View Backlog").then(i=>{i==="View Backlog"&&this.showBacklogWebview()})}),this.fallback.startPolling(),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),6e4))}async changeServerKey(e){!e||!this.context||(this.removeServerPresenceFile(),this.serverId=e,await this.context.globalState.update("serverKey",e),this.running&&this.writeServerPresenceFile("online"),console.log(`[MonitorServer] Server key changed to: ${e}`),p.window.showInformationMessage(`Server key changed to: ${e}`),this.triggerUpdate())}async changePort(e){!e||e<1024||e>65535||!this.context||(this.configuredPort=e,await this.context.globalState.update("serverPort",e),console.log(`[MonitorServer] Port changed to: ${e}`),this.running?(p.window.showInformationMessage(`Port changed to ${e} \xE2\u20AC\u201D restarting server...`),this.stop(),await new Promise(t=>setTimeout(t,500)),await this.start()):(this.port=e,this.triggerUpdate(),p.window.showInformationMessage(`Port set to ${e} \xE2\u20AC\u201D will be used on next server start`)))}serverPresenceFilePath(){let e=this.fallback.syncPathValue;return _.join(e,"servers",`${this.serverId}-${w.hostname()}.json`)}writeServerPresenceFile(e){if(this.fallback.isConfigured)try{let t=_.join(this.fallback.syncPathValue,"servers");fr(t);let r=this.serverPresenceFilePath(),s=Date.now();if(e==="online"&&L(r))try{let c=JSON.parse(V(r));c.status==="online"&&(s=c.startedAt)}catch{}let i=Array.from(this.clients.values()).map(c=>({key:c.key,label:c.clientLabel,status:c.status})),o=w.hostname(),a={key:this.serverId,machine:o,port:this.port,username:w.userInfo().username,version:this.version,clients:i,startedAt:s,lastSeen:Date.now(),status:e};Ze(r,JSON.stringify(a,null,2)),console.log(`[MonitorServer] Server presence file written (${e}): ${r}`)}catch(t){console.warn(`[MonitorServer] Could not write server presence file: ${t?.message||t}`)}}removeServerPresenceFile(){if(this.fallback.isConfigured)try{let e=this.serverPresenceFilePath();L(e)&&(he(e),console.log(`[MonitorServer] Server presence file removed: ${e}`))}catch(e){console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message||e}`)}}showBacklogWebview(){let e=l=>String(l??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t=l=>`<span class="r-badge ${l?"ok":"err"}">${l?"&#10004; ok":"&#10006; err"}</span>`,r=l=>{try{return new Date(l).toLocaleString()}catch{return e(l)}},s=(l,f)=>`<span class="r-key">${e(l)}</span><span class="r-val">${f}</span>`,i=l=>{let f=l.agents||[],m='<div class="r-card"><div class="r-kv">';return m+=s("Status",t(!!l.success)),l.timeframe&&(m+=s("Timeframe",e(l.timeframe))),l.totalEntries!==void 0&&(m+=s("Total entries",`<strong>${e(l.totalEntries)}</strong>`)),l.dateRange?.earliest&&(m+=s("From",e(r(l.dateRange.earliest))),m+=s("To",e(r(l.dateRange.latest)))),m+="</div>",f.length>0?(m+='<table class="r-subtable"><thead><tr><th>Agent</th><th>Count</th><th>%</th></tr></thead><tbody>',f.forEach(k=>{m+=`<tr><td>${e(k.name)}</td><td>${e(k.count)}</td><td>${e(k.percentage)}%</td></tr>`}),m+="</tbody></table>"):m+='<span class="r-none">No agent data for this period.</span>',m+"</div>"},o=l=>{let f='<div class="r-card"><div class="r-kv">';return f+=s("Status",t(!!l.success)),l.installed!==void 0&&(f+=s("Installed",t(!!l.installed))),l.version&&(f+=s("Version",e(l.version))),l.active!==void 0&&(f+=s("Active",t(!!l.active))),l.message&&(f+=s("Message",e(l.message))),f+"</div></div>"},a=l=>{let f='<div class="r-card"><div class="r-kv">';return["hostname","username","os","platform","arch","cpu","memory","vscodeVersion","nodeVersion"].forEach(m=>{l[m]!==void 0&&(f+=s(m,e(l[m])))}),f+"</div></div>"},c=l=>{let f='<div class="r-card"><div class="r-kv">';l.name&&(f+=s("Name",e(l.name))),l.workspace&&(f+=s("Workspace",e(l.workspace)));let m=l.rootPaths||(l.rootPath?[l.rootPath]:[]);return m.length&&(f+=s("Root",e(m.join(", ")))),f+"</div></div>"},h=(l,f)=>{if(f==null)return'<span class="r-none">&mdash;</span>';if(typeof f!="object")return`<pre class="r-pre">${e(String(f))}</pre>`;if(l==="getUsageReport"||l==="generateReport")return i(f);if(l==="checkBBrainy"||l==="forceBBrainy"||l==="showBBrainyStatus")return o(f);if(l==="getSystemInfo")return a(f);if(l==="getWorkspace")return c(f);let m=JSON.stringify(f,null,2);return m.length<300?`<pre class="r-pre">${e(m)}</pre>`:`<details class="r-details"><summary>{ &hellip; } show JSON</summary><pre class="r-pre">${e(m)}</pre></details>`},u=this.fallback.getRecentBacklog(),d={};for(let l of u){let f=l.clientLabel||"unknown";d[f]||(d[f]=[]),d[f].push(l)}let g=p.window.createWebviewPanel("serverBacklog",`Server Backlog (${u.length})`,p.ViewColumn.Beside,{enableScripts:!0}),b=Object.entries(d).map(([l,f])=>{let m=f.map(k=>`<tr>
                <td class="cell time">${e(r(k.timestamp||Date.now()))}</td>
                <td class="cell cmd">${e(k.command||"")}</td>
                <td class="cell result-cell">${h(k.command||"",k.payload??k.result??null)}</td>
            </tr>`).join("");return`<div class="section"><h3>${e(l)}</h3>
            <table><colgroup><col class="col-time"><col class="col-cmd"><col class="col-result"></colgroup>
            <thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
            <tbody>${m}</tbody></table></div>`}).join(""),v=u.length;g.webview.html=['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>',":root{color-scheme:dark}","body{background:var(--vscode-editor-background,#1e1e2e);color:var(--vscode-foreground,#cdd6f4);","  font-family:var(--vscode-font-family,ui-sans-serif,system-ui,sans-serif);padding:24px;margin:0}","h2{margin:0 0 4px;font-size:1.1rem}","h3{color:var(--vscode-charts-green,#a6e3a1);font-size:.85rem;border-bottom:1px solid var(--vscode-panel-border,#313244);padding-bottom:6px;margin:0 0 8px}",".section{margin-bottom:28px}","table{width:100%;border-collapse:collapse;table-layout:fixed}","col.col-time{width:140px}col.col-cmd{width:160px}col.col-result{width:auto}","th{text-align:left;font-size:.7rem;color:var(--vscode-descriptionForeground,#6c7086);padding-bottom:6px;font-weight:600;text-transform:uppercase;border-bottom:1px solid var(--vscode-panel-border,#313244)}",".cell{padding:6px 8px 6px 0;vertical-align:top;font-size:.75rem;border-bottom:1px solid var(--vscode-panel-border,#252535)}",".time{color:var(--vscode-descriptionForeground,#a6adc8);white-space:nowrap}",".cmd{color:var(--vscode-textLink-foreground,#89b4fa);font-family:monospace;font-size:.75rem}",".result-cell{color:var(--vscode-foreground,#cdd6f4)}",".r-pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem;opacity:.85}",".toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}",".empty{color:var(--vscode-descriptionForeground,#6c7086);font-style:italic;margin-top:20px}","button{background:var(--vscode-button-secondaryBackground,#313244);border:1px solid var(--vscode-panel-border,#45475a);","  color:var(--vscode-button-secondaryForeground,#cdd6f4);padding:5px 14px;border-radius:4px;cursor:pointer;font-size:.8rem}","button:hover{background:var(--vscode-button-secondaryHoverBackground,#45475a)}",".r-card{background:var(--vscode-editor-inactiveSelectionBackground,#2a2a3e);border-radius:6px;padding:8px 10px;font-size:.73rem}",".r-kv{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin-bottom:6px}",".r-key{color:var(--vscode-descriptionForeground,#888);font-weight:600;white-space:nowrap}",".r-val{color:var(--vscode-foreground,#cdd6f4);word-break:break-word}",".r-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:.68rem;font-weight:700}",".r-badge.ok{background:rgba(166,227,161,.15);color:var(--vscode-charts-green,#a6e3a1)}",".r-badge.err{background:rgba(241,76,76,.15);color:var(--vscode-charts-red,#f38ba8)}",".r-subtable{width:100%;border-collapse:collapse;margin-top:6px}",".r-subtable th{font-size:.66rem;color:var(--vscode-descriptionForeground,#888);border-bottom:1px solid var(--vscode-panel-border,#313244);padding:2px 6px 3px 0}",".r-subtable td{font-size:.7rem;padding:2px 6px 2px 0;border-bottom:1px solid var(--vscode-panel-border,#25253a)}",".r-none{opacity:.4}",".r-details summary{font-size:.65rem;color:var(--vscode-textLink-foreground,#89b4fa);cursor:pointer;user-select:none;padding:2px 0}",".r-details .r-pre{margin-top:4px}","</style></head><body>",`<div class="toolbar"><h2>Server Backlog &mdash; ${v} result${v===1?"":"s"}</h2>`,'<button onclick="clearAll()">Clear All</button></div>',v===0?'<p class="empty">No backlog entries.</p>':b,"<script>","const vscode=acquireVsCodeApi();",'function clearAll(){vscode.postMessage({action:"clearBacklog"});}',"</script></body></html>"].join(`
`),g.webview.onDidReceiveMessage(l=>{l.action==="clearBacklog"&&(this.fallback.clearRecentBacklog(),g.dispose(),this.triggerUpdate())})}handleBacklogResponse(e,t){let r=Array.from(this.clients.values()).find(i=>i.clientLabel===e);if(!r){console.warn(`[MonitorServer] Backlog response for unknown clientLabel: ${e}`);return}let s=r.commandLog.find(i=>i.id===t.id);s?(s.status="executed",s.result=t.payload):r.commandLog.push({id:t.id,command:t.command,status:"executed",timestamp:t.timestamp,result:t.payload}),t.command==="checkBBrainy"&&t.payload&&(r.info||(r.info={}),r.info.bbrainyStatus=t.payload),console.log(`[MonitorServer] Processed server-backlog entry for ${e}: ${t.command}`),this.triggerUpdate()}importSyncClients(){let e=this.fallback.scanRegisteredClients();if(e.length===0)return;let t=2*60*60*1e3,r=i=>i.status==="inactive"&&Date.now()-i.lastSeen<t?"active":i.status??"active",s=0;for(let i of e){if(this.clients.has(i.clientKey)){let o=this.clients.get(i.clientKey);o.status!=="online"&&(o.extensionStatus=r(i));continue}this.clients.set(i.clientKey,{key:i.clientKey,ws:null,info:{username:i.username,hostname:i.hostname},lastSeen:i.lastSeen,status:"offline",clientLabel:i.clientLabel,commandLog:[],extensionStatus:r(i)}),console.log(`[MonitorServer] Discovered new client via presence file: ${i.clientLabel} (${i.clientKey})`),s++}s>0&&(this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Imported ${s} new client(s) from sync folder`))}loadPersistentClients(){if(!this.context||!this.serverId){console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let t=(this.context.globalState.get("persistentAssets")||{})[this.serverId]||[];console.log(`[MonitorServer] Loading ${t.length} persistent clients for serverId: ${this.serverId}`),t.forEach(r=>{this.clients.set(r.key,{...r,ws:null,status:"offline",clientLabel:r.clientLabel||`${r.info?.username||"unknown"}-${r.info?.hostname||"unknown"}`,commandLog:[]})})}restorePendingQueueToLog(){if(!this.fallback.isConfigured)return;let e=this.fallback.listQueuedClients();for(let t of e){let r=Array.from(this.clients.values()).find(i=>i.clientLabel===t);if(!r)continue;let s=this.fallback.peekQueuedCommands(t);for(let i of s)r.commandLog.find(o=>o.id===i.id)||r.commandLog.push({id:i.id,command:i.command,status:"queued",timestamp:i.timestamp});console.log(`[MonitorServer] Restored ${s.length} pending queued command(s) to log for ${t}`)}}deduplicateClients(){let e=new Set,t=[];for(let[r,s]of this.clients){let i=`${s.info?.hostname}:${s.info?.username}`;e.has(i)?(t.push(r),console.log(`[MonitorServer] Found duplicate client: ${r} (${s.info?.username}@${s.info?.hostname})`)):e.add(i)}t.forEach(r=>this.clients.delete(r)),t.length>0&&(this.savePersistentClients(),console.log(`[MonitorServer] Removed ${t.length} duplicate client entries`),p.window.showInformationMessage(`Cleaned up ${t.length} duplicate clients on startup`))}savePersistentClients(){if(!this.context||!this.serverId){console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let e=this.context.globalState.get("persistentAssets")||{};e[this.serverId]=Array.from(this.clients.values()).map(t=>({key:t.key,info:t.info,lastSeen:t.lastSeen,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100)})),this.context.globalState.update("persistentAssets",e),console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`)}setProvider(e){this.provider=e}async start(){if(this.running){console.warn("[MonitorServer] Already running, ignoring start request");return}if(!this.context){console.error("[MonitorServer] Cannot start: context not initialized"),p.window.showErrorMessage("Server not initialized with Context");return}let e=p.workspace.getConfiguration("serverMonitor"),r=this.context.globalState.get("serverPort")||this.configuredPort||e.get("port")||54321,s=this.context.globalState.get("serverKey");this.serverId=s||e.get("serverId")||"default",console.log(`[MonitorServer] Starting server with serverId: ${this.serverId} on port: ${r}`),this.clients.clear(),this.loadPersistentClients(),this.deduplicateClients(),this.setupFallback(),this.importSyncClients(),this.restorePendingQueueToLog(),this.server=hr.createServer(),this.wss=new Ye.default({server:this.server}),this.wss.on("connection",i=>{console.log("[MonitorServer] New WebSocket connection established"),i.on("message",o=>this.handleClientMessage(i,o)),i.on("close",()=>this.handleClientDisconnect(i)),i.on("error",o=>{console.error(`[MonitorServer] WebSocket error: ${o.message}`)})}),this.listenWithRetry(r)}startHeartbeatCheck(){this.heartbeatCheckInterval&&clearInterval(this.heartbeatCheckInterval),this.heartbeatCheckInterval=setInterval(()=>{this.checkHeartbeats()},3e4)}listenWithRetry(e,t=0){if(t>=10){console.error(`[MonitorServer] Failed to start: Ports ${e-10} to ${e-1} are busy`),p.window.showErrorMessage(`Failed to start server: Ports ${e-10} to ${e-1} are busy.`);return}this.server?.listen(e,()=>{this.port=e,this.running=!0,this.startHeartbeatCheck(),this.writeServerPresenceFile("online"),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),3e4),this.triggerUpdate(),console.log(`[MonitorServer] \xE2\u0153\u2026 Server started successfully on port ${this.port}`),p.window.showInformationMessage(`Monitor server [${this.serverId}] running on port ${this.port}`)}).on("error",r=>{r.code==="EADDRINUSE"?(console.log(`[MonitorServer] Port ${e} is in use, trying ${e+1}...`),this.listenWithRetry(e+1,t+1)):(console.error(`[MonitorServer] Server error: ${r.message}`),p.window.showErrorMessage(`Server error: ${r.message}`))})}stop(){if(!this.running){console.warn("[MonitorServer] Not running, ignoring stop request");return}console.log("[MonitorServer] Stopping server"),this.heartbeatCheckInterval&&(clearInterval(this.heartbeatCheckInterval),this.heartbeatCheckInterval=null),this.syncScanInterval&&(clearInterval(this.syncScanInterval),this.syncScanInterval=null),this.writeServerPresenceFile("offline"),this.serverPresenceInterval&&(clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=null),this.fallback.stopPolling(),this.wss?.close(),this.server?.close(),this.wss=null,this.server=null,this.running=!1;for(let e of this.clients.values())e.status="offline",e.ws=null;this.triggerUpdate(),console.log("[MonitorServer] \xE2\u0153\u2026 Server stopped"),p.window.showInformationMessage("Monitor server stopped")}handleClientMessage(e,t){let r;try{r=JSON.parse(t.toString())}catch(i){console.error("[MonitorServer] Failed to parse message:",i);return}console.log(`[MonitorServer] Received message type: ${r.type} from client: ${r.clientKey}`);let s=r.serverKey||r.serverId;if(r.type==="register"){if(s!==this.serverId){console.warn(`[MonitorServer] Client ${r.clientKey} attempted to register with wrong Server Key: ${s} (expected: ${this.serverId})`),e.send(JSON.stringify({type:"error",message:"Invalid Server Key"}));return}this.registerClient(e,r)}else r.type==="response"?(console.log(`[MonitorServer] Response from ${r.clientKey} for command: ${r.command}`),this.handleResponse(r)):r.type==="heartbeat"?(console.debug(`[MonitorServer] Heartbeat from ${r.clientKey}`),this.updateHeartbeat(r.clientKey)):console.warn(`[MonitorServer] Unknown message type: ${r.type} from ${r.clientKey}`);this.triggerUpdate()}registerClient(e,t){let r=`${t.payload?.username||"unknown"}-${t.payload?.hostname||"unknown"}`,s=this.clients.get(t.clientKey);if(s)console.log(`[MonitorServer] Updating existing client: ${t.clientKey} (${r})`),s.ws=e,s.status="online",s.info=t.payload,s.lastSeen=Date.now(),s.clientLabel=r,s.extensionStatus="active";else{console.log(`[MonitorServer] Registering new client: ${t.clientKey} (${r})`);let i={key:t.clientKey,ws:e,info:t.payload,lastSeen:Date.now(),status:"online",clientLabel:r,commandLog:[]};this.clients.set(t.clientKey,i)}this.savePersistentClients(),console.log(`[MonitorServer] Total clients: ${this.clients.size}`),p.window.showInformationMessage(`Client registered: ${t.payload?.username}@${t.payload?.hostname}`),this.dequeueAndSend(t.clientKey,r)}async dequeueAndSend(e,t){if(!this.fallback.isConfigured)return;let r=this.fallback.dequeueCommands(t);if(r.length===0)return;let s=this.clients.get(e);if(s){console.log(`[MonitorServer] Delivering ${r.length} queued command(s) to ${t} via WebSocket`),p.window.showInformationMessage(`Client ${t} is back online \xE2\u20AC\u201D delivering ${r.length} queued command(s)`);for(let i of r){let o=s.commandLog.find(a=>a.id===i.id);o&&(o.status="sent"),s.ws?.readyState===1&&(s.ws.send(JSON.stringify({command:i.command,payload:i.payload,timestamp:Date.now(),queuedCommandId:i.id})),console.log(`[MonitorServer] Delivered queued command "${i.command}" (${i.id}) to ${t}`)),await new Promise(a=>setTimeout(a,100))}this.triggerUpdate()}}handleClientDisconnect(e){let t=null;for(let[r,s]of this.clients)if(s.ws===e){s.status="offline",s.ws=null,t=r,console.log(`[MonitorServer] Client disconnected: ${r} (${s.info?.username}@${s.info?.hostname})`),this.triggerUpdate();break}t||console.warn("[MonitorServer] Disconnect event received but no matching client found")}updateHeartbeat(e){let t=this.clients.get(e);t?(t.lastSeen=Date.now(),t.status="online",this.savePersistentClients(),console.debug(`[MonitorServer] Updated heartbeat for ${e}`)):console.warn(`[MonitorServer] Heartbeat from unknown client: ${e}`)}checkHeartbeats(){let e=Date.now(),t=[];for(let[r,s]of this.clients)s.status==="online"&&e-s.lastSeen>9e4?(s.status="offline",s.ws=null,console.log(`[MonitorServer] Client marked offline due to missed heartbeat: ${r} (${s.info?.username}@${s.info?.hostname})`)):s.status==="offline"&&e-s.lastSeen>this.offlineTimeoutMs&&(t.push(r),console.log(`[MonitorServer] Removing stale offline client: ${r} (${s.info?.username}@${s.info?.hostname})`));t.forEach(r=>this.clients.delete(r)),t.length>0&&(console.log(`[MonitorServer] Removed ${t.length} stale client(s)`),this.savePersistentClients(),this.triggerUpdate())}handleResponse(e){let t=this.clients.get(e.clientKey);if(t){if(t.lastResponse={command:e.command||"unknown",data:e.payload,timestamp:Date.now()},console.log(`[MonitorServer] Stored response for ${e.clientKey} (${e.command})`,{success:e.payload?.success,totalEntries:e.payload?.totalEntries,agents:e.payload?.agents?.length}),e.queuedCommandId){let r=t.commandLog.find(s=>s.id===e.queuedCommandId);r&&(r.status="executed",r.result=e.payload)}e.command==="checkBBrainy"&&e.payload&&(t.info||(t.info={}),t.info.bbrainyStatus=e.payload),e.command==="getUsageReport"&&e.payload?.success&&e.payload?.agents&&this.showUsageReportWebview(e.payload,t.info?.username,t.info?.hostname),this.triggerUpdate()}else console.warn(`[MonitorServer] Response from unknown client: ${e.clientKey}`)}showUsageReportWebview(e,t="Unknown",r="Unknown"){try{let s={labels:e.agents.map(o=>o.name),datasets:[{label:"Usage Count",data:e.agents.map(o=>o.count),backgroundColor:["rgba(59, 130, 246, 0.2)","rgba(16, 185, 129, 0.2)","rgba(168, 85, 247, 0.2)","rgba(251, 146, 60, 0.2)","rgba(244, 63, 94, 0.2)","rgba(236, 72, 153, 0.2)"],borderColor:["rgba(59, 130, 246, 1)","rgba(16, 185, 129, 1)","rgba(168, 85, 247, 1)","rgba(251, 146, 60, 1)","rgba(244, 63, 94, 1)","rgba(236, 72, 153, 1)"],borderWidth:2}]},i=p.window.createWebviewPanel("bbrainyUsageReport",`BBrainy Usage: ${e.timeframe}`,p.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});i.webview.html=this.getUsageReportHtml(e,s,t,r),console.log(`[MonitorServer] Opened usage report webview for ${t}@${r}: ${e.timeframe}`)}catch(s){console.error("[MonitorServer] Failed to show usage report:",s),p.window.showErrorMessage(`Failed to show usage report: ${s}`)}}getUsageReportHtml(e,t,r,s){let i=e.agents.map(o=>`<tr>
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
                        <h1>&#127919; BBrainy Usage Report</h1>
                        <div class="client-info">&#128205; Client: <strong>${r}@${s}</strong></div>
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
        `}static NO_QUEUE_COMMANDS=new Set(["checkBBrainy","forceBBrainy","getWorkspace","getSystemInfo","showBBrainyStatus"]);async sendCommand(e,t,r){let s=this.clients.get(e);if(!s){console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${e}`),p.window.showErrorMessage("Client not found");return}if(s.status==="offline"){if(n.NO_QUEUE_COMMANDS.has(t)){p.window.showWarningMessage(`"${t}" requires an active connection \xE2\u20AC\u201D ${s.clientLabel} is currently offline.`);return}let i=`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,o={id:i,command:t,status:"queued",timestamp:Date.now()};if(s.commandLog.push(o),this.triggerUpdate(),!this.fallback.isConfigured){o.status="error";let c=`Client offline \xE2\u20AC\u201D sync path not configured. Current value: "${p.workspace.getConfiguration("serverMonitor").get("syncPath")||"(empty)"}". Set serverMonitor.syncPath in settings.`;console.error(`[MonitorServer] ${c}`),p.window.showErrorMessage(c),this.savePersistentClients(),this.triggerUpdate();return}try{this.fallback.enqueueCommand(s.clientLabel,e,t,r,i),this.savePersistentClients(),this.triggerUpdate();let a=`Queued "${t}" for ${s.clientLabel} \xE2\u2020\u2019 ${this.fallback.syncPathValue}\\queue\\${s.clientLabel}.json`;console.log(`[MonitorServer] ${a}`),p.window.showInformationMessage(a)}catch(a){o.status="error";let c=`Failed to queue command: ${a?.message||a}`;console.error(`[MonitorServer] ${c}`),p.window.showErrorMessage(c),this.savePersistentClients(),this.triggerUpdate()}return}console.log(`[MonitorServer] Sending command to ${e}: ${t}`,r||"{}"),s.ws.send(JSON.stringify({command:t,payload:r,timestamp:Date.now()})),console.log(`[MonitorServer] Command sent successfully to ${e}`)}clearClientQueue(e){let t=this.clients.get(e);if(t){if(this.fallback.isConfigured)try{let r=_.join(this.fallback.syncPathValue,"queue",`${t.clientLabel}.json`);L(r)&&he(r)}catch(r){console.error("[MonitorServer] clearClientQueue: failed to delete queue file",r)}t.commandLog=[],this.savePersistentClients(),this.triggerUpdate()}}clearBacklog(){this.fallback.clearRecentBacklog(),this.triggerUpdate()}cancelQueueEntry(e,t){let r=this.clients.get(e);if(r){if(this.fallback.isConfigured)try{let s=_.join(this.fallback.syncPathValue,"queue",`${r.clientLabel}.json`);if(L(s)){let o=JSON.parse(V(s)).filter(a=>a.id!==t);o.length===0?he(s):Ze(s,JSON.stringify(o,null,2))}}catch(s){console.error("[MonitorServer] cancelQueueEntry: failed to update queue file",s)}r.commandLog=r.commandLog.filter(s=>s.id!==t),this.savePersistentClients(),this.triggerUpdate()}}async queryAllClients(e){console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${e}`);let t=Array.from(this.clients.keys()).map(r=>this.sendCommand(r,e));await Promise.all(t),console.log(`[MonitorServer] Broadcast complete for command: ${e}`)}getAllClientsInfo(){return Array.from(this.clients.values()).map(e=>({key:e.key,username:e.info?.username||"Unknown",hostname:e.info?.hostname||"Unknown",workspace:e.info?.workspace,bbrainyActive:e.info?.bbrainyStatus?.active||!1,status:e.status,lastSeen:e.lastSeen,onlineStatus:e.status==="online"?"online":"offline"}))}showAllAssetsWebview(){let e=this.getAllClientsInfo(),t=p.window.createWebviewPanel("allAssets","All Assets",p.ViewColumn.One,{enableScripts:!0});t.webview.html=this.getAllAssetsHtml(e)}getAllAssetsHtml(e){let t=e.map(r=>`
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${r.onlineStatus==="online"?"#34d399":"#ef4444"};"></span>
                    ${r.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.bbrainyActive?"&#10003; Active":"&#10007; Inactive"}</td>
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
                    <h1>&#128202; All Assets (${e.length} Total)</h1>
                    
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
        `}showBBrainyStatusWebview(e){let t=this.clients.get(e);if(!t){p.window.showErrorMessage(`Client ${e} not found`);return}let r=t.info?.bbrainyStatus||{installed:!1,active:!1,version:"Unknown",lastUsedTime:"Never",totalUsage:0},s=p.window.createWebviewPanel(`bbrainyStatus-${e}`,`BBrainy Status - ${t.info?.username}@${t.info?.hostname}`,p.ViewColumn.One,{enableScripts:!0});s.webview.html=this.getBBrainyStatusHtml(r,t.info?.username,t.info?.hostname)}getBBrainyStatusHtml(e,t="Unknown",r="Unknown"){let s=e.installed,i=e.active,o=e.version||"Unknown",a=e.lastUsedTime||"Never",c=e.totalUsage||0,h=s?i?"#34d399":"#f59e0b":"#ef4444";return`
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
                        background-color: ${h}20;
                        color: ${h};
                        border: 2px solid ${h};
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
                        <div class="client-name">&#128241; ${t}@${r}</div>
                        <h1>&#129504; BBrainy Status</h1>
                        <div class="status-badge">${s?i?"Active":"Installed - Inactive":"Not Installed"}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${s?"&#10003; Yes":"&#10007; No"}</div>
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
                            <div class="stat-value">${c}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">&#128202; Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length:84},(d,g)=>`<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random()*.5});"></div>`).join("")}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `}async generateReport(){let e=new Date,t=Array.from(this.clients.values()),r=t.filter(d=>d.status==="online"),s=t.filter(d=>d.status==="offline"),i=t.filter(d=>d.extensionStatus==="inactive"),o={generatedAt:e.toISOString(),server:{key:this.serverId,machine:w.hostname(),username:w.userInfo().username,version:this.version,port:this.port,configuredPort:this.configuredPort,running:this.running,syncPath:this.fallback.syncPathValue||"(not configured)"},summary:{total:t.length,online:r.length,offline:s.length,inactive:i.length},clients:t.map(d=>({label:d.clientLabel,key:d.key,username:d.info?.username,hostname:d.info?.hostname,workspace:d.info?.workspace,version:d.info?.version,bbrainyActive:d.info?.bbrainyStatus?.active,status:d.status,extensionStatus:d.extensionStatus??"active",lastSeen:new Date(d.lastSeen).toISOString(),pendingCommands:d.commandLog.filter(g=>g.status==="queued"||g.status==="sent").length,lastCommand:d.commandLog.length>0?d.commandLog[d.commandLog.length-1]?.command:null}))},a=JSON.stringify(o,null,2),c={online:"#22c55e",offline:"#94a3b8",active:"#22c55e",inactive:"#f97316"},h=t.map(d=>{let g=d.commandLog.filter(v=>v.status==="queued"||v.status==="sent").length,b=d.info?.bbrainyStatus?.active?"#22c55e":"#475569";return`<tr>
                <td><span class="label">${d.clientLabel}</span></td>
                <td>${d.info?.username||"\xE2\u20AC\u201D"}</td>
                <td>${d.info?.hostname||"\xE2\u20AC\u201D"}</td>
                <td>${d.info?.version||"\xE2\u20AC\u201D"}</td>
                <td><span class="badge" style="color:${c[d.status]||"#94a3b8"}">${d.status}</span></td>
                <td><span class="badge" style="color:${c[d.extensionStatus??"active"]||"#94a3b8"}">${d.extensionStatus??"active"}</span></td>
                <td><span style="color:${b};font-size:18px">\xE2\u2014\x8F</span></td>
                <td>${g>0?`<span class="badge-warn">${g} pending</span>`:'<span class="badge-ok">0</span>'}</td>
                <td>${new Date(d.lastSeen).toLocaleString()}</td>
            </tr>`}).join(""),u=p.window.createWebviewPanel("serverReport",`Server Report \xE2\u20AC\u201D ${this.serverId}`,p.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});u.webview.onDidReceiveMessage(d=>{d.action==="exportJson"&&p.window.showSaveDialog({defaultUri:p.Uri.file(_.join(w.homedir(),`server-report-${this.serverId}-${Date.now()}.json`)),filters:{JSON:["json"]},title:"Save Server Report"}).then(g=>{if(g)try{x.writeFileSync(g.fsPath,a,"utf-8"),p.window.showInformationMessage(`Report saved to ${g.fsPath}`)}catch(b){p.window.showErrorMessage(`Failed to save: ${b}`)}})}),u.webview.html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Server Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#e2e8f0;padding:28px;min-height:100vh}
.container{max-width:1100px;margin:0 auto}
h1{font-size:24px;font-weight:700;margin-bottom:4px;background:linear-gradient(135deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.subtitle{font-size:12px;color:#64748b;margin-bottom:24px}
.section{margin-bottom:28px}
h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#60a5fa;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid rgba(59,130,246,0.2)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px}
.card{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:14px}
.card-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:4px}
.card-value{font-size:20px;font-weight:700;color:#60a5fa}
.card-value.green{color:#22c55e}.card-value.red{color:#f87171}.card-value.orange{color:#f97316}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px}
.info-row{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.info-key{color:#64748b;min-width:110px;flex-shrink:0}
.info-val{color:#cbd5e1;word-break:break-all}
table{width:100%;border-collapse:collapse;background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.15);border-radius:10px;overflow:hidden;font-size:12px}
thead{background:rgba(15,23,42,0.6)}
th{padding:9px 12px;text-align:left;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
td{padding:8px 12px;border-top:1px solid rgba(59,130,246,0.08);color:#cbd5e1;vertical-align:middle}
.label{color:#34d399;font-weight:600}
.badge{font-weight:600;font-size:11px}
.badge-warn{color:#fbbf24;font-weight:600}
.badge-ok{color:#475569}
.export-btn{display:inline-flex;align-items:center;gap:6px;margin-top:20px;padding:8px 18px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;color:#60a5fa;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.2s}
.export-btn:hover{background:rgba(59,130,246,0.3)}
</style>
</head>
<body>
<div class="container">
  <h1>&#128202; Server Monitor Report</h1>
  <div class="subtitle">Generated: ${e.toLocaleString()} &nbsp;|&nbsp; Server: <strong>${this.serverId}</strong> on <strong>${w.hostname()}</strong></div>

  <div class="section">
    <h2>Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${t.length}</div></div>
      <div class="card"><div class="card-label">Online</div><div class="card-value green">${r.length}</div></div>
      <div class="card"><div class="card-label">Offline</div><div class="card-value red">${s.length}</div></div>
      <div class="card"><div class="card-label">Uninstalled</div><div class="card-value orange">${i.length}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Server Info</h2>
    <div class="info-grid">
      <div><div class="info-row"><span class="info-key">Server Key</span><span class="info-val">${this.serverId}</span></div>
           <div class="info-row"><span class="info-key">Machine</span><span class="info-val">${w.hostname()}</span></div>
           <div class="info-row"><span class="info-key">Username</span><span class="info-val">${w.userInfo().username}</span></div>
           <div class="info-row"><span class="info-key">Version</span><span class="info-val">${this.version}</span></div></div>
      <div><div class="info-row"><span class="info-key">Active Port</span><span class="info-val">${this.running?this.port:"(stopped)"}</span></div>
           <div class="info-row"><span class="info-key">Configured Port</span><span class="info-val">${this.configuredPort}</span></div>
           <div class="info-row"><span class="info-key">Status</span><span class="info-val" style="color:${this.running?"#22c55e":"#f87171"}">${this.running?"Running":"Stopped"}</span></div>
           <div class="info-row"><span class="info-key">Sync Path</span><span class="info-val">${this.fallback.syncPathValue||"(not configured)"}</span></div></div>
    </div>
  </div>

  <div class="section">
    <h2>Clients (${t.length})</h2>
    <table>
      <thead><tr>
        <th>Label</th><th>User</th><th>Host</th><th>Version</th>
        <th>WS Status</th><th>Ext Status</th><th>BBrainy</th><th>Queue</th><th>Last Seen</th>
      </tr></thead>
      <tbody>${h||'<tr><td colspan="9" style="text-align:center;color:#475569;padding:20px">No clients registered</td></tr>'}</tbody>
    </table>
  </div>

  <button class="export-btn" onclick="vscode.postMessage({action:'exportJson'})">&#11015; Export as JSON</button>
</div>
<script>const vscode=acquireVsCodeApi();</script>
</body>
</html>`}async publishClientUpdate(){let e=await p.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"VSIX Extension":["vsix"]},title:"Select client extension VSIX to publish"});if(e&&e[0])if(this.clientReleasePath)try{let t=_.join(this.clientReleasePath,"updates");x.mkdirSync(t,{recursive:!0});let r=_.basename(e[0].fsPath);x.copyFileSync(e[0].fsPath,_.join(t,r)),console.log(`[MonitorServer] Published update to client-release: ${r}`),p.window.showInformationMessage(`Update published: ${r}`)}catch(t){console.error("[MonitorServer] Failed to publish update:",t),p.window.showErrorMessage(`Failed to publish update: ${t}`)}else p.window.showErrorMessage("Client release path not configured. Set serverMonitor.clientReleasePath first.")}getLocalIpv4(){let e=w.networkInterfaces();for(let t of Object.keys(e))for(let r of e[t]??[])if(r.family==="IPv4"&&!r.internal)return r.address;return"localhost"}triggerUpdate(){if(this.provider){let e=Array.from(this.clients.values()),t=this.getLocalIpv4();this.provider.update({serverStatus:{running:this.running,port:this.port,serverId:this.serverId},serverUrl:this.running?`ws://${t}:${this.port}`:null,total:this.clients.size,online:e.filter(r=>r.status==="online").length,offline:e.filter(r=>r.status==="offline").length,clients:e.map(r=>({key:r.key,hostname:r.info?.hostname,username:r.info?.username,workspace:r.info?.workspace,bbrainyActive:r.info?.bbrainyStatus?.active,lastSeen:r.lastSeen,status:r.status,clientLabel:r.clientLabel,commandLog:r.commandLog.slice(-50),lastResponse:r.lastResponse,extensionStatus:r.extensionStatus})),backlogCount:this.fallback.getRecentBacklog().length,configuredPort:this.configuredPort})}}};var tt=$(require("vscode")),fe=class{constructor(e,t){this._extensionUri=e;this.server=t}static viewType="monitor-dashboard";_view;resolveWebviewView(e,t,r){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[tt.Uri.joinPath(this._extensionUri,"dist")]},e.webview.html=this._getWebviewContent(e.webview),e.webview.onDidReceiveMessage(async s=>{switch(s.action){case"sendCommand":await this.server.sendCommand(s.clientKey,s.command,s.payload);break;case"queryAll":await this.server.queryAllClients(s.command);break;case"showAssets":this.server.showAllAssetsWebview();break;case"showBBrainyStatus":this.server.showBBrainyStatusWebview(s.clientKey);break;case"generateReport":await this.server.generateReport();break;case"startServer":await this.server.start();break;case"stopServer":this.server.stop();break;case"changeServerKey":await this.server.changeServerKey(s.newKey);break;case"viewBacklog":this.server.showBacklogWebview();break;case"clearBacklog":this.server.clearBacklog();break;case"changePort":{let i=parseInt(s.newPort,10);isNaN(i)||await this.server.changePort(i);break}case"clearClientQueue":this.server.clearClientQueue(s.clientKey);break;case"cancelQueueEntry":this.server.cancelQueueEntry(s.clientKey,s.entryId);break}}),this.server.triggerUpdate()}update(e){this._view&&this._view.webview.postMessage({type:"update",data:e})}_getWebviewContent(e){let t=zs(),r=o=>e.asWebviewUri(tt.Uri.joinPath(this._extensionUri,"dist",o)),s=r("monitor-webview.js"),i=r("monitor-webview.css");return`
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
                <script nonce="${t}" src="${s}"></script>
            </body>
            </html>
        `}};function zs(){let n="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}var rt=null;function Vs(n){let e=new $e;rt=e,e.initialize(n);let t=new fe(n.extensionUri,e);e.setProvider(t),n.subscriptions.push(M.window.registerWebviewViewProvider(fe.viewType,t,{webviewOptions:{retainContextWhenHidden:!0}}),M.commands.registerCommand("serverMonitor.start",()=>e.start()),M.commands.registerCommand("serverMonitor.showDashboard",()=>{M.commands.executeCommand("workbench.view.extension.monitor-explorer")}),M.commands.registerCommand("serverMonitor.generateReport",()=>e.generateReport()),M.commands.registerCommand("serverMonitor.publishUpdate",()=>e.publishClientUpdate()),M.commands.registerCommand("serverMonitor.stop",()=>e.stop()),M.commands.registerCommand("serverMonitor.viewBacklog",()=>e.showBacklogWebview())),M.workspace.getConfiguration("serverMonitor").get("autoStart")&&e.start()}function Gs(){rt?.removeServerPresenceFile(),rt=null}0&&(module.exports={activate,deactivate});
