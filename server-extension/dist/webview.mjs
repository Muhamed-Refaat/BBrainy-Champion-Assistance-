function HL(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var qC = { exports: {} }, Ph = {}, XC = { exports: {} }, Mt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vb;
function BL() {
  if (vb) return Mt;
  vb = 1;
  var l = Symbol.for("react.element"), s = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), S = Symbol.for("react.profiler"), R = Symbol.for("react.provider"), m = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), k = Symbol.iterator;
  function A(V) {
    return V === null || typeof V != "object" ? null : (V = k && V[k] || V["@@iterator"], typeof V == "function" ? V : null);
  }
  var P = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, K = Object.assign, ee = {};
  function se(V, te, Ze) {
    this.props = V, this.context = te, this.refs = ee, this.updater = Ze || P;
  }
  se.prototype.isReactComponent = {}, se.prototype.setState = function(V, te) {
    if (typeof V != "object" && typeof V != "function" && V != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, V, te, "setState");
  }, se.prototype.forceUpdate = function(V) {
    this.updater.enqueueForceUpdate(this, V, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = se.prototype;
  function re(V, te, Ze) {
    this.props = V, this.context = te, this.refs = ee, this.updater = Ze || P;
  }
  var q = re.prototype = new Te();
  q.constructor = re, K(q, se.prototype), q.isPureReactComponent = !0;
  var pe = Array.isArray, de = Object.prototype.hasOwnProperty, Pe = { current: null }, Ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Fe(V, te, Ze) {
    var Qe, yt = {}, ot = null, dt = null;
    if (te != null) for (Qe in te.ref !== void 0 && (dt = te.ref), te.key !== void 0 && (ot = "" + te.key), te) de.call(te, Qe) && !Ee.hasOwnProperty(Qe) && (yt[Qe] = te[Qe]);
    var gt = arguments.length - 2;
    if (gt === 1) yt.children = Ze;
    else if (1 < gt) {
      for (var ht = Array(gt), Pt = 0; Pt < gt; Pt++) ht[Pt] = arguments[Pt + 2];
      yt.children = ht;
    }
    if (V && V.defaultProps) for (Qe in gt = V.defaultProps, gt) yt[Qe] === void 0 && (yt[Qe] = gt[Qe]);
    return { $$typeof: l, type: V, key: ot, ref: dt, props: yt, _owner: Pe.current };
  }
  function Be(V, te) {
    return { $$typeof: l, type: V.type, key: te, ref: V.ref, props: V.props, _owner: V._owner };
  }
  function wt(V) {
    return typeof V == "object" && V !== null && V.$$typeof === l;
  }
  function jt(V) {
    var te = { "=": "=0", ":": "=2" };
    return "$" + V.replace(/[=:]/g, function(Ze) {
      return te[Ze];
    });
  }
  var ft = /\/+/g;
  function Ue(V, te) {
    return typeof V == "object" && V !== null && V.key != null ? jt("" + V.key) : te.toString(36);
  }
  function it(V, te, Ze, Qe, yt) {
    var ot = typeof V;
    (ot === "undefined" || ot === "boolean") && (V = null);
    var dt = !1;
    if (V === null) dt = !0;
    else switch (ot) {
      case "string":
      case "number":
        dt = !0;
        break;
      case "object":
        switch (V.$$typeof) {
          case l:
          case s:
            dt = !0;
        }
    }
    if (dt) return dt = V, yt = yt(dt), V = Qe === "" ? "." + Ue(dt, 0) : Qe, pe(yt) ? (Ze = "", V != null && (Ze = V.replace(ft, "$&/") + "/"), it(yt, te, Ze, "", function(Pt) {
      return Pt;
    })) : yt != null && (wt(yt) && (yt = Be(yt, Ze + (!yt.key || dt && dt.key === yt.key ? "" : ("" + yt.key).replace(ft, "$&/") + "/") + V)), te.push(yt)), 1;
    if (dt = 0, Qe = Qe === "" ? "." : Qe + ":", pe(V)) for (var gt = 0; gt < V.length; gt++) {
      ot = V[gt];
      var ht = Qe + Ue(ot, gt);
      dt += it(ot, te, Ze, ht, yt);
    }
    else if (ht = A(V), typeof ht == "function") for (V = ht.call(V), gt = 0; !(ot = V.next()).done; ) ot = ot.value, ht = Qe + Ue(ot, gt++), dt += it(ot, te, Ze, ht, yt);
    else if (ot === "object") throw te = String(V), Error("Objects are not valid as a React child (found: " + (te === "[object Object]" ? "object with keys {" + Object.keys(V).join(", ") + "}" : te) + "). If you meant to render a collection of children, use an array instead.");
    return dt;
  }
  function Tt(V, te, Ze) {
    if (V == null) return V;
    var Qe = [], yt = 0;
    return it(V, Qe, "", "", function(ot) {
      return te.call(Ze, ot, yt++);
    }), Qe;
  }
  function tt(V) {
    if (V._status === -1) {
      var te = V._result;
      te = te(), te.then(function(Ze) {
        (V._status === 0 || V._status === -1) && (V._status = 1, V._result = Ze);
      }, function(Ze) {
        (V._status === 0 || V._status === -1) && (V._status = 2, V._result = Ze);
      }), V._status === -1 && (V._status = 0, V._result = te);
    }
    if (V._status === 1) return V._result.default;
    throw V._result;
  }
  var De = { current: null }, he = { transition: null }, Ne = { ReactCurrentDispatcher: De, ReactCurrentBatchConfig: he, ReactCurrentOwner: Pe };
  function ye() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Mt.Children = { map: Tt, forEach: function(V, te, Ze) {
    Tt(V, function() {
      te.apply(this, arguments);
    }, Ze);
  }, count: function(V) {
    var te = 0;
    return Tt(V, function() {
      te++;
    }), te;
  }, toArray: function(V) {
    return Tt(V, function(te) {
      return te;
    }) || [];
  }, only: function(V) {
    if (!wt(V)) throw Error("React.Children.only expected to receive a single React element child.");
    return V;
  } }, Mt.Component = se, Mt.Fragment = f, Mt.Profiler = S, Mt.PureComponent = re, Mt.StrictMode = v, Mt.Suspense = T, Mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ne, Mt.act = ye, Mt.cloneElement = function(V, te, Ze) {
    if (V == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + V + ".");
    var Qe = K({}, V.props), yt = V.key, ot = V.ref, dt = V._owner;
    if (te != null) {
      if (te.ref !== void 0 && (ot = te.ref, dt = Pe.current), te.key !== void 0 && (yt = "" + te.key), V.type && V.type.defaultProps) var gt = V.type.defaultProps;
      for (ht in te) de.call(te, ht) && !Ee.hasOwnProperty(ht) && (Qe[ht] = te[ht] === void 0 && gt !== void 0 ? gt[ht] : te[ht]);
    }
    var ht = arguments.length - 2;
    if (ht === 1) Qe.children = Ze;
    else if (1 < ht) {
      gt = Array(ht);
      for (var Pt = 0; Pt < ht; Pt++) gt[Pt] = arguments[Pt + 2];
      Qe.children = gt;
    }
    return { $$typeof: l, type: V.type, key: yt, ref: ot, props: Qe, _owner: dt };
  }, Mt.createContext = function(V) {
    return V = { $$typeof: m, _currentValue: V, _currentValue2: V, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, V.Provider = { $$typeof: R, _context: V }, V.Consumer = V;
  }, Mt.createElement = Fe, Mt.createFactory = function(V) {
    var te = Fe.bind(null, V);
    return te.type = V, te;
  }, Mt.createRef = function() {
    return { current: null };
  }, Mt.forwardRef = function(V) {
    return { $$typeof: w, render: V };
  }, Mt.isValidElement = wt, Mt.lazy = function(V) {
    return { $$typeof: M, _payload: { _status: -1, _result: V }, _init: tt };
  }, Mt.memo = function(V, te) {
    return { $$typeof: b, type: V, compare: te === void 0 ? null : te };
  }, Mt.startTransition = function(V) {
    var te = he.transition;
    he.transition = {};
    try {
      V();
    } finally {
      he.transition = te;
    }
  }, Mt.unstable_act = ye, Mt.useCallback = function(V, te) {
    return De.current.useCallback(V, te);
  }, Mt.useContext = function(V) {
    return De.current.useContext(V);
  }, Mt.useDebugValue = function() {
  }, Mt.useDeferredValue = function(V) {
    return De.current.useDeferredValue(V);
  }, Mt.useEffect = function(V, te) {
    return De.current.useEffect(V, te);
  }, Mt.useId = function() {
    return De.current.useId();
  }, Mt.useImperativeHandle = function(V, te, Ze) {
    return De.current.useImperativeHandle(V, te, Ze);
  }, Mt.useInsertionEffect = function(V, te) {
    return De.current.useInsertionEffect(V, te);
  }, Mt.useLayoutEffect = function(V, te) {
    return De.current.useLayoutEffect(V, te);
  }, Mt.useMemo = function(V, te) {
    return De.current.useMemo(V, te);
  }, Mt.useReducer = function(V, te, Ze) {
    return De.current.useReducer(V, te, Ze);
  }, Mt.useRef = function(V) {
    return De.current.useRef(V);
  }, Mt.useState = function(V) {
    return De.current.useState(V);
  }, Mt.useSyncExternalStore = function(V, te, Ze) {
    return De.current.useSyncExternalStore(V, te, Ze);
  }, Mt.useTransition = function() {
    return De.current.useTransition();
  }, Mt.version = "18.3.1", Mt;
}
var Hh = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Hh.exports;
var mb;
function IL() {
  return mb || (mb = 1, function(l, s) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var f = "18.3.1", v = Symbol.for("react.element"), S = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), T = Symbol.for("react.provider"), b = Symbol.for("react.context"), M = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), A = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), K = Symbol.for("react.lazy"), ee = Symbol.for("react.offscreen"), se = Symbol.iterator, Te = "@@iterator";
      function re(E) {
        if (E === null || typeof E != "object")
          return null;
        var L = se && E[se] || E[Te];
        return typeof L == "function" ? L : null;
      }
      var q = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, pe = {
        transition: null
      }, de = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Pe = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Ee = {}, Fe = null;
      function Be(E) {
        Fe = E;
      }
      Ee.setExtraStackFrame = function(E) {
        Fe = E;
      }, Ee.getCurrentStack = null, Ee.getStackAddendum = function() {
        var E = "";
        Fe && (E += Fe);
        var L = Ee.getCurrentStack;
        return L && (E += L() || ""), E;
      };
      var wt = !1, jt = !1, ft = !1, Ue = !1, it = !1, Tt = {
        ReactCurrentDispatcher: q,
        ReactCurrentBatchConfig: pe,
        ReactCurrentOwner: Pe
      };
      Tt.ReactDebugCurrentFrame = Ee, Tt.ReactCurrentActQueue = de;
      function tt(E) {
        {
          for (var L = arguments.length, W = new Array(L > 1 ? L - 1 : 0), X = 1; X < L; X++)
            W[X - 1] = arguments[X];
          he("warn", E, W);
        }
      }
      function De(E) {
        {
          for (var L = arguments.length, W = new Array(L > 1 ? L - 1 : 0), X = 1; X < L; X++)
            W[X - 1] = arguments[X];
          he("error", E, W);
        }
      }
      function he(E, L, W) {
        {
          var X = Tt.ReactDebugCurrentFrame, ve = X.getStackAddendum();
          ve !== "" && (L += "%s", W = W.concat([ve]));
          var Ke = W.map(function(Ce) {
            return String(Ce);
          });
          Ke.unshift("Warning: " + L), Function.prototype.apply.call(console[E], console, Ke);
        }
      }
      var Ne = {};
      function ye(E, L) {
        {
          var W = E.constructor, X = W && (W.displayName || W.name) || "ReactClass", ve = X + "." + L;
          if (Ne[ve])
            return;
          De("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", L, X), Ne[ve] = !0;
        }
      }
      var V = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(E) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(E, L, W) {
          ye(E, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(E, L, W, X) {
          ye(E, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(E, L, W, X) {
          ye(E, "setState");
        }
      }, te = Object.assign, Ze = {};
      Object.freeze(Ze);
      function Qe(E, L, W) {
        this.props = E, this.context = L, this.refs = Ze, this.updater = W || V;
      }
      Qe.prototype.isReactComponent = {}, Qe.prototype.setState = function(E, L) {
        if (typeof E != "object" && typeof E != "function" && E != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, E, L, "setState");
      }, Qe.prototype.forceUpdate = function(E) {
        this.updater.enqueueForceUpdate(this, E, "forceUpdate");
      };
      {
        var yt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ot = function(E, L) {
          Object.defineProperty(Qe.prototype, E, {
            get: function() {
              tt("%s(...) is deprecated in plain JavaScript React classes. %s", L[0], L[1]);
            }
          });
        };
        for (var dt in yt)
          yt.hasOwnProperty(dt) && ot(dt, yt[dt]);
      }
      function gt() {
      }
      gt.prototype = Qe.prototype;
      function ht(E, L, W) {
        this.props = E, this.context = L, this.refs = Ze, this.updater = W || V;
      }
      var Pt = ht.prototype = new gt();
      Pt.constructor = ht, te(Pt, Qe.prototype), Pt.isPureReactComponent = !0;
      function Kt() {
        var E = {
          current: null
        };
        return Object.seal(E), E;
      }
      var Rr = Array.isArray;
      function bn(E) {
        return Rr(E);
      }
      function ur(E) {
        {
          var L = typeof Symbol == "function" && Symbol.toStringTag, W = L && E[Symbol.toStringTag] || E.constructor.name || "Object";
          return W;
        }
      }
      function Wn(E) {
        try {
          return Gn(E), !1;
        } catch {
          return !0;
        }
      }
      function Gn(E) {
        return "" + E;
      }
      function qr(E) {
        if (Wn(E))
          return De("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ur(E)), Gn(E);
      }
      function Si(E, L, W) {
        var X = E.displayName;
        if (X)
          return X;
        var ve = L.displayName || L.name || "";
        return ve !== "" ? W + "(" + ve + ")" : W;
      }
      function va(E) {
        return E.displayName || "Context";
      }
      function er(E) {
        if (E == null)
          return null;
        if (typeof E.tag == "number" && De("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof E == "function")
          return E.displayName || E.name || null;
        if (typeof E == "string")
          return E;
        switch (E) {
          case R:
            return "Fragment";
          case S:
            return "Portal";
          case w:
            return "Profiler";
          case m:
            return "StrictMode";
          case k:
            return "Suspense";
          case A:
            return "SuspenseList";
        }
        if (typeof E == "object")
          switch (E.$$typeof) {
            case b:
              var L = E;
              return va(L) + ".Consumer";
            case T:
              var W = E;
              return va(W._context) + ".Provider";
            case M:
              return Si(E, E.render, "ForwardRef");
            case P:
              var X = E.displayName || null;
              return X !== null ? X : er(E.type) || "Memo";
            case K: {
              var ve = E, Ke = ve._payload, Ce = ve._init;
              try {
                return er(Ce(Ke));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var wn = Object.prototype.hasOwnProperty, Qn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, br, Ja, Pn;
      Pn = {};
      function wr(E) {
        if (wn.call(E, "ref")) {
          var L = Object.getOwnPropertyDescriptor(E, "ref").get;
          if (L && L.isReactWarning)
            return !1;
        }
        return E.ref !== void 0;
      }
      function ma(E) {
        if (wn.call(E, "key")) {
          var L = Object.getOwnPropertyDescriptor(E, "key").get;
          if (L && L.isReactWarning)
            return !1;
        }
        return E.key !== void 0;
      }
      function ei(E, L) {
        var W = function() {
          br || (br = !0, De("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        W.isReactWarning = !0, Object.defineProperty(E, "key", {
          get: W,
          configurable: !0
        });
      }
      function Ci(E, L) {
        var W = function() {
          Ja || (Ja = !0, De("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        W.isReactWarning = !0, Object.defineProperty(E, "ref", {
          get: W,
          configurable: !0
        });
      }
      function me(E) {
        if (typeof E.ref == "string" && Pe.current && E.__self && Pe.current.stateNode !== E.__self) {
          var L = er(Pe.current.type);
          Pn[L] || (De('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', L, E.ref), Pn[L] = !0);
        }
      }
      var Ie = function(E, L, W, X, ve, Ke, Ce) {
        var Je = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: v,
          // Built-in properties that belong on the element
          type: E,
          key: L,
          ref: W,
          props: Ce,
          // Record the component responsible for creating this element.
          _owner: Ke
        };
        return Je._store = {}, Object.defineProperty(Je._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Je, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: X
        }), Object.defineProperty(Je, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ve
        }), Object.freeze && (Object.freeze(Je.props), Object.freeze(Je)), Je;
      };
      function Et(E, L, W) {
        var X, ve = {}, Ke = null, Ce = null, Je = null, kt = null;
        if (L != null) {
          wr(L) && (Ce = L.ref, me(L)), ma(L) && (qr(L.key), Ke = "" + L.key), Je = L.__self === void 0 ? null : L.__self, kt = L.__source === void 0 ? null : L.__source;
          for (X in L)
            wn.call(L, X) && !Qn.hasOwnProperty(X) && (ve[X] = L[X]);
        }
        var Vt = arguments.length - 2;
        if (Vt === 1)
          ve.children = W;
        else if (Vt > 1) {
          for (var sn = Array(Vt), Jt = 0; Jt < Vt; Jt++)
            sn[Jt] = arguments[Jt + 2];
          Object.freeze && Object.freeze(sn), ve.children = sn;
        }
        if (E && E.defaultProps) {
          var xt = E.defaultProps;
          for (X in xt)
            ve[X] === void 0 && (ve[X] = xt[X]);
        }
        if (Ke || Ce) {
          var en = typeof E == "function" ? E.displayName || E.name || "Unknown" : E;
          Ke && ei(ve, en), Ce && Ci(ve, en);
        }
        return Ie(E, Ke, Ce, Je, kt, Pe.current, ve);
      }
      function Wt(E, L) {
        var W = Ie(E.type, L, E.ref, E._self, E._source, E._owner, E.props);
        return W;
      }
      function on(E, L, W) {
        if (E == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + E + ".");
        var X, ve = te({}, E.props), Ke = E.key, Ce = E.ref, Je = E._self, kt = E._source, Vt = E._owner;
        if (L != null) {
          wr(L) && (Ce = L.ref, Vt = Pe.current), ma(L) && (qr(L.key), Ke = "" + L.key);
          var sn;
          E.type && E.type.defaultProps && (sn = E.type.defaultProps);
          for (X in L)
            wn.call(L, X) && !Qn.hasOwnProperty(X) && (L[X] === void 0 && sn !== void 0 ? ve[X] = sn[X] : ve[X] = L[X]);
        }
        var Jt = arguments.length - 2;
        if (Jt === 1)
          ve.children = W;
        else if (Jt > 1) {
          for (var xt = Array(Jt), en = 0; en < Jt; en++)
            xt[en] = arguments[en + 2];
          ve.children = xt;
        }
        return Ie(E.type, Ke, Ce, Je, kt, Vt, ve);
      }
      function gn(E) {
        return typeof E == "object" && E !== null && E.$$typeof === v;
      }
      var fn = ".", tr = ":";
      function ln(E) {
        var L = /[=:]/g, W = {
          "=": "=0",
          ":": "=2"
        }, X = E.replace(L, function(ve) {
          return W[ve];
        });
        return "$" + X;
      }
      var qt = !1, Xt = /\/+/g;
      function ya(E) {
        return E.replace(Xt, "$&/");
      }
      function Dr(E, L) {
        return typeof E == "object" && E !== null && E.key != null ? (qr(E.key), ln("" + E.key)) : L.toString(36);
      }
      function Oa(E, L, W, X, ve) {
        var Ke = typeof E;
        (Ke === "undefined" || Ke === "boolean") && (E = null);
        var Ce = !1;
        if (E === null)
          Ce = !0;
        else
          switch (Ke) {
            case "string":
            case "number":
              Ce = !0;
              break;
            case "object":
              switch (E.$$typeof) {
                case v:
                case S:
                  Ce = !0;
              }
          }
        if (Ce) {
          var Je = E, kt = ve(Je), Vt = X === "" ? fn + Dr(Je, 0) : X;
          if (bn(kt)) {
            var sn = "";
            Vt != null && (sn = ya(Vt) + "/"), Oa(kt, L, sn, "", function(Ad) {
              return Ad;
            });
          } else kt != null && (gn(kt) && (kt.key && (!Je || Je.key !== kt.key) && qr(kt.key), kt = Wt(
            kt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            W + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (kt.key && (!Je || Je.key !== kt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              ya("" + kt.key) + "/"
            ) : "") + Vt
          )), L.push(kt));
          return 1;
        }
        var Jt, xt, en = 0, Sn = X === "" ? fn : X + tr;
        if (bn(E))
          for (var Po = 0; Po < E.length; Po++)
            Jt = E[Po], xt = Sn + Dr(Jt, Po), en += Oa(Jt, L, W, xt, ve);
        else {
          var Cs = re(E);
          if (typeof Cs == "function") {
            var eo = E;
            Cs === eo.entries && (qt || tt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), qt = !0);
            for (var Es = Cs.call(eo), xl, Ld = 0; !(xl = Es.next()).done; )
              Jt = xl.value, xt = Sn + Dr(Jt, Ld++), en += Oa(Jt, L, W, xt, ve);
          } else if (Ke === "object") {
            var Fc = String(E);
            throw new Error("Objects are not valid as a React child (found: " + (Fc === "[object Object]" ? "object with keys {" + Object.keys(E).join(", ") + "}" : Fc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return en;
      }
      function Xi(E, L, W) {
        if (E == null)
          return E;
        var X = [], ve = 0;
        return Oa(E, X, "", "", function(Ke) {
          return L.call(W, Ke, ve++);
        }), X;
      }
      function pl(E) {
        var L = 0;
        return Xi(E, function() {
          L++;
        }), L;
      }
      function hl(E, L, W) {
        Xi(E, function() {
          L.apply(this, arguments);
        }, W);
      }
      function wo(E) {
        return Xi(E, function(L) {
          return L;
        }) || [];
      }
      function Do(E) {
        if (!gn(E))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return E;
      }
      function vl(E) {
        var L = {
          $$typeof: b,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: E,
          _currentValue2: E,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        L.Provider = {
          $$typeof: T,
          _context: L
        };
        var W = !1, X = !1, ve = !1;
        {
          var Ke = {
            $$typeof: b,
            _context: L
          };
          Object.defineProperties(Ke, {
            Provider: {
              get: function() {
                return X || (X = !0, De("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), L.Provider;
              },
              set: function(Ce) {
                L.Provider = Ce;
              }
            },
            _currentValue: {
              get: function() {
                return L._currentValue;
              },
              set: function(Ce) {
                L._currentValue = Ce;
              }
            },
            _currentValue2: {
              get: function() {
                return L._currentValue2;
              },
              set: function(Ce) {
                L._currentValue2 = Ce;
              }
            },
            _threadCount: {
              get: function() {
                return L._threadCount;
              },
              set: function(Ce) {
                L._threadCount = Ce;
              }
            },
            Consumer: {
              get: function() {
                return W || (W = !0, De("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), L.Consumer;
              }
            },
            displayName: {
              get: function() {
                return L.displayName;
              },
              set: function(Ce) {
                ve || (tt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Ce), ve = !0);
              }
            }
          }), L.Consumer = Ke;
        }
        return L._currentRenderer = null, L._currentRenderer2 = null, L;
      }
      var Lr = -1, Ar = 0, sr = 1, Ei = 2;
      function ti(E) {
        if (E._status === Lr) {
          var L = E._result, W = L();
          if (W.then(function(Ke) {
            if (E._status === Ar || E._status === Lr) {
              var Ce = E;
              Ce._status = sr, Ce._result = Ke;
            }
          }, function(Ke) {
            if (E._status === Ar || E._status === Lr) {
              var Ce = E;
              Ce._status = Ei, Ce._result = Ke;
            }
          }), E._status === Lr) {
            var X = E;
            X._status = Ar, X._result = W;
          }
        }
        if (E._status === sr) {
          var ve = E._result;
          return ve === void 0 && De(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, ve), "default" in ve || De(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, ve), ve.default;
        } else
          throw E._result;
      }
      function xi(E) {
        var L = {
          // We use these fields to store the result.
          _status: Lr,
          _result: E
        }, W = {
          $$typeof: K,
          _payload: L,
          _init: ti
        };
        {
          var X, ve;
          Object.defineProperties(W, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return X;
              },
              set: function(Ke) {
                De("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), X = Ke, Object.defineProperty(W, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return ve;
              },
              set: function(Ke) {
                De("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ve = Ke, Object.defineProperty(W, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return W;
      }
      function Ti(E) {
        E != null && E.$$typeof === P ? De("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof E != "function" ? De("forwardRef requires a render function but was given %s.", E === null ? "null" : typeof E) : E.length !== 0 && E.length !== 2 && De("forwardRef render functions accept exactly two parameters: props and ref. %s", E.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), E != null && (E.defaultProps != null || E.propTypes != null) && De("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var L = {
          $$typeof: M,
          render: E
        };
        {
          var W;
          Object.defineProperty(L, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return W;
            },
            set: function(X) {
              W = X, !E.name && !E.displayName && (E.displayName = X);
            }
          });
        }
        return L;
      }
      var N;
      N = Symbol.for("react.module.reference");
      function ae(E) {
        return !!(typeof E == "string" || typeof E == "function" || E === R || E === w || it || E === m || E === k || E === A || Ue || E === ee || wt || jt || ft || typeof E == "object" && E !== null && (E.$$typeof === K || E.$$typeof === P || E.$$typeof === T || E.$$typeof === b || E.$$typeof === M || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        E.$$typeof === N || E.getModuleId !== void 0));
      }
      function xe(E, L) {
        ae(E) || De("memo: The first argument must be a component. Instead received: %s", E === null ? "null" : typeof E);
        var W = {
          $$typeof: P,
          type: E,
          compare: L === void 0 ? null : L
        };
        {
          var X;
          Object.defineProperty(W, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return X;
            },
            set: function(ve) {
              X = ve, !E.name && !E.displayName && (E.displayName = ve);
            }
          });
        }
        return W;
      }
      function Ae() {
        var E = q.current;
        return E === null && De(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), E;
      }
      function vt(E) {
        var L = Ae();
        if (E._context !== void 0) {
          var W = E._context;
          W.Consumer === E ? De("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : W.Provider === E && De("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return L.useContext(E);
      }
      function st(E) {
        var L = Ae();
        return L.useState(E);
      }
      function Dt(E, L, W) {
        var X = Ae();
        return X.useReducer(E, L, W);
      }
      function Rt(E) {
        var L = Ae();
        return L.useRef(E);
      }
      function Dn(E, L) {
        var W = Ae();
        return W.useEffect(E, L);
      }
      function un(E, L) {
        var W = Ae();
        return W.useInsertionEffect(E, L);
      }
      function dn(E, L) {
        var W = Ae();
        return W.useLayoutEffect(E, L);
      }
      function cr(E, L) {
        var W = Ae();
        return W.useCallback(E, L);
      }
      function ni(E, L) {
        var W = Ae();
        return W.useMemo(E, L);
      }
      function ri(E, L, W) {
        var X = Ae();
        return X.useImperativeHandle(E, L, W);
      }
      function mt(E, L) {
        {
          var W = Ae();
          return W.useDebugValue(E, L);
        }
      }
      function Ct() {
        var E = Ae();
        return E.useTransition();
      }
      function ai(E) {
        var L = Ae();
        return L.useDeferredValue(E);
      }
      function ml() {
        var E = Ae();
        return E.useId();
      }
      function yl(E, L, W) {
        var X = Ae();
        return X.useSyncExternalStore(E, L, W);
      }
      var ko = 0, du, _o, Xr, ms, Nr, zc, jc;
      function pu() {
      }
      pu.__reactDisabledLog = !0;
      function Mo() {
        {
          if (ko === 0) {
            du = console.log, _o = console.info, Xr = console.warn, ms = console.error, Nr = console.group, zc = console.groupCollapsed, jc = console.groupEnd;
            var E = {
              configurable: !0,
              enumerable: !0,
              value: pu,
              writable: !0
            };
            Object.defineProperties(console, {
              info: E,
              log: E,
              warn: E,
              error: E,
              group: E,
              groupCollapsed: E,
              groupEnd: E
            });
          }
          ko++;
        }
      }
      function ga() {
        {
          if (ko--, ko === 0) {
            var E = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: te({}, E, {
                value: du
              }),
              info: te({}, E, {
                value: _o
              }),
              warn: te({}, E, {
                value: Xr
              }),
              error: te({}, E, {
                value: ms
              }),
              group: te({}, E, {
                value: Nr
              }),
              groupCollapsed: te({}, E, {
                value: zc
              }),
              groupEnd: te({}, E, {
                value: jc
              })
            });
          }
          ko < 0 && De("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ii = Tt.ReactCurrentDispatcher, oi;
      function hu(E, L, W) {
        {
          if (oi === void 0)
            try {
              throw Error();
            } catch (ve) {
              var X = ve.stack.trim().match(/\n( *(at )?)/);
              oi = X && X[1] || "";
            }
          return `
` + oi + E;
        }
      }
      var gl = !1, Oo;
      {
        var vu = typeof WeakMap == "function" ? WeakMap : Map;
        Oo = new vu();
      }
      function mu(E, L) {
        if (!E || gl)
          return "";
        {
          var W = Oo.get(E);
          if (W !== void 0)
            return W;
        }
        var X;
        gl = !0;
        var ve = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ke;
        Ke = ii.current, ii.current = null, Mo();
        try {
          if (L) {
            var Ce = function() {
              throw Error();
            };
            if (Object.defineProperty(Ce.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Ce, []);
              } catch (Sn) {
                X = Sn;
              }
              Reflect.construct(E, [], Ce);
            } else {
              try {
                Ce.call();
              } catch (Sn) {
                X = Sn;
              }
              E.call(Ce.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Sn) {
              X = Sn;
            }
            E();
          }
        } catch (Sn) {
          if (Sn && X && typeof Sn.stack == "string") {
            for (var Je = Sn.stack.split(`
`), kt = X.stack.split(`
`), Vt = Je.length - 1, sn = kt.length - 1; Vt >= 1 && sn >= 0 && Je[Vt] !== kt[sn]; )
              sn--;
            for (; Vt >= 1 && sn >= 0; Vt--, sn--)
              if (Je[Vt] !== kt[sn]) {
                if (Vt !== 1 || sn !== 1)
                  do
                    if (Vt--, sn--, sn < 0 || Je[Vt] !== kt[sn]) {
                      var Jt = `
` + Je[Vt].replace(" at new ", " at ");
                      return E.displayName && Jt.includes("<anonymous>") && (Jt = Jt.replace("<anonymous>", E.displayName)), typeof E == "function" && Oo.set(E, Jt), Jt;
                    }
                  while (Vt >= 1 && sn >= 0);
                break;
              }
          }
        } finally {
          gl = !1, ii.current = Ke, ga(), Error.prepareStackTrace = ve;
        }
        var xt = E ? E.displayName || E.name : "", en = xt ? hu(xt) : "";
        return typeof E == "function" && Oo.set(E, en), en;
      }
      function Zi(E, L, W) {
        return mu(E, !1);
      }
      function Md(E) {
        var L = E.prototype;
        return !!(L && L.isReactComponent);
      }
      function Ji(E, L, W) {
        if (E == null)
          return "";
        if (typeof E == "function")
          return mu(E, Md(E));
        if (typeof E == "string")
          return hu(E);
        switch (E) {
          case k:
            return hu("Suspense");
          case A:
            return hu("SuspenseList");
        }
        if (typeof E == "object")
          switch (E.$$typeof) {
            case M:
              return Zi(E.render);
            case P:
              return Ji(E.type, L, W);
            case K: {
              var X = E, ve = X._payload, Ke = X._init;
              try {
                return Ji(Ke(ve), L, W);
              } catch {
              }
            }
          }
        return "";
      }
      var Ft = {}, yu = Tt.ReactDebugCurrentFrame;
      function Ut(E) {
        if (E) {
          var L = E._owner, W = Ji(E.type, E._source, L ? L.type : null);
          yu.setExtraStackFrame(W);
        } else
          yu.setExtraStackFrame(null);
      }
      function ys(E, L, W, X, ve) {
        {
          var Ke = Function.call.bind(wn);
          for (var Ce in E)
            if (Ke(E, Ce)) {
              var Je = void 0;
              try {
                if (typeof E[Ce] != "function") {
                  var kt = Error((X || "React class") + ": " + W + " type `" + Ce + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof E[Ce] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw kt.name = "Invariant Violation", kt;
                }
                Je = E[Ce](L, Ce, X, W, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Vt) {
                Je = Vt;
              }
              Je && !(Je instanceof Error) && (Ut(ve), De("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", X || "React class", W, Ce, typeof Je), Ut(null)), Je instanceof Error && !(Je.message in Ft) && (Ft[Je.message] = !0, Ut(ve), De("Failed %s type: %s", W, Je.message), Ut(null));
            }
        }
      }
      function Ri(E) {
        if (E) {
          var L = E._owner, W = Ji(E.type, E._source, L ? L.type : null);
          Be(W);
        } else
          Be(null);
      }
      var lt;
      lt = !1;
      function gu() {
        if (Pe.current) {
          var E = er(Pe.current.type);
          if (E)
            return `

Check the render method of \`` + E + "`.";
        }
        return "";
      }
      function fr(E) {
        if (E !== void 0) {
          var L = E.fileName.replace(/^.*[\\\/]/, ""), W = E.lineNumber;
          return `

Check your code at ` + L + ":" + W + ".";
        }
        return "";
      }
      function bi(E) {
        return E != null ? fr(E.__source) : "";
      }
      var Pr = {};
      function wi(E) {
        var L = gu();
        if (!L) {
          var W = typeof E == "string" ? E : E.displayName || E.name;
          W && (L = `

Check the top-level render call using <` + W + ">.");
        }
        return L;
      }
      function pn(E, L) {
        if (!(!E._store || E._store.validated || E.key != null)) {
          E._store.validated = !0;
          var W = wi(L);
          if (!Pr[W]) {
            Pr[W] = !0;
            var X = "";
            E && E._owner && E._owner !== Pe.current && (X = " It was passed a child from " + er(E._owner.type) + "."), Ri(E), De('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', W, X), Ri(null);
          }
        }
      }
      function Zt(E, L) {
        if (typeof E == "object") {
          if (bn(E))
            for (var W = 0; W < E.length; W++) {
              var X = E[W];
              gn(X) && pn(X, L);
            }
          else if (gn(E))
            E._store && (E._store.validated = !0);
          else if (E) {
            var ve = re(E);
            if (typeof ve == "function" && ve !== E.entries)
              for (var Ke = ve.call(E), Ce; !(Ce = Ke.next()).done; )
                gn(Ce.value) && pn(Ce.value, L);
          }
        }
      }
      function Lo(E) {
        {
          var L = E.type;
          if (L == null || typeof L == "string")
            return;
          var W;
          if (typeof L == "function")
            W = L.propTypes;
          else if (typeof L == "object" && (L.$$typeof === M || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          L.$$typeof === P))
            W = L.propTypes;
          else
            return;
          if (W) {
            var X = er(L);
            ys(W, E.props, "prop", X, E);
          } else if (L.PropTypes !== void 0 && !lt) {
            lt = !0;
            var ve = er(L);
            De("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ve || "Unknown");
          }
          typeof L.getDefaultProps == "function" && !L.getDefaultProps.isReactClassApproved && De("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Kn(E) {
        {
          for (var L = Object.keys(E.props), W = 0; W < L.length; W++) {
            var X = L[W];
            if (X !== "children" && X !== "key") {
              Ri(E), De("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", X), Ri(null);
              break;
            }
          }
          E.ref !== null && (Ri(E), De("Invalid attribute `ref` supplied to `React.Fragment`."), Ri(null));
        }
      }
      function Ur(E, L, W) {
        var X = ae(E);
        if (!X) {
          var ve = "";
          (E === void 0 || typeof E == "object" && E !== null && Object.keys(E).length === 0) && (ve += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ke = bi(L);
          Ke ? ve += Ke : ve += gu();
          var Ce;
          E === null ? Ce = "null" : bn(E) ? Ce = "array" : E !== void 0 && E.$$typeof === v ? (Ce = "<" + (er(E.type) || "Unknown") + " />", ve = " Did you accidentally export a JSX literal instead of a component?") : Ce = typeof E, De("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Ce, ve);
        }
        var Je = Et.apply(this, arguments);
        if (Je == null)
          return Je;
        if (X)
          for (var kt = 2; kt < arguments.length; kt++)
            Zt(arguments[kt], E);
        return E === R ? Kn(Je) : Lo(Je), Je;
      }
      var La = !1;
      function Sl(E) {
        var L = Ur.bind(null, E);
        return L.type = E, La || (La = !0, tt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(L, "type", {
          enumerable: !1,
          get: function() {
            return tt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: E
            }), E;
          }
        }), L;
      }
      function gs(E, L, W) {
        for (var X = on.apply(this, arguments), ve = 2; ve < arguments.length; ve++)
          Zt(arguments[ve], X.type);
        return Lo(X), X;
      }
      function Ss(E, L) {
        var W = pe.transition;
        pe.transition = {};
        var X = pe.transition;
        pe.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          E();
        } finally {
          if (pe.transition = W, W === null && X._updatedFibers) {
            var ve = X._updatedFibers.size;
            ve > 10 && tt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), X._updatedFibers.clear();
          }
        }
      }
      var Ao = !1, Cl = null;
      function Od(E) {
        if (Cl === null)
          try {
            var L = ("require" + Math.random()).slice(0, 7), W = l && l[L];
            Cl = W.call(l, "timers").setImmediate;
          } catch {
            Cl = function(ve) {
              Ao === !1 && (Ao = !0, typeof MessageChannel > "u" && De("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ke = new MessageChannel();
              Ke.port1.onmessage = ve, Ke.port2.postMessage(void 0);
            };
          }
        return Cl(E);
      }
      var Aa = 0, li = !1;
      function Di(E) {
        {
          var L = Aa;
          Aa++, de.current === null && (de.current = []);
          var W = de.isBatchingLegacy, X;
          try {
            if (de.isBatchingLegacy = !0, X = E(), !W && de.didScheduleLegacyUpdate) {
              var ve = de.current;
              ve !== null && (de.didScheduleLegacyUpdate = !1, No(ve));
            }
          } catch (xt) {
            throw Na(L), xt;
          } finally {
            de.isBatchingLegacy = W;
          }
          if (X !== null && typeof X == "object" && typeof X.then == "function") {
            var Ke = X, Ce = !1, Je = {
              then: function(xt, en) {
                Ce = !0, Ke.then(function(Sn) {
                  Na(L), Aa === 0 ? Su(Sn, xt, en) : xt(Sn);
                }, function(Sn) {
                  Na(L), en(Sn);
                });
              }
            };
            return !li && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Ce || (li = !0, De("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Je;
          } else {
            var kt = X;
            if (Na(L), Aa === 0) {
              var Vt = de.current;
              Vt !== null && (No(Vt), de.current = null);
              var sn = {
                then: function(xt, en) {
                  de.current === null ? (de.current = [], Su(kt, xt, en)) : xt(kt);
                }
              };
              return sn;
            } else {
              var Jt = {
                then: function(xt, en) {
                  xt(kt);
                }
              };
              return Jt;
            }
          }
        }
      }
      function Na(E) {
        E !== Aa - 1 && De("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Aa = E;
      }
      function Su(E, L, W) {
        {
          var X = de.current;
          if (X !== null)
            try {
              No(X), Od(function() {
                X.length === 0 ? (de.current = null, L(E)) : Su(E, L, W);
              });
            } catch (ve) {
              W(ve);
            }
          else
            L(E);
        }
      }
      var Cu = !1;
      function No(E) {
        if (!Cu) {
          Cu = !0;
          var L = 0;
          try {
            for (; L < E.length; L++) {
              var W = E[L];
              do
                W = W(!0);
              while (W !== null);
            }
            E.length = 0;
          } catch (X) {
            throw E = E.slice(L + 1), X;
          } finally {
            Cu = !1;
          }
        }
      }
      var El = Ur, Eu = gs, xu = Sl, ui = {
        map: Xi,
        forEach: hl,
        count: pl,
        toArray: wo,
        only: Do
      };
      s.Children = ui, s.Component = Qe, s.Fragment = R, s.Profiler = w, s.PureComponent = ht, s.StrictMode = m, s.Suspense = k, s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Tt, s.act = Di, s.cloneElement = Eu, s.createContext = vl, s.createElement = El, s.createFactory = xu, s.createRef = Kt, s.forwardRef = Ti, s.isValidElement = gn, s.lazy = xi, s.memo = xe, s.startTransition = Ss, s.unstable_act = Di, s.useCallback = cr, s.useContext = vt, s.useDebugValue = mt, s.useDeferredValue = ai, s.useEffect = Dn, s.useId = ml, s.useImperativeHandle = ri, s.useInsertionEffect = un, s.useLayoutEffect = dn, s.useMemo = ni, s.useReducer = Dt, s.useRef = Rt, s.useState = st, s.useSyncExternalStore = yl, s.useTransition = Ct, s.version = f, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Hh, Hh.exports)), Hh.exports;
}
process.env.NODE_ENV === "production" ? XC.exports = BL() : XC.exports = IL();
var ge = XC.exports;
const dE = /* @__PURE__ */ HL(ge);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yb;
function YL() {
  if (yb) return Ph;
  yb = 1;
  var l = ge, s = Symbol.for("react.element"), f = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, S = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function m(w, T, b) {
    var M, k = {}, A = null, P = null;
    b !== void 0 && (A = "" + b), T.key !== void 0 && (A = "" + T.key), T.ref !== void 0 && (P = T.ref);
    for (M in T) v.call(T, M) && !R.hasOwnProperty(M) && (k[M] = T[M]);
    if (w && w.defaultProps) for (M in T = w.defaultProps, T) k[M] === void 0 && (k[M] = T[M]);
    return { $$typeof: s, type: w, key: A, ref: P, props: k, _owner: S.current };
  }
  return Ph.Fragment = f, Ph.jsx = m, Ph.jsxs = m, Ph;
}
var Uh = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gb;
function $L() {
  return gb || (gb = 1, process.env.NODE_ENV !== "production" && function() {
    var l = ge, s = Symbol.for("react.element"), f = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), m = Symbol.for("react.provider"), w = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), b = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), k = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), P = Symbol.for("react.offscreen"), K = Symbol.iterator, ee = "@@iterator";
    function se(N) {
      if (N === null || typeof N != "object")
        return null;
      var ae = K && N[K] || N[ee];
      return typeof ae == "function" ? ae : null;
    }
    var Te = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function re(N) {
      {
        for (var ae = arguments.length, xe = new Array(ae > 1 ? ae - 1 : 0), Ae = 1; Ae < ae; Ae++)
          xe[Ae - 1] = arguments[Ae];
        q("error", N, xe);
      }
    }
    function q(N, ae, xe) {
      {
        var Ae = Te.ReactDebugCurrentFrame, vt = Ae.getStackAddendum();
        vt !== "" && (ae += "%s", xe = xe.concat([vt]));
        var st = xe.map(function(Dt) {
          return String(Dt);
        });
        st.unshift("Warning: " + ae), Function.prototype.apply.call(console[N], console, st);
      }
    }
    var pe = !1, de = !1, Pe = !1, Ee = !1, Fe = !1, Be;
    Be = Symbol.for("react.module.reference");
    function wt(N) {
      return !!(typeof N == "string" || typeof N == "function" || N === v || N === R || Fe || N === S || N === b || N === M || Ee || N === P || pe || de || Pe || typeof N == "object" && N !== null && (N.$$typeof === A || N.$$typeof === k || N.$$typeof === m || N.$$typeof === w || N.$$typeof === T || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      N.$$typeof === Be || N.getModuleId !== void 0));
    }
    function jt(N, ae, xe) {
      var Ae = N.displayName;
      if (Ae)
        return Ae;
      var vt = ae.displayName || ae.name || "";
      return vt !== "" ? xe + "(" + vt + ")" : xe;
    }
    function ft(N) {
      return N.displayName || "Context";
    }
    function Ue(N) {
      if (N == null)
        return null;
      if (typeof N.tag == "number" && re("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof N == "function")
        return N.displayName || N.name || null;
      if (typeof N == "string")
        return N;
      switch (N) {
        case v:
          return "Fragment";
        case f:
          return "Portal";
        case R:
          return "Profiler";
        case S:
          return "StrictMode";
        case b:
          return "Suspense";
        case M:
          return "SuspenseList";
      }
      if (typeof N == "object")
        switch (N.$$typeof) {
          case w:
            var ae = N;
            return ft(ae) + ".Consumer";
          case m:
            var xe = N;
            return ft(xe._context) + ".Provider";
          case T:
            return jt(N, N.render, "ForwardRef");
          case k:
            var Ae = N.displayName || null;
            return Ae !== null ? Ae : Ue(N.type) || "Memo";
          case A: {
            var vt = N, st = vt._payload, Dt = vt._init;
            try {
              return Ue(Dt(st));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var it = Object.assign, Tt = 0, tt, De, he, Ne, ye, V, te;
    function Ze() {
    }
    Ze.__reactDisabledLog = !0;
    function Qe() {
      {
        if (Tt === 0) {
          tt = console.log, De = console.info, he = console.warn, Ne = console.error, ye = console.group, V = console.groupCollapsed, te = console.groupEnd;
          var N = {
            configurable: !0,
            enumerable: !0,
            value: Ze,
            writable: !0
          };
          Object.defineProperties(console, {
            info: N,
            log: N,
            warn: N,
            error: N,
            group: N,
            groupCollapsed: N,
            groupEnd: N
          });
        }
        Tt++;
      }
    }
    function yt() {
      {
        if (Tt--, Tt === 0) {
          var N = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: it({}, N, {
              value: tt
            }),
            info: it({}, N, {
              value: De
            }),
            warn: it({}, N, {
              value: he
            }),
            error: it({}, N, {
              value: Ne
            }),
            group: it({}, N, {
              value: ye
            }),
            groupCollapsed: it({}, N, {
              value: V
            }),
            groupEnd: it({}, N, {
              value: te
            })
          });
        }
        Tt < 0 && re("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ot = Te.ReactCurrentDispatcher, dt;
    function gt(N, ae, xe) {
      {
        if (dt === void 0)
          try {
            throw Error();
          } catch (vt) {
            var Ae = vt.stack.trim().match(/\n( *(at )?)/);
            dt = Ae && Ae[1] || "";
          }
        return `
` + dt + N;
      }
    }
    var ht = !1, Pt;
    {
      var Kt = typeof WeakMap == "function" ? WeakMap : Map;
      Pt = new Kt();
    }
    function Rr(N, ae) {
      if (!N || ht)
        return "";
      {
        var xe = Pt.get(N);
        if (xe !== void 0)
          return xe;
      }
      var Ae;
      ht = !0;
      var vt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var st;
      st = ot.current, ot.current = null, Qe();
      try {
        if (ae) {
          var Dt = function() {
            throw Error();
          };
          if (Object.defineProperty(Dt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Dt, []);
            } catch (mt) {
              Ae = mt;
            }
            Reflect.construct(N, [], Dt);
          } else {
            try {
              Dt.call();
            } catch (mt) {
              Ae = mt;
            }
            N.call(Dt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (mt) {
            Ae = mt;
          }
          N();
        }
      } catch (mt) {
        if (mt && Ae && typeof mt.stack == "string") {
          for (var Rt = mt.stack.split(`
`), Dn = Ae.stack.split(`
`), un = Rt.length - 1, dn = Dn.length - 1; un >= 1 && dn >= 0 && Rt[un] !== Dn[dn]; )
            dn--;
          for (; un >= 1 && dn >= 0; un--, dn--)
            if (Rt[un] !== Dn[dn]) {
              if (un !== 1 || dn !== 1)
                do
                  if (un--, dn--, dn < 0 || Rt[un] !== Dn[dn]) {
                    var cr = `
` + Rt[un].replace(" at new ", " at ");
                    return N.displayName && cr.includes("<anonymous>") && (cr = cr.replace("<anonymous>", N.displayName)), typeof N == "function" && Pt.set(N, cr), cr;
                  }
                while (un >= 1 && dn >= 0);
              break;
            }
        }
      } finally {
        ht = !1, ot.current = st, yt(), Error.prepareStackTrace = vt;
      }
      var ni = N ? N.displayName || N.name : "", ri = ni ? gt(ni) : "";
      return typeof N == "function" && Pt.set(N, ri), ri;
    }
    function bn(N, ae, xe) {
      return Rr(N, !1);
    }
    function ur(N) {
      var ae = N.prototype;
      return !!(ae && ae.isReactComponent);
    }
    function Wn(N, ae, xe) {
      if (N == null)
        return "";
      if (typeof N == "function")
        return Rr(N, ur(N));
      if (typeof N == "string")
        return gt(N);
      switch (N) {
        case b:
          return gt("Suspense");
        case M:
          return gt("SuspenseList");
      }
      if (typeof N == "object")
        switch (N.$$typeof) {
          case T:
            return bn(N.render);
          case k:
            return Wn(N.type, ae, xe);
          case A: {
            var Ae = N, vt = Ae._payload, st = Ae._init;
            try {
              return Wn(st(vt), ae, xe);
            } catch {
            }
          }
        }
      return "";
    }
    var Gn = Object.prototype.hasOwnProperty, qr = {}, Si = Te.ReactDebugCurrentFrame;
    function va(N) {
      if (N) {
        var ae = N._owner, xe = Wn(N.type, N._source, ae ? ae.type : null);
        Si.setExtraStackFrame(xe);
      } else
        Si.setExtraStackFrame(null);
    }
    function er(N, ae, xe, Ae, vt) {
      {
        var st = Function.call.bind(Gn);
        for (var Dt in N)
          if (st(N, Dt)) {
            var Rt = void 0;
            try {
              if (typeof N[Dt] != "function") {
                var Dn = Error((Ae || "React class") + ": " + xe + " type `" + Dt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof N[Dt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Dn.name = "Invariant Violation", Dn;
              }
              Rt = N[Dt](ae, Dt, Ae, xe, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (un) {
              Rt = un;
            }
            Rt && !(Rt instanceof Error) && (va(vt), re("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Ae || "React class", xe, Dt, typeof Rt), va(null)), Rt instanceof Error && !(Rt.message in qr) && (qr[Rt.message] = !0, va(vt), re("Failed %s type: %s", xe, Rt.message), va(null));
          }
      }
    }
    var wn = Array.isArray;
    function Qn(N) {
      return wn(N);
    }
    function br(N) {
      {
        var ae = typeof Symbol == "function" && Symbol.toStringTag, xe = ae && N[Symbol.toStringTag] || N.constructor.name || "Object";
        return xe;
      }
    }
    function Ja(N) {
      try {
        return Pn(N), !1;
      } catch {
        return !0;
      }
    }
    function Pn(N) {
      return "" + N;
    }
    function wr(N) {
      if (Ja(N))
        return re("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", br(N)), Pn(N);
    }
    var ma = Te.ReactCurrentOwner, ei = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ci, me;
    function Ie(N) {
      if (Gn.call(N, "ref")) {
        var ae = Object.getOwnPropertyDescriptor(N, "ref").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return N.ref !== void 0;
    }
    function Et(N) {
      if (Gn.call(N, "key")) {
        var ae = Object.getOwnPropertyDescriptor(N, "key").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return N.key !== void 0;
    }
    function Wt(N, ae) {
      typeof N.ref == "string" && ma.current;
    }
    function on(N, ae) {
      {
        var xe = function() {
          Ci || (Ci = !0, re("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        xe.isReactWarning = !0, Object.defineProperty(N, "key", {
          get: xe,
          configurable: !0
        });
      }
    }
    function gn(N, ae) {
      {
        var xe = function() {
          me || (me = !0, re("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        xe.isReactWarning = !0, Object.defineProperty(N, "ref", {
          get: xe,
          configurable: !0
        });
      }
    }
    var fn = function(N, ae, xe, Ae, vt, st, Dt) {
      var Rt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: s,
        // Built-in properties that belong on the element
        type: N,
        key: ae,
        ref: xe,
        props: Dt,
        // Record the component responsible for creating this element.
        _owner: st
      };
      return Rt._store = {}, Object.defineProperty(Rt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Rt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ae
      }), Object.defineProperty(Rt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: vt
      }), Object.freeze && (Object.freeze(Rt.props), Object.freeze(Rt)), Rt;
    };
    function tr(N, ae, xe, Ae, vt) {
      {
        var st, Dt = {}, Rt = null, Dn = null;
        xe !== void 0 && (wr(xe), Rt = "" + xe), Et(ae) && (wr(ae.key), Rt = "" + ae.key), Ie(ae) && (Dn = ae.ref, Wt(ae, vt));
        for (st in ae)
          Gn.call(ae, st) && !ei.hasOwnProperty(st) && (Dt[st] = ae[st]);
        if (N && N.defaultProps) {
          var un = N.defaultProps;
          for (st in un)
            Dt[st] === void 0 && (Dt[st] = un[st]);
        }
        if (Rt || Dn) {
          var dn = typeof N == "function" ? N.displayName || N.name || "Unknown" : N;
          Rt && on(Dt, dn), Dn && gn(Dt, dn);
        }
        return fn(N, Rt, Dn, vt, Ae, ma.current, Dt);
      }
    }
    var ln = Te.ReactCurrentOwner, qt = Te.ReactDebugCurrentFrame;
    function Xt(N) {
      if (N) {
        var ae = N._owner, xe = Wn(N.type, N._source, ae ? ae.type : null);
        qt.setExtraStackFrame(xe);
      } else
        qt.setExtraStackFrame(null);
    }
    var ya;
    ya = !1;
    function Dr(N) {
      return typeof N == "object" && N !== null && N.$$typeof === s;
    }
    function Oa() {
      {
        if (ln.current) {
          var N = Ue(ln.current.type);
          if (N)
            return `

Check the render method of \`` + N + "`.";
        }
        return "";
      }
    }
    function Xi(N) {
      return "";
    }
    var pl = {};
    function hl(N) {
      {
        var ae = Oa();
        if (!ae) {
          var xe = typeof N == "string" ? N : N.displayName || N.name;
          xe && (ae = `

Check the top-level render call using <` + xe + ">.");
        }
        return ae;
      }
    }
    function wo(N, ae) {
      {
        if (!N._store || N._store.validated || N.key != null)
          return;
        N._store.validated = !0;
        var xe = hl(ae);
        if (pl[xe])
          return;
        pl[xe] = !0;
        var Ae = "";
        N && N._owner && N._owner !== ln.current && (Ae = " It was passed a child from " + Ue(N._owner.type) + "."), Xt(N), re('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', xe, Ae), Xt(null);
      }
    }
    function Do(N, ae) {
      {
        if (typeof N != "object")
          return;
        if (Qn(N))
          for (var xe = 0; xe < N.length; xe++) {
            var Ae = N[xe];
            Dr(Ae) && wo(Ae, ae);
          }
        else if (Dr(N))
          N._store && (N._store.validated = !0);
        else if (N) {
          var vt = se(N);
          if (typeof vt == "function" && vt !== N.entries)
            for (var st = vt.call(N), Dt; !(Dt = st.next()).done; )
              Dr(Dt.value) && wo(Dt.value, ae);
        }
      }
    }
    function vl(N) {
      {
        var ae = N.type;
        if (ae == null || typeof ae == "string")
          return;
        var xe;
        if (typeof ae == "function")
          xe = ae.propTypes;
        else if (typeof ae == "object" && (ae.$$typeof === T || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ae.$$typeof === k))
          xe = ae.propTypes;
        else
          return;
        if (xe) {
          var Ae = Ue(ae);
          er(xe, N.props, "prop", Ae, N);
        } else if (ae.PropTypes !== void 0 && !ya) {
          ya = !0;
          var vt = Ue(ae);
          re("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", vt || "Unknown");
        }
        typeof ae.getDefaultProps == "function" && !ae.getDefaultProps.isReactClassApproved && re("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Lr(N) {
      {
        for (var ae = Object.keys(N.props), xe = 0; xe < ae.length; xe++) {
          var Ae = ae[xe];
          if (Ae !== "children" && Ae !== "key") {
            Xt(N), re("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Ae), Xt(null);
            break;
          }
        }
        N.ref !== null && (Xt(N), re("Invalid attribute `ref` supplied to `React.Fragment`."), Xt(null));
      }
    }
    var Ar = {};
    function sr(N, ae, xe, Ae, vt, st) {
      {
        var Dt = wt(N);
        if (!Dt) {
          var Rt = "";
          (N === void 0 || typeof N == "object" && N !== null && Object.keys(N).length === 0) && (Rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Dn = Xi();
          Dn ? Rt += Dn : Rt += Oa();
          var un;
          N === null ? un = "null" : Qn(N) ? un = "array" : N !== void 0 && N.$$typeof === s ? (un = "<" + (Ue(N.type) || "Unknown") + " />", Rt = " Did you accidentally export a JSX literal instead of a component?") : un = typeof N, re("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", un, Rt);
        }
        var dn = tr(N, ae, xe, vt, st);
        if (dn == null)
          return dn;
        if (Dt) {
          var cr = ae.children;
          if (cr !== void 0)
            if (Ae)
              if (Qn(cr)) {
                for (var ni = 0; ni < cr.length; ni++)
                  Do(cr[ni], N);
                Object.freeze && Object.freeze(cr);
              } else
                re("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Do(cr, N);
        }
        if (Gn.call(ae, "key")) {
          var ri = Ue(N), mt = Object.keys(ae).filter(function(ml) {
            return ml !== "key";
          }), Ct = mt.length > 0 ? "{key: someKey, " + mt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ar[ri + Ct]) {
            var ai = mt.length > 0 ? "{" + mt.join(": ..., ") + ": ...}" : "{}";
            re(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ct, ri, ai, ri), Ar[ri + Ct] = !0;
          }
        }
        return N === v ? Lr(dn) : vl(dn), dn;
      }
    }
    function Ei(N, ae, xe) {
      return sr(N, ae, xe, !0);
    }
    function ti(N, ae, xe) {
      return sr(N, ae, xe, !1);
    }
    var xi = ti, Ti = Ei;
    Uh.Fragment = v, Uh.jsx = xi, Uh.jsxs = Ti;
  }()), Uh;
}
process.env.NODE_ENV === "production" ? qC.exports = YL() : qC.exports = $L();
var Oe = qC.exports, Bh = {}, ZC = { exports: {} }, qa = {}, Gy = { exports: {} }, NC = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Sb;
function WL() {
  return Sb || (Sb = 1, function(l) {
    function s(he, Ne) {
      var ye = he.length;
      he.push(Ne);
      e: for (; 0 < ye; ) {
        var V = ye - 1 >>> 1, te = he[V];
        if (0 < S(te, Ne)) he[V] = Ne, he[ye] = te, ye = V;
        else break e;
      }
    }
    function f(he) {
      return he.length === 0 ? null : he[0];
    }
    function v(he) {
      if (he.length === 0) return null;
      var Ne = he[0], ye = he.pop();
      if (ye !== Ne) {
        he[0] = ye;
        e: for (var V = 0, te = he.length, Ze = te >>> 1; V < Ze; ) {
          var Qe = 2 * (V + 1) - 1, yt = he[Qe], ot = Qe + 1, dt = he[ot];
          if (0 > S(yt, ye)) ot < te && 0 > S(dt, yt) ? (he[V] = dt, he[ot] = ye, V = ot) : (he[V] = yt, he[Qe] = ye, V = Qe);
          else if (ot < te && 0 > S(dt, ye)) he[V] = dt, he[ot] = ye, V = ot;
          else break e;
        }
      }
      return Ne;
    }
    function S(he, Ne) {
      var ye = he.sortIndex - Ne.sortIndex;
      return ye !== 0 ? ye : he.id - Ne.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var R = performance;
      l.unstable_now = function() {
        return R.now();
      };
    } else {
      var m = Date, w = m.now();
      l.unstable_now = function() {
        return m.now() - w;
      };
    }
    var T = [], b = [], M = 1, k = null, A = 3, P = !1, K = !1, ee = !1, se = typeof setTimeout == "function" ? setTimeout : null, Te = typeof clearTimeout == "function" ? clearTimeout : null, re = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function q(he) {
      for (var Ne = f(b); Ne !== null; ) {
        if (Ne.callback === null) v(b);
        else if (Ne.startTime <= he) v(b), Ne.sortIndex = Ne.expirationTime, s(T, Ne);
        else break;
        Ne = f(b);
      }
    }
    function pe(he) {
      if (ee = !1, q(he), !K) if (f(T) !== null) K = !0, tt(de);
      else {
        var Ne = f(b);
        Ne !== null && De(pe, Ne.startTime - he);
      }
    }
    function de(he, Ne) {
      K = !1, ee && (ee = !1, Te(Fe), Fe = -1), P = !0;
      var ye = A;
      try {
        for (q(Ne), k = f(T); k !== null && (!(k.expirationTime > Ne) || he && !jt()); ) {
          var V = k.callback;
          if (typeof V == "function") {
            k.callback = null, A = k.priorityLevel;
            var te = V(k.expirationTime <= Ne);
            Ne = l.unstable_now(), typeof te == "function" ? k.callback = te : k === f(T) && v(T), q(Ne);
          } else v(T);
          k = f(T);
        }
        if (k !== null) var Ze = !0;
        else {
          var Qe = f(b);
          Qe !== null && De(pe, Qe.startTime - Ne), Ze = !1;
        }
        return Ze;
      } finally {
        k = null, A = ye, P = !1;
      }
    }
    var Pe = !1, Ee = null, Fe = -1, Be = 5, wt = -1;
    function jt() {
      return !(l.unstable_now() - wt < Be);
    }
    function ft() {
      if (Ee !== null) {
        var he = l.unstable_now();
        wt = he;
        var Ne = !0;
        try {
          Ne = Ee(!0, he);
        } finally {
          Ne ? Ue() : (Pe = !1, Ee = null);
        }
      } else Pe = !1;
    }
    var Ue;
    if (typeof re == "function") Ue = function() {
      re(ft);
    };
    else if (typeof MessageChannel < "u") {
      var it = new MessageChannel(), Tt = it.port2;
      it.port1.onmessage = ft, Ue = function() {
        Tt.postMessage(null);
      };
    } else Ue = function() {
      se(ft, 0);
    };
    function tt(he) {
      Ee = he, Pe || (Pe = !0, Ue());
    }
    function De(he, Ne) {
      Fe = se(function() {
        he(l.unstable_now());
      }, Ne);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(he) {
      he.callback = null;
    }, l.unstable_continueExecution = function() {
      K || P || (K = !0, tt(de));
    }, l.unstable_forceFrameRate = function(he) {
      0 > he || 125 < he ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Be = 0 < he ? Math.floor(1e3 / he) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return A;
    }, l.unstable_getFirstCallbackNode = function() {
      return f(T);
    }, l.unstable_next = function(he) {
      switch (A) {
        case 1:
        case 2:
        case 3:
          var Ne = 3;
          break;
        default:
          Ne = A;
      }
      var ye = A;
      A = Ne;
      try {
        return he();
      } finally {
        A = ye;
      }
    }, l.unstable_pauseExecution = function() {
    }, l.unstable_requestPaint = function() {
    }, l.unstable_runWithPriority = function(he, Ne) {
      switch (he) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          he = 3;
      }
      var ye = A;
      A = he;
      try {
        return Ne();
      } finally {
        A = ye;
      }
    }, l.unstable_scheduleCallback = function(he, Ne, ye) {
      var V = l.unstable_now();
      switch (typeof ye == "object" && ye !== null ? (ye = ye.delay, ye = typeof ye == "number" && 0 < ye ? V + ye : V) : ye = V, he) {
        case 1:
          var te = -1;
          break;
        case 2:
          te = 250;
          break;
        case 5:
          te = 1073741823;
          break;
        case 4:
          te = 1e4;
          break;
        default:
          te = 5e3;
      }
      return te = ye + te, he = { id: M++, callback: Ne, priorityLevel: he, startTime: ye, expirationTime: te, sortIndex: -1 }, ye > V ? (he.sortIndex = ye, s(b, he), f(T) === null && he === f(b) && (ee ? (Te(Fe), Fe = -1) : ee = !0, De(pe, ye - V))) : (he.sortIndex = te, s(T, he), K || P || (K = !0, tt(de))), he;
    }, l.unstable_shouldYield = jt, l.unstable_wrapCallback = function(he) {
      var Ne = A;
      return function() {
        var ye = A;
        A = Ne;
        try {
          return he.apply(this, arguments);
        } finally {
          A = ye;
        }
      };
    };
  }(NC)), NC;
}
var PC = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cb;
function GL() {
  return Cb || (Cb = 1, function(l) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var s = !1, f = 5;
      function v(me, Ie) {
        var Et = me.length;
        me.push(Ie), m(me, Ie, Et);
      }
      function S(me) {
        return me.length === 0 ? null : me[0];
      }
      function R(me) {
        if (me.length === 0)
          return null;
        var Ie = me[0], Et = me.pop();
        return Et !== Ie && (me[0] = Et, w(me, Et, 0)), Ie;
      }
      function m(me, Ie, Et) {
        for (var Wt = Et; Wt > 0; ) {
          var on = Wt - 1 >>> 1, gn = me[on];
          if (T(gn, Ie) > 0)
            me[on] = Ie, me[Wt] = gn, Wt = on;
          else
            return;
        }
      }
      function w(me, Ie, Et) {
        for (var Wt = Et, on = me.length, gn = on >>> 1; Wt < gn; ) {
          var fn = (Wt + 1) * 2 - 1, tr = me[fn], ln = fn + 1, qt = me[ln];
          if (T(tr, Ie) < 0)
            ln < on && T(qt, tr) < 0 ? (me[Wt] = qt, me[ln] = Ie, Wt = ln) : (me[Wt] = tr, me[fn] = Ie, Wt = fn);
          else if (ln < on && T(qt, Ie) < 0)
            me[Wt] = qt, me[ln] = Ie, Wt = ln;
          else
            return;
        }
      }
      function T(me, Ie) {
        var Et = me.sortIndex - Ie.sortIndex;
        return Et !== 0 ? Et : me.id - Ie.id;
      }
      var b = 1, M = 2, k = 3, A = 4, P = 5;
      function K(me, Ie) {
      }
      var ee = typeof performance == "object" && typeof performance.now == "function";
      if (ee) {
        var se = performance;
        l.unstable_now = function() {
          return se.now();
        };
      } else {
        var Te = Date, re = Te.now();
        l.unstable_now = function() {
          return Te.now() - re;
        };
      }
      var q = 1073741823, pe = -1, de = 250, Pe = 5e3, Ee = 1e4, Fe = q, Be = [], wt = [], jt = 1, ft = null, Ue = k, it = !1, Tt = !1, tt = !1, De = typeof setTimeout == "function" ? setTimeout : null, he = typeof clearTimeout == "function" ? clearTimeout : null, Ne = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ye(me) {
        for (var Ie = S(wt); Ie !== null; ) {
          if (Ie.callback === null)
            R(wt);
          else if (Ie.startTime <= me)
            R(wt), Ie.sortIndex = Ie.expirationTime, v(Be, Ie);
          else
            return;
          Ie = S(wt);
        }
      }
      function V(me) {
        if (tt = !1, ye(me), !Tt)
          if (S(Be) !== null)
            Tt = !0, Pn(te);
          else {
            var Ie = S(wt);
            Ie !== null && wr(V, Ie.startTime - me);
          }
      }
      function te(me, Ie) {
        Tt = !1, tt && (tt = !1, ma()), it = !0;
        var Et = Ue;
        try {
          var Wt;
          if (!s) return Ze(me, Ie);
        } finally {
          ft = null, Ue = Et, it = !1;
        }
      }
      function Ze(me, Ie) {
        var Et = Ie;
        for (ye(Et), ft = S(Be); ft !== null && !(ft.expirationTime > Et && (!me || Si())); ) {
          var Wt = ft.callback;
          if (typeof Wt == "function") {
            ft.callback = null, Ue = ft.priorityLevel;
            var on = ft.expirationTime <= Et, gn = Wt(on);
            Et = l.unstable_now(), typeof gn == "function" ? ft.callback = gn : ft === S(Be) && R(Be), ye(Et);
          } else
            R(Be);
          ft = S(Be);
        }
        if (ft !== null)
          return !0;
        var fn = S(wt);
        return fn !== null && wr(V, fn.startTime - Et), !1;
      }
      function Qe(me, Ie) {
        switch (me) {
          case b:
          case M:
          case k:
          case A:
          case P:
            break;
          default:
            me = k;
        }
        var Et = Ue;
        Ue = me;
        try {
          return Ie();
        } finally {
          Ue = Et;
        }
      }
      function yt(me) {
        var Ie;
        switch (Ue) {
          case b:
          case M:
          case k:
            Ie = k;
            break;
          default:
            Ie = Ue;
            break;
        }
        var Et = Ue;
        Ue = Ie;
        try {
          return me();
        } finally {
          Ue = Et;
        }
      }
      function ot(me) {
        var Ie = Ue;
        return function() {
          var Et = Ue;
          Ue = Ie;
          try {
            return me.apply(this, arguments);
          } finally {
            Ue = Et;
          }
        };
      }
      function dt(me, Ie, Et) {
        var Wt = l.unstable_now(), on;
        if (typeof Et == "object" && Et !== null) {
          var gn = Et.delay;
          typeof gn == "number" && gn > 0 ? on = Wt + gn : on = Wt;
        } else
          on = Wt;
        var fn;
        switch (me) {
          case b:
            fn = pe;
            break;
          case M:
            fn = de;
            break;
          case P:
            fn = Fe;
            break;
          case A:
            fn = Ee;
            break;
          case k:
          default:
            fn = Pe;
            break;
        }
        var tr = on + fn, ln = {
          id: jt++,
          callback: Ie,
          priorityLevel: me,
          startTime: on,
          expirationTime: tr,
          sortIndex: -1
        };
        return on > Wt ? (ln.sortIndex = on, v(wt, ln), S(Be) === null && ln === S(wt) && (tt ? ma() : tt = !0, wr(V, on - Wt))) : (ln.sortIndex = tr, v(Be, ln), !Tt && !it && (Tt = !0, Pn(te))), ln;
      }
      function gt() {
      }
      function ht() {
        !Tt && !it && (Tt = !0, Pn(te));
      }
      function Pt() {
        return S(Be);
      }
      function Kt(me) {
        me.callback = null;
      }
      function Rr() {
        return Ue;
      }
      var bn = !1, ur = null, Wn = -1, Gn = f, qr = -1;
      function Si() {
        var me = l.unstable_now() - qr;
        return !(me < Gn);
      }
      function va() {
      }
      function er(me) {
        if (me < 0 || me > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        me > 0 ? Gn = Math.floor(1e3 / me) : Gn = f;
      }
      var wn = function() {
        if (ur !== null) {
          var me = l.unstable_now();
          qr = me;
          var Ie = !0, Et = !0;
          try {
            Et = ur(Ie, me);
          } finally {
            Et ? Qn() : (bn = !1, ur = null);
          }
        } else
          bn = !1;
      }, Qn;
      if (typeof Ne == "function")
        Qn = function() {
          Ne(wn);
        };
      else if (typeof MessageChannel < "u") {
        var br = new MessageChannel(), Ja = br.port2;
        br.port1.onmessage = wn, Qn = function() {
          Ja.postMessage(null);
        };
      } else
        Qn = function() {
          De(wn, 0);
        };
      function Pn(me) {
        ur = me, bn || (bn = !0, Qn());
      }
      function wr(me, Ie) {
        Wn = De(function() {
          me(l.unstable_now());
        }, Ie);
      }
      function ma() {
        he(Wn), Wn = -1;
      }
      var ei = va, Ci = null;
      l.unstable_IdlePriority = P, l.unstable_ImmediatePriority = b, l.unstable_LowPriority = A, l.unstable_NormalPriority = k, l.unstable_Profiling = Ci, l.unstable_UserBlockingPriority = M, l.unstable_cancelCallback = Kt, l.unstable_continueExecution = ht, l.unstable_forceFrameRate = er, l.unstable_getCurrentPriorityLevel = Rr, l.unstable_getFirstCallbackNode = Pt, l.unstable_next = yt, l.unstable_pauseExecution = gt, l.unstable_requestPaint = ei, l.unstable_runWithPriority = Qe, l.unstable_scheduleCallback = dt, l.unstable_shouldYield = Si, l.unstable_wrapCallback = ot, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(PC)), PC;
}
var Eb;
function Ow() {
  return Eb || (Eb = 1, process.env.NODE_ENV === "production" ? Gy.exports = WL() : Gy.exports = GL()), Gy.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xb;
function QL() {
  if (xb) return qa;
  xb = 1;
  var l = ge, s = Ow();
  function f(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, o = 1; o < arguments.length; o++) r += "&args[]=" + encodeURIComponent(arguments[o]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), S = {};
  function R(n, r) {
    m(n, r), m(n + "Capture", r);
  }
  function m(n, r) {
    for (S[n] = r, n = 0; n < r.length; n++) v.add(r[n]);
  }
  var w = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), T = Object.prototype.hasOwnProperty, b = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, M = {}, k = {};
  function A(n) {
    return T.call(k, n) ? !0 : T.call(M, n) ? !1 : b.test(n) ? k[n] = !0 : (M[n] = !0, !1);
  }
  function P(n, r, o, c) {
    if (o !== null && o.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return c ? !1 : o !== null ? !o.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function K(n, r, o, c) {
    if (r === null || typeof r > "u" || P(n, r, o, c)) return !0;
    if (c) return !1;
    if (o !== null) switch (o.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function ee(n, r, o, c, p, y, x) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = c, this.attributeNamespace = p, this.mustUseProperty = o, this.propertyName = n, this.type = r, this.sanitizeURL = y, this.removeEmptyString = x;
  }
  var se = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    se[n] = new ee(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    se[r] = new ee(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    se[n] = new ee(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    se[n] = new ee(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    se[n] = new ee(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    se[n] = new ee(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    se[n] = new ee(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    se[n] = new ee(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    se[n] = new ee(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Te = /[\-:]([a-z])/g;
  function re(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Te,
      re
    );
    se[r] = new ee(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Te, re);
    se[r] = new ee(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Te, re);
    se[r] = new ee(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    se[n] = new ee(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), se.xlinkHref = new ee("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    se[n] = new ee(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function q(n, r, o, c) {
    var p = se.hasOwnProperty(r) ? se[r] : null;
    (p !== null ? p.type !== 0 : c || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (K(r, o, p, c) && (o = null), c || p === null ? A(r) && (o === null ? n.removeAttribute(r) : n.setAttribute(r, "" + o)) : p.mustUseProperty ? n[p.propertyName] = o === null ? p.type === 3 ? !1 : "" : o : (r = p.attributeName, c = p.attributeNamespace, o === null ? n.removeAttribute(r) : (p = p.type, o = p === 3 || p === 4 && o === !0 ? "" : "" + o, c ? n.setAttributeNS(c, r, o) : n.setAttribute(r, o))));
  }
  var pe = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, de = Symbol.for("react.element"), Pe = Symbol.for("react.portal"), Ee = Symbol.for("react.fragment"), Fe = Symbol.for("react.strict_mode"), Be = Symbol.for("react.profiler"), wt = Symbol.for("react.provider"), jt = Symbol.for("react.context"), ft = Symbol.for("react.forward_ref"), Ue = Symbol.for("react.suspense"), it = Symbol.for("react.suspense_list"), Tt = Symbol.for("react.memo"), tt = Symbol.for("react.lazy"), De = Symbol.for("react.offscreen"), he = Symbol.iterator;
  function Ne(n) {
    return n === null || typeof n != "object" ? null : (n = he && n[he] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ye = Object.assign, V;
  function te(n) {
    if (V === void 0) try {
      throw Error();
    } catch (o) {
      var r = o.stack.trim().match(/\n( *(at )?)/);
      V = r && r[1] || "";
    }
    return `
` + V + n;
  }
  var Ze = !1;
  function Qe(n, r) {
    if (!n || Ze) return "";
    Ze = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (G) {
          var c = G;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (G) {
          c = G;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (G) {
          c = G;
        }
        n();
      }
    } catch (G) {
      if (G && c && typeof G.stack == "string") {
        for (var p = G.stack.split(`
`), y = c.stack.split(`
`), x = p.length - 1, O = y.length - 1; 1 <= x && 0 <= O && p[x] !== y[O]; ) O--;
        for (; 1 <= x && 0 <= O; x--, O--) if (p[x] !== y[O]) {
          if (x !== 1 || O !== 1)
            do
              if (x--, O--, 0 > O || p[x] !== y[O]) {
                var U = `
` + p[x].replace(" at new ", " at ");
                return n.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", n.displayName)), U;
              }
            while (1 <= x && 0 <= O);
          break;
        }
      }
    } finally {
      Ze = !1, Error.prepareStackTrace = o;
    }
    return (n = n ? n.displayName || n.name : "") ? te(n) : "";
  }
  function yt(n) {
    switch (n.tag) {
      case 5:
        return te(n.type);
      case 16:
        return te("Lazy");
      case 13:
        return te("Suspense");
      case 19:
        return te("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Qe(n.type, !1), n;
      case 11:
        return n = Qe(n.type.render, !1), n;
      case 1:
        return n = Qe(n.type, !0), n;
      default:
        return "";
    }
  }
  function ot(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case Ee:
        return "Fragment";
      case Pe:
        return "Portal";
      case Be:
        return "Profiler";
      case Fe:
        return "StrictMode";
      case Ue:
        return "Suspense";
      case it:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case jt:
        return (n.displayName || "Context") + ".Consumer";
      case wt:
        return (n._context.displayName || "Context") + ".Provider";
      case ft:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Tt:
        return r = n.displayName || null, r !== null ? r : ot(n.type) || "Memo";
      case tt:
        r = n._payload, n = n._init;
        try {
          return ot(n(r));
        } catch {
        }
    }
    return null;
  }
  function dt(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return ot(r);
      case 8:
        return r === Fe ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function gt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function ht(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Pt(n) {
    var r = ht(n) ? "checked" : "value", o = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), c = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
      var p = o.get, y = o.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return p.call(this);
      }, set: function(x) {
        c = "" + x, y.call(this, x);
      } }), Object.defineProperty(n, r, { enumerable: o.enumerable }), { getValue: function() {
        return c;
      }, setValue: function(x) {
        c = "" + x;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Kt(n) {
    n._valueTracker || (n._valueTracker = Pt(n));
  }
  function Rr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var o = r.getValue(), c = "";
    return n && (c = ht(n) ? n.checked ? "true" : "false" : n.value), n = c, n !== o ? (r.setValue(n), !0) : !1;
  }
  function bn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function ur(n, r) {
    var o = r.checked;
    return ye({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: o ?? n._wrapperState.initialChecked });
  }
  function Wn(n, r) {
    var o = r.defaultValue == null ? "" : r.defaultValue, c = r.checked != null ? r.checked : r.defaultChecked;
    o = gt(r.value != null ? r.value : o), n._wrapperState = { initialChecked: c, initialValue: o, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Gn(n, r) {
    r = r.checked, r != null && q(n, "checked", r, !1);
  }
  function qr(n, r) {
    Gn(n, r);
    var o = gt(r.value), c = r.type;
    if (o != null) c === "number" ? (o === 0 && n.value === "" || n.value != o) && (n.value = "" + o) : n.value !== "" + o && (n.value = "" + o);
    else if (c === "submit" || c === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? va(n, r.type, o) : r.hasOwnProperty("defaultValue") && va(n, r.type, gt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Si(n, r, o) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var c = r.type;
      if (!(c !== "submit" && c !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, o || r === n.value || (n.value = r), n.defaultValue = r;
    }
    o = n.name, o !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, o !== "" && (n.name = o);
  }
  function va(n, r, o) {
    (r !== "number" || bn(n.ownerDocument) !== n) && (o == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + o && (n.defaultValue = "" + o));
  }
  var er = Array.isArray;
  function wn(n, r, o, c) {
    if (n = n.options, r) {
      r = {};
      for (var p = 0; p < o.length; p++) r["$" + o[p]] = !0;
      for (o = 0; o < n.length; o++) p = r.hasOwnProperty("$" + n[o].value), n[o].selected !== p && (n[o].selected = p), p && c && (n[o].defaultSelected = !0);
    } else {
      for (o = "" + gt(o), r = null, p = 0; p < n.length; p++) {
        if (n[p].value === o) {
          n[p].selected = !0, c && (n[p].defaultSelected = !0);
          return;
        }
        r !== null || n[p].disabled || (r = n[p]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Qn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(f(91));
    return ye({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function br(n, r) {
    var o = r.value;
    if (o == null) {
      if (o = r.children, r = r.defaultValue, o != null) {
        if (r != null) throw Error(f(92));
        if (er(o)) {
          if (1 < o.length) throw Error(f(93));
          o = o[0];
        }
        r = o;
      }
      r == null && (r = ""), o = r;
    }
    n._wrapperState = { initialValue: gt(o) };
  }
  function Ja(n, r) {
    var o = gt(r.value), c = gt(r.defaultValue);
    o != null && (o = "" + o, o !== n.value && (n.value = o), r.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o)), c != null && (n.defaultValue = "" + c);
  }
  function Pn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function wr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function ma(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? wr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ei, Ci = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, o, c, p) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, o, c, p);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ei = ei || document.createElement("div"), ei.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ei.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function me(n, r) {
    if (r) {
      var o = n.firstChild;
      if (o && o === n.lastChild && o.nodeType === 3) {
        o.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Ie = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Et = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ie).forEach(function(n) {
    Et.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Ie[r] = Ie[n];
    });
  });
  function Wt(n, r, o) {
    return r == null || typeof r == "boolean" || r === "" ? "" : o || typeof r != "number" || r === 0 || Ie.hasOwnProperty(n) && Ie[n] ? ("" + r).trim() : r + "px";
  }
  function on(n, r) {
    n = n.style;
    for (var o in r) if (r.hasOwnProperty(o)) {
      var c = o.indexOf("--") === 0, p = Wt(o, r[o], c);
      o === "float" && (o = "cssFloat"), c ? n.setProperty(o, p) : n[o] = p;
    }
  }
  var gn = ye({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function fn(n, r) {
    if (r) {
      if (gn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(f(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(f(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(f(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(f(62));
    }
  }
  function tr(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ln = null;
  function qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Xt = null, ya = null, Dr = null;
  function Oa(n) {
    if (n = We(n)) {
      if (typeof Xt != "function") throw Error(f(280));
      var r = n.stateNode;
      r && (r = Cn(r), Xt(n.stateNode, n.type, r));
    }
  }
  function Xi(n) {
    ya ? Dr ? Dr.push(n) : Dr = [n] : ya = n;
  }
  function pl() {
    if (ya) {
      var n = ya, r = Dr;
      if (Dr = ya = null, Oa(n), r) for (n = 0; n < r.length; n++) Oa(r[n]);
    }
  }
  function hl(n, r) {
    return n(r);
  }
  function wo() {
  }
  var Do = !1;
  function vl(n, r, o) {
    if (Do) return n(r, o);
    Do = !0;
    try {
      return hl(n, r, o);
    } finally {
      Do = !1, (ya !== null || Dr !== null) && (wo(), pl());
    }
  }
  function Lr(n, r) {
    var o = n.stateNode;
    if (o === null) return null;
    var c = Cn(o);
    if (c === null) return null;
    o = c[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (c = !c.disabled) || (n = n.type, c = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !c;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (o && typeof o != "function") throw Error(f(231, r, typeof o));
    return o;
  }
  var Ar = !1;
  if (w) try {
    var sr = {};
    Object.defineProperty(sr, "passive", { get: function() {
      Ar = !0;
    } }), window.addEventListener("test", sr, sr), window.removeEventListener("test", sr, sr);
  } catch {
    Ar = !1;
  }
  function Ei(n, r, o, c, p, y, x, O, U) {
    var G = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(o, G);
    } catch (le) {
      this.onError(le);
    }
  }
  var ti = !1, xi = null, Ti = !1, N = null, ae = { onError: function(n) {
    ti = !0, xi = n;
  } };
  function xe(n, r, o, c, p, y, x, O, U) {
    ti = !1, xi = null, Ei.apply(ae, arguments);
  }
  function Ae(n, r, o, c, p, y, x, O, U) {
    if (xe.apply(this, arguments), ti) {
      if (ti) {
        var G = xi;
        ti = !1, xi = null;
      } else throw Error(f(198));
      Ti || (Ti = !0, N = G);
    }
  }
  function vt(n) {
    var r = n, o = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (o = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? o : null;
  }
  function st(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Dt(n) {
    if (vt(n) !== n) throw Error(f(188));
  }
  function Rt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = vt(n), r === null) throw Error(f(188));
      return r !== n ? null : n;
    }
    for (var o = n, c = r; ; ) {
      var p = o.return;
      if (p === null) break;
      var y = p.alternate;
      if (y === null) {
        if (c = p.return, c !== null) {
          o = c;
          continue;
        }
        break;
      }
      if (p.child === y.child) {
        for (y = p.child; y; ) {
          if (y === o) return Dt(p), n;
          if (y === c) return Dt(p), r;
          y = y.sibling;
        }
        throw Error(f(188));
      }
      if (o.return !== c.return) o = p, c = y;
      else {
        for (var x = !1, O = p.child; O; ) {
          if (O === o) {
            x = !0, o = p, c = y;
            break;
          }
          if (O === c) {
            x = !0, c = p, o = y;
            break;
          }
          O = O.sibling;
        }
        if (!x) {
          for (O = y.child; O; ) {
            if (O === o) {
              x = !0, o = y, c = p;
              break;
            }
            if (O === c) {
              x = !0, c = y, o = p;
              break;
            }
            O = O.sibling;
          }
          if (!x) throw Error(f(189));
        }
      }
      if (o.alternate !== c) throw Error(f(190));
    }
    if (o.tag !== 3) throw Error(f(188));
    return o.stateNode.current === o ? n : r;
  }
  function Dn(n) {
    return n = Rt(n), n !== null ? un(n) : null;
  }
  function un(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = un(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var dn = s.unstable_scheduleCallback, cr = s.unstable_cancelCallback, ni = s.unstable_shouldYield, ri = s.unstable_requestPaint, mt = s.unstable_now, Ct = s.unstable_getCurrentPriorityLevel, ai = s.unstable_ImmediatePriority, ml = s.unstable_UserBlockingPriority, yl = s.unstable_NormalPriority, ko = s.unstable_LowPriority, du = s.unstable_IdlePriority, _o = null, Xr = null;
  function ms(n) {
    if (Xr && typeof Xr.onCommitFiberRoot == "function") try {
      Xr.onCommitFiberRoot(_o, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Nr = Math.clz32 ? Math.clz32 : pu, zc = Math.log, jc = Math.LN2;
  function pu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (zc(n) / jc | 0) | 0;
  }
  var Mo = 64, ga = 4194304;
  function ii(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function oi(n, r) {
    var o = n.pendingLanes;
    if (o === 0) return 0;
    var c = 0, p = n.suspendedLanes, y = n.pingedLanes, x = o & 268435455;
    if (x !== 0) {
      var O = x & ~p;
      O !== 0 ? c = ii(O) : (y &= x, y !== 0 && (c = ii(y)));
    } else x = o & ~p, x !== 0 ? c = ii(x) : y !== 0 && (c = ii(y));
    if (c === 0) return 0;
    if (r !== 0 && r !== c && !(r & p) && (p = c & -c, y = r & -r, p >= y || p === 16 && (y & 4194240) !== 0)) return r;
    if (c & 4 && (c |= o & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= c; 0 < r; ) o = 31 - Nr(r), p = 1 << o, c |= n[o], r &= ~p;
    return c;
  }
  function hu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function gl(n, r) {
    for (var o = n.suspendedLanes, c = n.pingedLanes, p = n.expirationTimes, y = n.pendingLanes; 0 < y; ) {
      var x = 31 - Nr(y), O = 1 << x, U = p[x];
      U === -1 ? (!(O & o) || O & c) && (p[x] = hu(O, r)) : U <= r && (n.expiredLanes |= O), y &= ~O;
    }
  }
  function Oo(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function vu() {
    var n = Mo;
    return Mo <<= 1, !(Mo & 4194240) && (Mo = 64), n;
  }
  function mu(n) {
    for (var r = [], o = 0; 31 > o; o++) r.push(n);
    return r;
  }
  function Zi(n, r, o) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Nr(r), n[r] = o;
  }
  function Md(n, r) {
    var o = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var c = n.eventTimes;
    for (n = n.expirationTimes; 0 < o; ) {
      var p = 31 - Nr(o), y = 1 << p;
      r[p] = 0, c[p] = -1, n[p] = -1, o &= ~y;
    }
  }
  function Ji(n, r) {
    var o = n.entangledLanes |= r;
    for (n = n.entanglements; o; ) {
      var c = 31 - Nr(o), p = 1 << c;
      p & r | n[c] & r && (n[c] |= r), o &= ~p;
    }
  }
  var Ft = 0;
  function yu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Ut, ys, Ri, lt, gu, fr = !1, bi = [], Pr = null, wi = null, pn = null, Zt = /* @__PURE__ */ new Map(), Lo = /* @__PURE__ */ new Map(), Kn = [], Ur = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function La(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Pr = null;
        break;
      case "dragenter":
      case "dragleave":
        wi = null;
        break;
      case "mouseover":
      case "mouseout":
        pn = null;
        break;
      case "pointerover":
      case "pointerout":
        Zt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Lo.delete(r.pointerId);
    }
  }
  function Sl(n, r, o, c, p, y) {
    return n === null || n.nativeEvent !== y ? (n = { blockedOn: r, domEventName: o, eventSystemFlags: c, nativeEvent: y, targetContainers: [p] }, r !== null && (r = We(r), r !== null && ys(r)), n) : (n.eventSystemFlags |= c, r = n.targetContainers, p !== null && r.indexOf(p) === -1 && r.push(p), n);
  }
  function gs(n, r, o, c, p) {
    switch (r) {
      case "focusin":
        return Pr = Sl(Pr, n, r, o, c, p), !0;
      case "dragenter":
        return wi = Sl(wi, n, r, o, c, p), !0;
      case "mouseover":
        return pn = Sl(pn, n, r, o, c, p), !0;
      case "pointerover":
        var y = p.pointerId;
        return Zt.set(y, Sl(Zt.get(y) || null, n, r, o, c, p)), !0;
      case "gotpointercapture":
        return y = p.pointerId, Lo.set(y, Sl(Lo.get(y) || null, n, r, o, c, p)), !0;
    }
    return !1;
  }
  function Ss(n) {
    var r = kl(n.target);
    if (r !== null) {
      var o = vt(r);
      if (o !== null) {
        if (r = o.tag, r === 13) {
          if (r = st(o), r !== null) {
            n.blockedOn = r, gu(n.priority, function() {
              Ri(o);
            });
            return;
          }
        } else if (r === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Ao(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var o = Eu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (o === null) {
        o = n.nativeEvent;
        var c = new o.constructor(o.type, o);
        ln = c, o.target.dispatchEvent(c), ln = null;
      } else return r = We(o), r !== null && ys(r), n.blockedOn = o, !1;
      r.shift();
    }
    return !0;
  }
  function Cl(n, r, o) {
    Ao(n) && o.delete(r);
  }
  function Od() {
    fr = !1, Pr !== null && Ao(Pr) && (Pr = null), wi !== null && Ao(wi) && (wi = null), pn !== null && Ao(pn) && (pn = null), Zt.forEach(Cl), Lo.forEach(Cl);
  }
  function Aa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, fr || (fr = !0, s.unstable_scheduleCallback(s.unstable_NormalPriority, Od)));
  }
  function li(n) {
    function r(p) {
      return Aa(p, n);
    }
    if (0 < bi.length) {
      Aa(bi[0], n);
      for (var o = 1; o < bi.length; o++) {
        var c = bi[o];
        c.blockedOn === n && (c.blockedOn = null);
      }
    }
    for (Pr !== null && Aa(Pr, n), wi !== null && Aa(wi, n), pn !== null && Aa(pn, n), Zt.forEach(r), Lo.forEach(r), o = 0; o < Kn.length; o++) c = Kn[o], c.blockedOn === n && (c.blockedOn = null);
    for (; 0 < Kn.length && (o = Kn[0], o.blockedOn === null); ) Ss(o), o.blockedOn === null && Kn.shift();
  }
  var Di = pe.ReactCurrentBatchConfig, Na = !0;
  function Su(n, r, o, c) {
    var p = Ft, y = Di.transition;
    Di.transition = null;
    try {
      Ft = 1, No(n, r, o, c);
    } finally {
      Ft = p, Di.transition = y;
    }
  }
  function Cu(n, r, o, c) {
    var p = Ft, y = Di.transition;
    Di.transition = null;
    try {
      Ft = 4, No(n, r, o, c);
    } finally {
      Ft = p, Di.transition = y;
    }
  }
  function No(n, r, o, c) {
    if (Na) {
      var p = Eu(n, r, o, c);
      if (p === null) Xc(n, r, c, El, o), La(n, c);
      else if (gs(p, n, r, o, c)) c.stopPropagation();
      else if (La(n, c), r & 4 && -1 < Ur.indexOf(n)) {
        for (; p !== null; ) {
          var y = We(p);
          if (y !== null && Ut(y), y = Eu(n, r, o, c), y === null && Xc(n, r, c, El, o), y === p) break;
          p = y;
        }
        p !== null && c.stopPropagation();
      } else Xc(n, r, c, null, o);
    }
  }
  var El = null;
  function Eu(n, r, o, c) {
    if (El = null, n = qt(c), n = kl(n), n !== null) if (r = vt(n), r === null) n = null;
    else if (o = r.tag, o === 13) {
      if (n = st(r), n !== null) return n;
      n = null;
    } else if (o === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return El = n, null;
  }
  function xu(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Ct()) {
          case ai:
            return 1;
          case ml:
            return 4;
          case yl:
          case ko:
            return 16;
          case du:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ui = null, E = null, L = null;
  function W() {
    if (L) return L;
    var n, r = E, o = r.length, c, p = "value" in ui ? ui.value : ui.textContent, y = p.length;
    for (n = 0; n < o && r[n] === p[n]; n++) ;
    var x = o - n;
    for (c = 1; c <= x && r[o - c] === p[y - c]; c++) ;
    return L = p.slice(n, 1 < c ? 1 - c : void 0);
  }
  function X(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function ve() {
    return !0;
  }
  function Ke() {
    return !1;
  }
  function Ce(n) {
    function r(o, c, p, y, x) {
      this._reactName = o, this._targetInst = p, this.type = c, this.nativeEvent = y, this.target = x, this.currentTarget = null;
      for (var O in n) n.hasOwnProperty(O) && (o = n[O], this[O] = o ? o(y) : y[O]);
      return this.isDefaultPrevented = (y.defaultPrevented != null ? y.defaultPrevented : y.returnValue === !1) ? ve : Ke, this.isPropagationStopped = Ke, this;
    }
    return ye(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var o = this.nativeEvent;
      o && (o.preventDefault ? o.preventDefault() : typeof o.returnValue != "unknown" && (o.returnValue = !1), this.isDefaultPrevented = ve);
    }, stopPropagation: function() {
      var o = this.nativeEvent;
      o && (o.stopPropagation ? o.stopPropagation() : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0), this.isPropagationStopped = ve);
    }, persist: function() {
    }, isPersistent: ve }), r;
  }
  var Je = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, kt = Ce(Je), Vt = ye({}, Je, { view: 0, detail: 0 }), sn = Ce(Vt), Jt, xt, en, Sn = ye({}, Vt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ud, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== en && (en && n.type === "mousemove" ? (Jt = n.screenX - en.screenX, xt = n.screenY - en.screenY) : xt = Jt = 0, en = n), Jt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : xt;
  } }), Po = Ce(Sn), Cs = ye({}, Sn, { dataTransfer: 0 }), eo = Ce(Cs), Es = ye({}, Vt, { relatedTarget: 0 }), xl = Ce(Es), Ld = ye({}, Je, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Fc = Ce(Ld), Ad = ye({}, Je, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), nv = Ce(Ad), Nd = ye({}, Je, { data: 0 }), Pd = Ce(Nd), rv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, av = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, gg = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function to(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = gg[n]) ? !!r[n] : !1;
  }
  function Ud() {
    return to;
  }
  var Vd = ye({}, Vt, { key: function(n) {
    if (n.key) {
      var r = rv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = X(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? av[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ud, charCode: function(n) {
    return n.type === "keypress" ? X(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? X(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), zd = Ce(Vd), jd = ye({}, Sn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), iv = Ce(jd), Hc = ye({}, Vt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ud }), ov = Ce(Hc), Zr = ye({}, Je, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), no = Ce(Zr), Un = ye({}, Sn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ro = Ce(Un), Fd = [9, 13, 27, 32], Tu = w && "CompositionEvent" in window, xs = null;
  w && "documentMode" in document && (xs = document.documentMode);
  var Ts = w && "TextEvent" in window && !xs, lv = w && (!Tu || xs && 8 < xs && 11 >= xs), uv = " ", Bc = !1;
  function sv(n, r) {
    switch (n) {
      case "keyup":
        return Fd.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function cv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var Ru = !1;
  function fv(n, r) {
    switch (n) {
      case "compositionend":
        return cv(r);
      case "keypress":
        return r.which !== 32 ? null : (Bc = !0, uv);
      case "textInput":
        return n = r.data, n === uv && Bc ? null : n;
      default:
        return null;
    }
  }
  function Sg(n, r) {
    if (Ru) return n === "compositionend" || !Tu && sv(n, r) ? (n = W(), L = E = ui = null, Ru = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return lv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Cg = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function dv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Cg[n.type] : r === "textarea";
  }
  function Hd(n, r, o, c) {
    Xi(c), r = _s(r, "onChange"), 0 < r.length && (o = new kt("onChange", "change", null, o, c), n.push({ event: o, listeners: r }));
  }
  var ki = null, Tl = null;
  function pv(n) {
    wl(n, 0);
  }
  function Rs(n) {
    var r = ci(n);
    if (Rr(r)) return n;
  }
  function Eg(n, r) {
    if (n === "change") return r;
  }
  var hv = !1;
  if (w) {
    var Bd;
    if (w) {
      var Id = "oninput" in document;
      if (!Id) {
        var vv = document.createElement("div");
        vv.setAttribute("oninput", "return;"), Id = typeof vv.oninput == "function";
      }
      Bd = Id;
    } else Bd = !1;
    hv = Bd && (!document.documentMode || 9 < document.documentMode);
  }
  function mv() {
    ki && (ki.detachEvent("onpropertychange", yv), Tl = ki = null);
  }
  function yv(n) {
    if (n.propertyName === "value" && Rs(Tl)) {
      var r = [];
      Hd(r, Tl, n, qt(n)), vl(pv, r);
    }
  }
  function xg(n, r, o) {
    n === "focusin" ? (mv(), ki = r, Tl = o, ki.attachEvent("onpropertychange", yv)) : n === "focusout" && mv();
  }
  function gv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Rs(Tl);
  }
  function Tg(n, r) {
    if (n === "click") return Rs(r);
  }
  function Sv(n, r) {
    if (n === "input" || n === "change") return Rs(r);
  }
  function Rg(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var si = typeof Object.is == "function" ? Object.is : Rg;
  function bs(n, r) {
    if (si(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var o = Object.keys(n), c = Object.keys(r);
    if (o.length !== c.length) return !1;
    for (c = 0; c < o.length; c++) {
      var p = o[c];
      if (!T.call(r, p) || !si(n[p], r[p])) return !1;
    }
    return !0;
  }
  function Cv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function Ic(n, r) {
    var o = Cv(n);
    n = 0;
    for (var c; o; ) {
      if (o.nodeType === 3) {
        if (c = n + o.textContent.length, n <= r && c >= r) return { node: o, offset: r - n };
        n = c;
      }
      e: {
        for (; o; ) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = Cv(o);
    }
  }
  function Uo(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Uo(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ws() {
    for (var n = window, r = bn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var o = typeof r.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o) n = r.contentWindow;
      else break;
      r = bn(n.document);
    }
    return r;
  }
  function Yc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function bu(n) {
    var r = ws(), o = n.focusedElem, c = n.selectionRange;
    if (r !== o && o && o.ownerDocument && Uo(o.ownerDocument.documentElement, o)) {
      if (c !== null && Yc(o)) {
        if (r = c.start, n = c.end, n === void 0 && (n = r), "selectionStart" in o) o.selectionStart = r, o.selectionEnd = Math.min(n, o.value.length);
        else if (n = (r = o.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var p = o.textContent.length, y = Math.min(c.start, p);
          c = c.end === void 0 ? y : Math.min(c.end, p), !n.extend && y > c && (p = c, c = y, y = p), p = Ic(o, y);
          var x = Ic(
            o,
            c
          );
          p && x && (n.rangeCount !== 1 || n.anchorNode !== p.node || n.anchorOffset !== p.offset || n.focusNode !== x.node || n.focusOffset !== x.offset) && (r = r.createRange(), r.setStart(p.node, p.offset), n.removeAllRanges(), y > c ? (n.addRange(r), n.extend(x.node, x.offset)) : (r.setEnd(x.node, x.offset), n.addRange(r)));
        }
      }
      for (r = [], n = o; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < r.length; o++) n = r[o], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var bg = w && "documentMode" in document && 11 >= document.documentMode, wu = null, Yd = null, Ds = null, $d = !1;
  function Wd(n, r, o) {
    var c = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    $d || wu == null || wu !== bn(c) || (c = wu, "selectionStart" in c && Yc(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = { anchorNode: c.anchorNode, anchorOffset: c.anchorOffset, focusNode: c.focusNode, focusOffset: c.focusOffset }), Ds && bs(Ds, c) || (Ds = c, c = _s(Yd, "onSelect"), 0 < c.length && (r = new kt("onSelect", "select", null, r, o), n.push({ event: r, listeners: c }), r.target = wu)));
  }
  function $c(n, r) {
    var o = {};
    return o[n.toLowerCase()] = r.toLowerCase(), o["Webkit" + n] = "webkit" + r, o["Moz" + n] = "moz" + r, o;
  }
  var Rl = { animationend: $c("Animation", "AnimationEnd"), animationiteration: $c("Animation", "AnimationIteration"), animationstart: $c("Animation", "AnimationStart"), transitionend: $c("Transition", "TransitionEnd") }, dr = {}, Gd = {};
  w && (Gd = document.createElement("div").style, "AnimationEvent" in window || (delete Rl.animationend.animation, delete Rl.animationiteration.animation, delete Rl.animationstart.animation), "TransitionEvent" in window || delete Rl.transitionend.transition);
  function Wc(n) {
    if (dr[n]) return dr[n];
    if (!Rl[n]) return n;
    var r = Rl[n], o;
    for (o in r) if (r.hasOwnProperty(o) && o in Gd) return dr[n] = r[o];
    return n;
  }
  var Ev = Wc("animationend"), xv = Wc("animationiteration"), Tv = Wc("animationstart"), Rv = Wc("transitionend"), Qd = /* @__PURE__ */ new Map(), Gc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Pa(n, r) {
    Qd.set(n, r), R(r, [n]);
  }
  for (var Kd = 0; Kd < Gc.length; Kd++) {
    var bl = Gc[Kd], wg = bl.toLowerCase(), Dg = bl[0].toUpperCase() + bl.slice(1);
    Pa(wg, "on" + Dg);
  }
  Pa(Ev, "onAnimationEnd"), Pa(xv, "onAnimationIteration"), Pa(Tv, "onAnimationStart"), Pa("dblclick", "onDoubleClick"), Pa("focusin", "onFocus"), Pa("focusout", "onBlur"), Pa(Rv, "onTransitionEnd"), m("onMouseEnter", ["mouseout", "mouseover"]), m("onMouseLeave", ["mouseout", "mouseover"]), m("onPointerEnter", ["pointerout", "pointerover"]), m("onPointerLeave", ["pointerout", "pointerover"]), R("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), R("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), R("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), R("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ks = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), qd = new Set("cancel close invalid load scroll toggle".split(" ").concat(ks));
  function Qc(n, r, o) {
    var c = n.type || "unknown-event";
    n.currentTarget = o, Ae(c, r, void 0, n), n.currentTarget = null;
  }
  function wl(n, r) {
    r = (r & 4) !== 0;
    for (var o = 0; o < n.length; o++) {
      var c = n[o], p = c.event;
      c = c.listeners;
      e: {
        var y = void 0;
        if (r) for (var x = c.length - 1; 0 <= x; x--) {
          var O = c[x], U = O.instance, G = O.currentTarget;
          if (O = O.listener, U !== y && p.isPropagationStopped()) break e;
          Qc(p, O, G), y = U;
        }
        else for (x = 0; x < c.length; x++) {
          if (O = c[x], U = O.instance, G = O.currentTarget, O = O.listener, U !== y && p.isPropagationStopped()) break e;
          Qc(p, O, G), y = U;
        }
      }
    }
    if (Ti) throw n = N, Ti = !1, N = null, n;
  }
  function Gt(n, r) {
    var o = r[Ls];
    o === void 0 && (o = r[Ls] = /* @__PURE__ */ new Set());
    var c = n + "__bubble";
    o.has(c) || (bv(r, n, 2, !1), o.add(c));
  }
  function Kc(n, r, o) {
    var c = 0;
    r && (c |= 4), bv(o, n, c, r);
  }
  var qc = "_reactListening" + Math.random().toString(36).slice(2);
  function Du(n) {
    if (!n[qc]) {
      n[qc] = !0, v.forEach(function(o) {
        o !== "selectionchange" && (qd.has(o) || Kc(o, !1, n), Kc(o, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[qc] || (r[qc] = !0, Kc("selectionchange", !1, r));
    }
  }
  function bv(n, r, o, c) {
    switch (xu(r)) {
      case 1:
        var p = Su;
        break;
      case 4:
        p = Cu;
        break;
      default:
        p = No;
    }
    o = p.bind(null, r, o, n), p = void 0, !Ar || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (p = !0), c ? p !== void 0 ? n.addEventListener(r, o, { capture: !0, passive: p }) : n.addEventListener(r, o, !0) : p !== void 0 ? n.addEventListener(r, o, { passive: p }) : n.addEventListener(r, o, !1);
  }
  function Xc(n, r, o, c, p) {
    var y = c;
    if (!(r & 1) && !(r & 2) && c !== null) e: for (; ; ) {
      if (c === null) return;
      var x = c.tag;
      if (x === 3 || x === 4) {
        var O = c.stateNode.containerInfo;
        if (O === p || O.nodeType === 8 && O.parentNode === p) break;
        if (x === 4) for (x = c.return; x !== null; ) {
          var U = x.tag;
          if ((U === 3 || U === 4) && (U = x.stateNode.containerInfo, U === p || U.nodeType === 8 && U.parentNode === p)) return;
          x = x.return;
        }
        for (; O !== null; ) {
          if (x = kl(O), x === null) return;
          if (U = x.tag, U === 5 || U === 6) {
            c = y = x;
            continue e;
          }
          O = O.parentNode;
        }
      }
      c = c.return;
    }
    vl(function() {
      var G = y, le = qt(o), ce = [];
      e: {
        var oe = Qd.get(n);
        if (oe !== void 0) {
          var ke = kt, Ve = n;
          switch (n) {
            case "keypress":
              if (X(o) === 0) break e;
            case "keydown":
            case "keyup":
              ke = zd;
              break;
            case "focusin":
              Ve = "focus", ke = xl;
              break;
            case "focusout":
              Ve = "blur", ke = xl;
              break;
            case "beforeblur":
            case "afterblur":
              ke = xl;
              break;
            case "click":
              if (o.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ke = Po;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ke = eo;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ke = ov;
              break;
            case Ev:
            case xv:
            case Tv:
              ke = Fc;
              break;
            case Rv:
              ke = no;
              break;
            case "scroll":
              ke = sn;
              break;
            case "wheel":
              ke = ro;
              break;
            case "copy":
            case "cut":
            case "paste":
              ke = nv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ke = iv;
          }
          var He = (r & 4) !== 0, Ln = !He && n === "scroll", H = He ? oe !== null ? oe + "Capture" : null : oe;
          He = [];
          for (var j = G, Y; j !== null; ) {
            Y = j;
            var ue = Y.stateNode;
            if (Y.tag === 5 && ue !== null && (Y = ue, H !== null && (ue = Lr(j, H), ue != null && He.push(ku(j, ue, Y)))), Ln) break;
            j = j.return;
          }
          0 < He.length && (oe = new ke(oe, Ve, null, o, le), ce.push({ event: oe, listeners: He }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (oe = n === "mouseover" || n === "pointerover", ke = n === "mouseout" || n === "pointerout", oe && o !== ln && (Ve = o.relatedTarget || o.fromElement) && (kl(Ve) || Ve[ao])) break e;
          if ((ke || oe) && (oe = le.window === le ? le : (oe = le.ownerDocument) ? oe.defaultView || oe.parentWindow : window, ke ? (Ve = o.relatedTarget || o.toElement, ke = G, Ve = Ve ? kl(Ve) : null, Ve !== null && (Ln = vt(Ve), Ve !== Ln || Ve.tag !== 5 && Ve.tag !== 6) && (Ve = null)) : (ke = null, Ve = G), ke !== Ve)) {
            if (He = Po, ue = "onMouseLeave", H = "onMouseEnter", j = "mouse", (n === "pointerout" || n === "pointerover") && (He = iv, ue = "onPointerLeave", H = "onPointerEnter", j = "pointer"), Ln = ke == null ? oe : ci(ke), Y = Ve == null ? oe : ci(Ve), oe = new He(ue, j + "leave", ke, o, le), oe.target = Ln, oe.relatedTarget = Y, ue = null, kl(le) === G && (He = new He(H, j + "enter", Ve, o, le), He.target = Y, He.relatedTarget = Ln, ue = He), Ln = ue, ke && Ve) t: {
              for (He = ke, H = Ve, j = 0, Y = He; Y; Y = Vo(Y)) j++;
              for (Y = 0, ue = H; ue; ue = Vo(ue)) Y++;
              for (; 0 < j - Y; ) He = Vo(He), j--;
              for (; 0 < Y - j; ) H = Vo(H), Y--;
              for (; j--; ) {
                if (He === H || H !== null && He === H.alternate) break t;
                He = Vo(He), H = Vo(H);
              }
              He = null;
            }
            else He = null;
            ke !== null && wv(ce, oe, ke, He, !1), Ve !== null && Ln !== null && wv(ce, Ln, Ve, He, !0);
          }
        }
        e: {
          if (oe = G ? ci(G) : window, ke = oe.nodeName && oe.nodeName.toLowerCase(), ke === "select" || ke === "input" && oe.type === "file") var ze = Eg;
          else if (dv(oe)) if (hv) ze = Sv;
          else {
            ze = gv;
            var Xe = xg;
          }
          else (ke = oe.nodeName) && ke.toLowerCase() === "input" && (oe.type === "checkbox" || oe.type === "radio") && (ze = Tg);
          if (ze && (ze = ze(n, G))) {
            Hd(ce, ze, o, le);
            break e;
          }
          Xe && Xe(n, oe, G), n === "focusout" && (Xe = oe._wrapperState) && Xe.controlled && oe.type === "number" && va(oe, "number", oe.value);
        }
        switch (Xe = G ? ci(G) : window, n) {
          case "focusin":
            (dv(Xe) || Xe.contentEditable === "true") && (wu = Xe, Yd = G, Ds = null);
            break;
          case "focusout":
            Ds = Yd = wu = null;
            break;
          case "mousedown":
            $d = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            $d = !1, Wd(ce, o, le);
            break;
          case "selectionchange":
            if (bg) break;
          case "keydown":
          case "keyup":
            Wd(ce, o, le);
        }
        var et;
        if (Tu) e: {
          switch (n) {
            case "compositionstart":
              var at = "onCompositionStart";
              break e;
            case "compositionend":
              at = "onCompositionEnd";
              break e;
            case "compositionupdate":
              at = "onCompositionUpdate";
              break e;
          }
          at = void 0;
        }
        else Ru ? sv(n, o) && (at = "onCompositionEnd") : n === "keydown" && o.keyCode === 229 && (at = "onCompositionStart");
        at && (lv && o.locale !== "ko" && (Ru || at !== "onCompositionStart" ? at === "onCompositionEnd" && Ru && (et = W()) : (ui = le, E = "value" in ui ? ui.value : ui.textContent, Ru = !0)), Xe = _s(G, at), 0 < Xe.length && (at = new Pd(at, n, null, o, le), ce.push({ event: at, listeners: Xe }), et ? at.data = et : (et = cv(o), et !== null && (at.data = et)))), (et = Ts ? fv(n, o) : Sg(n, o)) && (G = _s(G, "onBeforeInput"), 0 < G.length && (le = new Pd("onBeforeInput", "beforeinput", null, o, le), ce.push({ event: le, listeners: G }), le.data = et));
      }
      wl(ce, r);
    });
  }
  function ku(n, r, o) {
    return { instance: n, listener: r, currentTarget: o };
  }
  function _s(n, r) {
    for (var o = r + "Capture", c = []; n !== null; ) {
      var p = n, y = p.stateNode;
      p.tag === 5 && y !== null && (p = y, y = Lr(n, o), y != null && c.unshift(ku(n, y, p)), y = Lr(n, r), y != null && c.push(ku(n, y, p))), n = n.return;
    }
    return c;
  }
  function Vo(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function wv(n, r, o, c, p) {
    for (var y = r._reactName, x = []; o !== null && o !== c; ) {
      var O = o, U = O.alternate, G = O.stateNode;
      if (U !== null && U === c) break;
      O.tag === 5 && G !== null && (O = G, p ? (U = Lr(o, y), U != null && x.unshift(ku(o, U, O))) : p || (U = Lr(o, y), U != null && x.push(ku(o, U, O)))), o = o.return;
    }
    x.length !== 0 && n.push({ event: r, listeners: x });
  }
  var Dv = /\r\n?/g, kg = /\u0000|\uFFFD/g;
  function kv(n) {
    return (typeof n == "string" ? n : "" + n).replace(Dv, `
`).replace(kg, "");
  }
  function Zc(n, r, o) {
    if (r = kv(r), kv(n) !== r && o) throw Error(f(425));
  }
  function zo() {
  }
  var Ms = null, Dl = null;
  function Jc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var ef = typeof setTimeout == "function" ? setTimeout : void 0, Xd = typeof clearTimeout == "function" ? clearTimeout : void 0, _v = typeof Promise == "function" ? Promise : void 0, _u = typeof queueMicrotask == "function" ? queueMicrotask : typeof _v < "u" ? function(n) {
    return _v.resolve(null).then(n).catch(tf);
  } : ef;
  function tf(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function Mu(n, r) {
    var o = r, c = 0;
    do {
      var p = o.nextSibling;
      if (n.removeChild(o), p && p.nodeType === 8) if (o = p.data, o === "/$") {
        if (c === 0) {
          n.removeChild(p), li(r);
          return;
        }
        c--;
      } else o !== "$" && o !== "$?" && o !== "$!" || c++;
      o = p;
    } while (o);
    li(r);
  }
  function _i(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Mv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var o = n.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (r === 0) return n;
          r--;
        } else o === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var jo = Math.random().toString(36).slice(2), Mi = "__reactFiber$" + jo, Os = "__reactProps$" + jo, ao = "__reactContainer$" + jo, Ls = "__reactEvents$" + jo, Ou = "__reactListeners$" + jo, _g = "__reactHandles$" + jo;
  function kl(n) {
    var r = n[Mi];
    if (r) return r;
    for (var o = n.parentNode; o; ) {
      if (r = o[ao] || o[Mi]) {
        if (o = r.alternate, r.child !== null || o !== null && o.child !== null) for (n = Mv(n); n !== null; ) {
          if (o = n[Mi]) return o;
          n = Mv(n);
        }
        return r;
      }
      n = o, o = n.parentNode;
    }
    return null;
  }
  function We(n) {
    return n = n[Mi] || n[ao], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ci(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(f(33));
  }
  function Cn(n) {
    return n[Os] || null;
  }
  var Ot = [], Ua = -1;
  function Va(n) {
    return { current: n };
  }
  function cn(n) {
    0 > Ua || (n.current = Ot[Ua], Ot[Ua] = null, Ua--);
  }
  function $e(n, r) {
    Ua++, Ot[Ua] = n.current, n.current = r;
  }
  var kr = {}, Rn = Va(kr), qn = Va(!1), Jr = kr;
  function ea(n, r) {
    var o = n.type.contextTypes;
    if (!o) return kr;
    var c = n.stateNode;
    if (c && c.__reactInternalMemoizedUnmaskedChildContext === r) return c.__reactInternalMemoizedMaskedChildContext;
    var p = {}, y;
    for (y in o) p[y] = r[y];
    return c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = p), p;
  }
  function Vn(n) {
    return n = n.childContextTypes, n != null;
  }
  function Lu() {
    cn(qn), cn(Rn);
  }
  function Ov(n, r, o) {
    if (Rn.current !== kr) throw Error(f(168));
    $e(Rn, r), $e(qn, o);
  }
  function As(n, r, o) {
    var c = n.stateNode;
    if (r = r.childContextTypes, typeof c.getChildContext != "function") return o;
    c = c.getChildContext();
    for (var p in c) if (!(p in r)) throw Error(f(108, dt(n) || "Unknown", p));
    return ye({}, o, c);
  }
  function nr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || kr, Jr = Rn.current, $e(Rn, n), $e(qn, qn.current), !0;
  }
  function nf(n, r, o) {
    var c = n.stateNode;
    if (!c) throw Error(f(169));
    o ? (n = As(n, r, Jr), c.__reactInternalMemoizedMergedChildContext = n, cn(qn), cn(Rn), $e(Rn, n)) : cn(qn), $e(qn, o);
  }
  var Oi = null, Au = !1, io = !1;
  function rf(n) {
    Oi === null ? Oi = [n] : Oi.push(n);
  }
  function Fo(n) {
    Au = !0, rf(n);
  }
  function Li() {
    if (!io && Oi !== null) {
      io = !0;
      var n = 0, r = Ft;
      try {
        var o = Oi;
        for (Ft = 1; n < o.length; n++) {
          var c = o[n];
          do
            c = c(!0);
          while (c !== null);
        }
        Oi = null, Au = !1;
      } catch (p) {
        throw Oi !== null && (Oi = Oi.slice(n + 1)), dn(ai, Li), p;
      } finally {
        Ft = r, io = !1;
      }
    }
    return null;
  }
  var Ho = [], Bo = 0, Io = null, oo = 0, zn = [], za = 0, Sa = null, Ai = 1, Ni = "";
  function _l(n, r) {
    Ho[Bo++] = oo, Ho[Bo++] = Io, Io = n, oo = r;
  }
  function Lv(n, r, o) {
    zn[za++] = Ai, zn[za++] = Ni, zn[za++] = Sa, Sa = n;
    var c = Ai;
    n = Ni;
    var p = 32 - Nr(c) - 1;
    c &= ~(1 << p), o += 1;
    var y = 32 - Nr(r) + p;
    if (30 < y) {
      var x = p - p % 5;
      y = (c & (1 << x) - 1).toString(32), c >>= x, p -= x, Ai = 1 << 32 - Nr(r) + p | o << p | c, Ni = y + n;
    } else Ai = 1 << y | o << p | c, Ni = n;
  }
  function af(n) {
    n.return !== null && (_l(n, 1), Lv(n, 1, 0));
  }
  function of(n) {
    for (; n === Io; ) Io = Ho[--Bo], Ho[Bo] = null, oo = Ho[--Bo], Ho[Bo] = null;
    for (; n === Sa; ) Sa = zn[--za], zn[za] = null, Ni = zn[--za], zn[za] = null, Ai = zn[--za], zn[za] = null;
  }
  var ta = null, na = null, vn = !1, ja = null;
  function Zd(n, r) {
    var o = Ya(5, null, null, 0);
    o.elementType = "DELETED", o.stateNode = r, o.return = n, r = n.deletions, r === null ? (n.deletions = [o], n.flags |= 16) : r.push(o);
  }
  function Av(n, r) {
    switch (n.tag) {
      case 5:
        var o = n.type;
        return r = r.nodeType !== 1 || o.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ta = n, na = _i(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ta = n, na = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (o = Sa !== null ? { id: Ai, overflow: Ni } : null, n.memoizedState = { dehydrated: r, treeContext: o, retryLane: 1073741824 }, o = Ya(18, null, null, 0), o.stateNode = r, o.return = n, n.child = o, ta = n, na = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Jd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function ep(n) {
    if (vn) {
      var r = na;
      if (r) {
        var o = r;
        if (!Av(n, r)) {
          if (Jd(n)) throw Error(f(418));
          r = _i(o.nextSibling);
          var c = ta;
          r && Av(n, r) ? Zd(c, o) : (n.flags = n.flags & -4097 | 2, vn = !1, ta = n);
        }
      } else {
        if (Jd(n)) throw Error(f(418));
        n.flags = n.flags & -4097 | 2, vn = !1, ta = n;
      }
    }
  }
  function Xn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    ta = n;
  }
  function lf(n) {
    if (n !== ta) return !1;
    if (!vn) return Xn(n), vn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Jc(n.type, n.memoizedProps)), r && (r = na)) {
      if (Jd(n)) throw Ns(), Error(f(418));
      for (; r; ) Zd(n, r), r = _i(r.nextSibling);
    }
    if (Xn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(f(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var o = n.data;
            if (o === "/$") {
              if (r === 0) {
                na = _i(n.nextSibling);
                break e;
              }
              r--;
            } else o !== "$" && o !== "$!" && o !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        na = null;
      }
    } else na = ta ? _i(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Ns() {
    for (var n = na; n; ) n = _i(n.nextSibling);
  }
  function Yo() {
    na = ta = null, vn = !1;
  }
  function lo(n) {
    ja === null ? ja = [n] : ja.push(n);
  }
  var Mg = pe.ReactCurrentBatchConfig;
  function Ml(n, r, o) {
    if (n = o.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (o._owner) {
        if (o = o._owner, o) {
          if (o.tag !== 1) throw Error(f(309));
          var c = o.stateNode;
        }
        if (!c) throw Error(f(147, n));
        var p = c, y = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === y ? r.ref : (r = function(x) {
          var O = p.refs;
          x === null ? delete O[y] : O[y] = x;
        }, r._stringRef = y, r);
      }
      if (typeof n != "string") throw Error(f(284));
      if (!o._owner) throw Error(f(290, n));
    }
    return n;
  }
  function uf(n, r) {
    throw n = Object.prototype.toString.call(r), Error(f(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Nv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Ol(n) {
    function r(H, j) {
      if (n) {
        var Y = H.deletions;
        Y === null ? (H.deletions = [j], H.flags |= 16) : Y.push(j);
      }
    }
    function o(H, j) {
      if (!n) return null;
      for (; j !== null; ) r(H, j), j = j.sibling;
      return null;
    }
    function c(H, j) {
      for (H = /* @__PURE__ */ new Map(); j !== null; ) j.key !== null ? H.set(j.key, j) : H.set(j.index, j), j = j.sibling;
      return H;
    }
    function p(H, j) {
      return H = Zo(H, j), H.index = 0, H.sibling = null, H;
    }
    function y(H, j, Y) {
      return H.index = Y, n ? (Y = H.alternate, Y !== null ? (Y = Y.index, Y < j ? (H.flags |= 2, j) : Y) : (H.flags |= 2, j)) : (H.flags |= 1048576, j);
    }
    function x(H) {
      return n && H.alternate === null && (H.flags |= 2), H;
    }
    function O(H, j, Y, ue) {
      return j === null || j.tag !== 6 ? (j = Op(Y, H.mode, ue), j.return = H, j) : (j = p(j, Y), j.return = H, j);
    }
    function U(H, j, Y, ue) {
      var ze = Y.type;
      return ze === Ee ? le(H, j, Y.props.children, ue, Y.key) : j !== null && (j.elementType === ze || typeof ze == "object" && ze !== null && ze.$$typeof === tt && Nv(ze) === j.type) ? (ue = p(j, Y.props), ue.ref = Ml(H, j, Y), ue.return = H, ue) : (ue = cc(Y.type, Y.key, Y.props, null, H.mode, ue), ue.ref = Ml(H, j, Y), ue.return = H, ue);
    }
    function G(H, j, Y, ue) {
      return j === null || j.tag !== 4 || j.stateNode.containerInfo !== Y.containerInfo || j.stateNode.implementation !== Y.implementation ? (j = Hf(Y, H.mode, ue), j.return = H, j) : (j = p(j, Y.children || []), j.return = H, j);
    }
    function le(H, j, Y, ue, ze) {
      return j === null || j.tag !== 7 ? (j = ho(Y, H.mode, ue, ze), j.return = H, j) : (j = p(j, Y), j.return = H, j);
    }
    function ce(H, j, Y) {
      if (typeof j == "string" && j !== "" || typeof j == "number") return j = Op("" + j, H.mode, Y), j.return = H, j;
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case de:
            return Y = cc(j.type, j.key, j.props, null, H.mode, Y), Y.ref = Ml(H, null, j), Y.return = H, Y;
          case Pe:
            return j = Hf(j, H.mode, Y), j.return = H, j;
          case tt:
            var ue = j._init;
            return ce(H, ue(j._payload), Y);
        }
        if (er(j) || Ne(j)) return j = ho(j, H.mode, Y, null), j.return = H, j;
        uf(H, j);
      }
      return null;
    }
    function oe(H, j, Y, ue) {
      var ze = j !== null ? j.key : null;
      if (typeof Y == "string" && Y !== "" || typeof Y == "number") return ze !== null ? null : O(H, j, "" + Y, ue);
      if (typeof Y == "object" && Y !== null) {
        switch (Y.$$typeof) {
          case de:
            return Y.key === ze ? U(H, j, Y, ue) : null;
          case Pe:
            return Y.key === ze ? G(H, j, Y, ue) : null;
          case tt:
            return ze = Y._init, oe(
              H,
              j,
              ze(Y._payload),
              ue
            );
        }
        if (er(Y) || Ne(Y)) return ze !== null ? null : le(H, j, Y, ue, null);
        uf(H, Y);
      }
      return null;
    }
    function ke(H, j, Y, ue, ze) {
      if (typeof ue == "string" && ue !== "" || typeof ue == "number") return H = H.get(Y) || null, O(j, H, "" + ue, ze);
      if (typeof ue == "object" && ue !== null) {
        switch (ue.$$typeof) {
          case de:
            return H = H.get(ue.key === null ? Y : ue.key) || null, U(j, H, ue, ze);
          case Pe:
            return H = H.get(ue.key === null ? Y : ue.key) || null, G(j, H, ue, ze);
          case tt:
            var Xe = ue._init;
            return ke(H, j, Y, Xe(ue._payload), ze);
        }
        if (er(ue) || Ne(ue)) return H = H.get(Y) || null, le(j, H, ue, ze, null);
        uf(j, ue);
      }
      return null;
    }
    function Ve(H, j, Y, ue) {
      for (var ze = null, Xe = null, et = j, at = j = 0, ir = null; et !== null && at < Y.length; at++) {
        et.index > at ? (ir = et, et = null) : ir = et.sibling;
        var It = oe(H, et, Y[at], ue);
        if (It === null) {
          et === null && (et = ir);
          break;
        }
        n && et && It.alternate === null && r(H, et), j = y(It, j, at), Xe === null ? ze = It : Xe.sibling = It, Xe = It, et = ir;
      }
      if (at === Y.length) return o(H, et), vn && _l(H, at), ze;
      if (et === null) {
        for (; at < Y.length; at++) et = ce(H, Y[at], ue), et !== null && (j = y(et, j, at), Xe === null ? ze = et : Xe.sibling = et, Xe = et);
        return vn && _l(H, at), ze;
      }
      for (et = c(H, et); at < Y.length; at++) ir = ke(et, H, at, Y[at], ue), ir !== null && (n && ir.alternate !== null && et.delete(ir.key === null ? at : ir.key), j = y(ir, j, at), Xe === null ? ze = ir : Xe.sibling = ir, Xe = ir);
      return n && et.forEach(function(tl) {
        return r(H, tl);
      }), vn && _l(H, at), ze;
    }
    function He(H, j, Y, ue) {
      var ze = Ne(Y);
      if (typeof ze != "function") throw Error(f(150));
      if (Y = ze.call(Y), Y == null) throw Error(f(151));
      for (var Xe = ze = null, et = j, at = j = 0, ir = null, It = Y.next(); et !== null && !It.done; at++, It = Y.next()) {
        et.index > at ? (ir = et, et = null) : ir = et.sibling;
        var tl = oe(H, et, It.value, ue);
        if (tl === null) {
          et === null && (et = ir);
          break;
        }
        n && et && tl.alternate === null && r(H, et), j = y(tl, j, at), Xe === null ? ze = tl : Xe.sibling = tl, Xe = tl, et = ir;
      }
      if (It.done) return o(
        H,
        et
      ), vn && _l(H, at), ze;
      if (et === null) {
        for (; !It.done; at++, It = Y.next()) It = ce(H, It.value, ue), It !== null && (j = y(It, j, at), Xe === null ? ze = It : Xe.sibling = It, Xe = It);
        return vn && _l(H, at), ze;
      }
      for (et = c(H, et); !It.done; at++, It = Y.next()) It = ke(et, H, at, It.value, ue), It !== null && (n && It.alternate !== null && et.delete(It.key === null ? at : It.key), j = y(It, j, at), Xe === null ? ze = It : Xe.sibling = It, Xe = It);
      return n && et.forEach(function(mm) {
        return r(H, mm);
      }), vn && _l(H, at), ze;
    }
    function Ln(H, j, Y, ue) {
      if (typeof Y == "object" && Y !== null && Y.type === Ee && Y.key === null && (Y = Y.props.children), typeof Y == "object" && Y !== null) {
        switch (Y.$$typeof) {
          case de:
            e: {
              for (var ze = Y.key, Xe = j; Xe !== null; ) {
                if (Xe.key === ze) {
                  if (ze = Y.type, ze === Ee) {
                    if (Xe.tag === 7) {
                      o(H, Xe.sibling), j = p(Xe, Y.props.children), j.return = H, H = j;
                      break e;
                    }
                  } else if (Xe.elementType === ze || typeof ze == "object" && ze !== null && ze.$$typeof === tt && Nv(ze) === Xe.type) {
                    o(H, Xe.sibling), j = p(Xe, Y.props), j.ref = Ml(H, Xe, Y), j.return = H, H = j;
                    break e;
                  }
                  o(H, Xe);
                  break;
                } else r(H, Xe);
                Xe = Xe.sibling;
              }
              Y.type === Ee ? (j = ho(Y.props.children, H.mode, ue, Y.key), j.return = H, H = j) : (ue = cc(Y.type, Y.key, Y.props, null, H.mode, ue), ue.ref = Ml(H, j, Y), ue.return = H, H = ue);
            }
            return x(H);
          case Pe:
            e: {
              for (Xe = Y.key; j !== null; ) {
                if (j.key === Xe) if (j.tag === 4 && j.stateNode.containerInfo === Y.containerInfo && j.stateNode.implementation === Y.implementation) {
                  o(H, j.sibling), j = p(j, Y.children || []), j.return = H, H = j;
                  break e;
                } else {
                  o(H, j);
                  break;
                }
                else r(H, j);
                j = j.sibling;
              }
              j = Hf(Y, H.mode, ue), j.return = H, H = j;
            }
            return x(H);
          case tt:
            return Xe = Y._init, Ln(H, j, Xe(Y._payload), ue);
        }
        if (er(Y)) return Ve(H, j, Y, ue);
        if (Ne(Y)) return He(H, j, Y, ue);
        uf(H, Y);
      }
      return typeof Y == "string" && Y !== "" || typeof Y == "number" ? (Y = "" + Y, j !== null && j.tag === 6 ? (o(H, j.sibling), j = p(j, Y), j.return = H, H = j) : (o(H, j), j = Op(Y, H.mode, ue), j.return = H, H = j), x(H)) : o(H, j);
    }
    return Ln;
  }
  var kn = Ol(!0), Re = Ol(!1), Ca = Va(null), ra = null, Nu = null, tp = null;
  function np() {
    tp = Nu = ra = null;
  }
  function rp(n) {
    var r = Ca.current;
    cn(Ca), n._currentValue = r;
  }
  function ap(n, r, o) {
    for (; n !== null; ) {
      var c = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, c !== null && (c.childLanes |= r)) : c !== null && (c.childLanes & r) !== r && (c.childLanes |= r), n === o) break;
      n = n.return;
    }
  }
  function En(n, r) {
    ra = n, tp = Nu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Fn = !0), n.firstContext = null);
  }
  function Fa(n) {
    var r = n._currentValue;
    if (tp !== n) if (n = { context: n, memoizedValue: r, next: null }, Nu === null) {
      if (ra === null) throw Error(f(308));
      Nu = n, ra.dependencies = { lanes: 0, firstContext: n };
    } else Nu = Nu.next = n;
    return r;
  }
  var Ll = null;
  function ip(n) {
    Ll === null ? Ll = [n] : Ll.push(n);
  }
  function op(n, r, o, c) {
    var p = r.interleaved;
    return p === null ? (o.next = o, ip(r)) : (o.next = p.next, p.next = o), r.interleaved = o, Ea(n, c);
  }
  function Ea(n, r) {
    n.lanes |= r;
    var o = n.alternate;
    for (o !== null && (o.lanes |= r), o = n, n = n.return; n !== null; ) n.childLanes |= r, o = n.alternate, o !== null && (o.childLanes |= r), o = n, n = n.return;
    return o.tag === 3 ? o.stateNode : null;
  }
  var xa = !1;
  function lp(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Pv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function uo(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function $o(n, r, o) {
    var c = n.updateQueue;
    if (c === null) return null;
    if (c = c.shared, Lt & 2) {
      var p = c.pending;
      return p === null ? r.next = r : (r.next = p.next, p.next = r), c.pending = r, Ea(n, o);
    }
    return p = c.interleaved, p === null ? (r.next = r, ip(c)) : (r.next = p.next, p.next = r), c.interleaved = r, Ea(n, o);
  }
  function sf(n, r, o) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (o & 4194240) !== 0)) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, Ji(n, o);
    }
  }
  function Uv(n, r) {
    var o = n.updateQueue, c = n.alternate;
    if (c !== null && (c = c.updateQueue, o === c)) {
      var p = null, y = null;
      if (o = o.firstBaseUpdate, o !== null) {
        do {
          var x = { eventTime: o.eventTime, lane: o.lane, tag: o.tag, payload: o.payload, callback: o.callback, next: null };
          y === null ? p = y = x : y = y.next = x, o = o.next;
        } while (o !== null);
        y === null ? p = y = r : y = y.next = r;
      } else p = y = r;
      o = { baseState: c.baseState, firstBaseUpdate: p, lastBaseUpdate: y, shared: c.shared, effects: c.effects }, n.updateQueue = o;
      return;
    }
    n = o.lastBaseUpdate, n === null ? o.firstBaseUpdate = r : n.next = r, o.lastBaseUpdate = r;
  }
  function Ps(n, r, o, c) {
    var p = n.updateQueue;
    xa = !1;
    var y = p.firstBaseUpdate, x = p.lastBaseUpdate, O = p.shared.pending;
    if (O !== null) {
      p.shared.pending = null;
      var U = O, G = U.next;
      U.next = null, x === null ? y = G : x.next = G, x = U;
      var le = n.alternate;
      le !== null && (le = le.updateQueue, O = le.lastBaseUpdate, O !== x && (O === null ? le.firstBaseUpdate = G : O.next = G, le.lastBaseUpdate = U));
    }
    if (y !== null) {
      var ce = p.baseState;
      x = 0, le = G = U = null, O = y;
      do {
        var oe = O.lane, ke = O.eventTime;
        if ((c & oe) === oe) {
          le !== null && (le = le.next = {
            eventTime: ke,
            lane: 0,
            tag: O.tag,
            payload: O.payload,
            callback: O.callback,
            next: null
          });
          e: {
            var Ve = n, He = O;
            switch (oe = r, ke = o, He.tag) {
              case 1:
                if (Ve = He.payload, typeof Ve == "function") {
                  ce = Ve.call(ke, ce, oe);
                  break e;
                }
                ce = Ve;
                break e;
              case 3:
                Ve.flags = Ve.flags & -65537 | 128;
              case 0:
                if (Ve = He.payload, oe = typeof Ve == "function" ? Ve.call(ke, ce, oe) : Ve, oe == null) break e;
                ce = ye({}, ce, oe);
                break e;
              case 2:
                xa = !0;
            }
          }
          O.callback !== null && O.lane !== 0 && (n.flags |= 64, oe = p.effects, oe === null ? p.effects = [O] : oe.push(O));
        } else ke = { eventTime: ke, lane: oe, tag: O.tag, payload: O.payload, callback: O.callback, next: null }, le === null ? (G = le = ke, U = ce) : le = le.next = ke, x |= oe;
        if (O = O.next, O === null) {
          if (O = p.shared.pending, O === null) break;
          oe = O, O = oe.next, oe.next = null, p.lastBaseUpdate = oe, p.shared.pending = null;
        }
      } while (!0);
      if (le === null && (U = ce), p.baseState = U, p.firstBaseUpdate = G, p.lastBaseUpdate = le, r = p.shared.interleaved, r !== null) {
        p = r;
        do
          x |= p.lane, p = p.next;
        while (p !== r);
      } else y === null && (p.shared.lanes = 0);
      ji |= x, n.lanes = x, n.memoizedState = ce;
    }
  }
  function up(n, r, o) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var c = n[r], p = c.callback;
      if (p !== null) {
        if (c.callback = null, c = o, typeof p != "function") throw Error(f(191, p));
        p.call(c);
      }
    }
  }
  var Us = {}, Pi = Va(Us), Vs = Va(Us), zs = Va(Us);
  function Al(n) {
    if (n === Us) throw Error(f(174));
    return n;
  }
  function sp(n, r) {
    switch ($e(zs, r), $e(Vs, n), $e(Pi, Us), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ma(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ma(r, n);
    }
    cn(Pi), $e(Pi, r);
  }
  function Nl() {
    cn(Pi), cn(Vs), cn(zs);
  }
  function Vv(n) {
    Al(zs.current);
    var r = Al(Pi.current), o = ma(r, n.type);
    r !== o && ($e(Vs, n), $e(Pi, o));
  }
  function cf(n) {
    Vs.current === n && (cn(Pi), cn(Vs));
  }
  var xn = Va(0);
  function ff(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var o = r.memoizedState;
        if (o !== null && (o = o.dehydrated, o === null || o.data === "$?" || o.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var js = [];
  function Ge() {
    for (var n = 0; n < js.length; n++) js[n]._workInProgressVersionPrimary = null;
    js.length = 0;
  }
  var bt = pe.ReactCurrentDispatcher, Ht = pe.ReactCurrentBatchConfig, tn = 0, Bt = null, jn = null, rr = null, df = !1, Fs = !1, Pl = 0, ie = 0;
  function zt() {
    throw Error(f(321));
  }
  function nt(n, r) {
    if (r === null) return !1;
    for (var o = 0; o < r.length && o < n.length; o++) if (!si(n[o], r[o])) return !1;
    return !0;
  }
  function Wo(n, r, o, c, p, y) {
    if (tn = y, Bt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, bt.current = n === null || n.memoizedState === null ? Df : Ws, n = o(c, p), Fs) {
      y = 0;
      do {
        if (Fs = !1, Pl = 0, 25 <= y) throw Error(f(301));
        y += 1, rr = jn = null, r.updateQueue = null, bt.current = kf, n = o(c, p);
      } while (Fs);
    }
    if (bt.current = Fl, r = jn !== null && jn.next !== null, tn = 0, rr = jn = Bt = null, df = !1, r) throw Error(f(300));
    return n;
  }
  function fi() {
    var n = Pl !== 0;
    return Pl = 0, n;
  }
  function _r() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return rr === null ? Bt.memoizedState = rr = n : rr = rr.next = n, rr;
  }
  function _n() {
    if (jn === null) {
      var n = Bt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = jn.next;
    var r = rr === null ? Bt.memoizedState : rr.next;
    if (r !== null) rr = r, jn = n;
    else {
      if (n === null) throw Error(f(310));
      jn = n, n = { memoizedState: jn.memoizedState, baseState: jn.baseState, baseQueue: jn.baseQueue, queue: jn.queue, next: null }, rr === null ? Bt.memoizedState = rr = n : rr = rr.next = n;
    }
    return rr;
  }
  function so(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Go(n) {
    var r = _n(), o = r.queue;
    if (o === null) throw Error(f(311));
    o.lastRenderedReducer = n;
    var c = jn, p = c.baseQueue, y = o.pending;
    if (y !== null) {
      if (p !== null) {
        var x = p.next;
        p.next = y.next, y.next = x;
      }
      c.baseQueue = p = y, o.pending = null;
    }
    if (p !== null) {
      y = p.next, c = c.baseState;
      var O = x = null, U = null, G = y;
      do {
        var le = G.lane;
        if ((tn & le) === le) U !== null && (U = U.next = { lane: 0, action: G.action, hasEagerState: G.hasEagerState, eagerState: G.eagerState, next: null }), c = G.hasEagerState ? G.eagerState : n(c, G.action);
        else {
          var ce = {
            lane: le,
            action: G.action,
            hasEagerState: G.hasEagerState,
            eagerState: G.eagerState,
            next: null
          };
          U === null ? (O = U = ce, x = c) : U = U.next = ce, Bt.lanes |= le, ji |= le;
        }
        G = G.next;
      } while (G !== null && G !== y);
      U === null ? x = c : U.next = O, si(c, r.memoizedState) || (Fn = !0), r.memoizedState = c, r.baseState = x, r.baseQueue = U, o.lastRenderedState = c;
    }
    if (n = o.interleaved, n !== null) {
      p = n;
      do
        y = p.lane, Bt.lanes |= y, ji |= y, p = p.next;
      while (p !== n);
    } else p === null && (o.lanes = 0);
    return [r.memoizedState, o.dispatch];
  }
  function Ul(n) {
    var r = _n(), o = r.queue;
    if (o === null) throw Error(f(311));
    o.lastRenderedReducer = n;
    var c = o.dispatch, p = o.pending, y = r.memoizedState;
    if (p !== null) {
      o.pending = null;
      var x = p = p.next;
      do
        y = n(y, x.action), x = x.next;
      while (x !== p);
      si(y, r.memoizedState) || (Fn = !0), r.memoizedState = y, r.baseQueue === null && (r.baseState = y), o.lastRenderedState = y;
    }
    return [y, c];
  }
  function pf() {
  }
  function hf(n, r) {
    var o = Bt, c = _n(), p = r(), y = !si(c.memoizedState, p);
    if (y && (c.memoizedState = p, Fn = !0), c = c.queue, Hs(yf.bind(null, o, c, n), [n]), c.getSnapshot !== r || y || rr !== null && rr.memoizedState.tag & 1) {
      if (o.flags |= 2048, Vl(9, mf.bind(null, o, c, p, r), void 0, null), Zn === null) throw Error(f(349));
      tn & 30 || vf(o, r, p);
    }
    return p;
  }
  function vf(n, r, o) {
    n.flags |= 16384, n = { getSnapshot: r, value: o }, r = Bt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Bt.updateQueue = r, r.stores = [n]) : (o = r.stores, o === null ? r.stores = [n] : o.push(n));
  }
  function mf(n, r, o, c) {
    r.value = o, r.getSnapshot = c, gf(r) && Sf(n);
  }
  function yf(n, r, o) {
    return o(function() {
      gf(r) && Sf(n);
    });
  }
  function gf(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var o = r();
      return !si(n, o);
    } catch {
      return !0;
    }
  }
  function Sf(n) {
    var r = Ea(n, 1);
    r !== null && Fr(r, n, 1, -1);
  }
  function Cf(n) {
    var r = _r();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: so, lastRenderedState: n }, r.queue = n, n = n.dispatch = jl.bind(null, Bt, n), [r.memoizedState, n];
  }
  function Vl(n, r, o, c) {
    return n = { tag: n, create: r, destroy: o, deps: c, next: null }, r = Bt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Bt.updateQueue = r, r.lastEffect = n.next = n) : (o = r.lastEffect, o === null ? r.lastEffect = n.next = n : (c = o.next, o.next = n, n.next = c, r.lastEffect = n)), n;
  }
  function Ef() {
    return _n().memoizedState;
  }
  function Pu(n, r, o, c) {
    var p = _r();
    Bt.flags |= n, p.memoizedState = Vl(1 | r, o, void 0, c === void 0 ? null : c);
  }
  function Uu(n, r, o, c) {
    var p = _n();
    c = c === void 0 ? null : c;
    var y = void 0;
    if (jn !== null) {
      var x = jn.memoizedState;
      if (y = x.destroy, c !== null && nt(c, x.deps)) {
        p.memoizedState = Vl(r, o, y, c);
        return;
      }
    }
    Bt.flags |= n, p.memoizedState = Vl(1 | r, o, y, c);
  }
  function xf(n, r) {
    return Pu(8390656, 8, n, r);
  }
  function Hs(n, r) {
    return Uu(2048, 8, n, r);
  }
  function Tf(n, r) {
    return Uu(4, 2, n, r);
  }
  function Bs(n, r) {
    return Uu(4, 4, n, r);
  }
  function zl(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Rf(n, r, o) {
    return o = o != null ? o.concat([n]) : null, Uu(4, 4, zl.bind(null, r, n), o);
  }
  function Is() {
  }
  function bf(n, r) {
    var o = _n();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && nt(r, c[1]) ? c[0] : (o.memoizedState = [n, r], n);
  }
  function wf(n, r) {
    var o = _n();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && nt(r, c[1]) ? c[0] : (n = n(), o.memoizedState = [n, r], n);
  }
  function cp(n, r, o) {
    return tn & 21 ? (si(o, r) || (o = vu(), Bt.lanes |= o, ji |= o, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Fn = !0), n.memoizedState = o);
  }
  function Ys(n, r) {
    var o = Ft;
    Ft = o !== 0 && 4 > o ? o : 4, n(!0);
    var c = Ht.transition;
    Ht.transition = {};
    try {
      n(!1), r();
    } finally {
      Ft = o, Ht.transition = c;
    }
  }
  function fp() {
    return _n().memoizedState;
  }
  function $s(n, r, o) {
    var c = Fi(n);
    if (o = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null }, aa(n)) zv(r, o);
    else if (o = op(n, r, o, c), o !== null) {
      var p = In();
      Fr(o, n, c, p), an(o, r, c);
    }
  }
  function jl(n, r, o) {
    var c = Fi(n), p = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (aa(n)) zv(r, p);
    else {
      var y = n.alternate;
      if (n.lanes === 0 && (y === null || y.lanes === 0) && (y = r.lastRenderedReducer, y !== null)) try {
        var x = r.lastRenderedState, O = y(x, o);
        if (p.hasEagerState = !0, p.eagerState = O, si(O, x)) {
          var U = r.interleaved;
          U === null ? (p.next = p, ip(r)) : (p.next = U.next, U.next = p), r.interleaved = p;
          return;
        }
      } catch {
      } finally {
      }
      o = op(n, r, p, c), o !== null && (p = In(), Fr(o, n, c, p), an(o, r, c));
    }
  }
  function aa(n) {
    var r = n.alternate;
    return n === Bt || r !== null && r === Bt;
  }
  function zv(n, r) {
    Fs = df = !0;
    var o = n.pending;
    o === null ? r.next = r : (r.next = o.next, o.next = r), n.pending = r;
  }
  function an(n, r, o) {
    if (o & 4194240) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, Ji(n, o);
    }
  }
  var Fl = { readContext: Fa, useCallback: zt, useContext: zt, useEffect: zt, useImperativeHandle: zt, useInsertionEffect: zt, useLayoutEffect: zt, useMemo: zt, useReducer: zt, useRef: zt, useState: zt, useDebugValue: zt, useDeferredValue: zt, useTransition: zt, useMutableSource: zt, useSyncExternalStore: zt, useId: zt, unstable_isNewReconciler: !1 }, Df = { readContext: Fa, useCallback: function(n, r) {
    return _r().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Fa, useEffect: xf, useImperativeHandle: function(n, r, o) {
    return o = o != null ? o.concat([n]) : null, Pu(
      4194308,
      4,
      zl.bind(null, r, n),
      o
    );
  }, useLayoutEffect: function(n, r) {
    return Pu(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Pu(4, 2, n, r);
  }, useMemo: function(n, r) {
    var o = _r();
    return r = r === void 0 ? null : r, n = n(), o.memoizedState = [n, r], n;
  }, useReducer: function(n, r, o) {
    var c = _r();
    return r = o !== void 0 ? o(r) : r, c.memoizedState = c.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, c.queue = n, n = n.dispatch = $s.bind(null, Bt, n), [c.memoizedState, n];
  }, useRef: function(n) {
    var r = _r();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Cf, useDebugValue: Is, useDeferredValue: function(n) {
    return _r().memoizedState = n;
  }, useTransition: function() {
    var n = Cf(!1), r = n[0];
    return n = Ys.bind(null, n[1]), _r().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, o) {
    var c = Bt, p = _r();
    if (vn) {
      if (o === void 0) throw Error(f(407));
      o = o();
    } else {
      if (o = r(), Zn === null) throw Error(f(349));
      tn & 30 || vf(c, r, o);
    }
    p.memoizedState = o;
    var y = { value: o, getSnapshot: r };
    return p.queue = y, xf(yf.bind(
      null,
      c,
      y,
      n
    ), [n]), c.flags |= 2048, Vl(9, mf.bind(null, c, y, o, r), void 0, null), o;
  }, useId: function() {
    var n = _r(), r = Zn.identifierPrefix;
    if (vn) {
      var o = Ni, c = Ai;
      o = (c & ~(1 << 32 - Nr(c) - 1)).toString(32) + o, r = ":" + r + "R" + o, o = Pl++, 0 < o && (r += "H" + o.toString(32)), r += ":";
    } else o = ie++, r = ":" + r + "r" + o.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Ws = {
    readContext: Fa,
    useCallback: bf,
    useContext: Fa,
    useEffect: Hs,
    useImperativeHandle: Rf,
    useInsertionEffect: Tf,
    useLayoutEffect: Bs,
    useMemo: wf,
    useReducer: Go,
    useRef: Ef,
    useState: function() {
      return Go(so);
    },
    useDebugValue: Is,
    useDeferredValue: function(n) {
      var r = _n();
      return cp(r, jn.memoizedState, n);
    },
    useTransition: function() {
      var n = Go(so)[0], r = _n().memoizedState;
      return [n, r];
    },
    useMutableSource: pf,
    useSyncExternalStore: hf,
    useId: fp,
    unstable_isNewReconciler: !1
  }, kf = { readContext: Fa, useCallback: bf, useContext: Fa, useEffect: Hs, useImperativeHandle: Rf, useInsertionEffect: Tf, useLayoutEffect: Bs, useMemo: wf, useReducer: Ul, useRef: Ef, useState: function() {
    return Ul(so);
  }, useDebugValue: Is, useDeferredValue: function(n) {
    var r = _n();
    return jn === null ? r.memoizedState = n : cp(r, jn.memoizedState, n);
  }, useTransition: function() {
    var n = Ul(so)[0], r = _n().memoizedState;
    return [n, r];
  }, useMutableSource: pf, useSyncExternalStore: hf, useId: fp, unstable_isNewReconciler: !1 };
  function di(n, r) {
    if (n && n.defaultProps) {
      r = ye({}, r), n = n.defaultProps;
      for (var o in n) r[o] === void 0 && (r[o] = n[o]);
      return r;
    }
    return r;
  }
  function dp(n, r, o, c) {
    r = n.memoizedState, o = o(c, r), o = o == null ? r : ye({}, r, o), n.memoizedState = o, n.lanes === 0 && (n.updateQueue.baseState = o);
  }
  var _f = { isMounted: function(n) {
    return (n = n._reactInternals) ? vt(n) === n : !1;
  }, enqueueSetState: function(n, r, o) {
    n = n._reactInternals;
    var c = In(), p = Fi(n), y = uo(c, p);
    y.payload = r, o != null && (y.callback = o), r = $o(n, y, p), r !== null && (Fr(r, n, p, c), sf(r, n, p));
  }, enqueueReplaceState: function(n, r, o) {
    n = n._reactInternals;
    var c = In(), p = Fi(n), y = uo(c, p);
    y.tag = 1, y.payload = r, o != null && (y.callback = o), r = $o(n, y, p), r !== null && (Fr(r, n, p, c), sf(r, n, p));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var o = In(), c = Fi(n), p = uo(o, c);
    p.tag = 2, r != null && (p.callback = r), r = $o(n, p, c), r !== null && (Fr(r, n, c, o), sf(r, n, c));
  } };
  function jv(n, r, o, c, p, y, x) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(c, y, x) : r.prototype && r.prototype.isPureReactComponent ? !bs(o, c) || !bs(p, y) : !0;
  }
  function Mf(n, r, o) {
    var c = !1, p = kr, y = r.contextType;
    return typeof y == "object" && y !== null ? y = Fa(y) : (p = Vn(r) ? Jr : Rn.current, c = r.contextTypes, y = (c = c != null) ? ea(n, p) : kr), r = new r(o, y), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = _f, n.stateNode = r, r._reactInternals = n, c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = p, n.__reactInternalMemoizedMaskedChildContext = y), r;
  }
  function Fv(n, r, o, c) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(o, c), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(o, c), r.state !== n && _f.enqueueReplaceState(r, r.state, null);
  }
  function Gs(n, r, o, c) {
    var p = n.stateNode;
    p.props = o, p.state = n.memoizedState, p.refs = {}, lp(n);
    var y = r.contextType;
    typeof y == "object" && y !== null ? p.context = Fa(y) : (y = Vn(r) ? Jr : Rn.current, p.context = ea(n, y)), p.state = n.memoizedState, y = r.getDerivedStateFromProps, typeof y == "function" && (dp(n, r, y, o), p.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof p.getSnapshotBeforeUpdate == "function" || typeof p.UNSAFE_componentWillMount != "function" && typeof p.componentWillMount != "function" || (r = p.state, typeof p.componentWillMount == "function" && p.componentWillMount(), typeof p.UNSAFE_componentWillMount == "function" && p.UNSAFE_componentWillMount(), r !== p.state && _f.enqueueReplaceState(p, p.state, null), Ps(n, o, p, c), p.state = n.memoizedState), typeof p.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Hl(n, r) {
    try {
      var o = "", c = r;
      do
        o += yt(c), c = c.return;
      while (c);
      var p = o;
    } catch (y) {
      p = `
Error generating stack: ` + y.message + `
` + y.stack;
    }
    return { value: n, source: r, stack: p, digest: null };
  }
  function pp(n, r, o) {
    return { value: n, source: null, stack: o ?? null, digest: r ?? null };
  }
  function hp(n, r) {
    try {
      console.error(r.value);
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  var Of = typeof WeakMap == "function" ? WeakMap : Map;
  function Hv(n, r, o) {
    o = uo(-1, o), o.tag = 3, o.payload = { element: null };
    var c = r.value;
    return o.callback = function() {
      Bu || (Bu = !0, Yl = c), hp(n, r);
    }, o;
  }
  function vp(n, r, o) {
    o = uo(-1, o), o.tag = 3;
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var p = r.value;
      o.payload = function() {
        return c(p);
      }, o.callback = function() {
        hp(n, r);
      };
    }
    var y = n.stateNode;
    return y !== null && typeof y.componentDidCatch == "function" && (o.callback = function() {
      hp(n, r), typeof c != "function" && (qo === null ? qo = /* @__PURE__ */ new Set([this]) : qo.add(this));
      var x = r.stack;
      this.componentDidCatch(r.value, { componentStack: x !== null ? x : "" });
    }), o;
  }
  function mp(n, r, o) {
    var c = n.pingCache;
    if (c === null) {
      c = n.pingCache = new Of();
      var p = /* @__PURE__ */ new Set();
      c.set(r, p);
    } else p = c.get(r), p === void 0 && (p = /* @__PURE__ */ new Set(), c.set(r, p));
    p.has(o) || (p.add(o), n = Vg.bind(null, n, r, o), r.then(n, n));
  }
  function Bv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Qo(n, r, o, c, p) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = p, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, o.flags |= 131072, o.flags &= -52805, o.tag === 1 && (o.alternate === null ? o.tag = 17 : (r = uo(-1, 1), r.tag = 2, $o(o, r, 1))), o.lanes |= 1), n);
  }
  var Qs = pe.ReactCurrentOwner, Fn = !1;
  function pr(n, r, o, c) {
    r.child = n === null ? Re(r, null, o, c) : kn(r, n.child, o, c);
  }
  function ia(n, r, o, c, p) {
    o = o.render;
    var y = r.ref;
    return En(r, p), c = Wo(n, r, o, c, y, p), o = fi(), n !== null && !Fn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~p, Ba(n, r, p)) : (vn && o && af(r), r.flags |= 1, pr(n, r, c, p), r.child);
  }
  function Bl(n, r, o, c, p) {
    if (n === null) {
      var y = o.type;
      return typeof y == "function" && !Mp(y) && y.defaultProps === void 0 && o.compare === null && o.defaultProps === void 0 ? (r.tag = 15, r.type = y, St(n, r, y, c, p)) : (n = cc(o.type, null, c, r, r.mode, p), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (y = n.child, !(n.lanes & p)) {
      var x = y.memoizedProps;
      if (o = o.compare, o = o !== null ? o : bs, o(x, c) && n.ref === r.ref) return Ba(n, r, p);
    }
    return r.flags |= 1, n = Zo(y, c), n.ref = r.ref, n.return = r, r.child = n;
  }
  function St(n, r, o, c, p) {
    if (n !== null) {
      var y = n.memoizedProps;
      if (bs(y, c) && n.ref === r.ref) if (Fn = !1, r.pendingProps = c = y, (n.lanes & p) !== 0) n.flags & 131072 && (Fn = !0);
      else return r.lanes = n.lanes, Ba(n, r, p);
    }
    return Iv(n, r, o, c, p);
  }
  function Ks(n, r, o) {
    var c = r.pendingProps, p = c.children, y = n !== null ? n.memoizedState : null;
    if (c.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, $e(ju, Ta), Ta |= o;
    else {
      if (!(o & 1073741824)) return n = y !== null ? y.baseLanes | o : o, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, $e(ju, Ta), Ta |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, c = y !== null ? y.baseLanes : o, $e(ju, Ta), Ta |= c;
    }
    else y !== null ? (c = y.baseLanes | o, r.memoizedState = null) : c = o, $e(ju, Ta), Ta |= c;
    return pr(n, r, p, o), r.child;
  }
  function yp(n, r) {
    var o = r.ref;
    (n === null && o !== null || n !== null && n.ref !== o) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Iv(n, r, o, c, p) {
    var y = Vn(o) ? Jr : Rn.current;
    return y = ea(r, y), En(r, p), o = Wo(n, r, o, c, y, p), c = fi(), n !== null && !Fn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~p, Ba(n, r, p)) : (vn && c && af(r), r.flags |= 1, pr(n, r, o, p), r.child);
  }
  function Yv(n, r, o, c, p) {
    if (Vn(o)) {
      var y = !0;
      nr(r);
    } else y = !1;
    if (En(r, p), r.stateNode === null) Ha(n, r), Mf(r, o, c), Gs(r, o, c, p), c = !0;
    else if (n === null) {
      var x = r.stateNode, O = r.memoizedProps;
      x.props = O;
      var U = x.context, G = o.contextType;
      typeof G == "object" && G !== null ? G = Fa(G) : (G = Vn(o) ? Jr : Rn.current, G = ea(r, G));
      var le = o.getDerivedStateFromProps, ce = typeof le == "function" || typeof x.getSnapshotBeforeUpdate == "function";
      ce || typeof x.UNSAFE_componentWillReceiveProps != "function" && typeof x.componentWillReceiveProps != "function" || (O !== c || U !== G) && Fv(r, x, c, G), xa = !1;
      var oe = r.memoizedState;
      x.state = oe, Ps(r, c, x, p), U = r.memoizedState, O !== c || oe !== U || qn.current || xa ? (typeof le == "function" && (dp(r, o, le, c), U = r.memoizedState), (O = xa || jv(r, o, O, c, oe, U, G)) ? (ce || typeof x.UNSAFE_componentWillMount != "function" && typeof x.componentWillMount != "function" || (typeof x.componentWillMount == "function" && x.componentWillMount(), typeof x.UNSAFE_componentWillMount == "function" && x.UNSAFE_componentWillMount()), typeof x.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof x.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = c, r.memoizedState = U), x.props = c, x.state = U, x.context = G, c = O) : (typeof x.componentDidMount == "function" && (r.flags |= 4194308), c = !1);
    } else {
      x = r.stateNode, Pv(n, r), O = r.memoizedProps, G = r.type === r.elementType ? O : di(r.type, O), x.props = G, ce = r.pendingProps, oe = x.context, U = o.contextType, typeof U == "object" && U !== null ? U = Fa(U) : (U = Vn(o) ? Jr : Rn.current, U = ea(r, U));
      var ke = o.getDerivedStateFromProps;
      (le = typeof ke == "function" || typeof x.getSnapshotBeforeUpdate == "function") || typeof x.UNSAFE_componentWillReceiveProps != "function" && typeof x.componentWillReceiveProps != "function" || (O !== ce || oe !== U) && Fv(r, x, c, U), xa = !1, oe = r.memoizedState, x.state = oe, Ps(r, c, x, p);
      var Ve = r.memoizedState;
      O !== ce || oe !== Ve || qn.current || xa ? (typeof ke == "function" && (dp(r, o, ke, c), Ve = r.memoizedState), (G = xa || jv(r, o, G, c, oe, Ve, U) || !1) ? (le || typeof x.UNSAFE_componentWillUpdate != "function" && typeof x.componentWillUpdate != "function" || (typeof x.componentWillUpdate == "function" && x.componentWillUpdate(c, Ve, U), typeof x.UNSAFE_componentWillUpdate == "function" && x.UNSAFE_componentWillUpdate(c, Ve, U)), typeof x.componentDidUpdate == "function" && (r.flags |= 4), typeof x.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof x.componentDidUpdate != "function" || O === n.memoizedProps && oe === n.memoizedState || (r.flags |= 4), typeof x.getSnapshotBeforeUpdate != "function" || O === n.memoizedProps && oe === n.memoizedState || (r.flags |= 1024), r.memoizedProps = c, r.memoizedState = Ve), x.props = c, x.state = Ve, x.context = U, c = G) : (typeof x.componentDidUpdate != "function" || O === n.memoizedProps && oe === n.memoizedState || (r.flags |= 4), typeof x.getSnapshotBeforeUpdate != "function" || O === n.memoizedProps && oe === n.memoizedState || (r.flags |= 1024), c = !1);
    }
    return qs(n, r, o, c, y, p);
  }
  function qs(n, r, o, c, p, y) {
    yp(n, r);
    var x = (r.flags & 128) !== 0;
    if (!c && !x) return p && nf(r, o, !1), Ba(n, r, y);
    c = r.stateNode, Qs.current = r;
    var O = x && typeof o.getDerivedStateFromError != "function" ? null : c.render();
    return r.flags |= 1, n !== null && x ? (r.child = kn(r, n.child, null, y), r.child = kn(r, null, O, y)) : pr(n, r, O, y), r.memoizedState = c.state, p && nf(r, o, !0), r.child;
  }
  function Vu(n) {
    var r = n.stateNode;
    r.pendingContext ? Ov(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Ov(n, r.context, !1), sp(n, r.containerInfo);
  }
  function $v(n, r, o, c, p) {
    return Yo(), lo(p), r.flags |= 256, pr(n, r, o, c), r.child;
  }
  var Lf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function gp(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Af(n, r, o) {
    var c = r.pendingProps, p = xn.current, y = !1, x = (r.flags & 128) !== 0, O;
    if ((O = x) || (O = n !== null && n.memoizedState === null ? !1 : (p & 2) !== 0), O ? (y = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (p |= 1), $e(xn, p & 1), n === null)
      return ep(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (x = c.children, n = c.fallback, y ? (c = r.mode, y = r.child, x = { mode: "hidden", children: x }, !(c & 1) && y !== null ? (y.childLanes = 0, y.pendingProps = x) : y = Jo(x, c, 0, null), n = ho(n, c, o, null), y.return = r, n.return = r, y.sibling = n, r.child = y, r.child.memoizedState = gp(o), r.memoizedState = Lf, n) : Sp(r, x));
    if (p = n.memoizedState, p !== null && (O = p.dehydrated, O !== null)) return Wv(n, r, x, c, O, p, o);
    if (y) {
      y = c.fallback, x = r.mode, p = n.child, O = p.sibling;
      var U = { mode: "hidden", children: c.children };
      return !(x & 1) && r.child !== p ? (c = r.child, c.childLanes = 0, c.pendingProps = U, r.deletions = null) : (c = Zo(p, U), c.subtreeFlags = p.subtreeFlags & 14680064), O !== null ? y = Zo(O, y) : (y = ho(y, x, o, null), y.flags |= 2), y.return = r, c.return = r, c.sibling = y, r.child = c, c = y, y = r.child, x = n.child.memoizedState, x = x === null ? gp(o) : { baseLanes: x.baseLanes | o, cachePool: null, transitions: x.transitions }, y.memoizedState = x, y.childLanes = n.childLanes & ~o, r.memoizedState = Lf, c;
    }
    return y = n.child, n = y.sibling, c = Zo(y, { mode: "visible", children: c.children }), !(r.mode & 1) && (c.lanes = o), c.return = r, c.sibling = null, n !== null && (o = r.deletions, o === null ? (r.deletions = [n], r.flags |= 16) : o.push(n)), r.child = c, r.memoizedState = null, c;
  }
  function Sp(n, r) {
    return r = Jo({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Xs(n, r, o, c) {
    return c !== null && lo(c), kn(r, n.child, null, o), n = Sp(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Wv(n, r, o, c, p, y, x) {
    if (o)
      return r.flags & 256 ? (r.flags &= -257, c = pp(Error(f(422))), Xs(n, r, x, c)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (y = c.fallback, p = r.mode, c = Jo({ mode: "visible", children: c.children }, p, 0, null), y = ho(y, p, x, null), y.flags |= 2, c.return = r, y.return = r, c.sibling = y, r.child = c, r.mode & 1 && kn(r, n.child, null, x), r.child.memoizedState = gp(x), r.memoizedState = Lf, y);
    if (!(r.mode & 1)) return Xs(n, r, x, null);
    if (p.data === "$!") {
      if (c = p.nextSibling && p.nextSibling.dataset, c) var O = c.dgst;
      return c = O, y = Error(f(419)), c = pp(y, c, void 0), Xs(n, r, x, c);
    }
    if (O = (x & n.childLanes) !== 0, Fn || O) {
      if (c = Zn, c !== null) {
        switch (x & -x) {
          case 4:
            p = 2;
            break;
          case 16:
            p = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            p = 32;
            break;
          case 536870912:
            p = 268435456;
            break;
          default:
            p = 0;
        }
        p = p & (c.suspendedLanes | x) ? 0 : p, p !== 0 && p !== y.retryLane && (y.retryLane = p, Ea(n, p), Fr(c, n, p, -1));
      }
      return _p(), c = pp(Error(f(421))), Xs(n, r, x, c);
    }
    return p.data === "$?" ? (r.flags |= 128, r.child = n.child, r = zg.bind(null, n), p._reactRetry = r, null) : (n = y.treeContext, na = _i(p.nextSibling), ta = r, vn = !0, ja = null, n !== null && (zn[za++] = Ai, zn[za++] = Ni, zn[za++] = Sa, Ai = n.id, Ni = n.overflow, Sa = r), r = Sp(r, c.children), r.flags |= 4096, r);
  }
  function Cp(n, r, o) {
    n.lanes |= r;
    var c = n.alternate;
    c !== null && (c.lanes |= r), ap(n.return, r, o);
  }
  function Vr(n, r, o, c, p) {
    var y = n.memoizedState;
    y === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: c, tail: o, tailMode: p } : (y.isBackwards = r, y.rendering = null, y.renderingStartTime = 0, y.last = c, y.tail = o, y.tailMode = p);
  }
  function Ui(n, r, o) {
    var c = r.pendingProps, p = c.revealOrder, y = c.tail;
    if (pr(n, r, c.children, o), c = xn.current, c & 2) c = c & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Cp(n, o, r);
        else if (n.tag === 19) Cp(n, o, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      c &= 1;
    }
    if ($e(xn, c), !(r.mode & 1)) r.memoizedState = null;
    else switch (p) {
      case "forwards":
        for (o = r.child, p = null; o !== null; ) n = o.alternate, n !== null && ff(n) === null && (p = o), o = o.sibling;
        o = p, o === null ? (p = r.child, r.child = null) : (p = o.sibling, o.sibling = null), Vr(r, !1, p, o, y);
        break;
      case "backwards":
        for (o = null, p = r.child, r.child = null; p !== null; ) {
          if (n = p.alternate, n !== null && ff(n) === null) {
            r.child = p;
            break;
          }
          n = p.sibling, p.sibling = o, o = p, p = n;
        }
        Vr(r, !0, o, null, y);
        break;
      case "together":
        Vr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Ha(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ba(n, r, o) {
    if (n !== null && (r.dependencies = n.dependencies), ji |= r.lanes, !(o & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(f(153));
    if (r.child !== null) {
      for (n = r.child, o = Zo(n, n.pendingProps), r.child = o, o.return = r; n.sibling !== null; ) n = n.sibling, o = o.sibling = Zo(n, n.pendingProps), o.return = r;
      o.sibling = null;
    }
    return r.child;
  }
  function Zs(n, r, o) {
    switch (r.tag) {
      case 3:
        Vu(r), Yo();
        break;
      case 5:
        Vv(r);
        break;
      case 1:
        Vn(r.type) && nr(r);
        break;
      case 4:
        sp(r, r.stateNode.containerInfo);
        break;
      case 10:
        var c = r.type._context, p = r.memoizedProps.value;
        $e(Ca, c._currentValue), c._currentValue = p;
        break;
      case 13:
        if (c = r.memoizedState, c !== null)
          return c.dehydrated !== null ? ($e(xn, xn.current & 1), r.flags |= 128, null) : o & r.child.childLanes ? Af(n, r, o) : ($e(xn, xn.current & 1), n = Ba(n, r, o), n !== null ? n.sibling : null);
        $e(xn, xn.current & 1);
        break;
      case 19:
        if (c = (o & r.childLanes) !== 0, n.flags & 128) {
          if (c) return Ui(n, r, o);
          r.flags |= 128;
        }
        if (p = r.memoizedState, p !== null && (p.rendering = null, p.tail = null, p.lastEffect = null), $e(xn, xn.current), c) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ks(n, r, o);
    }
    return Ba(n, r, o);
  }
  var Ia, Hn, Gv, Qv;
  Ia = function(n, r) {
    for (var o = r.child; o !== null; ) {
      if (o.tag === 5 || o.tag === 6) n.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === r) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === r) return;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
  }, Hn = function() {
  }, Gv = function(n, r, o, c) {
    var p = n.memoizedProps;
    if (p !== c) {
      n = r.stateNode, Al(Pi.current);
      var y = null;
      switch (o) {
        case "input":
          p = ur(n, p), c = ur(n, c), y = [];
          break;
        case "select":
          p = ye({}, p, { value: void 0 }), c = ye({}, c, { value: void 0 }), y = [];
          break;
        case "textarea":
          p = Qn(n, p), c = Qn(n, c), y = [];
          break;
        default:
          typeof p.onClick != "function" && typeof c.onClick == "function" && (n.onclick = zo);
      }
      fn(o, c);
      var x;
      o = null;
      for (G in p) if (!c.hasOwnProperty(G) && p.hasOwnProperty(G) && p[G] != null) if (G === "style") {
        var O = p[G];
        for (x in O) O.hasOwnProperty(x) && (o || (o = {}), o[x] = "");
      } else G !== "dangerouslySetInnerHTML" && G !== "children" && G !== "suppressContentEditableWarning" && G !== "suppressHydrationWarning" && G !== "autoFocus" && (S.hasOwnProperty(G) ? y || (y = []) : (y = y || []).push(G, null));
      for (G in c) {
        var U = c[G];
        if (O = p != null ? p[G] : void 0, c.hasOwnProperty(G) && U !== O && (U != null || O != null)) if (G === "style") if (O) {
          for (x in O) !O.hasOwnProperty(x) || U && U.hasOwnProperty(x) || (o || (o = {}), o[x] = "");
          for (x in U) U.hasOwnProperty(x) && O[x] !== U[x] && (o || (o = {}), o[x] = U[x]);
        } else o || (y || (y = []), y.push(
          G,
          o
        )), o = U;
        else G === "dangerouslySetInnerHTML" ? (U = U ? U.__html : void 0, O = O ? O.__html : void 0, U != null && O !== U && (y = y || []).push(G, U)) : G === "children" ? typeof U != "string" && typeof U != "number" || (y = y || []).push(G, "" + U) : G !== "suppressContentEditableWarning" && G !== "suppressHydrationWarning" && (S.hasOwnProperty(G) ? (U != null && G === "onScroll" && Gt("scroll", n), y || O === U || (y = [])) : (y = y || []).push(G, U));
      }
      o && (y = y || []).push("style", o);
      var G = y;
      (r.updateQueue = G) && (r.flags |= 4);
    }
  }, Qv = function(n, r, o, c) {
    o !== c && (r.flags |= 4);
  };
  function Js(n, r) {
    if (!vn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var o = null; r !== null; ) r.alternate !== null && (o = r), r = r.sibling;
        o === null ? n.tail = null : o.sibling = null;
        break;
      case "collapsed":
        o = n.tail;
        for (var c = null; o !== null; ) o.alternate !== null && (c = o), o = o.sibling;
        c === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : c.sibling = null;
    }
  }
  function ar(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, o = 0, c = 0;
    if (r) for (var p = n.child; p !== null; ) o |= p.lanes | p.childLanes, c |= p.subtreeFlags & 14680064, c |= p.flags & 14680064, p.return = n, p = p.sibling;
    else for (p = n.child; p !== null; ) o |= p.lanes | p.childLanes, c |= p.subtreeFlags, c |= p.flags, p.return = n, p = p.sibling;
    return n.subtreeFlags |= c, n.childLanes = o, r;
  }
  function Kv(n, r, o) {
    var c = r.pendingProps;
    switch (of(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ar(r), null;
      case 1:
        return Vn(r.type) && Lu(), ar(r), null;
      case 3:
        return c = r.stateNode, Nl(), cn(qn), cn(Rn), Ge(), c.pendingContext && (c.context = c.pendingContext, c.pendingContext = null), (n === null || n.child === null) && (lf(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, ja !== null && ($l(ja), ja = null))), Hn(n, r), ar(r), null;
      case 5:
        cf(r);
        var p = Al(zs.current);
        if (o = r.type, n !== null && r.stateNode != null) Gv(n, r, o, c, p), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!c) {
            if (r.stateNode === null) throw Error(f(166));
            return ar(r), null;
          }
          if (n = Al(Pi.current), lf(r)) {
            c = r.stateNode, o = r.type;
            var y = r.memoizedProps;
            switch (c[Mi] = r, c[Os] = y, n = (r.mode & 1) !== 0, o) {
              case "dialog":
                Gt("cancel", c), Gt("close", c);
                break;
              case "iframe":
              case "object":
              case "embed":
                Gt("load", c);
                break;
              case "video":
              case "audio":
                for (p = 0; p < ks.length; p++) Gt(ks[p], c);
                break;
              case "source":
                Gt("error", c);
                break;
              case "img":
              case "image":
              case "link":
                Gt(
                  "error",
                  c
                ), Gt("load", c);
                break;
              case "details":
                Gt("toggle", c);
                break;
              case "input":
                Wn(c, y), Gt("invalid", c);
                break;
              case "select":
                c._wrapperState = { wasMultiple: !!y.multiple }, Gt("invalid", c);
                break;
              case "textarea":
                br(c, y), Gt("invalid", c);
            }
            fn(o, y), p = null;
            for (var x in y) if (y.hasOwnProperty(x)) {
              var O = y[x];
              x === "children" ? typeof O == "string" ? c.textContent !== O && (y.suppressHydrationWarning !== !0 && Zc(c.textContent, O, n), p = ["children", O]) : typeof O == "number" && c.textContent !== "" + O && (y.suppressHydrationWarning !== !0 && Zc(
                c.textContent,
                O,
                n
              ), p = ["children", "" + O]) : S.hasOwnProperty(x) && O != null && x === "onScroll" && Gt("scroll", c);
            }
            switch (o) {
              case "input":
                Kt(c), Si(c, y, !0);
                break;
              case "textarea":
                Kt(c), Pn(c);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof y.onClick == "function" && (c.onclick = zo);
            }
            c = p, r.updateQueue = c, c !== null && (r.flags |= 4);
          } else {
            x = p.nodeType === 9 ? p : p.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = wr(o)), n === "http://www.w3.org/1999/xhtml" ? o === "script" ? (n = x.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof c.is == "string" ? n = x.createElement(o, { is: c.is }) : (n = x.createElement(o), o === "select" && (x = n, c.multiple ? x.multiple = !0 : c.size && (x.size = c.size))) : n = x.createElementNS(n, o), n[Mi] = r, n[Os] = c, Ia(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (x = tr(o, c), o) {
                case "dialog":
                  Gt("cancel", n), Gt("close", n), p = c;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Gt("load", n), p = c;
                  break;
                case "video":
                case "audio":
                  for (p = 0; p < ks.length; p++) Gt(ks[p], n);
                  p = c;
                  break;
                case "source":
                  Gt("error", n), p = c;
                  break;
                case "img":
                case "image":
                case "link":
                  Gt(
                    "error",
                    n
                  ), Gt("load", n), p = c;
                  break;
                case "details":
                  Gt("toggle", n), p = c;
                  break;
                case "input":
                  Wn(n, c), p = ur(n, c), Gt("invalid", n);
                  break;
                case "option":
                  p = c;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!c.multiple }, p = ye({}, c, { value: void 0 }), Gt("invalid", n);
                  break;
                case "textarea":
                  br(n, c), p = Qn(n, c), Gt("invalid", n);
                  break;
                default:
                  p = c;
              }
              fn(o, p), O = p;
              for (y in O) if (O.hasOwnProperty(y)) {
                var U = O[y];
                y === "style" ? on(n, U) : y === "dangerouslySetInnerHTML" ? (U = U ? U.__html : void 0, U != null && Ci(n, U)) : y === "children" ? typeof U == "string" ? (o !== "textarea" || U !== "") && me(n, U) : typeof U == "number" && me(n, "" + U) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (S.hasOwnProperty(y) ? U != null && y === "onScroll" && Gt("scroll", n) : U != null && q(n, y, U, x));
              }
              switch (o) {
                case "input":
                  Kt(n), Si(n, c, !1);
                  break;
                case "textarea":
                  Kt(n), Pn(n);
                  break;
                case "option":
                  c.value != null && n.setAttribute("value", "" + gt(c.value));
                  break;
                case "select":
                  n.multiple = !!c.multiple, y = c.value, y != null ? wn(n, !!c.multiple, y, !1) : c.defaultValue != null && wn(
                    n,
                    !!c.multiple,
                    c.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof p.onClick == "function" && (n.onclick = zo);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c = !!c.autoFocus;
                  break e;
                case "img":
                  c = !0;
                  break e;
                default:
                  c = !1;
              }
            }
            c && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return ar(r), null;
      case 6:
        if (n && r.stateNode != null) Qv(n, r, n.memoizedProps, c);
        else {
          if (typeof c != "string" && r.stateNode === null) throw Error(f(166));
          if (o = Al(zs.current), Al(Pi.current), lf(r)) {
            if (c = r.stateNode, o = r.memoizedProps, c[Mi] = r, (y = c.nodeValue !== o) && (n = ta, n !== null)) switch (n.tag) {
              case 3:
                Zc(c.nodeValue, o, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Zc(c.nodeValue, o, (n.mode & 1) !== 0);
            }
            y && (r.flags |= 4);
          } else c = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(c), c[Mi] = r, r.stateNode = c;
        }
        return ar(r), null;
      case 13:
        if (cn(xn), c = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (vn && na !== null && r.mode & 1 && !(r.flags & 128)) Ns(), Yo(), r.flags |= 98560, y = !1;
          else if (y = lf(r), c !== null && c.dehydrated !== null) {
            if (n === null) {
              if (!y) throw Error(f(318));
              if (y = r.memoizedState, y = y !== null ? y.dehydrated : null, !y) throw Error(f(317));
              y[Mi] = r;
            } else Yo(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            ar(r), y = !1;
          } else ja !== null && ($l(ja), ja = null), y = !0;
          if (!y) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = o, r) : (c = c !== null, c !== (n !== null && n.memoizedState !== null) && c && (r.child.flags |= 8192, r.mode & 1 && (n === null || xn.current & 1 ? On === 0 && (On = 3) : _p())), r.updateQueue !== null && (r.flags |= 4), ar(r), null);
      case 4:
        return Nl(), Hn(n, r), n === null && Du(r.stateNode.containerInfo), ar(r), null;
      case 10:
        return rp(r.type._context), ar(r), null;
      case 17:
        return Vn(r.type) && Lu(), ar(r), null;
      case 19:
        if (cn(xn), y = r.memoizedState, y === null) return ar(r), null;
        if (c = (r.flags & 128) !== 0, x = y.rendering, x === null) if (c) Js(y, !1);
        else {
          if (On !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (x = ff(n), x !== null) {
              for (r.flags |= 128, Js(y, !1), c = x.updateQueue, c !== null && (r.updateQueue = c, r.flags |= 4), r.subtreeFlags = 0, c = o, o = r.child; o !== null; ) y = o, n = c, y.flags &= 14680066, x = y.alternate, x === null ? (y.childLanes = 0, y.lanes = n, y.child = null, y.subtreeFlags = 0, y.memoizedProps = null, y.memoizedState = null, y.updateQueue = null, y.dependencies = null, y.stateNode = null) : (y.childLanes = x.childLanes, y.lanes = x.lanes, y.child = x.child, y.subtreeFlags = 0, y.deletions = null, y.memoizedProps = x.memoizedProps, y.memoizedState = x.memoizedState, y.updateQueue = x.updateQueue, y.type = x.type, n = x.dependencies, y.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), o = o.sibling;
              return $e(xn, xn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          y.tail !== null && mt() > Hu && (r.flags |= 128, c = !0, Js(y, !1), r.lanes = 4194304);
        }
        else {
          if (!c) if (n = ff(x), n !== null) {
            if (r.flags |= 128, c = !0, o = n.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), Js(y, !0), y.tail === null && y.tailMode === "hidden" && !x.alternate && !vn) return ar(r), null;
          } else 2 * mt() - y.renderingStartTime > Hu && o !== 1073741824 && (r.flags |= 128, c = !0, Js(y, !1), r.lanes = 4194304);
          y.isBackwards ? (x.sibling = r.child, r.child = x) : (o = y.last, o !== null ? o.sibling = x : r.child = x, y.last = x);
        }
        return y.tail !== null ? (r = y.tail, y.rendering = r, y.tail = r.sibling, y.renderingStartTime = mt(), r.sibling = null, o = xn.current, $e(xn, c ? o & 1 | 2 : o & 1), r) : (ar(r), null);
      case 22:
      case 23:
        return kp(), c = r.memoizedState !== null, n !== null && n.memoizedState !== null !== c && (r.flags |= 8192), c && r.mode & 1 ? Ta & 1073741824 && (ar(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : ar(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(f(156, r.tag));
  }
  function Nf(n, r) {
    switch (of(r), r.tag) {
      case 1:
        return Vn(r.type) && Lu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Nl(), cn(qn), cn(Rn), Ge(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return cf(r), null;
      case 13:
        if (cn(xn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(f(340));
          Yo();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return cn(xn), null;
      case 4:
        return Nl(), null;
      case 10:
        return rp(r.type._context), null;
      case 22:
      case 23:
        return kp(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ec = !1, Mr = !1, Og = typeof WeakSet == "function" ? WeakSet : Set, Le = null;
  function zu(n, r) {
    var o = n.ref;
    if (o !== null) if (typeof o == "function") try {
      o(null);
    } catch (c) {
      mn(n, r, c);
    }
    else o.current = null;
  }
  function Pf(n, r, o) {
    try {
      o();
    } catch (c) {
      mn(n, r, c);
    }
  }
  var qv = !1;
  function Xv(n, r) {
    if (Ms = Na, n = ws(), Yc(n)) {
      if ("selectionStart" in n) var o = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        o = (o = n.ownerDocument) && o.defaultView || window;
        var c = o.getSelection && o.getSelection();
        if (c && c.rangeCount !== 0) {
          o = c.anchorNode;
          var p = c.anchorOffset, y = c.focusNode;
          c = c.focusOffset;
          try {
            o.nodeType, y.nodeType;
          } catch {
            o = null;
            break e;
          }
          var x = 0, O = -1, U = -1, G = 0, le = 0, ce = n, oe = null;
          t: for (; ; ) {
            for (var ke; ce !== o || p !== 0 && ce.nodeType !== 3 || (O = x + p), ce !== y || c !== 0 && ce.nodeType !== 3 || (U = x + c), ce.nodeType === 3 && (x += ce.nodeValue.length), (ke = ce.firstChild) !== null; )
              oe = ce, ce = ke;
            for (; ; ) {
              if (ce === n) break t;
              if (oe === o && ++G === p && (O = x), oe === y && ++le === c && (U = x), (ke = ce.nextSibling) !== null) break;
              ce = oe, oe = ce.parentNode;
            }
            ce = ke;
          }
          o = O === -1 || U === -1 ? null : { start: O, end: U };
        } else o = null;
      }
      o = o || { start: 0, end: 0 };
    } else o = null;
    for (Dl = { focusedElem: n, selectionRange: o }, Na = !1, Le = r; Le !== null; ) if (r = Le, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Le = n;
    else for (; Le !== null; ) {
      r = Le;
      try {
        var Ve = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ve !== null) {
              var He = Ve.memoizedProps, Ln = Ve.memoizedState, H = r.stateNode, j = H.getSnapshotBeforeUpdate(r.elementType === r.type ? He : di(r.type, He), Ln);
              H.__reactInternalSnapshotBeforeUpdate = j;
            }
            break;
          case 3:
            var Y = r.stateNode.containerInfo;
            Y.nodeType === 1 ? Y.textContent = "" : Y.nodeType === 9 && Y.documentElement && Y.removeChild(Y.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(f(163));
        }
      } catch (ue) {
        mn(r, r.return, ue);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Le = n;
        break;
      }
      Le = r.return;
    }
    return Ve = qv, qv = !1, Ve;
  }
  function tc(n, r, o) {
    var c = r.updateQueue;
    if (c = c !== null ? c.lastEffect : null, c !== null) {
      var p = c = c.next;
      do {
        if ((p.tag & n) === n) {
          var y = p.destroy;
          p.destroy = void 0, y !== void 0 && Pf(r, o, y);
        }
        p = p.next;
      } while (p !== c);
    }
  }
  function nc(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & n) === n) {
          var c = o.create;
          o.destroy = c();
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Ep(n) {
    var r = n.ref;
    if (r !== null) {
      var o = n.stateNode;
      switch (n.tag) {
        case 5:
          n = o;
          break;
        default:
          n = o;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Uf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Uf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Mi], delete r[Os], delete r[Ls], delete r[Ou], delete r[_g])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function rc(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function co(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || rc(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Vi(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, r ? o.nodeType === 8 ? o.parentNode.insertBefore(n, r) : o.insertBefore(n, r) : (o.nodeType === 8 ? (r = o.parentNode, r.insertBefore(n, o)) : (r = o, r.appendChild(n)), o = o._reactRootContainer, o != null || r.onclick !== null || (r.onclick = zo));
    else if (c !== 4 && (n = n.child, n !== null)) for (Vi(n, r, o), n = n.sibling; n !== null; ) Vi(n, r, o), n = n.sibling;
  }
  function zi(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, r ? o.insertBefore(n, r) : o.appendChild(n);
    else if (c !== 4 && (n = n.child, n !== null)) for (zi(n, r, o), n = n.sibling; n !== null; ) zi(n, r, o), n = n.sibling;
  }
  var Mn = null, zr = !1;
  function jr(n, r, o) {
    for (o = o.child; o !== null; ) Zv(n, r, o), o = o.sibling;
  }
  function Zv(n, r, o) {
    if (Xr && typeof Xr.onCommitFiberUnmount == "function") try {
      Xr.onCommitFiberUnmount(_o, o);
    } catch {
    }
    switch (o.tag) {
      case 5:
        Mr || zu(o, r);
      case 6:
        var c = Mn, p = zr;
        Mn = null, jr(n, r, o), Mn = c, zr = p, Mn !== null && (zr ? (n = Mn, o = o.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(o) : n.removeChild(o)) : Mn.removeChild(o.stateNode));
        break;
      case 18:
        Mn !== null && (zr ? (n = Mn, o = o.stateNode, n.nodeType === 8 ? Mu(n.parentNode, o) : n.nodeType === 1 && Mu(n, o), li(n)) : Mu(Mn, o.stateNode));
        break;
      case 4:
        c = Mn, p = zr, Mn = o.stateNode.containerInfo, zr = !0, jr(n, r, o), Mn = c, zr = p;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Mr && (c = o.updateQueue, c !== null && (c = c.lastEffect, c !== null))) {
          p = c = c.next;
          do {
            var y = p, x = y.destroy;
            y = y.tag, x !== void 0 && (y & 2 || y & 4) && Pf(o, r, x), p = p.next;
          } while (p !== c);
        }
        jr(n, r, o);
        break;
      case 1:
        if (!Mr && (zu(o, r), c = o.stateNode, typeof c.componentWillUnmount == "function")) try {
          c.props = o.memoizedProps, c.state = o.memoizedState, c.componentWillUnmount();
        } catch (O) {
          mn(o, r, O);
        }
        jr(n, r, o);
        break;
      case 21:
        jr(n, r, o);
        break;
      case 22:
        o.mode & 1 ? (Mr = (c = Mr) || o.memoizedState !== null, jr(n, r, o), Mr = c) : jr(n, r, o);
        break;
      default:
        jr(n, r, o);
    }
  }
  function Jv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var o = n.stateNode;
      o === null && (o = n.stateNode = new Og()), r.forEach(function(c) {
        var p = um.bind(null, n, c);
        o.has(c) || (o.add(c), c.then(p, p));
      });
    }
  }
  function pi(n, r) {
    var o = r.deletions;
    if (o !== null) for (var c = 0; c < o.length; c++) {
      var p = o[c];
      try {
        var y = n, x = r, O = x;
        e: for (; O !== null; ) {
          switch (O.tag) {
            case 5:
              Mn = O.stateNode, zr = !1;
              break e;
            case 3:
              Mn = O.stateNode.containerInfo, zr = !0;
              break e;
            case 4:
              Mn = O.stateNode.containerInfo, zr = !0;
              break e;
          }
          O = O.return;
        }
        if (Mn === null) throw Error(f(160));
        Zv(y, x, p), Mn = null, zr = !1;
        var U = p.alternate;
        U !== null && (U.return = null), p.return = null;
      } catch (G) {
        mn(p, r, G);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) xp(r, n), r = r.sibling;
  }
  function xp(n, r) {
    var o = n.alternate, c = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (pi(r, n), oa(n), c & 4) {
          try {
            tc(3, n, n.return), nc(3, n);
          } catch (He) {
            mn(n, n.return, He);
          }
          try {
            tc(5, n, n.return);
          } catch (He) {
            mn(n, n.return, He);
          }
        }
        break;
      case 1:
        pi(r, n), oa(n), c & 512 && o !== null && zu(o, o.return);
        break;
      case 5:
        if (pi(r, n), oa(n), c & 512 && o !== null && zu(o, o.return), n.flags & 32) {
          var p = n.stateNode;
          try {
            me(p, "");
          } catch (He) {
            mn(n, n.return, He);
          }
        }
        if (c & 4 && (p = n.stateNode, p != null)) {
          var y = n.memoizedProps, x = o !== null ? o.memoizedProps : y, O = n.type, U = n.updateQueue;
          if (n.updateQueue = null, U !== null) try {
            O === "input" && y.type === "radio" && y.name != null && Gn(p, y), tr(O, x);
            var G = tr(O, y);
            for (x = 0; x < U.length; x += 2) {
              var le = U[x], ce = U[x + 1];
              le === "style" ? on(p, ce) : le === "dangerouslySetInnerHTML" ? Ci(p, ce) : le === "children" ? me(p, ce) : q(p, le, ce, G);
            }
            switch (O) {
              case "input":
                qr(p, y);
                break;
              case "textarea":
                Ja(p, y);
                break;
              case "select":
                var oe = p._wrapperState.wasMultiple;
                p._wrapperState.wasMultiple = !!y.multiple;
                var ke = y.value;
                ke != null ? wn(p, !!y.multiple, ke, !1) : oe !== !!y.multiple && (y.defaultValue != null ? wn(
                  p,
                  !!y.multiple,
                  y.defaultValue,
                  !0
                ) : wn(p, !!y.multiple, y.multiple ? [] : "", !1));
            }
            p[Os] = y;
          } catch (He) {
            mn(n, n.return, He);
          }
        }
        break;
      case 6:
        if (pi(r, n), oa(n), c & 4) {
          if (n.stateNode === null) throw Error(f(162));
          p = n.stateNode, y = n.memoizedProps;
          try {
            p.nodeValue = y;
          } catch (He) {
            mn(n, n.return, He);
          }
        }
        break;
      case 3:
        if (pi(r, n), oa(n), c & 4 && o !== null && o.memoizedState.isDehydrated) try {
          li(r.containerInfo);
        } catch (He) {
          mn(n, n.return, He);
        }
        break;
      case 4:
        pi(r, n), oa(n);
        break;
      case 13:
        pi(r, n), oa(n), p = n.child, p.flags & 8192 && (y = p.memoizedState !== null, p.stateNode.isHidden = y, !y || p.alternate !== null && p.alternate.memoizedState !== null || (bp = mt())), c & 4 && Jv(n);
        break;
      case 22:
        if (le = o !== null && o.memoizedState !== null, n.mode & 1 ? (Mr = (G = Mr) || le, pi(r, n), Mr = G) : pi(r, n), oa(n), c & 8192) {
          if (G = n.memoizedState !== null, (n.stateNode.isHidden = G) && !le && n.mode & 1) for (Le = n, le = n.child; le !== null; ) {
            for (ce = Le = le; Le !== null; ) {
              switch (oe = Le, ke = oe.child, oe.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  tc(4, oe, oe.return);
                  break;
                case 1:
                  zu(oe, oe.return);
                  var Ve = oe.stateNode;
                  if (typeof Ve.componentWillUnmount == "function") {
                    c = oe, o = oe.return;
                    try {
                      r = c, Ve.props = r.memoizedProps, Ve.state = r.memoizedState, Ve.componentWillUnmount();
                    } catch (He) {
                      mn(c, o, He);
                    }
                  }
                  break;
                case 5:
                  zu(oe, oe.return);
                  break;
                case 22:
                  if (oe.memoizedState !== null) {
                    ac(ce);
                    continue;
                  }
              }
              ke !== null ? (ke.return = oe, Le = ke) : ac(ce);
            }
            le = le.sibling;
          }
          e: for (le = null, ce = n; ; ) {
            if (ce.tag === 5) {
              if (le === null) {
                le = ce;
                try {
                  p = ce.stateNode, G ? (y = p.style, typeof y.setProperty == "function" ? y.setProperty("display", "none", "important") : y.display = "none") : (O = ce.stateNode, U = ce.memoizedProps.style, x = U != null && U.hasOwnProperty("display") ? U.display : null, O.style.display = Wt("display", x));
                } catch (He) {
                  mn(n, n.return, He);
                }
              }
            } else if (ce.tag === 6) {
              if (le === null) try {
                ce.stateNode.nodeValue = G ? "" : ce.memoizedProps;
              } catch (He) {
                mn(n, n.return, He);
              }
            } else if ((ce.tag !== 22 && ce.tag !== 23 || ce.memoizedState === null || ce === n) && ce.child !== null) {
              ce.child.return = ce, ce = ce.child;
              continue;
            }
            if (ce === n) break e;
            for (; ce.sibling === null; ) {
              if (ce.return === null || ce.return === n) break e;
              le === ce && (le = null), ce = ce.return;
            }
            le === ce && (le = null), ce.sibling.return = ce.return, ce = ce.sibling;
          }
        }
        break;
      case 19:
        pi(r, n), oa(n), c & 4 && Jv(n);
        break;
      case 21:
        break;
      default:
        pi(
          r,
          n
        ), oa(n);
    }
  }
  function oa(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var o = n.return; o !== null; ) {
            if (rc(o)) {
              var c = o;
              break e;
            }
            o = o.return;
          }
          throw Error(f(160));
        }
        switch (c.tag) {
          case 5:
            var p = c.stateNode;
            c.flags & 32 && (me(p, ""), c.flags &= -33);
            var y = co(n);
            zi(n, y, p);
            break;
          case 3:
          case 4:
            var x = c.stateNode.containerInfo, O = co(n);
            Vi(n, O, x);
            break;
          default:
            throw Error(f(161));
        }
      } catch (U) {
        mn(n, n.return, U);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function Lg(n, r, o) {
    Le = n, Tp(n);
  }
  function Tp(n, r, o) {
    for (var c = (n.mode & 1) !== 0; Le !== null; ) {
      var p = Le, y = p.child;
      if (p.tag === 22 && c) {
        var x = p.memoizedState !== null || ec;
        if (!x) {
          var O = p.alternate, U = O !== null && O.memoizedState !== null || Mr;
          O = ec;
          var G = Mr;
          if (ec = x, (Mr = U) && !G) for (Le = p; Le !== null; ) x = Le, U = x.child, x.tag === 22 && x.memoizedState !== null ? Rp(p) : U !== null ? (U.return = x, Le = U) : Rp(p);
          for (; y !== null; ) Le = y, Tp(y), y = y.sibling;
          Le = p, ec = O, Mr = G;
        }
        em(n);
      } else p.subtreeFlags & 8772 && y !== null ? (y.return = p, Le = y) : em(n);
    }
  }
  function em(n) {
    for (; Le !== null; ) {
      var r = Le;
      if (r.flags & 8772) {
        var o = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Mr || nc(5, r);
              break;
            case 1:
              var c = r.stateNode;
              if (r.flags & 4 && !Mr) if (o === null) c.componentDidMount();
              else {
                var p = r.elementType === r.type ? o.memoizedProps : di(r.type, o.memoizedProps);
                c.componentDidUpdate(p, o.memoizedState, c.__reactInternalSnapshotBeforeUpdate);
              }
              var y = r.updateQueue;
              y !== null && up(r, y, c);
              break;
            case 3:
              var x = r.updateQueue;
              if (x !== null) {
                if (o = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    o = r.child.stateNode;
                    break;
                  case 1:
                    o = r.child.stateNode;
                }
                up(r, x, o);
              }
              break;
            case 5:
              var O = r.stateNode;
              if (o === null && r.flags & 4) {
                o = O;
                var U = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    U.autoFocus && o.focus();
                    break;
                  case "img":
                    U.src && (o.src = U.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var G = r.alternate;
                if (G !== null) {
                  var le = G.memoizedState;
                  if (le !== null) {
                    var ce = le.dehydrated;
                    ce !== null && li(ce);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(f(163));
          }
          Mr || r.flags & 512 && Ep(r);
        } catch (oe) {
          mn(r, r.return, oe);
        }
      }
      if (r === n) {
        Le = null;
        break;
      }
      if (o = r.sibling, o !== null) {
        o.return = r.return, Le = o;
        break;
      }
      Le = r.return;
    }
  }
  function ac(n) {
    for (; Le !== null; ) {
      var r = Le;
      if (r === n) {
        Le = null;
        break;
      }
      var o = r.sibling;
      if (o !== null) {
        o.return = r.return, Le = o;
        break;
      }
      Le = r.return;
    }
  }
  function Rp(n) {
    for (; Le !== null; ) {
      var r = Le;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var o = r.return;
            try {
              nc(4, r);
            } catch (U) {
              mn(r, o, U);
            }
            break;
          case 1:
            var c = r.stateNode;
            if (typeof c.componentDidMount == "function") {
              var p = r.return;
              try {
                c.componentDidMount();
              } catch (U) {
                mn(r, p, U);
              }
            }
            var y = r.return;
            try {
              Ep(r);
            } catch (U) {
              mn(r, y, U);
            }
            break;
          case 5:
            var x = r.return;
            try {
              Ep(r);
            } catch (U) {
              mn(r, x, U);
            }
        }
      } catch (U) {
        mn(r, r.return, U);
      }
      if (r === n) {
        Le = null;
        break;
      }
      var O = r.sibling;
      if (O !== null) {
        O.return = r.return, Le = O;
        break;
      }
      Le = r.return;
    }
  }
  var Ag = Math.ceil, Ko = pe.ReactCurrentDispatcher, Il = pe.ReactCurrentOwner, hr = pe.ReactCurrentBatchConfig, Lt = 0, Zn = null, Bn = null, vr = 0, Ta = 0, ju = Va(0), On = 0, ic = null, ji = 0, Fu = 0, Vf = 0, oc = null, la = null, bp = 0, Hu = 1 / 0, Ra = null, Bu = !1, Yl = null, qo = null, zf = !1, fo = null, lc = 0, Xo = 0, Iu = null, uc = -1, Or = 0;
  function In() {
    return Lt & 6 ? mt() : uc !== -1 ? uc : uc = mt();
  }
  function Fi(n) {
    return n.mode & 1 ? Lt & 2 && vr !== 0 ? vr & -vr : Mg.transition !== null ? (Or === 0 && (Or = vu()), Or) : (n = Ft, n !== 0 || (n = window.event, n = n === void 0 ? 16 : xu(n.type)), n) : 1;
  }
  function Fr(n, r, o, c) {
    if (50 < Xo) throw Xo = 0, Iu = null, Error(f(185));
    Zi(n, o, c), (!(Lt & 2) || n !== Zn) && (n === Zn && (!(Lt & 2) && (Fu |= o), On === 4 && hi(n, vr)), ua(n, c), o === 1 && Lt === 0 && !(r.mode & 1) && (Hu = mt() + 500, Au && Li()));
  }
  function ua(n, r) {
    var o = n.callbackNode;
    gl(n, r);
    var c = oi(n, n === Zn ? vr : 0);
    if (c === 0) o !== null && cr(o), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = c & -c, n.callbackPriority !== r) {
      if (o != null && cr(o), r === 1) n.tag === 0 ? Fo(wp.bind(null, n)) : rf(wp.bind(null, n)), _u(function() {
        !(Lt & 6) && Li();
      }), o = null;
      else {
        switch (yu(c)) {
          case 1:
            o = ai;
            break;
          case 4:
            o = ml;
            break;
          case 16:
            o = yl;
            break;
          case 536870912:
            o = du;
            break;
          default:
            o = yl;
        }
        o = cm(o, jf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = o;
    }
  }
  function jf(n, r) {
    if (uc = -1, Or = 0, Lt & 6) throw Error(f(327));
    var o = n.callbackNode;
    if (Yu() && n.callbackNode !== o) return null;
    var c = oi(n, n === Zn ? vr : 0);
    if (c === 0) return null;
    if (c & 30 || c & n.expiredLanes || r) r = Ff(n, c);
    else {
      r = c;
      var p = Lt;
      Lt |= 2;
      var y = nm();
      (Zn !== n || vr !== r) && (Ra = null, Hu = mt() + 500, po(n, r));
      do
        try {
          rm();
          break;
        } catch (O) {
          tm(n, O);
        }
      while (!0);
      np(), Ko.current = y, Lt = p, Bn !== null ? r = 0 : (Zn = null, vr = 0, r = On);
    }
    if (r !== 0) {
      if (r === 2 && (p = Oo(n), p !== 0 && (c = p, r = sc(n, p))), r === 1) throw o = ic, po(n, 0), hi(n, c), ua(n, mt()), o;
      if (r === 6) hi(n, c);
      else {
        if (p = n.current.alternate, !(c & 30) && !Ng(p) && (r = Ff(n, c), r === 2 && (y = Oo(n), y !== 0 && (c = y, r = sc(n, y))), r === 1)) throw o = ic, po(n, 0), hi(n, c), ua(n, mt()), o;
        switch (n.finishedWork = p, n.finishedLanes = c, r) {
          case 0:
          case 1:
            throw Error(f(345));
          case 2:
            Gl(n, la, Ra);
            break;
          case 3:
            if (hi(n, c), (c & 130023424) === c && (r = bp + 500 - mt(), 10 < r)) {
              if (oi(n, 0) !== 0) break;
              if (p = n.suspendedLanes, (p & c) !== c) {
                In(), n.pingedLanes |= n.suspendedLanes & p;
                break;
              }
              n.timeoutHandle = ef(Gl.bind(null, n, la, Ra), r);
              break;
            }
            Gl(n, la, Ra);
            break;
          case 4:
            if (hi(n, c), (c & 4194240) === c) break;
            for (r = n.eventTimes, p = -1; 0 < c; ) {
              var x = 31 - Nr(c);
              y = 1 << x, x = r[x], x > p && (p = x), c &= ~y;
            }
            if (c = p, c = mt() - c, c = (120 > c ? 120 : 480 > c ? 480 : 1080 > c ? 1080 : 1920 > c ? 1920 : 3e3 > c ? 3e3 : 4320 > c ? 4320 : 1960 * Ag(c / 1960)) - c, 10 < c) {
              n.timeoutHandle = ef(Gl.bind(null, n, la, Ra), c);
              break;
            }
            Gl(n, la, Ra);
            break;
          case 5:
            Gl(n, la, Ra);
            break;
          default:
            throw Error(f(329));
        }
      }
    }
    return ua(n, mt()), n.callbackNode === o ? jf.bind(null, n) : null;
  }
  function sc(n, r) {
    var o = oc;
    return n.current.memoizedState.isDehydrated && (po(n, r).flags |= 256), n = Ff(n, r), n !== 2 && (r = la, la = o, r !== null && $l(r)), n;
  }
  function $l(n) {
    la === null ? la = n : la.push.apply(la, n);
  }
  function Ng(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var o = r.updateQueue;
        if (o !== null && (o = o.stores, o !== null)) for (var c = 0; c < o.length; c++) {
          var p = o[c], y = p.getSnapshot;
          p = p.value;
          try {
            if (!si(y(), p)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (o = r.child, r.subtreeFlags & 16384 && o !== null) o.return = r, r = o;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function hi(n, r) {
    for (r &= ~Vf, r &= ~Fu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var o = 31 - Nr(r), c = 1 << o;
      n[o] = -1, r &= ~c;
    }
  }
  function wp(n) {
    if (Lt & 6) throw Error(f(327));
    Yu();
    var r = oi(n, 0);
    if (!(r & 1)) return ua(n, mt()), null;
    var o = Ff(n, r);
    if (n.tag !== 0 && o === 2) {
      var c = Oo(n);
      c !== 0 && (r = c, o = sc(n, c));
    }
    if (o === 1) throw o = ic, po(n, 0), hi(n, r), ua(n, mt()), o;
    if (o === 6) throw Error(f(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Gl(n, la, Ra), ua(n, mt()), null;
  }
  function Dp(n, r) {
    var o = Lt;
    Lt |= 1;
    try {
      return n(r);
    } finally {
      Lt = o, Lt === 0 && (Hu = mt() + 500, Au && Li());
    }
  }
  function Wl(n) {
    fo !== null && fo.tag === 0 && !(Lt & 6) && Yu();
    var r = Lt;
    Lt |= 1;
    var o = hr.transition, c = Ft;
    try {
      if (hr.transition = null, Ft = 1, n) return n();
    } finally {
      Ft = c, hr.transition = o, Lt = r, !(Lt & 6) && Li();
    }
  }
  function kp() {
    Ta = ju.current, cn(ju);
  }
  function po(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var o = n.timeoutHandle;
    if (o !== -1 && (n.timeoutHandle = -1, Xd(o)), Bn !== null) for (o = Bn.return; o !== null; ) {
      var c = o;
      switch (of(c), c.tag) {
        case 1:
          c = c.type.childContextTypes, c != null && Lu();
          break;
        case 3:
          Nl(), cn(qn), cn(Rn), Ge();
          break;
        case 5:
          cf(c);
          break;
        case 4:
          Nl();
          break;
        case 13:
          cn(xn);
          break;
        case 19:
          cn(xn);
          break;
        case 10:
          rp(c.type._context);
          break;
        case 22:
        case 23:
          kp();
      }
      o = o.return;
    }
    if (Zn = n, Bn = n = Zo(n.current, null), vr = Ta = r, On = 0, ic = null, Vf = Fu = ji = 0, la = oc = null, Ll !== null) {
      for (r = 0; r < Ll.length; r++) if (o = Ll[r], c = o.interleaved, c !== null) {
        o.interleaved = null;
        var p = c.next, y = o.pending;
        if (y !== null) {
          var x = y.next;
          y.next = p, c.next = x;
        }
        o.pending = c;
      }
      Ll = null;
    }
    return n;
  }
  function tm(n, r) {
    do {
      var o = Bn;
      try {
        if (np(), bt.current = Fl, df) {
          for (var c = Bt.memoizedState; c !== null; ) {
            var p = c.queue;
            p !== null && (p.pending = null), c = c.next;
          }
          df = !1;
        }
        if (tn = 0, rr = jn = Bt = null, Fs = !1, Pl = 0, Il.current = null, o === null || o.return === null) {
          On = 1, ic = r, Bn = null;
          break;
        }
        e: {
          var y = n, x = o.return, O = o, U = r;
          if (r = vr, O.flags |= 32768, U !== null && typeof U == "object" && typeof U.then == "function") {
            var G = U, le = O, ce = le.tag;
            if (!(le.mode & 1) && (ce === 0 || ce === 11 || ce === 15)) {
              var oe = le.alternate;
              oe ? (le.updateQueue = oe.updateQueue, le.memoizedState = oe.memoizedState, le.lanes = oe.lanes) : (le.updateQueue = null, le.memoizedState = null);
            }
            var ke = Bv(x);
            if (ke !== null) {
              ke.flags &= -257, Qo(ke, x, O, y, r), ke.mode & 1 && mp(y, G, r), r = ke, U = G;
              var Ve = r.updateQueue;
              if (Ve === null) {
                var He = /* @__PURE__ */ new Set();
                He.add(U), r.updateQueue = He;
              } else Ve.add(U);
              break e;
            } else {
              if (!(r & 1)) {
                mp(y, G, r), _p();
                break e;
              }
              U = Error(f(426));
            }
          } else if (vn && O.mode & 1) {
            var Ln = Bv(x);
            if (Ln !== null) {
              !(Ln.flags & 65536) && (Ln.flags |= 256), Qo(Ln, x, O, y, r), lo(Hl(U, O));
              break e;
            }
          }
          y = U = Hl(U, O), On !== 4 && (On = 2), oc === null ? oc = [y] : oc.push(y), y = x;
          do {
            switch (y.tag) {
              case 3:
                y.flags |= 65536, r &= -r, y.lanes |= r;
                var H = Hv(y, U, r);
                Uv(y, H);
                break e;
              case 1:
                O = U;
                var j = y.type, Y = y.stateNode;
                if (!(y.flags & 128) && (typeof j.getDerivedStateFromError == "function" || Y !== null && typeof Y.componentDidCatch == "function" && (qo === null || !qo.has(Y)))) {
                  y.flags |= 65536, r &= -r, y.lanes |= r;
                  var ue = vp(y, O, r);
                  Uv(y, ue);
                  break e;
                }
            }
            y = y.return;
          } while (y !== null);
        }
        im(o);
      } catch (ze) {
        r = ze, Bn === o && o !== null && (Bn = o = o.return);
        continue;
      }
      break;
    } while (!0);
  }
  function nm() {
    var n = Ko.current;
    return Ko.current = Fl, n === null ? Fl : n;
  }
  function _p() {
    (On === 0 || On === 3 || On === 2) && (On = 4), Zn === null || !(ji & 268435455) && !(Fu & 268435455) || hi(Zn, vr);
  }
  function Ff(n, r) {
    var o = Lt;
    Lt |= 2;
    var c = nm();
    (Zn !== n || vr !== r) && (Ra = null, po(n, r));
    do
      try {
        Pg();
        break;
      } catch (p) {
        tm(n, p);
      }
    while (!0);
    if (np(), Lt = o, Ko.current = c, Bn !== null) throw Error(f(261));
    return Zn = null, vr = 0, On;
  }
  function Pg() {
    for (; Bn !== null; ) am(Bn);
  }
  function rm() {
    for (; Bn !== null && !ni(); ) am(Bn);
  }
  function am(n) {
    var r = sm(n.alternate, n, Ta);
    n.memoizedProps = n.pendingProps, r === null ? im(n) : Bn = r, Il.current = null;
  }
  function im(n) {
    var r = n;
    do {
      var o = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (o = Nf(o, r), o !== null) {
          o.flags &= 32767, Bn = o;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          On = 6, Bn = null;
          return;
        }
      } else if (o = Kv(o, r, Ta), o !== null) {
        Bn = o;
        return;
      }
      if (r = r.sibling, r !== null) {
        Bn = r;
        return;
      }
      Bn = r = n;
    } while (r !== null);
    On === 0 && (On = 5);
  }
  function Gl(n, r, o) {
    var c = Ft, p = hr.transition;
    try {
      hr.transition = null, Ft = 1, Ug(n, r, o, c);
    } finally {
      hr.transition = p, Ft = c;
    }
    return null;
  }
  function Ug(n, r, o, c) {
    do
      Yu();
    while (fo !== null);
    if (Lt & 6) throw Error(f(327));
    o = n.finishedWork;
    var p = n.finishedLanes;
    if (o === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, o === n.current) throw Error(f(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var y = o.lanes | o.childLanes;
    if (Md(n, y), n === Zn && (Bn = Zn = null, vr = 0), !(o.subtreeFlags & 2064) && !(o.flags & 2064) || zf || (zf = !0, cm(yl, function() {
      return Yu(), null;
    })), y = (o.flags & 15990) !== 0, o.subtreeFlags & 15990 || y) {
      y = hr.transition, hr.transition = null;
      var x = Ft;
      Ft = 1;
      var O = Lt;
      Lt |= 4, Il.current = null, Xv(n, o), xp(o, n), bu(Dl), Na = !!Ms, Dl = Ms = null, n.current = o, Lg(o), ri(), Lt = O, Ft = x, hr.transition = y;
    } else n.current = o;
    if (zf && (zf = !1, fo = n, lc = p), y = n.pendingLanes, y === 0 && (qo = null), ms(o.stateNode), ua(n, mt()), r !== null) for (c = n.onRecoverableError, o = 0; o < r.length; o++) p = r[o], c(p.value, { componentStack: p.stack, digest: p.digest });
    if (Bu) throw Bu = !1, n = Yl, Yl = null, n;
    return lc & 1 && n.tag !== 0 && Yu(), y = n.pendingLanes, y & 1 ? n === Iu ? Xo++ : (Xo = 0, Iu = n) : Xo = 0, Li(), null;
  }
  function Yu() {
    if (fo !== null) {
      var n = yu(lc), r = hr.transition, o = Ft;
      try {
        if (hr.transition = null, Ft = 16 > n ? 16 : n, fo === null) var c = !1;
        else {
          if (n = fo, fo = null, lc = 0, Lt & 6) throw Error(f(331));
          var p = Lt;
          for (Lt |= 4, Le = n.current; Le !== null; ) {
            var y = Le, x = y.child;
            if (Le.flags & 16) {
              var O = y.deletions;
              if (O !== null) {
                for (var U = 0; U < O.length; U++) {
                  var G = O[U];
                  for (Le = G; Le !== null; ) {
                    var le = Le;
                    switch (le.tag) {
                      case 0:
                      case 11:
                      case 15:
                        tc(8, le, y);
                    }
                    var ce = le.child;
                    if (ce !== null) ce.return = le, Le = ce;
                    else for (; Le !== null; ) {
                      le = Le;
                      var oe = le.sibling, ke = le.return;
                      if (Uf(le), le === G) {
                        Le = null;
                        break;
                      }
                      if (oe !== null) {
                        oe.return = ke, Le = oe;
                        break;
                      }
                      Le = ke;
                    }
                  }
                }
                var Ve = y.alternate;
                if (Ve !== null) {
                  var He = Ve.child;
                  if (He !== null) {
                    Ve.child = null;
                    do {
                      var Ln = He.sibling;
                      He.sibling = null, He = Ln;
                    } while (He !== null);
                  }
                }
                Le = y;
              }
            }
            if (y.subtreeFlags & 2064 && x !== null) x.return = y, Le = x;
            else e: for (; Le !== null; ) {
              if (y = Le, y.flags & 2048) switch (y.tag) {
                case 0:
                case 11:
                case 15:
                  tc(9, y, y.return);
              }
              var H = y.sibling;
              if (H !== null) {
                H.return = y.return, Le = H;
                break e;
              }
              Le = y.return;
            }
          }
          var j = n.current;
          for (Le = j; Le !== null; ) {
            x = Le;
            var Y = x.child;
            if (x.subtreeFlags & 2064 && Y !== null) Y.return = x, Le = Y;
            else e: for (x = j; Le !== null; ) {
              if (O = Le, O.flags & 2048) try {
                switch (O.tag) {
                  case 0:
                  case 11:
                  case 15:
                    nc(9, O);
                }
              } catch (ze) {
                mn(O, O.return, ze);
              }
              if (O === x) {
                Le = null;
                break e;
              }
              var ue = O.sibling;
              if (ue !== null) {
                ue.return = O.return, Le = ue;
                break e;
              }
              Le = O.return;
            }
          }
          if (Lt = p, Li(), Xr && typeof Xr.onPostCommitFiberRoot == "function") try {
            Xr.onPostCommitFiberRoot(_o, n);
          } catch {
          }
          c = !0;
        }
        return c;
      } finally {
        Ft = o, hr.transition = r;
      }
    }
    return !1;
  }
  function om(n, r, o) {
    r = Hl(o, r), r = Hv(n, r, 1), n = $o(n, r, 1), r = In(), n !== null && (Zi(n, 1, r), ua(n, r));
  }
  function mn(n, r, o) {
    if (n.tag === 3) om(n, n, o);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        om(r, n, o);
        break;
      } else if (r.tag === 1) {
        var c = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (qo === null || !qo.has(c))) {
          n = Hl(o, n), n = vp(r, n, 1), r = $o(r, n, 1), n = In(), r !== null && (Zi(r, 1, n), ua(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Vg(n, r, o) {
    var c = n.pingCache;
    c !== null && c.delete(r), r = In(), n.pingedLanes |= n.suspendedLanes & o, Zn === n && (vr & o) === o && (On === 4 || On === 3 && (vr & 130023424) === vr && 500 > mt() - bp ? po(n, 0) : Vf |= o), ua(n, r);
  }
  function lm(n, r) {
    r === 0 && (n.mode & 1 ? (r = ga, ga <<= 1, !(ga & 130023424) && (ga = 4194304)) : r = 1);
    var o = In();
    n = Ea(n, r), n !== null && (Zi(n, r, o), ua(n, o));
  }
  function zg(n) {
    var r = n.memoizedState, o = 0;
    r !== null && (o = r.retryLane), lm(n, o);
  }
  function um(n, r) {
    var o = 0;
    switch (n.tag) {
      case 13:
        var c = n.stateNode, p = n.memoizedState;
        p !== null && (o = p.retryLane);
        break;
      case 19:
        c = n.stateNode;
        break;
      default:
        throw Error(f(314));
    }
    c !== null && c.delete(r), lm(n, o);
  }
  var sm;
  sm = function(n, r, o) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || qn.current) Fn = !0;
    else {
      if (!(n.lanes & o) && !(r.flags & 128)) return Fn = !1, Zs(n, r, o);
      Fn = !!(n.flags & 131072);
    }
    else Fn = !1, vn && r.flags & 1048576 && Lv(r, oo, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var c = r.type;
        Ha(n, r), n = r.pendingProps;
        var p = ea(r, Rn.current);
        En(r, o), p = Wo(null, r, c, n, p, o);
        var y = fi();
        return r.flags |= 1, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Vn(c) ? (y = !0, nr(r)) : y = !1, r.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, lp(r), p.updater = _f, r.stateNode = p, p._reactInternals = r, Gs(r, c, n, o), r = qs(null, r, c, !0, y, o)) : (r.tag = 0, vn && y && af(r), pr(null, r, p, o), r = r.child), r;
      case 16:
        c = r.elementType;
        e: {
          switch (Ha(n, r), n = r.pendingProps, p = c._init, c = p(c._payload), r.type = c, p = r.tag = Fg(c), n = di(c, n), p) {
            case 0:
              r = Iv(null, r, c, n, o);
              break e;
            case 1:
              r = Yv(null, r, c, n, o);
              break e;
            case 11:
              r = ia(null, r, c, n, o);
              break e;
            case 14:
              r = Bl(null, r, c, di(c.type, n), o);
              break e;
          }
          throw Error(f(
            306,
            c,
            ""
          ));
        }
        return r;
      case 0:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : di(c, p), Iv(n, r, c, p, o);
      case 1:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : di(c, p), Yv(n, r, c, p, o);
      case 3:
        e: {
          if (Vu(r), n === null) throw Error(f(387));
          c = r.pendingProps, y = r.memoizedState, p = y.element, Pv(n, r), Ps(r, c, null, o);
          var x = r.memoizedState;
          if (c = x.element, y.isDehydrated) if (y = { element: c, isDehydrated: !1, cache: x.cache, pendingSuspenseBoundaries: x.pendingSuspenseBoundaries, transitions: x.transitions }, r.updateQueue.baseState = y, r.memoizedState = y, r.flags & 256) {
            p = Hl(Error(f(423)), r), r = $v(n, r, c, o, p);
            break e;
          } else if (c !== p) {
            p = Hl(Error(f(424)), r), r = $v(n, r, c, o, p);
            break e;
          } else for (na = _i(r.stateNode.containerInfo.firstChild), ta = r, vn = !0, ja = null, o = Re(r, null, c, o), r.child = o; o; ) o.flags = o.flags & -3 | 4096, o = o.sibling;
          else {
            if (Yo(), c === p) {
              r = Ba(n, r, o);
              break e;
            }
            pr(n, r, c, o);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Vv(r), n === null && ep(r), c = r.type, p = r.pendingProps, y = n !== null ? n.memoizedProps : null, x = p.children, Jc(c, p) ? x = null : y !== null && Jc(c, y) && (r.flags |= 32), yp(n, r), pr(n, r, x, o), r.child;
      case 6:
        return n === null && ep(r), null;
      case 13:
        return Af(n, r, o);
      case 4:
        return sp(r, r.stateNode.containerInfo), c = r.pendingProps, n === null ? r.child = kn(r, null, c, o) : pr(n, r, c, o), r.child;
      case 11:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : di(c, p), ia(n, r, c, p, o);
      case 7:
        return pr(n, r, r.pendingProps, o), r.child;
      case 8:
        return pr(n, r, r.pendingProps.children, o), r.child;
      case 12:
        return pr(n, r, r.pendingProps.children, o), r.child;
      case 10:
        e: {
          if (c = r.type._context, p = r.pendingProps, y = r.memoizedProps, x = p.value, $e(Ca, c._currentValue), c._currentValue = x, y !== null) if (si(y.value, x)) {
            if (y.children === p.children && !qn.current) {
              r = Ba(n, r, o);
              break e;
            }
          } else for (y = r.child, y !== null && (y.return = r); y !== null; ) {
            var O = y.dependencies;
            if (O !== null) {
              x = y.child;
              for (var U = O.firstContext; U !== null; ) {
                if (U.context === c) {
                  if (y.tag === 1) {
                    U = uo(-1, o & -o), U.tag = 2;
                    var G = y.updateQueue;
                    if (G !== null) {
                      G = G.shared;
                      var le = G.pending;
                      le === null ? U.next = U : (U.next = le.next, le.next = U), G.pending = U;
                    }
                  }
                  y.lanes |= o, U = y.alternate, U !== null && (U.lanes |= o), ap(
                    y.return,
                    o,
                    r
                  ), O.lanes |= o;
                  break;
                }
                U = U.next;
              }
            } else if (y.tag === 10) x = y.type === r.type ? null : y.child;
            else if (y.tag === 18) {
              if (x = y.return, x === null) throw Error(f(341));
              x.lanes |= o, O = x.alternate, O !== null && (O.lanes |= o), ap(x, o, r), x = y.sibling;
            } else x = y.child;
            if (x !== null) x.return = y;
            else for (x = y; x !== null; ) {
              if (x === r) {
                x = null;
                break;
              }
              if (y = x.sibling, y !== null) {
                y.return = x.return, x = y;
                break;
              }
              x = x.return;
            }
            y = x;
          }
          pr(n, r, p.children, o), r = r.child;
        }
        return r;
      case 9:
        return p = r.type, c = r.pendingProps.children, En(r, o), p = Fa(p), c = c(p), r.flags |= 1, pr(n, r, c, o), r.child;
      case 14:
        return c = r.type, p = di(c, r.pendingProps), p = di(c.type, p), Bl(n, r, c, p, o);
      case 15:
        return St(n, r, r.type, r.pendingProps, o);
      case 17:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : di(c, p), Ha(n, r), r.tag = 1, Vn(c) ? (n = !0, nr(r)) : n = !1, En(r, o), Mf(r, c, p), Gs(r, c, p, o), qs(null, r, c, !0, n, o);
      case 19:
        return Ui(n, r, o);
      case 22:
        return Ks(n, r, o);
    }
    throw Error(f(156, r.tag));
  };
  function cm(n, r) {
    return dn(n, r);
  }
  function jg(n, r, o, c) {
    this.tag = n, this.key = o, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ya(n, r, o, c) {
    return new jg(n, r, o, c);
  }
  function Mp(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Fg(n) {
    if (typeof n == "function") return Mp(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === ft) return 11;
      if (n === Tt) return 14;
    }
    return 2;
  }
  function Zo(n, r) {
    var o = n.alternate;
    return o === null ? (o = Ya(n.tag, r, n.key, n.mode), o.elementType = n.elementType, o.type = n.type, o.stateNode = n.stateNode, o.alternate = n, n.alternate = o) : (o.pendingProps = r, o.type = n.type, o.flags = 0, o.subtreeFlags = 0, o.deletions = null), o.flags = n.flags & 14680064, o.childLanes = n.childLanes, o.lanes = n.lanes, o.child = n.child, o.memoizedProps = n.memoizedProps, o.memoizedState = n.memoizedState, o.updateQueue = n.updateQueue, r = n.dependencies, o.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, o.sibling = n.sibling, o.index = n.index, o.ref = n.ref, o;
  }
  function cc(n, r, o, c, p, y) {
    var x = 2;
    if (c = n, typeof n == "function") Mp(n) && (x = 1);
    else if (typeof n == "string") x = 5;
    else e: switch (n) {
      case Ee:
        return ho(o.children, p, y, r);
      case Fe:
        x = 8, p |= 8;
        break;
      case Be:
        return n = Ya(12, o, r, p | 2), n.elementType = Be, n.lanes = y, n;
      case Ue:
        return n = Ya(13, o, r, p), n.elementType = Ue, n.lanes = y, n;
      case it:
        return n = Ya(19, o, r, p), n.elementType = it, n.lanes = y, n;
      case De:
        return Jo(o, p, y, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case wt:
            x = 10;
            break e;
          case jt:
            x = 9;
            break e;
          case ft:
            x = 11;
            break e;
          case Tt:
            x = 14;
            break e;
          case tt:
            x = 16, c = null;
            break e;
        }
        throw Error(f(130, n == null ? n : typeof n, ""));
    }
    return r = Ya(x, o, r, p), r.elementType = n, r.type = c, r.lanes = y, r;
  }
  function ho(n, r, o, c) {
    return n = Ya(7, n, c, r), n.lanes = o, n;
  }
  function Jo(n, r, o, c) {
    return n = Ya(22, n, c, r), n.elementType = De, n.lanes = o, n.stateNode = { isHidden: !1 }, n;
  }
  function Op(n, r, o) {
    return n = Ya(6, n, null, r), n.lanes = o, n;
  }
  function Hf(n, r, o) {
    return r = Ya(4, n.children !== null ? n.children : [], n.key, r), r.lanes = o, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function fm(n, r, o, c, p) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = mu(0), this.expirationTimes = mu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = mu(0), this.identifierPrefix = c, this.onRecoverableError = p, this.mutableSourceEagerHydrationData = null;
  }
  function Bf(n, r, o, c, p, y, x, O, U) {
    return n = new fm(n, r, o, O, U), r === 1 ? (r = 1, y === !0 && (r |= 8)) : r = 0, y = Ya(3, null, null, r), n.current = y, y.stateNode = n, y.memoizedState = { element: c, isDehydrated: o, cache: null, transitions: null, pendingSuspenseBoundaries: null }, lp(y), n;
  }
  function Hg(n, r, o) {
    var c = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Pe, key: c == null ? null : "" + c, children: n, containerInfo: r, implementation: o };
  }
  function Lp(n) {
    if (!n) return kr;
    n = n._reactInternals;
    e: {
      if (vt(n) !== n || n.tag !== 1) throw Error(f(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Vn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(f(171));
    }
    if (n.tag === 1) {
      var o = n.type;
      if (Vn(o)) return As(n, o, r);
    }
    return r;
  }
  function dm(n, r, o, c, p, y, x, O, U) {
    return n = Bf(o, c, !0, n, p, y, x, O, U), n.context = Lp(null), o = n.current, c = In(), p = Fi(o), y = uo(c, p), y.callback = r ?? null, $o(o, y, p), n.current.lanes = p, Zi(n, p, c), ua(n, c), n;
  }
  function If(n, r, o, c) {
    var p = r.current, y = In(), x = Fi(p);
    return o = Lp(o), r.context === null ? r.context = o : r.pendingContext = o, r = uo(y, x), r.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (r.callback = c), n = $o(p, r, x), n !== null && (Fr(n, p, x, y), sf(n, p, x)), x;
  }
  function Yf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Ap(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var o = n.retryLane;
      n.retryLane = o !== 0 && o < r ? o : r;
    }
  }
  function $f(n, r) {
    Ap(n, r), (n = n.alternate) && Ap(n, r);
  }
  function pm() {
    return null;
  }
  var Ql = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Np(n) {
    this._internalRoot = n;
  }
  Wf.prototype.render = Np.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(f(409));
    If(n, r, null, null);
  }, Wf.prototype.unmount = Np.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Wl(function() {
        If(null, n, null, null);
      }), r[ao] = null;
    }
  };
  function Wf(n) {
    this._internalRoot = n;
  }
  Wf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = lt();
      n = { blockedOn: null, target: n, priority: r };
      for (var o = 0; o < Kn.length && r !== 0 && r < Kn[o].priority; o++) ;
      Kn.splice(o, 0, n), o === 0 && Ss(n);
    }
  };
  function Pp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Gf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hm() {
  }
  function Bg(n, r, o, c, p) {
    if (p) {
      if (typeof c == "function") {
        var y = c;
        c = function() {
          var G = Yf(x);
          y.call(G);
        };
      }
      var x = dm(r, c, n, 0, null, !1, !1, "", hm);
      return n._reactRootContainer = x, n[ao] = x.current, Du(n.nodeType === 8 ? n.parentNode : n), Wl(), x;
    }
    for (; p = n.lastChild; ) n.removeChild(p);
    if (typeof c == "function") {
      var O = c;
      c = function() {
        var G = Yf(U);
        O.call(G);
      };
    }
    var U = Bf(n, 0, !1, null, null, !1, !1, "", hm);
    return n._reactRootContainer = U, n[ao] = U.current, Du(n.nodeType === 8 ? n.parentNode : n), Wl(function() {
      If(r, U, o, c);
    }), U;
  }
  function fc(n, r, o, c, p) {
    var y = o._reactRootContainer;
    if (y) {
      var x = y;
      if (typeof p == "function") {
        var O = p;
        p = function() {
          var U = Yf(x);
          O.call(U);
        };
      }
      If(r, x, n, p);
    } else x = Bg(o, r, n, p, c);
    return Yf(x);
  }
  Ut = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var o = ii(r.pendingLanes);
          o !== 0 && (Ji(r, o | 1), ua(r, mt()), !(Lt & 6) && (Hu = mt() + 500, Li()));
        }
        break;
      case 13:
        Wl(function() {
          var c = Ea(n, 1);
          if (c !== null) {
            var p = In();
            Fr(c, n, 1, p);
          }
        }), $f(n, 1);
    }
  }, ys = function(n) {
    if (n.tag === 13) {
      var r = Ea(n, 134217728);
      if (r !== null) {
        var o = In();
        Fr(r, n, 134217728, o);
      }
      $f(n, 134217728);
    }
  }, Ri = function(n) {
    if (n.tag === 13) {
      var r = Fi(n), o = Ea(n, r);
      if (o !== null) {
        var c = In();
        Fr(o, n, r, c);
      }
      $f(n, r);
    }
  }, lt = function() {
    return Ft;
  }, gu = function(n, r) {
    var o = Ft;
    try {
      return Ft = n, r();
    } finally {
      Ft = o;
    }
  }, Xt = function(n, r, o) {
    switch (r) {
      case "input":
        if (qr(n, o), r = o.name, o.type === "radio" && r != null) {
          for (o = n; o.parentNode; ) o = o.parentNode;
          for (o = o.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < o.length; r++) {
            var c = o[r];
            if (c !== n && c.form === n.form) {
              var p = Cn(c);
              if (!p) throw Error(f(90));
              Rr(c), qr(c, p);
            }
          }
        }
        break;
      case "textarea":
        Ja(n, o);
        break;
      case "select":
        r = o.value, r != null && wn(n, !!o.multiple, r, !1);
    }
  }, hl = Dp, wo = Wl;
  var Ig = { usingClientEntryPoint: !1, Events: [We, ci, Cn, Xi, pl, Dp] }, dc = { findFiberByHostInstance: kl, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, vm = { bundleType: dc.bundleType, version: dc.version, rendererPackageName: dc.rendererPackageName, rendererConfig: dc.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: pe.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Dn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: dc.findFiberByHostInstance || pm, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var el = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!el.isDisabled && el.supportsFiber) try {
      _o = el.inject(vm), Xr = el;
    } catch {
    }
  }
  return qa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ig, qa.createPortal = function(n, r) {
    var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Pp(r)) throw Error(f(200));
    return Hg(n, r, null, o);
  }, qa.createRoot = function(n, r) {
    if (!Pp(n)) throw Error(f(299));
    var o = !1, c = "", p = Ql;
    return r != null && (r.unstable_strictMode === !0 && (o = !0), r.identifierPrefix !== void 0 && (c = r.identifierPrefix), r.onRecoverableError !== void 0 && (p = r.onRecoverableError)), r = Bf(n, 1, !1, null, null, o, !1, c, p), n[ao] = r.current, Du(n.nodeType === 8 ? n.parentNode : n), new Np(r);
  }, qa.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(f(188)) : (n = Object.keys(n).join(","), Error(f(268, n)));
    return n = Dn(r), n = n === null ? null : n.stateNode, n;
  }, qa.flushSync = function(n) {
    return Wl(n);
  }, qa.hydrate = function(n, r, o) {
    if (!Gf(r)) throw Error(f(200));
    return fc(null, n, r, !0, o);
  }, qa.hydrateRoot = function(n, r, o) {
    if (!Pp(n)) throw Error(f(405));
    var c = o != null && o.hydratedSources || null, p = !1, y = "", x = Ql;
    if (o != null && (o.unstable_strictMode === !0 && (p = !0), o.identifierPrefix !== void 0 && (y = o.identifierPrefix), o.onRecoverableError !== void 0 && (x = o.onRecoverableError)), r = dm(r, null, n, 1, o ?? null, p, !1, y, x), n[ao] = r.current, Du(n), c) for (n = 0; n < c.length; n++) o = c[n], p = o._getVersion, p = p(o._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [o, p] : r.mutableSourceEagerHydrationData.push(
      o,
      p
    );
    return new Wf(r);
  }, qa.render = function(n, r, o) {
    if (!Gf(r)) throw Error(f(200));
    return fc(null, n, r, !1, o);
  }, qa.unmountComponentAtNode = function(n) {
    if (!Gf(n)) throw Error(f(40));
    return n._reactRootContainer ? (Wl(function() {
      fc(null, null, n, !1, function() {
        n._reactRootContainer = null, n[ao] = null;
      });
    }), !0) : !1;
  }, qa.unstable_batchedUpdates = Dp, qa.unstable_renderSubtreeIntoContainer = function(n, r, o, c) {
    if (!Gf(o)) throw Error(f(200));
    if (n == null || n._reactInternals === void 0) throw Error(f(38));
    return fc(n, r, o, !1, c);
  }, qa.version = "18.3.1-next-f1338f8080-20240426", qa;
}
var Xa = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tb;
function KL() {
  return Tb || (Tb = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var l = ge, s = Ow(), f = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, v = !1;
    function S(e) {
      v = e;
    }
    function R(e) {
      if (!v) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        w("warn", e, a);
      }
    }
    function m(e) {
      if (!v) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        w("error", e, a);
      }
    }
    function w(e, t, a) {
      {
        var i = f.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var d = a.map(function(h) {
          return String(h);
        });
        d.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, d);
      }
    }
    var T = 0, b = 1, M = 2, k = 3, A = 4, P = 5, K = 6, ee = 7, se = 8, Te = 9, re = 10, q = 11, pe = 12, de = 13, Pe = 14, Ee = 15, Fe = 16, Be = 17, wt = 18, jt = 19, ft = 21, Ue = 22, it = 23, Tt = 24, tt = 25, De = !0, he = !1, Ne = !1, ye = !1, V = !1, te = !0, Ze = !0, Qe = !0, yt = !0, ot = /* @__PURE__ */ new Set(), dt = {}, gt = {};
    function ht(e, t) {
      Pt(e, t), Pt(e + "Capture", t);
    }
    function Pt(e, t) {
      dt[e] && m("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), dt[e] = t;
      {
        var a = e.toLowerCase();
        gt[a] = e, e === "onDoubleClick" && (gt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ot.add(t[i]);
    }
    var Kt = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Rr = Object.prototype.hasOwnProperty;
    function bn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function ur(e) {
      try {
        return Wn(e), !1;
      } catch {
        return !0;
      }
    }
    function Wn(e) {
      return "" + e;
    }
    function Gn(e, t) {
      if (ur(e))
        return m("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Wn(e);
    }
    function qr(e) {
      if (ur(e))
        return m("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Wn(e);
    }
    function Si(e, t) {
      if (ur(e))
        return m("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Wn(e);
    }
    function va(e, t) {
      if (ur(e))
        return m("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Wn(e);
    }
    function er(e) {
      if (ur(e))
        return m("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Wn(e);
    }
    function wn(e) {
      if (ur(e))
        return m("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", bn(e)), Wn(e);
    }
    var Qn = 0, br = 1, Ja = 2, Pn = 3, wr = 4, ma = 5, ei = 6, Ci = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", me = Ci + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Ie = new RegExp("^[" + Ci + "][" + me + "]*$"), Et = {}, Wt = {};
    function on(e) {
      return Rr.call(Wt, e) ? !0 : Rr.call(Et, e) ? !1 : Ie.test(e) ? (Wt[e] = !0, !0) : (Et[e] = !0, m("Invalid attribute name: `%s`", e), !1);
    }
    function gn(e, t, a) {
      return t !== null ? t.type === Qn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function fn(e, t, a, i) {
      if (a !== null && a.type === Qn)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function tr(e, t, a, i) {
      if (t === null || typeof t > "u" || fn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Pn:
            return !t;
          case wr:
            return t === !1;
          case ma:
            return isNaN(t);
          case ei:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ln(e) {
      return Xt.hasOwnProperty(e) ? Xt[e] : null;
    }
    function qt(e, t, a, i, u, d, h) {
      this.acceptsBooleans = t === Ja || t === Pn || t === wr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = d, this.removeEmptyString = h;
    }
    var Xt = {}, ya = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    ya.forEach(function(e) {
      Xt[e] = new qt(
        e,
        Qn,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Xt[t] = new qt(
        t,
        br,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        Ja,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        Ja,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Xt[e] = new qt(
        e,
        Pn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new qt(
        e,
        Pn,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new qt(
        e,
        wr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new qt(
        e,
        ei,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        ma,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Dr = /[\-\:]([a-z])/g, Oa = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Dr, Oa);
      Xt[t] = new qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Dr, Oa);
      Xt[t] = new qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Dr, Oa);
      Xt[t] = new qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        br,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Xi = "xlinkHref";
    Xt[Xi] = new qt(
      "xlinkHref",
      br,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        br,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var pl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, hl = !1;
    function wo(e) {
      !hl && pl.test(e) && (hl = !0, m("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Do(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Gn(a, t), i.sanitizeURL && wo("" + a);
        var d = i.attributeName, h = null;
        if (i.type === wr) {
          if (e.hasAttribute(d)) {
            var g = e.getAttribute(d);
            return g === "" ? !0 : tr(t, a, i, !1) ? g : g === "" + a ? a : g;
          }
        } else if (e.hasAttribute(d)) {
          if (tr(t, a, i, !1))
            return e.getAttribute(d);
          if (i.type === Pn)
            return a;
          h = e.getAttribute(d);
        }
        return tr(t, a, i, !1) ? h === null ? a : h : h === "" + a ? a : h;
      }
    }
    function vl(e, t, a, i) {
      {
        if (!on(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Gn(a, t), u === "" + a ? a : u;
      }
    }
    function Lr(e, t, a, i) {
      var u = ln(t);
      if (!gn(t, u, i)) {
        if (tr(t, a, u, i) && (a = null), i || u === null) {
          if (on(t)) {
            var d = t;
            a === null ? e.removeAttribute(d) : (Gn(a, t), e.setAttribute(d, "" + a));
          }
          return;
        }
        var h = u.mustUseProperty;
        if (h) {
          var g = u.propertyName;
          if (a === null) {
            var C = u.type;
            e[g] = C === Pn ? !1 : "";
          } else
            e[g] = a;
          return;
        }
        var D = u.attributeName, _ = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(D);
        else {
          var F = u.type, z;
          F === Pn || F === wr && a === !0 ? z = "" : (Gn(a, D), z = "" + a, u.sanitizeURL && wo(z.toString())), _ ? e.setAttributeNS(_, D, z) : e.setAttribute(D, z);
        }
      }
    }
    var Ar = Symbol.for("react.element"), sr = Symbol.for("react.portal"), Ei = Symbol.for("react.fragment"), ti = Symbol.for("react.strict_mode"), xi = Symbol.for("react.profiler"), Ti = Symbol.for("react.provider"), N = Symbol.for("react.context"), ae = Symbol.for("react.forward_ref"), xe = Symbol.for("react.suspense"), Ae = Symbol.for("react.suspense_list"), vt = Symbol.for("react.memo"), st = Symbol.for("react.lazy"), Dt = Symbol.for("react.scope"), Rt = Symbol.for("react.debug_trace_mode"), Dn = Symbol.for("react.offscreen"), un = Symbol.for("react.legacy_hidden"), dn = Symbol.for("react.cache"), cr = Symbol.for("react.tracing_marker"), ni = Symbol.iterator, ri = "@@iterator";
    function mt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = ni && e[ni] || e[ri];
      return typeof t == "function" ? t : null;
    }
    var Ct = Object.assign, ai = 0, ml, yl, ko, du, _o, Xr, ms;
    function Nr() {
    }
    Nr.__reactDisabledLog = !0;
    function zc() {
      {
        if (ai === 0) {
          ml = console.log, yl = console.info, ko = console.warn, du = console.error, _o = console.group, Xr = console.groupCollapsed, ms = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Nr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        ai++;
      }
    }
    function jc() {
      {
        if (ai--, ai === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ct({}, e, {
              value: ml
            }),
            info: Ct({}, e, {
              value: yl
            }),
            warn: Ct({}, e, {
              value: ko
            }),
            error: Ct({}, e, {
              value: du
            }),
            group: Ct({}, e, {
              value: _o
            }),
            groupCollapsed: Ct({}, e, {
              value: Xr
            }),
            groupEnd: Ct({}, e, {
              value: ms
            })
          });
        }
        ai < 0 && m("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var pu = f.ReactCurrentDispatcher, Mo;
    function ga(e, t, a) {
      {
        if (Mo === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            Mo = i && i[1] || "";
          }
        return `
` + Mo + e;
      }
    }
    var ii = !1, oi;
    {
      var hu = typeof WeakMap == "function" ? WeakMap : Map;
      oi = new hu();
    }
    function gl(e, t) {
      if (!e || ii)
        return "";
      {
        var a = oi.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      ii = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var d;
      d = pu.current, pu.current = null, zc();
      try {
        if (t) {
          var h = function() {
            throw Error();
          };
          if (Object.defineProperty(h.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(h, []);
            } catch (Q) {
              i = Q;
            }
            Reflect.construct(e, [], h);
          } else {
            try {
              h.call();
            } catch (Q) {
              i = Q;
            }
            e.call(h.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Q) {
            i = Q;
          }
          e();
        }
      } catch (Q) {
        if (Q && i && typeof Q.stack == "string") {
          for (var g = Q.stack.split(`
`), C = i.stack.split(`
`), D = g.length - 1, _ = C.length - 1; D >= 1 && _ >= 0 && g[D] !== C[_]; )
            _--;
          for (; D >= 1 && _ >= 0; D--, _--)
            if (g[D] !== C[_]) {
              if (D !== 1 || _ !== 1)
                do
                  if (D--, _--, _ < 0 || g[D] !== C[_]) {
                    var F = `
` + g[D].replace(" at new ", " at ");
                    return e.displayName && F.includes("<anonymous>") && (F = F.replace("<anonymous>", e.displayName)), typeof e == "function" && oi.set(e, F), F;
                  }
                while (D >= 1 && _ >= 0);
              break;
            }
        }
      } finally {
        ii = !1, pu.current = d, jc(), Error.prepareStackTrace = u;
      }
      var z = e ? e.displayName || e.name : "", $ = z ? ga(z) : "";
      return typeof e == "function" && oi.set(e, $), $;
    }
    function Oo(e, t, a) {
      return gl(e, !0);
    }
    function vu(e, t, a) {
      return gl(e, !1);
    }
    function mu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Zi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return gl(e, mu(e));
      if (typeof e == "string")
        return ga(e);
      switch (e) {
        case xe:
          return ga("Suspense");
        case Ae:
          return ga("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ae:
            return vu(e.render);
          case vt:
            return Zi(e.type, t, a);
          case st: {
            var i = e, u = i._payload, d = i._init;
            try {
              return Zi(d(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Md(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case P:
          return ga(e.type);
        case Fe:
          return ga("Lazy");
        case de:
          return ga("Suspense");
        case jt:
          return ga("SuspenseList");
        case T:
        case M:
        case Ee:
          return vu(e.type);
        case q:
          return vu(e.type.render);
        case b:
          return Oo(e.type);
        default:
          return "";
      }
    }
    function Ji(e) {
      try {
        var t = "", a = e;
        do
          t += Md(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ft(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function yu(e) {
      return e.displayName || "Context";
    }
    function Ut(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && m("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Ei:
          return "Fragment";
        case sr:
          return "Portal";
        case xi:
          return "Profiler";
        case ti:
          return "StrictMode";
        case xe:
          return "Suspense";
        case Ae:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case N:
            var t = e;
            return yu(t) + ".Consumer";
          case Ti:
            var a = e;
            return yu(a._context) + ".Provider";
          case ae:
            return Ft(e, e.render, "ForwardRef");
          case vt:
            var i = e.displayName || null;
            return i !== null ? i : Ut(e.type) || "Memo";
          case st: {
            var u = e, d = u._payload, h = u._init;
            try {
              return Ut(h(d));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function ys(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function Ri(e) {
      return e.displayName || "Context";
    }
    function lt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Tt:
          return "Cache";
        case Te:
          var i = a;
          return Ri(i) + ".Consumer";
        case re:
          var u = a;
          return Ri(u._context) + ".Provider";
        case wt:
          return "DehydratedFragment";
        case q:
          return ys(a, a.render, "ForwardRef");
        case ee:
          return "Fragment";
        case P:
          return a;
        case A:
          return "Portal";
        case k:
          return "Root";
        case K:
          return "Text";
        case Fe:
          return Ut(a);
        case se:
          return a === ti ? "StrictMode" : "Mode";
        case Ue:
          return "Offscreen";
        case pe:
          return "Profiler";
        case ft:
          return "Scope";
        case de:
          return "Suspense";
        case jt:
          return "SuspenseList";
        case tt:
          return "TracingMarker";
        case b:
        case T:
        case Be:
        case M:
        case Pe:
        case Ee:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var gu = f.ReactDebugCurrentFrame, fr = null, bi = !1;
    function Pr() {
      {
        if (fr === null)
          return null;
        var e = fr._debugOwner;
        if (e !== null && typeof e < "u")
          return lt(e);
      }
      return null;
    }
    function wi() {
      return fr === null ? "" : Ji(fr);
    }
    function pn() {
      gu.getCurrentStack = null, fr = null, bi = !1;
    }
    function Zt(e) {
      gu.getCurrentStack = e === null ? null : wi, fr = e, bi = !1;
    }
    function Lo() {
      return fr;
    }
    function Kn(e) {
      bi = e;
    }
    function Ur(e) {
      return "" + e;
    }
    function La(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return wn(e), e;
        default:
          return "";
      }
    }
    var Sl = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function gs(e, t) {
      Sl[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || m("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || m("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Ss(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Ao(e) {
      return e._valueTracker;
    }
    function Cl(e) {
      e._valueTracker = null;
    }
    function Od(e) {
      var t = "";
      return e && (Ss(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Aa(e) {
      var t = Ss(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      wn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, d = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(g) {
            wn(g), i = "" + g, d.call(this, g);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var h = {
          getValue: function() {
            return i;
          },
          setValue: function(g) {
            wn(g), i = "" + g;
          },
          stopTracking: function() {
            Cl(e), delete e[t];
          }
        };
        return h;
      }
    }
    function li(e) {
      Ao(e) || (e._valueTracker = Aa(e));
    }
    function Di(e) {
      if (!e)
        return !1;
      var t = Ao(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Od(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Na(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Su = !1, Cu = !1, No = !1, El = !1;
    function Eu(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function xu(e, t) {
      var a = e, i = t.checked, u = Ct({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ui(e, t) {
      gs("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Cu && (m("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Pr() || "A component", t.type), Cu = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Su && (m("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Pr() || "A component", t.type), Su = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: La(t.value != null ? t.value : i),
        controlled: Eu(t)
      };
    }
    function E(e, t) {
      var a = e, i = t.checked;
      i != null && Lr(a, "checked", i, !1);
    }
    function L(e, t) {
      var a = e;
      {
        var i = Eu(t);
        !a._wrapperState.controlled && i && !El && (m("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), El = !0), a._wrapperState.controlled && !i && !No && (m("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), No = !0);
      }
      E(e, t);
      var u = La(t.value), d = t.type;
      if (u != null)
        d === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Ur(u)) : a.value !== Ur(u) && (a.value = Ur(u));
      else if (d === "submit" || d === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ke(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ke(a, t.type, La(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function W(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, d = u === "submit" || u === "reset";
        if (d && (t.value === void 0 || t.value === null))
          return;
        var h = Ur(i._wrapperState.initialValue);
        a || h !== i.value && (i.value = h), i.defaultValue = h;
      }
      var g = i.name;
      g !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, g !== "" && (i.name = g);
    }
    function X(e, t) {
      var a = e;
      L(a, t), ve(a, t);
    }
    function ve(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Gn(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), d = 0; d < u.length; d++) {
          var h = u[d];
          if (!(h === e || h.form !== e.form)) {
            var g = Am(h);
            if (!g)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Di(h), L(h, g);
          }
        }
      }
    }
    function Ke(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Na(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Ur(e._wrapperState.initialValue) : e.defaultValue !== Ur(a) && (e.defaultValue = Ur(a)));
    }
    var Ce = !1, Je = !1, kt = !1;
    function Vt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? l.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Je || (Je = !0, m("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (kt || (kt = !0, m("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Ce && (m("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Ce = !0);
    }
    function sn(e, t) {
      t.value != null && e.setAttribute("value", Ur(La(t.value)));
    }
    var Jt = Array.isArray;
    function xt(e) {
      return Jt(e);
    }
    var en;
    en = !1;
    function Sn() {
      var e = Pr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Po = ["value", "defaultValue"];
    function Cs(e) {
      {
        gs("select", e);
        for (var t = 0; t < Po.length; t++) {
          var a = Po[t];
          if (e[a] != null) {
            var i = xt(e[a]);
            e.multiple && !i ? m("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Sn()) : !e.multiple && i && m("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Sn());
          }
        }
      }
    }
    function eo(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var d = a, h = {}, g = 0; g < d.length; g++)
          h["$" + d[g]] = !0;
        for (var C = 0; C < u.length; C++) {
          var D = h.hasOwnProperty("$" + u[C].value);
          u[C].selected !== D && (u[C].selected = D), D && i && (u[C].defaultSelected = !0);
        }
      } else {
        for (var _ = Ur(La(a)), F = null, z = 0; z < u.length; z++) {
          if (u[z].value === _) {
            u[z].selected = !0, i && (u[z].defaultSelected = !0);
            return;
          }
          F === null && !u[z].disabled && (F = u[z]);
        }
        F !== null && (F.selected = !0);
      }
    }
    function Es(e, t) {
      return Ct({}, t, {
        value: void 0
      });
    }
    function xl(e, t) {
      var a = e;
      Cs(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !en && (m("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), en = !0);
    }
    function Ld(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? eo(a, !!t.multiple, i, !1) : t.defaultValue != null && eo(a, !!t.multiple, t.defaultValue, !0);
    }
    function Fc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? eo(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? eo(a, !!t.multiple, t.defaultValue, !0) : eo(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Ad(e, t) {
      var a = e, i = t.value;
      i != null && eo(a, !!t.multiple, i, !1);
    }
    var nv = !1;
    function Nd(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Ct({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Ur(a._wrapperState.initialValue)
      });
      return i;
    }
    function Pd(e, t) {
      var a = e;
      gs("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !nv && (m("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Pr() || "A component"), nv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, d = t.defaultValue;
        if (u != null) {
          m("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (d != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (xt(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            d = u;
          }
        }
        d == null && (d = ""), i = d;
      }
      a._wrapperState = {
        initialValue: La(i)
      };
    }
    function rv(e, t) {
      var a = e, i = La(t.value), u = La(t.defaultValue);
      if (i != null) {
        var d = Ur(i);
        d !== a.value && (a.value = d), t.defaultValue == null && a.defaultValue !== d && (a.defaultValue = d);
      }
      u != null && (a.defaultValue = Ur(u));
    }
    function av(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function gg(e, t) {
      rv(e, t);
    }
    var to = "http://www.w3.org/1999/xhtml", Ud = "http://www.w3.org/1998/Math/MathML", Vd = "http://www.w3.org/2000/svg";
    function zd(e) {
      switch (e) {
        case "svg":
          return Vd;
        case "math":
          return Ud;
        default:
          return to;
      }
    }
    function jd(e, t) {
      return e == null || e === to ? zd(t) : e === Vd && t === "foreignObject" ? to : e;
    }
    var iv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, Hc, ov = iv(function(e, t) {
      if (e.namespaceURI === Vd && !("innerHTML" in e)) {
        Hc = Hc || document.createElement("div"), Hc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = Hc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Zr = 1, no = 3, Un = 8, ro = 9, Fd = 11, Tu = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === no) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, xs = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Ts = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function lv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var uv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Ts).forEach(function(e) {
      uv.forEach(function(t) {
        Ts[lv(t, e)] = Ts[e];
      });
    });
    function Bc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Ts.hasOwnProperty(e) && Ts[e]) ? t + "px" : (va(t, e), ("" + t).trim());
    }
    var sv = /([A-Z])/g, cv = /^ms-/;
    function Ru(e) {
      return e.replace(sv, "-$1").toLowerCase().replace(cv, "-ms-");
    }
    var fv = function() {
    };
    {
      var Sg = /^(?:webkit|moz|o)[A-Z]/, Cg = /^-ms-/, dv = /-(.)/g, Hd = /;\s*$/, ki = {}, Tl = {}, pv = !1, Rs = !1, Eg = function(e) {
        return e.replace(dv, function(t, a) {
          return a.toUpperCase();
        });
      }, hv = function(e) {
        ki.hasOwnProperty(e) && ki[e] || (ki[e] = !0, m(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          Eg(e.replace(Cg, "ms-"))
        ));
      }, Bd = function(e) {
        ki.hasOwnProperty(e) && ki[e] || (ki[e] = !0, m("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, Id = function(e, t) {
        Tl.hasOwnProperty(t) && Tl[t] || (Tl[t] = !0, m(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Hd, "")));
      }, vv = function(e, t) {
        pv || (pv = !0, m("`NaN` is an invalid value for the `%s` css style property.", e));
      }, mv = function(e, t) {
        Rs || (Rs = !0, m("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      fv = function(e, t) {
        e.indexOf("-") > -1 ? hv(e) : Sg.test(e) ? Bd(e) : Hd.test(t) && Id(e, t), typeof t == "number" && (isNaN(t) ? vv(e, t) : isFinite(t) || mv(e, t));
      };
    }
    var yv = fv;
    function xg(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var d = i.indexOf("--") === 0;
              t += a + (d ? i : Ru(i)) + ":", t += Bc(i, u, d), a = ";";
            }
          }
        return t || null;
      }
    }
    function gv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || yv(i, t[i]);
          var d = Bc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, d) : a[i] = d;
        }
    }
    function Tg(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Sv(e) {
      var t = {};
      for (var a in e)
        for (var i = xs[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function Rg(e, t) {
      {
        if (!t)
          return;
        var a = Sv(e), i = Sv(t), u = {};
        for (var d in a) {
          var h = a[d], g = i[d];
          if (g && h !== g) {
            var C = h + "," + g;
            if (u[C])
              continue;
            u[C] = !0, m("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", Tg(e[h]) ? "Removing" : "Updating", h, g);
          }
        }
      }
    }
    var si = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, bs = Ct({
      menuitem: !0
    }, si), Cv = "__html";
    function Ic(e, t) {
      if (t) {
        if (bs[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Cv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && m("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Uo(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var ws = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Yc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, bu = {}, bg = new RegExp("^(aria)-[" + me + "]*$"), wu = new RegExp("^(aria)[A-Z][" + me + "]*$");
    function Yd(e, t) {
      {
        if (Rr.call(bu, t) && bu[t])
          return !0;
        if (wu.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = Yc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return m("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), bu[t] = !0, !0;
          if (t !== i)
            return m("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), bu[t] = !0, !0;
        }
        if (bg.test(t)) {
          var u = t.toLowerCase(), d = Yc.hasOwnProperty(u) ? u : null;
          if (d == null)
            return bu[t] = !0, !1;
          if (t !== d)
            return m("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, d), bu[t] = !0, !0;
        }
      }
      return !0;
    }
    function Ds(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = Yd(e, i);
          u || a.push(i);
        }
        var d = a.map(function(h) {
          return "`" + h + "`";
        }).join(", ");
        a.length === 1 ? m("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e) : a.length > 1 && m("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e);
      }
    }
    function $d(e, t) {
      Uo(e, t) || Ds(e, t);
    }
    var Wd = !1;
    function $c(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !Wd && (Wd = !0, e === "select" && t.multiple ? m("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : m("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var Rl = function() {
    };
    {
      var dr = {}, Gd = /^on./, Wc = /^on[^A-Z]/, Ev = new RegExp("^(aria)-[" + me + "]*$"), xv = new RegExp("^(aria)[A-Z][" + me + "]*$");
      Rl = function(e, t, a, i) {
        if (Rr.call(dr, t) && dr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return m("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), dr[t] = !0, !0;
        if (i != null) {
          var d = i.registrationNameDependencies, h = i.possibleRegistrationNames;
          if (d.hasOwnProperty(t))
            return !0;
          var g = h.hasOwnProperty(u) ? h[u] : null;
          if (g != null)
            return m("Invalid event handler property `%s`. Did you mean `%s`?", t, g), dr[t] = !0, !0;
          if (Gd.test(t))
            return m("Unknown event handler property `%s`. It will be ignored.", t), dr[t] = !0, !0;
        } else if (Gd.test(t))
          return Wc.test(t) && m("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), dr[t] = !0, !0;
        if (Ev.test(t) || xv.test(t))
          return !0;
        if (u === "innerhtml")
          return m("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), dr[t] = !0, !0;
        if (u === "aria")
          return m("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), dr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return m("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), dr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return m("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), dr[t] = !0, !0;
        var C = ln(t), D = C !== null && C.type === Qn;
        if (ws.hasOwnProperty(u)) {
          var _ = ws[u];
          if (_ !== t)
            return m("Invalid DOM property `%s`. Did you mean `%s`?", t, _), dr[t] = !0, !0;
        } else if (!D && t !== u)
          return m("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), dr[t] = !0, !0;
        return typeof a == "boolean" && fn(t, a, C, !1) ? (a ? m('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : m('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), dr[t] = !0, !0) : D ? !0 : fn(t, a, C, !1) ? (dr[t] = !0, !1) : ((a === "false" || a === "true") && C !== null && C.type === Pn && (m("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), dr[t] = !0), !0);
      };
    }
    var Tv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var d = Rl(e, u, t[u], a);
          d || i.push(u);
        }
        var h = i.map(function(g) {
          return "`" + g + "`";
        }).join(", ");
        i.length === 1 ? m("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", h, e) : i.length > 1 && m("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", h, e);
      }
    };
    function Rv(e, t, a) {
      Uo(e, t) || Tv(e, t, a);
    }
    var Qd = 1, Gc = 2, Pa = 4, Kd = Qd | Gc | Pa, bl = null;
    function wg(e) {
      bl !== null && m("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), bl = e;
    }
    function Dg() {
      bl === null && m("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), bl = null;
    }
    function ks(e) {
      return e === bl;
    }
    function qd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === no ? t.parentNode : t;
    }
    var Qc = null, wl = null, Gt = null;
    function Kc(e) {
      var t = Gu(e);
      if (t) {
        if (typeof Qc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Am(a);
          Qc(t.stateNode, t.type, i);
        }
      }
    }
    function qc(e) {
      Qc = e;
    }
    function Du(e) {
      wl ? Gt ? Gt.push(e) : Gt = [e] : wl = e;
    }
    function bv() {
      return wl !== null || Gt !== null;
    }
    function Xc() {
      if (wl) {
        var e = wl, t = Gt;
        if (wl = null, Gt = null, Kc(e), t)
          for (var a = 0; a < t.length; a++)
            Kc(t[a]);
      }
    }
    var ku = function(e, t) {
      return e(t);
    }, _s = function() {
    }, Vo = !1;
    function wv() {
      var e = bv();
      e && (_s(), Xc());
    }
    function Dv(e, t, a) {
      if (Vo)
        return e(t, a);
      Vo = !0;
      try {
        return ku(e, t, a);
      } finally {
        Vo = !1, wv();
      }
    }
    function kg(e, t, a) {
      ku = e, _s = a;
    }
    function kv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Zc(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && kv(t));
        default:
          return !1;
      }
    }
    function zo(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Am(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Zc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var Ms = !1;
    if (Kt)
      try {
        var Dl = {};
        Object.defineProperty(Dl, "passive", {
          get: function() {
            Ms = !0;
          }
        }), window.addEventListener("test", Dl, Dl), window.removeEventListener("test", Dl, Dl);
      } catch {
        Ms = !1;
      }
    function Jc(e, t, a, i, u, d, h, g, C) {
      var D = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, D);
      } catch (_) {
        this.onError(_);
      }
    }
    var ef = Jc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Xd = document.createElement("react");
      ef = function(t, a, i, u, d, h, g, C, D) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var _ = document.createEvent("Event"), F = !1, z = !0, $ = window.event, Q = Object.getOwnPropertyDescriptor(window, "event");
        function Z() {
          Xd.removeEventListener(J, qe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var be = Array.prototype.slice.call(arguments, 3);
        function qe() {
          F = !0, Z(), a.apply(i, be), z = !1;
        }
        var Ye, Nt = !1, _t = !1;
        function B(I) {
          if (Ye = I.error, Nt = !0, Ye === null && I.colno === 0 && I.lineno === 0 && (_t = !0), I.defaultPrevented && Ye != null && typeof Ye == "object")
            try {
              Ye._suppressLogging = !0;
            } catch {
            }
        }
        var J = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", B), Xd.addEventListener(J, qe, !1), _.initEvent(J, !1, !1), Xd.dispatchEvent(_), Q && Object.defineProperty(window, "event", Q), F && z && (Nt ? _t && (Ye = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ye = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ye)), window.removeEventListener("error", B), !F)
          return Z(), Jc.apply(this, arguments);
      };
    }
    var _v = ef, _u = !1, tf = null, Mu = !1, _i = null, Mv = {
      onError: function(e) {
        _u = !0, tf = e;
      }
    };
    function jo(e, t, a, i, u, d, h, g, C) {
      _u = !1, tf = null, _v.apply(Mv, arguments);
    }
    function Mi(e, t, a, i, u, d, h, g, C) {
      if (jo.apply(this, arguments), _u) {
        var D = Ls();
        Mu || (Mu = !0, _i = D);
      }
    }
    function Os() {
      if (Mu) {
        var e = _i;
        throw Mu = !1, _i = null, e;
      }
    }
    function ao() {
      return _u;
    }
    function Ls() {
      if (_u) {
        var e = tf;
        return _u = !1, tf = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ou(e) {
      return e._reactInternals;
    }
    function _g(e) {
      return e._reactInternals !== void 0;
    }
    function kl(e, t) {
      e._reactInternals = t;
    }
    var We = (
      /*                      */
      0
    ), ci = (
      /*                */
      1
    ), Cn = (
      /*                    */
      2
    ), Ot = (
      /*                       */
      4
    ), Ua = (
      /*                */
      16
    ), Va = (
      /*                 */
      32
    ), cn = (
      /*                     */
      64
    ), $e = (
      /*                   */
      128
    ), kr = (
      /*            */
      256
    ), Rn = (
      /*                          */
      512
    ), qn = (
      /*                     */
      1024
    ), Jr = (
      /*                      */
      2048
    ), ea = (
      /*                    */
      4096
    ), Vn = (
      /*                   */
      8192
    ), Lu = (
      /*             */
      16384
    ), Ov = (
      /*               */
      32767
    ), As = (
      /*                   */
      32768
    ), nr = (
      /*                */
      65536
    ), nf = (
      /* */
      131072
    ), Oi = (
      /*                       */
      1048576
    ), Au = (
      /*                    */
      2097152
    ), io = (
      /*                 */
      4194304
    ), rf = (
      /*                */
      8388608
    ), Fo = (
      /*               */
      16777216
    ), Li = (
      /*              */
      33554432
    ), Ho = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Ot | qn | 0
    ), Bo = Cn | Ot | Ua | Va | Rn | ea | Vn, Io = Ot | cn | Rn | Vn, oo = Jr | Ua, zn = io | rf | Au, za = f.ReactCurrentOwner;
    function Sa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (Cn | ea)) !== We && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === k ? a : null;
    }
    function Ai(e) {
      if (e.tag === de) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Ni(e) {
      return e.tag === k ? e.stateNode.containerInfo : null;
    }
    function _l(e) {
      return Sa(e) === e;
    }
    function Lv(e) {
      {
        var t = za.current;
        if (t !== null && t.tag === b) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || m("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", lt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = Ou(e);
      return u ? Sa(u) === u : !1;
    }
    function af(e) {
      if (Sa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function of(e) {
      var t = e.alternate;
      if (!t) {
        var a = Sa(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var d = i.return;
        if (d === null)
          break;
        var h = d.alternate;
        if (h === null) {
          var g = d.return;
          if (g !== null) {
            i = u = g;
            continue;
          }
          break;
        }
        if (d.child === h.child) {
          for (var C = d.child; C; ) {
            if (C === i)
              return af(d), e;
            if (C === u)
              return af(d), t;
            C = C.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = d, u = h;
        else {
          for (var D = !1, _ = d.child; _; ) {
            if (_ === i) {
              D = !0, i = d, u = h;
              break;
            }
            if (_ === u) {
              D = !0, u = d, i = h;
              break;
            }
            _ = _.sibling;
          }
          if (!D) {
            for (_ = h.child; _; ) {
              if (_ === i) {
                D = !0, i = h, u = d;
                break;
              }
              if (_ === u) {
                D = !0, u = h, i = d;
                break;
              }
              _ = _.sibling;
            }
            if (!D)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== k)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function ta(e) {
      var t = of(e);
      return t !== null ? na(t) : null;
    }
    function na(e) {
      if (e.tag === P || e.tag === K)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = na(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function vn(e) {
      var t = of(e);
      return t !== null ? ja(t) : null;
    }
    function ja(e) {
      if (e.tag === P || e.tag === K)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== A) {
          var a = ja(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Zd = s.unstable_scheduleCallback, Av = s.unstable_cancelCallback, Jd = s.unstable_shouldYield, ep = s.unstable_requestPaint, Xn = s.unstable_now, lf = s.unstable_getCurrentPriorityLevel, Ns = s.unstable_ImmediatePriority, Yo = s.unstable_UserBlockingPriority, lo = s.unstable_NormalPriority, Mg = s.unstable_LowPriority, Ml = s.unstable_IdlePriority, uf = s.unstable_yieldValue, Nv = s.unstable_setDisableYieldValue, Ol = null, kn = null, Re = null, Ca = !1, ra = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Nu(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return m("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ze && (e = Ct({}, e, {
          getLaneLabelMap: Ll,
          injectProfilingHooks: Fa
        })), Ol = t.inject(e), kn = t;
      } catch (a) {
        m("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function tp(e, t) {
      if (kn && typeof kn.onScheduleFiberRoot == "function")
        try {
          kn.onScheduleFiberRoot(Ol, e, t);
        } catch (a) {
          Ca || (Ca = !0, m("React instrumentation encountered an error: %s", a));
        }
    }
    function np(e, t) {
      if (kn && typeof kn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & $e) === $e;
          if (Qe) {
            var i;
            switch (t) {
              case Vr:
                i = Ns;
                break;
              case Ui:
                i = Yo;
                break;
              case Ha:
                i = lo;
                break;
              case Ba:
                i = Ml;
                break;
              default:
                i = lo;
                break;
            }
            kn.onCommitFiberRoot(Ol, e, i, a);
          }
        } catch (u) {
          Ca || (Ca = !0, m("React instrumentation encountered an error: %s", u));
        }
    }
    function rp(e) {
      if (kn && typeof kn.onPostCommitFiberRoot == "function")
        try {
          kn.onPostCommitFiberRoot(Ol, e);
        } catch (t) {
          Ca || (Ca = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function ap(e) {
      if (kn && typeof kn.onCommitFiberUnmount == "function")
        try {
          kn.onCommitFiberUnmount(Ol, e);
        } catch (t) {
          Ca || (Ca = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function En(e) {
      if (typeof uf == "function" && (Nv(e), S(e)), kn && typeof kn.setStrictMode == "function")
        try {
          kn.setStrictMode(Ol, e);
        } catch (t) {
          Ca || (Ca = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function Fa(e) {
      Re = e;
    }
    function Ll() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Pl; a++) {
          var i = zv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function ip(e) {
      Re !== null && typeof Re.markCommitStarted == "function" && Re.markCommitStarted(e);
    }
    function op() {
      Re !== null && typeof Re.markCommitStopped == "function" && Re.markCommitStopped();
    }
    function Ea(e) {
      Re !== null && typeof Re.markComponentRenderStarted == "function" && Re.markComponentRenderStarted(e);
    }
    function xa() {
      Re !== null && typeof Re.markComponentRenderStopped == "function" && Re.markComponentRenderStopped();
    }
    function lp(e) {
      Re !== null && typeof Re.markComponentPassiveEffectMountStarted == "function" && Re.markComponentPassiveEffectMountStarted(e);
    }
    function Pv() {
      Re !== null && typeof Re.markComponentPassiveEffectMountStopped == "function" && Re.markComponentPassiveEffectMountStopped();
    }
    function uo(e) {
      Re !== null && typeof Re.markComponentPassiveEffectUnmountStarted == "function" && Re.markComponentPassiveEffectUnmountStarted(e);
    }
    function $o() {
      Re !== null && typeof Re.markComponentPassiveEffectUnmountStopped == "function" && Re.markComponentPassiveEffectUnmountStopped();
    }
    function sf(e) {
      Re !== null && typeof Re.markComponentLayoutEffectMountStarted == "function" && Re.markComponentLayoutEffectMountStarted(e);
    }
    function Uv() {
      Re !== null && typeof Re.markComponentLayoutEffectMountStopped == "function" && Re.markComponentLayoutEffectMountStopped();
    }
    function Ps(e) {
      Re !== null && typeof Re.markComponentLayoutEffectUnmountStarted == "function" && Re.markComponentLayoutEffectUnmountStarted(e);
    }
    function up() {
      Re !== null && typeof Re.markComponentLayoutEffectUnmountStopped == "function" && Re.markComponentLayoutEffectUnmountStopped();
    }
    function Us(e, t, a) {
      Re !== null && typeof Re.markComponentErrored == "function" && Re.markComponentErrored(e, t, a);
    }
    function Pi(e, t, a) {
      Re !== null && typeof Re.markComponentSuspended == "function" && Re.markComponentSuspended(e, t, a);
    }
    function Vs(e) {
      Re !== null && typeof Re.markLayoutEffectsStarted == "function" && Re.markLayoutEffectsStarted(e);
    }
    function zs() {
      Re !== null && typeof Re.markLayoutEffectsStopped == "function" && Re.markLayoutEffectsStopped();
    }
    function Al(e) {
      Re !== null && typeof Re.markPassiveEffectsStarted == "function" && Re.markPassiveEffectsStarted(e);
    }
    function sp() {
      Re !== null && typeof Re.markPassiveEffectsStopped == "function" && Re.markPassiveEffectsStopped();
    }
    function Nl(e) {
      Re !== null && typeof Re.markRenderStarted == "function" && Re.markRenderStarted(e);
    }
    function Vv() {
      Re !== null && typeof Re.markRenderYielded == "function" && Re.markRenderYielded();
    }
    function cf() {
      Re !== null && typeof Re.markRenderStopped == "function" && Re.markRenderStopped();
    }
    function xn(e) {
      Re !== null && typeof Re.markRenderScheduled == "function" && Re.markRenderScheduled(e);
    }
    function ff(e, t) {
      Re !== null && typeof Re.markForceUpdateScheduled == "function" && Re.markForceUpdateScheduled(e, t);
    }
    function js(e, t) {
      Re !== null && typeof Re.markStateUpdateScheduled == "function" && Re.markStateUpdateScheduled(e, t);
    }
    var Ge = (
      /*                         */
      0
    ), bt = (
      /*                 */
      1
    ), Ht = (
      /*                    */
      2
    ), tn = (
      /*               */
      8
    ), Bt = (
      /*              */
      16
    ), jn = Math.clz32 ? Math.clz32 : Fs, rr = Math.log, df = Math.LN2;
    function Fs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (rr(t) / df | 0) | 0;
    }
    var Pl = 31, ie = (
      /*                        */
      0
    ), zt = (
      /*                          */
      0
    ), nt = (
      /*                        */
      1
    ), Wo = (
      /*    */
      2
    ), fi = (
      /*             */
      4
    ), _r = (
      /*            */
      8
    ), _n = (
      /*                     */
      16
    ), so = (
      /*                */
      32
    ), Go = (
      /*                       */
      4194240
    ), Ul = (
      /*                        */
      64
    ), pf = (
      /*                        */
      128
    ), hf = (
      /*                        */
      256
    ), vf = (
      /*                        */
      512
    ), mf = (
      /*                        */
      1024
    ), yf = (
      /*                        */
      2048
    ), gf = (
      /*                        */
      4096
    ), Sf = (
      /*                        */
      8192
    ), Cf = (
      /*                        */
      16384
    ), Vl = (
      /*                       */
      32768
    ), Ef = (
      /*                       */
      65536
    ), Pu = (
      /*                       */
      131072
    ), Uu = (
      /*                       */
      262144
    ), xf = (
      /*                       */
      524288
    ), Hs = (
      /*                       */
      1048576
    ), Tf = (
      /*                       */
      2097152
    ), Bs = (
      /*                            */
      130023424
    ), zl = (
      /*                             */
      4194304
    ), Rf = (
      /*                             */
      8388608
    ), Is = (
      /*                             */
      16777216
    ), bf = (
      /*                             */
      33554432
    ), wf = (
      /*                             */
      67108864
    ), cp = zl, Ys = (
      /*          */
      134217728
    ), fp = (
      /*                          */
      268435455
    ), $s = (
      /*               */
      268435456
    ), jl = (
      /*                        */
      536870912
    ), aa = (
      /*                   */
      1073741824
    );
    function zv(e) {
      {
        if (e & nt)
          return "Sync";
        if (e & Wo)
          return "InputContinuousHydration";
        if (e & fi)
          return "InputContinuous";
        if (e & _r)
          return "DefaultHydration";
        if (e & _n)
          return "Default";
        if (e & so)
          return "TransitionHydration";
        if (e & Go)
          return "Transition";
        if (e & Bs)
          return "Retry";
        if (e & Ys)
          return "SelectiveHydration";
        if (e & $s)
          return "IdleHydration";
        if (e & jl)
          return "Idle";
        if (e & aa)
          return "Offscreen";
      }
    }
    var an = -1, Fl = Ul, Df = zl;
    function Ws(e) {
      switch (Qo(e)) {
        case nt:
          return nt;
        case Wo:
          return Wo;
        case fi:
          return fi;
        case _r:
          return _r;
        case _n:
          return _n;
        case so:
          return so;
        case Ul:
        case pf:
        case hf:
        case vf:
        case mf:
        case yf:
        case gf:
        case Sf:
        case Cf:
        case Vl:
        case Ef:
        case Pu:
        case Uu:
        case xf:
        case Hs:
        case Tf:
          return e & Go;
        case zl:
        case Rf:
        case Is:
        case bf:
        case wf:
          return e & Bs;
        case Ys:
          return Ys;
        case $s:
          return $s;
        case jl:
          return jl;
        case aa:
          return aa;
        default:
          return m("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function kf(e, t) {
      var a = e.pendingLanes;
      if (a === ie)
        return ie;
      var i = ie, u = e.suspendedLanes, d = e.pingedLanes, h = a & fp;
      if (h !== ie) {
        var g = h & ~u;
        if (g !== ie)
          i = Ws(g);
        else {
          var C = h & d;
          C !== ie && (i = Ws(C));
        }
      } else {
        var D = a & ~u;
        D !== ie ? i = Ws(D) : d !== ie && (i = Ws(d));
      }
      if (i === ie)
        return ie;
      if (t !== ie && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === ie) {
        var _ = Qo(i), F = Qo(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          _ >= F || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          _ === _n && (F & Go) !== ie
        )
          return t;
      }
      (i & fi) !== ie && (i |= a & _n);
      var z = e.entangledLanes;
      if (z !== ie)
        for (var $ = e.entanglements, Q = i & z; Q > 0; ) {
          var Z = Fn(Q), be = 1 << Z;
          i |= $[Z], Q &= ~be;
        }
      return i;
    }
    function di(e, t) {
      for (var a = e.eventTimes, i = an; t > 0; ) {
        var u = Fn(t), d = 1 << u, h = a[u];
        h > i && (i = h), t &= ~d;
      }
      return i;
    }
    function dp(e, t) {
      switch (e) {
        case nt:
        case Wo:
        case fi:
          return t + 250;
        case _r:
        case _n:
        case so:
        case Ul:
        case pf:
        case hf:
        case vf:
        case mf:
        case yf:
        case gf:
        case Sf:
        case Cf:
        case Vl:
        case Ef:
        case Pu:
        case Uu:
        case xf:
        case Hs:
        case Tf:
          return t + 5e3;
        case zl:
        case Rf:
        case Is:
        case bf:
        case wf:
          return an;
        case Ys:
        case $s:
        case jl:
        case aa:
          return an;
        default:
          return m("Should have found matching lanes. This is a bug in React."), an;
      }
    }
    function _f(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, d = e.expirationTimes, h = a; h > 0; ) {
        var g = Fn(h), C = 1 << g, D = d[g];
        D === an ? ((C & i) === ie || (C & u) !== ie) && (d[g] = dp(C, t)) : D <= t && (e.expiredLanes |= C), h &= ~C;
      }
    }
    function jv(e) {
      return Ws(e.pendingLanes);
    }
    function Mf(e) {
      var t = e.pendingLanes & ~aa;
      return t !== ie ? t : t & aa ? aa : ie;
    }
    function Fv(e) {
      return (e & nt) !== ie;
    }
    function Gs(e) {
      return (e & fp) !== ie;
    }
    function Hl(e) {
      return (e & Bs) === e;
    }
    function pp(e) {
      var t = nt | fi | _n;
      return (e & t) === ie;
    }
    function hp(e) {
      return (e & Go) === e;
    }
    function Of(e, t) {
      var a = Wo | fi | _r | _n;
      return (t & a) !== ie;
    }
    function Hv(e, t) {
      return (t & e.expiredLanes) !== ie;
    }
    function vp(e) {
      return (e & Go) !== ie;
    }
    function mp() {
      var e = Fl;
      return Fl <<= 1, (Fl & Go) === ie && (Fl = Ul), e;
    }
    function Bv() {
      var e = Df;
      return Df <<= 1, (Df & Bs) === ie && (Df = zl), e;
    }
    function Qo(e) {
      return e & -e;
    }
    function Qs(e) {
      return Qo(e);
    }
    function Fn(e) {
      return 31 - jn(e);
    }
    function pr(e) {
      return Fn(e);
    }
    function ia(e, t) {
      return (e & t) !== ie;
    }
    function Bl(e, t) {
      return (e & t) === t;
    }
    function St(e, t) {
      return e | t;
    }
    function Ks(e, t) {
      return e & ~t;
    }
    function yp(e, t) {
      return e & t;
    }
    function Iv(e) {
      return e;
    }
    function Yv(e, t) {
      return e !== zt && e < t ? e : t;
    }
    function qs(e) {
      for (var t = [], a = 0; a < Pl; a++)
        t.push(e);
      return t;
    }
    function Vu(e, t, a) {
      e.pendingLanes |= t, t !== jl && (e.suspendedLanes = ie, e.pingedLanes = ie);
      var i = e.eventTimes, u = pr(t);
      i[u] = a;
    }
    function $v(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Fn(i), d = 1 << u;
        a[u] = an, i &= ~d;
      }
    }
    function Lf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function gp(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = ie, e.pingedLanes = ie, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, d = e.expirationTimes, h = a; h > 0; ) {
        var g = Fn(h), C = 1 << g;
        i[g] = ie, u[g] = an, d[g] = an, h &= ~C;
      }
    }
    function Af(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var d = Fn(u), h = 1 << d;
        // Is this one of the newly entangled lanes?
        h & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[d] & t && (i[d] |= t), u &= ~h;
      }
    }
    function Sp(e, t) {
      var a = Qo(t), i;
      switch (a) {
        case fi:
          i = Wo;
          break;
        case _n:
          i = _r;
          break;
        case Ul:
        case pf:
        case hf:
        case vf:
        case mf:
        case yf:
        case gf:
        case Sf:
        case Cf:
        case Vl:
        case Ef:
        case Pu:
        case Uu:
        case xf:
        case Hs:
        case Tf:
        case zl:
        case Rf:
        case Is:
        case bf:
        case wf:
          i = so;
          break;
        case jl:
          i = $s;
          break;
        default:
          i = zt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== zt ? zt : i;
    }
    function Xs(e, t, a) {
      if (ra)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = pr(a), d = 1 << u, h = i[u];
          h.add(t), a &= ~d;
        }
    }
    function Wv(e, t) {
      if (ra)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = pr(t), d = 1 << u, h = a[u];
          h.size > 0 && (h.forEach(function(g) {
            var C = g.alternate;
            (C === null || !i.has(C)) && i.add(g);
          }), h.clear()), t &= ~d;
        }
    }
    function Cp(e, t) {
      return null;
    }
    var Vr = nt, Ui = fi, Ha = _n, Ba = jl, Zs = zt;
    function Ia() {
      return Zs;
    }
    function Hn(e) {
      Zs = e;
    }
    function Gv(e, t) {
      var a = Zs;
      try {
        return Zs = e, t();
      } finally {
        Zs = a;
      }
    }
    function Qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Js(e, t) {
      return e > t ? e : t;
    }
    function ar(e, t) {
      return e !== 0 && e < t;
    }
    function Kv(e) {
      var t = Qo(e);
      return ar(Vr, t) ? ar(Ui, t) ? Gs(t) ? Ha : Ba : Ui : Vr;
    }
    function Nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var ec;
    function Mr(e) {
      ec = e;
    }
    function Og(e) {
      ec(e);
    }
    var Le;
    function zu(e) {
      Le = e;
    }
    var Pf;
    function qv(e) {
      Pf = e;
    }
    var Xv;
    function tc(e) {
      Xv = e;
    }
    var nc;
    function Ep(e) {
      nc = e;
    }
    var Uf = !1, rc = [], co = null, Vi = null, zi = null, Mn = /* @__PURE__ */ new Map(), zr = /* @__PURE__ */ new Map(), jr = [], Zv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Jv(e) {
      return Zv.indexOf(e) > -1;
    }
    function pi(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function xp(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          co = null;
          break;
        case "dragenter":
        case "dragleave":
          Vi = null;
          break;
        case "mouseover":
        case "mouseout":
          zi = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Mn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          zr.delete(i);
          break;
        }
      }
    }
    function oa(e, t, a, i, u, d) {
      if (e === null || e.nativeEvent !== d) {
        var h = pi(t, a, i, u, d);
        if (t !== null) {
          var g = Gu(t);
          g !== null && Le(g);
        }
        return h;
      }
      e.eventSystemFlags |= i;
      var C = e.targetContainers;
      return u !== null && C.indexOf(u) === -1 && C.push(u), e;
    }
    function Lg(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var d = u;
          return co = oa(co, e, t, a, i, d), !0;
        }
        case "dragenter": {
          var h = u;
          return Vi = oa(Vi, e, t, a, i, h), !0;
        }
        case "mouseover": {
          var g = u;
          return zi = oa(zi, e, t, a, i, g), !0;
        }
        case "pointerover": {
          var C = u, D = C.pointerId;
          return Mn.set(D, oa(Mn.get(D) || null, e, t, a, i, C)), !0;
        }
        case "gotpointercapture": {
          var _ = u, F = _.pointerId;
          return zr.set(F, oa(zr.get(F) || null, e, t, a, i, _)), !0;
        }
      }
      return !1;
    }
    function Tp(e) {
      var t = vc(e.target);
      if (t !== null) {
        var a = Sa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === de) {
            var u = Ai(a);
            if (u !== null) {
              e.blockedOn = u, nc(e.priority, function() {
                Pf(a);
              });
              return;
            }
          } else if (i === k) {
            var d = a.stateNode;
            if (Nf(d)) {
              e.blockedOn = Ni(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function em(e) {
      for (var t = Xv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < jr.length && ar(t, jr[i].priority); i++)
        ;
      jr.splice(i, 0, a), i === 0 && Tp(a);
    }
    function ac(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Fu(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, d = new u.constructor(u.type, u);
          wg(d), u.target.dispatchEvent(d), Dg();
        } else {
          var h = Gu(i);
          return h !== null && Le(h), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Rp(e, t, a) {
      ac(e) && a.delete(t);
    }
    function Ag() {
      Uf = !1, co !== null && ac(co) && (co = null), Vi !== null && ac(Vi) && (Vi = null), zi !== null && ac(zi) && (zi = null), Mn.forEach(Rp), zr.forEach(Rp);
    }
    function Ko(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Uf || (Uf = !0, s.unstable_scheduleCallback(s.unstable_NormalPriority, Ag)));
    }
    function Il(e) {
      if (rc.length > 0) {
        Ko(rc[0], e);
        for (var t = 1; t < rc.length; t++) {
          var a = rc[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      co !== null && Ko(co, e), Vi !== null && Ko(Vi, e), zi !== null && Ko(zi, e);
      var i = function(g) {
        return Ko(g, e);
      };
      Mn.forEach(i), zr.forEach(i);
      for (var u = 0; u < jr.length; u++) {
        var d = jr[u];
        d.blockedOn === e && (d.blockedOn = null);
      }
      for (; jr.length > 0; ) {
        var h = jr[0];
        if (h.blockedOn !== null)
          break;
        Tp(h), h.blockedOn === null && jr.shift();
      }
    }
    var hr = f.ReactCurrentBatchConfig, Lt = !0;
    function Zn(e) {
      Lt = !!e;
    }
    function Bn() {
      return Lt;
    }
    function vr(e, t, a) {
      var i = Vf(t), u;
      switch (i) {
        case Vr:
          u = Ta;
          break;
        case Ui:
          u = ju;
          break;
        case Ha:
        default:
          u = On;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function Ta(e, t, a, i) {
      var u = Ia(), d = hr.transition;
      hr.transition = null;
      try {
        Hn(Vr), On(e, t, a, i);
      } finally {
        Hn(u), hr.transition = d;
      }
    }
    function ju(e, t, a, i) {
      var u = Ia(), d = hr.transition;
      hr.transition = null;
      try {
        Hn(Ui), On(e, t, a, i);
      } finally {
        Hn(u), hr.transition = d;
      }
    }
    function On(e, t, a, i) {
      Lt && ic(e, t, a, i);
    }
    function ic(e, t, a, i) {
      var u = Fu(e, t, a, i);
      if (u === null) {
        qg(e, t, i, ji, a), xp(e, i);
        return;
      }
      if (Lg(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (xp(e, i), t & Pa && Jv(e)) {
        for (; u !== null; ) {
          var d = Gu(u);
          d !== null && Og(d);
          var h = Fu(e, t, a, i);
          if (h === null && qg(e, t, i, ji, a), h === u)
            break;
          u = h;
        }
        u !== null && i.stopPropagation();
        return;
      }
      qg(e, t, i, null, a);
    }
    var ji = null;
    function Fu(e, t, a, i) {
      ji = null;
      var u = qd(i), d = vc(u);
      if (d !== null) {
        var h = Sa(d);
        if (h === null)
          d = null;
        else {
          var g = h.tag;
          if (g === de) {
            var C = Ai(h);
            if (C !== null)
              return C;
            d = null;
          } else if (g === k) {
            var D = h.stateNode;
            if (Nf(D))
              return Ni(h);
            d = null;
          } else h !== d && (d = null);
        }
      }
      return ji = d, null;
    }
    function Vf(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Vr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return Ui;
        case "message": {
          var t = lf();
          switch (t) {
            case Ns:
              return Vr;
            case Yo:
              return Ui;
            case lo:
            case Mg:
              return Ha;
            case Ml:
              return Ba;
            default:
              return Ha;
          }
        }
        default:
          return Ha;
      }
    }
    function oc(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function la(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function bp(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Hu(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ra = null, Bu = null, Yl = null;
    function qo(e) {
      return Ra = e, Bu = lc(), !0;
    }
    function zf() {
      Ra = null, Bu = null, Yl = null;
    }
    function fo() {
      if (Yl)
        return Yl;
      var e, t = Bu, a = t.length, i, u = lc(), d = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var h = a - e;
      for (i = 1; i <= h && t[a - i] === u[d - i]; i++)
        ;
      var g = i > 1 ? 1 - i : void 0;
      return Yl = u.slice(e, g), Yl;
    }
    function lc() {
      return "value" in Ra ? Ra.value : Ra.textContent;
    }
    function Xo(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Iu() {
      return !0;
    }
    function uc() {
      return !1;
    }
    function Or(e) {
      function t(a, i, u, d, h) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = d, this.target = h, this.currentTarget = null;
        for (var g in e)
          if (e.hasOwnProperty(g)) {
            var C = e[g];
            C ? this[g] = C(d) : this[g] = d[g];
          }
        var D = d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1;
        return D ? this.isDefaultPrevented = Iu : this.isDefaultPrevented = uc, this.isPropagationStopped = uc, this;
      }
      return Ct(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Iu);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Iu);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: Iu
      }), t;
    }
    var In = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Fi = Or(In), Fr = Ct({}, In, {
      view: 0,
      detail: 0
    }), ua = Or(Fr), jf, sc, $l;
    function Ng(e) {
      e !== $l && ($l && e.type === "mousemove" ? (jf = e.screenX - $l.screenX, sc = e.screenY - $l.screenY) : (jf = 0, sc = 0), $l = e);
    }
    var hi = Ct({}, Fr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: mn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Ng(e), jf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : sc;
      }
    }), wp = Or(hi), Dp = Ct({}, hi, {
      dataTransfer: 0
    }), Wl = Or(Dp), kp = Ct({}, Fr, {
      relatedTarget: 0
    }), po = Or(kp), tm = Ct({}, In, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), nm = Or(tm), _p = Ct({}, In, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), Ff = Or(_p), Pg = Ct({}, In, {
      data: 0
    }), rm = Or(Pg), am = rm, im = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Gl = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function Ug(e) {
      if (e.key) {
        var t = im[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Xo(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Gl[e.keyCode] || "Unidentified" : "";
    }
    var Yu = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function om(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Yu[e];
      return i ? !!a[i] : !1;
    }
    function mn(e) {
      return om;
    }
    var Vg = Ct({}, Fr, {
      key: Ug,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: mn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Xo(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Xo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), lm = Or(Vg), zg = Ct({}, hi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), um = Or(zg), sm = Ct({}, Fr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: mn
    }), cm = Or(sm), jg = Ct({}, In, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ya = Or(jg), Mp = Ct({}, hi, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Fg = Or(Mp), Zo = [9, 13, 27, 32], cc = 229, ho = Kt && "CompositionEvent" in window, Jo = null;
    Kt && "documentMode" in document && (Jo = document.documentMode);
    var Op = Kt && "TextEvent" in window && !Jo, Hf = Kt && (!ho || Jo && Jo > 8 && Jo <= 11), fm = 32, Bf = String.fromCharCode(fm);
    function Hg() {
      ht("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), ht("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ht("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ht("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Lp = !1;
    function dm(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function If(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function Yf(e, t) {
      return e === "keydown" && t.keyCode === cc;
    }
    function Ap(e, t) {
      switch (e) {
        case "keyup":
          return Zo.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== cc;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function $f(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function pm(e) {
      return e.locale === "ko";
    }
    var Ql = !1;
    function Np(e, t, a, i, u) {
      var d, h;
      if (ho ? d = If(t) : Ql ? Ap(t, i) && (d = "onCompositionEnd") : Yf(t, i) && (d = "onCompositionStart"), !d)
        return null;
      Hf && !pm(i) && (!Ql && d === "onCompositionStart" ? Ql = qo(u) : d === "onCompositionEnd" && Ql && (h = fo()));
      var g = Cm(a, d);
      if (g.length > 0) {
        var C = new rm(d, t, null, i, u);
        if (e.push({
          event: C,
          listeners: g
        }), h)
          C.data = h;
        else {
          var D = $f(i);
          D !== null && (C.data = D);
        }
      }
    }
    function Wf(e, t) {
      switch (e) {
        case "compositionend":
          return $f(t);
        case "keypress":
          var a = t.which;
          return a !== fm ? null : (Lp = !0, Bf);
        case "textInput":
          var i = t.data;
          return i === Bf && Lp ? null : i;
        default:
          return null;
      }
    }
    function Pp(e, t) {
      if (Ql) {
        if (e === "compositionend" || !ho && Ap(e, t)) {
          var a = fo();
          return zf(), Ql = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!dm(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Hf && !pm(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Gf(e, t, a, i, u) {
      var d;
      if (Op ? d = Wf(t, i) : d = Pp(t, i), !d)
        return null;
      var h = Cm(a, "onBeforeInput");
      if (h.length > 0) {
        var g = new am("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: g,
          listeners: h
        }), g.data = d;
      }
    }
    function hm(e, t, a, i, u, d, h) {
      Np(e, t, a, i, u), Gf(e, t, a, i, u);
    }
    var Bg = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function fc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Bg[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Ig(e) {
      if (!Kt)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function dc() {
      ht("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function vm(e, t, a, i) {
      Du(i);
      var u = Cm(t, "onChange");
      if (u.length > 0) {
        var d = new Fi("onChange", "change", null, a, i);
        e.push({
          event: d,
          listeners: u
        });
      }
    }
    var el = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function o(e) {
      var t = [];
      vm(t, n, e, qd(e)), Dv(c, t);
    }
    function c(e) {
      WE(e, 0);
    }
    function p(e) {
      var t = Jf(e);
      if (Di(t))
        return e;
    }
    function y(e, t) {
      if (e === "change")
        return t;
    }
    var x = !1;
    Kt && (x = Ig("input") && (!document.documentMode || document.documentMode > 9));
    function O(e, t) {
      el = e, n = t, el.attachEvent("onpropertychange", G);
    }
    function U() {
      el && (el.detachEvent("onpropertychange", G), el = null, n = null);
    }
    function G(e) {
      e.propertyName === "value" && p(n) && o(e);
    }
    function le(e, t, a) {
      e === "focusin" ? (U(), O(t, a)) : e === "focusout" && U();
    }
    function ce(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return p(n);
    }
    function oe(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function ke(e, t) {
      if (e === "click")
        return p(t);
    }
    function Ve(e, t) {
      if (e === "input" || e === "change")
        return p(t);
    }
    function He(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ke(e, "number", e.value);
    }
    function Ln(e, t, a, i, u, d, h) {
      var g = a ? Jf(a) : window, C, D;
      if (r(g) ? C = y : fc(g) ? x ? C = Ve : (C = ce, D = le) : oe(g) && (C = ke), C) {
        var _ = C(t, a);
        if (_) {
          vm(e, _, i, u);
          return;
        }
      }
      D && D(t, g, a), t === "focusout" && He(g);
    }
    function H() {
      Pt("onMouseEnter", ["mouseout", "mouseover"]), Pt("onMouseLeave", ["mouseout", "mouseover"]), Pt("onPointerEnter", ["pointerout", "pointerover"]), Pt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function j(e, t, a, i, u, d, h) {
      var g = t === "mouseover" || t === "pointerover", C = t === "mouseout" || t === "pointerout";
      if (g && !ks(i)) {
        var D = i.relatedTarget || i.fromElement;
        if (D && (vc(D) || Kp(D)))
          return;
      }
      if (!(!C && !g)) {
        var _;
        if (u.window === u)
          _ = u;
        else {
          var F = u.ownerDocument;
          F ? _ = F.defaultView || F.parentWindow : _ = window;
        }
        var z, $;
        if (C) {
          var Q = i.relatedTarget || i.toElement;
          if (z = a, $ = Q ? vc(Q) : null, $ !== null) {
            var Z = Sa($);
            ($ !== Z || $.tag !== P && $.tag !== K) && ($ = null);
          }
        } else
          z = null, $ = a;
        if (z !== $) {
          var be = wp, qe = "onMouseLeave", Ye = "onMouseEnter", Nt = "mouse";
          (t === "pointerout" || t === "pointerover") && (be = um, qe = "onPointerLeave", Ye = "onPointerEnter", Nt = "pointer");
          var _t = z == null ? _ : Jf(z), B = $ == null ? _ : Jf($), J = new be(qe, Nt + "leave", z, i, u);
          J.target = _t, J.relatedTarget = B;
          var I = null, fe = vc(u);
          if (fe === a) {
            var Me = new be(Ye, Nt + "enter", $, i, u);
            Me.target = B, Me.relatedTarget = _t, I = Me;
          }
          SD(e, J, I, z, $);
        }
      }
    }
    function Y(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var ue = typeof Object.is == "function" ? Object.is : Y;
    function ze(e, t) {
      if (ue(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var d = a[u];
        if (!Rr.call(t, d) || !ue(e[d], t[d]))
          return !1;
      }
      return !0;
    }
    function Xe(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function et(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function at(e, t) {
      for (var a = Xe(e), i = 0, u = 0; a; ) {
        if (a.nodeType === no) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Xe(et(a));
      }
    }
    function ir(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, d = i.anchorOffset, h = i.focusNode, g = i.focusOffset;
      try {
        u.nodeType, h.nodeType;
      } catch {
        return null;
      }
      return It(e, u, d, h, g);
    }
    function It(e, t, a, i, u) {
      var d = 0, h = -1, g = -1, C = 0, D = 0, _ = e, F = null;
      e: for (; ; ) {
        for (var z = null; _ === t && (a === 0 || _.nodeType === no) && (h = d + a), _ === i && (u === 0 || _.nodeType === no) && (g = d + u), _.nodeType === no && (d += _.nodeValue.length), (z = _.firstChild) !== null; )
          F = _, _ = z;
        for (; ; ) {
          if (_ === e)
            break e;
          if (F === t && ++C === a && (h = d), F === i && ++D === u && (g = d), (z = _.nextSibling) !== null)
            break;
          _ = F, F = _.parentNode;
        }
        _ = z;
      }
      return h === -1 || g === -1 ? null : {
        start: h,
        end: g
      };
    }
    function tl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), d = e.textContent.length, h = Math.min(t.start, d), g = t.end === void 0 ? h : Math.min(t.end, d);
        if (!u.extend && h > g) {
          var C = g;
          g = h, h = C;
        }
        var D = at(e, h), _ = at(e, g);
        if (D && _) {
          if (u.rangeCount === 1 && u.anchorNode === D.node && u.anchorOffset === D.offset && u.focusNode === _.node && u.focusOffset === _.offset)
            return;
          var F = a.createRange();
          F.setStart(D.node, D.offset), u.removeAllRanges(), h > g ? (u.addRange(F), u.extend(_.node, _.offset)) : (F.setEnd(_.node, _.offset), u.addRange(F));
        }
      }
    }
    function mm(e) {
      return e && e.nodeType === no;
    }
    function PE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : mm(e) ? !1 : mm(t) ? PE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function tD(e) {
      return e && e.ownerDocument && PE(e.ownerDocument.documentElement, e);
    }
    function nD(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function UE() {
      for (var e = window, t = Na(); t instanceof e.HTMLIFrameElement; ) {
        if (nD(t))
          e = t.contentWindow;
        else
          return t;
        t = Na(e.document);
      }
      return t;
    }
    function Yg(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function rD() {
      var e = UE();
      return {
        focusedElem: e,
        selectionRange: Yg(e) ? iD(e) : null
      };
    }
    function aD(e) {
      var t = UE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && tD(a)) {
        i !== null && Yg(a) && oD(a, i);
        for (var u = [], d = a; d = d.parentNode; )
          d.nodeType === Zr && u.push({
            element: d,
            left: d.scrollLeft,
            top: d.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var h = 0; h < u.length; h++) {
          var g = u[h];
          g.element.scrollLeft = g.left, g.element.scrollTop = g.top;
        }
      }
    }
    function iD(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = ir(e), t || {
        start: 0,
        end: 0
      };
    }
    function oD(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : tl(e, t);
    }
    var lD = Kt && "documentMode" in document && document.documentMode <= 11;
    function uD() {
      ht("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Qf = null, $g = null, Up = null, Wg = !1;
    function sD(e) {
      if ("selectionStart" in e && Yg(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function cD(e) {
      return e.window === e ? e.document : e.nodeType === ro ? e : e.ownerDocument;
    }
    function VE(e, t, a) {
      var i = cD(a);
      if (!(Wg || Qf == null || Qf !== Na(i))) {
        var u = sD(Qf);
        if (!Up || !ze(Up, u)) {
          Up = u;
          var d = Cm($g, "onSelect");
          if (d.length > 0) {
            var h = new Fi("onSelect", "select", null, t, a);
            e.push({
              event: h,
              listeners: d
            }), h.target = Qf;
          }
        }
      }
    }
    function fD(e, t, a, i, u, d, h) {
      var g = a ? Jf(a) : window;
      switch (t) {
        case "focusin":
          (fc(g) || g.contentEditable === "true") && (Qf = g, $g = a, Up = null);
          break;
        case "focusout":
          Qf = null, $g = null, Up = null;
          break;
        case "mousedown":
          Wg = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Wg = !1, VE(e, i, u);
          break;
        case "selectionchange":
          if (lD)
            break;
        case "keydown":
        case "keyup":
          VE(e, i, u);
      }
    }
    function ym(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Kf = {
      animationend: ym("Animation", "AnimationEnd"),
      animationiteration: ym("Animation", "AnimationIteration"),
      animationstart: ym("Animation", "AnimationStart"),
      transitionend: ym("Transition", "TransitionEnd")
    }, Gg = {}, zE = {};
    Kt && (zE = document.createElement("div").style, "AnimationEvent" in window || (delete Kf.animationend.animation, delete Kf.animationiteration.animation, delete Kf.animationstart.animation), "TransitionEvent" in window || delete Kf.transitionend.transition);
    function gm(e) {
      if (Gg[e])
        return Gg[e];
      if (!Kf[e])
        return e;
      var t = Kf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in zE)
          return Gg[e] = t[a];
      return e;
    }
    var jE = gm("animationend"), FE = gm("animationiteration"), HE = gm("animationstart"), BE = gm("transitionend"), IE = /* @__PURE__ */ new Map(), YE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function $u(e, t) {
      IE.set(e, t), ht(t, [e]);
    }
    function dD() {
      for (var e = 0; e < YE.length; e++) {
        var t = YE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        $u(a, "on" + i);
      }
      $u(jE, "onAnimationEnd"), $u(FE, "onAnimationIteration"), $u(HE, "onAnimationStart"), $u("dblclick", "onDoubleClick"), $u("focusin", "onFocus"), $u("focusout", "onBlur"), $u(BE, "onTransitionEnd");
    }
    function pD(e, t, a, i, u, d, h) {
      var g = IE.get(t);
      if (g !== void 0) {
        var C = Fi, D = t;
        switch (t) {
          case "keypress":
            if (Xo(i) === 0)
              return;
          case "keydown":
          case "keyup":
            C = lm;
            break;
          case "focusin":
            D = "focus", C = po;
            break;
          case "focusout":
            D = "blur", C = po;
            break;
          case "beforeblur":
          case "afterblur":
            C = po;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            C = wp;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            C = Wl;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            C = cm;
            break;
          case jE:
          case FE:
          case HE:
            C = nm;
            break;
          case BE:
            C = Ya;
            break;
          case "scroll":
            C = ua;
            break;
          case "wheel":
            C = Fg;
            break;
          case "copy":
          case "cut":
          case "paste":
            C = Ff;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            C = um;
            break;
        }
        var _ = (d & Pa) !== 0;
        {
          var F = !_ && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", z = yD(a, g, i.type, _, F);
          if (z.length > 0) {
            var $ = new C(g, D, null, i, u);
            e.push({
              event: $,
              listeners: z
            });
          }
        }
      }
    }
    dD(), H(), dc(), uD(), Hg();
    function hD(e, t, a, i, u, d, h) {
      pD(e, t, a, i, u, d);
      var g = (d & Kd) === 0;
      g && (j(e, t, a, i, u), Ln(e, t, a, i, u), fD(e, t, a, i, u), hm(e, t, a, i, u));
    }
    var Vp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Qg = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Vp));
    function $E(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Mi(i, t, void 0, e), e.currentTarget = null;
    }
    function vD(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var d = t[u], h = d.instance, g = d.currentTarget, C = d.listener;
          if (h !== i && e.isPropagationStopped())
            return;
          $E(e, C, g), i = h;
        }
      else
        for (var D = 0; D < t.length; D++) {
          var _ = t[D], F = _.instance, z = _.currentTarget, $ = _.listener;
          if (F !== i && e.isPropagationStopped())
            return;
          $E(e, $, z), i = F;
        }
    }
    function WE(e, t) {
      for (var a = (t & Pa) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], d = u.event, h = u.listeners;
        vD(d, h, a);
      }
      Os();
    }
    function mD(e, t, a, i, u) {
      var d = qd(a), h = [];
      hD(h, e, i, a, d, t), WE(h, t);
    }
    function Tn(e, t) {
      Qg.has(e) || m('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = Wk(t), u = CD(e);
      i.has(u) || (GE(t, e, Gc, a), i.add(u));
    }
    function Kg(e, t, a) {
      Qg.has(e) && !t && m('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Pa), GE(a, e, i, t);
    }
    var Sm = "_reactListening" + Math.random().toString(36).slice(2);
    function zp(e) {
      if (!e[Sm]) {
        e[Sm] = !0, ot.forEach(function(a) {
          a !== "selectionchange" && (Qg.has(a) || Kg(a, !1, e), Kg(a, !0, e));
        });
        var t = e.nodeType === ro ? e : e.ownerDocument;
        t !== null && (t[Sm] || (t[Sm] = !0, Kg("selectionchange", !1, t)));
      }
    }
    function GE(e, t, a, i, u) {
      var d = vr(e, t, a), h = void 0;
      Ms && (t === "touchstart" || t === "touchmove" || t === "wheel") && (h = !0), e = e, i ? h !== void 0 ? bp(e, t, d, h) : la(e, t, d) : h !== void 0 ? Hu(e, t, d, h) : oc(e, t, d);
    }
    function QE(e, t) {
      return e === t || e.nodeType === Un && e.parentNode === t;
    }
    function qg(e, t, a, i, u) {
      var d = i;
      if (!(t & Qd) && !(t & Gc)) {
        var h = u;
        if (i !== null) {
          var g = i;
          e: for (; ; ) {
            if (g === null)
              return;
            var C = g.tag;
            if (C === k || C === A) {
              var D = g.stateNode.containerInfo;
              if (QE(D, h))
                break;
              if (C === A)
                for (var _ = g.return; _ !== null; ) {
                  var F = _.tag;
                  if (F === k || F === A) {
                    var z = _.stateNode.containerInfo;
                    if (QE(z, h))
                      return;
                  }
                  _ = _.return;
                }
              for (; D !== null; ) {
                var $ = vc(D);
                if ($ === null)
                  return;
                var Q = $.tag;
                if (Q === P || Q === K) {
                  g = d = $;
                  continue e;
                }
                D = D.parentNode;
              }
            }
            g = g.return;
          }
        }
      }
      Dv(function() {
        return mD(e, t, a, d);
      });
    }
    function jp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function yD(e, t, a, i, u, d) {
      for (var h = t !== null ? t + "Capture" : null, g = i ? h : t, C = [], D = e, _ = null; D !== null; ) {
        var F = D, z = F.stateNode, $ = F.tag;
        if ($ === P && z !== null && (_ = z, g !== null)) {
          var Q = zo(D, g);
          Q != null && C.push(jp(D, Q, _));
        }
        if (u)
          break;
        D = D.return;
      }
      return C;
    }
    function Cm(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var d = u, h = d.stateNode, g = d.tag;
        if (g === P && h !== null) {
          var C = h, D = zo(u, a);
          D != null && i.unshift(jp(u, D, C));
          var _ = zo(u, t);
          _ != null && i.push(jp(u, _, C));
        }
        u = u.return;
      }
      return i;
    }
    function qf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== P);
      return e || null;
    }
    function gD(e, t) {
      for (var a = e, i = t, u = 0, d = a; d; d = qf(d))
        u++;
      for (var h = 0, g = i; g; g = qf(g))
        h++;
      for (; u - h > 0; )
        a = qf(a), u--;
      for (; h - u > 0; )
        i = qf(i), h--;
      for (var C = u; C--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = qf(a), i = qf(i);
      }
      return null;
    }
    function KE(e, t, a, i, u) {
      for (var d = t._reactName, h = [], g = a; g !== null && g !== i; ) {
        var C = g, D = C.alternate, _ = C.stateNode, F = C.tag;
        if (D !== null && D === i)
          break;
        if (F === P && _ !== null) {
          var z = _;
          if (u) {
            var $ = zo(g, d);
            $ != null && h.unshift(jp(g, $, z));
          } else if (!u) {
            var Q = zo(g, d);
            Q != null && h.push(jp(g, Q, z));
          }
        }
        g = g.return;
      }
      h.length !== 0 && e.push({
        event: t,
        listeners: h
      });
    }
    function SD(e, t, a, i, u) {
      var d = i && u ? gD(i, u) : null;
      i !== null && KE(e, t, i, d, !1), u !== null && a !== null && KE(e, a, u, d, !0);
    }
    function CD(e, t) {
      return e + "__bubble";
    }
    var $a = !1, Fp = "dangerouslySetInnerHTML", Em = "suppressContentEditableWarning", Wu = "suppressHydrationWarning", qE = "autoFocus", pc = "children", hc = "style", xm = "__html", Xg, Tm, Hp, XE, Rm, ZE, JE;
    Xg = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Tm = function(e, t) {
      $d(e, t), $c(e, t), Rv(e, t, {
        registrationNameDependencies: dt,
        possibleRegistrationNames: gt
      });
    }, ZE = Kt && !document.documentMode, Hp = function(e, t, a) {
      if (!$a) {
        var i = bm(a), u = bm(t);
        u !== i && ($a = !0, m("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, XE = function(e) {
      if (!$a) {
        $a = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), m("Extra attributes from the server: %s", t);
      }
    }, Rm = function(e, t) {
      t === !1 ? m("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : m("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, JE = function(e, t) {
      var a = e.namespaceURI === to ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var ED = /\r\n?/g, xD = /\u0000|\uFFFD/g;
    function bm(e) {
      er(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(ED, `
`).replace(xD, "");
    }
    function wm(e, t, a, i) {
      var u = bm(t), d = bm(e);
      if (d !== u && (i && ($a || ($a = !0, m('Text content did not match. Server: "%s" Client: "%s"', d, u))), a && De))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function ex(e) {
      return e.nodeType === ro ? e : e.ownerDocument;
    }
    function TD() {
    }
    function Dm(e) {
      e.onclick = TD;
    }
    function RD(e, t, a, i, u) {
      for (var d in i)
        if (i.hasOwnProperty(d)) {
          var h = i[d];
          if (d === hc)
            h && Object.freeze(h), gv(t, h);
          else if (d === Fp) {
            var g = h ? h[xm] : void 0;
            g != null && ov(t, g);
          } else if (d === pc)
            if (typeof h == "string") {
              var C = e !== "textarea" || h !== "";
              C && Tu(t, h);
            } else typeof h == "number" && Tu(t, "" + h);
          else d === Em || d === Wu || d === qE || (dt.hasOwnProperty(d) ? h != null && (typeof h != "function" && Rm(d, h), d === "onScroll" && Tn("scroll", t)) : h != null && Lr(t, d, h, u));
        }
    }
    function bD(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var d = t[u], h = t[u + 1];
        d === hc ? gv(e, h) : d === Fp ? ov(e, h) : d === pc ? Tu(e, h) : Lr(e, d, h, i);
      }
    }
    function wD(e, t, a, i) {
      var u, d = ex(a), h, g = i;
      if (g === to && (g = zd(e)), g === to) {
        if (u = Uo(e, t), !u && e !== e.toLowerCase() && m("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var C = d.createElement("div");
          C.innerHTML = "<script><\/script>";
          var D = C.firstChild;
          h = C.removeChild(D);
        } else if (typeof t.is == "string")
          h = d.createElement(e, {
            is: t.is
          });
        else if (h = d.createElement(e), e === "select") {
          var _ = h;
          t.multiple ? _.multiple = !0 : t.size && (_.size = t.size);
        }
      } else
        h = d.createElementNS(g, e);
      return g === to && !u && Object.prototype.toString.call(h) === "[object HTMLUnknownElement]" && !Rr.call(Xg, e) && (Xg[e] = !0, m("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), h;
    }
    function DD(e, t) {
      return ex(t).createTextNode(e);
    }
    function kD(e, t, a, i) {
      var u = Uo(t, a);
      Tm(t, a);
      var d;
      switch (t) {
        case "dialog":
          Tn("cancel", e), Tn("close", e), d = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Tn("load", e), d = a;
          break;
        case "video":
        case "audio":
          for (var h = 0; h < Vp.length; h++)
            Tn(Vp[h], e);
          d = a;
          break;
        case "source":
          Tn("error", e), d = a;
          break;
        case "img":
        case "image":
        case "link":
          Tn("error", e), Tn("load", e), d = a;
          break;
        case "details":
          Tn("toggle", e), d = a;
          break;
        case "input":
          ui(e, a), d = xu(e, a), Tn("invalid", e);
          break;
        case "option":
          Vt(e, a), d = a;
          break;
        case "select":
          xl(e, a), d = Es(e, a), Tn("invalid", e);
          break;
        case "textarea":
          Pd(e, a), d = Nd(e, a), Tn("invalid", e);
          break;
        default:
          d = a;
      }
      switch (Ic(t, d), RD(t, e, i, d, u), t) {
        case "input":
          li(e), W(e, a, !1);
          break;
        case "textarea":
          li(e), av(e);
          break;
        case "option":
          sn(e, a);
          break;
        case "select":
          Ld(e, a);
          break;
        default:
          typeof d.onClick == "function" && Dm(e);
          break;
      }
    }
    function _D(e, t, a, i, u) {
      Tm(t, i);
      var d = null, h, g;
      switch (t) {
        case "input":
          h = xu(e, a), g = xu(e, i), d = [];
          break;
        case "select":
          h = Es(e, a), g = Es(e, i), d = [];
          break;
        case "textarea":
          h = Nd(e, a), g = Nd(e, i), d = [];
          break;
        default:
          h = a, g = i, typeof h.onClick != "function" && typeof g.onClick == "function" && Dm(e);
          break;
      }
      Ic(t, g);
      var C, D, _ = null;
      for (C in h)
        if (!(g.hasOwnProperty(C) || !h.hasOwnProperty(C) || h[C] == null))
          if (C === hc) {
            var F = h[C];
            for (D in F)
              F.hasOwnProperty(D) && (_ || (_ = {}), _[D] = "");
          } else C === Fp || C === pc || C === Em || C === Wu || C === qE || (dt.hasOwnProperty(C) ? d || (d = []) : (d = d || []).push(C, null));
      for (C in g) {
        var z = g[C], $ = h != null ? h[C] : void 0;
        if (!(!g.hasOwnProperty(C) || z === $ || z == null && $ == null))
          if (C === hc)
            if (z && Object.freeze(z), $) {
              for (D in $)
                $.hasOwnProperty(D) && (!z || !z.hasOwnProperty(D)) && (_ || (_ = {}), _[D] = "");
              for (D in z)
                z.hasOwnProperty(D) && $[D] !== z[D] && (_ || (_ = {}), _[D] = z[D]);
            } else
              _ || (d || (d = []), d.push(C, _)), _ = z;
          else if (C === Fp) {
            var Q = z ? z[xm] : void 0, Z = $ ? $[xm] : void 0;
            Q != null && Z !== Q && (d = d || []).push(C, Q);
          } else C === pc ? (typeof z == "string" || typeof z == "number") && (d = d || []).push(C, "" + z) : C === Em || C === Wu || (dt.hasOwnProperty(C) ? (z != null && (typeof z != "function" && Rm(C, z), C === "onScroll" && Tn("scroll", e)), !d && $ !== z && (d = [])) : (d = d || []).push(C, z));
      }
      return _ && (Rg(_, g[hc]), (d = d || []).push(hc, _)), d;
    }
    function MD(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && E(e, u);
      var d = Uo(a, i), h = Uo(a, u);
      switch (bD(e, t, d, h), a) {
        case "input":
          L(e, u);
          break;
        case "textarea":
          rv(e, u);
          break;
        case "select":
          Fc(e, u);
          break;
      }
    }
    function OD(e) {
      {
        var t = e.toLowerCase();
        return ws.hasOwnProperty(t) && ws[t] || null;
      }
    }
    function LD(e, t, a, i, u, d, h) {
      var g, C;
      switch (g = Uo(t, a), Tm(t, a), t) {
        case "dialog":
          Tn("cancel", e), Tn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Tn("load", e);
          break;
        case "video":
        case "audio":
          for (var D = 0; D < Vp.length; D++)
            Tn(Vp[D], e);
          break;
        case "source":
          Tn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Tn("error", e), Tn("load", e);
          break;
        case "details":
          Tn("toggle", e);
          break;
        case "input":
          ui(e, a), Tn("invalid", e);
          break;
        case "option":
          Vt(e, a);
          break;
        case "select":
          xl(e, a), Tn("invalid", e);
          break;
        case "textarea":
          Pd(e, a), Tn("invalid", e);
          break;
      }
      Ic(t, a);
      {
        C = /* @__PURE__ */ new Set();
        for (var _ = e.attributes, F = 0; F < _.length; F++) {
          var z = _[F].name.toLowerCase();
          switch (z) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              C.add(_[F].name);
          }
        }
      }
      var $ = null;
      for (var Q in a)
        if (a.hasOwnProperty(Q)) {
          var Z = a[Q];
          if (Q === pc)
            typeof Z == "string" ? e.textContent !== Z && (a[Wu] !== !0 && wm(e.textContent, Z, d, h), $ = [pc, Z]) : typeof Z == "number" && e.textContent !== "" + Z && (a[Wu] !== !0 && wm(e.textContent, Z, d, h), $ = [pc, "" + Z]);
          else if (dt.hasOwnProperty(Q))
            Z != null && (typeof Z != "function" && Rm(Q, Z), Q === "onScroll" && Tn("scroll", e));
          else if (h && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof g == "boolean") {
            var be = void 0, qe = ln(Q);
            if (a[Wu] !== !0) {
              if (!(Q === Em || Q === Wu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              Q === "value" || Q === "checked" || Q === "selected")) {
                if (Q === Fp) {
                  var Ye = e.innerHTML, Nt = Z ? Z[xm] : void 0;
                  if (Nt != null) {
                    var _t = JE(e, Nt);
                    _t !== Ye && Hp(Q, Ye, _t);
                  }
                } else if (Q === hc) {
                  if (C.delete(Q), ZE) {
                    var B = xg(Z);
                    be = e.getAttribute("style"), B !== be && Hp(Q, be, B);
                  }
                } else if (g && !V)
                  C.delete(Q.toLowerCase()), be = vl(e, Q, Z), Z !== be && Hp(Q, be, Z);
                else if (!gn(Q, qe, g) && !tr(Q, Z, qe, g)) {
                  var J = !1;
                  if (qe !== null)
                    C.delete(qe.attributeName), be = Do(e, Q, Z, qe);
                  else {
                    var I = i;
                    if (I === to && (I = zd(t)), I === to)
                      C.delete(Q.toLowerCase());
                    else {
                      var fe = OD(Q);
                      fe !== null && fe !== Q && (J = !0, C.delete(fe)), C.delete(Q);
                    }
                    be = vl(e, Q, Z);
                  }
                  var Me = V;
                  !Me && Z !== be && !J && Hp(Q, be, Z);
                }
              }
            }
          }
        }
      switch (h && // $FlowFixMe - Should be inferred as not undefined.
      C.size > 0 && a[Wu] !== !0 && XE(C), t) {
        case "input":
          li(e), W(e, a, !0);
          break;
        case "textarea":
          li(e), av(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Dm(e);
          break;
      }
      return $;
    }
    function AD(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Zg(e, t) {
      {
        if ($a)
          return;
        $a = !0, m("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Jg(e, t) {
      {
        if ($a)
          return;
        $a = !0, m('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function eS(e, t, a) {
      {
        if ($a)
          return;
        $a = !0, m("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function tS(e, t) {
      {
        if (t === "" || $a)
          return;
        $a = !0, m('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function ND(e, t, a) {
      switch (t) {
        case "input":
          X(e, a);
          return;
        case "textarea":
          gg(e, a);
          return;
        case "select":
          Ad(e, a);
          return;
      }
    }
    var Bp = function() {
    }, Ip = function() {
    };
    {
      var PD = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], tx = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], UD = tx.concat(["button"]), VD = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], nx = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      Ip = function(e, t) {
        var a = Ct({}, e || nx), i = {
          tag: t
        };
        return tx.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), UD.indexOf(t) !== -1 && (a.pTagInButtonScope = null), PD.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var zD = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return VD.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, jD = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, rx = {};
      Bp = function(e, t, a) {
        a = a || nx;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && m("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var d = zD(e, u) ? null : i, h = d ? null : jD(e, a), g = d || h;
        if (g) {
          var C = g.tag, D = !!d + "|" + e + "|" + C;
          if (!rx[D]) {
            rx[D] = !0;
            var _ = e, F = "";
            if (e === "#text" ? /\S/.test(t) ? _ = "Text nodes" : (_ = "Whitespace text nodes", F = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : _ = "<" + e + ">", d) {
              var z = "";
              C === "table" && e === "tr" && (z += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), m("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", _, C, F, z);
            } else
              m("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", _, C);
          }
        }
      };
    }
    var km = "suppressHydrationWarning", _m = "$", Mm = "/$", Yp = "$?", $p = "$!", FD = "style", nS = null, rS = null;
    function HD(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case ro:
        case Fd: {
          t = i === ro ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : jd(null, "");
          break;
        }
        default: {
          var d = i === Un ? e.parentNode : e, h = d.namespaceURI || null;
          t = d.tagName, a = jd(h, t);
          break;
        }
      }
      {
        var g = t.toLowerCase(), C = Ip(null, g);
        return {
          namespace: a,
          ancestorInfo: C
        };
      }
    }
    function BD(e, t, a) {
      {
        var i = e, u = jd(i.namespace, t), d = Ip(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: d
        };
      }
    }
    function RU(e) {
      return e;
    }
    function ID(e) {
      nS = Bn(), rS = rD();
      var t = null;
      return Zn(!1), t;
    }
    function YD(e) {
      aD(rS), Zn(nS), nS = null, rS = null;
    }
    function $D(e, t, a, i, u) {
      var d;
      {
        var h = i;
        if (Bp(e, null, h.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var g = "" + t.children, C = Ip(h.ancestorInfo, e);
          Bp(null, g, C);
        }
        d = h.namespace;
      }
      var D = wD(e, t, a, d);
      return Qp(u, D), fS(D, t), D;
    }
    function WD(e, t) {
      e.appendChild(t);
    }
    function GD(e, t, a, i, u) {
      switch (kD(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function QD(e, t, a, i, u, d) {
      {
        var h = d;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var g = "" + i.children, C = Ip(h.ancestorInfo, t);
          Bp(null, g, C);
        }
      }
      return _D(e, t, a, i);
    }
    function aS(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function KD(e, t, a, i) {
      {
        var u = a;
        Bp(null, e, u.ancestorInfo);
      }
      var d = DD(e, t);
      return Qp(i, d), d;
    }
    function qD() {
      var e = window.event;
      return e === void 0 ? Ha : Vf(e.type);
    }
    var iS = typeof setTimeout == "function" ? setTimeout : void 0, XD = typeof clearTimeout == "function" ? clearTimeout : void 0, oS = -1, ax = typeof Promise == "function" ? Promise : void 0, ZD = typeof queueMicrotask == "function" ? queueMicrotask : typeof ax < "u" ? function(e) {
      return ax.resolve(null).then(e).catch(JD);
    } : iS;
    function JD(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function ek(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function tk(e, t, a, i, u, d) {
      MD(e, t, a, i, u), fS(e, u);
    }
    function ix(e) {
      Tu(e, "");
    }
    function nk(e, t, a) {
      e.nodeValue = a;
    }
    function rk(e, t) {
      e.appendChild(t);
    }
    function ak(e, t) {
      var a;
      e.nodeType === Un ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Dm(a);
    }
    function ik(e, t, a) {
      e.insertBefore(t, a);
    }
    function ok(e, t, a) {
      e.nodeType === Un ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function lk(e, t) {
      e.removeChild(t);
    }
    function uk(e, t) {
      e.nodeType === Un ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function lS(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Un) {
          var d = u.data;
          if (d === Mm)
            if (i === 0) {
              e.removeChild(u), Il(t);
              return;
            } else
              i--;
          else (d === _m || d === Yp || d === $p) && i++;
        }
        a = u;
      } while (a);
      Il(t);
    }
    function sk(e, t) {
      e.nodeType === Un ? lS(e.parentNode, t) : e.nodeType === Zr && lS(e, t), Il(e);
    }
    function ck(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function fk(e) {
      e.nodeValue = "";
    }
    function dk(e, t) {
      e = e;
      var a = t[FD], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = Bc("display", i);
    }
    function pk(e, t) {
      e.nodeValue = t;
    }
    function hk(e) {
      e.nodeType === Zr ? e.textContent = "" : e.nodeType === ro && e.documentElement && e.removeChild(e.documentElement);
    }
    function vk(e, t, a) {
      return e.nodeType !== Zr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function mk(e, t) {
      return t === "" || e.nodeType !== no ? null : e;
    }
    function yk(e) {
      return e.nodeType !== Un ? null : e;
    }
    function ox(e) {
      return e.data === Yp;
    }
    function uS(e) {
      return e.data === $p;
    }
    function gk(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Sk(e, t) {
      e._reactRetry = t;
    }
    function Om(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Zr || t === no)
          break;
        if (t === Un) {
          var a = e.data;
          if (a === _m || a === $p || a === Yp)
            break;
          if (a === Mm)
            return null;
        }
      }
      return e;
    }
    function Wp(e) {
      return Om(e.nextSibling);
    }
    function Ck(e) {
      return Om(e.firstChild);
    }
    function Ek(e) {
      return Om(e.firstChild);
    }
    function xk(e) {
      return Om(e.nextSibling);
    }
    function Tk(e, t, a, i, u, d, h) {
      Qp(d, e), fS(e, a);
      var g;
      {
        var C = u;
        g = C.namespace;
      }
      var D = (d.mode & bt) !== Ge;
      return LD(e, t, a, g, i, D, h);
    }
    function Rk(e, t, a, i) {
      return Qp(a, e), a.mode & bt, AD(e, t);
    }
    function bk(e, t) {
      Qp(t, e);
    }
    function wk(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Un) {
          var i = t.data;
          if (i === Mm) {
            if (a === 0)
              return Wp(t);
            a--;
          } else (i === _m || i === $p || i === Yp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function lx(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Un) {
          var i = t.data;
          if (i === _m || i === $p || i === Yp) {
            if (a === 0)
              return t;
            a--;
          } else i === Mm && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Dk(e) {
      Il(e);
    }
    function kk(e) {
      Il(e);
    }
    function _k(e) {
      return e !== "head" && e !== "body";
    }
    function Mk(e, t, a, i) {
      var u = !0;
      wm(t.nodeValue, a, i, u);
    }
    function Ok(e, t, a, i, u, d) {
      if (t[km] !== !0) {
        var h = !0;
        wm(i.nodeValue, u, d, h);
      }
    }
    function Lk(e, t) {
      t.nodeType === Zr ? Zg(e, t) : t.nodeType === Un || Jg(e, t);
    }
    function Ak(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Zr ? Zg(a, t) : t.nodeType === Un || Jg(a, t));
      }
    }
    function Nk(e, t, a, i, u) {
      (u || t[km] !== !0) && (i.nodeType === Zr ? Zg(a, i) : i.nodeType === Un || Jg(a, i));
    }
    function Pk(e, t, a) {
      eS(e, t);
    }
    function Uk(e, t) {
      tS(e, t);
    }
    function Vk(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && eS(i, t);
      }
    }
    function zk(e, t) {
      {
        var a = e.parentNode;
        a !== null && tS(a, t);
      }
    }
    function jk(e, t, a, i, u, d) {
      (d || t[km] !== !0) && eS(a, i);
    }
    function Fk(e, t, a, i, u) {
      (u || t[km] !== !0) && tS(a, i);
    }
    function Hk(e) {
      m("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function Bk(e) {
      zp(e);
    }
    var Xf = Math.random().toString(36).slice(2), Zf = "__reactFiber$" + Xf, sS = "__reactProps$" + Xf, Gp = "__reactContainer$" + Xf, cS = "__reactEvents$" + Xf, Ik = "__reactListeners$" + Xf, Yk = "__reactHandles$" + Xf;
    function $k(e) {
      delete e[Zf], delete e[sS], delete e[cS], delete e[Ik], delete e[Yk];
    }
    function Qp(e, t) {
      t[Zf] = e;
    }
    function Lm(e, t) {
      t[Gp] = e;
    }
    function ux(e) {
      e[Gp] = null;
    }
    function Kp(e) {
      return !!e[Gp];
    }
    function vc(e) {
      var t = e[Zf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Gp] || a[Zf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = lx(e); u !== null; ) {
              var d = u[Zf];
              if (d)
                return d;
              u = lx(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Gu(e) {
      var t = e[Zf] || e[Gp];
      return t && (t.tag === P || t.tag === K || t.tag === de || t.tag === k) ? t : null;
    }
    function Jf(e) {
      if (e.tag === P || e.tag === K)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Am(e) {
      return e[sS] || null;
    }
    function fS(e, t) {
      e[sS] = t;
    }
    function Wk(e) {
      var t = e[cS];
      return t === void 0 && (t = e[cS] = /* @__PURE__ */ new Set()), t;
    }
    var sx = {}, cx = f.ReactDebugCurrentFrame;
    function Nm(e) {
      if (e) {
        var t = e._owner, a = Zi(e.type, e._source, t ? t.type : null);
        cx.setExtraStackFrame(a);
      } else
        cx.setExtraStackFrame(null);
    }
    function vo(e, t, a, i, u) {
      {
        var d = Function.call.bind(Rr);
        for (var h in e)
          if (d(e, h)) {
            var g = void 0;
            try {
              if (typeof e[h] != "function") {
                var C = Error((i || "React class") + ": " + a + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw C.name = "Invariant Violation", C;
              }
              g = e[h](t, h, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (D) {
              g = D;
            }
            g && !(g instanceof Error) && (Nm(u), m("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, h, typeof g), Nm(null)), g instanceof Error && !(g.message in sx) && (sx[g.message] = !0, Nm(u), m("Failed %s type: %s", a, g.message), Nm(null));
          }
      }
    }
    var dS = [], Pm;
    Pm = [];
    var Kl = -1;
    function Qu(e) {
      return {
        current: e
      };
    }
    function sa(e, t) {
      if (Kl < 0) {
        m("Unexpected pop.");
        return;
      }
      t !== Pm[Kl] && m("Unexpected Fiber popped."), e.current = dS[Kl], dS[Kl] = null, Pm[Kl] = null, Kl--;
    }
    function ca(e, t, a) {
      Kl++, dS[Kl] = e.current, Pm[Kl] = a, e.current = t;
    }
    var pS;
    pS = {};
    var vi = {};
    Object.freeze(vi);
    var ql = Qu(vi), nl = Qu(!1), hS = vi;
    function ed(e, t, a) {
      return a && rl(t) ? hS : ql.current;
    }
    function fx(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function td(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return vi;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var d = {};
        for (var h in i)
          d[h] = t[h];
        {
          var g = lt(e) || "Unknown";
          vo(i, d, "context", g);
        }
        return u && fx(e, t, d), d;
      }
    }
    function Um() {
      return nl.current;
    }
    function rl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Vm(e) {
      sa(nl, e), sa(ql, e);
    }
    function vS(e) {
      sa(nl, e), sa(ql, e);
    }
    function dx(e, t, a) {
      {
        if (ql.current !== vi)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ca(ql, t, e), ca(nl, a, e);
      }
    }
    function px(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var d = lt(e) || "Unknown";
            pS[d] || (pS[d] = !0, m("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", d, d));
          }
          return a;
        }
        var h = i.getChildContext();
        for (var g in h)
          if (!(g in u))
            throw new Error((lt(e) || "Unknown") + '.getChildContext(): key "' + g + '" is not defined in childContextTypes.');
        {
          var C = lt(e) || "Unknown";
          vo(u, h, "child context", C);
        }
        return Ct({}, a, h);
      }
    }
    function zm(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || vi;
        return hS = ql.current, ca(ql, a, e), ca(nl, nl.current, e), !0;
      }
    }
    function hx(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = px(e, t, hS);
          i.__reactInternalMemoizedMergedChildContext = u, sa(nl, e), sa(ql, e), ca(ql, u, e), ca(nl, a, e);
        } else
          sa(nl, e), ca(nl, a, e);
      }
    }
    function Gk(e) {
      {
        if (!_l(e) || e.tag !== b)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case k:
              return t.stateNode.context;
            case b: {
              var a = t.type;
              if (rl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Ku = 0, jm = 1, Xl = null, mS = !1, yS = !1;
    function vx(e) {
      Xl === null ? Xl = [e] : Xl.push(e);
    }
    function Qk(e) {
      mS = !0, vx(e);
    }
    function mx() {
      mS && qu();
    }
    function qu() {
      if (!yS && Xl !== null) {
        yS = !0;
        var e = 0, t = Ia();
        try {
          var a = !0, i = Xl;
          for (Hn(Vr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Xl = null, mS = !1;
        } catch (d) {
          throw Xl !== null && (Xl = Xl.slice(e + 1)), Zd(Ns, qu), d;
        } finally {
          Hn(t), yS = !1;
        }
      }
      return null;
    }
    var nd = [], rd = 0, Fm = null, Hm = 0, Hi = [], Bi = 0, mc = null, Zl = 1, Jl = "";
    function Kk(e) {
      return gc(), (e.flags & Oi) !== We;
    }
    function qk(e) {
      return gc(), Hm;
    }
    function Xk() {
      var e = Jl, t = Zl, a = t & ~Zk(t);
      return a.toString(32) + e;
    }
    function yc(e, t) {
      gc(), nd[rd++] = Hm, nd[rd++] = Fm, Fm = e, Hm = t;
    }
    function yx(e, t, a) {
      gc(), Hi[Bi++] = Zl, Hi[Bi++] = Jl, Hi[Bi++] = mc, mc = e;
      var i = Zl, u = Jl, d = Bm(i) - 1, h = i & ~(1 << d), g = a + 1, C = Bm(t) + d;
      if (C > 30) {
        var D = d - d % 5, _ = (1 << D) - 1, F = (h & _).toString(32), z = h >> D, $ = d - D, Q = Bm(t) + $, Z = g << $, be = Z | z, qe = F + u;
        Zl = 1 << Q | be, Jl = qe;
      } else {
        var Ye = g << d, Nt = Ye | h, _t = u;
        Zl = 1 << C | Nt, Jl = _t;
      }
    }
    function gS(e) {
      gc();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        yc(e, a), yx(e, a, i);
      }
    }
    function Bm(e) {
      return 32 - jn(e);
    }
    function Zk(e) {
      return 1 << Bm(e) - 1;
    }
    function SS(e) {
      for (; e === Fm; )
        Fm = nd[--rd], nd[rd] = null, Hm = nd[--rd], nd[rd] = null;
      for (; e === mc; )
        mc = Hi[--Bi], Hi[Bi] = null, Jl = Hi[--Bi], Hi[Bi] = null, Zl = Hi[--Bi], Hi[Bi] = null;
    }
    function Jk() {
      return gc(), mc !== null ? {
        id: Zl,
        overflow: Jl
      } : null;
    }
    function e_(e, t) {
      gc(), Hi[Bi++] = Zl, Hi[Bi++] = Jl, Hi[Bi++] = mc, Zl = t.id, Jl = t.overflow, mc = e;
    }
    function gc() {
      Br() || m("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Hr = null, Ii = null, mo = !1, Sc = !1, Xu = null;
    function t_() {
      mo && m("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function gx() {
      Sc = !0;
    }
    function n_() {
      return Sc;
    }
    function r_(e) {
      var t = e.stateNode.containerInfo;
      return Ii = Ek(t), Hr = e, mo = !0, Xu = null, Sc = !1, !0;
    }
    function a_(e, t, a) {
      return Ii = xk(t), Hr = e, mo = !0, Xu = null, Sc = !1, a !== null && e_(e, a), !0;
    }
    function Sx(e, t) {
      switch (e.tag) {
        case k: {
          Lk(e.stateNode.containerInfo, t);
          break;
        }
        case P: {
          var a = (e.mode & bt) !== Ge;
          Nk(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case de: {
          var i = e.memoizedState;
          i.dehydrated !== null && Ak(i.dehydrated, t);
          break;
        }
      }
    }
    function Cx(e, t) {
      Sx(e, t);
      var a = uL();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Ua) : i.push(a);
    }
    function CS(e, t) {
      {
        if (Sc)
          return;
        switch (e.tag) {
          case k: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case P:
                var i = t.type;
                t.pendingProps, Pk(a, i);
                break;
              case K:
                var u = t.pendingProps;
                Uk(a, u);
                break;
            }
            break;
          }
          case P: {
            var d = e.type, h = e.memoizedProps, g = e.stateNode;
            switch (t.tag) {
              case P: {
                var C = t.type, D = t.pendingProps, _ = (e.mode & bt) !== Ge;
                jk(
                  d,
                  h,
                  g,
                  C,
                  D,
                  // TODO: Delete this argument when we remove the legacy root API.
                  _
                );
                break;
              }
              case K: {
                var F = t.pendingProps, z = (e.mode & bt) !== Ge;
                Fk(
                  d,
                  h,
                  g,
                  F,
                  // TODO: Delete this argument when we remove the legacy root API.
                  z
                );
                break;
              }
            }
            break;
          }
          case de: {
            var $ = e.memoizedState, Q = $.dehydrated;
            if (Q !== null) switch (t.tag) {
              case P:
                var Z = t.type;
                t.pendingProps, Vk(Q, Z);
                break;
              case K:
                var be = t.pendingProps;
                zk(Q, be);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function Ex(e, t) {
      t.flags = t.flags & ~ea | Cn, CS(e, t);
    }
    function xx(e, t) {
      switch (e.tag) {
        case P: {
          var a = e.type;
          e.pendingProps;
          var i = vk(t, a);
          return i !== null ? (e.stateNode = i, Hr = e, Ii = Ck(i), !0) : !1;
        }
        case K: {
          var u = e.pendingProps, d = mk(t, u);
          return d !== null ? (e.stateNode = d, Hr = e, Ii = null, !0) : !1;
        }
        case de: {
          var h = yk(t);
          if (h !== null) {
            var g = {
              dehydrated: h,
              treeContext: Jk(),
              retryLane: aa
            };
            e.memoizedState = g;
            var C = sL(h);
            return C.return = e, e.child = C, Hr = e, Ii = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ES(e) {
      return (e.mode & bt) !== Ge && (e.flags & $e) === We;
    }
    function xS(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function TS(e) {
      if (mo) {
        var t = Ii;
        if (!t) {
          ES(e) && (CS(Hr, e), xS()), Ex(Hr, e), mo = !1, Hr = e;
          return;
        }
        var a = t;
        if (!xx(e, t)) {
          ES(e) && (CS(Hr, e), xS()), t = Wp(a);
          var i = Hr;
          if (!t || !xx(e, t)) {
            Ex(Hr, e), mo = !1, Hr = e;
            return;
          }
          Cx(i, a);
        }
      }
    }
    function i_(e, t, a) {
      var i = e.stateNode, u = !Sc, d = Tk(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = d, d !== null;
    }
    function o_(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Rk(t, a, e);
      if (i) {
        var u = Hr;
        if (u !== null)
          switch (u.tag) {
            case k: {
              var d = u.stateNode.containerInfo, h = (u.mode & bt) !== Ge;
              Mk(
                d,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                h
              );
              break;
            }
            case P: {
              var g = u.type, C = u.memoizedProps, D = u.stateNode, _ = (u.mode & bt) !== Ge;
              Ok(
                g,
                C,
                D,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                _
              );
              break;
            }
          }
      }
      return i;
    }
    function l_(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      bk(a, e);
    }
    function u_(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return wk(a);
    }
    function Tx(e) {
      for (var t = e.return; t !== null && t.tag !== P && t.tag !== k && t.tag !== de; )
        t = t.return;
      Hr = t;
    }
    function Im(e) {
      if (e !== Hr)
        return !1;
      if (!mo)
        return Tx(e), mo = !0, !1;
      if (e.tag !== k && (e.tag !== P || _k(e.type) && !aS(e.type, e.memoizedProps))) {
        var t = Ii;
        if (t)
          if (ES(e))
            Rx(e), xS();
          else
            for (; t; )
              Cx(e, t), t = Wp(t);
      }
      return Tx(e), e.tag === de ? Ii = u_(e) : Ii = Hr ? Wp(e.stateNode) : null, !0;
    }
    function s_() {
      return mo && Ii !== null;
    }
    function Rx(e) {
      for (var t = Ii; t; )
        Sx(e, t), t = Wp(t);
    }
    function ad() {
      Hr = null, Ii = null, mo = !1, Sc = !1;
    }
    function bx() {
      Xu !== null && (gR(Xu), Xu = null);
    }
    function Br() {
      return mo;
    }
    function RS(e) {
      Xu === null ? Xu = [e] : Xu.push(e);
    }
    var c_ = f.ReactCurrentBatchConfig, f_ = null;
    function d_() {
      return c_.transition;
    }
    var yo = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var p_ = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & tn && (t = a), a = a.return;
        return t;
      }, Cc = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, qp = [], Xp = [], Zp = [], Jp = [], eh = [], th = [], Ec = /* @__PURE__ */ new Set();
      yo.recordUnsafeLifecycleWarnings = function(e, t) {
        Ec.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && qp.push(e), e.mode & tn && typeof t.UNSAFE_componentWillMount == "function" && Xp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Zp.push(e), e.mode & tn && typeof t.UNSAFE_componentWillReceiveProps == "function" && Jp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && eh.push(e), e.mode & tn && typeof t.UNSAFE_componentWillUpdate == "function" && th.push(e));
      }, yo.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        qp.length > 0 && (qp.forEach(function(z) {
          e.add(lt(z) || "Component"), Ec.add(z.type);
        }), qp = []);
        var t = /* @__PURE__ */ new Set();
        Xp.length > 0 && (Xp.forEach(function(z) {
          t.add(lt(z) || "Component"), Ec.add(z.type);
        }), Xp = []);
        var a = /* @__PURE__ */ new Set();
        Zp.length > 0 && (Zp.forEach(function(z) {
          a.add(lt(z) || "Component"), Ec.add(z.type);
        }), Zp = []);
        var i = /* @__PURE__ */ new Set();
        Jp.length > 0 && (Jp.forEach(function(z) {
          i.add(lt(z) || "Component"), Ec.add(z.type);
        }), Jp = []);
        var u = /* @__PURE__ */ new Set();
        eh.length > 0 && (eh.forEach(function(z) {
          u.add(lt(z) || "Component"), Ec.add(z.type);
        }), eh = []);
        var d = /* @__PURE__ */ new Set();
        if (th.length > 0 && (th.forEach(function(z) {
          d.add(lt(z) || "Component"), Ec.add(z.type);
        }), th = []), t.size > 0) {
          var h = Cc(t);
          m(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, h);
        }
        if (i.size > 0) {
          var g = Cc(i);
          m(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, g);
        }
        if (d.size > 0) {
          var C = Cc(d);
          m(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, C);
        }
        if (e.size > 0) {
          var D = Cc(e);
          R(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, D);
        }
        if (a.size > 0) {
          var _ = Cc(a);
          R(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, _);
        }
        if (u.size > 0) {
          var F = Cc(u);
          R(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, F);
        }
      };
      var Ym = /* @__PURE__ */ new Map(), wx = /* @__PURE__ */ new Set();
      yo.recordLegacyContextWarning = function(e, t) {
        var a = p_(e);
        if (a === null) {
          m("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!wx.has(e.type)) {
          var i = Ym.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Ym.set(a, i)), i.push(e));
        }
      }, yo.flushLegacyContextWarning = function() {
        Ym.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(d) {
              i.add(lt(d) || "Component"), wx.add(d.type);
            });
            var u = Cc(i);
            try {
              Zt(a), m(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              pn();
            }
          }
        });
      }, yo.discardPendingWarnings = function() {
        qp = [], Xp = [], Zp = [], Jp = [], eh = [], th = [], Ym = /* @__PURE__ */ new Map();
      };
    }
    var bS, wS, DS, kS, _S, Dx = function(e, t) {
    };
    bS = !1, wS = !1, DS = {}, kS = {}, _S = {}, Dx = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = lt(t) || "Component";
        kS[a] || (kS[a] = !0, m('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function h_(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function nh(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & tn || te) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== b) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !h_(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = lt(e) || "Component";
          DS[u] || (m('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), DS[u] = !0);
        }
        if (a._owner) {
          var d = a._owner, h;
          if (d) {
            var g = d;
            if (g.tag !== b)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            h = g.stateNode;
          }
          if (!h)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var C = h;
          Si(i, "ref");
          var D = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === D)
            return t.ref;
          var _ = function(F) {
            var z = C.refs;
            F === null ? delete z[D] : z[D] = F;
          };
          return _._stringRef = D, _;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function $m(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Wm(e) {
      {
        var t = lt(e) || "Component";
        if (_S[t])
          return;
        _S[t] = !0, m("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function kx(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function _x(e) {
      function t(B, J) {
        if (e) {
          var I = B.deletions;
          I === null ? (B.deletions = [J], B.flags |= Ua) : I.push(J);
        }
      }
      function a(B, J) {
        if (!e)
          return null;
        for (var I = J; I !== null; )
          t(B, I), I = I.sibling;
        return null;
      }
      function i(B, J) {
        for (var I = /* @__PURE__ */ new Map(), fe = J; fe !== null; )
          fe.key !== null ? I.set(fe.key, fe) : I.set(fe.index, fe), fe = fe.sibling;
        return I;
      }
      function u(B, J) {
        var I = Mc(B, J);
        return I.index = 0, I.sibling = null, I;
      }
      function d(B, J, I) {
        if (B.index = I, !e)
          return B.flags |= Oi, J;
        var fe = B.alternate;
        if (fe !== null) {
          var Me = fe.index;
          return Me < J ? (B.flags |= Cn, J) : Me;
        } else
          return B.flags |= Cn, J;
      }
      function h(B) {
        return e && B.alternate === null && (B.flags |= Cn), B;
      }
      function g(B, J, I, fe) {
        if (J === null || J.tag !== K) {
          var Me = RC(I, B.mode, fe);
          return Me.return = B, Me;
        } else {
          var we = u(J, I);
          return we.return = B, we;
        }
      }
      function C(B, J, I, fe) {
        var Me = I.type;
        if (Me === Ei)
          return _(B, J, I.props.children, fe, I.key);
        if (J !== null && (J.elementType === Me || // Keep this check inline so it only runs on the false path:
        NR(J, I) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Me == "object" && Me !== null && Me.$$typeof === st && kx(Me) === J.type)) {
          var we = u(J, I.props);
          return we.ref = nh(B, J, I), we.return = B, we._debugSource = I._source, we._debugOwner = I._owner, we;
        }
        var rt = TC(I, B.mode, fe);
        return rt.ref = nh(B, J, I), rt.return = B, rt;
      }
      function D(B, J, I, fe) {
        if (J === null || J.tag !== A || J.stateNode.containerInfo !== I.containerInfo || J.stateNode.implementation !== I.implementation) {
          var Me = bC(I, B.mode, fe);
          return Me.return = B, Me;
        } else {
          var we = u(J, I.children || []);
          return we.return = B, we;
        }
      }
      function _(B, J, I, fe, Me) {
        if (J === null || J.tag !== ee) {
          var we = us(I, B.mode, fe, Me);
          return we.return = B, we;
        } else {
          var rt = u(J, I);
          return rt.return = B, rt;
        }
      }
      function F(B, J, I) {
        if (typeof J == "string" && J !== "" || typeof J == "number") {
          var fe = RC("" + J, B.mode, I);
          return fe.return = B, fe;
        }
        if (typeof J == "object" && J !== null) {
          switch (J.$$typeof) {
            case Ar: {
              var Me = TC(J, B.mode, I);
              return Me.ref = nh(B, null, J), Me.return = B, Me;
            }
            case sr: {
              var we = bC(J, B.mode, I);
              return we.return = B, we;
            }
            case st: {
              var rt = J._payload, pt = J._init;
              return F(B, pt(rt), I);
            }
          }
          if (xt(J) || mt(J)) {
            var rn = us(J, B.mode, I, null);
            return rn.return = B, rn;
          }
          $m(B, J);
        }
        return typeof J == "function" && Wm(B), null;
      }
      function z(B, J, I, fe) {
        var Me = J !== null ? J.key : null;
        if (typeof I == "string" && I !== "" || typeof I == "number")
          return Me !== null ? null : g(B, J, "" + I, fe);
        if (typeof I == "object" && I !== null) {
          switch (I.$$typeof) {
            case Ar:
              return I.key === Me ? C(B, J, I, fe) : null;
            case sr:
              return I.key === Me ? D(B, J, I, fe) : null;
            case st: {
              var we = I._payload, rt = I._init;
              return z(B, J, rt(we), fe);
            }
          }
          if (xt(I) || mt(I))
            return Me !== null ? null : _(B, J, I, fe, null);
          $m(B, I);
        }
        return typeof I == "function" && Wm(B), null;
      }
      function $(B, J, I, fe, Me) {
        if (typeof fe == "string" && fe !== "" || typeof fe == "number") {
          var we = B.get(I) || null;
          return g(J, we, "" + fe, Me);
        }
        if (typeof fe == "object" && fe !== null) {
          switch (fe.$$typeof) {
            case Ar: {
              var rt = B.get(fe.key === null ? I : fe.key) || null;
              return C(J, rt, fe, Me);
            }
            case sr: {
              var pt = B.get(fe.key === null ? I : fe.key) || null;
              return D(J, pt, fe, Me);
            }
            case st:
              var rn = fe._payload, Yt = fe._init;
              return $(B, J, I, Yt(rn), Me);
          }
          if (xt(fe) || mt(fe)) {
            var Jn = B.get(I) || null;
            return _(J, Jn, fe, Me, null);
          }
          $m(J, fe);
        }
        return typeof fe == "function" && Wm(J), null;
      }
      function Q(B, J, I) {
        {
          if (typeof B != "object" || B === null)
            return J;
          switch (B.$$typeof) {
            case Ar:
            case sr:
              Dx(B, I);
              var fe = B.key;
              if (typeof fe != "string")
                break;
              if (J === null) {
                J = /* @__PURE__ */ new Set(), J.add(fe);
                break;
              }
              if (!J.has(fe)) {
                J.add(fe);
                break;
              }
              m("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", fe);
              break;
            case st:
              var Me = B._payload, we = B._init;
              Q(we(Me), J, I);
              break;
          }
        }
        return J;
      }
      function Z(B, J, I, fe) {
        for (var Me = null, we = 0; we < I.length; we++) {
          var rt = I[we];
          Me = Q(rt, Me, B);
        }
        for (var pt = null, rn = null, Yt = J, Jn = 0, $t = 0, Yn = null; Yt !== null && $t < I.length; $t++) {
          Yt.index > $t ? (Yn = Yt, Yt = null) : Yn = Yt.sibling;
          var da = z(B, Yt, I[$t], fe);
          if (da === null) {
            Yt === null && (Yt = Yn);
            break;
          }
          e && Yt && da.alternate === null && t(B, Yt), Jn = d(da, Jn, $t), rn === null ? pt = da : rn.sibling = da, rn = da, Yt = Yn;
        }
        if ($t === I.length) {
          if (a(B, Yt), Br()) {
            var Kr = $t;
            yc(B, Kr);
          }
          return pt;
        }
        if (Yt === null) {
          for (; $t < I.length; $t++) {
            var yi = F(B, I[$t], fe);
            yi !== null && (Jn = d(yi, Jn, $t), rn === null ? pt = yi : rn.sibling = yi, rn = yi);
          }
          if (Br()) {
            var ka = $t;
            yc(B, ka);
          }
          return pt;
        }
        for (var _a = i(B, Yt); $t < I.length; $t++) {
          var pa = $(_a, B, $t, I[$t], fe);
          pa !== null && (e && pa.alternate !== null && _a.delete(pa.key === null ? $t : pa.key), Jn = d(pa, Jn, $t), rn === null ? pt = pa : rn.sibling = pa, rn = pa);
        }
        if (e && _a.forEach(function(Td) {
          return t(B, Td);
        }), Br()) {
          var ou = $t;
          yc(B, ou);
        }
        return pt;
      }
      function be(B, J, I, fe) {
        var Me = mt(I);
        if (typeof Me != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          I[Symbol.toStringTag] === "Generator" && (wS || m("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), wS = !0), I.entries === Me && (bS || m("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), bS = !0);
          var we = Me.call(I);
          if (we)
            for (var rt = null, pt = we.next(); !pt.done; pt = we.next()) {
              var rn = pt.value;
              rt = Q(rn, rt, B);
            }
        }
        var Yt = Me.call(I);
        if (Yt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Jn = null, $t = null, Yn = J, da = 0, Kr = 0, yi = null, ka = Yt.next(); Yn !== null && !ka.done; Kr++, ka = Yt.next()) {
          Yn.index > Kr ? (yi = Yn, Yn = null) : yi = Yn.sibling;
          var _a = z(B, Yn, ka.value, fe);
          if (_a === null) {
            Yn === null && (Yn = yi);
            break;
          }
          e && Yn && _a.alternate === null && t(B, Yn), da = d(_a, da, Kr), $t === null ? Jn = _a : $t.sibling = _a, $t = _a, Yn = yi;
        }
        if (ka.done) {
          if (a(B, Yn), Br()) {
            var pa = Kr;
            yc(B, pa);
          }
          return Jn;
        }
        if (Yn === null) {
          for (; !ka.done; Kr++, ka = Yt.next()) {
            var ou = F(B, ka.value, fe);
            ou !== null && (da = d(ou, da, Kr), $t === null ? Jn = ou : $t.sibling = ou, $t = ou);
          }
          if (Br()) {
            var Td = Kr;
            yc(B, Td);
          }
          return Jn;
        }
        for (var Nh = i(B, Yn); !ka.done; Kr++, ka = Yt.next()) {
          var fl = $(Nh, B, Kr, ka.value, fe);
          fl !== null && (e && fl.alternate !== null && Nh.delete(fl.key === null ? Kr : fl.key), da = d(fl, da, Kr), $t === null ? Jn = fl : $t.sibling = fl, $t = fl);
        }
        if (e && Nh.forEach(function(FL) {
          return t(B, FL);
        }), Br()) {
          var jL = Kr;
          yc(B, jL);
        }
        return Jn;
      }
      function qe(B, J, I, fe) {
        if (J !== null && J.tag === K) {
          a(B, J.sibling);
          var Me = u(J, I);
          return Me.return = B, Me;
        }
        a(B, J);
        var we = RC(I, B.mode, fe);
        return we.return = B, we;
      }
      function Ye(B, J, I, fe) {
        for (var Me = I.key, we = J; we !== null; ) {
          if (we.key === Me) {
            var rt = I.type;
            if (rt === Ei) {
              if (we.tag === ee) {
                a(B, we.sibling);
                var pt = u(we, I.props.children);
                return pt.return = B, pt._debugSource = I._source, pt._debugOwner = I._owner, pt;
              }
            } else if (we.elementType === rt || // Keep this check inline so it only runs on the false path:
            NR(we, I) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof rt == "object" && rt !== null && rt.$$typeof === st && kx(rt) === we.type) {
              a(B, we.sibling);
              var rn = u(we, I.props);
              return rn.ref = nh(B, we, I), rn.return = B, rn._debugSource = I._source, rn._debugOwner = I._owner, rn;
            }
            a(B, we);
            break;
          } else
            t(B, we);
          we = we.sibling;
        }
        if (I.type === Ei) {
          var Yt = us(I.props.children, B.mode, fe, I.key);
          return Yt.return = B, Yt;
        } else {
          var Jn = TC(I, B.mode, fe);
          return Jn.ref = nh(B, J, I), Jn.return = B, Jn;
        }
      }
      function Nt(B, J, I, fe) {
        for (var Me = I.key, we = J; we !== null; ) {
          if (we.key === Me)
            if (we.tag === A && we.stateNode.containerInfo === I.containerInfo && we.stateNode.implementation === I.implementation) {
              a(B, we.sibling);
              var rt = u(we, I.children || []);
              return rt.return = B, rt;
            } else {
              a(B, we);
              break;
            }
          else
            t(B, we);
          we = we.sibling;
        }
        var pt = bC(I, B.mode, fe);
        return pt.return = B, pt;
      }
      function _t(B, J, I, fe) {
        var Me = typeof I == "object" && I !== null && I.type === Ei && I.key === null;
        if (Me && (I = I.props.children), typeof I == "object" && I !== null) {
          switch (I.$$typeof) {
            case Ar:
              return h(Ye(B, J, I, fe));
            case sr:
              return h(Nt(B, J, I, fe));
            case st:
              var we = I._payload, rt = I._init;
              return _t(B, J, rt(we), fe);
          }
          if (xt(I))
            return Z(B, J, I, fe);
          if (mt(I))
            return be(B, J, I, fe);
          $m(B, I);
        }
        return typeof I == "string" && I !== "" || typeof I == "number" ? h(qe(B, J, "" + I, fe)) : (typeof I == "function" && Wm(B), a(B, J));
      }
      return _t;
    }
    var id = _x(!0), Mx = _x(!1);
    function v_(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = Mc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = Mc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function m_(e, t) {
      for (var a = e.child; a !== null; )
        rL(a, t), a = a.sibling;
    }
    var MS = Qu(null), OS;
    OS = {};
    var Gm = null, od = null, LS = null, Qm = !1;
    function Km() {
      Gm = null, od = null, LS = null, Qm = !1;
    }
    function Ox() {
      Qm = !0;
    }
    function Lx() {
      Qm = !1;
    }
    function Ax(e, t, a) {
      ca(MS, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== OS && m("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = OS;
    }
    function AS(e, t) {
      var a = MS.current;
      sa(MS, t), e._currentValue = a;
    }
    function NS(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Bl(i.childLanes, t) ? u !== null && !Bl(u.childLanes, t) && (u.childLanes = St(u.childLanes, t)) : (i.childLanes = St(i.childLanes, t), u !== null && (u.childLanes = St(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && m("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function y_(e, t, a) {
      g_(e, t, a);
    }
    function g_(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, d = i.dependencies;
        if (d !== null) {
          u = i.child;
          for (var h = d.firstContext; h !== null; ) {
            if (h.context === t) {
              if (i.tag === b) {
                var g = Qs(a), C = eu(an, g);
                C.tag = Xm;
                var D = i.updateQueue;
                if (D !== null) {
                  var _ = D.shared, F = _.pending;
                  F === null ? C.next = C : (C.next = F.next, F.next = C), _.pending = C;
                }
              }
              i.lanes = St(i.lanes, a);
              var z = i.alternate;
              z !== null && (z.lanes = St(z.lanes, a)), NS(i.return, a, e), d.lanes = St(d.lanes, a);
              break;
            }
            h = h.next;
          }
        } else if (i.tag === re)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === wt) {
          var $ = i.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = St($.lanes, a);
          var Q = $.alternate;
          Q !== null && (Q.lanes = St(Q.lanes, a)), NS($, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var Z = u.sibling;
            if (Z !== null) {
              Z.return = u.return, u = Z;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function ld(e, t) {
      Gm = e, od = null, LS = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ia(a.lanes, t) && yh(), a.firstContext = null);
      }
    }
    function or(e) {
      Qm && m("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (LS !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (od === null) {
          if (Gm === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          od = a, Gm.dependencies = {
            lanes: ie,
            firstContext: a
          };
        } else
          od = od.next = a;
      }
      return t;
    }
    var xc = null;
    function PS(e) {
      xc === null ? xc = [e] : xc.push(e);
    }
    function S_() {
      if (xc !== null) {
        for (var e = 0; e < xc.length; e++) {
          var t = xc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var d = u.next;
              u.next = i, a.next = d;
            }
            t.pending = a;
          }
        }
        xc = null;
      }
    }
    function Nx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, PS(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qm(e, i);
    }
    function C_(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, PS(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function E_(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, PS(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qm(e, i);
    }
    function Wa(e, t) {
      return qm(e, t);
    }
    var x_ = qm;
    function qm(e, t) {
      e.lanes = St(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = St(a.lanes, t)), a === null && (e.flags & (Cn | ea)) !== We && MR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = St(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = St(a.childLanes, t) : (u.flags & (Cn | ea)) !== We && MR(e), i = u, u = u.return;
      if (i.tag === k) {
        var d = i.stateNode;
        return d;
      } else
        return null;
    }
    var Px = 0, Ux = 1, Xm = 2, US = 3, Zm = !1, VS, Jm;
    VS = !1, Jm = null;
    function zS(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: ie
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function Vx(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function eu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: Px,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Zu(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Jm === u && !VS && (m("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), VS = !0), CO()) {
        var d = u.pending;
        return d === null ? t.next = t : (t.next = d.next, d.next = t), u.pending = t, x_(e, a);
      } else
        return E_(e, u, t, a);
    }
    function ey(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (vp(a)) {
          var d = u.lanes;
          d = yp(d, e.pendingLanes);
          var h = St(d, a);
          u.lanes = h, Af(e, h);
        }
      }
    }
    function jS(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var d = null, h = null, g = a.firstBaseUpdate;
          if (g !== null) {
            var C = g;
            do {
              var D = {
                eventTime: C.eventTime,
                lane: C.lane,
                tag: C.tag,
                payload: C.payload,
                callback: C.callback,
                next: null
              };
              h === null ? d = h = D : (h.next = D, h = D), C = C.next;
            } while (C !== null);
            h === null ? d = h = t : (h.next = t, h = t);
          } else
            d = h = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: d,
            lastBaseUpdate: h,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var _ = a.lastBaseUpdate;
      _ === null ? a.firstBaseUpdate = t : _.next = t, a.lastBaseUpdate = t;
    }
    function T_(e, t, a, i, u, d) {
      switch (a.tag) {
        case Ux: {
          var h = a.payload;
          if (typeof h == "function") {
            Ox();
            var g = h.call(d, i, u);
            {
              if (e.mode & tn) {
                En(!0);
                try {
                  h.call(d, i, u);
                } finally {
                  En(!1);
                }
              }
              Lx();
            }
            return g;
          }
          return h;
        }
        case US:
          e.flags = e.flags & ~nr | $e;
        case Px: {
          var C = a.payload, D;
          if (typeof C == "function") {
            Ox(), D = C.call(d, i, u);
            {
              if (e.mode & tn) {
                En(!0);
                try {
                  C.call(d, i, u);
                } finally {
                  En(!1);
                }
              }
              Lx();
            }
          } else
            D = C;
          return D == null ? i : Ct({}, i, D);
        }
        case Xm:
          return Zm = !0, i;
      }
      return i;
    }
    function ty(e, t, a, i) {
      var u = e.updateQueue;
      Zm = !1, Jm = u.shared;
      var d = u.firstBaseUpdate, h = u.lastBaseUpdate, g = u.shared.pending;
      if (g !== null) {
        u.shared.pending = null;
        var C = g, D = C.next;
        C.next = null, h === null ? d = D : h.next = D, h = C;
        var _ = e.alternate;
        if (_ !== null) {
          var F = _.updateQueue, z = F.lastBaseUpdate;
          z !== h && (z === null ? F.firstBaseUpdate = D : z.next = D, F.lastBaseUpdate = C);
        }
      }
      if (d !== null) {
        var $ = u.baseState, Q = ie, Z = null, be = null, qe = null, Ye = d;
        do {
          var Nt = Ye.lane, _t = Ye.eventTime;
          if (Bl(i, Nt)) {
            if (qe !== null) {
              var J = {
                eventTime: _t,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: zt,
                tag: Ye.tag,
                payload: Ye.payload,
                callback: Ye.callback,
                next: null
              };
              qe = qe.next = J;
            }
            $ = T_(e, u, Ye, $, t, a);
            var I = Ye.callback;
            if (I !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ye.lane !== zt) {
              e.flags |= cn;
              var fe = u.effects;
              fe === null ? u.effects = [Ye] : fe.push(Ye);
            }
          } else {
            var B = {
              eventTime: _t,
              lane: Nt,
              tag: Ye.tag,
              payload: Ye.payload,
              callback: Ye.callback,
              next: null
            };
            qe === null ? (be = qe = B, Z = $) : qe = qe.next = B, Q = St(Q, Nt);
          }
          if (Ye = Ye.next, Ye === null) {
            if (g = u.shared.pending, g === null)
              break;
            var Me = g, we = Me.next;
            Me.next = null, Ye = we, u.lastBaseUpdate = Me, u.shared.pending = null;
          }
        } while (!0);
        qe === null && (Z = $), u.baseState = Z, u.firstBaseUpdate = be, u.lastBaseUpdate = qe;
        var rt = u.shared.interleaved;
        if (rt !== null) {
          var pt = rt;
          do
            Q = St(Q, pt.lane), pt = pt.next;
          while (pt !== rt);
        } else d === null && (u.shared.lanes = ie);
        _h(Q), e.lanes = Q, e.memoizedState = $;
      }
      Jm = null;
    }
    function R_(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function zx() {
      Zm = !1;
    }
    function ny() {
      return Zm;
    }
    function jx(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var d = i[u], h = d.callback;
          h !== null && (d.callback = null, R_(h, a));
        }
    }
    var rh = {}, Ju = Qu(rh), ah = Qu(rh), ry = Qu(rh);
    function ay(e) {
      if (e === rh)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function Fx() {
      var e = ay(ry.current);
      return e;
    }
    function FS(e, t) {
      ca(ry, t, e), ca(ah, e, e), ca(Ju, rh, e);
      var a = HD(t);
      sa(Ju, e), ca(Ju, a, e);
    }
    function ud(e) {
      sa(Ju, e), sa(ah, e), sa(ry, e);
    }
    function HS() {
      var e = ay(Ju.current);
      return e;
    }
    function Hx(e) {
      ay(ry.current);
      var t = ay(Ju.current), a = BD(t, e.type);
      t !== a && (ca(ah, e, e), ca(Ju, a, e));
    }
    function BS(e) {
      ah.current === e && (sa(Ju, e), sa(ah, e));
    }
    var b_ = 0, Bx = 1, Ix = 1, ih = 2, go = Qu(b_);
    function IS(e, t) {
      return (e & t) !== 0;
    }
    function sd(e) {
      return e & Bx;
    }
    function YS(e, t) {
      return e & Bx | t;
    }
    function w_(e, t) {
      return e | t;
    }
    function es(e, t) {
      ca(go, t, e);
    }
    function cd(e) {
      sa(go, e);
    }
    function D_(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function iy(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === de) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || ox(i) || uS(i))
              return t;
          }
        } else if (t.tag === jt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & $e) !== We;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Ga = (
      /*   */
      0
    ), mr = (
      /* */
      1
    ), al = (
      /*  */
      2
    ), yr = (
      /*    */
      4
    ), Ir = (
      /*   */
      8
    ), $S = [];
    function WS() {
      for (var e = 0; e < $S.length; e++) {
        var t = $S[e];
        t._workInProgressVersionPrimary = null;
      }
      $S.length = 0;
    }
    function k_(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var _e = f.ReactCurrentDispatcher, oh = f.ReactCurrentBatchConfig, GS, fd;
    GS = /* @__PURE__ */ new Set();
    var Tc = ie, nn = null, gr = null, Sr = null, oy = !1, lh = !1, uh = 0, __ = 0, M_ = 25, ne = null, Yi = null, ts = -1, QS = !1;
    function Qt() {
      {
        var e = ne;
        Yi === null ? Yi = [e] : Yi.push(e);
      }
    }
    function Se() {
      {
        var e = ne;
        Yi !== null && (ts++, Yi[ts] !== e && O_(e));
      }
    }
    function dd(e) {
      e != null && !xt(e) && m("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", ne, typeof e);
    }
    function O_(e) {
      {
        var t = lt(nn);
        if (!GS.has(t) && (GS.add(t), Yi !== null)) {
          for (var a = "", i = 30, u = 0; u <= ts; u++) {
            for (var d = Yi[u], h = u === ts ? e : d, g = u + 1 + ". " + d; g.length < i; )
              g += " ";
            g += h + `
`, a += g;
          }
          m(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function fa() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function KS(e, t) {
      if (QS)
        return !1;
      if (t === null)
        return m("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", ne), !1;
      e.length !== t.length && m(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, ne, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!ue(e[a], t[a]))
          return !1;
      return !0;
    }
    function pd(e, t, a, i, u, d) {
      Tc = d, nn = t, Yi = e !== null ? e._debugHookTypes : null, ts = -1, QS = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = ie, e !== null && e.memoizedState !== null ? _e.current = fT : Yi !== null ? _e.current = cT : _e.current = sT;
      var h = a(i, u);
      if (lh) {
        var g = 0;
        do {
          if (lh = !1, uh = 0, g >= M_)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          g += 1, QS = !1, gr = null, Sr = null, t.updateQueue = null, ts = -1, _e.current = dT, h = a(i, u);
        } while (lh);
      }
      _e.current = Sy, t._debugHookTypes = Yi;
      var C = gr !== null && gr.next !== null;
      if (Tc = ie, nn = null, gr = null, Sr = null, ne = null, Yi = null, ts = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & bt) !== Ge && m("Internal React error: Expected static flag was missing. Please notify the React team."), oy = !1, C)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return h;
    }
    function hd() {
      var e = uh !== 0;
      return uh = 0, e;
    }
    function Yx(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Bt) !== Ge ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ks(e.lanes, a);
    }
    function $x() {
      if (_e.current = Sy, oy) {
        for (var e = nn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        oy = !1;
      }
      Tc = ie, nn = null, gr = null, Sr = null, Yi = null, ts = -1, ne = null, aT = !1, lh = !1, uh = 0;
    }
    function il() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Sr === null ? nn.memoizedState = Sr = e : Sr = Sr.next = e, Sr;
    }
    function $i() {
      var e;
      if (gr === null) {
        var t = nn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = gr.next;
      var a;
      if (Sr === null ? a = nn.memoizedState : a = Sr.next, a !== null)
        Sr = a, a = Sr.next, gr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        gr = e;
        var i = {
          memoizedState: gr.memoizedState,
          baseState: gr.baseState,
          baseQueue: gr.baseQueue,
          queue: gr.queue,
          next: null
        };
        Sr === null ? nn.memoizedState = Sr = i : Sr = Sr.next = i;
      }
      return Sr;
    }
    function Wx() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function qS(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function XS(e, t, a) {
      var i = il(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var d = {
        pending: null,
        interleaved: null,
        lanes: ie,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = d;
      var h = d.dispatch = P_.bind(null, nn, d);
      return [i.memoizedState, h];
    }
    function ZS(e, t, a) {
      var i = $i(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = gr, h = d.baseQueue, g = u.pending;
      if (g !== null) {
        if (h !== null) {
          var C = h.next, D = g.next;
          h.next = D, g.next = C;
        }
        d.baseQueue !== h && m("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), d.baseQueue = h = g, u.pending = null;
      }
      if (h !== null) {
        var _ = h.next, F = d.baseState, z = null, $ = null, Q = null, Z = _;
        do {
          var be = Z.lane;
          if (Bl(Tc, be)) {
            if (Q !== null) {
              var Ye = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: zt,
                action: Z.action,
                hasEagerState: Z.hasEagerState,
                eagerState: Z.eagerState,
                next: null
              };
              Q = Q.next = Ye;
            }
            if (Z.hasEagerState)
              F = Z.eagerState;
            else {
              var Nt = Z.action;
              F = e(F, Nt);
            }
          } else {
            var qe = {
              lane: be,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            };
            Q === null ? ($ = Q = qe, z = F) : Q = Q.next = qe, nn.lanes = St(nn.lanes, be), _h(be);
          }
          Z = Z.next;
        } while (Z !== null && Z !== _);
        Q === null ? z = F : Q.next = $, ue(F, i.memoizedState) || yh(), i.memoizedState = F, i.baseState = z, i.baseQueue = Q, u.lastRenderedState = F;
      }
      var _t = u.interleaved;
      if (_t !== null) {
        var B = _t;
        do {
          var J = B.lane;
          nn.lanes = St(nn.lanes, J), _h(J), B = B.next;
        } while (B !== _t);
      } else h === null && (u.lanes = ie);
      var I = u.dispatch;
      return [i.memoizedState, I];
    }
    function JS(e, t, a) {
      var i = $i(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = u.dispatch, h = u.pending, g = i.memoizedState;
      if (h !== null) {
        u.pending = null;
        var C = h.next, D = C;
        do {
          var _ = D.action;
          g = e(g, _), D = D.next;
        } while (D !== C);
        ue(g, i.memoizedState) || yh(), i.memoizedState = g, i.baseQueue === null && (i.baseState = g), u.lastRenderedState = g;
      }
      return [g, d];
    }
    function bU(e, t, a) {
    }
    function wU(e, t, a) {
    }
    function e0(e, t, a) {
      var i = nn, u = il(), d, h = Br();
      if (h) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        d = a(), fd || d !== a() && (m("The result of getServerSnapshot should be cached to avoid an infinite loop"), fd = !0);
      } else {
        if (d = t(), !fd) {
          var g = t();
          ue(d, g) || (m("The result of getSnapshot should be cached to avoid an infinite loop"), fd = !0);
        }
        var C = zy();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Of(C, Tc) || Gx(i, t, d);
      }
      u.memoizedState = d;
      var D = {
        value: d,
        getSnapshot: t
      };
      return u.queue = D, fy(Kx.bind(null, i, D, e), [e]), i.flags |= Jr, sh(mr | Ir, Qx.bind(null, i, D, d, t), void 0, null), d;
    }
    function ly(e, t, a) {
      var i = nn, u = $i(), d = t();
      if (!fd) {
        var h = t();
        ue(d, h) || (m("The result of getSnapshot should be cached to avoid an infinite loop"), fd = !0);
      }
      var g = u.memoizedState, C = !ue(g, d);
      C && (u.memoizedState = d, yh());
      var D = u.queue;
      if (fh(Kx.bind(null, i, D, e), [e]), D.getSnapshot !== t || C || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Sr !== null && Sr.memoizedState.tag & mr) {
        i.flags |= Jr, sh(mr | Ir, Qx.bind(null, i, D, d, t), void 0, null);
        var _ = zy();
        if (_ === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Of(_, Tc) || Gx(i, t, d);
      }
      return d;
    }
    function Gx(e, t, a) {
      e.flags |= Lu;
      var i = {
        getSnapshot: t,
        value: a
      }, u = nn.updateQueue;
      if (u === null)
        u = Wx(), nn.updateQueue = u, u.stores = [i];
      else {
        var d = u.stores;
        d === null ? u.stores = [i] : d.push(i);
      }
    }
    function Qx(e, t, a, i) {
      t.value = a, t.getSnapshot = i, qx(t) && Xx(e);
    }
    function Kx(e, t, a) {
      var i = function() {
        qx(t) && Xx(e);
      };
      return a(i);
    }
    function qx(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !ue(a, i);
      } catch {
        return !0;
      }
    }
    function Xx(e) {
      var t = Wa(e, nt);
      t !== null && Tr(t, e, nt, an);
    }
    function uy(e) {
      var t = il();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: ie,
        dispatch: null,
        lastRenderedReducer: qS,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = U_.bind(null, nn, a);
      return [t.memoizedState, i];
    }
    function t0(e) {
      return ZS(qS);
    }
    function n0(e) {
      return JS(qS);
    }
    function sh(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, d = nn.updateQueue;
      if (d === null)
        d = Wx(), nn.updateQueue = d, d.lastEffect = u.next = u;
      else {
        var h = d.lastEffect;
        if (h === null)
          d.lastEffect = u.next = u;
        else {
          var g = h.next;
          h.next = u, u.next = g, d.lastEffect = u;
        }
      }
      return u;
    }
    function r0(e) {
      var t = il();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function sy(e) {
      var t = $i();
      return t.memoizedState;
    }
    function ch(e, t, a, i) {
      var u = il(), d = i === void 0 ? null : i;
      nn.flags |= e, u.memoizedState = sh(mr | t, a, void 0, d);
    }
    function cy(e, t, a, i) {
      var u = $i(), d = i === void 0 ? null : i, h = void 0;
      if (gr !== null) {
        var g = gr.memoizedState;
        if (h = g.destroy, d !== null) {
          var C = g.deps;
          if (KS(d, C)) {
            u.memoizedState = sh(t, a, h, d);
            return;
          }
        }
      }
      nn.flags |= e, u.memoizedState = sh(mr | t, a, h, d);
    }
    function fy(e, t) {
      return (nn.mode & Bt) !== Ge ? ch(Li | Jr | rf, Ir, e, t) : ch(Jr | rf, Ir, e, t);
    }
    function fh(e, t) {
      return cy(Jr, Ir, e, t);
    }
    function a0(e, t) {
      return ch(Ot, al, e, t);
    }
    function dy(e, t) {
      return cy(Ot, al, e, t);
    }
    function i0(e, t) {
      var a = Ot;
      return a |= io, (nn.mode & Bt) !== Ge && (a |= Fo), ch(a, yr, e, t);
    }
    function py(e, t) {
      return cy(Ot, yr, e, t);
    }
    function Zx(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || m("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var d = e();
        return u.current = d, function() {
          u.current = null;
        };
      }
    }
    function o0(e, t, a) {
      typeof t != "function" && m("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Ot;
      return u |= io, (nn.mode & Bt) !== Ge && (u |= Fo), ch(u, yr, Zx.bind(null, t, e), i);
    }
    function hy(e, t, a) {
      typeof t != "function" && m("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return cy(Ot, yr, Zx.bind(null, t, e), i);
    }
    function L_(e, t) {
    }
    var vy = L_;
    function l0(e, t) {
      var a = il(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function my(e, t) {
      var a = $i(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var d = u[1];
        if (KS(i, d))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function u0(e, t) {
      var a = il(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function yy(e, t) {
      var a = $i(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var d = u[1];
        if (KS(i, d))
          return u[0];
      }
      var h = e();
      return a.memoizedState = [h, i], h;
    }
    function s0(e) {
      var t = il();
      return t.memoizedState = e, e;
    }
    function Jx(e) {
      var t = $i(), a = gr, i = a.memoizedState;
      return tT(t, i, e);
    }
    function eT(e) {
      var t = $i();
      if (gr === null)
        return t.memoizedState = e, e;
      var a = gr.memoizedState;
      return tT(t, a, e);
    }
    function tT(e, t, a) {
      var i = !pp(Tc);
      if (i) {
        if (!ue(a, t)) {
          var u = mp();
          nn.lanes = St(nn.lanes, u), _h(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, yh()), e.memoizedState = a, a;
    }
    function A_(e, t, a) {
      var i = Ia();
      Hn(Qv(i, Ui)), e(!0);
      var u = oh.transition;
      oh.transition = {};
      var d = oh.transition;
      oh.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Hn(i), oh.transition = u, u === null && d._updatedFibers) {
          var h = d._updatedFibers.size;
          h > 10 && R("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), d._updatedFibers.clear();
        }
      }
    }
    function c0() {
      var e = uy(!1), t = e[0], a = e[1], i = A_.bind(null, a), u = il();
      return u.memoizedState = i, [t, i];
    }
    function nT() {
      var e = t0(), t = e[0], a = $i(), i = a.memoizedState;
      return [t, i];
    }
    function rT() {
      var e = n0(), t = e[0], a = $i(), i = a.memoizedState;
      return [t, i];
    }
    var aT = !1;
    function N_() {
      return aT;
    }
    function f0() {
      var e = il(), t = zy(), a = t.identifierPrefix, i;
      if (Br()) {
        var u = Xk();
        i = ":" + a + "R" + u;
        var d = uh++;
        d > 0 && (i += "H" + d.toString(32)), i += ":";
      } else {
        var h = __++;
        i = ":" + a + "r" + h.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function gy() {
      var e = $i(), t = e.memoizedState;
      return t;
    }
    function P_(e, t, a) {
      typeof arguments[3] == "function" && m("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = os(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (iT(e))
        oT(t, u);
      else {
        var d = Nx(e, t, u, i);
        if (d !== null) {
          var h = Da();
          Tr(d, e, i, h), lT(d, t, i);
        }
      }
      uT(e, i);
    }
    function U_(e, t, a) {
      typeof arguments[3] == "function" && m("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = os(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (iT(e))
        oT(t, u);
      else {
        var d = e.alternate;
        if (e.lanes === ie && (d === null || d.lanes === ie)) {
          var h = t.lastRenderedReducer;
          if (h !== null) {
            var g;
            g = _e.current, _e.current = So;
            try {
              var C = t.lastRenderedState, D = h(C, a);
              if (u.hasEagerState = !0, u.eagerState = D, ue(D, C)) {
                C_(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              _e.current = g;
            }
          }
        }
        var _ = Nx(e, t, u, i);
        if (_ !== null) {
          var F = Da();
          Tr(_, e, i, F), lT(_, t, i);
        }
      }
      uT(e, i);
    }
    function iT(e) {
      var t = e.alternate;
      return e === nn || t !== null && t === nn;
    }
    function oT(e, t) {
      lh = oy = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function lT(e, t, a) {
      if (vp(a)) {
        var i = t.lanes;
        i = yp(i, e.pendingLanes);
        var u = St(i, a);
        t.lanes = u, Af(e, u);
      }
    }
    function uT(e, t, a) {
      js(e, t);
    }
    var Sy = {
      readContext: or,
      useCallback: fa,
      useContext: fa,
      useEffect: fa,
      useImperativeHandle: fa,
      useInsertionEffect: fa,
      useLayoutEffect: fa,
      useMemo: fa,
      useReducer: fa,
      useRef: fa,
      useState: fa,
      useDebugValue: fa,
      useDeferredValue: fa,
      useTransition: fa,
      useMutableSource: fa,
      useSyncExternalStore: fa,
      useId: fa,
      unstable_isNewReconciler: he
    }, sT = null, cT = null, fT = null, dT = null, ol = null, So = null, Cy = null;
    {
      var d0 = function() {
        m("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, ct = function() {
        m("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      sT = {
        readContext: function(e) {
          return or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", Qt(), dd(t), l0(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", Qt(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", Qt(), dd(t), fy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", Qt(), dd(a), o0(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", Qt(), dd(t), a0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", Qt(), dd(t), i0(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", Qt(), dd(t);
          var a = _e.current;
          _e.current = ol;
          try {
            return u0(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", Qt();
          var i = _e.current;
          _e.current = ol;
          try {
            return XS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", Qt(), r0(e);
        },
        useState: function(e) {
          ne = "useState", Qt();
          var t = _e.current;
          _e.current = ol;
          try {
            return uy(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", Qt(), s0(e);
        },
        useTransition: function() {
          return ne = "useTransition", Qt(), c0();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", Qt(), e0(e, t, a);
        },
        useId: function() {
          return ne = "useId", Qt(), f0();
        },
        unstable_isNewReconciler: he
      }, cT = {
        readContext: function(e) {
          return or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", Se(), l0(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", Se(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", Se(), fy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", Se(), o0(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", Se(), a0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", Se(), i0(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", Se();
          var a = _e.current;
          _e.current = ol;
          try {
            return u0(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", Se();
          var i = _e.current;
          _e.current = ol;
          try {
            return XS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", Se(), r0(e);
        },
        useState: function(e) {
          ne = "useState", Se();
          var t = _e.current;
          _e.current = ol;
          try {
            return uy(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", Se(), void 0;
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", Se(), s0(e);
        },
        useTransition: function() {
          return ne = "useTransition", Se(), c0();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", Se(), e0(e, t, a);
        },
        useId: function() {
          return ne = "useId", Se(), f0();
        },
        unstable_isNewReconciler: he
      }, fT = {
        readContext: function(e) {
          return or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", Se(), my(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", Se(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", Se(), fh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", Se(), hy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", Se(), dy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", Se(), py(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", Se();
          var a = _e.current;
          _e.current = So;
          try {
            return yy(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", Se();
          var i = _e.current;
          _e.current = So;
          try {
            return ZS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", Se(), sy();
        },
        useState: function(e) {
          ne = "useState", Se();
          var t = _e.current;
          _e.current = So;
          try {
            return t0(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", Se(), vy();
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", Se(), Jx(e);
        },
        useTransition: function() {
          return ne = "useTransition", Se(), nT();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", Se(), ly(e, t);
        },
        useId: function() {
          return ne = "useId", Se(), gy();
        },
        unstable_isNewReconciler: he
      }, dT = {
        readContext: function(e) {
          return or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", Se(), my(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", Se(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", Se(), fh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", Se(), hy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", Se(), dy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", Se(), py(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", Se();
          var a = _e.current;
          _e.current = Cy;
          try {
            return yy(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", Se();
          var i = _e.current;
          _e.current = Cy;
          try {
            return JS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", Se(), sy();
        },
        useState: function(e) {
          ne = "useState", Se();
          var t = _e.current;
          _e.current = Cy;
          try {
            return n0(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", Se(), vy();
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", Se(), eT(e);
        },
        useTransition: function() {
          return ne = "useTransition", Se(), rT();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", Se(), ly(e, t);
        },
        useId: function() {
          return ne = "useId", Se(), gy();
        },
        unstable_isNewReconciler: he
      }, ol = {
        readContext: function(e) {
          return d0(), or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", ct(), Qt(), l0(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", ct(), Qt(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", ct(), Qt(), fy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", ct(), Qt(), o0(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", ct(), Qt(), a0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", ct(), Qt(), i0(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", ct(), Qt();
          var a = _e.current;
          _e.current = ol;
          try {
            return u0(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", ct(), Qt();
          var i = _e.current;
          _e.current = ol;
          try {
            return XS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", ct(), Qt(), r0(e);
        },
        useState: function(e) {
          ne = "useState", ct(), Qt();
          var t = _e.current;
          _e.current = ol;
          try {
            return uy(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", ct(), Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", ct(), Qt(), s0(e);
        },
        useTransition: function() {
          return ne = "useTransition", ct(), Qt(), c0();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", ct(), Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", ct(), Qt(), e0(e, t, a);
        },
        useId: function() {
          return ne = "useId", ct(), Qt(), f0();
        },
        unstable_isNewReconciler: he
      }, So = {
        readContext: function(e) {
          return d0(), or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", ct(), Se(), my(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", ct(), Se(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", ct(), Se(), fh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", ct(), Se(), hy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", ct(), Se(), dy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", ct(), Se(), py(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", ct(), Se();
          var a = _e.current;
          _e.current = So;
          try {
            return yy(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", ct(), Se();
          var i = _e.current;
          _e.current = So;
          try {
            return ZS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", ct(), Se(), sy();
        },
        useState: function(e) {
          ne = "useState", ct(), Se();
          var t = _e.current;
          _e.current = So;
          try {
            return t0(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", ct(), Se(), vy();
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", ct(), Se(), Jx(e);
        },
        useTransition: function() {
          return ne = "useTransition", ct(), Se(), nT();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", ct(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", ct(), Se(), ly(e, t);
        },
        useId: function() {
          return ne = "useId", ct(), Se(), gy();
        },
        unstable_isNewReconciler: he
      }, Cy = {
        readContext: function(e) {
          return d0(), or(e);
        },
        useCallback: function(e, t) {
          return ne = "useCallback", ct(), Se(), my(e, t);
        },
        useContext: function(e) {
          return ne = "useContext", ct(), Se(), or(e);
        },
        useEffect: function(e, t) {
          return ne = "useEffect", ct(), Se(), fh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ne = "useImperativeHandle", ct(), Se(), hy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ne = "useInsertionEffect", ct(), Se(), dy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ne = "useLayoutEffect", ct(), Se(), py(e, t);
        },
        useMemo: function(e, t) {
          ne = "useMemo", ct(), Se();
          var a = _e.current;
          _e.current = So;
          try {
            return yy(e, t);
          } finally {
            _e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ne = "useReducer", ct(), Se();
          var i = _e.current;
          _e.current = So;
          try {
            return JS(e, t, a);
          } finally {
            _e.current = i;
          }
        },
        useRef: function(e) {
          return ne = "useRef", ct(), Se(), sy();
        },
        useState: function(e) {
          ne = "useState", ct(), Se();
          var t = _e.current;
          _e.current = So;
          try {
            return n0(e);
          } finally {
            _e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ne = "useDebugValue", ct(), Se(), vy();
        },
        useDeferredValue: function(e) {
          return ne = "useDeferredValue", ct(), Se(), eT(e);
        },
        useTransition: function() {
          return ne = "useTransition", ct(), Se(), rT();
        },
        useMutableSource: function(e, t, a) {
          return ne = "useMutableSource", ct(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ne = "useSyncExternalStore", ct(), Se(), ly(e, t);
        },
        useId: function() {
          return ne = "useId", ct(), Se(), gy();
        },
        unstable_isNewReconciler: he
      };
    }
    var ns = s.unstable_now, pT = 0, Ey = -1, dh = -1, xy = -1, p0 = !1, Ty = !1;
    function hT() {
      return p0;
    }
    function V_() {
      Ty = !0;
    }
    function z_() {
      p0 = !1, Ty = !1;
    }
    function j_() {
      p0 = Ty, Ty = !1;
    }
    function vT() {
      return pT;
    }
    function mT() {
      pT = ns();
    }
    function h0(e) {
      dh = ns(), e.actualStartTime < 0 && (e.actualStartTime = ns());
    }
    function yT(e) {
      dh = -1;
    }
    function Ry(e, t) {
      if (dh >= 0) {
        var a = ns() - dh;
        e.actualDuration += a, t && (e.selfBaseDuration = a), dh = -1;
      }
    }
    function ll(e) {
      if (Ey >= 0) {
        var t = ns() - Ey;
        Ey = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case k:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case pe:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function v0(e) {
      if (xy >= 0) {
        var t = ns() - xy;
        xy = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case k:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case pe:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ul() {
      Ey = ns();
    }
    function m0() {
      xy = ns();
    }
    function y0(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function Co(e, t) {
      if (e && e.defaultProps) {
        var a = Ct({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var g0 = {}, S0, C0, E0, x0, T0, gT, by, R0, b0, w0, ph;
    {
      S0 = /* @__PURE__ */ new Set(), C0 = /* @__PURE__ */ new Set(), E0 = /* @__PURE__ */ new Set(), x0 = /* @__PURE__ */ new Set(), R0 = /* @__PURE__ */ new Set(), T0 = /* @__PURE__ */ new Set(), b0 = /* @__PURE__ */ new Set(), w0 = /* @__PURE__ */ new Set(), ph = /* @__PURE__ */ new Set();
      var ST = /* @__PURE__ */ new Set();
      by = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          ST.has(a) || (ST.add(a), m("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, gT = function(e, t) {
        if (t === void 0) {
          var a = Ut(e) || "Component";
          T0.has(a) || (T0.add(a), m("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(g0, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(g0);
    }
    function D0(e, t, a, i) {
      var u = e.memoizedState, d = a(i, u);
      {
        if (e.mode & tn) {
          En(!0);
          try {
            d = a(i, u);
          } finally {
            En(!1);
          }
        }
        gT(t, d);
      }
      var h = d == null ? u : Ct({}, u, d);
      if (e.memoizedState = h, e.lanes === ie) {
        var g = e.updateQueue;
        g.baseState = h;
      }
    }
    var k0 = {
      isMounted: Lv,
      enqueueSetState: function(e, t, a) {
        var i = Ou(e), u = Da(), d = os(i), h = eu(u, d);
        h.payload = t, a != null && (by(a, "setState"), h.callback = a);
        var g = Zu(i, h, d);
        g !== null && (Tr(g, i, d, u), ey(g, i, d)), js(i, d);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = Ou(e), u = Da(), d = os(i), h = eu(u, d);
        h.tag = Ux, h.payload = t, a != null && (by(a, "replaceState"), h.callback = a);
        var g = Zu(i, h, d);
        g !== null && (Tr(g, i, d, u), ey(g, i, d)), js(i, d);
      },
      enqueueForceUpdate: function(e, t) {
        var a = Ou(e), i = Da(), u = os(a), d = eu(i, u);
        d.tag = Xm, t != null && (by(t, "forceUpdate"), d.callback = t);
        var h = Zu(a, d, u);
        h !== null && (Tr(h, a, u, i), ey(h, a, u)), ff(a, u);
      }
    };
    function CT(e, t, a, i, u, d, h) {
      var g = e.stateNode;
      if (typeof g.shouldComponentUpdate == "function") {
        var C = g.shouldComponentUpdate(i, d, h);
        {
          if (e.mode & tn) {
            En(!0);
            try {
              C = g.shouldComponentUpdate(i, d, h);
            } finally {
              En(!1);
            }
          }
          C === void 0 && m("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Ut(t) || "Component");
        }
        return C;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !ze(a, i) || !ze(u, d) : !0;
    }
    function F_(e, t, a) {
      var i = e.stateNode;
      {
        var u = Ut(t) || "Component", d = i.render;
        d || (t.prototype && typeof t.prototype.render == "function" ? m("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : m("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && m("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && m("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && m("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && m("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !ph.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & tn) === Ge && (ph.add(t), m(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !ph.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & tn) === Ge && (ph.add(t), m(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && m("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !b0.has(t) && (b0.add(t), m("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && m("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && m("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Ut(t) || "A pure component"), typeof i.componentDidUnmount == "function" && m("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && m("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && m("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && m("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var h = i.props !== a;
        i.props !== void 0 && h && m("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && m("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !E0.has(t) && (E0.add(t), m("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Ut(t))), typeof i.getDerivedStateFromProps == "function" && m("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && m("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && m("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var g = i.state;
        g && (typeof g != "object" || xt(g)) && m("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && m("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function ET(e, t) {
      t.updater = k0, e.stateNode = t, kl(t, e), t._reactInternalInstance = g0;
    }
    function xT(e, t, a) {
      var i = !1, u = vi, d = vi, h = t.contextType;
      if ("contextType" in t) {
        var g = (
          // Allow null for conditional declaration
          h === null || h !== void 0 && h.$$typeof === N && h._context === void 0
        );
        if (!g && !w0.has(t)) {
          w0.add(t);
          var C = "";
          h === void 0 ? C = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof h != "object" ? C = " However, it is set to a " + typeof h + "." : h.$$typeof === Ti ? C = " Did you accidentally pass the Context.Provider instead?" : h._context !== void 0 ? C = " Did you accidentally pass the Context.Consumer instead?" : C = " However, it is set to an object with keys {" + Object.keys(h).join(", ") + "}.", m("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Ut(t) || "Component", C);
        }
      }
      if (typeof h == "object" && h !== null)
        d = or(h);
      else {
        u = ed(e, t, !0);
        var D = t.contextTypes;
        i = D != null, d = i ? td(e, u) : vi;
      }
      var _ = new t(a, d);
      if (e.mode & tn) {
        En(!0);
        try {
          _ = new t(a, d);
        } finally {
          En(!1);
        }
      }
      var F = e.memoizedState = _.state !== null && _.state !== void 0 ? _.state : null;
      ET(e, _);
      {
        if (typeof t.getDerivedStateFromProps == "function" && F === null) {
          var z = Ut(t) || "Component";
          C0.has(z) || (C0.add(z), m("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", z, _.state === null ? "null" : "undefined", z));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof _.getSnapshotBeforeUpdate == "function") {
          var $ = null, Q = null, Z = null;
          if (typeof _.componentWillMount == "function" && _.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof _.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof _.componentWillReceiveProps == "function" && _.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? Q = "componentWillReceiveProps" : typeof _.UNSAFE_componentWillReceiveProps == "function" && (Q = "UNSAFE_componentWillReceiveProps"), typeof _.componentWillUpdate == "function" && _.componentWillUpdate.__suppressDeprecationWarning !== !0 ? Z = "componentWillUpdate" : typeof _.UNSAFE_componentWillUpdate == "function" && (Z = "UNSAFE_componentWillUpdate"), $ !== null || Q !== null || Z !== null) {
            var be = Ut(t) || "Component", qe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            x0.has(be) || (x0.add(be), m(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, be, qe, $ !== null ? `
  ` + $ : "", Q !== null ? `
  ` + Q : "", Z !== null ? `
  ` + Z : ""));
          }
        }
      }
      return i && fx(e, u, d), _;
    }
    function H_(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (m("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", lt(e) || "Component"), k0.enqueueReplaceState(t, t.state, null));
    }
    function TT(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var d = lt(e) || "Component";
          S0.has(d) || (S0.add(d), m("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", d));
        }
        k0.enqueueReplaceState(t, t.state, null);
      }
    }
    function _0(e, t, a, i) {
      F_(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, zS(e);
      var d = t.contextType;
      if (typeof d == "object" && d !== null)
        u.context = or(d);
      else {
        var h = ed(e, t, !0);
        u.context = td(e, h);
      }
      {
        if (u.state === a) {
          var g = Ut(t) || "Component";
          R0.has(g) || (R0.add(g), m("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", g));
        }
        e.mode & tn && yo.recordLegacyContextWarning(e, u), yo.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var C = t.getDerivedStateFromProps;
      if (typeof C == "function" && (D0(e, t, C, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (H_(e, u), ty(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var D = Ot;
        D |= io, (e.mode & Bt) !== Ge && (D |= Fo), e.flags |= D;
      }
    }
    function B_(e, t, a, i) {
      var u = e.stateNode, d = e.memoizedProps;
      u.props = d;
      var h = u.context, g = t.contextType, C = vi;
      if (typeof g == "object" && g !== null)
        C = or(g);
      else {
        var D = ed(e, t, !0);
        C = td(e, D);
      }
      var _ = t.getDerivedStateFromProps, F = typeof _ == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !F && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (d !== a || h !== C) && TT(e, u, a, C), zx();
      var z = e.memoizedState, $ = u.state = z;
      if (ty(e, a, u, i), $ = e.memoizedState, d === a && z === $ && !Um() && !ny()) {
        if (typeof u.componentDidMount == "function") {
          var Q = Ot;
          Q |= io, (e.mode & Bt) !== Ge && (Q |= Fo), e.flags |= Q;
        }
        return !1;
      }
      typeof _ == "function" && (D0(e, t, _, a), $ = e.memoizedState);
      var Z = ny() || CT(e, t, d, a, z, $, C);
      if (Z) {
        if (!F && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var be = Ot;
          be |= io, (e.mode & Bt) !== Ge && (be |= Fo), e.flags |= be;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var qe = Ot;
          qe |= io, (e.mode & Bt) !== Ge && (qe |= Fo), e.flags |= qe;
        }
        e.memoizedProps = a, e.memoizedState = $;
      }
      return u.props = a, u.state = $, u.context = C, Z;
    }
    function I_(e, t, a, i, u) {
      var d = t.stateNode;
      Vx(e, t);
      var h = t.memoizedProps, g = t.type === t.elementType ? h : Co(t.type, h);
      d.props = g;
      var C = t.pendingProps, D = d.context, _ = a.contextType, F = vi;
      if (typeof _ == "object" && _ !== null)
        F = or(_);
      else {
        var z = ed(t, a, !0);
        F = td(t, z);
      }
      var $ = a.getDerivedStateFromProps, Q = typeof $ == "function" || typeof d.getSnapshotBeforeUpdate == "function";
      !Q && (typeof d.UNSAFE_componentWillReceiveProps == "function" || typeof d.componentWillReceiveProps == "function") && (h !== C || D !== F) && TT(t, d, i, F), zx();
      var Z = t.memoizedState, be = d.state = Z;
      if (ty(t, i, d, u), be = t.memoizedState, h === C && Z === be && !Um() && !ny() && !Ne)
        return typeof d.componentDidUpdate == "function" && (h !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (h !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= qn), !1;
      typeof $ == "function" && (D0(t, a, $, i), be = t.memoizedState);
      var qe = ny() || CT(t, a, g, i, Z, be, F) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Ne;
      return qe ? (!Q && (typeof d.UNSAFE_componentWillUpdate == "function" || typeof d.componentWillUpdate == "function") && (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(i, be, F), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(i, be, F)), typeof d.componentDidUpdate == "function" && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= qn)) : (typeof d.componentDidUpdate == "function" && (h !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (h !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= qn), t.memoizedProps = i, t.memoizedState = be), d.props = i, d.state = be, d.context = F, qe;
    }
    function Rc(e, t) {
      return {
        value: e,
        source: t,
        stack: Ji(t),
        digest: null
      };
    }
    function M0(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function Y_(e, t) {
      return !0;
    }
    function O0(e, t) {
      try {
        var a = Y_(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, d = t.stack, h = d !== null ? d : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === b)
            return;
          console.error(i);
        }
        var g = u ? lt(u) : null, C = g ? "The above error occurred in the <" + g + "> component:" : "The above error occurred in one of your React components:", D;
        if (e.tag === k)
          D = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var _ = lt(e) || "Anonymous";
          D = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + _ + ".");
        }
        var F = C + `
` + h + `

` + ("" + D);
        console.error(F);
      } catch (z) {
        setTimeout(function() {
          throw z;
        });
      }
    }
    var $_ = typeof WeakMap == "function" ? WeakMap : Map;
    function RT(e, t, a) {
      var i = eu(an, a);
      i.tag = US, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        VO(u), O0(e, t);
      }, i;
    }
    function L0(e, t, a) {
      var i = eu(an, a);
      i.tag = US;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var d = t.value;
        i.payload = function() {
          return u(d);
        }, i.callback = function() {
          PR(e), O0(e, t);
        };
      }
      var h = e.stateNode;
      return h !== null && typeof h.componentDidCatch == "function" && (i.callback = function() {
        PR(e), O0(e, t), typeof u != "function" && PO(this);
        var C = t.value, D = t.stack;
        this.componentDidCatch(C, {
          componentStack: D !== null ? D : ""
        }), typeof u != "function" && (ia(e.lanes, nt) || m("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", lt(e) || "Unknown"));
      }), i;
    }
    function bT(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new $_(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var d = zO.bind(null, e, t, a);
        ra && Mh(e, a), t.then(d, d);
      }
    }
    function W_(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var d = /* @__PURE__ */ new Set();
        d.add(a), e.updateQueue = d;
      } else
        u.add(a);
    }
    function G_(e, t) {
      var a = e.tag;
      if ((e.mode & bt) === Ge && (a === T || a === q || a === Ee)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function wT(e) {
      var t = e;
      do {
        if (t.tag === de && D_(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function DT(e, t, a, i, u) {
      if ((e.mode & bt) === Ge) {
        if (e === t)
          e.flags |= nr;
        else {
          if (e.flags |= $e, a.flags |= nf, a.flags &= -52805, a.tag === b) {
            var d = a.alternate;
            if (d === null)
              a.tag = Be;
            else {
              var h = eu(an, nt);
              h.tag = Xm, Zu(a, h, nt);
            }
          }
          a.lanes = St(a.lanes, nt);
        }
        return e;
      }
      return e.flags |= nr, e.lanes = u, e;
    }
    function Q_(e, t, a, i, u) {
      if (a.flags |= As, ra && Mh(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var d = i;
        G_(a), Br() && a.mode & bt && gx();
        var h = wT(t);
        if (h !== null) {
          h.flags &= ~kr, DT(h, t, a, e, u), h.mode & bt && bT(e, d, u), W_(h, e, d);
          return;
        } else {
          if (!Fv(u)) {
            bT(e, d, u), fC();
            return;
          }
          var g = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = g;
        }
      } else if (Br() && a.mode & bt) {
        gx();
        var C = wT(t);
        if (C !== null) {
          (C.flags & nr) === We && (C.flags |= kr), DT(C, t, a, e, u), RS(Rc(i, a));
          return;
        }
      }
      i = Rc(i, a), DO(i);
      var D = t;
      do {
        switch (D.tag) {
          case k: {
            var _ = i;
            D.flags |= nr;
            var F = Qs(u);
            D.lanes = St(D.lanes, F);
            var z = RT(D, _, F);
            jS(D, z);
            return;
          }
          case b:
            var $ = i, Q = D.type, Z = D.stateNode;
            if ((D.flags & $e) === We && (typeof Q.getDerivedStateFromError == "function" || Z !== null && typeof Z.componentDidCatch == "function" && !wR(Z))) {
              D.flags |= nr;
              var be = Qs(u);
              D.lanes = St(D.lanes, be);
              var qe = L0(D, $, be);
              jS(D, qe);
              return;
            }
            break;
        }
        D = D.return;
      } while (D !== null);
    }
    function K_() {
      return null;
    }
    var hh = f.ReactCurrentOwner, Eo = !1, A0, vh, N0, P0, U0, bc, V0, wy, mh;
    A0 = {}, vh = {}, N0 = {}, P0 = {}, U0 = {}, bc = !1, V0 = {}, wy = {}, mh = {};
    function ba(e, t, a, i) {
      e === null ? t.child = Mx(t, null, a, i) : t.child = id(t, e.child, a, i);
    }
    function q_(e, t, a, i) {
      t.child = id(t, e.child, null, i), t.child = id(t, null, a, i);
    }
    function kT(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && vo(
          d,
          i,
          // Resolved props
          "prop",
          Ut(a)
        );
      }
      var h = a.render, g = t.ref, C, D;
      ld(t, u), Ea(t);
      {
        if (hh.current = t, Kn(!0), C = pd(e, t, h, i, g, u), D = hd(), t.mode & tn) {
          En(!0);
          try {
            C = pd(e, t, h, i, g, u), D = hd();
          } finally {
            En(!1);
          }
        }
        Kn(!1);
      }
      return xa(), e !== null && !Eo ? (Yx(e, t, u), tu(e, t, u)) : (Br() && D && gS(t), t.flags |= ci, ba(e, t, C, u), t.child);
    }
    function _T(e, t, a, i, u) {
      if (e === null) {
        var d = a.type;
        if (tL(d) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var h = d;
          return h = xd(d), t.tag = Ee, t.type = h, F0(t, d), MT(e, t, h, i, u);
        }
        {
          var g = d.propTypes;
          if (g && vo(
            g,
            i,
            // Resolved props
            "prop",
            Ut(d)
          ), a.defaultProps !== void 0) {
            var C = Ut(d) || "Unknown";
            mh[C] || (m("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", C), mh[C] = !0);
          }
        }
        var D = xC(a.type, null, i, t, t.mode, u);
        return D.ref = t.ref, D.return = t, t.child = D, D;
      }
      {
        var _ = a.type, F = _.propTypes;
        F && vo(
          F,
          i,
          // Resolved props
          "prop",
          Ut(_)
        );
      }
      var z = e.child, $ = W0(e, u);
      if (!$) {
        var Q = z.memoizedProps, Z = a.compare;
        if (Z = Z !== null ? Z : ze, Z(Q, i) && e.ref === t.ref)
          return tu(e, t, u);
      }
      t.flags |= ci;
      var be = Mc(z, i);
      return be.ref = t.ref, be.return = t, t.child = be, be;
    }
    function MT(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = t.elementType;
        if (d.$$typeof === st) {
          var h = d, g = h._payload, C = h._init;
          try {
            d = C(g);
          } catch {
            d = null;
          }
          var D = d && d.propTypes;
          D && vo(
            D,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Ut(d)
          );
        }
      }
      if (e !== null) {
        var _ = e.memoizedProps;
        if (ze(_, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (Eo = !1, t.pendingProps = i = _, W0(e, u))
            (e.flags & nf) !== We && (Eo = !0);
          else return t.lanes = e.lanes, tu(e, t, u);
      }
      return z0(e, t, a, i, u);
    }
    function OT(e, t, a) {
      var i = t.pendingProps, u = i.children, d = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ye)
        if ((t.mode & bt) === Ge) {
          var h = {
            baseLanes: ie,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = h, jy(t, a);
        } else if (ia(a, aa)) {
          var F = {
            baseLanes: ie,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = F;
          var z = d !== null ? d.baseLanes : a;
          jy(t, z);
        } else {
          var g = null, C;
          if (d !== null) {
            var D = d.baseLanes;
            C = St(D, a);
          } else
            C = a;
          t.lanes = t.childLanes = aa;
          var _ = {
            baseLanes: C,
            cachePool: g,
            transitions: null
          };
          return t.memoizedState = _, t.updateQueue = null, jy(t, C), null;
        }
      else {
        var $;
        d !== null ? ($ = St(d.baseLanes, a), t.memoizedState = null) : $ = a, jy(t, $);
      }
      return ba(e, t, u, a), t.child;
    }
    function X_(e, t, a) {
      var i = t.pendingProps;
      return ba(e, t, i, a), t.child;
    }
    function Z_(e, t, a) {
      var i = t.pendingProps.children;
      return ba(e, t, i, a), t.child;
    }
    function J_(e, t, a) {
      {
        t.flags |= Ot;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, d = u.children;
      return ba(e, t, d, a), t.child;
    }
    function LT(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Rn, t.flags |= Au);
    }
    function z0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && vo(
          d,
          i,
          // Resolved props
          "prop",
          Ut(a)
        );
      }
      var h;
      {
        var g = ed(t, a, !0);
        h = td(t, g);
      }
      var C, D;
      ld(t, u), Ea(t);
      {
        if (hh.current = t, Kn(!0), C = pd(e, t, a, i, h, u), D = hd(), t.mode & tn) {
          En(!0);
          try {
            C = pd(e, t, a, i, h, u), D = hd();
          } finally {
            En(!1);
          }
        }
        Kn(!1);
      }
      return xa(), e !== null && !Eo ? (Yx(e, t, u), tu(e, t, u)) : (Br() && D && gS(t), t.flags |= ci, ba(e, t, C, u), t.child);
    }
    function AT(e, t, a, i, u) {
      {
        switch (mL(t)) {
          case !1: {
            var d = t.stateNode, h = t.type, g = new h(t.memoizedProps, d.context), C = g.state;
            d.updater.enqueueSetState(d, C, null);
            break;
          }
          case !0: {
            t.flags |= $e, t.flags |= nr;
            var D = new Error("Simulated error coming from DevTools"), _ = Qs(u);
            t.lanes = St(t.lanes, _);
            var F = L0(t, Rc(D, t), _);
            jS(t, F);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var z = a.propTypes;
          z && vo(
            z,
            i,
            // Resolved props
            "prop",
            Ut(a)
          );
        }
      }
      var $;
      rl(a) ? ($ = !0, zm(t)) : $ = !1, ld(t, u);
      var Q = t.stateNode, Z;
      Q === null ? (ky(e, t), xT(t, a, i), _0(t, a, i, u), Z = !0) : e === null ? Z = B_(t, a, i, u) : Z = I_(e, t, a, i, u);
      var be = j0(e, t, a, Z, $, u);
      {
        var qe = t.stateNode;
        Z && qe.props !== i && (bc || m("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", lt(t) || "a component"), bc = !0);
      }
      return be;
    }
    function j0(e, t, a, i, u, d) {
      LT(e, t);
      var h = (t.flags & $e) !== We;
      if (!i && !h)
        return u && hx(t, a, !1), tu(e, t, d);
      var g = t.stateNode;
      hh.current = t;
      var C;
      if (h && typeof a.getDerivedStateFromError != "function")
        C = null, yT();
      else {
        Ea(t);
        {
          if (Kn(!0), C = g.render(), t.mode & tn) {
            En(!0);
            try {
              g.render();
            } finally {
              En(!1);
            }
          }
          Kn(!1);
        }
        xa();
      }
      return t.flags |= ci, e !== null && h ? q_(e, t, C, d) : ba(e, t, C, d), t.memoizedState = g.state, u && hx(t, a, !0), t.child;
    }
    function NT(e) {
      var t = e.stateNode;
      t.pendingContext ? dx(e, t.pendingContext, t.pendingContext !== t.context) : t.context && dx(e, t.context, !1), FS(e, t.containerInfo);
    }
    function eM(e, t, a) {
      if (NT(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, d = u.element;
      Vx(e, t), ty(t, i, null, a);
      var h = t.memoizedState;
      t.stateNode;
      var g = h.element;
      if (u.isDehydrated) {
        var C = {
          element: g,
          isDehydrated: !1,
          cache: h.cache,
          pendingSuspenseBoundaries: h.pendingSuspenseBoundaries,
          transitions: h.transitions
        }, D = t.updateQueue;
        if (D.baseState = C, t.memoizedState = C, t.flags & kr) {
          var _ = Rc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return PT(e, t, g, a, _);
        } else if (g !== d) {
          var F = Rc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return PT(e, t, g, a, F);
        } else {
          r_(t);
          var z = Mx(t, null, g, a);
          t.child = z;
          for (var $ = z; $; )
            $.flags = $.flags & ~Cn | ea, $ = $.sibling;
        }
      } else {
        if (ad(), g === d)
          return tu(e, t, a);
        ba(e, t, g, a);
      }
      return t.child;
    }
    function PT(e, t, a, i, u) {
      return ad(), RS(u), t.flags |= kr, ba(e, t, a, i), t.child;
    }
    function tM(e, t, a) {
      Hx(t), e === null && TS(t);
      var i = t.type, u = t.pendingProps, d = e !== null ? e.memoizedProps : null, h = u.children, g = aS(i, u);
      return g ? h = null : d !== null && aS(i, d) && (t.flags |= Va), LT(e, t), ba(e, t, h, a), t.child;
    }
    function nM(e, t) {
      return e === null && TS(t), null;
    }
    function rM(e, t, a, i) {
      ky(e, t);
      var u = t.pendingProps, d = a, h = d._payload, g = d._init, C = g(h);
      t.type = C;
      var D = t.tag = nL(C), _ = Co(C, u), F;
      switch (D) {
        case T:
          return F0(t, C), t.type = C = xd(C), F = z0(null, t, C, _, i), F;
        case b:
          return t.type = C = mC(C), F = AT(null, t, C, _, i), F;
        case q:
          return t.type = C = yC(C), F = kT(null, t, C, _, i), F;
        case Pe: {
          if (t.type !== t.elementType) {
            var z = C.propTypes;
            z && vo(
              z,
              _,
              // Resolved for outer only
              "prop",
              Ut(C)
            );
          }
          return F = _T(
            null,
            t,
            C,
            Co(C.type, _),
            // The inner type can have defaults too
            i
          ), F;
        }
      }
      var $ = "";
      throw C !== null && typeof C == "object" && C.$$typeof === st && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + C + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function aM(e, t, a, i, u) {
      ky(e, t), t.tag = b;
      var d;
      return rl(a) ? (d = !0, zm(t)) : d = !1, ld(t, u), xT(t, a, i), _0(t, a, i, u), j0(null, t, a, !0, d, u);
    }
    function iM(e, t, a, i) {
      ky(e, t);
      var u = t.pendingProps, d;
      {
        var h = ed(t, a, !1);
        d = td(t, h);
      }
      ld(t, i);
      var g, C;
      Ea(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var D = Ut(a) || "Unknown";
          A0[D] || (m("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", D, D), A0[D] = !0);
        }
        t.mode & tn && yo.recordLegacyContextWarning(t, null), Kn(!0), hh.current = t, g = pd(null, t, a, u, d, i), C = hd(), Kn(!1);
      }
      if (xa(), t.flags |= ci, typeof g == "object" && g !== null && typeof g.render == "function" && g.$$typeof === void 0) {
        var _ = Ut(a) || "Unknown";
        vh[_] || (m("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _, _, _), vh[_] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof g == "object" && g !== null && typeof g.render == "function" && g.$$typeof === void 0
      ) {
        {
          var F = Ut(a) || "Unknown";
          vh[F] || (m("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", F, F, F), vh[F] = !0);
        }
        t.tag = b, t.memoizedState = null, t.updateQueue = null;
        var z = !1;
        return rl(a) ? (z = !0, zm(t)) : z = !1, t.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null, zS(t), ET(t, g), _0(t, a, u, i), j0(null, t, a, !0, z, i);
      } else {
        if (t.tag = T, t.mode & tn) {
          En(!0);
          try {
            g = pd(null, t, a, u, d, i), C = hd();
          } finally {
            En(!1);
          }
        }
        return Br() && C && gS(t), ba(null, t, g, i), F0(t, a), t.child;
      }
    }
    function F0(e, t) {
      {
        if (t && t.childContextTypes && m("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Pr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", d = e._debugSource;
          d && (u = d.fileName + ":" + d.lineNumber), U0[u] || (U0[u] = !0, m("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var h = Ut(t) || "Unknown";
          mh[h] || (m("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", h), mh[h] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var g = Ut(t) || "Unknown";
          P0[g] || (m("%s: Function components do not support getDerivedStateFromProps.", g), P0[g] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var C = Ut(t) || "Unknown";
          N0[C] || (m("%s: Function components do not support contextType.", C), N0[C] = !0);
        }
      }
    }
    var H0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: zt
    };
    function B0(e) {
      return {
        baseLanes: e,
        cachePool: K_(),
        transitions: null
      };
    }
    function oM(e, t) {
      var a = null;
      return {
        baseLanes: St(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function lM(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return IS(e, ih);
    }
    function uM(e, t) {
      return Ks(e.childLanes, t);
    }
    function UT(e, t, a) {
      var i = t.pendingProps;
      yL(t) && (t.flags |= $e);
      var u = go.current, d = !1, h = (t.flags & $e) !== We;
      if (h || lM(u, e) ? (d = !0, t.flags &= ~$e) : (e === null || e.memoizedState !== null) && (u = w_(u, Ix)), u = sd(u), es(t, u), e === null) {
        TS(t);
        var g = t.memoizedState;
        if (g !== null) {
          var C = g.dehydrated;
          if (C !== null)
            return pM(t, C);
        }
        var D = i.children, _ = i.fallback;
        if (d) {
          var F = sM(t, D, _, a), z = t.child;
          return z.memoizedState = B0(a), t.memoizedState = H0, F;
        } else
          return I0(t, D);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var Q = $.dehydrated;
          if (Q !== null)
            return hM(e, t, h, i, Q, $, a);
        }
        if (d) {
          var Z = i.fallback, be = i.children, qe = fM(e, t, be, Z, a), Ye = t.child, Nt = e.child.memoizedState;
          return Ye.memoizedState = Nt === null ? B0(a) : oM(Nt, a), Ye.childLanes = uM(e, a), t.memoizedState = H0, qe;
        } else {
          var _t = i.children, B = cM(e, t, _t, a);
          return t.memoizedState = null, B;
        }
      }
    }
    function I0(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, d = Y0(u, i);
      return d.return = e, e.child = d, d;
    }
    function sM(e, t, a, i) {
      var u = e.mode, d = e.child, h = {
        mode: "hidden",
        children: t
      }, g, C;
      return (u & bt) === Ge && d !== null ? (g = d, g.childLanes = ie, g.pendingProps = h, e.mode & Ht && (g.actualDuration = 0, g.actualStartTime = -1, g.selfBaseDuration = 0, g.treeBaseDuration = 0), C = us(a, u, i, null)) : (g = Y0(h, u), C = us(a, u, i, null)), g.return = e, C.return = e, g.sibling = C, e.child = g, C;
    }
    function Y0(e, t, a) {
      return VR(e, t, ie, null);
    }
    function VT(e, t) {
      return Mc(e, t);
    }
    function cM(e, t, a, i) {
      var u = e.child, d = u.sibling, h = VT(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & bt) === Ge && (h.lanes = i), h.return = t, h.sibling = null, d !== null) {
        var g = t.deletions;
        g === null ? (t.deletions = [d], t.flags |= Ua) : g.push(d);
      }
      return t.child = h, h;
    }
    function fM(e, t, a, i, u) {
      var d = t.mode, h = e.child, g = h.sibling, C = {
        mode: "hidden",
        children: a
      }, D;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (d & bt) === Ge && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== h
      ) {
        var _ = t.child;
        D = _, D.childLanes = ie, D.pendingProps = C, t.mode & Ht && (D.actualDuration = 0, D.actualStartTime = -1, D.selfBaseDuration = h.selfBaseDuration, D.treeBaseDuration = h.treeBaseDuration), t.deletions = null;
      } else
        D = VT(h, C), D.subtreeFlags = h.subtreeFlags & zn;
      var F;
      return g !== null ? F = Mc(g, i) : (F = us(i, d, u, null), F.flags |= Cn), F.return = t, D.return = t, D.sibling = F, t.child = D, F;
    }
    function Dy(e, t, a, i) {
      i !== null && RS(i), id(t, e.child, null, a);
      var u = t.pendingProps, d = u.children, h = I0(t, d);
      return h.flags |= Cn, t.memoizedState = null, h;
    }
    function dM(e, t, a, i, u) {
      var d = t.mode, h = {
        mode: "visible",
        children: a
      }, g = Y0(h, d), C = us(i, d, u, null);
      return C.flags |= Cn, g.return = t, C.return = t, g.sibling = C, t.child = g, (t.mode & bt) !== Ge && id(t, e.child, null, u), C;
    }
    function pM(e, t, a) {
      return (e.mode & bt) === Ge ? (m("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = nt) : uS(t) ? e.lanes = _r : e.lanes = aa, null;
    }
    function hM(e, t, a, i, u, d, h) {
      if (a)
        if (t.flags & kr) {
          t.flags &= ~kr;
          var B = M0(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Dy(e, t, h, B);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= $e, null;
          var J = i.children, I = i.fallback, fe = dM(e, t, J, I, h), Me = t.child;
          return Me.memoizedState = B0(h), t.memoizedState = H0, fe;
        }
      else {
        if (t_(), (t.mode & bt) === Ge)
          return Dy(
            e,
            t,
            h,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (uS(u)) {
          var g, C, D;
          {
            var _ = gk(u);
            g = _.digest, C = _.message, D = _.stack;
          }
          var F;
          C ? F = new Error(C) : F = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var z = M0(F, g, D);
          return Dy(e, t, h, z);
        }
        var $ = ia(h, e.childLanes);
        if (Eo || $) {
          var Q = zy();
          if (Q !== null) {
            var Z = Sp(Q, h);
            if (Z !== zt && Z !== d.retryLane) {
              d.retryLane = Z;
              var be = an;
              Wa(e, Z), Tr(Q, e, Z, be);
            }
          }
          fC();
          var qe = M0(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Dy(e, t, h, qe);
        } else if (ox(u)) {
          t.flags |= $e, t.child = e.child;
          var Ye = jO.bind(null, e);
          return Sk(u, Ye), null;
        } else {
          a_(t, u, d.treeContext);
          var Nt = i.children, _t = I0(t, Nt);
          return _t.flags |= ea, _t;
        }
      }
    }
    function zT(e, t, a) {
      e.lanes = St(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = St(i.lanes, t)), NS(e.return, t, a);
    }
    function vM(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === de) {
          var u = i.memoizedState;
          u !== null && zT(i, a, e);
        } else if (i.tag === jt)
          zT(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function mM(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && iy(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function yM(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !V0[e])
        if (V0[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              m('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              m('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              m('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          m('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function gM(e, t) {
      e !== void 0 && !wy[e] && (e !== "collapsed" && e !== "hidden" ? (wy[e] = !0, m('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (wy[e] = !0, m('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function jT(e, t) {
      {
        var a = xt(e), i = !a && typeof mt(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return m("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function SM(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (xt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!jT(e[a], a))
              return;
        } else {
          var i = mt(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var d = u.next(), h = 0; !d.done; d = u.next()) {
                if (!jT(d.value, h))
                  return;
                h++;
              }
          } else
            m('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function $0(e, t, a, i, u) {
      var d = e.memoizedState;
      d === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = i, d.tail = a, d.tailMode = u);
    }
    function FT(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, d = i.tail, h = i.children;
      yM(u), gM(d, u), SM(h, u), ba(e, t, h, a);
      var g = go.current, C = IS(g, ih);
      if (C)
        g = YS(g, ih), t.flags |= $e;
      else {
        var D = e !== null && (e.flags & $e) !== We;
        D && vM(t, t.child, a), g = sd(g);
      }
      if (es(t, g), (t.mode & bt) === Ge)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var _ = mM(t.child), F;
            _ === null ? (F = t.child, t.child = null) : (F = _.sibling, _.sibling = null), $0(
              t,
              !1,
              // isBackwards
              F,
              _,
              d
            );
            break;
          }
          case "backwards": {
            var z = null, $ = t.child;
            for (t.child = null; $ !== null; ) {
              var Q = $.alternate;
              if (Q !== null && iy(Q) === null) {
                t.child = $;
                break;
              }
              var Z = $.sibling;
              $.sibling = z, z = $, $ = Z;
            }
            $0(
              t,
              !0,
              // isBackwards
              z,
              null,
              // last
              d
            );
            break;
          }
          case "together": {
            $0(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function CM(e, t, a) {
      FS(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = id(t, null, i, a) : ba(e, t, i, a), t.child;
    }
    var HT = !1;
    function EM(e, t, a) {
      var i = t.type, u = i._context, d = t.pendingProps, h = t.memoizedProps, g = d.value;
      {
        "value" in d || HT || (HT = !0, m("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var C = t.type.propTypes;
        C && vo(C, d, "prop", "Context.Provider");
      }
      if (Ax(t, u, g), h !== null) {
        var D = h.value;
        if (ue(D, g)) {
          if (h.children === d.children && !Um())
            return tu(e, t, a);
        } else
          y_(t, u, a);
      }
      var _ = d.children;
      return ba(e, t, _, a), t.child;
    }
    var BT = !1;
    function xM(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (BT || (BT = !0, m("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, d = u.children;
      typeof d != "function" && m("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), ld(t, a);
      var h = or(i);
      Ea(t);
      var g;
      return hh.current = t, Kn(!0), g = d(h), Kn(!1), xa(), t.flags |= ci, ba(e, t, g, a), t.child;
    }
    function yh() {
      Eo = !0;
    }
    function ky(e, t) {
      (t.mode & bt) === Ge && e !== null && (e.alternate = null, t.alternate = null, t.flags |= Cn);
    }
    function tu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), yT(), _h(t.lanes), ia(a, t.childLanes) ? (v_(e, t), t.child) : null;
    }
    function TM(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var d = i.deletions;
        return d === null ? (i.deletions = [e], i.flags |= Ua) : d.push(e), a.flags |= Cn, a;
      }
    }
    function W0(e, t) {
      var a = e.lanes;
      return !!ia(a, t);
    }
    function RM(e, t, a) {
      switch (t.tag) {
        case k:
          NT(t), t.stateNode, ad();
          break;
        case P:
          Hx(t);
          break;
        case b: {
          var i = t.type;
          rl(i) && zm(t);
          break;
        }
        case A:
          FS(t, t.stateNode.containerInfo);
          break;
        case re: {
          var u = t.memoizedProps.value, d = t.type._context;
          Ax(t, d, u);
          break;
        }
        case pe:
          {
            var h = ia(a, t.childLanes);
            h && (t.flags |= Ot);
            {
              var g = t.stateNode;
              g.effectDuration = 0, g.passiveEffectDuration = 0;
            }
          }
          break;
        case de: {
          var C = t.memoizedState;
          if (C !== null) {
            if (C.dehydrated !== null)
              return es(t, sd(go.current)), t.flags |= $e, null;
            var D = t.child, _ = D.childLanes;
            if (ia(a, _))
              return UT(e, t, a);
            es(t, sd(go.current));
            var F = tu(e, t, a);
            return F !== null ? F.sibling : null;
          } else
            es(t, sd(go.current));
          break;
        }
        case jt: {
          var z = (e.flags & $e) !== We, $ = ia(a, t.childLanes);
          if (z) {
            if ($)
              return FT(e, t, a);
            t.flags |= $e;
          }
          var Q = t.memoizedState;
          if (Q !== null && (Q.rendering = null, Q.tail = null, Q.lastEffect = null), es(t, go.current), $)
            break;
          return null;
        }
        case Ue:
        case it:
          return t.lanes = ie, OT(e, t, a);
      }
      return tu(e, t, a);
    }
    function IT(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return TM(e, t, xC(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Um() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          Eo = !0;
        else {
          var d = W0(e, a);
          if (!d && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & $e) === We)
            return Eo = !1, RM(e, t, a);
          (e.flags & nf) !== We ? Eo = !0 : Eo = !1;
        }
      } else if (Eo = !1, Br() && Kk(t)) {
        var h = t.index, g = qk();
        yx(t, g, h);
      }
      switch (t.lanes = ie, t.tag) {
        case M:
          return iM(e, t, t.type, a);
        case Fe: {
          var C = t.elementType;
          return rM(e, t, C, a);
        }
        case T: {
          var D = t.type, _ = t.pendingProps, F = t.elementType === D ? _ : Co(D, _);
          return z0(e, t, D, F, a);
        }
        case b: {
          var z = t.type, $ = t.pendingProps, Q = t.elementType === z ? $ : Co(z, $);
          return AT(e, t, z, Q, a);
        }
        case k:
          return eM(e, t, a);
        case P:
          return tM(e, t, a);
        case K:
          return nM(e, t);
        case de:
          return UT(e, t, a);
        case A:
          return CM(e, t, a);
        case q: {
          var Z = t.type, be = t.pendingProps, qe = t.elementType === Z ? be : Co(Z, be);
          return kT(e, t, Z, qe, a);
        }
        case ee:
          return X_(e, t, a);
        case se:
          return Z_(e, t, a);
        case pe:
          return J_(e, t, a);
        case re:
          return EM(e, t, a);
        case Te:
          return xM(e, t, a);
        case Pe: {
          var Ye = t.type, Nt = t.pendingProps, _t = Co(Ye, Nt);
          if (t.type !== t.elementType) {
            var B = Ye.propTypes;
            B && vo(
              B,
              _t,
              // Resolved for outer only
              "prop",
              Ut(Ye)
            );
          }
          return _t = Co(Ye.type, _t), _T(e, t, Ye, _t, a);
        }
        case Ee:
          return MT(e, t, t.type, t.pendingProps, a);
        case Be: {
          var J = t.type, I = t.pendingProps, fe = t.elementType === J ? I : Co(J, I);
          return aM(e, t, J, fe, a);
        }
        case jt:
          return FT(e, t, a);
        case ft:
          break;
        case Ue:
          return OT(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function vd(e) {
      e.flags |= Ot;
    }
    function YT(e) {
      e.flags |= Rn, e.flags |= Au;
    }
    var $T, G0, WT, GT;
    $T = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === P || u.tag === K)
          WD(e, u.stateNode);
        else if (u.tag !== A) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, G0 = function(e, t) {
    }, WT = function(e, t, a, i, u) {
      var d = e.memoizedProps;
      if (d !== i) {
        var h = t.stateNode, g = HS(), C = QD(h, a, d, i, u, g);
        t.updateQueue = C, C && vd(t);
      }
    }, GT = function(e, t, a, i) {
      a !== i && vd(t);
    };
    function gh(e, t) {
      if (!Br())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, d = null; u !== null; )
              u.alternate !== null && (d = u), u = u.sibling;
            d === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : d.sibling = null;
            break;
          }
        }
    }
    function Yr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = ie, i = We;
      if (t) {
        if ((e.mode & Ht) !== Ge) {
          for (var C = e.selfBaseDuration, D = e.child; D !== null; )
            a = St(a, St(D.lanes, D.childLanes)), i |= D.subtreeFlags & zn, i |= D.flags & zn, C += D.treeBaseDuration, D = D.sibling;
          e.treeBaseDuration = C;
        } else
          for (var _ = e.child; _ !== null; )
            a = St(a, St(_.lanes, _.childLanes)), i |= _.subtreeFlags & zn, i |= _.flags & zn, _.return = e, _ = _.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ht) !== Ge) {
          for (var u = e.actualDuration, d = e.selfBaseDuration, h = e.child; h !== null; )
            a = St(a, St(h.lanes, h.childLanes)), i |= h.subtreeFlags, i |= h.flags, u += h.actualDuration, d += h.treeBaseDuration, h = h.sibling;
          e.actualDuration = u, e.treeBaseDuration = d;
        } else
          for (var g = e.child; g !== null; )
            a = St(a, St(g.lanes, g.childLanes)), i |= g.subtreeFlags, i |= g.flags, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function bM(e, t, a) {
      if (s_() && (t.mode & bt) !== Ge && (t.flags & $e) === We)
        return Rx(t), ad(), t.flags |= kr | As | nr, !1;
      var i = Im(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (l_(t), Yr(t), (t.mode & Ht) !== Ge) {
            var u = a !== null;
            if (u) {
              var d = t.child;
              d !== null && (t.treeBaseDuration -= d.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (ad(), (t.flags & $e) === We && (t.memoizedState = null), t.flags |= Ot, Yr(t), (t.mode & Ht) !== Ge) {
            var h = a !== null;
            if (h) {
              var g = t.child;
              g !== null && (t.treeBaseDuration -= g.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return bx(), !0;
    }
    function QT(e, t, a) {
      var i = t.pendingProps;
      switch (SS(t), t.tag) {
        case M:
        case Fe:
        case Ee:
        case T:
        case q:
        case ee:
        case se:
        case pe:
        case Te:
        case Pe:
          return Yr(t), null;
        case b: {
          var u = t.type;
          return rl(u) && Vm(t), Yr(t), null;
        }
        case k: {
          var d = t.stateNode;
          if (ud(t), vS(t), WS(), d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null), e === null || e.child === null) {
            var h = Im(t);
            if (h)
              vd(t);
            else if (e !== null) {
              var g = e.memoizedState;
              // Check if this is a client root
              (!g.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & kr) !== We) && (t.flags |= qn, bx());
            }
          }
          return G0(e, t), Yr(t), null;
        }
        case P: {
          BS(t);
          var C = Fx(), D = t.type;
          if (e !== null && t.stateNode != null)
            WT(e, t, D, i, C), e.ref !== t.ref && YT(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Yr(t), null;
            }
            var _ = HS(), F = Im(t);
            if (F)
              i_(t, C, _) && vd(t);
            else {
              var z = $D(D, i, C, _, t);
              $T(z, t, !1, !1), t.stateNode = z, GD(z, D, i, C) && vd(t);
            }
            t.ref !== null && YT(t);
          }
          return Yr(t), null;
        }
        case K: {
          var $ = i;
          if (e && t.stateNode != null) {
            var Q = e.memoizedProps;
            GT(e, t, Q, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var Z = Fx(), be = HS(), qe = Im(t);
            qe ? o_(t) && vd(t) : t.stateNode = KD($, Z, be, t);
          }
          return Yr(t), null;
        }
        case de: {
          cd(t);
          var Ye = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Nt = bM(e, t, Ye);
            if (!Nt)
              return t.flags & nr ? t : null;
          }
          if ((t.flags & $e) !== We)
            return t.lanes = a, (t.mode & Ht) !== Ge && y0(t), t;
          var _t = Ye !== null, B = e !== null && e.memoizedState !== null;
          if (_t !== B && _t) {
            var J = t.child;
            if (J.flags |= Vn, (t.mode & bt) !== Ge) {
              var I = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              I || IS(go.current, Ix) ? wO() : fC();
            }
          }
          var fe = t.updateQueue;
          if (fe !== null && (t.flags |= Ot), Yr(t), (t.mode & Ht) !== Ge && _t) {
            var Me = t.child;
            Me !== null && (t.treeBaseDuration -= Me.treeBaseDuration);
          }
          return null;
        }
        case A:
          return ud(t), G0(e, t), e === null && Bk(t.stateNode.containerInfo), Yr(t), null;
        case re:
          var we = t.type._context;
          return AS(we, t), Yr(t), null;
        case Be: {
          var rt = t.type;
          return rl(rt) && Vm(t), Yr(t), null;
        }
        case jt: {
          cd(t);
          var pt = t.memoizedState;
          if (pt === null)
            return Yr(t), null;
          var rn = (t.flags & $e) !== We, Yt = pt.rendering;
          if (Yt === null)
            if (rn)
              gh(pt, !1);
            else {
              var Jn = kO() && (e === null || (e.flags & $e) === We);
              if (!Jn)
                for (var $t = t.child; $t !== null; ) {
                  var Yn = iy($t);
                  if (Yn !== null) {
                    rn = !0, t.flags |= $e, gh(pt, !1);
                    var da = Yn.updateQueue;
                    return da !== null && (t.updateQueue = da, t.flags |= Ot), t.subtreeFlags = We, m_(t, a), es(t, YS(go.current, ih)), t.child;
                  }
                  $t = $t.sibling;
                }
              pt.tail !== null && Xn() > vR() && (t.flags |= $e, rn = !0, gh(pt, !1), t.lanes = cp);
            }
          else {
            if (!rn) {
              var Kr = iy(Yt);
              if (Kr !== null) {
                t.flags |= $e, rn = !0;
                var yi = Kr.updateQueue;
                if (yi !== null && (t.updateQueue = yi, t.flags |= Ot), gh(pt, !0), pt.tail === null && pt.tailMode === "hidden" && !Yt.alternate && !Br())
                  return Yr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Xn() * 2 - pt.renderingStartTime > vR() && a !== aa && (t.flags |= $e, rn = !0, gh(pt, !1), t.lanes = cp);
            }
            if (pt.isBackwards)
              Yt.sibling = t.child, t.child = Yt;
            else {
              var ka = pt.last;
              ka !== null ? ka.sibling = Yt : t.child = Yt, pt.last = Yt;
            }
          }
          if (pt.tail !== null) {
            var _a = pt.tail;
            pt.rendering = _a, pt.tail = _a.sibling, pt.renderingStartTime = Xn(), _a.sibling = null;
            var pa = go.current;
            return rn ? pa = YS(pa, ih) : pa = sd(pa), es(t, pa), _a;
          }
          return Yr(t), null;
        }
        case ft:
          break;
        case Ue:
        case it: {
          cC(t);
          var ou = t.memoizedState, Td = ou !== null;
          if (e !== null) {
            var Nh = e.memoizedState, fl = Nh !== null;
            fl !== Td && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ye && (t.flags |= Vn);
          }
          return !Td || (t.mode & bt) === Ge ? Yr(t) : ia(cl, aa) && (Yr(t), t.subtreeFlags & (Cn | Ot) && (t.flags |= Vn)), null;
        }
        case Tt:
          return null;
        case tt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function wM(e, t, a) {
      switch (SS(t), t.tag) {
        case b: {
          var i = t.type;
          rl(i) && Vm(t);
          var u = t.flags;
          return u & nr ? (t.flags = u & ~nr | $e, (t.mode & Ht) !== Ge && y0(t), t) : null;
        }
        case k: {
          t.stateNode, ud(t), vS(t), WS();
          var d = t.flags;
          return (d & nr) !== We && (d & $e) === We ? (t.flags = d & ~nr | $e, t) : null;
        }
        case P:
          return BS(t), null;
        case de: {
          cd(t);
          var h = t.memoizedState;
          if (h !== null && h.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            ad();
          }
          var g = t.flags;
          return g & nr ? (t.flags = g & ~nr | $e, (t.mode & Ht) !== Ge && y0(t), t) : null;
        }
        case jt:
          return cd(t), null;
        case A:
          return ud(t), null;
        case re:
          var C = t.type._context;
          return AS(C, t), null;
        case Ue:
        case it:
          return cC(t), null;
        case Tt:
          return null;
        default:
          return null;
      }
    }
    function KT(e, t, a) {
      switch (SS(t), t.tag) {
        case b: {
          var i = t.type.childContextTypes;
          i != null && Vm(t);
          break;
        }
        case k: {
          t.stateNode, ud(t), vS(t), WS();
          break;
        }
        case P: {
          BS(t);
          break;
        }
        case A:
          ud(t);
          break;
        case de:
          cd(t);
          break;
        case jt:
          cd(t);
          break;
        case re:
          var u = t.type._context;
          AS(u, t);
          break;
        case Ue:
        case it:
          cC(t);
          break;
      }
    }
    var qT = null;
    qT = /* @__PURE__ */ new Set();
    var _y = !1, $r = !1, DM = typeof WeakSet == "function" ? WeakSet : Set, je = null, md = null, yd = null;
    function kM(e) {
      jo(null, function() {
        throw e;
      }), Ls();
    }
    var _M = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ht)
        try {
          ul(), t.componentWillUnmount();
        } finally {
          ll(e);
        }
      else
        t.componentWillUnmount();
    };
    function XT(e, t) {
      try {
        rs(yr, e);
      } catch (a) {
        hn(e, t, a);
      }
    }
    function Q0(e, t, a) {
      try {
        _M(e, a);
      } catch (i) {
        hn(e, t, i);
      }
    }
    function MM(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        hn(e, t, i);
      }
    }
    function ZT(e, t) {
      try {
        eR(e);
      } catch (a) {
        hn(e, t, a);
      }
    }
    function gd(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Qe && yt && e.mode & Ht)
              try {
                ul(), i = a(null);
              } finally {
                ll(e);
              }
            else
              i = a(null);
          } catch (u) {
            hn(e, t, u);
          }
          typeof i == "function" && m("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", lt(e));
        } else
          a.current = null;
    }
    function My(e, t, a) {
      try {
        a();
      } catch (i) {
        hn(e, t, i);
      }
    }
    var JT = !1;
    function OM(e, t) {
      ID(e.containerInfo), je = t, LM();
      var a = JT;
      return JT = !1, a;
    }
    function LM() {
      for (; je !== null; ) {
        var e = je, t = e.child;
        (e.subtreeFlags & Ho) !== We && t !== null ? (t.return = e, je = t) : AM();
      }
    }
    function AM() {
      for (; je !== null; ) {
        var e = je;
        Zt(e);
        try {
          NM(e);
        } catch (a) {
          hn(e, e.return, a);
        }
        pn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, je = t;
          return;
        }
        je = e.return;
      }
    }
    function NM(e) {
      var t = e.alternate, a = e.flags;
      if ((a & qn) !== We) {
        switch (Zt(e), e.tag) {
          case T:
          case q:
          case Ee:
            break;
          case b: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, d = e.stateNode;
              e.type === e.elementType && !bc && (d.props !== e.memoizedProps && m("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(e) || "instance"), d.state !== e.memoizedState && m("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(e) || "instance"));
              var h = d.getSnapshotBeforeUpdate(e.elementType === e.type ? i : Co(e.type, i), u);
              {
                var g = qT;
                h === void 0 && !g.has(e.type) && (g.add(e.type), m("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", lt(e)));
              }
              d.__reactInternalSnapshotBeforeUpdate = h;
            }
            break;
          }
          case k: {
            {
              var C = e.stateNode;
              hk(C.containerInfo);
            }
            break;
          }
          case P:
          case K:
          case A:
          case Be:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        pn();
      }
    }
    function xo(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var d = u.next, h = d;
        do {
          if ((h.tag & e) === e) {
            var g = h.destroy;
            h.destroy = void 0, g !== void 0 && ((e & Ir) !== Ga ? uo(t) : (e & yr) !== Ga && Ps(t), (e & al) !== Ga && Oh(!0), My(t, a, g), (e & al) !== Ga && Oh(!1), (e & Ir) !== Ga ? $o() : (e & yr) !== Ga && up());
          }
          h = h.next;
        } while (h !== d);
      }
    }
    function rs(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, d = u;
        do {
          if ((d.tag & e) === e) {
            (e & Ir) !== Ga ? lp(t) : (e & yr) !== Ga && sf(t);
            var h = d.create;
            (e & al) !== Ga && Oh(!0), d.destroy = h(), (e & al) !== Ga && Oh(!1), (e & Ir) !== Ga ? Pv() : (e & yr) !== Ga && Uv();
            {
              var g = d.destroy;
              if (g !== void 0 && typeof g != "function") {
                var C = void 0;
                (d.tag & yr) !== We ? C = "useLayoutEffect" : (d.tag & al) !== We ? C = "useInsertionEffect" : C = "useEffect";
                var D = void 0;
                g === null ? D = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof g.then == "function" ? D = `

It looks like you wrote ` + C + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + C + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : D = " You returned: " + g, m("%s must not return anything besides a function, which is used for clean-up.%s", C, D);
              }
            }
          }
          d = d.next;
        } while (d !== u);
      }
    }
    function PM(e, t) {
      if ((t.flags & Ot) !== We)
        switch (t.tag) {
          case pe: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, d = i.onPostCommit, h = vT(), g = t.alternate === null ? "mount" : "update";
            hT() && (g = "nested-update"), typeof d == "function" && d(u, g, a, h);
            var C = t.return;
            e: for (; C !== null; ) {
              switch (C.tag) {
                case k:
                  var D = C.stateNode;
                  D.passiveEffectDuration += a;
                  break e;
                case pe:
                  var _ = C.stateNode;
                  _.passiveEffectDuration += a;
                  break e;
              }
              C = C.return;
            }
            break;
          }
        }
    }
    function UM(e, t, a, i) {
      if ((a.flags & Io) !== We)
        switch (a.tag) {
          case T:
          case q:
          case Ee: {
            if (!$r)
              if (a.mode & Ht)
                try {
                  ul(), rs(yr | mr, a);
                } finally {
                  ll(a);
                }
              else
                rs(yr | mr, a);
            break;
          }
          case b: {
            var u = a.stateNode;
            if (a.flags & Ot && !$r)
              if (t === null)
                if (a.type === a.elementType && !bc && (u.props !== a.memoizedProps && m("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(a) || "instance"), u.state !== a.memoizedState && m("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(a) || "instance")), a.mode & Ht)
                  try {
                    ul(), u.componentDidMount();
                  } finally {
                    ll(a);
                  }
                else
                  u.componentDidMount();
              else {
                var d = a.elementType === a.type ? t.memoizedProps : Co(a.type, t.memoizedProps), h = t.memoizedState;
                if (a.type === a.elementType && !bc && (u.props !== a.memoizedProps && m("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(a) || "instance"), u.state !== a.memoizedState && m("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(a) || "instance")), a.mode & Ht)
                  try {
                    ul(), u.componentDidUpdate(d, h, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    ll(a);
                  }
                else
                  u.componentDidUpdate(d, h, u.__reactInternalSnapshotBeforeUpdate);
              }
            var g = a.updateQueue;
            g !== null && (a.type === a.elementType && !bc && (u.props !== a.memoizedProps && m("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(a) || "instance"), u.state !== a.memoizedState && m("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(a) || "instance")), jx(a, g, u));
            break;
          }
          case k: {
            var C = a.updateQueue;
            if (C !== null) {
              var D = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case P:
                    D = a.child.stateNode;
                    break;
                  case b:
                    D = a.child.stateNode;
                    break;
                }
              jx(a, C, D);
            }
            break;
          }
          case P: {
            var _ = a.stateNode;
            if (t === null && a.flags & Ot) {
              var F = a.type, z = a.memoizedProps;
              ek(_, F, z);
            }
            break;
          }
          case K:
            break;
          case A:
            break;
          case pe: {
            {
              var $ = a.memoizedProps, Q = $.onCommit, Z = $.onRender, be = a.stateNode.effectDuration, qe = vT(), Ye = t === null ? "mount" : "update";
              hT() && (Ye = "nested-update"), typeof Z == "function" && Z(a.memoizedProps.id, Ye, a.actualDuration, a.treeBaseDuration, a.actualStartTime, qe);
              {
                typeof Q == "function" && Q(a.memoizedProps.id, Ye, be, qe), AO(a);
                var Nt = a.return;
                e: for (; Nt !== null; ) {
                  switch (Nt.tag) {
                    case k:
                      var _t = Nt.stateNode;
                      _t.effectDuration += be;
                      break e;
                    case pe:
                      var B = Nt.stateNode;
                      B.effectDuration += be;
                      break e;
                  }
                  Nt = Nt.return;
                }
              }
            }
            break;
          }
          case de: {
            YM(e, a);
            break;
          }
          case jt:
          case Be:
          case ft:
          case Ue:
          case it:
          case tt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      $r || a.flags & Rn && eR(a);
    }
    function VM(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          if (e.mode & Ht)
            try {
              ul(), XT(e, e.return);
            } finally {
              ll(e);
            }
          else
            XT(e, e.return);
          break;
        }
        case b: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && MM(e, e.return, t), ZT(e, e.return);
          break;
        }
        case P: {
          ZT(e, e.return);
          break;
        }
      }
    }
    function zM(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === P) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? ck(u) : dk(i.stateNode, i.memoizedProps);
            } catch (h) {
              hn(e, e.return, h);
            }
          }
        } else if (i.tag === K) {
          if (a === null)
            try {
              var d = i.stateNode;
              t ? fk(d) : pk(d, i.memoizedProps);
            } catch (h) {
              hn(e, e.return, h);
            }
        } else if (!((i.tag === Ue || i.tag === it) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function eR(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case P:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ht)
            try {
              ul(), u = t(i);
            } finally {
              ll(e);
            }
          else
            u = t(i);
          typeof u == "function" && m("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", lt(e));
        } else
          t.hasOwnProperty("current") || m("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", lt(e)), t.current = i;
      }
    }
    function jM(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function tR(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, tR(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === P) {
          var a = e.stateNode;
          a !== null && $k(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function FM(e) {
      for (var t = e.return; t !== null; ) {
        if (nR(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function nR(e) {
      return e.tag === P || e.tag === k || e.tag === A;
    }
    function rR(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || nR(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== P && t.tag !== K && t.tag !== wt; ) {
          if (t.flags & Cn || t.child === null || t.tag === A)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & Cn))
          return t.stateNode;
      }
    }
    function HM(e) {
      var t = FM(e);
      switch (t.tag) {
        case P: {
          var a = t.stateNode;
          t.flags & Va && (ix(a), t.flags &= ~Va);
          var i = rR(e);
          q0(e, i, a);
          break;
        }
        case k:
        case A: {
          var u = t.stateNode.containerInfo, d = rR(e);
          K0(e, d, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function K0(e, t, a) {
      var i = e.tag, u = i === P || i === K;
      if (u) {
        var d = e.stateNode;
        t ? ok(a, d, t) : ak(a, d);
      } else if (i !== A) {
        var h = e.child;
        if (h !== null) {
          K0(h, t, a);
          for (var g = h.sibling; g !== null; )
            K0(g, t, a), g = g.sibling;
        }
      }
    }
    function q0(e, t, a) {
      var i = e.tag, u = i === P || i === K;
      if (u) {
        var d = e.stateNode;
        t ? ik(a, d, t) : rk(a, d);
      } else if (i !== A) {
        var h = e.child;
        if (h !== null) {
          q0(h, t, a);
          for (var g = h.sibling; g !== null; )
            q0(g, t, a), g = g.sibling;
        }
      }
    }
    var Wr = null, To = !1;
    function BM(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case P: {
              Wr = i.stateNode, To = !1;
              break e;
            }
            case k: {
              Wr = i.stateNode.containerInfo, To = !0;
              break e;
            }
            case A: {
              Wr = i.stateNode.containerInfo, To = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Wr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        aR(e, t, a), Wr = null, To = !1;
      }
      jM(a);
    }
    function as(e, t, a) {
      for (var i = a.child; i !== null; )
        aR(e, t, i), i = i.sibling;
    }
    function aR(e, t, a) {
      switch (ap(a), a.tag) {
        case P:
          $r || gd(a, t);
        case K: {
          {
            var i = Wr, u = To;
            Wr = null, as(e, t, a), Wr = i, To = u, Wr !== null && (To ? uk(Wr, a.stateNode) : lk(Wr, a.stateNode));
          }
          return;
        }
        case wt: {
          Wr !== null && (To ? sk(Wr, a.stateNode) : lS(Wr, a.stateNode));
          return;
        }
        case A: {
          {
            var d = Wr, h = To;
            Wr = a.stateNode.containerInfo, To = !0, as(e, t, a), Wr = d, To = h;
          }
          return;
        }
        case T:
        case q:
        case Pe:
        case Ee: {
          if (!$r) {
            var g = a.updateQueue;
            if (g !== null) {
              var C = g.lastEffect;
              if (C !== null) {
                var D = C.next, _ = D;
                do {
                  var F = _, z = F.destroy, $ = F.tag;
                  z !== void 0 && (($ & al) !== Ga ? My(a, t, z) : ($ & yr) !== Ga && (Ps(a), a.mode & Ht ? (ul(), My(a, t, z), ll(a)) : My(a, t, z), up())), _ = _.next;
                } while (_ !== D);
              }
            }
          }
          as(e, t, a);
          return;
        }
        case b: {
          if (!$r) {
            gd(a, t);
            var Q = a.stateNode;
            typeof Q.componentWillUnmount == "function" && Q0(a, t, Q);
          }
          as(e, t, a);
          return;
        }
        case ft: {
          as(e, t, a);
          return;
        }
        case Ue: {
          if (
            // TODO: Remove this dead flag
            a.mode & bt
          ) {
            var Z = $r;
            $r = Z || a.memoizedState !== null, as(e, t, a), $r = Z;
          } else
            as(e, t, a);
          break;
        }
        default: {
          as(e, t, a);
          return;
        }
      }
    }
    function IM(e) {
      e.memoizedState;
    }
    function YM(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var d = u.dehydrated;
            d !== null && kk(d);
          }
        }
      }
    }
    function iR(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new DM()), t.forEach(function(i) {
          var u = FO.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), ra)
              if (md !== null && yd !== null)
                Mh(yd, md);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function $M(e, t, a) {
      md = a, yd = e, Zt(t), oR(t, e), Zt(t), md = null, yd = null;
    }
    function Ro(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var d = i[u];
          try {
            BM(e, t, d);
          } catch (C) {
            hn(d, t, C);
          }
        }
      var h = Lo();
      if (t.subtreeFlags & Bo)
        for (var g = t.child; g !== null; )
          Zt(g), oR(g, e), g = g.sibling;
      Zt(h);
    }
    function oR(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case T:
        case q:
        case Pe:
        case Ee: {
          if (Ro(t, e), sl(e), u & Ot) {
            try {
              xo(al | mr, e, e.return), rs(al | mr, e);
            } catch (rt) {
              hn(e, e.return, rt);
            }
            if (e.mode & Ht) {
              try {
                ul(), xo(yr | mr, e, e.return);
              } catch (rt) {
                hn(e, e.return, rt);
              }
              ll(e);
            } else
              try {
                xo(yr | mr, e, e.return);
              } catch (rt) {
                hn(e, e.return, rt);
              }
          }
          return;
        }
        case b: {
          Ro(t, e), sl(e), u & Rn && i !== null && gd(i, i.return);
          return;
        }
        case P: {
          Ro(t, e), sl(e), u & Rn && i !== null && gd(i, i.return);
          {
            if (e.flags & Va) {
              var d = e.stateNode;
              try {
                ix(d);
              } catch (rt) {
                hn(e, e.return, rt);
              }
            }
            if (u & Ot) {
              var h = e.stateNode;
              if (h != null) {
                var g = e.memoizedProps, C = i !== null ? i.memoizedProps : g, D = e.type, _ = e.updateQueue;
                if (e.updateQueue = null, _ !== null)
                  try {
                    tk(h, _, D, C, g, e);
                  } catch (rt) {
                    hn(e, e.return, rt);
                  }
              }
            }
          }
          return;
        }
        case K: {
          if (Ro(t, e), sl(e), u & Ot) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var F = e.stateNode, z = e.memoizedProps, $ = i !== null ? i.memoizedProps : z;
            try {
              nk(F, $, z);
            } catch (rt) {
              hn(e, e.return, rt);
            }
          }
          return;
        }
        case k: {
          if (Ro(t, e), sl(e), u & Ot && i !== null) {
            var Q = i.memoizedState;
            if (Q.isDehydrated)
              try {
                Dk(t.containerInfo);
              } catch (rt) {
                hn(e, e.return, rt);
              }
          }
          return;
        }
        case A: {
          Ro(t, e), sl(e);
          return;
        }
        case de: {
          Ro(t, e), sl(e);
          var Z = e.child;
          if (Z.flags & Vn) {
            var be = Z.stateNode, qe = Z.memoizedState, Ye = qe !== null;
            if (be.isHidden = Ye, Ye) {
              var Nt = Z.alternate !== null && Z.alternate.memoizedState !== null;
              Nt || bO();
            }
          }
          if (u & Ot) {
            try {
              IM(e);
            } catch (rt) {
              hn(e, e.return, rt);
            }
            iR(e);
          }
          return;
        }
        case Ue: {
          var _t = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & bt
          ) {
            var B = $r;
            $r = B || _t, Ro(t, e), $r = B;
          } else
            Ro(t, e);
          if (sl(e), u & Vn) {
            var J = e.stateNode, I = e.memoizedState, fe = I !== null, Me = e;
            if (J.isHidden = fe, fe && !_t && (Me.mode & bt) !== Ge) {
              je = Me;
              for (var we = Me.child; we !== null; )
                je = we, GM(we), we = we.sibling;
            }
            zM(Me, fe);
          }
          return;
        }
        case jt: {
          Ro(t, e), sl(e), u & Ot && iR(e);
          return;
        }
        case ft:
          return;
        default: {
          Ro(t, e), sl(e);
          return;
        }
      }
    }
    function sl(e) {
      var t = e.flags;
      if (t & Cn) {
        try {
          HM(e);
        } catch (a) {
          hn(e, e.return, a);
        }
        e.flags &= ~Cn;
      }
      t & ea && (e.flags &= ~ea);
    }
    function WM(e, t, a) {
      md = a, yd = t, je = e, lR(e, t, a), md = null, yd = null;
    }
    function lR(e, t, a) {
      for (var i = (e.mode & bt) !== Ge; je !== null; ) {
        var u = je, d = u.child;
        if (u.tag === Ue && i) {
          var h = u.memoizedState !== null, g = h || _y;
          if (g) {
            X0(e, t, a);
            continue;
          } else {
            var C = u.alternate, D = C !== null && C.memoizedState !== null, _ = D || $r, F = _y, z = $r;
            _y = g, $r = _, $r && !z && (je = u, QM(u));
            for (var $ = d; $ !== null; )
              je = $, lR(
                $,
                // New root; bubble back up to here and stop.
                t,
                a
              ), $ = $.sibling;
            je = u, _y = F, $r = z, X0(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Io) !== We && d !== null ? (d.return = u, je = d) : X0(e, t, a);
      }
    }
    function X0(e, t, a) {
      for (; je !== null; ) {
        var i = je;
        if ((i.flags & Io) !== We) {
          var u = i.alternate;
          Zt(i);
          try {
            UM(t, u, i, a);
          } catch (h) {
            hn(i, i.return, h);
          }
          pn();
        }
        if (i === e) {
          je = null;
          return;
        }
        var d = i.sibling;
        if (d !== null) {
          d.return = i.return, je = d;
          return;
        }
        je = i.return;
      }
    }
    function GM(e) {
      for (; je !== null; ) {
        var t = je, a = t.child;
        switch (t.tag) {
          case T:
          case q:
          case Pe:
          case Ee: {
            if (t.mode & Ht)
              try {
                ul(), xo(yr, t, t.return);
              } finally {
                ll(t);
              }
            else
              xo(yr, t, t.return);
            break;
          }
          case b: {
            gd(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && Q0(t, t.return, i);
            break;
          }
          case P: {
            gd(t, t.return);
            break;
          }
          case Ue: {
            var u = t.memoizedState !== null;
            if (u) {
              uR(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, je = a) : uR(e);
      }
    }
    function uR(e) {
      for (; je !== null; ) {
        var t = je;
        if (t === e) {
          je = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, je = a;
          return;
        }
        je = t.return;
      }
    }
    function QM(e) {
      for (; je !== null; ) {
        var t = je, a = t.child;
        if (t.tag === Ue) {
          var i = t.memoizedState !== null;
          if (i) {
            sR(e);
            continue;
          }
        }
        a !== null ? (a.return = t, je = a) : sR(e);
      }
    }
    function sR(e) {
      for (; je !== null; ) {
        var t = je;
        Zt(t);
        try {
          VM(t);
        } catch (i) {
          hn(t, t.return, i);
        }
        if (pn(), t === e) {
          je = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, je = a;
          return;
        }
        je = t.return;
      }
    }
    function KM(e, t, a, i) {
      je = t, qM(t, e, a, i);
    }
    function qM(e, t, a, i) {
      for (; je !== null; ) {
        var u = je, d = u.child;
        (u.subtreeFlags & oo) !== We && d !== null ? (d.return = u, je = d) : XM(e, t, a, i);
      }
    }
    function XM(e, t, a, i) {
      for (; je !== null; ) {
        var u = je;
        if ((u.flags & Jr) !== We) {
          Zt(u);
          try {
            ZM(t, u, a, i);
          } catch (h) {
            hn(u, u.return, h);
          }
          pn();
        }
        if (u === e) {
          je = null;
          return;
        }
        var d = u.sibling;
        if (d !== null) {
          d.return = u.return, je = d;
          return;
        }
        je = u.return;
      }
    }
    function ZM(e, t, a, i) {
      switch (t.tag) {
        case T:
        case q:
        case Ee: {
          if (t.mode & Ht) {
            m0();
            try {
              rs(Ir | mr, t);
            } finally {
              v0(t);
            }
          } else
            rs(Ir | mr, t);
          break;
        }
      }
    }
    function JM(e) {
      je = e, eO();
    }
    function eO() {
      for (; je !== null; ) {
        var e = je, t = e.child;
        if ((je.flags & Ua) !== We) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              je = u, rO(u, e);
            }
            {
              var d = e.alternate;
              if (d !== null) {
                var h = d.child;
                if (h !== null) {
                  d.child = null;
                  do {
                    var g = h.sibling;
                    h.sibling = null, h = g;
                  } while (h !== null);
                }
              }
            }
            je = e;
          }
        }
        (e.subtreeFlags & oo) !== We && t !== null ? (t.return = e, je = t) : tO();
      }
    }
    function tO() {
      for (; je !== null; ) {
        var e = je;
        (e.flags & Jr) !== We && (Zt(e), nO(e), pn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, je = t;
          return;
        }
        je = e.return;
      }
    }
    function nO(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          e.mode & Ht ? (m0(), xo(Ir | mr, e, e.return), v0(e)) : xo(Ir | mr, e, e.return);
          break;
        }
      }
    }
    function rO(e, t) {
      for (; je !== null; ) {
        var a = je;
        Zt(a), iO(a, t), pn();
        var i = a.child;
        i !== null ? (i.return = a, je = i) : aO(e);
      }
    }
    function aO(e) {
      for (; je !== null; ) {
        var t = je, a = t.sibling, i = t.return;
        if (tR(t), t === e) {
          je = null;
          return;
        }
        if (a !== null) {
          a.return = i, je = a;
          return;
        }
        je = i;
      }
    }
    function iO(e, t) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          e.mode & Ht ? (m0(), xo(Ir, e, t), v0(e)) : xo(Ir, e, t);
          break;
        }
      }
    }
    function oO(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          try {
            rs(yr | mr, e);
          } catch (a) {
            hn(e, e.return, a);
          }
          break;
        }
        case b: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            hn(e, e.return, a);
          }
          break;
        }
      }
    }
    function lO(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          try {
            rs(Ir | mr, e);
          } catch (t) {
            hn(e, e.return, t);
          }
          break;
        }
      }
    }
    function uO(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee: {
          try {
            xo(yr | mr, e, e.return);
          } catch (a) {
            hn(e, e.return, a);
          }
          break;
        }
        case b: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && Q0(e, e.return, t);
          break;
        }
      }
    }
    function sO(e) {
      switch (e.tag) {
        case T:
        case q:
        case Ee:
          try {
            xo(Ir | mr, e, e.return);
          } catch (t) {
            hn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Sh = Symbol.for;
      Sh("selector.component"), Sh("selector.has_pseudo_class"), Sh("selector.role"), Sh("selector.test_id"), Sh("selector.text");
    }
    var cO = [];
    function fO() {
      cO.forEach(function(e) {
        return e();
      });
    }
    var dO = f.ReactCurrentActQueue;
    function pO(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function cR() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && dO.current !== null && m("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var hO = Math.ceil, Z0 = f.ReactCurrentDispatcher, J0 = f.ReactCurrentOwner, Gr = f.ReactCurrentBatchConfig, bo = f.ReactCurrentActQueue, Cr = (
      /*             */
      0
    ), fR = (
      /*               */
      1
    ), Qr = (
      /*                */
      2
    ), Wi = (
      /*                */
      4
    ), nu = 0, Ch = 1, wc = 2, Oy = 3, Eh = 4, dR = 5, eC = 6, At = Cr, wa = null, An = null, Er = ie, cl = ie, tC = Qu(ie), xr = nu, xh = null, Ly = ie, Th = ie, Ay = ie, Rh = null, Qa = null, nC = 0, pR = 500, hR = 1 / 0, vO = 500, ru = null;
    function bh() {
      hR = Xn() + vO;
    }
    function vR() {
      return hR;
    }
    var Ny = !1, rC = null, Sd = null, Dc = !1, is = null, wh = ie, aC = [], iC = null, mO = 50, Dh = 0, oC = null, lC = !1, Py = !1, yO = 50, Cd = 0, Uy = null, kh = an, Vy = ie, mR = !1;
    function zy() {
      return wa;
    }
    function Da() {
      return (At & (Qr | Wi)) !== Cr ? Xn() : (kh !== an || (kh = Xn()), kh);
    }
    function os(e) {
      var t = e.mode;
      if ((t & bt) === Ge)
        return nt;
      if ((At & Qr) !== Cr && Er !== ie)
        return Qs(Er);
      var a = d_() !== f_;
      if (a) {
        if (Gr.transition !== null) {
          var i = Gr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Vy === zt && (Vy = mp()), Vy;
      }
      var u = Ia();
      if (u !== zt)
        return u;
      var d = qD();
      return d;
    }
    function gO(e) {
      var t = e.mode;
      return (t & bt) === Ge ? nt : Bv();
    }
    function Tr(e, t, a, i) {
      BO(), mR && m("useInsertionEffect must not schedule updates."), lC && (Py = !0), Vu(e, a, i), (At & Qr) !== ie && e === wa ? $O(t) : (ra && Xs(e, t, a), WO(t), e === wa && ((At & Qr) === Cr && (Th = St(Th, a)), xr === Eh && ls(e, Er)), Ka(e, i), a === nt && At === Cr && (t.mode & bt) === Ge && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !bo.isBatchingLegacy && (bh(), mx()));
    }
    function SO(e, t, a) {
      var i = e.current;
      i.lanes = t, Vu(e, t, a), Ka(e, a);
    }
    function CO(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (At & Qr) !== Cr
      );
    }
    function Ka(e, t) {
      var a = e.callbackNode;
      _f(e, t);
      var i = kf(e, e === wa ? Er : ie);
      if (i === ie) {
        a !== null && LR(a), e.callbackNode = null, e.callbackPriority = zt;
        return;
      }
      var u = Qo(i), d = e.callbackPriority;
      if (d === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(bo.current !== null && a !== hC)) {
        a == null && d !== nt && m("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && LR(a);
      var h;
      if (u === nt)
        e.tag === Ku ? (bo.isBatchingLegacy !== null && (bo.didScheduleLegacyUpdate = !0), Qk(SR.bind(null, e))) : vx(SR.bind(null, e)), bo.current !== null ? bo.current.push(qu) : ZD(function() {
          (At & (Qr | Wi)) === Cr && qu();
        }), h = null;
      else {
        var g;
        switch (Kv(i)) {
          case Vr:
            g = Ns;
            break;
          case Ui:
            g = Yo;
            break;
          case Ha:
            g = lo;
            break;
          case Ba:
            g = Ml;
            break;
          default:
            g = lo;
            break;
        }
        h = vC(g, yR.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = h;
    }
    function yR(e, t) {
      if (z_(), kh = an, Vy = ie, (At & (Qr | Wi)) !== Cr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = iu();
      if (i && e.callbackNode !== a)
        return null;
      var u = kf(e, e === wa ? Er : ie);
      if (u === ie)
        return null;
      var d = !Of(e, u) && !Hv(e, u) && !t, h = d ? MO(e, u) : Fy(e, u);
      if (h !== nu) {
        if (h === wc) {
          var g = Mf(e);
          g !== ie && (u = g, h = uC(e, g));
        }
        if (h === Ch) {
          var C = xh;
          throw kc(e, ie), ls(e, u), Ka(e, Xn()), C;
        }
        if (h === eC)
          ls(e, u);
        else {
          var D = !Of(e, u), _ = e.current.alternate;
          if (D && !xO(_)) {
            if (h = Fy(e, u), h === wc) {
              var F = Mf(e);
              F !== ie && (u = F, h = uC(e, F));
            }
            if (h === Ch) {
              var z = xh;
              throw kc(e, ie), ls(e, u), Ka(e, Xn()), z;
            }
          }
          e.finishedWork = _, e.finishedLanes = u, EO(e, h, u);
        }
      }
      return Ka(e, Xn()), e.callbackNode === a ? yR.bind(null, e) : null;
    }
    function uC(e, t) {
      var a = Rh;
      if (Nf(e)) {
        var i = kc(e, t);
        i.flags |= kr, Hk(e.containerInfo);
      }
      var u = Fy(e, t);
      if (u !== wc) {
        var d = Qa;
        Qa = a, d !== null && gR(d);
      }
      return u;
    }
    function gR(e) {
      Qa === null ? Qa = e : Qa.push.apply(Qa, e);
    }
    function EO(e, t, a) {
      switch (t) {
        case nu:
        case Ch:
          throw new Error("Root did not complete. This is a bug in React.");
        case wc: {
          _c(e, Qa, ru);
          break;
        }
        case Oy: {
          if (ls(e, a), Hl(a) && // do not delay if we're inside an act() scope
          !AR()) {
            var i = nC + pR - Xn();
            if (i > 10) {
              var u = kf(e, ie);
              if (u !== ie)
                break;
              var d = e.suspendedLanes;
              if (!Bl(d, a)) {
                Da(), Lf(e, d);
                break;
              }
              e.timeoutHandle = iS(_c.bind(null, e, Qa, ru), i);
              break;
            }
          }
          _c(e, Qa, ru);
          break;
        }
        case Eh: {
          if (ls(e, a), hp(a))
            break;
          if (!AR()) {
            var h = di(e, a), g = h, C = Xn() - g, D = HO(C) - C;
            if (D > 10) {
              e.timeoutHandle = iS(_c.bind(null, e, Qa, ru), D);
              break;
            }
          }
          _c(e, Qa, ru);
          break;
        }
        case dR: {
          _c(e, Qa, ru);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function xO(e) {
      for (var t = e; ; ) {
        if (t.flags & Lu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var d = i[u], h = d.getSnapshot, g = d.value;
                try {
                  if (!ue(h(), g))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var C = t.child;
        if (t.subtreeFlags & Lu && C !== null) {
          C.return = t, t = C;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function ls(e, t) {
      t = Ks(t, Ay), t = Ks(t, Th), $v(e, t);
    }
    function SR(e) {
      if (j_(), (At & (Qr | Wi)) !== Cr)
        throw new Error("Should not already be working.");
      iu();
      var t = kf(e, ie);
      if (!ia(t, nt))
        return Ka(e, Xn()), null;
      var a = Fy(e, t);
      if (e.tag !== Ku && a === wc) {
        var i = Mf(e);
        i !== ie && (t = i, a = uC(e, i));
      }
      if (a === Ch) {
        var u = xh;
        throw kc(e, ie), ls(e, t), Ka(e, Xn()), u;
      }
      if (a === eC)
        throw new Error("Root did not complete. This is a bug in React.");
      var d = e.current.alternate;
      return e.finishedWork = d, e.finishedLanes = t, _c(e, Qa, ru), Ka(e, Xn()), null;
    }
    function TO(e, t) {
      t !== ie && (Af(e, St(t, nt)), Ka(e, Xn()), (At & (Qr | Wi)) === Cr && (bh(), qu()));
    }
    function sC(e, t) {
      var a = At;
      At |= fR;
      try {
        return e(t);
      } finally {
        At = a, At === Cr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !bo.isBatchingLegacy && (bh(), mx());
      }
    }
    function RO(e, t, a, i, u) {
      var d = Ia(), h = Gr.transition;
      try {
        return Gr.transition = null, Hn(Vr), e(t, a, i, u);
      } finally {
        Hn(d), Gr.transition = h, At === Cr && bh();
      }
    }
    function au(e) {
      is !== null && is.tag === Ku && (At & (Qr | Wi)) === Cr && iu();
      var t = At;
      At |= fR;
      var a = Gr.transition, i = Ia();
      try {
        return Gr.transition = null, Hn(Vr), e ? e() : void 0;
      } finally {
        Hn(i), Gr.transition = a, At = t, (At & (Qr | Wi)) === Cr && qu();
      }
    }
    function CR() {
      return (At & (Qr | Wi)) !== Cr;
    }
    function jy(e, t) {
      ca(tC, cl, e), cl = St(cl, t);
    }
    function cC(e) {
      cl = tC.current, sa(tC, e);
    }
    function kc(e, t) {
      e.finishedWork = null, e.finishedLanes = ie;
      var a = e.timeoutHandle;
      if (a !== oS && (e.timeoutHandle = oS, XD(a)), An !== null)
        for (var i = An.return; i !== null; ) {
          var u = i.alternate;
          KT(u, i), i = i.return;
        }
      wa = e;
      var d = Mc(e.current, null);
      return An = d, Er = cl = t, xr = nu, xh = null, Ly = ie, Th = ie, Ay = ie, Rh = null, Qa = null, S_(), yo.discardPendingWarnings(), d;
    }
    function ER(e, t) {
      do {
        var a = An;
        try {
          if (Km(), $x(), pn(), J0.current = null, a === null || a.return === null) {
            xr = Ch, xh = t, An = null;
            return;
          }
          if (Qe && a.mode & Ht && Ry(a, !0), Ze)
            if (xa(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Pi(a, i, Er);
            } else
              Us(a, t, Er);
          Q_(e, a.return, a, t, Er), bR(a);
        } catch (u) {
          t = u, An === a && a !== null ? (a = a.return, An = a) : a = An;
          continue;
        }
        return;
      } while (!0);
    }
    function xR() {
      var e = Z0.current;
      return Z0.current = Sy, e === null ? Sy : e;
    }
    function TR(e) {
      Z0.current = e;
    }
    function bO() {
      nC = Xn();
    }
    function _h(e) {
      Ly = St(e, Ly);
    }
    function wO() {
      xr === nu && (xr = Oy);
    }
    function fC() {
      (xr === nu || xr === Oy || xr === wc) && (xr = Eh), wa !== null && (Gs(Ly) || Gs(Th)) && ls(wa, Er);
    }
    function DO(e) {
      xr !== Eh && (xr = wc), Rh === null ? Rh = [e] : Rh.push(e);
    }
    function kO() {
      return xr === nu;
    }
    function Fy(e, t) {
      var a = At;
      At |= Qr;
      var i = xR();
      if (wa !== e || Er !== t) {
        if (ra) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Mh(e, Er), u.clear()), Wv(e, t);
        }
        ru = Cp(), kc(e, t);
      }
      Nl(t);
      do
        try {
          _O();
          break;
        } catch (d) {
          ER(e, d);
        }
      while (!0);
      if (Km(), At = a, TR(i), An !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return cf(), wa = null, Er = ie, xr;
    }
    function _O() {
      for (; An !== null; )
        RR(An);
    }
    function MO(e, t) {
      var a = At;
      At |= Qr;
      var i = xR();
      if (wa !== e || Er !== t) {
        if (ra) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Mh(e, Er), u.clear()), Wv(e, t);
        }
        ru = Cp(), bh(), kc(e, t);
      }
      Nl(t);
      do
        try {
          OO();
          break;
        } catch (d) {
          ER(e, d);
        }
      while (!0);
      return Km(), TR(i), At = a, An !== null ? (Vv(), nu) : (cf(), wa = null, Er = ie, xr);
    }
    function OO() {
      for (; An !== null && !Jd(); )
        RR(An);
    }
    function RR(e) {
      var t = e.alternate;
      Zt(e);
      var a;
      (e.mode & Ht) !== Ge ? (h0(e), a = dC(t, e, cl), Ry(e, !0)) : a = dC(t, e, cl), pn(), e.memoizedProps = e.pendingProps, a === null ? bR(e) : An = a, J0.current = null;
    }
    function bR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & As) === We) {
          Zt(t);
          var u = void 0;
          if ((t.mode & Ht) === Ge ? u = QT(a, t, cl) : (h0(t), u = QT(a, t, cl), Ry(t, !1)), pn(), u !== null) {
            An = u;
            return;
          }
        } else {
          var d = wM(a, t);
          if (d !== null) {
            d.flags &= Ov, An = d;
            return;
          }
          if ((t.mode & Ht) !== Ge) {
            Ry(t, !1);
            for (var h = t.actualDuration, g = t.child; g !== null; )
              h += g.actualDuration, g = g.sibling;
            t.actualDuration = h;
          }
          if (i !== null)
            i.flags |= As, i.subtreeFlags = We, i.deletions = null;
          else {
            xr = eC, An = null;
            return;
          }
        }
        var C = t.sibling;
        if (C !== null) {
          An = C;
          return;
        }
        t = i, An = t;
      } while (t !== null);
      xr === nu && (xr = dR);
    }
    function _c(e, t, a) {
      var i = Ia(), u = Gr.transition;
      try {
        Gr.transition = null, Hn(Vr), LO(e, t, a, i);
      } finally {
        Gr.transition = u, Hn(i);
      }
      return null;
    }
    function LO(e, t, a, i) {
      do
        iu();
      while (is !== null);
      if (IO(), (At & (Qr | Wi)) !== Cr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, d = e.finishedLanes;
      if (ip(d), u === null)
        return op(), null;
      if (d === ie && m("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = ie, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = zt;
      var h = St(u.lanes, u.childLanes);
      gp(e, h), e === wa && (wa = null, An = null, Er = ie), ((u.subtreeFlags & oo) !== We || (u.flags & oo) !== We) && (Dc || (Dc = !0, iC = a, vC(lo, function() {
        return iu(), null;
      })));
      var g = (u.subtreeFlags & (Ho | Bo | Io | oo)) !== We, C = (u.flags & (Ho | Bo | Io | oo)) !== We;
      if (g || C) {
        var D = Gr.transition;
        Gr.transition = null;
        var _ = Ia();
        Hn(Vr);
        var F = At;
        At |= Wi, J0.current = null, OM(e, u), mT(), $M(e, u, d), YD(e.containerInfo), e.current = u, Vs(d), WM(u, e, d), zs(), ep(), At = F, Hn(_), Gr.transition = D;
      } else
        e.current = u, mT();
      var z = Dc;
      if (Dc ? (Dc = !1, is = e, wh = d) : (Cd = 0, Uy = null), h = e.pendingLanes, h === ie && (Sd = null), z || _R(e.current, !1), np(u.stateNode, i), ra && e.memoizedUpdaters.clear(), fO(), Ka(e, Xn()), t !== null)
        for (var $ = e.onRecoverableError, Q = 0; Q < t.length; Q++) {
          var Z = t[Q], be = Z.stack, qe = Z.digest;
          $(Z.value, {
            componentStack: be,
            digest: qe
          });
        }
      if (Ny) {
        Ny = !1;
        var Ye = rC;
        throw rC = null, Ye;
      }
      return ia(wh, nt) && e.tag !== Ku && iu(), h = e.pendingLanes, ia(h, nt) ? (V_(), e === oC ? Dh++ : (Dh = 0, oC = e)) : Dh = 0, qu(), op(), null;
    }
    function iu() {
      if (is !== null) {
        var e = Kv(wh), t = Js(Ha, e), a = Gr.transition, i = Ia();
        try {
          return Gr.transition = null, Hn(t), NO();
        } finally {
          Hn(i), Gr.transition = a;
        }
      }
      return !1;
    }
    function AO(e) {
      aC.push(e), Dc || (Dc = !0, vC(lo, function() {
        return iu(), null;
      }));
    }
    function NO() {
      if (is === null)
        return !1;
      var e = iC;
      iC = null;
      var t = is, a = wh;
      if (is = null, wh = ie, (At & (Qr | Wi)) !== Cr)
        throw new Error("Cannot flush passive effects while already rendering.");
      lC = !0, Py = !1, Al(a);
      var i = At;
      At |= Wi, JM(t.current), KM(t, t.current, a, e);
      {
        var u = aC;
        aC = [];
        for (var d = 0; d < u.length; d++) {
          var h = u[d];
          PM(t, h);
        }
      }
      sp(), _R(t.current, !0), At = i, qu(), Py ? t === Uy ? Cd++ : (Cd = 0, Uy = t) : Cd = 0, lC = !1, Py = !1, rp(t);
      {
        var g = t.current.stateNode;
        g.effectDuration = 0, g.passiveEffectDuration = 0;
      }
      return !0;
    }
    function wR(e) {
      return Sd !== null && Sd.has(e);
    }
    function PO(e) {
      Sd === null ? Sd = /* @__PURE__ */ new Set([e]) : Sd.add(e);
    }
    function UO(e) {
      Ny || (Ny = !0, rC = e);
    }
    var VO = UO;
    function DR(e, t, a) {
      var i = Rc(a, t), u = RT(e, i, nt), d = Zu(e, u, nt), h = Da();
      d !== null && (Vu(d, nt, h), Ka(d, h));
    }
    function hn(e, t, a) {
      if (kM(a), Oh(!1), e.tag === k) {
        DR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === k) {
          DR(i, e, a);
          return;
        } else if (i.tag === b) {
          var u = i.type, d = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof d.componentDidCatch == "function" && !wR(d)) {
            var h = Rc(a, e), g = L0(i, h, nt), C = Zu(i, g, nt), D = Da();
            C !== null && (Vu(C, nt, D), Ka(C, D));
            return;
          }
        }
        i = i.return;
      }
      m(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function zO(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Da();
      Lf(e, a), GO(e), wa === e && Bl(Er, a) && (xr === Eh || xr === Oy && Hl(Er) && Xn() - nC < pR ? kc(e, ie) : Ay = St(Ay, a)), Ka(e, u);
    }
    function kR(e, t) {
      t === zt && (t = gO(e));
      var a = Da(), i = Wa(e, t);
      i !== null && (Vu(i, t, a), Ka(i, a));
    }
    function jO(e) {
      var t = e.memoizedState, a = zt;
      t !== null && (a = t.retryLane), kR(e, a);
    }
    function FO(e, t) {
      var a = zt, i;
      switch (e.tag) {
        case de:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case jt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), kR(e, a);
    }
    function HO(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : hO(e / 1960) * 1960;
    }
    function BO() {
      if (Dh > mO)
        throw Dh = 0, oC = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Cd > yO && (Cd = 0, Uy = null, m("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function IO() {
      yo.flushLegacyContextWarning(), yo.flushPendingUnsafeLifecycleWarnings();
    }
    function _R(e, t) {
      Zt(e), Hy(e, Fo, uO), t && Hy(e, Li, sO), Hy(e, Fo, oO), t && Hy(e, Li, lO), pn();
    }
    function Hy(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var d = i.subtreeFlags & t;
        i !== u && i.child !== null && d !== We ? i = i.child : ((i.flags & t) !== We && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var By = null;
    function MR(e) {
      {
        if ((At & Qr) !== Cr || !(e.mode & bt))
          return;
        var t = e.tag;
        if (t !== M && t !== k && t !== b && t !== T && t !== q && t !== Pe && t !== Ee)
          return;
        var a = lt(e) || "ReactComponent";
        if (By !== null) {
          if (By.has(a))
            return;
          By.add(a);
        } else
          By = /* @__PURE__ */ new Set([a]);
        var i = fr;
        try {
          Zt(e), m("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Zt(e) : pn();
        }
      }
    }
    var dC;
    {
      var YO = null;
      dC = function(e, t, a) {
        var i = zR(YO, t);
        try {
          return IT(e, t, a);
        } catch (d) {
          if (n_() || d !== null && typeof d == "object" && typeof d.then == "function")
            throw d;
          if (Km(), $x(), KT(e, t), zR(t, i), t.mode & Ht && h0(t), jo(null, IT, null, e, t, a), ao()) {
            var u = Ls();
            typeof u == "object" && u !== null && u._suppressLogging && typeof d == "object" && d !== null && !d._suppressLogging && (d._suppressLogging = !0);
          }
          throw d;
        }
      };
    }
    var OR = !1, pC;
    pC = /* @__PURE__ */ new Set();
    function $O(e) {
      if (bi && !N_())
        switch (e.tag) {
          case T:
          case q:
          case Ee: {
            var t = An && lt(An) || "Unknown", a = t;
            if (!pC.has(a)) {
              pC.add(a);
              var i = lt(e) || "Unknown";
              m("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case b: {
            OR || (m("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), OR = !0);
            break;
          }
        }
    }
    function Mh(e, t) {
      if (ra) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Xs(e, i, t);
        });
      }
    }
    var hC = {};
    function vC(e, t) {
      {
        var a = bo.current;
        return a !== null ? (a.push(t), hC) : Zd(e, t);
      }
    }
    function LR(e) {
      if (e !== hC)
        return Av(e);
    }
    function AR() {
      return bo.current !== null;
    }
    function WO(e) {
      {
        if (e.mode & bt) {
          if (!cR())
            return;
        } else if (!pO() || At !== Cr || e.tag !== T && e.tag !== q && e.tag !== Ee)
          return;
        if (bo.current === null) {
          var t = fr;
          try {
            Zt(e), m(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, lt(e));
          } finally {
            t ? Zt(e) : pn();
          }
        }
      }
    }
    function GO(e) {
      e.tag !== Ku && cR() && bo.current === null && m(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Oh(e) {
      mR = e;
    }
    var Gi = null, Ed = null, QO = function(e) {
      Gi = e;
    };
    function xd(e) {
      {
        if (Gi === null)
          return e;
        var t = Gi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function mC(e) {
      return xd(e);
    }
    function yC(e) {
      {
        if (Gi === null)
          return e;
        var t = Gi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = xd(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ae,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function NR(e, t) {
      {
        if (Gi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, d = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case b: {
            typeof i == "function" && (u = !0);
            break;
          }
          case T: {
            (typeof i == "function" || d === st) && (u = !0);
            break;
          }
          case q: {
            (d === ae || d === st) && (u = !0);
            break;
          }
          case Pe:
          case Ee: {
            (d === vt || d === st) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var h = Gi(a);
          if (h !== void 0 && h === Gi(i))
            return !0;
        }
        return !1;
      }
    }
    function PR(e) {
      {
        if (Gi === null || typeof WeakSet != "function")
          return;
        Ed === null && (Ed = /* @__PURE__ */ new WeakSet()), Ed.add(e);
      }
    }
    var KO = function(e, t) {
      {
        if (Gi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        iu(), au(function() {
          gC(e.current, i, a);
        });
      }
    }, qO = function(e, t) {
      {
        if (e.context !== vi)
          return;
        iu(), au(function() {
          Lh(t, e, null, null);
        });
      }
    };
    function gC(e, t, a) {
      {
        var i = e.alternate, u = e.child, d = e.sibling, h = e.tag, g = e.type, C = null;
        switch (h) {
          case T:
          case Ee:
          case b:
            C = g;
            break;
          case q:
            C = g.render;
            break;
        }
        if (Gi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var D = !1, _ = !1;
        if (C !== null) {
          var F = Gi(C);
          F !== void 0 && (a.has(F) ? _ = !0 : t.has(F) && (h === b ? _ = !0 : D = !0));
        }
        if (Ed !== null && (Ed.has(e) || i !== null && Ed.has(i)) && (_ = !0), _ && (e._debugNeedsRemount = !0), _ || D) {
          var z = Wa(e, nt);
          z !== null && Tr(z, e, nt, an);
        }
        u !== null && !_ && gC(u, t, a), d !== null && gC(d, t, a);
      }
    }
    var XO = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return SC(e.current, i, a), a;
      }
    };
    function SC(e, t, a) {
      {
        var i = e.child, u = e.sibling, d = e.tag, h = e.type, g = null;
        switch (d) {
          case T:
          case Ee:
          case b:
            g = h;
            break;
          case q:
            g = h.render;
            break;
        }
        var C = !1;
        g !== null && t.has(g) && (C = !0), C ? ZO(e, a) : i !== null && SC(i, t, a), u !== null && SC(u, t, a);
      }
    }
    function ZO(e, t) {
      {
        var a = JO(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case P:
              t.add(i.stateNode);
              return;
            case A:
              t.add(i.stateNode.containerInfo);
              return;
            case k:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function JO(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === P)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var CC;
    {
      CC = !1;
      try {
        var UR = Object.preventExtensions({});
      } catch {
        CC = !0;
      }
    }
    function eL(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = We, this.subtreeFlags = We, this.deletions = null, this.lanes = ie, this.childLanes = ie, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !CC && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var mi = function(e, t, a, i) {
      return new eL(e, t, a, i);
    };
    function EC(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function tL(e) {
      return typeof e == "function" && !EC(e) && e.defaultProps === void 0;
    }
    function nL(e) {
      if (typeof e == "function")
        return EC(e) ? b : T;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ae)
          return q;
        if (t === vt)
          return Pe;
      }
      return M;
    }
    function Mc(e, t) {
      var a = e.alternate;
      a === null ? (a = mi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = We, a.subtreeFlags = We, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case M:
        case T:
        case Ee:
          a.type = xd(e.type);
          break;
        case b:
          a.type = mC(e.type);
          break;
        case q:
          a.type = yC(e.type);
          break;
      }
      return a;
    }
    function rL(e, t) {
      e.flags &= zn | Cn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = ie, e.lanes = t, e.child = null, e.subtreeFlags = We, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = We, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function aL(e, t, a) {
      var i;
      return e === jm ? (i = bt, t === !0 && (i |= tn, i |= Bt)) : i = Ge, ra && (i |= Ht), mi(k, null, null, i);
    }
    function xC(e, t, a, i, u, d) {
      var h = M, g = e;
      if (typeof e == "function")
        EC(e) ? (h = b, g = mC(g)) : g = xd(g);
      else if (typeof e == "string")
        h = P;
      else
        e: switch (e) {
          case Ei:
            return us(a.children, u, d, t);
          case ti:
            h = se, u |= tn, (u & bt) !== Ge && (u |= Bt);
            break;
          case xi:
            return iL(a, u, d, t);
          case xe:
            return oL(a, u, d, t);
          case Ae:
            return lL(a, u, d, t);
          case Dn:
            return VR(a, u, d, t);
          case un:
          case Dt:
          case dn:
          case cr:
          case Rt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Ti:
                  h = re;
                  break e;
                case N:
                  h = Te;
                  break e;
                case ae:
                  h = q, g = yC(g);
                  break e;
                case vt:
                  h = Pe;
                  break e;
                case st:
                  h = Fe, g = null;
                  break e;
              }
            var C = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (C += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var D = i ? lt(i) : null;
              D && (C += `

Check the render method of \`` + D + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + C));
          }
        }
      var _ = mi(h, a, t, u);
      return _.elementType = e, _.type = g, _.lanes = d, _._debugOwner = i, _;
    }
    function TC(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, d = e.key, h = e.props, g = xC(u, d, h, i, t, a);
      return g._debugSource = e._source, g._debugOwner = e._owner, g;
    }
    function us(e, t, a, i) {
      var u = mi(ee, e, i, t);
      return u.lanes = a, u;
    }
    function iL(e, t, a, i) {
      typeof e.id != "string" && m('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = mi(pe, e, i, t | Ht);
      return u.elementType = xi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function oL(e, t, a, i) {
      var u = mi(de, e, i, t);
      return u.elementType = xe, u.lanes = a, u;
    }
    function lL(e, t, a, i) {
      var u = mi(jt, e, i, t);
      return u.elementType = Ae, u.lanes = a, u;
    }
    function VR(e, t, a, i) {
      var u = mi(Ue, e, i, t);
      u.elementType = Dn, u.lanes = a;
      var d = {
        isHidden: !1
      };
      return u.stateNode = d, u;
    }
    function RC(e, t, a) {
      var i = mi(K, e, null, t);
      return i.lanes = a, i;
    }
    function uL() {
      var e = mi(P, null, null, Ge);
      return e.elementType = "DELETED", e;
    }
    function sL(e) {
      var t = mi(wt, null, null, Ge);
      return t.stateNode = e, t;
    }
    function bC(e, t, a) {
      var i = e.children !== null ? e.children : [], u = mi(A, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function zR(e, t) {
      return e === null && (e = mi(M, null, null, Ge)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function cL(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = oS, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = zt, this.eventTimes = qs(ie), this.expirationTimes = qs(an), this.pendingLanes = ie, this.suspendedLanes = ie, this.pingedLanes = ie, this.expiredLanes = ie, this.mutableReadLanes = ie, this.finishedLanes = ie, this.entangledLanes = ie, this.entanglements = qs(ie), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var d = this.pendingUpdatersLaneMap = [], h = 0; h < Pl; h++)
          d.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case jm:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Ku:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function jR(e, t, a, i, u, d, h, g, C, D) {
      var _ = new cL(e, t, a, g, C), F = aL(t, d);
      _.current = F, F.stateNode = _;
      {
        var z = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        F.memoizedState = z;
      }
      return zS(F), _;
    }
    var wC = "18.3.1";
    function fL(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return qr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: sr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var DC, kC;
    DC = !1, kC = {};
    function FR(e) {
      if (!e)
        return vi;
      var t = Ou(e), a = Gk(t);
      if (t.tag === b) {
        var i = t.type;
        if (rl(i))
          return px(t, i, a);
      }
      return a;
    }
    function dL(e, t) {
      {
        var a = Ou(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = ta(a);
        if (u === null)
          return null;
        if (u.mode & tn) {
          var d = lt(a) || "Component";
          if (!kC[d]) {
            kC[d] = !0;
            var h = fr;
            try {
              Zt(u), a.mode & tn ? m("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d) : m("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d);
            } finally {
              h ? Zt(h) : pn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function HR(e, t, a, i, u, d, h, g) {
      var C = !1, D = null;
      return jR(e, t, C, D, a, i, u, d, h);
    }
    function BR(e, t, a, i, u, d, h, g, C, D) {
      var _ = !0, F = jR(a, i, _, e, u, d, h, g, C);
      F.context = FR(null);
      var z = F.current, $ = Da(), Q = os(z), Z = eu($, Q);
      return Z.callback = t ?? null, Zu(z, Z, Q), SO(F, Q, $), F;
    }
    function Lh(e, t, a, i) {
      tp(t, e);
      var u = t.current, d = Da(), h = os(u);
      xn(h);
      var g = FR(a);
      t.context === null ? t.context = g : t.pendingContext = g, bi && fr !== null && !DC && (DC = !0, m(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, lt(fr) || "Unknown"));
      var C = eu(d, h);
      C.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && m("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), C.callback = i);
      var D = Zu(u, C, h);
      return D !== null && (Tr(D, u, h, d), ey(D, u, h)), h;
    }
    function Iy(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case P:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function pL(e) {
      switch (e.tag) {
        case k: {
          var t = e.stateNode;
          if (Nf(t)) {
            var a = jv(t);
            TO(t, a);
          }
          break;
        }
        case de: {
          au(function() {
            var u = Wa(e, nt);
            if (u !== null) {
              var d = Da();
              Tr(u, e, nt, d);
            }
          });
          var i = nt;
          _C(e, i);
          break;
        }
      }
    }
    function IR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Yv(a.retryLane, t));
    }
    function _C(e, t) {
      IR(e, t);
      var a = e.alternate;
      a && IR(a, t);
    }
    function hL(e) {
      if (e.tag === de) {
        var t = Ys, a = Wa(e, t);
        if (a !== null) {
          var i = Da();
          Tr(a, e, t, i);
        }
        _C(e, t);
      }
    }
    function vL(e) {
      if (e.tag === de) {
        var t = os(e), a = Wa(e, t);
        if (a !== null) {
          var i = Da();
          Tr(a, e, t, i);
        }
        _C(e, t);
      }
    }
    function YR(e) {
      var t = vn(e);
      return t === null ? null : t.stateNode;
    }
    var $R = function(e) {
      return null;
    };
    function mL(e) {
      return $R(e);
    }
    var WR = function(e) {
      return !1;
    };
    function yL(e) {
      return WR(e);
    }
    var GR = null, QR = null, KR = null, qR = null, XR = null, ZR = null, JR = null, eb = null, tb = null;
    {
      var nb = function(e, t, a) {
        var i = t[a], u = xt(e) ? e.slice() : Ct({}, e);
        return a + 1 === t.length ? (xt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = nb(e[i], t, a + 1), u);
      }, rb = function(e, t) {
        return nb(e, t, 0);
      }, ab = function(e, t, a, i) {
        var u = t[i], d = xt(e) ? e.slice() : Ct({}, e);
        if (i + 1 === t.length) {
          var h = a[i];
          d[h] = d[u], xt(d) ? d.splice(u, 1) : delete d[u];
        } else
          d[u] = ab(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return d;
      }, ib = function(e, t, a) {
        if (t.length !== a.length) {
          R("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              R("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return ab(e, t, a, 0);
      }, ob = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], d = xt(e) ? e.slice() : Ct({}, e);
        return d[u] = ob(e[u], t, a + 1, i), d;
      }, lb = function(e, t, a) {
        return ob(e, t, 0, a);
      }, MC = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      GR = function(e, t, a, i) {
        var u = MC(e, t);
        if (u !== null) {
          var d = lb(u.memoizedState, a, i);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = Ct({}, e.memoizedProps);
          var h = Wa(e, nt);
          h !== null && Tr(h, e, nt, an);
        }
      }, QR = function(e, t, a) {
        var i = MC(e, t);
        if (i !== null) {
          var u = rb(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Ct({}, e.memoizedProps);
          var d = Wa(e, nt);
          d !== null && Tr(d, e, nt, an);
        }
      }, KR = function(e, t, a, i) {
        var u = MC(e, t);
        if (u !== null) {
          var d = ib(u.memoizedState, a, i);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = Ct({}, e.memoizedProps);
          var h = Wa(e, nt);
          h !== null && Tr(h, e, nt, an);
        }
      }, qR = function(e, t, a) {
        e.pendingProps = lb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Wa(e, nt);
        i !== null && Tr(i, e, nt, an);
      }, XR = function(e, t) {
        e.pendingProps = rb(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Wa(e, nt);
        a !== null && Tr(a, e, nt, an);
      }, ZR = function(e, t, a) {
        e.pendingProps = ib(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Wa(e, nt);
        i !== null && Tr(i, e, nt, an);
      }, JR = function(e) {
        var t = Wa(e, nt);
        t !== null && Tr(t, e, nt, an);
      }, eb = function(e) {
        $R = e;
      }, tb = function(e) {
        WR = e;
      };
    }
    function gL(e) {
      var t = ta(e);
      return t === null ? null : t.stateNode;
    }
    function SL(e) {
      return null;
    }
    function CL() {
      return fr;
    }
    function EL(e) {
      var t = e.findFiberByHostInstance, a = f.ReactCurrentDispatcher;
      return Nu({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: GR,
        overrideHookStateDeletePath: QR,
        overrideHookStateRenamePath: KR,
        overrideProps: qR,
        overridePropsDeletePath: XR,
        overridePropsRenamePath: ZR,
        setErrorHandler: eb,
        setSuspenseHandler: tb,
        scheduleUpdate: JR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: gL,
        findFiberByHostInstance: t || SL,
        // React Refresh
        findHostInstancesForRefresh: XO,
        scheduleRefresh: KO,
        scheduleRoot: qO,
        setRefreshHandler: QO,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: CL,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: wC
      });
    }
    var ub = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function OC(e) {
      this._internalRoot = e;
    }
    Yy.prototype.render = OC.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? m("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : $y(arguments[1]) ? m("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && m("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Un) {
          var i = YR(t.current);
          i && i.parentNode !== a && m("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Lh(e, t, null, null);
    }, Yy.prototype.unmount = OC.prototype.unmount = function() {
      typeof arguments[0] == "function" && m("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        CR() && m("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), au(function() {
          Lh(null, e, null, null);
        }), ux(t);
      }
    };
    function xL(e, t) {
      if (!$y(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      sb(e);
      var a = !1, i = !1, u = "", d = ub;
      t != null && (t.hydrate ? R("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Ar && m(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var h = HR(e, jm, null, a, i, u, d);
      Lm(h.current, e);
      var g = e.nodeType === Un ? e.parentNode : e;
      return zp(g), new OC(h);
    }
    function Yy(e) {
      this._internalRoot = e;
    }
    function TL(e) {
      e && em(e);
    }
    Yy.prototype.unstable_scheduleHydration = TL;
    function RL(e, t, a) {
      if (!$y(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      sb(e), t === void 0 && m("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, d = !1, h = !1, g = "", C = ub;
      a != null && (a.unstable_strictMode === !0 && (d = !0), a.identifierPrefix !== void 0 && (g = a.identifierPrefix), a.onRecoverableError !== void 0 && (C = a.onRecoverableError));
      var D = BR(t, null, e, jm, i, d, h, g, C);
      if (Lm(D.current, e), zp(e), u)
        for (var _ = 0; _ < u.length; _++) {
          var F = u[_];
          k_(D, F);
        }
      return new Yy(D);
    }
    function $y(e) {
      return !!(e && (e.nodeType === Zr || e.nodeType === ro || e.nodeType === Fd));
    }
    function Ah(e) {
      return !!(e && (e.nodeType === Zr || e.nodeType === ro || e.nodeType === Fd || e.nodeType === Un && e.nodeValue === " react-mount-point-unstable "));
    }
    function sb(e) {
      e.nodeType === Zr && e.tagName && e.tagName.toUpperCase() === "BODY" && m("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), Kp(e) && (e._reactRootContainer ? m("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : m("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var bL = f.ReactCurrentOwner, cb;
    cb = function(e) {
      if (e._reactRootContainer && e.nodeType !== Un) {
        var t = YR(e._reactRootContainer.current);
        t && t.parentNode !== e && m("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = LC(e), u = !!(i && Gu(i));
      u && !a && m("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Zr && e.tagName && e.tagName.toUpperCase() === "BODY" && m("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function LC(e) {
      return e ? e.nodeType === ro ? e.documentElement : e.firstChild : null;
    }
    function fb() {
    }
    function wL(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var d = i;
          i = function() {
            var z = Iy(h);
            d.call(z);
          };
        }
        var h = BR(
          t,
          i,
          e,
          Ku,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          fb
        );
        e._reactRootContainer = h, Lm(h.current, e);
        var g = e.nodeType === Un ? e.parentNode : e;
        return zp(g), au(), h;
      } else {
        for (var C; C = e.lastChild; )
          e.removeChild(C);
        if (typeof i == "function") {
          var D = i;
          i = function() {
            var z = Iy(_);
            D.call(z);
          };
        }
        var _ = HR(
          e,
          Ku,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          fb
        );
        e._reactRootContainer = _, Lm(_.current, e);
        var F = e.nodeType === Un ? e.parentNode : e;
        return zp(F), au(function() {
          Lh(t, _, a, i);
        }), _;
      }
    }
    function DL(e, t) {
      e !== null && typeof e != "function" && m("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Wy(e, t, a, i, u) {
      cb(a), DL(u === void 0 ? null : u, "render");
      var d = a._reactRootContainer, h;
      if (!d)
        h = wL(a, t, e, u, i);
      else {
        if (h = d, typeof u == "function") {
          var g = u;
          u = function() {
            var C = Iy(h);
            g.call(C);
          };
        }
        Lh(t, h, e, u);
      }
      return Iy(h);
    }
    var db = !1;
    function kL(e) {
      {
        db || (db = !0, m("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = bL.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || m("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ut(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Zr ? e : dL(e, "findDOMNode");
    }
    function _L(e, t, a) {
      if (m("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ah(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Kp(t) && t._reactRootContainer === void 0;
        i && m("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Wy(null, e, t, !0, a);
    }
    function ML(e, t, a) {
      if (m("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ah(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Kp(t) && t._reactRootContainer === void 0;
        i && m("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Wy(null, e, t, !1, a);
    }
    function OL(e, t, a, i) {
      if (m("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ah(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !_g(e))
        throw new Error("parentComponent must be a valid React Component");
      return Wy(e, t, a, !1, i);
    }
    var pb = !1;
    function LL(e) {
      if (pb || (pb = !0, m("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Ah(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = Kp(e) && e._reactRootContainer === void 0;
        t && m("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = LC(e), i = a && !Gu(a);
          i && m("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return au(function() {
          Wy(null, null, e, !1, function() {
            e._reactRootContainer = null, ux(e);
          });
        }), !0;
      } else {
        {
          var u = LC(e), d = !!(u && Gu(u)), h = e.nodeType === Zr && Ah(e.parentNode) && !!e.parentNode._reactRootContainer;
          d && m("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", h ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Mr(pL), zu(hL), qv(vL), tc(Ia), Ep(Gv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && m("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), qc(ND), kg(sC, RO, au);
    function AL(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!$y(t))
        throw new Error("Target container is not a DOM element.");
      return fL(e, t, null, a);
    }
    function NL(e, t, a, i) {
      return OL(e, t, a, i);
    }
    var AC = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Gu, Jf, Am, Du, Xc, sC]
    };
    function PL(e, t) {
      return AC.usingClientEntryPoint || m('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), xL(e, t);
    }
    function UL(e, t, a) {
      return AC.usingClientEntryPoint || m('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), RL(e, t, a);
    }
    function VL(e) {
      return CR() && m("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), au(e);
    }
    var zL = EL({
      findFiberByHostInstance: vc,
      bundleType: 1,
      version: wC,
      rendererPackageName: "react-dom"
    });
    if (!zL && Kt && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var hb = window.location.protocol;
      /^(https?|file):$/.test(hb) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (hb === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Xa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = AC, Xa.createPortal = AL, Xa.createRoot = PL, Xa.findDOMNode = kL, Xa.flushSync = VL, Xa.hydrate = _L, Xa.hydrateRoot = UL, Xa.render = ML, Xa.unmountComponentAtNode = LL, Xa.unstable_batchedUpdates = sC, Xa.unstable_renderSubtreeIntoContainer = NL, Xa.version = wC, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Xa;
}
function Lw() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Lw);
    } catch (l) {
      console.error(l);
    }
  }
}
process.env.NODE_ENV === "production" ? (Lw(), ZC.exports = QL()) : ZC.exports = KL();
var qL = ZC.exports, Vh = qL;
if (process.env.NODE_ENV === "production")
  Bh.createRoot = Vh.createRoot, Bh.hydrateRoot = Vh.hydrateRoot;
else {
  var Qy = Vh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Bh.createRoot = function(l, s) {
    Qy.usingClientEntryPoint = !0;
    try {
      return Vh.createRoot(l, s);
    } finally {
      Qy.usingClientEntryPoint = !1;
    }
  }, Bh.hydrateRoot = function(l, s, f) {
    Qy.usingClientEntryPoint = !0;
    try {
      return Vh.hydrateRoot(l, s, f);
    } finally {
      Qy.usingClientEntryPoint = !1;
    }
  };
}
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var XL = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ZL = (l) => l.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim(), fu = (l, s) => {
  const f = ge.forwardRef(
    ({ color: v = "currentColor", size: S = 24, strokeWidth: R = 2, absoluteStrokeWidth: m, className: w = "", children: T, ...b }, M) => ge.createElement(
      "svg",
      {
        ref: M,
        ...XL,
        width: S,
        height: S,
        stroke: v,
        strokeWidth: m ? Number(R) * 24 / Number(S) : R,
        className: ["lucide", `lucide-${ZL(l)}`, w].join(" "),
        ...b
      },
      [
        ...s.map(([k, A]) => ge.createElement(k, A)),
        ...Array.isArray(T) ? T : [T]
      ]
    )
  );
  return f.displayName = `${l}`, f;
};
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const JL = fu("Activity", [
  ["path", { d: "M22 12h-4l-3 9L9 3l-3 9H2", key: "d5dnw9" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const eA = fu("FileJson", [
  [
    "path",
    { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z", key: "1nnpy2" }
  ],
  ["polyline", { points: "14 2 14 8 20 8", key: "1ew0cm" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tA = fu("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nA = fu("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rA = fu("Monitor", [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rb = fu("Power", [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bb = fu("RefreshCcw", [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aA = fu("ShieldCheck", [
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10", key: "1irkt0" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iA = fu("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
]), Aw = ge.createContext({
  transformPagePoint: (l) => l,
  isStatic: !1,
  reducedMotion: "never"
}), cg = ge.createContext({}), fg = ge.createContext(null), dg = typeof document < "u", pE = dg ? ge.useLayoutEffect : ge.useEffect, Nw = ge.createContext({ strict: !1 }), hE = (l) => l.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), oA = "framerAppearId", Pw = "data-" + hE(oA);
function lA(l, s, f, v) {
  const { visualElement: S } = ge.useContext(cg), R = ge.useContext(Nw), m = ge.useContext(fg), w = ge.useContext(Aw).reducedMotion, T = ge.useRef();
  v = v || R.renderer, !T.current && v && (T.current = v(l, {
    visualState: s,
    parent: S,
    props: f,
    presenceContext: m,
    blockInitialAnimation: m ? m.initial === !1 : !1,
    reducedMotionConfig: w
  }));
  const b = T.current;
  ge.useInsertionEffect(() => {
    b && b.update(f, m);
  });
  const M = ge.useRef(!!(f[Pw] && !window.HandoffComplete));
  return pE(() => {
    b && (b.render(), M.current && b.animationState && b.animationState.animateChanges());
  }), ge.useEffect(() => {
    b && (b.updateFeatures(), !M.current && b.animationState && b.animationState.animateChanges(), M.current && (M.current = !1, window.HandoffComplete = !0));
  }), b;
}
function Rd(l) {
  return l && typeof l == "object" && Object.prototype.hasOwnProperty.call(l, "current");
}
function uA(l, s, f) {
  return ge.useCallback(
    (v) => {
      v && l.mount && l.mount(v), s && (v ? s.mount(v) : s.unmount()), f && (typeof f == "function" ? f(v) : Rd(f) && (f.current = v));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [s]
  );
}
function Qh(l) {
  return typeof l == "string" || Array.isArray(l);
}
function pg(l) {
  return l !== null && typeof l == "object" && typeof l.start == "function";
}
const vE = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], mE = ["initial", ...vE];
function hg(l) {
  return pg(l.animate) || mE.some((s) => Qh(l[s]));
}
function Uw(l) {
  return !!(hg(l) || l.variants);
}
function sA(l, s) {
  if (hg(l)) {
    const { initial: f, animate: v } = l;
    return {
      initial: f === !1 || Qh(f) ? f : void 0,
      animate: Qh(v) ? v : void 0
    };
  }
  return l.inherit !== !1 ? s : {};
}
function cA(l) {
  const { initial: s, animate: f } = sA(l, ge.useContext(cg));
  return ge.useMemo(() => ({ initial: s, animate: f }), [wb(s), wb(f)]);
}
function wb(l) {
  return Array.isArray(l) ? l.join(" ") : l;
}
const Db = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Kh = {};
for (const l in Db)
  Kh[l] = {
    isEnabled: (s) => Db[l].some((f) => !!s[f])
  };
function fA(l) {
  for (const s in l)
    Kh[s] = {
      ...Kh[s],
      ...l[s]
    };
}
const yE = ge.createContext({}), Vw = ge.createContext({}), dA = Symbol.for("motionComponentSymbol");
function pA({ preloadedFeatures: l, createVisualElement: s, useRender: f, useVisualState: v, Component: S }) {
  l && fA(l);
  function R(w, T) {
    let b;
    const M = {
      ...ge.useContext(Aw),
      ...w,
      layoutId: hA(w)
    }, { isStatic: k } = M, A = cA(w), P = v(w, k);
    if (!k && dg) {
      A.visualElement = lA(S, P, M, s);
      const K = ge.useContext(Vw), ee = ge.useContext(Nw).strict;
      A.visualElement && (b = A.visualElement.loadFeatures(
        // Note: Pass the full new combined props to correctly re-render dynamic feature components.
        M,
        ee,
        l,
        K
      ));
    }
    return ge.createElement(
      cg.Provider,
      { value: A },
      b && A.visualElement ? ge.createElement(b, { visualElement: A.visualElement, ...M }) : null,
      f(S, w, uA(P, A.visualElement, T), P, k, A.visualElement)
    );
  }
  const m = ge.forwardRef(R);
  return m[dA] = S, m;
}
function hA({ layoutId: l }) {
  const s = ge.useContext(yE).id;
  return s && l !== void 0 ? s + "-" + l : l;
}
function vA(l) {
  function s(v, S = {}) {
    return pA(l(v, S));
  }
  if (typeof Proxy > "u")
    return s;
  const f = /* @__PURE__ */ new Map();
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (v, S) => (f.has(S) || f.set(S, s(S)), f.get(S))
  });
}
const mA = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function gE(l) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof l != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    l.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(mA.indexOf(l) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/.test(l))
    )
  );
}
const ng = {};
function yA(l) {
  Object.assign(ng, l);
}
const Xh = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Uc = new Set(Xh);
function zw(l, { layout: s, layoutId: f }) {
  return Uc.has(l) || l.startsWith("origin") || (s || f !== void 0) && (!!ng[l] || l === "opacity");
}
const Za = (l) => !!(l && l.getVelocity), gA = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, SA = Xh.length;
function CA(l, { enableHardwareAcceleration: s = !0, allowTransformNone: f = !0 }, v, S) {
  let R = "";
  for (let m = 0; m < SA; m++) {
    const w = Xh[m];
    if (l[w] !== void 0) {
      const T = gA[w] || w;
      R += `${T}(${l[w]}) `;
    }
  }
  return s && !l.z && (R += "translateZ(0)"), R = R.trim(), S ? R = S(l, v ? "" : R) : f && v && (R = "none"), R;
}
const jw = (l) => (s) => typeof s == "string" && s.startsWith(l), Fw = jw("--"), JC = jw("var(--"), EA = /var\s*\(\s*--[\w-]+(\s*,\s*(?:(?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)+)?\s*\)/g, xA = (l, s) => s && typeof l == "number" ? s.transform(l) : l, ps = (l, s, f) => Math.min(Math.max(f, l), s), Vc = {
  test: (l) => typeof l == "number",
  parse: parseFloat,
  transform: (l) => l
}, Yh = {
  ...Vc,
  transform: (l) => ps(0, 1, l)
}, Ky = {
  ...Vc,
  default: 1
}, $h = (l) => Math.round(l * 1e5) / 1e5, vg = /(-)?([\d]*\.?[\d])+/g, Hw = /(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, TA = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function Zh(l) {
  return typeof l == "string";
}
const Jh = (l) => ({
  test: (s) => Zh(s) && s.endsWith(l) && s.split(" ").length === 1,
  parse: parseFloat,
  transform: (s) => `${s}${l}`
}), ss = Jh("deg"), dl = Jh("%"), ut = Jh("px"), RA = Jh("vh"), bA = Jh("vw"), kb = {
  ...dl,
  parse: (l) => dl.parse(l) / 100,
  transform: (l) => dl.transform(l * 100)
}, _b = {
  ...Vc,
  transform: Math.round
}, Bw = {
  // Border props
  borderWidth: ut,
  borderTopWidth: ut,
  borderRightWidth: ut,
  borderBottomWidth: ut,
  borderLeftWidth: ut,
  borderRadius: ut,
  radius: ut,
  borderTopLeftRadius: ut,
  borderTopRightRadius: ut,
  borderBottomRightRadius: ut,
  borderBottomLeftRadius: ut,
  // Positioning props
  width: ut,
  maxWidth: ut,
  height: ut,
  maxHeight: ut,
  size: ut,
  top: ut,
  right: ut,
  bottom: ut,
  left: ut,
  // Spacing props
  padding: ut,
  paddingTop: ut,
  paddingRight: ut,
  paddingBottom: ut,
  paddingLeft: ut,
  margin: ut,
  marginTop: ut,
  marginRight: ut,
  marginBottom: ut,
  marginLeft: ut,
  // Transform props
  rotate: ss,
  rotateX: ss,
  rotateY: ss,
  rotateZ: ss,
  scale: Ky,
  scaleX: Ky,
  scaleY: Ky,
  scaleZ: Ky,
  skew: ss,
  skewX: ss,
  skewY: ss,
  distance: ut,
  translateX: ut,
  translateY: ut,
  translateZ: ut,
  x: ut,
  y: ut,
  z: ut,
  perspective: ut,
  transformPerspective: ut,
  opacity: Yh,
  originX: kb,
  originY: kb,
  originZ: ut,
  // Misc
  zIndex: _b,
  // SVG
  fillOpacity: Yh,
  strokeOpacity: Yh,
  numOctaves: _b
};
function SE(l, s, f, v) {
  const { style: S, vars: R, transform: m, transformOrigin: w } = l;
  let T = !1, b = !1, M = !0;
  for (const k in s) {
    const A = s[k];
    if (Fw(k)) {
      R[k] = A;
      continue;
    }
    const P = Bw[k], K = xA(A, P);
    if (Uc.has(k)) {
      if (T = !0, m[k] = K, !M)
        continue;
      A !== (P.default || 0) && (M = !1);
    } else k.startsWith("origin") ? (b = !0, w[k] = K) : S[k] = K;
  }
  if (s.transform || (T || v ? S.transform = CA(l.transform, f, M, v) : S.transform && (S.transform = "none")), b) {
    const { originX: k = "50%", originY: A = "50%", originZ: P = 0 } = w;
    S.transformOrigin = `${k} ${A} ${P}`;
  }
}
const CE = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Iw(l, s, f) {
  for (const v in s)
    !Za(s[v]) && !zw(v, f) && (l[v] = s[v]);
}
function wA({ transformTemplate: l }, s, f) {
  return ge.useMemo(() => {
    const v = CE();
    return SE(v, s, { enableHardwareAcceleration: !f }, l), Object.assign({}, v.vars, v.style);
  }, [s]);
}
function DA(l, s, f) {
  const v = l.style || {}, S = {};
  return Iw(S, v, l), Object.assign(S, wA(l, s, f)), l.transformValues ? l.transformValues(S) : S;
}
function kA(l, s, f) {
  const v = {}, S = DA(l, s, f);
  return l.drag && l.dragListener !== !1 && (v.draggable = !1, S.userSelect = S.WebkitUserSelect = S.WebkitTouchCallout = "none", S.touchAction = l.drag === !0 ? "none" : `pan-${l.drag === "x" ? "y" : "x"}`), l.tabIndex === void 0 && (l.onTap || l.onTapStart || l.whileTap) && (v.tabIndex = 0), v.style = S, v;
}
const _A = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "transformValues",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function rg(l) {
  return l.startsWith("while") || l.startsWith("drag") && l !== "draggable" || l.startsWith("layout") || l.startsWith("onTap") || l.startsWith("onPan") || l.startsWith("onLayout") || _A.has(l);
}
let Yw = (l) => !rg(l);
function MA(l) {
  l && (Yw = (s) => s.startsWith("on") ? !rg(s) : l(s));
}
try {
  MA(require("@emotion/is-prop-valid").default);
} catch {
}
function OA(l, s, f) {
  const v = {};
  for (const S in l)
    S === "values" && typeof l.values == "object" || (Yw(S) || f === !0 && rg(S) || !s && !rg(S) || // If trying to use native HTML drag events, forward drag listeners
    l.draggable && S.startsWith("onDrag")) && (v[S] = l[S]);
  return v;
}
function Mb(l, s, f) {
  return typeof l == "string" ? l : ut.transform(s + f * l);
}
function LA(l, s, f) {
  const v = Mb(s, l.x, l.width), S = Mb(f, l.y, l.height);
  return `${v} ${S}`;
}
const AA = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, NA = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function PA(l, s, f = 1, v = 0, S = !0) {
  l.pathLength = 1;
  const R = S ? AA : NA;
  l[R.offset] = ut.transform(-v);
  const m = ut.transform(s), w = ut.transform(f);
  l[R.array] = `${m} ${w}`;
}
function EE(l, {
  attrX: s,
  attrY: f,
  attrScale: v,
  originX: S,
  originY: R,
  pathLength: m,
  pathSpacing: w = 1,
  pathOffset: T = 0,
  // This is object creation, which we try to avoid per-frame.
  ...b
}, M, k, A) {
  if (SE(l, b, M, A), k) {
    l.style.viewBox && (l.attrs.viewBox = l.style.viewBox);
    return;
  }
  l.attrs = l.style, l.style = {};
  const { attrs: P, style: K, dimensions: ee } = l;
  P.transform && (ee && (K.transform = P.transform), delete P.transform), ee && (S !== void 0 || R !== void 0 || K.transform) && (K.transformOrigin = LA(ee, S !== void 0 ? S : 0.5, R !== void 0 ? R : 0.5)), s !== void 0 && (P.x = s), f !== void 0 && (P.y = f), v !== void 0 && (P.scale = v), m !== void 0 && PA(P, m, w, T, !1);
}
const $w = () => ({
  ...CE(),
  attrs: {}
}), xE = (l) => typeof l == "string" && l.toLowerCase() === "svg";
function UA(l, s, f, v) {
  const S = ge.useMemo(() => {
    const R = $w();
    return EE(R, s, { enableHardwareAcceleration: !1 }, xE(v), l.transformTemplate), {
      ...R.attrs,
      style: { ...R.style }
    };
  }, [s]);
  if (l.style) {
    const R = {};
    Iw(R, l.style, l), S.style = { ...R, ...S.style };
  }
  return S;
}
function VA(l = !1) {
  return (f, v, S, { latestValues: R }, m) => {
    const T = (gE(f) ? UA : kA)(v, R, m, f), M = {
      ...OA(v, typeof f == "string", l),
      ...T,
      ref: S
    }, { children: k } = v, A = ge.useMemo(() => Za(k) ? k.get() : k, [k]);
    return ge.createElement(f, {
      ...M,
      children: A
    });
  };
}
function Ww(l, { style: s, vars: f }, v, S) {
  Object.assign(l.style, s, S && S.getProjectionStyles(v));
  for (const R in f)
    l.style.setProperty(R, f[R]);
}
const Gw = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function Qw(l, s, f, v) {
  Ww(l, s, void 0, v);
  for (const S in s.attrs)
    l.setAttribute(Gw.has(S) ? S : hE(S), s.attrs[S]);
}
function TE(l, s) {
  const { style: f } = l, v = {};
  for (const S in f)
    (Za(f[S]) || s.style && Za(s.style[S]) || zw(S, l)) && (v[S] = f[S]);
  return v;
}
function Kw(l, s) {
  const f = TE(l, s);
  for (const v in l)
    if (Za(l[v]) || Za(s[v])) {
      const S = Xh.indexOf(v) !== -1 ? "attr" + v.charAt(0).toUpperCase() + v.substring(1) : v;
      f[S] = l[v];
    }
  return f;
}
function RE(l, s, f, v = {}, S = {}) {
  return typeof s == "function" && (s = s(f !== void 0 ? f : l.custom, v, S)), typeof s == "string" && (s = l.variants && l.variants[s]), typeof s == "function" && (s = s(f !== void 0 ? f : l.custom, v, S)), s;
}
function qw(l) {
  const s = ge.useRef(null);
  return s.current === null && (s.current = l()), s.current;
}
const ag = (l) => Array.isArray(l), zA = (l) => !!(l && typeof l == "object" && l.mix && l.toValue), jA = (l) => ag(l) ? l[l.length - 1] || 0 : l;
function eg(l) {
  const s = Za(l) ? l.get() : l;
  return zA(s) ? s.toValue() : s;
}
function FA({ scrapeMotionValuesFromProps: l, createRenderState: s, onMount: f }, v, S, R) {
  const m = {
    latestValues: HA(v, S, R, l),
    renderState: s()
  };
  return f && (m.mount = (w) => f(v, w, m)), m;
}
const Xw = (l) => (s, f) => {
  const v = ge.useContext(cg), S = ge.useContext(fg), R = () => FA(l, s, v, S);
  return f ? R() : qw(R);
};
function HA(l, s, f, v) {
  const S = {}, R = v(l, {});
  for (const A in R)
    S[A] = eg(R[A]);
  let { initial: m, animate: w } = l;
  const T = hg(l), b = Uw(l);
  s && b && !T && l.inherit !== !1 && (m === void 0 && (m = s.initial), w === void 0 && (w = s.animate));
  let M = f ? f.initial === !1 : !1;
  M = M || m === !1;
  const k = M ? w : m;
  return k && typeof k != "boolean" && !pg(k) && (Array.isArray(k) ? k : [k]).forEach((P) => {
    const K = RE(l, P);
    if (!K)
      return;
    const { transitionEnd: ee, transition: se, ...Te } = K;
    for (const re in Te) {
      let q = Te[re];
      if (Array.isArray(q)) {
        const pe = M ? q.length - 1 : 0;
        q = q[pe];
      }
      q !== null && (S[re] = q);
    }
    for (const re in ee)
      S[re] = ee[re];
  }), S;
}
const $n = (l) => l;
class Ob {
  constructor() {
    this.order = [], this.scheduled = /* @__PURE__ */ new Set();
  }
  add(s) {
    if (!this.scheduled.has(s))
      return this.scheduled.add(s), this.order.push(s), !0;
  }
  remove(s) {
    const f = this.order.indexOf(s);
    f !== -1 && (this.order.splice(f, 1), this.scheduled.delete(s));
  }
  clear() {
    this.order.length = 0, this.scheduled.clear();
  }
}
function BA(l) {
  let s = new Ob(), f = new Ob(), v = 0, S = !1, R = !1;
  const m = /* @__PURE__ */ new WeakSet(), w = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (T, b = !1, M = !1) => {
      const k = M && S, A = k ? s : f;
      return b && m.add(T), A.add(T) && k && S && (v = s.order.length), T;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (T) => {
      f.remove(T), m.delete(T);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (T) => {
      if (S) {
        R = !0;
        return;
      }
      if (S = !0, [s, f] = [f, s], f.clear(), v = s.order.length, v)
        for (let b = 0; b < v; b++) {
          const M = s.order[b];
          M(T), m.has(M) && (w.schedule(M), l());
        }
      S = !1, R && (R = !1, w.process(T));
    }
  };
  return w;
}
const qy = [
  "prepare",
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
], IA = 40;
function YA(l, s) {
  let f = !1, v = !0;
  const S = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, R = qy.reduce((k, A) => (k[A] = BA(() => f = !0), k), {}), m = (k) => R[k].process(S), w = () => {
    const k = performance.now();
    f = !1, S.delta = v ? 1e3 / 60 : Math.max(Math.min(k - S.timestamp, IA), 1), S.timestamp = k, S.isProcessing = !0, qy.forEach(m), S.isProcessing = !1, f && s && (v = !1, l(w));
  }, T = () => {
    f = !0, v = !0, S.isProcessing || l(w);
  };
  return { schedule: qy.reduce((k, A) => {
    const P = R[A];
    return k[A] = (K, ee = !1, se = !1) => (f || T(), P.schedule(K, ee, se)), k;
  }, {}), cancel: (k) => qy.forEach((A) => R[A].cancel(k)), state: S, steps: R };
}
const { schedule: yn, cancel: cu, state: ha, steps: UC } = YA(typeof requestAnimationFrame < "u" ? requestAnimationFrame : $n, !0), $A = {
  useVisualState: Xw({
    scrapeMotionValuesFromProps: Kw,
    createRenderState: $w,
    onMount: (l, s, { renderState: f, latestValues: v }) => {
      yn.read(() => {
        try {
          f.dimensions = typeof s.getBBox == "function" ? s.getBBox() : s.getBoundingClientRect();
        } catch {
          f.dimensions = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          };
        }
      }), yn.render(() => {
        EE(f, v, { enableHardwareAcceleration: !1 }, xE(s.tagName), l.transformTemplate), Qw(s, f);
      });
    }
  })
}, WA = {
  useVisualState: Xw({
    scrapeMotionValuesFromProps: TE,
    createRenderState: CE
  })
};
function GA(l, { forwardMotionProps: s = !1 }, f, v) {
  return {
    ...gE(l) ? $A : WA,
    preloadedFeatures: f,
    useRender: VA(s),
    createVisualElement: v,
    Component: l
  };
}
function lu(l, s, f, v = { passive: !0 }) {
  return l.addEventListener(s, f, v), () => l.removeEventListener(s, f);
}
const Zw = (l) => l.pointerType === "mouse" ? typeof l.button != "number" || l.button <= 0 : l.isPrimary !== !1;
function mg(l, s = "page") {
  return {
    point: {
      x: l[s + "X"],
      y: l[s + "Y"]
    }
  };
}
const QA = (l) => (s) => Zw(s) && l(s, mg(s));
function uu(l, s, f, v) {
  return lu(l, s, QA(f), v);
}
const KA = (l, s) => (f) => s(l(f)), fs = (...l) => l.reduce(KA);
function Jw(l) {
  let s = null;
  return () => {
    const f = () => {
      s = null;
    };
    return s === null ? (s = l, f) : !1;
  };
}
const Lb = Jw("dragHorizontal"), Ab = Jw("dragVertical");
function e1(l) {
  let s = !1;
  if (l === "y")
    s = Ab();
  else if (l === "x")
    s = Lb();
  else {
    const f = Lb(), v = Ab();
    f && v ? s = () => {
      f(), v();
    } : (f && f(), v && v());
  }
  return s;
}
function t1() {
  const l = e1(!0);
  return l ? (l(), !1) : !0;
}
class vs {
  constructor(s) {
    this.isMounted = !1, this.node = s;
  }
  update() {
  }
}
function Nb(l, s) {
  const f = "pointer" + (s ? "enter" : "leave"), v = "onHover" + (s ? "Start" : "End"), S = (R, m) => {
    if (R.pointerType === "touch" || t1())
      return;
    const w = l.getProps();
    l.animationState && w.whileHover && l.animationState.setActive("whileHover", s), w[v] && yn.update(() => w[v](R, m));
  };
  return uu(l.current, f, S, {
    passive: !l.getProps()[v]
  });
}
class qA extends vs {
  mount() {
    this.unmount = fs(Nb(this.node, !0), Nb(this.node, !1));
  }
  unmount() {
  }
}
class XA extends vs {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let s = !1;
    try {
      s = this.node.current.matches(":focus-visible");
    } catch {
      s = !0;
    }
    !s || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = fs(lu(this.node.current, "focus", () => this.onFocus()), lu(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const n1 = (l, s) => s ? l === s ? !0 : n1(l, s.parentElement) : !1;
function VC(l, s) {
  if (!s)
    return;
  const f = new PointerEvent("pointer" + l);
  s(f, mg(f));
}
class ZA extends vs {
  constructor() {
    super(...arguments), this.removeStartListeners = $n, this.removeEndListeners = $n, this.removeAccessibleListeners = $n, this.startPointerPress = (s, f) => {
      if (this.isPressing)
        return;
      this.removeEndListeners();
      const v = this.node.getProps(), R = uu(window, "pointerup", (w, T) => {
        if (!this.checkPressEnd())
          return;
        const { onTap: b, onTapCancel: M, globalTapTarget: k } = this.node.getProps();
        yn.update(() => {
          !k && !n1(this.node.current, w.target) ? M && M(w, T) : b && b(w, T);
        });
      }, { passive: !(v.onTap || v.onPointerUp) }), m = uu(window, "pointercancel", (w, T) => this.cancelPress(w, T), { passive: !(v.onTapCancel || v.onPointerCancel) });
      this.removeEndListeners = fs(R, m), this.startPress(s, f);
    }, this.startAccessiblePress = () => {
      const s = (R) => {
        if (R.key !== "Enter" || this.isPressing)
          return;
        const m = (w) => {
          w.key !== "Enter" || !this.checkPressEnd() || VC("up", (T, b) => {
            const { onTap: M } = this.node.getProps();
            M && yn.update(() => M(T, b));
          });
        };
        this.removeEndListeners(), this.removeEndListeners = lu(this.node.current, "keyup", m), VC("down", (w, T) => {
          this.startPress(w, T);
        });
      }, f = lu(this.node.current, "keydown", s), v = () => {
        this.isPressing && VC("cancel", (R, m) => this.cancelPress(R, m));
      }, S = lu(this.node.current, "blur", v);
      this.removeAccessibleListeners = fs(f, S);
    };
  }
  startPress(s, f) {
    this.isPressing = !0;
    const { onTapStart: v, whileTap: S } = this.node.getProps();
    S && this.node.animationState && this.node.animationState.setActive("whileTap", !0), v && yn.update(() => v(s, f));
  }
  checkPressEnd() {
    return this.removeEndListeners(), this.isPressing = !1, this.node.getProps().whileTap && this.node.animationState && this.node.animationState.setActive("whileTap", !1), !t1();
  }
  cancelPress(s, f) {
    if (!this.checkPressEnd())
      return;
    const { onTapCancel: v } = this.node.getProps();
    v && yn.update(() => v(s, f));
  }
  mount() {
    const s = this.node.getProps(), f = uu(s.globalTapTarget ? window : this.node.current, "pointerdown", this.startPointerPress, { passive: !(s.onTapStart || s.onPointerStart) }), v = lu(this.node.current, "focus", this.startAccessiblePress);
    this.removeStartListeners = fs(f, v);
  }
  unmount() {
    this.removeStartListeners(), this.removeEndListeners(), this.removeAccessibleListeners();
  }
}
const eE = /* @__PURE__ */ new WeakMap(), zC = /* @__PURE__ */ new WeakMap(), JA = (l) => {
  const s = eE.get(l.target);
  s && s(l);
}, eN = (l) => {
  l.forEach(JA);
};
function tN({ root: l, ...s }) {
  const f = l || document;
  zC.has(f) || zC.set(f, {});
  const v = zC.get(f), S = JSON.stringify(s);
  return v[S] || (v[S] = new IntersectionObserver(eN, { root: l, ...s })), v[S];
}
function nN(l, s, f) {
  const v = tN(s);
  return eE.set(l, f), v.observe(l), () => {
    eE.delete(l), v.unobserve(l);
  };
}
const rN = {
  some: 0,
  all: 1
};
class aN extends vs {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: s = {} } = this.node.getProps(), { root: f, margin: v, amount: S = "some", once: R } = s, m = {
      root: f ? f.current : void 0,
      rootMargin: v,
      threshold: typeof S == "number" ? S : rN[S]
    }, w = (T) => {
      const { isIntersecting: b } = T;
      if (this.isInView === b || (this.isInView = b, R && !b && this.hasEnteredView))
        return;
      b && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", b);
      const { onViewportEnter: M, onViewportLeave: k } = this.node.getProps(), A = b ? M : k;
      A && A(T);
    };
    return nN(this.node.current, m, w);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: s, prevProps: f } = this.node;
    ["amount", "margin", "root"].some(iN(s, f)) && this.startObserver();
  }
  unmount() {
  }
}
function iN({ viewport: l = {} }, { viewport: s = {} } = {}) {
  return (f) => l[f] !== s[f];
}
const oN = {
  inView: {
    Feature: aN
  },
  tap: {
    Feature: ZA
  },
  focus: {
    Feature: XA
  },
  hover: {
    Feature: qA
  }
};
function r1(l, s) {
  if (!Array.isArray(s))
    return !1;
  const f = s.length;
  if (f !== l.length)
    return !1;
  for (let v = 0; v < f; v++)
    if (s[v] !== l[v])
      return !1;
  return !0;
}
function lN(l) {
  const s = {};
  return l.values.forEach((f, v) => s[v] = f.get()), s;
}
function uN(l) {
  const s = {};
  return l.values.forEach((f, v) => s[v] = f.getVelocity()), s;
}
function yg(l, s, f) {
  const v = l.getProps();
  return RE(v, s, f !== void 0 ? f : v.custom, lN(l), uN(l));
}
let ev = $n, qi = $n;
process.env.NODE_ENV !== "production" && (ev = (l, s) => {
  !l && typeof console < "u" && console.warn(s);
}, qi = (l, s) => {
  if (!l)
    throw new Error(s);
});
const ds = (l) => l * 1e3, su = (l) => l / 1e3, sN = {
  current: !1
}, a1 = (l) => Array.isArray(l) && typeof l[0] == "number";
function i1(l) {
  return !!(!l || typeof l == "string" && o1[l] || a1(l) || Array.isArray(l) && l.every(i1));
}
const Ih = ([l, s, f, v]) => `cubic-bezier(${l}, ${s}, ${f}, ${v})`, o1 = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: Ih([0, 0.65, 0.55, 1]),
  circOut: Ih([0.55, 0, 1, 0.45]),
  backIn: Ih([0.31, 0.01, 0.66, -0.59]),
  backOut: Ih([0.33, 1.53, 0.69, 0.99])
};
function l1(l) {
  if (l)
    return a1(l) ? Ih(l) : Array.isArray(l) ? l.map(l1) : o1[l];
}
function cN(l, s, f, { delay: v = 0, duration: S, repeat: R = 0, repeatType: m = "loop", ease: w, times: T } = {}) {
  const b = { [s]: f };
  T && (b.offset = T);
  const M = l1(w);
  return Array.isArray(M) && (b.easing = M), l.animate(b, {
    delay: v,
    duration: S,
    easing: Array.isArray(M) ? "linear" : M,
    fill: "both",
    iterations: R + 1,
    direction: m === "reverse" ? "alternate" : "normal"
  });
}
function fN(l, { repeat: s, repeatType: f = "loop" }) {
  const v = s && f !== "loop" && s % 2 === 1 ? 0 : l.length - 1;
  return l[v];
}
const u1 = (l, s, f) => (((1 - 3 * f + 3 * s) * l + (3 * f - 6 * s)) * l + 3 * s) * l, dN = 1e-7, pN = 12;
function hN(l, s, f, v, S) {
  let R, m, w = 0;
  do
    m = s + (f - s) / 2, R = u1(m, v, S) - l, R > 0 ? f = m : s = m;
  while (Math.abs(R) > dN && ++w < pN);
  return m;
}
function tv(l, s, f, v) {
  if (l === s && f === v)
    return $n;
  const S = (R) => hN(R, 0, 1, l, f);
  return (R) => R === 0 || R === 1 ? R : u1(S(R), s, v);
}
const vN = tv(0.42, 0, 1, 1), mN = tv(0, 0, 0.58, 1), s1 = tv(0.42, 0, 0.58, 1), yN = (l) => Array.isArray(l) && typeof l[0] != "number", c1 = (l) => (s) => s <= 0.5 ? l(2 * s) / 2 : (2 - l(2 * (1 - s))) / 2, f1 = (l) => (s) => 1 - l(1 - s), bE = (l) => 1 - Math.sin(Math.acos(l)), d1 = f1(bE), gN = c1(bE), p1 = tv(0.33, 1.53, 0.69, 0.99), wE = f1(p1), SN = c1(wE), CN = (l) => (l *= 2) < 1 ? 0.5 * wE(l) : 0.5 * (2 - Math.pow(2, -10 * (l - 1))), Pb = {
  linear: $n,
  easeIn: vN,
  easeInOut: s1,
  easeOut: mN,
  circIn: bE,
  circInOut: gN,
  circOut: d1,
  backIn: wE,
  backInOut: SN,
  backOut: p1,
  anticipate: CN
}, Ub = (l) => {
  if (Array.isArray(l)) {
    qi(l.length === 4, "Cubic bezier arrays must contain four numerical values.");
    const [s, f, v, S] = l;
    return tv(s, f, v, S);
  } else if (typeof l == "string")
    return qi(Pb[l] !== void 0, `Invalid easing type '${l}'`), Pb[l];
  return l;
}, DE = (l, s) => (f) => !!(Zh(f) && TA.test(f) && f.startsWith(l) || s && Object.prototype.hasOwnProperty.call(f, s)), h1 = (l, s, f) => (v) => {
  if (!Zh(v))
    return v;
  const [S, R, m, w] = v.match(vg);
  return {
    [l]: parseFloat(S),
    [s]: parseFloat(R),
    [f]: parseFloat(m),
    alpha: w !== void 0 ? parseFloat(w) : 1
  };
}, EN = (l) => ps(0, 255, l), jC = {
  ...Vc,
  transform: (l) => Math.round(EN(l))
}, Pc = {
  test: DE("rgb", "red"),
  parse: h1("red", "green", "blue"),
  transform: ({ red: l, green: s, blue: f, alpha: v = 1 }) => "rgba(" + jC.transform(l) + ", " + jC.transform(s) + ", " + jC.transform(f) + ", " + $h(Yh.transform(v)) + ")"
};
function xN(l) {
  let s = "", f = "", v = "", S = "";
  return l.length > 5 ? (s = l.substring(1, 3), f = l.substring(3, 5), v = l.substring(5, 7), S = l.substring(7, 9)) : (s = l.substring(1, 2), f = l.substring(2, 3), v = l.substring(3, 4), S = l.substring(4, 5), s += s, f += f, v += v, S += S), {
    red: parseInt(s, 16),
    green: parseInt(f, 16),
    blue: parseInt(v, 16),
    alpha: S ? parseInt(S, 16) / 255 : 1
  };
}
const tE = {
  test: DE("#"),
  parse: xN,
  transform: Pc.transform
}, bd = {
  test: DE("hsl", "hue"),
  parse: h1("hue", "saturation", "lightness"),
  transform: ({ hue: l, saturation: s, lightness: f, alpha: v = 1 }) => "hsla(" + Math.round(l) + ", " + dl.transform($h(s)) + ", " + dl.transform($h(f)) + ", " + $h(Yh.transform(v)) + ")"
}, Ma = {
  test: (l) => Pc.test(l) || tE.test(l) || bd.test(l),
  parse: (l) => Pc.test(l) ? Pc.parse(l) : bd.test(l) ? bd.parse(l) : tE.parse(l),
  transform: (l) => Zh(l) ? l : l.hasOwnProperty("red") ? Pc.transform(l) : bd.transform(l)
}, Nn = (l, s, f) => -f * l + f * s + l;
function FC(l, s, f) {
  return f < 0 && (f += 1), f > 1 && (f -= 1), f < 1 / 6 ? l + (s - l) * 6 * f : f < 1 / 2 ? s : f < 2 / 3 ? l + (s - l) * (2 / 3 - f) * 6 : l;
}
function TN({ hue: l, saturation: s, lightness: f, alpha: v }) {
  l /= 360, s /= 100, f /= 100;
  let S = 0, R = 0, m = 0;
  if (!s)
    S = R = m = f;
  else {
    const w = f < 0.5 ? f * (1 + s) : f + s - f * s, T = 2 * f - w;
    S = FC(T, w, l + 1 / 3), R = FC(T, w, l), m = FC(T, w, l - 1 / 3);
  }
  return {
    red: Math.round(S * 255),
    green: Math.round(R * 255),
    blue: Math.round(m * 255),
    alpha: v
  };
}
const HC = (l, s, f) => {
  const v = l * l;
  return Math.sqrt(Math.max(0, f * (s * s - v) + v));
}, RN = [tE, Pc, bd], bN = (l) => RN.find((s) => s.test(l));
function Vb(l) {
  const s = bN(l);
  qi(!!s, `'${l}' is not an animatable color. Use the equivalent color code instead.`);
  let f = s.parse(l);
  return s === bd && (f = TN(f)), f;
}
const v1 = (l, s) => {
  const f = Vb(l), v = Vb(s), S = { ...f };
  return (R) => (S.red = HC(f.red, v.red, R), S.green = HC(f.green, v.green, R), S.blue = HC(f.blue, v.blue, R), S.alpha = Nn(f.alpha, v.alpha, R), Pc.transform(S));
};
function wN(l) {
  var s, f;
  return isNaN(l) && Zh(l) && (((s = l.match(vg)) === null || s === void 0 ? void 0 : s.length) || 0) + (((f = l.match(Hw)) === null || f === void 0 ? void 0 : f.length) || 0) > 0;
}
const m1 = {
  regex: EA,
  countKey: "Vars",
  token: "${v}",
  parse: $n
}, y1 = {
  regex: Hw,
  countKey: "Colors",
  token: "${c}",
  parse: Ma.parse
}, g1 = {
  regex: vg,
  countKey: "Numbers",
  token: "${n}",
  parse: Vc.parse
};
function BC(l, { regex: s, countKey: f, token: v, parse: S }) {
  const R = l.tokenised.match(s);
  R && (l["num" + f] = R.length, l.tokenised = l.tokenised.replace(s, v), l.values.push(...R.map(S)));
}
function ig(l) {
  const s = l.toString(), f = {
    value: s,
    tokenised: s,
    values: [],
    numVars: 0,
    numColors: 0,
    numNumbers: 0
  };
  return f.value.includes("var(--") && BC(f, m1), BC(f, y1), BC(f, g1), f;
}
function S1(l) {
  return ig(l).values;
}
function C1(l) {
  const { values: s, numColors: f, numVars: v, tokenised: S } = ig(l), R = s.length;
  return (m) => {
    let w = S;
    for (let T = 0; T < R; T++)
      T < v ? w = w.replace(m1.token, m[T]) : T < v + f ? w = w.replace(y1.token, Ma.transform(m[T])) : w = w.replace(g1.token, $h(m[T]));
    return w;
  };
}
const DN = (l) => typeof l == "number" ? 0 : l;
function kN(l) {
  const s = S1(l);
  return C1(l)(s.map(DN));
}
const hs = {
  test: wN,
  parse: S1,
  createTransformer: C1,
  getAnimatableNone: kN
}, E1 = (l, s) => (f) => `${f > 0 ? s : l}`;
function x1(l, s) {
  return typeof l == "number" ? (f) => Nn(l, s, f) : Ma.test(l) ? v1(l, s) : l.startsWith("var(") ? E1(l, s) : R1(l, s);
}
const T1 = (l, s) => {
  const f = [...l], v = f.length, S = l.map((R, m) => x1(R, s[m]));
  return (R) => {
    for (let m = 0; m < v; m++)
      f[m] = S[m](R);
    return f;
  };
}, _N = (l, s) => {
  const f = { ...l, ...s }, v = {};
  for (const S in f)
    l[S] !== void 0 && s[S] !== void 0 && (v[S] = x1(l[S], s[S]));
  return (S) => {
    for (const R in v)
      f[R] = v[R](S);
    return f;
  };
}, R1 = (l, s) => {
  const f = hs.createTransformer(s), v = ig(l), S = ig(s);
  return v.numVars === S.numVars && v.numColors === S.numColors && v.numNumbers >= S.numNumbers ? fs(T1(v.values, S.values), f) : (ev(!0, `Complex values '${l}' and '${s}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), E1(l, s));
}, qh = (l, s, f) => {
  const v = s - l;
  return v === 0 ? 1 : (f - l) / v;
}, zb = (l, s) => (f) => Nn(l, s, f);
function MN(l) {
  return typeof l == "number" ? zb : typeof l == "string" ? Ma.test(l) ? v1 : R1 : Array.isArray(l) ? T1 : typeof l == "object" ? _N : zb;
}
function ON(l, s, f) {
  const v = [], S = f || MN(l[0]), R = l.length - 1;
  for (let m = 0; m < R; m++) {
    let w = S(l[m], l[m + 1]);
    if (s) {
      const T = Array.isArray(s) ? s[m] || $n : s;
      w = fs(T, w);
    }
    v.push(w);
  }
  return v;
}
function b1(l, s, { clamp: f = !0, ease: v, mixer: S } = {}) {
  const R = l.length;
  if (qi(R === s.length, "Both input and output ranges must be the same length"), R === 1)
    return () => s[0];
  l[0] > l[R - 1] && (l = [...l].reverse(), s = [...s].reverse());
  const m = ON(s, v, S), w = m.length, T = (b) => {
    let M = 0;
    if (w > 1)
      for (; M < l.length - 2 && !(b < l[M + 1]); M++)
        ;
    const k = qh(l[M], l[M + 1], b);
    return m[M](k);
  };
  return f ? (b) => T(ps(l[0], l[R - 1], b)) : T;
}
function LN(l, s) {
  const f = l[l.length - 1];
  for (let v = 1; v <= s; v++) {
    const S = qh(0, s, v);
    l.push(Nn(f, 1, S));
  }
}
function AN(l) {
  const s = [0];
  return LN(s, l.length - 1), s;
}
function NN(l, s) {
  return l.map((f) => f * s);
}
function PN(l, s) {
  return l.map(() => s || s1).splice(0, l.length - 1);
}
function og({ duration: l = 300, keyframes: s, times: f, ease: v = "easeInOut" }) {
  const S = yN(v) ? v.map(Ub) : Ub(v), R = {
    done: !1,
    value: s[0]
  }, m = NN(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    f && f.length === s.length ? f : AN(s),
    l
  ), w = b1(m, s, {
    ease: Array.isArray(S) ? S : PN(s, S)
  });
  return {
    calculatedDuration: l,
    next: (T) => (R.value = w(T), R.done = T >= l, R)
  };
}
function w1(l, s) {
  return s ? l * (1e3 / s) : 0;
}
const UN = 5;
function D1(l, s, f) {
  const v = Math.max(s - UN, 0);
  return w1(f - l(v), s - v);
}
const IC = 1e-3, VN = 0.01, jb = 10, zN = 0.05, jN = 1;
function FN({ duration: l = 800, bounce: s = 0.25, velocity: f = 0, mass: v = 1 }) {
  let S, R;
  ev(l <= ds(jb), "Spring duration must be 10 seconds or less");
  let m = 1 - s;
  m = ps(zN, jN, m), l = ps(VN, jb, su(l)), m < 1 ? (S = (b) => {
    const M = b * m, k = M * l, A = M - f, P = nE(b, m), K = Math.exp(-k);
    return IC - A / P * K;
  }, R = (b) => {
    const k = b * m * l, A = k * f + f, P = Math.pow(m, 2) * Math.pow(b, 2) * l, K = Math.exp(-k), ee = nE(Math.pow(b, 2), m);
    return (-S(b) + IC > 0 ? -1 : 1) * ((A - P) * K) / ee;
  }) : (S = (b) => {
    const M = Math.exp(-b * l), k = (b - f) * l + 1;
    return -IC + M * k;
  }, R = (b) => {
    const M = Math.exp(-b * l), k = (f - b) * (l * l);
    return M * k;
  });
  const w = 5 / l, T = BN(S, R, w);
  if (l = ds(l), isNaN(T))
    return {
      stiffness: 100,
      damping: 10,
      duration: l
    };
  {
    const b = Math.pow(T, 2) * v;
    return {
      stiffness: b,
      damping: m * 2 * Math.sqrt(v * b),
      duration: l
    };
  }
}
const HN = 12;
function BN(l, s, f) {
  let v = f;
  for (let S = 1; S < HN; S++)
    v = v - l(v) / s(v);
  return v;
}
function nE(l, s) {
  return l * Math.sqrt(1 - s * s);
}
const IN = ["duration", "bounce"], YN = ["stiffness", "damping", "mass"];
function Fb(l, s) {
  return s.some((f) => l[f] !== void 0);
}
function $N(l) {
  let s = {
    velocity: 0,
    stiffness: 100,
    damping: 10,
    mass: 1,
    isResolvedFromDuration: !1,
    ...l
  };
  if (!Fb(l, YN) && Fb(l, IN)) {
    const f = FN(l);
    s = {
      ...s,
      ...f,
      mass: 1
    }, s.isResolvedFromDuration = !0;
  }
  return s;
}
function k1({ keyframes: l, restDelta: s, restSpeed: f, ...v }) {
  const S = l[0], R = l[l.length - 1], m = { done: !1, value: S }, { stiffness: w, damping: T, mass: b, duration: M, velocity: k, isResolvedFromDuration: A } = $N({
    ...v,
    velocity: -su(v.velocity || 0)
  }), P = k || 0, K = T / (2 * Math.sqrt(w * b)), ee = R - S, se = su(Math.sqrt(w / b)), Te = Math.abs(ee) < 5;
  f || (f = Te ? 0.01 : 2), s || (s = Te ? 5e-3 : 0.5);
  let re;
  if (K < 1) {
    const q = nE(se, K);
    re = (pe) => {
      const de = Math.exp(-K * se * pe);
      return R - de * ((P + K * se * ee) / q * Math.sin(q * pe) + ee * Math.cos(q * pe));
    };
  } else if (K === 1)
    re = (q) => R - Math.exp(-se * q) * (ee + (P + se * ee) * q);
  else {
    const q = se * Math.sqrt(K * K - 1);
    re = (pe) => {
      const de = Math.exp(-K * se * pe), Pe = Math.min(q * pe, 300);
      return R - de * ((P + K * se * ee) * Math.sinh(Pe) + q * ee * Math.cosh(Pe)) / q;
    };
  }
  return {
    calculatedDuration: A && M || null,
    next: (q) => {
      const pe = re(q);
      if (A)
        m.done = q >= M;
      else {
        let de = P;
        q !== 0 && (K < 1 ? de = D1(re, q, pe) : de = 0);
        const Pe = Math.abs(de) <= f, Ee = Math.abs(R - pe) <= s;
        m.done = Pe && Ee;
      }
      return m.value = m.done ? R : pe, m;
    }
  };
}
function Hb({ keyframes: l, velocity: s = 0, power: f = 0.8, timeConstant: v = 325, bounceDamping: S = 10, bounceStiffness: R = 500, modifyTarget: m, min: w, max: T, restDelta: b = 0.5, restSpeed: M }) {
  const k = l[0], A = {
    done: !1,
    value: k
  }, P = (Fe) => w !== void 0 && Fe < w || T !== void 0 && Fe > T, K = (Fe) => w === void 0 ? T : T === void 0 || Math.abs(w - Fe) < Math.abs(T - Fe) ? w : T;
  let ee = f * s;
  const se = k + ee, Te = m === void 0 ? se : m(se);
  Te !== se && (ee = Te - k);
  const re = (Fe) => -ee * Math.exp(-Fe / v), q = (Fe) => Te + re(Fe), pe = (Fe) => {
    const Be = re(Fe), wt = q(Fe);
    A.done = Math.abs(Be) <= b, A.value = A.done ? Te : wt;
  };
  let de, Pe;
  const Ee = (Fe) => {
    P(A.value) && (de = Fe, Pe = k1({
      keyframes: [A.value, K(A.value)],
      velocity: D1(q, Fe, A.value),
      damping: S,
      stiffness: R,
      restDelta: b,
      restSpeed: M
    }));
  };
  return Ee(0), {
    calculatedDuration: null,
    next: (Fe) => {
      let Be = !1;
      return !Pe && de === void 0 && (Be = !0, pe(Fe), Ee(Fe)), de !== void 0 && Fe > de ? Pe.next(Fe - de) : (!Be && pe(Fe), A);
    }
  };
}
const WN = (l) => {
  const s = ({ timestamp: f }) => l(f);
  return {
    start: () => yn.update(s, !0),
    stop: () => cu(s),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ha.isProcessing ? ha.timestamp : performance.now()
  };
}, Bb = 2e4;
function Ib(l) {
  let s = 0;
  const f = 50;
  let v = l.next(s);
  for (; !v.done && s < Bb; )
    s += f, v = l.next(s);
  return s >= Bb ? 1 / 0 : s;
}
const GN = {
  decay: Hb,
  inertia: Hb,
  tween: og,
  keyframes: og,
  spring: k1
};
function lg({ autoplay: l = !0, delay: s = 0, driver: f = WN, keyframes: v, type: S = "keyframes", repeat: R = 0, repeatDelay: m = 0, repeatType: w = "loop", onPlay: T, onStop: b, onComplete: M, onUpdate: k, ...A }) {
  let P = 1, K = !1, ee, se;
  const Te = () => {
    se = new Promise((V) => {
      ee = V;
    });
  };
  Te();
  let re;
  const q = GN[S] || og;
  let pe;
  q !== og && typeof v[0] != "number" && (process.env.NODE_ENV !== "production" && qi(v.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${v}`), pe = b1([0, 100], v, {
    clamp: !1
  }), v = [0, 100]);
  const de = q({ ...A, keyframes: v });
  let Pe;
  w === "mirror" && (Pe = q({
    ...A,
    keyframes: [...v].reverse(),
    velocity: -(A.velocity || 0)
  }));
  let Ee = "idle", Fe = null, Be = null, wt = null;
  de.calculatedDuration === null && R && (de.calculatedDuration = Ib(de));
  const { calculatedDuration: jt } = de;
  let ft = 1 / 0, Ue = 1 / 0;
  jt !== null && (ft = jt + m, Ue = ft * (R + 1) - m);
  let it = 0;
  const Tt = (V) => {
    if (Be === null)
      return;
    P > 0 && (Be = Math.min(Be, V)), P < 0 && (Be = Math.min(V - Ue / P, Be)), Fe !== null ? it = Fe : it = Math.round(V - Be) * P;
    const te = it - s * (P >= 0 ? 1 : -1), Ze = P >= 0 ? te < 0 : te > Ue;
    it = Math.max(te, 0), Ee === "finished" && Fe === null && (it = Ue);
    let Qe = it, yt = de;
    if (R) {
      const ht = Math.min(it, Ue) / ft;
      let Pt = Math.floor(ht), Kt = ht % 1;
      !Kt && ht >= 1 && (Kt = 1), Kt === 1 && Pt--, Pt = Math.min(Pt, R + 1), !!(Pt % 2) && (w === "reverse" ? (Kt = 1 - Kt, m && (Kt -= m / ft)) : w === "mirror" && (yt = Pe)), Qe = ps(0, 1, Kt) * ft;
    }
    const ot = Ze ? { done: !1, value: v[0] } : yt.next(Qe);
    pe && (ot.value = pe(ot.value));
    let { done: dt } = ot;
    !Ze && jt !== null && (dt = P >= 0 ? it >= Ue : it <= 0);
    const gt = Fe === null && (Ee === "finished" || Ee === "running" && dt);
    return k && k(ot.value), gt && he(), ot;
  }, tt = () => {
    re && re.stop(), re = void 0;
  }, De = () => {
    Ee = "idle", tt(), ee(), Te(), Be = wt = null;
  }, he = () => {
    Ee = "finished", M && M(), tt(), ee();
  }, Ne = () => {
    if (K)
      return;
    re || (re = f(Tt));
    const V = re.now();
    T && T(), Fe !== null ? Be = V - Fe : (!Be || Ee === "finished") && (Be = V), Ee === "finished" && Te(), wt = Be, Fe = null, Ee = "running", re.start();
  };
  l && Ne();
  const ye = {
    then(V, te) {
      return se.then(V, te);
    },
    get time() {
      return su(it);
    },
    set time(V) {
      V = ds(V), it = V, Fe !== null || !re || P === 0 ? Fe = V : Be = re.now() - V / P;
    },
    get duration() {
      const V = de.calculatedDuration === null ? Ib(de) : de.calculatedDuration;
      return su(V);
    },
    get speed() {
      return P;
    },
    set speed(V) {
      V === P || !re || (P = V, ye.time = su(it));
    },
    get state() {
      return Ee;
    },
    play: Ne,
    pause: () => {
      Ee = "paused", Fe = it;
    },
    stop: () => {
      K = !0, Ee !== "idle" && (Ee = "idle", b && b(), De());
    },
    cancel: () => {
      wt !== null && Tt(wt), De();
    },
    complete: () => {
      Ee = "finished";
    },
    sample: (V) => (Be = 0, Tt(V))
  };
  return ye;
}
function QN(l) {
  let s;
  return () => (s === void 0 && (s = l()), s);
}
const KN = QN(() => Object.hasOwnProperty.call(Element.prototype, "animate")), qN = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform",
  "backgroundColor"
]), Xy = 10, XN = 2e4, ZN = (l, s) => s.type === "spring" || l === "backgroundColor" || !i1(s.ease);
function JN(l, s, { onUpdate: f, onComplete: v, ...S }) {
  if (!(KN() && qN.has(s) && !S.repeatDelay && S.repeatType !== "mirror" && S.damping !== 0 && S.type !== "inertia"))
    return !1;
  let m = !1, w, T, b = !1;
  const M = () => {
    T = new Promise((q) => {
      w = q;
    });
  };
  M();
  let { keyframes: k, duration: A = 300, ease: P, times: K } = S;
  if (ZN(s, S)) {
    const q = lg({
      ...S,
      repeat: 0,
      delay: 0
    });
    let pe = { done: !1, value: k[0] };
    const de = [];
    let Pe = 0;
    for (; !pe.done && Pe < XN; )
      pe = q.sample(Pe), de.push(pe.value), Pe += Xy;
    K = void 0, k = de, A = Pe - Xy, P = "linear";
  }
  const ee = cN(l.owner.current, s, k, {
    ...S,
    duration: A,
    /**
     * This function is currently not called if ease is provided
     * as a function so the cast is safe.
     *
     * However it would be possible for a future refinement to port
     * in easing pregeneration from Motion One for browsers that
     * support the upcoming `linear()` easing function.
     */
    ease: P,
    times: K
  }), se = () => {
    b = !1, ee.cancel();
  }, Te = () => {
    b = !0, yn.update(se), w(), M();
  };
  return ee.onfinish = () => {
    b || (l.set(fN(k, S)), v && v(), Te());
  }, {
    then(q, pe) {
      return T.then(q, pe);
    },
    attachTimeline(q) {
      return ee.timeline = q, ee.onfinish = null, $n;
    },
    get time() {
      return su(ee.currentTime || 0);
    },
    set time(q) {
      ee.currentTime = ds(q);
    },
    get speed() {
      return ee.playbackRate;
    },
    set speed(q) {
      ee.playbackRate = q;
    },
    get duration() {
      return su(A);
    },
    play: () => {
      m || (ee.play(), cu(se));
    },
    pause: () => ee.pause(),
    stop: () => {
      if (m = !0, ee.playState === "idle")
        return;
      const { currentTime: q } = ee;
      if (q) {
        const pe = lg({
          ...S,
          autoplay: !1
        });
        l.setWithVelocity(pe.sample(q - Xy).value, pe.sample(q).value, Xy);
      }
      Te();
    },
    complete: () => {
      b || ee.finish();
    },
    cancel: Te
  };
}
function eP({ keyframes: l, delay: s, onUpdate: f, onComplete: v }) {
  const S = () => (f && f(l[l.length - 1]), v && v(), {
    time: 0,
    speed: 1,
    duration: 0,
    play: $n,
    pause: $n,
    stop: $n,
    then: (R) => (R(), Promise.resolve()),
    cancel: $n,
    complete: $n
  });
  return s ? lg({
    keyframes: [0, 1],
    duration: 0,
    delay: s,
    onComplete: S
  }) : S();
}
const tP = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, nP = (l) => ({
  type: "spring",
  stiffness: 550,
  damping: l === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), rP = {
  type: "keyframes",
  duration: 0.8
}, aP = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, iP = (l, { keyframes: s }) => s.length > 2 ? rP : Uc.has(l) ? l.startsWith("scale") ? nP(s[1]) : tP : aP, rE = (l, s) => l === "zIndex" ? !1 : !!(typeof s == "number" || Array.isArray(s) || typeof s == "string" && // It's animatable if we have a string
(hs.test(s) || s === "0") && // And it contains numbers and/or colors
!s.startsWith("url(")), oP = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function lP(l) {
  const [s, f] = l.slice(0, -1).split("(");
  if (s === "drop-shadow")
    return l;
  const [v] = f.match(vg) || [];
  if (!v)
    return l;
  const S = f.replace(v, "");
  let R = oP.has(s) ? 1 : 0;
  return v !== f && (R *= 100), s + "(" + R + S + ")";
}
const uP = /([a-z-]*)\(.*?\)/g, aE = {
  ...hs,
  getAnimatableNone: (l) => {
    const s = l.match(uP);
    return s ? s.map(lP).join(" ") : l;
  }
}, sP = {
  ...Bw,
  // Color props
  color: Ma,
  backgroundColor: Ma,
  outlineColor: Ma,
  fill: Ma,
  stroke: Ma,
  // Border props
  borderColor: Ma,
  borderTopColor: Ma,
  borderRightColor: Ma,
  borderBottomColor: Ma,
  borderLeftColor: Ma,
  filter: aE,
  WebkitFilter: aE
}, kE = (l) => sP[l];
function _1(l, s) {
  let f = kE(l);
  return f !== aE && (f = hs), f.getAnimatableNone ? f.getAnimatableNone(s) : void 0;
}
const M1 = (l) => /^0[^.\s]+$/.test(l);
function cP(l) {
  if (typeof l == "number")
    return l === 0;
  if (l !== null)
    return l === "none" || l === "0" || M1(l);
}
function fP(l, s, f, v) {
  const S = rE(s, f);
  let R;
  Array.isArray(f) ? R = [...f] : R = [null, f];
  const m = v.from !== void 0 ? v.from : l.get();
  let w;
  const T = [];
  for (let b = 0; b < R.length; b++)
    R[b] === null && (R[b] = b === 0 ? m : R[b - 1]), cP(R[b]) && T.push(b), typeof R[b] == "string" && R[b] !== "none" && R[b] !== "0" && (w = R[b]);
  if (S && T.length && w)
    for (let b = 0; b < T.length; b++) {
      const M = T[b];
      R[M] = _1(s, w);
    }
  return R;
}
function dP({ when: l, delay: s, delayChildren: f, staggerChildren: v, staggerDirection: S, repeat: R, repeatType: m, repeatDelay: w, from: T, elapsed: b, ...M }) {
  return !!Object.keys(M).length;
}
function _E(l, s) {
  return l[s] || l.default || l;
}
const pP = {
  skipAnimations: !1
}, ME = (l, s, f, v = {}) => (S) => {
  const R = _E(v, l) || {}, m = R.delay || v.delay || 0;
  let { elapsed: w = 0 } = v;
  w = w - ds(m);
  const T = fP(s, l, f, R), b = T[0], M = T[T.length - 1], k = rE(l, b), A = rE(l, M);
  ev(k === A, `You are trying to animate ${l} from "${b}" to "${M}". ${b} is not an animatable value - to enable this animation set ${b} to a value animatable to ${M} via the \`style\` property.`);
  let P = {
    keyframes: T,
    velocity: s.getVelocity(),
    ease: "easeOut",
    ...R,
    delay: -w,
    onUpdate: (K) => {
      s.set(K), R.onUpdate && R.onUpdate(K);
    },
    onComplete: () => {
      S(), R.onComplete && R.onComplete();
    }
  };
  if (dP(R) || (P = {
    ...P,
    ...iP(l, P)
  }), P.duration && (P.duration = ds(P.duration)), P.repeatDelay && (P.repeatDelay = ds(P.repeatDelay)), !k || !A || sN.current || R.type === !1 || pP.skipAnimations)
    return eP(P);
  if (
    /**
     * If this is a handoff animation, the optimised animation will be running via
     * WAAPI. Therefore, this animation must be JS to ensure it runs "under" the
     * optimised animation.
     */
    !v.isHandoff && s.owner && s.owner.current instanceof HTMLElement && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !s.owner.getProps().onUpdate
  ) {
    const K = JN(s, l, P);
    if (K)
      return K;
  }
  return lg(P);
};
function ug(l) {
  return !!(Za(l) && l.add);
}
const O1 = (l) => /^\-?\d*\.?\d+$/.test(l);
function OE(l, s) {
  l.indexOf(s) === -1 && l.push(s);
}
function LE(l, s) {
  const f = l.indexOf(s);
  f > -1 && l.splice(f, 1);
}
class AE {
  constructor() {
    this.subscriptions = [];
  }
  add(s) {
    return OE(this.subscriptions, s), () => LE(this.subscriptions, s);
  }
  notify(s, f, v) {
    const S = this.subscriptions.length;
    if (S)
      if (S === 1)
        this.subscriptions[0](s, f, v);
      else
        for (let R = 0; R < S; R++) {
          const m = this.subscriptions[R];
          m && m(s, f, v);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Yb = /* @__PURE__ */ new Set();
function NE(l, s, f) {
  l || Yb.has(s) || (console.warn(s), Yb.add(s));
}
const hP = (l) => !isNaN(parseFloat(l));
class vP {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(s, f = {}) {
    this.version = "10.18.0", this.timeDelta = 0, this.lastUpdated = 0, this.canTrackVelocity = !1, this.events = {}, this.updateAndNotify = (v, S = !0) => {
      this.prev = this.current, this.current = v;
      const { delta: R, timestamp: m } = ha;
      this.lastUpdated !== m && (this.timeDelta = R, this.lastUpdated = m, yn.postRender(this.scheduleVelocityCheck)), this.prev !== this.current && this.events.change && this.events.change.notify(this.current), this.events.velocityChange && this.events.velocityChange.notify(this.getVelocity()), S && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.scheduleVelocityCheck = () => yn.postRender(this.velocityCheck), this.velocityCheck = ({ timestamp: v }) => {
      v !== this.lastUpdated && (this.prev = this.current, this.events.velocityChange && this.events.velocityChange.notify(this.getVelocity()));
    }, this.hasAnimated = !1, this.prev = this.current = s, this.canTrackVelocity = hP(this.current), this.owner = f.owner;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(s) {
    return process.env.NODE_ENV !== "production" && NE(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", s);
  }
  on(s, f) {
    this.events[s] || (this.events[s] = new AE());
    const v = this.events[s].add(f);
    return s === "change" ? () => {
      v(), yn.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : v;
  }
  clearListeners() {
    for (const s in this.events)
      this.events[s].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(s, f) {
    this.passiveEffect = s, this.stopPassiveEffect = f;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(s, f = !0) {
    !f || !this.passiveEffect ? this.updateAndNotify(s, f) : this.passiveEffect(s, this.updateAndNotify);
  }
  setWithVelocity(s, f, v) {
    this.set(f), this.prev = s, this.timeDelta = v;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(s) {
    this.updateAndNotify(s), this.prev = s, this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    return this.canTrackVelocity ? (
      // These casts could be avoided if parseFloat would be typed better
      w1(parseFloat(this.current) - parseFloat(this.prev), this.timeDelta)
    ) : 0;
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(s) {
    return this.stop(), new Promise((f) => {
      this.hasAnimated = !0, this.animation = s(f), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function kd(l, s) {
  return new vP(l, s);
}
const L1 = (l) => (s) => s.test(l), mP = {
  test: (l) => l === "auto",
  parse: (l) => l
}, A1 = [Vc, ut, dl, ss, bA, RA, mP], zh = (l) => A1.find(L1(l)), yP = [...A1, Ma, hs], gP = (l) => yP.find(L1(l));
function SP(l, s, f) {
  l.hasValue(s) ? l.getValue(s).set(f) : l.addValue(s, kd(f));
}
function CP(l, s) {
  const f = yg(l, s);
  let { transitionEnd: v = {}, transition: S = {}, ...R } = f ? l.makeTargetAnimatable(f, !1) : {};
  R = { ...R, ...v };
  for (const m in R) {
    const w = jA(R[m]);
    SP(l, m, w);
  }
}
function EP(l, s, f) {
  var v, S;
  const R = Object.keys(s).filter((w) => !l.hasValue(w)), m = R.length;
  if (m)
    for (let w = 0; w < m; w++) {
      const T = R[w], b = s[T];
      let M = null;
      Array.isArray(b) && (M = b[0]), M === null && (M = (S = (v = f[T]) !== null && v !== void 0 ? v : l.readValue(T)) !== null && S !== void 0 ? S : s[T]), M != null && (typeof M == "string" && (O1(M) || M1(M)) ? M = parseFloat(M) : !gP(M) && hs.test(b) && (M = _1(T, b)), l.addValue(T, kd(M, { owner: l })), f[T] === void 0 && (f[T] = M), M !== null && l.setBaseTarget(T, M));
    }
}
function xP(l, s) {
  return s ? (s[l] || s.default || s).from : void 0;
}
function TP(l, s, f) {
  const v = {};
  for (const S in l) {
    const R = xP(S, s);
    if (R !== void 0)
      v[S] = R;
    else {
      const m = f.getValue(S);
      m && (v[S] = m.get());
    }
  }
  return v;
}
function RP({ protectedKeys: l, needsAnimating: s }, f) {
  const v = l.hasOwnProperty(f) && s[f] !== !0;
  return s[f] = !1, v;
}
function bP(l, s) {
  const f = l.get();
  if (Array.isArray(s)) {
    for (let v = 0; v < s.length; v++)
      if (s[v] !== f)
        return !0;
  } else
    return f !== s;
}
function N1(l, s, { delay: f = 0, transitionOverride: v, type: S } = {}) {
  let { transition: R = l.getDefaultTransition(), transitionEnd: m, ...w } = l.makeTargetAnimatable(s);
  const T = l.getValue("willChange");
  v && (R = v);
  const b = [], M = S && l.animationState && l.animationState.getState()[S];
  for (const k in w) {
    const A = l.getValue(k), P = w[k];
    if (!A || P === void 0 || M && RP(M, k))
      continue;
    const K = {
      delay: f,
      elapsed: 0,
      ..._E(R || {}, k)
    };
    if (window.HandoffAppearAnimations) {
      const Te = l.getProps()[Pw];
      if (Te) {
        const re = window.HandoffAppearAnimations(Te, k, A, yn);
        re !== null && (K.elapsed = re, K.isHandoff = !0);
      }
    }
    let ee = !K.isHandoff && !bP(A, P);
    if (K.type === "spring" && (A.getVelocity() || K.velocity) && (ee = !1), A.animation && (ee = !1), ee)
      continue;
    A.start(ME(k, A, P, l.shouldReduceMotion && Uc.has(k) ? { type: !1 } : K));
    const se = A.animation;
    ug(T) && (T.add(k), se.then(() => T.remove(k))), b.push(se);
  }
  return m && Promise.all(b).then(() => {
    m && CP(l, m);
  }), b;
}
function iE(l, s, f = {}) {
  const v = yg(l, s, f.custom);
  let { transition: S = l.getDefaultTransition() || {} } = v || {};
  f.transitionOverride && (S = f.transitionOverride);
  const R = v ? () => Promise.all(N1(l, v, f)) : () => Promise.resolve(), m = l.variantChildren && l.variantChildren.size ? (T = 0) => {
    const { delayChildren: b = 0, staggerChildren: M, staggerDirection: k } = S;
    return wP(l, s, b + T, M, k, f);
  } : () => Promise.resolve(), { when: w } = S;
  if (w) {
    const [T, b] = w === "beforeChildren" ? [R, m] : [m, R];
    return T().then(() => b());
  } else
    return Promise.all([R(), m(f.delay)]);
}
function wP(l, s, f = 0, v = 0, S = 1, R) {
  const m = [], w = (l.variantChildren.size - 1) * v, T = S === 1 ? (b = 0) => b * v : (b = 0) => w - b * v;
  return Array.from(l.variantChildren).sort(DP).forEach((b, M) => {
    b.notify("AnimationStart", s), m.push(iE(b, s, {
      ...R,
      delay: f + T(M)
    }).then(() => b.notify("AnimationComplete", s)));
  }), Promise.all(m);
}
function DP(l, s) {
  return l.sortNodePosition(s);
}
function kP(l, s, f = {}) {
  l.notify("AnimationStart", s);
  let v;
  if (Array.isArray(s)) {
    const S = s.map((R) => iE(l, R, f));
    v = Promise.all(S);
  } else if (typeof s == "string")
    v = iE(l, s, f);
  else {
    const S = typeof s == "function" ? yg(l, s, f.custom) : s;
    v = Promise.all(N1(l, S, f));
  }
  return v.then(() => l.notify("AnimationComplete", s));
}
const _P = [...vE].reverse(), MP = vE.length;
function OP(l) {
  return (s) => Promise.all(s.map(({ animation: f, options: v }) => kP(l, f, v)));
}
function LP(l) {
  let s = OP(l);
  const f = NP();
  let v = !0;
  const S = (T, b) => {
    const M = yg(l, b);
    if (M) {
      const { transition: k, transitionEnd: A, ...P } = M;
      T = { ...T, ...P, ...A };
    }
    return T;
  };
  function R(T) {
    s = T(l);
  }
  function m(T, b) {
    const M = l.getProps(), k = l.getVariantContext(!0) || {}, A = [], P = /* @__PURE__ */ new Set();
    let K = {}, ee = 1 / 0;
    for (let Te = 0; Te < MP; Te++) {
      const re = _P[Te], q = f[re], pe = M[re] !== void 0 ? M[re] : k[re], de = Qh(pe), Pe = re === b ? q.isActive : null;
      Pe === !1 && (ee = Te);
      let Ee = pe === k[re] && pe !== M[re] && de;
      if (Ee && v && l.manuallyAnimateOnMount && (Ee = !1), q.protectedKeys = { ...K }, // If it isn't active and hasn't *just* been set as inactive
      !q.isActive && Pe === null || // If we didn't and don't have any defined prop for this animation type
      !pe && !q.prevProp || // Or if the prop doesn't define an animation
      pg(pe) || typeof pe == "boolean")
        continue;
      let Be = AP(q.prevProp, pe) || // If we're making this variant active, we want to always make it active
      re === b && q.isActive && !Ee && de || // If we removed a higher-priority variant (i is in reverse order)
      Te > ee && de, wt = !1;
      const jt = Array.isArray(pe) ? pe : [pe];
      let ft = jt.reduce(S, {});
      Pe === !1 && (ft = {});
      const { prevResolvedValues: Ue = {} } = q, it = {
        ...Ue,
        ...ft
      }, Tt = (tt) => {
        Be = !0, P.has(tt) && (wt = !0, P.delete(tt)), q.needsAnimating[tt] = !0;
      };
      for (const tt in it) {
        const De = ft[tt], he = Ue[tt];
        if (K.hasOwnProperty(tt))
          continue;
        let Ne = !1;
        ag(De) && ag(he) ? Ne = !r1(De, he) : Ne = De !== he, Ne ? De !== void 0 ? Tt(tt) : P.add(tt) : De !== void 0 && P.has(tt) ? Tt(tt) : q.protectedKeys[tt] = !0;
      }
      q.prevProp = pe, q.prevResolvedValues = ft, q.isActive && (K = { ...K, ...ft }), v && l.blockInitialAnimation && (Be = !1), Be && (!Ee || wt) && A.push(...jt.map((tt) => ({
        animation: tt,
        options: { type: re, ...T }
      })));
    }
    if (P.size) {
      const Te = {};
      P.forEach((re) => {
        const q = l.getBaseTarget(re);
        q !== void 0 && (Te[re] = q);
      }), A.push({ animation: Te });
    }
    let se = !!A.length;
    return v && (M.initial === !1 || M.initial === M.animate) && !l.manuallyAnimateOnMount && (se = !1), v = !1, se ? s(A) : Promise.resolve();
  }
  function w(T, b, M) {
    var k;
    if (f[T].isActive === b)
      return Promise.resolve();
    (k = l.variantChildren) === null || k === void 0 || k.forEach((P) => {
      var K;
      return (K = P.animationState) === null || K === void 0 ? void 0 : K.setActive(T, b);
    }), f[T].isActive = b;
    const A = m(M, T);
    for (const P in f)
      f[P].protectedKeys = {};
    return A;
  }
  return {
    animateChanges: m,
    setActive: w,
    setAnimateFunction: R,
    getState: () => f
  };
}
function AP(l, s) {
  return typeof s == "string" ? s !== l : Array.isArray(s) ? !r1(s, l) : !1;
}
function Oc(l = !1) {
  return {
    isActive: l,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function NP() {
  return {
    animate: Oc(!0),
    whileInView: Oc(),
    whileHover: Oc(),
    whileTap: Oc(),
    whileDrag: Oc(),
    whileFocus: Oc(),
    exit: Oc()
  };
}
class PP extends vs {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(s) {
    super(s), s.animationState || (s.animationState = LP(s));
  }
  updateAnimationControlsSubscription() {
    const { animate: s } = this.node.getProps();
    this.unmount(), pg(s) && (this.unmount = s.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: s } = this.node.getProps(), { animate: f } = this.node.prevProps || {};
    s !== f && this.updateAnimationControlsSubscription();
  }
  unmount() {
  }
}
let UP = 0;
class VP extends vs {
  constructor() {
    super(...arguments), this.id = UP++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: s, onExitComplete: f, custom: v } = this.node.presenceContext, { isPresent: S } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || s === S)
      return;
    const R = this.node.animationState.setActive("exit", !s, { custom: v ?? this.node.getProps().custom });
    f && !s && R.then(() => f(this.id));
  }
  mount() {
    const { register: s } = this.node.presenceContext || {};
    s && (this.unmount = s(this.id));
  }
  unmount() {
  }
}
const zP = {
  animation: {
    Feature: PP
  },
  exit: {
    Feature: VP
  }
}, $b = (l, s) => Math.abs(l - s);
function jP(l, s) {
  const f = $b(l.x, s.x), v = $b(l.y, s.y);
  return Math.sqrt(f ** 2 + v ** 2);
}
class P1 {
  constructor(s, f, { transformPagePoint: v, contextWindow: S, dragSnapToOrigin: R = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const k = $C(this.lastMoveEventInfo, this.history), A = this.startEvent !== null, P = jP(k.offset, { x: 0, y: 0 }) >= 3;
      if (!A && !P)
        return;
      const { point: K } = k, { timestamp: ee } = ha;
      this.history.push({ ...K, timestamp: ee });
      const { onStart: se, onMove: Te } = this.handlers;
      A || (se && se(this.lastMoveEvent, k), this.startEvent = this.lastMoveEvent), Te && Te(this.lastMoveEvent, k);
    }, this.handlePointerMove = (k, A) => {
      this.lastMoveEvent = k, this.lastMoveEventInfo = YC(A, this.transformPagePoint), yn.update(this.updatePoint, !0);
    }, this.handlePointerUp = (k, A) => {
      this.end();
      const { onEnd: P, onSessionEnd: K, resumeAnimation: ee } = this.handlers;
      if (this.dragSnapToOrigin && ee && ee(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const se = $C(k.type === "pointercancel" ? this.lastMoveEventInfo : YC(A, this.transformPagePoint), this.history);
      this.startEvent && P && P(k, se), K && K(k, se);
    }, !Zw(s))
      return;
    this.dragSnapToOrigin = R, this.handlers = f, this.transformPagePoint = v, this.contextWindow = S || window;
    const m = mg(s), w = YC(m, this.transformPagePoint), { point: T } = w, { timestamp: b } = ha;
    this.history = [{ ...T, timestamp: b }];
    const { onSessionStart: M } = f;
    M && M(s, $C(w, this.history)), this.removeListeners = fs(uu(this.contextWindow, "pointermove", this.handlePointerMove), uu(this.contextWindow, "pointerup", this.handlePointerUp), uu(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(s) {
    this.handlers = s;
  }
  end() {
    this.removeListeners && this.removeListeners(), cu(this.updatePoint);
  }
}
function YC(l, s) {
  return s ? { point: s(l.point) } : l;
}
function Wb(l, s) {
  return { x: l.x - s.x, y: l.y - s.y };
}
function $C({ point: l }, s) {
  return {
    point: l,
    delta: Wb(l, U1(s)),
    offset: Wb(l, FP(s)),
    velocity: HP(s, 0.1)
  };
}
function FP(l) {
  return l[0];
}
function U1(l) {
  return l[l.length - 1];
}
function HP(l, s) {
  if (l.length < 2)
    return { x: 0, y: 0 };
  let f = l.length - 1, v = null;
  const S = U1(l);
  for (; f >= 0 && (v = l[f], !(S.timestamp - v.timestamp > ds(s))); )
    f--;
  if (!v)
    return { x: 0, y: 0 };
  const R = su(S.timestamp - v.timestamp);
  if (R === 0)
    return { x: 0, y: 0 };
  const m = {
    x: (S.x - v.x) / R,
    y: (S.y - v.y) / R
  };
  return m.x === 1 / 0 && (m.x = 0), m.y === 1 / 0 && (m.y = 0), m;
}
function gi(l) {
  return l.max - l.min;
}
function oE(l, s = 0, f = 0.01) {
  return Math.abs(l - s) <= f;
}
function Gb(l, s, f, v = 0.5) {
  l.origin = v, l.originPoint = Nn(s.min, s.max, l.origin), l.scale = gi(f) / gi(s), (oE(l.scale, 1, 1e-4) || isNaN(l.scale)) && (l.scale = 1), l.translate = Nn(f.min, f.max, l.origin) - l.originPoint, (oE(l.translate) || isNaN(l.translate)) && (l.translate = 0);
}
function Wh(l, s, f, v) {
  Gb(l.x, s.x, f.x, v ? v.originX : void 0), Gb(l.y, s.y, f.y, v ? v.originY : void 0);
}
function Qb(l, s, f) {
  l.min = f.min + s.min, l.max = l.min + gi(s);
}
function BP(l, s, f) {
  Qb(l.x, s.x, f.x), Qb(l.y, s.y, f.y);
}
function Kb(l, s, f) {
  l.min = s.min - f.min, l.max = l.min + gi(s);
}
function Gh(l, s, f) {
  Kb(l.x, s.x, f.x), Kb(l.y, s.y, f.y);
}
function IP(l, { min: s, max: f }, v) {
  return s !== void 0 && l < s ? l = v ? Nn(s, l, v.min) : Math.max(l, s) : f !== void 0 && l > f && (l = v ? Nn(f, l, v.max) : Math.min(l, f)), l;
}
function qb(l, s, f) {
  return {
    min: s !== void 0 ? l.min + s : void 0,
    max: f !== void 0 ? l.max + f - (l.max - l.min) : void 0
  };
}
function YP(l, { top: s, left: f, bottom: v, right: S }) {
  return {
    x: qb(l.x, f, S),
    y: qb(l.y, s, v)
  };
}
function Xb(l, s) {
  let f = s.min - l.min, v = s.max - l.max;
  return s.max - s.min < l.max - l.min && ([f, v] = [v, f]), { min: f, max: v };
}
function $P(l, s) {
  return {
    x: Xb(l.x, s.x),
    y: Xb(l.y, s.y)
  };
}
function WP(l, s) {
  let f = 0.5;
  const v = gi(l), S = gi(s);
  return S > v ? f = qh(s.min, s.max - v, l.min) : v > S && (f = qh(l.min, l.max - S, s.min)), ps(0, 1, f);
}
function GP(l, s) {
  const f = {};
  return s.min !== void 0 && (f.min = s.min - l.min), s.max !== void 0 && (f.max = s.max - l.min), f;
}
const lE = 0.35;
function QP(l = lE) {
  return l === !1 ? l = 0 : l === !0 && (l = lE), {
    x: Zb(l, "left", "right"),
    y: Zb(l, "top", "bottom")
  };
}
function Zb(l, s, f) {
  return {
    min: Jb(l, s),
    max: Jb(l, f)
  };
}
function Jb(l, s) {
  return typeof l == "number" ? l : l[s] || 0;
}
const ew = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), wd = () => ({
  x: ew(),
  y: ew()
}), tw = () => ({ min: 0, max: 0 }), lr = () => ({
  x: tw(),
  y: tw()
});
function Ki(l) {
  return [l("x"), l("y")];
}
function V1({ top: l, left: s, right: f, bottom: v }) {
  return {
    x: { min: s, max: f },
    y: { min: l, max: v }
  };
}
function KP({ x: l, y: s }) {
  return { top: s.min, right: l.max, bottom: s.max, left: l.min };
}
function qP(l, s) {
  if (!s)
    return l;
  const f = s({ x: l.left, y: l.top }), v = s({ x: l.right, y: l.bottom });
  return {
    top: f.y,
    left: f.x,
    bottom: v.y,
    right: v.x
  };
}
function WC(l) {
  return l === void 0 || l === 1;
}
function uE({ scale: l, scaleX: s, scaleY: f }) {
  return !WC(l) || !WC(s) || !WC(f);
}
function Lc(l) {
  return uE(l) || z1(l) || l.z || l.rotate || l.rotateX || l.rotateY;
}
function z1(l) {
  return nw(l.x) || nw(l.y);
}
function nw(l) {
  return l && l !== "0%";
}
function sg(l, s, f) {
  const v = l - f, S = s * v;
  return f + S;
}
function rw(l, s, f, v, S) {
  return S !== void 0 && (l = sg(l, S, v)), sg(l, f, v) + s;
}
function sE(l, s = 0, f = 1, v, S) {
  l.min = rw(l.min, s, f, v, S), l.max = rw(l.max, s, f, v, S);
}
function j1(l, { x: s, y: f }) {
  sE(l.x, s.translate, s.scale, s.originPoint), sE(l.y, f.translate, f.scale, f.originPoint);
}
function XP(l, s, f, v = !1) {
  const S = f.length;
  if (!S)
    return;
  s.x = s.y = 1;
  let R, m;
  for (let w = 0; w < S; w++) {
    R = f[w], m = R.projectionDelta;
    const T = R.instance;
    T && T.style && T.style.display === "contents" || (v && R.options.layoutScroll && R.scroll && R !== R.root && Dd(l, {
      x: -R.scroll.offset.x,
      y: -R.scroll.offset.y
    }), m && (s.x *= m.x.scale, s.y *= m.y.scale, j1(l, m)), v && Lc(R.latestValues) && Dd(l, R.latestValues));
  }
  s.x = aw(s.x), s.y = aw(s.y);
}
function aw(l) {
  return Number.isInteger(l) || l > 1.0000000000001 || l < 0.999999999999 ? l : 1;
}
function cs(l, s) {
  l.min = l.min + s, l.max = l.max + s;
}
function iw(l, s, [f, v, S]) {
  const R = s[S] !== void 0 ? s[S] : 0.5, m = Nn(l.min, l.max, R);
  sE(l, s[f], s[v], m, s.scale);
}
const ZP = ["x", "scaleX", "originX"], JP = ["y", "scaleY", "originY"];
function Dd(l, s) {
  iw(l.x, s, ZP), iw(l.y, s, JP);
}
function F1(l, s) {
  return V1(qP(l.getBoundingClientRect(), s));
}
function e2(l, s, f) {
  const v = F1(l, f), { scroll: S } = s;
  return S && (cs(v.x, S.offset.x), cs(v.y, S.offset.y)), v;
}
const H1 = ({ current: l }) => l ? l.ownerDocument.defaultView : null, t2 = /* @__PURE__ */ new WeakMap();
class n2 {
  constructor(s) {
    this.openGlobalLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = lr(), this.visualElement = s;
  }
  start(s, { snapToCursor: f = !1 } = {}) {
    const { presenceContext: v } = this.visualElement;
    if (v && v.isPresent === !1)
      return;
    const S = (M) => {
      const { dragSnapToOrigin: k } = this.getProps();
      k ? this.pauseAnimation() : this.stopAnimation(), f && this.snapToCursor(mg(M, "page").point);
    }, R = (M, k) => {
      const { drag: A, dragPropagation: P, onDragStart: K } = this.getProps();
      if (A && !P && (this.openGlobalLock && this.openGlobalLock(), this.openGlobalLock = e1(A), !this.openGlobalLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Ki((se) => {
        let Te = this.getAxisMotionValue(se).get() || 0;
        if (dl.test(Te)) {
          const { projection: re } = this.visualElement;
          if (re && re.layout) {
            const q = re.layout.layoutBox[se];
            q && (Te = gi(q) * (parseFloat(Te) / 100));
          }
        }
        this.originPoint[se] = Te;
      }), K && yn.update(() => K(M, k), !1, !0);
      const { animationState: ee } = this.visualElement;
      ee && ee.setActive("whileDrag", !0);
    }, m = (M, k) => {
      const { dragPropagation: A, dragDirectionLock: P, onDirectionLock: K, onDrag: ee } = this.getProps();
      if (!A && !this.openGlobalLock)
        return;
      const { offset: se } = k;
      if (P && this.currentDirection === null) {
        this.currentDirection = r2(se), this.currentDirection !== null && K && K(this.currentDirection);
        return;
      }
      this.updateAxis("x", k.point, se), this.updateAxis("y", k.point, se), this.visualElement.render(), ee && ee(M, k);
    }, w = (M, k) => this.stop(M, k), T = () => Ki((M) => {
      var k;
      return this.getAnimationState(M) === "paused" && ((k = this.getAxisMotionValue(M).animation) === null || k === void 0 ? void 0 : k.play());
    }), { dragSnapToOrigin: b } = this.getProps();
    this.panSession = new P1(s, {
      onSessionStart: S,
      onStart: R,
      onMove: m,
      onSessionEnd: w,
      resumeAnimation: T
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: b,
      contextWindow: H1(this.visualElement)
    });
  }
  stop(s, f) {
    const v = this.isDragging;
    if (this.cancel(), !v)
      return;
    const { velocity: S } = f;
    this.startAnimation(S);
    const { onDragEnd: R } = this.getProps();
    R && yn.update(() => R(s, f));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: s, animationState: f } = this.visualElement;
    s && (s.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: v } = this.getProps();
    !v && this.openGlobalLock && (this.openGlobalLock(), this.openGlobalLock = null), f && f.setActive("whileDrag", !1);
  }
  updateAxis(s, f, v) {
    const { drag: S } = this.getProps();
    if (!v || !Zy(s, S, this.currentDirection))
      return;
    const R = this.getAxisMotionValue(s);
    let m = this.originPoint[s] + v[s];
    this.constraints && this.constraints[s] && (m = IP(m, this.constraints[s], this.elastic[s])), R.set(m);
  }
  resolveConstraints() {
    var s;
    const { dragConstraints: f, dragElastic: v } = this.getProps(), S = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (s = this.visualElement.projection) === null || s === void 0 ? void 0 : s.layout, R = this.constraints;
    f && Rd(f) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : f && S ? this.constraints = YP(S.layoutBox, f) : this.constraints = !1, this.elastic = QP(v), R !== this.constraints && S && this.constraints && !this.hasMutatedConstraints && Ki((m) => {
      this.getAxisMotionValue(m) && (this.constraints[m] = GP(S.layoutBox[m], this.constraints[m]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: s, onMeasureDragConstraints: f } = this.getProps();
    if (!s || !Rd(s))
      return !1;
    const v = s.current;
    qi(v !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
    const { projection: S } = this.visualElement;
    if (!S || !S.layout)
      return !1;
    const R = e2(v, S.root, this.visualElement.getTransformPagePoint());
    let m = $P(S.layout.layoutBox, R);
    if (f) {
      const w = f(KP(m));
      this.hasMutatedConstraints = !!w, w && (m = V1(w));
    }
    return m;
  }
  startAnimation(s) {
    const { drag: f, dragMomentum: v, dragElastic: S, dragTransition: R, dragSnapToOrigin: m, onDragTransitionEnd: w } = this.getProps(), T = this.constraints || {}, b = Ki((M) => {
      if (!Zy(M, f, this.currentDirection))
        return;
      let k = T && T[M] || {};
      m && (k = { min: 0, max: 0 });
      const A = S ? 200 : 1e6, P = S ? 40 : 1e7, K = {
        type: "inertia",
        velocity: v ? s[M] : 0,
        bounceStiffness: A,
        bounceDamping: P,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...R,
        ...k
      };
      return this.startAxisValueAnimation(M, K);
    });
    return Promise.all(b).then(w);
  }
  startAxisValueAnimation(s, f) {
    const v = this.getAxisMotionValue(s);
    return v.start(ME(s, v, 0, f));
  }
  stopAnimation() {
    Ki((s) => this.getAxisMotionValue(s).stop());
  }
  pauseAnimation() {
    Ki((s) => {
      var f;
      return (f = this.getAxisMotionValue(s).animation) === null || f === void 0 ? void 0 : f.pause();
    });
  }
  getAnimationState(s) {
    var f;
    return (f = this.getAxisMotionValue(s).animation) === null || f === void 0 ? void 0 : f.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(s) {
    const f = "_drag" + s.toUpperCase(), v = this.visualElement.getProps(), S = v[f];
    return S || this.visualElement.getValue(s, (v.initial ? v.initial[s] : void 0) || 0);
  }
  snapToCursor(s) {
    Ki((f) => {
      const { drag: v } = this.getProps();
      if (!Zy(f, v, this.currentDirection))
        return;
      const { projection: S } = this.visualElement, R = this.getAxisMotionValue(f);
      if (S && S.layout) {
        const { min: m, max: w } = S.layout.layoutBox[f];
        R.set(s[f] - Nn(m, w, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: s, dragConstraints: f } = this.getProps(), { projection: v } = this.visualElement;
    if (!Rd(f) || !v || !this.constraints)
      return;
    this.stopAnimation();
    const S = { x: 0, y: 0 };
    Ki((m) => {
      const w = this.getAxisMotionValue(m);
      if (w) {
        const T = w.get();
        S[m] = WP({ min: T, max: T }, this.constraints[m]);
      }
    });
    const { transformTemplate: R } = this.visualElement.getProps();
    this.visualElement.current.style.transform = R ? R({}, "") : "none", v.root && v.root.updateScroll(), v.updateLayout(), this.resolveConstraints(), Ki((m) => {
      if (!Zy(m, s, null))
        return;
      const w = this.getAxisMotionValue(m), { min: T, max: b } = this.constraints[m];
      w.set(Nn(T, b, S[m]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    t2.set(this.visualElement, this);
    const s = this.visualElement.current, f = uu(s, "pointerdown", (T) => {
      const { drag: b, dragListener: M = !0 } = this.getProps();
      b && M && this.start(T);
    }), v = () => {
      const { dragConstraints: T } = this.getProps();
      Rd(T) && (this.constraints = this.resolveRefConstraints());
    }, { projection: S } = this.visualElement, R = S.addEventListener("measure", v);
    S && !S.layout && (S.root && S.root.updateScroll(), S.updateLayout()), v();
    const m = lu(window, "resize", () => this.scalePositionWithinConstraints()), w = S.addEventListener("didUpdate", ({ delta: T, hasLayoutChanged: b }) => {
      this.isDragging && b && (Ki((M) => {
        const k = this.getAxisMotionValue(M);
        k && (this.originPoint[M] += T[M].translate, k.set(k.get() + T[M].translate));
      }), this.visualElement.render());
    });
    return () => {
      m(), f(), R(), w && w();
    };
  }
  getProps() {
    const s = this.visualElement.getProps(), { drag: f = !1, dragDirectionLock: v = !1, dragPropagation: S = !1, dragConstraints: R = !1, dragElastic: m = lE, dragMomentum: w = !0 } = s;
    return {
      ...s,
      drag: f,
      dragDirectionLock: v,
      dragPropagation: S,
      dragConstraints: R,
      dragElastic: m,
      dragMomentum: w
    };
  }
}
function Zy(l, s, f) {
  return (s === !0 || s === l) && (f === null || f === l);
}
function r2(l, s = 10) {
  let f = null;
  return Math.abs(l.y) > s ? f = "y" : Math.abs(l.x) > s && (f = "x"), f;
}
class a2 extends vs {
  constructor(s) {
    super(s), this.removeGroupControls = $n, this.removeListeners = $n, this.controls = new n2(s);
  }
  mount() {
    const { dragControls: s } = this.node.getProps();
    s && (this.removeGroupControls = s.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || $n;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const ow = (l) => (s, f) => {
  l && yn.update(() => l(s, f));
};
class i2 extends vs {
  constructor() {
    super(...arguments), this.removePointerDownListener = $n;
  }
  onPointerDown(s) {
    this.session = new P1(s, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: H1(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: s, onPanStart: f, onPan: v, onPanEnd: S } = this.node.getProps();
    return {
      onSessionStart: ow(s),
      onStart: ow(f),
      onMove: v,
      onEnd: (R, m) => {
        delete this.session, S && yn.update(() => S(R, m));
      }
    };
  }
  mount() {
    this.removePointerDownListener = uu(this.node.current, "pointerdown", (s) => this.onPointerDown(s));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
function o2() {
  const l = ge.useContext(fg);
  if (l === null)
    return [!0, null];
  const { isPresent: s, onExitComplete: f, register: v } = l, S = ge.useId();
  return ge.useEffect(() => v(S), []), !s && f ? [!1, () => f && f(S)] : [!0];
}
const tg = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function lw(l, s) {
  return s.max === s.min ? 0 : l / (s.max - s.min) * 100;
}
const jh = {
  correct: (l, s) => {
    if (!s.target)
      return l;
    if (typeof l == "string")
      if (ut.test(l))
        l = parseFloat(l);
      else
        return l;
    const f = lw(l, s.target.x), v = lw(l, s.target.y);
    return `${f}% ${v}%`;
  }
}, l2 = {
  correct: (l, { treeScale: s, projectionDelta: f }) => {
    const v = l, S = hs.parse(l);
    if (S.length > 5)
      return v;
    const R = hs.createTransformer(l), m = typeof S[0] != "number" ? 1 : 0, w = f.x.scale * s.x, T = f.y.scale * s.y;
    S[0 + m] /= w, S[1 + m] /= T;
    const b = Nn(w, T, 0.5);
    return typeof S[2 + m] == "number" && (S[2 + m] /= b), typeof S[3 + m] == "number" && (S[3 + m] /= b), R(S);
  }
};
class u2 extends dE.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: s, layoutGroup: f, switchLayoutGroup: v, layoutId: S } = this.props, { projection: R } = s;
    yA(s2), R && (f.group && f.group.add(R), v && v.register && S && v.register(R), R.root.didUpdate(), R.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), R.setOptions({
      ...R.options,
      onExitComplete: () => this.safeToRemove()
    })), tg.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(s) {
    const { layoutDependency: f, visualElement: v, drag: S, isPresent: R } = this.props, m = v.projection;
    return m && (m.isPresent = R, S || s.layoutDependency !== f || f === void 0 ? m.willUpdate() : this.safeToRemove(), s.isPresent !== R && (R ? m.promote() : m.relegate() || yn.postRender(() => {
      const w = m.getStack();
      (!w || !w.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: s } = this.props.visualElement;
    s && (s.root.didUpdate(), queueMicrotask(() => {
      !s.currentAnimation && s.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: s, layoutGroup: f, switchLayoutGroup: v } = this.props, { projection: S } = s;
    S && (S.scheduleCheckAfterUnmount(), f && f.group && f.group.remove(S), v && v.deregister && v.deregister(S));
  }
  safeToRemove() {
    const { safeToRemove: s } = this.props;
    s && s();
  }
  render() {
    return null;
  }
}
function B1(l) {
  const [s, f] = o2(), v = ge.useContext(yE);
  return dE.createElement(u2, { ...l, layoutGroup: v, switchLayoutGroup: ge.useContext(Vw), isPresent: s, safeToRemove: f });
}
const s2 = {
  borderRadius: {
    ...jh,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: jh,
  borderTopRightRadius: jh,
  borderBottomLeftRadius: jh,
  borderBottomRightRadius: jh,
  boxShadow: l2
}, I1 = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], c2 = I1.length, uw = (l) => typeof l == "string" ? parseFloat(l) : l, sw = (l) => typeof l == "number" || ut.test(l);
function f2(l, s, f, v, S, R) {
  S ? (l.opacity = Nn(
    0,
    // TODO Reinstate this if only child
    f.opacity !== void 0 ? f.opacity : 1,
    d2(v)
  ), l.opacityExit = Nn(s.opacity !== void 0 ? s.opacity : 1, 0, p2(v))) : R && (l.opacity = Nn(s.opacity !== void 0 ? s.opacity : 1, f.opacity !== void 0 ? f.opacity : 1, v));
  for (let m = 0; m < c2; m++) {
    const w = `border${I1[m]}Radius`;
    let T = cw(s, w), b = cw(f, w);
    if (T === void 0 && b === void 0)
      continue;
    T || (T = 0), b || (b = 0), T === 0 || b === 0 || sw(T) === sw(b) ? (l[w] = Math.max(Nn(uw(T), uw(b), v), 0), (dl.test(b) || dl.test(T)) && (l[w] += "%")) : l[w] = b;
  }
  (s.rotate || f.rotate) && (l.rotate = Nn(s.rotate || 0, f.rotate || 0, v));
}
function cw(l, s) {
  return l[s] !== void 0 ? l[s] : l.borderRadius;
}
const d2 = Y1(0, 0.5, d1), p2 = Y1(0.5, 0.95, $n);
function Y1(l, s, f) {
  return (v) => v < l ? 0 : v > s ? 1 : f(qh(l, s, v));
}
function fw(l, s) {
  l.min = s.min, l.max = s.max;
}
function Qi(l, s) {
  fw(l.x, s.x), fw(l.y, s.y);
}
function dw(l, s, f, v, S) {
  return l -= s, l = sg(l, 1 / f, v), S !== void 0 && (l = sg(l, 1 / S, v)), l;
}
function h2(l, s = 0, f = 1, v = 0.5, S, R = l, m = l) {
  if (dl.test(s) && (s = parseFloat(s), s = Nn(m.min, m.max, s / 100) - m.min), typeof s != "number")
    return;
  let w = Nn(R.min, R.max, v);
  l === R && (w -= s), l.min = dw(l.min, s, f, w, S), l.max = dw(l.max, s, f, w, S);
}
function pw(l, s, [f, v, S], R, m) {
  h2(l, s[f], s[v], s[S], s.scale, R, m);
}
const v2 = ["x", "scaleX", "originX"], m2 = ["y", "scaleY", "originY"];
function hw(l, s, f, v) {
  pw(l.x, s, v2, f ? f.x : void 0, v ? v.x : void 0), pw(l.y, s, m2, f ? f.y : void 0, v ? v.y : void 0);
}
function vw(l) {
  return l.translate === 0 && l.scale === 1;
}
function $1(l) {
  return vw(l.x) && vw(l.y);
}
function y2(l, s) {
  return l.x.min === s.x.min && l.x.max === s.x.max && l.y.min === s.y.min && l.y.max === s.y.max;
}
function W1(l, s) {
  return Math.round(l.x.min) === Math.round(s.x.min) && Math.round(l.x.max) === Math.round(s.x.max) && Math.round(l.y.min) === Math.round(s.y.min) && Math.round(l.y.max) === Math.round(s.y.max);
}
function mw(l) {
  return gi(l.x) / gi(l.y);
}
class g2 {
  constructor() {
    this.members = [];
  }
  add(s) {
    OE(this.members, s), s.scheduleRender();
  }
  remove(s) {
    if (LE(this.members, s), s === this.prevLead && (this.prevLead = void 0), s === this.lead) {
      const f = this.members[this.members.length - 1];
      f && this.promote(f);
    }
  }
  relegate(s) {
    const f = this.members.findIndex((S) => s === S);
    if (f === 0)
      return !1;
    let v;
    for (let S = f; S >= 0; S--) {
      const R = this.members[S];
      if (R.isPresent !== !1) {
        v = R;
        break;
      }
    }
    return v ? (this.promote(v), !0) : !1;
  }
  promote(s, f) {
    const v = this.lead;
    if (s !== v && (this.prevLead = v, this.lead = s, s.show(), v)) {
      v.instance && v.scheduleRender(), s.scheduleRender(), s.resumeFrom = v, f && (s.resumeFrom.preserveOpacity = !0), v.snapshot && (s.snapshot = v.snapshot, s.snapshot.latestValues = v.animationValues || v.latestValues), s.root && s.root.isUpdating && (s.isLayoutDirty = !0);
      const { crossfade: S } = s.options;
      S === !1 && v.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((s) => {
      const { options: f, resumingFrom: v } = s;
      f.onExitComplete && f.onExitComplete(), v && v.options.onExitComplete && v.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((s) => {
      s.instance && s.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function yw(l, s, f) {
  let v = "";
  const S = l.x.translate / s.x, R = l.y.translate / s.y;
  if ((S || R) && (v = `translate3d(${S}px, ${R}px, 0) `), (s.x !== 1 || s.y !== 1) && (v += `scale(${1 / s.x}, ${1 / s.y}) `), f) {
    const { rotate: T, rotateX: b, rotateY: M } = f;
    T && (v += `rotate(${T}deg) `), b && (v += `rotateX(${b}deg) `), M && (v += `rotateY(${M}deg) `);
  }
  const m = l.x.scale * s.x, w = l.y.scale * s.y;
  return (m !== 1 || w !== 1) && (v += `scale(${m}, ${w})`), v || "none";
}
const S2 = (l, s) => l.depth - s.depth;
class C2 {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(s) {
    OE(this.children, s), this.isDirty = !0;
  }
  remove(s) {
    LE(this.children, s), this.isDirty = !0;
  }
  forEach(s) {
    this.isDirty && this.children.sort(S2), this.isDirty = !1, this.children.forEach(s);
  }
}
function E2(l, s) {
  const f = performance.now(), v = ({ timestamp: S }) => {
    const R = S - f;
    R >= s && (cu(v), l(R - s));
  };
  return yn.read(v, !0), () => cu(v);
}
function x2(l) {
  window.MotionDebug && window.MotionDebug.record(l);
}
function T2(l) {
  return l instanceof SVGElement && l.tagName !== "svg";
}
function R2(l, s, f) {
  const v = Za(l) ? l : kd(l);
  return v.start(ME("", v, s, f)), v.animation;
}
const gw = ["", "X", "Y", "Z"], b2 = { visibility: "hidden" }, Sw = 1e3;
let w2 = 0;
const Ac = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
};
function G1({ attachResizeListener: l, defaultParent: s, measureScroll: f, checkIsScrollRoot: v, resetTransform: S }) {
  return class {
    constructor(m = {}, w = s == null ? void 0 : s()) {
      this.id = w2++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, Ac.totalNodes = Ac.resolvedTargetDeltas = Ac.recalculatedProjection = 0, this.nodes.forEach(_2), this.nodes.forEach(N2), this.nodes.forEach(P2), this.nodes.forEach(M2), x2(Ac);
      }, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = m, this.root = w ? w.root || w : this, this.path = w ? [...w.path, w] : [], this.parent = w, this.depth = w ? w.depth + 1 : 0;
      for (let T = 0; T < this.path.length; T++)
        this.path[T].shouldResetTransform = !0;
      this.root === this && (this.nodes = new C2());
    }
    addEventListener(m, w) {
      return this.eventHandlers.has(m) || this.eventHandlers.set(m, new AE()), this.eventHandlers.get(m).add(w);
    }
    notifyListeners(m, ...w) {
      const T = this.eventHandlers.get(m);
      T && T.notify(...w);
    }
    hasListeners(m) {
      return this.eventHandlers.has(m);
    }
    /**
     * Lifecycles
     */
    mount(m, w = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = T2(m), this.instance = m;
      const { layoutId: T, layout: b, visualElement: M } = this.options;
      if (M && !M.current && M.mount(m), this.root.nodes.add(this), this.parent && this.parent.children.add(this), w && (b || T) && (this.isLayoutDirty = !0), l) {
        let k;
        const A = () => this.root.updateBlockedByResize = !1;
        l(m, () => {
          this.root.updateBlockedByResize = !0, k && k(), k = E2(A, 250), tg.hasAnimatedSinceResize && (tg.hasAnimatedSinceResize = !1, this.nodes.forEach(Ew));
        });
      }
      T && this.root.registerSharedNode(T, this), this.options.animate !== !1 && M && (T || b) && this.addEventListener("didUpdate", ({ delta: k, hasLayoutChanged: A, hasRelativeTargetChanged: P, layout: K }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const ee = this.options.transition || M.getDefaultTransition() || F2, { onLayoutAnimationStart: se, onLayoutAnimationComplete: Te } = M.getProps(), re = !this.targetLayout || !W1(this.targetLayout, K) || P, q = !A && P;
        if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || q || A && (re || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(k, q);
          const pe = {
            ..._E(ee, "layout"),
            onPlay: se,
            onComplete: Te
          };
          (M.shouldReduceMotion || this.options.layoutRoot) && (pe.delay = 0, pe.type = !1), this.startAnimation(pe);
        } else
          A || Ew(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = K;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const m = this.getStack();
      m && m.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, cu(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(U2), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: m } = this.options;
      return m && m.getProps().transformTemplate;
    }
    willUpdate(m = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (!this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let M = 0; M < this.path.length; M++) {
        const k = this.path[M];
        k.shouldResetTransform = !0, k.updateScroll("snapshot"), k.options.layoutRoot && k.willUpdate(!1);
      }
      const { layoutId: w, layout: T } = this.options;
      if (w === void 0 && !T)
        return;
      const b = this.getTransformTemplate();
      this.prevTransformTemplateValue = b ? b(this.latestValues, "") : void 0, this.updateSnapshot(), m && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Cw);
        return;
      }
      this.isUpdating || this.nodes.forEach(L2), this.isUpdating = !1, this.nodes.forEach(A2), this.nodes.forEach(D2), this.nodes.forEach(k2), this.clearAllSnapshots();
      const w = performance.now();
      ha.delta = ps(0, 1e3 / 60, w - ha.timestamp), ha.timestamp = w, ha.isProcessing = !0, UC.update.process(ha), UC.preRender.process(ha), UC.render.process(ha), ha.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, queueMicrotask(() => this.update()));
    }
    clearAllSnapshots() {
      this.nodes.forEach(O2), this.sharedNodes.forEach(V2);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, yn.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      yn.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let T = 0; T < this.path.length; T++)
          this.path[T].updateScroll();
      const m = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = lr(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: w } = this.options;
      w && w.notify("LayoutMeasure", this.layout.layoutBox, m ? m.layoutBox : void 0);
    }
    updateScroll(m = "measure") {
      let w = !!(this.options.layoutScroll && this.instance);
      this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === m && (w = !1), w && (this.scroll = {
        animationId: this.root.animationId,
        phase: m,
        isRoot: v(this.instance),
        offset: f(this.instance)
      });
    }
    resetTransform() {
      if (!S)
        return;
      const m = this.isLayoutDirty || this.shouldResetTransform, w = this.projectionDelta && !$1(this.projectionDelta), T = this.getTransformTemplate(), b = T ? T(this.latestValues, "") : void 0, M = b !== this.prevTransformTemplateValue;
      m && (w || Lc(this.latestValues) || M) && (S(this.instance, b), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(m = !0) {
      const w = this.measurePageBox();
      let T = this.removeElementScroll(w);
      return m && (T = this.removeTransform(T)), H2(T), {
        animationId: this.root.animationId,
        measuredBox: w,
        layoutBox: T,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: m } = this.options;
      if (!m)
        return lr();
      const w = m.measureViewportBox(), { scroll: T } = this.root;
      return T && (cs(w.x, T.offset.x), cs(w.y, T.offset.y)), w;
    }
    removeElementScroll(m) {
      const w = lr();
      Qi(w, m);
      for (let T = 0; T < this.path.length; T++) {
        const b = this.path[T], { scroll: M, options: k } = b;
        if (b !== this.root && M && k.layoutScroll) {
          if (M.isRoot) {
            Qi(w, m);
            const { scroll: A } = this.root;
            A && (cs(w.x, -A.offset.x), cs(w.y, -A.offset.y));
          }
          cs(w.x, M.offset.x), cs(w.y, M.offset.y);
        }
      }
      return w;
    }
    applyTransform(m, w = !1) {
      const T = lr();
      Qi(T, m);
      for (let b = 0; b < this.path.length; b++) {
        const M = this.path[b];
        !w && M.options.layoutScroll && M.scroll && M !== M.root && Dd(T, {
          x: -M.scroll.offset.x,
          y: -M.scroll.offset.y
        }), Lc(M.latestValues) && Dd(T, M.latestValues);
      }
      return Lc(this.latestValues) && Dd(T, this.latestValues), T;
    }
    removeTransform(m) {
      const w = lr();
      Qi(w, m);
      for (let T = 0; T < this.path.length; T++) {
        const b = this.path[T];
        if (!b.instance || !Lc(b.latestValues))
          continue;
        uE(b.latestValues) && b.updateSnapshot();
        const M = lr(), k = b.measurePageBox();
        Qi(M, k), hw(w, b.latestValues, b.snapshot ? b.snapshot.layoutBox : void 0, M);
      }
      return Lc(this.latestValues) && hw(w, this.latestValues), w;
    }
    setTargetDelta(m) {
      this.targetDelta = m, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(m) {
      this.options = {
        ...this.options,
        ...m,
        crossfade: m.crossfade !== void 0 ? m.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ha.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(m = !1) {
      var w;
      const T = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = T.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = T.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = T.isSharedProjectionDirty);
      const b = !!this.resumingFrom || this !== T;
      if (!(m || b && this.isSharedProjectionDirty || this.isProjectionDirty || !((w = this.parent) === null || w === void 0) && w.isProjectionDirty || this.attemptToResolveRelativeTarget))
        return;
      const { layout: k, layoutId: A } = this.options;
      if (!(!this.layout || !(k || A))) {
        if (this.resolvedRelativeTargetAt = ha.timestamp, !this.targetDelta && !this.relativeTarget) {
          const P = this.getClosestProjectingParent();
          P && P.layout && this.animationProgress !== 1 ? (this.relativeParent = P, this.forceRelativeParentToResolveTarget(), this.relativeTarget = lr(), this.relativeTargetOrigin = lr(), Gh(this.relativeTargetOrigin, this.layout.layoutBox, P.layout.layoutBox), Qi(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (this.target || (this.target = lr(), this.targetWithTransforms = lr()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), BP(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : Qi(this.target, this.layout.layoutBox), j1(this.target, this.targetDelta)) : Qi(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
            this.attemptToResolveRelativeTarget = !1;
            const P = this.getClosestProjectingParent();
            P && !!P.resumingFrom == !!this.resumingFrom && !P.options.layoutScroll && P.target && this.animationProgress !== 1 ? (this.relativeParent = P, this.forceRelativeParentToResolveTarget(), this.relativeTarget = lr(), this.relativeTargetOrigin = lr(), Gh(this.relativeTargetOrigin, this.target, P.target), Qi(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          Ac.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || uE(this.parent.latestValues) || z1(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var m;
      const w = this.getLead(), T = !!this.resumingFrom || this !== w;
      let b = !0;
      if ((this.isProjectionDirty || !((m = this.parent) === null || m === void 0) && m.isProjectionDirty) && (b = !1), T && (this.isSharedProjectionDirty || this.isTransformDirty) && (b = !1), this.resolvedRelativeTargetAt === ha.timestamp && (b = !1), b)
        return;
      const { layout: M, layoutId: k } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(M || k))
        return;
      Qi(this.layoutCorrected, this.layout.layoutBox);
      const A = this.treeScale.x, P = this.treeScale.y;
      XP(this.layoutCorrected, this.treeScale, this.path, T), w.layout && !w.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (w.target = w.layout.layoutBox);
      const { target: K } = w;
      if (!K) {
        this.projectionTransform && (this.projectionDelta = wd(), this.projectionTransform = "none", this.scheduleRender());
        return;
      }
      this.projectionDelta || (this.projectionDelta = wd(), this.projectionDeltaWithTransform = wd());
      const ee = this.projectionTransform;
      Wh(this.projectionDelta, this.layoutCorrected, K, this.latestValues), this.projectionTransform = yw(this.projectionDelta, this.treeScale), (this.projectionTransform !== ee || this.treeScale.x !== A || this.treeScale.y !== P) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", K)), Ac.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(m = !0) {
      if (this.options.scheduleRender && this.options.scheduleRender(), m) {
        const w = this.getStack();
        w && w.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    setAnimationOrigin(m, w = !1) {
      const T = this.snapshot, b = T ? T.latestValues : {}, M = { ...this.latestValues }, k = wd();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !w;
      const A = lr(), P = T ? T.source : void 0, K = this.layout ? this.layout.source : void 0, ee = P !== K, se = this.getStack(), Te = !se || se.members.length <= 1, re = !!(ee && !Te && this.options.crossfade === !0 && !this.path.some(j2));
      this.animationProgress = 0;
      let q;
      this.mixTargetDelta = (pe) => {
        const de = pe / 1e3;
        xw(k.x, m.x, de), xw(k.y, m.y, de), this.setTargetDelta(k), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Gh(A, this.layout.layoutBox, this.relativeParent.layout.layoutBox), z2(this.relativeTarget, this.relativeTargetOrigin, A, de), q && y2(this.relativeTarget, q) && (this.isProjectionDirty = !1), q || (q = lr()), Qi(q, this.relativeTarget)), ee && (this.animationValues = M, f2(M, b, this.latestValues, de, re, Te)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = de;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(m) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (cu(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = yn.update(() => {
        tg.hasAnimatedSinceResize = !0, this.currentAnimation = R2(0, Sw, {
          ...m,
          onUpdate: (w) => {
            this.mixTargetDelta(w), m.onUpdate && m.onUpdate(w);
          },
          onComplete: () => {
            m.onComplete && m.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const m = this.getStack();
      m && m.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Sw), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const m = this.getLead();
      let { targetWithTransforms: w, target: T, layout: b, latestValues: M } = m;
      if (!(!w || !T || !b)) {
        if (this !== m && this.layout && b && Q1(this.options.animationType, this.layout.layoutBox, b.layoutBox)) {
          T = this.target || lr();
          const k = gi(this.layout.layoutBox.x);
          T.x.min = m.target.x.min, T.x.max = T.x.min + k;
          const A = gi(this.layout.layoutBox.y);
          T.y.min = m.target.y.min, T.y.max = T.y.min + A;
        }
        Qi(w, T), Dd(w, M), Wh(this.projectionDeltaWithTransform, this.layoutCorrected, w, M);
      }
    }
    registerSharedNode(m, w) {
      this.sharedNodes.has(m) || this.sharedNodes.set(m, new g2()), this.sharedNodes.get(m).add(w);
      const b = w.options.initialPromotionConfig;
      w.promote({
        transition: b ? b.transition : void 0,
        preserveFollowOpacity: b && b.shouldPreserveFollowOpacity ? b.shouldPreserveFollowOpacity(w) : void 0
      });
    }
    isLead() {
      const m = this.getStack();
      return m ? m.lead === this : !0;
    }
    getLead() {
      var m;
      const { layoutId: w } = this.options;
      return w ? ((m = this.getStack()) === null || m === void 0 ? void 0 : m.lead) || this : this;
    }
    getPrevLead() {
      var m;
      const { layoutId: w } = this.options;
      return w ? (m = this.getStack()) === null || m === void 0 ? void 0 : m.prevLead : void 0;
    }
    getStack() {
      const { layoutId: m } = this.options;
      if (m)
        return this.root.sharedNodes.get(m);
    }
    promote({ needsReset: m, transition: w, preserveFollowOpacity: T } = {}) {
      const b = this.getStack();
      b && b.promote(this, T), m && (this.projectionDelta = void 0, this.needsReset = !0), w && this.setOptions({ transition: w });
    }
    relegate() {
      const m = this.getStack();
      return m ? m.relegate(this) : !1;
    }
    resetRotation() {
      const { visualElement: m } = this.options;
      if (!m)
        return;
      let w = !1;
      const { latestValues: T } = m;
      if ((T.rotate || T.rotateX || T.rotateY || T.rotateZ) && (w = !0), !w)
        return;
      const b = {};
      for (let M = 0; M < gw.length; M++) {
        const k = "rotate" + gw[M];
        T[k] && (b[k] = T[k], m.setStaticValue(k, 0));
      }
      m.render();
      for (const M in b)
        m.setStaticValue(M, b[M]);
      m.scheduleRender();
    }
    getProjectionStyles(m) {
      var w, T;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return b2;
      const b = {
        visibility: ""
      }, M = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, b.opacity = "", b.pointerEvents = eg(m == null ? void 0 : m.pointerEvents) || "", b.transform = M ? M(this.latestValues, "") : "none", b;
      const k = this.getLead();
      if (!this.projectionDelta || !this.layout || !k.target) {
        const ee = {};
        return this.options.layoutId && (ee.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, ee.pointerEvents = eg(m == null ? void 0 : m.pointerEvents) || ""), this.hasProjected && !Lc(this.latestValues) && (ee.transform = M ? M({}, "") : "none", this.hasProjected = !1), ee;
      }
      const A = k.animationValues || k.latestValues;
      this.applyTransformsToTarget(), b.transform = yw(this.projectionDeltaWithTransform, this.treeScale, A), M && (b.transform = M(A, b.transform));
      const { x: P, y: K } = this.projectionDelta;
      b.transformOrigin = `${P.origin * 100}% ${K.origin * 100}% 0`, k.animationValues ? b.opacity = k === this ? (T = (w = A.opacity) !== null && w !== void 0 ? w : this.latestValues.opacity) !== null && T !== void 0 ? T : 1 : this.preserveOpacity ? this.latestValues.opacity : A.opacityExit : b.opacity = k === this ? A.opacity !== void 0 ? A.opacity : "" : A.opacityExit !== void 0 ? A.opacityExit : 0;
      for (const ee in ng) {
        if (A[ee] === void 0)
          continue;
        const { correct: se, applyTo: Te } = ng[ee], re = b.transform === "none" ? A[ee] : se(A[ee], k);
        if (Te) {
          const q = Te.length;
          for (let pe = 0; pe < q; pe++)
            b[Te[pe]] = re;
        } else
          b[ee] = re;
      }
      return this.options.layoutId && (b.pointerEvents = k === this ? eg(m == null ? void 0 : m.pointerEvents) || "" : "none"), b;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((m) => {
        var w;
        return (w = m.currentAnimation) === null || w === void 0 ? void 0 : w.stop();
      }), this.root.nodes.forEach(Cw), this.root.sharedNodes.clear();
    }
  };
}
function D2(l) {
  l.updateLayout();
}
function k2(l) {
  var s;
  const f = ((s = l.resumeFrom) === null || s === void 0 ? void 0 : s.snapshot) || l.snapshot;
  if (l.isLead() && l.layout && f && l.hasListeners("didUpdate")) {
    const { layoutBox: v, measuredBox: S } = l.layout, { animationType: R } = l.options, m = f.source !== l.layout.source;
    R === "size" ? Ki((k) => {
      const A = m ? f.measuredBox[k] : f.layoutBox[k], P = gi(A);
      A.min = v[k].min, A.max = A.min + P;
    }) : Q1(R, f.layoutBox, v) && Ki((k) => {
      const A = m ? f.measuredBox[k] : f.layoutBox[k], P = gi(v[k]);
      A.max = A.min + P, l.relativeTarget && !l.currentAnimation && (l.isProjectionDirty = !0, l.relativeTarget[k].max = l.relativeTarget[k].min + P);
    });
    const w = wd();
    Wh(w, v, f.layoutBox);
    const T = wd();
    m ? Wh(T, l.applyTransform(S, !0), f.measuredBox) : Wh(T, v, f.layoutBox);
    const b = !$1(w);
    let M = !1;
    if (!l.resumeFrom) {
      const k = l.getClosestProjectingParent();
      if (k && !k.resumeFrom) {
        const { snapshot: A, layout: P } = k;
        if (A && P) {
          const K = lr();
          Gh(K, f.layoutBox, A.layoutBox);
          const ee = lr();
          Gh(ee, v, P.layoutBox), W1(K, ee) || (M = !0), k.options.layoutRoot && (l.relativeTarget = ee, l.relativeTargetOrigin = K, l.relativeParent = k);
        }
      }
    }
    l.notifyListeners("didUpdate", {
      layout: v,
      snapshot: f,
      delta: T,
      layoutDelta: w,
      hasLayoutChanged: b,
      hasRelativeTargetChanged: M
    });
  } else if (l.isLead()) {
    const { onExitComplete: v } = l.options;
    v && v();
  }
  l.options.transition = void 0;
}
function _2(l) {
  Ac.totalNodes++, l.parent && (l.isProjecting() || (l.isProjectionDirty = l.parent.isProjectionDirty), l.isSharedProjectionDirty || (l.isSharedProjectionDirty = !!(l.isProjectionDirty || l.parent.isProjectionDirty || l.parent.isSharedProjectionDirty)), l.isTransformDirty || (l.isTransformDirty = l.parent.isTransformDirty));
}
function M2(l) {
  l.isProjectionDirty = l.isSharedProjectionDirty = l.isTransformDirty = !1;
}
function O2(l) {
  l.clearSnapshot();
}
function Cw(l) {
  l.clearMeasurements();
}
function L2(l) {
  l.isLayoutDirty = !1;
}
function A2(l) {
  const { visualElement: s } = l.options;
  s && s.getProps().onBeforeLayoutMeasure && s.notify("BeforeLayoutMeasure"), l.resetTransform();
}
function Ew(l) {
  l.finishAnimation(), l.targetDelta = l.relativeTarget = l.target = void 0, l.isProjectionDirty = !0;
}
function N2(l) {
  l.resolveTargetDelta();
}
function P2(l) {
  l.calcProjection();
}
function U2(l) {
  l.resetRotation();
}
function V2(l) {
  l.removeLeadSnapshot();
}
function xw(l, s, f) {
  l.translate = Nn(s.translate, 0, f), l.scale = Nn(s.scale, 1, f), l.origin = s.origin, l.originPoint = s.originPoint;
}
function Tw(l, s, f, v) {
  l.min = Nn(s.min, f.min, v), l.max = Nn(s.max, f.max, v);
}
function z2(l, s, f, v) {
  Tw(l.x, s.x, f.x, v), Tw(l.y, s.y, f.y, v);
}
function j2(l) {
  return l.animationValues && l.animationValues.opacityExit !== void 0;
}
const F2 = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Rw = (l) => typeof navigator < "u" && navigator.userAgent.toLowerCase().includes(l), bw = Rw("applewebkit/") && !Rw("chrome/") ? Math.round : $n;
function ww(l) {
  l.min = bw(l.min), l.max = bw(l.max);
}
function H2(l) {
  ww(l.x), ww(l.y);
}
function Q1(l, s, f) {
  return l === "position" || l === "preserve-aspect" && !oE(mw(s), mw(f), 0.2);
}
const B2 = G1({
  attachResizeListener: (l, s) => lu(l, "resize", s),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), GC = {
  current: void 0
}, K1 = G1({
  measureScroll: (l) => ({
    x: l.scrollLeft,
    y: l.scrollTop
  }),
  defaultParent: () => {
    if (!GC.current) {
      const l = new B2({});
      l.mount(window), l.setOptions({ layoutScroll: !0 }), GC.current = l;
    }
    return GC.current;
  },
  resetTransform: (l, s) => {
    l.style.transform = s !== void 0 ? s : "none";
  },
  checkIsScrollRoot: (l) => window.getComputedStyle(l).position === "fixed"
}), I2 = {
  pan: {
    Feature: i2
  },
  drag: {
    Feature: a2,
    ProjectionNode: K1,
    MeasureLayout: B1
  }
}, Y2 = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function $2(l) {
  const s = Y2.exec(l);
  if (!s)
    return [,];
  const [, f, v] = s;
  return [f, v];
}
const W2 = 4;
function cE(l, s, f = 1) {
  qi(f <= W2, `Max CSS variable fallback depth detected in property "${l}". This may indicate a circular fallback dependency.`);
  const [v, S] = $2(l);
  if (!v)
    return;
  const R = window.getComputedStyle(s).getPropertyValue(v);
  if (R) {
    const m = R.trim();
    return O1(m) ? parseFloat(m) : m;
  } else return JC(S) ? cE(S, s, f + 1) : S;
}
function G2(l, { ...s }, f) {
  const v = l.current;
  if (!(v instanceof Element))
    return { target: s, transitionEnd: f };
  f && (f = { ...f }), l.values.forEach((S) => {
    const R = S.get();
    if (!JC(R))
      return;
    const m = cE(R, v);
    m && S.set(m);
  });
  for (const S in s) {
    const R = s[S];
    if (!JC(R))
      continue;
    const m = cE(R, v);
    m && (s[S] = m, f || (f = {}), f[S] === void 0 && (f[S] = R));
  }
  return { target: s, transitionEnd: f };
}
const Q2 = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "x",
  "y",
  "translateX",
  "translateY"
]), q1 = (l) => Q2.has(l), K2 = (l) => Object.keys(l).some(q1), Jy = (l) => l === Vc || l === ut, Dw = (l, s) => parseFloat(l.split(", ")[s]), kw = (l, s) => (f, { transform: v }) => {
  if (v === "none" || !v)
    return 0;
  const S = v.match(/^matrix3d\((.+)\)$/);
  if (S)
    return Dw(S[1], s);
  {
    const R = v.match(/^matrix\((.+)\)$/);
    return R ? Dw(R[1], l) : 0;
  }
}, q2 = /* @__PURE__ */ new Set(["x", "y", "z"]), X2 = Xh.filter((l) => !q2.has(l));
function Z2(l) {
  const s = [];
  return X2.forEach((f) => {
    const v = l.getValue(f);
    v !== void 0 && (s.push([f, v.get()]), v.set(f.startsWith("scale") ? 1 : 0));
  }), s.length && l.render(), s;
}
const _d = {
  // Dimensions
  width: ({ x: l }, { paddingLeft: s = "0", paddingRight: f = "0" }) => l.max - l.min - parseFloat(s) - parseFloat(f),
  height: ({ y: l }, { paddingTop: s = "0", paddingBottom: f = "0" }) => l.max - l.min - parseFloat(s) - parseFloat(f),
  top: (l, { top: s }) => parseFloat(s),
  left: (l, { left: s }) => parseFloat(s),
  bottom: ({ y: l }, { top: s }) => parseFloat(s) + (l.max - l.min),
  right: ({ x: l }, { left: s }) => parseFloat(s) + (l.max - l.min),
  // Transform
  x: kw(4, 13),
  y: kw(5, 14)
};
_d.translateX = _d.x;
_d.translateY = _d.y;
const J2 = (l, s, f) => {
  const v = s.measureViewportBox(), S = s.current, R = getComputedStyle(S), { display: m } = R, w = {};
  m === "none" && s.setStaticValue("display", l.display || "block"), f.forEach((b) => {
    w[b] = _d[b](v, R);
  }), s.render();
  const T = s.measureViewportBox();
  return f.forEach((b) => {
    const M = s.getValue(b);
    M && M.jump(w[b]), l[b] = _d[b](T, R);
  }), l;
}, eU = (l, s, f = {}, v = {}) => {
  s = { ...s }, v = { ...v };
  const S = Object.keys(s).filter(q1);
  let R = [], m = !1;
  const w = [];
  if (S.forEach((T) => {
    const b = l.getValue(T);
    if (!l.hasValue(T))
      return;
    let M = f[T], k = zh(M);
    const A = s[T];
    let P;
    if (ag(A)) {
      const K = A.length, ee = A[0] === null ? 1 : 0;
      M = A[ee], k = zh(M);
      for (let se = ee; se < K && A[se] !== null; se++)
        P ? qi(zh(A[se]) === P, "All keyframes must be of the same type") : (P = zh(A[se]), qi(P === k || Jy(k) && Jy(P), "Keyframes must be of the same dimension as the current value"));
    } else
      P = zh(A);
    if (k !== P)
      if (Jy(k) && Jy(P)) {
        const K = b.get();
        typeof K == "string" && b.set(parseFloat(K)), typeof A == "string" ? s[T] = parseFloat(A) : Array.isArray(A) && P === ut && (s[T] = A.map(parseFloat));
      } else k != null && k.transform && (P != null && P.transform) && (M === 0 || A === 0) ? M === 0 ? b.set(P.transform(M)) : s[T] = k.transform(A) : (m || (R = Z2(l), m = !0), w.push(T), v[T] = v[T] !== void 0 ? v[T] : s[T], b.jump(A));
  }), w.length) {
    const T = w.indexOf("height") >= 0 ? window.pageYOffset : null, b = J2(s, l, w);
    return R.length && R.forEach(([M, k]) => {
      l.getValue(M).set(k);
    }), l.render(), dg && T !== null && window.scrollTo({ top: T }), { target: b, transitionEnd: v };
  } else
    return { target: s, transitionEnd: v };
};
function tU(l, s, f, v) {
  return K2(s) ? eU(l, s, f, v) : { target: s, transitionEnd: v };
}
const nU = (l, s, f, v) => {
  const S = G2(l, s, v);
  return s = S.target, v = S.transitionEnd, tU(l, s, f, v);
}, fE = { current: null }, X1 = { current: !1 };
function rU() {
  if (X1.current = !0, !!dg)
    if (window.matchMedia) {
      const l = window.matchMedia("(prefers-reduced-motion)"), s = () => fE.current = l.matches;
      l.addListener(s), s();
    } else
      fE.current = !1;
}
function aU(l, s, f) {
  const { willChange: v } = s;
  for (const S in s) {
    const R = s[S], m = f[S];
    if (Za(R))
      l.addValue(S, R), ug(v) && v.add(S), process.env.NODE_ENV === "development" && NE(R.version === "10.18.0", `Attempting to mix Framer Motion versions ${R.version} with 10.18.0 may not work as expected.`);
    else if (Za(m))
      l.addValue(S, kd(R, { owner: l })), ug(v) && v.remove(S);
    else if (m !== R)
      if (l.hasValue(S)) {
        const w = l.getValue(S);
        !w.hasAnimated && w.set(R);
      } else {
        const w = l.getStaticValue(S);
        l.addValue(S, kd(w !== void 0 ? w : R, { owner: l }));
      }
  }
  for (const S in f)
    s[S] === void 0 && l.removeValue(S);
  return s;
}
const _w = /* @__PURE__ */ new WeakMap(), Z1 = Object.keys(Kh), iU = Z1.length, Mw = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
], oU = mE.length;
class lU {
  constructor({ parent: s, props: f, presenceContext: v, reducedMotionConfig: S, visualState: R }, m = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.scheduleRender = () => yn.render(this.render, !1, !0);
    const { latestValues: w, renderState: T } = R;
    this.latestValues = w, this.baseTarget = { ...w }, this.initialValues = f.initial ? { ...w } : {}, this.renderState = T, this.parent = s, this.props = f, this.presenceContext = v, this.depth = s ? s.depth + 1 : 0, this.reducedMotionConfig = S, this.options = m, this.isControllingVariants = hg(f), this.isVariantNode = Uw(f), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(s && s.current);
    const { willChange: b, ...M } = this.scrapeMotionValuesFromProps(f, {});
    for (const k in M) {
      const A = M[k];
      w[k] !== void 0 && Za(A) && (A.set(w[k], !1), ug(b) && b.add(k));
    }
  }
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(s, f) {
    return {};
  }
  mount(s) {
    this.current = s, _w.set(s, this), this.projection && !this.projection.instance && this.projection.mount(s), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((f, v) => this.bindToMotionValue(v, f)), X1.current || rU(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : fE.current, process.env.NODE_ENV !== "production" && NE(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected."), this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    _w.delete(this.current), this.projection && this.projection.unmount(), cu(this.notifyUpdate), cu(this.render), this.valueSubscriptions.forEach((s) => s()), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const s in this.events)
      this.events[s].clear();
    for (const s in this.features)
      this.features[s].unmount();
    this.current = null;
  }
  bindToMotionValue(s, f) {
    const v = Uc.has(s), S = f.on("change", (m) => {
      this.latestValues[s] = m, this.props.onUpdate && yn.update(this.notifyUpdate, !1, !0), v && this.projection && (this.projection.isTransformDirty = !0);
    }), R = f.on("renderRequest", this.scheduleRender);
    this.valueSubscriptions.set(s, () => {
      S(), R();
    });
  }
  sortNodePosition(s) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== s.type ? 0 : this.sortInstanceNodePosition(this.current, s.current);
  }
  loadFeatures({ children: s, ...f }, v, S, R) {
    let m, w;
    if (process.env.NODE_ENV !== "production" && S && v) {
      const T = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
      f.ignoreStrict ? ev(!1, T) : qi(!1, T);
    }
    for (let T = 0; T < iU; T++) {
      const b = Z1[T], { isEnabled: M, Feature: k, ProjectionNode: A, MeasureLayout: P } = Kh[b];
      A && (m = A), M(f) && (!this.features[b] && k && (this.features[b] = new k(this)), P && (w = P));
    }
    if ((this.type === "html" || this.type === "svg") && !this.projection && m) {
      this.projection = new m(this.latestValues, this.parent && this.parent.projection);
      const { layoutId: T, layout: b, drag: M, dragConstraints: k, layoutScroll: A, layoutRoot: P } = f;
      this.projection.setOptions({
        layoutId: T,
        layout: b,
        alwaysMeasureLayout: !!M || k && Rd(k),
        visualElement: this,
        scheduleRender: () => this.scheduleRender(),
        /**
         * TODO: Update options in an effect. This could be tricky as it'll be too late
         * to update by the time layout animations run.
         * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
         * ensuring it gets called if there's no potential layout animations.
         *
         */
        animationType: typeof b == "string" ? b : "both",
        initialPromotionConfig: R,
        layoutScroll: A,
        layoutRoot: P
      });
    }
    return w;
  }
  updateFeatures() {
    for (const s in this.features) {
      const f = this.features[s];
      f.isMounted ? f.update() : (f.mount(), f.isMounted = !0);
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.options, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : lr();
  }
  getStaticValue(s) {
    return this.latestValues[s];
  }
  setStaticValue(s, f) {
    this.latestValues[s] = f;
  }
  /**
   * Make a target animatable by Popmotion. For instance, if we're
   * trying to animate width from 100px to 100vw we need to measure 100vw
   * in pixels to determine what we really need to animate to. This is also
   * pluggable to support Framer's custom value types like Color,
   * and CSS variables.
   */
  makeTargetAnimatable(s, f = !0) {
    return this.makeTargetAnimatableFromInstance(s, this.props, f);
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(s, f) {
    (s.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = s, this.prevPresenceContext = this.presenceContext, this.presenceContext = f;
    for (let v = 0; v < Mw.length; v++) {
      const S = Mw[v];
      this.propEventSubscriptions[S] && (this.propEventSubscriptions[S](), delete this.propEventSubscriptions[S]);
      const R = s["on" + S];
      R && (this.propEventSubscriptions[S] = this.on(S, R));
    }
    this.prevMotionValues = aU(this, this.scrapeMotionValuesFromProps(s, this.prevProps), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(s) {
    return this.props.variants ? this.props.variants[s] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  getVariantContext(s = !1) {
    if (s)
      return this.parent ? this.parent.getVariantContext() : void 0;
    if (!this.isControllingVariants) {
      const v = this.parent ? this.parent.getVariantContext() || {} : {};
      return this.props.initial !== void 0 && (v.initial = this.props.initial), v;
    }
    const f = {};
    for (let v = 0; v < oU; v++) {
      const S = mE[v], R = this.props[S];
      (Qh(R) || R === !1) && (f[S] = R);
    }
    return f;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(s) {
    const f = this.getClosestVariantNode();
    if (f)
      return f.variantChildren && f.variantChildren.add(s), () => f.variantChildren.delete(s);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(s, f) {
    f !== this.values.get(s) && (this.removeValue(s), this.bindToMotionValue(s, f)), this.values.set(s, f), this.latestValues[s] = f.get();
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(s) {
    this.values.delete(s);
    const f = this.valueSubscriptions.get(s);
    f && (f(), this.valueSubscriptions.delete(s)), delete this.latestValues[s], this.removeValueFromRenderState(s, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(s) {
    return this.values.has(s);
  }
  getValue(s, f) {
    if (this.props.values && this.props.values[s])
      return this.props.values[s];
    let v = this.values.get(s);
    return v === void 0 && f !== void 0 && (v = kd(f, { owner: this }), this.addValue(s, v)), v;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(s) {
    var f;
    return this.latestValues[s] !== void 0 || !this.current ? this.latestValues[s] : (f = this.getBaseTargetFromProps(this.props, s)) !== null && f !== void 0 ? f : this.readValueFromInstance(this.current, s, this.options);
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(s, f) {
    this.baseTarget[s] = f;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(s) {
    var f;
    const { initial: v } = this.props, S = typeof v == "string" || typeof v == "object" ? (f = RE(this.props, v)) === null || f === void 0 ? void 0 : f[s] : void 0;
    if (v && S !== void 0)
      return S;
    const R = this.getBaseTargetFromProps(this.props, s);
    return R !== void 0 && !Za(R) ? R : this.initialValues[s] !== void 0 && S === void 0 ? void 0 : this.baseTarget[s];
  }
  on(s, f) {
    return this.events[s] || (this.events[s] = new AE()), this.events[s].add(f);
  }
  notify(s, ...f) {
    this.events[s] && this.events[s].notify(...f);
  }
}
class J1 extends lU {
  sortInstanceNodePosition(s, f) {
    return s.compareDocumentPosition(f) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(s, f) {
    return s.style ? s.style[f] : void 0;
  }
  removeValueFromRenderState(s, { vars: f, style: v }) {
    delete f[s], delete v[s];
  }
  makeTargetAnimatableFromInstance({ transition: s, transitionEnd: f, ...v }, { transformValues: S }, R) {
    let m = TP(v, s || {}, this);
    if (S && (f && (f = S(f)), v && (v = S(v)), m && (m = S(m))), R) {
      EP(this, v, m);
      const w = nU(this, v, m, f);
      f = w.transitionEnd, v = w.target;
    }
    return {
      transition: s,
      transitionEnd: f,
      ...v
    };
  }
}
function uU(l) {
  return window.getComputedStyle(l);
}
class sU extends J1 {
  constructor() {
    super(...arguments), this.type = "html";
  }
  readValueFromInstance(s, f) {
    if (Uc.has(f)) {
      const v = kE(f);
      return v && v.default || 0;
    } else {
      const v = uU(s), S = (Fw(f) ? v.getPropertyValue(f) : v[f]) || 0;
      return typeof S == "string" ? S.trim() : S;
    }
  }
  measureInstanceViewportBox(s, { transformPagePoint: f }) {
    return F1(s, f);
  }
  build(s, f, v, S) {
    SE(s, f, v, S.transformTemplate);
  }
  scrapeMotionValuesFromProps(s, f) {
    return TE(s, f);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: s } = this.props;
    Za(s) && (this.childSubscription = s.on("change", (f) => {
      this.current && (this.current.textContent = `${f}`);
    }));
  }
  renderInstance(s, f, v, S) {
    Ww(s, f, v, S);
  }
}
class cU extends J1 {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1;
  }
  getBaseTargetFromProps(s, f) {
    return s[f];
  }
  readValueFromInstance(s, f) {
    if (Uc.has(f)) {
      const v = kE(f);
      return v && v.default || 0;
    }
    return f = Gw.has(f) ? f : hE(f), s.getAttribute(f);
  }
  measureInstanceViewportBox() {
    return lr();
  }
  scrapeMotionValuesFromProps(s, f) {
    return Kw(s, f);
  }
  build(s, f, v, S) {
    EE(s, f, v, this.isSVGTag, S.transformTemplate);
  }
  renderInstance(s, f, v, S) {
    Qw(s, f, v, S);
  }
  mount(s) {
    this.isSVGTag = xE(s.tagName), super.mount(s);
  }
}
const fU = (l, s) => gE(l) ? new cU(s, { enableHardwareAcceleration: !1 }) : new sU(s, { enableHardwareAcceleration: !0 }), dU = {
  layout: {
    ProjectionNode: K1,
    MeasureLayout: B1
  }
}, pU = {
  ...zP,
  ...oN,
  ...I2,
  ...dU
}, hU = /* @__PURE__ */ vA((l, s) => GA(l, s, pU, fU));
function eD() {
  const l = ge.useRef(!1);
  return pE(() => (l.current = !0, () => {
    l.current = !1;
  }), []), l;
}
function vU() {
  const l = eD(), [s, f] = ge.useState(0), v = ge.useCallback(() => {
    l.current && f(s + 1);
  }, [s]);
  return [ge.useCallback(() => yn.postRender(v), [v]), s];
}
class mU extends ge.Component {
  getSnapshotBeforeUpdate(s) {
    const f = this.props.childRef.current;
    if (f && s.isPresent && !this.props.isPresent) {
      const v = this.props.sizeRef.current;
      v.height = f.offsetHeight || 0, v.width = f.offsetWidth || 0, v.top = f.offsetTop, v.left = f.offsetLeft;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function yU({ children: l, isPresent: s }) {
  const f = ge.useId(), v = ge.useRef(null), S = ge.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  });
  return ge.useInsertionEffect(() => {
    const { width: R, height: m, top: w, left: T } = S.current;
    if (s || !v.current || !R || !m)
      return;
    v.current.dataset.motionPopId = f;
    const b = document.createElement("style");
    return document.head.appendChild(b), b.sheet && b.sheet.insertRule(`
          [data-motion-pop-id="${f}"] {
            position: absolute !important;
            width: ${R}px !important;
            height: ${m}px !important;
            top: ${w}px !important;
            left: ${T}px !important;
          }
        `), () => {
      document.head.removeChild(b);
    };
  }, [s]), ge.createElement(mU, { isPresent: s, childRef: v, sizeRef: S }, ge.cloneElement(l, { ref: v }));
}
const QC = ({ children: l, initial: s, isPresent: f, onExitComplete: v, custom: S, presenceAffectsLayout: R, mode: m }) => {
  const w = qw(gU), T = ge.useId(), b = ge.useMemo(
    () => ({
      id: T,
      initial: s,
      isPresent: f,
      custom: S,
      onExitComplete: (M) => {
        w.set(M, !0);
        for (const k of w.values())
          if (!k)
            return;
        v && v();
      },
      register: (M) => (w.set(M, !1), () => w.delete(M))
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    R ? void 0 : [f]
  );
  return ge.useMemo(() => {
    w.forEach((M, k) => w.set(k, !1));
  }, [f]), ge.useEffect(() => {
    !f && !w.size && v && v();
  }, [f]), m === "popLayout" && (l = ge.createElement(yU, { isPresent: f }, l)), ge.createElement(fg.Provider, { value: b }, l);
};
function gU() {
  return /* @__PURE__ */ new Map();
}
function SU(l) {
  return ge.useEffect(() => () => l(), []);
}
const Nc = (l) => l.key || "";
function CU(l, s) {
  l.forEach((f) => {
    const v = Nc(f);
    s.set(v, f);
  });
}
function EU(l) {
  const s = [];
  return ge.Children.forEach(l, (f) => {
    ge.isValidElement(f) && s.push(f);
  }), s;
}
const xU = ({ children: l, custom: s, initial: f = !0, onExitComplete: v, exitBeforeEnter: S, presenceAffectsLayout: R = !0, mode: m = "sync" }) => {
  qi(!S, "Replace exitBeforeEnter with mode='wait'");
  const w = ge.useContext(yE).forceRender || vU()[0], T = eD(), b = EU(l);
  let M = b;
  const k = ge.useRef(/* @__PURE__ */ new Map()).current, A = ge.useRef(M), P = ge.useRef(/* @__PURE__ */ new Map()).current, K = ge.useRef(!0);
  if (pE(() => {
    K.current = !1, CU(b, P), A.current = M;
  }), SU(() => {
    K.current = !0, P.clear(), k.clear();
  }), K.current)
    return ge.createElement(ge.Fragment, null, M.map((re) => ge.createElement(QC, { key: Nc(re), isPresent: !0, initial: f ? void 0 : !1, presenceAffectsLayout: R, mode: m }, re)));
  M = [...M];
  const ee = A.current.map(Nc), se = b.map(Nc), Te = ee.length;
  for (let re = 0; re < Te; re++) {
    const q = ee[re];
    se.indexOf(q) === -1 && !k.has(q) && k.set(q, void 0);
  }
  return m === "wait" && k.size && (M = []), k.forEach((re, q) => {
    if (se.indexOf(q) !== -1)
      return;
    const pe = P.get(q);
    if (!pe)
      return;
    const de = ee.indexOf(q);
    let Pe = re;
    if (!Pe) {
      const Ee = () => {
        k.delete(q);
        const Fe = Array.from(P.keys()).filter((Be) => !se.includes(Be));
        if (Fe.forEach((Be) => P.delete(Be)), A.current = b.filter((Be) => {
          const wt = Nc(Be);
          return (
            // filter out the node exiting
            wt === q || // filter out the leftover children
            Fe.includes(wt)
          );
        }), !k.size) {
          if (T.current === !1)
            return;
          w(), v && v();
        }
      };
      Pe = ge.createElement(QC, { key: Nc(pe), isPresent: !1, onExitComplete: Ee, custom: s, presenceAffectsLayout: R, mode: m }, pe), k.set(q, Pe);
    }
    M.splice(de, 0, Pe);
  }), M = M.map((re) => {
    const q = re.key;
    return k.has(q) ? re : ge.createElement(QC, { key: Nc(re), isPresent: !0, presenceAffectsLayout: R, mode: m }, re);
  }), process.env.NODE_ENV !== "production" && m === "wait" && M.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`), ge.createElement(ge.Fragment, null, k.size ? M : M.map((re) => ge.cloneElement(re)));
}, KC = acquireVsCodeApi(), Fh = ({ children: l, className: s = "" }) => /* @__PURE__ */ Oe.jsx("div", { className: `liquid-glass liquid-glass-glow rounded-2xl p-6 ${s}`, children: /* @__PURE__ */ Oe.jsx("div", { className: "relative z-10", children: l }) }), TU = () => {
  var w;
  const [l, s] = ge.useState({ total: 0, online: 0, offline: 0, clients: [] }), [f, v] = ge.useState(null);
  ge.useEffect(() => {
    window.addEventListener("message", (T) => {
      const b = T.data;
      b.type === "update" && s(b.data);
    });
  }, []);
  const S = (T) => KC.postMessage({ action: "queryAll", command: T }), R = (T, b, M) => KC.postMessage({ action: "sendCommand", clientKey: T, command: b, payload: M }), m = () => KC.postMessage({ action: "generateReport" });
  return /* @__PURE__ */ Oe.jsxs("div", { className: "min-h-screen p-8 text-white", children: [
    /* @__PURE__ */ Oe.jsxs("div", { className: "flex justify-between items-center mb-10", children: [
      /* @__PURE__ */ Oe.jsxs("div", { children: [
        /* @__PURE__ */ Oe.jsx("h1", { className: "text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400", children: "Monitor Command Center" }),
        /* @__PURE__ */ Oe.jsx("p", { className: "text-slate-400", children: "Real-time system orchestration & visibility" })
      ] }),
      /* @__PURE__ */ Oe.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ Oe.jsxs(
          "button",
          {
            onClick: () => S("getSystemInfo"),
            className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-300",
            children: [
              /* @__PURE__ */ Oe.jsx(bb, { size: 18 }),
              " Refresh All"
            ]
          }
        ),
        /* @__PURE__ */ Oe.jsxs(
          "button",
          {
            onClick: m,
            className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all duration-300",
            children: [
              /* @__PURE__ */ Oe.jsx(eA, { size: 18 }),
              " Export Report"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ Oe.jsxs("div", { className: "flex flex-col gap-3 mb-6", children: [
      /* @__PURE__ */ Oe.jsx(Fh, { children: /* @__PURE__ */ Oe.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ Oe.jsx("div", { className: "p-2 bg-blue-500/20 rounded-lg text-blue-400", children: /* @__PURE__ */ Oe.jsx(rA, { size: 20 }) }),
        /* @__PURE__ */ Oe.jsxs("div", { children: [
          /* @__PURE__ */ Oe.jsx("p", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: "Total Assets" }),
          /* @__PURE__ */ Oe.jsx("h3", { className: "text-xl font-bold", children: l.total })
        ] })
      ] }) }),
      /* @__PURE__ */ Oe.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ Oe.jsx(Fh, { children: /* @__PURE__ */ Oe.jsxs("div", { className: "flex flex-col items-center text-center p-1", children: [
          /* @__PURE__ */ Oe.jsx(JL, { size: 16, className: "text-emerald-400 mb-1" }),
          /* @__PURE__ */ Oe.jsx("p", { className: "text-[10px] text-slate-500 uppercase", children: "Online" }),
          /* @__PURE__ */ Oe.jsx("h3", { className: "text-lg font-bold text-emerald-400", children: l.online })
        ] }) }),
        /* @__PURE__ */ Oe.jsx(Fh, { children: /* @__PURE__ */ Oe.jsxs("div", { className: "flex flex-col items-center text-center p-1", children: [
          /* @__PURE__ */ Oe.jsx(Rb, { size: 16, className: "text-rose-400 mb-1" }),
          /* @__PURE__ */ Oe.jsx("p", { className: "text-[10px] text-slate-500 uppercase", children: "Offline" }),
          /* @__PURE__ */ Oe.jsx("h3", { className: "text-lg font-bold text-rose-400", children: l.offline })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ Oe.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ Oe.jsxs("section", { children: [
        /* @__PURE__ */ Oe.jsxs("h2", { className: "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ Oe.jsx(nA, { size: 14, className: "text-blue-400" }),
          " Managed Fleet"
        ] }),
        /* @__PURE__ */ Oe.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ Oe.jsx(xU, { children: l.clients.length > 0 ? l.clients.map((T) => /* @__PURE__ */ Oe.jsx(
          hU.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            onClick: () => v(T.key),
            className: `cursor-pointer transition-all ${f === T.key ? "scale-[1.02]" : "hover:scale-[1.01]"}`,
            children: /* @__PURE__ */ Oe.jsx(Fh, { className: f === T.key ? "ring-2 ring-blue-500/50 bg-blue-500/10" : "", children: /* @__PURE__ */ Oe.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ Oe.jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${T.status === "online" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`, children: /* @__PURE__ */ Oe.jsx(iA, { size: 20 }) }),
              /* @__PURE__ */ Oe.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ Oe.jsxs("h3", { className: "font-bold text-xs truncate text-blue-300", children: [
                  T.username,
                  " ",
                  /* @__PURE__ */ Oe.jsx("span", { className: "text-slate-500 font-normal", children: "@" }),
                  " ",
                  T.hostname
                ] }),
                /* @__PURE__ */ Oe.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-slate-500", children: [
                  /* @__PURE__ */ Oe.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${T.status === "online" ? "bg-emerald-500" : "bg-rose-500"}` }),
                  T.bbrainyActive ? "BBrainy Active" : "Inactive"
                ] })
              ] })
            ] }) })
          },
          T.key
        )) : /* @__PURE__ */ Oe.jsx("div", { className: "text-center py-8 text-slate-500 text-xs border border-dashed border-white/10 rounded-xl", children: "Waiting for clients..." }) }) })
      ] }),
      /* @__PURE__ */ Oe.jsxs("section", { children: [
        /* @__PURE__ */ Oe.jsxs("h2", { className: "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ Oe.jsx(aA, { size: 14, className: "text-emerald-400" }),
          " Control Center"
        ] }),
        /* @__PURE__ */ Oe.jsx(Fh, { children: f ? /* @__PURE__ */ Oe.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ Oe.jsxs("p", { className: "text-[10px] text-slate-500 mb-2 truncate", children: [
            "Managing: ",
            (w = l.clients.find((T) => T.key === f)) == null ? void 0 : w.username
          ] }),
          /* @__PURE__ */ Oe.jsx(
            "button",
            {
              onClick: () => R(f, "getSystemInfo"),
              className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs",
              children: /* @__PURE__ */ Oe.jsxs("span", { className: "flex items-center gap-2 text-slate-300 tracking-tight leading-none", children: [
                /* @__PURE__ */ Oe.jsx(bb, { size: 14 }),
                " Refresh Node"
              ] })
            }
          ),
          /* @__PURE__ */ Oe.jsx(
            "button",
            {
              onClick: () => R(f, "forceBBrainy"),
              className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-emerald-400 text-xs",
              children: /* @__PURE__ */ Oe.jsxs("span", { className: "flex items-center gap-2 tracking-tight leading-none", children: [
                /* @__PURE__ */ Oe.jsx(Rb, { size: 14 }),
                " Wake BBrainy"
              ] })
            }
          ),
          /* @__PURE__ */ Oe.jsx(
            "button",
            {
              onClick: () => R(f, "getWorkspace"),
              className: "w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs",
              children: /* @__PURE__ */ Oe.jsxs("span", { className: "flex items-center gap-2 tracking-tight leading-none", children: [
                /* @__PURE__ */ Oe.jsx(tA, { size: 14 }),
                " Peek Directory"
              ] })
            }
          )
        ] }) : /* @__PURE__ */ Oe.jsx("div", { className: "text-[10px] text-slate-500 py-2 italic text-center", children: "Select a node to authorize actions" }) })
      ] }),
      /* @__PURE__ */ Oe.jsxs("section", { children: [
        /* @__PURE__ */ Oe.jsx("h2", { className: "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3", children: "Global" }),
        /* @__PURE__ */ Oe.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ Oe.jsx(
            "button",
            {
              onClick: () => S("checkBBrainy"),
              className: "flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] text-slate-400",
              children: "Scan Fleet"
            }
          ),
          /* @__PURE__ */ Oe.jsx(
            "button",
            {
              onClick: () => S("getSystemInfo"),
              className: "flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] text-slate-400",
              children: "Force Sync"
            }
          )
        ] })
      ] })
    ] })
  ] });
};
Bh.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ Oe.jsx(dE.StrictMode, { children: /* @__PURE__ */ Oe.jsx(TU, {}) })
);
