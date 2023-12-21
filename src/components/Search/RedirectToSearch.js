import { useHistory } from 'react-router-dom';

export default function RedirectToSearch(searchInput) {
  const history = useHistory();
  
  history.push({
    pathname: '/search',
    state: { searchInput }
  });
}
