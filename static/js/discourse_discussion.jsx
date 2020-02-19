import React from 'react';
import PropTypes from 'prop-types';

export default class DiscussionBox extends React.Component {

  constructor(props) {
    super(props);
    this.postMessageReceived = this.postMessageReceived.bind(this);
  }

  componentDidMount() {
    this.DiscourseEmbed = {
      discourseUrl: this.props.discourseUrl,
      discourseEmbedUrl: this.props.discourseEmbedUrl,
    };
    window.addEventListener('message', this.postMessageReceived, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.postMessageReceived);
  }

  getIframeSource() {
    const { discourseUrl, discourseEmbedUrl, discourseUserName } = this.props;
    const queryParams = {};

    if (discourseEmbedUrl) {
      if (discourseEmbedUrl.indexOf('/') === 0) {
        console.error('discourseEmbedUrl must be a full URL, not a relative path');
      }

      queryParams.embed_url = encodeURIComponent(discourseEmbedUrl);
    }

    if (discourseUserName) {
      queryParams.discourse_username = discourseUserName;
    }

    let src = discourseUrl + 'embed/comments';
    const keys = Object.keys(queryParams);
    if (keys.length > 0) {
      src += '?';

      for (let i = 0; i < keys.length; i++) {
        if (i > 0) { src += '&'; }

        const k = keys[i];
        src += k + '=' + queryParams[k];
      }
    }

    return src;
  }

  postMessageReceived(e) {
    if (!e) { return; }

    const iframe = this.iframe;
    const { discourseUrl } = this.props;

    if (normalizeUrl(discourseUrl).indexOf(normalizeUrl(e.origin)) === -1) { return; }

    if (e.data) {
      if (e.data.type === 'discourse-resize' && e.data.height) {
        iframe.height = e.data.height + 'px';
      }

      if (e.data.type === 'discourse-scroll' && e.data.top) {
        // find iframe offset
        const destY = findPosY(iframe) + e.data.top;
        window.scrollTo(0, destY);
      }
    }
  }

  render() {
    return (
      <div
        className='discussion-box-container'
      >
        <iframe
          title='discussion box'
          ref={(el) => { this.iframe = el; }}
          src={this.getIframeSource()}
          id='discourse-embed-frame'
          width='100%'
          frameBorder='0'
          scrolling='no'
        />
      </div>
    );
  }
}

function normalizeUrl(url) {
  return url.toLowerCase().replace(/^https?(\:\/\/)?/, '');
}

function findPosY(obj) {
  let top = 0;
  if (obj.offsetParent) {
    while (1) {
      top += obj.offsetTop;
      if (!obj.offsetParent) {
        break;
      }
      obj = obj.offsetParent;
    }
  } else if (obj.y) {
    top += obj.y;
  }
  return top;
}
