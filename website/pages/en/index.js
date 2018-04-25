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
            <b>Architecture.</b> Discusses the architecture of the various layers that make up Home Assistant.
          </p>
          <p>
            <b>Frontend.</b> Discusses how to develop the user interface of Home Assistant.
          </p>
          <p>
            <b>Backend.</b> Discusses how to build new integrations for Home Assistant.
          </p>
          <p>
            <b>External APIs.</b> Documentation of the various APIs to extract data from Home Assistant.
          </p>
          <p>
            <b>Misc.</b> Internationalization, asyncio, Hass.io, updating documentation.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Popular topics</h2>
          <ul style={{ flex: "1" }}>
          <li><a href={docUrl("building_integrations", language)}>
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
      Not a developer? <a href="https://www.home-assistant.io">Go to the normal website</a>
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

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align={props.blockAlign} contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn" blockAlign="center">
    {[
      {
        title: 'Intents',
        content: 'Build powerful voice interactions',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Frontend Panels',
        content: 'Add a custom panel to control our component or provide rich user interface.',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Build powerful automations',
        content: 'Use the power of Python to built any advanced automation that you can dream off.',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Websocket API',
        content: 'Use the websocket API to get instantly notified of any change.',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'top',
      },
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}>
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'right',
        title: 'Learn How',
      },
    ]}
  </Block>
);

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'left',
        title: 'Try it Out',
      },
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('logo-responsive.svg'),
        imageAlign: 'right',
        title: 'Description',
      },
    ]}
  </Block>
);


const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

const IntroSection = ({ language }) => (
  <div className="introSection">
    <Container>
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
        {/* <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
