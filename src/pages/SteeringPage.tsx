import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import TagManager from 'react-gtm-module';

const SteeringPage = (props) => {
  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'page_view',
        pagePath: window.location.href,
        pageTitle: 'steering-page',
      },
    });
  }, []);
  return (
    <>
      <Container dir="ltr">
        <h2>The Steering Committee Members</h2>
        <div dir="ltr">
          <ul>
            <li>Prof. Moscovitz Leib, Bar-Ilan University - Chair</li>
            <li>Prof. Amir Amihood, Bar-Ilan University</li>
            <li>Rabbi Dr. Lichtenstein Meir, Herzog College</li>
            <li>Prof. Lubotzky Alexander, The Hebrew University of Jerusalem</li>
            <li>Prof. Morgenstern Matthias, Universität Tübingen</li>
            <li>Prof. Naeh Shlomo, The Hebrew University of Jerusalem</li>
            <li>Prof. Noam Vered, Tel Aviv University</li>
            <li>Prof. Ofer Yosef, Bar-Ilan University</li>
            <li>Prof. Olszowy-Schlanger Judith, University of Oxford</li>
            <li>Prof. Reiner Avraham (Rami), Ben-Gurion University of the Negev</li>
            <li>Prof. Sabato Mordechai, Bar-Ilan University</li>
            <li>Prof. Vishne Uzi, Bar-Ilan University</li>
          </ul>
        </div>
        <h2>Research Fellows</h2>
        <div dir="ltr">
        <h3>Senior Fellows</h3>
        <p>Dr. Emmanuel Mastey, Dr. Chanoch Gamliel, Dr. Shira Shmidman</p>
        <h3>Research Fellows</h3>
        <p>Daniel Caine, Or Liber</p>
        <h2>Partners</h2>
        <p>Shlomo Goren Chair for the Study of the Talmud Yerushalmi, Bar-Ilan University</p>
          
        </div>
      </Container>
    </>
  );
};

export default SteeringPage;
