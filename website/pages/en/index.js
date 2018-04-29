/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc + ".html";
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}


const PopularTopicsSection = ({ language }) => (
  <div className="introSection lightBackground">
    <Container>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-evenly"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 420 }}>
          <h2>Documentation Structure</h2>
          <p>
            <b><a href={docUrl('architecture_index', language)}>Architecture</a>.</b>
            {' '}Explains various layers that make up Home Assistant.
          </p>
          <p>
            <b><a href={docUrl('frontend_index', language)}>Frontend</a>.</b>
            {' '}Explains how to develop the user interface of Home Assistant.
          </p>
          <p>
            <b><a href={docUrl('development_index', language)}>Backend</a>.</b>
            {' '}Explains how to build new integrations for Home Assistant.
          </p>
          <p>
            <b><a href={docUrl('misc', language)}>Misc</a>.</b>
            {' '}External APIs, Internationalization, asyncio, Hass.io add-ons, updating documentation.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Popular topics</h2>
          <ul style={{ flex: "1" }}>
          <li><a href={docUrl("development_index", language)}>
              Add a new integration
            </a></li>
            <li><a href={docUrl("internationalization_index", language)}>
              Translate Home Assistant
            </a></li>
            <li><a href={docUrl("frontend_index", language)}>
              Improve the frontend
            </a></li>
            <li><a href={docUrl("external_api_rest", language)}>
              Extract data from the Home Assistant API
            </a></li>
          </ul>
          <h2>Source Code</h2>
          <ul>
          <li><a href="https://github.com/home-assistant/home-assistant">
              Home Assistant
            </a></li>
            <li><a href="https://github.com/home-assistant/home-assistant-polymer">
              Home Assistant Frontend
            </a></li>
          </ul>

        </div>
      </div>
    </Container>
  </div>
);


class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <div>
    <h2 className="projectTitle">
      Home Assistant
      <small>Developer documentation</small>
    </h2>
    <div>
      <a href="https://www.home-assistant.io">Not a developer? Go to the normal website</a>
    </div>
  </div>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo-responsive.svg')} />
        <div className="inner">
          <ProjectTitle />
          {/* <PromoSection>
            <Button href="#try">Try It Out</Button>
            <Button href={docUrl('doc1.html', language)}>Example Link</Button>
            <Button href={docUrl('doc2.html', language)}>Example Link 2</Button>
          </PromoSection> */}
        </div>
      </SplashContainer>
    );
  }
}


const IntroSection = ({ language }) => (
  <div className="videoSection">
    <Container>
      <div style={{maxWidth: 600, margin: 'auto'}}>
        <div className="videoWrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Cfasc9EgbMU"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>
    </Container>
  </div>
)

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer indexPage">
        <PopularTopicsSection language={language} />
        <IntroSection language={language} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
