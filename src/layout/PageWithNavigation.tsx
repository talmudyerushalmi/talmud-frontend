import { Box, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ChooseMishnaBar from "../components/shared/ChooseMishnaBar";

export const PageHeader = (props) => {
  return <Box mb={3}>{props.children}</Box>;
};

export const PageContent = (props) => {
  return <div>{props.children}</div>;
};

interface iLink {
  tractate: string;
  chapter: string;
  mishna: string;
  line: string;
}
interface Props {
  linkPrefix: string;
  children: any;
  afterNavigateHandler?: Function
}
export const PageWithNavigation = (props: Props) => {
  const { linkPrefix, afterNavigateHandler } = props;
  const history = useHistory();
  let url: string;
  const navigationSelectedHandler = (link: iLink) => {
    if (link && link.line) {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}/${link.line}`;
    } else {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}`;
    }
    history.push(url);
    if (afterNavigateHandler) {
      afterNavigateHandler();
    }
  };

  return (
    <Container style={{paddingBottom:'6rem'}}>
      <Box mb={3}>
        <ChooseMishnaBar onNavigationSelected={navigationSelectedHandler} />
      </Box>
      {props.children}
    </Container>
  );
};
