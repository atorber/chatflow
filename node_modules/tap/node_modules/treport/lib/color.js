// bringing back the Color tag removed in ink 3.0
const c = require('chalk')
const React = require('react')
const {memo} = React
const {Transform} = require('ink')
const arrify = obj => Array.isArray(obj) ? obj
  : obj === '' || obj === null || obj === undefined ? []
  : [obj]

const methods = [
  'hex',
  'hsl',
  'hsv',
  'hwb',
  'rgb',
  'keyword',
  'bgHex',
  'bgHsl',
  'bgHsv',
  'bgHwb',
  'bgRgb',
  'bgKeyword',
  'ansi',
  'ansi256',
  'bgAnsi',
  'bgAnsi256',
]

const Color = ({children, ...colorProps}) => {
  if (children === '')
    return null

  const transform = children => {
    for (const [method, value] of Object.entries(colorProps)) {
      if (methods.includes(method))
        children = c[method](...arrify(value))(children)
      else if (typeof c[method] === 'function')
        children = c[method](children)
    }
    return children
  }

  return (<Transform transform={transform}>{children}</Transform>)
}
Color.displayName = 'Color'

Color.defaultProps = { children: '' }

module.exports = memo(Color)
