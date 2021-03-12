# immutable-async
### asynchronous bindings for immutable.js
------------------------------------------

immutable-async makes using async/await syntax with Immutable's intuitive
chaining syntax not only possible, but very simple. With immutable-async,
the way to achieve this is very simply like below:

   const mapped = await Seq(collection).async().map(asyncMappingFunction.sync()

Currently, this functionality is only implemented for Seq. However, going forward,
this will be eventually implemented for all implemented Immutable objects.

## How it works

immutable-async uses a hook to override the implementation of Immutable objects
to inject an "async" function into them, which returns a handle to an object which
can chain asynchronous functions for processing. This object contains a sync()
function which returns the Promise whose result will be the processed object in
the form of the original Immutable type.
