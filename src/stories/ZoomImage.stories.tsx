import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box, Button, ButtonProps, Container } from '@mui/material';
import ZoomImage from '../components/manuscripts/ZoomImage';

export default {
  component: ZoomImage,
  title: 'Talmud/ZoomImage',
  decorators: [
    (Story) => {
      return (
        <Container>
          <Box 
          style={{
            height: '35rem',
            width: '60rem',
            border: '10px solid red'}}
          m={3}>
            <Story />
          </Box>
        </Container>
      );
    },
  ],
} as Meta;

const Template: Story<ButtonProps> = (args) => {
  return <ZoomImage image="https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg" {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  
};
