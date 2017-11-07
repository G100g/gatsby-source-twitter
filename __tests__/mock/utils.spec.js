const { sanitizeObject } = require('../../src/utils')

test.only('Sanitize Object Null', () => {

    const obj = {
        id: 1234,
        nested: {
            id: 1234,
            nested: {
                id: 12345,
                nested: null
            }
        },
        nedted2: undefined
    };

    const expected = {
        id: '1234',
        nested: {
            id: '1234',
            nested: {
                id: '12345',
                nested: ''
            }
        },
        nedted2: ''
    };

    expect(sanitizeObject(obj)).toEqual(expected);

})