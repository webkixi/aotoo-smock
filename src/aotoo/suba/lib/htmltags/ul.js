const {
  View,
  Text,
} = require('react-native')

class Ul extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
      </View>
    )
  }
}

module.exports = Ul