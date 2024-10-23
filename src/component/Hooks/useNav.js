import { useNavigate } from 'react-router-dom'

const useNav = () => {
    const navigate = useNavigate();

    const navigateTo =  (nav,time=1000) => {
        setTimeout(()=>{
            navigate(nav);
        },[time])
    }
    
    return navigateTo;
}

export default useNav