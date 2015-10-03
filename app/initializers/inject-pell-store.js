import Acappellas from '../models/acappellas';

export default {
    name: 'inject-pell-store',
    initialize: function(container, app) {

        var STORE_ACAPPELLAS = 'store:acappellas';
        app.register(STORE_ACAPPELLAS, Acappellas);
        app.inject('route:pells',      'store', STORE_ACAPPELLAS);
        app.inject('route:pells.pell', 'store', STORE_ACAPPELLAS);
    }
};