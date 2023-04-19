import React, { useEffect } from 'react';
import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TagManager from 'react-gtm-module';
import haifaImg from '../assets/haifa_uni.png';
import scienceImg from '../assets/science.png';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  panel: {
    '&.MuiPaper-root': {
      //  backgroundColor: '#3f51b5',
      //   color: 'white',
      padding: '1rem',
      marginBottom: '1rem',
    },
  },
}));

interface PanelProps {
  title: string;
  secondaryTitle: string;
  items: item[];
}

interface item {
  time: string;
  break?: boolean;
  eventTitle: string;
  speakers: Speaker[];
}

const Panel = (props: PanelProps) => {
  const { title, secondaryTitle, items } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.panel} style={{ marginBottom: '3rem' }}>
      <h2>{title}</h2>
      <h3>{secondaryTitle}</h3>
      {items.map((item) => {
        const title = item.time ? `${item.time}  ${item.eventTitle}` : `${item.eventTitle}`;
        return (
          <>
            {item.break ? <Divider></Divider> : null}
            <h4 style={{ direction: 'ltr' }}>{title}</h4>
            <Speakers speakers={item.speakers} />
            {item.break ? <Divider></Divider> : null}
          </>
        );
      })}
    </Paper>
  );
};

interface Speaker {
  speaker: string;
  title?: string;
}
interface SpeakersProps {
  speakers: Speaker[];
}

const Speakers = (props: SpeakersProps) => {
  const { speakers } = props;
  console.log('speakers ', speakers);
  if (speakers.length === 0 || !speakers) {
    return null;
  }

  return (
    <ul style={{ direction: 'ltr' }}>
      {speakers.map((speaker) => (
        <li>{speaker.title ? `${speaker.speaker}: ${speaker.title}` : speaker.speaker}</li>
      ))}
    </ul>
  );
};

