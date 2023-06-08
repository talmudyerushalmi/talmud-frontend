import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { iManuscript } from './Manuscripts';

export const TitlebarBelowImageList = ()=> {
  return (
    <ImageList cols={1} sx={{ width: 300, height: 450 }}>
      {itemData.map((item) => (
        <a href="https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg">
        <ImageListItem key={item.img}>
          <img
            src={`https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg?w=148&fit=crop&auto=format`}
            srcSet={`https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg?w=148&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={<span>by: {item.author}</span>}
            position="below"
          />
        </ImageListItem>
        </a>
      ))}
    </ImageList>
  );
}

interface ImagesProps {
    manuscripts: iManuscript[]
  }
export const TitlebarBelowImageList2 = (props: ImagesProps)=> {
    return (
      <ImageList cols={1} sx={{ width: 300, height: 450 }}>
        {itemData.map((item) => (
          <a href="https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg">
          <ImageListItem key={item.img}>
            <img
              src={`https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg?w=148&fit=crop&auto=format`}
              srcSet={`https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg?w=148&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              position="below"
            />
          </ImageListItem>
          </a>
        ))}
      </ImageList>
    );
  }

const itemData = [
  {
    img: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r_thumbnail.jpg',
    title: 'Breakfast',
    author: '@bkristastucchio',
  },
  {
    img: 'https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
  },
];
