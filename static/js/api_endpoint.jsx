import React from 'react';

// Styles for this element is defined in src/css/custom.css

export default class ApiEndpoint extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false
    }
    this.toggleInfo = this.toggleInfo.bind(this);
    }

    toggleInfo(e){
      this.setState({open: !this.state.open})
    }

  render() {
    return (
      <div className="api-endpoint">
          <div 
            onClick={this.toggleInfo}
            className="api-endpoint-header"
          >
          <div className={`api-endpoint-method ${ this.props.method }`}>
            {this.props.method}
          </div>
            <code>{this.props.path}</code>
            <div 
              className="api-endpoint-protection"
              title={this.props.unprotected ?
                "Authentication is not required for this endpoint"
                : "Authentication is required for this endpoint"
                }
            >
              {this.props.unprotected ? ("🔓") : ("🔒")}
            </div>
          </div>
          {this.state.open ? (
            <div className="api-endpoint-content">
              {this.props.children}
            </div>
          ): null}
        </div>
    );
  }
}