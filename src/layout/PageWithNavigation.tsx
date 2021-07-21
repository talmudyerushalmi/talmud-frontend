import { Box, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ChooseMishnaBar from "../components/shared/ChooseMishnaBar";

export const PageHeader = (props) => {
  return <Box mb={3}>{props.children}</Box>;
};

export const PageContent = (props) => {
  return <div>{props.children}</div>;
};

interface Props {
  linkPrefix: string;
  children: any;
}
export const PageWithNavigation = (props: Props) => {
  const { linkPrefix } = props;
  const history = useHistory();
  const navigationSelectedHandler = (link) => {
    if (link) {
      const url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}`;
      history.push(url);
    }
  };

  return (
    <Container>
      <Box mb={3}>
        <ChooseMishnaBar onNavigationSelected={navigationSelectedHandler} />
      </Box>
      {props.children}
    </Container>
  );
};
