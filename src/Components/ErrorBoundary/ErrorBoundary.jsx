import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    // For now, we'll just log to console in development
    if (import.meta.env.MODE === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.errorContainer}>
          <h2>Te pedimos mildis</h2>
          <p>Algo no anduvo como tenía que andar. Apretá el botón y que Dios te ayude.</p>
          <Button
            onClick={() => window.location.reload()}
            className={styles.reloadButton}
          >
            Volver a cargar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;