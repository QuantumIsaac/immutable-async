const AsyncSeq = require('./AsyncSeq');

function extend (base, extension) {
    Object.keys(extension).forEach(key => {
        base[key] = extension[key];
    });
}

function _hook_seq(aseq) {
    aseq.async = () => {
        return new AsyncSeq(aseq);
    };
}

module.exports = {
    universal: Immutable => {
        const properties = {...Immutable.Seq};
        const oldseq = Immutable.Seq;
        Immutable.Seq = (value) => {
            const _aseq = oldseq(value);
            _hook_seq(_aseq);
            return _aseq;
        }
        extend(Immutable.Seq, properties);
    },
    Seq: seq => {
        _hook_seq(seq);
    }
}