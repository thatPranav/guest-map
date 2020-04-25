import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Card,
  CardText,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

import "./App.css";

var myIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png"
});

class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: "",
      message: ""
    }
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        // console.log(position);
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 13
        });
      },
      e => {
        console.log("Didn't get location", e);

        fetch("https://ipapi.co/json")
          .then(response => response.json())
          .then(location => {
            // console.log(location);
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              haveUsersLocation: true,
              zoom: 13
            });
          });
      },
      { maximumAge: Infinity }
    );
  }

  formSubmitted = event => {
    event.preventDefault();
    console.log(this.state.userMessage);
  };

  valueChanged = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }));
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ) : (
            ""
          )}
        </Map>
        <Card body className="message-form">
          <CardTitle>Welcome!</CardTitle>
          <CardText>Leave a message with location!</CardText>
          <CardText>Thanks for stopping by!</CardText>
          <Form onSubmit={this.formSubmitted}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                onChange={this.valueChanged}
                type="text"
                name="name"
                id="name"
                placeholder="Enter name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                onChange={this.valueChanged}
                type="text"
                name="message"
                id="message"
                placeholder="Enter a message"
              />
            </FormGroup>
            <Button
              type="submit"
              color="info"
              disabled={!this.state.haveUsersLocation}>
              Send
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}

export default App;
