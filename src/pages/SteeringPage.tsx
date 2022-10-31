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
      <Container>
        <h1 style={{ textAlign: 'center' }}>The Steering Committee Members</h1>
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
      </Container>
    </>
  );
};

export default SteeringPage;
