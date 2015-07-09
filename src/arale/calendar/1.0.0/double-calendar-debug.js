/**
 *  双日期控件
 *  @arale/Calendar
 *  add by gjun 
 *  2015/4/10
 *  ##########
 */
define("arale/calendar/1.0.0/double-calendar-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "./base-calendar-debug", "arale/position/1.0.1/position-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "./i18n/zh-cn-debug", "./date-column-debug", "./base-column-debug", "./month-column-debug", "./year-column-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var BaseCalendar = require("./base-calendar-debug");
    var DateColumn = require("./date-column-debug");
    var MonthColumn = require("./month-column-debug");
    var YearColumn = require("./year-column-debug");
    var template = [ '<div class="ui-calendar ui-double-calendar">', '<div class="ui-calendar-start">', '<div class="ui-calendar-wrap">', '<div class="ui-calendar-pannel" data-role="pannel">', '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>', '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>', '<span class="ui-calendar-control month" data-role="start-month"></span>', '<span class="ui-calendar-control year" data-role="start-year"></span>', "</div>", "</div>", '<div class="ui-calendar-container" data-role="container"></div>', "</div>", '<div class="ui-calendar-end">', '<div class="ui-calendar-wrap">', '<div class="ui-calendar-pannel" data-role="pannel">', '<span class="ui-calendar-control month" data-role="end-month"></span>', '<span class="ui-calendar-control year" data-role="end-year"></span>', '<span class="ui-calendar-control" data-role="next-month">&gt;</span>', '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>', "</div>", "</div>", '<div class="ui-calendar-container" data-role="container"></div>', "</div>", '<div><a href="javascript:void(0)">清除</a></div>', "</div>" ].join("");
    var Calendar = BaseCalendar.extend({
        attrs: {
            template: template,
            modelstart: "startDates",
            modelend: "endDates",
            prefixdd: null
        },
        events: {
            "click [data-role=start-month]": function(ev) {
                if (this.get("modelstart") === "startMonth") {
                    this.renderContainer("startDates");
                } else {
                    this.renderContainer("startMonth");
                }
            },
            "click [data-role=start-year]": function(ev) {
                if (this.get("modelstart") === "startYear") {
                    this.renderContainer("startDates");
                } else {
                    this.renderContainer("startYear");
                }
            },
            "click [data-role=end-month]": function(ev) {
                if (this.get("modelend") === "endMonth") {
                    this.renderEnd("endDates");
                } else {
                    this.renderEnd("endMonth");
                }
            },
            "click [data-role=end-year]": function(ev) {
                if (this.get("modelend") === "endYear") {
                    this.renderEnd("endDates");
                } else {
                    this.renderEnd("endYear");
                }
            },
            "click [data-role=prev-year]": function(ev) {
                //上一年
                var focus = this.startYear.prev();
                this.startMonth.select(focus);
                this.startDates.select(focus);
                var focus1 = this.endYear.prev();
                this.endMonth.select(focus1);
                this.endDates.select(focus1);
            },
            "click [data-role=next-year]": function(ev) {
                //下一年
                var focus = this.startYear.next();
                this.startMonth.select(focus);
                this.startDates.select(focus);
                var focus1 = this.endYear.next();
                this.endMonth.select(focus1);
                this.endDates.select(focus1);
            },
            "click [data-role=prev-month]": function(ev) {
                //上一月
                var focus = this.startMonth.prev();
                this.startDates.select(focus);
                this.startYear.select(focus);
                var focus1 = this.endMonth.prev();
                this.endDates.select(focus1);
                this.endYear.select(focus1);
            },
            "click [data-role=next-month]": function(ev) {
                //下一月
                var focus = this.startMonth.next();
                this.startDates.select(focus);
                this.startYear.select(focus);
                var focus1 = this.endMonth.next();
                this.endDates.select(focus1);
                this.endYear.select(focus1);
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            this.after("hide", function(argument) {
                if (this.get("prefixdd") && $(this.get("trigger")).val().indexOf(this.get("prefixdd")) == -1) {
                    this.show();
                }
            });
            this.renderPannel();
            var focus = this.get("focus");
            var attrs = {
                focus: focus,
                lang: this.get("lang"),
                range: this.get("range"),
                format: this.get("format"),
                startDay: this.get("startDay"),
                process: this.get("process")
            };
            var self = this;
            this.startDates = new DateColumn(attrs);
            this.startMonth = new MonthColumn(attrs);
            this.startYear = new YearColumn(attrs);
            this.startDates.on("select", function(value, el) {
                //        
                console.log(value._i);
                self.set("focus", value);
                self.renderPannel();
                if (el) {
                    self.trigger("selectDate", value);
                    if (moment.isMoment(value)) {
                        value = value.format(this.get("format"));
                    }
                    if (self.get("prefixdd")) {
                        if ($(self.get("trigger")).val() !== "") {
                            if ($(self.get("trigger")).val().indexOf(self.get("prefixdd")) > -1) {
                                $(self.get("trigger")).val("");
                            } else {
                                value = $(self.get("trigger")).val() + self.get("prefixdd") + value;
                            }
                        }
                        if (value.indexOf(self.get("prefixdd")) > -1) {
                            var options = value.split(self.get("prefixdd"));
                            options[0] = new Date(options[0]).getTime();
                            options[1] = new Date(options[1]).getTime();
                            if (options[0] > options[1]) {
                                alert("日期选择非法");
                                return;
                            }
                        }
                    }
                    self.output(value);
                }
            });
            this.startMonth.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.month(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el) {
                    self.renderContainer("startDates", focus);
                    self.renderEnd("endDates", focus.clone().add("months", 1));
                    self.trigger("selectMonth", focus);
                }
            });
            this.startYear.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.year(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el && el.data("role") === "year") {
                    self.renderContainer("startDates", focus);
                    self.renderEnd("endDates", focus.clone().add("months", 1));
                    self.trigger("selectYear", focus);
                }
            });
            /*******截止时间*******/
            attrs["focus"] = this.get("focus").clone().add("months", 1);
            attrs["range"] = null;
            var date = new DateColumn(attrs);
            this.endDates = new DateColumn(attrs);
            this.endMonth = new MonthColumn(attrs);
            this.endYear = new YearColumn(attrs);
            this.endDates.on("select", function(value, el) {
                self.endDates.set("focus", value);
                self.renderPannel();
                if (el) {
                    self.trigger("selectDate", value);
                    if (moment.isMoment(value)) {
                        value = value.format(this.get("format"));
                    }
                    if (self.get("prefixdd")) {
                        if ($(self.get("trigger")).val() !== "") {
                            if ($(self.get("trigger")).val().indexOf(self.get("prefixdd")) > -1) {
                                $(self.get("trigger")).val("");
                            } else {
                                value = $(self.get("trigger")).val() + self.get("prefixdd") + value;
                            }
                        }
                        if (value.indexOf(self.get("prefixdd")) > -1) {
                            var options = value.split(self.get("prefixdd"));
                            options[0] = new Date(options[0]).getTime();
                            options[1] = new Date(options[1]).getTime();
                            if (options[0] > options[1]) {
                                alert("日期选择非法");
                                return;
                            }
                        }
                    }
                    self.output(value);
                }
            });
            this.endMonth.on("select", function(value, el) {
                var focus = self.endDates.get("focus");
                focus.month(value);
                self.endDates.set("focus", focus);
                var ff = self.get("focus");
                ff = focus.clone().subtract("months", 1);
                self.set("focus", ff);
                self.renderPannel();
                if (el) {
                    self.renderEnd("endDates", focus);
                    self.renderContainer("startDates", ff);
                    self.trigger("selectMonth", focus);
                }
            });
            this.endYear.on("select", function(value, el) {
                var focus = self.endDates.get("focus");
                focus.year(value);
                self.endDates.set("focus", focus);
                var ff = self.get("focus");
                ff = focus.clone().subtract("months", 1);
                self.set("focus", ff);
                self.renderPannel();
                if (el && el.data("role") === "year") {
                    self.renderEnd("endDates", focus);
                    self.renderContainer("startDates", ff);
                    self.trigger("selectYear", focus);
                }
            });
            var startCon = this.element.find(".ui-calendar-start .ui-calendar-container");
            startCon.append(this.startDates.element);
            startCon.append(this.startMonth.element);
            startCon.append(this.startYear.element);
            var endCon = this.element.find(".ui-calendar-end .ui-calendar-container");
            endCon.append(this.endDates.element);
            endCon.append(this.endMonth.element);
            endCon.append(this.endYear.element);
            this.renderEnd("endDates");
            this.renderContainer("startDates");
        },
        renderPannel: function() {
            var focus = this.get("focus");
            var startMonth = this.element.find("[data-role=start-month]");
            var startYear = this.element.find("[data-role=start-year]");
            var endMonth = this.element.find("[data-role=end-month]");
            var endYear = this.element.find("[data-role=end-year]");
            var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            var lang = this.get("lang");
            var month = MONTHS[focus.month()];
            month = lang[month] || month;
            startMonth.text(month);
            startYear.text(focus.year());
            focus = focus.clone();
            focus.add("months", 1);
            month = MONTHS[focus.month()];
            month = lang[month] || month;
            endMonth.text(month);
            endYear.text(focus.year());
        },
        renderContainer: function(mode, focus) {
            this.set("modelstart", mode);
            focus = focus || this.startDates.get("focus");
            this.startDates.hide();
            this.startMonth.hide();
            this.startYear.hide();
            this.startDates.select(focus, null);
            this.startMonth.select(focus, null);
            this.startYear.select(focus, null);
            if (mode === "startDates") {
                this.startDates.element.show();
            } else if (mode === "startMonth") {
                this.startMonth.element.show();
            } else if (mode === "startYear") {
                this.startYear.element.show();
            }
            return this;
        },
        renderEnd: function(mode, focus) {
            this.set("modelend", mode);
            focus = focus || this.endDates.get("focus");
            this.endDates.hide();
            this.endMonth.hide();
            this.endYear.hide();
            /* this.endDates.select(focus, null);
      this.endMonth.select(focus, null);
      this.endYear.select(focus, null);
*/
            if (mode === "endDates") {
                this.endDates.element.show();
            } else if (mode === "endMonth") {
                this.endMonth.element.show();
            } else if (mode === "endYear") {
                this.endYear.element.show();
            }
            return this;
        },
        destroy: function() {
            this.startDates.destroy();
            this.endDates.destroy();
            Calendar.superclass.destroy.call(this);
        }
    });
    module.exports = Calendar;
});

