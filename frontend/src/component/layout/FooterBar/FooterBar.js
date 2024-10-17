import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import logo from "../../../images/logo3.png"
import "./FooterBar.css"

const FooterBar = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="App   Store" />
        <img src={appStore} alt="App Store" />
      </div>


      <div className="midFooter">
        <img src={logo} alt="logo" />
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023 &copy; SHOPPY</p>
      </div>


      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="/">LinkedIn</a>
        <a href="/">Github</a>
      </div>
    </footer>
  )
}

export default FooterBar
