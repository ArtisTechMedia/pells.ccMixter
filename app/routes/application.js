import Ember from 'ember';
import PopupHost from 'ccm-core/mixins/popup-host';

export default Ember.Route.extend(PopupHost, {

  audioPlayer: Ember.inject.service(),

  _footerPad: false,

  watchPlayer: function() {

    Ember.$('.waveimage.bar').fadeOut();

    var imageURL = this.get('audioPlayer.nowPlaying.wavImageURL');
    if( imageURL ) {
      // todo: export full xml+svg and put in <img> tag
      var args = { url: imageURL, method: 'GET', dataType: 'text', error: function (e,text) { Ember.debug(text); } };      
      Ember.RSVP.resolve(Ember.$.ajax(args)).then( svg => {
        Ember.$('.waveimage.bar').html(svg).fadeIn();
      });
    }

    if( !this._footerPad ) {
      this._footerPad = true;
      Ember.$('.footer').addClass('footer-pad');
    }

  }.observes('audioPlayer.nowPlaying'),

  actions: {
    
    clearOptions: function() {
      this.transitionTo('/pells', { queryParams: { } } );
    },

    playlistActions: function( actionType, model ) {
      if( actionType === 'title' ) {
        this.transitionTo( 'pells.pell', model.id );
      } else if( actionType === 'artist' ) {
        this.transitionTo( 'pells', { queryParams: { artist: model.artist.id } } );
      }
    },

    selectLine: function(pell) {
      Ember.$('.pell-browser .tab-content li').removeClass('selected');
      Ember.$('#line_' + pell.id).addClass('selected');
      this.transitionTo( 'pells.pell', pell.id );
      try {
        this.get('audioPlayer').togglePlay(pell);
      } catch (e) {
        Ember.debug(e);
      }
    },
   
  }
});
