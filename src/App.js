import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

import Loader from './components/Loader'

import DayPicker from 'react-day-picker';

import LikeButton from './components/button'
import CalCard from './components/CalCard'
import Filter from './components/Filter'
import CardList from './components/CardList'

const url = 'https://unitedlutheranseminary.edu/wp-json/wp/v2/calendar?_embed'

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      events: [],
      currentFilter: {
        month: '',
        date: '',
        year: ''
      },
      currentFilterText: '',
      currentSearch: '',
      highlightedDates: {highlighted: []},
      selectedDay: null,
      dates: []
    }
    this.modifiersStyles = {
      highlighted: {
        backgroundColor: '#dfdfdf'
      }
    }
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }

  // function for decoding html characters in the WP API response below
  decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  componentDidMount() {
    axios.get(url)
    .then(res => {
      // after promise resolved, remove loading state
      this.setState({ loading: false })

      // then take the data and turn it into the array of events we need
      const eventsArr = res.data.map(item => {
        const start = new Date(item.acf.start_date.replace(/-/g, '\/'))
        const end = new Date(item.acf.end_date.replace(/-/g, '\/'))
        return {
          bgurl: item._embedded ? 'https://unitedlutheranseminary.edu' + item._embedded['wp:featuredmedia'][0].source_url : '',
          img_flipped: item.acf.img_flipped,
          campus: item.acf.campus,
          datetime: item.acf.datetime,
          link: item.link,
          title: this.decodeHtml(item.title.rendered),
          excerpt: this.decodeHtml(item.acf.excerpt),
          description: item.acf.description,
          startDate: start,
          endDate: end,
          range: this.getRange(start, end)
        }
      })

      function sortByStartDate(a, b) {
        const start = a.startDate.getTime();
        const end = b.startDate.getTime();
        if(start < end) {
          return -1;
        }
        if (start > end) {
          return 1;
        }
        return 0;
      }

      const ordered_eventsArr = eventsArr;
      ordered_eventsArr.sort(sortByStartDate);

      // then populate the state with events
      this.setState({ events: ordered_eventsArr });
      // then set filter to all events

      // then create list of all dates for the isDisabledDate function
      let dates = []
      const dates2 = res.data.map( item => {
        const range = this.getRange(new Date(item.acf.start_date.replace(/-/g, '\/')), new Date(item.acf.end_date.replace(/-/g, '\/')));
        dates = dates.concat(range);
      })
        // then deduplicate this list
          // first convert the original array to strings
          const datesStrings = dates.map(i => i.getTime())
          // iterate over the dates array and return the ones that are unique - match their string with the datesStrings array
          const datesUnique = dates.filter((item, index, self) => {
            return datesStrings.indexOf(item.getTime()) === index
          })

      this.setState({ dates: datesUnique })
      console.log(res.data);
      console.log(this.state);
    })
  }

  filterByMonth = (date) => {
    this.setState({currentFilter: {month: date.getMonth(), year: date.getFullYear()}})
    this.setTextFilter(date, false);
    this.setState({selectedDay: null})
  }

  filterByDate = (date) => {
    this.setState({currentFilter: {date: date.getDate(), month: date.getMonth(), year: date.getFullYear()}})
    this.setTextFilter(date, true);
  }

  setTextFilter(date, includesDate) {
    if (includesDate) {
      this.setState({currentFilterText: `${this.months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`})
    } else {
      this.setState({currentFilterText: `${this.months[date.getMonth()]} ${date.getFullYear()}`})
    }
  }

  clearFilters = () => { // clear date filters and text
    this.setState({currentFilter: {date: '', month: '', year: '', }})
    this.setState({currentFilterText: ''})
    this.setState({currentSearch: ''})
    this.setState({selectedDay: null})
  }

  handleDayClick = (date) => {
    document.querySelector('.site-header').scrollIntoView({behavior: 'smooth'})
    const clickedDate = new Date(date)
    if (this.state.selectedDay) {
      if (clickedDate.getTime() === this.state.selectedDay.getTime()) { // if the selected day is clicked
        // clear the selection
        this.setState({selectedDay: null})
        // clear the date filter
        this.setState({currentFilter: {month: date.getMonth(), year: date.getFullYear()}})
        this.setTextFilter(date, false);

      } else { // if a different day is clicked
        this.filterByDate(date)
        this.setState({selectedDay: date})
      }

    } else {
      // if no day is selected, filter and select
      this.filterByDate(date)
      this.setState({selectedDay: date})
    }
  }

  getRange = (startDate, stopDate) => {
    let start = new Date(startDate)
    let stop = new Date(stopDate)
    const dateArray = new Array();
    let currentDate = start;
    while (currentDate.getTime() <= stop.getTime()) {
      currentDate = new Date(currentDate);
      dateArray.push(currentDate);
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  }

  handleCardHover = (item) => {
    this.setState({highlightedDates: {highlighted: item.range}})
  }

  handleCardMouseLeave = () => {
    this.setState({highlightedDates: {highlighted: []}})
  }

  // handle disabled dates
  isDisabledDate = (date) => {
    let disabled = true;
    this.state.dates.map(i => {
      if (this.matchDatesAsStrings(i, date)) {
        disabled = false;
      }
    })
    return disabled;
  }
  matchDatesAsStrings = (date1, date2) => {
    const one = date1.getMonth() + '-' + date1.getDate() + '-' + date1.getFullYear();
    const two = date2.getMonth() + '-' + date2.getDate() + '-' + date2.getFullYear();
    return one === two;
  }

  handleSearch = (e) => {
    this.setState({currentSearch: e.target.value.toLowerCase()})
  }






  render() {
    let loader
    if (this.state.loading) {
      loader = <Loader />
    } else {
      loader = ''
    }

    let statusText
    if (this.state.currentFilterText) {
      statusText = (
        <div>
          <p>Viewing events for {this.state.currentFilterText}</p>
          <Filter clear={this.clearFilters} />
        </div>
      )
    } else {
      statusText = (
        <div>
          <p>Viewing all events.</p>
        </div>
      )
    }
    return (
      <div className="row App">
        <div className="col-md-12 col-lg-7 order-2 order-lg-1 pl-4 pr-4">

          {loader}

          <CardList
            filterMonth={this.state.currentFilter.month}
            filterDay={this.state.currentFilter.date}
            filterYear={this.state.currentFilter.year}
            currentSearch={this.state.currentSearch}
            events={[...this.state.events]}
            handleCardHover={this.handleCardHover}
            handleCardMouseLeave={this.handleCardMouseLeave}
          />

        </div>
        <div className="col-md-12 col-lg-5 order-1 order-lg-2 pl-4 pr-4 mb-5">
          <div className="cal-right-col-wrapper">

            <div className="calfilter">
              { statusText }
            </div>

            <div className="calendar">

              <div id="datepicker">
                <DayPicker
                  selectedDays={this.state.selectedDay}
                  modifiers={this.state.highlightedDates}
                  modifiersStyles={this.modifiersStyles}

                  onMonthChange={this.filterByMonth}
                  onDayClick={this.handleDayClick}

                  disabledDays={this.isDisabledDate}
                 />
              </div>
            </div>

            <input type="search" className="cal-search-filter form-control form-control-lg my-5 w-100" value={this.state.currentSearch} onChange={this.handleSearch} placeholder="Type to filter by title..." />

            <a className="card cal-cta p-4" href="#emailPopup" data-toggle="modal" data-target="#emailPopup">
              <div className="cal-cta__overlay"></div>
              <div className="cal-cta__content">
                <h3>Get event updates via email.</h3>
                <p className="smallcaps text-white">Sign up now</p>
              </div>
            </a>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
