import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import Version from '../js/components/Version.jsx';

describe('Version', () => {
  let loadFromServer;

  function setResponse(err, resp) {
    return sinon.stub(Version.prototype, 'loadFromServer').callsFake(function fakeFn() {
      this.handleResponse(err, resp);
    });
  }

  afterEach(() => {
    if (loadFromServer) { loadFromServer.restore(); }
  });

  it('renders initial loading message', () => {
    let component = mount(<Version />);

    expect(component.find("Version")).to.have.length(1);
    expect(component.text().indexOf("Performing version check...")).to.not.equal(-1);
  });

  it('renders up to date message when versions match', () => {
    loadFromServer = setResponse(null, {responseText: "{\"version\": \"v1.2.3\"}"});

    let component = mount(
      <Version
        releaseVersion="v1.2.3"
        uuid="fakeuuid" />
    );

    expect(component.text().indexOf("Conduit is up to date")).to.not.equal(-1);
  });

  it('renders update message when versions do match', () => {
    loadFromServer = setResponse(null, {responseText: "{\"version\": \"v2.3.4\"}"});

    // must wrap Version in a BrowserRouter because this test case renders a Link,
    // Link's must always be wrapped in a Router
    let component = mount(
      <BrowserRouter>
        <Version
          releaseVersion="v1.2.3"
          uuid="fakeuuid" />
      </BrowserRouter>
    );

    expect(component.text().indexOf("A new version (v2.3.4) is available")).to.not.equal(-1);
  });

  it('renders error when version check fails', () => {
    loadFromServer = setResponse({statusText: "Fake error"}, null);

    let component = mount(<Version />);

    expect(component.text().indexOf("Version check failed: Fake error")).to.not.equal(-1);
  });
});