const Workshop2023Page = (props) => {
  const classes = useStyles();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        pagePath: window.location.href,
        pageTitle: 'introduction',
      },
    });
  }, []);
  return (
    <>
      <Container sx={{ textAlign: 'right' }}>
        <Paper sx={{
              marginBottom: '2rem'
        }}>
          <Box
            display="flex"
            sx={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              height: '14rem',
            }}>
            <img src={haifaImg} height="150" alt="haifa_uni" />
            <Box sx={{ margin: '2rem 0', padding: '1rem' , textAlign:'center'}}>
              <Typography variant="h1" align="center" >
                Editions of Classical Jewish Literature in the Digital Era
              </Typography>
              <Typography>Research Workshop of the Israel Science Foundation</Typography>
              <Typography>University of Haifa, June 18-20, 2023</Typography>
            </Box>

            <img src={scienceImg} height="150" alt="Israel Science Foundation" />
          </Box>
        </Paper>
        <Panel
          title="Sunday, June 18"
          secondaryTitle="Rabin Observatory, Rabin Building"
          items={[
            {
              time: '9:00-9:30',
              eventTitle: 'Coffee and Registration',
              speakers: [],
            },
            {
              time: '9:30-10:30',
              eventTitle: 'Opening Remarks',
              speakers: [{ speaker: 'Efraim Lev' }, { speaker: 'Hillel Newman' }],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '11:00-11:45',
              eventTitle: 'Sofer Stam: Special Session [he]',
              speakers: [
                { speaker: 'Moshe Lavee' },
                { speaker: 'Shmuel Londner' },
                { speaker: 'Hadar Miller' },
                { speaker: 'Yoav Phillips' },
              ],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '12:00-13:00',
              eventTitle: 'Open Discussion: Between Classical and Digital Editions of Jewish Literature',
              speakers: [{ speaker: 'Chair', title: 'Menachem Katz' }],
            },
            {
              time: '13:00-14:00',
              break: true,
              eventTitle: 'Lunch',
              speakers: [],
            },
            {
              time: '14:15-15:45',
              eventTitle: 'Digitizing Jewish Texts and Jewish Culture',
              speakers: [
                {
                  speaker: 'Avriel Bar Levav',
                  title: 'Textual Intimacy in a Digital Age: An Ecology of Digital Texts in Jewish Culture',
                },
                {
                  speaker: 'Lilac Torgeman',
                  title: `Archival Research in Digital Humanities through Software Development: A Case Study of 'Casebook' [he]`,
                },
                {
                  speaker: 'Ivana Yael Nepalová',
                  title: `Tracing Holocaust-era Looted Jewish Books in Czech Libraries: Provenance Research and Digitization`,
                },
              ],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '16:00-17:30',
              eventTitle: 'Editions of Medieval Works',
              speakers: [
                { speaker: 'Pinchas Roth', title: 'In the Margins: Editing Medieval Rabbinic Responsa' },
                {
                  speaker: 'Mayer Lichtenstein',
                  title: `Mishne Torah: Towards an Edition That Reflects Editions [he]`,
                },
                {
                  speaker: `Doron Ya'akov`,
                  title: `Mishne Torah – The Historical Dictionary Project of the Hebrew Language [he]`,
                },
              ],
            },
          ]}
        />

        <Panel
          title="Monday, June 19"
          secondaryTitle="Room 165"
          items={[
            {
              time: '9:00-9:30',
              eventTitle: 'Coffee and Registration',
              speakers: [],
            },
            {
              time: '9:30-11:00',
              eventTitle: 'Digital Resources',
              speakers: [
                {
                  speaker: 'Ezra Brand',
                  title: `An Overview of Digital Resources for the Scholarly Study of Rabbinic Texts`,
                },
                { speaker: 'Hillel Novetsky', title: `The Vision of 'Al Hatorah'` },
                { speaker: `Ya'akov Leufer`, title: `The Vocalized Talmud: The Challenges [he]` },
              ],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '11:30-13:00',
              eventTitle: 'Talmudic Editions and Philology',
              speakers: [
                {
                  speaker: 'Adiel Schremer and Binyamin Katzoff',
                  title: `Methodological Considerations Preparing Tosefta Neziqin Edition`,
                },
                { speaker: 'Richard Hidary', title: `A Model for a Digital Talmud Text and Intertextual Commentary` },
                { speaker: 'Hector Patmore', title: `Philology: New Solutions to Old Problems` },
              ],
            },
            {
              time: '13:00-14:00',
              break: true,
              eventTitle: 'Lunch',
              speakers: [],
            },
            {
              time: '14:15-15:30',
              eventTitle: 'Round Table (1): What Should a Rabbinic Digital Edition Look Like?',
              speakers: [
                { speaker: 'Chair', title: 'Shira Shmidman' },
                { speaker: 'Shlomi Efrati, David Fialkoff, Shlomi Tsemach [he]' },
              ],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '16:00-17:30',
              eventTitle: 'Old Manuscripts and New Possibilities',
              speakers: [
                {
                  speaker: 'Jakub Zbrzeżny',
                  title: 'Digitized Patristic Manuscripts as Sources of Earlier Jewish Texts: Maccabees I and Eusebius',
                },
                {
                  speaker: 'Bill Rebiger and Marcus Pöckelmann',
                  title: `The First Scholarly Edition of the Kabbalistic Treatise Keter Shem Tov`,
                },
                {
                  speaker: 'Maximilian de Molière',
                  title: `Showcasing the Features of the Collation Tool LERA for Scholarly Editing Hebrew Texts. Case Study: Keter Shem Ṭov`,
                },
              ],
            },
            {
              time: '18:00-20:00',
              break: true,
              eventTitle: 'Dinner',
              speakers: [],
            },
          ]}
        />

        <Panel
          title="Tuesday, June 20"
          secondaryTitle="Aviva and Sammy Ofer Observation Gallery, Eshkol Tower"
          items={[
            {
              time: '9:00-9:30',
              eventTitle: 'Coffee and Registration',
              speakers: [],
            },
            {
              time: '9:30-11:00',
              eventTitle: 'The Babylonian Talmud',
              speakers: [
                {
                  speaker: 'Jonathan Milgram',
                  title: `Between Memra and Stam: On the Role of Memory in the Transmission of Statements in the Babylonian Talmud`,
                },
                {
                  speaker: 'Shai Secunda',
                  title: `Sea of Babylon: Mapping Non-Mishnaic “Digressions” in the Babylonian Talmud`,
                },
                {
                  speaker: `Hillel Gershuni`,
                  title: `Hachi Garsinan and Beyond: Has the Time Come for a Critical Edition of the Babylonian Talmud?`,
                },
              ],
            },
            {
              time: '',
              break: true,
              eventTitle: 'Coffee Break',
              speakers: [],
            },
            {
              time: '11:30-13:00',
              eventTitle: 'Digital Tools and Digital Editions',
              speakers: [
                { speaker: 'Nachum Dershowitz', title: `Computational Paleography` },
                {
                  speaker: 'Daniel Stoekl Ben Ezra and Hayim Lapin',
                  title: `Towards a Pipeline From eScriptorium to a Critical Edition for Rabbinic Texts`,
                },
                {
                  speaker: 'Avi Shmidman',
                  title: `Abbreviation Expansion in Digital Editions: from TEI to Neural Networks`,
                },
              ],
            },
            {
              time: '13:00-14:00',
              break: true,
              eventTitle: 'Lunch',
              speakers: [],
            },
            {
              time: '14:30-15:30',
              eventTitle: 'Round Table (2): Ancient Texts in the Digital Era – Concluding Thoughts',
              speakers: [{ speaker: 'Menachem Katz, Hillel Gershuni, Vered Raziel-Kretzmer, Avi Shmidman [he]' }],
            },
          ]}
        />
        <br></br>
      </Container>
    </>
  );
};

export default Workshop2023Page;
