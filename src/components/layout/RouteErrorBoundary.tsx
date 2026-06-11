import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="font-display text-lg text-text-1">Something flatlined</p>
          <p className="mt-2 text-sm text-text-2">This screen hit an error. Try another tab.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 rounded-2xl gradient-blue px-6 py-3 text-sm font-semibold text-white glow-blue"
            aria-label="Retry"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
