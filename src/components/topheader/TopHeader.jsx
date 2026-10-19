import "./TopHeader.css";

function TopHeader() {
  return (
    <header className="header">

      <div className="mobile-title">
        RV Prime Assets
      </div>

      <div className="header-right">

        <span className="welcome">
          Welcome, Admin User
        </span>

        <div className="user-avatar">
          AU
        </div>

        <span className="bell">♧</span>

      </div>

    </header>
  );
}

export default TopHeader;