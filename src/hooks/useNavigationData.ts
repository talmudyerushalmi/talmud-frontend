import React, { useEffect, useState } from "react"
import PageService from "../services/pageService"
import { iLine, iLink, iTractate } from "../types/types"
import NavigationService from "../services/NavigationService"
import { iMishnaForNavigation } from "../components/shared/ChooseMishnaNew"

const useNavigationData = (link: iLink) => {
    const [allTractates, setAllTractates] = useState<iTractate[]>([])
    const [tractateData, setTractateData] = useState<iTractate|null>(null)
    const [mishnaForNavigation, setMishnaForNavigation] = useState<iMishnaForNavigation|null>(null)

    useEffect(()=>{
        PageService.getAllTractates().then(
            (tractates) => setAllTractates(tractates),
            (error) => console.log('An error occurred.', error)
          );
    },[])

    useEffect(()=>{
        if (link.tractate == "" || link.chapter == "" || link.mishna == "") {
            return
        }
        setTractateData(allTractates.find(t => t.id === link.tractate)||null)
        console.log(`%c get init data  ${link.tractate}  ${link.chapter} ${link.mishna} ${link.lineNumber}`, 'background: #222; color: #bada55');
        const fetchLines = (tractate: string, chapter: string, mishna: string) => {
            const controller = new AbortController();
            return NavigationService.getMishnaForNavigation(tractate, chapter, mishna, controller);
          };
          fetchLines(link.tractate,link.chapter, link.mishna)
          .then(m => setMishnaForNavigation(m))
   
    },[link,allTractates])

    // useEffect(()=>{
    //     if (tractate==""){
    //         return
    //     }

    //     console.log(`stats tractates (${allTractates.length})`)
    //     console.log('tractate updated');
    //     setTractateData({some:"sdfsdf"})
    // }, [tractate])
    return { allTractates,tractateData, mishnaForNavigation }
}

export default useNavigationData