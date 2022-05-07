/**
 * Convert UUID to BigInt
 * @param uuid
 * @returns BigInt
 */

function uuidToBigInt (uuid: string): BigInt {
  // credit: https://stackoverflow.com/a/58014300/1123955
  const hexBytes    = `0x${uuid.replace(/-/g, '')}`
  const bigInteger  = BigInt(hexBytes)
  return bigInteger
}

export {
  uuidToBigInt,
}
