const hooks = require('./hooks');

// export asynchronous Seq
module.exports = {
    Hooks: {
        Immutable: hooks.universal,
        Seq: hooks.Seq
    },
    AsyncSeq: require('./AsyncSeq')
};