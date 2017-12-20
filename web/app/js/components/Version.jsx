import corslite from '@mapbox/corslite';
import { Link } from 'react-router-dom';
import React from 'react';
import './../../css/version.css';

export default class Version extends React.Component {

  constructor(props) {
    super(props);
    this.handleResponse = this.handleResponse.bind(this);
    this.state = {err: null, done: false, latest: null};
  }

  componentDidMount() {
    this.loadFromServer();
  }

  handleResponse(error, resp) {
    let latest = null;
    let err = null;

    if (resp && resp.responseText) {
      let json = JSON.parse(resp.responseText);
      if (json.version) {
        latest = json.version;
      }
    }

    if (!latest && error && error.statusText) {
      err = error.statusText;
    }

    this.setState({ err: err, done: true, latest: latest });
  }

  loadFromServer() {
    if (this.state.done) {
      return;
    }
    corslite(
      `https://versioncheck.conduit.io/version?version=${this.props.releaseVersion}?uuid=${this.props.uuid}`,
      this.handleResponse,
      true
    );
  }

  renderVersionCheck() {
    if (!this.state.done) {
      return "Performing version check...";
    }

    if (!this.state.latest) {
      return (<div>
        Version check failed
        {this.state.err? ": "+this.state.err : null}
      </div>);
    } else if (this.state.latest === this.props.releaseVersion) {
      return "Conduit is up to date";
    } else {
      return (<div>
        A new version ({this.state.latest}) is available<br />
        <Link to="https://versioncheck.conduit.io/update" className="button primary" target="_blank">Update Now</Link>
      </div>);
    }
  }

  render() {
    return (
      <div className="version">
        Currently running Conduit {this.props.releaseVersion}<br />
        {this.renderVersionCheck()}
      </div>
    );
  }

}
