import React, { useEffect } from 'react';
import { Container, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TagManager from 'react-gtm-module';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  panel: {
    '&.MuiPaper-root': {
      //  backgroundColor: '#3f51b5',
      //   color: 'white',
      padding: '1rem',
      marginBottom: '1rem',
    },
  },
}));

const IntroductionPage = (props) => {
  const classes = useStyles();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        pagePath: window.location.href,
        pageTitle: 'introduction',
      },
    });
  }, []);
  return (
    <>
      <Container>
        <Paper className={classes.panel} style={{ marginBottom: '8rem' }}>
          <h1>מהדורת הירושלמי הדיגיטלי – מבוא</h1>
          <p dir="rtl">
            <span>פרופ' מנחם כ"ץ, ד"ר הלל גרשוני, ירון בר</span>
          </p>
          <h2 dir="rtl" id="h.4cqw2t38o02e">
            <span>הצורך במהדורה לתלמוד הירושלמי</span>
          </h2>
          <p dir="rtl">
            <span>
              התלמוד הירושלמי לא עבר תהליכי עריכה ועיבוד ארוכים ומפורטים כפי שעבר התלמוד הבבלי. נוסף על כך, הירושלמי לא
              זכה לתפוצה רחבה כאחיו הבבלי ולא זכה למסורת נוסח ענפה כל כך. אין בידינו אלא כתב יד אחד ויחיד – הנמצא
              בספרייה בליידן – המשמר את נוסח הירושלמי כולו, ונוסח כתב יד זה אינו נקי משיבושים.
            </span>
          </p>
          <p dir="rtl">
            <span>
              כמו מסורת הנוסח, גם מסורת הפרשנות והביאור של הירושלמי דלה יחסית. לאורך הדורות השקיעו תלמידי חכמים מעטים את
              מרצם בכתיבת ביאור לירושלמי. מתקופת הגאונים והראשונים לא הגיע לידנו כמעט אף פירוש לירושלמי, ורק המפרשים
              האחרונים הותירו לנו פירושים לירושלמי (חלקם על מסכתות שלמות וחלקם על התלמוד כולו).
            </span>
          </p>
          <p dir="rtl">
            <span>
              המהדורה הביקורתית הראשונה של מסכת מן התלמוד הירושלמי, הכוללת את כל המאפיינים ההכרחיים למהדורה ביקורתית של
              התלמוד, היא מהדורת מ' כ"ץ לירושלמי קידושין (2016). במהדורה זו הונח היסוד למבנה מהדורות למסכתות אחרות: כל
              פרק חולק לסוגיות, כשכל סוגיה מבוססת על כתב יד ליידן, עם תיקונים הכרחיים וסינופסיס של עדי הנוסח הישירים
              ובכלל זה הסוגיות המקבילות בתלמוד הירושלמי. לכל סוגיה צורפו מדורים של מקבילות ושל מובאות, וכן ביאור קצר.
            </span>
          </p>
          <h2 dir="rtl" id="h.c4cg7uwz56g2">
            <span>מהדורה דיגיטלית בספרות חז"ל - שדה בצמיחה</span>
          </h2>
          <p dir="rtl">
            <span>
              מהדורה זו הייתה בעיקרה מודפסת, אם כי היא כללה רכיבים דיגיטליים: נספחים מלאים של המובאות והמקבילות צורפו לה
              כקובץ מקוון. היותה של המהדורה מודפסת היא העלתה קשיים בפני המהדיר בבואו לעשות בחירות שמהדיר של מהדורה
              דיגיטלית אינו נצרך להן. לדוגמה, המהדיר אינו יכול להציג את הטקסט הן מחולק לסוגיות הן באופן רציף; הסינופסיס
              מובא בנספח, באופן התופס מקום רב וגם מסרבל את השימוש בספר; המובאות והמקבילות מצוטטות באופן מקוצר בלבד; וכן
              הלאה.
            </span>
          </p>
          <p dir="rtl">
            <span>
              מהדורה דיגיטלית זו (תחת מענק ISF 1717/19) מבקשת לענות על קושי זה, וליצור מהדורה המתאימה לעידן הדיגיטלי.
            </span>
          </p>
          <p dir="rtl">
            <span>
              מהדורות דיגיטליות של ספרות רבנית הן שדה מתפתח חדש. ניתן לציין את אתר "הכי גרסינן" לחילופי נוסחאות של
              התלמוד הבבלי ואת "מפעל המדרש" של מכון שכטר, את המהדורה הדיגיטלית של המשנה (Digital Mishnah) של ח' לפין וד'
              שטוקל, ואת המהדורה הדיגיטלית החלוצית של פיוטים, "קרובות של י"ח מן הגניזה הקהירית", של א' שמידמן.
            </span>
          </p>
          <p dir="rtl">
            <span>
              עם זאת, לא נוצרה עד כה אף מהדורה מלאה של חיבור מספרות חז"ל, מהדורה הכוללת הן טקסט ביקורתי ומתוקן הן מדורי
              מקבילות, מובאות וביאור, מחסור שמהדורה זו מבקשת להשלים. בשלב זה מתמקדת המהדורה במסכת יבמות, ואולם מטרתה היא
              להמשיך את המפעל לסדר נשים כולו, ובהמשך גם מעבר אליו.
            </span>
          </p>
          <h2 dir="rtl" id="h.l834vb5lo0t3">
            <span>מאפייני המהדורה &nbsp;</span>
          </h2>
          <p dir="rtl">
            <strong>הטקסט:</strong>
            <span>
              &nbsp;טקסט המהדורה מבוסס על כתב יד ליידן של התלמוד הירושלמי, כולל ההגהות והתיקונים בגוף כתב היד ובשוליו.
              כתב יד ליידן אינו מוצג כפי שהוא, אלא מתוקן במקום שיש ביסוס משמעותי לכך. כל סטייה מנוסח הבסיס מסומנת ומלווה
              בהסבר.
            </span>
          </p>
          <p dir="rtl">
            <span>
              טקסט המסכת מפוסק ומחולק לסוגיות (ולעיתים לתת-סוגיות) ולשורות, ומסומנים בו מראי המקום לפסוקים. כל סוגיה
              מקבלת כותרת מתאימה, ובראש כל הלכה מוצגת המשנה על פי מסורת ארץ ישראל, בהתבסס על כתב יד קויפמן או פרמה של
              המשנה.
            </span>
          </p>
          <p dir="rtl">
            <span>
              כל הסימונים (ובכלל זה הפיסוק, החלוקה לשורות ולסוגיות וסימון מראי המקום) יוכלו להיות מוצגים או מוסתרים
              בהתאם לבחירת המשתמשים ולנוחותם.
            </span>
          </p>
          <p dir="rtl">
            <strong>העתקה משווה (סינופסיס): </strong>
            <span>
              המהדורה כוללת העתקה משווה (סינופסיס) של עדי הנוסח הישירים והעקיפים. מודול לשילוב מקבילות בתוך התלמוד
              הירושלמי נמצא בפיתוח ויועלה בהמשך. הסינופסיס כולל גם מובאות נבחרות בספרות הראשונים ובילקוטים, ואלה מסומנים
              בצבע מיוחד (סגול). המשתמשים יוכלו בהמשך להציג או להסתיר את עדי הנוסח השונים ואת סוגיהם השונים (ישירים,
              עקיפים [ילקוטים וציטוטים]) לנוחיותם.
            </span>
          </p>
          <p dir="rtl">
            <span>
              בהעתקה המשווה שילבנו גם מקבילות נבחרות (בעיקר ברייתות), ככלי עזר נוח לחקר המקבילות בספרות חז"ל. גם אלה
              מסומנים בצבע מיוחד (אדום).
            </span>
          </p>
          <p dir="rtl">
            <strong>מקבילות בספרות חז"ל:</strong>
            <span>
              &nbsp;המהדורה כוללת את המקבילות בספרות חז"ל למסכת, בהתבסס על פרויקט מקבילות הירושלמי של אוניברסיטת בר אילן
              ופרויקטים אחרים, בעזרת סריקה של ספרות המקבילות הקיימת, ובעזרת כלים ממוחשבים מתקדמים (בשיתוף פעולה עם DICTA
              בראשות פרופ' משה קופל וד"ר אבי שמידמן). המקבילות מוצגות לצד כל סוגיה וסוגיה, תוך קישור ברור ומדויק לטקסט
              הרלוונטי של הירושלמי, כך שניתן להציג אותן הן בצורת רשימה מלאה לכל הלכה או לכל סוגיה, הן את המקבילות
              הרלוונטיות לשורה מסוימת בלבד, באופן מקוצר או מפורט, לבחירת המשתמש.
            </span>
          </p>
          <p dir="rtl">
            <strong>מובאות בספרות הראשונים: </strong>
            <span>
              לאור החשיבות של מובאות בספרות הראשונים ובילקוטים כעדי נוסח עקיפים לתלמוד הירושלמי וכמראי מקום לפרשנות
              ולשימוש בתלמוד לאורך הדורות, מוצגות מובאות אלה במדור נפרד. המובאות כרגע מתבססות בעיקר על כרטסת הירושלמי של
              פרופ' יעקב זוסמן, כיום בניהולם של פרופ' לייב מוסקוביץ' ופרופ' אנדראס לנרד, במסגרת הקתדרה לחקר התלמוד
              הירושלמי, ע"ש מרן הרב הראשי אלוף הרב שלמה גורן זצ"ל, אוניברסיטת בר-אילן. כמו כן אנו מתבססים על כלים
              ומקורות נוספים, בין השאר: רישומי מפעל התלמוד של יד הרב הרצוג, אתר הירושלמי של ד"ר משה פינצ'וק ופרויקט
              DICTA.
            </span>
          </p>
          <p dir="rtl">
            <span>
              בחלק זה אנו משתמשים, כבמהדורת ירושלמי קידושין, בדרך שהלך דב רטנר ב"אהבת ציון וירושלים" ובדרך שהתווה ר"ש
              ליברמן במחברתו "על הירושלמי" (עמ' 36-46) ובמבואו ל"הירושלמי כפשוטו" (עמ' כג-כה).
            </span>
          </p>
          <p dir="rtl">
            <strong>ביבליוגרפיה:</strong>
            <span>
              &nbsp;המהדורה כוללת מדור ביבליוגרפיה של ספרות המחקר על המסכת, בהתבסס על סריקה של ספרות המחקר הרלוונטית, על
              מאגרי מידע ברשת ועל מפתחות אחרים.
            </span>
          </p>
          <p dir="rtl">
            <strong>ביאור קצר</strong>
            <span>
              : המהדורה כוללת גם הערות פרשניות, ההולכות ומיתוספות עם הזמן. ההערות המבארות מתבססות על בחינה מדוקדקת של
              עדי הנוסח, של המקבילות והמובאות, של פירושי הקדמונים ושל ספרות המחקר.
            </span>
          </p>
          <p dir="rtl">
            <strong>תמונות עדי נוסח:</strong>
            <span>
              &nbsp;בשלב הבא תכלול המהדורה גם תמונות איכותיות של עדי הנוסח הישירים למסכת, שיאפשרו למשתמש לבדוק את הנוסח
              בעצמו.
            </span>
          </p>
          <h2 dir="rtl" id="h.3zvtux472mb2">
            <span>שימוש באתר</span>
          </h2>
          <p dir="rtl">
            <span>
              יש להשתמש בסרגל הניווט כדי לעבור בין פרקים ומשניות (הלכות). ניתן להשתמש גם בחיצים במקלדת כדי לנוע קדימה או
              אחורה במסכת.
            </span>
          </p>
          <p dir="rtl">
            <span>
              כברירת המחדל, מוצגת הלכה שלמה בירושלמי בכל פעם, ולשמאלה כל המדורים הרלוונטיים אליה. ניתן ללחוץ על כותרת
              המדור כדי להרחיב או לכווץ אותו.
            </span>
          </p>
          <p dir="rtl">
            <span>ניתן ללחוץ על כל פריט במדור כדי להציג תצוגה מקדימה שלו.</span>
          </p>
          <p dir="rtl">
            <span>
              לחיצה על סימן שלוש הנקודות מימין לפריט במדור, תציג את הטקסט המלא, תוך סימון של המילים הרלוונטיות בתוך טקסט
              הירושלמי.
            </span>
          </p>
          <p dir="rtl">
            <span>לחיצה על כותרת של סוגיה תציג רק את פריטי המדורים הרלוונטיים לאותה סוגיה. </span>
          </p>
          <p dir="rtl">
            <span>לחיצה על שורה תציג רק את פריטי המדורים הרלוונטיים לאותה שורה.</span>
          </p>
          <p dir="rtl">
            <span>לחיצה על המשולש הפתוח משמאל לכל שורה תפתח את ההעתקה המשווה לאותה שורה.</span>
          </p>
          <p dir="rtl">
            <span></span>
          </p>
          <h2 dir="rtl" id="h.r7ihkz7hnkq3">
            <span>מקורות</span>
          </h2>
          <p dir="rtl">
            <span>כאמור לעיל, בהכנתם של המדורים השונים אנו משתמשים במאגרי מידע וקטלוגים שונים, ובכללם: </span>
          </p>
          <p dir="rtl">
            <span>
              1. אוצר כתבי-יד תלמודיים בעריכת י' זוסמן, יחד עם עדכוני פרידברג (נערכו בידי מ' כ"ץ, ספטמבר 2017, באתר
            </span>
            <span>
              <a href="https://www.google.com/url?q=https://fjms.genizah.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189271000&amp;usg=AOvVaw3NG6NDK96HchxLF8nvkZN7">
                &nbsp;
              </a>
            </span>
            <span>
              <a href="https://fjms.genizah.org" target="_blank"  rel="noreferrer">
                https://fjms.genizah.org
              </a>
            </span>
            <span>). </span>
          </p>
          <p dir="rtl">
            <span>2. פרויקט המקבילות לירושלמי של אוניברסיטת בר אילן (</span>
            <span>
              <a href="https://www.biu.ac.il/js/tl/yerushalmi" target="_blank" rel="noreferrer">
                https://www.biu.ac.il/js/tl/yerushalmi
              </a>
            </span>
            <span>).</span>
          </p>
          <p dir="rtl">
            <span>
              3. כרטסת הירושלמי של פרופ' יעקב זוסמן, כיום בניהולם של פרופ' לייב מוסקוביץ' ופרופ' אנדראס לנרד, במסגרת
              הקתדרה לחקר התלמוד הירושלמי, ע"ש מרן הרב הראשי אלוף הרב שלמה גורן זצ"ל, אוניברסיטת בר-אילן.
            </span>
          </p>
          <p dir="rtl">
            <span>4. מאגרי מידע לתלמוד הירושלמי של מ' פינצ'וק (</span>
            <span>
              <a href="http://yerushalmidb.com" target="_blank" rel="noreferrer">
                http://yerushalmidb.com
              </a>
            </span>
            <span>).</span>
          </p>
          <p dir="rtl">
            <span>5. הכרטסת של יד הרב הרצוג. </span>
          </p>
          <p dir="rtl">
            <span>6. פרויקט "מאגרים" של האקדמיה ללשון העברית (</span>
            <span>
              <a href="http://maagarim.hebrew-academy.org.il" target="_blank" rel="noreferrer">
                http://maagarim.hebrew-academy.org.il
              </a>
            </span>
            <span>). </span>
          </p>
          <p dir="rtl">
            <span>7. מאגר עדי הנוסח של התלמוד הבבלי ע"ש סול ואוולין הנקינד והמפתח הביבליוגרפי לספרות התלמודית (</span>
            <span>
              <a href="https://www.lieberman-institute.com" target="_blank" rel="noreferrer">
                https://www.lieberman-institute.com
              </a>
            </span>
            <span>). </span>
          </p>
          <p dir="rtl">
            <span>8. פורטל FJMS לגניזה ולעדי נוסח של התלמוד הבבלי (</span>
            <span>
              <a href="https://fjms.genizah.org" target="_blank" rel="noreferrer">
                https://fjms.genizah.org
              </a>
            </span>
            <span>).</span>
          </p>
          <p dir="rtl">
            <span>9. כלים ממוחשבים למציאת מקבילות ומובאות שפותחו בידי DICTA (</span>
            <span>
              <a href="http://dicta.org.il" target="_blank" rel="noreferrer">
                http://dicta.org.il
              </a>
            </span>
            <span>). </span>
          </p>
          <p dir="rtl">
            <span>10. פרויקט הש</span>
            <span>ו"ת - </span>
            <span>מאגר היהדות הממוחשב, אוניברסיטת בר-אילן</span>
            <span>.</span>
          </p>
          <p dir="rtl">
            <span>וכן מפתחות ומקורות נוספים.</span>
          </p>
          <h2 dir="rtl" id="h.ir894jvx05co">
            <span>מצב המהדורה, גרסה 0.1 (ינואר 2022)</span>
          </h2>
          <p dir="rtl">
            <span>
              בינואר 2022 הושקה גרסה 0.1 של המהדורה, כשהיא במצב של "מדגים יכולות". בגרסה זו מוצגת מסכת יבמות, והיא
              כוללת:
            </span>
          </p>
          <ul>
            <li dir="rtl">
              <span>טקסט על פי כתב יד ליידן, מתוקן בהתאם לשיקול דעת ולספרות המחקר</span>
            </li>
            <li dir="rtl">
              <span>פיסוק מלא של הטקסט</span>
            </li>
            <li dir="rtl">
              <span>חלוקה לשורות</span>
            </li>
            <li dir="rtl">
              <span>חלוקה לסוגיות (או תת-סוגיות)</span>
            </li>
            <li dir="rtl">
              <span>
                העתקה משווה של כתב יד ליידן וקטע כריכה ב (על פי "גנזי הירושלמי" ובקריאה מחדש מתוך תצלומים צבעוניים
                איכותיים של קטע הכריכה)
              </span>
            </li>
            <li dir="rtl">
              <span>העתקה משווה ראשונית עם מקבילות ומובאות מראשונים בחלק מן ההלכות</span>
            </li>
            <li dir="rtl">
              <span>918 מקבילות בספרות חז"ל</span>
            </li>
            <li dir="rtl">
              <span>972 מובאות בספרות הראשונים</span>
            </li>
            <li dir="rtl">
              <span>257 הערות נוסח</span>
            </li>
            <li dir="rtl">
              <span>142 הערות ביבליוגרפיות</span>
            </li>
            <li dir="rtl">
              <span>46 </span>
              <span>הערות מבארות</span>
            </li>
          </ul>
          <h3 dir="rtl" id="h.14tqukooa0de">
            <span>תכנון לגרסה הבאה (0.2)</span>
          </h3>
          <ul>
            <li dir="rtl">
              <span>הצגה חדשה של התיקונים בטקסט הבסיס תוך סימונם באופן ברור</span>
            </li>
            <li dir="rtl">
              <span>תוספת מקבילות, מובאות, הערות נוסח, הערות ביבליוגרפיות והערות מבארות</span>
            </li>
            <li dir="rtl">
              <span>תיקון טקסט המקבילות לפי כתבי יד ומהדורות מדויקות</span>
            </li>
            <li dir="rtl">
              <span>תיקוני טקסט נוספים ותיקוני קריאה בהתאם לעיון בכתבי היד</span>
            </li>
            <li dir="rtl">
              <span>השלמת ההעתקה המשווה בעדי נוסח ישירים ועקיפים</span>
            </li>
            <li dir="rtl">
              <span>הוספת אפשרות תצוגת פרק שלם</span>
            </li>
          </ul>
          <h3 dir="rtl" id="h.e3mz6hz9yn87">
            <span>תכנון להמשך</span>
          </h3>
          <ul>
            <li dir="rtl">
              <span>הוספת תמונות עדי הנוסח</span>
            </li>
            <li dir="rtl">
              <span>סינון ומיון ההעתקה המשווה (הסינופסיס) בהתאם לסוג עד הנוסח</span>
            </li>
            <li dir="rtl">
              <span>העתקה משווה מתוחכמת, תוך צביעת שינויי נוסח והדגשתם</span>
            </li>
            <li dir="rtl">
              <span>סינון ומיון המובאות והמקבילות בהתאם לסוג המקבילה ותקופת המובאה</span>
            </li>
            <li dir="rtl">
              <span>ניווט לפי דפים ועמודים של דפוס ונציה ומהדורת האקדמיה ללשון העברית</span>
            </li>
            <li dir="rtl">
              <span>אפשרות ייצוא נוסח בפורמט XML בהתאם לתקן TEI</span>
            </li>
            <li dir="rtl">
              <span>הרחבת המהדורה למסכתות נוספות</span>
            </li>
          </ul>

          <div style={{ direction: 'ltr' }}>
            <h2 id="h.qg18xkwrj2gb">
              <span>Technological Stack</span>
            </h2>
            <p>
              <span>AWS</span>
              <span>
                &nbsp;- Our stack is hosted and managed by Amazon Web Service (AWS). We manage our domain, security
                certificates, users (Cognito), Amplify, EC2 instances, MongoDB database and CloudFront for quickly
                caching and distributing our frontend to anywhere in the world.
              </span>
            </p>
            <p>
              <span>Authentication</span>
              <span>
                &nbsp;- for authentication we use the AWS Cognito service, and only authenticated users have access to
                the admin section on the website. Our backend is also protected on some routes (updating the database)
                and will allow only authenticated requests to pass.
              </span>
            </p>
            <p>
              <span>Deployment</span>
              <span>
                &nbsp;- For an easy CI/CD deployment process, we use the AWS Amplify service. Merging a feature branch
                into either of the ‘staging’ or ’production’ branches will trigger a deployment process that will deploy
                the triggered branch into its connected environment automatically within minutes.
              </span>
            </p>
            <p>
              <span>MongoDB database</span>
              <span>&nbsp;– we divide our data into two main collections: </span>
              <span>Tractates</span>
              <span>&nbsp;and </span>
              <span>Mishnayot</span>
              <span>. </span>
              <span>'Tractates'</span>
              <span>&nbsp;contains the entire structure divided to chapters and mishnayot. </span>
              <span>'Mishnayot'</span>
              <span>
                &nbsp;contains the data and meta-data of a single mishna - its synopsis, structure, related excerpts,
                parallel sources and more.
              </span>
            </p>
            <p>
              <span>
                Using a MongoDB database allows us to quickly retrieve documents and all their related data and enables
                flexible editing (flexible structure versus relational databases whose data is spread over several
                tables).
              </span>
            </p>
            <p>
              <span>NestJS</span>
              <span>&nbsp;– our backend is run on a</span>
              <span>
                <a href="https://www.google.com/url?q=https://nestjs.com/&amp;sa=D&amp;source=editors&amp;ust=1641205189283000&amp;usg=AOvVaw2Um1X98T9F2u2DqmYDkgFh">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://nestjs.com/" target="_blank" rel="noreferrer">
                  NestJS
                </a>
              </span>
              <span>&nbsp;framework, a relatively new and popular open source NodeJS framework. </span>
            </p>
            <p>
              <span>React</span>
              <span>&nbsp;– our frontend is written using</span>
              <span>
                <a href="https://www.google.com/url?q=https://reactjs.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189284000&amp;usg=AOvVaw1Gj3YM98DU45Qb_haKraJv">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
                  React
                </a>
              </span>
              <span>
                &nbsp;– a very popular open source JavaScript library, written and maintained by Facebook, which offers
                great flexibility and many supporting libraries (
              </span>
              <span>
                <a href="https://mui.com/" target="_blank" rel="noreferrer">
                  Material-UI
                </a>
              </span>
              <span>&nbsp;for design and user interface,</span>
              <span>
                <a href="https://www.google.com/url?q=https://draftjs.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189285000&amp;usg=AOvVaw2csq3bzBtjYmxT3ZAZ0bKP">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://draftjs.org/" target="_blank" rel="noreferrer">
                  DraftJS
                </a>
              </span>
              <span>&nbsp;for custom editor,</span>
              <span>
                <a href="https://www.google.com/url?q=https://formik.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189286000&amp;usg=AOvVaw27IxM8Sca8RsfADrMRRv9m">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://formik.org/" target="_blank" rel="noreferrer">
                  Formik
                </a>
              </span>
              <span>&nbsp;for forms, and more).</span>
            </p>
            <p>
              <span>ElasticSearch</span>
              <span>&nbsp;– we plan to add advanced text searching capabilities to our data by creating an</span>
              <span>
                <a href="https://www.elastic.co/">&nbsp;</a>
              </span>
              <span>
                <a href="https://www.elastic.co/" target="_blank" rel="noreferrer">
                  ElasticSearch
                </a>
              </span>
              <span>&nbsp;index. The ability to create an</span>
              <span>
                <a href="https://www.google.com/url?q=https://en.wikipedia.org/wiki/Inverted_index&amp;sa=D&amp;source=editors&amp;ust=1641205189288000&amp;usg=AOvVaw0WlvIhsmwluvxYKXZXyCLd">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://en.wikipedia.org/wiki/Inverted_index" target="_blank" rel="noreferrer">
                  inverted index
                </a>
              </span>
              <span>
                &nbsp;will enable us to perform advanced text searches. Words are indexed and given a score according to
                their popularity, rarity, and importance in the context of the document. Along with the use of
                text-oriented algorithms such as fuzzy-search and word prefixes,
              </span>
              <span>
                <a href="https://www.elastic.co/" target="_blank" rel="noreferrer">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://www.elastic.co/" target="_blank" rel="noreferrer">
                  ElasticSearch
                </a>
              </span>
              <span>&nbsp;offers advanced text searching capabilities with high-speed response times.</span>
            </p>
            <p>
              <span>Open Source</span>
              <span>
                &nbsp;– Any website intending to display and edit a primary text with side views containing parallels,
                references, comments, and metadata, will be able to benefit from our codebase. Our code is stored also
                on Github for the benefit of development and use by other digital editions:
              </span>
              <span>
                <a href="https://www.google.com/url?q=https://github.com/talmudyerushalmi&amp;sa=D&amp;source=editors&amp;ust=1641205189290000&amp;usg=AOvVaw16sf_A3zx_P-8jDI-Ey7yv">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://github.com/talmudyerushalmi" target="_blank" rel="noreferrer">
                  https://github.com/talmudyerushalmi
                </a>
              </span>
              <span>. </span>
            </p>
            <p>
              <span></span>
            </p>
            <h2 dir="rtl" id="h.uvmc4ozaywz4">
              <span>ביבליוגרפיה נבחרת</span>
            </h2>
            <p dir="rtl">
              <span>אליצור, ב', "הקדמה", תלמוד ירושלמי, הוצאת האקדמיה ללשון העברית, ירושלים (תשס"א), עמ' מא-מו</span>
            </p>
            <p dir="rtl">
              <span>אליצור, ב', "מהדורת הירושלמי של המילון ההיסטורי", מדעי היהדות 41 (תשס"ב), עמ' 210-195</span>
            </p>
            <p dir="rtl">
              <span>אפשטיין, י"נ, מבוא לנוסח המשנה, ירושלים תש"ח</span>
            </p>
            <p dir="rtl">
              <span>
                זוסמן, י', אוצר כתבי-היד התלמודיים, ירושלים תשע"ב [עדכוני פרידברג לאוצר כתבי-היד התלמודיים, קטעים חדשים
                וצירופים חדשים, בעריכת מנחם כ"ץ, מהדורת ספטמבר 2017,
              </span>
              <span>
                <a href="https://www.google.com/url?q=https://fjms.genizah.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189291000&amp;usg=AOvVaw24u5K9gwK847_RFSmpO32o">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://fjms.genizah.org/" target="_blank" rel="noreferrer">
                  https://fjms.genizah.org/
                </a>
              </span>
              <span>]</span>
            </p>
            <p dir="rtl">
              <span>זוסמן, י', גנזי הירושלמי, ירושלים תש"ף</span>
            </p>
            <p dir="rtl">
              <span>זוסמן, י', "מבוא", תלמוד ירושלמי, הוצאת האקדמיה ללשון העברית, ירושלים (תשס"א), עמ' ט-מ</span>
            </p>
            <p dir="rtl">
              <span>כ"ץ, מ', תלמוד ירושלמי, מסכת קידושין: מהדורה וביאור קצר, ירושלים תשע"ו</span>
            </p>
            <p dir="rtl">
              <span>כ"ץ, מ', "פרויקט הכי גרסינן כמהדורה ביקורתית של התלמוד הבבלי", ספטמבר 2017, </span>
              <span>
                <a href="https://www.google.com/url?q=https://fjms.genizah.org/&amp;sa=D&amp;source=editors&amp;ust=1641205189293000&amp;usg=AOvVaw2f5xq3vs10TV5Ula0rKU2z">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://fjms.genizah.org/" target="_blank" rel="noreferrer">
                  https://fjms.genizah.org/
                </a>
              </span>
            </p>
            <p dir="rtl">
              <span>כהנא, מ"י, ספרי במדבר: מהדורה מבוארת, א-ה, ירושלים תשע"א-תשע"ה</span>
            </p>
            <p dir="rtl">
              <span>מאגר עדי נוסח של התלמוד הבבלי ע"ש סול ואוולין הנקינד, המכון לחקר התלמוד ע"ש שאול ליברמן, </span>
              <span>
                <a href="https://www.lieberman-institute.com/" target="_blank" rel="noreferrer">
                  https://www.lieberman-institute.com
                </a>
              </span>
            </p>
            <p dir="rtl">
              <span>מאגרים, מפעל המילון ההיסטורי ללשון העברית, האקדמיה ללשון העברית,</span>
              <span>
                <a href="https://www.google.com/url?q=http://maagarim.hebrew-academy.org.il/&amp;sa=D&amp;source=editors&amp;ust=1641205189294000&amp;usg=AOvVaw35JR4m4TvE4zW7iEciIn21">
                  &nbsp;
                </a>
              </span>
              <span>
                <a href="https://maagarim.hebrew-academy.org.il/" target="_blank" rel="noreferrer">
                  https://maagarim.hebrew-academy.org.il
                </a>
              </span>
            </p>
            <p dir="rtl">
              <span>מוסקוביץ, ל', הטרמינולוגיה של הירושלמי: המונחים העיקריים, ירושלים תשס"ט</span>
            </p>
            <p dir="rtl">
              <span>מיליקובסקי, ח', "מהדורות וטיפוסי טקסט בספרות חז"ל", קרית ספר סא (תשמ"ו), עמ' 170-169</span>
            </p>
            <p dir="rtl">
              <span>נאה, ש', "תלמוד ירושלמי במהדורת האקדמיה ללשון העברית", תרביץ עא (תשס"ב), עמ' 603-569</span>
            </p>
            <p dir="rtl">
              <span>עמנואל, ש', "ספר אור זרוע: כתבי יד, אגדות, מהדורות", </span>
              <span>
                עלי ספר, ל-לא [שם לשמואל: מחקרים בתולדות הספר העברי לזכרו של ר' שמואל אשכנזי] (תשפ"א), עמ' 113-83
              </span>
            </p>
            <p dir="rtl">
              <span>
                עסיס, מ', אוצר לשונות ירושלמיים: מונחים, ביטויים ולשונות בפיהם של האמוראים בתלמוד הירושלמי, א-ג, ניו
                יורק וירושלים תש"ע &nbsp;{' '}
              </span>
            </p>
            <p dir="rtl">
              <span>פינצ'וק, מ', "מאגרי מידע לתלמוד הירושלמי", עלי ספר כב (תשע"ב), עמ' 171-165</span>
            </p>
            <p dir="rtl">
              <span>פרנקל, ז', מבוא הירושלמי, ברלין תרפ"ג</span>
            </p>
            <p dir="rtl">
              <span>קוסובסקי, מ', אוצר לשון תלמוד ירושלמי, ירושלים תש"ם-תשס"ד</span>
            </p>
            <p dir="rtl">
              <span>
                שרלו, א', "תולדות הנוסח של התלמוד הירושלמי: עיונים בקטעי הגניזה", תרביץ, פז (תש"ף), עמ' 639-587
              </span>
            </p>
            <p dir="rtl">
              <span>
                שרלו, א', "לא שרידים בלבד: 'גנזי הירושלמי'", ציון, פו (תשפ"א), עמ' 660-631 &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp;{' '}
              </span>
            </p>
            <p>
              <span>Andrews, T. L., "The Third Way: Philology and Critical Edition for a Digital Age", </span>
              <span>Variants</span>
              <span>&nbsp;10 (2012), pp. 61-76</span>
            </p>
            <p>
              <span>Gabler, H. W., "Theorizing the Digital Scholarly Edition", </span>
              <span>Literature Compass</span>
              <span>&nbsp;7/2, (2010), pp. 43–56</span>
            </p>
            <p>
              <span>Milikowsky, Ch., "Further on Editing Rabbinic Texts", </span>
              <span>JQR</span>
              <span>&nbsp;90 (1999), pp. 137-149</span>
            </p>
            <p>
              <span>
                Milikowsky, Ch., "Scholarly Editions of Three Rabbinic Texts – One Critical and Two Digital", in Peter
                Boot, et al., eds.,{' '}
              </span>
              <span>Advances in Digital Scholarly Editing</span>
              <span>, Leiden 2017, pp. 137-146 </span>
            </p>
            <p>
              <span>Rubenstein, J. L., "Some structural patterns of Yerushalmi 'sugyot'", </span>
              <span>The Talmud Yerushalmi and Graeco-Roman Culture III</span>
              <span>&nbsp;(2002), pp. 303-313</span>
            </p>
            <p>
              <span>Schäfer, P., and H. J. Becker, H. J., &nbsp;</span>
              <span>Synopse zum Talmud Yerushalmi</span>
              <span>, Tübingen 1991-2001</span>
            </p>
            <p>
              <span>
                Sokoloff, M., A Dictionary of Jewish Palestinian Aramaic of the Byzantine Period, Ramat Gan 1990
              </span>
            </p>
            <p>
              <span>
                Sperber, D., A Dictionary of Greek and Latin Legal Terms in Rabbinical Liturature, Ramat Gan, 1984
              </span>
            </p>
            <p>
              <span>
                Van Hulle, D., "Modelling a Digital Scholarly Edition for Genetic Criticism: A Rapprochement",{' '}
              </span>
              <span>Variants</span>
              <span>&nbsp;12-13 (2016), pp. 34-56</span>
            </p>
            <p dir="rtl">
              <span></span>
            </p>
            <p dir="rtl">
              <span></span>
            </p>
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default IntroductionPage;
