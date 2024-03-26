import React, { useEffect, useState } from 'react';
import { ContentEmbeddedAssetBlock } from './types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { localeMap } from '../inc/utils';

interface Props {
  fieldValue: ContentEmbeddedAssetBlock;
  includes: any;
}

const mapStateToProps = (state: any) => ({
  includes: state.contentful.includes,
});

const EmbeddedAssetBlock = (props: Props) => {
  const { fieldValue, includes } = props;
  const [currentLang, setCurrentLang] = useState<string>(localeMap.get(i18next.language) || '');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    i18next.on('languageChanged', function (lng) {
      setCurrentLang(localeMap.get(lng) || '');
    });
  }, []);

  useEffect(() => {
    const id = fieldValue.data.target.sys.id;
    const asset = includes[currentLang][id];
    const file = asset['fields']['file']['url'];
    setImageUrl(file);
  }, [includes, fieldValue, currentLang]);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img style={{ maxWidth: '100%' }} src={imageUrl}></img>
      </div>
    </>
  );
};

export default connect(mapStateToProps)(EmbeddedAssetBlock);
