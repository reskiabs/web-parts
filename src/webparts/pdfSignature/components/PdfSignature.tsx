import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import DocumentPage from "../screens/document/DocumentPage";
import HomePage from "../screens/HomePage";
import SignedDocuments from "../screens/signed-documents/SignedDocuments";
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
        <Route path="/signed-documents">
          <SignedDocuments {...props} />
        </Route>
      </Switch>
    </Router>
  );
};

export default PdfSignature;
