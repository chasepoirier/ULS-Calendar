import React from 'react'
import CalCard from '../CalCard'

class CardList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }

  }

  componentWillReceiveProps(nextProps) {
    // every time new props are received, filter the events and update the state
    const newEvents = this.filterEvents(nextProps.events, nextProps.filterYear, nextProps.filterMonth, nextProps.filterDay)
    this.setState({events: newEvents})
  }

  filterEvents = (events, year, month, day) => {
    return events.filter(i => {
      if (day) { // day, month, and year filters are applied
        // filter the year, month, and day
        let match = false;
        // filter through each date in the supplied event's range, and check the year month and day against it
        i.range.map(date => {
          if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            match = true
          }
        })
        return match;

      } else if (month && year) { // only month and year filters are applied
        // filter the year and month
        let match = false;
        // filter through each date in the supplied event's range, and match year and month
        i.range.map(date => {
          if (date.getFullYear() === year && date.getMonth() === month) {
            match = true
          }
        })
        return match;

      } else { // no filter is applied

        return true; // return all events

      }
    })
  }






  render() {
    return (
      <div className="l_cal-card">

        {
          this.state.events.map(i => (
            <CalCard
              className={`campus_${i.campus}`}

              handleCardHover={this.props.handleCardHover.bind(this, i)}
              handleCardMouseLeave={this.props.handleCardMouseLeave}

              bgurl={i.bgurl}
              flipped={i.img_flipped}
              campus={i.campus}
              dateTime={i.datetime}
              link={i.link}
              title={i.title}
              excerpt={i.excerpt}
              description={i.description}
              startDate={i.startDate}
              endDate={i.endDate}
            />

          ))
        }
      </div>

    );

  }
}

export default CardList
