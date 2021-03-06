import React, { Component } from 'react';
import InputZip from './components/input-zip.jsx';
import Temperature from './components/temperature.jsx';
import './App.css';

/*
 * This example illustrates a simple react project
 * that works with an external API.
 *
 * Take note of the comments they point common
 * problems you will need to solve with React.
 *
 * There are two ideas here
 * - Input/Controlled Component Pattern
 * - Conditionally Rendering components
 *
 * The project has an input field where a user will
 * input a zip code. It finds weather data for that
 * zip and displays it in a component.
 *
 */

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inputValue: '', // Used to hold value entered in the input field
			weatherData: null, // Used to hold data loaded from the weather API
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		// ! Get your own API key !
		const apikey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
		// Get the zip from the input
		const zip = this.state.inputValue;
		// Form an API request URL with the apikey and zip
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apikey}`;
		// Get data from the API with fetch
		fetch(url)
			.then(res => res.json())
			.then((json) => {
				if (json.cod === 200) {
					// If the request was successful assign the data to component state
					this.setState({ weatherData: json })
				} else {
					alert('Error! Invalid Zip Code!')
				}
			}).catch((err) => {
				// If there is no data
				this.setState({ weatherData: null }); // Clear the weather data we don't have any to display
				// You may want to display an error to the screen here.
			});
	}

	renderWeather() {
		// This method returns undefined or a JSX component
		if (this.state.weatherData === null) {
			// If there is no data return undefined
			return undefined;
		}
		/*
		This next step needs another level of error checking. It's
		possible to get a JSON response for an invalid zip in which
		case the step below fails.
		*/
		// Take the weather data apart to more easily populate the component
		const { main, description, icon } = this.state.weatherData.weather[0];
		const {
			temp,
			pressure,
			humidity,
			tempMin,
			tempMax,
		} = this.state.weatherData.main;
		return (
			<div className='output'>
				<div className='flex'>
					<div className='flex-v'>
						<img src={'https://openweathermap.org/img/w/' + icon + '.png'} alt='weather' />
					</div>
					<h2>
						{main}<br />
						<small>{description}</small>
					</h2>
				</div>
				<div>Pressure: {pressure}</div>
				<div>Humidity: {humidity}%</div>
				<Temperature temp={temp} label={"Temperature"} />
				<Temperature temp={tempMin} label={"Low"} />
				<Temperature temp={tempMax} label={"High"} />
			</div >
		)
	}

	render() {
		return (
			<div className="App">

				{/* This input uses the controlled component pattern */}
				<h1>Your Weather NOW!</h1>
				<form onSubmit={e => this.handleSubmit(e)} className='flex'>
					{/*
						This pattern is used for input and other form elements
						Set the value of the input to a value held in component state
						Set the value held in component state when a change occurs at the input
					 */}

					<InputZip
						inputValue={this.state.inputValue}
						onChange={(e) => {
							this.setState({ inputValue: e.target.value })
						}}
					/>
					<button type="submit">Submit</button>
				</form>
				<div className='flex'>
					{/* Conditionally render this component */}
					{this.renderWeather()}
				</div>
			</div >
		);
	}
}

export default App;
