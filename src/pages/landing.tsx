import clockSvg from '../assets/clock.svg';
import layoutSvg from '../assets/layout.svg';
import editSvg from '../assets/edit.svg';
import medalSvg from '../assets/medal.svg';
import mockSvg from '../assets/mockmainapp.svg';


interface LandingComponentProps {

}
const LandingComponent: React.FC<LandingComponentProps> = () => {

  return (
    <>
      <div className="landing-page">
        <section className="hero-main">
          <header>
            <h2>Curator</h2>
            <p>What is Curator</p>
          </header>
          <div>
            <h1><span>Organize</span> Your Web Experience with <br /> <span>Bookmarks</span> Curator</h1>
            <p>Personalize your bookmarks to suit your browsing habits and streamline your online activities with ease.</p>
            <button>Start using Bookmarks Curator</button>
          </div>
        </section>
        <section className='main-app'>
          <img src={mockSvg} alt="mock svg" />
        </section>
        <section className="root">
          <div className="child">
            <h4>Features</h4>
            <h2>What makes Bookmarks Curator so special?</h2>
            <p>There are plenty of benefits when using Bookmarks Curator. We've highlighted some of them below:</p>
          </div>
          <div className="features-list">
            <div className="child">
              <div className="icon">
                <img src={clockSvg} className="logo react" alt="clock logo" />
              </div>
              <div className="info">
                <h3>Efficient Bookmark Organization</h3>
                <p>Easily categorize and manage your bookmarks for a clutter-free browsing experience.</p>
              </div>
            </div>
            <div className="child">
              <div className="icon">
                <img src={layoutSvg} className="logo react" alt="layout logo" />
              </div>
              <div className="info">
                <h3>Seamless Integration</h3>
                <p>Sync your bookmarks across devices and browsers for uninterrupted access to your favorite links.</p>
              </div>
            </div>
            <div className="child">
              <div className="icon">
                <img src={editSvg} className="logo react" alt="edit logo" />
              </div>
              <div className="info">
                <h3>Customizable Experience</h3>
                <p>Personalize your bookmarks with custom tags, thumbnails, and notes to suit your browsing style.</p>
              </div>
            </div>
            <div className="child">
              <div className="icon">
                <img src={medalSvg} className="logo react" alt="medal logo" />
              </div>
              <div className="info">
                <h3>User-Friendly Interface</h3>
                <p>Enjoy a sleek and intuitive interface designed to enhance your bookmarking workflow.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LandingComponent;