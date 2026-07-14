import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" to="/">BlogSpace</Link>
        <p>A place for stories, ideas, and useful conversations.</p>
      </div>
      <p>© {new Date().getFullYear()} BlogSpace. Built to share.</p>
    </footer>
  );
}
