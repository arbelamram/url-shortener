// client/src/pages/CreatePage.js
// Create page (“tool mode”): a focused UI for generating new short URLs,
// reusing the shared <UrlCreateForm /> component.

import '../styles/pages/CreatePage.css';
import UrlCreateForm from '../components/UrlCreateForm';

/**
 * CreatePage component.
 * Provides a dedicated workflow for creating short URLs without extra UI noise.
 */
export default function CreatePage() {
  return (
    <div className='container create-page'>
      <h1 className='create-title'>Create a short link</h1>
      <p className='muted create-subtitle'>
        Paste a long URL and generate a short link you can copy and share.
      </p>

      <div className='create-panel'>
        <UrlCreateForm />
      </div>
    </div>
  );
}
