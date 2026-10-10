import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global crash guard: if any section throws during render, the user sees a
 * branded recovery screen instead of a blank white page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Standard diagnostics for an error boundary
    console.error('[ErrorBoundary] Uncaught render error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        dir="rtl"
        className="min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="cyber-glass rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center relative">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
            <AlertTriangle size={30} className="text-amber-400" />
          </div>

          <h1 className="text-xl font-extrabold text-white mb-3">
            خطای غیرمنتظره‌ای رخ داد
          </h1>
          <p className="text-sm text-navy-300 leading-relaxed mb-2">
            مشکلی در نمایش این بخش پیش آمد. نگران نباشید — اطلاعات شما آسیبی ندیده است.
          </p>
          <p className="text-xs text-navy-400 mb-6">
            کافی است صفحه را دوباره بارگذاری کنید تا به کار ادامه دهید.
          </p>

          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-glow hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            <RefreshCw size={16} />
            بارگذاری مجدد صفحه
          </button>

          {this.state.error && (
            <p className="mt-6 text-[11px] text-navy-500 font-mono break-all" dir="ltr">
              {this.state.error.message}
            </p>
          )}
        </div>
      </div>
    );
  }
}
