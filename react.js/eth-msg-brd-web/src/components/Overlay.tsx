import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface Props {
  installed: boolean;
  connected: boolean;
}

const Overlay: React.FC<Props> = ({ installed, connected }) => {
  return (
    <Dialog open={!connected || !installed}>
      <DialogTitle id="alert-dialog-title">
        {!installed && "Please install MetaMask"}
        {installed && !connected && "Please connect your MetaMask wallet"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {!installed &&
            "You need to install MetaMask in order to connect to the Ethereum blockchain on this app."}
          {installed &&
            !connected &&
            "Please connect this app to your MetaMask wallet to continue."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!installed && (
          <Button
            onClick={() => {
              window.open(
                "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
                "_blank"
              );
            }}
          >
            Install
          </Button>
        )}
        {installed && !connected && (
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Overlay;
