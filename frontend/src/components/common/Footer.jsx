function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sidebar-footer">
      <img src="/selco-foundation.png" alt="SELCO Foundation" />
      <span>
        © {year} SELCO Foundation
        <br />
        Innovation Benchmarking Tracker
      </span>
    </footer>
  );
}

export default Footer;
