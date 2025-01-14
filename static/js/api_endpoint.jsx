import React from 'react';

// Styles for this element is defined in src/css/custom.css

export default class ApiEndpoint extends React.Component {
  render() {
    return (
      <details className="api-endpoint">
        <summary className="api-endpoint-header">
          <div className={`api-endpoint-method ${this.props.method}`}>
            {this.props.method}
          </div>
          <code>{this.props.path}</code>
          <div
            className="api-endpoint-protection"
            title={
              this.props.unprotected
                ? 'Authentication is not required for this endpoint'
                : 'Authentication is required for this endpoint'
            }>
            {this.props.unprotected ? '🔓' : '🔒'}
          </div>
        </summary>

        <div className="api-endpoint-content">{this.props.children}</div>
      </details>
    );
  }
}
