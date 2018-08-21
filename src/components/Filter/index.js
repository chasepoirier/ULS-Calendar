import React from 'react'

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faTimes)




class Filter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
        <div className="calfilter__item" onClick={this.props.clear}>
          <span>View All Events</span>
        </div>

    );
  }
}

export default Filter
