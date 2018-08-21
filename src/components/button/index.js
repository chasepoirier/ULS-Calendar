import React, { Component } from 'react'

class LikeButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liked: false
    }
  }
  render() {
    if (this.state.liked) {
      return (
        'You liked this.'
      );
    }
    return (
      <button onClick={() => this.setState({liked: true})}>Like me (2nd version).</button>
    );
  };
}

export default LikeButton
