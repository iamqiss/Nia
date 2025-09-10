import {describe, expect, it} from '@jest/globals'

import {parseSearchQuery} from '#/screens/Search/utils'

describe(`parseSearchQuery`, () => {
  const tests = [
    {
      input: `Time`,
      output: {query: `Time`, params: {}},
    },
    {
      input: `Time from:esb.lol`,
      output: {query: `Time`, params: {from: `esb.lol`}},
    },
    {
      input: `Time "from:esb.lol"`,
      output: {query: `Time "from:esb.lol"`, params: {}},
    },
    {
      input: `Time mentions:@esb.lol`,
      output: {query: `Time`, params: {mentions: `@esb.lol`}},
    },
    {
      input: `Time since:2021-01-01:00:00:00`,
      output: {query: `Time`, params: {since: `2021-01-01:00:00:00`}},
    },
    {
      input: `Time lang:"en"`,
      output: {query: `Time`, params: {lang: `en`}},
    },
    {
      input: `Time "literal" lang:en "from:invalid"`,
      output: {query: `Time "literal" "from:invalid"`, params: {lang: `en`}},
    },
  ]

  it.each(tests)(
    `$input -> $output.query $output.params`,
    ({input, output}) => {
      expect(parseSearchQuery(input)).toEqual(output)
    },
  )
})
