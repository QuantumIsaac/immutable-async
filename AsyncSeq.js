var Immutable = require('immutable');

class AsyncSeq {
    constructor(seq) {
        this._seq = Immutable.Seq(seq);
        this._promise = null;
    }

    async sync() {
        const synced = await this._promise;
        this._seq = synced;
        this._promise = null;
        return synced;
    }

    _push_promise(prom) {
        if (this._promise === null) {
            this._promise = prom(this._seq);
        } else {
            const cur_op = this._promise;
            this._promise = new Promise(resolve => {
                cur_op.then(nextResult => {
                    // construct promse for next operation
                    let promise = prom(nextResult);
                    promise.then(resolve);
                });
            });
        }
    }

    _get_promise(seq, fn, cbk) {
        const promises = seq.map(fn).toArray();
        promises.map(promise => promise instanceof Promise ? promise : Promise.resolve(promise));
        const all = Promise.all(promises);
        return new Promise(resolve => {
            all.then(resarray => {
                const seq = Immutable.Seq(resarray);
                if (cbk) {
                    resolve(cbk(seq));
                } else {
                    resolve(seq);
                }
            })
        })
    }

    map(mapper) {
        this._push_promise(seq => this._get_promise(seq, mapper));
        return this;
    }

    filter(predicate) {
        this._push_promise(seq => this._get_promise(seq, predicate, filterRes => seq.filter((_, idx) => {
            return filterRes.get(idx);
        })));
        return this;
    }
}

module.exports = AsyncSeq;