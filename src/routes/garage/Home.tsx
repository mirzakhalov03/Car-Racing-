import ActionBtns from '../../components/actionBtns/ActionBtns'
import Nav from '../../components/navbar/Nav'
import RaceTable from '../../components/raceTable/RaceTable'
import { useGetCarsQuery } from '../../redux/api/carsApi'
import './home.scss'

const Home = () => {
  const {refetch, data: carsData } = useGetCarsQuery({page: 1, limit: 5});
    

    
  return (
    <div className="app">
        <div className="wrapper">
            <div className='container pb-10'>
                <Nav/>
                <ActionBtns refetch={refetch} cars={carsData?.cars || []}/>
                <RaceTable />
                <div className='pt-10'></div>
            </div>
        </div>
    </div>
  )
}

export default Home
































