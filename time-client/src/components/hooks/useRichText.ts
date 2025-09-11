import React from 'react'
// Migrated to gRPC

import {useAgent} from '#/state/session'

export function useGrpcRichText(text: string): [GrpcRichTextAPI, boolean] {
  const [prevText, setPrevText] = React.useState(text)
  const [rawRT, setRawRT] = React.useState(() => new GrpcRichTextAPI({text}))
  const [resolvedRT, setResolvedRT] = React.useState<GrpcRichTextAPI | null>(null)
  const agent = useAgent()
  if (text !== prevText) {
    setPrevText(text)
    setRawRT(new GrpcRichTextAPI({text}))
    setResolvedRT(null)
    // This will queue an immediate re-render
  }
  React.useEffect(() => {
    let ignore = false
    async function resolveRTFacets() {
      // new each time
      const resolvedRT = new GrpcRichTextAPI({text})
      await resolvedRT.detectFacets(agent)
      if (!ignore) {
        setResolvedRT(resolvedRT)
      }
    }
    resolveRTFacets()
    return () => {
      ignore = true
    }
  }, [text, agent])
  const isResolving = resolvedRT === null
  return [resolvedRT ?? rawRT, isResolving]
}
