import { debounce } from "lodash";
import { useEffect } from "react";



const useScroll = (percentage: number, cb: any) => {

    const handleScroll = () => {
        const scrolledPassed =
            document.documentElement.offsetHeight * (percentage/100) <
            window.innerHeight + document.documentElement.scrollTop;
        if (scrolledPassed) {
            cb()            
        }   
    };
    var debounced = debounce(handleScroll, 250, { 'maxWait': 1000 });


    useEffect(() => {
        window.addEventListener("scroll", debounced);
        return () => {
            window.removeEventListener("scroll", debounced);
        };
    }, []);
}
export default useScroll;