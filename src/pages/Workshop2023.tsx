import React, { useEffect } from 'react';
import { Box, Button, Container, Divider, Link, Paper, Typography } from '@mui/material';
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
  speakers: SpeakerProps[];
}

const Panel = (props: PanelProps) => {
  const { title, secondaryTitle, items } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.panel} style={{ marginBottom: '3rem' }}>
      <h2>{title}</h2>
      <h3>{secondaryTitle}</h3>
      {items.map((item, index) => {
        const title = item.time ? `${item.time}  ${item.eventTitle}` : `${item.eventTitle}`;
        return (
          <div key={index}>
            {item.break ? <Divider></Divider> : null}
            <h4 style={{ direction: 'ltr' }}>{title}</h4>
            <Speakers speakers={item.speakers} />
            {item.break ? <Divider></Divider> : null}
          </div>
        );
      })}
    </Paper>
  );
};

interface SpeakerProps {
  speaker: string;
  title?: string;
  academy?: string;
  boldTitle?: boolean;
  chair?: boolean;
}
interface SpeakersProps {
  speakers: SpeakerProps[];
}

const Speakers = (props: SpeakersProps) => {
  const { speakers } = props;
  if (speakers.length === 0 || !speakers) {
    return null;
  }

  return (
    <ul style={{ direction: 'ltr' }}>
      {speakers.map((speaker, index) => {
        return (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            <Speaker {...speaker} />
          </li>
        );
      })}
    </ul>
  );
};

