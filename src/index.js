import React from "react";
import ReactDOM from "react-dom";
import 'bulma/css/bulma.css'
import "./styles.css";
import axios from 'axios'
import { Line, Bar } from 'react-chartjs-2';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      prices: [],
      prices_array: [15, 17, 79],
      isLoading: true,
      coin: 'BTC',
      toCoin: 'USD'
    }
    this.getDataFromUNIXTimestamp = this.getDataFromUNIXTimestamp.bind(this)
    this.changeCoin = this.changeCoin.bind(this)
    this.changeToCoin = this.changeToCoin.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getDataFromUNIXTimestamp(timestamp) {
    var date = new Date(timestamp * 1000);
    var month = date.getUTCMonth() + 1
    var year = date.getFullYear()
    var day = date.getUTCDate()
    var formattedTime = day + '-' + month + '-' + year
    return formattedTime
  }

  getData() {
    axios.get(`https://min-api.cryptocompare.com/data/histoday?fsym=` + this.state.coin + `&tsym=` + this.state.toCoin + `&limit=20`)
      .then(response => {
        this.setState({
          prices: response.data.Data,
          isLoading: false
        })
      })
  }

  changeCoin(event) {
    this.setState({
      coin: event.currentTarget.value
    }, this.getData)
  }

  changeToCoin(event) {
    this.setState({
      toCoin: event.currentTarget.value
    }, this.getData)
  }


  render() {

    let prices_array = Array.from(this.state.prices.map(d => d.close))
    let times_array = Array.from(this.state.prices.map(d => this.getDataFromUNIXTimestamp(d.time)))
    return (
      <div>

        <div className='hero section is-small is-primary'>
          
          <div className='columns'>
            <div className="column is-12 buttons">
              <p className="title is-5 has-text-black-bis">Convert</p>
              <button value='BTC' onClick={this.changeCoin} className='button is-outlined is-rounded is-link'> BTC </button>
              <button value='ETH' onClick={this.changeCoin} className='button is-outlined is-rounded is-link'> ETH </button>
              <button value='XRP' onClick={this.changeCoin} className='button is-outlined is-rounded is-link'> XRP </button>
              <button value='EOS' onClick={this.changeCoin} className='button is-outlined is-rounded is-link'> EOS </button>
              <button value='BCH' onClick={this.changeCoin} className='button is-outlined is-rounded is-link'> BCH </button>
            </div>
          </div>  
          <div className='columns'>
            <div className="column is-12 buttons">
              <p className="title is-5 has-text-black-bis">To</p>
              <button value='USD' onClick={this.changeToCoin} className='button is-outlined is-rounded is-link'> USD </button>
              <button value='EUR' onClick={this.changeToCoin} className='button is-outlined is-rounded is-link'> EUR </button>
            </div>
          </div>

        </div>

        {this.state.isLoading &&
          <div className='section'>
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        }

        <div className="columns section">
          <div className='column is-offset-3 is-6'>
          {!this.state.isLoading &&
            <Line data={{
              labels: times_array,
              datasets: [{
                label: this.state.coin + ` vs ` + this.state.toCoin,
                data: prices_array,
                backgroundColor: 'rgba(0, 0, 255, 0.7)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1
              }]
            }}
              options={{
                animation: {
                  easing: 'linear',
                  
                },
                maintainAspectRatio: false,
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Price",
                    },
                    ticks: {
                      beginAtZero: true
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Time"
                    },
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10
                    }
                  }]
                },
                title: {
                  display: true,
                  text: "Analysis over duration"
                },
              }}
            width={800}
            height={400}

            />
          }
          </div>
        </div>

      </div>
    )
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
