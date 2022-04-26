/*! InstantDataScraperNext - 2021-01-21 */

function e(e) {
	return Math.max.apply(null, Object.keys(e).map(function(t) {
		return e[t]
	}))
}

function t(e, t) {
	return (t || ".") + e.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&").trim()
}

function n(e) {
	return (e.attr("class") || "").trim().split(/\s+/).filter(function(e) {
		return e
	})
}

function r(e) {
	var t = $(e).children(),
		r = {},
		o = {};
	t.each(function() {
		if (!["script", "img", "meta", "style"].includes(this.nodeName.toLowerCase()) && $(this).text().trim().length) {
			var e = n($(this)).sort(),
				t = e.join(" ");
			t in o || (o[t] = 0), o[t]++, e.forEach(function(e) {
				e in r || (r[e] = 0), r[e]++
			})
		}
	});
	var l = Object.keys(o).filter(function(e) {
		return o[e] >= t.length / 2 - 2
	});
	l.length || (l = Object.keys(r).filter(function(e) {
		return r[e] >= t.length / 2 - 2
	}));
	var i = $(e).width() * $(e).height();
	if (i > 5e4 && t.length > 10 && console.log("getChildrenSameClass", i, t.length, l, e), !l.length || 1 === l.length && "" === l[0]) return t.filter(function() {
		return this.nodeName ? !["script", "img", "meta", "style"].includes(this.nodeName.toLowerCase()) && !!$(this).text().trim().length : (console.log("???", this), !1)
	});
	return t.filter(function() {
		var e = !1,
			t = $(this);
		return l.forEach(function(n) {
			e |= function(e, t) {
				for (var n = t.split(" "), r = 0; r < n.length; r++)
					if (!e.hasClass(n[r])) return !1;
				return !0
			}(t, n)
		}), e
	})
}
var o = [],
	l = 0,
	i = 5;

function a(_e) {
	o = [], $("body *").each(function() {
		var e = $(this).width() * $(this).height(),
			t = r(this),
			n = t.length;
		n < 3 && (n = 0);
		var l = e * n * n;
		isNaN(l) || l < 10 || o.push({
			table: this,
			area: e,
			children: t,
			text: t.text(),
			score: l,
			selector: w(this)
		})
	}), o = o.sort(function(e, t) {
		return e.score > t.score ? -1 : e.score < t.score ? 1 : 0
	}).slice(0, i), console.log("Tabloları Bul : ", o)
}

function s() {
	var e = (l + o.length - 1) % o.length;
	$(o[e].table).removeClass("tablescraper-selected-table"), $(o[e].children).removeClass("tablescraper-selected-row"), $(o[l].table).addClass("tablescraper-selected-table"), $(o[l].children).addClass("tablescraper-selected-row")
}

function c() {
	$("*").removeClass("tablescraper-selected-table"), $("*").removeClass("tablescraper-selected-row")
}

function u(e) {
	return e.clone().children().remove().end().text()
}
var h, d, f = new Set;

function g(e) {
	var t = sha256.create();
	return t.update(e), t.hex()
}

function v(e) {
	if (null === localStorage.getItem("visited")) return !1; {
		const t = g(e),
			n = JSON.parse(localStorage.getItem("visited"));
		return n[n.length - 1] === t || n[n.length - 2] === t
	}
}

function m(e) {
	null === localStorage.getItem("visited") && localStorage.setItem("visited", JSON.stringify([]));
	const t = JSON.parse(localStorage.getItem("visited"));
	t.push(g(e)), localStorage.setItem("visited", JSON.stringify(t))
}

function b(e) {
	while (e.length) {
		if ($(e).length) return $(e);
		e = e.split(">").slice(1).join(">")
	}
	return null
}
async function p(e, t) {
	if (t) {
		var i = b(t);
		if (console.log("Tablo Verilerini Al : ", t, i), !i) return e({
			error: "Tablo bulunamadı!"
		}), void console.log("Tablo bulunamadı!");
		o.length || (o = [{}]);
		var a = r(i);
		return v(a.text()) ? (e({
			error: "Tablo değişmedi. Son sayfaya ulaşılmadıysa, gezinme gecikmesini artırmayı deneyin.",
			errorId: "finished"
		}), void console.log("Tablo değişmedi.")) : (o[l].table = i, o[l].children = a, o[l].text = a.text(), m(a.text()), s(), void p(e))
	}
	var c = [];
	o[l].children.each(function() {
		var e = {};

		function t(t, n, r) {
			if (t) {
				for (var o = n + (r ? " " + r : ""), l = o, i = 1; l in e;) l = o + " " + ++i;
				e[l] = t
			}
		}! function e(r, o, l) {
			if (l.nodeName) {
				var i = o + "/" + l.nodeName.toLowerCase() + n(r).map(e => "." + e).join("");
				t(u(r).trim(), i), t(r.prop("href"), i, "href"), t(r.prop("src"), i, "src"), r.children().each(function() {
					e($(this), i, this)
				})
			} else console.log("Ne???", l)
		}($(this), "", this), Object.keys(e).length && c.push(e)
	}), console.log("Toplanan Tablo Verileri : ", c), e({
		data: c,
		tableId: l,
		tableSelector: o[l].selector
	})
}

