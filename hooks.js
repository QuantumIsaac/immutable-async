const AsyncSeq = require('./AsyncSeq');

const extend = (base, extension) => {
    Object.keys(extension).forEach(key => {
        base[key] = extension[key];
    });
}

module.exports = function(immutable) {
    const properties = {...immutable.Seq};
    const oldseq = immutable.Seq;
    immutable.Seq = (value) => {
        const _aseq = oldseq(value);
        _aseq.async = () => {
            return new AsyncSeq(_aseq);
        };
        return _aseq;
    }
    extend(immutable.Seq, properties);
}