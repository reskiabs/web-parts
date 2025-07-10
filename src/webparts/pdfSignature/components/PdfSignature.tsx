import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import DocumentSignerPage from "../screens/document-signer/DocumentSignerPage";
import HomePage from "../screens/home/HomePage";
import ListDocumentsPage from "../screens/list-documents/ListDocumentsPage";
import SignatureAssignment from "../screens/signature-assignment/SignatureAssignment";
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
        <Route exact path="/signature-assignment">
          <SignatureAssignment {...props} />
        </Route>
        <Route exact path="/document-signer">
          <DocumentSignerPage {...props} />
        </Route>
      </Switch>
    </Router>
  );
};

export default PdfSignature;
