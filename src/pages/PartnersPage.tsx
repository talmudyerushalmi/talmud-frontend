import React from "react";
import { Container } from "@mui/material";

const PartnersPage = (props) => {
  return (
    <>
      <Container style={{ textAlign: "center" }}>
        <h1>Partners</h1>
        <div dir="ltr">
          <p>
            Shlomo Goren Chair for the Study of the Talmud Yerushalmi, Bar-Ilan
            University
          </p>
          <p>
            DICTA Analytical tools for Hebrew texts (Prof. Moshe Koppel. Dr. Avi
            Shmidman)
          </p>
          <p>Yad Harav Herzog: Institute for the Complete Israeli Talmud</p>
        </div>

        <p>בשיתוף פעולה עם:</p>
        <p>
          הקתדרה לחקר התלמוד הירושלמי ע"ש מרן הרב הראשי אלוף הרב שלמה גורן זצ"ל,
          אוניברסיטת בר-אילן
        </p>
        <p>DICTA כלים דיגיטליים לעיבוד טקסטים עבריים</p>
        <p>יד הרב הרצוג: מכון התלמוד הישראלי השלם</p>
      </Container>
    </>
  );
};

export default PartnersPage;
