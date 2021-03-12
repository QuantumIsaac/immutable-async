var ImmutableAsync = require('../index');
var Immutable = require('immutable');
var c = require('ansi-colors');

function array_equals(a1, a2) {
    if (a1.length !== a2.length) return false;
    else return a1.some((n, idx) => n === a2[idx]);
}

const SampleData = {
    ARRAY: [1, 2, 3, 4, 5],
    MAP_FUNCTION: e => 2 * e,
    FILTER_FUNCTION: e => e % 2 === 0
}

function expect(expected, found) {
    return new Error(`Expected ${expected}, found ${found} instead`);
}

const Tests = {
    HookSeq: async () => {
        var seq = Immutable.Seq(SampleData.ARRAY);
        ImmutableAsync.Hooks.Seq(seq);
        if (!seq.async) {
            throw new Error("Seq hook did not inject async!");
        } else {
            return "Seq hook injected async";
        }
    },
    SeqMap: async () => {
        var seq = Immutable.Seq(SampleData.ARRAY);
        ImmutableAsync.Hooks.Seq(seq);
        var mapped = await seq.async().map(async (item) => {
            return await new Promise(resolve => {
                setTimeout(resolve.bind(null, SampleData.MAP_FUNCTION(item)), 250);
            })
        }).sync();
        var mapped_control = SampleData.ARRAY.map(SampleData.MAP_FUNCTION);
        if (!array_equals(mapped.toArray(), mapped_control)) {
            throw expect(mapped_control, mapped.toArray());
        } else {
            return "AsyncSeq#map works correctly";
        }
    },
    SeqFilter: async () => {
        var seq = Immutable.Seq(SampleData.ARRAY);
        ImmutableAsync.Hooks.Seq(seq);
        var filtered = await seq.async().filter(async (item) => {
            return await new Promise(resolve => {
                setTimeout(resolve.bind(null, SampleData.FILTER_FUNCTION(item)), 250);
            });
        }).sync();
        var filtered_control = SampleData.ARRAY.filter(SampleData.FILTER_FUNCTION);
        if (!array_equals(filtered.toArray(), filtered_control)) {
            throw expect(filtered_control, filtered.toArray());
        } else {
            return "AsyncSeq#filter works correctly"
        }
    }
};

(async () => {
    const keys = Immutable.Seq(Tests).sortBy((_, k) => k)
        .mapEntries(([k, v]) => [v, k]).toIndexedSeq().toArray();
    for (const key of keys) {
        const test = Tests[key];
        try {
            const msg = await test();
            console.log(`${c.greenBright('SUCCESS:')} ${msg}`);
        } catch(e) {
            console.error(`${c.redBright('FAILURE:')} ${e.message}`);
        }
    }
})();