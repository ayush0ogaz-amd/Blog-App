import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page has wandered off.</h1>
      <p>Try heading back to the latest stories.</p>
      <Link className="primary-link" to="/">Go home</Link>
    </main>
  );
}
