import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Keep UI recovery only. Avoid logging user data here.
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      const fallbackMessage = this.props.fallbackMessage
      const refreshLabel = this.props.refreshLabel

      return (
        <section className="section-space scroll-mt-28" role="alert" aria-live="assertive">
          <div className="ui-container">
            <div className="ui-card border-red-300 bg-red-50/90 text-red-800">
              <p className="text-sm font-semibold sm:text-base">{fallbackMessage}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="ui-button-secondary mt-4"
              >
                {refreshLabel}
              </button>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
