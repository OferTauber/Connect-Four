// import { useGlobalContext } from '../../../utils/context';
import './navbar.css';
// import { Link } from 'react-router-dom';

export default function Navbar() {
  // const { user } = useGlobalContext();
  return (
    <nav>
      <div className="nav-name">
        <p>שלום </p>
      </div>
      <div className="nav-buttons">
        <div className="btn">
          {' '}
          {/*Link to="/ "*/}
          לוח שנה
        </div>
        <div className="btn">
          {' '}
          {/*Link to="/info"*/}
          מידע
        </div>
        <div className="btn">
          {' '}
          {/*Link to="/blog"*/}
          טיולים באזור
        </div>
      </div>
    </nav>
  );
}
