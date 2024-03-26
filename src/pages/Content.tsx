import React from 'react';
import { Container } from '@mui/material';

import Contentful from '../content/Contentful';

interface Props {
  id: string;
}

const ContentPage = (props: Props) => {
  const { id } = props;

  return (
    <Container style={{paddingBottom:'4rem'}}>
      <Contentful id={id}></Contentful>
    </Container>
  );
};

export default ContentPage;
