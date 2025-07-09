import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import DocumentPage from "../screens/document/DocumentPage";
import HomePage from "../screens/home/HomePage";
import ListDocumentsPage from "../screens/ListDocumentsPage";
import { IPdfSignatureProps } from "./IPdfSignatureProps";

const PdfSignature: React.FC<IPdfSignatureProps> = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage {...props} />
        </Route>
        <Route exact path="/list-documents">
          <ListDocumentsPage {...props} />
        </Route>
        <Route path="/document/:fileId">
          <DocumentPage {...props} />
        </Route>
      </Switch>
    </Router>
  );
};

export default PdfSignature;
