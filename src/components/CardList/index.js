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
    // first pass: check the text search filter
    const eventsPass1 = this.searchByText(nextProps.events, nextProps.currentSearch);
    // second pass: filter by selected date/time - note we are using the result of the first pass as our first parameter
    const eventsPass2 = this.filterEvents(eventsPass1, nextProps.filterYear, nextProps.filterMonth, nextProps.filterDay)
    this.setState({events: eventsPass2})
  }

  searchByText = (events, string) => {
    if (string === '') { // if it's an empty string, return all events
      return events;
    } else { // if not, filter through the events and return the ones that match
      return events.filter(i => {
        // we will search in the following 4 fields
        const title = i.title.toLowerCase();
        const desc = i.description.toLowerCase();
        const campus = i.campus.toLowerCase();
        const excerpt = i.excerpt.toLowerCase();

        let match = false;
        // check to see if any of the 4 fields contain the string
        if (title.includes(string) || desc.includes(string) || campus.includes(string) || excerpt.includes(string)) {
          match = true
        }
        return match;
      });
    }
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

      } else if ((month && year) || (month === 0 && year)) { // only month and year filters are applied
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
