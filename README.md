## Features

- Support for nested structures, including record-style objects, map-style objects, and actual maps.
- Canonicalisation of data (e.g. date fields can accept either a string that gets validated or a Date object, so you can wire them up to either text or date fields, but they'll output a date).
- Serialisation and deserialisation of incomplete form state, so you can save your users' progress for later
- Live validation. Forms are validated as they're updated, but validation is only run on the parts of the form that have changed.
- Touch tracking, so you can hide
- Strongly typed. If you're using TypeScript, the shape of your data and all updates are typechecked, as is the shape of the canonicalised output, serialised output, and validation errors.

## Validator responsibilities

- Serialise to/deserialise from JSON (including touched state)
- Convert to canonical format
- Validate
- Track touched state

Validation functions need access to
- Their path
- Get function

Validation dependency graph is a WeakMap going from the depended-upon value to the path of the dependees