define("arale/calendar/1.0.0/base-calendar-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/calendar/1.0.0/i18n/zh-cn-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug");
    var lang = require("arale/calendar/1.0.0/i18n/zh-cn-debug") || {};
    var ua = (window.navigator.userAgent || "").toLowerCase();
    var match = ua.match(/msie\s+(\d+)/);
    var insaneIE = false;
    if (match && match[1]) {
        // IE < 9
        insaneIE = parseInt(match[1], 10) < 9;
    }
    if (document.documentMode && document.documentMode < 9) {
        insaneIE = true;
    }
    var current_date = moment();
    current_date = moment([ current_date.year(), current_date.month(), current_date.date() ]);
    var BaseCalendar = Widget.extend({
        attrs: {
            lang: lang,
            trigger: null,
            triggerType: "click",
            output: {
                value: "",
                getter: function(val) {
                    val = val ? val : this.get("trigger");
                    return $(val);
                }
            },
            hideOnSelect: true,
            focus: {
                value: "",
                getter: function(val) {
                    val = val || this._outputTime();
                    if (val) {
                        return moment(val, this.get("format"));
                    }
                    return current_date;
                },
                setter: function(val) {
                    if (!val) {
                        return current_date;
                    }
                    return moment(val, this.get("format"));
                }
            },
            format: "YYYY-MM-DD",
            startDay: "Sun",
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            process: null,
            align: {
                getter: function(val) {
                    if (val) return val;
                    var trigger = $(this.get("trigger"));
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 0, "100%" ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        },
        setup: function() {
            BaseCalendar.superclass.setup.call(this);
            this.enable();
            this._shim = new Shim(this.element).sync();
            var self = this;
            // keep cursor focus in trigger
            this.element.on("mousedown", function(e) {
                if (insaneIE) {
                    var trigger = $(self.get("trigger"))[0];
                    trigger.onbeforedeactivate = function() {
                        window.event.returnValue = false;
                        trigger.onbeforedeactivate = null;
                    };
                }
                e.preventDefault();
            });
        },
        show: function() {
            this.trigger("show");
            if (!this.rendered) {
                this._pin();
                this.render();
            }
            this._pin();
            this.element.show();
        },
        hide: function() {
            this.trigger("hide");
            this.element.hide();
        },
        _pin: function(align) {
            align = align || this.get("align");
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
        },
        _outputTime: function() {
            // parse time from output value
            var output = $(this.get("output"));
            var value = output.val() || output.text();
            if (value) {
                value = moment(value, this.get("format"));
                if (value.isValid()) {
                    return value;
                }
            }
        },
        output: function(value) {
            // send value to output
            var output = this.get("output");
            if (!output.length) {
                return;
            }
            value = value || this.get("focus");
            var tagName = output[0].tagName.toLowerCase();
            if (tagName === "input" || tagName === "textarea") {
                output.val(value);
            } else {
                output.text(value);
            }
            if (this.get("hideOnSelect")) {
                this.hide();
            }
        },
        enable: function() {
            // enable trigger for show calendar
            var trigger = this.get("trigger");
            if (!trigger) {
                return;
            }
            var self = this;
            var $trigger = $(trigger);
            if ($trigger.attr("type") === "date") {
                try {
                    // remove default style for type date
                    $trigger.attr("type", "text");
                } catch (e) {}
            }
            var event = this.get("triggerType") + ".calendar";
            $trigger.on(event, function() {
                self.show();
            });
            $trigger.on("blur.calendar", function() {
                self.hide();
            });
            // enable auto hide feature
            if ($trigger[0].tagName.toLowerCase() !== "input") {
                self.autohide();
            }
        },
        disable: function() {
            // disable trigger
            var trigger = this.get("trigger");
            var self = this;
            if (trigger) {
                var $trigger = $(trigger);
                var event = this.get("triggerType") + ".calendar";
                $trigger.off(event);
                $trigger.off("blur.calendar");
            }
        },
        autohide: function() {
            // autohide when trigger is not input
            var me = this;
            var trigger = $(this.get("trigger"))[0];
            var element = this.element;
            // click anywhere except calendar and trigger
            $("body").on("mousedown.calendar", function(e) {
                // not click on element
                if (element.find(e.target).length || element[0] === e.target) {
                    return;
                }
                // not click on trigger
                if (trigger !== e.target) {
                    me.hide();
                }
            });
        },
        destroy: function() {
            if (this._shim) {
                this._shim.destroy();
            }
            // clean event binding of autohide
            $("body").off("mousedown.calendar");
            BaseCalendar.superclass.destroy.call(this);
        }
    });
    module.exports = BaseCalendar;
});

