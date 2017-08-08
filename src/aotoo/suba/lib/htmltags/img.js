const {
  View,
  Text,
  Image
} = require('react-native')

class Img extends React.Component{
  render(){
    if (typeof this.props.src == 'string') {
      var imgIns = () => {
        const src = this.props.src
        if (src.indexOf('http:')==0) {
          return <Image style={this.props.style||{}} source={{uri: src}} /> 
        } else {
          return <Image style={this.props.style||{}} source={require(src)} />
        }
      }
      return imgIns()
    } else {
      return <View><Text>?</Text></View>
    }
  }
}

module.exports = Img