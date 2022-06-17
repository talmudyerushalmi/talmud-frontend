import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import MainText from "../components/MishnaView/MainText";
import MishnaText from "../components/MishnaView/MishnaText";
import { connect } from "react-redux";
import MishnaViewOptions from "../components/MishnaView/MishnaViewOptions";
import { useParams } from "react-router";
import { getHTMLFromRawContent } from "../inc/editorUtils";
import { iMishna } from "../types/types";
import { routeObject } from "../routes/AdminRoutes";
import PageService, { RichTextsMishnas } from "../services/pageService";
import Spinner from "../components/shared/Spinner";
import { setMishnaViewOptions } from "../store/actions/mishnaViewActions";

const DEFAULT_OPTIONS = {
  showSugiaName: false,
};
const mapStateToProps = (state) => ({
  currentMishna: state.general.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  loading: state.general.loading,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setViewOptions: () => {
    dispatch(setMishnaViewOptions(DEFAULT_OPTIONS));
  },
});

interface Props {
  currentMishna: iMishna;
  getMishna: Function;
  setViewOptions: Function;
}

const ChapterPage = (props: Props) => {
  const { currentMishna, setViewOptions } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const [mishnaiot, setMishnaiot] = useState<iMishna[]>([]);
  const [richTextMishnas, setRichTextMishnas] = useState<RichTextsMishnas[]>([]);
  const [totalMishnaiot, setTotalMishnaiot] = useState<undefined | number>(
    undefined
  );
  const [isFetching, setIsFetching] = useState(false);
  const [mishnaIndex, setMishnaIndex] = useState(1);

  const handleScroll = () => {
    const scrolledPassed70 =
      document.documentElement.offsetHeight * 0.7 <
      window.innerHeight + document.documentElement.scrollTop;
    const cond = !scrolledPassed70 || isFetching;
    if (cond) return;

    if (!totalMishnaiot || mishnaIndex < totalMishnaiot) {
      setIsFetching(true);
      fetchData(mishnaIndex);
    }
  };

  const fetchData = async (i: number, increment = true) => {
    PageService.getChapter(tractate, chapter, i).then((res) => {
      if (increment) {
        setMishnaIndex(mishnaIndex + 1);
        setMishnaiot([...mishnaiot, res.mishnaDocument]);
      } else {
        setMishnaIndex(2);
        setMishnaiot([res.mishnaDocument]);
        setRichTextMishnas(res.richTextsMishnas)
      }

      setIsFetching(false);
      setTotalMishnaiot(res.totalMishnaiot);
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mishnaIndex, mishnaiot, totalMishnaiot, isFetching]);

  useEffect(() => {
    setViewOptions();
    fetchData(mishnaIndex);
  }, []);

  useEffect(() => {
    setIsFetching(false);
    fetchData(1, false);
  }, [mishna, chapter, tractate]);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        md={12}
        sx={{
          ml: 2,
          paddingTop: "0 !important",
          position: "sticky",
          top: "4rem",
          zIndex: 100,
          background: "white",
          boxShadow: "0rem 0rem 1rem 2px #0000005e",
        }}
      >
        <MishnaViewOptions />
      </Grid>
      <Grid item md={12}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12}>
            {richTextMishnas.map((mishna, index) => (
              <MishnaText
                mishna={parseInt(mishna.mishna)}
                html={getHTMLFromRawContent(mishna?.richTextMishna)}
              />
            ))}
          </Grid>
        </Grid>
        {mishnaiot.map((mishna, index) => (
          <>
            <MainText key={index} lines={mishna?.lines} />
          </>
        ))}
        <div style={{ textAlign: "center" }}>
          <Spinner display={isFetching} />
        </div>
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChapterPage);
