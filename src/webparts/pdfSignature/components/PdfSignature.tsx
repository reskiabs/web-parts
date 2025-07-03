import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom"; // ← Ganti ke HashRouter
import { IPdfSignatureProps } from "./IPdfSignatureProps";
import DocumentPage from "./screens/DocumentPage";
import HomePage from "./screens/HomePage";

const PdfSignature: React.FC<IPdfSignatureProps> = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage {...props} />
        </Route>
        <Route path="/document">
          <DocumentPage {...props} />
        </Route>
      </Switch>
    </Router>
  );
};

export default PdfSignature;
