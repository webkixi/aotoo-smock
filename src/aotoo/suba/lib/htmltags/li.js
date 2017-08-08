const {
  View,
  Text
} = require('react-native')

class Li extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
      </View>
    )
  }
}

module.exports = Li
