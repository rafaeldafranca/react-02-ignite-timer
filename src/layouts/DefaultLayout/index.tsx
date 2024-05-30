import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { HomeContainer } from './styles'

export function DefaultLayout() {
  return (
    <HomeContainer>
      <Header />
      <Outlet />
    </HomeContainer>
  )
}
