parcelRequire = function (e, r, t, n) {
    var i, o = "function" == typeof parcelRequire && parcelRequire, u = "function" == typeof require && require;

    function f(t, n) {
        if (!r[t]) {
            if (!e[t]) {
                var i = "function" == typeof parcelRequire && parcelRequire;
                if (!n && i) return i(t, !0);
                if (o) return o(t, !0);
                if (u && "string" == typeof t) return u(t);
                var c = new Error("Cannot find module '" + t + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            p.resolve = function (r) {
                return e[t][1][r] || r
            }, p.cache = {};
            var l = r[t] = new f.Module(t);
            e[t][0].call(l.exports, p, l, l.exports, this)
        }
        return r[t].exports;

        function p(e) {
            return f(p.resolve(e))
        }
    }

    f.isParcelRequire = !0, f.Module = function (e) {
        this.id = e, this.bundle = f, this.exports = {}
    }, f.modules = e, f.cache = r, f.parent = o, f.register = function (r, t) {
        e[r] = [function (e, r) {
            r.exports = t
        }, {}]
    };
    for (var c = 0; c < t.length; c++) try {
        f(t[c])
    } catch (e) {
        i || (i = e)
    }
    if (t.length) {
        var l = f(t[t.length - 1]);
        "object" == typeof exports && "undefined" != typeof module ? module.exports = l : "function" == typeof define && define.amd ? define(function () {
            return l
        }) : n && (this[n] = l)
    }
    if (parcelRequire = f, i) throw i;
    return f
}({
    "Focm": [function (require, module, exports) {
        function e(e, t) {
            var n = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var r = Object.getOwnPropertySymbols(e);
                t && (r = r.filter(function (t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), n.push.apply(n, r)
            }
            return n
        }

        function t(t) {
            for (var r = 1; r < arguments.length; r++) {
                var a = null != arguments[r] ? arguments[r] : {};
                r % 2 ? e(Object(a), !0).forEach(function (e) {
                    n(t, e, a[e])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a)) : e(Object(a)).forEach(function (e) {
                    Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e))
                })
            }
            return t
        }

        function n(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e
        }

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
            }
        }

        function o(e, t, n) {
            return t && a(e.prototype, t), n && a(e, n), e
        }

        var i = function () {
            function e() {
                var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                r(this, e);
                var a = {
                    header: !0,
                    title: "PL" !== (null == n ? void 0 : n.lang) ? "Exercise" : "Zadanie",
                    path: [],
                    resultInConsole: !1,
                    fontAwesome: !1,
                    bulma: !1,
                    lang: "PL"
                };
                this.settings = t(t({}, a), n), this.init()
            }

            return o(e, [{
                key: "init", value: function () {
                    var e = this;
                    document.addEventListener("DOMContentLoaded", function () {
                        e.head = document.querySelector("head"), e.body = document.querySelector("body"), e.currentScript = e.head.querySelector('script[src*="-api"]'), e.addStyles(), e.addHeader(), e.settings.resultInConsole && e.addResultInConsole(), e.settings.fontAwesome && e.addFontAwesome()
                    })
                }
            }, {
                key: "addStyles", value: function () {
                    var e = document.createElement("link");
                    e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap";
                    var t = document.createElement("link");
                    t.rel = "stylesheet", this.settings.bulma ? t.href = "https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" : t.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css";
                    var n = document.createElement("style");
                    n.innerHTML = '\n    :root {\n      --primary-color: rgb(243 190 77);\n      --color-black: rgb(78 78 80);\n      --color-light-grey: rgb(108 117 125);\n    }\n    \n    body {\n      font-family: "Ubuntu", sans-serif;\n    }\n    \n    .navbar {\n      background-color: var(--primary-color);\n      color: var(--color-black);\n   }\n    \n    .navbar-brand {\n      font-weight: 500;\n    }\n    \n    .breadcrumb-item {\n      color: var(--color-light-grey);\n    }\n    \n    .breadcrumb-item.active {\n      color: var(--color-black);\n      font-weight: 500;\n    }\n  ', this.head.insertBefore(t, this.currentScript), this.head.insertBefore(e, this.currentScript), this.head.insertBefore(n, this.currentScript)
                }
            }, {
                key: "addFontAwesome", value: function () {
                    var e = document.createElement("script");
                    e.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js", this.head.insertBefore(e, this.currentScript)
                }
            }, {
                key: "addHeader", value: function () {
                    var e = this.settings, t = e.title, n = e.path, r = document.createElement("header");
                    r.classList.add("mb-5");
                    var a = document.createElement("nav");
                    a.classList.add("navbar", "navbar-expand-lg", "justify-content-between");
                    var o = document.createElement("span");
                    if (o.classList.add("navbar-brand"), o.innerText = t, a.appendChild(o), r.appendChild(a), n.length > 0) {
                        var i = document.createElement("ul");
                        i.classList.add("breadcrumb"), n.forEach(function (e, t) {
                            var r = document.createElement("li");
                            r.classList.add("breadcrumb-item"), r.innerText = e, t === n.length - 1 && r.classList.add("active"), i.appendChild(r)
                        }), r.appendChild(i)
                    }
                    this.settings.header || (r.style.display = "none"), this.header = r, this.body.insertBefore(this.header, this.body.firstChild)
                }
            }, {
                key: "addResultInConsole", value: function () {
                    var e = document.createElement("section");
                    e.classList.add("container", "mb-5"), e.innerHTML = '<div class="card">\n        <div class="card-body">\n          <h2>'.concat("PL" === this.settings.lang ? "Sprawdź wynik w konsoli!" : "Check result in console!", '</h2>\n          <h4 class="mt-4">').concat("PL" === this.settings.lang ? "Narzędzia deweloperskie" : "Developer tools", "</h4>\n          <ul>\n            <li><code>F12</code></li>\n            <li><code>CTRL + SHIFT + I</code></li>\n            <li>MacOS: <code>CMD + OPT + I</code></li>\n          </ul>\n        </div>\n      </div>"), this.header.parentNode.insertBefore(e, this.header.nextSibling)
                }
            }]), e
        }();
        window.CL = i, window.Header = i;
    }, {}]
}, {}, ["Focm"], null)