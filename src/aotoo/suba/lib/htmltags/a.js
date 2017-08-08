const {
  View,
  Text,
  Linking,
  TouchableHighlight,
} = require('react-native')

class A extends React.Component {
  render() {
    var _props = {}
    let style = this.props.style||{}
    if (style.underlayColor) {
      _props.underlayColor = style.underlayColor
      delete style.underlayColor
    }

    if (style.activeOpacity) {
      _props.activeOpacity = style.activeOpacity
      delete style.activeOpacity
    }

    const url = this.props.href
    var actions = function(params){}
    if (typeof url == 'string') {
      actions = ()=>Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('无法打开该URI: ' + url);
        }
      })
    }

    if (typeof url == 'function') {
      actions = url
    }

    const children = ( child => {
      if (typeof child == 'string' || typeof child == 'number') {
        return <Text style={style.itemText||{}}>{child}</Text>
      } else {
        return child
      }
    })(this.props.children)

    return (
      <TouchableHighlight
        style={style}
        onPress={actions}
        {..._props}
      >
        {children}
      </TouchableHighlight>
    )
  }
}

module.exports = A