define("arale/calendar/1.0.0/i18n/zh-cn-debug", [], {
    Su: "日",
    Mo: "一",
    Tu: "二",
    We: "三",
    Th: "四",
    Fr: "五",
    Sa: "六",
    Jan: "一月",
    Feb: "二月",
    Mar: "三月",
    Apr: "四月",
    May: "五月",
    Jun: "六月",
    Jul: "七月",
    Aug: "八月",
    Sep: "九月",
    Oct: "十月",
    Nov: "十一月",
    Dec: "十二月"
});

define("arale/calendar/1.0.0/date-column-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/calendar/1.0.0/base-column-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var BaseColumn = require("arale/calendar/1.0.0/base-column-debug");
    var DateColumn = BaseColumn.extend({
        attrs: {
            startDay: "Sun",
            template: template,
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            process: null,
            model: {
                getter: function() {
                    var date = createDateModel(this.get("focus"), this.get("startDay"), this.get("range"), this.get("process"));
                    var day = createDayModel(this.get("startDay"));
                    return {
                        date: date,
                        day: day
                    };
                }
            }
        },
        events: {
            "click [data-role=date]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        prev: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", -1);
            return this._sync(focus, prev);
        },
        next: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", 1);
            return this._sync(focus, prev);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var prev = this.get("focus").format("YYYY-MM-DD");
            this.set("focus", value);
            return this._sync(this.get("focus"), prev, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.format("YYYY-MM-DD") + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        inRange: function(date) {
            if (!moment.isMoment(date)) {
                date = moment(date, this.get("format"));
            }
            return BaseColumn.isInRange(date, this.get("range"));
        },
        _sync: function(focus, prev, el) {
            this.set("focus", focus);
            if (focus.format("YYYY-MM") !== prev) {
                this.refresh();
            }
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus, el);
            }
            return focus;
        }
    });
    module.exports = DateColumn;
    // helpers
    var DAYS = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];
    function parseStartDay(startDay) {
        startDay = (startDay || 0).toString().toLowerCase();
        if ($.isNumeric(startDay)) {
            startDay = parseInt(startDay, 10);
            return startDay;
        }
        for (var i = 0; i < DAYS.length; i++) {
            if (DAYS[i].indexOf(startDay) === 0) {
                startDay = i;
                break;
            }
        }
        return startDay;
    }
    var DAY_LABELS = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];
    function createDayModel(startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        for (i = 0; i < startDay; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        var current = {
            value: startDay,
            label: DAY_LABELS[startDay]
        };
        return {
            current: current,
            items: items
        };
    }
    function createDateModel(current, startDay, range, fn) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);
        var pushData = function(d, className) {
            var item = {
                value: d.format("YYYY-MM-DD"),
                label: d.date(),
                day: d.day(),
                className: className,
                available: BaseColumn.isInRange(d, range)
            };
            if (fn) {
                item.type = "date";
                item = fn(item);
            }
            items.push(item);
        };
        // reset to the first date of the month
        var currentMonth = current.clone().date(1);
        var previousMonth = currentMonth.clone().add("months", -1);
        var nextMonth = currentMonth.clone().add("months", 1);
        // Calculate days of previous month
        // that should be on current month's sheet
        delta = currentMonth.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previousMonth.daysInMonth();
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previousMonth.date(daysInMonth - i);
                pushData(d, "previous-month");
            }
        }
        daysInMonth = currentMonth.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = currentMonth.date(i);
            pushData(d, "current-month");
        }
        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = nextMonth.date(i);
                pushData(d, "next-month");
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }
        var _current = {
            value: current.format("YYYY-MM-DD"),
            label: current.date()
        };
        return {
            current: _current,
            items: list
        };
    }
    /* template in handlebars
  <table class="ui-calendar-date" data-role="date-column">
    <tr class="ui-calendar-day-column">
      {{#each day.items}}
      <th class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</th>
      {{/each}}
    </tr>
    {{#each date.items}}
    <tr class="ui-calendar-date-column">
      {{#each this}}
      <td class="ui-calendar-day-{{day}} {{className}} {{#unless available}}disabled-element{{/unless}}" data-role="date" data-value="{{value}}">{{label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */
    function template(model, options) {
        // keep the same API as handlebars
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-date" data-role="date-column">';
        // day column
        html += '<tr class="ui-calendar-day-column">';
        $.each(model.day.items, function(i, item) {
            html += '<th class="ui-calendar-day ui-calendar-day-' + item.value + '" ';
            html += 'data-role="day" data-value="' + item.value + '">';
            html += _(item.label);
            html += "</th>";
        });
        html += "</tr>";
        // date column
        $.each(model.date.items, function(i, items) {
            html += '<tr class="ui-calendar-date-column">';
            $.each(items, function(i, item) {
                var className = [ "ui-calendar-day-" + item.day, item.className || "" ];
                if (!item.available) {
                    className.push("disabled-element");
                }
                html += '<td class="' + className.join(" ") + '" data-role="date"';
                html += 'data-value="' + item.value + '">';
                html += item.label + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("arale/calendar/1.0.0/base-column-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var current_date = moment();
    current_date = moment([ current_date.year(), current_date.month(), current_date.date() ]);
    var BaseColumn = Widget.extend({
        attrs: {
            focus: {
                value: "",
                getter: function(val) {
                    if (val) {
                        return val;
                    }
                    return current_date;
                },
                setter: function(val) {
                    if (!val) {
                        return current_date;
                    }
                    if (moment.isMoment(val)) {
                        return val;
                    }
                    return moment(val, this.get("format"));
                }
            },
            template: null,
            format: "YYYY-MM-DD",
            range: {
                value: "",
                getter: function(val) {
                    if (!val) {
                        return null;
                    }
                    if ($.isArray(val)) {
                        var start = val[0];
                        if (start && start.length > 4) {
                            start = moment(start, this.get("format"));
                        }
                        var end = val[1];
                        if (end && end.length > 4) {
                            end = moment(end, this.get("format"));
                        }
                        return [ start, end ];
                    }
                    return val;
                }
            },
            lang: {}
        },
        compileTemplate: function() {
            // the template is a runtime handlebars function
            var fn = this.get("template");
            if (!fn) {
                return "";
            }
            var model = this.get("model");
            var self = this;
            var lang = this.get("lang") || {};
            return fn(model, {
                helpers: {
                    _: function(key) {
                        return lang[key] || key;
                    }
                }
            });
        },
        parseElement: function() {
            // rewrite parseElement of widget
            this.element = $(this.compileTemplate());
        },
        show: function() {
            this.render();
            this.focus();
        },
        hide: function() {
            this.element.hide();
        },
        refresh: function() {
            this.element.html($(this.compileTemplate()).html());
        }
    });
    module.exports = BaseColumn;
    BaseColumn.isInRange = function(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        if ($.isFunction(range)) {
            return range(date);
        }
        return true;
    };
});

define("arale/calendar/1.0.0/month-column-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/calendar/1.0.0/base-column-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var BaseColumn = require("arale/calendar/1.0.0/base-column-debug");
    var MonthColumn = BaseColumn.extend({
        attrs: {
            template: template,
            process: null,
            model: {
                getter: function() {
                    return createMonthModel(this.get("focus"), this.get("process"), this);
                }
            }
        },
        events: {
            "click [data-role=month]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        setup: function() {
            MonthColumn.superclass.setup.call(this);
            this.on("change:range", function() {
                this.element.html($(this.compileTemplate()).html());
            });
        },
        prev: function() {
            var focus = this.get("focus").add("months", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("months", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.month) {
                focus = value;
            } else {
                focus = this.get("focus").month(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.month() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        refresh: function() {
            var focus = this.get("focus").year();
            var year = this.element.find("[data-year]").data("year");
            if (parseInt(year, 10) !== focus) {
                this.element.html($(this.compileTemplate()).html());
            }
        },
        inRange: function(date) {
            var range = this.get("range");
            if (date.month) {
                return isInRange(date, range);
            }
            if (date.toString().length < 3) {
                var time = this.get("focus");
                return isInRange(time.clone().month(date), range);
            }
            return isInRange(moment(date, this.get("format")), range);
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.refresh();
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus.month(), el);
            }
            return focus;
        }
    });
    module.exports = MonthColumn;
    // helpers
    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    function createMonthModel(time, fn, ctx) {
        var month = time.month();
        var items = [];
        for (i = 0; i < MONTHS.length; i++) {
            var item = {
                value: i,
                available: ctx.inRange.call(ctx, i),
                label: MONTHS[i]
            };
            if (fn) {
                item.type = "month";
                item = fn(item);
            }
            items.push(item);
        }
        var current = {
            year: time.year(),
            value: month,
            label: MONTHS[month]
        };
        // split [1, 2, .. 12] to [[1, 2, 3, 4], [5, ...]...]
        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        return {
            current: current,
            items: list
        };
    }
    function isInRange(d, range) {
        // reset to the first day
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start && start.month) {
                var lastDate = d.clone().date(d.daysInMonth());
                lastDate.hour(23).minute(59).second(59).millisecond(999);
                result = result && lastDate >= start;
            } else if (start) {
                result = result && d.month() + 1 >= start;
            }
            if (end && end.month) {
                var firstDate = d.clone().date(1);
                firstDate.hour(0).minute(0).second(0).millisecond(0);
                result = result && firstDate <= end;
            } else if (end) {
                result = result && d.month() + 1 <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
  <table class="ui-calendar-month" data-role="month-column">
  {{#each items}}
  <tr class="ui-calendar-month-column">
      {{#each this}}
      <td class="{{#unless available}}disabled-element{{/unless}}" data-role="month" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
  </tr>
  {{/each}}
  </table>
  */
    function template(model, options) {
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-month" data-role="month-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-month-column" data-year="' + model.current.year + '">';
            $.each(items, function(i, item) {
                html += '<td data-role="month"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("arale/calendar/1.0.0/year-column-debug", [ "$-debug", "arale/calendar/1.0.0/base-column-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var BaseColumn = require("arale/calendar/1.0.0/base-column-debug");
    var YearColumn = BaseColumn.extend({
        attrs: {
            process: null,
            template: template,
            model: {
                getter: function() {
                    return createYearModel(this.get("focus"), this.get("range"), this.get("process"));
                }
            }
        },
        events: {
            "click [data-role=year],[data-role=previous-10-year],[data-role=next-10-year]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        setup: function() {
            YearColumn.superclass.setup.call(this);
            this.on("change:range", function() {
                this.element.html($(this.compileTemplate()).html());
            });
        },
        prev: function() {
            var focus = this.get("focus").add("years", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("years", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.year) {
                focus = value;
            } else {
                focus = this.get("focus").year(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.year() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        refresh: function() {
            var focus = this.get("focus").year();
            var years = this.element.find("[data-role=year]");
            if (focus < years.first().data("value") || focus > years.last().data("value")) {
                this.element.html($(this.compileTemplate()).html());
            }
        },
        inRange: function(date) {
            return isInRange(date, this.get("range"));
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.refresh();
            this.focus(focus);
            if (el !== null) {
                this.trigger("select", focus.year(), el);
            }
            return focus;
        }
    });
    module.exports = YearColumn;
    // helpers
    function createYearModel(time, range, fn) {
        var year = time.year();
        var items = [ process({
            value: year - 10,
            label: ". . .",
            available: true,
            role: "previous-10-year"
        }, fn) ];
        for (var i = year - 6; i < year + 4; i++) {
            items.push(process({
                value: i,
                label: i,
                available: isInRange(i, range),
                role: "year"
            }, fn));
        }
        items.push(process({
            value: year + 10,
            label: ". . .",
            available: true,
            role: "next-10-year"
        }, fn));
        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        var current = {
            value: year,
            label: year
        };
        return {
            current: current,
            items: list
        };
    }
    function process(item, fn) {
        if (!fn) {
            return item;
        }
        item.type = "year";
        return fn(item);
    }
    function isInRange(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            if (start && start.year) {
                start = start.year();
            }
            var end = range[1];
            if (end && end.year) {
                end = end.year();
            }
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
  <table class="ui-calendar-year" data-role="year-column">
    {{#each items}}
    <tr class="ui-calendar-year-column">
      {{#each this}}
      <td {{#unless available}}class="disabled-element"{{/unless}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */
    function template(model, options) {
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-year" data-role="year-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-year-column">';
            $.each(items, function(i, item) {
                html += '<td data-role="' + item.role + '"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});