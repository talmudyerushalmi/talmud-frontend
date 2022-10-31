import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ZoomImage from '../components/manuscripts/ZoomImage';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Talmud/ZoomImage',
  component: ZoomImage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ZoomImage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ZoomImage> = (args) => <ZoomImage {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  image: "https://assets.talmudyerushalmi.com/manuscripts/venice/0303_FL77977460.jpg",
};

