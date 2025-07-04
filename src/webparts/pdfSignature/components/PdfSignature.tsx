import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import HomePage from "../screens/HomePage";
import DocumentPage from "../screens/document/DocumentPage";
import { IPdfSignatureProps } from "./IPdfSignatureProps";

const PdfSignature: React.FC<IPdfSignatureProps> = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage {...props} />
        </Route>
        <Route path="/document/:fileId">
          <DocumentPage {...props} />
        </Route>
      </Switch>
    </Router>
  );
};

export default PdfSignature;
