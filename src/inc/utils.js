import * as numeral from "numeral";

export function getNextLine(tractate, chapter, mishna, line,mishnaDoc){
    const nextLine = numeral(parseInt(line)+1).format('00000');
    const lineObj = mishnaDoc.lines?.find(lineItem => lineItem.lineNumber === nextLine);
    if (lineObj) {
        return {
            tractate, chapter, mishna,
            line:nextLine
        }
    } else {
        if (mishnaDoc.next) {
            return {
                ...mishnaDoc.next,
                line: mishnaDoc.next.lineFrom
            }
        } else return null; 

    }
}

export function getFirstLine(selectedMishna) {
    return selectedMishna.lines[0].lineNumber;
}

export function getPreviousLine(tractate, chapter, mishna, line,mishnaDoc){
    // if first line return 
    if (line === '00001' && chapter === '001') {
        return {
          tractate, chapter, mishna,line
        }
    }
    // if can move one line before
    let previousLine = numeral(parseInt(line)-1).format('00000');
    const lineObj = mishnaDoc.lines?.find(lineItem => lineItem.lineNumber === previousLine);
    if (lineObj) {
        return {
            tractate, chapter, mishna,
            line:previousLine
        }
    } 
    // else need to move mishna before
    else {
        return {
            ...mishnaDoc.previous,
            line: mishnaDoc.previous.lineTo
        }
    }

}
export const hebrewMap = new Map([
    [1,'א'],
    [2,'ב'],
    [3,'ג'],
    [4,'ד'],
    [5,'ה'],
    [6,'ו'],
    [7,'ז'],
    [8,'ח'],
    [9,'ט'],
    [10,'י'],
    [11,'יא'],
    [12,'יב'],
    [13,'יג'],
    [14,'יד'],
    [15,'טו'],
    [16,'טז'],
    [17,'יז'],
    [18,'יח'],
    [19,'יט'],
    [20,'כ'],
    [21,'כא'],
    [22,'כב'],
    [23,'כג'],
]);

