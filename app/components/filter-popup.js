/* globals Ember */
import ModalCommon from './modal-common';

function formatTag(val) {
  function fnumber(v) {
    return ((v + '').length < 3 ? '0' : '') + v;
  }
  return 'bpm_' + fnumber(val) + '_' + fnumber(val+5);
}

export default ModalCommon.extend({

  popupName: 'filter',

  ctx: null,

  bpmValue: 0,
  bpmText: 'all',

  licOptions: [ 'all', 'open', 'ccplus' ],

  unmixedChanged: function() {
    this.ctx.set('unmixed', this.get('unmixed'));
  }.observes('unmixed'),

  actions: {
    
      licChange: function() {
        var selected = Ember.$('#lic')[0].selectedIndex;
        this.ctx.set('lic', this.licOptions[selected] );
      },

      slide: function(val) {
        var tag = '-';
        if( val === 60 ) {
          val = 'all';
        } else {
          tag = formatTag(val);
        }

        this.set('bpmText',val);

        Ember.run.debounce( this, function() { 
          this.ctx.set('bpm', tag);
        }, 1000);
        
    }
  },

  didInsertElement: function() {
    if( !Ember.isFastBoot() ) {
      Ember.run.next(this,function() {
        this.ctx = this.container.lookup('controller:pells');
        this.set('unmixed', this.ctx.get('unmixed'));
        var lic = this.ctx.get('lic');
        Ember.$('#lic')[0].selectedIndex = this.licOptions.indexOf(lic);
        var bpm = this.ctx.get('bpm');
        if( bpm !== '-' ) {
          var bpmval = Number(bpm.replace(/bpm_([0-9]{3})_[0-9]{3}/,'$1'));
          this.set('bpmValue',bpmval);
          this.set('bpmText',bpmval);
        } else {
          this.set('bpmText','all');
        }
      });
    }
  },

});
