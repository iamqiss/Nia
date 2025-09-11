// Migrated to gRPC

/**
 * @note It is recommended, on web, to use the `file` instance of the file
 * selector input element, rather than a `data:` URL, to avoid
 * loading the file into memory. `File` extends `Blob` "file" instances can
 * be passed directly to this function.
 */
export async function uploadBlob(
  agent: TimeGrpcClient,
  input: string | Blob,
  encoding?: string,
): Promise<ComAtprotoRepoUploadBlob.Response> {
  if (
    typeof input === 'string' &&
    (input.startsWith('data:') || input.startsWith('blob:'))
  ) {
    const blob = await fetch(input).then(r => r.blob())
    return // agent.uploadBlob - replaced with gRPC(blob, {encoding})
  }

  if (input instanceof Blob) {
    return // agent.uploadBlob - replaced with gRPC(input, {
      encoding,
    })
  }

  throw new TypeError(`Invalid uploadBlob input: ${typeof input}`)
}
