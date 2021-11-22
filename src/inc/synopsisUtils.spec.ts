import { getTextForSynopsis, hideSourceFromText } from './synopsisUtils';

describe("synopsisUtils", ()=>{

  test.only("hideSourceFromText", ()=>{
    const text1 = `אלה המצות" (ויקרא כז, לד) - כל שם מצוה [אחת]. "וקדשתו כי את לחם אלהיך הוא מקריב" (ויקרא כא, ח).`
    const result1 = hideSourceFromText(text1);
    expect(result1).toBe(`אלה המצות" - כל שם מצוה [אחת]. "וקדשתו כי את לחם אלהיך הוא מקריב" .`);

    const text2 = `ר' חונה אמ': (האל) ["האל"] (ויקרא יח, כז) - קשות, מיכן שיש למטה מהן.`
    const result2 = hideSourceFromText(text2);
    expect(result2).toBe(`ר' חונה אמ': (האל) ["האל"] - קשות, מיכן שיש למטה מהן.`);


    


  })

  test.only("getTextForSynopsis", ()=>{
    const text1 = `טעמון דבית שמי "לא תהיה אשת המת החוצה לאיש זר" (דברים כה, ה) - החיצונה לא תהיה לאיש זר.`
    const result1 = getTextForSynopsis(text1);
    expect(result1).toBe(`טעמון דבית שמי לא תהיה אשת המת החוצה לאיש זר החיצונה לא תהיה לאיש זר`);

    const text2 = `החיצונה ת"ל תהיה לאיש זר.`
    const result2 = getTextForSynopsis(text2);
    expect(result2).toBe(`החיצונה ת"ל תהיה לאיש זר`);

    const text3 = `החיצונה ת"פ תהיה לאיש זר.`
    const result3 = getTextForSynopsis(text3);
    expect(result3).toBe(`החיצונה ת"פ תהיה לאיש זר`);

    const text4 = `החיצונה ת"פד תהיה לאיש זר.`
    const result4 = getTextForSynopsis(text4);
    expect(result4).toBe(`החיצונה תפד תהיה לאיש זר`);


  })
})