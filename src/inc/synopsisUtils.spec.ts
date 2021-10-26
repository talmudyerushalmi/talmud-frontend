import { hideSourceFromText } from './synopsisUtils';

describe("synopsisUtils", ()=>{

  test.only("hideSourceFromText", ()=>{
    const text1 = `אלה המצות" (ויקרא כז, לד) - כל שם מצוה [אחת]. "וקדשתו כי את לחם אלהיך הוא מקריב" (ויקרא כא, ח).`
    const result1 = hideSourceFromText(text1);
    expect(result1).toBe(`אלה המצות"  - כל שם מצוה [אחת]. "וקדשתו כי את לחם אלהיך הוא מקריב" .`);

    const text2 = `ר' חונה אמ': (האל) ["האל"] (ויקרא יח, כז) - קשות, מיכן שיש למטה מהן.`
    const result2 = hideSourceFromText(text2);
    expect(result2).toBe(`ר' חונה אמ': (האל) ["האל"]  - קשות, מיכן שיש למטה מהן.`);


    


  })
})