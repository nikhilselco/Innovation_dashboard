function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <img src="/selco-foundation.png" alt="SELCO Foundation" />
      <span>
        © {year} SELCO Foundation · Innovation Benchmarking Tracker
      </span>
    </footer>
  );
}

export default Footer;
