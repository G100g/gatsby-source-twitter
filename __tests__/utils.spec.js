const { sanitizeObject, decrementHugeNumberBy1 } = require(`../src/utils`)

describe(`Utils`, () => {
  test(`decrease huge number by 1`, () => {
    expect(decrementHugeNumberBy1(`1050118621198921728`)).toEqual(
      `1050118621198921727`
    )
  })
  test(`Sanitize Object Null`, () => {
    const obj = {
      id: 1234,
      nested: {
        id: 1234,
        nested: {
          id: 12345,
          nested: null,
        },
      },
      nedted2: undefined,
    }

    const expected = {
      id: `1234`,
      nested: {
        id: `1234`,
        nested: {
          id: `12345`,
          nested: ``,
        },
      },
      nedted2: ``,
    }

    expect(sanitizeObject(obj)).toEqual(expected)
  })
})
