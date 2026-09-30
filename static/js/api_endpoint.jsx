import React from 'react';

// Styles for this element is defined in src/css/custom.css

export default class ApiEndpoint extends React.Component {
  render() {
    // Derive a stable anchor ID from the method and path so endpoints can be
    // linked to directly, for example #get-api-config or
    // #post-api-services-domain-service.
    const id =
      this.props.id ||
      `${this.props.method}-${this.props.path}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return (
      <details className="api-endpoint" id={id}>
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
