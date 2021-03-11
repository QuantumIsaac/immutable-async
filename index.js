var immutable = require('immutable');

// apply hooks to immutable
var hooks = require('./hooks');
hooks(immutable);

// export asynchronous Seq
module.exports = {
    AsyncSeq: require('./AsyncSeq')
};