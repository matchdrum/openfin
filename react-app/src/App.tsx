// react-queryparams-app.jsx
// Single-file React app demonstrating managing view state with query params.
// Usage:
// 1. Create a new app (e.g. using Create React App or Vite).
// 2. Install react-router-dom: `npm install react-router-dom`.
// 3. Replace your src/App.jsx with this file and run the dev server.

import React, {useEffect} from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  // useSearchParams from react-router keeps query params in sync with the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the `view` param to determine which UI to show. Defaults to 'list'.
  const view = searchParams.get('view') || 'list';
  const item = searchParams.get('item');
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Helper to update just one param while preserving others
  const setParam = (key, value, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === undefined) next.delete(key);
    else next.set(key, String(value));

    // preserve the rest of the params
    setSearchParams(next, { replace });
  };

  // Example: ensure page is >=1
  useEffect(() => {
    if (page < 1) setParam('page', 1, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow p-6">
        <Header />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <nav className="md:col-span-1">
            <Controls
              view={view}
              page={page}
              item={item}
              onChangeView={(v) => setParam('view', v)}
              onChangePage={(p) => setParam('page', p)}
              onClearItem={() => setParam('item', null)}
            />
          </nav>

          <main className="md:col-span-3">
            {view === 'list' && (
              <ListView
                page={page}
                onOpenItem={(id) => {
                  // Open details while keeping view=details
                  setParam('view', 'details');
                  setParam('item', id);
                }}
                onChangePage={(p) => setParam('page', p)}
              />
            )}

            {view === 'details' && item && (
              <DetailsView itemId={item} onBack={() => setParam('view', 'list')} />
            )}

            {view === 'settings' && <SettingsView />}

            {/* If the combination doesn't make sense, show a message */}
            {view === 'details' && !item && (
              <div className="mt-6 p-4 bg-yellow-50 border rounded">No item specified in the URL. Try selecting an item from the list.</div>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Query-Param View State Demo</h1>
      <div className="text-sm text-slate-500">Deep-linkable UI using <code>?view=...</code></div>
    </header>
  );
}

function Controls({ view, page, item, onChangeView, onChangePage, onClearItem }) {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h3 className="font-medium">Views</h3>
        <div className="mt-2 flex flex-col gap-2">
          <button
            className={`py-2 px-3 rounded ${view === 'list' ? 'bg-slate-700 text-white' : 'bg-slate-100'}`}
            onClick={() => onChangeView('list')}
          >
            List
          </button>
          <button
            className={`py-2 px-3 rounded ${view === 'details' ? 'bg-slate-700 text-white' : 'bg-slate-100'}`}
            onClick={() => onChangeView('details')}
          >
            Details
          </button>
          <button
            className={`py-2 px-3 rounded ${view === 'settings' ? 'bg-slate-700 text-white' : 'bg-slate-100'}`}
            onClick={() => onChangeView('settings')}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-medium">Pagination</h3>
        <div className="mt-2 flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-slate-100" onClick={() => onChangePage(Math.max(1, page - 1))}>Prev</button>
          <div className="px-3 py-1">Page {page}</div>
          <button className="px-3 py-1 rounded bg-slate-100" onClick={() => onChangePage(page + 1)}>Next</button>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-medium">Item</h3>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 text-sm text-slate-600">Selected: {item ?? '—'}</div>
          <button className="px-2 py-1 rounded bg-rose-100 text-rose-700 text-sm" onClick={onClearItem}>Clear</button>
        </div>
      </div>
    </div>
  );
}

function ListView({ page, onOpenItem, onChangePage }) {
  // Fake data for demo
  const perPage = 6;
  const start = (page - 1) * perPage + 1;
  const items = Array.from({ length: perPage }, (_, i) => ({ id: String(start + i), title: `Item ${start + i}` }));

  return (
    <section>
      <h2 className="text-xl font-semibold">List (page {page})</h2>
      <p className="text-sm text-slate-500 mt-1">Click an item to open details (this will update query params).</p>

      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <li key={it.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-slate-500">ID: {it.id}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-slate-100" onClick={() => onOpenItem(it.id)}>Open</button>
              <a
                className="px-3 py-1 rounded bg-slate-50 text-slate-500 text-sm border"
                href={`?view=details&item=${it.id}&page=${page}`}
                // anchor demonstrates deep-linking without JS state
              >
                Link
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2">
        <button className="px-3 py-1 rounded bg-slate-100" onClick={() => onChangePage(Math.max(1, page - 1))}>Prev</button>
        <div>Page {page}</div>
        <button className="px-3 py-1 rounded bg-slate-100" onClick={() => onChangePage(page + 1)}>Next</button>
      </div>
    </section>
  );
}

function DetailsView({ itemId, onBack }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Details for item {itemId}</h2>
        <div className="text-sm text-slate-500">(driven by <code>item</code> query param)</div>
      </div>

      <div className="mt-4 p-4 border rounded">
        <p className="text-sm">This is a detail view. The URL contains <code>?view=details&item={itemId}</code>. Use the back button to return to the list view while preserving other params.</p>

        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-100" onClick={onBack}>Back to list</button>
          <a className="px-3 py-1 rounded bg-slate-50 text-sm border" href={`?view=list`}>Open list (deep link)</a>
        </div>
      </div>
    </section>
  );
}

function SettingsView() {
  return (
    <section>
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-2 text-sm text-slate-600">Settings can be stored in query params too (e.g. <code>?theme=dark</code> or <code>?layout=compact</code>).</p>

      <div className="mt-4 p-4 border rounded">
        <p className="text-sm">This demo doesn't persist real settings, but you can extend the <code>setParam</code> helper to save toggles, filters, and more into the URL so that state is shareable and bookmarkable.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-6 text-sm text-slate-500">
      Tip: Modify the query string in the address bar (e.g. <code>?view=details&item=3</code>) and reload the page — the app will render the correct view from the URL.
    </footer>
  );
}
