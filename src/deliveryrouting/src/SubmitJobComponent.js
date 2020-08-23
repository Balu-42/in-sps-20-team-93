import React from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import Geocode from "react-geocode";
import { SubmitJobForm } from "./SubmitJobForm";
import { getMapsApiKey, getMapCentre } from "./Config";
import "./Style.css";

const MAPS_API_KEY = getMapsApiKey();
const MAP_CENTRE = getMapCentre();

/**
 * Displays Map with marker to submit location coordinates.
 */
export class SubmitJobComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoWindow: false,
      activeMarker: {},
      marker: {
        locationName: MAP_CENTRE.locationName,
        position: {
          /* location's latitude */ lat: MAP_CENTRE.lat,
          /* location's longitude */ lng: MAP_CENTRE.lng,
        },
      },
    };
  }

  /**
   * Displays the infoWindow when marker is clicked.
   * @param {object} props
   * @param {object} marker
   */
  onMarkerClick = (props, marker) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  /**
   * Closes the infoWindow when close icon is clicked.
   */
  onClose = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  /**
   * Gets the new location's latitudes, longitudes and name whenever the marker
   * is dragged and sets the values of locationName and position.
   * @param {object} coord
   */
  onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    let newPosition = {
      lat: latLng.lat().toFixed(5),
      lng: latLng.lng().toFixed(5),
    };
    let newLocation = "";
    Geocode.setApiKey(MAPS_API_KEY);
    Geocode.fromLatLng(newPosition.lat, newPosition.lng).then(
      (response) => {
        newLocation = response.results[0].formatted_address;
        this.setState({
          marker: {
            locationName: newLocation,
            position: newPosition,
          },
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  render() {
    return (
      <div className="HomePageBodyContainer">
        <div className="InnerBodyContainer">
          <div>
            <h3 className="HeadingContainer">
              Welcome to DELIVERY SYSTEM!<span>😃</span>
            </h3>
          </div>
          <div>
            <h4 className="HeadingContainer">
              Get the shortest route possible to complete all your deliveries !
              <span>🚛</span>
            </h4>
          </div>
          <div className="InstructionsContainer">
            <p>To add the delivery location, follow the instructions below</p>
            <ul type="circle">
              <li>Enter your phone number.</li>
              <li>
                Move the marker on the map to the location where you want to
                deliver your goods.
              </li>
              <li>
                Press <b>Submit</b> button.
              </li>
            </ul>
            <p>And you are all done!</p>
            <p>
              To add another delivery location, Click the <b>OK</b> button and
              follow the above steps again
            </p>
          </div>
          <div>
            <SubmitJobForm
              latitudes={this.state.marker.position.lat}
              longitudes={this.state.marker.position.lng}
              name={this.state.marker.locationName}
            />
          </div>
        </div>
        <div>
          <Map
            className="MapsContainer"
            google={this.props.google}
            zoom={13}
            initialCenter={{
              lat: MAP_CENTRE.lat,
              lng: MAP_CENTRE.lng,
            }}
          >
            <Marker
              onClick={this.onMarkerClick}
              draggable={true}
              position={this.state.marker.position}
              title={"Location"}
              onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
              <div>
                <h4>
                  {this.state.marker.position.lat},
                  {this.state.marker.position.lng}
                </h4>
                <h4>{this.state.marker.locationName}</h4>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  };
};

export default GoogleApiWrapper({
  apiKey: MAPS_API_KEY,
})(SubmitJobComponent);