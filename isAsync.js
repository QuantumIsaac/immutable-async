modules.export = function(subject) {
    if(!subject.constructor.name === "AsyncFunction") {
        throw new TypeError("Must provide an asynchronous function!");
    }
};