function w(e) {
	return $(e).parents().addBack().not("html").not("body").map(function() {
		var e = this.tagName.toLowerCase();
		return "string" == typeof this.id && this.id.trim() && !this.id.match(/\d+/g) ? e += t(this.id, "#") : "string" == typeof this.className && this.className.trim() && (e += t(this.className).replace(/ +/g, ".")), e
	}).get().join(">")
}

function x(e) {
	window.focus(), d = function(e) {
		$(this).is($(e.target)) && ($("*").removeClass("tablescraper-hover"), $(w(this)).last().addClass("tablescraper-hover"))
	};
	h = function(t) {
		return t.preventDefault(),
			function(t) {
				$("*").off("click", h).off("mouseenter", d), $(".tablescraper-hover").removeClass("tablescraper-hover"), $(".tablescraper-next-button").removeClass("tablescraper-next-button");
				var n = w(t.target);
				$(t.target).addClass("tablescraper-next-button"), console.log("Sonraki Buton Seçicisi : ", n), e({
					selector: n
				})
			}(t), !1
	}, $("*").click(h).on("mouseenter", d)
}
var y = !1;

function C(e) {
	var t = document.createEvent("MouseEvents");
	t.initMouseEvent("mousedown", !0, !0, window, 1, e.x, e.y, e.x, e.y, !1, !1, !1, !1, 0, null);
	var n = document.createEvent("MouseEvents");
	n.initMouseEvent("click", !0, !0, window, 1, e.x, e.y, e.x, e.y, !1, !1, !1, !1, 0, null);
	var r = document.createEvent("MouseEvents");
	r.initMouseEvent("mouseup", !0, !0, window, 1, e.x, e.y, e.x, e.y, !1, !1, !1, !1, 0, null), e.dispatchEvent(t), e.dispatchEvent(n), e.dispatchEvent(r)
}

function N(e, t) {
	return $("html, body").animate({
		scrollTop: $(document).height()
	}, 1e3), t(e === $(document).height() ? {
		error: "Tarama tamamlandı. CSV veya Excel dosyasını indirin..",
		errorId: "finished"
	} : {})
}

function I(e) {
	return new Promise(function(t, _n) {
		var r = $(e.rows),
			o = 0,
			l = 50;
		r.length * l > 1e3 && (l = 1e3 / r.length), l < 10 && (l = 10), console.log("Sonsuz Kaydırma Yapılıyor..", r.length, l);
		var i = setInterval(function() {
			if (o >= r.length) return clearInterval(i), console.log("Sonsuz Kaydırma Tamamlandı!"), void t();
			r[o].scrollIntoView(), o++
		}, l)
	})
}

function S(e, t, n) {
	var r = function(e) {
		while (e.length) {
			if ($(e).length) return $(e);
			e = e.split(" ").slice(1).join(" ")
		}
		return null
	}(e);
	return r ? (r.last().addClass("tablescraper-next-button"), n ? t({}) : ($("*").off("click", h).off("mouseenter", d), void setTimeout(function() {
		console.log("clickNext:", r.last()[0]), C(r.last()[0]), t({})
	}, 100))) : t(n ? {
		error: "Sonraki Düğmesi Bulunamadı!",
		errorId: "error"
	} : {
		error: "Daha fazla 'Sonraki' düğmesi yok; Tarama tamamlandı. CSV veya Excel dosyasını indirin..",
		errorId: "finished"
	})
}
chrome.extension.onRequest.addListener(function(e, _t, n) {
	return console.log("İstek Var", e), "nextTable" == e.action || "findTables" == e.action ? ("findTables" == e.action ? a(e.robot) : l = (l + 1) % o.length, s(), localStorage.removeItem("visited"), n({
		tableId: l,
		tableSelector: o[l].selector,
		href: window.location.href,
		hostname: window.location.hostname
	})) : "getTableData" == e.action ? p(n, e.selector) : "getNextButton" == e.action ? x(n) : "clickNext" == e.action ? S(e.selector, n) : "scrollDown" === e.action ? (c(), N(0, n)) : "markNextButton" == e.action ? S(e.selector, n, !0) : void n({})
});