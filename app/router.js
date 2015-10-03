import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  
  willTransition() {
    this._super(...arguments);
    var appc = this.container.lookup('controller:application');
    if( appc ) {
      appc.set('loading',true);            
    }
  },

  didTransition() {
    this._super(...arguments);
    var appc = this.container.lookup('controller:application');
    if( appc ) {
      appc.set('loading',false);            
    }
  },
});


Router.map(function() {
  this.route('licenses');
  this.route('pells', function() {
    this.route('pell', { path: '/:upload_id'} );
  });
});

export default Router;
