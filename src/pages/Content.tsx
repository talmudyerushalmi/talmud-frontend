import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';

import { useParams } from 'react-router';
import { routeObject } from '../store/reducers/navigationReducer';
import ContentService from '../services/content.service';
import { Content } from '../content/types';
import ContentField from '../content/ContentField';
import Contentful from '../content/Contentful';

interface Props {
  id: string;
}

const ContentPage = (props: Props) => {
  const { id } = props;
  const [content, setContent] = useState<Content | null>(null);
  useEffect(() => {
    ContentService.GetContent(id).then((c) => {
      console.log(c);
      setContent(c);
    });
    function fetch() {}
  }, []);

  return (
    <Container>
        <Contentful id={id}></Contentful>
    </Container>
  );
};

export default ContentPage;
