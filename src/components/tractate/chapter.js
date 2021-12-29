import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';


const Chapter = (props) => {
    return (
        <div>
            <Card>
          <CardContent>
            <Typography  color="textSecondary" gutterBottom>
              Word of the Day
            </Typography>

            <Typography  color="textSecondary">
              adjective
            </Typography>
            <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
        </Card>

        </div>
        
      );
}

export default Chapter;