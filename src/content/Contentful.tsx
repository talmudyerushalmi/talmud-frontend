import React, { useEffect, useState } from 'react';
import ContentService from '../services/content.service';
import { Content } from '../content/types';
import ContentField from '../content/ContentField';

interface Props {
  id: string
}

const Contentful = (props: Props) => {
  const { id } = props
  const [content, setContent] = useState<Content | null>(null);
  useEffect(() => {
    ContentService.GetContent(id).then((c) => {
      console.log(c);
      setContent(c);
    });
    function fetch() {}
  }, []);

  return (
    <>
      {content?.fields
        ? Object.entries(content.fields).map(([k, v]) => {
            return <ContentField key={k} fieldName={k} fieldValue={v} />;
          })
        : null}
    </>
  );
};

export default Contentful;