const Speaker = (props: SpeakerProps) => {
  const { speaker, title, academy, boldTitle, chair } = props;
  const academyTag = academy ? <span> ({academy})</span> : null;
  const speakerTag = (
    <span>
      <strong>{speaker}</strong>
      {academyTag}
    </span>
  );
  const titleTag = title ? <span>{title}</span> : null;

  if (chair) {
    return (
      <div>
        <span>Chair: </span> {speakerTag}
      </div>
    );
  }
  return (
    <div>
      <div>
        <strong>{speaker}</strong>
        {academyTag}
      </div>
      {titleTag}
    </div>
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
        <Paper
          sx={{
            marginBottom: '2rem',
          }}>
          <Box
            display="flex"
            sx={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
            }}>
            <img src={haifaImg} style={{ padding: '1rem' }} height="150" alt="haifa_uni" />
            <Box sx={{ margin: '0rem 0', padding: '1rem', textAlign: 'center' }}>
              <Typography variant="h1" align="center">
                Editions of Classical Jewish Literature in the Digital Era
              </Typography>
              <Typography>Research Workshop of the Israel Science Foundation</Typography>
              <Typography>University of Haifa, June 18-20, 2023</Typography>
              <div style={{ margin: '0.5rem' }}>
                <Link href="https://drive.google.com/file/d/1aBOIwgTB6d96DFndNKsB73e8yvaIhL0N/view" target="_blank">
                  Abstracts and Biographies
                </Link>
              </div>

              <Button
                sx={{ margin: '1rem' }}
                variant="contained"
                onClick={() => {
                  window.open('https://forms.gle/MKzaJ6QJ3CFhM2SH6', '_blank');
                }}>
                Free Registration Here
              </Button>
            </Box>

            <img src={scienceImg} height="150" alt="Israel Science Foundation" />
          </Box>
        </Paper>
        <Panel
          title="Sunday, June 18"
          secondaryTitle="Rabin Observatory, Rabin Building"
          items={[
            {
              time: '11:30-12:00',
              eventTitle: 'Coffee and Registration',
              speakers: [],
            },
            {
              time: '12:00-12:10',
              eventTitle: 'Greetings',
              speakers: [{ speaker: 'Efraim Lev', academy: 'Dean of the Faculty of Humanities' }],
            },
            {
              time: '12:10-13:00',
              eventTitle: 'Open Discussion: Between Classical and Digital Editions of Jewish Literature',
              speakers: [{ chair: true, speaker: 'Menachem Katz', academy: 'University of Haifa', boldTitle: true }],
            },
            {
              time: '13:00-14:00',
              break: true,
              eventTitle: 'Lunch',
              speakers: [],
            },
            {
              time: '14:15-16:15',
              eventTitle: 'Digitizing Jewish Texts and Jewish Culture',
              speakers: [
                {
                  speaker: 'Jakub Zbrzezny',
                  academy: 'University of Aberdeen, UK',
                  title:
                    'Digitized Medieval Patristic Manuscripts as a Source of New Witnesses to Ancient Jewish Literature: the Case of Eusebius of Caesarea and the First Book of Maccabees',
                },
                {
                  speaker: 'Avriel Bar-Levav',
                  academy: 'The Open University of Israel',
                  title: 'Textual Intimacy in a Digital Age: An Ecology of Digital Texts in Jewish Culture',
                },
                {
                  speaker: 'Lilac Torgeman',
                  academy: 'University of Haifa',
                  title: `Archival Research in Digital Humanities through Software Development: A Case Study of 'Casebook' [he]`,
                },
                {
                  speaker: 'Ivana Yael Nepalová',
                  academy: 'Institute of Art History of the Czech Academy of Sciences',
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
              time: '16:30-18:00',
              eventTitle: 'Editions of Medieval Works',
              speakers: [
                { chair: true, speaker: 'Rachel Furst', academy: 'University of Haifa', boldTitle: true },
                {
                  speaker: 'Pinchas Roth',
                  academy: 'Bar-Ilan University',
                  title: 'In the Margins: Editing Medieval Rabbinic Responsa',
                },
                {
                  speaker: 'Mayer Lichtenstein',
                  academy: 'Herzog Academic College',
                  title: `Mishne Torah: Towards an Edition That Reflects Editions [he]`,
                },
                {
                  speaker: `Doron Ya'akov`,
                  academy: 'The Academy of the Hebrew Language',
                  title: `Mishne Torah – The Historical Dictionary Project of the Hebrew Language [he]`,
                },
              ],
            },
          ]}
        />

        <Panel
          title="Monday, June 19"
          secondaryTitle="Aviva and Sammy Ofer Observation Gallery, Eshkol Tower"
          items={[
            {
              time: '9:00-9:30',
              eventTitle: 'Coffee',
              speakers: [],
            },
            {
              time: '9:30-11:00',
              eventTitle: 'Digital Resources',
              speakers: [
                { chair: true, speaker: 'Hillel Gershuni', academy: 'University of Haifa', boldTitle: true },
                {
                  speaker: 'Ezra Brand',
                  title: `An Overview of Digital Resources for the Scholarly Study of Rabbinic Texts`,
                },
                { speaker: 'Hillel Novetsky', academy: 'Al HaTorah', title: `The Vision of 'Al Hatorah'` },
                { speaker: `Ya'akov Leufer`, academy: 'Dicta', title: `The Vocalized Talmud: The Challenges [he]` },
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
                  chair: true,
                  speaker: 'Avraham Yoskovich',
                  academy: 'University of Haifa and Ben-Gurion University',
                  boldTitle: true,
                },
                {
                  speaker: 'Adiel Schremer and Binyamin Katzoff',
                  academy: 'Bar-Ilan University',
                  title: `Methodological Considerations Preparing Tosefta Neziqin Edition [he]`,
                },
                {
                  speaker: 'Richard Hidary',
                  academy: 'Yeshiva University, New York',
                  title: `A Model for a Digital Talmud Text and Intertextual Commentary`,
                },
                {
                  speaker: 'Hector Patmore',
                  academy: 'KU Leuven, Belgium',
                  title: `Philology: New Solutions to Old Problems`,
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
              time: '14:15-15:30',
              eventTitle: 'Round Table (1): What Should a Rabbinic Digital Edition Look Like?',
              speakers: [
                { chair: true, speaker: 'Shira Shmidman', boldTitle: true },
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
              eventTitle: 'Digital Editions of Kabbalistic Writings',
              speakers: [
                {
                  speaker: 'Bill Rebiger',
                  academy: 'Martin Luther University Halle-Wittenberg, Germany',
                  title: `Constructing Texts with Modules: The Kabbalistic Treatise 'Keter Shem Ṭov' and Related Texts as a Challenge for Digital Editions`,
                },
                {
                  speaker: 'Marcus Pöckelmann',
                  academy: 'Martin Luther University Halle-Wittenberg, Germany',
                  title: `Showcasing the Features of the Collation Tool LERA for Scholarly Editing Hebrew Texts. Case Study: Keter Shem Ṭov`,
                },
                {
                  speaker: 'Maximilian de Molière',
                  academy: 'Martin Luther University Halle-Wittenberg, Germany',
                  title: `The Correspondence of R. Moses Zacuto: an Online Edition`,
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
              time: '9:00-9:15',
              eventTitle: 'Coffee',
              speakers: [],
            },
            {
              time: '9:15-11:15',
              eventTitle: 'The Babylonian Talmud',
              speakers: [
                { chair: true, speaker: 'Menachem Katz', academy: 'University of Haifa', boldTitle: true },
                {
                  speaker: 'Jonathan Milgram',
                  academy: 'The Jewish Theological Seminary, New York',
                  title: `Between Memra and Stam: On the Role of Memory in the Transmission of Statements in the Babylonian Talmud`,
                },
                {
                  speaker: 'Shai Secunda',
                  academy: 'Bard College, New York, and Wissenschaftskolleg, Berlin',
                  title: `Sea of Babylon: Mapping Non-Mishnaic “Digressions” in the Babylonian Talmud`,
                },
                {
                  speaker: `Aharon (Roni) Shweka`,
                  academy: 'Bar-Ilan University',
                  title: ` Collating the Talmud: Perspectives on the Hachi Garsinan Project`,
                },
                {
                  speaker: `Hillel Gershuni`,
                  academy: 'University of Haifa',
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
                { speaker: 'Nachum Dershowitz', academy: 'Tel Aviv University', title: `Computational Paleography` },
                {
                  speaker: 'Daniel Stoekl Ben Ezra and Hayim Lapin',
                  academy: 'École Pratique des Hautes Études, Paris / University of Maryland',
                  title: `Towards a Pipeline From eScriptorium to a Critical Edition for Rabbinic Texts`,
                },
                {
                  speaker: 'Avi Shmidman',
                  academy: 'Bar-Ilan University and Dicta',
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
              time: '14:15-15:30',
              eventTitle: 'Round Table (2): Ancient Texts in the Digital Era – Concluding Thoughts',
              speakers: [
                { chair: true, speaker: 'Gila Prebor', academy: 'Bar-Ilan University', boldTitle: true },
                { speaker: 'Menachem Katz, Hillel Gershuni, Vered Raziel-Kretzmer, Avi Shmidman [he]' },
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
              eventTitle: 'Sofer Stam: Special Session',
              break: true,
              speakers: [
                {
                  chair: true,
                  speaker: 'Moshe Lavee',
                  academy: 'University of Haifa',
                  boldTitle: true,
                },
                {
                  speaker: 'Hadar Miller',
                  academy: 'University of Haifa',
                  title: 'Applying Text Reuse Detection in the Preparation of Digital Edition',
                },
                {
                  speaker: 'Samuel Londnder',
                  title: 'Methods for Improving Automatic Transcription of Manuscripts',
                  academy: 'Tel Aviv University',
                },
                {
                  speaker: 'Yoav Phillips',
                  academy: 'University of Haifa',
                  title: 'Expanding Text Reuse Detection and Automatic Transcription from Judeo Arabic to Arabic',
                },
              ],
            },
          ]}
        />
        <br></br>
      </Container>
    </>
  );
};

export default Workshop2023Page;
