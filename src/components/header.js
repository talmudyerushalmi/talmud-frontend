import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import MainMenu from "./Menu/MainMenu"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    {/* <div
      style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `1.45rem 1.0875rem`,
        textAlign: 'right',
         direction: 'rtl'
      }}
    >
      <h1>תלמוד ירושלמי</h1>
      <h2 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
        
        </Link>
      </h2>
      
    </div> */}
    <MainMenu/>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
