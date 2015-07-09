/**
 *  双日期控件
 *  @arale/Calendar
 *  add by gjun 
 *  2015/4/10
 *  ##########
 */
define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');

  var BaseCalendar = require('./base-calendar');
  var DateColumn = require('./date-column');
  var MonthColumn = require('./month-column');
  var YearColumn = require('./year-column');
  var template = [
    '<div class="ui-calendar ui-double-calendar">',
    '<div class="ui-calendar-start">',
    '<div class="ui-calendar-wrap">',
    '<div class="ui-calendar-pannel" data-role="pannel">',
    '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>',
    '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>',
    '<span class="ui-calendar-control month" data-role="start-month"></span>',
    '<span class="ui-calendar-control year" data-role="start-year"></span>',
    '</div>',
    '</div>',
    '<div class="ui-calendar-container" data-role="container"></div>',
    '</div>',
    '<div class="ui-calendar-end">',
    '<div class="ui-calendar-wrap">',
    '<div class="ui-calendar-pannel" data-role="pannel">',
    '<span class="ui-calendar-control month" data-role="end-month"></span>',
    '<span class="ui-calendar-control year" data-role="end-year"></span>',
    '<span class="ui-calendar-control" data-role="next-month">&gt;</span>',
    '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>',
    '</div>',
    '</div>',
    '<div class="ui-calendar-container" data-role="container"></div>',
    '</div>',
    '<div><a href="javascript:void(0)">清除</a></div>',
    '</div>'
  ].join('');

  var Calendar = BaseCalendar.extend({
    attrs: {
      template: template,
      modelstart: 'startDates',
      modelend:'endDates',
      prefixdd:null
    },

    events: {
      'click [data-role=start-month]': function(ev) {
        if (this.get('modelstart') === 'startMonth') {
          this.renderContainer('startDates');
        } else {
          this.renderContainer('startMonth');
        }
      },
      'click [data-role=start-year]': function(ev) {
        if (this.get('modelstart') === 'startYear') {
          this.renderContainer('startDates');
        } else {
          this.renderContainer('startYear');
        }
      },
      'click [data-role=end-month]': function(ev) {
        if (this.get('modelend') === 'endMonth') {
          this.renderEnd('endDates');
        } else {
          this.renderEnd('endMonth');
        }
      },
      'click [data-role=end-year]': function(ev) {
        if (this.get('modelend') === 'endYear') {
          this.renderEnd('endDates');
        } else {
          this.renderEnd('endYear');
        }
      },
      'click [data-role=prev-year]': function(ev) {
          //上一年
          var focus=this.startYear.prev();
          this.startMonth.select(focus);
          this.startDates.select(focus);

          var focus1=this.endYear.prev();
          this.endMonth.select(focus1);
          this.endDates.select(focus1);
      },
      'click [data-role=next-year]': function(ev) {
          //下一年
          var focus=this.startYear.next();
          this.startMonth.select(focus);
          this.startDates.select(focus);

          var focus1=this.endYear.next();
          this.endMonth.select(focus1);
          this.endDates.select(focus1);
      },
      'click [data-role=prev-month]': function(ev) {
          //上一月
          var focus=this.startMonth.prev();
          this.startDates.select(focus);
          this.startYear.select(focus);

          var focus1=this.endMonth.prev();
          this.endDates.select(focus1);
          this.endYear.select(focus1);
          
      },
      'click [data-role=next-month]': function(ev) {
          //下一月
          var focus=this.startMonth.next();
          this.startDates.select(focus);
          this.startYear.select(focus);

          var focus1=this.endMonth.next();
           this.endDates.select(focus1);
          this.endYear.select(focus1);
      }
    },

    setup: function() {
      Calendar.superclass.setup.call(this);
      var that=this;
      this.after('hide',function  (argument) {
         if(this.get('prefixdd')&&
          $(this.get('trigger')).val().indexOf(this.get('prefixdd'))==-1){
            this.show();
         }else{
               that.startDates.set('range',that.get('range'));
              var focus = self.get('focus');
               that.renderContainer('startDates',focus);
         }
      });
      this.renderPannel();
      var focus = this.get('focus');
      var attrs = {
        focus: focus,
        lang: this.get('lang'),
        range: this.get('range'),
        format: this.get('format'),
        startDay: this.get('startDay'),
        process: this.get('process')
      };
      var self = this;
      this.startDates = new DateColumn(attrs);
      this.startMonth = new MonthColumn(attrs);
      this.startYear = new YearColumn(attrs);

      this.startDates.on('select', function(value, el) {
         //        
         
         console.log(self.get('range'));
        self.startDates.set('range',[value,null]);
        self.set('focus', value);
        var focus = self.get('focus');
        self.renderContainer('startDates',focus);
      
        self.renderPannel();
        if (el) {
          self.trigger('selectDate', value);
          if (moment.isMoment(value)) {
            value = value.format(this.get('format'));
          }

          if(self.get('prefixdd')){
          if($(self.get('trigger')).val()!==''){

            if($(self.get('trigger')).val().indexOf(self.get('prefixdd'))>-1){
                $(self.get('trigger')).val('');
            }else{
              value=$(self.get('trigger')).val()+self.get('prefixdd')+value;
            }
          }
           if(value.indexOf(self.get('prefixdd'))>-1){
              var options=value.split(self.get('prefixdd'));   
              options[0]=new Date(options[0]).getTime();
              options[1]=new Date(options[1]).getTime();
              if(options[0]>options[1]){
                 alert('日期选择非法');
                 return;
              }
          }
        }
          self.output(value);
          
        }
      });
      this.startMonth.on('select', function(value, el) {
        var focus = self.get('focus');
        focus.month(value);
        self.set('focus', focus);
        self.renderPannel();
        if (el) {
          self.renderContainer('startDates', focus);
          self.renderEnd('endDates',focus.clone().add('months',1));
          self.trigger('selectMonth', focus);
        }
      });
      
      this.startYear.on('select', function(value, el) {
      var focus = self.get('focus');
      focus.year(value);
      self.set('focus', focus);
      self.renderPannel();
      if (el && el.data('role') === 'year') {
        self.renderContainer('startDates', focus);
        self.renderEnd('endDates',focus.clone().add('months',1));
        self.trigger('selectYear', focus);
      }
    });
   

      /*******截止时间*******/

       attrs['focus'] = this.get('focus').clone().add('months', 1);
       attrs['range']=null;
      var date = new DateColumn(attrs);
      this.endDates=new DateColumn(attrs);
      this.endMonth = new MonthColumn(attrs);
      this.endYear = new YearColumn(attrs);

      this.endDates.on('select', function(value, el) {
        self.endDates.set('focus', value);

        self.startDates.set('range',[value,null]);
        self.set('focus', value);
        var focus = self.get('focus');
        self.renderContainer('startDates',focus);



        self.renderPannel();
        if (el) {
          self.trigger('selectDate', value);
          if (moment.isMoment(value)) {
            value = value.format(this.get('format'));
          }

           if(self.get('prefixdd')){
          if($(self.get('trigger')).val()!==''){

            if($(self.get('trigger')).val().indexOf(self.get('prefixdd'))>-1){
                $(self.get('trigger')).val('');
            }else{
              value=$(self.get('trigger')).val()+self.get('prefixdd')+value;
            }
          }

          if(value.indexOf(self.get('prefixdd'))>-1){
              var options=value.split(self.get('prefixdd'));   
              options[0]=new Date(options[0]).getTime();
              options[1]=new Date(options[1]).getTime();
              if(options[0]>options[1]){
                 alert('日期选择非法');
                 return;
              }
          }
        }
          self.output(value);
        }
      });
      this.endMonth.on('select', function(value, el) {
        var focus = self.endDates.get('focus');
        focus.month(value);
        self.endDates.set('focus', focus);
        var ff=self.get('focus');
         ff=focus.clone().subtract('months',1);
         self.set('focus',ff);
        self.renderPannel();
        if (el) {
          self.renderEnd('endDates', focus);
          self.renderContainer('startDates',ff);
          self.trigger('selectMonth', focus);
        }
      });
      
      this.endYear.on('select', function(value, el) {
      var focus = self.endDates.get('focus');
      focus.year(value);
      self.endDates.set('focus', focus);
      var ff=self.get('focus');
      ff=focus.clone().subtract('months',1);
      self.set('focus',ff);
      self.renderPannel();
      if (el && el.data('role') === 'year') {
          self.renderEnd('endDates', focus);
          self.renderContainer('startDates',ff);
          self.trigger('selectYear', focus);
      }
    });
     var startCon = this.element.find('.ui-calendar-start .ui-calendar-container');
      startCon.append(this.startDates.element);
      startCon.append(this.startMonth.element);
      startCon.append(this.startYear.element);
      var endCon = this.element.find('.ui-calendar-end .ui-calendar-container');
      endCon.append(this.endDates.element);
      endCon.append(this.endMonth.element);
      endCon.append(this.endYear.element);
      this.renderEnd('endDates');
      this.renderContainer('startDates');
    },

    renderPannel: function() {
      var focus = this.get('focus');
      var startMonth = this.element.find('[data-role=start-month]');
      var startYear = this.element.find('[data-role=start-year]');
      var endMonth = this.element.find('[data-role=end-month]');
      var endYear = this.element.find('[data-role=end-year]');

      var MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      var lang = this.get('lang');
      var month = MONTHS[focus.month()];
      month = lang[month] || month;

      startMonth.text(month);
      startYear.text(focus.year());

      focus = focus.clone();
      focus.add('months', 1)

      month = MONTHS[focus.month()];
      month = lang[month] || month;

      endMonth.text(month);
      endYear.text(focus.year());
    },
    renderContainer: function(mode, focus) {
      this.set('modelstart', mode);
      focus = focus || this.startDates.get('focus');

      this.startDates.hide();
      this.startMonth.hide();
      this.startYear.hide();
      this.startDates.select(focus, null);
      this.startMonth.select(focus, null);
      this.startYear.select(focus, null);
      
      if (mode === 'startDates') {
        this.startDates.element.show();
      } else if (mode === 'startMonth') {
        this.startMonth.element.show();
      } else if (mode === 'startYear') {
        this.startYear.element.show();
      }
      return this;
    },
    renderEnd:function(mode,focus){

      this.set('modelend', mode);
      focus = focus || this.endDates.get('focus');
      this.endDates.hide();
      this.endMonth.hide();
      this.endYear.hide();
     /* this.endDates.select(focus, null);
      this.endMonth.select(focus, null);
      this.endYear.select(focus, null);
*/
      if (mode === 'endDates') {
        this.endDates.element.show();
      } else if (mode === 'endMonth') {
        this.endMonth.element.show();
      } else if (mode === 'endYear'){
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