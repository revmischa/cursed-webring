import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { ViewSiteContext } from "../Context/ViewSiteContext";

const useStyles = makeStyles({
  urlBar: {
    position: "absolute",
    top: 5,
    left: 5,
    margin: "auto auto auto auto",
    backgroundColor: "rgba(1,0.6,1,0.2)",
    color: "purple",
    fontSize: "0.8rem",
    padding: 2,
  },
});

interface IURLBarProps {}

const URLBar = (props: IURLBarProps) => {
  const classes = useStyles();
  const { currentSite } = React.useContext(ViewSiteContext);

  return (
    <React.Fragment>
      {currentSite && (
        <code className={classes.urlBar}>
          <a href={currentSite.url} target="_blank" rel="noreferrer">
            {currentSite?.url}
          </a>
        </code>
      )}
    </React.Fragment>
  );
};

export default URLBar;
