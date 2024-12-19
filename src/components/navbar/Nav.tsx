import { GiTrophyCup } from "react-icons/gi"; 
import { GiHomeGarage } from "react-icons/gi"; 
import { NavLink } from 'react-router-dom'
import './nav.scss'

const Nav = () => {
  return (
    <div className="nav">
        <h1 className='title_font'>Welcome to <span className='text-[--secondaryBlue]'>ASYNC Racing</span> 2024</h1>
        <ul>
            <li><NavLink to='/' className='redirectBtn border-2 border-[limegreen] text-[lime]'> <GiHomeGarage />Garage  </NavLink></li>
            <li><NavLink to='/winners' className='redirectBtn border-2 border-[--secondaryBlue] text-[#75b2f8]'><GiTrophyCup />Winners</NavLink></li>
        </ul>
    </div>
  )
}

export default Nav
