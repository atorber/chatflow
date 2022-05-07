export function bad () {
  if (Promise.resolve()) {
    console.info('should not use promise as true/false')
  }
}
