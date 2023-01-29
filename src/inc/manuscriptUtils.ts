import { iManuscript, iManuscriptPopup } from '../types/types';

export const getManuscript = (manuscripts: iManuscript[], sublineData: iManuscriptPopup): iManuscript | undefined => {
  return (
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.fromLine < sublineData?.line &&
        manuscript?.toLine > sublineData?.line
    ) ||
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.toLine === sublineData?.line &&
        manuscript?.toSubline >= sublineData?.subline?.index
    ) ||
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.fromLine === sublineData?.line &&
        manuscript?.fromSubline <= sublineData?.subline?.index
    )
  );
};
