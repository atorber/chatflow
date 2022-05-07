import {
  MapLike,
  AsyncMapLike,
  VERSION,
}               from 'async-map-like'

async function main () {
  try {
    if (VERSION === '0.0.0') {
      throw new Error('version not set right before publish!')
    }

    let mapLike      : undefined | MapLike<any, any>
    let asyncMapLike : undefined | AsyncMapLike<any, any>

    void mapLike
    void asyncMapLike

    console.info(`Smoke Testing PASSED!`)
    return 0

  } catch (e) {
    console.error(e)
    return 1
  }
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
